import { describe, expect, it } from "vitest";

import {
  CHECK_IN_NOTE_MAX_LENGTH,
  checkInFormSchema,
  normalizeNote,
} from "@/features/check-in/schemas/check-in";

describe("normalizeNote", () => {
  it("trims outer whitespace", () => {
    expect(normalizeNote("  A good day.  ")).toBe("A good day.");
  });

  it("normalizes a whitespace-only note to undefined", () => {
    expect(normalizeNote("   ")).toBeUndefined();
  });

  it("normalizes an empty string to undefined", () => {
    expect(normalizeNote("")).toBeUndefined();
  });

  it("normalizes undefined to undefined", () => {
    expect(normalizeNote(undefined)).toBeUndefined();
  });

  it("preserves intentional line breaks inside real content", () => {
    expect(normalizeNote("Line one.\nLine two.")).toBe("Line one.\nLine two.");
  });
});

describe("checkInFormSchema", () => {
  it("accepts a bare yes with no note", () => {
    expect(checkInFormSchema.safeParse({ answer: "yes" }).success).toBe(true);
  });

  it("accepts a bare no", () => {
    expect(checkInFormSchema.safeParse({ answer: "no" }).success).toBe(true);
  });

  it("requires an answer", () => {
    const result = checkInFormSchema.safeParse({ answer: undefined, note: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["answer"]);
  });

  it("accepts a note within the character limit", () => {
    const result = checkInFormSchema.safeParse({
      answer: "yes",
      note: "A good day.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a note over the character limit", () => {
    const result = checkInFormSchema.safeParse({
      answer: "yes",
      note: "a".repeat(CHECK_IN_NOTE_MAX_LENGTH + 1),
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["note"]);
  });

  it("accepts a note at exactly the character limit", () => {
    const result = checkInFormSchema.safeParse({
      answer: "yes",
      note: "a".repeat(CHECK_IN_NOTE_MAX_LENGTH),
    });
    expect(result.success).toBe(true);
  });

  it("accepts a whitespace-only note over the raw limit once trimmed", () => {
    // The limit is checked on the normalized (trimmed) note, so padding
    // alone can never push a short note over it.
    const result = checkInFormSchema.safeParse({
      answer: "yes",
      note: "hi" + " ".repeat(CHECK_IN_NOTE_MAX_LENGTH),
    });
    expect(result.success).toBe(true);
  });
});
