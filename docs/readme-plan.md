# README plan

The plan for the root `README.md`, the GitHub front page of RemindMe as a portfolio project.
Each section below says what to put in, where to take it from, and what to leave out. Fill them in top to bottom.

## Best practices

- **Readers first.** A recruiter decides in about 30 seconds and a developer in about 2 minutes. The first screen (title, pitch, screenshot, live link) must work on its own.
- **Short sections.** Each one is a few bullets or a small table, never a wall of text. If a section needs more, link to a doc in `docs/`, `frontend/docs/` or `backend/docs/`.
- **Show, don't tell.** One screenshot or GIF says more than a paragraph. Store images in `docs/images/` and use relative paths.
- **Results over adjectives.** "38 frontend + 12 backend tests, CI on every PR" beats "well-tested".
- **Explain decisions.** Interviewers ask "why". One line of reasoning per key choice is enough.
- **Copy-paste commands.** Every command in Getting started must run as written from a fresh clone.
- **Keep it true.** No features from the backlog or planned docs. Mark anything unfinished as "planned".
- **Badges: a few, and only live ones.** CI status, Node version, licence. No decorative badges.
- **Length.** Aim for 150–250 lines. Everything else goes behind links.

## Sections

### 1. Title and pitch
- Logo (brand SVG from Redesign Step 3), the name, one sentence: what RemindMe is and who it's for.
- Badges: `Pipeline` workflow status, Node `26`, licence.
- Links: live demo, demo login (if a demo account exists), short video.

### 2. Screenshot or demo GIF
- One hero image: the Player or the logged-in Home with the tree.
- Optional: a 15–20 s GIF of the flow Constructor → Player → Done.

### 3. Features
- 5–7 bullets, one line each, from the user's point of view:
  - Category → Topic → Entity hierarchy with search and pagination.
  - Entity constructor: up to 20 ordered blocks (Text/TipTap, Code/CodeMirror, Image, List, Link), drag to reorder, preview.
  - Player: packs of entities, lowest-revised first, Done/Skip with keyboard shortcuts, timer.
  - Progress: daily activity chart and the growing tree.
  - Visibility toggles and markers on content.
  - Cookie-based auth with roles and permissions.
- Source: `frontend/docs/PRODUCT.md`.

### 4. Tech stack
- A small table: Frontend / Backend / Shared / Infra / Tooling.
- One line per row, versions only for the main pieces (React 19, Express 5, Prisma 6, Tailwind v4).
- Source: `CLAUDE.md` → Project, `frontend/docs/TECH_STACK.md`.

### 5. Architecture
- One Mermaid diagram: browser → Vite SPA → `/api/v1` (Express) → PostgreSQL, plus media storage (local disk or Vercel Blob).
- 3–4 bullets on what makes it interesting:
  - npm workspaces monorepo with a shared `@remindme/contracts` package (Zod schemas = one source of truth for the wire format).
  - Modular monolith backend: thin routes, services, DTO mapping, three-layer authorization.
  - Feature-based frontend: TanStack Router (file-based) + TanStack Query, one hook per file.
- Links to `backend/docs/ARCHITECTURE.md` and `frontend/docs/ARCHITECTURE.md`.

### 6. Engineering highlights
- The section that sells you. 4–6 bullets, each "what + why":
  - Spaced revision sampling by `scheduleCount`, with new entities joining the current tier.
  - Entity save as one Prisma transaction across entities, blocks and list rows.
  - Per-user daily activity by the user's local day (`X-Timezone` header).
  - Pluggable storage driver for uploads.
  - Full redesign done in 10 steps with a design system (tokens, AA contrast).
- Source: `docs/agile/decisions.md`, `docs/agile/progress.md`.

### 7. AI-assisted development workflow
- A strong portfolio point; keep it to 4–5 bullets and one small diagram:
  - Orchestrator / `builder` / `reviewer` agents with short task briefs.
  - Skills for branch, commit and push; hooks that format and lint every edit.
  - Rule: "Agents propose, pipelines verify, humans decide."
- Links to `docs/orchestrator.md` and `docs/agentic-cicd-plan.md`.

### 8. Quality and CI/CD
- Feature branch → PR into `dev` → required checks → squash merge → deploy.
- What CI runs: typecheck, lint, format, tests, build, migrations from zero, schema drift check, seed run twice.
- Tests: counts and what they cover (one line).
- Deployment: Vercel Services (frontend + backend), health endpoint `/api/v1/health` with the commit SHA. Only state what is live today.

### 9. Getting started
- Prerequisites: Node 26, Docker.
- Numbered steps, each one command: clone → `npm install` → copy env files → `docker compose up -d` → `npm run db:migrate` → seeds → `npm run dev:backend` / `npm run dev:frontend`.
- Dev login and the two local URLs.
- Source: `CLAUDE.md` → Commands.

### 10. Project structure
- A trimmed tree, 2 levels deep: `frontend/`, `backend/`, `packages/contracts/`, `docs/`, `.claude/`, `.github/`.
- One comment per line.

### 11. Documentation
- A bulleted list of the docs that exist, one line each. Skip docs that describe planned files only.

### 12. Roadmap
- 3–5 next items in plain words, taken from the backlog by you. No task numbers.

### 13. Author and licence
- Your name, LinkedIn, GitHub, one line on why you built it.
- Licence (add a `LICENSE` file; MIT is the usual choice for a portfolio).

## Before publishing

- [ ] Screenshots taken at 1280px in the current design.
- [ ] Live link and demo account work in a private window.
- [ ] All commands tested on a fresh clone.
- [ ] Every doc link opens on GitHub.
- [ ] No secrets, internal URLs or personal emails in the text or images.
- [ ] Read it once on a phone: the first screen still makes sense.
