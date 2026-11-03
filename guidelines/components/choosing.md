# Choosing Components

Full selection rules, with rationale and the research behind them. The quick router is in
[../decision-tree.md](../decision-tree.md) §2. Per-component details are in [catalog.md](catalog.md).

---

## Actions

### CHOOSE-ACTION-1 - One primary action per view (MUST)

A screen, dialog, card or form has **at most one** `variant="primary"` Button. Give every other
action lower emphasis. Carbon: "one primary button per page"; Material 3: "a single prominent
button for the primary action". When several actions compete for attention, decisions get slower
(Hick's law) and the main path becomes unclear.

### CHOOSE-ACTION-2 - Button emphasis ladder

| Emphasis    | Variant                  | Use for                                                                       |
| ----------- | ------------------------ | ----------------------------------------------------------------------------- |
| Highest     | `primary`                | The single main action: Save, Create, Continue, Submit                        |
| Medium      | `secondary` or `outline` | Alternative actions: Cancel, Back, Export, Edit                               |
| Low         | `ghost`                  | Tertiary or repeated actions: in toolbars, table rows, card headers           |
| Destructive | `danger`                 | Delete, Remove, Revoke. Primary emphasis only inside the confirm step         |
| Status      | `success` / `warning`    | Rare. Only when the action itself is the status ("Approve"). Prefer `primary` |

- MUST label a button with a verb, or a verb plus a noun ("Save changes", "Delete project"), not
  "OK" or "Yes". The label should still make sense out of context (NN/g).
- MUST put the primary button at the **end** of the button row (right side in LTR), with Cancel
  just before it. Stay consistent across the app. Dialog footers and form footers follow this.
- SHOULD use `loading` (and `loadingText`) on the button that started an async action rather than
  disabling the whole form. Keep its width stable.
- SHOULD NOT disable a submit button to signal a validation problem. Allow the click and show
  inline errors instead, because a disabled button doesn't explain what's wrong.
- `fullWidth` only on mobile-width forms or narrow containers (≤ 400px).

### CHOOSE-ACTION-3 - IconButton

Use it only when the icon is universally recognized (close ✕, search, more ⋯, edit ✎, delete 🗑,
menu ☰) **and** space is constrained. The `aria-label` MUST give the action ("Close dialog"),
not the icon's name. SHOULD add a `Tooltip` with the same text on desktop. For anything less
obvious, use a Button with text (NN/g: icon labels are needed because most icons are ambiguous).

### CHOOSE-ACTION-4 - Links vs buttons (MUST)

If it changes the URL, it is a link (`<a>`, `NavLink`). If it changes state on the page, it is a
`Button`. Never put `onClick={() => navigate(...)}` on a Button for ordinary navigation: it breaks
open-in-new-tab, middle-click and the screen-reader role.

### CHOOSE-ACTION-5 - Grouping buttons

- `ButtonGroup`: related but **independent** actions shown as one visual unit (for example
  "Save" plus a "⋯ more" IconButton). Each child keeps its own `onClick`.
- `ButtonToggleGroup`: **one selected value** out of 2–5 (view switcher: List | Grid). This is an
  input, not a set of actions. See CHOOSE-INPUT-4.
- Use a gap of `--spacing-sm` between independent buttons in a toolbar.

### CHOOSE-ACTION-6 - Overflow menus

With 4 or more secondary actions on one object (a row, a card), show the 1–2 most common ones
inline and put the rest in a `Dropdown` or `Menu` behind a "More actions" IconButton (⋯). Keep
destructive items last, separated by a `MenuDivider`.

### CHOOSE-ACTION-7 - ToggleButton

For a persistent two-state toggle on an object: favorite, bookmark, pin, mute. MUST expose the
state (`aria-pressed`) and the label MUST NOT change meaning between states (NN/g "state-switch
controls"). For a setting in a settings list, use `Toggle` instead.

---

## Inputs

### CHOOSE-INPUT-1 - Text entry

| Need                                    | Component                       |
| --------------------------------------- | ------------------------------- |
| Single line (name, email, search, URL)  | `Input` with the correct `type` |
| Multi-line prose (description, comment) | `Textarea`                      |
| Number with exact value, small range    | `NumberInput`                   |
| Phone number                            | `PhoneInput`                    |
| Several free-form values                | `TagInput`                      |
| Value from a known large set            | `Autocomplete`                  |

MUST set `type` and `autoComplete` (for example `autoComplete="email"`) so mobile keyboards and
autofill work (WCAG 1.3.5 Identify Input Purpose). Size the field to its expected content: a ZIP
field shouldn't be full width (Baymard: field width signals the expected input).

### CHOOSE-INPUT-2 - Every field has a visible label (MUST)

Use the component's `label` prop. A placeholder is NOT a label. It disappears on input, usually
fails contrast, and Baymard found users deleting their input just to see what the field was. Put
format examples in `helperText` or in the placeholder as a supplement, never as the only label.

### CHOOSE-INPUT-3 - Toggle vs Checkbox

| Situation                                               | Use             |
| ------------------------------------------------------- | --------------- |
| Setting takes effect **immediately**, no Save button    | `Toggle`        |
| Choice is part of a form submitted later                | `Checkbox`      |
| Consent / agreement ("I accept the terms")              | `Checkbox`      |
| Parent with partially selected children (indeterminate) | `Checkbox`      |
| Several related options, select any                     | `CheckboxGroup` |

Source: NN/g toggle-switch guidelines. A toggle reads as a physical switch that acts instantly,
while a checkbox reads as a pending selection. Toggle labels describe what is turned on ("Email
notifications"), not the action ("Enable…"), and MUST NOT change with the state.

### CHOOSE-INPUT-4 - Select ONE of N

| N (options)                                | Use                                                                            |
| ------------------------------------------ | ------------------------------------------------------------------------------ |
| 2–5, space available                       | `RadioGroup`. All options stay visible, which is fastest for small sets (NN/g) |
| 2–5, switches a view or mode, short labels | `ButtonToggleGroup` (segmented control)                                        |
| 6–15                                       | `Select`                                                                       |
| > 15, or users know the value              | `Autocomplete` (or `Select` with `searchable`)                                 |
| Ordered numeric range                      | `Slider` (approximate) or `NumberInput` (exact)                                |

- SHOULD preselect a sensible default radio option unless choosing nothing is meaningful or a
  default would bias the answer (NN/g: "Radio Buttons: Always Select One?").
- SHOULD NOT use a Select for 2–3 options (NN/g: "Does your form really need a dropdown?").
- Use `orientation="vertical"` for radio and checkbox groups unless there are ≤ 3 short options.
  Vertical lists scan faster.

### CHOOSE-INPUT-5 - Select MANY of N

| Situation                     | Use                                         |
| ----------------------------- | ------------------------------------------- |
| ≤ ~7 predefined options       | `CheckboxGroup` (vertical)                  |
| Many predefined options       | `Autocomplete selectionMode="multi"`        |
| User-created free-form values | `TagInput`                                  |
| Filtering a collection        | `MultiSelectFilter` inside `FilterProvider` |

### CHOOSE-INPUT-6 - Numbers

`NumberInput` when the exact value matters (quantity, age). `Slider` when an approximate value
inside a bounded range is fine and you can show visual feedback (volume, price range). A Slider
MUST show the current value as text. Never use a Slider for values that need precision.

### CHOOSE-INPUT-7 - Dates

`DatePicker` for one date and `DateRangePicker` for a span. Use `DateRangePicker` presets
("Last 7 days") for analytics filters. For dates far from today (date of birth), make sure typing
is allowed. Don't make users click back through decades.

### CHOOSE-INPUT-8 - Input sizing

Use `size="md"` by default. `sm` for dense data tools (tables, filter bars). `lg` for marketing
pages and touch-first layouts. Every control in one row or form MUST share the same size.

---

## Feedback & messaging

### CHOOSE-FEEDBACK-1 - Blocking confirmation → `useAlert`

Use it only when the action is destructive, irreversible or expensive. Title it as a question
naming the object ("Delete project 'Atlas'?"). The confirm button MUST repeat the verb ("Delete
project"), never "OK". For reversible actions, prefer acting immediately and offering **Undo** in a
toast (NN/g: confirmation dialogs lose power when overused).

```tsx
const { confirm } = useAlert();
if (await confirm('Delete project "Atlas"?', 'This permanently removes 42 files.')) remove();
```

### CHOOSE-FEEDBACK-2 - Transient feedback → `useToast`

For the outcome of the user's own action ("Changes saved"), when no further action is required.

- MUST NOT be the only place critical or error information appears. Toasts disappear and are
  easy to miss (Carbon, PatternFly).
- MUST NOT contain the only path to an action. An "Undo" button is fine as a shortcut.
- At most one line of text, plus an optional single action.
- Use `useAsyncToast` / `loading` → `success`/`error` for operations that take more than 1s.

### CHOOSE-FEEDBACK-3 - Field-level problems → inline

Put validation errors on the field with `error` and `errorMessage`, next to the problem (WCAG
3.3.1). For a form with several errors, also show a summary at the top that links to each field.

### CHOOSE-FEEDBACK-4 - Section or page states → `PageMessages`

Covers loading, error, empty, not-found, forbidden, offline and the other whole-view states. It
replaces the content area instead of overlaying it. See
[../patterns/feedback-states.md](../patterns/feedback-states.md).

```tsx
<PageMessages
  loading={isLoading}
  error={error}
  empty={!isLoading && items.length === 0}
  emptyConfig={{
    title: 'No invoices yet',
    description: 'Invoices you create appear here.',
    primaryAction: { label: 'Create invoice', onClick: create },
  }}
>
  <InvoiceTable items={items} />
</PageMessages>
```

### CHOOSE-FEEDBACK-5 - Persistent status

Use a full-width inline message at the top of the affected region for conditions that last
(account suspended, read-only mode). Don't use a toast or dialog for these.

### Severity → semantic color mapping (MUST be consistent)

| Severity | Variant prop                                                      | Icon      | Use for                        |
| -------- | ----------------------------------------------------------------- | --------- | ------------------------------ |
| Info     | `info`                                                            | `info`    | Neutral, helpful information   |
| Success  | `success`                                                         | `check`   | Completed action               |
| Warning  | `warning`                                                         | `warning` | Possible problem, can continue |
| Error    | `error` (Alert/Toast) / `danger` (Badge, Chip, Pill, KPI, Button) | `error`   | Failure, blocked, destructive  |

---

## Overlays

### CHOOSE-OVERLAY-1 - Tooltip

- Short, plain text (≤ ~80 characters) describing a control. No links, buttons or formatting.
- MUST NOT hold information needed to complete a task. Touch users can't hover.
- MUST attach to a focusable element so it also shows on keyboard focus (WCAG 1.4.13: dismissible,
  hoverable, persistent).
- Don't add a tooltip that repeats a visible label.

### CHOOSE-OVERLAY-2 - Popover

For rich or interactive content tied to a trigger: a mini-form, a filter panel, a details preview.
It is non-modal. Clicking outside or pressing Esc closes it, and focus returns to the trigger. If
the content needs the user's full attention or contains a multi-step task, use a Dialog.

### CHOOSE-OVERLAY-3 - Dropdown vs Menu vs Select

- `Dropdown`: a Button trigger plus a list of **actions** ("Export ▾"). This is the common case.
- `Menu`: the action or option list primitive. Use it directly for context menus or custom
  triggers. Supports `selectionMode` for checkable menu items.
- `Select`: choosing a **value** for a form field. Never use a Dropdown as a form value picker.

### CHOOSE-OVERLAY-4 - Dialog

- Use it for focused tasks that must finish or be cancelled before returning: create or edit
  forms with ≤ ~6 fields, or confirmations.
- SHOULD NOT be used for long forms, multi-step flows with more than 3 steps, or content the user
  wants to compare against the page. Use a dedicated page or a side panel instead.
- Sizes: `sm` for confirmations, `md` for forms (default), `lg` for complex content, `full` only
  on mobile.
- Never open a dialog on page load unprompted. Never stack more than 2 dialogs.
- MUST have a title and keep `trapFocus` and `closeOnEscape` on. Put actions in the footer, with
  the primary action last.

### CHOOSE-OVERLAY-5 - Disclosure

`Accordion` (in `AccordionContainer`) for several related sections where users need only some of
them (FAQ, settings groups). `Collapse` for a single show/hide region. Don't hide content that most
users need. If more than 70% of users will open it, just show it.

---

## Navigation

### CHOOSE-NAV-1 - Primary navigation

| App shape                                                   | Use                                              |
| ----------------------------------------------------------- | ------------------------------------------------ |
| ≤ 7 top-level sections, flat, marketing or simple app       | `Navbar` (horizontal)                            |
| More than 7 sections, or nested sections (admin, dashboard) | `SideNav` in `CollapsibleSidebar`                |
| Mobile, 3–5 primary destinations                            | `BottomNavigation` (plus `Navbar` for the brand) |

Mark the current location: `active` on `NavLink`, or the controlled active value on `SideNav` and
`BottomNavigation` (matching the item's `value`). The rendered link MUST carry
`aria-current="page"`. Keep the
nav order stable, and never reorder items based on usage.

### CHOOSE-NAV-2 - BottomNavigation

Use 3–5 items, each with an icon **and** a text label. Use it only below the `laptop` breakpoint (< 1024px, PAGE-4).
Hide it on desktop and show SideNav or Navbar there instead.

### CHOOSE-NAV-3 - Tabs

Tabs switch between **parallel views of the same context** (Overview | Activity | Settings).

- Use 2–7 tabs with short labels (1–2 words). If the labels don't fit, use a Select or a SideNav.
- MUST NOT be used as sequential steps. That's a Stepper.
- MUST NOT be used for primary app navigation between unrelated pages. Use NavLinks instead.
- Variant: `line` (default, inside pages), `enclosed` (inside cards or panels), `soft-rounded` or
  `solid-rounded` (compact filters, toolbars).

### CHOOSE-NAV-4 - Breadcrumbs

Use them when the hierarchy is 3 or more levels deep. They complement primary navigation and never
replace it. The last item is the current page and is not a link.

### CHOOSE-NAV-5 - Stepper

Use it for linear processes with 3–7 steps (checkout, onboarding). Show step names, not just
numbers. Let users go back to completed steps. Under 3 steps, use one page.

### CHOOSE-NAV-6 - Pagination vs infinite scroll vs load more

| Content                                                           | Use                                              |
| ----------------------------------------------------------------- | ------------------------------------------------ |
| Goal-oriented finding or comparing (search results, admin tables) | `Pagination`                                     |
| Exploratory feed, homogeneous items, no need to return to a spot  | Infinite scroll (`infiniteScroll` on Table/List) |
| In between, or a page footer must stay reachable                  | "Load more" Button                               |

NN/g: infinite scroll hurts goal-oriented tasks, makes it hard to return to an item and hides the
footer.

---

## Short labels: Badge vs Tag vs Chip vs Pill vs StatusIndicator

These look alike. Pick by **purpose**, never by appearance:

| ID             | Component         | Purpose                                                                | Interactive?             |
| -------------- | ----------------- | ---------------------------------------------------------------------- | ------------------------ |
| CHOOSE-LABEL-1 | `Badge`           | Count or short status attached to another element ("3", "New", "Beta") | No                       |
| CHOOSE-LABEL-2 | `StatusIndicator` | Live state of a system or person (online, degraded, offline)           | No                       |
| CHOOSE-LABEL-3 | `Tag`             | Category or metadata describing an item ("Design", "Q3")               | Optional click to filter |
| CHOOSE-LABEL-4 | `Chip`            | A **value the user selected**, removable (active filter, recipient)    | Remove only              |
| CHOOSE-LABEL-5 | `Pill`            | Compact selectable option or quick filter, optional icon               | Click and/or remove      |

- Use neutral or secondary colors by default. Use semantic colors only when the label carries
  that meaning ("Overdue" → danger), and always pair them with the text.
- Keep it to at most 3 labels per item in a list row. Beyond that, collapse with `TruncatedList`
  ("+4").
- Text is 1–3 words, sentence case. Keep a label shorter than its container.

---

## Data & layout

See [../patterns/data-display.md](../patterns/data-display.md) (DATA-_) and
[../foundations/spacing-layout.md](../foundations/spacing-layout.md) (LAYOUT-_).

## Loading indicators

| Expected wait                       | Use                                                                          |
| ----------------------------------- | ---------------------------------------------------------------------------- |
| < 1s                                | Nothing. Avoid flashing a spinner (delay showing it by about 300ms).         |
| 1–10s, layout known                 | `Skeleton` / `ListSkeleton` / Table `skeleton` shaped like the content       |
| 1–10s, layout unknown or small area | `Spinner` (inline) or Button `loading`                                       |
| 1–10s, blocking a region            | `LoadingOverlay mode="container"`                                            |
| > 10s or measurable                 | `ProgressBar` / `CircularProgress` with a percentage and, ideally, time left |

Source: NN/g response-time limits (0.1s / 1s / 10s) and progress-indicator guidance.
`LoadingOverlay mode="fullscreen"` only for app boot or a blocking global operation.

---

## App builder (`/app`)

Use `/app` when a screen loads data, keeps state in the URL, checks permissions or needs app
services. Plain presentational screens need only the main entry.

| Need                                                              | Use                                                                                           |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| A routed screen that loads data                                   | `Page` with `queries`; it provides loading, error+retry, empty and forbidden states (STATE-1) |
| A region that can fail on its own                                 | `Section` with its own `queries`                                                              |
| Filters, sort, tab or page number that survive reload and sharing | `usePageParams`                                                                               |
| A remembered setting (density, view)                              | `usePreference` (URL by default, `storage: 'local'` for this browser only)                    |
| Feedback after a save                                             | `useMutationFeedback`: toast by default, `via: 'inline'` inside a form                        |
| Instant UI on add/toggle/delete                                   | `createOptimisticHandlers` in `useMutation`                                                   |
| Link or navigate while a form may be dirty                        | `AppLink` / `useAppNavigate`, never a bare `<a>` or `router.push`                             |
| Hide or disable an action by permission                           | `Can` / `useCan`; whole page: `Page permission`                                               |
| Format dates, numbers, money                                      | `useFormatters()` (or the `format*` functions with a `locale`)                                |
| Layout that depends on screen size                                | CSS with `@include bp(...)` first; `useBreakpoint` / `useBreakpointValue` only for logic      |
| Warn before losing edits                                          | `FormBuilder guardUnsaved`; custom form: `useUnsavedChanges`                                  |
| Translate built-in text                                           | `translate={i18n.t}` on the provider; keys are `ui.<key>` (`foundations/labels.md`)           |
