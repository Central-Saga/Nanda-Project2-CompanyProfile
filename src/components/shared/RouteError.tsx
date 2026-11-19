"use client";
import { Button } from "@/components/shared/ui/Button";


import { useEffect } from "react";
import Link from "next/link";

export interface RouteErrorProps {
  error: unknown;
  retry: () => void;
}

export function RouteError({ retry, error }: RouteErrorProps) {
  useEffect(() => { void import("@/lib/api/monitoring").then((sdk) => sdk.captureError(error, "RouteError")); }, [error]);
  return (
    <section role="alert" className="mx-auto max-w-xl px-6 py-20 text-center">
      <h1 className="text-2xl font-bold">Halaman belum dapat dimuat</h1>
      <p className="mt-4 text-zinc-400">
        Layanan sedang mengalami gangguan. Silakan coba lagi dalam beberapa saat.
      </p>
      <Button type="button" onClick={retry} className="mt-6 min-h-11 rounded bg-red-600 px-5 py-3 text-white">
        Coba lagi
      </Button>
      <Link href="/" className="ml-4 inline-flex min-h-11 items-center underline">Ke beranda</Link>
    </section>
  );
}
