"use server";
import { jobFields, jobTranslation } from "@/lib/content-data";
import { validationFailure } from "@/lib/validation-result";
import { readJobForm } from "@/lib/form-data";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { jobOpeningSchema } from "@/lib/validations/crud";
import { revalidatePath } from "next/cache";
import type { ActionState } from "./auth";

export async function createJobAction(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAuth();

  const parsed = jobOpeningSchema.safeParse(readJobForm(formData));
  if (!parsed.success) {
    return validationFailure(parsed.error);
  }

  const data = parsed.data;

  const existingSlug = await prisma.jobOpening.findUnique({ where: { slug: data.slug } });
  if (existingSlug) {
    return { success: false, errors: { slug: ["Slug sudah digunakan"] } };
  }

  const job = await prisma.jobOpening.create({
    data: {
      ...jobFields(data),
      openedAt: data.status === "open" ? new Date() : null,
      createdBy: user.id,
      translations: {
        create: {
          locale: "id",
          ...jobTranslation(data),
        },
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "CREATE",
      entityType: "JobOpening",
      entityId: job.id,
      newValues: { slug: data.slug, title: data.title },
    },
  });

  revalidatePath("/karier", "layout");
  revalidatePath("/");
  revalidatePath("/admin/careers");
  return { success: true, message: "Lowongan karir berhasil dibuat", redirectUrl: "/admin/careers" };
}

export async function updateJobAction(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAuth();

  const id = formData.get("id") as string;
  if (!id) return { success: false, message: "ID lowongan tidak ditemukan" };

  const parsed = jobOpeningSchema.safeParse(readJobForm(formData));
  if (!parsed.success) {
    return validationFailure(parsed.error);
  }

  const data = parsed.data;

  const existing = await prisma.jobOpening.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, message: "Lowongan tidak ditemukan" };
  }

  const slugConflict = await prisma.jobOpening.findFirst({
    where: { slug: data.slug, id: { not: id } },
  });
  if (slugConflict) {
    return { success: false, errors: { slug: ["Slug sudah digunakan"] } };
  }

  await prisma.jobOpening.update({
    where: { id },
    data: {
      ...jobFields(data),
      openedAt: data.status === "open" && !existing.openedAt ? new Date() : existing.openedAt,
      translations: {
        upsert: {
          where: { jobId_locale: { jobId: id, locale: "id" } },
          create: {
            locale: "id",
          ...jobTranslation(data),
          },
          update: {
          ...jobTranslation(data),
          },
        },
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "UPDATE",
      entityType: "JobOpening",
      entityId: id,
      newValues: { slug: data.slug, title: data.title },
    },
  });

  revalidatePath("/karier", "layout");
  revalidatePath("/");
  revalidatePath("/admin/careers");
  return { success: true, message: "Lowongan karir berhasil diperbarui", redirectUrl: "/admin/careers" };
}

export async function deleteJobAction(id: string): Promise<ActionState> {
  const user = await requireAuth();

  const existing = await prisma.jobOpening.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, message: "Lowongan tidak ditemukan" };
  }

  await prisma.jobOpening.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "DELETE",
      entityType: "JobOpening",
      entityId: id,
      newValues: { slug: existing.slug },
    },
  });

  revalidatePath("/karier", "layout");
  revalidatePath("/");
  revalidatePath("/admin/careers");
  return { success: true, message: "Lowongan karir berhasil dihapus" };
}
