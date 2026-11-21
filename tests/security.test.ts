import assert from "node:assert/strict";
import { test } from "node:test";
import { SignJWT } from "jose";
import { NextRequest } from "next/server";
import { createSessionToken, verifySessionToken, hashToken, getSessionSecret } from "../src/lib/session";
import { proxy } from "../src/proxy";
import { validateMedia, createStorageKey } from "../src/lib/media-validation";

process.env.AUTH_SECRET = "test-only-secret-with-more-than-32-characters";
const identity = { userId: "user-a", sessionId: "session-a", role: "editor" as const };

test("session tokens round trip and cannot be tampered with", async () => {
  const token = await createSessionToken(identity);
  assert.deepEqual(await verifySessionToken(token), { ...identity, mustChangePassword: undefined });
  const [header, body, signature] = token.split(".");
  assert.equal(await verifySessionToken(`${header}.${body}.${signature[0] === "a" ? "b" : "a"}${signature.slice(1)}`), null);
  assert.equal(hashToken(token).length, 64);
  assert.notEqual(hashToken(token), hashToken(token + "x"));
});

test("missing or weak session secrets fail closed", async () => {
  const original = process.env.AUTH_SECRET;
  try {
    delete process.env.AUTH_SECRET;
    assert.throws(getSessionSecret, /AUTH_SECRET/);
    assert.equal(await verifySessionToken("forged"), null);
    process.env.AUTH_SECRET = "short";
    await assert.rejects(createSessionToken(identity), /AUTH_SECRET/);
  } finally { process.env.AUTH_SECRET = original; }
});

test("signed tokens still require valid claims and expiry", async () => {
  for (const payload of [{ role: "editor" }, { ...identity, userId: 3 }, { ...identity, mustChangePassword: "false" }]) {
    const token = await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setExpirationTime("1h").sign(getSessionSecret());
    assert.equal(await verifySessionToken(token), null);
  }
  const expired = await new SignJWT(identity).setProtectedHeader({ alg: "HS256" }).setExpirationTime(1).sign(getSessionSecret());
  assert.equal(await verifySessionToken(expired), null);
  const noExpiry = await new SignJWT(identity).setProtectedHeader({ alg: "HS256" }).sign(getSessionSecret());
  assert.equal(await verifySessionToken(noExpiry), null);
});

test("all protected routes redirect server-side without a session", async () => {
  for (const path of ["/admin", "/admin/dashboard", "/admin/leads", "/admin/change-password"]) {
    const response = await proxy(new NextRequest(`https://example.com${path}`));
    assert.equal(response.status, 307);
    assert.equal(response.headers.get("location"), "https://example.com/admin/login");
  }
});

test("external next URLs never become redirect destinations", async () => {
  for (const next of ["https://evil.test", "//evil.test", "javascript:alert(1)"]) {
    const response = await proxy(new NextRequest(`https://example.com/admin?next=${encodeURIComponent(next)}`));
    assert.equal(response.headers.get("location"), "https://example.com/admin/login");
  }
});

test("invalid cookies are cleared and login stays reachable with a revoked JWT", async () => {
  const invalid = await proxy(new NextRequest("https://example.com/admin", { headers: { cookie: "session_token=forged" } }));
  assert.match(invalid.headers.get("set-cookie") || "", /session_token=;/);
  const token = await createSessionToken(identity);
  const login = await proxy(new NextRequest("https://example.com/admin/login", { headers: { cookie: `session_token=${token}` } }));
  assert.equal(login.status, 200);
  assert.equal(login.headers.get("location"), null);
});

test("password-change JWT cannot enter dashboard", async () => {
  const token = await createSessionToken({ ...identity, mustChangePassword: true });
  const response = await proxy(new NextRequest("https://example.com/admin/dashboard", { headers: { cookie: `session_token=${token}` } }));
  assert.equal(response.headers.get("location"), "https://example.com/admin/change-password");
});

test("upload inspects bytes instead of trusting browser MIME", () => {
  const png = Buffer.from([137,80,78,71,13,10,26,10,0,0,0,13]);
  assert.equal(validateMedia(png, "image/png").extension, "png");
  assert.throws(() => validateMedia(png, "image/jpeg"));
  assert.throws(() => validateMedia(Buffer.from("<script>alert(1)</script>"), "image/png"));
  assert.throws(() => validateMedia(Buffer.from('<svg onload="alert(1)"/>'), "image/svg+xml"));
  assert.throws(() => validateMedia(Buffer.alloc(0), "image/png"));
  assert.throws(() => validateMedia(Buffer.alloc(10 * 1024 * 1024 + 1), "image/png"));
  assert.throws(() => validateMedia(Buffer.from("%PDF-fake document"), "application/pdf"));
  assert.equal(validateMedia(Buffer.from("%PDF-1.7\nexample\n%%EOF"), "application/pdf").extension, "pdf");
});

test("storage keys are unpredictable and reject path traversal", () => {
  const first = createStorageKey("uploads", "png");
  assert.match(first, /^uploads\/[0-9a-f-]{36}\.png$/);
  assert.notEqual(first, createStorageKey("uploads", "png"));
  for (const folder of ["../public", "x/y", "", "a".repeat(65)]) assert.throws(() => createStorageKey(folder, "png"));
  assert.throws(() => createStorageKey("uploads", "html"));
});
