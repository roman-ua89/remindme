# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

RemindMe is a spaced-revision app: users build a **Category → Topic → Entity** hierarchy, where an entity is a title plus up to 20 ordered blocks (Text/TipTap, Code/CodeMirror, Image, List, Link). The **Player** (`/player`) serves entities one at a time for revision; Done/Skip bump `revisedCount`/`skippedCount`.

npm workspaces monorepo (Node `^24`, install from the repo root only):

| Package | Path | Stack |
|---------|------|-------|
| `remindme` (frontend) | `frontend/` | Vite + React 19 SPA, TanStack Router (file-based) + TanStack Query, shadcn/ui on `@base-ui/react`, Tailwind v4, react-hook-form + Zod, Axios |
| `@remindme/backend` | `backend/` | Express 5, Prisma 6 + PostgreSQL, JWT in httpOnly cookie, multer uploads to local disk |
| `@remindme/contracts` | `packages/contracts/` | Shared Zod schemas + inferred DTO types (wire format). Consumed as TS source via `exports` subpaths, e.g. `@remindme/contracts/entities` — no build step |

## Commands

```bash
npm install                       # from repo root
npm run dev:backend               # tsx watch, http://localhost:3000/api/v1
npm run dev:frontend              # vite, http://localhost:5173

# Backend DB (run in backend/, or via root `npm run db:* `)
docker compose up -d              # local Postgres (backend/docker-compose.yml)
npm run db:migrate                # prisma migrate dev — also use after editing schema.prisma
npm run db:generate               # regenerate Prisma client
npm run db:seed                   # roles, permissions, dev admin admin@remindme.local / admin12345
npm run db:studio

# Frontend (run in frontend/)
npm run lint                      # eslint (@tanstack/eslint-config)
npm run check                     # prettier --check
npx prettier --write <files>      # format changed files (see conventions)
npm run test                      # vitest run; single file: npx vitest run path/to/file.test.ts
npm run generate-routes           # regenerate src/routeTree.gen.ts (also done by the vite plugin)
npx tsc --noEmit                  # type-check (vite build does not type-check)

# Backend type-check / build
npm run build -w backend          # tsc → backend/dist
```

Notes: there are currently no test files and no backend lint/test scripts. The root `npm run build` calls a `build` script on `@remindme/contracts` that doesn't exist, so build the backend directly. Env: copy `backend/.env.example` → `backend/.env` (`JWT_SECRET` ≥16 chars required; `CORS_ORIGIN` must match the Vite origin) and `frontend/.env.example` → `frontend/.env` (`VITE_API_URL`). Swagger UI at `/api/docs` in development (spec hand-written in `backend/src/openapi/spec.ts`).

## Architecture

Detailed docs (read the relevant one before changing that area):

**Backend** (`backend/docs/`)
- [ARCHITECTURE.md](backend/docs/ARCHITECTURE.md) — module structure, request flow, where code belongs
- [DATA-FLOWS.md](backend/docs/DATA-FLOWS.md) — how PostgreSQL data changes per API action; useful for ad-hoc SQL

**Frontend** (`frontend/docs/`)
- [PRODUCT.md](frontend/docs/PRODUCT.md) — product spec: what the app is and how it behaves
- [ARCHITECTURE.md](frontend/docs/ARCHITECTURE.md) — folder layout, ownership boundaries, where code belongs
- [TECH_STACK.md](frontend/docs/TECH_STACK.md) — libraries, how they fit together, conventions
- [DATABASE.md](frontend/docs/DATABASE.md) — logical data model: tables, fields, relationships
- [AUTH.md](frontend/docs/AUTH.md) — cookie-based login flow, browser to API
- [PLAYER.md](frontend/docs/PLAYER.md) — Player pack/session implementation
- [LIST-SEARCH.md](frontend/docs/LIST-SEARCH.md) — reusable search pattern for paginated list pages
- [METRICS.md](frontend/docs/METRICS.md) — user metrics and progress tracking
- [WIREFRAMES.md](frontend/docs/WIREFRAMES.md) — page layouts for every MVP screen

Some frontend docs describe planned files that don't exist yet (e.g. `stores/`, `hooks/`, register/forgot-password pages) — trust the code.

**A change to an API shape usually touches three places:** `packages/contracts/src/<domain>.ts` → `backend/src/modules/<domain>/` → `frontend/src/features/<domain>/`. Contracts import only `zod`; never hand-duplicate DTO types on either side.

### Backend (`backend/src`)
- Modular monolith: each `modules/<domain>/` has a thin `*.routes.ts` (HTTP only: `validate()` → service → `res.json`, errors via `next(err)`) and a `*.service.ts` (business logic, Prisma, maps rows to contract DTOs via `toXxxDto` — never return Prisma types).
- Routes are nested to mirror the hierarchy: `/categories/:categoryId/topics/:topicId/entities/...`. `entities-flat.routes.ts` exposes entities outside that nesting; `player` exposes `POST /player/batch` (samples lowest-`revisedCount` entities in a scope); Done/Skip are `PATCH …/entities/:id/revise` and `…/skip`; they also upsert-increment `user_daily_activity` (per user, per local day from the `X-Timezone` header — `lib/daily-activity.ts`), read by `GET /activity/daily?month=YYYY-MM` for the Home chart.
- Authorization is three layers: `middleware/auth.ts` (cookie `remindme_token` → `req.user` with roles+permissions from the JWT) → `requirePermission('content:manage_own' | 'users:manage' …)` → `lib/ownership.ts` (row belongs to user, or `content:manage_any`).
- Errors: throw helpers from `lib/errors.ts` (`notFound`, `conflict`, `validationError`…); `middleware/error-handler.ts` produces the `ApiError` JSON shape from contracts. `validate()` replaces `req.body/params/query` with parsed values.
- Entity save is a `prisma.$transaction` across `entities`, `entity_blocks`, `list_block_rows`, referencing `media_assets`. Media: upload writes to `UPLOAD_DIR`, blocks store `mediaAssetId`, responses carry `mediaUrl` (`lib/media-url.ts`).
- Modules should not import each other's services; share via `lib/` or contracts.

### Frontend (`frontend/src`)
- `routes/` are thin (guards, search-param validation, render a `features/*/components/*Page.tsx`). `_app/` is the authenticated pathless layout; `auth/` is the unauthenticated layout. `routeTree.gen.ts` is generated — never edit by hand.
- `features/<domain>/`: `api.ts` (pure Axios functions on `lib/api-client.ts`, typed with contracts), `queries/` (**one hook per file**, kebab-case `use-xxx.ts`), `schemas.ts` (form schemas, extending contracts), `types.ts` (re-exports from contracts), `components/`.
- Query keys come only from `lib/query-keys.ts`; mutations invalidate the narrowest keys in `onSuccess`.
- `lib/api-client.ts`: single Axios instance with `withCredentials` (cookie auth, no Bearer), normalizes errors to `ApiClientError` (incl. `fieldErrors`).
- Entity constructor: form state is react-hook-form (blocks as a discriminated union); `utils/to-form-values.ts` / `utils/to-save-payload.ts` convert between API DTOs and form values; block editors/previews are dispatched by `BlockEditorRouter` / `BlockPreviewRouter`.
- Player: pack size `PLAYER_BATCH_SIZE` in `features/player/constants.ts`; the pack and shown-ids-per-round live in `PlayerPage` state + `utils/session.ts` (no server session, not a cached query).
- `features/dev-plan/tasks.ts` is a hand-maintained MVP todo list rendered at `/frontend`.
- Path alias `@/` (also `#/`) → `src/`. Shared UI goes in `components/shared/` only once a second feature needs it; `components/ui/` is shadcn source and must not import features.

## Conventions (from `.cursor/rules` and `.cursor/skills`)

- **Formatting:** after editing any `frontend/src` file, run `npx prettier --write <files>` from `frontend/`. Both packages use 4-space indent, single quotes, semicolons, trailing commas (printWidth 150 frontend / 120 backend).
- **Components** are arrow functions: `export const Foo = (props: Props) => { … }` — no `function` component declarations (plain helpers may use `function`).
- **Navigation from a `<Button>`** uses `useNavigate()` in `onClick`; never `render={<Link />}` inside `Button`. Use `<Link>` only for plain text/icon links.
- **Destructive actions** (delete/remove/clear) must be confirmed with shadcn `AlertDialog` (`variant="destructive"` on trigger and action); no `window.confirm` or plain `Dialog`.
- **Forms** use react-hook-form + `zodResolver`; every constraint has a user-facing message, string fields use `.trim()`, and every registered input renders its error (`components/shared/FieldError.tsx`). Keep schemas in `schemas.ts`, not in components.
