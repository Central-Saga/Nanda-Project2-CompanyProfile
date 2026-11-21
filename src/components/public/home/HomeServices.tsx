import { publicTranslations } from "@/lib/translations";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export async function HomeServices() {
  const services = await prisma.service.findMany({ where: { isPublished: true, deletedAt: null }, include: { translations: await publicTranslations() }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }], take: 6 });
  if (!services.length) return null;
  return (
        <section className="py-24 border-b border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-red-500">
                  Kapabilitas Rekayasa
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 tracking-tight">
                  Layanan & Solusi Arsitektur
                </h2>
              </div>
              <Link
                href="/layanan"
                className="text-sm font-medium text-zinc-400 hover:text-white transition"
              >
                Lihat Semua Layanan &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => {
                const trans = service.translations[0];
                return (
                  <div
                    key={service.id}
                    className="p-7 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/[0.18] backdrop-blur-xl transition-all duration-300 flex flex-col justify-between group shadow-xl"
                  >
                    <div className="space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-red-300 transition-colors">
                        {trans?.name || service.slug}
                      </h3>
                      <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">
                        {trans?.summary || "Spesifikasi arsitektur komputasi dan implementasi perangkat lunak berkinerja tinggi."}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-white/[0.06]">
                      <Link
                        href={`/layanan/${service.slug}`}
                        className="text-xs font-semibold text-zinc-300 group-hover:text-white transition flex items-center gap-1.5"
                      >
                        <span>Pelajari Lebih Lanjut</span>
                        <span>&rarr;</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
  );
}
