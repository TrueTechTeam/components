# Choosing a Page

Pick the template from the **shape of the data** and the **user's main task**, then configure it.
All templates come from `@true-tech-team/ui-components/app`.

## APP-1 - Decision tree

```
Q: What does the user mostly do on this page?
├─ Find one record among many, compare records, act on rows
│   └─ (data: an array, usually paginated with a total) ............ → DataTablePage   APP-2, APP-3
├─ Understand or work on ONE record that has a lot of related content
│   └─ (data: one object with nested objects or arrays, sub-resources) → DetailsPage   APP-4
├─ Monitor numbers, spot change over time, decide where to look next
│   └─ (data: aggregates, time series, counts by period) ............ → DashboardPage   APP-5
├─ Create or edit one record
│   └─ (data: a schema of writable fields) .......................... → form page       APP-6
├─ Change preferences that apply right away ......................... → settings page   APP-7
└─ None of these, or a mix ........................................... → custom page     APP-8
```

- A one-record page with 1–2 screens of fields and no related lists can be a form page in
  read mode or a `DetailsPage` with one tab. Use `DetailsPage` when the user mostly reads, and a
  form when they mostly edit.
- A list where each item is "just a link" to a full record still uses `DataTablePage` with
  `detail.mode: 'page'` (`APP-3`).
- Don't build a dashboard to show one list. A dashboard answers "how are we doing?" with numbers.
  A list answers "which ones?".

Why: users recognise these page types across apps (Jakob's law, `PAGE-2`). Choosing by task
first keeps the page focused on the job it exists for.

## APP-2 - Configure `DataTablePage`

| Prop                             | Rule                                                                                                                                                                                   |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `columns`                        | `DataTableColumn<T>[]` (a `FieldDef` plus `sortable`). ≤ 7 visible, the identifying column first (`FIELD-7`). The first column is also the row's name in labels and the detail trigger |
| `columns[].sortable`             | Only for keys the **server** sorts by. The template keeps the server's row order                                                                                                       |
| `defaultSort`                    | The order users expect on arrival (newest first, ending soonest). Must be a sortable key                                                                                               |
| `queryOptions(state)`            | Returns `UseQueryOptions<{ rows, total }>`. Map the response envelope here. Key it on the fields that change the result only (`APP-PLUMB-3`)                                           |
| `views`                          | Per `DATA-1`: `['table']` to compare attributes (default); add `'grid'` for visual items (images) with `renderCard`; `'list'` for items with 1–3 attributes. The first is the default  |
| `filters`                        | `FilterDefinition[]` (main entry) for the fields users narrow by (`DATA-4`). Enum → `select` / `multi-select`; date → `date-range`; amount → `number-range`                            |
| `searchable`                     | Leave on when the server supports text search; set `false` when it doesn't (a search box that does nothing is worse than none)                                                         |
| `pageSizes`                      | `[10, 25, 50]` by default. Use `[25, 50, 100]` for dense back-office lists (`DATA-5`). The first is the default                                                                        |
| `create`                         | The page's primary action and the "nothing yet" action. Leave it out when the user can't create (`APP-PLUMB-5`)                                                                        |
| `rowActions`                     | `RowAction<T>[]` in the row's overflow menu. `danger` + `confirm` for destructive actions; `permission` hides them; `success`/`error` set the toast text                               |
| `headerActions`                  | Secondary page actions (export, import). Never a second `primary` (`HIER-2`)                                                                                                           |
| `emptyTitle`, `emptyDescription` | The "nothing yet" copy: what this area is for (`STATE-3`)                                                                                                                              |
| `id`                             | A stable page id when the title is translated                                                                                                                                          |

## APP-3 - Detail mode: panel, dialog or page

```
Q: How does the user look at one record from the list?
├─ Quick look while staying in the list; detail fits in ~one column (≤ ~12 fields)
│   └─ detail.mode: 'panel' (default) ........ inline side panel ≥ 1024px, Dialog below that
├─ Detail is wide (a table, a chart) or a focused task, and the list needs its full width
│   └─ detail.mode: 'dialog'
├─ Detail has tabs, related lists or its own actions, or users bookmark records
│   └─ detail.mode: 'page' + fullPageHref ...... navigates to a DetailsPage
└─ Both a quick look AND a full page exist
    └─ 'panel' (or 'dialog') + fullPageHref ...... the panel shows an "Open full page" link
```

- The detail renders from the `?selected=` id, not from a row on the current page, so deep links
  work. `render(id)` must fetch the record by id.
- Use the **same query key** in the panel and the details page (`['campaigns', 'detail', id]`),
  so opening the full page shows cached data with no skeleton.
- The panel shows a summary (`PropertyList` with the summary fields). Save the full record for the
  details page (`HIER-4`).

Why: a side panel keeps the list context (the user's place, filters and selection) for quick
comparisons. A page suits records too rich for a panel (NN/g on master–detail).

## APP-4 - Configure `DetailsPage`

| Prop               | Rule                                                                                                                                                      |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `query`            | The record's `useQuery` result. It drives the page's loading, error and not-found states                                                                  |
| `title`, `status`  | Functions of the loaded record. `status` returns `{ label, tone }` with a `StatusTone` (`FIELD-10`)                                                       |
| `breadcrumbs`      | Shown with 3 or more levels only. The last crumb is the record (use `query.data?.name ?? 'Campaign'` while loading)                                       |
| `actions`          | `PageAction[]`: at most one `variant: 'primary'` (usually Edit), `permission` to hide, `href` for navigation                                              |
| `facts`            | 3–6 `FieldDef`s for the key facts strip (`HIER-6`). Don't repeat the status that the header shows                                                         |
| `tabs`             | `DetailsTab[]`. One tab renders no tab bar. Split per `HIER-5`. Put each tab's data in its own component so its query runs only when the tab opens        |
| `tabs[].layout`    | `'main-side'` (default): `side` is a second column from 1024px and stacks below it on smaller screens. `'single'` for wide content (timelines, galleries) |
| `tabs[].sideLabel` | The accessible name of the side column when the tab label doesn't describe it                                                                             |
| `notFound(error)`  | Return true for your API's "not found" error (a 404) so the page shows not-found instead of a generic error                                               |
| `id`               | Stable page id. Defaults to `'details'`; pass one per page type (`'campaign-details'`)                                                                    |

Inside tabs, compose blocks: `PropertyList` (fields of the record, pass `data={query.data}`),
`RelatedRecords` (≤ 5 child rows and "View all"), `ActivityTimeline`, `Notes`, `MediaGallery`, or
any `Section`.

## APP-5 - Configure `DashboardPage`

- First write down the **one decision** the dashboard supports (`PAGE-3`). The answer goes in
  `kpis` and `primary`.
- `kpis`: 3–5 `KpiWidget`s (`DATA-8`). Each takes `query`, `value: () => …` (called once loaded),
  `kind` to format a number, `delta: () => ({ value, direction, good })` and `hint` for the
  comparison period. Set `good` by meaning, not direction: lower churn is good.
- `primary`: one or two `ChartWidget`s, full width. Pass any chart element as children and a
  text `summary` (the chart's text alternative). Charts must not contain focusable controls.
- `secondary`: `DashboardWidget`s in a responsive grid. `activity`: an `ActivityTimeline` in a
  `DashboardWidget`.
- `ranges` / `defaultRange`: the periods users compare (`'7d' | '30d' | '90d'` by default; also
  `'24h'`, `'ytd'`). Widgets call `useTimeRange()` and put the range in their query keys.
- `queryKeyPrefix`: the shared first key segment (`['dashboard']`) turns on "Refresh all" and the
  page-level last-updated time.
- ≤ 7–9 widgets on the first screen. Split into tabs or another page beyond that (`PAGE-3`).

## APP-6 - Form page (create or edit)

- Build it from `Page` + `PageHeader` + `FormBuilder` with `guardUnsaved`, single column
  (`FORM-1`). Use a `Dialog` only for forms of ≤ ~6 fields (`PAGE-2`).
- Edit forms: load the record with `useQuery`, give `Page` the query (`queries={[record]}`) and
  render `FormBuilder` inside a `Loadable` with function children, so `defaultValues` exist
  before the form mounts.
- `onSubmit` calls the mutation (`useMutationFeedback(...).mutateAsync`), then navigates with
  `useAppNavigate()` to the record (toast feedback, `APP-PLUMB-6`). `guardUnsaved` doesn't block
  while a submit is in flight, so navigating after a save works.
- Server validation errors belong on the fields (`FORM-5`), not only in a toast.

## APP-7 - Settings page

- `Page` + `PageHeader` with `tabs` (read the selected one with `usePageTab(tabs)`) for
  categories, or `Section`s with headings on one page when there are ≤ ~4 groups.
- Instant-save controls (`Toggle`, `Select`, `RadioGroup`) with toast feedback; never mix them
  with a Save button in one section (`FORM-11`).

## APP-8 - Custom page

When no template fits, compose the same parts: `Page` (states, title, analytics) → `PageHeader`
(one `h1`, actions, tabs) → `Section`s or blocks, each with its own `queries`. Wrap data-dependent
pieces in `Loadable`. Don't fork a template's layout to change one region. Compose instead.

## APP-9 - `AppShell` (once per app)

- Render `AppShell` once, in the app layout around the routed pages, not inside each page.
- `nav`: ≤ 7 top-level `NavItem`s (`CHOOSE-NAV-1`). Use `children` for one level of
  sub-pages. Set `permission` to hide items the user can't open.
- `mobileNav: 'bottom'` when the app has 3–5 primary destinations used daily on phones
  (`CHOOSE-NAV-2`; set `mobile: false` on the rest). Otherwise use `'drawer'` (default).
- `headerActions` holds global controls (search, user menu), not page actions.
