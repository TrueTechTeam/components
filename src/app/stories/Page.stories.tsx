import React, { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useQuery } from '@tanstack/react-query';
import { LastUpdated, Page, useFormatters } from '../index';
import { Button } from '../../lib/components/buttons/Button';
import { ORDERS, StoryApp, wait, type Order } from './storyHelpers';

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

function OrdersPage({ delay, fail, empty }: DemoProps) {
  const control = useRef({ delay, fail, empty });
  control.current = { delay, fail, empty };
  const { currency } = useFormatters();
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

  return (
    <Page
      title="Orders"
      description="Recent customer orders"
      queries={[orders]}
      isEmpty={([rows]) => (rows as Order[]).length === 0}
      empty={{ title: 'No orders yet', description: 'New orders will appear here.' }}
      permission={{ action: 'orders.read' }}
    >
      <div style={{ padding: 'var(--spacing-lg)', display: 'grid', gap: 'var(--spacing-md)' }}>
        <h1 style={{ margin: 0 }}>Orders</h1>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
          <Button size="sm" onClick={() => void orders.refetch()}>
            Refetch
          </Button>
          <LastUpdated query={orders} />
        </div>
        <ul>
          {orders.data?.map((o) => (
            <li key={o.id}>
              #{o.id} {o.customer}: {currency(o.total, 'USD')} ({o.status})
            </li>
          ))}
        </ul>
      </div>
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
          '`Page` renders the first matching state (forbidden, loading, error with retry, empty, content) from the TanStack Query results in `queries`. A failed background refetch keeps the loaded content and shows an inline alert with Retry. Use the controls on Playground, or the preset stories.',
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
      <OrdersPage {...args} />
    </StoryApp>
  ),
};
export default meta;

type Story = StoryObj<DemoProps>;

export const Playground: Story = {};
export const Loading: Story = { args: { delay: 600000 } };
export const ErrorWithRetry: Story = { args: { fail: true, delay: 200 } };
export const Empty: Story = { args: { empty: true, delay: 200 } };
export const Forbidden: Story = { args: { forbidden: true } };
/** Press Refetch: the bar overlays the content while the background refetch runs. */
export const Refreshing: Story = { args: { delay: 2500 } };
export const Content: Story = { args: { delay: 0 } };
