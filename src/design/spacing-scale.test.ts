import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Guards the 8-point spacing scale from docs/ui-rules.md.
 *
 * Tailwind will happily generate `mt-3` (12px) or `py-1.5` (6px), and those
 * are exactly the arbitrary values the design language forbids. Nothing but
 * a test catches them, so this scans application-owned markup for off-grid
 * padding, margin and gap utilities.
 *
 * Two things are deliberately out of scope:
 *
 * - **Vendored code.** src/components/ui holds shadcn primitives whose
 *   internal geometry is redesigned in Sprint 2B against the tokens in
 *   src/design/tokens/component.css. Until then they are excluded rather
 *   than half-corrected.
 * - **Generated output.** The scan is rooted at src/, so .next/,
 *   node_modules/ and test-results/ are never reached.
 */

/**
 * The ten allowed values, as the Tailwind utility step that produces each.
 *
 * The utility number is NOT the pixel value — Tailwind multiplies it by the
 * 4px base in src/design/tokens/spacing.css. `p-6` is 24px, not 6px.
 */
const SCALE = new Map([
  [1, 4],
  [2, 8],
  [4, 16],
  [6, 24],
  [8, 32],
  [10, 40],
  [12, 48],
  [16, 64],
  [20, 80],
  [24, 96],
]);

/**
 * Spacing properties only. Sizing utilities (`h-`, `w-`, `size-`) are
 * component geometry, not spacing, and are governed by component.css.
 */
const SPACING_UTILITY =
  /(?<![\w-])-?(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|gap-x|gap-y|space-x|space-y)-(\[[^\]]+\]|[\w.]+)/g;

/**
 * A spacing value is legitimate if it is a step on the scale, `auto`, or a
 * named component token from src/design/tokens/component.css.
 *
 * The last case exists for geometry docs/ui-rules.md fixes off the scale.
 * There is currently none — card padding was reconciled to 24px — but the
 * escape hatch stays open and narrow: only `var(--space-*)` and
 * `var(--size-*)`, never a bare `p-[20px]`.
 */
export function isLegitimateSpacing(value: string): boolean {
  if (value === "auto") return true;
  if (/^\[var\(--(space|size)-[\w-]+\)\]$/.test(value)) return true;
  const step = Number(value);
  return Number.isInteger(step) && SCALE.has(step);
}

/** Every off-grid spacing utility in a source string, in source order. */
export function findOffScaleSpacing(source: string): string[] {
  return [...source.matchAll(SPACING_UTILITY)]
    .filter((match) => !isLegitimateSpacing(match[2] ?? ""))
    .map((match) => match[0]);
}

const SRC = dirname(dirname(fileURLToPath(import.meta.url)));
const VENDORED = join(SRC, "components", "ui");

function applicationFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      return path === VENDORED ? [] : applicationFiles(path);
    }
    return entry.isFile() && path.endsWith(".tsx") ? [path] : [];
  });
}

describe("the scale itself", () => {
  it("is the ten values docs/ui-rules.md allows", () => {
    expect([...SCALE.values()]).toEqual([4, 8, 16, 24, 32, 40, 48, 64, 80, 96]);
  });

  it("multiplies the utility step by the 4px base", () => {
    for (const [step, pixels] of SCALE) expect(step * 4).toBe(pixels);
  });
});

describe("the detector actually detects", () => {
  // Without these, the scan below could pass because the regex is broken
  // rather than because the code is clean.
  it.each([
    ["mt-3", "12px is not on the scale"],
    ["space-y-3", "12px via space-y"],
    ["py-1.5", "6px"],
    ["gap-5", "20px"],
    ["p-5", "20px, the old card padding"],
    ["p-px", "1px"],
    ["p-[20px]", "an arbitrary pixel value"],
    ["mt-[13px]", "an arbitrary margin"],
    ["p-[var(--radius-md)]", "a var() that is not a spacing token"],
  ])("rejects %s (%s)", (className) => {
    expect(findOffScaleSpacing(`class="${className}"`)).toEqual([className]);
  });

  it.each([
    ["px-6", "24px, on the scale"],
    ["pb-8", "32px"],
    ["mt-auto", "no size"],
    ["-ml-2", "a negative margin on the scale"],
    ["md:mb-2", "a variant-prefixed utility"],
    ["hover:gap-4", "a state-prefixed utility"],
    ["p-[var(--space-card-padding)]", "a named component token"],
  ])("accepts %s (%s)", (className) => {
    expect(findOffScaleSpacing(`class="${className}"`)).toEqual([]);
  });

  it.each([
    ["h-12", "a height, not spacing"],
    ["size-5", "a size, not spacing"],
    ["min-h-32", "a min-height, not spacing"],
    ["grid-cols-3", "not a spacing property"],
  ])("ignores %s (%s)", (className) => {
    expect(findOffScaleSpacing(`class="${className}"`)).toEqual([]);
  });

  it("reports every offender in one file", () => {
    const source = `<div className="mt-3 px-6 py-1.5 gap-4 space-y-3" />`;
    expect(findOffScaleSpacing(source)).toEqual([
      "mt-3",
      "py-1.5",
      "space-y-3",
    ]);
  });
});

describe("application source stays on the scale", () => {
  const files = applicationFiles(SRC);

  it("finds application components to check", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const file of files) {
    const name = `src${sep}${relative(SRC, file)}`;

    // A plain loop rather than it.each: the title is then exactly the file
    // path, and a CI failure names both the file and the offending class
    // without anyone opening the report.
    it(name, () => {
      const findings = findOffScaleSpacing(readFileSync(file, "utf8")).map(
        (className) => `${name}: ${className}`,
      );

      expect(findings).toEqual([]);
    });
  }
});
