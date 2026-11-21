import Link from "next/link";

export async function HomeContact() {
  
  return (
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.1] backdrop-blur-2xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/15 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="max-w-2xl space-y-6 relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-400">
                <span>Alur Sistem Terintegrasi</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Konsultasikan Kebutuhan Sistem Perangkat Lunak Anda
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                Kirimkan brief teknis atau tentukan jadwal konsultasi daring langsung melalui formulir terintegrasi kami. Semua kebutuhan terekam aman di sistem internal tanpa risiko tercecer.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/mulai-proyek"
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-sm font-semibold transition shadow-[0_0_25px_rgba(220,38,38,0.4)] border border-red-500/30"
                >
                  Isi Brief Proyek Sekarang
                </Link>
                <Link
                  href="/booking"
                  className="px-6 py-3 bg-white/[0.05] hover:bg-white/[0.09] text-zinc-200 border border-white/[0.12] rounded-xl text-sm font-medium transition backdrop-blur-xl"
                >
                  Jadwalkan Konsultasi Teknis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
