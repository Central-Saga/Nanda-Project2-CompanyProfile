// @vitest-environment node
import { beforeEach, expect, test, vi } from "vitest";
const mocks = vi.hoisted(() => ({ token: "token", verify: vi.fn(), session: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ prisma: { session: { findUnique: mocks.session } } }));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => mocks.token ? { value: mocks.token } : undefined }) }));
vi.mock("@/lib/session", () => ({ verifySessionToken: mocks.verify, hashToken: () => "hash" }));
vi.mock("next/navigation", () => ({ redirect: (path: string) => { throw new Error(`redirect:${path}`); } }));
import { getCurrentUser, requireAuth } from "@/lib/auth";
const record = { id: "session", userId: "user", tokenHash: "hash", revokedAt: null, expiresAt: new Date("2099-01-01"), user: { id: "user", email: "admin@example.test", fullName: "Admin", isActive: true, deletedAt: null, role: { name: "super_admin" }, mustChangePassword: false } };
beforeEach(() => { mocks.token = "token"; mocks.verify.mockResolvedValue({ userId: "user", sessionId: "session" }); mocks.session.mockResolvedValue(record); });
test("authentication uses the database session and returns only the safe identity", async () => { expect(await getCurrentUser()).toEqual({ id: "user", email: "admin@example.test", fullName: "Admin", role: "super_admin", mustChangePassword: false, sessionId: "session" }); });
test("missing, forged and unregistered tokens fail closed", async () => { mocks.token = ""; expect(await getCurrentUser()).toBeNull(); mocks.token = "token"; mocks.verify.mockResolvedValueOnce(null); expect(await getCurrentUser()).toBeNull(); mocks.session.mockResolvedValueOnce(null); expect(await getCurrentUser()).toBeNull(); });
test("revoked, expired, mismatched and inactive sessions are rejected", async () => {
  for (const session of [{ ...record, revokedAt: new Date() }, { ...record, expiresAt: new Date(0) }, { ...record, tokenHash: "different" }, { ...record, userId: "different" }, { ...record, user: { ...record.user, isActive: false } }, { ...record, user: { ...record.user, deletedAt: new Date() } }]) { mocks.session.mockResolvedValueOnce(session); expect(await getCurrentUser()).toBeNull(); }
});
test("guard redirects expired identities and enforces password replacement", async () => { mocks.token = ""; await expect(requireAuth()).rejects.toThrow("/admin/login"); mocks.token = "token"; mocks.session.mockResolvedValueOnce({ ...record, user: { ...record.user, mustChangePassword: true } }); await expect(requireAuth()).rejects.toThrow("/admin/change-password"); expect((await requireAuth()).id).toBe("user"); });
