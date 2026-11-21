import { PublicationBadge, AdminTable, RowActions, PageHeader, EmptyState } from "@/components/admin";
import { adminTranslations } from "@/lib/translations";
import { PAGE_SIZE, readPage, type PageSearchParams } from "@/lib/pagination";
import { Pagination } from "@/components/shared/ui/Pagination";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DeleteProjectButton } from "./DeleteProjectButton";
import Link from "next/link";

export const metadata = {
  title: "Portofolio",
};

export default async function PortfolioPage({ searchParams }: { searchParams: PageSearchParams }) {
  await requireAuth();
  const paging = await readPage(searchParams);
  const rows = await prisma.project.findMany({
    skip: paging.skip,
    take: paging.take,
    where: { deletedAt: null },
    include: adminTranslations,
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });

  const projects = rows.slice(0, PAGE_SIZE);

  return (
    <div>
      <PageHeader
        title="Daftar Portofolio / Studi Kasus"
        description="Kelola rekam jejak proyek software, tantangan, dan solusi teknologi yang telah dibangun."
        actions={
          <Link
            href="/admin/portfolio/new"
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-mono uppercase tracking-wider transition"
          >
            + Tambah Proyek
          </Link>
        }
      />

      {projects.length === 0 ? (
        <EmptyState
          title="Belum ada data proyek"
          description="Tambahkan studi kasus pertama untuk membangun kredibilitas teknis software house."
          actionLabel="+ Tambah Proyek Pertama"
          actionHref="/admin/portfolio/new"
        />
      ) : (
        <div className="border border-zinc-900 rounded-lg overflow-x-auto bg-zinc-950">
          <AdminTable caption="Portfolio" headers={["Judul Proyek", "Slug", "Unggulan", "Status", "Aksi"]}>
              {projects.map((item) => {
                const trans = item.translations[0];
                return (
                  <tr key={item.id} className="hover:bg-zinc-900/30 transition">
                    <td className="py-3 px-4 font-medium text-zinc-100 font-sans">
                      {trans?.title || "(Tanpa Judul)"}
                    </td>
                    <td className="py-3 px-4 text-zinc-400">{item.slug}</td>
                    <td className="py-3 px-4">
                      {item.isFeatured ? (
                        <span className="text-amber-400">★ Ya</span>
                      ) : (
                        <span className="text-zinc-600">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <PublicationBadge published={item.isPublished} />
                    </td>
                    <RowActions editHref={`/admin/portfolio/${item.id}/edit`}><DeleteProjectButton id={item.id} title={trans?.title || item.slug} /></RowActions>
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
