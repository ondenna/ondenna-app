# Ondenna Architecture

Version: 1.0
Status: Draft — pending approval
Last Updated: July 2026

This document is the technical source of truth for Ondenna. It encodes the
product decisions from `product.md` and the decision log of July 2026 into
architectural rules. If code and this document disagree, this document wins
until it is amended.

---

# Guiding Constraints

Architecture serves the product philosophy:

- Calm over clever. Prefer boring, proven technology.
- One focus per season is a **hard invariant**, not a UI convention.
- User wellbeing has priority over engagement. No architecture decision may
  exist solely to increase usage.
- Mobile first. Desktop is a secondary experience of the same codebase.
- The app must be usable in under one minute per day; performance budgets
  follow from that.

---

# Technical Stack (pinned)

| Concern         | Choice                               |
| --------------- | ------------------------------------ |
| Framework       | Next.js 15 (App Router)              |
| UI runtime      | React 19                             |
| Language        | TypeScript, `strict: true`           |
| Styling         | Tailwind CSS                         |
| Components      | shadcn/ui                            |
| Animation       | Framer Motion                        |
| Client state    | Zustand                              |
| Forms           | React Hook Form + Zod                |
| Backend         | Supabase (PostgreSQL, Auth, Storage) |
| i18n            | next-intl (locale-segment routing)   |
| Unit tests      | Vitest + Testing Library             |
| E2E tests       | Playwright                           |
| CI              | GitHub Actions (lint + typecheck)    |
| Hosting         | Vercel                               |
| Package manager | pnpm                                 |

---

# Repository Layout

```
ondenna-app/
├── docs/                    # Source of truth (this folder)
├── public/                  # Static assets, PWA icons
├── src/
│   ├── app/
│   │   ├── [locale]/        # All routes live under a locale segment
│   │   │   ├── (app)/       # Core app shell tabs: today, seasons, settings
│   │   │   ├── (onboarding)/# Season creation flow
│   │   │   └── layout.tsx
│   │   ├── manifest.ts      # PWA manifest
│   │   └── globals.css
│   ├── components/
│   │   └── ui/              # shadcn/ui primitives (generated, then owned)
│   ├── design/              # Design token layer — see below
│   │   ├── tokens/          # color, typography, spacing, radius, shadow,
│   │   │                    #   motion, component (all CSS)
│   │   ├── index.css        # single entry point, imported by globals.css
│   │   └── tokens.ts        # small JS mirror for Framer Motion + manifest
│   ├── features/            # Feature modules — see below
│   │   ├── season/          # Creation, lifecycle, past-seasons list
│   │   ├── check-in/
│   │   ├── reflection/
│   │   ├── report/
│   │   ├── profile/
│   │   └── settings/
│   ├── i18n/                # next-intl routing + request config
│   ├── messages/            # en.json (default), tr.json
│   ├── lib/
│   │   ├── supabase/        # Browser + server client factories
│   │   ├── dates/           # Season-day and timezone logic (pure, tested)
│   │   └── utils.ts
│   ├── stores/              # Zustand stores (UI state only)
│   └── types/               # Shared domain types
├── tests/
│   └── e2e/                 # Playwright specs
├── .env.example
└── .github/workflows/ci.yml
```

Rules:

- **Absolute imports only**, via the `@/` alias mapped to `src/`.
- A feature module owns its components, hooks, Zod schemas, and types:
  `features/<name>/{components,hooks,schemas,types}`. Cross-feature imports go
  through the feature's public `index.ts`.
- Unit tests are colocated (`foo.test.ts` next to `foo.ts`). E2E tests live in
  `tests/e2e`.
- `components/ui` is reserved for shadcn/ui primitives. Product components
  live in their feature module.
- No component may hardcode a design value. Colours, sizes, radii, shadows
  and durations come from `src/design/` — see below.

---

# Design Tokens

`design-language.md` and `ui-rules.md` decide the values; `src/design/` is
where they become code. The rules that matter architecturally:

- **CSS is the source of truth.** Tokens are authored as Tailwind
  `@theme static` blocks so each one is both a custom property and a
  utility. `src/design/index.css` is the only file `globals.css` imports.
- **`src/design/tokens.ts` is a mirror, not a second home.** It exists for
  Framer Motion and the PWA manifest, which cannot read custom properties.
  A unit test fails if it drifts from the CSS. Nothing that can be a utility
  or a `var()` belongs in it.
- **Tokens are semantic.** `--color-danger`, never `--color-delete-button`.
  Component-specific colours are not tokens.
- **The 8-point scale is enforced, not documented.**
  `src/design/spacing-scale.test.ts` fails the build on off-grid padding,
  margin or gap in product code. The documented off-scale geometry (card
  padding, control heights) lives in `tokens/component.css` and is
  referenced by name.
- **shadcn's token names survive as aliases** in `globals.css`, pointed at
  the Ondenna tokens. One authoritative value, two names, shrinking as the
  vendored primitives are redesigned.
- **Dark mode is prepared, not implemented.** Every colour resolves through
  a semantic token, so a dark theme is a redeclaration of those tokens. The
  `.dark` block is intentionally empty until the Settings theme control
  ships; it must not be filled with placeholder values.

Full contributor guide: `src/design/README.md`.

---

# Rendering & State Strategy

- **Server Components by default.** Client components only at interactive
  leaves (forms, check-in actions, animations).
- **Server state lives in Supabase** and is fetched in Server Components or
  route handlers. Zustand holds **ephemeral UI state only** (open sheets,
  onboarding step, optimistic flags). Domain data is never mirrored into a
  long-lived client store.
- All user input is validated with **Zod schemas** that live in the feature's
  `schemas/` folder and are shared between React Hook Form resolvers and any
  server-side validation. One schema per input shape; no duplicated types.
- Animations respect `prefers-reduced-motion`. Motion is subtle and slow by
  default — calm interface is a requirement, not a style preference.

---

# Domain Model (conceptual — no tables yet)

Database tables are explicitly out of scope for the foundation. The concepts
below fix the vocabulary and invariants that tables must later satisfy.

## Entities

- **Profile** — name, avatar, timezone (IANA), preferred language. Nothing more.
- **Season** — focus (what to change), motivation (why it matters), start
  date, length (always 28), status: `active | completed | abandoned`.
- **CheckIn** — one per season day. Fields: local calendar date, answer
  (`yes | no`), optional short note.
- **WeeklyReflection** — one per season week (days 7, 14, 21, 28). Three free
  text answers: what went well, what was difficult, what to improve.
- **SeasonReport** — derived view over a finished season plus one stored
  field: the final reflection (free text).

## Hard Invariants

1. **Exactly one active season per user.** This is a business rule that must
   eventually be enforced at the database level (partial unique index), not
   only in application code.
2. A season is **exactly 28 days**. Not configurable.
3. A season **cannot be edited after it starts**. It may be **abandoned**
   manually. There is no "failed" state — abandonment is a neutral action.
4. At most **one check-in per season day**.
5. Check-ins may be created or edited for **today and yesterday only** (in
   the user's current timezone). Older days are locked.
6. Check-ins carry no scores, streaks, or percentages. The only aggregate the
   product ever computes is _days completed_ and _season length_, and only in
   the season report.

---

# Time & Timezone Model

This is the most bug-prone area of the product; the rules are fixed here.

- A **season day** is a calendar date, not a 24-hour interval. Day _N_ of a
  season = `start_date + (N − 1)` days, as a plain date (`YYYY-MM-DD`).
- "Today" is always computed in the **user's current local timezone**
  (profile timezone, kept in sync with the device on app open). If the user
  travels, future days follow the new timezone; past check-ins keep the
  calendar date they were recorded under.
- Check-ins are keyed by **local calendar date string**, never by UTC
  timestamp, so travel and DST cannot shift a recorded day.
- Editing window: a check-in date is writable iff it equals today or
  yesterday in the user's current timezone.
- Season completion: the season is complete at the start of `start_date + 28`
  (day 29) in the user's current timezone; the dashboard then routes to the
  season report.
- All of this logic lives in `lib/dates/` as pure, unit-tested functions.
  No component computes dates inline.

---

# Internationalization

- i18n is foundational, not retrofitted. All routes live under
  `/[locale]/…` via next-intl middleware.
- Locales: `en` (default) and `tr`. Default locale resolution: user
  preference (profile) → browser `Accept-Language` → `en`.
- No hardcoded user-facing strings anywhere in `src/`; all copy comes from
  `messages/{en,tr}.json`. This is enforced by review, and later by lint.
- Dates and numbers are formatted with `Intl` APIs using the active locale
  and the user's timezone.

---

# Supabase Integration

- The Supabase project already exists. The foundation ships with
  **placeholder environment variables** only:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    documented in `.env.example`; real values are never committed.
- `lib/supabase/` provides two typed client factories: a browser client and a
  server client (cookie-aware, for Server Components / route handlers),
  following the `@supabase/ssr` pattern.
- **No database tables, no RLS policies, no auth flows are created in the
  foundation.** When tables arrive, every invariant in this document becomes
  a constraint or RLS policy, not just app code.

---

# Notifications (MVP scope)

- Exactly **one optional daily reminder**, fully configurable (time, on/off),
  **disabled by default**. Nothing else — no re-engagement, no marketing, no
  "you're losing your streak" style messages, ever.
- Implementation target: Web Push via the PWA service worker, scheduled
  server-side (Supabase scheduled function). The foundation only reserves the
  settings surface and the service-worker slot; no push logic is built yet.

---

# PWA

- MVP scope is **installable PWA only**: web app manifest, icons, correct
  theming, standalone display.
- **No offline support in MVP.** No data caching in the service worker, no
  sync queue. Offline synchronization is a future project and must not be
  partially implemented.

---

# Quality Gates

- **TypeScript**: `strict` plus `noUncheckedIndexedAccess`. No `any` in
  committed code.
- **ESLint + Prettier**: single config, enforced in CI.
- **Vitest**: unit tests, required for all `lib/dates/` logic from day one,
  plus the design-system guards in `src/design/` (token mirror, spacing
  scale).
- **Playwright**: E2E harness configured against the dev server; specs grow
  with features.
- **CI (GitHub Actions)**: on every push and PR — install (pnpm), lint,
  typecheck. Test jobs are added once there is behavior to test.

---

# Explicitly Out of Scope for the Foundation

- Authentication flows
- UI screens and business logic
- Database tables, migrations, RLS
- Offline support
- AI, social, gamification, integrations (see `product.md` exclusions)
