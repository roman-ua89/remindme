# Orchestrator workflow

How a task moves through the orchestrator (main Claude session), the `builder` and `reviewer` agents, and the skills `create-branch`, `commit-message`, `push-commit` and `reflect`.
Rules live in [CLAUDE.md](../CLAUDE.md); agents in `.claude/agents/`; skills in `.claude/skills/`.

## Process

```mermaid
flowchart TD
    BL[/docs/agile/backlog.md<br/>only when the human names a task/] -.-> BR
    A([Task start]) --> BR[create-branch skill<br/>pulls dev, cuts the task branch from latest dev]
    BR --> B[Orchestrator reads<br/>docs/agile/progress.md<br/>docs/agile/known-issues.md]
    B --> C[Orchestrator plans task<br/>and splits it into briefs]
    C --> D["Brief (max 10 lines)<br/>Goal / Read / Don't touch / Done when"]
    D --> E1[builder #1]
    D --> E2["builder #2<br/>only if files don't overlap"]
    E1 --> F["Builder report:<br/>npm run ci green, or skip-ci for safe .md only<br/>Changed / Command / Output / Result"]
    E2 --> F
    F --> G{"Orchestrator runs<br/>'Done when' itself.<br/>Passed?"}
    G -- no, returns < 3 --> H["Return brief to the builder that wrote it<br/>with error output"]
    H -- fixed, reports again --> F
    G -- no, 3 returns --> I([Stop and ask the human])
    G -- yes, accepted --> P["Append one line to<br/>docs/agile/progress.md"]
    P --> J{All briefs<br/>accepted?}
    J -- no, next brief --> D
    J -- yes --> K["reviewer: git diff vs briefs<br/>and docs/agile/decisions.md<br/>read-only"]
    K --> L{"Reviewer accepts?"}
    L -- no, fix and review again --> D
    L -- yes --> M["Record new decisions and pitfalls<br/>in decisions.md and known-issues.md<br/>mark a backlog task Done"]
    M --> CM["commit-message skill<br/>writes the draft and shows it"]
    CM --> CB{"Commit approved?<br/>app button, or dialog if it is unavailable<br/>only a click commits"}
    CB -- draft edited, back to the offer --> CM
    CB -- Not yet, dismissed or no dialog --> U(["Stop: work stays uncommitted"])
    CB -- Commit clicked --> CO["Commit on the task branch"]
    CO --> PC{"push-commit skill<br/>dialog: push the task branch?"}
    PC -- Not yet --> LP(["Stop: stays on the task branch<br/>nothing pushed"])
    PC -- Push --> SW["switch back to dev"]
    SW --> PR["push-commit gives the PR link<br/>Human opens the PR into dev"]
    PR --> MG["Human merges the PR<br/>once checks are green"]
    MG --> N([Task merged into dev])
    N -.-> O[/reflect skill<br/>on user request/]
    O -.-> P2["Proposes minimal edits to<br/>CLAUDE.md / agents / known-issues.md<br/>applied only after approval"]
```

## Roles

| Who | Does | Never does |
|-----|------|------------|
| Orchestrator | Plans, runs `create-branch` at task start (it pulls `dev` first), writes briefs, runs "Done when", accepts work, runs `commit-message` and `push-commit` (commits and pushes only after a click; push-commit then switches back to `dev`), updates `docs/` | Writes code (except 1-2 line fixes), opens PRs, merges, pushes `dev` |
| `builder` | Implements one brief, runs "Done when" and `npm run ci` unless only safe `.md` files changed (the check in `builder.md` step 3), reports | Touches "Don't touch" files |
| `reviewer` | Compares `git diff` with briefs and `docs/agile/decisions.md` | Changes anything |
| `reflect` | Lists what went wrong, proposes minimal edits | Changes anything before approval |
| Human | Clicks Commit or Push, opens PRs, merges them once checks are green, names backlog tasks, approves `reflect` edits, answers after 3 failed returns | |
