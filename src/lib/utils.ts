import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The Ondenna type scale, from src/design/tokens/typography.css.
 *
 * tailwind-merge has to decide whether a `text-*` class is a size or a
 * colour, and for names it does not recognise it assumes colour. That made
 * `text-body` look like a colour, so merging it after
 * `text-primary-foreground` silently dropped the colour and left button
 * labels the same shade as their own background. Teaching the merger the
 * scale fixes the whole class of bug rather than one symptom.
 *
 * Any size added to typography.css must be added here too — utils.test.ts
 * fails if the two lists disagree.
 */
export const TYPE_SCALE = [
  "display",
  "h1",
  "h2",
  "h3",
  "body",
  "small",
  "caption",
] as const;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [...TYPE_SCALE] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
