import type { ReactNode } from "react";
export interface AdminTableProps { caption: string; headers: readonly string[]; children: ReactNode; }
export function AdminTable({ caption, headers, children }: AdminTableProps) {
  return <table className="relative w-full text-left text-xs font-mono">
    <caption className="sr-only">{caption}</caption>
    <thead className="border-b border-zinc-800 bg-zinc-900/60 uppercase text-zinc-400"><tr>{headers.map((label) => <th key={label} scope="col" className="px-4 py-3">{label}</th>)}</tr></thead>
    <tbody className="divide-y divide-zinc-900 text-zinc-300">{children}</tbody>
  </table>;
}
