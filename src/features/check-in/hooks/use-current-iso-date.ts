"use client";

import { useEffect, useState } from "react";

import { isoDateToday, msUntilNextLocalMidnight } from "@/lib/dates";

/**
 * Today's local calendar date, kept accurate while the screen stays open.
 * Sprint 2C.1 left Today reading `isoDateToday()` once at render, which goes
 * stale if the screen is left open across midnight or the tab is backgrounded
 * for a while. This re-derives the date — never guesses or increments it —
 * on three triggers: a scheduled timeout for the next local midnight, the
 * document becoming visible again, and the window regaining focus.
 */
export function useCurrentIsoDate(): string {
  const [date, setDate] = useState(isoDateToday);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const sync = () => setDate(isoDateToday());

    const scheduleNextSync = () => {
      timeoutId = setTimeout(() => {
        sync();
        scheduleNextSync();
      }, msUntilNextLocalMidnight());
    };
    scheduleNextSync();

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") sync();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("focus", sync);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("focus", sync);
    };
  }, []);

  return date;
}
