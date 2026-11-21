import Link from "next/link";
import type { ReactNode } from "react";
export interface RowActionsProps { editHref: string; children: ReactNode; }
export function RowActions({ editHref, children }: RowActionsProps) {
  return <td className="space-x-3 px-4 py-3 text-right"><Link href={editHref} className="text-zinc-300 hover:text-white">Edit</Link>{children}</td>;
}
