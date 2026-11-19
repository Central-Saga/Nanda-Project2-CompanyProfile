import { headers } from "next/headers";
import { siteUrl } from "@/lib/seo";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-black text-zinc-100 font-sans selection:bg-red-950 selection:text-red-200">
      <script type="application/ld+json" nonce={(await headers()).get("x-nonce") || undefined}
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "PT Rekasaya Digital International", url: siteUrl(), logo: `${siteUrl()}/logo.png` }).replace(/</g, "\\u003c") }} />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
