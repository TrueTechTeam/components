# Page States

Every page and widget built on `/app` has the states in `STATE-1`: loading, empty, error,
partial and ideal. This file says which states each template needs, what is built in and what you
must supply. The general rules are in
[../patterns/feedback-states.md](../patterns/feedback-states.md) (`STATE-*`).

## APP-STATE-1 - Structure-first loading (MUST)

- While its queries are pending, a `Page` or `Section` **keeps rendering its children** (title,
  headings, labels, layout, actions) inside a disabled, `aria-busy` region. Only the
  data-dependent parts skeletonize (`STATE-2`). The templates and blocks already do this.
- In your own content, read query data **only** in one of these ways:
  - inside `Loadable` function children: `<Loadable shape="text">{() => c.data.name}</Loadable>`.
    The function runs only once the data has loaded;
  - by passing `data` or `query` to a block (`PropertyList data={campaign.data}`), which handles
    `undefined`;
  - with `?.` and a fallback (`campaign.data?.name ?? 'Campaign'`) for strings in props.
- A child that reads `query.data.x` directly throws while loading. The boundary catches it,
  shows a placeholder and retries once loading finishes. That is crash recovery (it logs an
  error and can flash), not a pattern to rely on.
- Pick the `Loadable shape` that matches the real content: `heading` for titles, `text` (with
  `lines`) for values and paragraphs, `table` (`rows`, `columns`) for tables, `card` for cards,
  `box` (`width`, `height`) for charts and images, `avatar` for avatars. Set `width` inside a row
  flex container.
- Use the `skeleton` prop (which replaces the whole body) only when the loaded layout is
  unknowable in advance.

Why: a page that keeps its structure while loading lets users orient themselves and start
reading before the data arrives, and it avoids layout shift (NN/g, Core Web Vitals CLS).

## APP-STATE-2 - State matrix (MUST)

✓ = built in. **You** = you supply something (copy, a callback or a prop). - = not applicable.

| Surface                                        | Loading                             | Nothing yet                                             | No results  | Error + Retry                        | Not found                                    | Forbidden                             | Refreshing                            | Partial / refetch error    |
| ---------------------------------------------- | ----------------------------------- | ------------------------------------------------------- | ----------- | ------------------------------------ | -------------------------------------------- | ------------------------------------- | ------------------------------------- | -------------------------- |
| `DataTablePage`                                | ✓ table skeleton                    | ✓ + **you**: `emptyTitle`, `emptyDescription`, `create` | ✓ Clear all | ✓ full page                          | - (a page past the end is clamped)           | **you** (`APP-STATE-5`)               | ✓ bar + `LastUpdated`                 | ✓ rows kept + inline alert |
| Detail panel / dialog (`detail.render`)        | **you**: a block with `query`       | -                                                       | -           | **you**: blocks with `query` give it | **you**: handle the 404 in the block's query | `permission` on the block's `Section` | ✓ via blocks                          | ✓ via blocks               |
| `DetailsPage`                                  | ✓ title, facts                      | -                                                       | -           | ✓ full page                          | **you**: `notFound(error)`                   | **you** (`APP-STATE-5`)               | ✓                                     | ✓                          |
| Blocks (`PropertyList`, `ActivityTimeline`, …) | ✓ (follow `query` or the Page)      | ✓ + **you**: `empty` copy                               | -           | ✓ with `query`                       | -                                            | `permission`                          | ✓ with `query`                        | ✓ with `query`             |
| `DashboardPage`                                | ✓ per widget                        | -                                                       | -           | ✓ per widget                         | -                                            | **you** (`APP-STATE-5`)               | ✓ "Refresh all" with `queryKeyPrefix` | ✓ per widget               |
| `KpiWidget`, `ChartWidget`, `DashboardWidget`  | ✓ value or body                     | **you**: `isEmpty` + `empty` (not `KpiWidget`)          | -           | ✓                                    | -                                            | `permission` (not `KpiWidget`)        | ✓                                     | ✓                          |
| Form page (`APP-6`)                            | **you**: `Loadable` around the form | -                                                       | -           | ✓ `Page queries`                     | **you**                                      | `Page permission`                     | -                                     | -                          |
| Custom `Section`                               | ✓ + **you**: `Loadable`s            | **you**: `isEmpty` + `empty`                            | **you**     | ✓                                    | **you**                                      | `permission`                          | ✓                                     | ✓                          |

## APP-STATE-3 - Nothing yet vs no results (MUST)

They are different states with different actions (`STATE-3`):

- **Nothing yet** (the collection is empty, no search or filters): say what the area is for and
  offer the create action. `DataTablePage` shows it when `total === 0` with no search or filters,
  using `emptyTitle`, `emptyDescription` and `create`. Write the copy in the user's terms ("No
  campaigns yet" / "Create a campaign to start reaching your audience").
- **No results** (search or filters matched nothing): `DataTablePage` shows it with a
  **Clear all** action that resets search, filters and page. Don't override it with the first-use
  copy.
- Blocks: give `empty={{ title, description }}` that names what is missing ("No assets yet").
- Never show an empty table header or an empty chart instead of an empty state.

## APP-STATE-4 - Errors with Retry

- A failed first load shows the error state with **Retry**, scoped to the smallest region that
  failed: the whole `Page` for the main query, the `Section` or widget for its own query
  (`STATE-4`). Give independent data its own `Section` or block `query` so one failure never
  blanks the page.
- The message is generic by default. Raw error messages can leak server details. Set
  `showErrorDetails` only when the API returns messages written for end users.
- The library logs render errors through `AppProvider logger`. Don't `console.error` them again.

## APP-STATE-5 - Forbidden

- Regions: `Section permission={{ action, subject }}` (and the block and widget props, which pass
  it through) shows the forbidden state in that region only.
- Whole template pages (`DataTablePage`, `DetailsPage`, `DashboardPage`) take no `permission`
  prop. Check first and render a `Page` in the forbidden state instead:

  ```tsx
  const canRead = useCan('read', 'campaign');
  if (!canRead) {
    return (
      <Page title="Campaigns" permission={{ action: 'read', subject: 'campaign' }}>
        {null}
      </Page>
    );
  }
  return <DataTablePage … />;
  ```

- Hide nav items, actions and row actions the user can never use with their `permission` field
  (`APP-PLUMB-5`). The forbidden state is for deep links, not for buttons the user could see.
- The server still enforces every permission. UI checks are for clarity, not security.

## APP-STATE-6 - Not found

- `DetailsPage`: pass `notFound={(error) => isNotFound(error)}` (for example
  `error instanceof ApiError && error.status === 404`). It shows the not-found state with a way
  back instead of an error with a Retry that can never succeed.
- Detail panels read `?selected=` from the URL, so a stale link can name a deleted record. The
  block's query error shows in the panel, and the list stays usable.
- A `?page=` past the last page is clamped to the last page by `DataTablePage`. Don't handle it
  yourself.

## APP-STATE-7 - Refreshing and stale data

- A background refetch keeps the content and shows a thin refreshing bar. The templates show
  `LastUpdated` ("Updated 2 minutes ago" with refresh) in the toolbar.
- Paginated and filtered queries keep the previous rows while the next page loads
  (`keepPreviousData`, `APP-PLUMB-3`). `DataTablePage` does this for you, and shows a skeleton
  instead of a misleading "nothing yet" while an empty previous result stands in.
- Data already in the cache shows no skeleton. Share query keys between panel and page (`APP-3`)
  to get this for free.

## APP-STATE-8 - Partial data and refetch errors

- When a **background refetch** fails and the last data is still there, `Page` and `Section` keep
  the content and show a compact inline alert with Retry above it. Only a query with no data
  shows the full error state.
- On dashboards and details pages each widget or block is its own `Section`: one failing widget
  shows its own error and the rest keep working (`PAGE-3`).
- When part of a record is missing (null fields), that is not an error: `FieldValue` shows "—"
  (`FIELD-9`).

## APP-STATE-9 - Headings in every state (MUST)

- Each page has exactly one `h1`. The templates render it in `PageHeader`. When a full-page state
  (error, forbidden, empty, not found, crash) replaces a `Page`'s children, `Page` renders the
  title as a visually hidden `h1`. Don't add your own `h1` outside the `Page`.
- State messages inside a `Section` nest under its heading level automatically.

## APP-STATE-10 - Pending mutations

- Row actions disable their menu item while running and report the result with a toast.
- Buttons that start a mutation use `loading` on that button (`STATE-2`), not a page overlay.
- Forms keep the user's input on error and show field errors inline (`FORM-5`).
