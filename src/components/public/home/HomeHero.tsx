import Link from "next/link";
import { getCompany } from "@/lib/company";

export async function HomeHero() {
  const company = await getCompany();
  const tagline = company?.tagline || "Arsitektur Software Modern & Rekayasa Sistem Berkinerja Tinggi";
  const description = company?.aboutShort || "Membangun sistem dan platform digital tangguh untuk bisnis enterprise.";
  return (
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-medium text-zinc-300 backdrop-blur-xl shadow-lg">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.9)]" />
              <span>Rekayasa Perangkat Lunak Skala Enterprise</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              {tagline}
            </h1>

            {/* Description */}
            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
              {description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 pt-4 max-w-md sm:max-w-none mx-auto w-full">
              <Link
                href="/mulai-proyek"
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-sm font-semibold transition-all shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] border border-red-500/30 text-center"
              >
                Mulai Proyek Anda &rarr;
              </Link>
              <Link
                href="/booking"
                className="w-full sm:w-auto px-7 py-3.5 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 border border-white/[0.12] hover:border-white/[0.2] rounded-xl text-sm font-medium transition backdrop-blur-xl text-center"
              >
                Jadwalkan Konsultasi
              </Link>
            </div>

            {/* Glass Stats Bar */}
            <div className="pt-10 grid grid-cols-3 gap-4 max-w-xl mx-auto">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl text-center">
                <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">99.98%</div>
                <div className="text-xs text-zinc-400 mt-1 font-medium">Uptime SLA</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl text-center">
                <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">&lt; 150ms</div>
                <div className="text-xs text-zinc-400 mt-1 font-medium">Latensi Respons</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl text-center">
                <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">100%</div>
                <div className="text-xs text-zinc-400 mt-1 font-medium">Data Terpusat</div>
              </div>
            </div>

          </div>
        </div>
      </section>
  );
}
