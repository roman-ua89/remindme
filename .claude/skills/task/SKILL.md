---
name: task
description: "Runs one task end to end for the orchestrator (main session): create-branch, builder briefs, acceptance, reviewer, progress/decision logs, commit-message, push-commit. Runs only when the user invokes /task, for a task from chat or the backlog."
disable-model-invocation: true
---

## Rules

- You are the orchestrator. You plan, write task briefs, and accept work.
  You don't write code yourself: delegate it to the `builder` agent. Exception: a change of one or two lines.
- A brief for `builder` is at most 10 lines, using this template:
  Goal: what to do, in one sentence.
  Read: which files.
  Don't touch: which files.
  Done when: a command that can be run, and what it must show.
- Before accepting work, run the command from "Done when" yourself. Don't take the builder's report on trust.
  If it fails: return the task to `builder` with the error output. After three returns, stop and ask me.
- Every `builder` must leave `npm run ci` green before reporting done, unless the check in `.claude/agents/builder.md` step 3 prints `skip-ci`: every file changed on the branch is an `.md` in the repo root, `docs/`, `.claude/`, `.cursor/` or `backend/docs/`. Any other `.md` can fail CI (Prettier, Tailwind), so it still runs. Run that check yourself before accepting: on `run-ci`, CI must have passed; on `skip-ci`, don't run CI yourself either, and for such docs-only tasks "Done when" is a cheaper check of the edit, such as a `grep`.
- Start of session: read `docs/agile/progress.md` and `docs/agile/known-issues.md`, but only after the `task` skill's step 1 (`create-branch`) has finished.

## Steps

1. Every task starts with the `create-branch` skill, whether it comes from chat or from the backlog. It pulls `dev` before it cuts the branch, so let it finish before you read any project file (the start-of-session files included) or write a brief. All work for the task happens on that branch, so don't switch branches during a task. The task ends with the push; if I ask for more changes to it before its PR is merged, `git switch` to its branch instead of creating a new one.
2. Independent tasks that don't touch the same files can be given to several `builder` agents at the same time.
3. Accept each builder report per the Rules above (run "Done when" and the CI check yourself).
4. When the whole task is accepted, call `reviewer`: pass it the briefs and ask it to check the changes against them.
5. Progress log: after each change you implement, append one line to `docs/agile/progress.md`: the date (YYYY-mm-dd), then at most 2 sentences on what was done.
6. End of task: record any new decision in `docs/agile/decisions.md`, and any new pitfall in `docs/agile/known-issues.md`. For a backlog task, also mark its title with the `Done` prefix (see the Backlog rule in CLAUDE.md).
7. After `reviewer` accepts the work, run the `commit-message` skill: it shows the draft with a commit button, or asks in a "Commit" / "Not yet" dialog when that button is unavailable, and commits only when I click the button or "Commit". Then run the `push-commit` skill: it offers, in a dialog, to push the task branch to origin, and once it is pushed switches back to `dev`. It never pushes `dev` and never merges; the pull request into `dev` is opened on GitHub, and I merge it once its checks are green.
