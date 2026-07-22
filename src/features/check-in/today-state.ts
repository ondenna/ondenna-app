import {
  SEASON_LENGTH_DAYS,
  seasonDayNumber,
  seasonEndDate,
} from "@/lib/dates";

/**
 * Where a season sits relative to today.
 *
 * These three are everything season lifecycle alone can honestly know.
 * Whether today has been checked in is a *record*-derived question, not a
 * date-derived one, so Sprint 2C.2 deliberately keeps it out of this union —
 * see TodayCheckInSection, which reads the check-in store and only renders
 * anything once this state is "active".
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
