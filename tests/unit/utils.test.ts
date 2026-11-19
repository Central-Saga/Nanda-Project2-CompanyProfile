import { resolveLocale } from "@/lib/locale";
import { expect, test } from "vitest";
import { createCsp, validCsrf, newCsrfToken } from "@/lib/security";
import { readPage } from "@/lib/pagination";
import { dateInput, formatDate, formatDateTime, formatNumber } from "@/lib/format";
import { leadStatusSchema, bookingStatusSchema, mutationResponseSchema } from "@/types/domain";
import { publicContactSchema, publicBriefSchema, publicBookingSchema } from "@/lib/validations/public";
import { contactFactory } from "../factories";
test("strict CSP uses unique nonces without unsafe inline", () => { const csp = createCsp("nonce"); expect(csp).toContain("nonce-nonce"); expect(csp).not.toContain("unsafe-inline"); expect(csp).toContain("frame-ancestors 'none'"); });
test("CSRF comparison rejects missing and forged tokens", () => { const token = newCsrfToken(); expect(validCsrf(token, token)).toBe(true); expect(validCsrf(token, newCsrfToken())).toBe(false); expect(validCsrf(undefined, null)).toBe(false); expect(validCsrf("wrong", "wrong")).toBe(false); });
test("pagination validates page numbers and caps excessive offsets", async () => { expect((await readPage(Promise.resolve({ page: "2" }))).skip).toBe(10); for (const page of ["-1", "NaN", "1.5"]) expect((await readPage(Promise.resolve({ page }))).page).toBe(1); expect((await readPage(Promise.resolve({ page: "999999" }))).page).toBe(10000); });
test("dates always use WITA even across UTC midnight", () => { expect(dateInput("2026-11-19T17:00:00Z")).toBe("2026-11-20"); expect(formatDateTime("2026-11-19T17:00:00Z")).toContain("WITA"); expect(formatDate("2026-11-19T17:00:00Z")).toContain("20"); expect(formatNumber(1200)).toBe("1.200"); });
test("CRM enums reject the previous invalid UI options", () => { expect(leadStatusSchema.safeParse("proposal_sent").success).toBe(false); expect(leadStatusSchema.safeParse("proposal").success).toBe(true); expect(bookingStatusSchema.safeParse("completed").success).toBe(false); expect(bookingStatusSchema.safeParse("done").success).toBe(true); expect(mutationResponseSchema.safeParse({ success: false, code: "SERVER", message: "Retry" }).success).toBe(true); });
test("public form schemas preserve localized field validation", () => { const contact = contactFactory(); expect(publicContactSchema.safeParse(contact).success).toBe(true); expect(publicContactSchema.safeParse({ ...contact, email: "bad" }).success).toBe(false); expect(publicBriefSchema.safeParse({ ...contact, projectType: "web", overview: "A full enterprise software project." }).success).toBe(true); expect(publicBookingSchema.safeParse({ ...contact, preferredDate: "2000-01-01", preferredTimeSlot: "09:00", topic: "Discuss software architecture" }).success).toBe(false); });

test("locale defaults and unsupported values fall back to Indonesian", () => { expect(resolveLocale()).toBe("id"); expect(resolveLocale("fr")).toBe("id"); expect(resolveLocale("en")).toBe("en"); });
