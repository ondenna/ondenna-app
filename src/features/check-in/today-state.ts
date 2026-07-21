import {
  SEASON_LENGTH_DAYS,
  seasonDayNumber,
  seasonEndDate,
} from "@/lib/dates";

/**
 * Where a season sits relative to today.
 *
 * These three are everything the current architecture can honestly know. A
 * season's position in time is derived from its start date, which the draft
 * already holds; whether the user has checked in today is *not* knowable,
 * because check-ins are not stored yet. So there is deliberately no
 * "checked in" or "ready" state here — Sprint 2C.2 adds those once there is
 * data behind them, by extending this union rather than reworking the
 * screen.
 */
export type TodayState =
  | { kind: "upcoming"; startDate: string }
  | { kind: "active"; day: number }
  | { kind: "complete"; endDate: string };

/**
 * Derives the season's position from calendar dates alone — pure, so every
 * boundary (the day before, day 1, day 28, day 29) is unit-testable without
 * rendering or mocking the clock.
 */
export function todayState(startDate: string, today: string): TodayState {
  const day = seasonDayNumber(startDate, today);

  if (day < 1) return { kind: "upcoming", startDate };
  if (day > SEASON_LENGTH_DAYS) {
    return { kind: "complete", endDate: seasonEndDate(startDate) };
  }
  return { kind: "active", day };
}
