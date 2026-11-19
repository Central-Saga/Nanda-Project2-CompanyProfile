import { defineConfig } from "vitest/config";
import path from "node:path";
export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: { include: ["tests/unit/**/*.test.ts", "tests/unit/**/*.test.tsx"], environment: "jsdom", setupFiles: ["tests/unit/setup.ts"],
    coverage: { provider: "v8", reporter: ["text", "json-summary", "lcov"], include: ["src/lib/**/*.ts", "src/types/**/*.ts", "src/components/**/*.tsx", "src/app/actions/**/*.ts"], exclude: ["src/lib/prisma.ts", "src/lib/storage.ts"], thresholds: { lines: 60, functions: 60, statements: 60, branches: 60, "src/lib/auth.ts": { lines: 80 }, "src/lib/session.ts": { lines: 80 }, "src/lib/media-validation.ts": { lines: 80 }, "src/lib/api/client.ts": { lines: 80 } } } },
});
