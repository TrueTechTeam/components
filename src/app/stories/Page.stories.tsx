import React, { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useQuery } from '@tanstack/react-query';
import { LastUpdated, Loadable, Page, useFormatters } from '../index';
import { Button } from '../../lib/components/buttons/Button';
import { Badge } from '../../lib/components/display/Badge';
import { KPI } from '../../lib/components/display/KPI';
import { Table, type ColumnConfig } from '../../lib/components/display/Table';
import { AdaptiveGrid } from '../../lib/components/layout/AdaptiveGrid';
import {
  ActionRow,
  DemoPanel,
  ORDER_STATUS_BADGE,
  ORDERS,
  StoryApp,
  StoryFrame,
  StoryHeader,
  wait,
  type Order,
} from './storyHelpers';

interface DemoProps {
  /** Fetch delay in ms */
  delay: number;
  /** Make the fetcher throw */
  fail: boolean;
  /** Return no rows */
  empty: boolean;
  /** Deny the `orders.read` permission */
  forbidden: boolean;
}

const STATUS_LABEL: Record<Order['status'], string> = {
  paid: 'Paid',
  pending: 'Pending',
  refunded: 'Refunded',
};

function OrdersTable({ rows }: { rows: Order[] }) {
  const { currency } = useFormatters();
  const columns: Array<ColumnConfig<Order>> = [
    { key: 'id', header: 'Order', width: '7rem', align: 'left', render: (id) => `#${String(id)}` },
    { key: 'customer', header: 'Customer' },
    {
      key: 'status',
      header: 'Status',
      width: '9rem',
      render: (status) => (
        <Badge variant={ORDER_STATUS_BADGE[status as Order['status']]} size="sm">
          {STATUS_LABEL[status as Order['status']]}
        </Badge>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      width: '8rem',
      align: 'right',
      render: (total) => currency(Number(total), 'USD'),
    },
  ];
  return (
    <Table<Order> data={rows} columns={columns} rowKey="id" caption="Recent orders" captionHidden />
  );
}

/** The summary card row: one KPI per Loadable, so each keeps its place while loading. */
function Summary({ rows }: { rows: Order[] }) {
  const { currency } = useFormatters();
  const revenue = rows.filter((o) => o.status === 'paid').reduce((sum, o) => sum + o.total, 0);
  const cards = [
    { title: 'Orders', subtitle: 'This week', value: () => rows.length },
    { title: 'Revenue', subtitle: 'Paid orders', value: () => currency(revenue, 'USD') },
    {
      title: 'Awaiting payment',
      subtitle: 'Pending',
      value: () => rows.filter((o) => o.status === 'pending').length,
    },
  ];
  return (
    <AdaptiveGrid minItemWidth={220} gap={16} justifyItems="stretch" fillMode="auto-fit">
      {cards.map((card) => (
        <Loadable key={card.title} shape="card" height="8.5rem">
          {() => <KPI title={card.title} subtitle={card.subtitle} value={card.value()} />}
        </Loadable>
      ))}
    </AdaptiveGrid>
  );
}

function OrdersPage({ delay, fail, empty }: DemoProps) {
  const control = useRef({ delay, fail, empty });
  control.current = { delay, fail, empty };
  const orders = useQuery<Order[]>({
    queryKey: ['story-orders'],
    queryFn: async () => {
      await wait(control.current.delay);
      if (control.current.fail) {
        throw new Error('Orders service unavailable');
      }
      return control.current.empty ? [] : ORDERS;
    },
  });
  const rows = orders.data ?? [];

  return (
    <Page
      title="Orders"
      description="Recent customer orders"
      queries={[orders]}
      isEmpty={([data]) => (data as Order[]).length === 0}
      empty={{ title: 'No orders yet', description: 'New orders will appear here.' }}
      permission={{ action: 'orders.read' }}
    >
      <StoryHeader
        title="Orders"
        description="Orders placed this week. The title, actions and layout render immediately; only the numbers and rows wait for data."
        actions={
          <>
            <Button variant="outline" onClick={() => void orders.refetch()}>
              Refetch
            </Button>
            <Button>New order</Button>
          </>
        }
      />
      <Summary rows={rows} />
      <DemoPanel title="Recent orders">
        <ActionRow justify="between">
          <Loadable shape="text" width="12rem">
            {() => <LastUpdated query={orders} />}
          </Loadable>
        </ActionRow>
        <Loadable shape="table" rows={ORDERS.length} columns={4}>
          {() => <OrdersTable rows={rows} />}
        </Loadable>
      </DemoPanel>
    </Page>
  );
}

const meta: Meta<DemoProps> = {
  title: 'App Builder/Foundation/Page',
  component: Page as never,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    globalDecorators: 'provider',
    docs: {
      description: {
        component:
          '`Page` renders the first matching state (forbidden, loading, error with retry, empty, content) from the TanStack Query results in `queries`. While loading, the page structure (title, actions, layout) renders immediately with its controls disabled, and each `Loadable` shows a skeleton shaped like its content. A failed background refetch keeps the loaded content and shows an inline alert with Retry. Use the controls on Playground, or the preset stories.',
      },
    },
  },
  argTypes: {
    delay: { control: { type: 'number', min: 0, max: 10000, step: 250 } },
    fail: { control: 'boolean' },
    empty: { control: 'boolean' },
    forbidden: { control: 'boolean' },
  },
  args: { delay: 800, fail: false, empty: false, forbidden: false },
  render: (args) => (
    // Remount when the scenario changes so each state starts from a fresh cache.
    <StoryApp
      key={`${args.fail}-${args.empty}-${args.forbidden}`}
      auth={{ user: null, can: () => !args.forbidden }}
    >
      <StoryFrame>
        <OrdersPage {...args} />
      </StoryFrame>
    </StoryApp>
  ),
};
export default meta;

type Story = StoryObj<DemoProps>;

export const Playground: Story = {};
/** Structure first: the header and actions render (disabled), Loadables show shaped skeletons. */
export const Loading: Story = { args: { delay: 600000 } };
export const ErrorWithRetry: Story = { args: { fail: true, delay: 200 } };
export const Empty: Story = { args: { empty: true, delay: 200 } };
export const Forbidden: Story = { args: { forbidden: true } };
/** Press Refetch: the bar overlays the content while the background refetch runs. */
export const Refreshing: Story = { args: { delay: 2500 } };
export const Content: Story = { args: { delay: 0 } };
