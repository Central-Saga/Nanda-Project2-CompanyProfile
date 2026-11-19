// @vitest-environment node
import { beforeAll, afterAll, afterEach, expect, test, vi } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse, delay } from "msw";
import { z } from "zod";
import { apiRequest, ApiRequestError, apiMessage } from "@/lib/api/client";
const server = setupServer();
const endpoint = "http://localhost:3100/api/v1/example";
const schema = z.object({ value: z.string() });
beforeAll(() => { process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:3100/api/v1"; server.listen(); });
afterEach(() => { server.resetHandlers(); vi.restoreAllMocks(); });
afterAll(() => { server.close(); delete process.env.NEXT_PUBLIC_API_BASE_URL; });
test("GET retries transient failures with backoff and validates response", async () => {
  let calls = 0; server.use(http.get(endpoint, () => ++calls < 3 ? new HttpResponse(null, { status: 503 }) : HttpResponse.json({ value: "latest" })));
  expect(await apiRequest("/example", schema)).toEqual({ value: "latest" }); expect(calls).toBe(3);
});
test("concurrent GET requests are deduplicated without stale caching", async () => {
  let calls = 0; server.use(http.get(endpoint, async () => { calls++; await delay(20); return HttpResponse.json({ value: "data" }); }));
  await Promise.all([apiRequest("/example", schema), apiRequest("/example", schema)]); expect(calls).toBe(1);
  await apiRequest("/example", schema); expect(calls).toBe(2);
});
test("slow GET times out and individual requests can be cancelled", async () => {
  server.use(http.get(endpoint, async () => { await delay(200); return HttpResponse.json({ value: "slow" }); }));
  await expect(apiRequest("/example", schema, { timeoutMs: 20, retries: 0 })).rejects.toMatchObject({ detail: { code: "TIMEOUT" } });
  const controller = new AbortController(); const result = apiRequest("/example", schema, { signal: controller.signal }); controller.abort(); await expect(result).rejects.toBeDefined();
});
test("mutations are never automatically retried and validation errors retain field details", async () => {
  let calls = 0; server.use(http.patch(endpoint, () => { calls++; return HttpResponse.json({ success: false, code: "VALIDATION", message: "invalid", errors: { status: ["Pilih status yang tersedia."] } }, { status: 422 }); }));
  await expect(apiRequest("/example", schema, { method: "PATCH", body: "{}" })).rejects.toMatchObject({ detail: { code: "VALIDATION", errors: { status: ["Pilih status yang tersedia."] } } }); expect(calls).toBe(1);
});
test("HTML failures and invalid response contracts are rejected", async () => {
  server.use(http.get(endpoint, () => new HttpResponse("<html>error</html>")));
  await expect(apiRequest("/example", schema)).rejects.toBeInstanceOf(ApiRequestError);
  server.use(http.get(endpoint, () => HttpResponse.json({ value: 3 })));
  await expect(apiRequest("/example", schema)).rejects.toBeDefined();
});
test("API paths reject traversal and messages have locale fallback", async () => {
  await expect(apiRequest("//evil.test", schema)).rejects.toBeDefined();
  expect(apiMessage("TIMEOUT", "en")).toContain("too long"); expect(apiMessage("TIMEOUT", "unknown")).toContain("terlalu lama");
});
