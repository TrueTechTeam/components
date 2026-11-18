# Building pages from data (`/app` templates)

How to turn **"what the page needs to do" plus a sample API response or schema** into a page
brief and then working page code built on the `/app` templates. Written for coding agents working
in an app that uses `@true-tech-team/ui-components`.

```ts
import { DataTablePage, DetailsPage, DashboardPage } from '@true-tech-team/ui-components/app';
```

The templates need `@tanstack/react-query` and the provider setup in
[plumbing.md](plumbing.md#app-plumb-7---provider-order-must) (`GlobalProvider` outside,
`AppProvider` inside).

## Workflow (follow in order)

1. **Collect the inputs.** You need the outline (who uses the page and what they do on it) and a
   sample response, JSON Schema, OpenAPI schema or TypeScript type for the data. If you have no data
   sample or schema, ask for one. Don't invent field names.
2. **Fill the page brief.** Copy the empty template in [page-brief.md](page-brief.md) and fill
   every field. Put the brief in your plan or PR description, and list open questions instead of
   guessing.
3. **Choose the template.** Use [choosing-a-page.md](choosing-a-page.md) (`APP-*`).
4. **Map every field.** Use [field-display.md](field-display.md) (`FIELD-*`) to pick a `FieldKind`
   and a placement (column, summary, detail-only or hidden).
5. **Arrange the page.** Use [hierarchy.md](hierarchy.md) (`HIER-*`) for priority, actions, tabs
   and progressive disclosure.
6. **Cover every state.** Use [states.md](states.md) (`APP-STATE-*`).
7. **Wire the plumbing.** Use [plumbing.md](plumbing.md) (`APP-PLUMB-*`) for URL state, polling,
   permissions, mutation feedback and Next.js.
8. **Write the code.** [example.md](example.md) shows a whole run, from outline to code, for a
   marketing "campaigns" list and details page.

Cite rule IDs in the brief, in code comments where a choice isn't obvious, and in the PR.

## Template exports

| Export                                                         | Use for                                                                                       |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `AppShell`                                                     | The app frame, once per app: Navbar, sidebar, `main`, skip link, mobile nav (`NavItem[]`)     |
| `PageHeader`, `usePageTab`, `getPageTabId`                     | Title, status, breadcrumbs, actions and URL-bound tabs on a custom page                       |
| `FieldValue`, `fieldAlign`, `isEmptyFieldValue`                | Render one value by `FieldKind`; alignment; "is there anything to show"                       |
| `DataTablePage`, `useTableState`                               | Many records: search, filters, sort, pagination, views, row actions, detail panel/dialog/page |
| `DetailsPage`                                                  | One record: header, key facts, URL-bound tabs, main and side columns                          |
| `DashboardPage`, `KpiWidget`, `ChartWidget`, `DashboardWidget` | Numbers over a time range (`useTimeRange`), each widget with its own states                   |
| `PropertyList`, `KeyFacts`                                     | Label and value pairs of one record (`FieldDef[]`)                                            |
| `ActivityTimeline`, `Notes`, `MediaGallery`, `RelatedRecords`  | Related content on a details page or in a detail panel                                        |

All templates are built on `Page`, `Section` and `Loadable`. Their structure renders while data
loads and only the data-dependent parts show skeletons
([states.md](states.md#app-state-1---structure-first-loading-must)).

## Done checklist

- [ ] The brief is filled, and every field in the sample is mapped or listed as hidden with a
      reason (`FIELD-6`).
- [ ] The template choice cites an `APP-*` rule.
- [ ] Visible table columns ≤ 7, and the first column names the record (`FIELD-7`).
- [ ] One primary action per page (`HIER-2`).
- [ ] Every state in the matrix for this template is handled (`APP-STATE-2`).
- [ ] Query data is read only inside `Loadable` function children, block `data`/`query` props or
      with `?.` (`APP-STATE-1`).
- [ ] Paginated and filtered queries use the template (which sets `keepPreviousData`) or pass
      `placeholderData: keepPreviousData` themselves (`APP-PLUMB-3`).
- [ ] Permission checks hide what the user can never do (`APP-PLUMB-5`).
- [ ] The decision-tree final review ([../decision-tree.md](../decision-tree.md#7-final-review-run-before-you-finish-any-ui-task))
      passes.
