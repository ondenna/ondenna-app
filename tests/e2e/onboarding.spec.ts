import { expect, test, type Page } from "@playwright/test";

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
  await expect(
    page.getByRole("heading", { name: "When does your season begin?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();

  // Review & commit
  await expect(
    page.getByRole("heading", { name: "Ready to begin this season?" }),
  ).toBeVisible();
  await expect(page.getByText("Sleep before midnight")).toBeVisible();
  await expect(
    page.getByText("I want calm mornings and more energy."),
  ).toBeVisible();
  await expect(page.getByText("Every season lasts 28 days.")).toBeVisible();
  await expect(
    page.getByText(
      "Your season focus cannot be edited once the season begins.",
    ),
  ).toBeVisible();
  await page.getByRole("button", { name: "Begin season" }).click();

  // Empty dashboard
  await expect(page).toHaveURL(/\/en\/today$/);
  await expect(page.getByText("Day 1 of 28")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Sleep before midnight" }),
  ).toBeVisible();
  // Check-in does not exist yet, so Today says so in words rather than
  // offering a dead control. Replaces the old disabled-button assertion.
  await expect(page.getByText("Today's check-in opens soon.")).toBeVisible();
  await expect(
    page.getByText("Nothing else is needed from you today."),
  ).toBeVisible();
  // Scoped to the app's own region: the dev server injects its own toolbar
  // button into the page, which is not part of the interface under test.
  await expect(page.getByRole("main").getByRole("button")).toHaveCount(0);
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

// Steps cross-fade, so two of them are briefly mounted at once. Waiting for
// the incoming heading before the next click keeps these journeys off the
// transition boundary.
async function fillAnswersUpToReview(
  page: Page,
  copy: {
    locale: string;
    begin: string;
    next: string;
    whyQuestion: string;
    dateQuestion: string;
    reviewQuestion: string;
  },
  answers: { focus: string; why: string },
) {
  await page.goto(`/${copy.locale}/onboarding`);
  await page.getByRole("button", { name: copy.begin }).click();

  await page.getByRole("textbox").fill(answers.focus);
  await page.getByRole("button", { name: copy.next }).click();
  await expect(
    page.getByRole("heading", { name: copy.whyQuestion }),
  ).toBeVisible();

  await page.getByRole("textbox").fill(answers.why);
  await page.getByRole("button", { name: copy.next }).click();
  await expect(
    page.getByRole("heading", { name: copy.dateQuestion }),
  ).toBeVisible();

  await page.getByRole("button", { name: copy.next }).click();
  await expect(
    page.getByRole("heading", { name: copy.reviewQuestion }),
  ).toBeVisible();
}

const EN = {
  locale: "en",
  begin: "Start your first season",
  next: "Continue",
  whyQuestion: "Why is this important to you?",
  dateQuestion: "When does your season begin?",
  reviewQuestion: "Ready to begin this season?",
};

test("going back from review keeps every answer", async ({ page }) => {
  const answers = {
    focus: "Sleep before midnight",
    why: "I want calm mornings and more energy.",
  };
  await fillAnswersUpToReview(page, EN, answers);

  // Review -> date, via the secondary action.
  await page.getByRole("button", { name: "Go back and edit" }).click();
  await expect(
    page.getByRole("heading", { name: EN.dateQuestion }),
  ).toBeVisible();

  // date -> why -> focus, via the header back button. Nothing is lost.
  await page.getByRole("button", { name: "Back" }).click();
  await expect(page.getByRole("textbox")).toHaveValue(answers.why);
  await page.getByRole("button", { name: "Back" }).click();
  await expect(page.getByRole("textbox")).toHaveValue(answers.focus);

  // Forward again: the review still shows the original answers.
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(
    page.getByRole("heading", { name: EN.whyQuestion }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(
    page.getByRole("heading", { name: EN.dateQuestion }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByText(answers.focus)).toBeVisible();
  await expect(page.getByText(answers.why)).toBeVisible();
});

test("the review step is reachable and committable by keyboard", async ({
  page,
}) => {
  await fillAnswersUpToReview(page, EN, {
    focus: "Write every morning",
    why: "Because it clears my head.",
  });

  const begin = page.getByRole("button", { name: "Begin season" });
  await begin.focus();
  await expect(begin).toBeFocused();
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/\/en\/today$/);
});

test("the review step is fully translated in Turkish", async ({ page }) => {
  await fillAnswersUpToReview(
    page,
    {
      locale: "tr",
      begin: "İlk sezonunu başlat",
      next: "Devam et",
      whyQuestion: "Bu senin için neden önemli?",
      dateQuestion: "Sezonun ne zaman başlıyor?",
      reviewQuestion: "Bu sezona başlamaya hazır mısın?",
    },
    {
      focus: "Gece yarısından önce uyumak",
      why: "Sabahlarımı sakinleştirmek istiyorum.",
    },
  );

  await expect(page.getByText("Her sezon 28 gün sürer.")).toBeVisible();
  await expect(
    page.getByText("Sezon odağın, sezon başladıktan sonra düzenlenemez."),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Sezonu başlat" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Geri dön ve düzenle" }),
  ).toBeVisible();
});

test("visiting the dashboard without a season returns to onboarding", async ({
  page,
}) => {
  await page.goto("/en/today");
  await expect(page).toHaveURL(/\/en\/onboarding$/);
});
