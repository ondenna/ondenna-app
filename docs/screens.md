# Ondenna Screens

Version: 1.0
Status: Draft — pending approval
Last Updated: July 2026

Every screen must answer **one question** and offer **one primary action**.
Each screen below is specified as: the question it answers, its primary
action, its secondary content, and its states. Copy shown here is
illustrative English; all real copy lives in the i18n catalogs.

---

# Navigation Model

Mobile-first shell with **three tabs**:

1. **Today** — the dashboard (default tab)
2. **Seasons** — past seasons and their reports
3. **Settings**

Onboarding, season creation, weekly reflections, and season reports are
full-screen focused flows presented **over** the shell, one question per
screen. There is no hamburger menu, no notification center, no feed.

Auth screens (sign up / sign in) exist in the user journey but are specified
and implemented in a later phase, together with Supabase Auth.

---

# 1. Welcome

- **Question:** What is Ondenna?
- **Primary action:** "Begin your first season"
- **Content:** Two or three quiet sentences of philosophy. No feature tour,
  no carousel, no permissions requests.
- **Shown:** once, after first sign-up, or when the user has no season at all.

---

# 2. Season Creation (focused flow, one question per screen)

A season cannot be edited after it starts, so this flow ends with a review
step. Only reachable when the user has **no active season** (hard rule).

## 2a. Focus

- **Question:** "What do you want to change this season?"
- **Primary action:** Continue
- **Input:** one short text field. One focus only — the UI offers no way to
  add a second goal.

## 2b. Why

- **Question:** "Why is this important to you?"
- **Primary action:** Continue
- **Input:** free text, a few sentences. This text reappears in the season
  report, so the screen says so quietly.

## 2c. Start date

- **Question:** "When does your season begin?"
- **Primary action:** Continue
- **Input:** date picker, defaulting to today. Season end date (start + 27)
  is shown as calm secondary text.

## 2d. Review & commit

- **Question:** "Ready to begin this season?"
- **Primary action:** "Begin season" — this is where the season actually
  starts. No step after it.
- **Secondary action:** "Go back and edit", returning to the start-date step.
  From there the header back control walks every earlier step.
- **Content:** the whole draft read back as label/value pairs — season focus,
  why it matters, start date, end date.
- **Notices:** one quiet line that every season lasts 28 days, and one clear
  line that the season focus cannot be edited once the season begins. The
  second is associated with the primary action via `aria-describedby`.
- **No confirmation checkbox.** The review content plus a deliberately named
  primary action carry the commitment; a checkbox would add friction without
  adding understanding.
- **Data retention:** moving backwards never discards an answer, including
  text typed but not yet submitted. The draft is the source of truth and each
  step rehydrates from it.

---

# 3. Today (Dashboard)

- **Question:** **"What matters today?"** Everything else is secondary
  context.
- **Primary action:** today's check-in (see Screen 4).
- **Secondary context (quiet, below the fold in priority):**
  - The season focus, as a sentence — a reminder of identity, not a stat.
  - Day _N_ of 28, as plain text. No progress ring, no percentage, no streak.
  - Yesterday's entry with an "edit" affordance if still within the edit
    window.
- **States:**
  - **No season:** shows Welcome / "Begin a season" (Screen 1).
  - **Season starts in the future:** shows the focus and the start date,
    nothing actionable.
  - **Active, not checked in:** check-in is the primary action.
  - **Active, checked in:** a calm confirmation; the app encourages the user
    to leave and live their day. No further actions are pushed.
  - **Reflection day (7/14/21/28):** after check-in, a single quiet prompt
    invites the weekly reflection.
  - **Day 29+ (season over):** routes to the Season Report (Screen 6).
- **Season options** (overflow, deliberately understated): view season
  details, abandon season. Abandoning asks one confirmation, uses neutral
  language, and never uses the word "fail."

---

# 4. Daily Check-in

- **Question:** "Did you complete today's commitment?"
- **Primary action:** **Yes** / **No** — two equal, calm buttons. "No" is
  never styled as a failure.
- **Optional:** a short personal note (single small field, collapsed by
  default).
- **Not present:** mood tracking, scores, percentages, streaks.
- **Rules:**
  - One check-in per day; answering again edits today's entry.
  - **Yesterday** may be edited; anything older is locked and the UI never
    offers it.
- **After answering:** a brief, quiet acknowledgment — no confetti, no
  streak count — then back to Today.

---

# 5. Weekly Reflection (days 7, 14, 21, 28)

- **Question:** "What did this week teach you?"
- **Primary action:** Save reflection
- **Input:** three guided questions, free text only, one per screen in a
  short focused flow:
  1. What went well?
  2. What was difficult?
  3. What will you improve next week?
- **Rules:** optional but invited once on the reflection day; can be
  completed later while the season is active. Skipping never nags.

---

# 6. Season Report (day 29, and from History)

- **Question:** "What did this season mean?"
- **Primary action:** on first view — write the **final reflection** (free
  text); afterwards — "Start a new season" or "Take a break", presented as
  two equal choices with no pressure toward either.
- **Content (reflective, not analytical):**
  - Season focus
  - Why it mattered (from onboarding)
  - The four weekly reflections
  - Personal notes from daily check-ins
  - The final reflection
  - Minimal numbers, stated in a sentence: **days completed** and **season
    length**. Nothing else — no streaks, XP, badges, charts, or grades.
- **States:** completed and abandoned seasons both get a report; an
  abandoned season's report simply covers the days that happened, with
  neutral language.

---

# 7. Seasons (history)

- **Question:** "Where have I been?"
- **Primary action:** open a season's report.
- **Content:** previous seasons as **simple cards** — focus, date range,
  status (completed / abandoned, neutrally worded). No aggregate stats
  across seasons.
- **Empty state:** one quiet sentence; no illustration of sadness, no CTA
  pressure.

---

# 8. Settings

- **Question:** "How does Ondenna fit me?"
- **Content:** a plain list linking to:
  - **Profile** — name, avatar, timezone, preferred language. Nothing more.
  - **Theme** — system / light / dark.
  - **Notifications** — one optional daily reminder: on/off and time.
    **Off by default.**
  - **Language** — English (default) / Turkish.
  - **Export data** — request a full export of the user's data.
  - **Delete account** — clearly worded, double-confirmed, final.
- Each item is its own simple sub-screen with one concern.

---

# Global UX Rules

- One primary action per screen, always.
- Missed days are visually neutral — never red, never crossed out.
- No badges, streak flames, progress rings, or celebratory effects.
- Motion is subtle and respects `prefers-reduced-motion`.
- Every screen must be comfortably usable one-handed on a small phone.
- The daily loop (open → check in → close) must take under one minute.
