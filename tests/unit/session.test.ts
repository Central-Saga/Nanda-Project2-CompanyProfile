// @vitest-environment node
import { expect, test } from "vitest";
import { SignJWT } from "jose";
import { getSessionSecret, createSessionToken, verifySessionToken, hashToken } from "@/lib/session";
const payload = { userId: "a", sessionId: "b", role: "editor" as const };
test("sessions authenticate intact claims and reject tampering, expiry and malformed payloads", async () => {
  process.env.AUTH_SECRET = "unit-test-only-secret-32-characters-or-more";
  const token = await createSessionToken(payload); expect((await verifySessionToken(token))?.userId).toBe("a"); expect(hashToken(token)).toHaveLength(64);
  expect(await verifySessionToken("forged")).toBeNull();
  for (const data of [{ userId: 42 }, { ...payload, role: "unknown" }, { ...payload, mustChangePassword: "false" }]) {
    const invalid = await new SignJWT(data).setProtectedHeader({ alg: "HS256" }).setExpirationTime("1h").sign(getSessionSecret()); expect(await verifySessionToken(invalid)).toBeNull();
  }
  const expired = await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setExpirationTime(1).sign(getSessionSecret()); expect(await verifySessionToken(expired)).toBeNull();
  delete process.env.AUTH_SECRET; expect(() => getSessionSecret()).toThrow(); await expect(createSessionToken(payload)).rejects.toThrow();
});
