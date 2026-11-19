import type { Metadata } from "next";
export function siteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL || process.env.DEPLOY_PRIME_URL || process.env.URL || "http://localhost:3000";
  const url = new URL(value);
  if (!["https:", "http:"].includes(url.protocol)) throw new Error("NEXT_PUBLIC_SITE_URL harus berupa HTTP(S) origin.");
  return url.origin;
}
export function pageMetadata(title: string, path: string, description = "Solusi perangkat lunak enterprise, arsitektur cloud, dan rekayasa digital."): Metadata {
  return { title, description, alternates: { canonical: new URL(path, siteUrl()).href },
    openGraph: { title, description, url: new URL(path, siteUrl()).href, type: "website", images: [{ url: "/opengraph-image" }] },
    twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] } };
}
