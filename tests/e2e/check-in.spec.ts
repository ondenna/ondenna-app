import { expect, test } from "@playwright/test";

// Steps cross-fade (see tests/e2e/onboarding.spec.ts), so two are briefly
// mounted at once. Waiting for each incoming heading before the next click
// keeps this off the transition boundary, the same as that suite does.
async function completeOnboarding(page: import("@playwright/test").Page) {
  await page.goto("/en/onboarding");
  await page.getByRole("button", { name: "Start your first season" }).click();

  await expect(
    page.getByRole("heading", {
      name: "What do you want to change this season?",
    }),
  ).toBeVisible();
  await page.getByRole("textbox").fill("Sleep before midnight");
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(
    page.getByRole("heading", { name: "Why is this important to you?" }),
  ).toBeVisible();
  await page.getByRole("textbox").fill("I want calm mornings and more energy.");
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(
    page.getByRole("heading", { name: "When does your season begin?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click(); // start date defaults to today

  await expect(
    page.getByRole("heading", { name: "Ready to begin this season?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Begin season" }).click();

  await expect(page).toHaveURL(/\/en\/today$/);
}

test("completes today's check-in, survives a reload, and can be edited", async ({
  page,
}) => {
  await completeOnboarding(page);

  // Select an answer.
  await page.getByRole("radio", { name: "Yes" }).click();

  // Optionally add a note.
  await page.getByRole("button", { name: "Add a note" }).click();
  await page.getByPlaceholder(/short note/).fill("Slept before midnight.");

  // Save.
  await page.getByRole("button", { name: "Save check-in" }).click();

  // Calm completed state — no celebration, just the record.
  await expect(page.getByText("Today is recorded.")).toBeVisible();
  await expect(page.getByText("You answered yes.")).toBeVisible();
  await expect(page.getByText("Slept before midnight.")).toBeVisible();

  // Reload: the check-in must survive, per docs/architecture.md's client
  // persistence boundary.
  await page.reload();
  await expect(page.getByText("Today is recorded.")).toBeVisible();
  await expect(page.getByText("You answered yes.")).toBeVisible();
  await expect(page.getByText("Slept before midnight.")).toBeVisible();

  // Edit the record.
  await page.getByRole("button", { name: "Edit" }).click();
  await expect(page.getByRole("radio", { name: "Yes" })).toBeChecked();
  await page.getByRole("radio", { name: "No" }).click();
  await page.getByRole("button", { name: "Save check-in" }).click();
  await expect(page.getByText("You answered no.")).toBeVisible();

  // Reload again: the edit must also survive.
  await page.reload();
  await expect(page.getByText("You answered no.")).toBeVisible();
});

test("requires an answer before saving", async ({ page }) => {
  await completeOnboarding(page);

  await page.getByRole("button", { name: "Save check-in" }).click();

  await expect(page.getByText("Choose yes or no to save.")).toBeVisible();
  await expect(page.getByText("Today is recorded.")).toHaveCount(0);
});

test("cancelling an edit leaves the saved record unchanged", async ({
  page,
}) => {
  await completeOnboarding(page);

  await page.getByRole("radio", { name: "Yes" }).click();
  await page.getByRole("button", { name: "Save check-in" }).click();

  await page.getByRole("button", { name: "Edit" }).click();
  await page.getByRole("radio", { name: "No" }).click();
  await page.getByRole("button", { name: "Cancel" }).click();

  await expect(page.getByText("You answered yes.")).toBeVisible();
});

test("yesterday can be added once it falls inside the season, using a deterministic clock", async ({
  page,
}) => {
  // Real-clock yesterday scenarios are flaky by construction (they depend on
  // the moment the suite happens to run), so the clock is fixed instead —
  // deterministic without touching the system clock.
  await page.clock.setFixedTime(new Date(2026, 2, 10, 9, 0, 0));
  await completeOnboarding(page);

  await expect(page.getByText("Day 1 of 28")).toBeVisible();
  await expect(page.getByRole("button", { name: "Add yesterday" })).toHaveCount(
    0,
  );

  // Advance one day and reload, the same as opening the app tomorrow.
  await page.clock.setFixedTime(new Date(2026, 2, 11, 9, 0, 0));
  await page.reload();
  await expect(page.getByText("Day 2 of 28")).toBeVisible();

  await page.getByRole("button", { name: "Add yesterday" }).click();
  await expect(page.getByText(/Recording yesterday,/)).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Did yesterday feel true?" }),
  ).toBeVisible();

  await page.getByRole("radio", { name: "No" }).click();
  await page.getByRole("button", { name: "Save check-in" }).click();

  // Back on today's own state after saving yesterday.
  await expect(
    page.getByRole("heading", { name: "Did this feel true today?" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Edit yesterday" }),
  ).toBeVisible();

  await page.reload();
  await expect(
    page.getByRole("button", { name: "Edit yesterday" }),
  ).toBeVisible();
});
