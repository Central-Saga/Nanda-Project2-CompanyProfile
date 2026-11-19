"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/shared/ui/ConfirmDialog";
import { Button } from "@/components/shared/ui/Button";
export interface DeleteButtonProps {
  id: string;
  label: string;
  action: (id: string) => Promise<{ success: boolean; message?: string; error?: string }>;
}
export function DeleteButton({ id, label, action }: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const remove = () => startTransition(async () => {
    try {
      const result = await action(id);
      if (!result.success) { setError(result.message || result.error || "Gagal menghapus. Silakan coba lagi."); return; }
      setOpen(false); setError(""); router.refresh();
    } catch { setError("Layanan tidak tersedia. Coba hapus kembali."); }
  });
  return <><Button onClick={() => setOpen(true)} disabled={pending} className="text-xs text-red-400">Hapus<span className="sr-only"> {label}</span></Button>
    <ConfirmDialog open={open} title="Hapus data?" description={`Anda akan menghapus ${label}.`} pending={pending} onCancel={() => setOpen(false)} onConfirm={remove} />
    {error && <p role="alert" className="text-sm text-red-300">{error} <Button onClick={() => setOpen(true)}>Coba lagi</Button></p>}</>;
}
