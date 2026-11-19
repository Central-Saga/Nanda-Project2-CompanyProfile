"use client";

import { RouteError, type RouteErrorProps } from "@/components/shared/RouteError";

export default function GlobalError(props: RouteErrorProps) {
  return <html lang="id"><body><RouteError {...props} /></body></html>;
}
