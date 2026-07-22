import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useCurrentIsoDate } from "@/features/check-in/hooks/use-current-iso-date";

describe("useCurrentIsoDate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts with today's local date", () => {
    vi.setSystemTime(new Date(2026, 6, 20, 10, 0, 0));
    const { result } = renderHook(() => useCurrentIsoDate());
    expect(result.current).toBe("2026-07-20");
  });

  it("rolls over to the next date at local midnight without polling", () => {
    vi.setSystemTime(new Date(2026, 6, 20, 23, 59, 0));
    const { result } = renderHook(() => useCurrentIsoDate());
    expect(result.current).toBe("2026-07-20");

    vi.setSystemTime(new Date(2026, 6, 21, 0, 0, 30));
    act(() => {
      vi.advanceTimersByTime(60_000);
    });

    expect(result.current).toBe("2026-07-21");
  });

  it("schedules exactly one timer at a time, not a poll loop", () => {
    vi.setSystemTime(new Date(2026, 6, 20, 12, 0, 0));
    renderHook(() => useCurrentIsoDate());
    expect(vi.getTimerCount()).toBe(1);
  });

  it("re-syncs the date when the document becomes visible again", () => {
    vi.setSystemTime(new Date(2026, 6, 20, 23, 59, 0));
    const { result } = renderHook(() => useCurrentIsoDate());
    expect(result.current).toBe("2026-07-20");

    // The tab was backgrounded across midnight and just came back, before
    // the scheduled timeout would have fired.
    vi.setSystemTime(new Date(2026, 6, 21, 0, 5, 0));
    Object.defineProperty(document, "visibilityState", {
      value: "visible",
      configurable: true,
    });
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(result.current).toBe("2026-07-21");
  });

  it("re-syncs the date when the window regains focus", () => {
    vi.setSystemTime(new Date(2026, 6, 20, 23, 59, 0));
    const { result } = renderHook(() => useCurrentIsoDate());

    vi.setSystemTime(new Date(2026, 6, 21, 0, 5, 0));
    act(() => {
      window.dispatchEvent(new Event("focus"));
    });

    expect(result.current).toBe("2026-07-21");
  });

  it("cleans up its timer and listeners on unmount", () => {
    const addSpy = vi.spyOn(document, "addEventListener");
    const removeSpy = vi.spyOn(document, "removeEventListener");
    const windowAddSpy = vi.spyOn(window, "addEventListener");
    const windowRemoveSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useCurrentIsoDate());
    expect(addSpy).toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Function),
    );
    expect(windowAddSpy).toHaveBeenCalledWith("focus", expect.any(Function));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Function),
    );
    expect(windowRemoveSpy).toHaveBeenCalledWith("focus", expect.any(Function));
    expect(vi.getTimerCount()).toBe(0);
  });
});
