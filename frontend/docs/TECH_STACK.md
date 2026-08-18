# RemindMe — Tech Stack

Technical reference for RemindMe. Defines **which libraries to use**, **how they fit together**, and **conventions** for the `frontend/`, `backend/`, and `packages/contracts/` workspace packages.

This is the technical counterpart to [PRODUCT.md](PRODUCT.md). For folder layout and module boundaries, see [ARCHITECTURE.md](ARCHITECTURE.md). For tables and fields, see [DATABASE.md](DATABASE.md). For Player pack/session behavior, see [PLAYER.md](PLAYER.md). For original product notes, see [ABOUT.md](ABOUT.md).

---

## 1. Stack summary

### Frontend (`frontend/`)

| Layer | Choice | Role |
|-------|--------|------|
| Language | TypeScript (strict) | Types across API contracts, routes, and stores |
| UI | React 19 (latest stable) | Component model, pages, entity constructor |
| Styling | Tailwind CSS | Utility classes, design tokens, responsive layout |
| UI kit | shadcn/ui | Accessible primitives (Button, Dialog, Form, …); copied into repo |
| Icons | Lucide (`lucide-react`) | Consistent SVG icons for nav, actions, and empty states; default for shadcn/ui |
| Build | Vite | Dev server, HMR, production bundle |
| Routing | TanStack Router (file-based) | Routes from `src/routes/` filesystem; loaders, auth guards |
| Server state | TanStack Query v5 | Fetch, cache, and mutate API data |
| Client state | Zustand | Ephemeral UI preferences (theme, nav drawer) |
| HTTP | Axios | Shared API client (interceptors, base URL) |
| Lists | Classic pagination | Offset-based pages for entity lists on topic detail (TanStack Query + UI controls) |
| Forms | react-hook-form + Zod | Form state, validation, typed submit handlers |
| API types | `@remindme/contracts` | Shared DTO types — re-exported per feature |
| Rich text editor | TipTap (`@tiptap/react`) | Entity constructor **Text** blocks ([PRODUCT.md §3.4](PRODUCT.md)); reusable for other rich-text surfaces |
| Code block editor | `@uiw/react-codemirror` | Entity constructor **Code** blocks ([PRODUCT.md §3.4](PRODUCT.md)); MVP languages: JavaScript + TypeScript |
| Image upload | Custom component (`ImageBlockEditor`) | Entity constructor **Image** blocks — centered file picker + drag-drop; upload via `features/media/` |
| Toasts | *Unspecified for now* | Mutation/error feedback — library TBD (likely shadcn toast/sonner when chosen) |
| Lint | ESLint (flat config) | Code quality, React/TS rules |
| Format | Prettier | Consistent formatting |

### Backend (`backend/`)

| Layer | Choice | Role |
|-------|--------|------|
| Runtime | Node.js | Server runtime |
| Language | TypeScript (strict) | Shared typing discipline with the frontend |
| HTTP | Express 5 | REST API routing and middleware |
| ORM | Prisma | Schema, migrations, typed DB client, Studio |
| Database | PostgreSQL 16 | Relational store — UUID PKs, `jsonb`, `timestamptz`, RBAC joins |
| Validation | Zod | Request validation via schemas from `@remindme/contracts`; env validation stays local |
| Auth | JWT in httpOnly cookies + bcrypt | Session auth; password hashing |
| API contracts | `@remindme/contracts` (Zod) | Shared request/response schemas and inferred types for frontend + backend |
| API docs | OpenAPI 3 + Swagger UI | Generated from contracts (or maintained alongside) for Swagger UI |
| File uploads | Multer | Multipart parsing; metadata in DB, binaries in object storage |
| Config | dotenv + Zod env schema | Fail fast on missing or invalid env vars |
| Dev database | Docker Compose | Local PostgreSQL instance |
| Logging | pino + pino-http | Structured request and app logs |
| Lint / format | ESLint + Prettier | Same tooling family as the frontend |

### Version policy

- Pin **major** versions in `package.json`; use `^` for minor/patch updates within a major.
- Upgrade React and TanStack packages on a **deliberate cadence** (e.g. quarterly review), not ad hoc.
- Run the test suite and smoke-test critical flows after any major upgrade.

---

## 2. Architecture overview

```mermaid
flowchart TB
    subgraph frontend [frontend SPA]
        subgraph ui [React UI]
            Pages[Pages and components]
            Shadcn[shadcn/ui]
            Icons[Lucide]
        end
        subgraph routing [TanStack Router]
            Routes[src/routes file tree]
            Loaders[Route loaders]
            Guards[Auth guards]
        end
        subgraph serverState [TanStack Query]
            Queries[useQuery hooks]
            Mutations[useMutation hooks]
            Cache[Query cache]
        end
        subgraph clientState [Zustand]
            UIStore[UI preferences]
        end
        subgraph http [Axios]
            Client[apiClient withCredentials]
            Interceptors[Auth and error interceptors]
        end
    end
    subgraph contracts [packages/contracts]
        ZodSchemas[Zod schemas]
        InferredTypes["z.infer types"]
    end
    subgraph backend [backend Express API]
        ExpressRoutes[Route handlers]
        Services[Domain services]
        PrismaClient[Prisma Client]
    end
    subgraph infra [Infrastructure]
        PG[(PostgreSQL)]
        Storage[Object storage]
    end

    Pages --> Shadcn
    Pages --> Icons
    Pages --> Routes
    Loaders --> Queries
    Pages --> Queries
    Pages --> Mutations
    Pages --> UIStore
    Queries --> Client
    Mutations --> Client
    Client --> Interceptors
    Interceptors --> ExpressRoutes
    Mutations --> Cache
    ZodSchemas --> ExpressRoutes
    ZodSchemas --> Queries
    InferredTypes --> Queries
    InferredTypes --> ExpressRoutes
    ExpressRoutes --> Services
    Services --> PrismaClient
    PrismaClient --> PG
    Services --> Storage
```

**Runtime model:** Vite + React SPA with **TanStack Router file-based routing** (`frontend/src/routes/`). The backend is a **separate Express REST API** under `backend/`, consumed via Axios with **credentials enabled** for httpOnly auth cookies. **API DTOs and validation schemas** live in **`packages/contracts/`** and are imported by both apps. No server-side rendering in v1.

---

## 3. State ownership

Clear boundaries prevent TanStack Query and Zustand from overlapping.

### TanStack Query owns (server state)

- Categories, topics, entities (with blocks), user profile
- All data persisted on the backend
- Cache invalidation after mutations (create category, add topic, save entity, delete entity)

### Zustand owns (client state)

- **Transient UI:** theme, nav drawer, modal open/close
- Entity constructor draft state lives in **react-hook-form**, not Zustand

### Auth token storage

The backend issues a **JWT in an httpOnly cookie** on login. The frontend Axios client uses **`withCredentials: true`** and does not store tokens in `localStorage`. On 401, clear client auth state and redirect to login.

### Anti-patterns

- Do **not** mirror API lists in Zustand (Query cache is the source of truth)
- Do **not** fetch inside Zustand stores (use Query hooks in components or route loaders)
- Do **not** store form draft server data in Zustand unless offline/editing UX requires it — use react-hook-form for in-form state
- Components never call Axios directly

### Feature mapping

Maps product features from [PRODUCT.md](PRODUCT.md) to stack owners:

| Product feature | Stack owner |
|-----------------|-------------|
| Category list (Home) | Query |
| Create category (popover) | Forms + Mutation |
| Category detail (topics list) | Query |
| Topic detail (entity list) | Query |
| Entity constructor (create/edit) | Forms (Title + blocks) + Mutation |
| Player (revision) | Mutation (fetch pack + Done/Skip); current pack held in page state |
| Auth pages | Router guards + Query for user profile + Forms |

**Deferred (not v1 UI):** statistics chart — see [PRODUCT.md §8](PRODUCT.md).

---

## 4. TanStack Router (file-based)

Routing is **file-based**: URL structure is defined by the filesystem under `src/routes/`, not a hand-written route config. The **`@tanstack/router-plugin`** (Vite) watches that folder and generates a typed **`routeTree.gen.ts`**.

### File-based routing

- **One route per file** (or folder with `index.tsx`) under `src/routes/`
- **`__root.tsx`** — root layout (app shell, providers, `<Outlet />`)
- **`index.tsx`** — index route for a directory (e.g. `/`, `/categories/$categoryId`)
- **`$param`** — dynamic segment (e.g. `$categoryId.tsx`, `$entityId/edit.tsx`)
- **`_` prefix** — pathless layout routes (e.g. `_app.tsx`, `_auth.tsx`) that wrap children without adding a URL segment
- **Generated tree** — commit `routeTree.gen.ts`; do not edit it manually; regenerate via dev/build
- **Route modules stay thin** — loaders, guards, and search-param validation in the route file; page UI in `features/` or colocated components

### Route tree

Aligned with product pages from [PRODUCT.md §3.1](PRODUCT.md):

```
/auth/login
/auth/register
/auth/forgot-password
/                                    → Home (categories)
/categories/$categoryId              → Category detail (topics list)
/categories/$categoryId/topics/$topicId
                                     → Topic detail (entities list)
/categories/$categoryId/topics/$topicId/entities/new
                                     → Entity constructor (create)
/categories/$categoryId/topics/$topicId/entities/$entityId
                                     → Entity constructor (edit)
/player                              → Player (revision; search: categoryId | topicId | entityId)
```

Category creation uses a **popover on Home** — no dedicated route.

Example file layout (maps 1:1 to the tree above):

```
src/routes/
  __root.tsx
  auth/
    route.tsx                                  → auth layout (no app chrome)
    login.tsx                                  → /auth/login
    register.tsx
    forgot-password.tsx
  _app/
    route.tsx                                  → pathless app layout (nav, header)
    index.tsx                                  → /
    player.tsx                                 → /player
    categories/
      $categoryId/
        index.tsx                                → /categories/$categoryId
        topics/
          $topicId/
            index.tsx                            → topic detail
            entities/
              new.tsx                            → entity constructor (create)
              $entityId.tsx                      → entity constructor (edit)
```

### Conventions

- **File-based routing only** — add or rename files under `src/routes/` to add routes; avoid a separate manual route tree
- **`@tanstack/router-plugin`** in `vite.config.ts`; aliases aligned with `tsconfig` (`@/` → `src/`)
- **Route loaders** prefetch Query data where it reduces waterfall (e.g. entity with blocks on constructor page)
- **`beforeLoad` guards** on authenticated routes; redirect unauthenticated users to `/auth/login`
- **Search params** for filters (e.g. `?sort=addedAt`) — shareable URLs
- **Typed route params** — no stringly-typed `useParams()`

### Layouts

- **Auth layout:** login, register, forgot password (no app chrome)
- **App layout:** Home, category/topic/entity browsing (shared nav/header)

---

## 5. TanStack Query

### Query key factory

Use a centralized factory to keep keys consistent and invalidation predictable:

```typescript
queryKeys.categories.all
queryKeys.categories.detail(id)
queryKeys.topics.list(categoryId)
queryKeys.topics.detail(categoryId, topicId)
queryKeys.entities.list(categoryId, topicId)
queryKeys.entities.detail(categoryId, topicId, entityId)
queryKeys.player.all
queryKeys.player.batch(scopeKey)
```

### Player batch session

The **Player** ([PRODUCT.md §3.5](PRODUCT.md), [PLAYER.md](PLAYER.md)) shows one entity at a time from an in-memory pack of up to 10 full entities:

- **`use-player-batch.ts`** — mutation that fetches a pack (`POST /player/batch`) and applies the round-reset rule when `items` is empty
- **`use-mark-done.ts`** / **`use-mark-skip.ts`** — mutations; invalidate scoped entity/topic/category list keys on success
- Session queue lives in `PlayerPage` state — the next card is `queue[1]`, so there is no per-entity GET or prefetch hook

### Custom hooks

Components never call Axios directly. Each API operation is a **dedicated hook file** under `features/<domain>/queries/` that exports one `useQuery`, `useInfiniteQuery`, or `useMutation` wrapper (see [ARCHITECTURE.md §5](ARCHITECTURE.md)).

Examples:

```
features/categories/queries/use-categories.ts       → useCategories()
features/topics/queries/use-topics.ts               → useTopics()
features/entities/queries/use-entities.ts           → useEntities()
features/categories/queries/use-create-category.ts  → useCreateCategory()
features/entities/queries/use-create-entity.ts      → useCreateEntity()
features/entities/queries/use-update-entity.ts      → useUpdateEntity()
features/player/queries/use-player-batch.ts       → usePlayerBatch()
features/player/queries/use-mark-done.ts          → useMarkDone()
features/player/queries/use-mark-skip.ts          → useMarkSkip()
```

- **One file, one hook** — do not combine multiple hooks in a single module
- Hook files call pure functions from the feature's `api.ts` via `queryFn` / `mutationFn`
- File names use kebab-case: `use-create-category.ts` exports `useCreateCategory`

### Entity lists

Topic detail shows entities as a **paginated list** — `useQuery` keyed on page number, with prev/next controls. See §7.

### Mutations and cache

- **Invalidate narrowly:** after saving an entity, invalidate that topic's entity list — not the entire cache
- **Optimistic updates** only where UX benefit is clear (simple toggles)
- **Default `staleTime`:** longer for relatively static data (categories, topics)

### Default client setup

Configure a shared `QueryClient` in `src/lib/query-client.ts` with sensible defaults (`retry`, `staleTime`, global error handling).

---

## 6. Axios layer

### Single API client

One module: `src/lib/api-client.ts`

```typescript
// Conceptual structure — implement when scaffolding
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
```

### Interceptors

- **Request:** rely on httpOnly cookies (no manual Bearer header in v1)
- **Response:** normalize errors to a typed `ApiError`; on 401 → clear auth state and redirect to login

### Layering

Per-feature modules under `src/features/` (see [ARCHITECTURE.md](ARCHITECTURE.md)):

```
features/categories/api.ts
features/categories/queries/use-categories.ts
features/categories/queries/use-create-category.ts
features/topics/api.ts
features/topics/queries/use-topics.ts
features/entities/api.ts
features/entities/queries/use-entities.ts
features/entities/queries/use-create-entity.ts
features/media/api.ts
features/media/queries/use-upload-media.ts
features/player/api.ts
features/player/queries/use-player-batch.ts
features/player/queries/use-mark-done.ts
features/player/queries/use-mark-skip.ts
```

Request/response types are **imported from `@remindme/contracts`** and re-exported from each feature's `api.ts` or `types.ts` for colocation. Do not hand-write duplicate DTO interfaces — see [§12](#12-shared-api-contracts-packagescontracts).

---

## 7. Pagination

Entity lists (topic detail entities, and any other large collections) use **classic offset pagination** — not infinite scroll or list virtualization ([PRODUCT.md §3.3](PRODUCT.md)).

- API returns a paginated slice via query params (`page`, `limit` — shapes in `@remindme/contracts` `pagination.ts`)
- Frontend: dedicated `useQuery` hook keyed on page number; refetch when the user changes page
- UI: standard prev/next (or page-number) controls built from shadcn/ui primitives
- Define a default page size in contracts or feature constants
- Loading, error, and empty states render at the list level — outside pagination controls
- After entity mutations, invalidate that topic's entity list query; reset to page 1 if the current page becomes empty

---

## 8. Zustand stores

| Store | Responsibility |
|-------|----------------|
| `useUiStore` | Theme, nav drawer, transient UI flags |

### Conventions

- **One store per domain** — avoid a single global god store
- Use **selectors** to limit re-renders (`useUiStore(s => s.theme)`)
- **Persist sparingly:** theme via `persist` middleware if needed
- Entity constructor form state uses **react-hook-form**, not Zustand

Player pack state lives in `PlayerPage` component state ([PLAYER.md](PLAYER.md)); there is no `player-session` store.

---

## 9. Forms (react-hook-form + Zod)

All user input flows use **react-hook-form** for form state and **Zod** for validation. Pair them with **`@hookform/resolvers/zod`** (`zodResolver`).

### Scope

- Auth: login, register, forgot password
- Create category (popover on Home — name only; topics are created separately on Category detail)
- Add topic (Category detail)
- Entity constructor: Title + ordered constructor blocks (Text, Code, Image, List)

### Conventions

- Import **request schemas** from `@remindme/contracts` when the form payload matches the API (e.g. `createCategorySchema`, `saveEntitySchema`)
- Define **client-only schemas** locally in `schemas.ts` when the form differs (e.g. `confirmPassword` on register — strip before submit)
- Infer TypeScript types with **`z.infer<typeof schema>`** — same schema object used for validation and typing
- Use **`useForm` with `zodResolver`** — no parallel manual validation logic in components
- Colocate feature wrappers in `src/features/auth/schemas.ts`, `src/features/entities/schemas.ts`, etc. — re-export or extend contract schemas; do not fork API shapes
- **Submit handlers** call mutation hooks (`useCreateCategory()`, `useUpdateEntity()`, etc.); forms do not call Axios directly
- Map **API validation errors** (field-level 422 responses) to `setError()` on the matching field; show generic errors via toast or form-level `root` error
- Prefer **`register` / `Controller`** for inputs; use `Controller` when integrating controlled third-party inputs (TipTap, CodeMirror, image upload)
- Wrap fields with shadcn **`<Form>`** / **`<FormField>`** for consistent labels, errors, and a11y (see §10)
- **`defaultValues`** from route loader or Query data on edit screens; reset with `reset()` when async data arrives
- **Entity constructor:** validate Title + `EntityBlock[]` via `saveEntitySchema` from contracts; use block-type-specific editors with `Controller`; enforce max 20 blocks in UI before submit

### Rich text (TipTap)

**TipTap** is the chosen rich text editor. It is headless (ProseMirror-based) — compose toolbars and block chrome with shadcn/ui + Lucide; do not adopt a second rich-text library.

| Concern | Convention |
|---------|------------|
| **Primary use** | Entity constructor **Text** template — `TextBlockEditor.tsx` in `features/entities/components/blocks/` |
| **Other uses** | Same TipTap setup powers read-only preview (`generateHTML`) in Entity constructor and **Player** (`PlayerPreview`) — share extensions and serialization helpers |
| **Persistence** | Store TipTap JSON (`editor.getJSON()`) in `entity_blocks.content_json` — not HTML (see [DATABASE.md §4](DATABASE.md)) |
| **Form wiring** | `Controller` on the block's `contentJson`; update on `onUpdate` (debounce optional) |
| **Preview styling** | Render stored JSON with `generateHTML` inside `@tailwindcss/typography` `prose` classes |
| **MVP formatting** | Bold, italic, underline, headings, bullet/ordered lists, tables; add extensions only when product needs them |

Install extensions incrementally (e.g. `@tiptap/starter-kit`, `@tiptap/extension-underline`, table extensions). Keep a shared `tiptap/` or `lib/tiptap/` module for extension lists used by both editor and preview.

### Code blocks (CodeMirror)

**`@uiw/react-codemirror`** (CodeMirror 6) is the chosen code editor. It is headless — compose language selector and block chrome with shadcn/ui + Lucide; do not adopt a second code-editor library.

| Concern | Convention |
|---------|------------|
| **Primary use** | Entity constructor **Code** template — `CodeBlockEditor.tsx` in `features/entities/components/blocks/` |
| **Other uses** | Same CodeMirror setup powers read-only preview in `EntityPreviewPanel.tsx` and **Player** `PlayerPreview.tsx` (`editable={false}`) |
| **Persistence** | Store `{ language, value }` in `entity_blocks.content_json` (see [DATABASE.md §4](DATABASE.md)) — not HTML |
| **Form wiring** | `Controller` on the block's `contentJson`; update `value` on `onChange`; update `language` via a shadcn **Select** |
| **MVP languages** | **`javascript`** and **`typescript`** only — map to `@codemirror/lang-javascript` (`javascript()` and `javascript({ typescript: true })`) |
| **Default language** | `javascript` when a new Code block is inserted |
| **Basic setup** | `basicSetup={{ lineNumbers: true }}`; language highlighting via `extensions` from `getLanguageExtension(language)` — must support **`javascript`** and **`typescript`** in MVP |
| **Preview styling** | Reuse the same CodeMirror instance/config with `editable={false}` inside block preview chrome; match editor theme via Tailwind |

Install:

```bash
pnpm add @uiw/react-codemirror @codemirror/lang-javascript
```

Keep a shared `lib/codemirror/` module (e.g. `getLanguageExtension(languageId)`) used by both `CodeBlockEditor` and preview rendering. MVP implementation:

```typescript
import { javascript } from '@codemirror/lang-javascript';

export function getLanguageExtension(language: string) {
  if (language === 'typescript') return javascript({ typescript: true });
  return javascript(); // default: javascript
}
```

Additional languages (Python, SQL, etc.) are added later via `@codemirror/lang-*` packages — do not block MVP on a full language catalog.

### Image blocks (custom upload component)

**Custom `ImageBlockEditor`** — no third-party upload widget. Compose with shadcn/ui + Lucide; use a hidden native `<input type="file">` triggered by a centered Button.

| Concern | Convention |
|---------|------------|
| **Primary use** | Entity constructor **Image** template — `ImageBlockEditor.tsx` in `features/entities/components/blocks/` |
| **Empty state** | Bordered drop zone; **Choose image** button centered in the container; drag-and-drop onto the container |
| **After upload** | Image preview fills the container (`object-contain`); inline **Remove** control clears the image |
| **Re-upload** | After remove, return to empty state — user can pick or drop again |
| **Persistence** | Store `media_asset_id` on the block (see [DATABASE.md §4](DATABASE.md)); `content_json` is null |
| **Form wiring** | `Controller` on `mediaAssetId`; call `useUploadMedia()` on file select or drop; set field on success |
| **Preview panel** | Read-only `<img>` in `EntityPreviewPanel.tsx` using the uploaded asset URL |

Upload flow:

1. User picks a file or drops onto the container
2. `useUploadMedia()` sends multipart to `POST /media/upload`
3. On success, set `mediaAssetId` on the block and show preview inside the container
4. Remove clears `mediaAssetId` and deletes the preview — empty state is shown again

### Example

```typescript
import { createCategorySchema } from '@remindme/contracts/categories';
import type { CreateCategoryInput } from '@remindme/contracts/categories';

// CreateCategoryInput === z.infer<typeof createCategorySchema>

const form = useForm<CreateCategoryInput>({
  resolver: zodResolver(createCategorySchema),
  defaultValues: { name: '' },
});
```

---

## 10. Styling (Tailwind CSS + shadcn/ui + Lucide)

**Tailwind CSS** handles layout, spacing, typography, and responsive design. **shadcn/ui** provides accessible, composable UI primitives built on Radix UI — components are **copied into the repo** (not installed as an opaque dependency). **Lucide** supplies the icon set via **`lucide-react`** (tree-shakeable React components), matching shadcn/ui's default icon library.

### Scope

- **shadcn/ui:** app chrome and shared patterns — nav, buttons, inputs, dialogs, sheets, toasts, dropdowns, forms
- **List row actions** (Home categories, Category detail topics, Topic detail entities): icon-only inline buttons — pencil for rename/edit, trash for delete/remove; put the action name in `aria-label`; do **not** use `DropdownMenu` on these pages; reserve dropdowns for app chrome (e.g. user menu in `AppHeader`)
- **Lucide:** nav items, toolbar actions, form affordances, empty states, block editor controls — including **TipTap** formatting toolbar buttons
- **Tailwind:** all styling, including the **entity constructor** preview panel and block editors in `features/entities/` — compose shadcn building blocks where they fit; use utility classes for block-specific layouts; TipTap preview uses `@tailwindcss/typography` `prose`; CodeMirror theme via Tailwind on the editor wrapper

### Conventions

- Install components **incrementally** via the shadcn CLI (`npx shadcn@latest add button`) — add only what a feature needs
- Generated components live in **`src/components/ui/`**; treat them as owned source — customize in place when product requires it
- Use **`cn()`** from `src/lib/utils.ts` (`clsx` + `tailwind-merge`) for conditional classes
- Theme via **CSS variables** in `src/index.css` (shadcn default light/dark tokens); wire dark mode to `useUiStore` if product adds theme toggle
- Do **not** introduce a second component library (MUI, Chakra, etc.)
- Prefer shadcn primitives over one-off styled elements when a match exists (e.g. `Button`, `Dialog`, `Input`)
- Block editors and preview panel are **feature components** in `features/entities/` — Tailwind + shadcn atoms (Card, Badge, etc.) as needed

### Icons (Lucide)

- Import icons **by name** from `lucide-react` (e.g. `import { Home, Trash2 } from 'lucide-react'`) — only imported icons ship in the bundle
- Size and color via **Tailwind** on the icon component (`className="size-4"`, `text-muted-foreground`) or shadcn **`Button`** `size="icon"` slots — avoid hardcoded `width`/`height` props unless a design requires a fixed size
- Use **Lucide only** for UI icons — do not mix Iconoir, Heroicons, or inline SVG one-offs for the same patterns
- Prefer **semantic icon choice** over decorative repetition; pair with visible text or `aria-label` on icon-only controls (shadcn `Button` with `size="icon"`)
- Browse the catalog at [lucide.dev](https://lucide.dev) when picking names; keep naming consistent across similar actions (e.g. one delete/trash icon everywhere)

### Key files (when scaffolded)

```
src/index.css              # Tailwind directives + CSS variable theme
src/lib/utils.ts           # cn() helper
src/components/ui/         # shadcn components (Button, Input, Form, Dialog, …)
components.json            # shadcn CLI config (aliases, style, Tailwind paths)
```

---

## 11. TypeScript

- **`strict: true`** in `tsconfig.json` in every workspace package
- Prefer **`interface`** for hand-written object shapes; **`type`** for unions, intersections, and **`z.infer<>`** outputs
- **API DTOs** come from `@remindme/contracts` — features re-export via `api.ts` / `types.ts` for colocation; see [ARCHITECTURE.md §5](ARCHITECTURE.md) and [§12](#12-shared-api-contracts-packagescontracts)
- Use separate **UI/view-model types** only when mapping is non-trivial
- Path alias: **`@/`** → `src/` (frontend and backend only; contracts uses relative imports or package subpath exports)
- No `any`; use `unknown` + narrowing for API error payloads

---

## 12. Shared API contracts (`packages/contracts`)

RemindMe uses an **npm workspaces monorepo**. Frontend and backend stay separate deployable apps, but **API shapes are defined once** in a shared TypeScript package and imported by both.

### 12.1 What each folder means

| Path | Meaning |
|------|---------|
| **`packages/`** | Workspace folder for **libraries shared across apps**. Not deployed on their own — consumed by `frontend/` and `backend/` via `package.json` dependencies. You can add more packages later (e.g. `packages/eslint-config`, `packages/tsconfig`). |
| **`packages/contracts/`** | The **API contract package** — Zod schemas and inferred TypeScript types for every REST request and response DTO. Named *contracts* because it defines the agreement between client and server, not UI or database internals. |
| **`packages/contracts/src/`** | Package **source code**. Domain modules (`auth.ts`, `categories.ts`, …), shared primitives (`pagination.ts`, `errors.ts`), and a barrel `index.ts`. Built or consumed directly via TypeScript project references / subpath exports. |

**Not the same as `frontend/src/` or `backend/src/`:** those are application entrypoints (React UI, Express server). `packages/contracts/src/` has **no React, Express, or Prisma** — only Zod + pure TypeScript types.

### 12.2 Monorepo layout

```
remindme/
  package.json                 # workspaces: ["frontend", "backend", "packages/*"]
  packages/
    contracts/
      package.json             # name: "@remindme/contracts"
      tsconfig.json
      src/
        index.ts               # barrel re-exports (optional)
        auth.ts
        categories.ts
        topics.ts
        entities.ts
        media.ts
        common/
          pagination.ts        # cursor pages, list meta
          errors.ts            # ApiError, validation error shape
  frontend/
    package.json               # depends on "@remindme/contracts": "*"
    src/
      features/
        categories/
          api.ts               # imports types from @remindme/contracts
          types.ts             # re-exports for feature colocation
        media/
          api.ts               # multipart upload
          queries/
            use-upload-media.ts
  backend/
    package.json               # depends on "@remindme/contracts": "*"
    src/
      modules/
        categories/
          categories.routes.ts
          categories.service.ts
        media/
          media.routes.ts
          media.service.ts
```

### 12.3 Source of truth

```mermaid
flowchart TB
    subgraph contracts [packages/contracts]
        Zod[Zod schemas]
        Types["z.infer types"]
    end
    subgraph backend [backend]
        Validate[validate middleware]
        Service[Domain services]
        Prisma[Prisma models]
        OpenAPI[openapi.yaml]
    end
    subgraph frontend [frontend]
        Api[features/*/api.ts]
        Forms[features/*/schemas.ts]
    end

    Zod --> Validate
    Zod --> Forms
    Zod --> OpenAPI
    Types --> Api
    Types --> Service
    Prisma -.->|map to DTO| Service
```

| Layer | Source of truth | Shared? |
|-------|-----------------|---------|
| **HTTP request/response DTOs** | `packages/contracts` | Yes — frontend + backend |
| **Request validation** | Same Zod schemas | Yes |
| **Database models** | `backend/prisma/schema.prisma` | No — backend only |
| **Form-only fields** | `frontend/features/*/schemas.ts` | No — client only (e.g. `confirmPassword`) |
| **UI / view models** | Feature components | No |

**Rule:** backend services **map Prisma models → contract DTOs** before responding. Never expose Prisma-generated types or raw DB rows to the client.

### 12.4 Package setup (when scaffolded)

Root `package.json`:

```json
{
  "private": true,
  "workspaces": ["frontend", "backend", "packages/*"]
}
```

`packages/contracts/package.json`:

```json
{
  "name": "@remindme/contracts",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./auth": "./src/auth.ts",
    "./categories": "./src/categories.ts",
    "./entities": "./src/entities.ts",
    "./common/errors": "./src/common/errors.ts"
  },
  "dependencies": {
    "zod": "^4.4.3"
  }
}
```

Both apps declare:

```json
"dependencies": {
  "@remindme/contracts": "*"
}
```

Use **subpath exports** (`@remindme/contracts/categories`) so features import only the domain they need — better tree-shaking and clearer boundaries than one giant barrel.

### 12.5 Example contract module

```typescript
// packages/contracts/src/categories.ts
import { z } from 'zod';

export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  topicCount: z.number().int().nonnegative(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
});

export type Category = z.infer<typeof categorySchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
```

**Backend** — validate incoming body, type the handler:

```typescript
import { createCategorySchema } from '@remindme/contracts/categories';
import type { Category } from '@remindme/contracts/categories';

// validate middleware parses req.body with createCategorySchema
async function createCategory(input: CreateCategoryInput): Promise<Category> {
  const row = await prisma.category.create({ data: { name: input.name } });
  return { id: row.id, name: row.name, topicCount: 0 };
}
```

**Frontend** — typed API client and form:

```typescript
import type { Category, CreateCategoryInput } from '@remindme/contracts/categories';
import { createCategorySchema } from '@remindme/contracts/categories';

export async function getCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<Category[]>('/categories');
  return data;
}

export async function createCategory(payload: CreateCategoryInput): Promise<Category> {
  const { data } = await apiClient.post<Category>('/categories', payload);
  return data;
}

// features/categories/schemas.ts — re-export for colocation
export { createCategorySchema } from '@remindme/contracts/categories';
```

**Frontend colocation** — feature `types.ts` re-exports without duplicating:

```typescript
// features/categories/types.ts
export type { Category, CreateCategoryInput } from '@remindme/contracts/categories';
```

### 12.6 What belongs in contracts vs local schemas

| Put in `@remindme/contracts` | Keep local |
|------------------------------|------------|
| Request bodies the API accepts | `confirmPassword`, UI-only form fields |
| Response DTOs the API returns | Prisma model types |
| Path/query param schemas | TanStack Router search-param schemas |
| Shared enums (`BlockType`, roles) | Entity constructor UI-only helpers |
| Pagination, `ApiError` shapes | Block editor local state |

When a form matches the API payload, **import the contract schema** — do not copy-paste field rules into `schemas.ts`.

### 12.7 Naming conventions

- **Schemas:** `createCategorySchema`, `entityListPageSchema`, `loginSchema`
- **Types:** `Category`, `CreateCategoryInput`, `EntityListPage` — always `z.infer<typeof …>` in the contracts package
- **Files:** one domain per file, mirroring `backend/src/modules/` and `frontend/src/features/`
- **Common helpers:** `packages/contracts/src/common/` for cross-domain primitives

### 12.8 Workflow when the API changes

1. Edit the Zod schema in `packages/contracts`.
2. TypeScript fails in frontend and/or backend until call sites are updated — intentional safety net.
3. Backend maps Prisma → DTO if the DB shape differs from the wire format.
4. Regenerate or update OpenAPI if you publish docs from contracts (see [§15.8](#158-openapi)).
5. Run tests in both packages.

### 12.9 Variants and alternatives

The chosen approach is **shared Zod package**. Other valid patterns — use only if requirements change:

| Variant | Layout | Pros | Cons |
|---------|--------|------|------|
| **A — Shared Zod package (chosen)** | `packages/contracts` with Zod + `z.infer` | Single source of truth; runtime validation + types; fits both apps | Frontend bundles Zod (acceptable); package must stay framework-free |
| **B — OpenAPI codegen** | `backend/openapi.yaml` → generate `frontend/src/generated/api.ts` | Frontend has zero manual DTOs; good for non-TS clients | Types are generated/read-only; forms still need Zod unless duplicated; extra codegen step |
| **C — tRPC / RPC framework** | Shared router in `packages/api` | End-to-end types without REST | Not in v1 stack; couples client to TS RPC |
| **D — Duplicate interfaces** | Hand-written types per app | Simplest to start | Drift guaranteed; avoid |

**Package naming alternatives** (same idea, different folder names):

| Folder name | npm name | When to use |
|-------------|----------|-------------|
| `packages/contracts` | `@remindme/contracts` | **Default** — emphasizes API agreement |
| `packages/shared` | `@remindme/shared` | If you later add non-API shared code (constants, utils) — risk of becoming a junk drawer |
| `packages/api-types` | `@remindme/api-types` | If schemas stay TypeScript-only with no Zod (not recommended for this project) |
| `packages/schemas` | `@remindme/schemas` | Emphasizes Zod; less clear that response types live here too |

**Splitting contracts later:** if the package grows large, split into `packages/contracts` (Zod) + `packages/api-client` (optional typed fetch wrapper) — only when needed.

### 12.10 Constraints

- **No imports** from `frontend/`, `backend/`, React, Express, or `@prisma/client` inside `packages/contracts`.
- **No side effects** — schemas and types only.
- **One Zod version** across workspace packages (align `package.json` ranges).
- **Do not** put Prisma types or env schemas in contracts — env validation stays in `backend/src/config/env.ts`.

---

## 13. ESLint and Prettier

### ESLint (flat config: `eslint.config.js`)

- `@eslint/js`, `typescript-eslint`
- `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` (Vite)
- `@tanstack/eslint-plugin-query` (exhaustive deps for Query hooks)
- `@tanstack/eslint-plugin-router` (file-route and loader conventions)

### Prettier

- `prettier` + `eslint-config-prettier` (disable conflicting ESLint formatting rules)
- npm scripts: `lint`, `format`, `format:check`
- Format on save recommended in editor settings

---

## 14. Folder structure

The repo is an **npm workspaces monorepo**: `frontend/`, `backend/`, and `packages/contracts/`. Frontend layout details and import boundaries are in [ARCHITECTURE.md](ARCHITECTURE.md). Backend internal layout summary is in **§15.10**. Shared API contracts are documented in **§12**.

### Repo root

```
remindme/
  package.json                 # workspaces
  packages/
    contracts/                 # @remindme/contracts — see §12
  frontend/
  backend/
```

### Frontend (`frontend/src/`)

```
src/
  routes/              # TanStack Router — thin route modules (see §4)
  features/            # Domain modules — auth, categories, topics, entities, media (see ARCHITECTURE.md §5)
  components/ui/       # shadcn/ui
  components/layout/   # AppShell, AuthLayout, nav (Lucide in nav/actions)
  components/shared/   # cross-feature UI (promoted when reused)
  lib/                 # api-client, query-client, query-keys, utils
  stores/              # Zustand — UI preferences (v1)
  hooks/               # non-Query hooks shared by 2+ features only
```

Each API operation: `api.ts` function (typed with `@remindme/contracts`) + matching file in `features/<domain>/queries/` (one `useQuery` / `useMutation` hook per file).

### Shared contracts (`packages/contracts/src/`)

```
packages/contracts/src/
  index.ts               # optional barrel
  auth.ts
  categories.ts
  topics.ts
  entities.ts
  player.ts
  media.ts
  common/
    pagination.ts
    errors.ts
```

`statistics.ts` is **deferred** — not part of v1 contracts until the statistics page returns to the product spec.

---

## 15. Backend stack

Backend application code lives under **`backend/`**. The logical schema is defined in [DATABASE.md](DATABASE.md); Prisma is the source of truth for migrations and the typed client.

### 15.1 Architecture

```mermaid
flowchart LR
    Client[Axios client] --> Routes[Express routes]
    Routes --> Validate[Zod validate middleware]
    Validate --> Auth[Auth middleware]
    Auth --> Service[Domain services]
    Service --> Prisma[Prisma Client]
    Prisma --> PG[(PostgreSQL)]
    Service --> Storage[Object storage]
    Contracts[@remindme/contracts] --> Validate
    Contracts --> Service
```

**Layering:**

- **Contracts** — Zod schemas and DTO types in `packages/contracts/`; imported by routes and services

- **Routes** — parse HTTP, call services, map responses; no business logic
- **Services** — business rules, transactions, authorization checks
- **Prisma** — persistence only; no HTTP concerns
- **Middleware** — auth, validation, error handling, logging

### 15.2 Express

- **Express 5** with TypeScript; compile with `tsc` or run dev via `tsx watch`
- REST JSON under **`/api/v1`**
- **`cors`** — allow the frontend origin; **`credentials: true`**
- **`cookie-parser`** — read JWT from httpOnly cookie
- **`express.json()`** — JSON bodies; size limit tuned for entity payloads
- Central **`error-handler`** middleware — map `AppError` to HTTP status + JSON body
- **Route modules** grouped by domain (`auth`, `categories`, `topics`, `entities`, `media`, `users`)

### 15.3 Prisma + PostgreSQL

Prisma maps [DATABASE.md](DATABASE.md) tables 1:1:

| Prisma model | Notes |
|--------------|-------|
| `User`, `Role`, `Permission`, `UserRole`, `RolePermission` | RBAC; seed `user` and `admin` roles |
| `PasswordResetToken` | Hashed token, expiry, single-use via `used_at` |
| `Category`, `Topic`, `Entity` | Content hierarchy; ownership via `Category.userId` |
| `EntityBlock`, `ListBlockRow` | Constructor blocks; max 20 blocks per entity |
| `MediaAsset` | Upload metadata; binary in object storage |

**Enums:** `BlockType` (`text`, `code`, `image`, `list`), `EntityVisibility` (`included`, `excluded`).

**Key relations:**

- `Topic` → `Category`: **`onDelete: Restrict`** (category delete blocked when topics exist)
- `EntityBlock` → `Entity`, `ListBlockRow` → `EntityBlock`: **`onDelete: Cascade`**
- `EntityBlock.contentJson`: **`Json?`** for TipTap / code payloads (see DATABASE.md §4)

**Migrations:** `prisma migrate dev` in development; `prisma migrate deploy` in production.

**Seed:** `prisma/seed.ts` inserts roles, permissions, and default role→permission mappings from DATABASE.md §5.

**Constraints:** enforce block position range (0–19), type-specific nullability, and unique `(entityId, position)` in Prisma schema and/or SQL migrations where Prisma checks are insufficient.

### 15.4 Validation (Zod)

- **Import request schemas from `@remindme/contracts`** — do not duplicate validation rules in `*.schemas.ts`
- **`validate` middleware** — parse `body`, `params`, `query` with contract schemas; return **422** with field errors for the frontend `setError()` flow
- **Env validation** — `config/env.ts` parses `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, storage vars at startup (local to backend, not in contracts)
- Prefer **`z.infer<typeof schema>`** for handler input types — same pattern as frontend forms

### 15.5 Auth and authorization

| Flow | Behavior |
|------|----------|
| **Register** | Hash password with **bcrypt** (cost 12); create user; assign `user` role |
| **Login** | Verify password; issue JWT (`sub`, roles, permissions); set **httpOnly, Secure (prod), SameSite=Lax** cookie |
| **Logout** | Clear auth cookie |
| **Me** | Return current user profile and roles |
| **Forgot / reset password** | Store **hashed** token in `password_reset_tokens`; single-use + expiry on consume |

**Middleware:** verify JWT from cookie → attach `req.user` and `req.permissions`.

**Authorization:** `requirePermission('content:manage_own')` helper. Content queries filter `categories.user_id = req.user.id` unless the user has `content:manage_any` (admin).

### 15.6 API surface (v1)

Grouped by [PRODUCT.md](PRODUCT.md) flows. Exact paths and DTOs are defined in `packages/contracts` and mirrored in the OpenAPI spec.

**Nested REST style:** content resources mirror the frontend URL hierarchy (`Category → Topic → Entity`). Topics and entities are always addressed under their parent category (and topic for entities). Auth and media upload stay at top-level paths.

| Area | Endpoints (sketch) |
|------|-------------------|
| **Auth** | `POST /auth/register`, `/login`, `/logout`, `/forgot-password`, `/reset-password`; `GET /auth/me` |
| **Categories** | `GET /categories`, `POST /categories` (name only), `PATCH/DELETE /categories/:categoryId` |
| **Topics** | `GET/POST /categories/:categoryId/topics`; `GET/PATCH/DELETE /categories/:categoryId/topics/:topicId` |
| **Entities** | `GET/POST /categories/:categoryId/topics/:topicId/entities`; `GET/PATCH/DELETE /categories/:categoryId/topics/:topicId/entities/:entityId` |
| **Player** | `POST /player/batch`; `PATCH …/entities/:entityId/revise`; `PATCH …/entities/:entityId/skip` |
| **Entity blocks** | Nested in entity create/update payload — atomic save of title + ordered blocks (max 20) |
| **Media** | `POST /media/upload` → returns `media_asset_id` (standalone; referenced by image blocks) |
| **Admin API** | `GET/PATCH /users/:id` — gated by `users:manage`; **no admin UI in v1** (see §16) |

**Status codes:** `401` unauthenticated, `403` missing permission, `409` conflict (e.g. delete non-empty category), `422` validation errors.

**Entity save:** use **`prisma.$transaction`** — upsert entity, replace block set by position, enforce max 20 blocks in the service layer before writing.

### 15.7 Media uploads

**Frontend:** `features/media/api.ts` exposes `uploadMedia()`; `features/media/queries/use-upload-media.ts` wraps it as a mutation. Entity constructor `ImageBlockEditor` calls this hook via custom file-picker + drag-drop UI (see §9).

**Backend:** `backend/src/modules/media/` — routes + service.

1. Client sends multipart file → **Multer** parses upload
2. Validate mime type and size limits
3. Store binary in **S3-compatible object storage**; persist metadata in `media_assets`
4. Image blocks reference `media_asset_id`
5. Orphan cleanup when blocks are removed (application concern; no background queue in v1)

For local development, a **filesystem storage adapter** is acceptable before wiring S3.

### 15.8 OpenAPI

- Generate **`backend/openapi.yaml`** from `@remindme/contracts` Zod schemas (e.g. `@asteasolutions/zod-to-openapi`) or maintain by hand in sync with contracts
- Serve **Swagger UI** at `/api/docs` in development
- OpenAPI is **documentation and external-client tooling** — TypeScript apps import contracts directly, not generated types

### 15.9 Local development

**Docker Compose** runs PostgreSQL 16 locally. Example env vars (`.env.example`):

```
DATABASE_URL=postgresql://remindme:remindme@localhost:5432/remindme
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

**npm scripts (when scaffolded):** `dev`, `build`, `start`, `db:migrate`, `db:seed`, `db:studio`, `test`.

Frontend points at the API via **`VITE_API_URL=http://localhost:3000/api/v1`**.

### 15.10 Backend folder structure

```
backend/
  prisma/
    schema.prisma
    migrations/
    seed.ts
  src/
    app.ts                 # Express app — middleware, routes
    server.ts              # listen()
    config/
      env.ts               # Zod-validated env
    lib/
      prisma.ts            # singleton PrismaClient
      errors.ts            # AppError, error mapper
    middleware/
      auth.ts
      require-permission.ts
      validate.ts
      error-handler.ts
    modules/
      auth/
        auth.routes.ts
        auth.service.ts
      categories/
      topics/
      entities/
      media/
        media.routes.ts
        media.service.ts
      users/
    openapi/
      spec.ts
  docker-compose.yml
  package.json
  tsconfig.json
  .env.example
```

**Convention:** one module per domain — `routes` → `service` → Prisma. Validation schemas live in `@remindme/contracts`, not per-module `*.schemas.ts`. Mirrors the frontend's thin routes + feature modules pattern.

### 15.11 Explicit non-goals (v1)

- GraphQL, tRPC, or SSR
- Admin panel UI (backend admin API may exist; page settings and UX not defined — see §16)
- Revision session tables (Player session state is client-side; counters on `entities` — see [DATABASE.md](DATABASE.md))
- Email delivery provider (stub forgot-password until wired)
- Redis / job queue (add when orphan media cleanup or email needs it)

---

## 16. Deferred decisions (TBD)

These are **not** part of the chosen stack. Decide when implementing the relevant feature:

| Topic | Recommendation | Status |
|-------|----------------|--------|
| Additional CodeMirror languages | `@codemirror/lang-*` beyond JavaScript/TypeScript | Add when product needs them |
| Toast library | sonner or shadcn toast | Unspecified for now |
| Admin panel | Settings, layout, and permissions UX | Deferred — not defined for now |
| Charts (statistics) | Recharts or TanStack Charts | TBD |
| Frontend testing | Vitest + React Testing Library | Vitest scaffolded in frontend; adoption strategy TBD |
| Object storage provider | S3-compatible (AWS S3, MinIO, etc.) | TBD |
| Email provider | Transactional email for password reset | TBD |
| Package manager | pnpm or npm workspaces | TBD |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-08-18 | Player batched session: pack mutation instead of per-entity prefetch; Progress bar |
| 2026-06-29 | Initial tech stack document |
| 2026-06-29 | Adopt react-hook-form + Zod for forms |
| 2026-06-29 | Adopt Tailwind CSS + shadcn/ui for styling and UI primitives |
| 2026-06-29 | Confirm TanStack Router file-based routing under `src/routes/` |
| 2026-06-29 | Folder structure moved to [ARCHITECTURE.md](ARCHITECTURE.md); API types colocated per feature |
| 2026-06-29 | Repo root layout (`src/` at root); frontend-only repo |
| 2026-06-29 | One Query/Mutation hook per file under `features/*/queries/` |
| 2026-07-04 | Adopt Iconoir (`iconoir-react`) as the icon kit |
| 2026-07-04 | Switch icon kit to Lucide (`lucide-react`) — aligns with shadcn/ui defaults |
| 2026-07-13 | Repo layout: `frontend/` + `backend/`; backend stack TBD |
| 2026-07-13 | Adopt backend stack: Express 5 + Prisma + PostgreSQL; document in §15 |
| 2026-07-13 | Adopt shared API contracts: `packages/contracts` (`@remindme/contracts`); document in §12 |
| 2026-07-13 | Align with PRODUCT: entity constructor model; Category → Topic → Entity routes; defer revision/statistics/templates |
| 2026-07-13 | Add Player (`/player`): TanStack Query prefetch, Done/Skip mutations, read-only preview reuse |
| 2026-07-13 | Nested REST API for topics/entities; add `features/media/` + `modules/media/`; defer admin UI and entity-constructor editor/toast libraries |
| 2026-07-13 | Adopt TipTap as rich text editor for Entity constructor Text blocks (§9) |
| 2026-07-13 | Adopt `@uiw/react-codemirror` for Entity constructor Code blocks; MVP languages: JavaScript + TypeScript (§9) |
| 2026-07-13 | Image blocks: custom `ImageBlockEditor` — file picker + drag-drop; preview with remove (§9) |
| 2026-07-13 | Drop TanStack Virtual; adopt classic offset pagination for entity lists (§7) |
