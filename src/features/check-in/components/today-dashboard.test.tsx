import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TodayDashboard } from "@/features/check-in/components/today-dashboard";
import { addDays, isoDateToday } from "@/lib/dates";
import en from "@/messages/en.json";
import { useCheckInStore } from "@/stores/check-ins";
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
    useCheckInStore.getState().reset();
    localStorage.clear();
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

    it("asks today's check-in question when there is no check-in yet", () => {
      renderDashboard({ startsInDays: -5 });
      expect(
        screen.getByRole("heading", {
          level: 2,
          name: "Did this feel true today?",
        }),
      ).toBeInTheDocument();
    });

    it("offers Yes and No as equal, keyboard-accessible radio choices", () => {
      renderDashboard({ startsInDays: -5 });
      const group = screen.getByRole("radiogroup");
      const yes = within(group).getByRole("radio", { name: "Yes" });
      const no = within(group).getByRole("radio", { name: "No" });

      expect(yes).toBeInTheDocument();
      expect(no).toBeInTheDocument();
      expect(yes).toHaveAttribute("aria-checked", "false");
      expect(no).toHaveAttribute("aria-checked", "false");
    });

    it("shows a calm validation message when saving without an answer", async () => {
      const user = userEvent.setup();
      renderDashboard({ startsInDays: -5 });

      await user.click(screen.getByRole("button", { name: "Save check-in" }));

      expect(screen.getByText("Choose yes or no to save.")).toBeInTheDocument();
      expect(screen.queryByText("Today is recorded.")).not.toBeInTheDocument();
    });

    it("saves an answer and shows the calm completed state", async () => {
      const user = userEvent.setup();
      renderDashboard({ startsInDays: -5 });

      await user.click(screen.getByRole("radio", { name: "Yes" }));
      await user.click(screen.getByRole("button", { name: "Save check-in" }));

      expect(screen.getByText("Today is recorded.")).toBeInTheDocument();
      expect(screen.getByText("You answered yes.")).toBeInTheDocument();
      expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();
    });

    it("saving No is exactly as available as saving Yes", async () => {
      const user = userEvent.setup();
      renderDashboard({ startsInDays: -5 });

      await user.click(screen.getByRole("radio", { name: "No" }));
      await user.click(screen.getByRole("button", { name: "Save check-in" }));

      expect(screen.getByText("You answered no.")).toBeInTheDocument();
    });

    it("saves an optional note alongside the answer", async () => {
      const user = userEvent.setup();
      renderDashboard({ startsInDays: -5 });

      await user.click(screen.getByRole("radio", { name: "Yes" }));
      await user.click(screen.getByRole("button", { name: "Add a note" }));
      await user.type(
        screen.getByPlaceholderText(/short note/),
        "Slept early.",
      );
      await user.click(screen.getByRole("button", { name: "Save check-in" }));

      expect(screen.getByText("Slept early.")).toBeInTheDocument();
    });

    it("lets a completed check-in be edited and re-saved", async () => {
      const user = userEvent.setup();
      renderDashboard({ startsInDays: -5 });

      await user.click(screen.getByRole("radio", { name: "Yes" }));
      await user.click(screen.getByRole("button", { name: "Save check-in" }));
      await user.click(screen.getByRole("button", { name: "Edit" }));

      const yes = screen.getByRole("radio", { name: "Yes" });
      expect(yes).toHaveAttribute("aria-checked", "true");

      await user.click(screen.getByRole("radio", { name: "No" }));
      await user.click(screen.getByRole("button", { name: "Save check-in" }));

      expect(screen.getByText("You answered no.")).toBeInTheDocument();
    });

    it("cancelling an edit restores the completed state unchanged", async () => {
      const user = userEvent.setup();
      renderDashboard({ startsInDays: -5 });

      await user.click(screen.getByRole("radio", { name: "Yes" }));
      await user.click(screen.getByRole("button", { name: "Save check-in" }));
      await user.click(screen.getByRole("button", { name: "Edit" }));
      await user.click(screen.getByRole("radio", { name: "No" }));
      await user.click(screen.getByRole("button", { name: "Cancel" }));

      expect(screen.getByText("Today is recorded.")).toBeInTheDocument();
      expect(screen.getByText("You answered yes.")).toBeInTheDocument();
    });

    it("offers no Cancel action on a brand-new check-in", () => {
      renderDashboard({ startsInDays: -5 });
      expect(
        screen.queryByRole("button", { name: "Cancel" }),
      ).not.toBeInTheDocument();
    });

    describe("yesterday", () => {
      it("is not offered on day 1 (yesterday is before the season starts)", () => {
        renderDashboard({ startsInDays: 0 });
        expect(
          screen.queryByRole("button", { name: "Add yesterday" }),
        ).not.toBeInTheDocument();
      });

      it("offers Add yesterday from day 2 onward, when it has no record", () => {
        renderDashboard({ startsInDays: -1 });
        expect(
          screen.getByRole("button", { name: "Add yesterday" }),
        ).toBeInTheDocument();
      });

      it("opens a clearly-labelled yesterday form, separate from today's", async () => {
        const user = userEvent.setup();
        renderDashboard({ startsInDays: -1 });

        await user.click(screen.getByRole("button", { name: "Add yesterday" }));

        expect(screen.getByText(/Recording yesterday,/)).toBeInTheDocument();
        expect(
          screen.getByRole("heading", {
            level: 2,
            name: "Did yesterday feel true?",
          }),
        ).toBeInTheDocument();
      });

      it("saving yesterday returns to today's own state", async () => {
        const user = userEvent.setup();
        renderDashboard({ startsInDays: -1 });

        await user.click(screen.getByRole("button", { name: "Add yesterday" }));
        await user.click(screen.getByRole("radio", { name: "Yes" }));
        await user.click(screen.getByRole("button", { name: "Save check-in" }));

        // Back on today, which still has no check-in of its own.
        expect(
          screen.getByRole("heading", {
            level: 2,
            name: "Did this feel true today?",
          }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: "Edit yesterday" }),
        ).toBeInTheDocument();
      });

      it("offers Edit yesterday once yesterday has a record", () => {
        useCheckInStore
          .getState()
          .saveCheckIn(addDays(isoDateToday(), -1), "no", undefined);
        renderDashboard({ startsInDays: -1 });

        expect(
          screen.getByRole("button", { name: "Edit yesterday" }),
        ).toBeInTheDocument();
      });

      it("cancelling out of yesterday returns to today", async () => {
        const user = userEvent.setup();
        renderDashboard({ startsInDays: -1 });

        await user.click(screen.getByRole("button", { name: "Add yesterday" }));
        await user.click(screen.getByRole("button", { name: "Cancel" }));

        expect(
          screen.getByRole("heading", {
            level: 2,
            name: "Did this feel true today?",
          }),
        ).toBeInTheDocument();
      });

      it("pre-fills yesterday's own saved answer and note, not today's blank form", async () => {
        // Regression: today's (blank) form and yesterday's form are two
        // different CheckInForm mounts sharing the same tree position, so
        // without a date-keyed remount, react-hook-form kept whichever
        // defaultValues it saw first instead of yesterday's actual record.
        const user = userEvent.setup();
        useCheckInStore
          .getState()
          .saveCheckIn(addDays(isoDateToday(), -1), "no", "A restless night.");
        renderDashboard({ startsInDays: -1 });

        // Today's own (blank) form is showing first.
        expect(screen.getByRole("radio", { name: "Yes" })).toHaveAttribute(
          "aria-checked",
          "false",
        );

        await user.click(
          screen.getByRole("button", { name: "Edit yesterday" }),
        );

        expect(screen.getByRole("radio", { name: "No" })).toHaveAttribute(
          "aria-checked",
          "true",
        );
        expect(
          screen.getByDisplayValue("A restless night."),
        ).toBeInTheDocument();
      });
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
