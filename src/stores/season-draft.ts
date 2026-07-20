import { create } from "zustand";

import { isoDateToday } from "@/lib/dates";

// Sprint 1: in-memory only. The draft is lost on reload by design — it will
// be replaced by Supabase persistence in a later sprint. Do not add
// localStorage or any other persistence here.

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

export const useSeasonDraftStore = create<SeasonDraftState>((set) => ({
  draft: emptyDraft(),
  hasStarted: false,
  setFocus: (focus) => set((s) => ({ draft: { ...s.draft, focus } })),
  setWhy: (why) => set((s) => ({ draft: { ...s.draft, why } })),
  setStartDate: (startDate) =>
    set((s) => ({ draft: { ...s.draft, startDate } })),
  startSeason: () => set({ hasStarted: true }),
  reset: () => set({ draft: emptyDraft(), hasStarted: false }),
}));
