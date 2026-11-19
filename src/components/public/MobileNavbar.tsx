"use client";
import { Button } from "@/components/shared/ui/Button";


import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitcher } from "./LocaleSwitcher";
import type { Locale } from "@/lib/locale";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export interface Props {
  brandName: string;
  locale: Locale;
  initialTheme: "dark" | "light";
}

export function MobileNavbar({ brandName, locale, initialTheme }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-black/70 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <Link href="/" onClick={close} className="flex min-w-0 items-center gap-2.5 sm:gap-3 group">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white/[0.03] border border-white/10 group-hover:border-red-500/40 transition shrink-0">
              <Image
                src="/logo.png"
                alt="Logo"
                width={32}
                  height={32}
                className="object-contain p-1"
                priority
              />
            </div>
            <span className="max-w-24 truncate sm:max-w-[200px] xl:max-w-none text-sm font-semibold tracking-tight text-white group-hover:text-zinc-200 transition">
              {brandName}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="/layanan" className="min-h-11 min-w-11 shrink-0 hover:text-white transition">
              {locale === "en" ? "Services" : "Layanan"}
            </Link>
            <Link href="/portofolio" className="min-h-11 min-w-11 shrink-0 hover:text-white transition">
              {locale === "en" ? "Portfolio" : "Portofolio"}
            </Link>
            <Link href="/blog" className="min-h-11 min-w-11 shrink-0 hover:text-white transition">
              {locale === "en" ? "Insights" : "Wawasan"}
            </Link>
            <Link href="/karier" className="min-h-11 min-w-11 shrink-0 hover:text-white transition">
              {locale === "en" ? "Careers" : "Karier"}
            </Link>
            <Link href="/kontak" className="min-h-11 min-w-11 shrink-0 hover:text-white transition">
              {locale === "en" ? "Contact" : "Kontak"}
            </Link>
          </nav>

          {/* Actions & Hamburger Toggle */}
          <div className="flex items-center gap-3">
            <ThemeToggle initialTheme={initialTheme} />
            <LocaleSwitcher locale={locale} />
            <Link
              href="/mulai-proyek"
              className="hidden sm:inline-flex px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs sm:text-sm font-medium transition shadow-[0_0_20px_rgba(220,38,38,0.35)] border border-red-500/30"
            >
              Mulai Proyek
            </Link>

            {/* Mobile Hamburger Button */}
            <Button
              onClick={toggle}
              aria-label="Menu Navigasi"
              aria-expanded={isOpen}
              className="xl:hidden w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/[0.1] transition"
            >
              {isOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {isOpen && (
          <div className="xl:hidden border-t border-white/[0.08] bg-black/95 backdrop-blur-2xl px-4 py-6 space-y-4 animate-in fade-in duration-200">
            <nav className="flex flex-col space-y-1">
              <Link
                href="/layanan"
                onClick={close}
                className="px-3.5 py-3 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] transition flex items-center justify-between"
              >
                <span>{locale === "en" ? "Services & Solutions" : "Layanan & Solusi"}</span>
                <span className="text-zinc-600">&rarr;</span>
              </Link>
              <Link
                href="/portofolio"
                onClick={close}
                className="px-3.5 py-3 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] transition flex items-center justify-between"
              >
                <span>{locale === "en" ? "Portfolio & Track Record" : "Portofolio & Rekam Jejak"}</span>
                <span className="text-zinc-600">&rarr;</span>
              </Link>
              <Link
                href="/blog"
                onClick={close}
                className="px-3.5 py-3 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] transition flex items-center justify-between"
              >
                <span>{locale === "en" ? "Insights & Research" : "Wawasan & Riset"}</span>
                <span className="text-zinc-600">&rarr;</span>
              </Link>
              <Link
                href="/karier"
                onClick={close}
                className="px-3.5 py-3 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] transition flex items-center justify-between"
              >
                <span>{locale === "en" ? "Careers" : "Peluang Karir"}</span>
                <span className="text-zinc-600">&rarr;</span>
              </Link>
              <Link
                href="/kontak"
                onClick={close}
                className="px-3.5 py-3 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] transition flex items-center justify-between"
              >
                <span>{locale === "en" ? "Contact & Location" : "Kontak & Lokasi"}</span>
                <span className="text-zinc-600">&rarr;</span>
              </Link>
            </nav>

            <div className="pt-2 border-t border-white/[0.08] flex flex-col gap-2.5">
              <Link
                href="/mulai-proyek"
                onClick={close}
                className="w-full text-center py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl text-sm font-semibold shadow-lg"
              >
                Mulai Proyek Anda
              </Link>
              <Link
                href="/booking"
                onClick={close}
                className="w-full text-center py-3 bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 border border-white/10 rounded-xl text-sm font-medium"
              >
                Jadwalkan Konsultasi
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
