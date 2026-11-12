---
name: commit-message
description: Drafts a git commit message for a task the orchestrator has accepted after reviewer, writes it to a file for editing, and commits only after the user approves.
---

## Format

```
[<number>] <task title>

<one-sentence summary>

Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>
```

- **Title:** the task title. For a backlog task, use the title without the `Done` prefix, e.g. `[1] Entity visibility`.
- **Summary:** the backlog task's `Goal:` line. For a task not from the backlog, use the Goal of its brief.
- **Number:** a backlog task takes its number from the title (`Task 1` → `1`). Any other task takes the previous commit's number (`git log -1 --format=%s`) plus 1. If the previous commit has no number, ask the user for it and do not commit until they answer.

## Steps

1. Take the task from the orchestrator's briefs and `reviewer`'s report. Run `git status --porcelain` only to list the files to stage. Files not part of this task go in your reply, not in the commit.
2. Write the draft to `.git/commit-message-draft.txt` (inside `.git/`, so it is never tracked) and show it in your reply.
3. Stop and wait. The user may approve, edit the file, or ask for changes.
4. On approval: `git add <files by name>` (never `git add -A`), then `git commit -F .git/commit-message-draft.txt`. Show `git log -1 --stat`. Do not push.
5. If the branch is `main`, ask before committing.
