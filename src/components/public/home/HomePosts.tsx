import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";

export async function HomePosts() {
  const posts = await prisma.post.findMany({ where: { status: "published", deletedAt: null }, include: { translations: { where: { locale: "id" } } }, orderBy: [{ publishedAt: "desc" }, { id: "asc" }], take: 3 });
  if (!posts.length) return null;
  return (
        <section className="py-24 border-b border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-red-500">
                  Wawasan & Riset
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 tracking-tight">
                  Publikasi & Catatan Teknik
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-sm font-medium text-zinc-400 hover:text-white transition"
              >
                Lihat Semua Artikel &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post) => {
                const trans = post.translations[0];
                const dateStr = post.publishedAt
                  ? formatDate(post.publishedAt)
                  : "";

                return (
                  <div
                    key={post.id}
                    className="p-7 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/[0.18] backdrop-blur-xl transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xl"
                  >
                    <div className="space-y-3">
                      <div className="text-xs text-zinc-500">
                        {dateStr}
                      </div>
                      <h3 className="text-base font-bold text-white line-clamp-2">
                        {trans?.title || post.slug}
                      </h3>
                      <p className="text-sm text-zinc-400 line-clamp-3 leading-relaxed">
                        {trans?.content || ""}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/[0.06]">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-xs font-semibold text-zinc-300 hover:text-white transition"
                      >
                        Baca Artikel &rarr;
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
