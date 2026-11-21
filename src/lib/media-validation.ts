import { randomUUID } from "node:crypto";

export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// SVG is intentionally excluded: it can contain executable scripts and external resources.
function detectMediaType(buffer: Buffer): { mimeType: string; extension: string } | null {
  if (buffer.length < 12) return null;
  if (buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    return { mimeType: "image/png", extension: "png" };
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mimeType: "image/jpeg", extension: "jpg" };
  }
  if (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
    return { mimeType: "image/webp", extension: "webp" };
  }
  if (buffer.toString("ascii", 0, 5) === "%PDF-" && buffer.subarray(-1024).includes(Buffer.from("%%EOF"))) {
    return { mimeType: "application/pdf", extension: "pdf" };
  }
  return null;
}

export function validateMedia(buffer: Buffer, declaredType: string) {
  if (!buffer.length || buffer.length > MAX_FILE_SIZE) {
    throw new Error("Ukuran file harus antara 1 byte dan 10MB.");
  }
  const detected = detectMediaType(buffer);
  if (!detected || detected.mimeType !== declaredType) {
    throw new Error("Isi file tidak sesuai. Harap unggah JPEG, PNG, WEBP, atau PDF yang valid.");
  }
  return detected;
}

export function createStorageKey(folder: string, extension: string): string {
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(folder) || !/^(jpg|png|webp|pdf)$/.test(extension)) {
    throw new Error("Folder atau ekstensi berkas tidak valid.");
  }
  return `${folder}/${randomUUID()}.${extension}`;
}

export async function validateMediaContents(buffer: Buffer, declaredType: string) {
  const detected = validateMedia(buffer, declaredType);
  if (detected.mimeType.startsWith("image/")) {
    const { default: sharp } = await import("sharp");
    // Decode the entire image, reject decompression bombs, then strip metadata/trailing payloads.
    const clean = await sharp(buffer, { limitInputPixels: 40_000_000, failOn: "warning" }).rotate().toBuffer();
    if (clean.length > MAX_FILE_SIZE) throw new Error("Hasil decoding melebihi 10MB.");
    return { ...detected, buffer: clean };
  }
  const { PDFDocument, PDFDict, PDFName } = await import("pdf-lib");
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: false });
  // Reject action dictionaries, embedded executables and active document hooks, including compressed objects.
  for (const [, object] of pdf.context.enumerateIndirectObjects()) {
    if (object instanceof PDFDict) {
      for (const key of ["JS", "JavaScript", "OpenAction", "AA", "Launch", "EmbeddedFiles", "RichMediaContent"]) {
        if (object.has(PDFName.of(key))) throw new Error("PDF aktif tidak diizinkan.");
      }
      const action = object.get(PDFName.of("S"));
      if (action && ["/JavaScript", "/Launch", "/GoToR", "/SubmitForm", "/ImportData"].includes(action.toString())) throw new Error("Aksi PDF tidak diizinkan.");
    }
  }
  const clean = Buffer.from(await pdf.save());
  if (clean.length > MAX_FILE_SIZE) throw new Error("Hasil normalisasi melebihi 10MB.");
  return { ...detected, buffer: clean };
}
