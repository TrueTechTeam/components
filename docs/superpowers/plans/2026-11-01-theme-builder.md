# Theme Builder (PR 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a Storybook "Theme Builder" page that produces a contrast-checked `theme.json`, make
the providers apply every field of that file (including per-mode colors), and land the v1.3.0
housekeeping.

**Architecture:** A pure theme-to-CSS-variables mapper is applied by `ThemeProvider` (which owns the
active mode), replacing `GlobalProvider`'s colors-only effect. OKLCH color math is added to core
`colorUtils`. The builder itself is Storybook-only code under `src/storybook/ThemeBuilder/`: pure
generation/suggestion/state modules, React UI built from library components, and a live preview
that runs in an iframe pointing at a hidden Storybook story, fed by `postMessage`.

**Tech Stack:** React 18/19, TypeScript, SCSS modules, Storybook 10.5, Jest + RTL, Vite.

**Spec:** `docs/superpowers/specs/2026-11-01-app-builder-design.md` (§4 Theme Builder, §9
Housekeeping). Read it before starting.

## Global Constraints

- No new runtime dependency for the published library. No new dev dependency either unless a task
  says so (none do).
- Theme Builder code is **not exported** from `src/index.ts`; it lives in `src/storybook/` which is
  excluded from `tsconfig.lib.json` (so it never reaches `dist`).
- Exported JSON shape is `ThemeConfig` (`{ mode, theme: ThemeOverride }`), directly usable as
  `<GlobalProvider themeConfig={json}>`. Existing `theme.colors` configs must keep working.
- Output colors are hex (`#rrggbb`). Generation happens in OKLCH.
- Contrast: WCAG AA, 4.5:1 for text pairs, 3:1 for non-text (borders, focus, primary-as-fill
  against background).
- `localStorage` key: `ttt-theme-builder:v1`. Every access wrapped in try/catch.
- Commit messages: Conventional Commits. **Never write `#` followed by hex or digits in a commit
  message** (semantic-release turns it into an issue link). Write colors as `00777e`.
- Every task ends with `npm run lint`, `npm run typecheck` and the task's tests passing. Final task
  runs all four CI checks.
- SCSS modules + tokens only (`var(--spacing-md)` etc.), no raw hex in builder UI styles.
- Branch: `feat/app-builder` (already created, spec committed).

## Review Focus

1. A `themeConfig` that changes at runtime (switching themes, editing in the builder) must not leave
   stale CSS variables from the previous config → test in Task 3.
2. Garbage color input (`"blue"`, `"#12"`, `""`, `"oklch(nonsense)"`) typed into the editor must not
   throw or blank the preview; the last valid color stays in effect → tests in Tasks 2 and 6.
3. A malformed `theme.json` (not JSON, wrong types, unknown keys) must produce a readable error list
   and leave the builder's state unchanged → test in Task 6.
4. `localStorage` that throws, is empty, or holds corrupt/old-version data must fall back to a fresh
   builder state → test in Task 6.
5. Achromatic or extreme seeds (`#000000`, `#ffffff`, `#888888`, `#ffff00`) must not produce `NaN`
   hues and must still yield AA-passing text pairs → tests in Tasks 2 and 4.

---

## File Structure

```
.github/workflows/pr.yml, publish.yml            (Task 1) action bumps
CHANGELOG.md, CLAUDE.md, .gitignore               (Task 1)
src/lib/types/theme.types.ts                      (Task 3) shade keys, per-mode colors
src/lib/utils/themeVars.ts (+ .test.ts)           (Task 3) ThemeOverride → CSS var map
src/lib/contexts/ThemeContext/ThemeContext.tsx    (Task 3) applies overrides per mode
src/lib/providers/GlobalProvider/GlobalProvider.tsx (Task 3) delegates to ThemeProvider
src/lib/styles/theme/_variables.scss              (Task 3) --font-family-secondary
src/lib/utils/colorUtils.ts (+ test)              (Task 2) OKLCH, contrast, hue rotation
src/storybook/ThemeBuilder/
  types.ts                                        (Task 4) builder input/state types
  generateTheme.ts (+ test)                       (Task 4) inputs → ThemeConfig, both modes
  contrast.ts (+ test)                            (Task 4) audit pairs + fix suggestions
  moods.ts, suggestPalettes.ts (+ test)           (Task 5)
  builderState.ts (+ test)                        (Task 6) reducer, persistence, import
  preview/PreviewApp.tsx, PreviewFrame.tsx (+ test),
  preview/ThemeBuilderPreview.stories.tsx         (Task 7) iframe preview
  ThemeBuilder.tsx, EntryScreen.tsx, GuidedSteps.tsx (+ test)  (Task 8)
  editor/*.tsx, ExportPanel.tsx, ContrastReport.tsx (+ test)   (Task 9)
  ThemeBuilder.module.scss                        (Tasks 8–9)
  ThemeBuilder.stories.tsx                        (Task 10)
.storybook/preview.tsx                            (Tasks 7, 10)
tsconfig.lib.json                                 (Task 4) exclude src/storybook
guidelines/foundations/tokens.md, README.md       (Task 10)
```

---

### Task 1: Housekeeping from the v1.3.0 release

**Files:**

- Modify: `.github/workflows/pr.yml:17,20,26,27`, `.github/workflows/publish.yml:20,25`
- Modify: `CHANGELOG.md:5`
- Modify: `CLAUDE.md` ("Commit Messages" section, after the paragraph ending "vague changelog entry.")
- Modify: `.gitignore`
- Delete: memory `C:\Users\bbjdt\.claude\projects\c--Users-bbjdt-Documents-Web-ui-components\memory\next-round-followups.md` and its line in `MEMORY.md` (outside the repo; do this last, after the PR is opened)

- [ ] **Step 1: Bump actions.** `actions/checkout@v4` → `@v5`, `actions/setup-node@v4` → `@v5`,
      `wagoid/commitlint-github-action@v4` → `@v6`. Change nothing else in those files.
- [ ] **Step 2: Verify.** `grep -rn "@v4" .github/workflows` → no output.
- [ ] **Step 3: Commit** `ci: bump checkout, setup-node and commitlint actions` (only the two yml files).
- [ ] **Step 4: CHANGELOG.** On line 5 delete exactly `, closes [#00777e](https://github.com/TrueTechTeam/components/issues/00777e)`.
- [ ] **Step 5: CLAUDE.md.** Append to "Commit Messages" this paragraph:

  > Never write a bare `#` followed by hex digits or numbers in a commit message (colors, counts):
  > the release-notes parser reads it as an issue reference and adds a bogus "closes #…" link to the
  > changelog. Write colors without the `#` (`00777e`, not `#00777e`).

- [ ] **Step 6: .gitignore.** Add a `# Brainstorming companion` section with `.superpowers/`.
- [ ] **Step 7: Commit** `docs: drop bogus issue link from 1.3.0 changelog and document cause` (CHANGELOG.md, CLAUDE.md, .gitignore).
- [ ] **Step 8: Fix the published release notes** (owner approved):

```bash
gh release view v1.3.0 --json body -q .body > "$SCRATCH/notes.md"
# remove the same ", closes [#00777e](…/issues/00777e)" text from notes.md
gh release edit v1.3.0 --notes-file "$SCRATCH/notes.md"
gh release view v1.3.0 --json body -q .body | grep -c 00777e   # expect 0
```

Use the session scratchpad for `$SCRATCH`. If `gh` is not authenticated, stop and report; do not
work around it.

---

### Task 2: OKLCH color math and contrast in core `colorUtils`

**Files:**

- Modify: `src/lib/utils/colorUtils.ts` (append), `src/lib/utils/index.ts` (exports already `*`? confirm; add if not)
- Test: `src/lib/utils/colorUtils.test.ts` (append a `describe('oklch')` block)

**Interfaces — Produces:**

```ts
export interface OKLCH {
  l: number;
  c: number;
  h: number;
} // l 0..1, c ≥ 0, h 0..360 (0 when achromatic)
export const hexToOklch: (hex: string) => OKLCH | null;
export const oklchToHex: (color: OKLCH) => string; // gamut-maps by reducing chroma until in sRGB
export const parseColorToOklch: (input: string) => OKLCH | null; // accepts hex, rgb(), hsl(), oklch(L C H) / oklch(L% C H)
export const rotateHue: (h: number, degrees: number) => number; // normalised to [0, 360)
export const getRelativeLuminance: (hex: string) => number;
export const getContrastRatio: (a: string, b: string) => number; // 1..21
```

- [ ] **Step 1: Write failing tests**

```ts
describe('oklch', () => {
  it('round-trips hex through OKLCH within 1 unit per channel', () => {
    for (const hex of ['#2563eb', '#00777e', '#f59e0b', '#000000', '#ffffff', '#888888']) {
      expect(oklchToHex(hexToOklch(hex)!)).toBe(hex);
    }
  });
  it('reports hue 0 and chroma ~0 for greys (no NaN)', () => {
    const g = hexToOklch('#888888')!;
    expect(Number.isNaN(g.h)).toBe(false);
    expect(g.c).toBeLessThan(0.001);
  });
  it('gamut-maps out-of-range colours instead of returning invalid hex', () => {
    expect(oklchToHex({ l: 0.7, c: 0.4, h: 145 })).toMatch(/^#[0-9a-f]{6}$/);
  });
  it('parses oklch() strings and rejects junk', () => {
    expect(parseColorToOklch('oklch(0.62 0.19 260)')).toEqual({ l: 0.62, c: 0.19, h: 260 });
    expect(parseColorToOklch('oklch(62% 0.19 260)')!.l).toBeCloseTo(0.62);
    for (const bad of ['blue', '#12', '', 'oklch(nonsense)'])
      expect(parseColorToOklch(bad)).toBeNull();
  });
  it('rotates hue with wrap-around', () => {
    expect(rotateHue(350, 30)).toBe(20);
    expect(rotateHue(10, -30)).toBe(340);
  });
  it('computes WCAG contrast ratios', () => {
    expect(getContrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0);
    expect(getContrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 5);
    expect(getContrastRatio('#767676', '#ffffff')).toBeGreaterThanOrEqual(4.5);
  });
});
```

- [ ] **Step 2:** `npx jest src/lib/utils/colorUtils.test.ts` → FAIL (functions not defined).
- [ ] **Step 3: Implement.** Use the standard Björn Ottosson OKLab matrices (sRGB ↔ linear ↔ LMS ↔
      OKLab) and polar conversion. Treat `c < 0.0001` as achromatic with `h = 0`. Gamut-map by binary
      search on chroma (keep l, h) until all linear sRGB channels are in [0, 1]. Round output channels.
      `getRelativeLuminance` per WCAG 2.x.
- [ ] **Step 4:** Test passes; `npm run lint && npm run typecheck` pass.
- [ ] **Step 5: Commit** `feat(utils): add OKLCH conversion, hue rotation and contrast ratio helpers`.

---

### Task 3: Providers apply every `ThemeConfig` field, per mode

**Files:**

- Modify: `src/lib/types/theme.types.ts:189-206`
- Create: `src/lib/utils/themeVars.ts`, Test: `src/lib/utils/themeVars.test.ts`; export from `src/lib/utils/index.ts`
- Modify: `src/lib/contexts/ThemeContext/ThemeContext.tsx`, test `ThemeContext.test.tsx`
- Modify: `src/lib/providers/GlobalProvider/GlobalProvider.tsx:96-107`, test `GlobalProvider.test.tsx`
- Modify: `src/lib/styles/theme/_variables.scss` (add `--font-family-secondary: var(--font-family-primary);` after line 31)

**Interfaces — Produces:**

```ts
// theme.types.ts
export type ThemeShadeKey =
  `${'primary' | 'secondary'}${50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900}`;
export type ThemeColorOverrides = Partial<ThemeColorTokens> &
  Partial<Record<ThemeShadeKey, string>>;
export type ThemeOverride = Partial<{
  colors: ThemeColorOverrides; // applied in both modes (unchanged meaning)
  modes: Partial<Record<ThemeMode, { colors?: ThemeColorOverrides }>>; // per-mode, wins over `colors`
  spacing: Partial<ThemeSpacing>;
  typography: Partial<{
    fontFamily: Partial<ThemeTypography['fontFamily']>;
    fontSize: Partial<ThemeTypography['fontSize']>;
    fontWeight: Partial<ThemeTypography['fontWeight']>;
    lineHeight: Partial<ThemeTypography['lineHeight']>;
  }>;
  borderRadius: Partial<ThemeBorderRadius>;
  shadows: Partial<ThemeShadows>;
}>;
// themeVars.ts
export function themeOverrideToCssVars(
  override: ThemeOverride | undefined,
  mode: ThemeMode
): Record<string, string>;
// ThemeProvider gains prop: applyOverrides?: boolean (default true)
```

Mapping (exact): color key → `--theme-` + kebab(key) where kebab inserts `-` before capitals **and
before a digit run** (`primary500` → `--theme-primary-500`, `surfaceElevated` →
`--theme-surface-elevated`). `spacing.unit` (number) → `--spacing-unit: {n}px`; other spacing keys →
`--spacing-{k}`. `typography.fontFamily.{k}` → `--font-family-{k}`, `fontSize.{k}` → `--font-size-{k}`,
`fontWeight.{k}` → `--font-weight-{k}` (stringified), `lineHeight.{k}` → `--line-height-{k}`.
`borderRadius.{k}` → `--radius-{k}`. `shadows.{k}` → `--theme-shadow-{k}`. Skip empty/undefined
values.

- [ ] **Step 1: Write failing `themeVars` tests**

```ts
it('maps every override group to its CSS variable', () => {
  const vars = themeOverrideToCssVars(
    {
      colors: { primary: '#111111', surfaceElevated: '#222222', primary500: '#333333' },
      spacing: { unit: 5, md: '20px' },
      typography: {
        fontFamily: { primary: 'Inter' },
        fontSize: { '2xl': '1.6rem' },
        fontWeight: { bold: 800 },
        lineHeight: { tight: 1.2 },
      },
      borderRadius: { md: '10px' },
      shadows: { lg: 'none' },
    },
    'light'
  );
  expect(vars).toEqual({
    '--theme-primary': '#111111',
    '--theme-surface-elevated': '#222222',
    '--theme-primary-500': '#333333',
    '--spacing-unit': '5px',
    '--spacing-md': '20px',
    '--font-family-primary': 'Inter',
    '--font-size-2xl': '1.6rem',
    '--font-weight-bold': '800',
    '--line-height-tight': '1.2',
    '--radius-md': '10px',
    '--theme-shadow-lg': 'none',
  });
});
it('lets the active mode override shared colors', () => {
  const o = { colors: { primary: '#111111' }, modes: { dark: { colors: { primary: '#eeeeee' } } } };
  expect(themeOverrideToCssVars(o, 'light')['--theme-primary']).toBe('#111111');
  expect(themeOverrideToCssVars(o, 'dark')['--theme-primary']).toBe('#eeeeee');
});
it('returns {} for undefined', () =>
  expect(themeOverrideToCssVars(undefined, 'light')).toEqual({}));
```

- [ ] **Step 2: Write failing provider tests** (in `GlobalProvider.test.tsx`)

```ts
it('applies non-color fields to the document root', () => {
  render(<GlobalProvider themeConfig={{ theme: { borderRadius: { md: '3px' }, spacing: { unit: 6 } } }}><div /></GlobalProvider>);
  const s = document.documentElement.style;
  expect(s.getPropertyValue('--radius-md')).toBe('3px');
  expect(s.getPropertyValue('--spacing-unit')).toBe('6px');
});
it('switches per-mode colors when the mode toggles', async () => { /* render with modes.light/dark primary,
  call useTheme().toggleMode() via a test button, expect --theme-primary to change */ });
it('removes variables from a previous config when themeConfig changes', () => {
  const { rerender } = render(<GlobalProvider themeConfig={{ theme: { borderRadius: { md: '3px' } } }}><div /></GlobalProvider>);
  rerender(<GlobalProvider themeConfig={{ theme: { colors: { primary: '#123456' } } }}><div /></GlobalProvider>);
  expect(document.documentElement.style.getPropertyValue('--radius-md')).toBe('');
  expect(document.documentElement.style.getPropertyValue('--theme-primary')).toBe('#123456');
});
it('removes all variables on unmount', () => { /* unmount → --theme-primary is '' */ });
it('picks up a changed themeConfig.mode', () => { /* rerender mode light→dark → data-theme="dark" */ });
it('does not apply overrides when injectGlobalStyles is false', () => { /* existing behavior kept */ });
```

- [ ] **Step 3:** Run both test files → new tests FAIL.
- [ ] **Step 4: Implement.**
  - Types as above (keep `ThemeTypography` etc. unchanged; `Theme` unchanged).
  - `ThemeProvider`: sync `mode` from `themeConfig.mode` and `themeOverride` from `themeConfig.theme`
    when those props change (compare `themeConfig?.mode` primitive; compare `theme` by reference).
    In a `useEffect([mode, themeOverride, applyOverrides])`: compute vars, `setProperty` each, and in
    the cleanup `removeProperty` each key it set. This is the only place overrides are written.
  - `GlobalProvider`: delete its color effect; pass `applyOverrides={injectGlobalStyles}` to
    `ThemeProvider`.
  - Existing tests in both files must still pass unchanged (if one asserted the old colors-only
    behavior in a way that conflicts, update it and say why in the commit body).
- [ ] **Step 5:** `npx jest src/lib/utils/themeVars.test.ts src/lib/contexts src/lib/providers` → PASS; lint + typecheck pass.
- [ ] **Step 6: Commit** `feat(theme): apply every ThemeConfig field and per-mode colors` with body
      citing spec §4.1.

---

### Task 4: Theme generation and contrast audit (builder core)

**Files:**

- Modify: `tsconfig.lib.json` (add `"src/storybook/**"` to `exclude`)
- Create: `src/storybook/ThemeBuilder/types.ts`, `generateTheme.ts`, `contrast.ts`
- Test: `src/storybook/ThemeBuilder/generateTheme.test.ts`, `contrast.test.ts`

**Interfaces — Consumes:** Task 2 helpers; Task 3 `ThemeConfig`, `ThemeColorOverrides`.
**Produces:**

```ts
// types.ts
export type Mood = 'calm' | 'bold' | 'professional' | 'playful' | 'luxury' | 'techy' | 'earthy';
export type Harmony =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'split-complementary'
  | 'monochrome';
export type ShadowDepth = 'flat' | 'subtle' | 'medium' | 'deep';
export type Density = 'compact' | 'comfortable' | 'spacious';
export interface ThemeInputs {
  primary: string;
  secondary: string; // any parseColorToOklch-accepted string
  fontStack: string;
  baseFontSize: number; // px, 14–18
  typeScaleRatio: number; // 1.125 | 1.2 | 1.25 | 1.333
  radius: number; // md radius px, 0–16
  spacingUnit: number; // px, 4 default
  shadowDepth: ShadowDepth;
  density: Density;
  defaultMode: ThemeMode;
}
export interface ColorOverrides {
  light: ThemeColorOverrides;
  dark: ThemeColorOverrides;
}
export const DEFAULT_INPUTS: ThemeInputs; // primary '#00777e', secondary '#64748b', system stack, 16, 1.2, 8, 4, 'subtle', 'comfortable', 'light'
// generateTheme.ts
export function generateColors(
  inputs: Pick<ThemeInputs, 'primary' | 'secondary'>,
  mode: ThemeMode
): ThemeColorOverrides; // all ThemeColorTokens keys + primary/secondary 50–900
export function generateTheme(inputs: ThemeInputs, overrides?: ColorOverrides): ThemeConfig;
// → { mode: defaultMode, theme: { modes: { light: { colors }, dark: { colors } }, spacing, typography, borderRadius, shadows } }
// contrast.ts
export interface ContrastCheck {
  fg: keyof ThemeColorTokens;
  bg: keyof ThemeColorTokens;
  min: 3 | 4.5;
  ratio: number;
  pass: boolean;
  suggestion?: string;
}
export const CONTRAST_PAIRS: ReadonlyArray<[fg, bg, min]>;
export function auditContrast(colors: ThemeColorOverrides): ContrastCheck[];
export function suggestPassingColor(fg: string, bg: string, min: number): string; // nearest-lightness OKLCH change to fg
```

`CONTRAST_PAIRS` (exact): `textPrimary/backgroundPrimary 4.5`, `textSecondary/backgroundPrimary 4.5`,
`textPrimary/surfacePrimary 4.5`, `textPrimary/surfaceElevated 4.5`, `textOnPrimary/primary 4.5`,
`inputText/inputBg 4.5`, `inputPlaceholder/inputBg 4.5`, `primary/backgroundPrimary 3`,
`borderFocus/backgroundPrimary 3`, `inputBorder/inputBg 3`, `controlBorder/backgroundPrimary 3`.
(`textDisabled` is exempt per WCAG.)

Generation constants (exact, OKLCH):

- Shade lightness: `50 .97, 100 .93, 200 .87, 300 .78, 400 .68, 500 .58, 600 .50, 700 .42, 800 .34, 900 .26`;
  chroma = seed chroma × `50 .25, 100 .4, 200 .6, 300 .8, 400 .95, 500 1, 600 1, 700 .9, 800 .8, 900 .7`; hue = seed hue.
- Brand base: light mode uses the seed as-is; dark mode uses the seed if `l ≥ 0.6`, else shade 400.
  Hover = base l −0.06 (light) / +0.06 (dark); active = ±0.12; disabled = shade 200 (light) / 800 (dark).
- `textOnPrimary`: `#ffffff` or `#111111`, whichever contrasts more with primary. If neither reaches
  4.5, lower primary `l` in 0.02 steps until white does (light) / raise until `#111111` does (dark).
- Neutrals: primary hue, chroma 0.01. Light: backgrounds `.99/.97/.94`, surfaces `1/.98/1`, text
  `.21/.45/.55`, disabled `.70`, borders `.88/.92`. Dark: backgrounds `.18/.22/.26`, surfaces
  `.21/.24/.28`, text `.96/.80/.70`, disabled `.50`, borders `.35/.30`. Inputs/controls derive from
  surfaces, borders and primary (focus = primary). `inputBorder`/`controlBorder` use `.60` light /
  `.55` dark lightness so they clear 3:1.
- Status hues: success 145, warning 75, error 27, info 240; light `l .55 c .15`, dark `l .72 c .15`.
- After generating, run `auditContrast`; for any failing pair whose `fg` is a generated neutral,
  replace it with `suggestPassingColor`. Brand colors are never silently changed except via the
  `textOnPrimary` rule above.
- Non-color: radius `{ none: '0', sm: md/2, md, lg: md*1.5, xl: md*2, full: '9999px' }` (px, rounded).
  Spacing: multiplier compact .75 / comfortable 1 / spacious 1.25; `xs 1u, sm 2u, md 4u, lg 6u, xl 8u, xxl 12u`
  × multiplier, rounded px; `unit` stays `spacingUnit`. Font sizes: `base = baseFontSize`, each step up
  × ratio, down ÷ ratio (`xs` −2, `sm` −1, `lg` +1 … `4xl` +6), emitted in `rem` (÷16, 3 decimals).
  Shadows: `flat` → all `none`; `subtle`/`medium`/`deep` → the current `--theme-shadow-*` values
  scaled by alpha ×0.6 / ×1 / ×1.6 (copy current values from `_light-theme.scss`).
- `overrides[mode]` are merged last into `modes[mode].colors`.

- [ ] **Step 1: Write failing tests**

```ts
const SEEDS = ['#2563eb', '#00777e', '#f59e0b', '#ffff00', '#000000', '#ffffff', '#888888'];
it.each(SEEDS)('every audited pair passes in both modes for seed %s', (seed) => {
  for (const mode of ['light', 'dark'] as const) {
    const colors = generateColors({ primary: seed, secondary: '#64748b' }, mode);
    expect(auditContrast(colors).filter((c) => !c.pass)).toEqual([]);
  }
});
it('emits every ThemeColorTokens key plus primary/secondary 50–900 as hex', () => {
  /* keys ⊇ list; values match /^#[0-9a-f]{6}$/ */
});
it('produces strictly decreasing lightness from 50 to 900', () => {
  /* via hexToOklch */
});
it('keeps the seed as light-mode primary', () =>
  expect(generateColors({ primary: '#2563eb', secondary: '#64748b' }, 'light').primary).toBe(
    '#2563eb'
  ));
it('applies user overrides last', () => {
  /* generateTheme(DEFAULT_INPUTS, { light: { primary: '#ff0000' }, dark: {} }).theme.modes.light.colors.primary === '#ff0000' */
});
it('maps non-color inputs', () => {
  const t = generateTheme({
    ...DEFAULT_INPUTS,
    radius: 10,
    density: 'compact',
    shadowDepth: 'flat',
  }).theme!;
  expect(t.borderRadius).toMatchObject({ sm: '5px', md: '10px', lg: '15px', xl: '20px' });
  expect(t.spacing).toMatchObject({ unit: 4, md: '12px' });
  expect(t.shadows!.md).toBe('none');
  expect(t.typography!.fontSize!.base).toBe('1rem');
});
it('falls back to DEFAULT_INPUTS colors for unparseable input instead of throwing', () => {
  expect(() => generateColors({ primary: 'blue', secondary: '' }, 'light')).not.toThrow();
});
// contrast.test.ts
it('flags a failing pair and suggests a passing replacement', () => {
  const [check] = auditContrast({ textPrimary: '#999999', backgroundPrimary: '#ffffff' });
  expect(check.pass).toBe(false);
  expect(getContrastRatio(check.suggestion!, '#ffffff')).toBeGreaterThanOrEqual(4.5);
});
it('skips pairs whose colors are missing', () => expect(auditContrast({})).toEqual([]));
```

- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement per constants above. **Step 4:** Run → PASS; lint + typecheck.
- [ ] **Step 5: Commit** `feat(theme-builder): generate light and dark themes from brand inputs with contrast audit`.

---

### Task 5: Moods and palette suggestions

**Files:** Create `src/storybook/ThemeBuilder/moods.ts`, `suggestPalettes.ts`; Test `suggestPalettes.test.ts`

**Interfaces — Produces:**

```ts
export interface MoodProfile {
  chroma: [number, number];
  lightness: [number, number];
  harmony: Harmony;
  look: Partial<Pick<ThemeInputs, 'radius' | 'shadowDepth' | 'density' | 'fontStack'>>;
}
export const MOODS: Record<Mood, MoodProfile & { label: string }>;
export interface PaletteSuggestion {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  look: MoodProfile['look'];
}
export function harmonyHues(hue: number, harmony: Harmony): number[]; // secondary candidates
export function suggestPalettes(args: {
  moods: Mood[];
  hue: number;
  harmony: Harmony;
  seed: number;
}): PaletteSuggestion[]; // 6 items
```

Mood profiles (exact): calm `c .06–.10, l .55–.65, analogous, radius 10, subtle, comfortable`;
bold `c .18–.24, l .50–.60, complementary, radius 6, medium`; professional `c .08–.13, l .45–.55,
split-complementary, radius 6, subtle, system stack`; playful `c .16–.22, l .60–.70, triadic, radius
14, medium, spacious`; luxury `c .05–.09, l .30–.42, monochrome, radius 2, deep, serif stack
(Georgia, 'Times New Roman', serif)`; techy `c .14–.20, l .55–.65, complementary, radius 4, flat,
compact, mono-accent stack ('Inter', system-ui, sans-serif)`; earthy `c .07–.12, l .45–.58,
analogous, radius 8, subtle`. Multiple moods: average numeric ranges, first-selected mood wins
harmony and look. No moods: `professional`.

Harmony offsets (exact): complementary `[180]`; analogous `[-30, 30]`; triadic `[120, 240]`;
split-complementary `[150, 210]`; monochrome `[0]` (secondary differs by lightness −0.2, chroma ×0.5).

`suggestPalettes`: deterministic for a given `seed` (use a small seeded PRNG such as mulberry32);
items vary chroma/lightness within the mood range and cycle the harmony's offsets; names come from a
fixed list of 24 short evocative words picked by PRNG.

- [ ] **Step 1: Failing tests**

```ts
it('returns 6 valid hex palettes', () => {
  /* length 6, primary/secondary match /^#[0-9a-f]{6}$/ */
});
it('is deterministic per seed and changes with a new seed', () => {
  /* same seed deep-equal; seed+1 differs */
});
it('places primaries on the chosen hue (±10°) and secondaries on harmony hues (±10°)', () => {
  /* via hexToOklch */
});
it('handles hue 359 + complementary without NaN', () => {
  /* all valid */
});
it('defaults to the professional profile when no moods are selected', () => {
  /* chroma within .08–.13 ±.02 after gamut mapping */
});
```

- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** PASS; lint.
- [ ] **Step 5: Commit** `feat(theme-builder): add mood profiles and harmony-based palette suggestions`.

---

### Task 6: Builder state, persistence and `theme.json` import

**Files:** Create `src/storybook/ThemeBuilder/builderState.ts`; Test `builderState.test.ts`

**Interfaces — Produces:**

```ts
export type Step = 'entry' | 'mood' | 'hue' | 'palette' | 'editor';
export interface BuilderState {
  version: 1;
  path: 'guided' | 'direct' | null;
  step: Step;
  moods: Mood[];
  hue: number;
  harmony: Harmony;
  shuffleSeed: number;
  inputs: ThemeInputs;
  overrides: ColorOverrides;
  previewMode: ThemeMode;
  openSections: string[];
}
export const INITIAL_STATE: BuilderState; // step 'entry', DEFAULT_INPUTS, overrides {light:{},dark:{}}, openSections ['colors']
export type BuilderAction =
  | { type: 'start'; path: 'guided' | 'direct' }
  | { type: 'goto'; step: Step }
  | { type: 'toggleMood'; mood: Mood }
  | { type: 'setHue'; hue: number }
  | { type: 'setHarmony'; harmony: Harmony }
  | { type: 'shuffle' }
  | { type: 'applyPalette'; palette: PaletteSuggestion }
  | { type: 'setInput'; key: keyof ThemeInputs; value: ThemeInputs[keyof ThemeInputs] }
  | { type: 'setOverride'; mode: ThemeMode; key: keyof ThemeColorOverrides; value: string | null } // null = reset to auto
  | { type: 'setPreviewMode'; mode: ThemeMode }
  | { type: 'toggleSection'; id: string }
  | { type: 'load'; state: BuilderState }
  | { type: 'reset' };
export function builderReducer(state: BuilderState, action: BuilderAction): BuilderState;
export const STORAGE_KEY = 'ttt-theme-builder:v1';
export function loadState(storage?: Storage): BuilderState; // INITIAL_STATE on any failure
export function saveState(state: BuilderState, storage?: Storage): void; // swallows errors
export function clearState(storage?: Storage): void;
export interface ImportResult {
  ok: boolean;
  state?: BuilderState;
  errors: string[];
  warnings: string[];
}
export function importThemeJson(text: string, current: BuilderState): ImportResult;
```

Rules: `setInput` for `primary`/`secondary` ignores values `parseColorToOklch` rejects (state
unchanged). `setOverride` likewise ignores invalid colors (null always allowed). `applyPalette` sets
primary/secondary and merges `palette.look` into inputs, then `step: 'editor'`. `reset` returns
`INITIAL_STATE`. `importThemeJson`: parse JSON; must be an object with optional `mode` in
light|dark and optional `theme` object; each color value must parse; unknown top-level or `theme`
keys → warnings (ignored); type errors → errors and `ok: false`. On success: `path 'direct'`,
`step 'editor'`, inputs.primary/secondary from `modes.light.colors` (or `colors`) when present,
every present color becomes an override in its mode (shared `colors` go to both), radius from
`borderRadius.md`, spacingUnit from `spacing.unit`, fontStack from `typography.fontFamily.primary`,
baseFontSize from `typography.fontSize.base` (rem×16), defaultMode from `mode`.

- [ ] **Step 1: Failing tests**

```ts
it('ignores invalid brand colors and keeps the last valid one', () => {
  const s = builderReducer(INITIAL_STATE, { type: 'setInput', key: 'primary', value: '#12' });
  expect(s.inputs.primary).toBe(INITIAL_STATE.inputs.primary);
});
it('resets an override to auto with null', () => {
  /* set then null → key absent */
});
it('applyPalette moves to the editor with the palette look', () => {
  /* step 'editor', radius from look */
});
it('reset returns INITIAL_STATE', () => {
  /* deep equal */
});
it('round-trips through storage', () => {
  /* saveState then loadState equal, using a Map-backed Storage stub */
});
it.each([
  [
    'throws',
    {
      getItem: () => {
        throw new Error('denied');
      },
    },
  ],
  ['empty', { getItem: () => null }],
  ['corrupt', { getItem: () => '{not json' }],
  ['old version', { getItem: () => JSON.stringify({ version: 0 }) }],
])('loadState falls back to INITIAL_STATE when storage %s', (_n, stub) => {
  expect(loadState(stub as unknown as Storage)).toEqual(INITIAL_STATE);
});
it('saveState swallows storage errors', () => {
  /* setItem throws → no throw */
});
it('imports a valid theme.json into the editor', () => {
  /* generateTheme(DEFAULT_INPUTS) JSON → ok, step 'editor', overrides populated */
});
it.each(['not json', '[]', '{"mode":"sepia"}', '{"theme":{"colors":{"primary":"blue"}}}'])(
  'rejects malformed theme.json %s with errors and no state',
  (text) => {
    const r = importThemeJson(text, INITIAL_STATE);
    expect(r.ok).toBe(false);
    expect(r.errors.length).toBeGreaterThan(0);
    expect(r.state).toBeUndefined();
  }
);
it('warns about unknown keys but still imports', () => {
  /* {"theme":{"foo":1}} → ok, warnings ['theme.foo …'] */
});
```

- [ ] **Step 2:** FAIL. **Step 3:** Implement. **Step 4:** PASS; lint.
- [ ] **Step 5: Commit** `feat(theme-builder): add builder state, local persistence and theme.json import`.

---

### Task 7: Isolated live preview (iframe)

**Files:**

- Modify: `.storybook/preview.tsx` decorators (lines ~126–158)
- Create: `src/storybook/ThemeBuilder/preview/PreviewApp.tsx`, `PreviewApp.module.scss`,
  `PreviewFrame.tsx`, `ThemeBuilderPreview.stories.tsx`, `messages.ts`
- Test: `src/storybook/ThemeBuilder/preview/PreviewFrame.test.tsx`

**Interfaces — Produces:**

```ts
// messages.ts
export const MSG_READY = 'ttt-theme-builder:ready';
export const MSG_CONFIG = 'ttt-theme-builder:config';
export type PreviewMessage =
  | { type: typeof MSG_READY }
  | { type: typeof MSG_CONFIG; config: ThemeConfig; mode: ThemeMode };
export const PREVIEW_STORY_ID = 'theme-builder-internal-preview--default';
// PreviewFrame.tsx
export function PreviewFrame(props: {
  config: ThemeConfig;
  mode: ThemeMode;
  title?: string;
  height?: number | string;
}): JSX.Element;
```

Storybook decorator opt-out: a story parameter `globalDecorators?: 'all' | 'provider' | 'none'`
(default `'all'`). `'provider'` skips the centering wrapper but keeps `GlobalProvider`; `'none'`
skips both (the story brings its own provider).

- `ThemeBuilderPreview.stories.tsx`: `title: 'Theme Builder/Internal Preview'`, `tags: ['!dev',
'!autodocs', '!test']` (hidden from the sidebar), `parameters: { layout: 'fullscreen',
globalDecorators: 'none' }`. Renders `<PreviewApp />`.
- `PreviewApp`: holds `{config, mode}` state (initially `generateTheme(DEFAULT_INPUTS)`), posts
  `MSG_READY` to `window.parent` on mount, listens for `MSG_CONFIG` from `window.parent` only
  (check `event.source === window.parent` and `event.origin === window.location.origin`), renders
  `<GlobalProvider themeConfig={{ ...config, mode }}>` around a mini app: Navbar with brand + 3
  links, KPI row (3 `KPI`s), Buttons (primary, secondary, outline, ghost, danger), a `Table` with 3
  rows and status `Tag`s, a small form (`Input`, `Select`, `Checkbox`, `Toggle`), an `Alert`, and a
  button opening a `Dialog`. Uses existing library components only; layout via SCSS module + tokens.
- `PreviewFrame`: `<iframe src={`iframe.html?id=${PREVIEW_STORY_ID}&viewMode=story`}>` (relative URL
  — works in dev and in the static build); on `MSG_READY` from that iframe and on every
  `config`/`mode` change after ready, posts `MSG_CONFIG` with `targetOrigin = window.location.origin`.
  `title` defaults to "Theme preview".

- [ ] **Step 1: Failing test** (`PreviewFrame.test.tsx`)

```ts
it('posts the config to the iframe after it reports ready, and again on change', () => {
  const { container, rerender } = render(<PreviewFrame config={A} mode="light" />);
  const iframe = container.querySelector('iframe')!;
  const post = jest.spyOn(iframe.contentWindow!, 'postMessage');
  act(() => window.dispatchEvent(new MessageEvent('message', { data: { type: MSG_READY }, source: iframe.contentWindow, origin: window.location.origin })));
  expect(post).toHaveBeenLastCalledWith({ type: MSG_CONFIG, config: A, mode: 'light' }, window.location.origin);
  rerender(<PreviewFrame config={B} mode="dark" />);
  expect(post).toHaveBeenLastCalledWith({ type: MSG_CONFIG, config: B, mode: 'dark' }, window.location.origin);
});
it('ignores ready messages from other windows', () => { /* source: window → postMessage not called */ });
it('has an accessible title', () => { /* getByTitle('Theme preview') */ });
```

- [ ] **Step 2:** FAIL. **Step 3:** Implement decorator opt-out, messages, frame, app, hidden story.
- [ ] **Step 4:** Tests PASS; lint. Manual: `npm run storybook`, open
      `http://localhost:6006/iframe.html?id=theme-builder-internal-preview--default&viewMode=story` →
      mini app renders themed; the story does **not** appear in the sidebar. Every existing story still
      renders centered (spot-check Button and DataTable).
- [ ] **Step 5: Commit** `feat(theme-builder): add isolated iframe preview of a themed mini app`.

---

### Task 8: Builder shell, entry screen and guided steps

**Files:** Create `src/storybook/ThemeBuilder/ThemeBuilder.tsx`, `EntryScreen.tsx`, `GuidedSteps.tsx`,
`ThemeBuilder.module.scss`; Test `ThemeBuilder.test.tsx`

**Interfaces — Consumes:** Tasks 4–7. **Produces:** `export function ThemeBuilder(props: { storage?: Storage }): JSX.Element`.

Behavior (from spec §4.3, owner-approved mockup v2):

- State via `useReducer(builderReducer, undefined, () => loadState(storage))`; `saveState` on every change.
- Top bar: title "Theme Builder", **↺ Start over** button visible on every step including the
  editor. It opens a confirm `Dialog` ("Start over? This clears your saved progress."); confirming
  calls `clearState` and dispatches `reset`.
- Entry: two large choice cards, "✨ Help me find my theme" (start guided → `mood`) and "🎯 I know
  my theme" (start direct → `editor`), plus "⬆ Load theme.json" (`FilePicker` or hidden file input,
  `.json`) → `importThemeJson`; on errors show them in an `Alert` and stay on entry; warnings show
  in a dismissible `Alert` in the editor.
- Guided steps with a `Stepper` (Mood · Hue & harmony · Pick a palette) and Back / Next:
  - Mood: multi-select `Chip`s for the 7 moods (Next always enabled).
  - Hue & harmony: a hue wheel (a `Slider` 0–359 with a conic-gradient track is acceptable; must be
    keyboard operable and labelled "Hue") and a `ButtonToggleGroup` for the 5 harmonies; a swatch row
    previews the harmony hues.
  - Palette: 6 suggestion cards from `suggestPalettes` (each: name, swatches, small `PreviewFrame`
    at ~180px height is **not** required; use swatch + sample button/text rendered with inline
    colors), a 🎲 Shuffle button (`shuffle`), clicking a card dispatches `applyPalette`.
- No tabs anywhere.

- [ ] **Step 1: Failing tests** (RTL, with a Map-backed storage stub)

```ts
it('starts on the entry screen with both paths and load option', () => {
  /* buttons by name */
});
it('guided path walks mood → hue → palette → editor', async () => {
  /* click through; picking a palette shows the editor heading "Colors" */
});
it('direct path goes straight to the editor', () => {});
it('Start over asks for confirmation then returns to entry and clears storage', () => {});
it('restores progress from storage on mount', () => {
  /* pre-seeded state with step 'editor' */
});
it('shows import errors and stays on entry for a malformed file', async () => {
  /* userEvent.upload with 'not json' */
});
```

- [ ] **Step 2:** FAIL. **Step 3:** Implement (editor area renders a placeholder `<h2>Colors</h2>` until Task 9).
- [ ] **Step 4:** PASS; lint.
- [ ] **Step 5: Commit** `feat(theme-builder): add entry screen, guided steps and start over`.

---

### Task 9: Editor sections, contrast report and export

**Files:** Create `src/storybook/ThemeBuilder/editor/ColorsSection.tsx`, `TypographySection.tsx`,
`ShapeSection.tsx`, `DepthSection.tsx`, `ContrastReport.tsx`, `ExportPanel.tsx`; modify
`ThemeBuilder.tsx`; Test `editor/Editor.test.tsx`

**Interfaces — Consumes:** `generateTheme`, `auditContrast`, `PreviewFrame`, reducer actions.

Layout: left panel = one scrolling column of **collapsible sections** (use `Accordion` with
multiple-open, driven by `openSections`/`toggleSection`), in order **Colors · Typography · Shape &
spacing · Depth & density**. Right = `PreviewFrame` (fills height) with a light/dark
`ButtonToggleGroup` above it (`setPreviewMode`), then `ContrastReport`, then `ExportPanel`. Derive
`config = useMemo(() => generateTheme(inputs, overrides), …)`.

- **Colors:** `ColorPicker` (or `Input` + swatch) for primary and secondary, accepting
  hex/rgb/oklch text; invalid text shows the input's error state and does not dispatch. Below, a
  read-only shade strip (50–900) for each, then a list of derived tokens for the **current preview
  mode** grouped (Brand, Status, Backgrounds & surfaces, Text, Borders, Inputs & controls); each row:
  swatch, token name, value, "Override" (opens a color input → `setOverride`) and, when overridden,
  an "Auto" reset (`setOverride … null`) plus an "edited" `Badge`.
- **Typography:** font stack `Select` (System, Inter, Georgia serif, Mono, plus "Custom…" → `Input`),
  base size `NumberInput` 14–18, scale ratio `Select` (1.125, 1.2, 1.25, 1.333) with a type ramp
  sample.
- **Shape & spacing:** radius `Slider` 0–16 labelled "Corner radius" (sharp → round), spacing unit
  `Select` (4, 5, 6 px).
- **Depth & density:** shadow depth `ButtonToggleGroup` (flat/subtle/medium/deep), density
  `ButtonToggleGroup` (compact/comfortable/spacious), default mode `ButtonToggleGroup` (light/dark).
- **ContrastReport:** runs `auditContrast` on the current mode's colors; summary `Badge` ("All pairs
  pass AA" or "N pairs fail"); each failing pair lists fg/bg, ratio (1 decimal), required, and an
  "Apply fix" button → `setOverride(mode, fg, suggestion)`.
- **ExportPanel:** pretty JSON (2-space) of `config` in a `<pre>`; "Copy JSON" (`useClipboard`, then
  a toast), "Download theme.json" (Blob + object URL, filename `theme.json`); usage snippet:

  ```tsx
  import theme from './theme.json';
  <GlobalProvider themeConfig={theme}>…</GlobalProvider>;
  ```

- [ ] **Step 1: Failing tests**

```ts
it('shows all four sections in order with Colors open', () => {});
it('changing primary updates the exported JSON', () => {
  /* type '#2563eb' → <pre> contains "#2563eb" */
});
it('invalid primary text shows an error and leaves the JSON unchanged', () => {});
it('override then Auto restores the generated value', () => {});
it('contrast report offers a fix that makes the pair pass', () => {
  /* override textPrimary '#cccccc' → 1 fail → Apply fix → "All pairs pass AA" */
});
it('download creates a theme.json blob', () => {
  /* mock URL.createObjectURL, assert anchor download="theme.json" clicked */
});
it('radius slider changes borderRadius.md in the JSON', () => {});
```

- [ ] **Step 2:** FAIL. **Step 3:** Implement. **Step 4:** PASS; lint.
- [ ] **Step 5: Commit** `feat(theme-builder): add editor sections, contrast report and theme.json export`.

---

### Task 10: Storybook placement, docs and full verification

**Files:** Create `src/storybook/ThemeBuilder/ThemeBuilder.stories.tsx`; modify `.storybook/preview.tsx`
(`storySort.order`), `guidelines/foundations/tokens.md`, `README.md`,
`src/lib/providers/GlobalProvider/GlobalProvider.stories.tsx`

- [ ] **Step 1: Story.** `title: 'Theme Builder'`, single story `Default` rendering `<ThemeBuilder />`,
      `parameters: { layout: 'fullscreen', globalDecorators: 'provider' }`, `tags: ['!autodocs']`.
- [ ] **Step 2: Sort first.** Prepend `'Theme Builder'` to `storySort.order` (before `'Buttons'`).
- [ ] **Step 3: Docs.**
  - `tokens.md`: document `--font-family-secondary`; document that `ThemeConfig.theme` supports
    `colors` (both modes), `modes.light|dark.colors`, `spacing`, `typography`, `borderRadius`,
    `shadows`, and the key → variable mapping from Task 3; point to the Theme Builder.
  - `README.md`: short "Theming" section: generate `theme.json` in Storybook's Theme Builder, then
    `<GlobalProvider themeConfig={theme}>`.
  - `GlobalProvider.stories.tsx`: add a story "From theme.json" passing a full generated config.
- [ ] **Step 4: Manual check** (`npm run storybook`): Theme Builder is first in the sidebar; guided
      path end to end; direct path; reload keeps progress; Start over clears it; editing changes the
      preview live; preview Dialog opens inside the iframe; light/dark preview switch works; download
      produces a file that, pasted into the "From theme.json" story, renders the same colors; Storybook
      toolbar theme toggle still works on other stories.
- [ ] **Step 5: CI checks** — all must pass:

```bash
npm run lint && npm run typecheck && npm test && npm run build && npm run storybook:build
```

Then confirm the library build excludes the builder: `grep -rl "ttt-theme-builder" dist --include=*.js --exclude-dir=storybook` → no output.

- [ ] **Step 6: Commit** `feat(theme-builder): add Theme Builder page at the top of Storybook` (story, sort, docs).
- [ ] **Step 7:** After the PR is opened (owner's call when), delete the
      `next-round-followups.md` memory and its `MEMORY.md` line (Task 1 note).
