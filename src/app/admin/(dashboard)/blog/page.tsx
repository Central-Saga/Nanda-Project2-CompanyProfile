import { AdminTable, RowActions, PageHeader, EmptyState } from "@/components/admin";
import { PAGE_SIZE, readPage, type PageSearchParams } from "@/lib/pagination";
import { Pagination } from "@/components/shared/ui/Pagination";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DeletePostButton } from "./DeletePostButton";
import Link from "next/link";

export const metadata = {
  title: "Blog / Artikel",
};

export default async function BlogPage({ searchParams }: { searchParams: PageSearchParams }) {
  await requireAuth();
  const paging = await readPage(searchParams);
  const rows = await prisma.post.findMany({
    skip: paging.skip,
    take: paging.take,
    where: { deletedAt: null },
    include: {
      translations: { where: { locale: "id" } },
      category: {
        include: {
          translations: { where: { locale: "id" } },
        },
      },
    },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
  });

  const posts = rows.slice(0, PAGE_SIZE);

  return (
    <div>
      <PageHeader
        title="Daftar Artikel / Insight"
        description="Kelola publikasi teknis, opini rekayasa perangkat lunak, dan berita perusahaan."
        actions={
          <Link
            href="/admin/blog/new"
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-mono uppercase tracking-wider transition"
          >
            + Tulis Artikel
          </Link>
        }
      />

      {posts.length === 0 ? (
        <EmptyState
          title="Belum ada artikel"
          description="Mulai bagikan wawasan teknis untuk memperkuat thought leadership perusahaan."
          actionLabel="+ Tulis Artikel Pertama"
          actionHref="/admin/blog/new"
        />
      ) : (
        <div className="border border-zinc-900 rounded-lg overflow-x-auto bg-zinc-950">
          <AdminTable caption="Blog" headers={["Judul Artikel", "Kategori", "Unggulan", "Status", "Aksi"]}>
              {posts.map((item) => {
                const trans = item.translations[0];
                const catTrans = item.category?.translations[0];
                return (
                  <tr key={item.id} className="hover:bg-zinc-900/30 transition">
                    <td className="py-3 px-4 font-medium text-zinc-100 font-sans">
                      {trans?.title || "(Tanpa Judul)"}
                    </td>
                    <td className="py-3 px-4 text-zinc-400">
                      {catTrans?.name || "-"}
                    </td>
                    <td className="py-3 px-4">
                      {item.isFeatured ? (
                        <span className="text-amber-400">★ Ya</span>
                      ) : (
                        <span className="text-zinc-600">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {item.status === "published" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-green-950 text-green-400 border border-green-800">
                          PUBLISHED
                        </span>
                      ) : item.status === "draft" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-900 text-zinc-500 border border-zinc-800">
                          DRAFT
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-500 border border-amber-800">
                          ARCHIVED
                        </span>
                      )}
                    </td>
                    <RowActions editHref={`/admin/blog/${item.id}/edit`}><DeletePostButton id={item.id} title={trans?.title || item.slug} /></RowActions>
                  </tr>
                );
              })}
            </AdminTable>
        </div>
      )}
    <Pagination page={paging.page} hasNext={rows.length > PAGE_SIZE} />
</div>
  );
}
