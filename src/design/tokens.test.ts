import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import * as tokens from "@/design/tokens";
import {
  BACKGROUND_COLOR,
  DURATION_BASE_MS,
  DURATION_FAST_MS,
  EASE_OUT,
  SLIDE_DISTANCE_PX,
  SPLASH_FADE_MS,
  SPLASH_HOLD_MS,
} from "@/design/tokens";

/**
 * tokens.ts duplicates a handful of values that are authored in CSS. That
 * duplication is unavoidable — Framer Motion and the PWA manifest cannot
 * read custom properties — so it is guarded instead.
 */

const read = (file: string) =>
  readFileSync(fileURLToPath(new URL(file, import.meta.url)), "utf8");

const motionCss = read("./tokens/motion.css");
const colorCss = read("./tokens/color.css");

/** Reads `--name: value;`, ignoring the comment blocks around it. */
function cssValue(css: string, name: string): string {
  const match = new RegExp(`^\\s*--${name}:\\s*([^;]+);`, "m").exec(css);
  if (!match?.[1]) throw new Error(`--${name} is not declared`);
  return match[1].trim();
}

describe("tokens.ts mirrors the CSS token layer", () => {
  it("matches the motion durations", () => {
    expect(cssValue(motionCss, "duration-fast")).toBe(`${DURATION_FAST_MS}ms`);
    expect(cssValue(motionCss, "duration-base")).toBe(`${DURATION_BASE_MS}ms`);
  });

  it("matches the easing curve", () => {
    expect(cssValue(motionCss, "ease-out")).toBe(
      `cubic-bezier(${EASE_OUT.join(", ")})`,
    );
  });

  it("matches the slide distance", () => {
    expect(cssValue(motionCss, "motion-slide-distance")).toBe(
      `${SLIDE_DISTANCE_PX}px`,
    );
  });

  it("matches the background colour used by the PWA manifest", () => {
    expect(cssValue(colorCss, "color-background")).toBe(BACKGROUND_COLOR);
  });
});

describe("tokens.ts stays a mirror, not a second palette", () => {
  /*
   * The audit that keeps this module honest: every exported constant is
   * either drift-tested against CSS above, or a documented JS-only value.
   * A new export lands here first, which forces the question "does
   * JavaScript actually need this, or could it be a utility?".
   */
  const MIRRORED = [
    "DURATION_FAST_MS",
    "DURATION_BASE_MS",
    "EASE_OUT",
    "SLIDE_DISTANCE_PX",
    "BACKGROUND_COLOR",
  ];
  const JS_ONLY = ["SPLASH_FADE_MS", "SPLASH_HOLD_MS"];
  const HELPERS = ["fadeIn", "slideStep"];

  it("exports nothing beyond the audited set", () => {
    expect(Object.keys(tokens).sort()).toEqual(
      [...MIRRORED, ...JS_ONLY, ...HELPERS].sort(),
    );
  });

  it("mirrors exactly one colour — the manifest cannot read CSS", () => {
    const colours = MIRRORED.filter((name) => name.includes("COLOR"));
    expect(colours).toEqual(["BACKGROUND_COLOR"]);
  });
});

describe("motion stays inside the documented band", () => {
  // docs/design-language.md: standard transition 220–280ms, small slide
  // 20–24px. A future edit that leaves the band should fail here.
  it("keeps durations between 220ms and 280ms", () => {
    for (const duration of [DURATION_FAST_MS, DURATION_BASE_MS]) {
      expect(duration).toBeGreaterThanOrEqual(220);
      expect(duration).toBeLessThanOrEqual(280);
    }
  });

  it("keeps the slide distance between 20px and 24px", () => {
    expect(SLIDE_DISTANCE_PX).toBeGreaterThanOrEqual(20);
    expect(SLIDE_DISTANCE_PX).toBeLessThanOrEqual(24);
  });
});

describe("the splash is a brand exception, not a transition", () => {
  it("sits outside the transition band on purpose", () => {
    // Asserted rather than merely commented: if someone ever brings the
    // splash into the band, this test tells them the exception is gone and
    // the documentation needs updating too.
    expect(SPLASH_FADE_MS).toBeGreaterThan(280);
  });

  it("is not declared in CSS, so there is nothing to drift from", () => {
    expect(motionCss).not.toMatch(/--duration-splash/);
    expect(motionCss).not.toMatch(/--splash/);
  });

  it("is named so it cannot be mistaken for a general duration", () => {
    for (const name of ["SPLASH_FADE_MS", "SPLASH_HOLD_MS"]) {
      expect(name.startsWith("DURATION_")).toBe(false);
    }
    expect(SPLASH_HOLD_MS).toBeGreaterThan(SPLASH_FADE_MS);
  });
});
