# Data Display

## DATA-1 - Table vs List vs Cards

| Question                                                                                       | Use                                                                        |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Users compare values **across** items, sort or scan columns (≥ 3 attributes)                   | `DataTable` (with filters, search, pagination) or `Table` (presentational) |
| Items have a primary label plus 1–3 secondary attributes and maybe actions                     | `List`                                                                     |
| Items are visual or heterogeneous (images, previews, rich summaries), browse more than compare | `Card`s in `AdaptiveGrid`                                                  |
| Items are a workflow by status                                                                 | `KanbanBoard`                                                              |
| One key number                                                                                 | `KPI`                                                                      |

Don't use cards for data users need to compare. Comparing across cards forces eye movement and
memory (NN/g). On mobile, a table with more than ~4 columns SHOULD switch to a List or card
representation, or pin the first column (`stickyFirstColumn`) and scroll horizontally.

## DATA-2 - DataTable vs Table

- `DataTable` (patterns): the batteries-included choice for real data: search, filters derived
  from columns, sorting, selection, pagination, client or server `mode`, URL sync. **Start here**
  for admin and CRUD screens.
- `Table` (display): lower-level presentational table for static or small data, or when you need
  full control.

## DATA-3 - Table design rules

- **Alignment:** text left-aligned. Numbers (quantities, money, percentages, durations)
  right-aligned, header included. Identifiers that look numeric (IDs, ZIP, phone) stay left-aligned
  (Carbon, Material). Use `tabular-nums`.
- **Header:** short, sentence-case labels. Units go in the header ("Revenue (USD)"), not repeated
  in every cell. Use `stickyHeader` when the table scrolls.
- **Density:** `size="sm"` for expert, data-heavy tools; `md` default; `lg` only when rows hold two
  lines. Header height matches row height.
- **Row separation:** horizontal dividers (`default`) or zebra (`striped`), not both. Vertical
  borders (`bordered`) only for spreadsheet-like data.
- **Columns:** put the most important or identifying column first. Limit columns to what users act
  on. Hide or move secondary details into `expandedRowRender` or a detail view.
- **Empty cells:** show "-" (em dash) and a tooltip if absence is meaningful. Never leave a cell
  silently blank.
- **Row actions:** 1–2 inline ghost IconButtons, the rest in an overflow menu (CHOOSE-ACTION-6). A
  clickable row (`onRowClick`) must also offer a real link or button for keyboard and screen-reader
  users.
- **Selection:** a checkbox column plus a bulk-action bar that appears when ≥ 1 row is selected.
  State the selection count ("3 selected").
- **Caption:** give every table a `caption` (it can be `captionHidden`) for screen readers.

## DATA-4 - Filtering & search

- Fewer than ~5 filters → `FilterBar` above the data. 5–15 → `FilterSidebar` (desktop) or
  `FilterModal` (mobile). Use `FilterPopover` to keep a toolbar compact.
- Always show active filters (`ActiveFilters`, rendered as removable Chips) with a "Clear all"
  control.
- Show the result count, and update it as filters change.
- Search: debounce (~300ms), keep the query visible, and highlight matches when practical.
- No results after filtering → a "No results" empty state that names the filters and offers "Clear
  filters" (not the first-use empty state).
- Use `syncFiltersWithUrl` / `useUrlState` so filtered views can be shared and back/forward works.

## DATA-5 - Pagination

See CHOOSE-NAV-6. Default page sizes are 10/25/50/100. Show "1–25 of 312". Keep the user's page
size preference. Server-side `mode="server"` when the data has more than ~1,000 rows.

## DATA-6 - Lists

- Each item: a primary line (`--theme-text-primary`) plus an optional secondary line
  (`--theme-text-secondary`, `--font-size-sm`). A leading visual (Avatar or Icon) is optional, and
  trailing meta or actions are optional.
- Keep item height consistent within a list. Use `ListGroup` with headers for categories, and
  `ListSearch` for lists with more than ~20 items.

## DATA-7 - Cards

- One card = one entity or one topic. Use a clear title, at most ~3 pieces of supporting info, and
  at most 2 actions.
- A fully clickable card (`interactive`) navigates to one place. It MUST NOT contain other
  clickable elements, except as explicitly separate buttons that stop propagation.
- `variant`: `outlined` (default, lists of cards), `elevated` (draws attention, featured),
  `filled` (subtle grouping inside a surface). Use one variant per grid.

## DATA-8 - KPIs and dashboards

- Each KPI has a label (`title`), a value, a comparison (`change` + `changeType` + period in
  `subtitle`, e.g. "vs last month") and, optionally, a trend sparkline.
- Put 3–5 KPIs in the top row and the most important first. More than 6 dilutes attention.
- Change color follows the meaning, not the direction: a cost going up is bad (red) even though
  it's "up". Always include the arrow or sign.
- Show units and the time range. Abbreviate large numbers and give the exact value on hover.
- Charts: pick the chart by the question being asked (comparison → bar, trend → line, part-of-whole
  with ≤ 5 parts → stacked bar, distribution → histogram). Avoid pie charts with more than 5 slices,
  3D and dual axes.

## DATA-9 - Drag and drop

Use it only when ordering or moving is the core task (`SortableList`, `SortableGrid`,
`KanbanBoard`, `ResizablePanels`). Always provide a visible `DragHandle`, a keyboard alternative
(the dnd components support keyboard sorting) and a non-drag alternative for moving between
containers (a "Move to…" menu). This satisfies WCAG 2.5.7 Dragging Movements.

## DATA-10 - Long text and overflow

- `OverflowText` for single-line truncation with full text on hover and focus. Never truncate
  data users must read to tell items apart.
- `TruncatedList` for "A, B, C +4 more".
- Wrap long content rather than truncating it in detail views.
