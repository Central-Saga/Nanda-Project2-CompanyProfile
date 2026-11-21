import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import path from "node:path";
async function main() {
  const origin = process.env.BUNDLE_BASE_URL || "http://127.0.0.1:3100";
  let failed = false;
  for (const route of ["/", "/admin/login", "/kontak", "/blog"]) {
    const response = await fetch(new URL(route, origin));
    if (!response.ok) throw new Error(`Cannot measure ${route}: HTTP ${response.status}`);
    const html = await response.text();
    const assets = [...new Set([...html.matchAll(/<script[^>]+src="([^"]+\.js[^\"]*)"/g)].map((match) => new URL(match[1].replaceAll("&amp;", "&"), origin).pathname))];
    if (!assets.length) throw new Error(`No script assets detected for ${route}`);
    const files = assets.map((asset) => {
      if (!asset.startsWith("/_next/static/") || asset.includes("..")) throw new Error("Unexpected asset path");
      return path.join(".next", asset.slice("/_next/".length));
    });
    const bytes = files.reduce((sum, file) => sum + gzipSync(readFileSync(file)).byteLength, 0);
    process.stdout.write(`${route}: ${(bytes / 1024).toFixed(1)} KB gzip across ${assets.length} initial scripts; budget 200 KB\n`);
    if (bytes > 200 * 1024) failed = true;
  }
  if (failed) process.exitCode = 1;
}
void main();
