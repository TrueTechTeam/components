import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useQuery } from '@tanstack/react-query';
import { Page, Section, useLogger, usePageParams, param, usePageStore } from '../index';
import { Button } from '../../lib/components/buttons/Button';
import { StoryApp, wait } from './storyHelpers';

interface State {
  count: number;
}
const reducer = (state: State, action: { type: 'inc' }): State =>
  action.type === 'inc' ? { count: state.count + 1 } : state;

function Content() {
  const logger = useLogger('debug-story');
  const [params, setParams] = usePageParams({ tab: param.string('overview') });
  const [state, dispatch] = usePageStore<State, { type: 'inc' }>();
  const stats = useQuery({
    queryKey: ['debug-stats'],
    queryFn: async () => {
      await wait(500);
      return { visits: 42 };
    },
  });
  return (
    <div style={{ padding: 'var(--spacing-lg)', display: 'grid', gap: 'var(--spacing-md)' }}>
      <h1 style={{ margin: 0 }}>Debug panel</h1>
      <p>The panel at the bottom of the page lists queries, the page store, params and logs.</p>
      <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
        <Button size="sm" onClick={() => dispatch({ type: 'inc' })}>
          Store count: {state.count}
        </Button>
        <Button size="sm" variant="outline" onClick={() => setParams({ tab: 'details' })}>
          Set tab param ({params.tab})
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => logger.warn('Something looks off', { at: Date.now() })}
        >
          Log a warning
        </Button>
      </div>
      <Section title="Stats" queries={[stats]}>
        <p>Visits: {stats.data?.visits}</p>
      </Section>
    </div>
  );
}

const meta: Meta = {
  title: 'App Builder/Foundation/Debug panel',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    globalDecorators: 'provider',
    docs: {
      description: {
        component:
          '`Page` mounts a `DebugPanel` when `AppProvider` has `debug` enabled (default: any non-production build). It shows the page and section queries, the page store, URL params and recent logs. Production builds do not render it.',
      },
    },
  },
};
export default meta;

export const PanelOpen: StoryObj = {
  render: () => (
    <StoryApp debug>
      <Page title="Debug panel" reducer={reducer} initialState={{ count: 0 }}>
        <Content />
      </Page>
    </StoryApp>
  ),
};
