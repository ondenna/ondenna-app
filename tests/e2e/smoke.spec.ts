import { expect, test } from "@playwright/test";

test("splash shows the wordmark, then continues to onboarding", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Ondenna" })).toBeVisible();
  await expect(page).toHaveURL(/\/en\/onboarding$/);
});

test("serves the Turkish locale", async ({ page }) => {
  await page.goto("/tr");
  await expect(page.getByRole("heading", { name: "Ondenna" })).toBeVisible();
});
