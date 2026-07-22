import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { isoDateToday } from "@/lib/dates";

// Sprint 2C.2: persisted to localStorage. Check-ins (src/stores/check-ins.ts)
// must survive a refresh, and Today redirects to onboarding whenever there is
// no started season — so without persisting the season too, a persisted
// check-in would be orphaned behind that redirect on every reload. This is a
// documented, temporary stand-in for Supabase persistence (see
// docs/architecture.md, "Temporary Client Persistence"), not a second source
// of truth: it is still the same store, same shape, just backed by
// localStorage instead of memory.

export interface SeasonDraft {
  /** What the user wants to change this season. */
  focus: string;
  /** Why it matters to them. Reappears in the season report. */
  why: string;
  /** Local calendar date (YYYY-MM-DD), per docs/architecture.md. */
  startDate: string;
}

interface SeasonDraftState {
  draft: SeasonDraft;
  /** True once onboarding finished in this browser session. */
  hasStarted: boolean;
  setFocus: (focus: string) => void;
  setWhy: (why: string) => void;
  setStartDate: (startDate: string) => void;
  startSeason: () => void;
  reset: () => void;
}

const emptyDraft = (): SeasonDraft => ({
  focus: "",
  why: "",
  startDate: isoDateToday(),
});

export const useSeasonDraftStore = create<SeasonDraftState>()(
  persist(
    (set) => ({
      draft: emptyDraft(),
      hasStarted: false,
      setFocus: (focus) => set((s) => ({ draft: { ...s.draft, focus } })),
      setWhy: (why) => set((s) => ({ draft: { ...s.draft, why } })),
      setStartDate: (startDate) =>
        set((s) => ({ draft: { ...s.draft, startDate } })),
      startSeason: () => set({ hasStarted: true }),
      reset: () => set({ draft: emptyDraft(), hasStarted: false }),
    }),
    {
      name: "ondenna-season-draft",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
