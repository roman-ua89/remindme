# Progress

Each line: date (YYYY-mm-dd), what had been done.

2026-11-12 Entity visibility (backlog Task 1): visibility switches with tooltips on Topic and Entity cards and in the Constructor panel, plus a gray "hidden" marker on Category/Topic/Entity cards. Topic visibility is derived from its entities and cascades; new PATCH `/visibility` endpoints for topics and entities.
2026-11-12 Constructor no longer discards unsaved edits when visibility or a marker is toggled: the form resets only when the entity id or `editedAt` changes.

2026-11-12 Added `commit-message` skill (.claude/skills/commit-message): drafts the commit message after the orchestrator's task is accepted, writes it to `.git/commit-message-draft.txt` for editing, and commits only after approval.
2026-11-12 `commit-message` skill: subject now starts with the task number, taken from the backlog title for backlog tasks, otherwise from the previous commit + 1; asks the user when no number is available.
2026-11-12 `commit-message` skill: message is now `[number] title` plus the backlog Goal line; the skill no longer runs git diff, relying on the briefs and reviewer report. Skill shortened.
