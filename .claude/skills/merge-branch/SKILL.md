---
name: merge-branch
description: Offers, in a dialog, to merge the finished task branch into dev, push dev and delete the branch. Runs only when the user picks it: a local fast-forward, then a plain push of dev. Never force-pushes and never deletes remote branches.
---

## When

After `commit-message` has committed the task on its branch. The branch stays checked out after the commit, so the user can test the feature on it before deciding. Only for branches `create-branch` made. A `claude/` branch from a cloud agent goes through a pull request, not this skill.

## Steps

1. Check the state. The current branch must match `^(feature|fix|chore)/[0-9]+_[a-z0-9]+(_[a-z0-9]+){0,3}$`, `git status --porcelain` must be empty, and `git rev-list --count dev..HEAD` must be at least 1. Run `git fetch origin dev`, then `git rev-list --count dev..origin/dev` must be 0. If local `dev` is behind GitHub, the push in step 4 would be rejected or would leave the two diverged. Record the branch's commit with `git rev-parse HEAD`. If any check fails, stop and report.
2. Ask in a dialog (AskUserQuestion), header "Merge", question "Merge `<branch>` into dev, push it and delete the branch?". Options:
   - "Merge and push": fast-forward dev to this branch, push dev to origin, then delete the branch.
   - "Not yet": keep the branch checked out so the feature can be tested first. Ask me again when ready.
3. "Not yet": stop. Say the branch is still checked out, and do nothing else.
4. "Merge and push":
   - `git switch dev`
   - `git merge --ff-only <branch>`. If it fails because dev has moved, run `git switch <branch>` to go back, report it, and stop.
   - `git push origin dev`. A plain push. If it is rejected, stop and report. Do not force. The branch is kept, so nothing is lost.
   - `git branch -d <branch>`, only after the push succeeded. This refuses unless the branch is merged.
   - Verify: `git rev-parse dev` and `git rev-parse origin/dev` both equal the commit recorded in step 1, and `git branch --list <branch>` prints nothing.
5. Confirm `git branch --show-current` prints `dev`, then reply with the pushed commit (`git log -1 --format='%h %s' dev`) and say the branch is deleted locally. The repo stays on `dev`.

## Never

- Force-push, or push anything other than `dev`.
- Delete a branch on origin. If `git ls-remote --heads origin <branch>` prints a line, report it and leave the remote branch.
- Use `-D`, `--force`, rebase, squash or a merge commit. A fast-forward keeps the task's commit number on dev equal to the branch number.
- Merge or push without the user's choice in the dialog.
- Run on `dev` itself. Run it only from the task branch.
