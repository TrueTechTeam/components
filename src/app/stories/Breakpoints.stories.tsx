import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useBreakpoint, useBreakpointValue } from '../../lib/hooks/useBreakpoint';
import { Badge } from '../../lib/components/display/Badge';
import { Card } from '../../lib/components/display/Card';
import { Table, type ColumnConfig } from '../../lib/components/display/Table';
import { Code, DemoPanel, StoryApp, StoryFrame, storyStyles } from './storyHelpers';

interface Row {
  call: string;
  value: React.ReactNode;
}

const columns: Array<ColumnConfig<Row>> = [
  {
    key: 'call',
    header: 'Call',
    render: (call) => <span className={storyStyles.mono}>{String(call)}</span>,
  },
  { key: 'value', header: 'Value', width: '12rem', render: (value) => value as React.ReactNode },
];

const yesNo = (value: boolean) => (
  <Badge variant={value ? 'success' : 'neutral'} size="sm">
    {String(value)}
  </Badge>
);

function BreakpointReadout() {
  const bp = useBreakpoint();
  const columnsCount = useBreakpointValue({ phone: 1, tablet: 2, laptop: 3, desktop: 4 }) ?? 1;
  const rows: Row[] = [
    { call: 'useBreakpoint().name', value: <Badge variant="primary">{bp.name}</Badge> },
    { call: "up('tablet')", value: yesNo(bp.up('tablet')) },
    { call: "down('laptop')", value: yesNo(bp.down('laptop')) },
    {
      call: 'useBreakpointValue({ phone: 1, tablet: 2, laptop: 3, desktop: 4 })',
      value: <span className={storyStyles.mono}>{columnsCount}</span>,
    },
  ];
  return (
    <StoryFrame
      title="Breakpoints"
      description={
        <>
          Resize the preview: phone below 600px, tablet 600+, laptop 1024+, desktop 1440+. In SCSS
          use <Code>@include bp(tablet)</Code>.
        </>
      }
    >
      <DemoPanel title="Current breakpoint">
        <Table<Row> data={rows} columns={columns} rowKey="call" size="sm" />
      </DemoPanel>
      <DemoPanel
        title={`${columnsCount} column${columnsCount === 1 ? '' : 's'}`}
        description="A grid whose column count comes from useBreakpointValue."
      >
        <div
          className={storyStyles.grid}
          style={{ gridTemplateColumns: `repeat(${columnsCount}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: 4 }, (_, i) => (
            <Card key={i} variant="filled" padding="md">
              Card {i + 1}
            </Card>
          ))}
        </div>
      </DemoPanel>
    </StoryFrame>
  );
}

const meta: Meta = {
  title: 'App Builder/Foundation/Breakpoints',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    globalDecorators: 'provider',
    docs: {
      description: {
        component:
          '`useBreakpoint()` reports the named breakpoint (`phone`, `tablet`, `laptop`, `desktop`) with `up(name)` and `down(name)`; `useBreakpointValue({ phone, tablet, ... })` picks the nearest value at or below it (mobile first). In SCSS use `@include bp(tablet)` and `@include bp-down(laptop)`. Override the widths with the `breakpoints` prop of `GlobalProvider` or `AppProvider`.',
      },
    },
  },
};
export default meta;

export const LiveBreakpoint: StoryObj = {
  render: () => (
    <StoryApp>
      <BreakpointReadout />
    </StoryApp>
  ),
};
