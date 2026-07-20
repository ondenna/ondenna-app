import { z } from "zod";

// Validation for the season-creation flow. Error copy is not stored here —
// screens translate a single calm message per field via next-intl.

export const focusSchema = z.object({
  focus: z.string().trim().min(2).max(120),
});
export type FocusValues = z.infer<typeof focusSchema>;

export const whySchema = z.object({
  why: z.string().trim().min(2).max(1000),
});
export type WhyValues = z.infer<typeof whySchema>;

export const startDateSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export type StartDateValues = z.infer<typeof startDateSchema>;
