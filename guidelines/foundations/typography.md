# Typography

Text is most of what users read in an interface. Typography creates hierarchy, and hierarchy tells
users what matters and in what order.

## TYPE-1 - Use the token scale only (MUST)

Font sizes come from `--font-size-*`, weights from `--font-weight-*`, and line heights from
`--line-height-*`. No raw `px` or `rem` font sizes in component or app styles.

## TYPE-2 - Role → size mapping

| Role                                           | Size token                      | Weight          | Line height  |
| ---------------------------------------------- | ------------------------------- | --------------- | ------------ |
| Display / hero (marketing only)                | `--font-size-4xl` (36)          | bold            | tight        |
| Page title (`<h1>`, one per page)              | `--font-size-2xl`–`3xl` (24–30) | semibold        | tight        |
| Section heading (`<h2>`)                       | `--font-size-xl` (20)           | semibold        | tight        |
| Sub-section / card title (`<h3>`)              | `--font-size-lg` (18)           | semibold        | tight        |
| Body                                           | `--font-size-base` (16)         | normal          | normal (1.5) |
| UI text: controls, tables, dense lists, labels | `--font-size-sm` (14)           | normal / medium | normal       |
| Caption, helper text, timestamps, badges       | `--font-size-xs` (12)           | normal / medium | normal       |
| KPI value                                      | `--font-size-2xl`–`4xl`         | semibold        | tight        |

- Sizes step through a modular scale (about 1.125–1.25 ratio). Adjacent heading levels SHOULD
  differ by at least one step **and** by weight or color, or the hierarchy disappears.
- MUST NOT use text smaller than 12px. Use 12px only for short labels, never for paragraphs.
- Body text in reading contexts (articles, descriptions, empty states) SHOULD be 16px. Data-dense
  application UI MAY use 14px as the base.
- Use at most 3–4 distinct sizes per screen (excluding the KPI or hero size).

## TYPE-3 - Line height

- Body and paragraphs: `--line-height-normal` (1.5). WCAG 1.4.12 requires layouts to keep working
  when users raise it to 1.5×, so never clip text with a fixed `height` on text containers.
- Headings and single-line UI (buttons, badges): `--line-height-tight` (1.25).
- Long-form reading with wide columns: `--line-height-relaxed` (1.75).

## TYPE-4 - Line length (measure)

Body text SHOULD be 50–75 characters per line (Baymard; Bringhurst gives 45–75). Use
`max-width: var(--content-width-prose)` (70ch) on paragraphs. Full-bleed text spanning a 1440px
screen reduces comprehension and makes the return sweep hard.

## TYPE-5 - Weight and emphasis

- Use 2–3 weights per screen: normal (400) for body, medium (500) for labels and emphasis,
  semibold (600) for headings. Bold (700) is for display sizes or single-word emphasis.
- Avoid light (300) below 20px. It fails perceived contrast even when the ratio passes.
- Emphasis order: weight → color → size. Avoid ALL CAPS for anything over 2 words. If you use
  uppercase for overlines or table headers, add `letter-spacing: 0.04em` and keep it at
  `--font-size-xs`.
- Don't use italics for UI emphasis. They are harder to read on screen at small sizes.

## TYPE-6 - Numbers

- Use `font-variant-numeric: tabular-nums` for numbers in columns, KPIs, timers, prices and
  anything that updates in place. Digits keep equal width, so columns align and values don't
  jitter.
- Right-align numeric table columns (DATA-3). Use consistent decimal places within a column.
- Format numbers for the locale with `Intl.NumberFormat`. Abbreviate large values in KPIs (12.4k)
  and show the full value in a tooltip or table.

## TYPE-7 - Writing for UI (content design)

- **Sentence case** for everything: buttons, headings, labels, tabs. It's easier to scan than
  Title Case and is the norm in Material, Carbon and Polaris.
- Front-load the important word ("Billing settings", not "Settings for billing").
- Buttons: verb plus noun. Labels: nouns. Errors: what happened plus how to fix it ("Enter a date
  after today"), never just "Invalid".
- Truncate only when space is truly fixed. Use `OverflowText` (shows the full text on hover or
  focus) and never truncate the identifying part of a name.

## TYPE-8 - Semantic HTML

Headings MUST form a logical outline (h1 → h2 → h3, no skipped levels) independent of visual
size. Choose the heading level by structure and set the size with the scale. Screen-reader users
navigate by headings.
