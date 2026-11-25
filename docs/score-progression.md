# Score progression

Status: **rules decided 2026-11-25**. This file is the implementation plan for replacing the placeholder score (`frontend/src/features/score/placeholder.ts`, `TODO(score)`).

## 1. Overview

- Every **full 10 minutes in the Player** earns **1 drop**, at most **3 drops per day**.
- Every **3 drops** opens the next level. There are 6 levels; everyone starts at level 1 with 0 drops, so the max is reached at 15 drops:

| Level | Drops needed | Tree stage | Sun gradation |
|-------|--------------|------------|---------------|
| 1 | 0 | 1 | 1 |
| 2 | 3 | 2 | 1 |
| 3 | 6 | 3 | 2 |
| 4 | 9 | 4 | 2 |
| 5 | 12 | 5 | 3 |
| 6 | 15 | 6 | 3 |

- Drops have no upper limit: the total keeps growing past 15, while the level stops at 6.
- **Decay:** each past day without earning a drop takes away 1 drop.
- The Home page (logged in) shows the total drops and the user's tree.

Formulas: `level = min(floor(drops / 3) + 1, 6)`, `treeStage = level`, `sunGradation = ceil(level / 2)`. There is no level 0, so every level has its own tree stage.

## 2. Rules

| Rule | Decision | Why |
|------|----------|-----|
| Drop rate | 1 drop per full 10 minutes in the Player on a local day: `floor(playerSeconds / 600)`. Minutes under 10 are lost at midnight, not carried over. | Each day counts on its own, which keeps the computation simple. |
| Daily cap | 3 drops per day (= 30 min); time past that earns nothing more. | Without a cap, 2.5 hours on day one would reach the max. With it, the max takes at least 5 days, and the Home copy "Come back tomorrow to earn up to 3 more drops" stays true. |
| What counts as time | Only time with the Player tab visible (`document.visibilityState === 'visible'`). No Done/Skip is required. | `usePlayerTimer` also counts background tabs (only gaps of 2+ minutes are skipped), so a Player left open overnight would earn drops without any revising. |
| Total | `drops ≥ 0`, no upper limit; level stays at 6 from 15 drops on, and Home shows the real total. | Accepted trade-off: a user with 60 drops can stop for 45 days and still show level 6, because decay eats the excess first. |
| Active day | A day with at least 1 drop earned (≥ 10 min of visible time). A 9-minute day still decays. | Otherwise opening the Player for 5 seconds would block decay while earning nothing. |
| Decay | Every past local day that is not active: `drops - 1`, floor 0. Today never decays; an active day never decays. | A day's decay is only known once it is over in the user's timezone; otherwise every user would lose a drop each morning before opening the Player. 1 per idle day is gentle: a week off takes the max down only to level 3 (15 → 8). |
| Start | Everyone starts at 0 drops on launch day. `player_seconds` rows from before the launch date count toward neither drops nor decay. | Deriving drops from older history would hand out scores on day one. |
| Levels | Level 1 at 0 drops; levels open at 0/3/6/9/12/15. | A level 0 would have no tree picture; this way each of the six drawn stages is used. |
| Sun | On every page, logged-in users see the gradation of their level (`ceil(level / 2)`); guests always see gradation 2. | `SunGlow` is rendered in `__root`, so the score is loaded app-wide for logged-in users. |
| Guest Home copy | The tree cards in `GROWTH_STAGES` (`GuestHome.tsx`) say "Sprout · Level 1", "Leaves · Level 4", "Apples · Level 6" instead of "Day 1" / "Days 6–8" / "Days 12–15". | Day ranges no longer match drop-based levels. |
| Level-down hint | When decay has lowered the level, Home shows a one-line hint, e.g. "Your tree lost a level — 10 minutes in the Player brings it back". No notifications. | Tells the user why the tree shrank and how to fix it, without nagging. |
| Player top bar | A small "next drop in N min", in place of the streak chip hidden in Redesign Step 9. Later task, not in the first release. | REDESIGN-PLAN says that chip returns together with score logic. |

Worked example:

| Day | Minutes in Player | Earned | Decay | Total | Level |
|-----|-------------------|--------|-------|-------|-------|
| Mon | 25 | 2 | – | 2 | 1 |
| Tue | 45 | 3 (cap) | – | 5 | 2 |
| Wed | 0 | 0 | −1 | 4 | 2 |
| Thu | 9 | 0 | −1 | 3 | 2 |
| Fri | 30 | 3 | – | 6 | 3 |

## 3. Why this fits the existing app

- **The data already exists.** `user_daily_activity.player_seconds` stores the Player time per user and per local day (`X-Timezone`), reported every ~30 s by `usePlayerTimer` and on page unload. Drops can be **derived from that table**, so no new table, migration or cron job is needed (see §4).
- **The rule is easy to explain**: 10 min = 1 drop, 3 drops = 1 level, 6 levels. It fits the six tree illustrations and three sun gradations, all exported to `frontend/src/assets/` (see §5).
- **It settles a known issue.** `known-issues.md` ("Tree stage ranges, still to decide") says the stage unit is open; this plan makes the unit drops, 3 per stage.

## 4. Implementation sketch

Follows the usual path: contracts → backend → frontend (see `CLAUDE.md`).

**Contracts** (`packages/contracts/src/score.ts`, new): `scoreResponseSchema` with `totalDrops` (≥ 0, no upper limit), `level` (1–6), `treeStage` (1–6), `sunGradation` (1–3), `earnedToday`, `maxPerDay`, `levelLost` (true when decay since the last active day lowered the level, for the level-down hint; it clears once today earns a drop). Constants `SECONDS_PER_DROP = 600`, `MAX_DROPS_PER_DAY = 3`, `DROPS_PER_LEVEL = 3`, `MAX_LEVEL = 6` live here, so both sides use the same numbers.

**Backend**
- `lib/score.ts`: a pure function `computeScore(days: { activityDate, playerSeconds }[], today: Date)` that walks every local day from the start date to yesterday (gaps in the rows are idle days), then adds today's drops without decay. Unit tests cover: empty history (level 1), cap per day, total growing past 15 while level stays 6, decay to 0, gaps, today not decaying, the worked example above.
- `GET /activity/score` in the `activity` module (see §5): reads the user's rows (`player_seconds` only) and returns the DTO. One query of at most a few hundred rows per user; no stored total, so there is nothing to keep in sync and no cron job.
- If that ever gets slow: store `drops` and `computed_through` on the user and walk only the new days. Not needed now.
- OpenAPI entry in `openapi/spec.ts`; update `backend/docs/DATA-FLOWS.md`.

**Frontend**
- `features/score/`: `api.ts`, `queries/use-score.ts`, query key in `lib/query-keys.ts`. Invalidate it when a Player-time report crosses a 10-minute mark (or simply when the Player unmounts).
- `TreeCard`: real `totalDrops`, stage, level label, "earned today / max per day" copy and the level-down hint; delete `placeholder.ts` and its test, and move `getTreeStage` (drops → stage) next to the API code with a new test.
- `usePlayerTimer`: count only visible time.
- `SunGlow`: draw gradations 1 and 3 from `assets/sun/level-1.svg` and `level-3.svg` (only 2 exists today), and read the gradation from the score for logged-in users.
- Guest Home copy; `PRODUCT.md`, `WIREFRAMES.md`, `METRICS.md`; remove the placeholder-score and tree-stage entries from `known-issues.md`.

## 5. Technical choices

Approved 2026-11-25, settled before the briefs so builders don't have to guess:

- **Endpoint:** `GET /activity/score` in the existing `activity` module, not a new `modules/score/`. `activity` already owns `user_daily_activity`, and modules must not import each other's services.
- **Today:** the user's local day from `resolveActivityDate(req.get('X-Timezone'))` (`backend/src/lib/daily-activity.ts`), the same as for the Player-time rows.
- **Launch date:** a constant `SCORE_LAUNCH_DATE` (`YYYY-MM-DD`) in `backend/src/lib/score.ts`, set to `2026-11-25` in task 1 (task 2 does not touch that file). Rows dated before it are ignored. The walk starts at the first row on or after it with `playerSeconds > 0`, so a user who never opened the Player has no idle days to decay.
- **`levelLost`:** `earnedToday === 0` and the current level is below the level at the end of the last active day. One extra number from the same walk; nothing stored.
- **Images:** the design exports are in `frontend/src/assets/` (added 2026-11-25): `tree/level-1.svg` … `level-6.svg` and `sun/level-1.svg` … `level-3.svg`, one file per tree stage and sun gradation. They are the **source** artwork and are not imported at runtime: they carry hard-coded hex colours and a C2PA metadata block, while the app draws them as inline components coloured by tokens in `frontend/src/index.css`.
  - Trees: `components/brand/tree/TreeStage1–6.tsx` already match the exports (same shapes per stage, colours as `tree-*` tokens), so no tree work is needed.
  - Sun: `sun/level-2.svg` matches today's `SunGlow` and its `--sun-r300/210/130/70` tokens. Levels 1 and 3 are new and are ported in task 5: level 1 has 4 circles (r 220/150/95/50), level 3 has 5 (r 380/280/180/110/84).
- **Contracts:** one new subpath `@remindme/contracts/score` (`packages/contracts/src/score.ts` plus an `exports` entry in `packages/contracts/package.json`).

## 6. Task split

Each task is its own branch (`create-branch`), PR and progress line. 1 → 2 → 3 are sequential. 4 and 5 touch different files and can run in parallel once 2 is merged. 6 comes after 4.

**Task 1. Score rules in contracts and a pure `computeScore`**
- Goal: the rules from §2 as constants, a DTO schema and one tested pure function; no HTTP, no UI.
- Files: `packages/contracts/src/score.ts` (new), `packages/contracts/package.json` (`exports`), `backend/src/lib/score.ts` + `score.test.ts` (new).
- Tests: empty history (level 1, 0 drops), daily cap, remainder lost at midnight, a 9-minute day decays, gaps between rows decay, decay floors at 0, total past 15 keeps level 6, today never decays, rows before `SCORE_LAUNCH_DATE` ignored, `levelLost` on and off, the worked example in §2.
- Done when: `npx vitest run src/lib/score.test.ts` in `backend/` passes and `npm run ci` is green.

**Task 2. `GET /activity/score` endpoint**
- Goal: return the score DTO for the logged-in user from their `player_seconds` rows.
- Files: `backend/src/modules/activity/activity.routes.ts`, `activity.service.ts`, `backend/src/openapi/spec.ts`, `backend/docs/DATA-FLOWS.md`. Don't touch `lib/score.ts` beyond imports.
- Done when: `npm run ci` is green, and with the dev server running, signed in as the dev admin, `GET /api/v1/activity/score` returns a body that passes `scoreResponseSchema`.

**Task 3. Home on real score data**
- Goal: the Home tree card and guest copy use the real score; the placeholder is gone.
- Files: `frontend/src/features/score/` (`api.ts`, `queries/use-score.ts`, `types.ts`, `get-tree-stage.ts` + test; delete `placeholder.ts` + `placeholder.test.ts`), `frontend/src/lib/query-keys.ts` (`activity.score`), `features/home/components/TreeCard.tsx`, `HomePage.tsx`, `GuestHome.tsx` (`GROWTH_STAGES` → "Level 1/4/6").
- TreeCard shows the real total, stage, level, "earned today / 3" and the level-down hint when `levelLost`.
- Docs: `frontend/docs/PRODUCT.md`, `WIREFRAMES.md`, `METRICS.md`; remove the "Placeholder score" and "Tree stage ranges" entries from `docs/agile/known-issues.md`.
- Done when: `npm run ci` is green, `grep -rn "getPlaceholderScore\|TODO(score)" frontend/src` finds nothing, and Home in the browser shows the endpoint's numbers.

**Task 4. Visible-only Player time**
- Goal: `usePlayerTimer` counts only time while `document.visibilityState === 'visible'`, and invalidates the score query when a report crosses a 10-minute mark and on unmount.
- Files: `frontend/src/features/player/hooks/use-player-timer.ts` (+ test). Don't touch `features/home` or `components/brand`.
- Done when: a unit test shows hidden time is not reported, and `npm run ci` is green.

**Task 5. Sun gradations on real data**
- Goal: `SunGlow` draws gradations 1, 2 and 3; `__root.tsx` passes the logged-in user's `sunGradation`, guests get 2.
- Source: `frontend/src/assets/sun/level-1.svg` and `level-3.svg`. Port their circles into `SunGlow` the way gradation 2 is done: one `--sun-*` token per circle in `index.css` (colour and opacity from the file's `fill` + `fill-opacity`), no `fill-opacity` on the circles, and no import of the SVG files.
- Files: `frontend/src/components/brand/SunGlow.tsx`, `frontend/src/index.css` (new sun tokens), `frontend/src/routes/__root.tsx` (reads `useScore` only when logged in). Don't touch `features/player`, `features/home` or `assets/`.
- Done when: `npm run ci` is green, `grep -rn "assets/sun" frontend/src --include=*.tsx` finds nothing, and the browser shows a different sun for a level 1 user (gradation 1) and for a guest (gradation 2).

**Task 6 (later). "Next drop in N min" in the Player top bar**
- Goal: a small chip, where the streak chip was, showing the minutes left to the next drop today, or "3/3 today" at the cap.
- Files: `frontend/src/features/player/components/` (top bar), reading `useScore` plus the local timer. Starts after task 4.
