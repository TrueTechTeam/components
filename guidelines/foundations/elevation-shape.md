# Elevation, Borders & Shape

## ELEV-1 - Elevation levels

| Level | Elements                                  | Light theme                                                   | Dark theme                                      | z-index token                  |
| ----- | ----------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------- | ------------------------------ |
| 0     | Page canvas                               | `--theme-background-primary`                                  | same token                                      | -                              |
| 1     | Cards, panels, tables (resting)           | `--theme-surface-primary` + border **or** `--theme-shadow-sm` | `--theme-surface-primary` (lighter than canvas) | -                              |
| 2     | Sticky headers, hovered interactive cards | `--theme-shadow-md`                                           | `--theme-surface-elevated`                      | `--z-sticky`                   |
| 3     | Dropdowns, menus, popovers, toasts        | `--theme-surface-elevated` + `--theme-shadow-lg` + border     | `--theme-surface-elevated` + border             | `--z-dropdown` / `--z-popover` |
| 4     | Dialogs                                   | `--theme-shadow-xl` + backdrop                                | `--theme-surface-elevated` + backdrop           | `--z-modal`                    |
| 5     | Tooltips                                  | inverse surface                                               | inverse surface                                 | `--z-tooltip`                  |

- A component uses **border OR shadow** at rest, rarely both. Floating layers (level 3+) use both,
  because they sit on arbitrary content.
- Shadow means "this floats above". Don't use shadows decoratively on flat content.
- Elevation SHOULD rise on interaction only for things that move or can be picked up (draggable
  cards). Hover feedback for clickable cards: change the border or background color plus at most
  one shadow step.

## SHADOW - Box shadows

### SHADOW-1 - Shadow tokens only (MUST)

Every `box-shadow` that expresses elevation uses a token. Never write raw offsets, blurs or
`rgba(0,0,0,…)`:

| Token                  | Use                                                                                      |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| `--theme-shadow-sm`    | Resting raised surfaces: elevated cards, kanban cards, KPI tiles                         |
| `--theme-shadow-md`    | Hover lift for interactive cards; sticky headers; small floating thumbs (Toggle, Slider) |
| `--theme-shadow-lg`    | Floating layers: popovers, menus, dropdowns, date pickers, toasts                        |
| `--theme-shadow-xl`    | Dialogs                                                                                  |
| `--theme-shadow-drag`  | An item being dragged (SortableList/Grid, KanbanCard, DragOverlay)                       |
| `--theme-shadow-inset` | Recessed wells and pressed states                                                        |

Components expose the token through a component variable (`--card-shadow: var(--theme-shadow-sm)`)
so consumers can override one component without touching the scale.

### SHADOW-2 - How the scale is built

- **Two layers per step**: a tight "contact" shadow (small offset, small blur) plus a soft
  "ambient" shadow (larger offset and blur, negative spread). One-layer shadows look either muddy or
  floaty.
- Offset is vertical only (light from above). Blur and offset grow together at each step:
  sm ≈ 1–3px, md ≈ 4–8px, lg ≈ 12–16px, xl ≈ 20–24px, drag ≈ 24px.
- Use a **negative spread** on the ambient layer so the shadow doesn't extend sideways past the
  element.
- Light theme: tint shadows with a cool near-black (`rgb(16 24 40 / …)`) at 4–18% opacity. Pure
  black at high opacity looks dirty on light surfaces.
- Dark theme: use pure black at much higher opacity (25–55%), and **always** pair it with a
  lighter surface (`--theme-surface-elevated`) and/or a 1px border. Shadows alone don't read on dark
  backgrounds (COLOR-4).

### SHADOW-3 - What shadows are NOT for (MUST NOT)

- **Focus indication.** Focus uses `outline` (`@include focus-ring` / `@include field-focus`). A
  `box-shadow` ring disappears in Windows forced-colors mode, and translucent halos
  (`0 0 0 3px <tint>`) don't reach 3:1 (A11Y-3).
- **Borders.** Use `border`. A `0 0 0 1px` shadow "border" is acceptable only as a hairline on
  images or avatars, where a real border would shift layout. Use `--theme-border-primary` as its
  color.
- **Decoration.** Don't put shadows on flat, in-flow content (paragraphs, table rows, form
  sections).
- **Colored glows.** Don't use primary or semantic colored shadows. A solid 2–3px `box-shadow` in
  `--theme-primary` is allowed as a **drop-target indicator** in drag-and-drop, because it is a
  state indicator rather than elevation.

### SHADOW-4 - Motion

Animate shadows only between two adjacent tokens (sm → md on hover), using `--duration-fast` and
`--ease-standard`. List `box-shadow` explicitly in `transition-property`, never `all`.

### SHADOW-5 - Exceptions

Directional shadows that signal overflow (a sticky table column, a scroll-edge fade) and the shadow
on a picker thumb that must stay visible over arbitrary colors (ColorPicker) MAY use literal values.
Comment why in the code.

## ELEV-2 - Radius

- Use one radius family per product. Nested radius: **inner radius = outer radius − padding**
  (minimum 0). Otherwise curves look uneven.
- Map size to radius: small controls `--radius-sm`, buttons and inputs `--radius-md`, cards and
  popovers `--radius-lg`, dialogs `--radius-xl`, pills and avatars `--radius-full`.
- Every control in one row (button, input, select) MUST share a radius.

## ELEV-3 - Borders

- Use 1px borders. Thicker borders only for focus (2px) or selected state (2px).
- Decorative: `--theme-border-primary`. Interactive boundaries: `--theme-input-border` or
  `--theme-control-border` (3:1, COLOR-6).
- Use either dividers between list or table rows or zebra striping, never both.

## ELEV-4 - Backdrops

Modal backdrops dim the page (about 40–60% black, slightly more in dark mode) so the dialog stands
out. Blur (`blurBackdrop`) is optional and expensive on low-end devices, so don't use it on
frequently opened dialogs.
