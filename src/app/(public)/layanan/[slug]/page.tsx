import { publicTranslations } from "@/lib/translations";
import { ProjectLinks } from "@/components/public/ProjectLinks";
import { pageMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

import type { SlugPageProps as Props } from "@/types/routes";

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({
    where: { slug },
    include: { translations: await publicTranslations() },
  });

  if (!service || !service.isPublished || service.deletedAt) notFound();
  return pageMetadata(service?.translations[0]?.name || slug, `/layanan/${encodeURIComponent(slug)}`);
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({
    where: { slug },
    include: {
      translations: await publicTranslations(),
    },
  });

  if (!service || !service.isPublished || service.deletedAt) {
    notFound();
  }

  const trans = service.translations[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-10">
      <Link
        href="/layanan"
        className="text-xs font-medium text-zinc-400 hover:text-white transition flex items-center gap-1.5"
      >
        <span>&larr;</span>
        <span>Kembali ke Layanan</span>
      </Link>

      <div className="space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-red-500">
          Layanan Rekayasa
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          {trans?.name || service.slug}
        </h1>
        {trans?.summary && (
          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
            {trans.summary}
          </p>
        )}
      </div>

      {trans?.description && (
        <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
          <div className="prose prose-invert max-w-none text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
            {trans.description}
          </div>
        </div>
      )}

      <div className="p-8 rounded-2xl bg-gradient-to-r from-red-950/20 to-rose-950/20 border border-red-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-base font-bold text-white">Butuh Solusi Ini?</h3>
          <p className="text-xs text-zinc-400 mt-1">
            Kirimkan brief teknis Anda untuk memulai evaluasi arsitektur.
          </p>
        </div>
        <ProjectLinks />
      </div>
    </div>
  );
}
