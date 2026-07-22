import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { useCheckInStore } from "@/stores/check-ins";

describe("useCheckInStore", () => {
  beforeEach(() => {
    useCheckInStore.getState().reset();
    localStorage.clear();
  });

  afterEach(() => {
    useCheckInStore.getState().reset();
    localStorage.clear();
  });

  it("creates a check-in for a date", () => {
    useCheckInStore
      .getState()
      .saveCheckIn(
        "2026-07-20",
        "yes",
        "Slept early.",
        "2026-07-20T08:00:00.000Z",
      );

    expect(useCheckInStore.getState().checkIns["2026-07-20"]).toEqual({
      date: "2026-07-20",
      answer: "yes",
      note: "Slept early.",
      createdAt: "2026-07-20T08:00:00.000Z",
      updatedAt: "2026-07-20T08:00:00.000Z",
    });
  });

  it("creates a check-in with no note", () => {
    useCheckInStore.getState().saveCheckIn("2026-07-20", "no", undefined);
    expect(
      useCheckInStore.getState().checkIns["2026-07-20"]?.note,
    ).toBeUndefined();
  });

  it("preserves createdAt and updates updatedAt when editing", () => {
    useCheckInStore
      .getState()
      .saveCheckIn("2026-07-20", "no", undefined, "2026-07-20T08:00:00.000Z");
    useCheckInStore
      .getState()
      .saveCheckIn(
        "2026-07-20",
        "yes",
        "Changed my mind.",
        "2026-07-20T20:00:00.000Z",
      );

    const record = useCheckInStore.getState().checkIns["2026-07-20"];
    expect(record).toEqual({
      date: "2026-07-20",
      answer: "yes",
      note: "Changed my mind.",
      createdAt: "2026-07-20T08:00:00.000Z",
      updatedAt: "2026-07-20T20:00:00.000Z",
    });
  });

  it("removes a note through edit", () => {
    useCheckInStore.getState().saveCheckIn("2026-07-20", "yes", "A note.");
    useCheckInStore.getState().saveCheckIn("2026-07-20", "yes", undefined);
    expect(
      useCheckInStore.getState().checkIns["2026-07-20"]?.note,
    ).toBeUndefined();
  });

  it("isolates records by date", () => {
    useCheckInStore.getState().saveCheckIn("2026-07-20", "yes", undefined);
    useCheckInStore.getState().saveCheckIn("2026-07-21", "no", undefined);

    expect(useCheckInStore.getState().checkIns["2026-07-20"]?.answer).toBe(
      "yes",
    );
    expect(useCheckInStore.getState().checkIns["2026-07-21"]?.answer).toBe(
      "no",
    );
  });

  it("rejects a malformed date", () => {
    expect(() =>
      useCheckInStore.getState().saveCheckIn("07/20/2026", "yes", undefined),
    ).toThrow();
  });

  it("writes every save to localStorage under the documented key", () => {
    useCheckInStore
      .getState()
      .saveCheckIn("2026-07-20", "yes", "Persisted note.");

    const raw = localStorage.getItem("ondenna-check-ins");
    expect(raw).toBeTruthy();
    expect(JSON.parse(raw!).state.checkIns["2026-07-20"]).toMatchObject({
      answer: "yes",
      note: "Persisted note.",
    });
  });

  it("rehydrates from whatever localStorage holds, simulating a reload", async () => {
    // Seed storage as a previous session would have left it, independent of
    // this session's in-memory state, then rehydrate — the same call the
    // store makes on a fresh page load.
    localStorage.setItem(
      "ondenna-check-ins",
      JSON.stringify({
        state: {
          checkIns: {
            "2026-07-20": {
              date: "2026-07-20",
              answer: "yes",
              note: "From a previous session.",
              createdAt: "2026-07-20T08:00:00.000Z",
              updatedAt: "2026-07-20T08:00:00.000Z",
            },
          },
        },
        version: 0,
      }),
    );

    await useCheckInStore.persist.rehydrate();

    expect(useCheckInStore.getState().checkIns["2026-07-20"]).toMatchObject({
      answer: "yes",
      note: "From a previous session.",
    });
  });
});
