# Progress

Each line: date (YYYY-mm-dd), what had been done.

2026-11-12 Entity visibility (backlog Task 1): visibility switches with tooltips on Topic and Entity cards and in the Constructor panel, plus a gray "hidden" marker on Category/Topic/Entity cards. Topic visibility is derived from its entities and cascades; new PATCH `/visibility` endpoints for topics and entities.
2026-11-12 Constructor no longer discards unsaved edits when visibility or a marker is toggled: the form resets only when the entity id or `editedAt` changes.

2026-11-12 Added `commit-message` skill (.claude/skills/commit-message): drafts the commit message after the orchestrator's task is accepted, writes it to `.git/commit-message-draft.txt` for editing, and commits only after approval.
2026-11-12 `commit-message` skill: subject now starts with the task number, taken from the backlog title for backlog tasks, otherwise from the previous commit + 1; asks the user when no number is available.
2026-11-12 `commit-message` skill: message is now `[number] title` plus the backlog Goal line; the skill no longer runs git diff, relying on the briefs and reviewer report. Skill shortened.
2026-11-14 Added `docs/agentic-cicd-plan.md`: the plan for deploying to Vercel with `dev`/`prod` branches, a GitHub Actions quality gate, CD and cloud agents, with theory, Mermaid diagrams and interview prep. Measured the current gate baseline it starts from.
2026-11-14 Reworked `docs/agentic-cicd-plan.md` to drop staging: a green push to `dev` now deploys to production automatically (staged deploy, smoke test, promote), and the pipeline moves `prod` to the deployed commit.
2026-11-14 Updated `docs/agentic-cicd-plan.md` for a PR-based flow: feature branch → PR into `dev` with required checks and Claude review → my squash merge → the existing pipeline to production. Rulesets, the `ship` skill, diagrams and interview Q&A now follow it.
2026-11-16 Plan Phase 0.1: `.mcp.json` reads the context7 key from `${CONTEXT7_API_KEY}` instead of a literal; the user reports the old key is rotated (not checked against the dashboard), but it remains in one git commit.
2026-11-16 `commit-message` skill: added a temporary rule (step 6) to never create a new branch for a commit; commit on the checked-out branch until the user changes it.
2026-11-16 `docs/agentic-cicd-plan.md`: added a Status column (✅ done / ⬜ todo) to the Phase 0–5 step tables and marked 0.1 done; Part E checkbox for the context7 key ticked.
2026-11-16 Plan 0.2: removed the stray `frontend/package-lock.json` (staged deletion, not yet committed); the root `package-lock.json` is unchanged.
2026-11-16 Plan 0.3: added `.nvmrc` containing `24`; `engines.node` (`^24.0.0`) was already set in the root and backend `package.json`, and the local Node (v24) matches.
2026-11-16 Plan 0.4: added `.vercel/` to `.gitignore`; `git check-ignore` confirms files under it are ignored.
2026-11-16 Plan 0.5: branches renamed (`main` is now `dev`) and `prod` created; both point at 7db1caa, so `prod` is ahead of anything deployed.
2026-11-16 Plan 0.6: GitHub has `dev` and `prod` with `dev` as the default branch; the repo is public and the public history is kept unchanged (see decisions.md).
2026-11-16 Branch names now follow `<type>/<number>_<short_task_name>` (for example `feature/33_some_task_name`), with `feature` replacing `feat` in the plan and `decisions.md`. The number matches the commit number.
2026-11-16 Added the `create-branch` skill (`.claude/skills/create-branch`): the orchestrator runs it at task start to cut `<type>/<number>_<short_task_name>` from the latest `dev`, and it never commits or pushes. CLAUDE.md now points to it, and the `commit-message` skill no longer carries a temporary no-branch rule.
2026-11-16 `create-branch` now reads the previous commit number after switching to `dev`, and its name check accepts 1–4 words; `docs/orchestrator.md` shows the branch step.
2026-11-16 Added the `merge-branch` skill (dialog: fast-forward `dev` to the task branch and delete it, only when chosen), and `commit-message` now ends with a commit button. Backlog tasks start with `create-branch` too.
2026-11-16 Review fixes: `commit-message` refuses to commit on `dev` or `prod` and describes the commit button; `merge-branch` checks that local `dev` is not behind origin; the backlog arrow in `docs/orchestrator.md` goes through `create-branch`; decisions line 8 is back to its 2026-11-14 wording, with a superseding line added.
2026-11-16 `merge-branch` now pushes `dev` to origin with a plain push right after the fast-forward merge, and deletes the task branch only after the push succeeds.
2026-11-16 Plan 1.1: root `typecheck`, `lint`, `format:check`, `test`, `build` and `ci` scripts run every check that exists in the workspaces; `npm run ci` stops at lint (19 errors, 1 warning, step 1.2). The backend has no lint script yet, so root `lint` covers the frontend only.
2026-11-16 Backend gets a `format` script (`prettier --write .`), and the frontend `format` is now prettier-only, because its `eslint --fix` step crashes on `src/components/ui/chart.tsx`. Each workspace has `format`, and root `format:check` stays the pipeline check.
2026-11-16 The frontend `format` and `check` now skip `frontend/docs` (`'!docs/**'`), so Prettier only covers the rest of the frontend.
2026-11-16 Plan 1.2: the 19 frontend lint errors are fixed and `npm run lint` now exits 0, with the frontend typecheck still passing. Checks the type system proves redundant were removed, and checks on values that can be missing at runtime were kept and typed (PlayerPage's current item via `queue.at(0)`, chart.tsx's config lookup).
2026-11-16 Plan 1.3: `npm run format` in frontend/ changed only `src/routeTree.gen.ts`, back to its pre-merge formatting, and that generated file is now excluded in `frontend/.prettierignore`. The format commit `d3b7a4d` is listed in `.git-blame-ignore-revs`.
2026-11-16 Plan 1.4: 38 frontend tests (vitest) cover the entity payload and form-value helpers, player session helpers and contract schemas, and 12 backend tests cover pagination and the daily-activity day logic; the backend `test` script now runs vitest instead of `node --test`. A frontend `vitest.config.ts` keeps `npm run test` from rewriting `src/routeTree.gen.ts`.
