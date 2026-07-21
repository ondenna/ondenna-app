/**
 * The JavaScript side of the design system.
 *
 * Tokens are authored once, in CSS, under `src/design/tokens/`. CSS is the
 * source of truth. This module exists only for values JavaScript genuinely
 * cannot reach: Framer Motion needs numbers and easing arrays, and the PWA
 * manifest is generated on the server, where no element exists to resolve a
 * custom property against.
 *
 * It holds two kinds of value, and nothing else:
 *
 *   1. **Mirrors** of a CSS token. `tokens.test.ts` parses the CSS and fails
 *      if the two drift apart. Every mirror below is drift-tested.
 *   2. **JS-only values** that have no CSS counterpart, because no
 *      stylesheet consumes them. Nothing to mirror, nothing to drift.
 *
 * Do not add a value here that could be a Tailwind utility or a `var()`.
 * Mirroring the palette "for convenience" would make this a second source of
 * truth, which is precisely what the token layer exists to prevent.
 */

/* ── Mirrors of CSS tokens (drift-tested) ─────────────────────────────── */

/** Mirrors --duration-fast. Framer Motion cannot read a custom property. */
export const DURATION_FAST_MS = 220;

/** Mirrors --duration-base. The standard transition. */
export const DURATION_BASE_MS = 260;

/** Mirrors --ease-out. The house curve, as Framer Motion's cubic array. */
export const EASE_OUT: [number, number, number, number] = [0.32, 0.72, 0, 1];

/** Mirrors --motion-slide-distance. Small Slide. */
export const SLIDE_DISTANCE_PX = 24;

/**
 * Mirrors --color-background. The one colour here, and only because
 * app/manifest.ts is generated JSON that cannot consume CSS.
 */
export const BACKGROUND_COLOR = "#f7f3ec";

/* ── Brand exceptions: the splash (JS-only, not mirrored) ─────────────── */

/*
 * The splash is a brand moment on first paint, not a state transition, and
 * its timings sit outside the 220–280ms band the design language fixes for
 * transitions. They are named SPLASH_* rather than DURATION_* so they can
 * never be picked up as a general-purpose duration, and they live in JS only
 * because no stylesheet animates the splash.
 *
 * Under reduced motion both collapse to zero: the fade becomes an instant
 * state change and the hold disappears, so those users are never made to
 * wait through a decorative pause. See docs/design-language.md, "Motion".
 */

/** How long the mark and wordmark take to fade in. Never reuse elsewhere. */
export const SPLASH_FADE_MS = 1100;

/** How long the splash is held before routing on. Never reuse elsewhere. */
export const SPLASH_HOLD_MS = 2000;

/* ── Framer Motion helpers ────────────────────────────────────────────── */

interface MotionProps {
  initial: Record<string, number>;
  animate: Record<string, number>;
  exit?: Record<string, number>;
  transition: { duration: number; ease: [number, number, number, number] };
}

/**
 * A quiet fade in. Pass `useReducedMotion()` so the animation collapses to
 * an instant state change rather than disappearing entirely.
 */
export function fadeIn(
  reducedMotion: boolean,
  durationMs: number = DURATION_BASE_MS,
): MotionProps {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      duration: reducedMotion ? 0 : durationMs / 1000,
      ease: EASE_OUT,
    },
  };
}

/**
 * A fade with a small horizontal slide, for moving between steps of a
 * focused flow. Under reduced motion it becomes a plain fade.
 */
export function slideStep(reducedMotion: boolean): MotionProps {
  const distance = reducedMotion ? 0 : SLIDE_DISTANCE_PX;

  return {
    initial: { opacity: 0, x: distance },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -distance },
    transition: {
      duration: reducedMotion ? 0 : DURATION_BASE_MS / 1000,
      ease: EASE_OUT,
    },
  };
}
