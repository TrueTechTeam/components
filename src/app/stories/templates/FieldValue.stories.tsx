import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FieldValue, fieldAlign, type FieldKind, type FieldOptions } from '../../index';
import { Code, DemoPanel, Note, StoryApp, StoryFrame } from '../storyHelpers';
import { ASSETS, daysAgo } from './fixtures';
import styles from './templates.module.scss';

interface Row {
  kind: FieldKind;
  value: unknown;
  invalid: unknown;
  options?: FieldOptions;
  optionsLabel?: string;
}

const ROWS: Row[] = [
  { kind: 'text', value: 'Spring launch 2026', invalid: '   ' },
  {
    kind: 'longText',
    value:
      'Paid search and social push for the spring collection, with a creator collaboration in week two.',
    invalid: '',
    options: { truncate: 48 },
    optionsLabel: 'truncate: 48',
  },
  { kind: 'number', value: 128_400, invalid: 'n/a' },
  {
    kind: 'currency',
    value: 42_000,
    invalid: 'free',
    options: { currency: 'EUR' },
    optionsLabel: "currency: 'EUR'",
  },
  {
    kind: 'percent',
    value: 0.4125,
    invalid: NaN,
    options: { fractionDigits: 1 },
    optionsLabel: 'fractionDigits: 1',
  },
  { kind: 'date', value: '2026-03-03', invalid: '2026-13-45' },
  { kind: 'datetime', value: '2026-03-03T09:30:00Z', invalid: 'tomorrow' },
  { kind: 'relative', value: daysAgo(0.125), invalid: {} },
  { kind: 'boolean', value: true, invalid: 'yes' },
  {
    kind: 'status',
    value: 'in_review',
    invalid: '',
    options: { statusTones: { in_review: 'warning' } },
    optionsLabel: "statusTones: { in_review: 'warning' }",
  },
  { kind: 'email', value: 'maya.patel@acme.dev', invalid: '' },
  { kind: 'url', value: 'https://www.acme.dev/spring', invalid: 'javascript:alert(1)' },
  { kind: 'phone', value: '+1 (415) 555-0134', invalid: 'call me' },
  { kind: 'id', value: 'cmp_8f2c41d9', invalid: '' },
  {
    kind: 'image',
    value: ASSETS[0].thumbnail,
    invalid: 'data:text/html,<b>x</b>',
    options: { imageAlt: 'Northwind logo mark' },
    optionsLabel: "imageAlt: '…'",
  },
  { kind: 'fileSize', value: 18_400_000, invalid: -1 },
  { kind: 'list', value: ['Search', 'Social', 'Email'], invalid: 'Search' },
  { kind: 'tags', value: ['spring', 'paid', 'creators'], invalid: [] },
];

function show(value: unknown): string {
  if (typeof value === 'string') {
    return value.length > 40 ? `'${value.slice(0, 37)}…'` : `'${value}'`;
  }
  if (typeof value === 'number' && Number.isNaN(value)) {
    return 'NaN';
  }
  return JSON.stringify(value);
}

function KindTable() {
  return (
    <div className={styles.tableScroll} tabIndex={0} role="region" aria-label="FieldValue kinds">
      <table className={styles.kindTable}>
        <caption className={styles.visuallyHidden}>
          Every FieldKind with a valid, an empty and an invalid value
        </caption>
        <thead>
          <tr>
            <th scope="col">Kind</th>
            <th scope="col">Valid value</th>
            <th scope="col">Rendered</th>
            <th scope="col">
              Empty (<Code>null</Code>)
            </th>
            <th scope="col">Invalid value</th>
            <th scope="col">Rendered</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.kind}>
              <th scope="row">
                <div className={styles.inputCell}>
                  <span>{row.kind}</span>
                  {row.optionsLabel && <code>{row.optionsLabel}</code>}
                </div>
              </th>
              <td>
                <code>{row.kind === 'image' ? "'data:image/svg+xml,…'" : show(row.value)}</code>
              </td>
              <td style={{ textAlign: fieldAlign(row.kind) }}>
                <FieldValue kind={row.kind} value={row.value} {...row.options} />
              </td>
              <td>
                <FieldValue kind={row.kind} value={null} {...row.options} />
              </td>
              <td>
                <code>{show(row.invalid)}</code>
              </td>
              <td>
                <FieldValue kind={row.kind} value={row.invalid} {...row.options} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface Args {
  kind: FieldKind;
  value: unknown;
}

const meta: Meta<Args> = {
  title: 'App Builder/Templates/FieldValue',
  component: FieldValue as never,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    globalDecorators: 'provider',
    docs: {
      description: {
        component:
          'Renders one schema value by `FieldKind`, the same way in tables, cards, property lists and key facts: locale-aware numbers and dates, toned status badges, safe links, copyable ids, thumbnails, lists and tags. Empty or invalid values render an em dash with a visually hidden "Not set"; unsafe URL schemes render as empty. Numeric kinds are end-aligned in tables (`fieldAlign`). See `guidelines/app/field-display.md` (FIELD-1 to FIELD-11).',
      },
    },
  },
  argTypes: {
    kind: { control: 'select', options: ROWS.map((r) => r.kind) },
    value: { control: 'object' },
  },
};
export default meta;

type Story = StoryObj<Args>;

/** Every kind with a valid, an empty and an invalid value. */
export const AllKinds: Story = {
  name: 'All kinds',
  render: () => (
    <StoryApp>
      <StoryFrame
        title="FieldValue kinds"
        description="Pick a kind from the data's meaning, not its JSON type: an amount in cents is currency, a 0–1 ratio is percent, an id is id."
      >
        <DemoPanel>
          <KindTable />
        </DemoPanel>
        <Note>
          Locale and currency formatting come from <Code>AppProvider</Code> (<Code>locale</Code>);
          the em dash for empty values is announced as &quot;Not set&quot;.
        </Note>
      </StoryFrame>
    </StoryApp>
  ),
};

/** Try a kind and a value. */
export const Playground: Story = {
  args: { kind: 'currency', value: 1299.5 },
  render: (args) => (
    <StoryApp>
      <StoryFrame title="Playground" description="Change the kind and the value in the controls.">
        <DemoPanel>
          <FieldValue kind={args.kind} value={args.value} />
        </DemoPanel>
      </StoryFrame>
    </StoryApp>
  ),
};
