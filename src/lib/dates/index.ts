// Season-day and timezone logic as pure functions.
// See docs/architecture.md ("Time & Timezone Model"): a season day is a local
// calendar date string (YYYY-MM-DD), never a UTC timestamp.

export const SEASON_LENGTH_DAYS = 28;

function parseIsoDate(iso: string): { y: number; m: number; d: number } {
  const [y = NaN, m = NaN, d = NaN] = iso.split("-").map(Number);
  return { y, m, d };
}

/** Formats a Date as a local calendar date string (YYYY-MM-DD). */
export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Today as a local calendar date string, in the device's timezone. */
export function isoDateToday(): string {
  return toIsoDate(new Date());
}

/** Converts a local calendar date string to a Date at local midnight. */
export function isoDateToDate(iso: string): Date {
  const { y, m, d } = parseIsoDate(iso);
  return new Date(y, m - 1, d);
}

/**
 * Converts a calendar date string to a Date at UTC midnight, for *display*.
 *
 * A season day is a calendar date, not an instant, so rendering it must not
 * depend on a timezone. Pair this with `DISPLAY_DATE_TIME_ZONE` when
 * formatting: anchoring both the value and the formatter to UTC makes
 * "2026-03-01" render as March 1 everywhere. Using local midnight here
 * instead would shift the date by a day wherever the formatter's timezone
 * differs from the device's.
 */
export function isoDateToUtcDate(iso: string): Date {
  const { y, m, d } = parseIsoDate(iso);
  return new Date(Date.UTC(y, m - 1, d));
}

/** Timezone to format calendar dates in. See `isoDateToUtcDate`. */
export const DISPLAY_DATE_TIME_ZONE = "UTC";

/** Adds whole days to a calendar date string. */
export function addDays(iso: string, days: number): string {
  const { y, m, d } = parseIsoDate(iso);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `${date.getUTCFullYear()}-${mm}-${dd}`;
}

/**
 * Whole days from `from` to `to`. Computed in UTC from the date components,
 * so DST shifts and timezones can never produce fractional days.
 */
export function daysBetween(from: string, to: string): number {
  const a = parseIsoDate(from);
  const b = parseIsoDate(to);
  return Math.round(
    (Date.UTC(b.y, b.m - 1, b.d) - Date.UTC(a.y, a.m - 1, a.d)) / 86_400_000,
  );
}

/**
 * 1-based season day of `date` for a season starting on `startDate`.
 * Values below 1 mean the season has not started; values above
 * SEASON_LENGTH_DAYS mean it is over.
 */
export function seasonDayNumber(startDate: string, date: string): number {
  return daysBetween(startDate, date) + 1;
}

/** Last calendar date of a season (inclusive): start + 27 days. */
export function seasonEndDate(startDate: string): string {
  return addDays(startDate, SEASON_LENGTH_DAYS - 1);
}

/**
 * Milliseconds from `now` until the next local midnight. Used to schedule a
 * single timeout that re-derives date state at day rollover, rather than
 * polling. Takes `now` as a parameter so tests can pass an explicit instant
 * instead of depending on the real clock.
 */
export function msUntilNextLocalMidnight(now: Date = new Date()): number {
  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
    0,
  );
  return nextMidnight.getTime() - now.getTime();
}
