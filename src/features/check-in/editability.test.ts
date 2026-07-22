import { describe, expect, it } from "vitest";

import {
  isDateInSeason,
  isYesterdayInSeason,
} from "@/features/check-in/editability";

const START = "2026-07-20";

describe("isDateInSeason", () => {
  it("is true on day 1", () => {
    expect(isDateInSeason(START, START)).toBe(true);
  });

  it("is true on day 28", () => {
    expect(isDateInSeason(START, "2026-08-16")).toBe(true);
  });

  it("is false on day 29", () => {
    expect(isDateInSeason(START, "2026-08-17")).toBe(false);
  });

  it("is false the day before the season starts", () => {
    expect(isDateInSeason(START, "2026-07-19")).toBe(false);
  });
});

describe("isYesterdayInSeason", () => {
  it("is false on day 1 (yesterday would be before the season starts)", () => {
    expect(isYesterdayInSeason(START, START)).toBe(false);
  });

  it("is true on day 2", () => {
    expect(isYesterdayInSeason(START, "2026-07-21")).toBe(true);
  });

  it("is true on day 28 (yesterday is day 27)", () => {
    expect(isYesterdayInSeason(START, "2026-08-16")).toBe(true);
  });

  it("is true the day the season ends from outside (day 29, yesterday is day 28)", () => {
    // today itself is out of season here, but the function only judges
    // yesterday — callers gate on today's own state separately.
    expect(isYesterdayInSeason(START, "2026-08-17")).toBe(true);
  });

  it("is false well before the season starts", () => {
    expect(isYesterdayInSeason(START, "2026-06-01")).toBe(false);
  });
});
