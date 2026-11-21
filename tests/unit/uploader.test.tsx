import { expect, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
vi.mock("@/app/actions/media", () => ({ uploadMediaAction: vi.fn() }));
import { uploadMediaAction } from "@/app/actions/media";
import { MediaUploader } from "@/app/admin/(dashboard)/media/MediaUploader";
test("file upload failure is recoverable with the selected file and callback fires only on success", async () => {
  const callback = vi.fn();
  vi.mocked(uploadMediaAction).mockResolvedValueOnce({ success: false, error: "Storage tidak tersedia" }).mockResolvedValueOnce({ success: true, data: { id: "media-id", url: "/private", key: "uploads/random.png", originalName: "image.png" } });
  render(<MediaUploader onUploaded={callback} />);
  await userEvent.upload(screen.getByLabelText("Pilih berkas gambar atau PDF"), new File(["image"], "image.png", { type: "image/png" }));
  await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("Storage tidak tersedia")); expect(callback).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole("button", { name: "Coba lagi" }));
  await waitFor(() => expect(screen.getByRole("status").textContent).toContain("berhasil")); expect(callback).toHaveBeenCalledTimes(1);
});
