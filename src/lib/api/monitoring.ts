import { featureFlags } from "@/lib/flags";
import { z } from "zod";
import { apiRequest } from "./client";
const reported = new Set<string>();
export async function captureError(error: unknown, component: string) {
  if (!featureFlags.monitoring) return;
  const digest = typeof error === "object" && error !== null && "digest" in error && typeof error.digest === "string" ? error.digest.slice(0, 100) : "unknown";
  const pageRequestId = document.querySelector('meta[name="request-id"]')?.getAttribute("content") || "";
  const key = `${pageRequestId}:${component}:${digest}`;
  if (reported.has(key)) return;
  reported.add(key);
  if (reported.size > 100) reported.delete(reported.values().next().value || "");
  try {
    await apiRequest("/monitoring", z.object({ success: z.literal(true) }), { method: "POST", body: JSON.stringify({ digest, component, pageRequestId }), timeoutMs: 3000 });
  } catch { /* Error reporting must never break the recovery UI. */ }
}
