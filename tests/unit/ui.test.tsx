import { expect, test, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormField } from "@/components/admin/FormField";
import { OfflineBanner } from "@/components/shared/OfflineBanner";
import { ConfirmDialog } from "@/components/shared/ui/ConfirmDialog";
import { StatusSelector } from "@/components/admin/StatusSelector";
import { SmartForm } from "@/components/shared/SmartForm";
import { apiRequest } from "@/lib/api/client";
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }) }));
vi.mock("@/lib/api/client", () => ({ apiRequest: vi.fn(), ApiRequestError: class extends Error {} }));
test("form fields expose errors and help through accessible relationships", () => {
  render(<FormField label="Email" name="email" errors={["Tidak valid"]} hint="Email perusahaan" />);
  const input = screen.getByLabelText("Email"); expect(input.getAttribute("aria-invalid")).toBe("true"); expect(input.getAttribute("aria-describedby")).toBe("email-hint email-errors"); expect(screen.getByRole("alert").textContent).toContain("Tidak valid");
});
test("offline status is reactive and clears on reconnect", () => {
  Object.defineProperty(navigator, "onLine", { value: true, configurable: true }); render(<OfflineBanner />);
  expect(screen.queryByRole("status")).toBeNull(); Object.defineProperty(navigator, "onLine", { value: false, configurable: true }); fireEvent(window, new Event("offline"));
  expect(screen.getByRole("status").textContent).toContain("terputus"); Object.defineProperty(navigator, "onLine", { value: true, configurable: true }); fireEvent(window, new Event("online")); expect(screen.queryByRole("status")).toBeNull();
});
test("confirmation dialog invokes cancellation and confirmation", async () => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); }; HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
  const cancel = vi.fn(), confirm = vi.fn(); render(<ConfirmDialog open title="Hapus data?" description="Konfirmasi penghapusan" onCancel={cancel} onConfirm={confirm} />);
  expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBe("true");
  await userEvent.click(screen.getByRole("button", { name: "Batal" })); expect(cancel).toHaveBeenCalledTimes(1);
  await userEvent.click(screen.getByRole("button", { name: "Lanjutkan" })); expect(confirm).toHaveBeenCalledTimes(1);
});
test("optimistic status rolls back when server rejects it and manual retry succeeds", async () => {
  vi.mocked(apiRequest).mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce({ success: true, message: "Saved" });
  render(<StatusSelector id="id" resource="leads" currentStatus="new" options={["new", "won"]} />);
  await userEvent.selectOptions(screen.getByRole("combobox"), "won");
  await waitFor(() => expect(screen.getByRole("combobox").getAttribute("disabled")).toBeNull());
  expect((screen.getByRole("combobox") as HTMLSelectElement).value).toBe("new");
  await userEvent.click(screen.getByRole("button", { name: "Coba lagi" }));
  await waitFor(() => expect((screen.getByRole("combobox") as HTMLSelectElement).value).toBe("won"));
});
test("form prevents concurrent duplicate submissions and resets on success", () => {
  const action = vi.fn(); const { rerender } = render(<SmartForm action={action}><input aria-label="Nama" name="name" /><button>Simpan</button></SmartForm>);
  const form = screen.getByRole("button").closest("form")!;
  fireEvent.change(screen.getByLabelText("Nama"), { target: { value: "Example" } }); fireEvent.submit(form); fireEvent.submit(form); expect(action).toHaveBeenCalledTimes(1);
  rerender(<SmartForm action={action} success><input aria-label="Nama" name="name" /><button>Simpan</button></SmartForm>); expect((screen.getByLabelText("Nama") as HTMLInputElement).value).toBe("");
});
