import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { updateCrmStatus } from "@/lib/crm";
import { statusUpdateSchema, leadStatusSchema, bookingStatusSchema } from "@/types/domain";
import { z } from "zod";
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ resource: string; id: string }> }) {
  const requestId = request.headers.get("x-request-id") || undefined;
  const error = (status: number, code: string, message: string, errors?: Record<string, string[]>) => NextResponse.json({ success: false, code, message, errors, requestId }, { status });
  const user = await getCurrentUser();
  if (!user) return error(401, "UNAUTHORIZED", "Silakan masuk kembali.");
  if (user.mustChangePassword || user.role !== "super_admin") return error(403, "FORBIDDEN", "Anda tidak memiliki izin.");
  const { resource, id } = await params;
  if ((resource !== "leads" && resource !== "bookings") || !z.uuid().safeParse(id).success) return error(404, "NOT_FOUND", "Data tidak ditemukan.");
  let raw: unknown;
  try { raw = await request.json(); } catch { return error(422, "VALIDATION", "Format JSON tidak valid."); }
  const parsed = statusUpdateSchema.safeParse(raw);
  if (!parsed.success) return error(422, "VALIDATION", "Periksa status yang dipilih.", parsed.error.flatten().fieldErrors);
  const status = (resource === "leads" ? leadStatusSchema : bookingStatusSchema).safeParse(parsed.data.status);
  if (!status.success) return error(422, "VALIDATION", "Status tidak valid.", { status: ["Pilih status yang tersedia."] });
  try {
    await updateCrmStatus(resource, id, status.data, user.id);
    return NextResponse.json({ success: true, message: "Status berhasil diperbarui." });
  } catch { return error(503, "SERVER", "Status belum tersimpan. Silakan coba lagi."); }
}
