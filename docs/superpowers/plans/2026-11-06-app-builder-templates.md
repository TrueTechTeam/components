# App Builder Templates & Guidance (PR 3) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the three page templates (data table with details view, dashboard, details page),
the shared app shell and page header, composable detail blocks, and the page-building guidance that
lets Claude turn "outline + sample response/schema" into a page brief and working page.

**Architecture:** Everything lives in the `/app` entry (`src/app/templates/**`), built only from
this library's components plus the PR 2 plumbing (`Page`, `Section`, `Loadable`, `usePageParams`,
`useMutationFeedback`, `LastUpdated`, `AppLink`, formatters). Templates expose slots and config
rather than forking layout, and each supplies a layout-shaped skeleton through `Loadable`. A
`FieldValue` renderer implements the field → display mapping once and is reused by tables,
property lists and key facts. Guidance lands in `guidelines/app/`.

**Tech Stack:** React 18/19, TypeScript, TanStack Query v5, SCSS modules, Jest + RTL, Storybook 10.

**Spec:** `docs/superpowers/specs/2026-11-01-app-builder-design.md` §6–§7 (and §5 for the plumbing
these build on). Branch `feat/app-builder` (PR 1 + PR 2 + owner feedback already on it).

## Global Constraints

- Templates are built from this library's components only; no other UI kit; no chart library
  (dashboard charts are children; stories use inline SVG).
- All in `/app`; core (`src/lib`, `src/index.ts`) must not import `src/app` (lint enforced).
- Every data region is a `Page`/`Section` with built-in states; structure renders while loading and
  data-dependent parts use `Loadable` with matching shapes (owner requirement from feedback round 1).
- URL state for collection pages: selected row, page, page size, sort, filters, search, view.
  Use `usePageParams`; paginated queries use `placeholderData: keepPreviousData`.
- Built-in text via labels (`useLabels`), English defaults in `DEFAULT_LABELS` + `labels.md`.
- Responsive per PAGE-4 with the named breakpoints (`useBreakpoint`, SCSS `bp`): nav collapses
  below laptop (1024px); multi-column collapses to one column; no horizontal page scroll at 360px.
- Accessibility: one `<main>`, skip link, landmarks, heading order, keyboard reachable, focus ring
  (component checklist MUSTs).
- Update `guidelines/components/catalog.md` + `choosing.md` for every new export; tokens only.
- Commit messages: Conventional Commits; never `#` followed by hex or digits.

## Decisions made while planning (ledger as rulings)

- **T1** Detail side panel = an inline column on ≥ laptop (CSS grid, resizable not required) that
  becomes a `Dialog size="full"` below laptop. No new core Drawer component.
- **T2** Blocks (`PropertyList`, `KeyFacts`, `ActivityTimeline`, `MediaGallery`, `Notes`,
  `RelatedRecords`) each render a `Section` themselves and take `query?` (a TanStack result whose
  `data` feeds them) or direct `data`, plus pass-through Section props.
- **T3** Data fetching in `DataTablePage` is a `queryOptions(state) => UseQueryOptions<{ rows: T[];
total: number }>` prop; the template calls `useQuery` with `placeholderData: keepPreviousData`.
- **T4** `FieldValue` is the single implementation of the FIELD mapping (exported; reused by
  templates and usable in consumer columns).
- **T5** Template names: `AppShell`, `PageHeader`, `DataTablePage`, `DashboardPage`
  (+ `DashboardWidget`, `KpiWidget`, `ChartWidget`), `DetailsPage`.

## Review Focus

1. `?page=` beyond the last page (e.g. 99 when only 3 pages) or after a filter shrinks results →
   clamp to the last page (or 1), never show "nothing yet" for a non-empty collection → Task 5.
2. Empty collection vs no results for active search/filters → different states; "no results" offers
   clear-all that resets search + filters + page → Task 5.
3. Deep link `?selected=<id>` for a row not on the current page → detail still opens (rendered by id,
   not by row lookup) → Task 5.
4. Long titles and many actions at 360px width → title wraps, secondary actions move to an overflow
   `Menu`, primary stays visible, no horizontal scroll → Task 2.
5. `FieldValue` with `null`/`undefined`/invalid values (bad date string, NaN, unknown enum) → an
   em-dash placeholder with an accessible "Not set" label, never "Invalid Date"/"NaN" → Task 1.

---

## File Structure

```
src/app/templates/
  fields/FieldValue.tsx (+ .module.scss, .test.tsx)          Task 1
  PageHeader/ (PageHeader.tsx, .module.scss, .test.tsx)       Task 2
  AppShell/ (AppShell.tsx, .module.scss, .test.tsx)           Task 3
  blocks/ (PropertyList, KeyFacts, ActivityTimeline,
           MediaGallery, Notes, RelatedRecords + tests)        Task 4
  DataTablePage/ (DataTablePage.tsx, DetailView.tsx,
           useTableState.ts, .module.scss, tests)              Task 5
  DashboardPage/ (DashboardPage.tsx, DashboardWidget.tsx,
           KpiWidget.tsx, ChartWidget.tsx, tests)              Task 6
  DetailsPage/ (DetailsPage.tsx, .module.scss, tests)          Task 7
  index.ts (exported from src/app/index.ts)
guidelines/app/ (README.md, page-brief.md, choosing-a-page.md, field-display.md,
           hierarchy.md, states.md, plumbing.md, example.md)   Task 8
src/app/stories/templates/*.stories.tsx ('App Builder/Templates/…')
  + src/app/stories/guides/*.mdx ('App Builder/Guides/…')     Task 9
```

---

### Task 1: `FieldValue` — the field → display mapping

**Files:** `src/app/templates/fields/{FieldValue.tsx,FieldValue.module.scss,FieldValue.test.tsx,index.ts}`; export from `src/app/templates/index.ts` and `src/app/index.ts`.

**Interfaces — Produces:**

```ts
export type FieldKind =
  | 'text'
  | 'longText'
  | 'number'
  | 'currency'
  | 'percent'
  | 'date'
  | 'datetime'
  | 'relative'
  | 'boolean'
  | 'status'
  | 'email'
  | 'url'
  | 'phone'
  | 'id'
  | 'image'
  | 'fileSize'
  | 'list'
  | 'tags';
export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export interface FieldOptions {
  currency?: string; // currency (default 'USD')
  fractionDigits?: number;
  statusTones?: Record<string, StatusTone>; // status: value → tone; unknown → 'neutral'
  statusLabels?: Record<string, string>; // status: value → display text (default: humanized value)
  dateOptions?: Intl.DateTimeFormatOptions;
  truncate?: number; // longText: chars before ellipsis (title attr holds full)
  imageAlt?: string;
  imageSize?: number; // image: thumbnail px (default 40)
}
export interface FieldValueProps extends FieldOptions {
  kind: FieldKind;
  value: unknown;
  className?: string;
}
export function FieldValue(p: FieldValueProps): JSX.Element;
export function isEmptyFieldValue(kind: FieldKind, value: unknown): boolean;
export function fieldAlign(kind: FieldKind): 'start' | 'end'; // 'end' for number, currency, percent, fileSize
```

Rendering (exact): number/currency/percent/fileSize via `useFormatters()` + tabular numerals;
date `dateTime(value, { dateStyle: 'medium' })`, datetime `{ dateStyle: 'medium', timeStyle: 'short' }`,
relative `relativeTime` with a `<time dateTime title={absolute}>`; boolean → "Yes"/"No" labels
(`field.yes`/`field.no`); status → core `Tag`/`Badge` (whichever has tone variants — read the code) with
tone + text (never color-only); email `mailto:` link, url external link (`rel="noopener noreferrer"`,
host shown), phone `tel:`; id → mono, copy button (`useClipboard`, label `field.copy`); image → `<img>`
thumbnail (lazy, alt from `imageAlt` or empty decorative); list → `formatList`; tags → wrap of `Tag`s.
Empty/invalid (per `isEmptyFieldValue` or unparseable date / non-finite number) → `—` in a span with
visually-hidden label `field.empty` ("Not set").

- [ ] **Step 1: Failing tests** — one per kind (en-US): currency `1234.5`→`$1,234.50`; percent `0.256`
      (`fractionDigits: 1`) → `25.6%`; date ISO → `Jan 5, 2026`; relative shows text + `time[datetime]`;
      boolean true → `Yes`; status `'paid'` with tones `{paid:'success'}` → tag text `Paid`, tone success;
      url renders host and safe rel; id copy button calls clipboard; image lazy thumbnail; fieldAlign;
      Review Focus 5: `null`, `undefined`, `''`, `'not-a-date'` (date), `NaN` (number), unknown status →
      `—` with "Not set" (status unknown → neutral tag with humanized text, not empty).
- [ ] **Step 2–4:** FAIL → implement (labels added to `DEFAULT_LABELS` + `labels.md`) → PASS.
- [ ] **Step 5: Commit** `feat(app): add FieldValue to render schema fields consistently`

---

### Task 2: `PageHeader`

**Files:** `src/app/templates/PageHeader/*`.

**Interfaces — Consumes:** `usePageParams`, `param` (Task 8 PR 2), `AppLink`, core `Breadcrumbs`,
`Tabs`, `Tag`, `Button`, `Menu`/`Dropdown`, `useBreakpoint`, `Loadable`. **Produces:**

```ts
export interface PageAction {
  id: string;
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  permission?: { action: string; subject?: string };
}
export interface Crumb {
  label: string;
  href?: string;
}
export interface PageHeaderTab {
  value: string;
  label: string;
  badge?: ReactNode;
}
export interface PageHeaderProps {
  title: ReactNode; // ReactNode so callers can pass <Loadable shape="heading">
  description?: ReactNode;
  status?: { label: string; tone: StatusTone };
  breadcrumbs?: Crumb[]; // rendered only when ≥ 3 levels (PAGE-1); last = current page, not a link
  actions?: PageAction[]; // at most one 'primary', rendered rightmost
  tabs?: PageHeaderTab[];
  tabParam?: string; // default 'tab'; value in the URL via usePageParams; default first tab
  onTabChange?: (value: string) => void;
  headingLevel?: 1 | 2; // default 1
}
export function PageHeader(p: PageHeaderProps): JSX.Element;
export function usePageTab(tabs: PageHeaderTab[], tabParam?: string): [string, (v: string) => void];
```

Layout: title row (h1 + status Tag) left, actions right; description below; tabs at bottom of the
header. Below `tablet` (600px): actions other than the primary move into an overflow `Menu`
("More actions", label `pageHeader.moreActions`); the primary stays visible; title wraps.
Actions with `permission` hide when `useCan` is false (STATE-7: hide for no-permission). Unknown tab
in the URL → first tab.

- [ ] **Step 1: Failing tests**: breadcrumbs hidden for 2 levels, shown for 3 with last item `aria-current="page"`;
      primary action is last in DOM order; Review Focus 4 — at 360px (mock matchMedia) with 4 actions only
      the primary + "More actions" button render and the menu lists the rest; tabs read/write `?tab=`;
      `?tab=bogus` → first tab selected; permission-gated action hidden when `can` false; status tag text
      present.
- [ ] **Step 2–4:** FAIL → implement → PASS. **Step 5: Commit** `feat(app): add PageHeader with breadcrumbs, actions overflow and URL tabs`

---

### Task 3: `AppShell`

**Files:** `src/app/templates/AppShell/*`.

**Interfaces — Consumes:** core `Navbar` (+ parts), `CollapsibleSidebar`, `SideNav`,
`BottomNavigation`, `useBreakpoint`, `usePreference` (local), `useRouterAdapter`, `AppLink`, labels.
**Produces:**

```ts
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: ReactNode;
  badge?: ReactNode;
  children?: NavItem[];
  match?: 'exact' | 'prefix';
  permission?: { action: string; subject?: string };
  mobile?: boolean;
}
export interface AppShellProps {
  brand: ReactNode; // logo/name in Navbar
  nav: NavItem[]; // sidebar items
  headerActions?: ReactNode; // right side of Navbar (search, user menu…)
  mobileNav?: 'bottom' | 'drawer'; // default 'drawer' (NavbarToggle overlay); 'bottom' uses BottomNavigation for items with mobile !== false (max 5)
  children: ReactNode; // page content (a Page)
}
export function AppShell(p: AppShellProps): JSX.Element;
```

Behavior: skip link (label `appShell.skipToContent`) as the first focusable element targeting
`<main id="main-content" tabIndex={-1}>`; active item = pathname match (`prefix` default for items
with children, `exact` otherwise) with `aria-current="page"`; sidebar collapsed state persisted with
`usePreference('sidebarCollapsed', false, { storage: 'local' })` (page id `'app'`); below laptop the
sidebar is hidden and the mobile nav appears; permission-gated items hidden.

- [ ] **Step 1: Failing tests**: skip link first and moves focus to main; exactly one `main`; active
      item by pathname (exact vs prefix); collapse toggle persists across remount (localStorage);
      below laptop (mock) sidebar hidden and drawer toggle shown, with `mobileNav="bottom"` BottomNavigation
      shows ≤ 5 items; permission-gated item hidden.
- [ ] **Step 2–4:** FAIL → implement → PASS. **Step 5: Commit** `feat(app): add AppShell with responsive navigation and skip link`

---

### Task 4: Detail blocks

**Files:** `src/app/templates/blocks/{PropertyList,KeyFacts,ActivityTimeline,MediaGallery,Notes,RelatedRecords}.tsx` (+ shared `blocks.module.scss`, tests).

**Interfaces — Consumes:** `Section`, `SectionProps`, `Loadable`, `FieldValue`/`FieldKind`/`FieldOptions`
(Task 1), core `Card`, `List`, `Avatar`, `Textarea`, `Button`, `DataTable`, `AdaptiveGrid`.
**Produces** (T2: each renders `<Section {...sectionProps}>`; `data` wins over `query?.data`):

```ts
type BlockSectionProps = Omit<SectionProps, 'children' | 'queries'> & { query?: QueryLike };
export interface FieldDef<T> extends FieldOptions {
  key: keyof T & string;
  label: string;
  kind: FieldKind;
  get?: (row: T) => unknown;
  span?: 1 | 2;
}
export function PropertyList<T>(
  p: BlockSectionProps & { fields: FieldDef<T>[]; data?: T; columns?: 1 | 2 }
): JSX.Element; // <dl>; skeleton: label+value line pairs
export function KeyFacts<T>(
  p: BlockSectionProps & { fields: FieldDef<T>[]; data?: T }
): JSX.Element; // horizontal strip of 3–6 facts, wraps; skeleton: boxes
export interface ActivityItem {
  id: string;
  at: string | Date;
  actor?: { name: string; avatarUrl?: string };
  text: ReactNode;
  icon?: ReactNode;
}
export function ActivityTimeline(
  p: BlockSectionProps & { items?: ActivityItem[]; limit?: number }
): JSX.Element; // ordered list, newest first, relative times; "Show all" when > limit (label)
export interface MediaItem {
  id: string;
  src: string;
  alt: string;
  name?: string;
  size?: number;
  href?: string;
}
export function MediaGallery(p: BlockSectionProps & { items?: MediaItem[] }): JSX.Element; // AdaptiveGrid of Card thumbnails; name + fileSize; skeleton: box grid
export interface NoteItem {
  id: string;
  author: string;
  at: string | Date;
  body: string;
}
export function Notes(
  p: BlockSectionProps & {
    items?: NoteItem[];
    onAdd?: (body: string) => Promise<void> | void;
    canAdd?: boolean;
  }
): JSX.Element; // list + add form (Textarea + Button) using useMutationFeedback(via 'inline'); empty body disabled
export function RelatedRecords<T>(
  p: BlockSectionProps & {
    rows?: T[];
    columns: FieldDef<T>[];
    rowHref?: (row: T) => string;
    total?: number;
    viewAllHref?: string;
  }
): JSX.Element; // compact DataTable, ≤ 5 rows, "View all (N)" AppLink
```

Each block: empty state via Section `isEmpty` (items/rows empty, or all fields empty for
PropertyList), skeleton shaped like its content via `Loadable` (using the Section's own pending state
when `query` is given).

- [ ] **Step 1: Failing tests**: each block renders data; each shows its shaped skeleton while
      `query.isPending` (assert skeleton count/shape, e.g. PropertyList 4 fields → 4 label/value pairs);
      each shows the Section empty state for empty data; PropertyList uses FieldValue (currency formatted);
      RelatedRecords caps at 5 rows and shows "View all (12)"; Notes add posts trimmed body, disabled when
      empty, shows inline success; ActivityTimeline newest first with "Show all" beyond `limit`.
- [ ] **Step 2–4:** FAIL → implement → PASS. **Step 5: Commit** `feat(app): add detail blocks for properties, facts, activity, media, notes and related records`

---

### Task 5: `DataTablePage` (data table with details view)

**Files:** `src/app/templates/DataTablePage/{DataTablePage.tsx,DetailView.tsx,useTableState.ts,DataTablePage.module.scss}` (+ tests).

**Interfaces — Consumes:** `Page`, `PageHeader` (Task 2), `FieldValue`/`FieldDef` (Tasks 1/4),
`usePageParams`, `param`, `useMutationFeedback`, `LastUpdated`, `Loadable`, core `DataTable`
(server mode, controlled sort/selection; read its types), filter system types (`FilterDefinition`,
`FilterValue`), `Pagination`, `ButtonToggleGroup`, `Dialog`, `Menu`, `useBreakpoint`.
**Produces:**

```ts
export interface TableState {
  page: number;
  pageSize: number;
  sort?: { key: string; direction: 'asc' | 'desc' };
  search: string;
  filters: Record<string, FilterValue>;
  view: 'table' | 'grid' | 'list';
  selected: string | null;
}
export function useTableState(opts?: {
  defaultPageSize?: number;
  defaultSort?: TableState['sort'];
  views?: TableState['view'][];
}): [TableState, (patch: Partial<TableState>) => void];
// URL params: page, size, sort ("key:asc"), q, f (JSON-encoded filters via a custom codec), view, selected.
// Changing search/filters/sort/size resets page to 1.
export interface RowAction<T> {
  id: string;
  label: string;
  danger?: boolean;
  confirm?: string;
  run: (row: T) => Promise<unknown>;
  success?: string;
  error?: string;
  permission?: { action: string; subject?: string };
}
export interface DataTablePageProps<T> {
  title: string;
  description?: ReactNode;
  breadcrumbs?: Crumb[];
  headerActions?: PageAction[];
  create?: { label: string; onClick?: () => void; href?: string }; // header primary + empty-state action
  columns: FieldDef<T>[]; // rendered with FieldValue, align by fieldAlign
  rowKey: (row: T) => string;
  queryOptions: (state: TableState) => UseQueryOptions<{ rows: T[]; total: number }>; // T3
  filters?: FilterDefinition[];
  searchable?: boolean; // default true
  views?: Array<'table' | 'grid' | 'list'>;
  renderCard?: (row: T) => ReactNode; // grid/list use renderCard
  rowActions?: RowAction<T>[];
  detail?: {
    mode?: 'panel' | 'dialog' | 'page';
    title?: (id: string) => ReactNode;
    render: (id: string, ctx: { close: () => void }) => ReactNode;
    fullPageHref?: (id: string) => string;
  };
  pageSizes?: number[]; // default [10, 25, 50]
  emptyTitle?: string;
  emptyDescription?: string;
  id?: string;
}
export function DataTablePage<T>(p: DataTablePageProps<T>): JSX.Element;
```

Behavior:

- Layout: `PageHeader` (title, create = primary action) → toolbar (search Input, filters via the
  existing filter components, view toggle, `LastUpdated`) → content (DataTable | card grid | list) →
  Pagination (with page-size Select). Uses `useQuery({ ...queryOptions(state), placeholderData: keepPreviousData })`.
- Loading: toolbar and header render immediately (disabled controls); content uses
  `<Loadable shape="table" rows={pageSize capped at 10} columns={columns.length}>`.
- States: error → Page error with retry; total 0 with no search/filters → "nothing yet" empty with the
  create action (labels `dataTablePage.emptyTitle/Description` or props); total 0 with active
  search/filters → "No results" with **Clear all** resetting q, f and page (Review Focus 2);
  refreshing indicator from Page.
- Review Focus 1: when `total > 0` and `page > lastPage`, replace `page` with `lastPage` (no
  "nothing yet" flash); when `total === 0`, page resets to 1.
- Detail (T1): clicking a row (or Enter on a focused row) sets `selected`; mode `panel` (default) shows
  an inline side column (`grid-template-columns: minmax(0,1fr) minmax(320px, 40%)` ≥ laptop) with title,
  close button (label `dataTablePage.closeDetail`), optional "Open full page" `AppLink`
  (`fullPageHref`); below laptop or mode `dialog` → `Dialog size="full"|"lg"`; mode `page` → navigate to
  `fullPageHref(id)`. Detail renders from the `selected` id via `detail.render(id)` (Review Focus 3).
  Escape closes; focus returns to the row.
- Row actions: a `Menu` per row ("Row actions" label); `confirm` → `window.confirm`; `run` executed
  through `useMutation` + `useMutationFeedback` (toast) with success/error text; invalidates the
  table query on success; permission-gated actions hidden.

- [ ] **Step 1: Failing tests** (real QueryClient, browser router, fake fetcher):

```ts
it('renders header and toolbar while loading with a table-shaped skeleton', () => {});
it('writes page, size, sort, search, filters and view to the URL and restores them on mount', () => {});
it('resets page to 1 when search or filters change', () => {});
it('clamps ?page=99 to the last page instead of showing an empty state', () => {}); // RF1
it('shows "nothing yet" with the create action for an empty collection', () => {});
it('shows "No results" with Clear all when search/filters match nothing; Clear all resets them', () => {}); // RF2
it('opens the detail panel from a row click, writes ?selected=, closes with Escape and restores focus', () => {});
it('opens the detail from a deep link ?selected=<id> even when the row is not on the page', () => {}); // RF3
it('uses a full-screen dialog for details below laptop', () => {});
it('runs a row action with confirm and shows a success toast, then refetches', () => {});
it('grid view renders renderCard for each row', () => {});
```

- [ ] **Step 2–4:** FAIL → implement → PASS.
- [ ] **Step 5: Commit** `feat(app): add DataTablePage template with URL state and details view`

---

### Task 6: `DashboardPage`

**Files:** `src/app/templates/DashboardPage/{DashboardPage.tsx,DashboardWidget.tsx,KpiWidget.tsx,ChartWidget.tsx,DashboardPage.module.scss}` (+ tests).

**Interfaces — Consumes:** `Page`, `Section`, `PageHeader`, `LastUpdated`, `Loadable`, `usePageParams`,
`FieldValue`, core `KPI` (read props), `AdaptiveGrid`, `ButtonToggleGroup`, `useQueryClient`.
**Produces:**

```ts
export type TimeRange = '24h' | '7d' | '30d' | '90d' | 'ytd';
export function useTimeRange(def?: TimeRange): [TimeRange, (r: TimeRange) => void]; // URL param 'range'
export interface DashboardPageProps {
  title: string;
  description?: ReactNode;
  actions?: PageAction[];
  ranges?: TimeRange[]; // default ['7d', '30d', '90d']; header ButtonToggleGroup (label dashboard.range)
  defaultRange?: TimeRange; // default '30d'
  kpis?: ReactNode; // KpiWidgets (3–5)
  primary?: ReactNode; // main widget(s), full width
  secondary?: ReactNode; // widgets in AdaptiveGrid minItemWidth 300
  activity?: ReactNode; // recent activity (e.g. ActivityTimeline)
  queryKeyPrefix?: QueryKey; // "Refresh all" invalidates queries with this prefix
  id?: string;
}
export function DashboardPage(p: DashboardPageProps): JSX.Element;
export interface DashboardWidgetProps extends Omit<SectionProps, 'queries'> {
  title: string;
  query?: QueryLike;
  asOf?: Date | number; // header shows LastUpdated(query) or "As of …"
  action?: ReactNode;
  size?: 'md' | 'lg';
  children: ReactNode;
}
export function DashboardWidget(p: DashboardWidgetProps): JSX.Element; // Card + Section with own states
export function KpiWidget(p: {
  label: string;
  query?: QueryLike;
  value: () => ReactNode;
  delta?: () => { value: number; direction: 'up' | 'down'; good?: boolean };
  kind?: FieldKind;
  hint?: string;
}): JSX.Element; // KPI tile; Loadable card skeleton
export function ChartWidget(
  p: DashboardWidgetProps & { height?: number; summary: string }
): JSX.Element; // children = any chart; `summary` is the accessible text alternative (rendered visually hidden + figcaption)
```

Layout per spec §6.3: header (title, range toggle, "Refresh all" button + aggregate last-updated) →
KPI row (`AdaptiveGrid minItemWidth=200`, 3–5) → primary → secondary grid → activity. Every widget is a
`Section` (own loading/empty/error/refresh); one failing widget never blanks others.

- [ ] **Step 1: Failing tests**: range writes/reads `?range=`, unknown range → default; "Refresh all"
      invalidates only queries under `queryKeyPrefix`; a failing widget shows its own error while siblings
      render; KpiWidget skeleton while pending then value + delta (delta text not color-only: "▲ 12%" with
      sr text "up"); ChartWidget exposes `summary` as accessible text; widget header shows LastUpdated.
- [ ] **Step 2–4:** FAIL → implement → PASS.
- [ ] **Step 5: Commit** `feat(app): add DashboardPage template with KPI, chart and widget sections`

---

### Task 7: `DetailsPage`

**Files:** `src/app/templates/DetailsPage/{DetailsPage.tsx,DetailsPage.module.scss}` (+ tests).

**Interfaces — Consumes:** `Page`, `PageHeader`, `usePageTab` (Task 2), `KeyFacts`, blocks (Task 4),
`Loadable`. **Produces:**

```ts
export interface DetailsTab {
  value: string;
  label: string;
  layout?: 'main-side' | 'single'; // default 'main-side'
  main: ReactNode;
  side?: ReactNode;
}
export interface DetailsPageProps<T> {
  query: QueryLike & { data?: T }; // the record; page-level loading/error/empty(404) come from it
  title: (record: T) => string; // rendered through Loadable heading while pending
  breadcrumbs?: Crumb[];
  status?: (record: T) => { label: string; tone: StatusTone } | undefined;
  actions?: PageAction[];
  facts?: FieldDef<T>[]; // KeyFacts strip under the header
  tabs: DetailsTab[]; // 1 tab → no tab bar
  notFound?: (error: unknown) => boolean; // when true → PageMessages notFound instead of error
  id?: string;
}
export function DetailsPage<T>(p: DetailsPageProps<T>): JSX.Element;
```

Layout: header → key facts strip → tab bar (URL-bound via `usePageTab`) → body. `main-side`: two
columns ≥ laptop (`minmax(0,2fr) minmax(280px,1fr)`), side stacks below main otherwise. Document
title uses the loaded record title (falls back to a generic label while pending).

- [ ] **Step 1: Failing tests**: header + facts + tabs structure renders while pending with a heading
      skeleton; loaded title in h1 and document.title; tab switching via URL; single tab hides the tab bar;
      `main-side` stacks below laptop (class/attribute assertion); `notFound` predicate shows not-found state.
- [ ] **Step 2–4:** FAIL → implement → PASS.
- [ ] **Step 5: Commit** `feat(app): add DetailsPage template with key facts, tabs and side column`

---

### Task 8: Page-building guidance (`guidelines/app/`)

**Files:** create `guidelines/app/{README.md,page-brief.md,choosing-a-page.md,field-display.md,hierarchy.md,states.md,plumbing.md,example.md}`;
modify `guidelines/decision-tree.md` (§1 branch "Building a page from data → app/"), `guidelines/README.md`,
`guidelines/llms.txt`, `guidelines/SKILL.md`, `guidelines/components/catalog.md` + `choosing.md`
(every Task 1–7 export), `README.md` (Templates section).

Content requirements (written for coding agents, rule IDs in the existing style, each rule with a
one-line rationale and the component/prop to use):

- `page-brief.md`: the brief template Claude fills before building. Inputs: outline + sample response
  or schema. Output fields: template + rationale with rule IDs; field → display table (field, kind,
  where: column / summary / detail-only / hidden, FieldValue options); required states; URL state;
  permissions; live data (refetchInterval etc.); open questions. Include an empty template block.
- `choosing-a-page.md` (`APP-1…`): decision tree from data shape + user task → `DataTablePage` /
  `DetailsPage` / `DashboardPage` / form page (FormBuilder guardUnsaved) / settings, with
  configuration hints (detail mode panel vs dialog vs page; views table/grid/list per DATA-1).
- `field-display.md` (`FIELD-1…`): schema/type → `FieldKind` mapping table (string enum → status;
  ISO date/datetime; money → currency right-aligned; ids; emails/urls/phones; image URLs → image;
  long text → detail-only longText; booleans; arrays → list/tags; nested objects → detail section or
  PropertyList; numbers vs counts vs percents; file sizes), how to infer from JSON samples and JSON
  Schema/TypeScript types, column-count budget (≤ 7 visible columns on laptop, priorities).
- `hierarchy.md` (`HIER-1…`): top-left priority, one primary action, above-the-fold budget,
  progressive disclosure (table row → panel → full page), when to split into tabs (> 2 screens or
  distinct tasks), summary strip ≤ 6 facts.
- `states.md` (`APP-STATE-1…`): required state matrix per template and widget (structure-first
  loading with Loadable shapes, nothing-yet vs no-results, error with retry, forbidden, not-found,
  refreshing, partial/refetch error), linking STATE-\*.
- `plumbing.md` (`APP-PLUMB-1…`): URL vs local preference vs page store; polling intervals by data
  freshness; keepPreviousData for paginated/filter queries; permissions hide vs disable (STATE-7);
  mutation feedback toast vs inline; provider order; Next.js notes (Suspense for param readers, guard
  limits).
- `example.md`: one worked example end to end — a marketing "campaigns" outline + sample JSON
  response → filled page brief → resulting `DataTablePage` + `DetailsPage` code.

- [ ] **Step 1:** Write the docs. **Step 2:** Verify every component/prop name mentioned exists
      (grep `src/app/index.ts` and core barrels) and every rule ID referenced exists; Prettier-clean.
- [ ] **Step 3: Commit** `docs(app): add page-building guidance for templates, fields, hierarchy and states`

---

### Task 9: Template stories, guides in Storybook, and verification

**Files:** `src/app/stories/templates/{AppShell,PageHeader,DataTablePage,DashboardPage,DetailsPage,Blocks,FieldValue}.stories.tsx`
titled `App Builder/Templates/<Name>`; `src/app/stories/guides/{Overview,PageBrief}.mdx` titled
`App Builder/Guides/<Name>` (render the guidance with links); reuse `storyHelpers` (`StoryApp`,
`StoryFrame`…).

Story content (realistic data from the owner's domains — software, graphic design, marketing):

- `DataTablePage`: "Projects" (software: issues/releases) with filters, search, row actions, detail
  panel; "Assets" (design) in grid view with thumbnails (inline SVG placeholders); stories for
  Loading, Empty (nothing yet), No results, Error, Detail panel open (deep link), Mobile (dialog).
- `DashboardPage`: "Campaign performance" (marketing) with 4 KPIs, an inline-SVG line chart,
  secondary widgets (one failing story variant), activity.
- `DetailsPage`: "Campaign" or "Release" record with facts, tabs (Overview/Activity/Files), side
  column with PropertyList; Loading and Not found stories.
- `AppShell`: full app frame wrapping a DataTablePage, desktop and mobile (bottom nav) stories.
- `Blocks`, `FieldValue` (every kind in a table, incl. empty/invalid values), `PageHeader` (breadcrumbs,
  status, overflow at 360px).
  Use `layout: 'fullscreen'` and `globalDecorators: 'provider'`; fetchers via `wait()` with controls
  for delay/failure/empty.

- [ ] **Step 1:** Stories + guides.
- [ ] **Step 2: Visual verification (required):** build Storybook, screenshot every `app-builder-templates-*`
      and `app-builder-guides-*` story and docs page in light and dark (and the mobile stories at 390×844),
      look at each, iterate until polished (centered, consistent spacing, no overflow, readable contrast).
      Method: `npx http-server dist/storybook -p 6125 -s` in background; Chrome headless with an isolated
      `--user-data-dir` under the session scratchpad and `timeout 20` per page (never kill Chrome processes
      you didn't start). Scratch: C:/Users/bbjdt/AppData/Local/Temp/claude/c--Users-bbjdt-Documents-Web-ui-components/88e12611-da5f-4f75-ac8c-1a41ca2f6296/scratchpad/templates
- [ ] **Step 3: CI checks:** `npm run lint && npm run typecheck && npx jest && npm run build && npm run storybook:build`; full jest twice (no flakes).
- [ ] **Step 4: Commit** `docs(app): add template stories and page-building guides to Storybook`
