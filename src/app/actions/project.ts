"use server";
import { projectFields, projectTranslation } from "@/lib/content-data";
import { validationFailure } from "@/lib/validation-result";
import { readProjectForm } from "@/lib/form-data";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { projectSchema } from "@/lib/validations/crud";
import { revalidatePath } from "next/cache";
import type { ActionState } from "./auth";

export async function createProjectAction(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAuth();

  const parsed = projectSchema.safeParse(readProjectForm(formData));
  if (!parsed.success) {
    return validationFailure(parsed.error);
  }

  const data = parsed.data;

  const existingSlug = await prisma.project.findUnique({ where: { slug: data.slug } });
  if (existingSlug) {
    return { success: false, errors: { slug: ["Slug sudah digunakan"] } };
  }

  const project = await prisma.project.create({
    data: {
      ...projectFields(data),
      translations: {
        create: {
          locale: "id",
          ...projectTranslation(data),
        },
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "CREATE",
      entityType: "Project",
      entityId: project.id,
      newValues: { slug: data.slug, title: data.title },
    },
  });

  revalidatePath("/portofolio", "layout");
  revalidatePath("/");
  revalidatePath("/admin/portfolio");
  return { success: true, message: "Proyek berhasil ditambahkan", redirectUrl: "/admin/portfolio" };
}

export async function updateProjectAction(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAuth();

  const id = formData.get("id") as string;
  if (!id) return { success: false, message: "ID proyek tidak ditemukan" };

  const parsed = projectSchema.safeParse(readProjectForm(formData));
  if (!parsed.success) {
    return validationFailure(parsed.error);
  }

  const data = parsed.data;

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing || existing.deletedAt) {
    return { success: false, message: "Proyek tidak ditemukan" };
  }

  const slugConflict = await prisma.project.findFirst({
    where: { slug: data.slug, id: { not: id } },
  });
  if (slugConflict) {
    return { success: false, errors: { slug: ["Slug sudah digunakan"] } };
  }

  await prisma.project.update({
    where: { id },
    data: {
      ...projectFields(data),
      translations: {
        upsert: {
          where: { projectId_locale: { projectId: id, locale: "id" } },
          create: {
            locale: "id",
          ...projectTranslation(data),
          },
          update: {
          ...projectTranslation(data),
          },
        },
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "UPDATE",
      entityType: "Project",
      entityId: id,
      newValues: { slug: data.slug, title: data.title },
    },
  });

  revalidatePath("/portofolio", "layout");
  revalidatePath("/");
  revalidatePath("/admin/portfolio");
  return { success: true, message: "Proyek berhasil diperbarui", redirectUrl: "/admin/portfolio" };
}

export async function deleteProjectAction(id: string): Promise<ActionState> {
  const user = await requireAuth();

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, message: "Proyek tidak ditemukan" };
  }

  await prisma.project.update({
    where: { id },
    data: { deletedAt: new Date(), isPublished: false },
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "DELETE",
      entityType: "Project",
      entityId: id,
      newValues: { slug: existing.slug },
    },
  });

  revalidatePath("/portofolio", "layout");
  revalidatePath("/");
  revalidatePath("/admin/portfolio");
  return { success: true, message: "Proyek berhasil dihapus" };
}
