import { cleanup, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TodayDashboard } from "@/features/check-in/components/today-dashboard";
import { addDays, isoDateToday } from "@/lib/dates";
import en from "@/messages/en.json";
import { useSeasonDraftStore } from "@/stores/season-draft";

const replace = vi.fn();
vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ replace }),
}));

/**
 * States are set up by moving the season's *start date* relative to today,
 * which is how the product itself derives them — no clock mocking, and the
 * test stays true on any day it runs.
 */
function renderDashboard({
  startsInDays,
  focus = "Sleep before midnight",
}: {
  startsInDays: number;
  focus?: string;
}) {
  useSeasonDraftStore.setState({
    draft: {
      focus,
      why: "I want calm mornings.",
      startDate: addDays(isoDateToday(), startsInDays),
    },
    hasStarted: true,
  });

  return render(
    <NextIntlClientProvider locale="en" messages={en} timeZone="UTC">
      <TodayDashboard />
    </NextIntlClientProvider>,
  );
}

describe("TodayDashboard", () => {
  // This project does not enable Vitest globals, so Testing Library's
  // automatic cleanup does not run. Unmount explicitly between tests.
  afterEach(cleanup);

  beforeEach(() => {
    replace.mockClear();
    useSeasonDraftStore.getState().reset();
  });

  it("makes the season focus the heading in every state", () => {
    for (const startsInDays of [7, 0, -40]) {
      renderDashboard({ startsInDays });
      expect(
        screen.getByRole("heading", {
          level: 1,
          name: "Sleep before midnight",
        }),
      ).toBeInTheDocument();
      cleanup();
    }
  });

  describe("before the season starts", () => {
    it("says when it begins and that nothing is expected yet", () => {
      renderDashboard({ startsInDays: 5 });

      expect(screen.getByText(/Your season begins on/)).toBeInTheDocument();
      expect(screen.getByText("Nothing to do yet.")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Take your time. Today's check-in opens when your season begins.",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("during the season", () => {
    it("shows the day on the first day", () => {
      renderDashboard({ startsInDays: 0 });
      expect(screen.getByText("Day 1 of 28")).toBeInTheDocument();
    });

    it("shows the day on the last day", () => {
      renderDashboard({ startsInDays: -27 });
      expect(screen.getByText("Day 28 of 28")).toBeInTheDocument();
    });

    it("explains that check-in is not open yet", () => {
      renderDashboard({ startsInDays: -5 });

      expect(
        screen.getByText("Today's check-in opens soon."),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Nothing else is needed from you today."),
      ).toBeInTheDocument();
    });

    it("offers no action while check-in does not exist", () => {
      // A disabled control would communicate nothing; the reason is text.
      renderDashboard({ startsInDays: -5 });
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("after the season ends", () => {
    it("says when it ended and that it is complete", () => {
      renderDashboard({ startsInDays: -40 });

      expect(screen.getByText(/Your season ended on/)).toBeInTheDocument();
      expect(screen.getByText("This season is complete.")).toBeInTheDocument();
    });

    it("never shows a day count once the season is over", () => {
      renderDashboard({ startsInDays: -40 });
      expect(screen.queryByText(/Day \d+ of 28/)).not.toBeInTheDocument();
    });
  });

  it("returns to onboarding when there is no season", () => {
    useSeasonDraftStore.getState().reset();
    render(
      <NextIntlClientProvider locale="en" messages={en} timeZone="UTC">
        <TodayDashboard />
      </NextIntlClientProvider>,
    );

    expect(replace).toHaveBeenCalledWith("/onboarding");
  });
});
