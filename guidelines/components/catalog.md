# Component Catalog

Every public component and hook, with what it's for and when not to use it. Import everything from
the package root:

```ts
import { Button, Input, DataTable, useToast } from '@true-tech-team/ui-components';
```

Shared conventions:

- `size`: `'sm' | 'md' | 'lg'` (some also take `'xs' | 'xl'`). `md` is the default. Every control in
  a row shares one size.
- `variant` on actions and controls: `'primary' | 'secondary' | 'outline' | 'ghost' | 'success' |
'warning' | 'danger'`.
- Status-colored display components (Badge, Chip, Pill `color`, KPI, ProgressBar,
  CircularProgress) use `'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' |
'neutral'`. Alert and Toast use `'info' | 'success' | 'warning' | 'error'`.
- All components accept `className`, `style`, `data-testid` and `aria-label`.
- Interactive inputs accept `label`, `helperText`, `error`, `errorMessage` and `disabled`. Use them.
  Don't build your own label markup.

The authoritative props are the TypeScript types (`ButtonProps` etc. in `index.d.ts`) and the
Storybook docs.

---

## Setup

| Export                      | Purpose                                                                                                                                                                                                              |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GlobalProvider`            | **Required once at the root.** Wraps ThemeProvider, PageMessagesProvider, DialogProvider, AlertProvider and ToastProvider. Props: `themeConfig`, `toastConfig`, `dialogConfig`, `alertConfig`, `pageMessagesConfig`. |
| `ThemeProvider`, `useTheme` | Theme mode (`light`/`dark`), `setMode`, toggle, and token overrides. Normally used via GlobalProvider.                                                                                                               |

## Buttons

| Component                                     | Use when                                                   | Avoid when / instead                         | Key props                                                                                        |
| --------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `Button`                                      | Any action with a text label                               | Navigation → `<a>`/`NavLink`                 | `variant`, `size` (xs–xl), `startIcon`, `endIcon`, `loading`, `loadingText`, `fullWidth`, `type` |
| `IconButton`                                  | Universally understood icon action in tight space          | Unclear icon → Button with text              | `aria-label` (required), `variant`, `size`                                                       |
| `ToggleButton`                                | Two-state toggle on an object (favorite, bookmark, mute)   | Settings → `Toggle`                          | active/inactive icons, pressed state                                                             |
| `ButtonGroup`                                 | Visually joined related actions, each with its own handler | Single selection → `ButtonToggleGroup`       | `orientation`, `variant` (applied to children)                                                   |
| `ButtonToggleGroup` + `ButtonToggleGroupItem` | Segmented control: pick 1 of 2–5 views or modes            | Form value with longer labels → `RadioGroup` | `value`, `onChange`, `size`, `variant`, `orientation`                                            |

## Inputs

| Component                             | Use when                                                                  | Avoid when / instead                                                                                                                                                                                                                           |
| ------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Input`                               | Single-line text, email, password, search, URL                            | Multi-line → `Textarea`; exact numbers → `NumberInput`. Props: `type`, `label`, `helperText`, `errorMessage`, `startIcon`, `prefix`/`suffix`, `showClearButton`, `showPasswordToggle`, `validateOn`, `formatMask`, `showCounter` + `maxLength` |
| `Textarea`                            | Multi-line free text                                                      | Rich text editing (not provided)                                                                                                                                                                                                               |
| `NumberInput`                         | Exact numeric values with increment/decrement                             | Approximate value in a range → `Slider`                                                                                                                                                                                                        |
| `PhoneInput`                          | Phone numbers with a country code                                         | -                                                                                                                                                                                                                                              |
| `Select`                              | Pick 1 of 6–15 options (`searchable` for more)                            | ≤ 5 options → `RadioGroup`; very large/remote → `Autocomplete`                                                                                                                                                                                 |
| `Autocomplete`                        | Type to find from a large or remote set; `selectionMode="multi"` for many | Small fixed set → Select/RadioGroup                                                                                                                                                                                                            |
| `TagInput`                            | Free-form multi-value entry (keywords, emails)                            | Predefined options → Autocomplete multi                                                                                                                                                                                                        |
| `Checkbox`                            | Single boolean in a submitted form; consent; indeterminate parent         | Instant setting → `Toggle`                                                                                                                                                                                                                     |
| `CheckboxGroup` + `CheckboxGroupItem` | Pick any of ≤ ~7 options                                                  | Many options → Autocomplete multi                                                                                                                                                                                                              |
| `Radio`, `RadioGroup`                 | Pick exactly 1 of 2–5, all visible                                        | 6+ → Select                                                                                                                                                                                                                                    |
| `Toggle`                              | Binary setting that applies immediately                                   | In a form submitted later → Checkbox                                                                                                                                                                                                           |
| `Slider`                              | Approximate value or range in bounds, with visible value                  | Precise values → NumberInput                                                                                                                                                                                                                   |
| `Rating`                              | Collect or show a star rating                                             | Precise scores → NumberInput                                                                                                                                                                                                                   |
| `DatePicker`                          | A single date                                                             | Birth dates: make sure typing works                                                                                                                                                                                                            |
| `DateRangePicker`                     | A date span; use presets for analytics                                    | -                                                                                                                                                                                                                                              |
| `ColorPicker`                         | User picks a color (themes, labels)                                       | Choosing from ≤ 8 brand colors → RadioGroup of swatches                                                                                                                                                                                        |
| `FilePicker`                          | Upload files (drag-and-drop zone plus browse)                             | -                                                                                                                                                                                                                                              |

## Forms

| Component                         | Use when                                                                                                                                                                                                                   |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FormBuilder`                     | Config-driven forms with consistent layout and validation (`layout`: vertical / horizontal / grid; `guardUnsaved` warns before leaving with unsaved changes). Hooks: `useFormState`, `useFormValidation`, `useFormContext` |
| `validators`, `combineValidators` | Reusable validation rules for Input/FormBuilder                                                                                                                                                                            |

## Overlays & feedback

| Component / hook                                           | Use when                                                                                                                   | Avoid when / instead                        |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `Tooltip`                                                  | Short text hint for a focusable control                                                                                    | Essential info, rich content → Popover      |
| `Popover`                                                  | Rich or interactive non-modal content anchored to a trigger                                                                | Blocking task → Dialog                      |
| `Dropdown`                                                 | Button that opens a list of **actions**                                                                                    | Choosing a form value → Select              |
| `Menu`, `MenuList`, `MenuItem`, `MenuGroup`, `MenuDivider` | Action or option list primitive, context menus, checkable items (`selectionMode`)                                          | -                                           |
| `Dialog` (+ `DialogHeader/Body/Footer`), `useDialog`       | Modal task or content that must be completed or cancelled. `size`: xs–xl, full                                             | Long forms → page; quick confirm → useAlert |
| `Alert`, `useAlert`                                        | Blocking confirm/info dialog with presets: `confirm`, `error`, `warning`, `success`, `info`. Returns a Promise<boolean>    | Non-blocking → toast                        |
| `Toast`, `useToast`, `useAsyncToast`                       | Transient, non-blocking feedback on the user's action. Variants: info/success/warning/error/loading. Supports one `action` | Critical errors → inline or Alert           |
| `LoadingOverlay`                                           | Blocking a region (`mode="container"`) or the app (`fullscreen`) during a load                                             | Button-triggered → Button `loading`         |
| `Portal`                                                   | Render children outside the DOM hierarchy (custom overlays)                                                                | Use the overlays above first                |

## Display

| Component                                                                     | Use when                                                                                                            | Avoid when / instead                                       |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `Icon`                                                                        | SVG icons from the registry (`name`, `size`). Decorative by default                                                 | -                                                          |
| `Avatar`                                                                      | A person or entity (image, initials, icon); `variant`: circular/rounded/square                                      | -                                                          |
| `Badge`                                                                       | A count or very short status attached to something                                                                  | Removable → Chip; category → Tag                           |
| `StatusIndicator`                                                             | Live state dot (+ `withText`); `pulse` for active incidents only                                                    | -                                                          |
| `Tag`                                                                         | Category or metadata label on an item (`removable` optional)                                                        | User-selected value → Chip                                 |
| `Chip`                                                                        | User-selected value, removable (`onRemove`)                                                                         | Static category → Tag                                      |
| `Pill`                                                                        | Compact selectable or quick-filter option; `variant`: filled/outlined/subtle; `color`                               | Counts → Badge                                             |
| `Card`                                                                        | Container for one entity or topic; `variant`: outlined/elevated/filled; `padding`; `header`/`footer`; `interactive` | Comparing many items → Table                               |
| `Accordion`, `AccordionContainer`                                             | Several collapsible sections (`mode`: single/multiple)                                                              | Content most users need → show it                          |
| `Collapse`                                                                    | A single animated show/hide region                                                                                  | -                                                          |
| `Tabs`, `TabList`, `Tab`, `TabPanel`                                          | Parallel views in the same context; `variant`: line/enclosed/soft-rounded/solid-rounded                             | Steps → Stepper; app nav → NavLink                         |
| `Table` (+ parts)                                                             | Presentational tabular data, sorting/selection hooks                                                                | Full CRUD list → DataTable                                 |
| `List` (+ `ListItem`, `ListGroup`, `ListSearch`, `ListSkeleton`, `ListEmpty`) | Collections with a primary line plus a few attributes, selection, grouping, infinite scroll                         | Column comparison → DataTable                              |
| `KPI`                                                                         | A headline metric with `change`, `changeType` and `trend`                                                           | -                                                          |
| `ProgressBar`                                                                 | Determinate progress (or indeterminate when unknown) for long tasks; quotas                                         | Short waits → Spinner/Skeleton                             |
| `CircularProgress`                                                            | Compact determinate progress or a percentage ring                                                                   | -                                                          |
| `Spinner`                                                                     | Short indeterminate wait in a small area                                                                            | Known layout → Skeleton                                    |
| `Skeleton`                                                                    | Placeholder shaped like the loading content                                                                         | -                                                          |
| `PageMessages`                                                                | Whole-view states: loading, error, empty, notFound, forbidden, unauthorized, offline, timeout, maintenance          | Field errors → inline                                      |
| `ScrollArea`                                                                  | Scroll container with styled scrollbars                                                                             | Page scrolling → native                                    |
| `OverflowText`                                                                | Truncate one line and reveal the full text on hover/focus                                                           | Text needed to tell items apart                            |
| `TruncatedList`                                                               | "A, B, C +3" lists of labels                                                                                        | -                                                          |
| `Carousel`                                                                    | Browsing a few visual slides (marketing, galleries). Must have pause                                                | Important content (users rarely see slides past the first) |
| `FlipCard`, `Reveal`, `CountUp`                                               | Marketing and storytelling motion only (MOTION-1)                                                                   | Routine product UI                                         |

## Navigation

| Component                                                                                  | Use when                                                                           |
| ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `Navbar` (+ `NavbarBrand`, `NavbarNav`, `NavbarActions`, `NavbarToggle`, `NavbarCollapse`) | Top app bar; `position`: fixed/sticky/static; `variant`: solid/transparent/blur    |
| `NavLink`                                                                                  | A navigation link with an `active` state; `variant`: default/underline/pill/ghost  |
| `SideNav` (+ `SideNavItem`, `SideNavGroup`, `SideNavDivider`)                              | Vertical app navigation for 7+ sections or nested sections                         |
| `CollapsibleSidebar`                                                                       | Collapsible container for SideNav or a secondary panel                             |
| `BottomNavigation` (+ `BottomNavigationItem`)                                              | Mobile primary nav with 3–5 destinations, icon + label                             |
| `Breadcrumbs` (+ `BreadcrumbItem`, `useBreadcrumbsFromPath`)                               | Location in a hierarchy ≥ 3 levels deep                                            |
| `Pagination`                                                                               | Paging through results; `variant`: default/outlined/minimal                        |
| `Stepper`, `Step`                                                                          | Linear multi-step process (3–7 steps); `variant`: numbered/dot/icon; `orientation` |

## Layout

| Component                                           | Use when                                                                   |
| --------------------------------------------------- | -------------------------------------------------------------------------- |
| `AdaptiveGrid`                                      | Responsive grid of equal-width items (`minItemWidth`, `gap`, `maxColumns`) |
| `MasonryLayout`                                     | Variable-height tiles                                                      |
| `ResponsiveStack`                                   | Horizontal on wide screens, vertical below a breakpoint                    |
| `Panes`, `Pane`                                     | Fixed split layouts (list/detail)                                          |
| `ResizablePanels`, `ResizablePanel`, `ResizeHandle` | User-resizable split layouts                                               |

## Filters (data views)

| Component         | Use when                                                                                                                                                                                      |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FilterProvider`  | State container for a set of filter definitions                                                                                                                                               |
| `FilterBar`       | Fewer than ~5 filters, inline above data                                                                                                                                                      |
| `FilterSidebar`   | 5–15 filters, desktop                                                                                                                                                                         |
| `FilterModal`     | Filters on mobile                                                                                                                                                                             |
| `FilterPopover`   | Filters behind a toolbar button                                                                                                                                                               |
| `FilterAccordion` | Many grouped filters in a sidebar                                                                                                                                                             |
| `ActiveFilters`   | Always show applied filters as removable chips                                                                                                                                                |
| Field filters     | `TextFilter`, `SelectFilter`, `MultiSelectFilter`, `CheckboxFilter`, `ToggleFilter`, `NumberFilter`, `NumberRangeFilter`, `DateFilter`, `DateRangeFilter`, `RatingFilter`, `ListSelectFilter` |

## Patterns

| Component   | Use when                                                                                                                                                                                       |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DataTable` | **Default for admin/CRUD collections**: columns, search, auto-derived filters, sort, selection, pagination or infinite scroll, client/server `mode`, URL sync, empty/loading states, `caption` |

## Drag and drop

| Component                     | Use when                                     |
| ----------------------------- | -------------------------------------------- |
| `DndProvider`                 | Required wrapper for the dnd components      |
| `SortableList`                | Reorder a vertical list                      |
| `SortableGrid`                | Reorder grid tiles                           |
| `KanbanBoard` (+ column/card) | Move items between status columns            |
| `DragHandle`                  | Visible grab affordance (always provide one) |
| `DragOverlay`                 | Custom drag preview                          |

## App builder (`/app`)

A separate entry for wiring pages to data, the URL, permissions and app services. Import from
`@true-tech-team/ui-components/app` (needs `@tanstack/react-query`; the main entry does not).

```ts
import { AppProvider, Page, Section, usePageParams } from '@true-tech-team/ui-components/app';
```

Provider order is `GlobalProvider` outside, `AppProvider` inside. With the order reversed, `AppLink`
navigation guards silently stop working. In development, `AppProvider` warns when no `GlobalProvider` is above it.
`AppProvider` renders its own Dialog, Alert and Toast providers inside the app contexts, so toasts
(including `useMutationFeedback`), `useAlert` and `useDialog` content get the app `translate` and
`locale` and can use `/app` hooks. Configure them with its `toastConfig`, `alertConfig` and
`dialogConfig` props.

| Export                                                                          | Purpose / use when                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `AppProvider`                                                                   | Once at the root, inside `GlobalProvider`. Props: `router`, `queryClient`, `translate`, `locale`, `logger`, `analytics`, `auth`, `flags`, `breakpoints`, `titleTemplate`, `debug`                                                    |
| `Page`                                                                          | A routed page: sets the title, sends `page_view`, shows forbidden / loading / error+retry / empty states from `queries`, keeps loaded content on refetch errors (inline alert), error boundary, page store. Render the `h1` yourself |
| `Section`                                                                       | A region of a page with its own states and error boundary, so one failure does not take down siblings                                                                                                                                |
| `Loadable`                                                                      | Marks a data-dependent piece of a `Page`/`Section` and its skeleton `shape` (`text`, `heading`, `box`, `card`, `avatar`, `table`) while the owner's queries are pending. Function children run only once loaded                      |
| `ErrorBoundary`                                                                 | Catch render errors in a custom region (Page and Section already include one)                                                                                                                                                        |
| `usePage`, `usePageMeta`                                                        | Read the enclosing page id and title; set title and description in custom layouts                                                                                                                                                    |
| `usePageStore`                                                                  | `[state, dispatch]` of the Page `reducer`, for UI state shared across the page                                                                                                                                                       |
| `usePageParams(schema)`, `param`                                                | Typed URL search params (`param.string/number/boolean/enum/array`); shareable filters, sort, page                                                                                                                                    |
| `usePreference(key, default, { storage })`                                      | One remembered setting: in the URL (default) or `localStorage` (`'local'`)                                                                                                                                                           |
| `useMutationFeedback`, `createOptimisticHandlers`                               | Toast or inline success/error for a mutation; optimistic cache update with rollback                                                                                                                                                  |
| `LastUpdated`                                                                   | "Updated 3 minutes ago" with a refresh button for a query                                                                                                                                                                            |
| `AppLink`, `useAppNavigate`                                                     | In-app navigation that respects unsaved-changes guards. Use instead of the router's own Link or push when a form can be dirty                                                                                                        |
| `useBrowserRouter`, `createNextRouter`, `createReactRouter`, `useRouterAdapter` | Router adapters: History API (default), Next.js App Router, React Router. Built from your router's own hooks, so the library imports neither                                                                                         |
| `useLogger`, `useLogBuffer`, `useTrack`                                         | Scoped logging and analytics events                                                                                                                                                                                                  |
| `useAuth`, `useCan`, `Can`                                                      | Permission checks; hide or disable what the user cannot do                                                                                                                                                                           |
| `useFlag`, `Feature`                                                            | Feature flags                                                                                                                                                                                                                        |
| `useAppTranslation`, `useFormatters`, `useAppConfig`                            | App `t()`, locale-bound formatters, the raw provider config                                                                                                                                                                          |
| `DebugPanel`                                                                    | Query, store, param and log inspector, mounted by `Page` when `debug` is on (default outside production)                                                                                                                             |

While its queries are pending, a `Page` or `Section` still renders its children (headings, static
text, layout) inside a disabled, `aria-busy` region; wrap only the data-dependent parts in
`Loadable` so they show a skeleton in the same shape. The `skeleton` prop replaces the whole body
instead.

`Page` ids default to a slug of the title; pass `id` when the title is dynamic or translated, so
stored preferences and analytics keep a stable key. `Page` and `Section` show generic error text
for failed queries; `showErrorDetails` opts in to showing the query error's message.

Next.js notes: `AppProvider` needs no `<Suspense>`, but components that read URL params
(`usePageParams`, `usePreference`) need a `<Suspense>` boundary above them. Next.js cannot block
navigation, so unsaved-changes guards cover `AppLink`, `useAppNavigate`, Dialog close and page
unload, but not the browser Back button or your own `router.push`.

### Core additions used with `/app` (main entry)

| Export                                                                                                                    | Purpose / use when                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `formatDateTime`, `formatRelativeTime`, `formatNumber`, `formatCurrency`, `formatPercent`, `formatFileSize`, `formatList` | Locale-aware formatting that never throws. Take a trailing `locale`; in `/app` use `useFormatters()`                                               |
| `useBreakpoint`, `useBreakpointValue`, `BreakpointsProvider`                                                              | Current named breakpoint (`phone`/`tablet`/`laptop`/`desktop`), `up()`/`down()`, per-breakpoint values. SCSS: `@include bp(name)`, `bp-down(name)` |
| `useUnsavedChanges(isDirty)`                                                                                              | Guard a custom form; `FormBuilder guardUnsaved` does it for config forms                                                                           |
| `LabelsProvider`, `useLabels`, `useLocale`, `DEFAULT_LABELS`                                                              | Translatable built-in text (see `foundations/labels.md`). `GlobalProvider` and `AppProvider` take `labels`, `translate`, `locale`                  |

## Hooks (non-visual)

`useDialog`, `useAlert`, `useToast`, `useAsyncToast`, `usePageMessages` (feedback) ·
`useUrlState` (shareable view state) · `useLocalStorage` (persist preferences) · `useMediaQuery`
(responsive logic; prefer CSS when possible) · `useResizeObserver`, `useIntersectionObserver` ·
`useClipboard` (copy, with a confirmation toast) · `useTimeout`, `useInterval`, `usePrevious` ·
`useUnsavedChanges` (warn on page unload, guarded navigation and Dialog close while a form is
dirty; `useNavigationGuard` / `NavigationGuardProvider` expose the registry that router adapters
call before navigating).
