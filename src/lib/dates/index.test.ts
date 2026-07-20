import { describe, expect, it } from "vitest";

import {
  addDays,
  daysBetween,
  seasonDayNumber,
  seasonEndDate,
  toIsoDate,
} from "@/lib/dates";

describe("toIsoDate", () => {
  it("pads month and day", () => {
    expect(toIsoDate(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});

describe("addDays", () => {
  it("crosses month boundaries", () => {
    expect(addDays("2026-07-30", 3)).toBe("2026-08-02");
  });

  it("crosses year boundaries", () => {
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
  });
});

describe("daysBetween", () => {
  it("is zero for the same date", () => {
    expect(daysBetween("2026-07-20", "2026-07-20")).toBe(0);
  });

  it("counts forward across months", () => {
    expect(daysBetween("2026-07-20", "2026-08-16")).toBe(27);
  });

  it("is negative when the target is earlier", () => {
    expect(daysBetween("2026-07-20", "2026-07-19")).toBe(-1);
  });
});

describe("seasonDayNumber", () => {
  it("is 1 on the start date", () => {
    expect(seasonDayNumber("2026-07-20", "2026-07-20")).toBe(1);
  });

  it("is 28 on the last day", () => {
    expect(seasonDayNumber("2026-07-20", "2026-08-16")).toBe(28);
  });

  it("is below 1 before the season starts", () => {
    expect(seasonDayNumber("2026-07-20", "2026-07-18")).toBe(-1);
  });

  it("is above 28 after the season ends", () => {
    expect(seasonDayNumber("2026-07-20", "2026-08-17")).toBe(29);
  });
});

describe("seasonEndDate", () => {
  it("is 27 days after the start", () => {
    expect(seasonEndDate("2026-07-20")).toBe("2026-08-16");
  });
});
