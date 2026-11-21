"use client";
import { useEffect, useRef, useState, type FormHTMLAttributes } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "./ui/ConfirmDialog";
export interface SmartFormProps extends FormHTMLAttributes<HTMLFormElement> {
  pending?: boolean;
  success?: boolean;
}
export function SmartForm({ pending, success, children, ...props }: SmartFormProps) {
  const form = useRef<HTMLFormElement>(null);
  const dirty = useRef(false);
  const submitting = useRef(false);
  const [destination, setDestination] = useState("");
  const router = useRouter();
  useEffect(() => { if (!pending) submitting.current = false; }, [pending]);
  useEffect(() => { if (success) { dirty.current = false; form.current?.reset(); } }, [success]);
  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => { if (dirty.current && !submitting.current) e.preventDefault(); };
    const click = (e: MouseEvent) => {
      const anchor = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!dirty.current || submitting.current || !(anchor instanceof HTMLAnchorElement) || anchor.target === "_blank" || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      if (anchor.origin !== location.origin || anchor.pathname !== location.pathname || anchor.search !== location.search) {
        e.preventDefault(); e.stopPropagation(); setDestination(anchor.href);
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", click, true);
    return () => { window.removeEventListener("beforeunload", beforeUnload); document.removeEventListener("click", click, true); };
  }, []);
  return <><form {...props} ref={form} aria-busy={pending} onChange={() => { dirty.current = true; }}
    onSubmit={(e) => { if (submitting.current) e.preventDefault(); else submitting.current = true; }}>{children}</form>
    <ConfirmDialog open={!!destination} title="Tinggalkan perubahan?" description="Isian yang belum disimpan akan hilang." onCancel={() => setDestination("")}
      onConfirm={() => { dirty.current = false; const url = destination; setDestination(""); if (new URL(url).origin === location.origin) router.push(url); else window.location.assign(url); }} /></>;
}
