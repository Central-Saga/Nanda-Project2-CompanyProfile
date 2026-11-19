"use server";

import { roleSchema } from "@/types/domain";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { loginSchema, changePasswordSchema } from "@/lib/validations/auth";
import { createSessionToken, hashToken } from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";

export interface ActionState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  redirectUrl?: string;
}

export async function loginAction(_prevState: ActionState | null, formData: FormData): Promise<ActionState> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });

  if (!user || !user.isActive || user.deletedAt) {
    return {
      success: false,
      message: "Email atau password salah",
    };
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return {
      success: false,
      message: "Akun terkunci sementara karena percobaan login berulang. Silakan coba nanti.",
    };
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    const failed = await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginCount: user.lockedUntil && user.lockedUntil <= new Date() ? 1 : { increment: 1 } },
    });
    if (failed.failedLoginCount >= 5) {
      await prisma.user.update({ where: { id: user.id }, data: { lockedUntil: new Date(Date.now() + 900000) } });
    }

    return {
      success: false,
      message: "Email atau password salah",
    };
  }

  // Lock the identity while minting the session. A concurrent password replacement
  // either revokes this new session or makes this password snapshot obsolete.
  const token = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM users WHERE id = ${user.id}::uuid FOR UPDATE`;
    const current = await tx.user.findUnique({ where: { id: user.id } });
    if (!current || current.passwordHash !== user.passwordHash || !current.isActive || current.deletedAt || (current.lockedUntil && current.lockedUntil > new Date())) return null;
    const session = await tx.session.create({ data: { userId: user.id, tokenHash: "pending", expiresAt: new Date(Date.now() + 86400000) } });
    const value = await createSessionToken({ userId: user.id, role: roleSchema.parse(user.role.name), sessionId: session.id, mustChangePassword: current.mustChangePassword });
    await tx.session.update({ where: { id: session.id }, data: { tokenHash: hashToken(value) } });
    await tx.user.update({ where: { id: user.id }, data: { failedLoginCount: 0, lockedUntil: null, lastLoginAt: new Date() } });
    await tx.auditLog.create({ data: { userId: user.id, action: "LOGIN", entityType: "User", entityId: user.id } });
    return value;
  });
  if (!token) return { success: false, message: "Email atau password salah" };
  const cookieStore = await cookies();
  cookieStore.set("session_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 86400 });

  if (user.mustChangePassword) {
    return {
      success: true,
      redirectUrl: "/admin/change-password",
    };
  }

  return {
    success: true,
    redirectUrl: "/admin/dashboard",
  };
}

export async function changePasswordAction(_prevState: ActionState | null, formData: FormData): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const rawData = {
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parsed = changePasswordSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { currentPassword, newPassword } = parsed.data;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) {
    return { success: false, message: "User tidak ditemukan" };
  }

  const isCurrentValid = await bcrypt.compare(currentPassword, dbUser.passwordHash);
  if (!isCurrentValid) {
    return {
      success: false,
      errors: {
        currentPassword: ["Password saat ini salah"],
      },
    };
  }

  const newHash = await bcrypt.hash(newPassword, 12);

  // Password update and revocation commit together. Require a fresh login on every device.
  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash, mustChangePassword: false, passwordChangedAt: new Date() },
    });
    await tx.session.updateMany({
      where: { userId: user.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    await tx.auditLog.create({
      data: {
        userId: user.id, action: "UPDATE", entityType: "UserPassword", entityId: user.id,
        newValues: { action: "password_changed" },
      },
    });
  });

  const cookieStore = await cookies();
  cookieStore.delete("session_token");
  revalidatePath("/", "layout");
  return {
    success: true,
    message: "Password berhasil diperbarui. Silakan masuk kembali.",
    redirectUrl: "/admin/login",
  };
}

export async function logoutAction(): Promise<ActionState> {
  const user = await getCurrentUser();
  if (user && user.sessionId) {
    await prisma.session.update({
      where: { id: user.sessionId },
      data: { revokedAt: new Date() },
    });
  }

  const cookieStore = await cookies();
  cookieStore.delete("session_token");

  revalidatePath("/", "layout");
  return {
    success: true,
    redirectUrl: "/admin/login",
  };
}
