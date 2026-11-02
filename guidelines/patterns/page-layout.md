# Page Layout

## PAGE-1 - App shell

```
┌──────────────────────────────────────────────┐
│ Navbar (brand · global search · user menu)   │  ← sticky, --z-sticky
├────────────┬─────────────────────────────────┤
│ SideNav    │ Page header                     │
│ (in        │  Breadcrumbs (if ≥ 3 levels)    │
│ Collapsible│  <h1> Title        [Secondary][Primary] │
│ Sidebar)   │  Tabs (if sub-views)            │
│            ├─────────────────────────────────┤
│            │ Content (max-width page token)  │
│            │                                 │
└────────────┴─────────────────────────────────┘
Mobile: SideNav → hidden behind NavbarToggle; 3–5 key destinations → BottomNavigation
```

- Use one `<main>` landmark. Add a skip link to it.
- Put the page header in the same place on every page: title left, page-level actions right, and
  primary action rightmost.
- Sidebars are 240–280px wide when expanded and 64–72px collapsed (icons with tooltips). Remember
  the collapsed state per user (`useLocalStorage`).

## PAGE-2 - Page types

| Page type              | Structure                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| **List / index**       | Header with "Create" primary → filters/search → DataTable or List → pagination                    |
| **Detail**             | Header with title, status Tag and actions → key facts summary → Tabs for sub-views                |
| **Create / edit**      | Header → single-column form (FORM-1) → footer actions. Use a Dialog only for ≤ ~6 fields          |
| **Dashboard**          | KPI row (3–5) → primary chart(s) → secondary widgets in AdaptiveGrid → recent activity list       |
| **Settings**           | SideNav or Tabs for categories → grouped sections with headings → instant-save controls (FORM-11) |
| **Empty / onboarding** | Centered empty state with one primary action (STATE-3)                                            |

## PAGE-3 - Dashboards

- Ask what decision the dashboard supports. Show what answers it at the top left, and push
  everything else down or behind drill-down.
- Use a consistent card grid: `AdaptiveGrid minItemWidth={280..320} gap={16..24}`. All widget
  cards share variant, padding and header style.
- Every widget has a title, a time range or "as of" timestamp, and its own loading, empty and error
  states (STATE-1). One failing widget never blanks the dashboard.
- Avoid more than 7–9 widgets on the first screen. Split into Tabs or separate pages.

## PAGE-4 - Responsive behavior

- Navigation collapses below `laptop` (1024px) (SideNav → overlay or BottomNavigation).
- Multi-column content collapses to one column. Order the source so the most important content
  comes first on mobile.
- Page actions: on mobile, keep the primary action visible (sticky footer or header) and move
  secondary actions into an overflow menu.
- Dialogs become full-screen (`size="full"`) on narrow viewports when they contain forms.
- Tables: see DATA-1.

## PAGE-5 - Consistency across pages

The same thing looks and behaves the same everywhere: the same component, variant, position and
wording for the same action (Jakob's law: users expect your app to work like the others they use,
and like itself). Before adding a new pattern, look for an existing one in the app and reuse it.
