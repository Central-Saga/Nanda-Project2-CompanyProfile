"use client";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/locale";
export interface LocaleSwitcherProps { locale: Locale; }
export function LocaleSwitcher({ locale }: LocaleSwitcherProps) {
  const router = useRouter();
  return <label className="text-xs"><span className="sr-only">Bahasa / Language</span><select aria-label="Bahasa / Language" value={locale} className="rounded border border-zinc-700 bg-zinc-950 px-2"
    onChange={(e) => { document.cookie = `locale=${e.target.value}; Path=/; SameSite=Lax; Max-Age=31536000`; router.refresh(); }}><option value="id">ID</option><option value="en">EN</option></select></label>;
}
