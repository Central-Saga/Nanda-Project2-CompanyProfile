import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { downloadFromStorage } from "@/lib/storage";
import { z } from "zod";
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.mustChangePassword) return new Response("Silakan masuk kembali.", { status: 401 });
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) return new Response("Tidak ditemukan.", { status: 404 });
  const media = await prisma.mediaFile.findFirst({ where: { id, deletedAt: null } });
  if (!media) return new Response("Tidak ditemukan.", { status: 404 });
  try {
    const result = await downloadFromStorage(media.storageKey);
    if (!result.Body) return new Response("Tidak ditemukan.", { status: 404 });
    return new Response(new Uint8Array(await result.Body.transformToByteArray()).buffer, { headers: {
      "Content-Type": media.mimeType, "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(media.originalName)}`,
      "X-Content-Type-Options": "nosniff", "Cache-Control": "private, no-store",
    } });
  } catch { return new Response("Penyimpanan tidak tersedia. Silakan coba lagi.", { status: 503 }); }
}
