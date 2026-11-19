import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-6 py-20 text-center">
      <h1 className="text-2xl font-bold">Halaman tidak ditemukan</h1>
      <p className="mt-4 text-zinc-400">Alamat mungkin berubah atau konten sudah tidak tersedia.</p>
      <Link href="/" className="mt-6 inline-flex min-h-11 items-center rounded bg-red-600 px-5 text-white">Ke beranda</Link>
    </section>
  );
}
