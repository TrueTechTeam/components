# Design Decision Tree

The entry point for every UI decision. Walk from the top, answer each question, and follow the
first matching branch. Each leaf names a rule ID and the file that holds the full rule.

> Format: `Q:` is a question. `→` is the answer to follow. `⇒` is the decision, with a rule ID.
> When no branch matches, take the `else` branch. If a decision is genuinely ambiguous, pick the
> **less prominent, more conventional** option and note the ambiguity in your summary.

---

## 0. Before any decision

- ⇒ Use a component from this library before writing custom markup. Check
  [components/catalog.md](components/catalog.md). `GEN-1`
- ⇒ Use tokens (`var(--spacing-md)`, `var(--theme-text-primary)` …), never raw hex/px values.
  [foundations/tokens.md](foundations/tokens.md). `GEN-2`
- ⇒ Every interactive element must be keyboard reachable, have a visible focus ring and have an
  accessible name. [foundations/accessibility.md](foundations/accessibility.md). `GEN-3`
- ⇒ One screen, one primary action. `GEN-4`, detailed in `CHOOSE-ACTION-1`.

## 1. What kind of task is this?

```
Q: What are you doing?
├─ Choosing which component to render ............ → §2
├─ Picking or adjusting a color .................. → §3
├─ Setting spacing, sizing, or arranging layout ... → §4
├─ Styling text .................................. → §5
├─ Adding animation or transitions ............... → §6
├─ Building a form ............................... → patterns/forms.md
├─ Showing a collection of records ............... → patterns/data-display.md
├─ Showing loading / empty / error / success ..... → patterns/feedback-states.md
├─ Building a page shell, nav, or dashboard ...... → patterns/page-layout.md
├─ Building a page from data (outline + sample response or schema)
│                                                  → app/ (start at app/README.md), see below
├─ Wiring page data, URL state, permissions or app services
│                                                  → app builder (`/app`), see components/catalog.md
└─ Creating or modifying a library component ..... → contributing/component-checklist.md
```

### Building a page from data (full rules in [app/README.md](app/README.md))

```
Q: You have an outline of what the page does and a sample response or schema?
├─ 1. Fill the page brief .............................. app/page-brief.md
├─ 2. Pick the template from task + data shape .......... app/choosing-a-page.md   APP-1
│   ├─ Many records: find, compare, act → DataTablePage                        APP-2, APP-3
│   ├─ One record with related content → DetailsPage                           APP-4
│   ├─ Numbers over time → DashboardPage                                       APP-5
│   └─ Create or edit → Page + PageHeader + FormBuilder guardUnsaved            APP-6
├─ 3. Map each field to a FieldKind and a placement ..... app/field-display.md    FIELD-2, FIELD-6
├─ 4. Order and disclose (one primary, ≤ 7 columns) ..... app/hierarchy.md        HIER-2, HIER-4
├─ 5. Cover every state (structure-first loading) ....... app/states.md           APP-STATE-2
└─ 6. URL state, polling, permissions, feedback ......... app/plumbing.md         APP-PLUMB-1
```

A worked example (marketing campaigns, from outline to code) is in [app/example.md](app/example.md).

## 2. Which component? (quick router - full trees in [components/choosing.md](components/choosing.md))

```
Q: What does the user need to do?
├─ Trigger an action (submit, save, open, delete)
│   ├─ Navigates to another URL? → <a>/NavLink, not Button                    CHOOSE-ACTION-4
│   ├─ Icon only, well-known icon, space-constrained? → IconButton + aria-label CHOOSE-ACTION-3
│   ├─ Toggles a persistent on/off state on an object (favorite, mute)? → ToggleButton
│   ├─ Several related actions, one is the default? → ButtonGroup or Dropdown (split) CHOOSE-ACTION-5
│   ├─ 4+ secondary actions on one object? → Dropdown/Menu ("More" ⋯)          CHOOSE-ACTION-6
│   └─ else → Button; variant by emphasis (one primary per view)               CHOOSE-ACTION-1/2
│
├─ Enter or choose a value
│   ├─ Free text: single line → Input · multi-line → Textarea                  CHOOSE-INPUT-1
│   ├─ Number with small steps → NumberInput · approximate in a range → Slider  CHOOSE-INPUT-6
│   ├─ Binary setting
│   │   ├─ Takes effect immediately (no Save button)? → Toggle                 CHOOSE-INPUT-3
│   │   └─ Part of a form submitted later / needs indeterminate? → Checkbox    CHOOSE-INPUT-3
│   ├─ Pick ONE of N
│   │   ├─ N ≤ 5 and space allows → RadioGroup (all options visible)          CHOOSE-INPUT-4
│   │   ├─ N ≤ 5, switches a view/mode, short labels → ButtonToggleGroup      CHOOSE-INPUT-4
│   │   ├─ 6 ≤ N ≤ ~15 → Select                                               CHOOSE-INPUT-4
│   │   └─ N > ~15 or users know what to type → Autocomplete                  CHOOSE-INPUT-4
│   ├─ Pick MANY of N
│   │   ├─ N ≤ ~7 → CheckboxGroup                                             CHOOSE-INPUT-5
│   │   ├─ larger, predefined → Autocomplete selectionMode="multi"            CHOOSE-INPUT-5
│   │   └─ free-form user-created values → TagInput                           CHOOSE-INPUT-5
│   ├─ Date → DatePicker · date span → DateRangePicker                        CHOOSE-INPUT-7
│   ├─ Phone → PhoneInput · color → ColorPicker · file → FilePicker · score → Rating
│   └─ Many fields generated from config → FormBuilder                        FORM-12
│
├─ Be told something
│   ├─ Must decide before continuing (destructive/irreversible)? → useAlert().confirm  CHOOSE-FEEDBACK-1
│   ├─ Result of their own action, non-blocking, no action needed → useToast           CHOOSE-FEEDBACK-2
│   ├─ Problem tied to a specific field → Input error/helper text (inline)              CHOOSE-FEEDBACK-3
│   ├─ Whole page/section can't render (error, empty, 404, offline) → PageMessages      CHOOSE-FEEDBACK-4
│   └─ Persistent system status (e.g. trial ending) → banner region at top of content   CHOOSE-FEEDBACK-5
│
├─ See extra content on demand
│   ├─ Short plain-text hint for a control → Tooltip (never essential info)    CHOOSE-OVERLAY-1
│   ├─ Rich/interactive content anchored to a trigger → Popover               CHOOSE-OVERLAY-2
│   ├─ List of actions/options from a trigger → Dropdown / Menu               CHOOSE-OVERLAY-3
│   ├─ Focused task that blocks the page → Dialog                              CHOOSE-OVERLAY-4
│   └─ Expand content in place → Accordion (sections) / Collapse (single)     CHOOSE-OVERLAY-5
│
├─ Move around the app
│   ├─ Top-level sections, ≤ 7, desktop → Navbar or SideNav                    CHOOSE-NAV-1
│   ├─ Many sections or deep hierarchy → SideNav (+ CollapsibleSidebar)        CHOOSE-NAV-1
│   ├─ Mobile, 3–5 top destinations → BottomNavigation                         CHOOSE-NAV-2
│   ├─ Switch views of the same object on one page → Tabs                      CHOOSE-NAV-3
│   ├─ Where am I in a hierarchy ≥ 3 levels → Breadcrumbs                      CHOOSE-NAV-4
│   ├─ Ordered multi-step process → Stepper                                    CHOOSE-NAV-5
│   └─ Move through pages of results → Pagination                              CHOOSE-NAV-6
│
├─ View a collection
│   ├─ Compare values across attributes (columns) → DataTable / Table          DATA-1
│   ├─ Scan items with 1–3 attributes, maybe actions → List                    DATA-1
│   ├─ Visual/heterogeneous items (images, previews) → Card in AdaptiveGrid    DATA-1
│   ├─ Reorder by dragging → SortableList / SortableGrid / KanbanBoard         DATA-9
│   └─ Single headline metric → KPI                                            DATA-8
│
└─ See a short label on something
    ├─ Numeric count / notification dot → Badge                                CHOOSE-LABEL-1
    ├─ Online/offline/health state → StatusIndicator                           CHOOSE-LABEL-2
    ├─ Category/metadata attached to an item → Tag                             CHOOSE-LABEL-3
    ├─ Removable selected value (active filter, chosen recipient) → Chip       CHOOSE-LABEL-4
    └─ Clickable/selectable compact option, optional icon → Pill               CHOOSE-LABEL-5
```

## 3. Color (full rules in [foundations/color.md](foundations/color.md))

```
Q: What is the color for?
├─ Text
│   ├─ Main content → --theme-text-primary                                    COLOR-2
│   ├─ Supporting/meta text → --theme-text-secondary                          COLOR-2
│   ├─ Least important text (≥ 4.5:1 still required) → --theme-text-tertiary  COLOR-2
│   └─ Text on a filled primary surface → --theme-text-on-primary             COLOR-2
├─ Backgrounds / containers
│   ├─ App canvas → --theme-background-primary                                COLOR-4
│   ├─ Card/panel on canvas → --theme-surface-primary                         COLOR-4
│   └─ Floating (popover, menu, dialog) → --theme-surface-elevated + shadow  COLOR-4
├─ Meaning (success / warning / error / info)
│   ├─ Is the meaning ALSO shown by icon or text? No → add one (never color alone) COLOR-5
│   └─ → --theme-success | --theme-warning | --theme-error | --theme-info     COLOR-5
├─ Brand emphasis / primary action → --theme-primary (sparingly: ≤ ~10% of a screen) COLOR-3
├─ Charts / categorical data → see COLOR-8 (distinct hues, ≤ 8 series, never semantic colors)
└─ A brand-new color not in the tokens
    → Do not add it ad hoc. Pick the closest --color-{family}-{shade} and verify contrast. COLOR-7
```

## 4. Spacing & layout (full rules in [foundations/spacing-layout.md](foundations/spacing-layout.md))

```
Q: What are you spacing?
├─ Icon ↔ label inside a control → --spacing-sm (8px)  [xs (4px) for sm sizes] SPACE-2
├─ Between related items in a group (fields, list rows, buttons in a bar) → --spacing-sm/md SPACE-2
├─ Inside a container (card/panel padding) → --spacing-md (16px), lg (24px) for roomy  SPACE-2
├─ Between groups / sections in a container → --spacing-lg (24px) or xl (32px)  SPACE-2
├─ Between major page regions → --spacing-xl (32px) or xxl (48px)              SPACE-2
└─ Rule of thumb: space BETWEEN groups ≥ 2× space WITHIN a group (proximity)     SPACE-3

Q: What layout primitive?
├─ Equal-width responsive cards → AdaptiveGrid (minItemWidth)                  LAYOUT-3
├─ Variable-height tiles (gallery, notes) → MasonryLayout                      LAYOUT-3
├─ Side-by-side on desktop, stacked on mobile → ResponsiveStack                LAYOUT-3
├─ Fixed or user-resizable split views → Panes / ResizablePanels               LAYOUT-3
└─ Simple 1-D row/column → flex utility classes / CSS flex with gap tokens     LAYOUT-3
```

## 5. Typography (full rules in [foundations/typography.md](foundations/typography.md))

```
Q: What text is this?
├─ Page title (one per page, <h1>) → --font-size-2xl/3xl, semibold            TYPE-2
├─ Section heading → --font-size-xl/lg, semibold                              TYPE-2
├─ Body text → --font-size-base (16px), normal, line-height 1.5, ≤ 70ch wide   TYPE-3/4
├─ Dense UI text (tables, controls, meta) → --font-size-sm (14px)             TYPE-2
├─ Captions/labels/legal → --font-size-xs (12px) min; never for paragraphs    TYPE-2
└─ Numbers in tables/KPIs → font-variant-numeric: tabular-nums                TYPE-6
```

## 6. Motion (full rules in [foundations/motion.md](foundations/motion.md))

```
Q: What is moving?
├─ Color/opacity on hover/press → --duration-instant/fast, --ease-standard     MOTION-2
├─ Small element appears/disappears (tooltip, menu) → --duration-fast/normal, --ease-enter/exit MOTION-2
├─ Large surface (dialog, drawer) → --duration-slow                            MOTION-2
├─ Purely decorative (Reveal, CountUp, FlipCard)? → only if it aids comprehension; must respect reduced motion MOTION-4
└─ Always: honor prefers-reduced-motion                                         MOTION-3
```

## 7. Final review (run before you finish any UI task)

- [ ] Only one primary (filled `variant="primary"`) button per view or dialog.
- [ ] Text contrast ≥ 4.5:1 (≥ 3:1 for ≥ 24px or ≥ 18.66px bold). UI boundaries and icons ≥ 3:1.
- [ ] Meaning never conveyed by color alone.
- [ ] Every input has a visible `label`. Placeholders are hints, not labels.
- [ ] Every icon-only control has `aria-label`.
- [ ] Spacing uses tokens, and spacing between groups exceeds spacing within groups.
- [ ] Loading, empty and error states exist for every async data view.
- [ ] Works at 320px wide, at 200% zoom and in both light and dark themes.
- [ ] Keyboard: Tab reaches everything in visual order, Esc closes overlays, focus returns to the
      trigger.
- [ ] Animations respect `prefers-reduced-motion`.
