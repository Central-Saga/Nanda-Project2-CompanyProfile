"use client";
import { useEffect, useRef } from "react";
import { Button } from "./Button";
export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  pending?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}
export function ConfirmDialog({ open, title, description, pending, onCancel, onConfirm }: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    const previous = document.activeElement;
    dialog.showModal();
    dialog.querySelector<HTMLButtonElement>("button")?.focus();
    return () => { dialog.close(); if (previous instanceof HTMLElement) previous.focus(); };
  }, [open]);
  return <dialog ref={ref} aria-modal="true" aria-labelledby="confirmation-title" aria-describedby="confirmation-description"
    onKeyDown={(event) => {
      if (event.key !== "Tab") return;
      const controls = ref.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]');
      if (!controls?.length) { event.preventDefault(); return; }
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }}
    onCancel={(event) => { event.preventDefault(); if (!pending) onCancel(); }} className="max-w-md rounded-xl border border-zinc-700 bg-zinc-950 p-6 text-zinc-100 backdrop:bg-black/70">
    <h2 id="confirmation-title" className="text-lg font-bold">{title}</h2>
    <p id="confirmation-description" className="my-4 text-sm text-zinc-300">{description}</p>
    <div className="flex justify-end gap-3"><Button disabled={pending} onClick={onCancel}>Batal</Button>
      <Button disabled={pending} onClick={onConfirm} className="bg-red-600 text-white">{pending ? "Memproses…" : "Lanjutkan"}</Button></div>
  </dialog>;
}
