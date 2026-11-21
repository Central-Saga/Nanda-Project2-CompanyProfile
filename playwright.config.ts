import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e", timeout: 45000, workers: 1, fullyParallel: false,
  use: { baseURL: process.env.E2E_BASE_URL || "http://127.0.0.1:3100", trace: "retain-on-failure" },
  // Keep Chromium-native mobile/touch emulation without changing the visual baseline viewport.
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }, { name: "mobile", use: { ...devices["Pixel 7"], viewport: { width: 390, height: 664 } } }],
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01 } },
  reporter: [["list"], ["html", { open: "never" }]],
});
