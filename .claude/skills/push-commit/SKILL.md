---
name: push-commit
description: Offers, in a dialog, to push the committed task branch to origin, then switches back to dev. Runs only when the user picks it, as a plain push of the task branch and nothing else. "Not yet", a rejected push or any other stop leaves the task branch checked out. Never pushes dev, never merges, never force-pushes.
---

## When

After `commit-message` has committed the task on its branch. The branch stays checked out after the commit, so the user can test the feature on it before deciding. After a successful push, or when the commit is already on origin, the skill switches back to `dev` (step 5). "Not yet", a rejected push or any other stop leaves the task branch checked out. Only for branches `create-branch` made. A `claude/` branch from a cloud agent already goes through a pull request and does not use this skill.

## Steps

1. Check the state. The current branch must match `^(feature|fix|chore)/[0-9]+_[a-z0-9]+(_[a-z0-9]+){0,3}$`, `git status --porcelain` must be empty, and `git rev-list --count dev..HEAD` must be at least 1. Record the branch's commit with `git rev-parse HEAD`. If `git ls-remote --heads origin <branch>` shows the branch at the same commit, it is already pushed: skip steps 2-4 and go to step 5. If it shows a different commit, stop and report. If any other check fails, stop and report.
2. Ask in a dialog (AskUserQuestion), header "Push", question "Push `<branch>` to origin?". Options:
   - "Push": push the task branch (step 4).
   - "Not yet": keep the branch checked out and local, so the feature can be tested first. Ask me again when ready.
3. "Not yet": stop. Say the branch is still checked out and nothing was pushed.
4. "Push":
   - `git push -u origin <branch>`. A plain push of the task branch only. If it is rejected, stop and report. Never force.
5. Switch to dev. Only if `git status --porcelain` is empty, run `git switch dev`, then verify `git branch --show-current` prints `dev`. If the status is not empty or either check fails, don't force or stash: say which branch is checked out and why, then continue to step 6. No pull here; `create-branch` pulls dev.
6. Report the pushed commit and the branch. Always take the commit from the recorded hash, not from HEAD, which may now be dev: `git log -1 --format='%h %s' <hash>`. Report the branch that is actually checked out (`git branch --show-current`). Give `git switch <task branch>` for testing the task only when that checked-out branch is `dev`. Give the link for the pull request into `dev`, `https://github.com/<owner>/<repo>/pull/new/<branch>`, with `<owner>/<repo>` taken from `git remote get-url origin`. Opening the PR is left to the user.

## Never

- Push `dev`, or push anything other than the task branch.
- Open, merge or approve the PR, or enable auto-merge.
- Force-push, rebase or squash the task branch.
- Delete a branch, locally or on origin.
- Run on `dev` itself. Run it only from the task branch.
