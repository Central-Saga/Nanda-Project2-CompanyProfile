import Link from "next/link";
export interface PaginationProps { page: number; hasNext: boolean; }
export function Pagination({ page, hasNext }: PaginationProps) {
  return <nav aria-label="Pagination" className="my-6 flex items-center gap-6">
    {page > 1 && <Link href={`?page=${page - 1}`} rel="prev">Sebelumnya</Link>}
    <span aria-current="page">Halaman {page}</span>
    {hasNext && <Link href={`?page=${page + 1}`} rel="next">Berikutnya</Link>}
  </nav>;
}
