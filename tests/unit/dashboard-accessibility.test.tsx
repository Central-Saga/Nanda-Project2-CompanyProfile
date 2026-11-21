import { beforeEach, expect, test, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import DashboardPage from "@/app/admin/(dashboard)/page";
import AdminLayout from "@/app/admin/(dashboard)/layout";

const db = vi.hoisted(() => ({
  service: { count: vi.fn() },
  project: { count: vi.fn() },
  post: { count: vi.fn() },
  jobOpening: { count: vi.fn() },
  lead: { count: vi.fn(), findMany: vi.fn() },
  consultationBooking: { count: vi.fn(), findMany: vi.fn() },
  mediaFile: { count: vi.fn() },
  auditLog: { findMany: vi.fn() },
}));

vi.mock("@/lib/prisma", () => ({ prisma: db }));
vi.mock("@/lib/auth", () => ({
  requireAuth: vi.fn(),
  getCurrentUser: vi.fn().mockResolvedValue({
    fullName: "Test Admin", email: "admin@example.test", role: "ADMIN", mustChangePassword: false,
  }),
}));
vi.mock("@/app/actions/auth", () => ({ logoutAction: vi.fn() }));

beforeEach(() => {
  for (const model of Object.values(db)) {
    if ("count" in model) model.count.mockResolvedValue(0);
    if ("findMany" in model) model.findMany.mockResolvedValue([]);
  }
});

test.each([
  { model: "lead" as const, label: "Total Inbound Leads", href: "/admin/leads" },
  { model: "consultationBooking" as const, label: "Jadwal Konsultasi", href: "/admin/bookings" },
])("$label alert communicates meaning without color", async ({ model, label, href }) => {
  db[model].count.mockResolvedValue(2);
  render(await DashboardPage());

  const card = screen.getByRole("link", { name: `${label} 2 Perlu ditinjau` });
  expect(card.getAttribute("href")).toBe(href);
  const notice = within(card).getByText("Perlu ditinjau");
  expect(notice.classList.contains("sr-only")).toBe(false);
  expect(notice.closest('[aria-hidden="true"]')).toBeNull();
  expect(card.querySelector(".bg-red-600")?.getAttribute("aria-hidden")).toBe("true");
});

test("admin console decoration is hidden from assistive technology", async () => {
  render(await AdminLayout({ children: <p>Dashboard content</p> }));

  const consoleLabel = screen.getByText("Admin Console");
  const dot = consoleLabel.parentElement?.querySelector(".bg-red-600");
  expect(dot).not.toBeNull();
  expect(dot?.getAttribute("aria-hidden")).toBe("true");
});

test("zero-count cards do not communicate an alert", async () => {
  render(await DashboardPage());

  expect(screen.getByRole("link", { name: "Total Inbound Leads 0" }).getAttribute("href")).toBe("/admin/leads");
  expect(screen.getByRole("link", { name: "Jadwal Konsultasi 0" }).getAttribute("href")).toBe("/admin/bookings");
  expect(screen.queryByText("Perlu ditinjau")).toBeNull();
});
