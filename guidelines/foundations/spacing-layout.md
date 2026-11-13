# Spacing & Layout

## SPACE-1 - Everything on the 4px grid (MUST)

All margins, paddings, gaps and component dimensions are multiples of 4px, taken from
`--spacing-*`. Exceptions: 1px borders, and 2px for focus offsets and fine-tuning optical
alignment of icons.

## SPACE-2 - Choosing a spacing value

Spacing grows with the **conceptual distance** between elements:

| Relationship                                                         | Token                                                |
| -------------------------------------------------------------------- | ---------------------------------------------------- |
| Parts of one control: icon ↔ label, label ↔ input                  | `xs` (4) – `sm` (8)                                  |
| Items in a tight group: buttons in a bar, chips, list item internals | `sm` (8)                                             |
| Siblings in a group: form fields, list rows, cards in a grid         | `md` (16)                                            |
| Container padding: card, dialog body, panel                          | `md` (16) default · `lg` (24) roomy · `sm` (8) dense |
| Between groups: form sections, card sections                         | `lg` (24) – `xl` (32)                                |
| Between page regions: header ↔ content, major sections              | `xl` (32) – `xxl` (48)                               |

Use `gap` on flex or grid parents rather than margins on children. It avoids collapsing margins
and "last child" hacks.

## SPACE-3 - Proximity: inner < outer (MUST)

The space **inside** a group MUST be smaller than the space **between** groups. Aim for at least
2×. Gestalt proximity: people read close elements as related. When everything is evenly spaced,
nothing reads as grouped.

```
Label            ← xs/sm
[ Input       ]
Helper text      ← xs
                 ← md (next field)
Label
[ Input       ]
                 ← xl (next section)
Section heading
```

A heading belongs to the content **below** it: put more space above a heading than below it.

## SPACE-4 - Density

| Density     | When                                                 | Control size | Container padding |
| ----------- | ---------------------------------------------------- | ------------ | ----------------- |
| Compact     | Data tools, tables, expert users who scan a lot      | `sm`         | `sm`              |
| Default     | Most application UI                                  | `md`         | `md`              |
| Comfortable | Marketing, onboarding, touch-first, infrequent tasks | `lg`         | `lg`              |

Pick one density per screen region and apply it consistently. Compact density MUST still meet the
24px minimum target size.

## SPACE-5 - Alignment

- Align to a few strong edges. Every element should share a left edge (LTR) with something else.
  Keep it to at most 2–3 alignment lines per region.
- Left-align text in LTR UIs. Center only short, standalone content (empty states, a hero,
  single-action dialogs).
- Optically align icons with the text cap height, not the line box.

---

## LAYOUT-1 - Page structure

- Constrain content width: `max-width: var(--content-width-page)` (1280px), centered, with
  `--spacing-md` side padding on mobile and `--spacing-lg`–`xl` on desktop.
- Forms: single column, `max-width: var(--content-width-form)` (FORM-1).
- Reading content: `max-width: var(--content-width-prose)`.
- Data-heavy pages (tables, dashboards, editors) MAY use the full width.

## LAYOUT-2 - Responsive breakpoints

Design mobile-first and add layout at wider widths. Use the named breakpoints in SCSS
(`@include bp(laptop)` / `bp-down(laptop)` from `styles/mixins/breakpoints`) and in React
(`useBreakpoint()`, `useBreakpointValue()`):

| Name    | Min width | Typical change                                           |
| ------- | --------- | -------------------------------------------------------- |
| phone   | 0         | Single column. Bottom navigation. Full-width buttons OK. |
| tablet  | 600px     | Two-column grids                                         |
| laptop  | 1024px    | Side navigation visible. Multi-column layouts            |
| desktop | 1440px    | Content stops growing (`--content-width-page`)           |

- MUST work at **320px** wide without horizontal scrolling, and at 200% and 400% zoom (WCAG
  1.4.10 Reflow). Tables are exempt and may scroll horizontally inside their container.
- Prefer intrinsic layouts (`AdaptiveGrid` with `minItemWidth`, flex-wrap) over breakpoint
  overrides. They adapt to container width rather than viewport width.

## LAYOUT-3 - Layout components

| Need                                                 | Component            | Key props                                                                |
| ---------------------------------------------------- | -------------------- | ------------------------------------------------------------------------ |
| Responsive grid of equal-width items (cards, tiles)  | `AdaptiveGrid`       | `minItemWidth` (≈ 240–320 for cards), `gap`, `maxColumns`                |
| Items of varying height (gallery, notes)             | `MasonryLayout`      | column width                                                             |
| Row on desktop, column on mobile                     | `ResponsiveStack`    | breakpoint (default 768, a legacy default; prefer the named breakpoints) |
| Persistent split view (list + detail, nav + content) | `Panes` / `Pane`     | sizes, gap                                                               |
| User-resizable split                                 | `ResizablePanels`    | min/max sizes                                                            |
| Scrollable region with styled scrollbar              | `ScrollArea`         | -                                                                        |
| Collapsible app sidebar                              | `CollapsibleSidebar` | `position`                                                               |

Gaps passed as numbers to layout components SHOULD be 4px-grid values that match the tokens (8,
16, 24, 32).

## LAYOUT-4 - Visual hierarchy on a screen

Users scan web pages in an F-pattern and dashboards top-left first (NN/g eye-tracking). So:

1. Put the page title and primary action at the top. The primary action goes top-right of the page
   header, or at the end of the form.
2. Put the most important information top-left.
3. Group related content into clearly separated regions (cards or spacing) with headings.
4. Push secondary details down or behind disclosure (Tabs, Accordion, "Show more").

## LAYOUT-5 - Sizing interactive elements

- Pointer targets ≥ 24 × 24px (WCAG 2.5.8 AA). Touch-first UIs SHOULD use ≥ 44 × 44px (Apple HIG;
  WCAG 2.5.5 AAA). Material uses 48dp. Use `size="lg"` controls or extra padding for touch.
- Space adjacent small targets so that 24px circles centered on each don't overlap.
- Fitts's law: put frequent and important targets large and close to where the user's attention
  already is. Put destructive targets away from frequent ones.
