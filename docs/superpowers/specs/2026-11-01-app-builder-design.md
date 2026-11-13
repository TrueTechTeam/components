# App Builder & Theme Builder: Design

Date: 2026-11-01 · Branch: `feat/app-builder` · Status: draft for approval

## 1. Intent

The owner builds web apps (software, graphic design and marketing work) on this library. The pain
is not writing code. It is deciding **how a page should be laid out and which components best show
the data**. They want to pick from proven page patterns, or have Claude pick one via the decision
tree, instead of designing every page from scratch. They also want the scaffolding every page
repeats (data fetching and caching, URL state, translation, logging, permissions, …) to come ready
made.

Separately, they want a **Theme Builder** at the top of Storybook that helps people find a brand
theme from a vague concept, or enter a known theme quickly, and download the `theme.json` that
`GlobalProvider` consumes.

### What success looks like

- The owner gives Claude a high-level outline of a page plus a sample API response or data schema.
  Claude returns (a) a short **page brief** (which template, why, with rule IDs; field → display
  mapping; states; URL state) and (b) working page code built on a template.
- Every template page has professional loading (layout-shaped skeleton), empty, error, no-results,
  no-permission and refreshing states with no extra work.
- An app can install the library and use **only components**, or **components + app builder**,
  without pulling app-builder dependencies into a components-only app.
- A designer or developer can produce a usable, contrast-checked `theme.json` in a few minutes,
  starting from either a mood or exact brand colors.

### Goals

- G1. Theme Builder Storybook page + `GlobalProvider` applying every `ThemeConfig` field.
- G2. A separate `app` entry point with page/section wrappers and plumbing built on established
  libraries.
- G3. Three polished templates (data table with details view, dashboard, details page) plus a shared
  app shell and page header.
- G4. Guidance: a new app-builder section in `guidelines/` covering page choice, data layout,
  hierarchy, states and plumbing, including a field-type → display mapping that works from a schema.
- G5. Housekeeping items carried in from the v1.3.0 release (§9).

### Non-goals

- No login/auth flows. The library consumes a user and permission rules; it never authenticates.
- No router of our own. No dependency on a specific framework.
- No chart library. Dashboard widgets accept any chart content (see §6.2).
- No create/edit **page template** this round (the guarded form component is in scope; the page
  template is a later round).
- Not building: keyboard shortcuts, command palette, offline/online banner.

### Anti-goals (would be a failure even if it works)

- Templates that are just nice layouts with no clear rules for when to use each one. The guidance
  is as important as the components.
- Templates that depend on another UI kit (Ant Design, MUI, …). Templates are built here from this
  library's components. Other systems may be studied, never imported.
- Reinventing solved plumbing. Data fetching and translation use established libraries.
- Forcing app-builder dependencies (TanStack Query, i18next, …) on components-only consumers.
- Locking consumers to Next.js or any single router.
- A Theme Builder that exports settings the provider then ignores.

## 2. Constraints

- Follow `CLAUDE.md`: SCSS modules + tokens, component folder structure, CSF3 stories with
  autodocs, React Testing Library, conventional commits, `lint`/`typecheck`/`test`/`build` all pass.
- Every new or changed component passes every MUST in
  `guidelines/contributing/component-checklist.md`. Cite rule IDs in commits/PRs.
- Update `guidelines/components/catalog.md`, `choosing.md`, and `foundations/tokens.md` when
  components or tokens are added. Tick items in `docs/design-audit.md` if any land.
- React 18 and 19 must both work (current peer range).
- Everything is client-only; the `'use client'` banner must also be on the new entry (§5.1).
- Published package name stays `@true-tech-team/react-components`; consumers import via the
  `@true-tech-team/ui-components` alias.

## 3. Delivery: three pieces, three PRs, in this order

| #   | Piece                        | Depends on | PR contents                             |
| --- | ---------------------------- | ---------- | --------------------------------------- |
| 1   | Theme Builder + provider fix | nothing    | §4, plus housekeeping §9                |
| 2   | App builder foundation       | nothing    | §5 (incl. core translatable text §5.1a) |
| 3   | Templates + guidance         | 2          | §6, §7                                  |

Each piece gets its own implementation plan. All three are on top of current `master`
(`85a4e17`, v1.3.0).

---

## 4. Piece 1: Theme Builder

### 4.1 Provider fix (prerequisite)

Today `GlobalProvider` only applies `themeConfig.theme.colors`
(`src/lib/providers/GlobalProvider/GlobalProvider.tsx`). It must apply **every** field of
`ThemeOverride`: `colors`, `spacing`, `typography` (font families, sizes, weights, line heights),
`borderRadius`, `shadows`. Map each to its existing CSS custom property (see
`styles/theme/_variables.scss` and `foundations/tokens.md` for names). Overrides must be removed
again when the config changes or the provider unmounts, so switching themes leaves no stale values.

New fields added for the builder (if any, e.g. `density`) must be added to `ThemeOverride`, wired
to tokens, and documented in `foundations/tokens.md`.

The exported JSON shape **is** `ThemeConfig` (`{ mode, theme: ThemeOverride }`), so it can be passed
straight to `<GlobalProvider themeConfig={json}>`.

**Light and dark:** the builder generates colors for both modes. `ThemeConfig` currently holds one
color set. Extend it with an optional per-mode color override (e.g. `theme.colorsDark` or
`theme.modes.{light,dark}.colors`; builder's choice of shape, must be backward compatible with
existing `theme.colors`), and have the provider apply the set matching the active mode.

### 4.2 Location

A Storybook docs/story page titled **"Theme Builder"**, sorted first in the sidebar (above
"Buttons"; update `storySort` in `.storybook/preview.tsx`). It is a Storybook-only tool: its code is
not exported from the package. Suggested home: `src/storybook/ThemeBuilder/` (or similar path
excluded from the library build and from `tsconfig.lib.json` emit). It runs entirely in the
browser; nothing is sent anywhere.

The page should render in a wide layout (not the default `centered` decorator).

### 4.3 Flow

```
Entry ── "✨ Help me find my theme" ──► Mood ► Hue & harmony ► Pick palette ──► Editor
      ├─ "🎯 I know my theme" ───────────────────────────────────────────────► Editor
      └─ "⬆ Load theme.json" ────────────────────────────────────────────────► Editor
```

- **No tabs.** Path is chosen once on the entry screen.
- **↺ Start over** is always visible in the top bar. It clears all saved builder progress and
  returns to the entry screen (confirm before clearing).
- Progress persists in `localStorage` so a refresh keeps the work (wrap access in try/catch).
- Guided steps have Back / Next and a step indicator.

**Help me path**

1. **Mood:** multi-select chips: Calm, Bold, Professional, Playful, Luxury, Techy, Earthy. Moods bias
   chroma, lightness, harmony choice, and also suggest Look & feel defaults (e.g. Playful → rounder
   radius; Professional → crisper, lower chroma).
2. **Hue & harmony:** a color wheel to pick a seed hue; harmony options Complementary, Analogous,
   Triadic, Split-complementary, Monochrome. Harmonies are hue rotations in OKLCH.
3. **Pick a palette:** 4–6 generated suggestions, each with a mini live preview; a 🎲 shuffle button
   regenerates. Choosing one continues to the editor.

**Editor** (both paths end here). Left: one scrolling panel of **collapsible sections**. Right: live
preview.

- **Colors:** primary and secondary inputs (accept hex / rgb / oklch). Auto-generated: 50–900 shade
  scales, hover/active/disabled variants, success/warning/error/info, backgrounds, surfaces, text,
  borders, input and control tokens, for light and dark. Each derived token is shown and can be
  overridden; overridden tokens are marked and can be reset to auto.
- **Typography:** font family (curated list of system/web-safe stacks plus a free-text field), type
  scale (base size + ratio), weights.
- **Shape & spacing:** corner radius (sharp → round), base spacing unit.
- **Depth & density:** shadow depth, density (compact / comfortable / spacious).

### 4.4 Preview and checks

- A small fake app built from **real library components**: Navbar, KPI tiles, buttons in each
  variant, a table with status Tags, a form with inputs, a Dialog trigger, an Alert.
- **Scoping (Claude's call):** the preview renders inside an **iframe** with its own document and
  its own `GlobalProvider`, fed the in-progress `ThemeConfig`. That keeps `:root[data-theme]`
  tokens, inline overrides and portalled overlays (Dialog, Toast) inside the preview without
  adding any public scoped-theming API. Scoped theming stays out of scope for 1.x.
- Light/dark switch on the preview.
- Contrast check on every change: each text/background and control pairing gets a WCAG AA badge.
  Failures are flagged with a suggested fix (nearest passing lightness in OKLCH).

### 4.5 Output

- Copy JSON, and download `theme.json`.
- A snippet showing usage:
  `import theme from './theme.json'; <GlobalProvider themeConfig={theme}>`.
- "Load theme.json" validates the file and reports unknown/invalid fields instead of failing
  silently.

### 4.6 Color generation

Generate in **OKLCH** (perceptually even lightness, so scales are uniform and contrast is
predictable). Converting to hex for output is required (the provider writes CSS variables; hex is
the widest-supported format). Color math lives in `src/lib/utils/colorUtils.ts` (extend it); the
builder may choose to implement OKLCH conversions directly or add a small dev dependency, but
**no new runtime dependency for the published library**.

---

## 5. Piece 2: App builder foundation

### 5.1 Packaging

- New entry point: `src/app/index.ts` → published as
  `@true-tech-team/ui-components/app`. Add it to `vite.config.ts` `build.lib.entry` (multi-entry),
  to `package.json` `exports` (with `types`, `import`, `require`), and make sure the `'use client'`
  banner applies to both entries.
- `src/index.ts` (components) must **not** import anything from `src/app`. App code may import
  components.
- Libraries used by the app entry are **optional peer dependencies** of the package
  (`peerDependenciesMeta: { optional: true }`), and are externalized in the Rollup config:
  - `@tanstack/react-query` (v5) — data fetching, caching, polling, mutations. **Required by the
    `/app` entry as a whole** (Claude's call): anyone using the app builder is using its data
    features, so `/app` imports it directly and its docs say "install `@tanstack/react-query` to
    use `/app`". Components-only apps never import `/app` and never need it.
  - i18n: **`/app` never imports `i18next` or `react-i18next`.** `AppProvider` accepts a
    translate function (`t: (key, opts) => string`, which an i18next instance's `t` satisfies) plus
    the current locale. Without one, English defaults are used. So i18n is truly optional with no
    import-time cost.
- Storybook: new top-level sidebar group **"App Builder"** (after the component groups) with
  sub-groups Foundation, Templates, Guides. The Storybook build installs the optional peers as dev
  dependencies.

### 5.1a Translatable text in core components (owner's decision)

Existing core components hard-code English (aria-labels and visible text in Dialog, Carousel,
DatePicker, DateRangePicker, Pagination, and others). Translated apps must not show stray English,
so PR 2 adds a **dependency-free strings mechanism to the core entry**:

- A core `LabelsProvider` (context) holding English defaults for every built-in string, keyed by
  component (e.g. `dialog.close`, `pagination.next`, `emptyState.title`), with interpolation for
  dynamic strings (`pagination.pageOf: "Page {page} of {total}"`).
- `GlobalProvider` accepts `labels` (partial overrides) and/or `translate(key, vars)`; `AppProvider`
  feeds its translate function into it automatically, so an i18next app gets core strings
  translated with no extra wiring.
- Every core component reads strings from the context instead of literals. Per-instance props that
  already set text (e.g. an explicit `aria-label`) keep winning.
- Audit all components for hard-coded user-facing strings (grep string literals in JSX text,
  `aria-label`, `title`, `placeholder` defaults) and convert them. List the keys in a new
  `guidelines/foundations/labels.md` (or a section in `tokens.md`) and export the defaults object
  so apps can build translation files from it.
- Tests: default English renders unchanged (no snapshot churn beyond intended), and overriding a
  key changes the rendered text/aria-label.

### 5.2 Router independence

The library ships **no router**. The app registers a small adapter once via `AppProvider`:

```ts
interface RouterAdapter {
  Link: React.ComponentType<{ href: string; children: React.ReactNode /* … */ }>;
  navigate(href: string, opts?: { replace?: boolean }): void;
  pathname: string;
  searchParams: URLSearchParams; // current
  setSearchParams(next: URLSearchParams, opts?: { replace?: boolean }): void;
  onBeforeNavigate?(cb: () => boolean): () => void; // for the unsaved-changes guard
}
```

Ship ready-made adapters for **Next.js App Router**, **React Router (v6/v7)**, and **plain browser
history** (default when none is given). Adapters for frameworks are separate small modules so their
imports don't leak (`/app/adapters/next`, `/app/adapters/react-router`).

**Unsaved-changes guard coverage (Claude's call).** Routers differ in what can be blocked, so the
guard is layered and each adapter declares what it supports:

- Always: tab close/reload (`beforeunload`), browser back/forward (history listener), Dialog
  close, and navigation through the library's `Link` and `navigate`.
- React Router: when a data router is present, the adapter uses `useBlocker` and also catches the
  app's own `navigate()` calls. Inside a plain `<BrowserRouter>` it falls back to the "always" set.
- Next.js App Router: no public blocking API, so the app's own `router.push` calls are **not**
  caught; everything in the "always" set still is. Documented on the guard's story and in the
  catalog. This is a limitation, not a Next-only feature, so no badge.

If a feature truly cannot work without a specific framework, it gets: a "Next.js only" badge in its
Storybook story, a note in its docs and catalog entry, and a `console.warn` in development when used
with another adapter. Goal is zero such features.

### 5.3 `AppProvider`

One provider for app-level config, placed inside (or composing) `GlobalProvider`:

- `router` adapter
- `queryClient` (TanStack Query; created with sensible defaults if not given)
- `i18n` (optional)
- `logger` (`{ debug, info, warn, error }`; default: console in development, silent in production)
- `analytics` (`track(event, props)`; default: no-op)
- `auth` (`{ user, can(action, subject) }`)
- `flags` (`{ isEnabled(flag) }`)
- `breakpoints` override (optional)

Each concern also has its own hook usable anywhere below the provider.

### 5.4 `Page` and `Section`

**`Page`** wraps one route.

- `title` (and optional `description`, `meta`): sets `document.title` and the page header title;
  breadcrumbs reuse it.
- `queries`: one or more TanStack Query results (or query options). Drives state:
  - pending → **layout-shaped skeleton** supplied by the template (or `skeleton` prop)
  - error → error state with retry (STATE-4)
  - empty (via `isEmpty(data)` predicate) → empty state (STATE-3)
  - background refetch → subtle refreshing indicator; content stays
  - no permission (via `permission` prop + `auth.can`) → no-permission state
- **Page store**: optional `reducer` + `initialState` creating a scoped `useReducer` + context;
  `usePageStore()` reads state and dispatch anywhere under the page. No extra library.
- Error boundary: crashes render the error state and are reported to `logger.error`.
- Analytics: emits a page-view event on mount (name derived from `title` or `analyticsName`).
- Dev debug panel: development-only, toggled by a small floating button or shortcut, shows page
  queries (status, last updated), page store state, URL params, recent log lines.

**`Section`** is the same contract for one region or widget (its own queries, states, error
boundary, refresh). One failing `Section` never blanks the page.

Library gap: there is no `EmptyState` or `ErrorState` component today (STATE-3/4 are prose). Add
both to `components/display` (core entry, since they are generally useful) and use them in
`Page`/`Section`.

### 5.5 Plumbing hooks and components

| Concern         | API (names are proposals)                                                                                                                                        | Notes                                                                                                                                                                                                              |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Data            | re-export nothing; consumers use TanStack Query directly                                                                                                         | `Page`/`Section` accept its results                                                                                                                                                                                |
| Live data       | per-query `refetchInterval`, `refetchOnWindowFocus`, `refetchOnReconnect`; `<LastUpdated>` + refresh button                                                      | configured in the query; no new abstraction                                                                                                                                                                        |
| Mutations       | `useMutationFeedback(mutation, { success, error, via: 'toast' \| 'inline' \| 'pageMessage' })`                                                                   | pending state, success/error messaging via existing Toast / Alert / PageMessages; optional optimistic helper                                                                                                       |
| URL state       | `usePageParams(schema)` typed params via the router adapter                                                                                                      | replaces/wraps existing `useUrlState` (keep `useUrlState` exported, mark deprecated if superseded)                                                                                                                 |
| Preferences     | `usePreference(key, default, { storage: 'url' \| 'local' })`                                                                                                     | URL by default (sort, filters, tab, page); local storage for non-shareable settings (column visibility, density). Local keys namespaced per page                                                                   |
| Auth            | `useAuth()`, `useCan(action, subject)`, `<Can>`                                                                                                                  | hide or disable (STATE-7 decides which)                                                                                                                                                                            |
| Flags           | `useFlag(name)`, `<Feature name>`                                                                                                                                |                                                                                                                                                                                                                    |
| Errors          | `<ErrorBoundary fallback onError>`                                                                                                                               | used inside Page/Section; also exported                                                                                                                                                                            |
| Translation     | `useAppTranslation()`                                                                                                                                            | uses the translate function passed to `AppProvider` (e.g. `i18n.t`); English defaults otherwise                                                                                                                    |
| Logging         | `useLogger(scope)`                                                                                                                                               |                                                                                                                                                                                                                    |
| Analytics       | `useTrack()`, `trackOnClick` helper                                                                                                                              |                                                                                                                                                                                                                    |
| Title/meta      | `usePageMeta({ title, description })`                                                                                                                            |                                                                                                                                                                                                                    |
| Unsaved changes | `useUnsavedChanges(isDirty, message?)`                                                                                                                           | blocks router navigation (adapter), browser back, tab close, Dialog close                                                                                                                                          |
| Guarded form    | `FormBuilder` option `guardUnsaved` (or `GuardedForm` wrapper)                                                                                                   | clears after successful submit                                                                                                                                                                                     |
| Responsive      | `useBreakpoint()`, `useBreakpointValue({ phone, tablet, laptop, desktop })`, SCSS `@include bp(tablet)`                                                          | **new tokens**: phone < 600, tablet 600–1023, laptop 1024–1439, desktop ≥ 1440 (builder may adjust; must keep the existing 769px nav collapse rule consistent; update PAGE-4)                                      |
| Formatters      | `formatDate`, `formatRelativeTime`, `formatNumber`, `formatCurrency`, `formatPercent`, `formatFileSize`, `formatList`; `useFormatters()` bound to current locale | built on `Intl`, zero dependencies; locale from `AppProvider` when given, else `navigator.language`. Pure functions go in core `utils` (useful without app builder); hook in app entry. Existing `dateUtils` stays |

The guarded form and formatters' pure functions belong to the **core** entry; everything that needs
`AppProvider` belongs to the **app** entry.

---

## 6. Piece 3: Templates

All templates are built from this library's components, live in the app entry, and expose slots so
pages fill content rather than fork layout. Each template supplies its own **layout-shaped
skeleton** for `Page`.

### 6.1 App shell + page header

- `AppShell`: Navbar, CollapsibleSidebar + SideNav, main landmark with skip link, mobile behavior
  per PAGE-1/PAGE-4 (BottomNavigation option). Sidebar collapsed state is a local preference.
- `PageHeader`: breadcrumbs (when ≥ 3 levels), title, optional status Tag, description, actions
  (primary rightmost; secondary overflow into a menu on mobile), optional Tabs bound to a URL param.

### 6.2 Data table with details view

```
PageHeader (title · "Create" primary · optional tabs)
Search + filters (existing filter system)
DataTable (or grid / list view; see guidance DATA-1)
Pagination
Detail: side panel (default) | dialog | navigate to details page — chosen per page
```

- Selected row, page, page size, sort, filters, search and view live in the URL (shareable).
- States: skeleton table; "nothing yet" empty state with the create action; "no results for these
  filters" with clear-filters; error with retry; refreshing indicator.
- Row actions use `useMutationFeedback`.
- Detail panel has an "Open full page" link to the details page; both read the same query key so
  data is not fetched twice.

### 6.3 Dashboard

```
PageHeader (title · time-range picker · LastUpdated + refresh)
KPI row (3–5)
Primary widget area (charts)
Secondary widgets in AdaptiveGrid
Recent activity
```

- Every widget is a `Section`: own title, time range or "as of", own loading/empty/error, own
  refresh/polling.
- **Charts:** no chart library is added. `ChartWidget` (or the generic widget) accepts any chart
  element as children. Storybook demos use simple inline SVG so Storybook needs no chart dependency.
- Guidance places what answers the dashboard's main decision at the top left (PAGE-3).

### 6.4 Details page

- Frame: PageHeader with breadcrumbs, title + status Tag, actions; **key-facts summary strip**;
  optional Tabs (URL-bound).
- Body layouts: main column + optional side column, or single column, per tab.
- Composable **blocks**, each a `Section` with its own states:
  `PropertyList` (label/value pairs, uses formatters), `RelatedRecords` (compact DataTable),
  `ActivityTimeline`, `MediaGallery` / attachments, `Notes`, and any custom content.

## 7. Guidance (ships with Piece 3)

New folder `guidelines/app/` (shipped in the package like the rest), linked from
`decision-tree.md` §1 with a new branch "Building a page from data → app/".

- **Page brief** (`app/page-brief.md`): the checklist Claude fills in before building: input is
  the user's outline + sample response or schema; output is template choice + rationale with rule
  IDs, field → display mapping, columns vs summary vs detail-only, required states, URL state,
  permissions, live-data settings.
- **Choosing a page** (`APP-*`): tree from data shape + user task to template + configuration.
  E.g. "many records, scan/compare, act on one" → data table with details view; "one record with
  much related content" → details page; "monitor numbers and spot change" → dashboard.
- **Field → display mapping** (`FIELD-*`): schema types to components/formatters (enum status →
  status Tag; ISO date → relative or absolute formatter; money → right-aligned currency; image URL
  → thumbnail; long text → detail-only; booleans; IDs; emails/URLs; arrays; nested objects).
- **Hierarchy** (`HIER-*`): top-left priority, primary vs secondary, above-the-fold budget, when to
  split into tabs, progressive disclosure (summary → panel → full page).
- **States** (`APP-STATE-*` or extend `STATE-*`): required matrix per page and widget.
- **Plumbing rules**: URL vs local storage vs page store; when to poll; permissions in UI (hide vs
  disable, STATE-7); mutation feedback channel choice.
- Update `components/catalog.md`, `components/choosing.md`, `guidelines/llms.txt` and `SKILL.md`
  for all new exports. Rule IDs follow the existing style.

## 8. Testing expectations

- Unit tests for color math (OKLCH round-trips, harmony rotations, contrast ratios), formatters,
  breakpoint hooks, preference storage, permission helpers.
- RTL tests for `Page`/`Section` state transitions (pending → skeleton, error → retry works, empty,
  no-permission, refreshing), error boundary reporting, unsaved-changes guard, router adapters
  (with a mocked adapter), templates' URL-state round trip.
- Provider test: every `ThemeConfig` field reaches its CSS variable and is removed on change.
- A test (or build check) that the core entry's output does not import `@tanstack/react-query` or
  `i18next`.
- Stories for every new component, template and the Theme Builder.

## 9. Housekeeping (rides in PR 1)

From the v1.3.0 release follow-ups (project memory `next-round-followups.md`; delete that memory
once these land):

1. `.github/workflows/pr.yml` and `publish.yml`: `actions/checkout@v4 → @v5`,
   `actions/setup-node@v4 → @v5`, `wagoid/commitlint-github-action@v4 → @v6`. Separate `ci:`
   commit.
2. `CHANGELOG.md` 1.3.0 entry: delete the trailing "closes [#00777e](…)" (a hex color parsed as an
   issue ref). Also fix the published v1.3.0 GitHub Release notes with `gh release edit v1.3.0`
   (owner approved).
3. `CLAUDE.md` "Commit Messages": note never to write a bare `#` + hex/digits in commit messages;
   write colors without the `#` (owner approved).
4. Add `.superpowers/` to `.gitignore`.

## 10. Decisions log

Owner's decisions:

- Plumbing uses established libraries (TanStack Query, react-i18next); templates are custom-built
  here and may resemble other systems but never depend on them.
- Not tied to any framework; if something must be, Next.js, clearly badged and documented.
- Plumbing in scope: auth/permissions, title/meta, unsaved-changes guard (optional), feature flags,
  error boundaries, mutation feedback (toast or other display), URL-first preferences with a hook,
  responsive breakpoint helpers, `Intl`-style formatters, query-configured polling/refresh.
  Out: keyboard shortcuts, command palette, offline awareness.
- Unsaved-changes guard also as a form variant.
- Templates: data table with details view, dashboard, details page (variable content).
- Claude's input for a page: high-level outline + sample response or schema.
- Theme Builder: entry choice "Help me" vs "I know my theme", no tabs, Start over clears local
  data, settings as collapsible stacked sections in the editor panel (option A).
- Order: Theme Builder → foundation → templates + guidance, as separate PRs.
- Translation covers existing hard-coded text in core components too (§5.1a, in PR 2).
- Housekeeping approved in full, including the CLAUDE.md note and the GitHub Release edit.

Claude's calls (owner may override):

- Router adapter pattern instead of shipping a router; adapters for Next.js, React Router, plain
  history.
- `/app` entry point with optional peer dependencies.
- `Page` store via `useReducer` + context, no state library.
- Formatters on `Intl`, zero dependencies; pure functions in core.
- Detail view defaults to side panel; dialog or full page per page.
- Create/edit page template deferred; guarded form ships now.
- No chart library; widgets accept any chart.
- OKLCH color generation; Theme Builder is Storybook-only, not exported.
- New `EmptyState` / `ErrorState` components in core.
- Breakpoint values (phone/tablet/laptop/desktop) proposed in §5.5.
- Theme Builder generates both light and dark; `ThemeConfig` extended for per-mode colors.
- TanStack Query required by all of `/app`; i18n via an injected translate function, no i18next
  import.
- Unsaved-changes guard is layered per router; Next.js programmatic navigation isn't caught.
- Theme Builder preview isolated in an iframe; no public scoped theming.

## 11. Left to the builder

Exact component/hook names and prop shapes beyond what's above; folder layout inside `src/app`;
the mood → palette heuristics; fonts in the curated list; skeleton visuals per template; debug panel
UI; how the per-mode color shape is spelled in `ThemeConfig` (must stay backward compatible).
