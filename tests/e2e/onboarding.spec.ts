import { expect, test } from "@playwright/test";

test("completes onboarding and lands on the empty dashboard", async ({
  page,
}) => {
  await page.goto("/en/onboarding");

  // Welcome
  await page.getByRole("button", { name: "Start your first season" }).click();

  // Season focus
  await expect(
    page.getByRole("heading", {
      name: "What do you want to change this season?",
    }),
  ).toBeVisible();
  await page.getByRole("textbox").fill("Sleep before midnight");
  await page.getByRole("button", { name: "Continue" }).click();

  // Why
  await expect(
    page.getByRole("heading", { name: "Why is this important to you?" }),
  ).toBeVisible();
  await page.getByRole("textbox").fill("I want calm mornings and more energy.");
  await page.getByRole("button", { name: "Continue" }).click();

  // Start date (defaults to today)
  await page.getByRole("button", { name: "Begin season" }).click();

  // Empty dashboard
  await expect(page).toHaveURL(/\/en\/today$/);
  await expect(page.getByText("Day 1 of 28")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Sleep before midnight" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Check in" })).toBeDisabled();
});

test("empty focus shows a calm validation message", async ({ page }) => {
  await page.goto("/en/onboarding");
  await page.getByRole("button", { name: "Start your first season" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(
    page.getByText("Write a few words about your change."),
  ).toBeVisible();
});

test("an example suggestion fills the focus field", async ({ page }) => {
  await page.goto("/en/onboarding");
  await page.getByRole("button", { name: "Start your first season" }).click();
  await page.getByRole("button", { name: "Write every morning" }).click();
  await expect(page.getByRole("textbox")).toHaveValue("Write every morning");
});

test("visiting the dashboard without a season returns to onboarding", async ({
  page,
}) => {
  await page.goto("/en/today");
  await expect(page).toHaveURL(/\/en\/onboarding$/);
});
