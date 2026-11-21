import { Suspense } from "react";
import { SectionBoundary } from "@/components/shared/SectionBoundary";
import { pageMetadata } from "@/lib/seo";
import { HomeHero } from "@/components/public/home/HomeHero";
import { HomeServices } from "@/components/public/home/HomeServices";
import { HomePortfolio } from "@/components/public/home/HomePortfolio";
import { HomePosts } from "@/components/public/home/HomePosts";
import { HomeContact } from "@/components/public/home/HomeContact";
export const metadata = pageMetadata("PT Rekasaya Digital International", "/");
export default function HomePage() {
  return <div className="relative overflow-hidden">
    <SectionBoundary title="Hero"><Suspense fallback={<p role="status" className="p-8">Memuat Hero…</p>}><HomeHero /></Suspense></SectionBoundary>
    <SectionBoundary title="Services"><Suspense fallback={<p role="status" className="p-8">Memuat Services…</p>}><HomeServices /></Suspense></SectionBoundary>
    <SectionBoundary title="Portfolio"><Suspense fallback={<p role="status" className="p-8">Memuat Portfolio…</p>}><HomePortfolio /></Suspense></SectionBoundary>
    <SectionBoundary title="Posts"><Suspense fallback={<p role="status" className="p-8">Memuat Posts…</p>}><HomePosts /></Suspense></SectionBoundary>
    <SectionBoundary title="Contact"><Suspense fallback={<p role="status" className="p-8">Memuat Contact…</p>}><HomeContact /></Suspense></SectionBoundary>
  </div>;
}
