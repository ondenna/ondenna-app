import { describe, expect, it } from "vitest";

import { todayState } from "@/features/check-in/today-state";

const START = "2026-07-20";

describe("todayState", () => {
  it("is upcoming the day before the season starts", () => {
    expect(todayState(START, "2026-07-19")).toEqual({
      kind: "upcoming",
      startDate: START,
    });
  });

  it("is upcoming well before the season starts", () => {
    expect(todayState(START, "2026-06-01").kind).toBe("upcoming");
  });

  it("becomes active on the start date, at day 1", () => {
    expect(todayState(START, START)).toEqual({ kind: "active", day: 1 });
  });

  it("stays active on the last day, at day 28", () => {
    // Season length is 28 days inclusive, so the last day is start + 27.
    expect(todayState(START, "2026-08-16")).toEqual({
      kind: "active",
      day: 28,
    });
  });

  it("is complete the day after the season ends", () => {
    expect(todayState(START, "2026-08-17")).toEqual({
      kind: "complete",
      endDate: "2026-08-16",
    });
  });

  it("reports the inclusive end date once complete", () => {
    const state = todayState(START, "2027-01-01");
    expect(state).toEqual({ kind: "complete", endDate: "2026-08-16" });
  });

  it("never reports a day outside the season", () => {
    for (const today of ["2026-07-19", "2026-08-17", "2027-01-01"]) {
      const state = todayState(START, today);
      expect(state.kind).not.toBe("active");
    }
  });

  it("counts every day of the season exactly once", () => {
    const days = new Set<number>();
    for (let offset = 0; offset < 28; offset++) {
      const date = `2026-07-${String(20 + offset).padStart(2, "0")}`;
      const iso =
        offset < 12 ? date : `2026-08-${String(offset - 11).padStart(2, "0")}`;
      const state = todayState(START, iso);
      if (state.kind === "active") days.add(state.day);
    }
    expect([...days].sort((a, b) => a - b)).toEqual(
      Array.from({ length: 28 }, (_, i) => i + 1),
    );
  });
});
