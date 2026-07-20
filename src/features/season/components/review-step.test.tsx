import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ReviewStep } from "@/features/season/components/review-step";
import en from "@/messages/en.json";
import { useSeasonDraftStore } from "@/stores/season-draft";

const replace = vi.fn();
vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ replace }),
}));

function renderReview(onBack = vi.fn()) {
  return render(
    <NextIntlClientProvider locale="en" messages={en} timeZone="UTC">
      <ReviewStep onBack={onBack} />
    </NextIntlClientProvider>,
  );
}

describe("ReviewStep", () => {
  // This project does not enable Vitest globals, so Testing Library's
  // automatic cleanup does not run. Unmount explicitly between tests.
  afterEach(cleanup);

  beforeEach(() => {
    replace.mockClear();
    useSeasonDraftStore.getState().reset();
    useSeasonDraftStore.setState({
      draft: {
        focus: "Sleep before midnight",
        why: "I want calm mornings.",
        startDate: "2026-03-01",
      },
    });
  });

  it("reads the whole draft back to the user", () => {
    renderReview();

    expect(screen.getByText("Sleep before midnight")).toBeInTheDocument();
    expect(screen.getByText("I want calm mornings.")).toBeInTheDocument();
    expect(screen.getByText("March 1, 2026")).toBeInTheDocument();
    // Season length is 28 days inclusive, so the last day is start + 27.
    expect(screen.getByText("March 28, 2026")).toBeInTheDocument();
  });

  it("shows the season length and the edit-lock notice", () => {
    renderReview();

    expect(screen.getByText("Every season lasts 28 days.")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Your season focus cannot be edited once the season begins.",
      ),
    ).toBeInTheDocument();
  });

  it("describes the primary action with the edit-lock notice", () => {
    renderReview();

    const begin = screen.getByRole("button", { name: "Begin season" });
    const noticeId = begin.getAttribute("aria-describedby");
    expect(noticeId).toBeTruthy();
    expect(document.getElementById(noticeId!)).toHaveTextContent(
      "cannot be edited once the season begins",
    );
  });

  it("starts the season and routes to today", async () => {
    const user = userEvent.setup();
    renderReview();

    await user.click(screen.getByRole("button", { name: "Begin season" }));

    expect(useSeasonDraftStore.getState().hasStarted).toBe(true);
    expect(replace).toHaveBeenCalledWith("/today");
  });

  it("goes back to edit without starting the season", async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    renderReview(onBack);

    await user.click(
      screen.getByRole("button", { name: "Go back and edit" }),
    );

    expect(onBack).toHaveBeenCalledOnce();
    expect(useSeasonDraftStore.getState().hasStarted).toBe(false);
    expect(replace).not.toHaveBeenCalled();
  });
});
