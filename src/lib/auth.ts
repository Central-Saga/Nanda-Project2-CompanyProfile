import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cache } from "react";
import { cookies } from "next/headers";
import { verifySessionToken, hashToken } from "./session";

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  mustChangePassword: boolean;
  sessionId: string;
}

export const getCurrentUser = cache(async (): Promise<AuthenticatedUser | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload || !payload.sessionId || !payload.userId) return null;

  const hashed = hashToken(token);
  const session = await prisma.session.findUnique({
    where: { id: payload.sessionId },
    include: {
      user: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!session) return null;
  if (session.revokedAt || session.expiresAt < new Date()) return null;
  if (session.userId !== payload.userId) return null;
  if (session.tokenHash !== hashed) return null;
  if (!session.user || !session.user.isActive || session.user.deletedAt) return null;

  return {
    id: session.user.id,
    email: session.user.email,
    fullName: session.user.fullName,
    role: session.user.role.name,
    mustChangePassword: session.user.mustChangePassword,
    sessionId: session.id,
  };
});

export async function requireAuth(): Promise<AuthenticatedUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }
  if (user.mustChangePassword) redirect("/admin/change-password");
  return user;
}
