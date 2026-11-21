import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export function createCsp(nonce: string, development = false) {
  const imageStyle = createHash("sha256").update("color:transparent").digest("base64");
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${development ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'nonce-${nonce}'`,
    `style-src-attr 'unsafe-hashes' 'sha256-${imageStyle}'`,
    "img-src 'self' data: blob: https:", "font-src 'self'", "connect-src 'self'",
    "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'",
  ].join("; ");
}

export function newCsrfToken() { return randomBytes(32).toString("hex"); }
export function validCsrf(cookie: string | undefined, header: string | null) {
  if (!cookie || !header || !/^[a-f0-9]{64}$/.test(cookie) || !/^[a-f0-9]{64}$/.test(header)) return false;
  return timingSafeEqual(Buffer.from(cookie), Buffer.from(header));
}
