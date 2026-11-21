import { PublicationBadge, AdminTable, RowActions, PageHeader, EmptyState } from "@/components/admin";
import { adminTranslations } from "@/lib/translations";
import { PAGE_SIZE, readPage, type PageSearchParams } from "@/lib/pagination";
import { Pagination } from "@/components/shared/ui/Pagination";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DeleteServiceButton } from "./DeleteServiceButton";
import Link from "next/link";

export const metadata = {
  title: "Layanan",
};

export default async function ServicesPage({ searchParams }: { searchParams: PageSearchParams }) {
  await requireAuth();
  const paging = await readPage(searchParams);
  const rows = await prisma.service.findMany({
    skip: paging.skip,
    take: paging.take,
    where: { deletedAt: null },
    include: adminTranslations,
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });

  const services = rows.slice(0, PAGE_SIZE);

  return (
    <div>
      <PageHeader
        title="Daftar Layanan"
        description="Kelola portofolio kapabilitas & solusi teknologi yang ditawarkan kepada klien."
        actions={
          <Link
            href="/admin/services/new"
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-mono uppercase tracking-wider transition"
          >
            + Tambah Layanan
          </Link>
        }
      />

      {services.length === 0 ? (
        <EmptyState
          title="Belum ada data layanan"
          description="Tambahkan layanan pertama untuk mulai menampilkan ke website publik."
          actionLabel="+ Tambah Layanan Pertama"
          actionHref="/admin/services/new"
        />
      ) : (
        <div className="border border-zinc-900 rounded-lg overflow-x-auto bg-zinc-950">
          <AdminTable caption="Services" headers={["Nama Layanan", "Slug", "Urutan", "Status", "Aksi"]}>
              {services.map((item) => {
                const trans = item.translations[0];
                return (
                  <tr key={item.id} className="hover:bg-zinc-900/30 transition">
                    <td className="py-3 px-4 font-medium text-zinc-100 font-sans">
                      {trans?.name || "(Tanpa Judul)"}
                    </td>
                    <td className="py-3 px-4 text-zinc-400">{item.slug}</td>
                    <td className="py-3 px-4">{item.sortOrder}</td>
                    <td className="py-3 px-4">
                      <PublicationBadge published={item.isPublished} />
                    </td>
                    <RowActions editHref={`/admin/services/${item.id}/edit`}><DeleteServiceButton id={item.id} name={trans?.name || item.slug} /></RowActions>
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
