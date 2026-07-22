import { addDays, seasonDayNumber, SEASON_LENGTH_DAYS } from "@/lib/dates";

/**
 * Whether a calendar date can be checked into or edited: it must fall on or
 * after the season's start and on or before its end (docs/architecture.md,
 * "Hard Invariants" #5). Today and yesterday are the only dates the product
 * ever asks about, so this is not a general-purpose date picker guard — it
 * is the one rule both call sites (today, yesterday) share.
 */
export function isDateInSeason(startDate: string, date: string): boolean {
  const day = seasonDayNumber(startDate, date);
  return day >= 1 && day <= SEASON_LENGTH_DAYS;
}

/**
 * Whether yesterday (relative to `today`) may be added or edited: it must
 * exist inside the season. This is false before day 2 of a season (yesterday
 * would be before the start) and is only ever consulted while today itself
 * is active — the complete/upcoming states show no check-in UI at all.
 */
export function isYesterdayInSeason(startDate: string, today: string): boolean {
  return isDateInSeason(startDate, addDays(today, -1));
}
