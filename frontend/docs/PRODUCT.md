# RemindMe — Product Specification

Structured product knowledge for RemindMe. Defines **what the app is**, **how it is organized**, and **how it behaves**. No technical implementation details.

For the original raw notes, see [ABOUT.md](ABOUT.md).

For the chosen frontend libraries and conventions, see [TECH_STACK.md](TECH_STACK.md). For codebase folder layout (`frontend/` + `backend/`), see [ARCHITECTURE.md](ARCHITECTURE.md). For page wireframes and the MVP 1024px layout, see [WIREFRAMES.md](WIREFRAMES.md). For tables and fields, see [DATABASE.md](DATABASE.md). For how the Player deals batches and resets rounds, see [PLAYER.md](PLAYER.md).

---

## 1. Vision

| Aspect | Definition |
|--------|------------|
| **Purpose** | Help users revise information they have already learned |
| **Primary loop** | Organize content into categories and topics → add and configure entities → revise information on demand |
| **Not in scope (for now)** | Learning new material, social features, sharing, notifications |

---

## 2. Glossary

Core concepts used consistently throughout this document:

```mermaid
flowchart TD
    User --> Category
    Category --> Topic
    Topic --> Entity
```

| Concept | Definition | Notes |
|---------|------------|-------|
| **Category** | A user-defined container for related topics | Can be **empty** (no topics); deletable only when empty |
| **Topic** | A named grouping inside a category that holds a list of entities | Can be **empty**; optional at category creation |
| **Entity** | One piece of revisable information inside a topic | Configured on the **Entity constructor** page: required **Title** plus an ordered sequence of **constructor blocks** (see §3.4) |

### Clarifications

- **Category creation:** Required **category name** only in the Categories popover (not a separate page). Topics are added later from Category detail.
- **Category metadata:** Icon, color, and description are optional future fields (TBD, not required for v1).
- **Empty states:** A category may have zero topics; a topic may have zero entities.
- **Entity list identity:** The entity **Title** (required field on the constructor page) is shown as the row label on Topic detail.
- **Entity row revised count:** Each entity row shows `{revised_count} revised` in gray text before the Play button (e.g. `3 revised`).

---

## 3. Pages & Navigation

### 3.1 Page inventory

| Page | Purpose |
|------|---------|
| **Registration** | Create account |
| **Login** | Sign-in dialog on Home (`/?login=true`), opened from **Log in** or when a guest opens a protected page; not a separate page |
| **Forgot password** | Password recovery |
| **Home** | Public landing page: slogan, **Log in** and **See how it works** for guests; logged-in users also see the tree card, **Open my categories**, **Your library** counts and the **Daily activity** and **Time in Player** charts |
| **Categories** | List categories; add category via popover |
| **Category detail** | List topics in a category; **Add topic**; open a topic |
| **Topic detail** | List entities in a topic; **Add entity** (full page); edit or remove each entity |
| **Entity** | Constructor — split preview (left) and block editor (right); opened as a full page from Topic detail; required Title + 1–20 constructor blocks (see §3.4) |
| **Player** | Revise entities one at a time; **Done** / **Skip** update counters (see §3.5) |

### 3.2 Navigation map

```mermaid
flowchart LR
    subgraph auth [Auth]
        Reg[Registration]
        Login[Login]
        Forgot[Forgot password]
    end
    subgraph main [Main app]
        Home[Home]
        CatDetail[Category detail]
        TopicDetail[Topic detail]
        EntityPage[Entity constructor]
        Player[Player]
    end
    Home --> CatDetail
    CatDetail --> TopicDetail
    TopicDetail --> EntityPage
    Home -->|"Play on category"| Player
    CatDetail -->|"Play on topic"| Player
    TopicDetail -->|"Play on entity"| Player
```

### 3.3 Page-specific notes

**Home** (`/`)

- Guests: slogan, **Log in** (opens the login dialog) and **See how it works** (also opens the login dialog; there is no tour yet). Below them, **Grow your tree** shows three stage cards: Sprout at Level 1, Leaves at Level 4, Apples at Level 6.
- Logged in: **Your tree** card — the tree at the stage of the user's level (any of the six: Sprout, Seedling, Sapling, Leaves, Blossom or Apples), the total drops and the level ("7 drops · Level 3"), the drops earned today ("1 / 3 today") and below them one line: "Spend up to 20 more minutes in the Player to earn the rest today." while today's cap is not reached, or "Come back tomorrow to earn up to 3 more drops." once it is. When decay has lowered the level, the line "Your tree lost a level — 10 minutes in the Player brings it back" shows as well. **Open my categories** (→ `/categories`) sits on the card. Until the score loads, the tree slot stays empty and the numbers show a dash.
- Logged in: **Your library** — counts of categories, topics and entities.
- Logged in: **Daily activity** — stacked bar chart, one bar per day of the selected month: **Skipped** (gold) at the bottom, **Revised** (terracotta) on top. Defaults to the current month; **Prev month** / **Next** (top right, on the chart title row) page through months: Next is disabled on the current month, Prev is disabled on the first month that has any activity (or on the current month if there is none yet). Empty months in between (e.g. a long break) stay reachable. Days are the user's local calendar days. Counts come only from Player **Done** / **Skip** clicks from the moment the feature shipped. Data is cached for a day and refreshed after any Done/Skip. From 768px wide it sits beside **Time in Player**; below that the two stack.
- Logged in: **Time in Player** — area chart of Player minutes per day for the selected month, with a dashed line at the 30-minute daily goal, plus the month's total and the average per active day.

**Score (drops and levels):** Every full 10 minutes in the Player on a local day earns 1 drop, up to 3 drops per day (30 minutes). Only time with the Player tab visible counts. Every 3 drops open the next level: `level = min(floor(drops / 3) + 1, 6)`. There are 6 levels, and everyone starts at level 1 with 0 drops; the tree stage equals the level, so each level has its own tree. Drops have no upper limit: the level stops at 6 from 15 drops on, while the total keeps growing. Each past day without an earned drop takes 1 drop away (down to 0). Today never takes one, and a day with at least 1 drop does not decay. Drops start on launch day, 2026-11-25: Player time before that counts for neither drops nor decay. The score comes from `GET /activity/score` and is worked out from the user's Player time on each request, so nothing is stored.

**Categories** (`/categories`)

- Lists all created categories.
- **Add category** button opens a **popover** (not a new page).
- Popover contains only **Category name** (required) and a **Save** button below the field.
- Save creates the category and redirects to **Category detail** (empty category page).
- Tap a category → Category detail.
- Icon-only **Rename**, **Delete**, and **Play** buttons on each category row (`aria-label` carries the action name). Delete only if category is empty (no topics). **Play** opens the **Player** for all entities in that category (see §3.5); disabled when the category has no eligible entities.

**Category detail**

- **Add topic** button at the top; list of existing topics below.
- Tap a topic → Topic detail.
- Creating a topic does not redirect: the new topic appears in the list on this page.
- Icon-only **Rename** and **Delete** buttons on the category title row (`aria-label` carries the action name). Delete only when the category has no topics (with confirmation).
- Each topic row has icon-only **Rename**, **Delete**, and **Play** buttons. Delete only when the topic has no entities. **Play** opens the **Player** for all entities in that topic (see §3.5); disabled when the topic has no eligible entities.

**Topic detail**

- **Add entity** button; list of existing entities below.
- **Add entity** opens the Entity constructor as a full page (`…/entities/new`).
- Each entity row shows the entity's **`revised_count`** as gray text (`{count} revised`) before icon-only **Play**, **Edit** and **Remove** buttons (`aria-label` carries the action name) — **Edit** opens the Entity constructor as a full page (`…/entities/$entityId`); **Remove** asks for confirmation; **Play** opens the **Player** for that entity only (see §3.5).

**Entity (constructor)**

- Opens as a full page: **Add entity** at `…/entities/new`, **Edit** at `…/entities/$entityId`.
- Full layout, block types, and limits: see **§3.4 Entity constructor**.

### 3.4 Entity constructor

The Entity page is a two-panel editor. The user builds revisable content from a required Title and an ordered list of constructor blocks.

```mermaid
flowchart LR
  subgraph entityPage [Entity constructor]
    PreviewPanel["Left: content preview"]
    ConstructorPanel["Right: constructor blocks"]
  end
  ConstructorPanel -->|"updates live"| PreviewPanel
```

**Layout**

- **Left — content preview:** Read-only render of the entity as configured (Title + blocks in sequence). Updates live as the user edits on the right.
- **Right — constructor panel:** Title field, ordered block list, and type-specific editors. Used to add, remove, and reorder blocks.

**Title**

- Required text field at the top of the constructor panel.
- Not counted toward the block limit.
- Shown as the entity name on **Topic detail**.

**Constructor blocks**

Each entity has its own ordered sequence of blocks. Types can be mixed and ordered freely per entity.

| Block type | Purpose | Editor behavior |
|------------|---------|-----------------|
| **Text** | Prose / notes | TipTap rich text editor (bold, italic, underline, headings, lists, tables) |
| **Code** | Code snippet | `@uiw/react-codemirror` editor with language selector; MVP: **JavaScript** and **TypeScript**; optional checkbox: **Blured by default** |
| **Image** | Visual content | Custom upload container: centered file picker + drag-drop; preview after upload; remove to re-upload |
| **List** | Key–value pairs | Rows with **left** and **right** columns; **+** adds a row within the block; optional checkbox: **Blur right side by default** |
| **Link** | External resource | **Title** (optional, max 75 symbols) + **URL** (required, `http://` or `https://`) |

Additional block types may be added in future versions; v1 supports the five types above.

**Code block options** (checkbox below the editor):

| Option | Default | Behavior |
|--------|---------|----------|
| **Blured by default** | off | Code is blurred until the user clicks/taps to reveal (revision-style guess-then-check) |

**List block:** The **+** button adds a row inside that List block (left/right values). It does not add a new top-level constructor block.

**List block options** (checkbox below **+ Add row**):

| Option | Default | Behavior |
|--------|---------|----------|
| **Blur right side by default** | off | Right column text is blurred until the user clicks/taps to reveal (revision-style guess-then-check) |

**Link block:** In preview and the Player the title (if set) is shown above the URL; the URL is a link that opens in a new tab, with an external-link icon to its right.

**Image block:** Empty state shows a drop zone with a centered **Choose image** button. Drag-and-drop onto the container triggers the same upload flow. Once uploaded, the image preview fills the container. A remove control clears the image and returns to the empty state so the user can upload again.

**Block management**

- User can add, remove, and reorder blocks in the right panel.
- When the entity already has **20 blocks**, adding new blocks is disabled.

**Limits**

- Maximum **20 constructor blocks** per entity (Title excluded).
- An entity needs at least one block; Save is disabled with none.

### 3.5 Player

The **Player** (`/player`) is where the user revises information. It shows one entity at a time as a read-only preview (Title + all constructor blocks — same content as the Entity constructor left panel). Implementation detail: [PLAYER.md](PLAYER.md).

**Layout**

- **Top bar:** the **Player** heading, a timer ring (time in Player today against the 30-minute goal) and **Stop**. Stop exits the Player immediately and returns to the page it was opened from (an internal `returnTo` path), or to **Categories** when there is none. Does not change counters for the current entity.
- **Progress:** A segmented bar under the top bar (`completed of total` plus how many are left in this pack).
- **Center — entity preview:** Read-only render of the current entity (Title + blocks in sequence), in a card.
- **Bottom — actions:** **Skip** (secondary, left) and **Done** (positive, right) below the preview, with one hint line under them: "Press **D** for Done or **S** for Skip".

**Behavior**

- The Player deals **packs of up to 3** eligible entities (fewer if the min pool is smaller). The next card is already in the client queue.
- **Done** — increments `revised_count` for the current entity; advances to the next item in the current pack.
- **Skip** — increments `skipped_count` only (does not increment `revised_count`); advances to the next item in the current pack. Skip and Done differ only by which counter they update.
- **Pack complete** — when the current pack is exhausted, a modal offers **Get next 3** or **Go to Home**. The user stays on `/player` (no summary screen, no auto-redirect).
- **Round reset** — if the next pack is empty because every eligible entity was already shown this round, shown ids are cleared and a new pack is dealt. Play continues.
- **Empty scope** — if there are no eligible entities in scope, **Play** is disabled on the list row when possible; navigating to `/player` with an empty scope shows a depleted state (Home only).
- **Keyboard** — **D** marks Done and **S** marks Skip while an entity from the pack is showing. Ignored when Ctrl, Cmd, Alt or Shift is held, on key repeat, while typing in a field, while a Done or Skip request is pending, and between packs.

**Entry points**

| Page | Play button | Session scope |
|------|-------------|---------------|
| Categories list | Each category row | All entities in that category (across topics) |
| Category detail (topics list) | Each topic row | All entities in that topic |
| Topic detail (entities list) | Each entity row | That entity only (packs of 1; continues after a round reset) |

Tapping a row name still navigates to detail; **Play** navigates to `/player` with the scope encoded in route search params (`categoryId`, `topicId`, or `entityId`).

**Scheduling**

1. Only entities with `visibility = included` are eligible (see [DATABASE.md](DATABASE.md)).
2. Each pack is a random sample from entities at the **minimum** `revised_count` among those not yet shown this round.
3. An entity is shown at most once per **round** (the current pass through the scope). A new round starts when every eligible entity has been shown.
4. After Done, that entity’s `revised_count` rises, so it is less likely to appear until others catch up.
5. After Skip, `revised_count` stays the same, so the entity stays in the low pool and can re-enter on the next round.

---

## 4. User Flows

### 4.1 New category (popover on Categories)

1. Categories → **Add category**
2. Popover: enter **category name** (required) — the only field
3. Tap **Save** (below the field) → category created
4. User is redirected to **Category detail** (empty category page)

Notes:

- Category may have no topics; user adds topics from Category detail.

### 4.2 Existing category (browse topics)

1. Categories → tap category → **Category detail**
2. **Add topic** button at the top; list of previously created topics below
3. Tap a topic → **Topic detail**

### 4.3 Add topic (from Category detail)

1. Category detail → **Add topic**
2. **Add topic** popover: enter the topic name, then **Save**
3. After save, the topic appears in the list on Category detail (no redirect)

### 4.4 Topic detail (entities)

1. Topic detail → **Add entity** button at the top; list of previously created entities below
2. **Add entity** opens the Entity constructor as a full page (`…/entities/new`)
3. On each existing entity: **Edit** (Entity constructor) or **Remove** (with confirmation)

### 4.5 Revision flow (Player)

**Start from a category (Categories)**

1. Categories → **Play** on a category row → **Player** (`/player?categoryId=…`)
2. First pack: up to 3 random entities at minimum `revised_count` in that category (only `visibility = included`)
3. User reviews the read-only preview
4. **Done** or **Skip** → matching counter incremented → next entity in the current pack
5. When the pack is empty → modal: **Get next 3** or **Go to Home**
6. Continue deals another pack, excluding entities already shown this round
7. When a pack request is empty, the round resets and play continues from the current min pool

**Start from a topic (Category detail)**

1. Category detail → **Play** on a topic row → **Player** (`/player?topicId=…`)
2. Same pack / Done / Skip / continue rules, limited to entities in that topic

**Start from a single entity (Topic detail)**

1. Topic detail → **Play** on an entity row → **Player** (`/player?entityId=…`)
2. That entity is shown (pack of 1) if eligible
3. **Done** or **Skip** → continue modal; next pack after a round reset is the same entity again

**Stop at any time**

1. **Stop** (top of Player) → return to the page the Player was opened from, or **Categories** when there is none, immediately; current entity counters are unchanged

---

## 5. Business Rules

### Categories

- User can create unlimited categories
- Category name is required on creation
- Category may exist with zero topics
- Delete category only when it contains zero topics
- Topics are added separately from Category detail, not during category creation

### Topics

- Belong to exactly one category
- May exist empty (zero entities)
- Added from Category detail via **Add topic**
- Naming, edit, and delete rules TBD (see Open decisions)

### Entities

- Belong to exactly one topic (not directly to category)
- Created and edited via **Entity constructor** page
- Removed individually from Topic detail (with confirmation)
- **Title** is required before save
- Block sequence: **1–20** constructor blocks per entity; block order is persisted and drives the content preview and Player display
- **Revision (Player):**
  - **Done** increments `revised_count`; **Skip** increments `skipped_count` only
  - Entities with `visibility = excluded` are not eligible for the Player
  - Packs of up to 3 from the minimum `revised_count` pool; each eligible entity at most once per round (see §3.5 and [PLAYER.md](PLAYER.md))
  - **Play** disabled on list rows when scope has zero eligible entities

---

## 6. Auth

Minimal structure — no technical detail:

| Flow | Behavior |
|------|----------|
| **Registration** | Email + password (assumed); success → Home |
| **Login** | Credentials in the sign-in dialog on Home → Home (dialog closes) |
| **Forgot password** | Email → reset link flow → Login |

Users have roles (`user`, `admin`; extensible). Regular users see only their own categories, topics, and entities. Schema details: [DATABASE.md](DATABASE.md). Multi-device sync is an implicit benefit of accounts, not a separate feature spec.

---

## 7. Open Decisions

Items not blocking product structure but needing confirmation before implementation:

1. **Add topic UI** — decided: a popover on Category detail.
2. **Topic rename / delete** — rules and empty-topic delete behavior
3. **Category rename** — inline on Category detail or separate edit screen?
4. **Entity edit entry point** — decided: Edit opens the full Entity page, the same as Add entity.

---

## 8. Changelog from Original Notes

Changes made when structuring [ABOUT.md](ABOUT.md):

| Topic | Original | Structured |
|-------|----------|------------|
| Category creation | Implied template + fields during category creation | Category created **empty** with name only; entities added separately |
| Revision session | Described only as "pick category and press Start" | Added **Revision session** and **Session summary** pages; session is a **fixed pass** through eligible entities |
| Skip counter | Only "Revised" counter mentioned in scheduling logic | **Skipped counter** added for statistics; skip does not increment revised counter |
| Skip scheduling effect | Not stated | Skipped entities reappear in future sessions sooner (stay in minimum revised pool) |
| Session set | "Random order" among entities with lower revised counter | Clarified: session includes entities at **minimum** revised counter only; shuffled randomly; each shown once |
| Template scope | Ambiguous (category flow included template step) | Templates assigned **per entity**, not per category |
| Category metadata | Not mentioned | **Category name** required on creation |
| Empty category revision | Not addressed | **Blocked** — cannot start revision on empty category |
| Statistics scope | Chart of revised vs skipped | Global totals for v1; session summary is per-session |
| Missing pages | Auth, Home, Entities only | Added Create category, Add entity flows, Edit entity, Revision session, Session summary, Statistics |

### Restructuring (Topics, flows, remove Statistics)

| Topic | Previous | Updated |
|-------|----------|---------|
| Content hierarchy | Category → Entity | Category → Topic → Entity |
| Category creation | Dedicated Create category page | Categories page popover (name only) → redirect to Category detail |
| Entity model | Template-bound fields | User-configured constructor: Title + ordered blocks (Text, Code, Image, List, Link) |
| Entity constructor | Elements TBD | Split layout (preview left, editor right); max 20 blocks per entity |
| Statistics page | Global chart page | **Removed** from product spec |
| Revision / Templates | Full session + template flows | **Player** page at `/player` replaces session/summary pages; template flows removed |

### Player (2026-07-13)

| Topic | Previous | Updated |
|-------|----------|---------|
| Revision UI | Deferred — removed from product spec | **Player** page at `/player` — read-only entity preview, Done/Skip, Stop → Home |
| Entry points | Not defined | **Play** button on category, topic, and entity list rows |
| Session scope | Category-only "Start" | Category (all entities), topic (topic entities), or single entity |
| Scheduling | Min revised_count pool, random, once per session | Restored with Done → min pool; Skip → random in scope |
| Session end | Session summary page | Completion message on `/player` (no summary screen) |
| Counter mutations | Schema only | Done → `revised_count + 1`; Skip → `skipped_count + 1` |

### Link block (2026-10-23)

| Topic | Previous | Updated |
|-------|----------|---------|
| Block types | Text, Code, Image, List | Added **Link**: optional title (≤75 symbols) + required http(s) URL; opens in a new tab with an external-link icon |

### Code block blur (2026-08-31)

| Topic | Previous | Updated |
|-------|----------|---------|
| Code block options | Language selector + editor only | Optional **Blured by default** checkbox; preview/Player click-to-reveal |

### Player batches (2026-08-18)

| Topic | Previous | Updated |
|-------|----------|---------|
| Queue | Load all eligible client-side; once per session | Packs of ≤3 full entities; next card already in the client queue |
| Session end | Completion message after every eligible entity once | Continue modal each pack; **round reset** when the scope is fully shown |
| Skip scheduling | Random from all remaining in scope | Next in current pack (counter only differs) |
| Progress | None | Pack-only progress bar (`completed of total`) |
