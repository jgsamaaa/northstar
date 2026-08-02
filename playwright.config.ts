import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  timeout: 30_000,
  expect: { timeout: 8_000 },
  reporter: "line",
  outputDir: ".diagnostics/playwright-results",
  use: {
    baseURL: "http://127.0.0.1:4190",
    channel: "chrome",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npx next start -p 4190",
    url: "http://127.0.0.1:4190",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});