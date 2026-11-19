import Link from "next/link";
import { prisma } from "@/lib/prisma";

export async function HomePortfolio() {
  const projects = await prisma.project.findMany({ where: { isPublished: true, deletedAt: null }, include: { translations: { where: { locale: "id" } } }, orderBy: [{ createdAt: "desc" }, { id: "asc" }], take: 4 });
  if (!projects.length) return null;
  return (
        <section className="py-24 border-b border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-red-500">
                  Studi Kasus
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 tracking-tight">
                  Implementasi & Hasil Nyata
                </h2>
              </div>
              <Link
                href="/portofolio"
                className="text-sm font-medium text-zinc-400 hover:text-white transition"
              >
                Lihat Semua Portofolio &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => {
                const trans = project.translations[0];
                return (
                  <div
                    key={project.id}
                    className="p-8 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/[0.18] backdrop-blur-xl transition-all duration-300 space-y-5 shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-zinc-400">
                        Studi Kasus
                      </span>
                      {project.isFeatured && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                          Unggulan
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-white">
                      {trans?.title || project.slug}
                    </h3>

                    {trans?.challenge && (
                      <div className="text-sm text-zinc-400 leading-relaxed">
                        <span className="font-semibold text-zinc-300">Tantangan: </span>
                        {trans.challenge}
                      </div>
                    )}

                    {trans?.result && (
                      <div className="text-sm text-zinc-200 bg-white/[0.04] p-4 rounded-xl border border-white/[0.08] backdrop-blur-md">
                        <span className="text-red-400 font-semibold">Hasil & Dampak: </span>
                        {trans.result}
                      </div>
                    )}

                    <div className="pt-2">
                      <Link
                        href={`/portofolio/$Studi Kasus`}
                        className="text-xs font-semibold text-red-400 hover:text-red-300 transition"
                      >
                        Detail Studi Kasus &rarr;
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
