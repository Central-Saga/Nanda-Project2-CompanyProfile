export interface PublicationBadgeProps { published: boolean; }
export function PublicationBadge({ published }: PublicationBadgeProps) {
  return <span className={`rounded border px-2 py-1 text-xs ${published ? "border-green-800 bg-green-950 text-green-400" : "border-zinc-800 bg-zinc-900 text-zinc-400"}`}>{published ? "PUBLISHED" : "DRAFT"}</span>;
}
