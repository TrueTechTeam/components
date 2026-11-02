# Color

Color does three jobs in UI. In priority order: **communicate state and meaning**, **establish
hierarchy**, and **express brand**. Most of the interface should be neutral, so that the few
colored things carry signal.

---

## COLOR-1 - Contrast minimums (MUST, WCAG 2.2 AA)

| What                                                                                                 | Minimum ratio                      | WCAG            |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------- | --------------- |
| Body text and any text < 24px (< 18.66px if bold)                                                    | **4.5 : 1**                        | 1.4.3           |
| Large text (≥ 24px, or ≥ 18.66px bold)                                                               | **3 : 1**                          | 1.4.3           |
| UI component boundaries needed to find the control (input borders, checkbox outlines, toggle tracks) | **3 : 1** against adjacent color   | 1.4.11          |
| States: focus ring, selected and checked indicators                                                  | **3 : 1**                          | 1.4.11          |
| Meaningful icons and chart marks                                                                     | **3 : 1**                          | 1.4.11          |
| Placeholder text                                                                                     | **4.5 : 1** (it is text)           | 1.4.3           |
| Disabled controls                                                                                    | Exempt, but keep them recognizable | 1.4.3 exception |
| Decorative borders, dividers, logos                                                                  | Exempt                             | -               |

**How to check:** compute the WCAG relative-luminance ratio for the exact foreground and background
pair, in both light and dark themes. A translucent color is checked against the background it ends
up on. Don't eyeball it, and don't assume a token passes because it is a token. The library's own token pairs were audited and fixed in
November 2026 (tracked in `docs/design-audit.md` in the source repo). Any theme override you make
must be re-checked.

Target AAA (7:1) for long-form reading text where possible. APCA (the WCAG 3 draft method) is
useful as a second check for dark mode and thin fonts, but WCAG 2.2 ratios are the requirement.

## COLOR-2 - Text hierarchy uses neutral tokens, not opacity

| Token                     | Use                                            |
| ------------------------- | ---------------------------------------------- |
| `--theme-text-primary`    | Headings, body, values                         |
| `--theme-text-secondary`  | Labels, descriptions, metadata                 |
| `--theme-text-tertiary`   | Timestamps, captions, the lowest-priority text |
| `--theme-text-disabled`   | Disabled controls only                         |
| `--theme-text-on-primary` | Text and icons on `--theme-primary` fills      |

- MUST NOT lower text emphasis with `opacity`. It produces unpredictable contrast on varied
  backgrounds and also fades child icons and focus rings.
- Use at most 3 text levels on one screen. Make hierarchy with size and weight first, color
  second.
- Links in body text MUST be distinguishable without color (underline), or have ≥ 3:1 contrast
  with the surrounding text plus a non-color cue on hover and focus (WCAG 1.4.1).

## COLOR-3 - Primary/brand color is scarce

- `--theme-primary` marks **the** primary action, the selected or current state, and focus. If
  everything is primary, nothing is.
- Heuristic (not a hard rule): ~60% neutral background/surface, ~30% secondary neutrals (text,
  borders, secondary surfaces), ≤ 10% accent (primary + semantic). Pages that come out more
  colorful than this usually lack hierarchy.
- MUST NOT use primary for decorative large backgrounds in product UI. Use `--theme-primary-50`
  tints for selected rows and highlighted regions instead.

## COLOR-4 - Surfaces and layering

```
--theme-background-primary   ← app canvas (lowest)
  --theme-surface-primary    ← cards, panels, table containers
    --theme-surface-secondary ← nested regions inside a card (subtle)
      --theme-surface-elevated + --theme-shadow-md/lg ← menus, popovers, dialogs (highest)
```

- In light mode, separate layers with a border or shadow. The canvas-to-surface difference alone
  is subtle (1.1:1).
- In dark mode, higher layers are **lighter**, not darker. Shadows are nearly invisible on dark
  backgrounds, so elevation comes from surface lightness (Material, Atlassian).
- Nest no more than 3 surface levels. Deeper nesting reads as clutter. Flatten with spacing or
  dividers instead.

## COLOR-5 - Semantic colors and "never color alone" (MUST)

- Success = green, Warning = amber/orange, Error = red, Info = blue/cyan. Keep these meanings
  everywhere. Never use a semantic color decoratively (a red "Featured" badge reads as an error).
- MUST pair color with a second cue: an icon, text ("Failed"), a pattern or a position (WCAG
  1.4.1). About 1 in 12 men have a color-vision deficiency, and red/green is the most commonly
  confused pair.
- Semantic **fills** (solid badge, filled button) and semantic **text** (an error message on a
  surface) need different tones. A tone that passes as a fill behind white text often fails as text
  on a dark surface. So the theme provides three roles per severity:
  - `--theme-error` (fill) + `--theme-text-on-error` (text on that fill)
  - `--theme-error-text` (text, icons and the invalid-field border on a surface)
  - The same pattern exists for `success`, `warning` and `info`.
- MUST NOT put `--theme-success/warning/error/info` directly on `color:`. Use the `-text` token.
- **Warning is yellow and always carries dark text.** No yellow is dark enough for white text and
  still yellow, so `--theme-warning` is a true yellow fill paired with `--theme-text-on-warning`
  (dark in both themes). Yellow is never used as text on a surface: warning text and icons use
  `--theme-warning-text` (a deep gold). Graphics that need 3:1 against the surface (progress fills,
  spinners, checked controls, rating stars) use `--theme-warning-500`. Don't "fix" warning contrast
  by darkening it to orange, because orange reads as a different severity.
- Field errors use `--theme-error-text` for the message, the error icon and the field border.

## COLOR-6 - Borders

- **Component boundaries** (input, select, checkbox, radio, toggle track, outline button) MUST
  reach 3:1 against the background. `--theme-input-border` and `--theme-control-border` are meant
  for this.
- **Decorative separators** (card edges, dividers, table row lines) MAY be low contrast:
  `--theme-border-primary` / `--theme-border-secondary`.
- A card that relies only on a faint border plus a near-identical background is acceptable only
  because the card isn't an interactive control. If the card **is** interactive, give it a hover
  or focus state with ≥ 3:1 change.

## COLOR-7 - Picking a new color (brand theming or a new token)

Follow these steps in order:

1. **Start from the role, not the hue.** Name what it's for (for example "brand primary" or
   "warning text on surface").
2. **Pick in a perceptual space.** Use OKLCH (`oklch(L C H)`) and keep L (lightness) as the
   variable that drives contrast. Same-L colors in OKLCH look equally light. HSL lightness lies,
   because yellow at 50% L is far lighter than blue at 50% L.
3. **Build a ramp** of 50/100/200/…/900. Step L evenly (about 0.97 → 0.25). Lower the chroma at
   the extremes so tints aren't neon and shades aren't muddy.
4. **Assign by contrast**, then check:
   - Fill behind white text (`--theme-primary` + `--theme-text-on-primary`): ≥ 4.5:1. If the brand
     hue is too light (cyan, yellow, lime, amber), either use a darker shade (600–700) for fills
     or use dark text on the fill. Don't ship white-on-light.
   - Same hue as text or icons on surfaces: ≥ 4.5:1 text, ≥ 3:1 icons.
   - Focus ring: ≥ 3:1 against the surface.
5. **Dark theme counterpart:** use a lighter, less saturated tone of the same hue (roughly the
   light theme's 300–400) so it passes on dark surfaces. Mirror the ramp: light 700 ≈ dark 300
   (Atlassian's symmetry rule). Avoid pure black (#000) backgrounds and pure white (#fff) body text
   in dark mode. Very high contrast causes halation (glow) for many readers.
6. **Hover and active states:** in light themes, step one shade darker per state. In dark themes,
   step one shade lighter. Don't use opacity for hover on filled buttons.
7. **Record it** as a token in `_light-theme.scss` **and** `_dark-theme.scss`. Never inline it.

## COLOR-8 - Data visualization colors

- Categorical: up to 8 distinct hues, ordered for maximum adjacent difference. Don't reuse the
  semantic colors (red, green, amber) for neutral categories.
- Sequential (low → high): a single-hue ramp from light to dark.
- Diverging (negative ↔ positive): two hues meeting at a neutral midpoint.
- Every series MUST also be identifiable without color: direct labels, markers or patterns.
- KPI change indicators: pair the up/down arrow with the color (`changeType`), never color alone.

## COLOR-9 - Dark mode checklist

- [ ] Every token used is a `--theme-*` token that has a dark value.
- [ ] Semantic text colors pass 4.5:1 on dark surfaces. Dark mode usually needs lighter tones
      (green-400, red-400, cyan-400) than light mode does.
- [ ] Shadows aren't the only cue for elevation.
- [ ] Images and illustrations don't glare. Consider slightly reduced brightness on large white
      images.
- [ ] Test with `<GlobalProvider themeConfig={{ mode: 'dark' }}>` and in Storybook's theme switcher.
