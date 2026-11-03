import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useFormatters } from '../index';
import { StoryApp } from './storyHelpers';

interface DemoProps {
  locale: string;
}

function FormatterTable() {
  const f = useFormatters();
  const date = new Date(2026, 10, 2, 14, 30);
  const rows: Array<[string, string, string]> = [
    ['dateTime(date)', 'default: medium date', f.dateTime(date)],
    [
      'dateTime(date, { dateStyle, timeStyle })',
      'long date with short time',
      f.dateTime(date, { dateStyle: 'long', timeStyle: 'short' }),
    ],
    ['relativeTime(3 hours ago)', 'auto unit', f.relativeTime(Date.now() - 3 * 3600_000)],
    [
      'relativeTime(tomorrow, { numeric: "auto" })',
      'natural phrasing',
      f.relativeTime(Date.now() + 24 * 3600_000, { numeric: 'auto' }),
    ],
    ['number(1234567.891)', 'grouped', f.number(1234567.891)],
    ['currency(1234.5, "EUR")', 'ISO currency code', f.currency(1234.5, 'EUR')],
    [
      'percent(0.256, { fractionDigits: 1 })',
      'ratio by default',
      f.percent(0.256, { fractionDigits: 1 }),
    ],
    ['fileSize(1536000)', 'decimal units', f.fileSize(1_536_000)],
    [
      'fileSize(1536000, { binary: true })',
      'binary units',
      f.fileSize(1_536_000, { binary: true }),
    ],
    ['list(["a","b","c"])', 'conjunction', f.list(['Ada', 'Grace', 'Alan'])],
    [
      'list([...], { type: "disjunction" })',
      'disjunction',
      f.list(['Ada', 'Grace', 'Alan'], { type: 'disjunction' }),
    ],
  ];
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', maxWidth: 820 }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left', padding: 'var(--spacing-sm)' }}>Call</th>
          <th style={{ textAlign: 'left', padding: 'var(--spacing-sm)' }}>Note</th>
          <th style={{ textAlign: 'left', padding: 'var(--spacing-sm)' }}>Result</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([call, note, result]) => (
          <tr key={call} style={{ borderTop: '1px solid var(--theme-border, currentColor)' }}>
            <td style={{ padding: 'var(--spacing-sm)', fontFamily: 'var(--font-family-mono)' }}>
              {call}
            </td>
            <td style={{ padding: 'var(--spacing-sm)' }}>{note}</td>
            <td style={{ padding: 'var(--spacing-sm)' }}>{result}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const meta: Meta<DemoProps> = {
  title: 'App Builder/Foundation/Formatters',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    globalDecorators: 'provider',
    docs: {
      description: {
        component:
          '`useFormatters()` returns the core formatters (`dateTime`, `relativeTime`, `number`, `currency`, `percent`, `fileSize`, `list`) bound to the `AppProvider` locale. The same functions are exported unbound from the main entry (`formatDateTime`, ...) and take a trailing `locale` argument. They return an empty string for invalid input and never throw.',
      },
    },
  },
  argTypes: {
    locale: { control: 'select', options: ['en-US', 'en-GB', 'fr-FR', 'de-DE', 'ja-JP', 'ar-EG'] },
  },
  args: { locale: 'en-US' },
};
export default meta;

export const AllFormatters: StoryObj<DemoProps> = {
  render: ({ locale }) => (
    <StoryApp locale={locale}>
      <FormatterTable />
    </StoryApp>
  ),
};
