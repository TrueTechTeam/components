# App Builder Foundation (PR 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a separate `@true-tech-team/ui-components/app` entry with `AppProvider`, router
adapters, `Page`/`Section` with built-in states, and page plumbing (URL params, preferences, auth,
flags, logging, analytics, mutations, live data, debug panel), plus core-entry additions every app
needs: translatable built-in text, `Intl` formatters, named breakpoints and an unsaved-changes guard.

**Architecture:** Core (`src/index.ts`) gains dependency-free contexts (labels, breakpoints,
navigation guard) that work with or without the app layer. The app entry (`src/app/index.ts`)
imports core, depends on `@tanstack/react-query`, and feeds its config (translate, locale,
breakpoints, router) into the core contexts. Router adapters are built by injecting the host
router's own hooks, so the library imports no router or framework.

**Tech Stack:** React 18/19, TypeScript, TanStack Query v5, SCSS modules, Vite library mode
(multi-entry), Jest + RTL, Storybook 10.

**Spec:** `docs/superpowers/specs/2026-11-01-app-builder-design.md` §5 (incl. §5.1a). Read it first.
Branch: `feat/app-builder` (PR 1 Theme Builder already on it; owner will validate and merge all
pieces together).

## Global Constraints

- `src/index.ts` (core) must not import anything from `src/app`. App code may import core.
- `/app` requires `@tanstack/react-query` v5 (optional peer of the package, required by `/app`).
  `/app` never imports `i18next`/`react-i18next`, `next`, or `react-router`.
- No new runtime dependency for core. Only new devDependency: `@tanstack/react-query@^5`.
- Both entries ship with the `'use client'` banner; contexts must exist once across both entries
  (shared chunk), never duplicated per entry.
- Built-in English text must render exactly as today when no labels/translate are supplied;
  explicit per-instance props (e.g. `aria-label`) keep winning over labels.
- Formatters are built on `Intl`; locale from `AppProvider` when given, else `navigator.language`
  (fallback `'en-US'` when `navigator` is undefined, e.g. SSR).
- Breakpoints (min-width): phone 0, tablet 600px, laptop 1024px, desktop 1440px.
- Follow `CLAUDE.md`: SCSS modules + tokens, component folder structure, CSF3 stories, RTL tests,
  component checklist MUSTs, update `guidelines/components/catalog.md` / `choosing.md` /
  `foundations/tokens.md` when adding components/tokens.
- Commit messages: Conventional Commits; never `#` followed by hex or digits.
- Every task ends with `npm run lint`, `npm run typecheck` and the task's tests passing; the final
  task runs all CI checks.

## Decisions made while planning (ledger these as rulings)

- **P1** No new `EmptyState`/`ErrorState` components: `PageMessages` already implements
  loading/error/empty/forbidden/not-found with `size` and actions (spec §5.4 assumed a gap that
  doesn't exist). `Page` uses it full size, `Section` uses `size="sm"`.
- **P2** Router adapters are factories over injected hooks (`createNextRouter({ useRouter,
usePathname, useSearchParams, Link })`, `createReactRouter({ useNavigate, useLocation,
useSearchParams, Link, useBlocker? })`) exported from `/app` itself. No `/app/adapters/*`
  sub-entries and no framework devDependencies are needed, and nothing framework-specific is
  imported.
- **P3** New `Intl` date formatter is named `formatDateTime` because core already exports a
  pattern-based `formatDate` from `dateUtils` (kept unchanged).
- **P4** Built-in label keys are passed to an app `translate` function with the prefix `ui.`
  (e.g. `ui.dialog.close`) so they can't collide with app keys. A translate result is used only if
  it is a non-empty string different from the key it was given (i18next returns the key when
  missing); otherwise `labels` overrides, then English defaults.
- **P5** Mutation feedback channels are `'toast'` and `'inline'`. `'pageMessage'` is dropped:
  `PageMessages` represents whole-view states, not transient notices.
- **P6** Navigation confirmation uses `window.confirm` (synchronous, which router blockers and
  `beforeunload` require). Message from label `unsavedChanges.confirm`.
- **P7** Back/forward blocking is guaranteed with the browser adapter and a React Router data
  router; with Next.js, browser back and the app's own `router.push` are not caught (documented).
- **P8** PAGE-4's nav-collapse rule moves from `< 769px` to `< laptop (1024px)`; existing
  `768px` media queries inside List/Table are left as-is.

## Review Focus

1. A component rendered **without** any provider (no GlobalProvider, no AppProvider) must still
   render English text and not throw → test in Task 1 and Task 2/3 component tests.
2. An i18next-style `translate` that returns the key for missing entries must fall back to English,
   not show `ui.dialog.close` on screen → test in Task 1.
3. `usePageParams` with malformed URL values (`?page=abc`, unknown enum, repeated keys) must yield
   defaults, never `NaN`/invalid values, and setting a value equal to its default removes it from
   the URL → test in Task 8.
4. SSR / no `window`: importing either entry and rendering `AppProvider` + `Page` on the server
   (`renderToString`) must not throw (no `window`/`document`/`navigator`/`matchMedia` at module
   scope or during render) → test in Task 9.
5. One `Section` throwing during render must show its own error state while siblings and the page
   keep rendering, and the error reaches `logger.error` once → test in Task 9.

---

## File Structure

```
src/lib/contexts/LabelsContext/        LabelsProvider, useLabels, DEFAULT_LABELS (Task 1)
src/lib/contexts/BreakpointsContext/   BreakpointsProvider, defaults (Task 5)
src/lib/contexts/NavigationGuardContext/ registry + useNavigationGuard (Task 6)
src/lib/hooks/useBreakpoint/           useBreakpoint, useBreakpointValue (Task 5)
src/lib/hooks/useUnsavedChanges/       (Task 6)
src/lib/utils/format.ts                Intl formatters (Task 4)
src/lib/styles/mixins/_breakpoints.scss  $breakpoints map + bp mixins (Task 5)
src/lib/components/**                  label conversions (Tasks 2–3); Dialog guard (Task 6);
                                       FormBuilder guardUnsaved (Task 6)
src/lib/providers/GlobalProvider/      labels/translate/breakpoints props (Tasks 1, 5)
guidelines/foundations/labels.md       (Task 1, extended by 2–3)
src/app/index.ts                       public barrel for /app (Task 7, grows each task)
src/app/AppProvider/                   AppProvider, AppContext, hooks (Task 7)
src/app/router/                        RouterAdapter type, browser adapter, factories,
                                       AppLink, useAppNavigate (Task 8)
src/app/params/                        usePageParams, param codecs, usePreference (Task 8)
src/app/page/                          ErrorBoundary, Page, Section, PageContext, usePageStore,
                                       usePageMeta (Task 9)
src/app/data/                          useMutationFeedback, createOptimisticHandlers,
                                       LastUpdated (Task 10)
src/app/debug/                         DebugPanel (Task 11)
src/app/**/*.stories.tsx               'App Builder/Foundation/…' (Task 12)
vite.config.ts, package.json, .storybook/preview.tsx (Task 7)
```

---

### Task 1: Core labels mechanism

**Files:** Create `src/lib/contexts/LabelsContext/{LabelsContext.tsx,defaultLabels.ts,index.ts,LabelsContext.test.tsx}`;
modify `src/lib/contexts/index.ts`, `src/lib/providers/GlobalProvider/GlobalProvider.tsx` (+ test),
`src/index.ts`; create `guidelines/foundations/labels.md`; link it from `guidelines/README.md` and
`guidelines/llms.txt`.

**Interfaces — Produces:**

```ts
export type LabelVars = Record<string, string | number>;
export type TranslateFn = (key: string, vars?: LabelVars) => string | undefined | null;
export const DEFAULT_LABELS: Record<string, string>; // flat 'component.key' → English
export type LabelKey = keyof typeof DEFAULT_LABELS; // typed via `as const satisfies`
export interface LabelsProviderProps {
  labels?: Partial<Record<string, string>>;
  translate?: TranslateFn;
  children: ReactNode;
}
export function LabelsProvider(props: LabelsProviderProps): JSX.Element;
export function useLabels(): (key: string, vars?: LabelVars) => string; // works without a provider
export function interpolate(template: string, vars?: LabelVars): string; // '{name}' placeholders; unknown → left as-is
// GlobalProvider gains props: labels?: Partial<Record<string, string>>; translate?: TranslateFn
```

Resolution order (P4): `translate('ui.' + key, vars)` if non-empty and `!== 'ui.' + key` → else
`labels[key]` → else `DEFAULT_LABELS[key]` → else the key itself. `labels` values and defaults are
interpolated. Nested providers: inner `labels` merge over outer; inner `translate` wins.

Start `DEFAULT_LABELS` with: `'common.close': 'Close'`, `'common.loading': 'Loading…'`,
`'unsavedChanges.confirm': 'You have unsaved changes. Leave anyway?'`. Tasks 2–3 add the rest.

- [ ] **Step 1: Failing tests**

```ts
it('returns English defaults with no provider', () => {
  /* renderHook(useLabels) → t('common.close') === 'Close' */
});
it('applies labels overrides and interpolation', () => {
  /* labels {'x.y': 'Hi {name}'} → t('x.y',{name:'Ann'}) === 'Hi Ann' */
});
it('prefers translate and prefixes keys with ui.', () => {
  /* translate spy called with 'ui.common.close' → returns 'Fermer' */
});
it('falls back when translate returns the key, empty, null or undefined', () => {
  for (const r of ['ui.common.close', '', null, undefined]) {
    /* translate → r ⇒ 'Close' */
  }
});
it('inner provider labels merge over outer', () => {});
it('GlobalProvider passes labels and translate through', () => {});
```

- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement; `labels.md` explains resolution order, the
      `ui.` prefix, and has a table of keys (Tasks 2–3 extend it); export `DEFAULT_LABELS` so apps can
      build translation files. **Step 4:** PASS; lint, typecheck.
- [ ] **Step 5: Commit** `feat(labels): add translatable built-in text with English defaults`

---

### Task 2: Convert built-in text — buttons, display, overlays, navigation, layout

**Files:** every non-story, non-test `.tsx` under `src/lib/components/{buttons,display,overlays,navigation,layout}`
with user-facing literals (from the audit: ButtonGroup, ToggleButton, Carousel, Chip, List/_,
PageMessages, Pill, Spinner, Table/_, Dialog, Toast/_, plus any found in navigation/_ such as
Pagination, Breadcrumbs, Stepper, CollapsibleSidebar, Navbar, BottomNavigation, and layout/\*).
Modify `defaultLabels.ts`, `guidelines/foundations/labels.md`.

**Interfaces — Consumes:** Task 1 `useLabels`, `DEFAULT_LABELS`.

What counts as user-facing: JSX text, `aria-label`, `aria-roledescription`, `title`, `alt`,
`placeholder`, default prop values that render text (e.g. `emptyText = 'No items'`), and strings
built for screen readers (e.g. `` `Page ${n} of ${total}` `` → `pagination.pageOf` with vars).
Not user-facing: `className`, test ids, `console` messages, prop docs.

Rules: key = `<componentCamel>.<purpose>` (e.g. `dialog.close`, `pagination.previous`,
`carousel.slideOf`). A default-valued text prop keeps its prop: make the default `undefined` and
fall back to `t(key)` at render, so explicit props win. English text must be byte-identical to the
current literal.

- [ ] **Step 1: Audit.** `grep -rnE "aria-label=\"|aria-label=\{'|title=\"[A-Z]|placeholder=\"|>[A-Z][a-z]+[^<{]*<|= '[A-Z][a-z ]+'" src/lib/components/{buttons,display,overlays,navigation,layout} --include=*.tsx`
      (exclude stories/tests) plus a manual read of each listed file; record the list in your report.
- [ ] **Step 2: Failing tests.** For each converted component add one test to its existing test
      file: wrapped in `<LabelsProvider labels={{ '<key>': 'X' }}>`, the converted string renders as
      'X' (by text or accessible name). Existing tests asserting English text must keep passing
      untouched (they prove defaults are unchanged).
- [ ] **Step 3:** Run → new tests FAIL. **Step 4:** Convert; add keys to `DEFAULT_LABELS` and the
      `labels.md` table. **Step 5:** PASS; full `npx jest` (no existing test edited), lint, typecheck.
- [ ] **Step 6: Commit** `feat(labels): translate built-in text in buttons, display, overlays and navigation`

---

### Task 3: Convert built-in text — inputs, filters, forms, patterns, dnd

Same as Task 2 for `src/lib/components/{inputs,filters,forms,patterns,dnd}` (audit hits include
Autocomplete, ColorPicker, DatePicker, DateRangePicker, FilePicker, Input, NumberInput, PhoneInput,
Select, filters/core/ActiveFilters, filters/fields/_, filters/layouts/_, DataTable; plus month/day
names: DatePicker/DateRangePicker month and weekday names come from `dateUtils` `getMonthName` /
`getDayName` — switch the pickers to `Intl.DateTimeFormat(locale, { month: 'long' | 'short' })` /
`{ weekday: 'short' }` using locale from a new `useLocale()`. English output must stay identical
for `en-US`.)

**Interfaces — Produces (adds to Task 1):** `LabelsProviderProps.locale?: string`;
`export function useLocale(): string` (nearest provider's locale, else `resolveLocale()` from
Task 4 — if Task 4 isn't merged yet, inline `navigator.language` with `'en-US'` fallback and switch
to `resolveLocale` when it lands); `GlobalProvider` gains `locale?: string`. Task 7's
`AppProvider` passes its `locale` to `LabelsProvider`.

- [ ] Steps as Task 2 (audit → failing per-component tests → convert → PASS, no existing test edited).
      Extra test: DatePicker with `<GlobalProvider locale="fr-FR">` renders `janvier`.
- [ ] **Commit** `feat(labels): translate built-in text in inputs, filters, forms and data table`

---

### Task 4: `Intl` formatters (core)

**Files:** Create `src/lib/utils/format.ts`, `src/lib/utils/format.test.ts`; export from
`src/lib/utils/index.ts` and `src/index.ts`.

**Interfaces — Produces** (all accept an optional trailing `locale?: string`, default per Global
Constraints; invalid input returns `''`, never throws):

```ts
export function formatDateTime(
  value: Date | string | number,
  opts?: Intl.DateTimeFormatOptions,
  locale?: string
): string; // default { dateStyle: 'medium' }
export function formatRelativeTime(
  value: Date | string | number,
  opts?: { now?: Date | number; numeric?: 'always' | 'auto' },
  locale?: string
): string; // picks largest unit: seconds<60, minutes<60, hours<24, days<7, weeks<5, months<12, years
export function formatNumber(
  value: number,
  opts?: Intl.NumberFormatOptions,
  locale?: string
): string;
export function formatCurrency(
  value: number,
  currency: string,
  opts?: Intl.NumberFormatOptions,
  locale?: string
): string;
export function formatPercent(
  value: number,
  opts?: { fractionDigits?: number; isRatio?: boolean },
  locale?: string
): string; // isRatio default true (0.25 → 25%)
export function formatFileSize(
  bytes: number,
  opts?: { binary?: boolean; fractionDigits?: number },
  locale?: string
): string; // decimal (kB, MB…) default; binary → KiB, MiB…; 1 fraction digit default, 0 for bytes
export function formatList(
  items: string[],
  opts?: { type?: 'conjunction' | 'disjunction' | 'unit'; style?: 'long' | 'short' | 'narrow' },
  locale?: string
): string;
export function resolveLocale(locale?: string): string;
```

- [ ] **Step 1: Failing tests** (pin `'en-US'`):

```ts
expect(formatDateTime(new Date(2026, 0, 5), undefined, 'en-US')).toBe('Jan 5, 2026');
expect(
  formatRelativeTime(new Date(2026, 0, 1, 11, 57), { now: new Date(2026, 0, 1, 12, 0) }, 'en-US')
).toBe('3 minutes ago');
expect(
  formatRelativeTime(new Date(2026, 0, 2), { now: new Date(2026, 0, 1), numeric: 'auto' }, 'en-US')
).toBe('tomorrow');
expect(formatCurrency(1234.5, 'USD', undefined, 'en-US')).toBe('$1,234.50');
expect(formatPercent(0.256, { fractionDigits: 1 }, 'en-US')).toBe('25.6%');
expect(formatFileSize(1536, undefined, 'en-US')).toBe('1.5 kB');
expect(formatFileSize(1536, { binary: true }, 'en-US')).toBe('1.5 KiB');
expect(formatFileSize(512, undefined, 'en-US')).toBe('512 B');
expect(formatList(['a', 'b', 'c'], undefined, 'en-US')).toBe('a, b, and c');
for (const bad of ['nope', NaN, Infinity]) expect(formatDateTime(bad as never)).toBe('');
expect(formatNumber(NaN)).toBe('');
expect(resolveLocale()).toBeTruthy(); // navigator fallback
```

- [ ] **Step 2:** FAIL. **Step 3:** Implement; cache `Intl` formatter instances by
      `locale + JSON.stringify(opts)`. **Step 4:** PASS. **Step 5: Commit** `feat(utils): add Intl-based date, number, currency, size and list formatters`

---

### Task 5: Named breakpoints (core)

**Files:** Create `src/lib/styles/mixins/_breakpoints.scss` (forward it wherever mixins are
forwarded), `src/lib/contexts/BreakpointsContext/*`, `src/lib/hooks/useBreakpoint/*` (+ tests);
modify `GlobalProvider` (prop `breakpoints?: Partial<Breakpoints>`), `src/index.ts`,
`guidelines/foundations/tokens.md` (breakpoints section), `guidelines/patterns/page-layout.md`
PAGE-4 (P8), `guidelines/foundations/spacing-layout.md` if it names breakpoints.

**Interfaces — Produces:**

```scss
$breakpoints: (
  phone: 0,
  tablet: 600px,
  laptop: 1024px,
  desktop: 1440px,
);
@mixin bp($name) {
  @media (width >= map.get($breakpoints, $name)) {
    @content;
  }
}
@mixin bp-down($name) {
  @media (width < map.get($breakpoints, $name)) {
    @content;
  }
}
```

```ts
export type BreakpointName = 'phone' | 'tablet' | 'laptop' | 'desktop';
export type Breakpoints = Record<BreakpointName, number>; // px min-widths
export const DEFAULT_BREAKPOINTS: Breakpoints; // { phone: 0, tablet: 600, laptop: 1024, desktop: 1440 }
export function BreakpointsProvider(p: {
  breakpoints?: Partial<Breakpoints>;
  children: ReactNode;
}): JSX.Element;
export function useBreakpoint(): {
  name: BreakpointName;
  isPhone: boolean;
  isTablet: boolean;
  isLaptop: boolean;
  isDesktop: boolean;
  up(n: BreakpointName): boolean;
  down(n: BreakpointName): boolean;
};
export function useBreakpointValue<T>(values: Partial<Record<BreakpointName, T>>): T | undefined; // mobile-first: nearest defined at or below current
```

Hooks build on existing `useMediaQuery`; with no `window` (SSR) they report `'laptop'`.

- [ ] **Step 1: Failing tests** (mock `matchMedia` for widths 375, 768, 1280, 1600):
      names `phone/tablet/laptop/desktop`; `useBreakpointValue({ phone: 1, laptop: 3 })` → 1, 1, 3, 3;
      provider override `{ tablet: 700 }` makes 650 → `phone`; SSR (no matchMedia) → `laptop`.
- [ ] **Step 2–4:** FAIL → implement (+ docs) → PASS.
- [ ] **Step 5: Commit** `feat(layout): add named breakpoints with SCSS mixins and hooks`

---

### Task 6: Unsaved-changes guard (core)

**Files:** Create `src/lib/contexts/NavigationGuardContext/*`, `src/lib/hooks/useUnsavedChanges/*`
(+ tests); modify `src/lib/components/overlays/Dialog/Dialog.tsx` (+ test),
`src/lib/components/forms/FormBuilder/{FormBuilder.tsx,types.ts}` (+ test, + story),
`GlobalProvider` (mount `NavigationGuardProvider`), `src/index.ts`.

**Interfaces — Produces:**

```ts
export interface NavigationGuard {
  isBlocking(): boolean;
  message: string;
}
export interface NavigationGuardApi {
  register(guard: NavigationGuard): () => void;
  isBlocked(): boolean;
  confirmNavigation(): boolean; // true if nothing blocks, else window.confirm(message of first blocking guard)
}
export function NavigationGuardProvider(p: { children: ReactNode }): JSX.Element;
export function useNavigationGuard(): NavigationGuardApi; // falls back to a module-level registry when no provider
export function useUnsavedChanges(
  isDirty: boolean,
  opts?: { message?: string; enabled?: boolean }
): { confirmLeave(): boolean };
// FormBuilderProps gains: guardUnsaved?: boolean (default false); guardMessage?: string
// Dialog: when a close is requested (close button, Escape, backdrop) and any guard registered inside
//         this Dialog is blocking, it calls confirm; cancel keeps it open.
```

Behavior: `useUnsavedChanges` registers with the nearest Dialog-scoped registry if inside a Dialog
(Dialog provides its own `NavigationGuardProvider` scope) **and** the global one; while dirty and
enabled it adds a `beforeunload` listener (`preventDefault` + `returnValue = ''`). Default message
from label `unsavedChanges.confirm`. FormBuilder with `guardUnsaved` uses its `isDirty`, and stops
blocking after `onSubmit` resolves (reset baseline to submitted values).

- [ ] **Step 1: Failing tests**

```ts
it('adds beforeunload only while dirty', () => {});
it('confirmNavigation returns true when clean, else window.confirm result', () => {});
it('Dialog close asks for confirmation when a guarded form inside is dirty; cancel keeps it open', () => {});
it('Dialog closes without asking when the form is clean', () => {});
it('FormBuilder guardUnsaved stops blocking after a successful submit', () => {});
it('unregisters on unmount', () => {});
```

- [ ] **Step 2–4:** FAIL → implement → PASS. Add a FormBuilder story "Guarded (unsaved changes)".
- [ ] **Step 5: Commit** `feat(forms): add unsaved-changes guard for forms, dialogs and page unload`

---

### Task 7: `/app` entry, packaging and `AppProvider`

**Files:**

- Modify `vite.config.ts` (multi-entry `{ index: 'src/index.ts', app: 'src/app/index.ts' }`,
  output file names `index.mjs`/`index.js` and `app.mjs`/`app.js` unchanged for core, `external`
  adds `@tanstack/react-query` (and any `@tanstack/` subpath), banner applies to all chunks).
- Modify `package.json`: `exports["./app"] = { types: "./app/index.d.ts", import: "./app.mjs",
require: "./app.js" }` (match the actual dts output path — verify after build);
  `peerDependencies["@tanstack/react-query"] = "^5.0.0"`, `peerDependenciesMeta` optional;
  devDependency `@tanstack/react-query@^5` (`npm install -D`).
- Modify `.storybook/preview.tsx` `storySort.order`: insert `'App Builder', ['Foundation', 'Templates', 'Guides']` after `'DnD'` (before `'Patterns'`).
- Create `src/app/index.ts`, `src/app/AppProvider/{AppProvider.tsx,AppContext.ts,hooks.ts,logger.ts,index.ts,AppProvider.test.tsx}`.

**Interfaces — Produces:**

```ts
export interface Logger {
  debug(...a: unknown[]): void;
  info(...a: unknown[]): void;
  warn(...a: unknown[]): void;
  error(...a: unknown[]): void;
}
export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  scope?: string;
  args: unknown[];
  time: number;
}
export interface Analytics {
  track(event: string, props?: Record<string, unknown>): void;
}
export interface AuthConfig<U = unknown> {
  user: U | null;
  can(action: string, subject?: string): boolean;
}
export interface FlagsConfig {
  isEnabled(flag: string): boolean;
}
export interface AppProviderProps {
  children: ReactNode;
  router?: () => RouterAdapter; // a hook (Task 8); default useBrowserRouter
  queryClient?: QueryClient; // default: new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: true } } }) created once
  translate?: TranslateFn;
  locale?: string;
  logger?: Logger;
  analytics?: Analytics;
  auth?: AuthConfig;
  flags?: FlagsConfig;
  breakpoints?: Partial<Breakpoints>;
  titleTemplate?: (title: string) => string; // default t => t
  debug?: boolean; // default process.env.NODE_ENV !== 'production'
}
export function AppProvider(p: AppProviderProps): JSX.Element; // QueryClientProvider + LabelsProvider(translate, locale) + BreakpointsProvider + AppContext; does NOT include GlobalProvider (document: put AppProvider inside GlobalProvider)
export function useLogger(scope?: string): Logger; // records every call in a 200-entry ring buffer (for Task 11), then forwards
export function useLogBuffer(): LogEntry[]; // subscribes to buffer updates
export function useTrack(): Analytics['track'];
export function useAuth<U = unknown>(): AuthConfig<U>; // default { user: null, can: () => true }
export function useCan(action: string, subject?: string): boolean;
export function Can(p: {
  action: string;
  subject?: string;
  children: ReactNode;
  fallback?: ReactNode;
}): JSX.Element;
export function useFlag(name: string): boolean; // default false
export function Feature(p: {
  name: string;
  children: ReactNode;
  fallback?: ReactNode;
}): JSX.Element;
export function useAppTranslation(): {
  t: (key: string, vars?: LabelVars) => string;
  locale: string;
}; // app keys: translate(key) or the key itself
export function useFormatters(): {
  dateTime;
  relativeTime;
  number;
  currency;
  percent;
  fileSize;
  list;
}; // Task 4 functions bound to locale
export function useAppConfig(): AppConfigValue; // internal-ish; exported for Page/Debug
```

Default logger: console in development, no-op in production.

- [ ] **Step 1: Failing tests**: provider defaults (`useAuth().can` true, `useFlag` false,
      `useTrack` no-op); `<Can action="edit">` hides children and shows fallback when `can` false;
      `<Feature name="x">` with flags; `useLogger('scope').error('boom')` forwards to custom logger
      and appears in `useLogBuffer()` with scope; `translate` reaches core labels (a Dialog close button
      inside `AppProvider translate={t}` gets the translated name); `useFormatters().currency(5,'EUR')`
      uses `locale`; every `/app` hook used outside `AppProvider` throws
      `'<hookName> must be used within AppProvider'` (test `useAuth` and `useFlag`).
- [ ] **Step 2–4:** FAIL → implement → PASS.
- [ ] **Step 5: Build checks.**

```bash
npm run build
ls dist/app.mjs dist/app.js dist/index.mjs dist/index.js
head -c 20 dist/app.mjs            # "use client"
grep -c "@tanstack/react-query" dist/index.mjs dist/index.js   # 0 and 0
grep -l "LabelsContext\|createContext" dist/*.mjs              # contexts live in a shared chunk imported by both, not duplicated in app.mjs and index.mjs
```

Inspect `dist/package.json` handling: semantic-release writes `dist/package.json` from the root —
confirm how the root `package.json` reaches `dist/` (read `.github/workflows/publish.yml` and
`vite.config.ts`) and make sure `exports["./app"]` paths resolve relative to `dist/`.

- [ ] **Step 6: Commit** `feat(app): add /app entry point with AppProvider, auth, flags, logging and analytics`

---

### Task 8: Router adapters, `AppLink`, `usePageParams`, `usePreference`

**Files:** Create `src/app/router/{types.ts,browserRouter.ts,createNextRouter.ts,createReactRouter.ts,AppLink.tsx,useAppNavigate.ts,index.ts}` (+ tests),
`src/app/params/{codecs.ts,usePageParams.ts,usePreference.ts,index.ts}` (+ tests); export from
`src/app/index.ts`; mark `useUrlState` `@deprecated` (JSDoc only, pointing to `usePageParams`).

**Interfaces — Produces:**

```ts
export interface RouterAdapter {
  Link: ComponentType<{
    href: string;
    children: ReactNode;
    className?: string;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
    'aria-current'?: AriaAttributes['aria-current'];
  }>;
  navigate(href: string, opts?: { replace?: boolean }): void;
  pathname: string;
  searchParams: URLSearchParams;
  setSearchParams(next: URLSearchParams, opts?: { replace?: boolean }): void;
  supportsBlocking: boolean; // true when the adapter itself blocks app-initiated navigation
}
export function useBrowserRouter(): RouterAdapter; // history.pushState/replaceState + popstate; supportsBlocking true; on popstate while blocked & user cancels → pushState back to previous URL
export function createNextRouter(deps: {
  useRouter: () => { push(h: string): void; replace(h: string): void };
  usePathname: () => string;
  useSearchParams: () => URLSearchParams | ReadonlyURLSearchParamsLike;
  Link: ComponentType<any>;
}): () => RouterAdapter; // supportsBlocking false
export function createReactRouter(deps: {
  useNavigate: () => (to: string, o?: { replace?: boolean }) => void;
  useLocation: () => { pathname: string; search: string };
  Link: ComponentType<any>;
  useBlocker?: (shouldBlock: boolean | (() => boolean)) => {
    state: string;
    proceed?(): void;
    reset?(): void;
  };
}): () => RouterAdapter; // supportsBlocking = !!useBlocker
export function useRouterAdapter(): RouterAdapter;
export function AppLink(
  p: {
    href: string;
    children: ReactNode;
    replace?: boolean;
  } & AnchorHTMLAttributes<HTMLAnchorElement>
): JSX.Element; // renders adapter.Link; onClick: if !guard.confirmNavigation() → preventDefault
export function useAppNavigate(): (href: string, opts?: { replace?: boolean }) => void; // confirms via guard first
// params
export interface ParamCodec<T> {
  parse(raw: string | null): T;
  serialize(v: T): string | null;
  default: T;
}
export const param: {
  string(def?: string): ParamCodec<string>; // def ''
  number(def?: number): ParamCodec<number>; // non-finite → def
  boolean(def?: boolean): ParamCodec<boolean>; // 'true'/'1' → true, 'false'/'0' → false, else def
  enum<T extends string>(values: readonly T[], def: T): ParamCodec<T>;
  array(def?: string[]): ParamCodec<string[]>; // comma-separated; '' → []
};
export function usePageParams<S extends Record<string, ParamCodec<any>>>(
  schema: S
): [
  { [K in keyof S]: S[K]['default'] },
  (patch: Partial<{ [K in keyof S]: S[K]['default'] }>, opts?: { replace?: boolean }) => void,
];
// values equal to default are removed from the URL; other params untouched; default replace: true
export function usePreference<T>(
  key: string,
  def: T,
  opts?: { storage?: 'url' | 'local'; codec?: ParamCodec<T> }
): [T, (v: T) => void];
// 'url' (default) → one param via codec (inferred from typeof def when not given);
// 'local' → useLocalStorage key `pref:${pageId}:${key}` (pageId from PageIdContext or 'app'); JSON
export const PageIdContext: Context<string | null>; // src/app/params/PageIdContext.ts — created here, provided by Page in Task 9
```

React Router `useBlocker` integration: when provided, the adapter calls `useBlocker(() => guard.isBlocked())`
and when `state === 'blocked'` runs `confirm` → `proceed()` / `reset()`.

- [ ] **Step 1: Failing tests** (use a fake in-memory adapter for params tests):

```ts
it('parses typed params with defaults', () => {
  /* ?page=3&sort=name → {page:3, sort:'name', q:''} */
});
it.each(['?page=abc', '?page=', '?status=bogus', '?page=1&page=2'])(
  'falls back safely for %s',
  (search) => {
    /* page===1 (default), status===default, never NaN */
  }
);
it('setting a value equal to default removes it; other params kept', () => {
  /* ?page=2&x=1 set page 1 → ?x=1 */
});
it('browser adapter navigate pushes and updates pathname; replace replaces', () => {});
it('AppLink does not navigate when guard blocks and confirm is cancelled', () => {});
it('createNextRouter maps push/replace/pathname/searchParams from injected hooks', () => {});
it('createReactRouter uses useBlocker when provided and proceeds/resets per confirm', () => {});
it('usePreference local storage is namespaced by page id', () => {});
```

- [ ] **Step 2–4:** FAIL → implement → PASS.
- [ ] **Step 5: Commit** `feat(app): add router adapters, guarded links and typed URL params`

---

### Task 9: `ErrorBoundary`, `Page`, `Section`, page store and meta

**Files:** Create `src/app/page/{ErrorBoundary.tsx,PageContext.ts,Page.tsx,Section.tsx,usePageStore.ts,usePageMeta.ts,Page.module.scss,index.ts}` (+ `Page.test.tsx`, `Section.test.tsx`, `ssr.test.tsx`); export from `src/app/index.ts`.

**Interfaces — Consumes:** Task 7 `useLogger`, `useTrack`, `useCan`, `useAppConfig`; core `PageMessages`, `Skeleton`, `useLabels`. **Produces:**

```ts
export class ErrorBoundary extends Component<{
  fallback: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onError?(error: Error, info: ErrorInfo): void;
  resetKeys?: unknown[];
  children: ReactNode;
}> {}
type QueryLike = Pick<
  UseQueryResult<unknown, unknown>,
  'isPending' | 'isError' | 'error' | 'isFetching' | 'data' | 'refetch' | 'dataUpdatedAt'
>;
interface StateProps {
  queries?: QueryLike[];
  isEmpty?: (data: unknown[]) => boolean; // data of each query, in order; only evaluated when all succeeded
  skeleton?: ReactNode; // default: generic Skeleton block (Page) / 3 lines (Section)
  empty?: PageMessagesProps['emptyConfig']; // passed to PageMessages
  permission?: { action: string; subject?: string };
  children: ReactNode;
}
export interface PageProps extends StateProps {
  title: string;
  description?: string;
  id?: string;
  analyticsName?: string;
  reducer?: Reducer<any, any>;
  initialState?: unknown;
}
export interface SectionProps extends StateProps {
  title?: string;
  id?: string;
  headingLevel?: 2 | 3 | 4;
}
export function Page(p: PageProps): JSX.Element;
export function Section(p: SectionProps): JSX.Element;
export function usePage(): {
  id: string;
  title: string;
  description?: string;
  registerQueries(id: string, q: QueryLike[]): () => void;
  queries: Record<string, QueryLike[]>;
};
export function usePageStore<S = unknown, A = unknown>(): [S, Dispatch<A>]; // throws clear error without a page reducer
export function usePageMeta(meta: { title: string; description?: string }): void; // document.title = titleTemplate(title); <meta name="description"> update; restores previous on unmount
```

State precedence (STATE-1 / PageMessages order): no permission → `PageMessages forbidden`; any
`isPending` → skeleton; any `isError` → `PageMessages error` with `onRetry` = refetch every errored
query; `isEmpty` true → `PageMessages empty`; else children. While any query `isFetching` and none
pending → a thin `role="progressbar"` refreshing bar (label `page.refreshing`) above content;
content stays. `Page` emits `track('page_view', { page: analyticsName ?? title })` once on mount and
calls `usePageMeta`. `Page` id default = slug of title (used for preference namespacing). Both wrap
children in `ErrorBoundary` (and `Page` provides `PageIdContext` from Task 8) whose fallback is `PageMessages error` (Section: `size="sm"`) with retry
= reset, and `onError` → `logger.error`. `Section` renders `<section aria-labelledby>` with its
title heading when `title` given, and registers its queries with the page (for Task 11).

- [ ] **Step 1: Failing tests**

```ts
it('shows skeleton while pending, then children', () => {});
it('shows error with retry that refetches every errored query', () => {});
it('shows empty state when isEmpty returns true', () => {});
it('shows forbidden when permission check fails', () => {});
it('keeps content and shows refreshing bar while background fetching', () => {});
it('sets document.title through titleTemplate and restores it on unmount', () => {});
it('tracks one page_view on mount', () => {});
it('usePageStore reads and dispatches the page reducer', () => {});
it('a throwing Section shows its own error while sibling Sections and the Page render; logger.error called once', () => {});
// ssr.test.tsx (@jest-environment node)
it('renders AppProvider + Page + Section with renderToString without touching window', () => {});
```

- [ ] **Step 2–4:** FAIL → implement → PASS.
- [ ] **Step 5: Commit** `feat(app): add Page and Section with built-in states, error boundaries and page store`

---

### Task 10: Mutation feedback, optimistic helper, `LastUpdated`

**Files:** Create `src/app/data/{useMutationFeedback.ts,createOptimisticHandlers.ts,LastUpdated.tsx,LastUpdated.module.scss,index.ts}` (+ tests); export from `src/app/index.ts`.

**Interfaces — Produces:**

```ts
export interface MutationFeedbackOptions<TData, TVars> {
  success?: string | ((data: TData, vars: TVars) => string);
  error?: string | ((err: unknown, vars: TVars) => string); // default label 'mutation.error' ("Something went wrong. Please try again.")
  via?: 'toast' | 'inline'; // default 'toast'
  pending?: string; // toast: shows a loading toast updated on settle
}
export function useMutationFeedback<TData, TErr, TVars>(
  mutation: UseMutationResult<TData, TErr, TVars>,
  opts?: MutationFeedbackOptions<TData, TVars>
): {
  mutate(vars: TVars): void;
  mutateAsync(vars: TVars): Promise<TData>;
  isPending: boolean;
  feedback: { type: 'success' | 'error'; message: string } | null;
  clearFeedback(): void;
};
export function createOptimisticHandlers<TData, TVars>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  update: (old: TData | undefined, vars: TVars) => TData
): {
  onMutate(vars: TVars): Promise<{ previous: TData | undefined }>;
  onError(err: unknown, vars: TVars, ctx?: { previous: TData | undefined }): void;
  onSettled(): Promise<void>;
};
export function LastUpdated(p: {
  query: Pick<UseQueryResult, 'dataUpdatedAt' | 'isFetching' | 'refetch'>;
  refreshable?: boolean;
  className?: string;
}): JSX.Element;
// "Updated 3 minutes ago" (label 'lastUpdated.text' with {time}); re-renders every 30s; IconButton refresh
// (label 'lastUpdated.refresh') disabled + spinning while fetching; nothing rendered when dataUpdatedAt is 0
```

- [ ] **Step 1: Failing tests**: toast success/error via mocked `useToast`; inline mode exposes
      `feedback` and never calls toast; error message default from labels; optimistic: cache updated in
      `onMutate`, restored on `onError`, invalidated on `onSettled` (real `QueryClient`);
      `LastUpdated` text with fake timers advancing 3 minutes; refresh calls `refetch`; hidden when
      `dataUpdatedAt === 0`.
- [ ] **Step 2–4:** FAIL → implement → PASS.
- [ ] **Step 5: Commit** `feat(app): add mutation feedback, optimistic update helper and last-updated indicator`

---

### Task 11: Development debug panel

**Files:** Create `src/app/debug/{DebugPanel.tsx,DebugPanel.module.scss,index.ts,DebugPanel.test.tsx}`; mount it from `Page` when `useAppConfig().debug` is true.

**Behavior:** a small floating toggle button (bottom-right, label `debug.open`, `z-index:
var(--z-popover)`) and `Ctrl+Shift+D` toggle a panel (`role="dialog"`, labelled `debug.title`,
Escape closes, focus moves into it and back to the toggle) with four collapsible sections:
**Queries** (per registered Section/page: status pending/error/success, fetching, last updated via
`formatRelativeTime`), **Page store** (`JSON.stringify` 2-space, truncated at 20 kB with a note),
**URL params** (adapter `searchParams` as a table), **Log** (last 50 `useLogBuffer` entries, newest
first, level badge). Never rendered when `debug` is false (production default). Styles tokens-only.

- [ ] **Step 1: Failing tests**: not rendered with `debug={false}`; toggle opens/closes; Escape
      closes and restores focus; shows a query's status and a logged line; store JSON visible.
- [ ] **Step 2–4:** FAIL → implement → PASS.
- [ ] **Step 5: Commit** `feat(app): add development debug panel for page queries, store, params and logs`

---

### Task 12: Stories, docs and full verification

**Files:** Create stories under `src/app/**` titled `App Builder/Foundation/<Name>`:
`AppProvider` (docs-style overview of all props and the provider nesting), `Page` (states: loading,
error+retry, empty, forbidden, refreshing, content — driven by a real `QueryClient` and fake
fetchers with controls for delay/failure/empty), `Section` (one failing among three), `Unsaved
changes` (guarded FormBuilder in a page and in a Dialog, with the documented Next.js limitation
note), `URL params & preferences` (browser adapter demo), `Mutations` (toast vs inline, optimistic
list), `Formatters` (table of every formatter for a chosen locale), `Breakpoints` (live current
breakpoint + useBreakpointValue), `Labels & translation` (core components switching between English
and a sample French `translate`), `Debug panel`. Use `globalDecorators: 'provider'` and
`layout: 'fullscreen'` where a page fills the canvas.

Docs:

- `guidelines/components/catalog.md` + `choosing.md`: new section **App builder (`/app`)** listing
  every export with one-line purpose and when to use; core additions (formatters, breakpoints hooks,
  `useUnsavedChanges`, FormBuilder `guardUnsaved`, `LabelsProvider`).
- `guidelines/decision-tree.md` §1: branch "Wiring page data, URL state, permissions or app
  services → app builder (`/app`), see catalog" (templates/guidance proper come in PR 3).
- `guidelines/llms.txt`, `guidelines/SKILL.md`: mention `/app` and `labels.md`.
- `README.md`: "App builder" section — install `@tanstack/react-query`, provider nesting
  (`GlobalProvider` → `AppProvider router={…}`), router adapter snippets for Next.js App Router and
  React Router, the Next.js guard limitation (P7), and the translation hookup (`translate={i18n.t}`).
- `CLAUDE.md` directory structure: add `src/app/` and `src/storybook/`.

- [ ] **Step 1:** Stories + docs.
- [ ] **Step 2: CI checks**

```bash
npm run lint && npm run typecheck && npm test && npm run build && npm run storybook:build
grep -c "@tanstack/react-query" dist/index.mjs   # 0
node -e "const i=require('./dist/storybook/index.json');console.log(Object.keys(i.entries).filter(k=>k.startsWith('app-builder-foundation')).length)"  # ≥ 10
```

- [ ] **Step 3:** Consumer smoke test in a scratch dir: `npm pack` the `dist/` output (or
      `npm pack ./dist` if that's how the package is published — check `publish.yml`), install it with
      `react`, `react-dom`, `@tanstack/react-query` into a temp project, and run a Node ESM script that
      `import('@true-tech-team/react-components')` and `import('@true-tech-team/react-components/app')`
      resolve (use `react-dom/server` `renderToString` of `GlobalProvider > AppProvider > Page`). Also
      confirm a components-only import works with `@tanstack/react-query` **not** installed.
- [ ] **Step 4: Commit** `docs(app): add app builder foundation stories and guidance`
