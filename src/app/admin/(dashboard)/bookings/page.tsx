import { formatDate } from "@/lib/format";
import { PAGE_SIZE, readPage, type PageSearchParams } from "@/lib/pagination";
import { Pagination } from "@/components/shared/ui/Pagination";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { BookingStatusSelector } from "./BookingStatusSelector";

export const metadata = {
  title: "Konsultasi Terjadwal",
};

export default async function BookingsPage({ searchParams }: { searchParams: PageSearchParams }) {
  await requireAuth();
  const paging = await readPage(searchParams);
  const rows = await prisma.consultationBooking.findMany({
    skip: paging.skip,
    take: paging.take,
    include: {
      lead: true,
    },
    orderBy: [{ preferredDate: "desc" }, { id: "asc" }],
  });

  const bookings = rows.slice(0, PAGE_SIZE);

  return (
    <div>
      <PageHeader
        title="Jadwal Konsultasi Proyek"
        description="Kelola reservasi konsultasi teknis yang diajukan langsung lewat platform website."
      />

      {bookings.length === 0 ? (
        <EmptyState
          title="Belum ada permintaan konsultasi"
          description="Klien dapat menjadwalkan sesi konsultasi arsitektur melalui portal publik."
        />
      ) : (
        <div className="border border-zinc-900 rounded-lg overflow-x-auto bg-zinc-950">
          <table className="w-full text-left text-xs font-mono">
<caption className="sr-only">Bookings</caption>
            <thead className="bg-zinc-900/60 text-zinc-400 uppercase tracking-wider border-b border-zinc-900">
              <tr>
                <th scope="col" className="py-3 px-4">Nama Klien</th>
                <th scope="col" className="py-3 px-4">Kontak</th>
                <th scope="col" className="py-3 px-4">Tanggal Diajukan</th>
                <th scope="col" className="py-3 px-4">Slot Waktu</th>
                <th scope="col" className="py-3 px-4">Topik</th>
                <th scope="col" className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-zinc-300">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-zinc-900/30 transition">
                  <td className="py-3 px-4 font-medium text-zinc-100 font-sans">
                    {booking.lead.fullName}
                  </td>
                  <td className="py-3 px-4 text-zinc-400">
                    <div>{booking.lead.email}</div>
                    {booking.lead.phone && (
                      <div className="text-[11px] text-zinc-500">{booking.lead.phone}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-zinc-300">
                    {formatDate(booking.preferredDate)}
                  </td>
                  <td className="py-3 px-4 text-zinc-400 font-bold">
                    {booking.preferredTimeSlot}
                  </td>
                  <td className="py-3 px-4 text-zinc-300 font-sans">
                    {booking.topic || "-"}
                  </td>
                  <td className="py-3 px-4">
                    <BookingStatusSelector
                      bookingId={booking.id}
                      currentStatus={booking.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    <Pagination page={paging.page} hasNext={rows.length > PAGE_SIZE} />
</div>
  );
}
