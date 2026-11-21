import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/seo";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteUrl();
  const entries: MetadataRoute.Sitemap = ["", "/layanan", "/portofolio", "/blog", "/karier", "/kontak", "/booking", "/mulai-proyek"].map((path) => ({ url: origin + path }));
  const [services, projects, posts, jobs] = await Promise.all([
    prisma.service.findMany({ where: { isPublished: true, deletedAt: null }, select: { slug: true, updatedAt: true } }),
    prisma.project.findMany({ where: { isPublished: true, deletedAt: null }, select: { slug: true, updatedAt: true } }),
    prisma.post.findMany({ where: { status: "published", deletedAt: null }, select: { slug: true, updatedAt: true } }),
    prisma.jobOpening.findMany({ where: { status: "open" }, select: { slug: true, updatedAt: true } }),
  ]);
  for (const [path, rows] of [["layanan", services], ["portofolio", projects], ["blog", posts], ["karier", jobs]] as const) {
    entries.push(...rows.map((row) => ({ url: `${origin}/${path}/${encodeURIComponent(row.slug)}`, lastModified: row.updatedAt })));
  }
  return entries;
}
