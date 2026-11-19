import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Pagination } from "@/components/shared/ui/Pagination";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { EmptyState } from "@/components/admin/EmptyState";
import { PageHeader } from "@/components/admin/PageHeader";
import { ThemeToggle } from "@/components/public/ThemeToggle";
import { LocaleSwitcher } from "@/components/public/LocaleSwitcher";
import userEvent from "@testing-library/user-event";
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
test("pagination exposes correct previous and next URLs", () => { render(<Pagination page={2} hasNext />); expect(screen.getByRole("link", { name: "Sebelumnya" }).getAttribute("href")).toBe("?page=1"); expect(screen.getByRole("link", { name: "Berikutnya" }).getAttribute("href")).toBe("?page=3"); });
test("pending submit button is disabled with a meaningful label", () => { render(<SubmitButton pending />); expect(screen.getByRole("button").hasAttribute("disabled")).toBe(true); expect(screen.getByRole("button").textContent).toContain("Menyimpan"); });
test("empty views and page headers retain navigable actions", () => { render(<><PageHeader title="Services" description="Manage content" /><EmptyState title="Empty" description="No services" actionHref="/admin/services/new" actionLabel="Create" /></>); expect(screen.getByRole("heading", { name: "Services" })).toBeDefined(); expect(screen.getByRole("link", { name: "Create" }).getAttribute("href")).toBe("/admin/services/new"); });
test("theme changes without replacing document or context state", async () => { render(<ThemeToggle initialTheme="dark" />); await userEvent.click(screen.getByRole("button")); expect(document.documentElement.dataset.theme).toBe("light"); await userEvent.click(screen.getByRole("button")); expect(document.documentElement.dataset.theme).toBe("dark"); });
test("locale updates a preference cookie without navigation", async () => { render(<LocaleSwitcher locale="id" />); await userEvent.selectOptions(screen.getByRole("combobox"), "en"); expect(document.cookie).toContain("locale=en"); });
test("a local preference change does not rerender unrelated siblings", async () => {
  let renders = 0;
  function Sibling() { renders++; return <p>Unrelated content</p>; }
  render(<><ThemeToggle initialTheme="dark" /><Sibling /></>); const initial = renders;
  await userEvent.click(screen.getByRole("button")); expect(renders).toBe(initial);
});
