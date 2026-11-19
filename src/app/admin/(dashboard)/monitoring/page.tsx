import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateTime, formatNumber } from "@/lib/format";
export default async function MonitoringPage() {
  await requireAuth();
  const since = new Date(new Date().getTime() - 900_000);
  const [count, events] = await Promise.all([
    prisma.auditLog.count({ where: { entityType: "ClientError", createdAt: { gte: since } } }),
    prisma.auditLog.findMany({ where: { entityType: "ClientError" }, orderBy: { createdAt: "desc" }, take: 25 }),
  ]);
  return <div className="space-y-6"><h1 className="text-2xl font-bold">Monitoring aplikasi</h1>
    <p>{formatNumber(count)} error terlapor dalam 15 menit.</p>
    {count >= 5 ? <p role="alert" className="rounded border border-red-700 p-4">Peringatan: jumlah error meningkat. Periksa release dan request ID di bawah.</p> : <p role="status">Jumlah error di bawah ambang peringatan (5 per 15 menit).</p>}
    <table className="w-full text-left text-sm"><caption>Error terbaru — digest dan korelasi request tanpa pesan/stack pribadi</caption><thead><tr><th scope="col">Waktu WITA</th><th scope="col">Digest</th><th scope="col">Korelasi</th></tr></thead>
      <tbody>{events.map((event) => <tr key={event.id}><td>{formatDateTime(event.createdAt)}</td><td>{event.entityId}</td><td><pre className="max-w-lg whitespace-pre-wrap break-all">{JSON.stringify(event.newValues, null, 2)}</pre></td></tr>)}</tbody></table>
  </div>;
}
