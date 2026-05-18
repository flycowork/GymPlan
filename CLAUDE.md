# CLAUDE.md — Isaac's Gym Tracker

## What this is
A personal mobile-first workout tracker PWA for a single user (Isaac). Built with Next.js 14 (App Router), TypeScript, Tailwind CSS. Deployed on Vercel.

## Project structure
```
app/
  globals.css          — Tailwind + custom styles, DM Sans + JetBrains Mono fonts
  layout.tsx           — Root layout, PWA metadata, viewport config
  page.tsx             — Main page, manages navigation state (dashboard ↔ workout day)
components/
  dashboard.tsx        — Home screen: week selector, day cards with progress bars
  exercise-card.tsx    — Individual exercise: name, reps, notes, set checkboxes
  rest-timer.tsx       — Sticky bottom rest timer with presets (45s, 1m, 90s, 2m)
  weight-log.tsx       — Weight tracking grid per exercise across 4 weeks
  workout-day.tsx      — Full workout day view: warmup (collapsible) + blocks + weight log
lib/
  hooks.ts             — All state management (currently localStorage, needs migration to Vercel KV)
  program-data.ts      — All workout program data (exercises, sets, reps, notes)
public/
  manifest.json        — PWA manifest
  icon-192.png         — PWA icon
  icon-512.png         — PWA icon
```

## Design system
- Dark theme: bg `#0A0A0B`, surface `#141416`, border `#1E1E22`
- Accent blue `#3B82F6` (strength), red `#EF4444` (conditioning), green `#22C55E` (optional days)
- Font: DM Sans (display), JetBrains Mono (numbers/timers)
- Mobile-first, max-width `max-w-lg`, designed for one-handed gym use
- PWA: standalone mode, dark status bar, safe-area-inset for iPhone

## Current program data structure
Programs are defined in `lib/program-data.ts`. Key types:
- `WorkoutDay` — id, day number, title, subtitle, emoji, type (core/optional), blocks[], logExercises[]
- `WorkoutBlock` — label, type (strength/conditioning/warmup/full), description, exercises[], footer
- `Exercise` — name, sets, reps, rest, notes
- `warmup` is a shared block imported separately and prepended to all days

Currently there's only one program (Phase 1). The data is hardcoded.

## State management (lib/hooks.ts)
Four hooks, all using localStorage:
- `useWeightLog()` — stores weight entries as `{exercise, week, value}[]`
- `useSetTracker()` — stores completed sets as `{dayId, exerciseName, setIndex, week}[]`
- `useCurrentWeek()` — stores current week number (1-4)
- `useRestTimer()` — in-memory only (countdown timer with vibration)

Keys: `gym-tracker-weights`, `gym-tracker-sets`, `gym-tracker-week`

---

## PENDING CHANGES (in priority order)

### 1. BUG FIX: Progress percentage calculation is wrong
**Problem:** When you complete all exercises in a day, exit, and re-enter, the progress doesn't show 100%. The percentage is inconsistent.

**Root cause:** `getTotalSets()` in `hooks.ts` (line 123-135) counts warmup exercises in the total (because `workout-day.tsx` line 25 passes `[warmup, ...day.blocks]`), but the warmup section in `exercise-card.tsx` uses `blockType="warmup"` which renders NO set checkboxes and NO "mark done" buttons. So the denominator includes warmup exercises (~6) but the numerator never can — the user can't check them off.

**Fix options (pick one):**
- A) Exclude warmup block from `getTotalSets` calculation (simplest — warmup shouldn't count toward progress)
- B) Add checkboxes to warmup exercises too (worse UX — nobody wants to check off neck stretches)

**Recommendation:** Option A. Also in `dashboard.tsx` line ~55, `getTotalSets` is called the same way — fix both.

### 2. Multi-program support (program selector on home screen)
**What:** Add a program selector at the top of the dashboard so Isaac can switch between Phase 1, Phase 2, etc.

**Implementation approach:**
- Move program data into a `programs` array in `program-data.ts`, each with an `id`, `name`, `description`, `weeks` count, and `days[]`
- Add `useCurrentProgram()` hook to track selected program
- Dashboard shows a program picker (dropdown or horizontal scroll) before the week selector
- All set tracking and weight logs are scoped by `programId` (prefix keys: `{programId}-{dayId}-{exercise}`)
- When adding Phase 2 later, just add another entry to the programs array

**Current Phase 1 data stays exactly the same** — just wrapped in a program container.

### 3. Migrate storage from localStorage to Upstash Redis (cross-device sync)
**Why:** Isaac uses the app on both phone and desktop. localStorage is device-local.

**Implementation:**
- Install `@upstash/redis`
- Create API routes under `app/api/`:
  - `GET /api/data?key=...` — read from Redis
  - `POST /api/data` — write to Redis `{key, value}`
- Refactor hooks in `lib/hooks.ts` to call API routes instead of localStorage
- Use localStorage as cache/fallback for offline resilience
- Keep `useRestTimer` as local-only (no need to sync timer state)
- All Redis keys prefixed with `isaac:` (single user, no collision issues)
- Add loading states to components while data fetches

**Environment:** Vercel injects `KV_REST_API_URL` and `KV_REST_API_TOKEN` (via the native KV integration). For local dev, use `vercel env pull` to get them in `.env.local`.

### 4. Simple PIN protection
**Why:** Data is on a server now, needs basic access control.

**Implementation:**
- PIN stored as env var `APP_PIN` in Vercel (e.g. 4-6 digit number)
- On first visit (no valid session), show a PIN entry screen
- On correct PIN, set a cookie or KV session token (long expiry, e.g. 30 days)
- API routes check for valid session before returning data
- No login page — just a clean PIN pad that matches the dark theme
- If PIN is wrong, shake animation + retry. No lockout needed (single user).

---

## Program data — training context

### Isaac's training profile (for programming new phases)
- 39 years old, based in Barcelona
- Goal: fat loss + muscle strength gain
- 3-5 sessions/week, 45-50 min each (including warmup)
- Coming back from 6+ months off (Phase 1 was the ramp-up)
- Neck limitation from bike crash 5 years ago (always include neck CARs in warmup)
- Prefers bike/row for cardio — no running
- Background in CrossFit/functional training since ~2015

### Gym constraints
**Weekday gym (Mon-Fri):** Two floors. Strength floor has racks, barbells, dumbbells, benches, cables, KBs. Conditioning floor (separate) has: rower, assault bike, plyo boxes, med balls, sandbags, cable machines. Can carry a KB or dumbbell between floors but NOT a barbell with plates. No sled, no turf track.

**Weekend gym (Sat/Sun):** Everything on one floor including turf track with sled, corebags, wall ball targets, full KB range. No equipment restrictions.

### Program design principles
- Strength blocks = straight sets (all sets of A before B). Full rest between sets.
- Conditioning = circuit. Back-to-back exercises, rest between rounds.
- Phase 1 was full-body per day (ramp-up). Phase 2+ should use muscle group splits (push/pull, upper/lower, etc.) — shorter, denser strength blocks.
- If conditioning exercises have weight, always specify starting weight AND include a column in the weight log for weekly progression.
- RPE 7 for strength, RPE 8 for conditioning.
- Warmup always includes neck CARs.

### Phase 1 results (completed May 2026)
**Day 1 — Squat + Push + Row:**
| Exercise | Wk1 | Wk2 | Wk3 | Wk4 |
|---|---|---|---|---|
| Back Squat | 40 | 50 | 60 | 70 |
| DB Bench Press | 14 | 18 | 22 | 24 |
| Bent-Over Row | 40 | 40 | 50 | 60 |
| Conditioning Time | 11:00 | 10:40 | 8:58 | 8:00 |

**Day 2 — Hinge + Overhead + Pull:**
| Exercise | Wk1 | Wk2 | Wk3 | Wk4 |
|---|---|---|---|---|
| Deadlift | 50 | 60 | 60 | 60 |
| Push Press | 30 | 40 | 40 | 40 |
| Lat Pulldown | 42 | 22* | 50 | 60 |
| AMRAP Score | 3 | 3.1 | 3.3 | 3 |

*Wk2 was on cable pulley, rest on machine — not a real drop.

**Day 3 — Front Squat + Incline + Sled:**
| Exercise | Wk1 | Wk2 | Wk3 | Wk4 |
|---|---|---|---|---|
| Front Squat | 50 | 60 | 65 | pending |
| Incline DB Press | 18 | 22 | 26 | pending |
| Single-Arm Row | 24 | 24 | 28 | pending |
| Conditioning | 4R (didn't finish 5R) | 15:00 | 14:30 | pending |

---

## Style guidelines for code changes
- Keep the dark theme consistent. Use the `gym-*` color tokens from tailwind.config.ts.
- Mobile-first. Test at 375px width minimum.
- Keep components focused and small. One file per component.
- TypeScript strict mode. No `any` types.
- Functional components with hooks only.
- Comments in English. UI text in English (Isaac's preference for the app).

---

## How new programs get added

New training phases (Phase 2, Phase 3, etc.) are **designed in a separate Claude.ai project** where a personal trainer AI builds the program based on previous results, gym constraints, and progression principles. That project has full training context that this repo doesn't need.

**The workflow is:**

1. Isaac designs the new phase in Claude.ai (Training project) with the PT assistant
2. The PT generates a TypeScript data block matching the `WorkoutDay[]` format in `lib/program-data.ts`
3. Isaac brings that data block here (pastes it or asks Claude Code to integrate it)
4. Claude Code's job is to **add it to the programs array** in `program-data.ts` — not to redesign the training

**What this means for Claude Code:**
- When Isaac says "add Phase 2" and provides a data block, insert it into the programs array. Don't question the exercise selection, sets/reps, or progression — that's been validated by the PT.
- When Isaac asks for **quick edits** (fix a weight, change reps, swap an exercise, rename something), just do it directly.
- When Isaac asks to **design a new program from scratch**, suggest he does it in the Training project first for better results. But if he insists, use the training context in this file (profile, gym constraints, Phase 1 results) to build something reasonable.
- New programs follow the same data structure. Each program has: `id`, `name`, `description`, `weeks` count, and `days: WorkoutDay[]`. The UI auto-adapts.
