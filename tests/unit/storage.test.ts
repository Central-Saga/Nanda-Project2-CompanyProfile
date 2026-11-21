// @vitest-environment node
import { beforeEach, expect, test, vi } from "vitest";
const mocks = vi.hoisted(() => ({ send: vi.fn<(_command: unknown, _options?: unknown) => Promise<Record<string, unknown>>>(async () => ({})) }));
vi.mock("@aws-sdk/client-s3", async (importOriginal) => ({ ...await importOriginal<typeof import("@aws-sdk/client-s3")>(), S3Client: class { send = mocks.send; } }));
import { GetBucketPolicyCommand, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { ensurePrivateBucket, uploadToStorage, deleteFromStorage, downloadFromStorage } from "@/lib/storage";
beforeEach(() => { vi.resetAllMocks(); });
test("private uploads fail closed when public principals are allowed", async () => {
  mocks.send.mockResolvedValueOnce({ Policy: JSON.stringify({ Statement: [{ Effect: "Allow", Principal: { AWS: ["*"] }, Action: "s3:GetObject" }] }) });
  await expect(uploadToStorage({ key: "uploads/a.png", buffer: Buffer.from("image"), mimeType: "image/png" })).rejects.toThrow("privat");
  expect(mocks.send).toHaveBeenCalledTimes(1); expect(mocks.send.mock.calls[0][0]).toBeInstanceOf(GetBucketPolicyCommand);
});
test("missing policy uses S3 private object defaults and never sets a public ACL", async () => {
  mocks.send.mockRejectedValueOnce(Object.assign(new Error(), { name: "NoSuchBucketPolicy" })).mockResolvedValueOnce({});
  const result = await uploadToStorage({ key: "uploads/a.png", buffer: Buffer.from("image"), mimeType: "image/png" });
  expect(result.key).toBe("uploads/a.png"); const command = mocks.send.mock.calls[1][0]; expect(command).toBeInstanceOf(PutObjectCommand);
});
test("unreadable or malformed policy prevents uploads, and authenticated-only grants are allowed", async () => {
  mocks.send.mockRejectedValueOnce(new Error("AccessDenied")); await expect(ensurePrivateBucket()).rejects.toThrow();
  mocks.send.mockResolvedValueOnce({ Policy: "not JSON" }); await expect(ensurePrivateBucket()).rejects.toThrow();
  mocks.send.mockResolvedValueOnce({ Policy: JSON.stringify({ Statement: { Effect: "Allow", Principal: { AWS: "arn:aws:iam::123456789012:role/uploader" } } }) }); await expect(ensurePrivateBucket()).resolves.toBeUndefined();
});
test("storage deletion is explicit and propagates failures", async () => { await deleteFromStorage("uploads/key.png"); expect(mocks.send.mock.calls[0][0]).toBeInstanceOf(DeleteObjectCommand); mocks.send.mockRejectedValueOnce(new Error("unavailable")); await expect(deleteFromStorage("uploads/key.png")).rejects.toThrow(); });

test("authenticated downloads use GetObject and allow no public URL fallback", async () => {
  const body = { Body: "content" }; mocks.send.mockResolvedValueOnce(body);
  expect(await downloadFromStorage("uploads/a.pdf")).toEqual(body); expect(mocks.send.mock.calls[0][0]).toBeInstanceOf(GetObjectCommand);
});
test("NotPrincipal public grants and malformed policies are rejected", async () => {
  for (const policy of [{}, { Statement: [{}] }, { Statement: [{ Effect: "Allow", NotPrincipal: { AWS: "private-role" } }] }]) {
    mocks.send.mockResolvedValueOnce({ Policy: JSON.stringify(policy) }); await expect(ensurePrivateBucket()).rejects.toThrow();
  }
});
