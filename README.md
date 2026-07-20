# Ondenna

A seasonal life system: change one thing intentionally through 28-day seasons.

The product vision, architecture, and screen specifications live in
[`docs/`](./docs) — **read them before writing code**:

- [`docs/product.md`](./docs/product.md) — vision, philosophy, MVP scope
- [`docs/architecture.md`](./docs/architecture.md) — technical source of truth
- [`docs/screens.md`](./docs/screens.md) — screen-by-screen specification

## Stack

Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 4 ·
shadcn/ui · Framer Motion · Zustand · React Hook Form + Zod · next-intl
(en/tr) · Supabase · Vitest · Playwright · pnpm

## Getting started

```bash
pnpm install
cp .env.example .env.local   # then fill in the real Supabase values
pnpm dev
```

Open http://localhost:3000 — you'll be redirected to the default locale
(`/en`; Turkish lives under `/tr`).

## Scripts

| Command          | Purpose                |
| ---------------- | ---------------------- |
| `pnpm dev`       | Dev server (Turbopack) |
| `pnpm build`     | Production build       |
| `pnpm lint`      | ESLint                 |
| `pnpm typecheck` | TypeScript, no emit    |
| `pnpm format`    | Prettier write         |
| `pnpm test`      | Unit tests (Vitest)    |
| `pnpm test:e2e`  | E2E tests (Playwright) |

## Project structure

See the "Repository Layout" section of `docs/architecture.md`. In short:
routes live under `src/app/[locale]/`, product code lives in feature modules
under `src/features/`, shared primitives in `src/components/ui`, and all
user-facing copy in `src/messages/{en,tr}.json`.

## Deliberately not here yet

Authentication, database tables, business logic, and UI screens are out of
scope for the foundation — see `docs/architecture.md`, "Explicitly Out of
Scope for the Foundation".
