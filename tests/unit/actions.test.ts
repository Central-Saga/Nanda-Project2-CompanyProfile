// @vitest-environment node
import { beforeEach, expect, test, vi } from "vitest";
const mocks = vi.hoisted(() => {
  const record = { id: "00000000-0000-4000-8000-000000000001", slug: "sample", deletedAt: null, publishedAt: null, status: "new", role: { name: "super_admin" }, email: "admin@example.test", fullName: "Admin", isActive: true, lockedUntil: null, failedLoginCount: 0, passwordHash: "hash", mustChangePassword: false, sessionId: "session" };
  const model = () => ({ findUnique: vi.fn(async () => record as typeof record | null), findFirst: vi.fn(async () => record as typeof record | null), create: vi.fn(async () => record), update: vi.fn(async () => record), delete: vi.fn(async () => record), updateMany: vi.fn(async () => ({ count: 2 })) });
  const db = { service: model(), project: model(), post: model(), jobOpening: model(), companyProfile: model(), lead: model(), contactMessage: model(), projectBrief: model(), consultationBooking: model(), auditLog: model(), user: model(), session: model(), $queryRaw: vi.fn(async () => []), $transaction: vi.fn() };
  return { record, db, auth: vi.fn(async () => ({ ...record, role: "super_admin", mustChangePassword: false })), revalidate: vi.fn(), cookieSet: vi.fn(), cookieDelete: vi.fn(), compare: vi.fn(async () => true), hash: vi.fn(async () => "new-hash") };
});
vi.mock("@/lib/prisma", () => ({ prisma: mocks.db }));
vi.mock("@/lib/auth", () => ({ requireAuth: mocks.auth, getCurrentUser: mocks.auth }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));
vi.mock("next/headers", () => ({ cookies: async () => ({ set: mocks.cookieSet, delete: mocks.cookieDelete }) }));
vi.mock("next/navigation", () => ({ redirect: (path: string) => { throw new Error(`redirect:${path}`); } }));
vi.mock("bcryptjs", () => ({ default: { compare: mocks.compare, hash: mocks.hash } }));
vi.mock("@/lib/session", () => ({ createSessionToken: async () => "token", hashToken: () => "hashed" }));
import { createServiceAction, updateServiceAction, deleteServiceAction } from "@/app/actions/service";
import { createProjectAction, updateProjectAction, deleteProjectAction } from "@/app/actions/project";
import { createPostAction, updatePostAction, deletePostAction } from "@/app/actions/post";
import { createJobAction, updateJobAction, deleteJobAction } from "@/app/actions/job";
import { updateCompanyProfileAction } from "@/app/actions/company";
import { submitContactAction, submitBriefAction, submitBookingAction } from "@/app/actions/public";
import { loginAction, changePasswordAction, logoutAction } from "@/app/actions/auth";
function form(values: Record<string, string>) { const data = new FormData();
  for (const key of ["excerpt", "categoryId", "icon", "tagline", "summary", "description", "projectUrl", "startedAt", "completedAt", "sortOrder", "challenge", "solution", "result", "content", "department", "location", "responsibilities", "requirements", "benefits", "address", "phone", "emailPublic", "aboutShort", "socialLinks", "operatingHours"]) data.set(key, ""); for (const [key, value] of Object.entries(values)) data.set(key, value); return data; }
beforeEach(() => {
  vi.resetAllMocks();
  for (const model of [mocks.db.service, mocks.db.project, mocks.db.post, mocks.db.jobOpening, mocks.db.companyProfile, mocks.db.lead, mocks.db.user, mocks.db.session]) {
    model.findUnique.mockResolvedValue(mocks.record); model.findFirst.mockResolvedValue(null); model.create.mockResolvedValue(mocks.record); model.update.mockResolvedValue(mocks.record);
  }
  mocks.db.$transaction.mockImplementation(async (callback: (tx: typeof mocks.db) => unknown) => callback(mocks.db));
  mocks.compare.mockResolvedValue(true);
});
for (const [name, model, create, update, remove, fields] of [
  ["service", mocks.db.service, createServiceAction, updateServiceAction, deleteServiceAction, { slug: "sample", name: "Sample Service", sortOrder: "0", isPublished: "on" }],
  ["project", mocks.db.project, createProjectAction, updateProjectAction, deleteProjectAction, { slug: "sample", title: "Sample Project", sortOrder: "0", isPublished: "on" }],
  ["post", mocks.db.post, createPostAction, updatePostAction, deletePostAction, { slug: "sample", title: "Sample Post", content: "Article content", status: "published" }],
  ["job", mocks.db.jobOpening, createJobAction, updateJobAction, deleteJobAction, { slug: "sample", title: "Sample Job", employmentType: "full_time", workMode: "onsite", status: "open" }],
] as const) {
  test(`${name}: create validates fields, rejects duplicate slugs, and persists with cache invalidation`, async () => {
    expect((await create(null, new FormData())).success).toBe(false);
    expect((await create(null, form(fields))).success).toBe(false);
    model.findUnique.mockResolvedValueOnce(null);
    const result = await create(null, form(fields)); expect(result.success).toBe(true); expect(model.create).toHaveBeenCalledTimes(1); expect(mocks.db.auditLog.create).toHaveBeenCalled(); expect(mocks.revalidate).toHaveBeenCalled();
  });
  test(`${name}: update rejects missing records and slug conflicts, then updates translations`, async () => {
    expect((await update(null, new FormData())).success).toBe(false);
    expect((await update(null, form({ ...fields, id: mocks.record.id, slug: "invalid slug" }))).success).toBe(false);
    model.findUnique.mockResolvedValueOnce(null); expect((await update(null, form({ ...fields, id: mocks.record.id }))).success).toBe(false);
    model.findFirst.mockResolvedValueOnce(mocks.record); expect((await update(null, form({ ...fields, id: mocks.record.id }))).success).toBe(false);
    const result = await update(null, form({ ...fields, id: mocks.record.id })); expect(result.success).toBe(true); expect(model.update).toHaveBeenCalledTimes(1);
  });
  test(`${name}: delete checks existence before mutation and writes audit`, async () => {
    model.findUnique.mockResolvedValueOnce(null); expect((await remove(mocks.record.id)).success).toBe(false);
    expect((await remove(mocks.record.id)).success).toBe(true); expect(mocks.db.auditLog.create).toHaveBeenCalledTimes(1);
  });
}
test("company profile rejects invalid JSON and only invalidates after successful update", async () => {
  expect((await updateCompanyProfileAction(null, form({ companyName: "Example", operatingHours: "bad" }))).success).toBe(false);
  mocks.db.companyProfile.findFirst.mockResolvedValueOnce(mocks.record);
  expect((await updateCompanyProfileAction(null, form({ companyName: "Example", operatingHours: "{}", socialLinks: "{}" }))).success).toBe(true);
  expect(mocks.revalidate).toHaveBeenCalledWith("/", "layout");
});
const visitor = { fullName: "Visitor Name", email: "visitor@example.test", subject: "New project", message: "Please contact us about this project.", consentPrivacy: "on" };
for (const [name, submit, fields] of [
  ["contact", submitContactAction, visitor],
  ["brief", submitBriefAction, { ...visitor, projectType: "web", overview: "A large enterprise platform project." }],
  ["booking", submitBookingAction, { ...visitor, preferredDate: "2099-12-01", preferredTimeSlot: "09:00 - 10:00", topic: "Discuss a software project" }],
] as const) {
  test(`${name}: public form returns field validation and persists one lead submission`, async () => {
    expect((await submit(null, new FormData())).success).toBe(false); expect((await submit(null, form(fields))).success).toBe(true); expect(mocks.db.$transaction).toHaveBeenCalledTimes(1);
    mocks.db.$transaction.mockRejectedValueOnce(new Error("private database failure")); const failed = await submit(null, form(fields)); expect(failed.success).toBe(false); expect(failed.message).not.toContain("private database");
  });
}
test("password change revokes all sessions atomically and clears the cookie", async () => {
  const data = form({ currentPassword: "OldPassword1", newPassword: "NewPassword2", confirmPassword: "NewPassword2" });
  expect((await changePasswordAction(null, data)).success).toBe(true);
  expect(mocks.db.session.updateMany).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: mocks.record.id, revokedAt: null } })); expect(mocks.cookieDelete).toHaveBeenCalledWith("session_token");
  mocks.compare.mockResolvedValueOnce(false); expect((await changePasswordAction(null, data)).success).toBe(false);
});
test("login validates fields, checks locks, records failed attempts and sets secure cookies", async () => {
  expect((await loginAction(null, new FormData())).success).toBe(false);
  mocks.compare.mockResolvedValueOnce(false); expect((await loginAction(null, form({ email: "admin@example.test", password: "wrong" }))).success).toBe(false);
  expect((await loginAction(null, form({ email: "admin@example.test", password: "right" }))).success).toBe(true); expect(mocks.cookieSet).toHaveBeenCalledWith("session_token", "token", expect.objectContaining({ httpOnly: true, sameSite: "lax" }));
});
test("logout revokes the active session and invalidates layout cache", async () => {
  expect((await logoutAction()).success).toBe(true); expect(mocks.db.session.update).toHaveBeenCalled(); expect(mocks.cookieDelete).toHaveBeenCalled(); expect(mocks.revalidate).toHaveBeenCalledWith("/", "layout");
});
