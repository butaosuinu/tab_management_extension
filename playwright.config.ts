import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: process.env.CI !== undefined && process.env.CI !== "",
  retries: process.env.CI !== undefined && process.env.CI !== "" ? 2 : 0,
  workers: 1,
  reporter:
    process.env.CI !== undefined && process.env.CI !== "" ? "github" : "html",
  timeout: 30000,
  use: {
    trace: "on-first-retry",
  },
});
