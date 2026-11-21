"use client";
import { useEffect } from "react";
import { catchError, type ErrorInfo } from "next/error";
import { Button } from "./ui/Button";
function SectionFallback({ title }: { title: string }, { retry, error }: ErrorInfo) {
  useEffect(() => { void import("@/lib/api/monitoring").then((sdk) => sdk.captureError(error, "SectionBoundary")); }, [error]);
  return <section role="alert" className="rounded border border-zinc-700 p-8"><h2>{title} belum dapat dimuat</h2><p>Layanan sedang mengalami gangguan. Bagian lain tetap tersedia.</p><Button onClick={retry}>Coba lagi</Button></section>;
}
export const SectionBoundary = catchError(SectionFallback);
