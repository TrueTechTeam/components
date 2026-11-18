import React, { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useQuery } from '@tanstack/react-query';
import { Loadable, Page, Section, useLogger, usePageParams, param, usePageStore } from '../index';
import { Button } from '../../lib/components/buttons/Button';
import {
  ActionRow,
  Code,
  DemoPanel,
  StoryApp,
  StoryFrame,
  storyStyles,
  wait,
} from './storyHelpers';

interface State {
  count: number;
}
const reducer = (state: State, action: { type: 'inc' }): State =>
  action.type === 'inc' ? { count: state.count + 1 } : state;

/** Opens the panel once on mount through its keyboard shortcut (Ctrl+Shift+D). */
function OpenPanelOnMount() {
  useEffect(() => {
    // After the panel's own effect has registered its shortcut listener.
    const id = setTimeout(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'D', ctrlKey: true, shiftKey: true, bubbles: true })
      );
    }, 0);
    return () => clearTimeout(id);
  }, []);
  return null;
}

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
    <StoryFrame
      title="Debug panel"
      width="form"
      description={
        <>
          The panel lists this page&apos;s queries, its store, URL params and recent logs. Toggle it
          with the button at the bottom right or <Code>Ctrl+Shift+D</Code>.
        </>
      }
    >
      <DemoPanel title="Change something" description="Each action shows up in the panel.">
        <ActionRow>
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
        </ActionRow>
      </DemoPanel>
      <DemoPanel>
        <Section title="Stats" queries={[stats]}>
          <Loadable shape="text">
            {() => (
              <span className={storyStyles.muted}>Visits this week: {stats.data?.visits}</span>
            )}
          </Loadable>
        </Section>
      </DemoPanel>
    </StoryFrame>
  );
}

const meta: Meta = {
  title: 'App Builder/Foundation/Debug panel',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    globalDecorators: 'provider',
    docs: {
      // The panel is fixed to the viewport: give the docs preview its own frame.
      story: { inline: false, height: '720px' },
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
        <OpenPanelOnMount />
      </Page>
    </StoryApp>
  ),
};
