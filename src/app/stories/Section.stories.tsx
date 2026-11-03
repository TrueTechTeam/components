import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useQuery } from '@tanstack/react-query';
import { Page, Section } from '../index';
import { StoryApp, wait } from './storyHelpers';

function useDemoQuery(key: string, fail = false, delay = 400) {
  return useQuery({
    queryKey: ['story-section', key],
    queryFn: async () => {
      await wait(delay);
      if (fail) {
        throw new Error(`${key} failed`);
      }
      return `${key} loaded`;
    },
  });
}

function Dashboard() {
  const revenue = useDemoQuery('Revenue');
  const traffic = useDemoQuery('Traffic', true);
  const signups = useDemoQuery('Signups', false, 1200);
  return (
    <Page title="Dashboard">
      <div style={{ padding: 'var(--spacing-lg)', display: 'grid', gap: 'var(--spacing-lg)' }}>
        <h1 style={{ margin: 0 }}>Dashboard</h1>
        <Section title="Revenue" queries={[revenue]}>
          <p>{revenue.data}</p>
        </Section>
        <Section title="Traffic" queries={[traffic]}>
          <p>{traffic.data}</p>
        </Section>
        <Section title="Signups" queries={[signups]}>
          <p>{signups.data}</p>
        </Section>
      </div>
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
          'A `Section` has its own loading, error, empty and forbidden states and its own error boundary, so one failing section never takes down its siblings. In this story Traffic fails while Revenue and Signups load.',
      },
    },
  },
};
export default meta;

export const OneFailingOfThree: StoryObj<typeof Section> = {
  render: () => (
    <StoryApp>
      <Dashboard />
    </StoryApp>
  ),
};
