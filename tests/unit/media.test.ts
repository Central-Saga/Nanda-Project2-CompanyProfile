// @vitest-environment node
import { expect, test } from "vitest";
import sharp from "sharp";
import { PDFDocument, PDFName, PDFString } from "pdf-lib";
import { validateMediaContents } from "@/lib/media-validation";
test("fully decodes images and rejects spoofed or truncated payloads", async () => {
  const buffer = await sharp({ create: { width: 2, height: 2, channels: 3, background: "red" } }).png().toBuffer();
  expect((await validateMediaContents(buffer, "image/png")).extension).toBe("png");
  await expect(validateMediaContents(buffer.subarray(0, 12), "image/png")).rejects.toBeDefined();
  await expect(validateMediaContents(buffer, "image/jpeg")).rejects.toBeDefined();
});
test("parses PDF objects and rejects executable actions", async () => {
  const pdf = await PDFDocument.create(); pdf.addPage();
  const clean = Buffer.from(await pdf.save()); expect((await validateMediaContents(clean, "application/pdf")).extension).toBe("pdf");
  const action = pdf.context.obj({ Type: "Action", S: "JavaScript", JS: PDFString.of("app.alert(1)") });
  pdf.catalog.set(PDFName.of("OpenAction"), pdf.context.register(action));
  await expect(validateMediaContents(Buffer.from(await pdf.save()), "application/pdf")).rejects.toBeDefined();
});
test("all image formats decode safely and storage metadata rejects invalid input", async () => {
  const { validateMedia, createStorageKey } = await import("@/lib/media-validation");
  const image = sharp({ create: { width: 2, height: 2, channels: 3, background: "blue" } });
  expect((await validateMediaContents(await image.clone().jpeg().toBuffer(), "image/jpeg")).extension).toBe("jpg");
  expect((await validateMediaContents(await image.clone().webp().toBuffer(), "image/webp")).extension).toBe("webp");
  expect(() => validateMedia(Buffer.alloc(0), "image/png")).toThrow(); expect(() => validateMedia(Buffer.alloc(10 * 1024 * 1024 + 1), "image/png")).toThrow();
  expect(() => validateMedia(Buffer.from("<svg onload='attack'/>"), "image/svg+xml")).toThrow();
  expect(createStorageKey("uploads", "png")).toMatch(/^uploads\/[a-f0-9-]{36}\.png$/);
  expect(() => createStorageKey("../public", "png")).toThrow(); expect(() => createStorageKey("uploads", "html")).toThrow();
});
