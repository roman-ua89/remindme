---
name: create-branch
description: Creates the feature branch for a task the orchestrator is about to start, named <type>/<number>_<short_task_name> and cut from the latest dev. Use at the start of a task, before the first builder brief. Creates the branch only; never commits, pushes or deletes.
---

## Name

`<type>/<number>_<short_task_name>`, for example `feature/9_entity_search`.

- **type:** `feature` for new behaviour, `fix` for a bug, `chore` for tooling, CI, config or docs. Pick the closest one. `claude/` is for cloud agents; this skill never makes one.
- **number:** the task number, which is also the number the commit will get.
  - Backlog task (one the user named): the number in its title. `## Task 1. Title` → `1`.
  - Any other task: the previous commit's number + 1. `git log -1 --format=%s` gives a subject starting with `[N]`.
  - If the previous commit has no `[N]`, stop and ask the user for the number.
- **short_task_name:** 1–4 lowercase words joined with `_`, using only `a-z`, `0-9` and `_`, saying what the task is about.

## Steps

1. Run `git status --porcelain`. If anything is listed, stop and name the files. The new branch would carry them, and this skill does not commit or stash.
2. `git switch dev && git pull --ff-only`. If the pull fails, stop and report the error. Do not reset or force.
3. Build the name from the rules above. Read the previous commit from this `dev` (`git log -1 --format=%s`), not from whatever branch was checked out before.
4. Check the number is free: `git branch -a --list '*/<number>_*'`. If it prints anything, stop and ask the user, because another branch already uses that number.
5. `git switch -c <name>`.
6. Verify: `git branch --show-current` prints the name, and the name matches `^(feature|fix|chore)/[0-9]+_[a-z0-9]+(_[a-z0-9]+){0,3}$` (1–4 words).
7. Reply with the branch name and the base commit (`git log -1 --format='%h %s'`).

## Never

- Commit, push, merge or delete a branch. `commit-message` makes commits; pushing waits for the user.
- Cut the branch from anything except the latest `dev`.
- Use `--force`, `reset --hard`, or stash changes to get past step 1.
- Create a second branch for the same task.
