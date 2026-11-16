# Known issues

- Constructor form resets only when `entity.id`/`editedAt` changes (`EntityConstructorPage`). Any new endpoint that changes title/blocks must also bump `editedAt`, and toggle-style endpoints must not, or the form will either miss server changes or wipe unsaved edits.
- Play buttons on Topic/Category/Entity cards stay enabled even when every entity in scope is hidden; the DTOs carry no included-entity count, so the Player will just come back empty.
- `npm run lint` in frontend/ fails with 19 pre-existing errors in files unrelated to recent work (ui/chart, empty, toggle(-group), EntitiesPage, CodeBlockPreview, ListBlockEditor, PlayerPage, lib/utils, routes/_app/route). Lint changed files directly with `npx eslint <files>`.
- `npx shadcn add` adds a stray `cn` dependency to package.json and generates `import { cn } from "cn"`; revert package.json/lock and use `@/lib/utils`.
- `.mcp.json` is tracked and contains a literal context7 API key. Rotate it and switch to `${CONTEXT7_API_KEY}` before the repo is pushed anywhere (Phase 0 of `docs/agentic-cicd-plan.md`).
- Frontend gates that fail today besides lint: `npm run check` (114 unformatted files) and `npm run test` (exits 1: no test files). Don't make them required in CI until Phase 1 of the plan fixes them.
- Mermaid 11 (GitHub's renderer) rejects a `gitGraph` that merges into a branch with no commits of its own ("Cannot merge branch into itself"); give the target branch a commit first.
