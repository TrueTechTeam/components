# Design Tokens

All visual values come from CSS custom properties defined in `src/lib/styles/theme/`. They are
available globally once `@true-tech-team/ui-components/index.css` is imported.

## TOKEN-1 - Never hardcode a value a token covers (MUST)

```scss
// ✗ Wrong
.card {
  padding: 16px;
  color: #1f2937;
  border-radius: 8px;
  transition: all 0.2s;
}

// ✓ Right
.card {
  padding: var(--spacing-md);
  color: var(--theme-text-primary);
  border-radius: var(--radius-md);
  transition: background-color var(--duration-fast) var(--ease-standard);
}
```

Allowed exceptions: `0`, `1px` hairline borders, `100%`, and values derived with `calc()` from
tokens.

## TOKEN-2 - Prefer semantic tokens over palette tokens

Use `--theme-*` (semantic: describes the **role**) before `--color-{family}-{shade}` (palette:
describes the **hue**). Semantic tokens switch automatically between light and dark themes.
Palette tokens don't. Use palette tokens only for categorical data such as charts, avatar
backgrounds or user-chosen labels, and verify contrast in both themes.

## Token reference

### Color (semantic, theme-aware)

| Token                                                              | Role                                                                                                     |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| `--theme-primary` (+ `-hover`, `-active`, `-disabled`, `-50…-900`) | Brand / primary action / selected state                                                                  |
| `--theme-secondary` (+ states, shades)                             | Neutral secondary actions                                                                                |
| `--theme-tertiary` (+ shades)                                      | Accent for small emphasized items. Use sparingly                                                         |
| `--theme-success` / `-warning` / `-error` / `-info` (+ states)     | Semantic **fills**: solid badges, filled buttons, toast accents                                          |
| `--theme-{success,warning,error,info}-text`                        | Semantic **text and icons** on surfaces (≥ 4.5:1 in both themes). Use for error messages and status text |
| `--theme-text-on-{success,warning,error,info}`                     | Text placed **on** a semantic fill                                                                       |
| `--theme-background-primary/secondary/tertiary`                    | App canvas and recessed regions                                                                          |
| `--theme-surface-primary/secondary/elevated`                       | Cards, panels, floating layers                                                                           |
| `--theme-text-primary/secondary/tertiary/disabled`                 | Text hierarchy                                                                                           |
| `--theme-text-on-primary`                                          | Text on primary-filled surfaces                                                                          |
| `--theme-border-primary/secondary`                                 | Decorative dividers (not component boundaries; see COLOR-6)                                              |
| `--theme-border-focus`                                             | Focus indication                                                                                         |
| `--theme-interactive-hover/active/focus/disabled`                  | Background feedback for interactive rows and items                                                       |
| `--theme-input-*`, `--theme-control-*`                             | Form field and control internals                                                                         |
| `--theme-shadow-sm/md/lg/xl`                                       | Elevation scale. See SHADOW-1 in elevation-shape.md                                                      |
| `--theme-shadow-drag`, `--theme-shadow-inset`                      | Dragged item; recessed/pressed                                                                           |

### Palette

`--color-{family}-{50…900}` for: red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky,
blue, indigo, violet, purple, fuchsia, pink, rose, slate, gray, zinc, neutral, stone, brown, copper,
gold, silver, olive, mint, navy, coral, turquoise, magenta. The palette ramps are **not**
perceptually uniform: the same shade number in two families can have very different lightness
(for example, amber-500 is far lighter than blue-500). Always check contrast. Never assume it. Shades 50–200 are
tints for backgrounds, 500 is the base, and 700–900 are for text on light backgrounds.

### Spacing (4px grid)

| Token           | Value | Typical use                                       |
| --------------- | ----- | ------------------------------------------------- |
| `--spacing-xs`  | 4px   | Icon-to-text in small controls, tight inline gaps |
| `--spacing-sm`  | 8px   | Icon-to-text, between related controls            |
| `--spacing-md`  | 16px  | Container padding, between form fields            |
| `--spacing-lg`  | 24px  | Between groups, roomy container padding           |
| `--spacing-xl`  | 32px  | Between sections                                  |
| `--spacing-xxl` | 48px  | Between page regions, hero padding                |

SCSS: `spacing(n)` returns `n × 4px` for in-between values (for example `spacing(3)` = 12px). Use
it sparingly, since it bypasses the named scale.

### Radius

| Token           | Value  | Use                                                |
| --------------- | ------ | -------------------------------------------------- |
| `--radius-sm`   | 4px    | Small controls: checkbox, tag, badge (rectangular) |
| `--radius-md`   | 8px    | Buttons, inputs, menus. The default                |
| `--radius-lg`   | 12px   | Cards, popovers                                    |
| `--radius-xl`   | 16px   | Dialogs, large panels                              |
| `--radius-full` | 9999px | Pills, avatars, toggles, circular buttons          |

### Typography

`--font-family-primary`, `--font-family-mono`; `--font-size-xs` (12) · `sm` (14) · `base` (16) ·
`lg` (18) · `xl` (20) · `2xl` (24) · `3xl` (30) · `4xl` (36); `--font-weight-light` (300) ·
`normal` (400) · `medium` (500) · `semibold` (600) · `bold` (700); `--line-height-tight` (1.25) ·
`normal` (1.5) · `relaxed` (1.75).

### Motion

| Token                | Value                        | Use                             |
| -------------------- | ---------------------------- | ------------------------------- |
| `--duration-instant` | 100ms                        | Hover and press color changes   |
| `--duration-fast`    | 150ms                        | Toggles, checkboxes, tooltips   |
| `--duration-normal`  | 250ms                        | Dropdowns, popovers, accordions |
| `--duration-slow`    | 350ms                        | Dialogs, drawers, large panels  |
| `--ease-standard`    | `cubic-bezier(0.2, 0, 0, 1)` | Moving or changing on screen    |
| `--ease-enter`       | `cubic-bezier(0, 0, 0, 1)`   | Entering (decelerate)           |
| `--ease-exit`        | `cubic-bezier(0.3, 0, 1, 1)` | Exiting (accelerate)            |

Legacy: `--transition-fast/normal/slow` (duration plus `ease-in-out`) still exist. New code
SHOULD use `--duration-*` with `--ease-*`.

### Focus, targets, widths

| Token                               | Value                       | Use                                                                          |
| ----------------------------------- | --------------------------- | ---------------------------------------------------------------------------- |
| `--focus-ring-width`                | 2px                         | Outline width for `:focus-visible`                                           |
| `--focus-ring-offset`               | 2px                         | Outline offset                                                               |
| `--focus-ring-color`                | `var(--theme-border-focus)` | Outline color                                                                |
| `--target-size-min`                 | 24px                        | Minimum pointer target (WCAG 2.5.8)                                          |
| `--target-size-touch`               | 44px                        | Recommended touch target                                                     |
| `--content-width-prose`             | 70ch                        | Max width of paragraphs                                                      |
| `--content-width-form`              | 40rem                       | Max width of single-column forms                                             |
| `--content-width-page`              | 80rem                       | Max width of page content                                                    |
| `--control-height-{xs,sm,md,lg,xl}` | 24 / 32 / 40 / 48 / 56px    | Shared heights for Button, Input, Select, TagInput and other inline controls |

SCSS mixins: `@include focus-ring` (outline ring for buttons and controls), `@include field-focus`
(border + ring for bordered form fields), `@include transition(prop, …)` (token duration and
easing; reduced motion is handled globally).

### Z-index

`--z-dropdown` 1000 · `--z-sticky` 1100 · `--z-fixed` 1200 · `--z-modal-backdrop` 1300 ·
`--z-modal` 1400 · `--z-popover` 1500 · `--z-tooltip` 1600. MUST NOT invent z-index numbers. Use
the token for the layer's role.

## TOKEN-3 - Theming (consumers)

Override tokens through `GlobalProvider`, not by redefining classes:

```tsx
<GlobalProvider themeConfig={{
  mode: 'light',
  theme: { colors: { primary: '#0b6e75', primaryHover: '#095c62', textOnPrimary: '#fff' } },
}}>
```

or in CSS after the library stylesheet:

```css
:root,
:root[data-theme='light'] {
  --theme-primary: #0b6e75;
}
:root[data-theme='dark'] {
  --theme-primary: #4fd1d9;
}
```

Any override MUST pass the contrast checks in [color.md](color.md) in **both** themes.
