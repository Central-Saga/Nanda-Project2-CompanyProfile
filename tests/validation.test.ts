import assert from "node:assert/strict";
import { test } from "node:test";
import { loginSchema, changePasswordSchema } from "../src/lib/validations/auth";
import { publicContactSchema, publicBookingSchema, publicBriefSchema } from "../src/lib/validations/public";
import { serviceSchema, projectSchema, postSchema } from "../src/lib/validations/crud";

const contact = { fullName: "Test Visitor", email: "visitor@example.test", subject: "Test request", message: "Please contact me about this project.", consentPrivacy: true };

test("contact validation accepts valid submissions and rejects invalid fields", () => {
  assert.equal(publicContactSchema.safeParse(contact).success, true);
  for (const input of [{ ...contact, email: "invalid" }, { ...contact, consentPrivacy: false }, { ...contact, message: "short" }, { ...contact, websiteUrl: "spam" }]) {
    assert.equal(publicContactSchema.safeParse(input).success, false);
  }
  const result = publicContactSchema.safeParse({ ...contact, email: "bad" });
  if (!result.success) assert.ok(result.error.flatten().fieldErrors.email?.length);
});

test("booking rejects impossible and past dates", () => {
  const booking = { ...contact, preferredDate: "2099-12-01", preferredTimeSlot: "09:00 - 10:00", topic: "Discuss our new project" };
  assert.equal(publicBookingSchema.safeParse(booking).success, true);
  for (const preferredDate of ["not-a-date", "2000-01-01"]) assert.equal(publicBookingSchema.safeParse({ ...booking, preferredDate }).success, false);
});

test("brief accepts only known project types", () => {
  const brief = { ...contact, overview: "We need a new enterprise application.", projectType: "web" };
  assert.equal(publicBriefSchema.safeParse(brief).success, true);
  assert.equal(publicBriefSchema.safeParse({ ...brief, projectType: "unknown" }).success, false);
});

test("authentication validates email, complexity and confirmation", () => {
  assert.equal(loginSchema.safeParse({ email: "invalid", password: "" }).success, false);
  const data = { currentPassword: "OldPassword1", newPassword: "NewPassword2", confirmPassword: "NewPassword2" };
  assert.equal(changePasswordSchema.safeParse(data).success, true);
  assert.equal(changePasswordSchema.safeParse({ ...data, confirmPassword: "mismatch" }).success, false);
  assert.equal(changePasswordSchema.safeParse({ ...data, newPassword: "weak" }).success, false);
});

test("content validation rejects unsafe slugs and unknown publication states", () => {
  assert.equal(serviceSchema.safeParse({ slug: "valid-slug", name: "Service" }).success, true);
  assert.equal(serviceSchema.safeParse({ slug: "../admin", name: "Service" }).success, false);
  assert.equal(projectSchema.safeParse({ slug: "project", title: "Project", projectUrl: "not a url" }).success, false);
  assert.equal(postSchema.safeParse({ slug: "post", title: "Post", content: "Text", status: "unknown" }).success, false);
});
