# Field Display

How to show each field of an API record: which `FieldKind` to use, where on the page it goes, and
how to infer both from a JSON sample or a schema. `FieldValue` implements the mapping once.
`DataTablePage` columns, `PropertyList`, `KeyFacts`, `RelatedRecords` and `KpiWidget kind` all use
it.

```tsx
import { FieldValue, type FieldDef } from '@true-tech-team/ui-components/app';

<FieldValue kind="currency" value={1250} currency="EUR" />;

const spend: FieldDef<Campaign> = {
  key: 'spend_cents',
  label: 'Spend',
  kind: 'currency',
  get: (c) => c.spend_cents / 100,
};
```

## FIELD-1 - Render values with `FieldValue` (MUST)

Render every data value through `FieldValue` or a `FieldDef` given to a template or block. Never
format a date, number or link by hand in page code.

Why: one implementation gives locale-aware formatting (`AppProvider locale`), tabular end-aligned
numbers, an em dash with a hidden "Not set" for empty or invalid values (never "Invalid Date" or
"NaN"), and URL safety. Each hand-written formatter drifts from the others.

## FIELD-2 - Type → `FieldKind` mapping

| Data                                                       | Kind       | Options and notes                                                                                                                           |
| ---------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Short string (name, title, city)                           | `text`     | -                                                                                                                                           |
| String enum that is a **state** (status, stage, health)    | `status`   | `statusTones` for every known value (`FIELD-10`), `statusLabels` when the humanized value reads badly. Renders a `Badge`                    |
| String enum that is a **category** (channel, type, plan)   | `text`     | `get: (r) => LABELS[r.channel]` for display text. Not a badge: categories carry no severity                                                 |
| ISO date only (`2026-03-01`)                               | `date`     | Parsed as a local calendar day, so it never shifts a day west of UTC                                                                        |
| ISO date-time (`2026-03-01T09:12:44Z`)                     | `datetime` | Absolute: for scheduled times, deadlines and audit fields                                                                                   |
| Date-time where recency matters (updated, last seen)       | `relative` | "3 hours ago", the absolute time in `title`. Not for future deadlines users plan around                                                     |
| Money                                                      | `currency` | `currency` (ISO 4217, default `'USD'`), `fractionDigits`. End-aligned. Convert minor units with `get` (`cents / 100`)                       |
| Count or quantity (orders, clicks, seats)                  | `number`   | End-aligned, grouped digits. `fractionDigits: 0` for counts                                                                                 |
| Measurement with decimals (score, rating, weight)          | `number`   | `fractionDigits`. Put the unit in the label ("Weight (kg)", `DATA-3`)                                                                       |
| Ratio or rate                                              | `percent`  | Expects a **ratio** (`0.034` → 3.4%). An API value already in 0–100: `get: (r) => r.rate / 100`. `fractionDigits` defaults to 0             |
| Byte count                                                 | `fileSize` | "1.2 MB" (decimal units)                                                                                                                    |
| Boolean                                                    | `boolean`  | "Yes"/"No". For an on/off **state** with meaning (active, verified), consider `status` with a `get` mapping                                 |
| Identifier (`id`, `uuid`, `sku`, order number)             | `id`       | Monospace with a copy button. Start-aligned even when numeric (`DATA-3`). Detail-only unless users search by it                             |
| Email address                                              | `email`    | `mailto:` link                                                                                                                              |
| Absolute http(s) URL                                       | `url`      | Shows the host, opens in a new tab with `noopener`. Other schemes (`javascript:`, `data:`) render as empty                                  |
| Phone number                                               | `phone`    | `tel:` link                                                                                                                                 |
| Image URL (avatar, thumbnail, logo)                        | `image`    | `imageAlt` when the image carries information, else decorative; `imageSize` (default 40). Only http(s), relative, `blob:` and `data:image/` |
| Long text (description, body, notes > ~80 chars)           | `longText` | Detail-only (`FIELD-6`). `truncate` only where space is fixed, and never for text users must read in full (`DATA-10`)                       |
| Array of strings, read as a sentence (regions, recipients) | `list`     | "A, B and C", locale-aware                                                                                                                  |
| Array of strings that are labels (tags, keywords)          | `tags`     | One `Tag` each                                                                                                                              |
| Nested object                                              | -          | Map its fields one by one (`FIELD-8`)                                                                                                       |
| Array of objects                                           | -          | A block, not a field (`FIELD-8`)                                                                                                            |

Use `fieldAlign(kind)` when you build a custom table: `'end'` for `number`, `currency`, `percent`
and `fileSize`, `'start'` for everything else.

## FIELD-3 - Infer kinds from a JSON sample

Read the **key name and the value together**. When they disagree, the value wins, and you note
the field as an open question.

| Signal in the sample                                                                                                             | Kind                                                            |
| -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Key `id`, `*_id`, `*Id`, `uuid`, `sku`, `ref`, `number` (as in order number)                                                     | `id`                                                            |
| `YYYY-MM-DD` string                                                                                                              | `date`                                                          |
| ISO 8601 date-time string; keys `*_at`, `*At`, `*_on`, `date`, `time`                                                            | `datetime` (`relative` for `updated*`, `last*`, `seen*`)        |
| Key `price`, `amount`, `cost`, `budget`, `spend`, `revenue`, `total`; suffix `_cents` / `_minor` → divide                        | `currency`                                                      |
| A sibling `currency` / `currency_code` field                                                                                     | `currency` with that code (ask if it varies per row: `FIELD-9`) |
| Key `rate`, `ratio`, `ctr`, `percent`, `pct`, `share`; number between 0 and 1                                                    | `percent`                                                       |
| Key `count`, `total_*`, `num_*`, `*_count`, `qty`, `quantity`; an integer                                                        | `number`                                                        |
| Key `size`, `bytes`, `file_size`                                                                                                 | `fileSize`                                                      |
| `true` / `false`; keys `is_*`, `has_*`, `can_*`, `*_enabled`                                                                     | `boolean`                                                       |
| Key `status`, `state`, `stage`, `phase`, `health`; few distinct lowercase values                                                 | `status`                                                        |
| Contains `@` and a dot after it                                                                                                  | `email`                                                         |
| Starts with `http://` or `https://`; ends in `.png`/`.jpg`/`.webp`/`.svg` or key `avatar`, `image`, `thumbnail`, `logo`, `photo` | `image`                                                         |
| Other `http(s)://` strings                                                                                                       | `url`                                                           |
| Key `phone`, `mobile`, `tel`                                                                                                     | `phone`                                                         |
| String longer than ~80 characters, or with line breaks                                                                           | `longText`                                                      |
| Array of strings; key `tags`, `labels`, `keywords`                                                                               | `tags`, else `list`                                             |

One sample shows one row. Enum values, nullability and number ranges need the schema or more
rows: ask for them, or list them as open questions in the brief.

## FIELD-4 - Infer kinds from JSON Schema, OpenAPI or TypeScript

| Schema                                                         | Kind                                                                                           |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `type: string, format: date` / TS `string` documented as a day | `date`                                                                                         |
| `format: date-time`                                            | `datetime` or `relative`                                                                       |
| `format: email` / `uri` / `uuid`                               | `email` / `url` / `id`                                                                         |
| `enum: [...]` or a TS string-literal union                     | `status` (states) or `text` + `get` (categories). The enum lists every value for `statusTones` |
| `type: integer`                                                | `number` (`fractionDigits: 0`), unless a money or byte key (`FIELD-3`)                         |
| `type: number` + `minimum: 0, maximum: 1`                      | `percent`                                                                                      |
| `type: boolean`                                                | `boolean`                                                                                      |
| `type: array, items: string`                                   | `tags` or `list`                                                                               |
| `type: array, items: object`                                   | A block (`FIELD-8`)                                                                            |
| `type: object`                                                 | Map its properties (`FIELD-8`)                                                                 |
| `nullable: true`, optional property, `T \| null`               | Fine: `FieldValue` shows "—" (`FIELD-9`)                                                       |
| `readOnly: true`                                               | Not in edit forms; show it in detail                                                           |
| `writeOnly: true`, `format: password`, secrets, tokens         | **hidden**, never displayed                                                                    |

Schema `description`s are a good source for labels and help text. Rewrite them in sentence case
(`FIELD-11`).

## FIELD-5 - Numbers: amount, count, percent or id?

- **Money** → `currency`, always with the currency code. Never show a bare "1250" for money.
- **Counts** → `number`, `fractionDigits: 0`.
- **Rates** → `percent`, checking whether the API sends a ratio (0–1) or a percentage (0–100).
  Get this wrong and the value is off by a factor of 100. Verify against a real value.
- **Number-like identifiers** (order 10042, ZIP, phone) → `id`/`text`/`phone`: start-aligned, not
  grouped (`10,042` would be wrong).
- **Durations** in seconds → `number` with the unit in the label, or convert with `get` to a
  readable string (kind `text`).

## FIELD-6 - Placement: column, summary, detail-only or hidden

Give every field exactly one placement in the brief:

| Placement       | Put here                                                                                          | Where it renders                                   |
| --------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| **column**      | What users scan, compare, sort or filter by across records                                        | `DataTablePage columns`, `RelatedRecords columns`  |
| **summary**     | The 3–6 facts that answer "what state is this record in?"                                         | `DetailsPage facts` (`KeyFacts`), the detail panel |
| **detail-only** | Everything users read on one record: long text, addresses, audit fields, ids, secondary links     | `PropertyList` in a tab, the side column           |
| **hidden**      | Internal fields (foreign keys already shown by name, version counters, raw JSON, secrets, hashes) | Nowhere. Write the reason in the brief             |

A field can be in a column **and** in the summary or detail. Long text, nested objects and
arrays of objects are never columns.

## FIELD-7 - Column budget (MUST)

- **≤ 7 visible columns** on a laptop (1024–1440px). More columns force horizontal scroll and
  slow scanning (NN/g, Carbon). Move the rest to the detail panel.
- **Order by priority:** 1) the identifying field (name or title, never a raw id unless users
  know records by it), 2) status, 3) the fields users decide on, 4) owner or assignee, 5) the
  key date. Numbers come after the text that explains them.
- The **first column** names the row: the template uses its text in row-action labels ("Actions
  for Spring Sale") and as the detail trigger. It must be a `text` (or `id`) field.
- On phones (`DATA-1`), offer a `'list'` or `'grid'` view (`views`) when the table has more than
  ~4 columns.

## FIELD-8 - Nested objects and arrays of objects

- **Nested object, 1–2 useful fields** (`owner.name`): flatten with `get`. `FieldDef.key` must
  be a top-level key of the record (it is also the React key and the sort key), so use the
  parent key: `{ key: 'owner', label: 'Owner', kind: 'text', get: (r) => r.owner?.name }`. Use
  `?.`, because nested objects can be `null`. When two `FieldDef`s share a key, keep them in
  separate lists (React keys).
- **Nested object, many fields** (address, billing): its own `PropertyList` with a `title` in
  the detail, each field flattened with `get`.
- **Array of child records** (line items, members): `RelatedRecords` (≤ 5 rows, "View all") on a
  details page, linking to the child's own list.
- **Array of events** (`history`, `events`, `audit`): map to `ActivityItem` (`id`, `at`, `text`,
  `actor`) and use `ActivityTimeline`.
- **Array of files or images**: map to `MediaItem` (`id`, `src`, `alt`, `name`, `size`, `href`)
  and use `MediaGallery`.
- **Array of comments**: map to `NoteItem` (`id`, `author`, `at`, `body`) and use `Notes`.

## FIELD-9 - Empty, invalid and per-row values

- Pass the raw value. `FieldValue` shows "—" with a visually hidden "Not set" for `null`,
  `undefined`, empty strings, empty arrays, unparsable dates and numbers, and unsafe URLs. Don't
  substitute "N/A", "0" or "Unknown". They read as real data.
- Use `isEmptyFieldValue(kind, value)` to decide whether to render a whole optional block.
- When the meaning of empty matters ("No end date" = runs forever), say it with `get`:
  `get: (r) => r.end_date ?? 'Runs until stopped'` with kind `text`.
- `FieldOptions` are per field, not per row. When the currency (or unit) varies by row, convert
  on the server, or render a custom cell. Don't show every row in the first row's currency.

## FIELD-10 - Status tones (MUST)

- Map **every** known enum value in `statusTones`. Unknown values fall back to `'neutral'`.
- Tones follow the severity mapping in [../components/choosing.md](../components/choosing.md):
  `success` = healthy or done well (active, paid), `warning` = needs attention soon (paused,
  expiring), `danger` = failed or blocked (failed, overdue), `info` = in progress or scheduled,
  `neutral` = inactive or finished with no judgment (draft, archived, completed).
- The label always shows the text, so meaning never depends on color alone (`COLOR-5`).
- Use the same tones for the same status on every page (`PAGE-5`). Define them once
  (`STATUS_TONES`) and reuse them for columns, facts and `DetailsPage status`.

## FIELD-11 - Labels

- Sentence case, 1–3 words, from the user's vocabulary, not the API's: `budget_cents` → "Budget",
  `ctr` → "CTR" (an acronym users know), `end_date` → "Ends".
- Units go in the label when the value doesn't show them ("Duration (min)", `DATA-3`). Currency
  and percent show their own symbol.
- Use the same label for the same field everywhere: column, fact and property.
