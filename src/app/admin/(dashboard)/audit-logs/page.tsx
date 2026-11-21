import { AdminTable, PageHeader, EmptyState } from "@/components/admin";
import { formatDateTime } from "@/lib/format";
import { PAGE_SIZE, readPage, type PageSearchParams } from "@/lib/pagination";
import { Pagination } from "@/components/shared/ui/Pagination";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AuditLogsPage({ searchParams }: { searchParams: PageSearchParams }) {
  await requireAuth();
  const paging = await readPage(searchParams);
  const rows = await prisma.auditLog.findMany({
    skip: paging.skip,
    take: paging.take,
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    include: { user: true },
  });

  const logs = rows.slice(0, PAGE_SIZE);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Log Audit & Rekam Jejak Sistem"
        description="Transparansi dan ketertelusuran mutlak terhadap seluruh aktivitas perubahan data internal."
      />

      <div className="bg-zinc-950 border border-zinc-900 rounded-lg overflow-x-auto">
        {logs.length === 0 ? (
          <EmptyState
            title="Belum ada catatan log"
            description="Seluruh perubahan entitas pada database akan otomatis tercatat di sini."
          />
        ) : (
          <div className="overflow-x-auto">
            <AdminTable caption="Audit Logs" headers={["Waktu", "Pelaku", "Aksi", "Entitas", "ID Entitas", "Data"]}>
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-900/30">
                    <td className="py-3 px-4 text-zinc-500 whitespace-nowrap">
                      {formatDateTime(log.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      {log.user?.fullName || log.user?.email || "Sistem"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] uppercase font-bold text-red-500">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-200">
                      {log.entityType}
                    </td>
                    <td className="py-3 px-4 text-zinc-500 truncate max-w-[120px]">
                      {log.entityId}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-[11px] text-zinc-400 font-mono">
                      {log.newValues ? JSON.stringify(log.newValues) : log.oldValues ? JSON.stringify(log.oldValues) : "-"}
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
