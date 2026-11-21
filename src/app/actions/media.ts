"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { uploadToStorage, deleteFromStorage } from "@/lib/storage";
import crypto from "crypto";

import { MAX_FILE_SIZE, validateMediaContents, createStorageKey } from "@/lib/media-validation";

export interface UploadedMedia {
  id: string;
  url: string;
  key: string;
  originalName: string;
}

export type UploadResult =
  | { success: true; data: UploadedMedia }
  | { success: false; error: string };

export async function uploadMediaAction(formData: FormData): Promise<UploadResult> {
  const user = await requireAuth();
  try {
    const file = formData.get("file");
    const folder = (formData.get("folder") as string) || "general";
    const altText = (formData.get("altText") as string) || "";

    if (!(file instanceof File) || file.size === 0) {
      return { success: false, error: "File tidak ditemukan atau kosong." };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: "Ukuran file melebihi batas maksimal 10MB.",
      };
    }

    const arrayBuffer = await file.arrayBuffer();
    const rawBuffer = Buffer.from(arrayBuffer);

    const detected = await validateMediaContents(rawBuffer, file.type);
    const buffer = detected.buffer;
    const mediaId = crypto.randomUUID();

    // Compute SHA-256 Checksum
    const checksumSha256 = crypto
      .createHash("sha256")
      .update(buffer)
      .digest("hex");

    // Clean filename and make unique key
    const uniqueKey = createStorageKey(folder, detected.extension);

    // Upload to S3/MinIO
    const { key } = await uploadToStorage({
      key: uniqueKey,
      buffer,
      mimeType: detected.mimeType,
    });

    // Save record to MediaFile table
    const media = await prisma.mediaFile.create({
      data: {
        id: mediaId,
        uploadedBy: user.id,
        storageKey: key,
        url: `/api/v1/media/${mediaId}/download`,
        originalName: file.name,
        mimeType: detected.mimeType,
        sizeBytes: buffer.length,
        altText: altText || null,
        folder,
        checksumSha256,
        isPublic: false,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "CREATE",
        entityType: "MediaFile",
        entityId: media.id,
        newValues: {
          originalName: file.name,
          key,
          sizeBytes: buffer.length,
        },
      },
    });

    revalidatePath("/admin/media");

    return {
      success: true,
      data: {
        id: media.id,
        url: media.url,
        key: media.storageKey,
        originalName: media.originalName,
      },
    };
  } catch {
    return {
      success: false,
      error: "Gagal mengunggah file ke media storage.",
    };
  }
}

export async function deleteMediaAction(id: string) {
  const user = await requireAuth();
  try {

    const media = await prisma.mediaFile.findUnique({
      where: { id },
    });

    if (!media) {
      return { success: false, error: "Berkas media tidak ditemukan." };
    }

    // Try deleting from storage
    try {
      await deleteFromStorage(media.storageKey);
    } catch {
      return { success: false, error: "Penyimpanan tidak tersedia. Berkas belum dihapus, silakan coba lagi." };
    }

    // Soft delete or hard delete in DB
    await prisma.mediaFile.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "DELETE",
        entityType: "MediaFile",
        entityId: id,
        oldValues: {
          originalName: media.originalName,
          key: media.storageKey,
        },
      },
    });

    revalidatePath("/admin/media");
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Gagal menghapus berkas media.",
    };
  }
}
