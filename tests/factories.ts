import { randomUUID } from "node:crypto";
export function contactFactory(overrides = {}) {
  return { fullName: "Audit Visitor", email: `audit-${randomUUID()}@example.test`, phone: "", companyName: "", subject: "Audit consultation", message: "Please contact us about our new project.", consentPrivacy: true, ...overrides };
}
export function serviceFactory(index: number) { return { slug: `audit-service-${String(index).padStart(2, "0")}`, isPublished: true, sortOrder: index, translations: { create: { locale: "id", name: `Audit Service ${index}`, summary: "Software engineering service" } } }; }
