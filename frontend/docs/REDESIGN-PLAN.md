# RemindMe — Redesign Implementation Plan

How to move the app to the new "warm paper" design. Each step below is sized to be **one task / one branch** and ends with a "Done when" check.

**Design source:** the Claude Design canvas "RemindMe Home". Board names are quoted in `"…"` below.
**Related docs:** [WIREFRAMES.md](WIREFRAMES.md) · [TECH_STACK.md](TECH_STACK.md) · [ARCHITECTURE.md](ARCHITECTURE.md) · [PLAYER.md](PLAYER.md)

---

## 1. Scope

| In scope | Design boards |
|----------|---------------|
| Styleguide across the whole app (tokens, fonts, buttons, fields, lists, cards) | "Styleguide" |
| Home page — guest | "Main page day (not logged in user)" |
| Home page — logged in | "main page, logged in" |
| Categories, Topics and Entities list pages | "Styleguide" → *Entity list* (the three pages share one row pattern) |
| Constructor page, incl. new hover placeholders in the content area | "Constructor · colourful" |
| Player page with all block templates | "Player · List", "Player · Text + Code + Code (hidden)", "Player · Text + Text + Link" |

### Limitations (agreed)

- **Score logic is not implemented.** Drops per day, total drops and the tree stage are **placeholder values** (a random number). No API, no persistence.
- **Sun:** always render **gradation 2** ("Sun · 3 gradations", middle card). Gradations 1 and 3 came with score logic (score task 5): logged-in users now see the gradation of their level.
- **No night design** ("Main page night" is out of scope).
- **Other pages are skipped:** About, Feedback, Changelog, Email template, Auth pages, Player recall mode (proposal). The footer with their links is skipped too.
- **Image block is skipped** on Constructor and Player: keep the current Image editor/preview and template button exactly as they are today (they only pick up new global tokens automatically).

---

## 2. Design tokens (reference for Step 1)

### Base

| Token | Hex | Use |
|-------|-----|-----|
| `background` | `#F8F4ED` | Page background ("warm paper") |
| `card` / `surface` | `#FFFDF8` | Cards, panels, header buttons |
| `border` | `#E9E1D4` | Card and control borders |
| `input-border` | `#DCD2C3` | Text fields, switch off-state |
| `foreground` | `#2E2620` | Main text |
| `muted-foreground` | `#6E6257` | Secondary text |
| `accent` (brand) | `#A65D45` · hover `#7A3F2C` · soft `#F2E1D8` | Brand: links, eyebrow labels, primary CTA on Home, pack progress |

### Action colours (colourful scheme)

| Role | Default | Hover | Disabled | Used for |
|------|---------|-------|----------|----------|
| **Positive** (green) | bg `#50833C`, white text, shadow `0 6px 16px rgba(94,154,71,.25)` | `#41752D` | `#C3DBB6` | Done, Save, switch on (`#6FAE52`) |
| **Secondary** (light blue) | bg `#EEF5FB`, border `#C9DDF0`, text `#2F5F8F` | bg `#E3EEF8`, border `#A9C8E6` | — | Skip, Preview |
| **Reveal** (solid blue) | bg `#3F72A6`, white text | `#2F5F8F` | — | "Show answer" / "Show code" style actions |
| **Stop** (soft coral) | bg `#FDEDE8`, border `#F5CBBF`, text `#AA4733` | bg `#FBE0D8`, border `#EFB3A3` | — | Stop in Player |
| **Delete** (soft red) | bg `#F7E3DF`, text `#A33F33` | bg `#F4D6D0` | — | Destructive triggers (still confirmed by `AlertDialog`) |

### Block-type colours (icon tile = soft bg + strong fg)

| Block | Fg | Soft bg | Notes |
|-------|----|---------|-------|
| Text | `#6E6257` | `#EFEAE2` | neutral grey |
| Code | `#6C55A3` | `#ECE6F6` | code surface `#F7F4FC`, border `#E4DCF2` |
| List | `#4C8A35` | `#E6F2DC` | Player table headers use blue (see Step 9) |
| Link | `#3F72A6` | `#E3EEF8` | link card bg `#F4F8FC`, border `#C9DDF0` |
| Image | — | — | unchanged (out of scope) |

### Entity-list icon buttons ("Styleguide" → *Entity list*)

| Button | Default | Row hover | Button hover |
|--------|---------|-----------|--------------|
| Play | `#F8EDE7` | `#EFD6CA` | `#E6C3B2` |
| Edit | `#F4EFE7` | `#E9E0D2` | `#DDD1BF` |
| Remove | `#FBEEEB` | `#F4D6D0` | `#ECC0B7` |

Markers: Needs edit `#8FB0D6`, To remove `#E39A8E`, Hidden from Player `#C9BDAE`.

### Illustration and chart colours

- Tree: outline `#3E1F15`, trunk `#6B3A28`, leaf `#7DBA5E` / `#95CC72`, apple `#D8443A`, soil `#8A5A3C`, ground `#EADFCB`.
- Drop `#6FA8D6`; watering can `#A9A39B` (opening `#857E75`).
- Sun gradation 2: rings `r300 #F6D98A 10%`, `r210 #F6D98A 16%`, `r130 #F4CF72 28%`, `r70 #F2C95C 65%`, anchored to the top-left corner of the viewport.
- Charts: revised `#A65D45`, skipped `#C9963F`, time in Player `#5E9A47`, grid `#EFE6DA`, axis `#E2D8CA`. Player timer ring `#6FA8D6` on `#E3EEF8`.

### Typography and shape

- Headings: **Fraunces** (500), body: **Figtree** (400/500/600). Replaces Inter.
- Eyebrow labels: 13px, 600, `letter-spacing: .12em`, uppercase, accent colour.
- Radius: pills `999px`; cards `20–24px`; rows `16px`; fields `12px`; icon tiles `8–10px`.
- Layout stays on the 1024px `PageContainer`; Player content column 760px (808px incl. padding).

---

## 3. Implementation steps

### Step 1 — Tokens and fonts

- `src/index.css`: replace the current shadcn palette with the tokens from §2 (map them to the existing shadcn variables: `--background`, `--card`, `--foreground`, `--muted-foreground`, `--border`, `--input`, `--primary` = accent, `--destructive`, `--chart-*`, `--radius`). Add new semantic variables + `@theme inline` colours: `positive`, `info` (secondary blue), `reveal`, `stop`, `block-text|code|list|link` (fg + soft), `marker-*`, `tree-*`, `drop`.
- Fonts: install `@fontsource-variable/fraunces` and `@fontsource-variable/figtree`; set `--font-sans` (Figtree) and `--font-heading` (Fraunces); remove the Inter imports and dependency.
- Remove the empty `prefers-color-scheme: dark` block (night design is out of scope).

**Done when:** `npm run ci` is green and every existing page renders on the warm paper background with the new fonts (no layout changes yet).

### Step 2 — Buttons and form controls

- `components/ui/button.tsx`: variants `default` (accent), `positive`, `secondary` (light blue), `reveal`, `stop`, `outline` (neutral surface pill), `ghost`, `destructive` (soft red), `link`. Sizes: `default` 44px, `lg` 52px, `xl` 62px (Home CTA), `icon` 40px round. All buttons are pills.
- Replace the ad-hoc `softBlue` variant with `secondary`. Leave `defaultEditorBtn` / `selectedEditorBtn` (inside block editors) untouched.
- Restyle `switch` (on = positive green `#6FAE52`, off = `#DCD2C3`), `input`, `textarea`, `select`, `popover`, `dialog`, `alert-dialog`, `tooltip`, `breadcrumb`, `progress` with the tokens.

**Done when:** `npm run ci` is green; Storybook-free check: a temporary dev route or the existing `/frontend` page shows every variant and matches "Styleguide" → *Buttons* and *Text fields*.

### Step 3 — Brand components and app shell

Create `src/components/brand/` (used by several features):

- `SproutLogo` — the 26px logo mark + "RemindMe" wordmark (Fraunces 22px).
- `SunGlow` — absolutely positioned SVG, `gradation?: 1 | 2 | 3` prop; draws gradations 1–3, default `2` (score task 5).
- `TreeIllustration` — `stage: 1..6` (Sprout, Seedling, Sapling, Leaves, Blossom, Apples) from "Tree · 6 growth stages". SVGs inlined as React components.
- `DropIcon`, `WateringCan` (grey can from "main page, logged in").

App shell:

- `AppHeader`: logo left; right side "Log in" pill (guest) or user menu pill with initial avatar (soft accent circle) + email + chevron.
- **No footer for now** (decision §5.1): footer links (Send feedback, About, version/Changelog) are skipped until those pages exist.
- Put `SunGlow` behind the header in the app layouts (`__root` / `_app` route layout) so every page gets it.

**Done when:** `npm run ci` is green; header, logo and sun match "Main page day (not logged in user)" at 1280px.

### Step 4 — Placeholder score

- `src/features/score/placeholder.ts`: `getPlaceholderScore()` returns `{ totalDrops, earnedToday, maxPerDay: 3 }` with a random `totalDrops` (0–15) and `earnedToday` (0–3), stable for the session (generate once, keep in module scope).
- `getTreeStage(totalDrops)` → `1..6` using the provisional day ranges (1 / 2–3 / 4–5 / 6–8 / 9–11 / 12–15).
- Mark the file clearly as temporary (`// TODO(score): replace with API`), add a line to `docs/agile/known-issues.md`.

**Done when:** a unit test for `getTreeStage` passes in `npm run test`.

### Step 5 — Home page, guest

Board: "Main page day (not logged in user)".

- Hero, centred: eyebrow "A few minutes a day", H1 "Remember what you've learned." (Fraunces 54px), subtitle (23px muted, max 640px), CTA "See how it works" (accent, `xl`).
- "Grow your tree" section: title + one-line explanation + 3 cards using `TreeIllustration` stages 1, 4, 6 (labels Sprout · Day 1, Leaves · Days 6–10, Apples · Days 11–15).
- CTA target: no tour exists yet — the button opens the login dialog (decision §5.2).

**Done when:** `npm run ci` is green and the page matches the board at 1280px.

### Step 6 — Home page, logged in

Board: "main page, logged in" (fits 1280×800 without scrolling).

- Tree card (grid: illustration · text · CTA): `TreeIllustration` for the placeholder stage + grey `WateringCan` with one drop; title "Your tree · {stage name}", "{n} drops", hint "Come back tomorrow to earn up to 3 more drops." (all from Step 4); inline library stats (categories · topics · entities, real data from `useLibraryStats`) separated by thin dividers; CTA "Open my categories" (accent, 56px).
- Two chart cards side by side: Daily activity (stacked bars revised/skipped) and Time in Player (area + dashed 30-min goal line). Restyle `DailyActivityChart` / `PlayerTimeChart` (Recharts) with the chart tokens, uppercase captions, big Fraunces numbers.
- Keep month navigation from `ActivityMonthNav` but style it as small pills.

**Done when:** `npm run ci` is green; at 1280×800 the page has no vertical scroll and matches the board.

### Step 7 — Categories, Topics, Entities list pages

Reference: "Styleguide" → *Entity list*. The three pages share one layout, so build shared pieces first.

- `components/shared/ListRow.tsx`: card row (16px radius, `#FFFDF8`, border `#E9E1D4`), title link (16px, 600; accent on hover) + meta line (13px muted), right side: markers, "{n} revised" count, visibility switch, round icon buttons Play / Edit / Remove with the three-level colours from §2 (default → row hover → button hover). Hidden rows: dashed border, paper background, muted title.
- Page header: breadcrumbs (muted, current item bold), page title (Fraunces), primary action (Add category/topic/entity) on the right; search field and pagination restyled.
- Apply to `CategoryCard`, `TopicCard`, `EntityCard` (or replace them with `ListRow`), plus empty states and Add/Edit popovers.
- Remove still uses `AlertDialog` (unchanged behaviour).

**Done when:** `npm run ci` is green; all three pages share `ListRow` and match the Styleguide rows (default, hover, hidden).

### Step 8 — Constructor

Board: "Constructor · colourful".

- Header: breadcrumbs left; "Back" (outline) and "Save" (positive) right.
- Templates panel (`EntityTemplatesPanel`): "Shown in the Player" switch (green), divider, "Add a block" title + hint, template buttons with coloured icon tiles — Text grey, Code lavender, List green, Link blue (Image unchanged); hovered template button gets a stronger border, shadow and a "+" icon. Blocks counter "3 / 20" with a thin bar (gradient `#6FA8D6 → #7DBA5E`). "Preview" button = `secondary`.
- **Content area hover placeholders** (new): while a template is hovered (`onHoverTemplate`), show a dashed card (`1.5px dashed #D8C6B4`, bg `#FCF9F3`, 16px radius) at the insertion point with a coloured icon tile (28px) + "A {type} block will be added here" and a neutral skeleton:
  - Text — three grey lines;
  - Code — tinted code panel with short coloured bars;
  - List — 2 × 3 grid of rounded cells;
  - Link — row with a square icon + two lines;
  - Image — keep today's behaviour.
- Existing block editors keep their behaviour; only chrome (`BlockChrome`, `BlockPreviewChrome`) is restyled with tokens.

**Done when:** `npm run ci` is green; hovering each template (except Image) shows the matching placeholder, and leaving removes it.

### Step 9 — Player with all templates

Boards: "Player · List", "Player · Text + Code + Code (hidden)", "Player · Text + Text + Link".

- Top bar: title "Player"; **no streak chip** (decision §5.3); timer pill with blue progress ring "12:40 of 30 min" (`PlayerTimer`); "Stop" (`stop` variant).
- Pack progress (`PlayerProgress`): "{n} of {total}" + "{k} left in this pack", segmented bar: done = accent `#A65D45`, current = `#E3B7A5`, upcoming = `#EFE6DA`.
- Card (`PlayerPreview`): 24px radius, soft shadow; muted "Category › Topic" line (`PlayerEntityBreadcrumb`) and marker pills (Needs edit / To remove) on top; title Fraunces 40px.
- Block previews:
  - **Text** (`TextBlockPreview`): 18px / 1.65 body; inline highlights such as formulas use a soft paper chip.
  - **Code** (`CodeBlockPreview`): lavender panel with a header bar (file label left, language right), monospace 15px, syntax colours (keyword `#6C55A3`, string `#3D7A2B`, number `#B04A34`, function `#3F72A6`, comment `#716895`; string, number and comment darkened for AA). When `blurredByDefault`: blur the code, header hint "Hidden until you reveal it", centred white pill "Show code" (lavender text) over it; click reveals.
  - **List** (`ListBlockPreview`): two-column table, header cells blue (`#3F72A6` on `#EEF5FB`), borders `#DCE8F4`.
  - **Link** (`LinkBlockPreview`): blue card — icon tile, title, URL (`#2F5F8F`, darkened for AA), arrow icon.
  - **Image**: unchanged.
- Actions (`PlayerActions`): "Skip" (`secondary`, 52px, min 160px) and "Done" (`positive`, 52px, min 200px); shortcuts hint with `kbd` chips.
- Restyle `PlayerBatchCompleteDialog` and `PlayerDepleted` with the same tokens.

- No yellow example note under the List table (decision §5.4); no recall mode (decision §5.5).

**Done when:** `npm run ci` is green; seeded entities covering Text, Code (visible and hidden), List and Link render like the three boards (without the streak chip and the example note).

### Step 10 — Docs and cleanup

- Update `WIREFRAMES.md` (Home, list pages, Constructor, Player), `TECH_STACK.md` (fonts, button variants, brand components) and `PRODUCT.md` (Home sections, placeholder score).
- Remove unused colours/variants and Inter.
- Add a line per finished step to `docs/agile/progress.md`; record decisions (placeholder score, sun gradation 2 only, Image skipped) in `docs/agile/decisions.md`.

**Done when:** `npm run ci` is green and docs mention no Inter, no `softBlue`, no old palette.

---

## 4. Order and parallel work

```
Step 1 ─► Step 2 ─► Step 3 ─┬─► Step 5
                            ├─► Step 6  (needs Step 4)
            Step 4 ─────────┤
                            ├─► Step 7
                            ├─► Step 8
                            └─► Step 9
                                         └─► Step 10
```

Steps 5, 7, 8 and 9 touch different features and can run in parallel after Step 3. Step 4 is independent and can run any time before Step 6.

---

## 5. Decisions (answered open questions)

1. **Footer links** — skipped. No footer is rendered until Feedback, About and Changelog pages are implemented.
2. **"See how it works" (guest Home)** — opens the login dialog until a tour exists.
3. **Streak chip in Player** — replaced by the next-drop chip (`NextDropChip`) beside the timer: "Next drop in N min", or "3/3 today" at the daily cap. It comes with score logic.
4. **Yellow example note** under the table in "Player · List" — dropped for now.
5. **Recall mode** ("Player · recall mode (proposal)") — skipped for now; the "Shown in the Player" switch stays the only entity-level toggle in the Constructor panel.
