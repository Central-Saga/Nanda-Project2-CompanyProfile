"use client";
import { useRef, useState } from "react";
import { uploadMediaAction, type UploadedMedia } from "@/app/actions/media";
import { Input } from "@/components/shared/ui/Input";
import { Button } from "@/components/shared/ui/Button";
export interface MediaUploaderProps { onUploaded?: (media: UploadedMedia) => void; }
export function MediaUploader({ onUploaded }: MediaUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const selected = useRef<File | null>(null);
  const inProgress = useRef(false);
  async function upload(file: File) {
    if (inProgress.current) return;
    selected.current = file;
    if (file.size > 10 * 1024 * 1024) { setError("Ukuran file melebihi 10MB."); return; }
    inProgress.current = true; setLoading(true); setError(""); setSuccess("");
    try {
      const data = new FormData(); data.set("file", file); data.set("folder", "uploads");
      const result = await uploadMediaAction(data);
      if (!result.success) { setError(result.error); return; }
      setSuccess(`File "${file.name}" berhasil diunggah.`); onUploaded?.(result.data);
    } catch { setError("Layanan belum tersedia. Periksa koneksi dan coba lagi."); }
    finally { inProgress.current = false; setLoading(false); }
  }
  return <div className="space-y-3 rounded-lg border border-dashed border-zinc-700 bg-zinc-950 p-4">
    <label htmlFor="media-file" className="block text-sm">Pilih berkas gambar atau PDF</label>
    <Input id="media-file" type="file" disabled={loading} aria-describedby="media-hint" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }} />
    <p id="media-hint" className="text-xs text-zinc-400">Maksimal 10MB: JPEG, PNG, WEBP, PDF. Unduhan memerlukan sesi admin.</p>
    {loading && <p role="status">Sedang mengunggah…</p>}
    {error && <p role="alert" className="text-sm text-red-300">{error} <Button disabled={loading} onClick={() => { if (selected.current) void upload(selected.current); }}>Coba lagi</Button></p>}
    {success && <p role="status" className="text-sm text-green-300">{success}</p>}
  </div>;
}
