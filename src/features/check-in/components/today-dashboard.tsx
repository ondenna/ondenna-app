"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useEffect } from "react";

import { todayState } from "@/features/check-in/today-state";
import { useRouter } from "@/i18n/navigation";
import {
  DISPLAY_DATE_TIME_ZONE,
  SEASON_LENGTH_DAYS,
  isoDateToUtcDate,
  isoDateToday,
} from "@/lib/dates";
import { useSeasonDraftStore } from "@/stores/season-draft";

/**
 * The daily home of Ondenna (docs/screens.md 3). It answers three questions
 * quietly — where am I in this season, what did I set out to change, and
 * what is available today — and nothing else.
 *
 * Composition mirrors onboarding rather than a dashboard: quiet temporal
 * context, the focus as the emotional anchor in the serif, and today's state
 * held at the bottom where the action will eventually live. There is no
 * card, no metric and no progress geometry; the season ring stays on
 * Welcome, because on a daily screen it could only be decoration or a
 * progress meter, and the product allows neither.
 */
export function TodayDashboard() {
  const t = useTranslations("dashboard");
  const format = useFormatter();
  const router = useRouter();
  const draft = useSeasonDraftStore((s) => s.draft);
  const hasStarted = useSeasonDraftStore((s) => s.hasStarted);

  // Sprint 1 keeps the season in memory only, so a direct visit (or a
  // reload) without a season quietly returns to onboarding.
  useEffect(() => {
    if (!hasStarted) router.replace("/onboarding");
  }, [hasStarted, router]);

  if (!hasStarted) return null;

  const state = todayState(draft.startDate, isoDateToday());

  const longDate = (iso: string) =>
    format.dateTime(isoDateToUtcDate(iso), {
      dateStyle: "long",
      timeZone: DISPLAY_DATE_TIME_ZONE,
    });

  // Orientation, not measurement: where today sits in the season, said once.
  const timing =
    state.kind === "upcoming"
      ? t("startsOn", { date: longDate(state.startDate) })
      : state.kind === "complete"
        ? t("endedOn", { date: longDate(state.endDate) })
        : t("day", { day: state.day, length: SEASON_LENGTH_DAYS });

  return (
    <main className="max-w-app mx-auto flex min-h-dvh w-full flex-col px-6 pt-16 pb-8">
      <p className="text-muted-foreground text-small">{timing}</p>
      <h1 className="text-h1 mt-2 text-balance">{draft.focus}</h1>

      {/*
        Today's state sits with the focus rather than pinned to the bottom.
        Anchored to the viewport it was stranded — a hairline and two lines
        of text cannot hold eight hundred pixels of canvas, and the screen
        read as empty rather than composed. Grouped here it reads as one
        thought: this is the season, and this is where today sits in it.
        The whitespace below then says the thing the copy says — nothing
        further is being asked. In 2C.2 the check-in action lands in that
        space, where a 52px button can anchor it the way onboarding does.

        One hairline separates the season from today — the same device the
        review step uses, and the reason this needs no card.

        The state is written out rather than shown as a disabled button: a
        dead control communicates nothing, while a sentence says what is true
        and why, and stays readable to a screen reader.
      */}
      <section className="border-divider mt-12 border-t pt-8">
        <h2 className="text-body font-sans font-medium">
          {t(`state.${state.kind}.title`)}
        </h2>
        <p className="text-muted-foreground text-body mt-2">
          {t(`state.${state.kind}.body`)}
        </p>
      </section>
    </main>
  );
}
