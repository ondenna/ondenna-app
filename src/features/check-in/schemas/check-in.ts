import { z } from "zod";

// Validation for the daily check-in. Error copy is not stored here — the
// form translates a single calm message per field via next-intl, the same
// convention as features/season/schemas/onboarding.ts.

/** Prefer ~500 characters (docs/product conventions); see docs/screens.md. */
export const CHECK_IN_NOTE_MAX_LENGTH = 500;

export const checkInAnswerSchema = z.enum(["yes", "no"]);
export type CheckInAnswer = z.infer<typeof checkInAnswerSchema>;

/**
 * A whitespace-only note is stored as absent, not as an empty string;
 * intentional line breaks inside real content are left untouched. A plain
 * function rather than a zod `.transform()` so the form's input type and its
 * validated output type stay identical — RHF's generic resolver typing gets
 * awkward the moment they diverge, and this is called from exactly two
 * places (the schema's own length check, and the form's submit handler), so
 * there is nothing a transform would have saved.
 */
export function normalizeNote(note: string | undefined): string | undefined {
  const trimmed = note?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * `answer` is optional pre-refine so the form can start with nothing
 * selected; the refine below is what actually requires a choice before
 * saving, attached to the `answer` field so the error surfaces next to the
 * Yes/No control rather than as a form-level message.
 */
export const checkInFormSchema = z
  .object({
    answer: checkInAnswerSchema.optional(),
    note: z.string().optional(),
  })
  .refine((data) => data.answer !== undefined, {
    message: "required",
    path: ["answer"],
  })
  .refine(
    (data) => {
      const normalized = normalizeNote(data.note);
      return !normalized || normalized.length <= CHECK_IN_NOTE_MAX_LENGTH;
    },
    { message: "tooLong", path: ["note"] },
  );

export type CheckInFormValues = z.infer<typeof checkInFormSchema>;
