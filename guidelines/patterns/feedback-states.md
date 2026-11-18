# Feedback & States

Every view that depends on data or user action has **five states**: ideal, loading, empty, error
and partial. Design all five. Missing states are the most common quality gap in generated UI.

## STATE-1 - Required states for async views (MUST)

| State   | What the user sees                                                         | Component                                                 |
| ------- | -------------------------------------------------------------------------- | --------------------------------------------------------- |
| Loading | Content-shaped `Skeleton` (known layout) or a `Spinner` (small or unknown) | `PageMessages loading`, `Skeleton`, Table/List `skeleton` |
| Empty   | Why it's empty, plus the next action                                       | `PageMessages empty` + `emptyConfig`                      |
| Error   | What failed, in plain language, plus Retry                                 | `PageMessages error` (+ `onRetry`)                        |
| Partial | The content that loaded, plus an inline message for what didn't            | Inline message in the section                             |
| Ideal   | The content                                                                | -                                                         |

Order of precedence: loading → error → empty → content. `PageMessages` handles this order.

## STATE-2 - Loading

- Choose the indicator by expected duration (see "Loading indicators" in
  [../components/choosing.md](../components/choosing.md)): nothing under ~300ms–1s, skeleton or
  spinner for 1–10s, and a determinate progress indicator over 10s.
- Delay showing spinners by ~300ms, and once one is shown keep it visible for ≥ ~500ms, to avoid
  flicker.
- Skeletons MUST match the real layout closely (same heights and columns) to avoid layout shift.
  Don't skeleton the whole page when only one widget is loading.
- Structure first: render the page's title, static text, layout and actions immediately and
  skeleton only the data-dependent parts. In `/app`, `Page`/`Section` keep rendering their
  children while pending (controls disabled, region `aria-busy`); wrap each data-dependent piece in
  `Loadable` with the matching `shape`. Data already in the cache shows no skeleton at all.
- Keep already-loaded content visible during a refresh (stale-while-revalidate). Show a subtle
  inline spinner or a `LoadingOverlay mode="container"` over just the stale region.
- Button-initiated actions: `loading` on that Button, not a page overlay.

## STATE-3 - Empty states

Carbon and NN/g identify three kinds, which need different content:

| Kind           | Example                         | Content                                                         |
| -------------- | ------------------------------- | --------------------------------------------------------------- |
| First use      | "No projects yet"               | What this area is for, plus a primary action ("Create project") |
| No results     | Search or filters returned none | Echo the query or filters, plus "Clear filters" / suggestions   |
| Cleared / done | Inbox zero, all tasks complete  | A positive confirmation. No action needed                       |

- The empty state **replaces** the component (no empty table headers), centered in the content
  area. Use a short title, one sentence of description and at most 1 primary + 1 secondary action.
- Illustrations are optional and decorative (`aria-hidden`).
- When several empty widgets share a page, use secondary or ghost buttons in them, to keep one
  primary per page.

## STATE-4 - Errors

- Use plain language: what happened, whether data was lost, and what to do. No raw error codes as
  the headline (put them in small text for support).
- Always offer a way forward: Retry, Go back, Contact support.
- Scope the error to the smallest failing region. One failed widget MUST NOT blank the whole page.
- Use `PageMessages` states for whole-view conditions: `notFound`, `forbidden`, `unauthorized`,
  `offline`, `timeout`, `maintenance`. Each has default copy and actions you can configure.

## STATE-5 - Success & notifications

| Situation                                     | Pattern                                                                                       |
| --------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Quick, reversible action completed            | `success('Project archived', { action: { label: 'Undo', onClick: undo } })` from `useToast()` |
| Creation that leads somewhere                 | Navigate to the new item. Optionally show a toast                                             |
| Async background job started                  | `useAsyncToast` (loading → success/error)                                                     |
| Destructive or irreversible action requested  | `useAlert().confirm` **before** acting (CHOOSE-FEEDBACK-1)                                    |
| Ongoing condition (offline, read-only, trial) | Inline message at the top of the region, persistent until resolved                            |
| Field-level validation                        | Inline on the field (FORM-5)                                                                  |

Toast rules:

- Auto-dismiss after ~5s for success and info. Keep warnings visible for at least 8s. Errors persist
  until dismissed, or are better shown inline.
- Auto-dismiss timers pause on hover and focus (WCAG 2.2.1).
- Show at most 3 visible toasts and collapse the rest. Use one consistent position app-wide
  (`bottom-right` or `top-right` on desktop, `bottom-center` on mobile above bottom nav).
- Don't toast things the user can already see change on screen ("Toggle switched on").

## STATE-6 - Optimistic UI

For fast, low-risk actions (like, reorder, toggle a setting), update the UI immediately and roll
back with an error toast if the request fails. Don't use optimistic UI for payments, deletes or
anything with server-side validation the user must see.

## STATE-7 - Disabled vs hidden

- Hide actions users can **never** perform (permissions).
- Disable actions that are temporarily unavailable, and explain why (helper text or a tooltip on a
  focusable wrapper).
- Don't disable an action when clicking it could explain the problem instead (validation).
