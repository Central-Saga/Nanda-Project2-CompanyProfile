import { AdminTable, PageHeader, EmptyState } from "@/components/admin";
import { PAGE_SIZE, readPage, type PageSearchParams } from "@/lib/pagination";
import { Pagination } from "@/components/shared/ui/Pagination";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import dynamic from "next/dynamic";
const MediaUploader = dynamic(() => import("./MediaUploader").then((module) => module.MediaUploader));
import { DeleteMediaButton } from "./DeleteMediaButton";

export default async function MediaPage({ searchParams }: { searchParams: PageSearchParams }) {
  await requireAuth();
  const paging = await readPage(searchParams);
  const rows = await prisma.mediaFile.findMany({
    skip: paging.skip,
    take: paging.take,
    where: { deletedAt: null },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
  });

  const mediaList = rows.slice(0, PAGE_SIZE);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pustaka Media & Penyimpanan S3"
        description="Kelola berkas aset gambar, dokumen, dan logo yang tersimpan pada objek penyimpanan S3-compatible."
      />

      <MediaUploader />

      <div className="bg-zinc-950 border border-zinc-900 rounded-lg overflow-x-auto">
        {mediaList.length === 0 ? (
          <EmptyState
            title="Belum ada berkas media"
            description="Unggah berkas gambar atau dokumen untuk mulai menggunakan penyimpanan S3."
          />
        ) : (
          <div className="overflow-x-auto">
            <AdminTable caption="Media" headers={["Nama Berkas", "Tipe & Ukuran", "Kunci Storage", "Tautan", "Aksi"]}>
                {mediaList.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-900/30">
                    <td className="py-3 px-4">
                      <div className="font-sans font-medium text-zinc-200">
                        {item.originalName}
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        ID: {item.id.slice(0, 8)}...
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{item.mimeType}</div>
                      <div className="text-zinc-500">
                        {(item.sizeBytes / 1024).toFixed(1)} KB
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-400 truncate max-w-xs">
                      {item.storageKey}
                    </td>
                    <td className="py-3 px-4">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-red-500 hover:underline"
                      >
                        Buka URL
                      </a>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DeleteMediaButton id={item.id} name={item.originalName} />
                    </td>
                  </tr>
                ))}
              </AdminTable>
          </div>
        )}
      </div>
    <Pagination page={paging.page} hasNext={rows.length > PAGE_SIZE} />
</div>
  );
}
