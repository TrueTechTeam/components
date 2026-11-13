# Page Hierarchy

What goes first, what is prominent, and what waits behind a click. These rules apply inside the
templates (which already fix the overall frame) and to custom pages.

## HIER-1 - Top-left is the most important place

Put the information that answers the page's main question at the top left, where reading starts
(F-pattern scanning, NN/g). In practice:

- **List:** the identifying column first, then status (`FIELD-7`). Search sits left of filters in
  the toolbar.
- **Details:** title and status in the header, then the key facts strip. The first tab is the one
  most visits need (usually "Overview").
- **Dashboard:** the KPI that answers the dashboard's decision comes first in `kpis`, and the
  chart that explains it is the first `primary` widget (`PAGE-3`).

Why: users scan the top left first and many stop there. Put secondary data there and the main
answer gets missed.

## HIER-2 - One primary action (MUST)

- One `variant: 'primary'` action per page, in the header, rightmost (`CHOOSE-ACTION-1`).
  `DataTablePage` makes `create` the primary, so its `headerActions` must not contain another.
  `PageHeader` (used by every template) warns in development when it gets more than one primary
  and renders the extras as secondary.
- Pick the action most visits end with: Create on a list, Edit (or the next workflow step, such
  as "Approve") on a record. Everything else is secondary (`headerActions`, `actions` without
  `variant`), danger (`variant: 'danger'`) or a row action.
- Below the tablet breakpoint, `PageHeader` moves secondary actions into "More actions" and keeps
  the primary visible (`PAGE-4`).
- Destructive actions are never primary, and they always confirm (`CHOOSE-FEEDBACK-1`).

## HIER-3 - Above-the-fold budget

On a laptop screen (about 1280 × 720 of usable space) the first view SHOULD show, without
scrolling:

| Template        | Must be visible on arrival                                                 |
| --------------- | -------------------------------------------------------------------------- |
| `DataTablePage` | Header, toolbar and at least 8–10 rows (keep `description` to one line)    |
| `DetailsPage`   | Header, key facts and the start of the first tab's main content            |
| `DashboardPage` | Header with the range toggle, the KPI row and the top of the primary chart |

- Don't put banners, long descriptions or onboarding copy above the content. Use a dismissible
  inline message inside the content instead (`CHOOSE-FEEDBACK-5`).
- ≤ 7–9 widgets on a dashboard's first screen (`PAGE-3`).

## HIER-4 - Progressive disclosure: row → panel → page

Show each level of detail only when the user asks for it:

1. **Row (column):** the ≤ 7 fields users compare (`FIELD-7`).
2. **Panel or dialog:** the summary of one record, ~6–12 fields, read in place without losing
   the list (`APP-3`).
3. **Full page:** everything, including related records, activity, media and notes, in tabs.

Each level adds information and repeats as little as possible. Link down a level ("Open full
page" via `fullPageHref`), never sideways to an unrelated page. Use the same labels and formatting
at every level (`FIELD-11`).

Why: progressive disclosure keeps the common path simple and leaves advanced detail one step away
(NN/g). Users who need it find it, and the others don't wade through it.

## HIER-5 - When to split into tabs

Split a details page into tabs when **either**:

- the content is more than ~2 screens tall on a laptop, **or**
- it serves distinct tasks that users rarely do together (reviewing settings vs reading history
  vs managing files).

Then:

- 2–6 tabs, short noun labels ("Overview", "Activity", "Assets"), most-used first (`CHOOSE-NAV-3`).
- Never hide something every visit needs in a later tab. Put it in the header, the key facts or
  the first tab.
- Don't use tabs for sequential steps (use `Stepper`) or to compare content side by side.
- One-screen records use one tab (no tab bar), not tabs with a single field each.

## HIER-6 - Summary strip: ≤ 6 facts

- `DetailsPage facts` (`KeyFacts`): 3–6 facts that tell the record's state at a glance: money,
  key counts, the next date. More than 6 stops being a summary (`DATA-8`).
- Don't repeat the header: the status goes in `status`, the name in the title.
- Facts are read-only values. Actions go in the header, not in the facts strip.

## HIER-7 - Main column vs side column

- **Main column:** what the user came to read or act on (details, line items, the timeline).
- **Side column** (`DetailsTab.side`): reference data people glance at: ownership, ids, audit
  dates, related links. It stacks under the main column below 1024px, so it must not hold the
  page's primary content.
- Use `layout: 'single'` when the main content needs the width (timelines, galleries, wide
  tables).
