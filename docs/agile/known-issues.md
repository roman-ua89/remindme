# Known issues

- Constructor form resets only when `entity.id`/`editedAt` changes (`EntityConstructorPage`). Any new endpoint that changes title/blocks must also bump `editedAt`, and toggle-style endpoints must not, or the form will either miss server changes or wipe unsaved edits.
- Play buttons on Topic/Category/Entity cards stay enabled even when every entity in scope is hidden; the DTOs carry no included-entity count, so the Player will just come back empty.
- `npx shadcn add` adds a stray `cn` dependency to package.json and generates `import { cn } from "cn"`; revert package.json/lock and use `@/lib/utils`.
- `.mcp.json` is tracked and contains a literal context7 API key. Rotate it and switch to `${CONTEXT7_API_KEY}` before the repo is pushed anywhere (Phase 0 of `docs/agentic-cicd-plan.md`).
- Mermaid 11 (GitHub's renderer) rejects a `gitGraph` that merges into a branch with no commits of its own ("Cannot merge branch into itself"); give the target branch a commit first.
- On a fresh checkout, the backend `typecheck` (and `tsc` in `build`) fails with "`@prisma/client` has no exported member `Prisma`" until `npm run db:generate -w backend` has run. CI must generate the Prisma client before typecheck (Phase 2).
- Backend `format:check` (`prettier --check .` in `backend/`) fails on 31 files today (e.g. `backend/src/server.ts`, `backend/tsconfig.json`, `backend/package.json`), so root `format:check` and `ci` fail on it. Step 1.3 formats `frontend/` only; the backend needs the same one-shot format commit.
- `backend/tsconfig.json` has no test exclusion, so `npm run build -w backend` also emits `dist/lib/*.test.js`, which imports vitest. `start` never loads them, but test code ships in `dist`.
- `frontend/src/features/entities/schemas.ts` re-declares the entity and block schemas instead of extending the contracts in `packages/contracts`, which CLAUDE.md asks for. The `to-save-payload` tests exercise this copy, not the contract.
