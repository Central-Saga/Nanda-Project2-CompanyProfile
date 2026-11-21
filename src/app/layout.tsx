import { OfflineBanner } from "@/components/shared/OfflineBanner";
import { headers, cookies } from "next/headers";
import { getLocale } from "@/lib/locale";
import { siteUrl } from "@/lib/seo";
import { connection } from "next/server";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: "PT Rekasaya Digital International",
  description: "Solusi perangkat lunak enterprise dan arsitektur cloud.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await connection();
  return (
    <html data-theme={(await cookies()).get("theme")?.value === "light" ? "light" : "dark"}
      lang={await getLocale()}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head><meta name="request-id" content={(await headers()).get("x-request-id") || ""} /></head>
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-link">Lewati ke konten utama</a>
        <OfflineBanner />
        {children}
      </body>
    </html>
  );
}
