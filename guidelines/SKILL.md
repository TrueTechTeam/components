---
name: ui-components-design
description: Use when building or changing UI with @true-tech-team/ui-components (React). Covers building pages from an outline and a sample API response with the /app templates, which component to use, color, spacing, typography, layout, motion, accessibility, forms, data tables, and loading/empty/error states. Read before writing JSX or styles that use this library.
---

# @true-tech-team/ui-components design guidelines

Research-backed design rules (WCAG 2.2 AA, NN/g, Baymard, Material 3, Carbon) for apps built with
this library and for changes to the library itself.

1. Open [decision-tree.md](decision-tree.md) and walk it for the task at hand.
2. Follow the linked rule file and apply rules by ID (e.g. `CHOOSE-INPUT-4`, `COLOR-1`).
3. Before finishing, run the final review checklist at the end of `decision-tree.md`.

Full index: [README.md](README.md).

For pages that load data, keep state in the URL, check permissions or translate text, use the app
builder entry `@true-tech-team/ui-components/app` (`GlobalProvider` outside, `AppProvider` inside);
see the "App builder (`/app`)" section of [components/catalog.md](components/catalog.md). Built-in
text is translatable: see [foundations/labels.md](foundations/labels.md).

To build a page from an outline plus a sample API response or schema, follow
[app/README.md](app/README.md): fill the page brief ([app/page-brief.md](app/page-brief.md)), pick
a template (`DataTablePage`, `DetailsPage`, `DashboardPage`) and map every field to a
`FieldValue` kind. [app/example.md](app/example.md) shows the whole run.

Non-negotiables:

- Use library components before custom markup, and CSS tokens (`var(--…)`) instead of raw values.
- One primary button per view. Visible labels on every input. Never use color alone for meaning.
- Text contrast ≥ 4.5:1. UI boundaries, icons and focus ≥ 3:1. Targets ≥ 24px.
- Every async view has loading, empty and error states (`PageMessages`).
- Honor `prefers-reduced-motion`. Test light and dark themes.
