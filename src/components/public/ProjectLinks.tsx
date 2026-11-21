import Link from "next/link";
export function ProjectLinks() {
  return <div className="flex w-full items-center gap-3 sm:w-auto"><Link href="/mulai-proyek" className="rounded-xl bg-red-600 px-5 py-3 text-xs font-medium text-white">Mulai Proyek</Link><Link href="/booking" className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-medium text-zinc-300">Konsultasi</Link></div>;
}
