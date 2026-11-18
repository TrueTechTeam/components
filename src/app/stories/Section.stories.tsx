import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useQuery } from '@tanstack/react-query';
import { Loadable, Page, Section, useFormatters } from '../index';
import { Card } from '../../lib/components/display/Card';
import { Badge } from '../../lib/components/display/Badge';
import { AdaptiveGrid } from '../../lib/components/layout/AdaptiveGrid';
import { StoryApp, StoryFrame, storyStyles, wait } from './storyHelpers';

interface Metric {
  value: number;
  change: number;
}

function useMetric(key: string, value: number, { fail = false, delay = 400 } = {}) {
  return useQuery<Metric>({
    queryKey: ['story-section', key],
    queryFn: async () => {
      await wait(delay);
      if (fail) {
        throw new Error(`${key} failed`);
      }
      return { value, change: 0.042 };
    },
  });
}

function MetricCard({
  title,
  query,
  format,
}: {
  title: string;
  query: ReturnType<typeof useMetric>;
  format: (n: number) => string;
}) {
  const { percent } = useFormatters();
  return (
    <Card variant="outlined" padding="lg">
      <Section title={title} queries={[query]}>
        <div className={storyStyles.metric}>
          <Loadable shape="heading" width="60%">
            {() => <span className={storyStyles.metricValue}>{format(query.data!.value)}</span>}
          </Loadable>
          <Loadable shape="text" width="45%">
            {() => (
              <span className={storyStyles.muted}>
                <Badge variant="success" size="sm">
                  +{percent(query.data!.change, { fractionDigits: 1 })}
                </Badge>{' '}
                vs. last week
              </span>
            )}
          </Loadable>
        </div>
      </Section>
    </Card>
  );
}

function Dashboard() {
  const { currency, number } = useFormatters();
  const revenue = useMetric('Revenue', 48210);
  const traffic = useMetric('Traffic', 0, { fail: true });
  const signups = useMetric('Signups', 1284, { delay: 1500 });
  const orders = useMetric('Orders', 312, { delay: 900 });
  return (
    <Page title="Dashboard">
      <StoryFrame
        title="Dashboard"
        description="Each card is a Section with its own query, loading skeleton, error state and error boundary. Traffic fails; the other cards are unaffected."
      >
        <AdaptiveGrid minItemWidth={220} gap={16} justifyItems="stretch" fillMode="auto-fit">
          <MetricCard title="Revenue" query={revenue} format={(n) => currency(n, 'USD')} />
          <MetricCard title="Traffic" query={traffic} format={number} />
          <MetricCard title="Signups" query={signups} format={number} />
          <MetricCard title="Orders" query={orders} format={number} />
        </AdaptiveGrid>
      </StoryFrame>
    </Page>
  );
}

const meta: Meta<typeof Section> = {
  title: 'App Builder/Foundation/Section',
  component: Section,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    globalDecorators: 'provider',
    docs: {
      description: {
        component:
          'A `Section` has its own loading, error, empty and forbidden states and its own error boundary, so one failing section never takes down its siblings. Its `Loadable`s follow its own queries; a Section without queries follows the Page. In this story Traffic fails while the other cards load at different speeds.',
      },
    },
  },
};
export default meta;

export const OneFailingOfFour: StoryObj<typeof Section> = {
  render: () => (
    <StoryApp>
      <Dashboard />
    </StoryApp>
  ),
};
