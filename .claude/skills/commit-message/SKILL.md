---
name: commit-message
description: Drafts a git commit message for a task the orchestrator has accepted after reviewer, writes it to a file for editing, and commits only when the user clicks commit on a task branch.
---

## Format

```
[<number>] <task title>

<one-sentence summary>
```

- **Title:** the task title. For a backlog task, use the title without the `Done` prefix, e.g. `[1] Entity visibility`.
- **Summary:** the backlog task's `Goal:` line. For a task not from the backlog, use the Goal of its brief.
- **Number:** a backlog task takes its number from the title (`Task 1` → `1`). Any other task takes the previous commit's number (`git log -1 --format=%s`) plus 1. If the previous commit has no number, ask the user for it and do not commit until they answer.

## Steps

1. Check the branch. `git branch --show-current` must match `^(feature|fix|chore)/[0-9]+_[a-z0-9]+(_[a-z0-9]+){0,3}$`, the pattern `create-branch` uses. If it is `dev`, `prod` or anything else, stop and tell the user that commits go on a task branch, so the work has to move to one first. Do not switch or create branches yourself.
2. Take the task from the orchestrator's briefs and `reviewer`'s report. Run `git status --porcelain` only to list the files to stage. Files not part of this task go in your reply, not in the commit.
3. Write the draft to `.git/commit-message-draft.txt` (inside `.git/`, so it is never tracked) and show it in your reply.
4. End the turn with `wrap_up`. The `commit` action is the commit button, and the question is short, for example "Make this commit?". The user may instead edit the file or ask for changes; wait for them.
5. When the user clicks commit: `git add <files by name>` (never `git add -A`), then `git commit -F .git/commit-message-draft.txt`. Show `git log -1 --stat`. Do not push. Then run the `push-commit` skill.
6. **Branches:** this skill never creates one. Commit on the branch that is checked out. Do not run `git switch -c`, `git checkout -b` or `git branch <name>`. The `create-branch` skill makes the task's branch at the start of the task.
