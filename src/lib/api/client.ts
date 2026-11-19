import { z } from "zod";
import { apiErrorSchema, type ApiError } from "@/types/domain";
const inFlight = new Map<string, Promise<unknown>>();
let redirecting = false;
export class ApiRequestError extends Error {
  constructor(public detail: ApiError) { super(detail.message); }
}
const messages = {
  id: { UNAUTHORIZED: "Sesi berakhir. Silakan masuk kembali.", FORBIDDEN: "Permintaan tidak diizinkan.", VALIDATION: "Periksa isian formulir.", NOT_FOUND: "Data tidak ditemukan.", TIMEOUT: "Layanan terlalu lama merespons. Silakan coba lagi.", NETWORK: "Koneksi terputus. Periksa jaringan dan coba lagi.", SERVER: "Layanan sedang mengalami gangguan. Silakan coba lagi." },
  en: { UNAUTHORIZED: "Your session expired. Please sign in again.", FORBIDDEN: "This request is not allowed.", VALIDATION: "Check the form fields.", NOT_FOUND: "Data was not found.", TIMEOUT: "The service took too long. Please try again.", NETWORK: "Connection lost. Check your network and try again.", SERVER: "The service is unavailable. Please try again." },
};
export function apiMessage(code: ApiError["code"], locale = "id") { return messages[locale === "en" ? "en" : "id"][code]; }
export interface ApiOptions extends Omit<RequestInit, "signal"> { signal?: AbortSignal; timeoutMs?: number; retries?: number; }
function failure(code: ApiError["code"], requestId?: string) {
  return new ApiRequestError({ success: false, code, message: apiMessage(code, typeof document === "undefined" ? "id" : document.documentElement.lang), requestId });
}
function delay(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const abort = () => { clearTimeout(timer); reject(signal.reason); };
    const timer = setTimeout(() => { signal.removeEventListener("abort", abort); resolve(); }, ms);
    if (signal.aborted) abort(); else signal.addEventListener("abort", abort, { once: true });
  });
}
async function perform(path: string, options: ApiOptions): Promise<unknown> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("..")) throw failure("FORBIDDEN");
  const url = `${base.replace(/\/$/, "")}${path}`;
  if (typeof window !== "undefined" && new URL(url, window.location.origin).origin !== window.location.origin) throw failure("FORBIDDEN");
  const controller = new AbortController();
  const signal = options.signal ? AbortSignal.any([controller.signal, options.signal]) : controller.signal;
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 8000);
  const method = options.method || "GET";
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (options.body) headers.set("Content-Type", "application/json");
  if (method !== "GET" && typeof document !== "undefined") headers.set("x-csrf-token", document.cookie.split("; ").find((part) => part.startsWith("csrf_token="))?.slice(11) || "");
  try {
    for (let attempt = 0; ; attempt++) {
      let response: Response;
      try {
        response = await fetch(url, { ...options, method, headers, signal, credentials: "same-origin", cache: "no-store" });
      } catch (error) {
        if (signal.aborted) throw options.signal?.aborted ? error : failure("TIMEOUT");
        if (method === "GET" && attempt < (options.retries ?? 2)) { await delay(100 * 2 ** attempt, signal); continue; }
        throw failure("NETWORK");
      }
      if (response.status === 401 && typeof window !== "undefined" && !redirecting) { redirecting = true; window.location.replace("/admin/login"); }
      if (method === "GET" && (response.status >= 500 || response.status === 429) && attempt < (options.retries ?? 2)) { await delay(100 * 2 ** attempt, signal); continue; }
      let body: unknown;
      try { body = await response.json(); } catch { throw failure("SERVER", response.headers.get("x-request-id") || undefined); }
      if (!response.ok) {
        const parsed = apiErrorSchema.safeParse(body);
        if (parsed.success) throw new ApiRequestError({ ...parsed.data, message: apiMessage(parsed.data.code, typeof document === "undefined" ? "id" : document.documentElement.lang) });
        throw failure(response.status === 401 ? "UNAUTHORIZED" : response.status === 403 ? "FORBIDDEN" : response.status === 422 ? "VALIDATION" : response.status === 404 ? "NOT_FOUND" : "SERVER");
      }
      return body;
    }
  } finally { clearTimeout(timer); }
}
// No cross-request stale cache: only concurrent GETs without individual cancellation share a promise.
export async function apiRequest<T>(path: string, schema: z.ZodType<T>, options: ApiOptions = {}): Promise<T> {
  const dedupe = (!options.method || options.method === "GET") && !options.signal;
  let pending = dedupe ? inFlight.get(path) : undefined;
  if (!pending) {
    pending = perform(path, options);
    if (dedupe) { inFlight.set(path, pending); void pending.finally(() => inFlight.delete(path)).catch(() => {}); }
  }
  return schema.parse(await pending);
}
