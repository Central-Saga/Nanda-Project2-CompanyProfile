import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";

const patterns = [
  ["missing-test-dependency", /Cannot find module ['"](?:vitest|@playwright\/test|@testing-library|@lhci|msw)/i],
  ["missing-dependency", /Cannot find module|Module not found|Could not resolve/i],
  ["typescript", /Type error:|error TS\d+/],
  ["invalid-url", /Invalid URL|ERR_INVALID_URL/],
  ["font-download", /Failed to fetch.*(?:font|Geist)|next\/font.*error|unable to verify.*certificate/i],
  ["database", /PrismaClient|database server|ECONNREFUSED|P1001|P2021/],
  ["missing-auth-secret", /AUTH_SECRET.*(?:32|required|wajib)/],
  ["memory-limit", /out of memory|heap limit|SIGKILL/i],
];

for (const [stage, entry, args] of [
  ["prisma-generate", "prisma/build/index.js", ["generate"]],
  ["next-build", "next/dist/bin/next", ["build"]],
]) {
  let output = "";
  const child = spawn(process.execPath, [`node_modules/${entry}`, ...args], { stdio: ["inherit", "pipe", "pipe"] });
  for (const [stream, destination] of [[child.stdout, process.stdout], [child.stderr, process.stderr]]) {
    stream.on("data", (chunk) => {
      destination.write(chunk);
      output = (output + chunk.toString()).slice(-128_000);
    });
  }
  const code = await new Promise((resolve, reject) => { child.on("error", reject); child.on("close", resolve); });
  if (code !== 0) {
    const categories = patterns.filter(([, pattern]) => pattern.test(output)).map(([name]) => name);
    await mkdir(".netlify", { recursive: true });
    await writeFile(".netlify/build-diagnostics.json", JSON.stringify({ stage, categories }));
    process.exit(typeof code === "number" ? code : 1);
  }
}
