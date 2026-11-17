# Orchestrator workflow

How a task moves through the orchestrator (main Claude session), the `builder` and `reviewer` agents, and the `reflect` skill.
Rules live in [CLAUDE.md](../CLAUDE.md); agents in `.claude/agents/`; skill in `.claude/skills/reflect/`.

## Process

```mermaid
flowchart TD
    BL[/docs/agile/backlog.md<br/>only when the human names a task/] -.-> BR
    A([Session start]) --> B[Orchestrator reads<br/>docs/agile/progress.md<br/>docs/agile/known-issues.md]
    B --> BR[create-branch skill<br/>cuts the task branch from latest dev]
    BR --> C[Orchestrator plans task<br/>and splits it into briefs]
    C --> D["Brief (max 10 lines)<br/>Goal / Read / Don't touch / Done when"]
    D --> E1[builder #1]
    D --> E2[builder #2<br/>only if files don't overlap]
    E1 --> F[Builder report:<br/>Changed / Command / Output / Result]
    E2 --> F
    F --> G{Orchestrator runs<br/>'Done when' itself.<br/>Passed?}
    G -- no, returns < 3 --> H[Return brief to builder<br/>with error output]
    H --> E1
    G -- no, 3 returns --> I([Stop and ask the human])
    G -- yes --> J{All briefs<br/>accepted?}
    J -- no --> D
    J -- yes --> K[reviewer: git diff vs briefs<br/>and docs/agile/decisions.md<br/>read-only]
    K --> L[List of discrepancies<br/>or 'No discrepancies']
    L --> M[Orchestrator appends to<br/>docs/agile/progress.md<br/>decisions.md / known-issues.md]
    M --> CM[commit-message skill<br/>draft + commit button]
    CM --> PC[push-commit skill<br/>dialog: push the task branch, or not yet]
    PC --> N([Task done])
    N -.-> O[/reflect skill<br/>on user request/]
    O -.-> P[Proposes minimal edits to<br/>CLAUDE.md / agents / known-issues.md<br/>applied only after approval]
```

## Roles

| Who | Does | Never does |
|-----|------|------------|
| Orchestrator | Plans, runs `create-branch` at task start, writes briefs, runs "Done when", accepts work, commits and merges through the skills, updates `docs/` | Writes code (except 1-2 line fixes) |
| `builder` | Implements one brief, runs "Done when", reports | Touches "Don't touch" files |
| `reviewer` | Compares `git diff` with briefs and `docs/agile/decisions.md` | Changes anything |
| `reflect` | Lists what went wrong, proposes minimal edits | Changes anything before approval |
| Human | Approves `reflect` edits, answers after 3 failed returns | |
