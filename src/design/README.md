# The Ondenna design token layer

Every colour, size, radius, shadow and duration in the product comes from
here. A component that hardcodes a design value is a bug, not a shortcut.

The values themselves are not decided here — they come from
[`docs/design-language.md`](../../docs/design-language.md) and
[`docs/ui-rules.md`](../../docs/ui-rules.md). This folder is where those
documents become code.

## Where tokens live

```
src/design/
├── index.css              single entry point; imported by app/globals.css
├── tokens/
│   ├── color.css          semantic colours
│   ├── typography.css     font families, size scale, line heights
│   ├── spacing.css        the 4px base and the 8-point scale rule
│   ├── radius.css         sm / md / lg / pill
│   ├── shadow.css         the only two shadows in the product
│   ├── motion.css         durations, easing, reduced motion
│   └── component.css      per-primitive geometry (buttons, inputs, cards)
├── tokens.ts              the small JS mirror — see "Two languages" below
├── tokens.test.ts         fails if tokens.ts drifts from the CSS
└── spacing-scale.test.ts  fails on off-grid padding, margin or gap
```

Tokens are authored as Tailwind `@theme static` blocks, so each one both
exists as a CSS custom property and generates a utility. `static` means
every token is emitted even when nothing consumes it yet — a foundation
should be inspectable, not tree-shaken.

## How components consume them

Through Tailwind utilities. That is the whole story for almost every case:

```tsx
<section className="bg-surface border-border shadow-subtle rounded-md border">
  <h2 className="text-h2">…</h2>
  <p className="text-muted-foreground text-small mt-2">…</p>
</section>
```

- **Colour** — `bg-surface`, `text-foreground`, `text-muted-foreground`,
  `border-border`, `ring-ring`. Never a hex value, never `text-[#0F2528]`.
  The authoritative table of every semantic colour — value, intended use,
  prohibited use, whether it is safe for text, and its contrast — is the
  "Color System" section of `docs/design-language.md`.
- **Type** — `text-display`, `text-h1`…`text-h3`, `text-body`, `text-small`,
  `text-caption`. Each carries its own line height, so a size and a leading
  are never set separately. `h1`–`h3` elements pick up Instrument Serif
  automatically; a small semantic heading that is really a UI label opts out
  with `font-sans`.
- **Spacing** — Tailwind's scale, restricted to ten steps. The utility
  number is multiplied by a 4px base, so it is not the pixel value: `p-6` is
  24px, not 6px.

  | px  | utility | px  | utility |
  | --- | ------- | --- | ------- |
  | 4   | `*-1`   | 40  | `*-10`  |
  | 8   | `*-2`   | 48  | `*-12`  |
  | 16  | `*-4`   | 64  | `*-16`  |
  | 24  | `*-6`   | 80  | `*-20`  |
  | 32  | `*-8`   | 96  | `*-24`  |

  There is no `*-3`, `*-5`, `*-7`, `*-9` or `*-11` — those are the rejected
  values, not forgotten ones. Anything off the scale fails
  `spacing-scale.test.ts`. Sizing (`h-`, `w-`, `size-`) is component
  geometry, not spacing, and is not covered by the guard.

- **Radius** — `rounded-md` is the default. `rounded-sm` for compact
  controls, `rounded-lg` for sheets and dialogs, `rounded-pill` for pills.
  `rounded-full` stays for true circles.
- **Shadow** — `shadow-subtle` for cards, `shadow-dialog` for dialogs.
  Buttons get none.
- **Motion** — every `transition-*` utility already uses the documented
  duration and easing, because the Tailwind defaults point at the tokens.
  Framer Motion animations use the helpers in `tokens.ts`.

### The component-token escape hatch

There is currently **no** geometry off the spacing scale. Card padding used
to be 20px, which the scale does not allow; `docs/ui-rules.md` contradicted
itself and was amended to 24px, so cards simply use `p-6`.

The hatch stays open for the next genuine case: if `ui-rules.md` ever fixes
a size the scale cannot express, it is declared in `component.css` and
referenced by name — `p-[var(--space-…)]`, never a bare `p-[20px]`. That
keeps the value greppable and tied to a documented rule. It is the _only_
accepted reason to write an arbitrary spacing value, and the guard enforces
exactly that shape.

**Prefer the official utility whenever one exists.** A component token that
duplicates a scale step is a second way to say the same thing.

## Two languages, one source of truth

Tokens are authored in CSS. `tokens.ts` exists only for values JavaScript
genuinely cannot reach, and holds two kinds:

- **Mirrors** of a CSS token — the motion numbers Framer Motion needs, and
  `BACKGROUND_COLOR` for the server-generated PWA manifest. Every one is
  drift-tested against the CSS by `tokens.test.ts`.
- **JS-only values** with no CSS counterpart: `SPLASH_FADE_MS` and
  `SPLASH_HOLD_MS`. Nothing to mirror, nothing to drift.

`tokens.test.ts` also asserts the module's complete export list, so a new
export fails the suite until someone justifies it. **Do not add anything to
`tokens.ts` that could be a utility or a `var()`** — mirroring the palette
for convenience would make it a second source of truth.

## Extending this

1. **Check the documents first.** If the value you need is not in
   `design-language.md` or `ui-rules.md`, the change belongs there first, as
   a decision. Adding it here quietly makes the code the source of truth,
   which is precisely backwards.
2. **Name it for meaning, not for use.** `--color-danger`, not
   `--color-delete-button`. A token that names a component is a component
   style hiding in the token layer.
3. **Prefer reusing over adding.** Two tokens with the same value are two
   things to keep in sync and one more decision for the next contributor.
4. **Check contrast.** Every text colour must clear WCAG AA (4.5:1) against
   the surfaces it appears on. Two tokens are documented exceptions and are
   never allowed to carry meaning:
   - `--color-muted-foreground` (#686F72, 4.6:1) is the readable secondary
     tone — descriptions, supporting copy, form labels and help text, hints,
     metadata, navigation labels. **If the user must read it, it goes here.**
   - `--color-subtle-foreground` (#9AA09A, 2.4:1) is decorative only —
     ornament that carries no information. Never body copy, labels, help
     text, validation, navigation or placeholders.
   - `--color-accent` (3.7:1) is a UI colour: fills, borders, controls,
     focus rings. For accent-coloured _text_, use `--color-accent-strong`.
5. **Extend, don't fork.** New primitives consume these tokens. A component
   that needs a value the token layer does not have is usually a component
   that has drifted from the design language.

## Prepared, not yet built

- **Dark mode** — the architecture is ready: every colour resolves through a
  semantic token, so a dark theme means redeclaring those tokens under
  `.dark` in `globals.css`. That block is deliberately empty until the
  Settings theme control ships. Do not fill it with placeholder values.
- **High contrast** — `prefers-contrast: more` in `tokens/color.css`
  strengthens secondary text, muted text and borders. It redeclares the same
  tokens rather than introducing a parallel palette.
- **Reduced motion** — handled globally in `motion.css`, and again per
  animation via `useReducedMotion()` and the `tokens.ts` helpers. The splash
  is the one place where a _delay_ rather than an animation had to be
  skipped: under reduced motion its hold drops to zero and the user is
  routed on immediately.
- **Component geometry** — `component.css` holds the documented button,
  input, textarea and card sizes. The primitives in `src/components/ui`
  still ship their generated geometry and adopt these values when they are
  redesigned.
