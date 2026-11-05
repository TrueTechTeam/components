import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useFormatters } from '../index';
import { Table, type ColumnConfig } from '../../lib/components/display/Table';
import { Code, DemoPanel, StoryApp, StoryFrame, storyStyles } from './storyHelpers';

interface DemoProps {
  locale: string;
}

interface Row {
  call: string;
  note: string;
  result: string;
}

const columns: Array<ColumnConfig<Row>> = [
  {
    key: 'call',
    header: 'Call',
    width: '24rem',
    render: (call) => <span className={storyStyles.mono}>{String(call)}</span>,
  },
  {
    key: 'note',
    header: 'Note',
    width: '14rem',
    render: (note) => <span className={storyStyles.muted}>{String(note)}</span>,
  },
  { key: 'result', header: 'Result', width: '1fr' },
];

function FormatterTable({ locale }: DemoProps) {
  const f = useFormatters();
  const date = new Date(2026, 10, 2, 14, 30);
  const rows: Row[] = [
    { call: 'dateTime(date)', note: 'default: medium date', result: f.dateTime(date) },
    {
      call: 'dateTime(date, { dateStyle, timeStyle })',
      note: 'long date with short time',
      result: f.dateTime(date, { dateStyle: 'long', timeStyle: 'short' }),
    },
    {
      call: 'relativeTime(3 hours ago)',
      note: 'auto unit',
      result: f.relativeTime(Date.now() - 3 * 3600_000),
    },
    {
      call: 'relativeTime(tomorrow, { numeric: "auto" })',
      note: 'natural phrasing',
      result: f.relativeTime(Date.now() + 24 * 3600_000, { numeric: 'auto' }),
    },
    { call: 'number(1234567.891)', note: 'grouped', result: f.number(1234567.891) },
    {
      call: 'currency(1234.5, "EUR")',
      note: 'ISO currency code',
      result: f.currency(1234.5, 'EUR'),
    },
    {
      call: 'percent(0.256, { fractionDigits: 1 })',
      note: 'ratio by default',
      result: f.percent(0.256, { fractionDigits: 1 }),
    },
    { call: 'fileSize(1536000)', note: 'decimal units', result: f.fileSize(1_536_000) },
    {
      call: 'fileSize(1536000, { binary: true })',
      note: 'binary units',
      result: f.fileSize(1_536_000, { binary: true }),
    },
    {
      call: 'list(["Ada", "Grace", "Alan"])',
      note: 'conjunction',
      result: f.list(['Ada', 'Grace', 'Alan']),
    },
    {
      call: 'list([...], { type: "disjunction" })',
      note: 'disjunction',
      result: f.list(['Ada', 'Grace', 'Alan'], { type: 'disjunction' }),
    },
  ];
  return (
    <StoryFrame
      title="Formatters"
      description={
        <>
          <Code>useFormatters()</Code> binds the core formatters to the <Code>AppProvider</Code>{' '}
          locale. Change the locale control to compare.
        </>
      }
    >
      <DemoPanel title={`Locale ${locale}`}>
        <Table<Row>
          data={rows}
          columns={columns}
          rowKey="call"
          size="sm"
          caption={`Formatter output for ${locale}`}
          captionHidden
        />
      </DemoPanel>
    </StoryFrame>
  );
}

const meta: Meta<DemoProps> = {
  title: 'App Builder/Foundation/Formatters',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
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
      <FormatterTable locale={locale} />
    </StoryApp>
  ),
};
