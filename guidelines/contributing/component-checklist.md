# Component Design & Quality Checklist

For agents and developers **creating or modifying components inside this library**. A component
isn't done until every MUST item passes. When you update an existing component, bring the parts
you touch up to this bar and list any remaining gaps in the PR description.

File structure, exports, stories and tests follow the repo's `CLAUDE.md`. This checklist covers
design quality.

## 1. API design

- [ ] Extends `BaseComponentProps`. `size` uses `ComponentSize` (or `ExtendedComponentSize`) with
      `md` as the default.
- [ ] Color props follow the library vocabulary:
  - actions and controls: `variant: ComponentVariant`
  - status display: `'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'`
  - message severity (Alert, Toast-like): `'info' | 'success' | 'warning' | 'error'`
  - Don't invent new names for an existing concept (e.g. `kind`, `intent`, `tone`, `appearance`).
- [ ] Controlled **and** uncontrolled modes for stateful inputs (`value`/`defaultValue`/`onChange`,
      `isOpen`/`defaultOpen`/`onOpenChange`).
- [ ] Form controls accept `label`, `helperText`, `error`, `errorMessage`, `disabled` and
      `required`, and wire up `aria-describedby` and `aria-invalid`.
- [ ] Forwards `ref` and passes unknown DOM props through to the root element. Strips internal-only
      props before spreading.
- [ ] Sensible defaults: the zero-config render is the most common correct usage.

## 2. Visual design (tokens only)

- [ ] **No raw values**: colors use `--theme-*` (TOKEN-2), spacing `--spacing-*` or `spacing()`,
      radius `--radius-*`, font sizes `--font-size-*`, shadows `--theme-shadow-*`, z-index
      `--z-*`, motion `--duration-*` + `--ease-*`. Run
      `grep -nE "#[0-9a-fA-F]{3,8}\b|rgba?\(" Component.module.scss`. Expect zero hits outside
      token definitions.
- [ ] Sizes `sm`/`md`/`lg` map to consistent heights across components. Controls that sit in one
      row (Button, Input, Select, IconButton) have matching heights per size:
      `sm` 32px · `md` 40px · `lg` 48px (`xs` 24 · `xl` 56 where supported), using `--control-height-*`.
- [ ] Internal spacing follows SPACE-2, e.g. icon ↔ label `--spacing-sm` (`xs` at `sm`/`xs` sizes).
- [ ] Radius per ELEV-2. Elevation per ELEV-1 (border or shadow at rest; floating layers get both).
- [ ] Shadows use `--theme-shadow-*` tokens only (SHADOW-1). Never use `box-shadow` for focus (SHADOW-3).
- [ ] Form-field focus uses `@include field-focus`, and the selector targets the element that
      actually carries the state attribute and the border (verify in the rendered DOM).
- [ ] Typography per TYPE-2. Control text `--font-size-sm` at `sm`/`md`, `--font-size-base` at `lg`.
- [ ] Variant styles are defined through component-scoped custom properties (e.g. `--button-bg`)
      so consumers can override them without fighting specificity.

## 3. States (each MUST be visibly distinct)

- [ ] default · hover · active/pressed · **focus-visible** · disabled · (selected/checked) ·
      (invalid) · (loading) · (read-only)
- [ ] Hover is a change of ≥ 1 shade in the token ramp, not opacity.
- [ ] Disabled uses `--theme-*-disabled` / `--theme-text-disabled` and `cursor: not-allowed`, and
      MUST NOT respond to hover.
- [ ] Selected/checked differs by more than color alone (checkmark, fill, weight or indicator bar).
- [ ] Loading keeps the component's dimensions stable.

## 4. Accessibility (MUST)

- [ ] Contrast checked in **both themes** (COLOR-1): text 4.5:1; boundaries, icons, focus ring and
      state indicators 3:1.
- [ ] `:focus-visible` uses `@include focus-ring` (or an equivalent ≥ 2px, 3:1 indicator). No bare
      `outline: none`.
- [ ] Hit area ≥ 24 × 24px at every size (pad invisible area if the visual is smaller).
- [ ] Correct native element or WAI-ARIA APG pattern, including the keyboard model (A11Y-2).
- [ ] Accessible name is required for icon-only usage (TypeScript-enforced where possible).
- [ ] State is exposed via ARIA (`aria-expanded`, `aria-selected`, `aria-pressed`, `aria-checked`,
      `aria-current`, `aria-busy`).
- [ ] Overlays: focus moves in on open, returns to the trigger on close, Esc closes, dismissible and
      hoverable per WCAG 1.4.13.
- [ ] `prefers-reduced-motion` handled for every transition and animation.
- [ ] Works in forced-colors mode (borders and focus visible).
- [ ] Storybook a11y addon shows zero violations on all stories.

## 5. Responsive & resilience

- [ ] Works at 320px container width. Long labels wrap or truncate gracefully (test with 3× text
      length and with a single 40-character word).
- [ ] Survives 200% text zoom and WCAG 1.4.12 text-spacing overrides (no fixed heights on text).
- [ ] RTL-safe: logical properties (`margin-inline-start`, `padding-inline`, `inset-inline-end`)
      instead of left/right where direction matters.
- [ ] No layout shift when async content or icons load.

## 6. Motion

- [ ] Durations and easing per MOTION-2. Only `transform`/`opacity` animate on large elements. No
      `transition: all`.

## 7. Documentation

- [ ] Stories: Default, every variant, every size, every state (including disabled, error and
      loading), a long-content story, and a dark-theme check.
- [ ] Story or MDX docs include "When to use / When not to use" matching
      `guidelines/components/catalog.md`. Update the catalog and `choosing.md` if you add a
      component or change its purpose.
- [ ] JSDoc on every prop, with `@default`.

## 8. Tests

- [ ] User-facing behavior: renders, keyboard interaction, ARIA states, controlled and uncontrolled
      modes, callbacks.
- [ ] `npm run lint && npm run typecheck && npm test && npm run build` all pass.

## Review output format (for agents auditing a component)

When asked to review or redesign a component, report findings as:

```
<Component> - <rule ID> - <MUST|SHOULD> - <finding> - <proposed fix (token/value)>
```

Example: `Badge - COLOR-1 - MUST - warning variant: white on #b39c2e = 2.7:1 - use dark text
(--theme-text-primary) on warning fills, or darken the fill to amber-800`.
