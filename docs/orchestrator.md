# Orchestrator workflow

How a task moves through the orchestrator (main Claude session), the `builder` and `reviewer` agents, and the skills `create-branch`, `commit-message`, `push-commit` and `reflect`.
Rules live in [CLAUDE.md](../CLAUDE.md); agents in `.claude/agents/`; skills in `.claude/skills/`.

## Process

```mermaid
%%{init: {'flowchart': {'nodeSpacing': 20, 'rankSpacing': 30, 'padding': 6}}}%%
flowchart TD
    BL[/"Backlog task, only when named"/] -.-> BR
    BR["create-branch skill"] --> P["Read progress, known-issues; plan briefs"]
    P --> B["builder: code + npm run ci, parallel if no overlap"]
    B --> V["Done when passes?"]
    V -->|"fail, return with errors"| B
    V -->|"after 3 returns"| X(["Stop and ask human"])
    V -->|"ok, log progress.md"| J["All briefs accepted?"]
    J -->|"no, next brief"| P
    J -->|"yes"| RV["Reviewer accepts?"]
    RV -->|"no, fix"| P
    RV -->|"yes"| REC["Record decisions, known-issues; backlog Done"]
    REC --> CM["commit-message skill: show draft"]
    CM --> CB["Commit approved?"]
    CB -->|"draft edited"| CM
    CB -->|"Not yet or dismissed"| U(["Stop, work stays uncommitted"])
    CB -->|"Commit, on task branch"| PC["push-commit: push branch?"]
    PC -->|"Not yet"| LP(["Stop, stays on task branch"])
    PC -->|"Push, switch to dev"| PR["Human opens PR, merges when checks green"]
    PR -.-> RF[/"reflect skill, on request"/]
```

## Roles

| Who | Does | Never does |
|-----|------|------------|
| Orchestrator | Plans, runs `create-branch` at task start (it pulls `dev` first), writes briefs, runs "Done when", accepts work, runs `commit-message` and `push-commit` (commits and pushes only after a click; push-commit then switches back to `dev`), updates `docs/` | Writes code (except 1-2 line fixes), opens PRs, merges, pushes `dev` |
| `builder` | Implements one brief, runs "Done when" and `npm run ci` unless only safe `.md` files changed (the check in `builder.md` step 3), reports | Touches "Don't touch" files |
| `reviewer` | Compares `git diff` with briefs and `docs/agile/decisions.md` | Changes anything |
| `reflect` | Lists what went wrong, proposes minimal edits | Changes anything before approval |
| Human | Clicks Commit or Push, opens PRs, merges them once checks are green, names backlog tasks, approves `reflect` edits, answers after 3 failed returns | |
