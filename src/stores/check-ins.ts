import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { CheckInAnswer } from "@/features/check-in/schemas/check-in";

/**
 * See docs/architecture.md ("Domain Model", "CheckIn"). Keyed by local
 * calendar date only, not by a season id — the architecture's hard invariant
 * of exactly one active season at a time means no two seasons can ever claim
 * the same date concurrently, so there is no collision today. This does not
 * hold once multiple seasons' history is browsable in the same session; that
 * work must key check-ins by a stable season id, which does not exist yet
 * (see the "Temporary Client Persistence" note in docs/architecture.md).
 */
export interface CheckIn {
  date: string;
  answer: CheckInAnswer;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

interface CheckInState {
  checkIns: Record<string, CheckIn>;
  saveCheckIn: (
    date: string,
    answer: CheckInAnswer,
    note: string | undefined,
    now?: string,
  ) => void;
  reset: () => void;
}

export const useCheckInStore = create<CheckInState>()(
  persist(
    (set) => ({
      checkIns: {},
      saveCheckIn: (date, answer, note, now = new Date().toISOString()) => {
        // Format only: whether `date` is today/yesterday and inside the
        // active season is a season-relative question the store has no
        // context for, so that stays in features/check-in/editability.ts,
        // consulted by the UI before this is ever called.
        if (!ISO_DATE_PATTERN.test(date)) {
          throw new Error(`saveCheckIn: invalid date "${date}"`);
        }
        set((state) => {
          const existing = state.checkIns[date];
          return {
            checkIns: {
              ...state.checkIns,
              [date]: {
                date,
                answer,
                note,
                createdAt: existing?.createdAt ?? now,
                updatedAt: now,
              },
            },
          };
        });
      },
      reset: () => set({ checkIns: {} }),
    }),
    {
      name: "ondenna-check-ins",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
