# Page Brief

Fill this brief **before** writing page code. It turns the user's outline and a data sample into
decisions you can check against the rules. Put the filled brief in your plan or PR description.
[example.md](example.md#2-the-filled-brief) shows a filled one.

## Inputs

| Input                | What you need                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Outline**          | Who uses the page, what they come to do (find, compare, act, monitor, edit), how often, and on what device                            |
| **Data sample**      | One real response (with a list envelope and `total`, if paginated), or a JSON Schema, OpenAPI schema or TypeScript type               |
| **Endpoints**        | List, detail and mutation endpoints, and which query params the server supports (search, sort keys, filters, page and size, `fields`) |
| **Permissions**      | Which roles can see the page and which can run each action                                                                            |
| **Freshness**        | How quickly the data changes and whether users watch it change                                                                        |
| **Related surfaces** | Other pages this one links to or from (details page, create form, dashboard)                                                          |

If the sample or the endpoints are missing, ask for them. Never invent field names, enum values or
sort keys. Write what you still don't know under **Open questions**.

## Brief fields

1. **Template and rationale.** The template (`DataTablePage`, `DetailsPage`, `DashboardPage`, form
   page, settings or custom), its configuration (views, detail mode, tabs, ranges), and the rule
   IDs that led there (`APP-*`, `DATA-1`, `HIER-*`).
2. **Field → display table.** One row for **every** field in the sample, including nested ones:

   | Column        | Content                                                                     |
   | ------------- | --------------------------------------------------------------------------- |
   | Field         | Path in the response (`owner.name`, `budget_cents`)                         |
   | Kind          | `FieldKind` (`FIELD-2`), plus `get` when the value needs converting         |
   | Where         | `column` / `summary` (key facts, panel) / `detail-only` / `hidden` (reason) |
   | Options       | `FieldOptions`: `currency`, `fractionDigits`, `statusTones`, `truncate`…    |
   | Sort / filter | Sortable on the server? A filter type (`FilterDefinition.type`)?            |

3. **Required states.** The rows of the [states.md](states.md) matrix that apply, with the copy
   for the empty states (nothing yet, no results) and the not-found condition.
4. **URL state.** What lives in the URL (`APP-PLUMB-1`). The templates already cover page, size,
   sort, search, filters, view, selected record, tab and range. List anything extra.
5. **Permissions.** For the page and for each action and nav item: the `{ action, subject }`
   check, and whether it hides or disables the control (`APP-PLUMB-5`).
6. **Live data.** `refetchInterval` per query (`APP-PLUMB-2`), `staleTime` when it differs from
   the 30s default, and what gets invalidated after each mutation (`APP-PLUMB-4`).
7. **Mutations.** Each action, its feedback channel (toast or inline, `APP-PLUMB-6`), whether it
   needs a confirmation (`CHOOSE-FEEDBACK-1`), and whether it is optimistic (`STATE-6`).
8. **Open questions.** Everything you assumed. Ask about these before shipping.

## Empty template

Copy this block and fill it.

```md
## Page brief: <page name>

**Outline:** <who, what they do, how often, device>
**Data:** <endpoint(s); sample or schema link>

### 1. Template

- Template: <DataTablePage | DetailsPage | DashboardPage | form page | settings | custom>
- Configuration: <views; detail mode; tabs; ranges; page sizes; default sort>
- Rationale: <one sentence each, citing APP-_, DATA-_, HIER-\*>

### 2. Fields

| Field | Kind | Where | Options | Sort / filter |
| ----- | ---- | ----- | ------- | ------------- |
|       |      |       |         |               |

Visible columns: <n> (≤ 7, FIELD-7). First column: <field>.

### 3. States

- Loading: <structure-first; Loadable shapes>
- Nothing yet: <title / description / action>
- No results: <built in / custom>
- Error: <generic + Retry>; not found: <condition, e.g. 404>
- Forbidden: <check>
- Refreshing / partial: <which sections>

### 4. URL state

- <param>: <meaning> (beyond the template defaults)

### 5. Permissions

| Surface | Check | Hide or disable |
| ------- | ----- | --------------- |
|         |       |                 |

### 6. Live data

| Query | refetchInterval | staleTime | Invalidated by |
| ----- | --------------- | --------- | -------------- |
|       |                 |           |                |

### 7. Mutations

| Action | Feedback | Confirm | Optimistic |
| ------ | -------- | ------- | ---------- |
|        |          |         |            |

### 8. Open questions

- <question>
```
