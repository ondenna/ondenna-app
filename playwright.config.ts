import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  // The dev server compiles routes on demand; first hits can take several
  // seconds, so assertions get generous timeouts.
  expect: { timeout: 15_000 },
  forbidOnly: !!process.env.CI,
  // Capped at 2 locally and in CI. The suite runs against the Next.js dev
  // server, and more parallel workers than that overwhelm Turbopack's
  // on-demand compilation: requests fail while a route is still building,
  // which surfaces as tests timing out on initial page render, with a
  // different set failing each run. Two workers keeps all 18 tests green.
  workers: 2,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  // Mobile first: the primary experience is a small phone viewport.
  projects: [
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
