import { AdminTable, RowActions, PageHeader, EmptyState } from "@/components/admin";
import { PAGE_SIZE, readPage, type PageSearchParams } from "@/lib/pagination";
import { Pagination } from "@/components/shared/ui/Pagination";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DeleteJobButton } from "./DeleteJobButton";
import Link from "next/link";

export const metadata = {
  title: "Karir & Lowongan",
};

export default async function CareersPage({ searchParams }: { searchParams: PageSearchParams }) {
  await requireAuth();
  const paging = await readPage(searchParams);
  const rows = await prisma.jobOpening.findMany({
    skip: paging.skip,
    take: paging.take,
    include: {
      translations: { where: { locale: "id" } },
      _count: {
        select: { applications: true },
      },
    },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
  });

  const jobs = rows.slice(0, PAGE_SIZE);

  return (
    <div>
      <PageHeader
        title="Daftar Lowongan Kerja"
        description="Kelola posisi rekrutmen engineering, desain, dan manajemen produk."
        actions={
          <Link
            href="/admin/careers/new"
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-mono uppercase tracking-wider transition"
          >
            + Buka Lowongan
          </Link>
        }
      />

      {jobs.length === 0 ? (
        <EmptyState
          title="Belum ada lowongan dibuka"
          description="Buka posisi rekrutmen pertama untuk menarik talenta rekayasa perangkat lunak."
          actionLabel="+ Buka Lowongan Pertama"
          actionHref="/admin/careers/new"
        />
      ) : (
        <div className="border border-zinc-900 rounded-lg overflow-x-auto bg-zinc-950">
          <AdminTable caption="Careers" headers={["Posisi", "Departemen", "Mode", "Pelamar", "Status", "Aksi"]}>
              {jobs.map((item) => {
                const trans = item.translations[0];
                return (
                  <tr key={item.id} className="hover:bg-zinc-900/30 transition">
                    <td className="py-3 px-4 font-medium text-zinc-100 font-sans">
                      {trans?.title || "(Tanpa Judul)"}
                    </td>
                    <td className="py-3 px-4 text-zinc-400">
                      {item.department || "-"}
                    </td>
                    <td className="py-3 px-4 uppercase text-zinc-400">
                      {item.workMode}
                    </td>
                    <td className="py-3 px-4 text-zinc-300">
                      {item._count.applications} berkas
                    </td>
                    <td className="py-3 px-4">
                      {item.status === "open" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-green-950 text-green-400 border border-green-800">
                          OPEN
                        </span>
                      ) : item.status === "draft" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-900 text-zinc-500 border border-zinc-800">
                          DRAFT
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-red-950 text-red-500 border border-red-800">
                          {item.status.toUpperCase()}
                        </span>
                      )}
                    </td>
                    <RowActions editHref={`/admin/careers/${item.id}/edit`}><DeleteJobButton id={item.id} title={trans?.title || item.slug} /></RowActions>
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
