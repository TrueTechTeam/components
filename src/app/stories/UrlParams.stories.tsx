import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Page, param, usePageParams, usePreference } from '../index';
import { Button } from '../../lib/components/buttons/Button';
import {
  ButtonToggleGroup,
  ButtonToggleGroupItem,
} from '../../lib/components/buttons/ButtonToggleGroup';
import { Input } from '../../lib/components/inputs/Input';
import { ActionRow, Code, CodeBlock, DemoPanel, StoryApp, StoryFrame } from './storyHelpers';

const SORTS = ['name', 'date', 'total'] as const;

const schema = {
  q: param.string(''),
  page: param.number(1),
  sort: param.enum(SORTS, 'name'),
  archived: param.boolean(false),
};

function Demo() {
  const [params, setParams] = usePageParams(schema);
  const [density, setDensity] = usePreference<'comfortable' | 'compact'>('density', 'comfortable', {
    storage: 'local',
  });
  const [view, setView] = usePreference('view', 'list');

  return (
    <Page title="URL params and preferences">
      <StoryFrame
        title="URL params and preferences"
        width="form"
        description="State lives in the URL search string (this story uses the History API adapter, so the preview URL changes). Reload to see it restored."
      >
        <DemoPanel title="URL params" description={<Code>usePageParams(schema)</Code>}>
          <Input
            label="Search (q)"
            value={params.q}
            onChange={(e) => setParams({ q: e.target.value, page: 1 }, { replace: true })}
          />
          <ActionRow>
            <ButtonToggleGroup
              aria-label="Sort"
              size="sm"
              value={params.sort}
              onChange={(sort) => setParams({ sort: sort as (typeof SORTS)[number] })}
            >
              {SORTS.map((s) => (
                <ButtonToggleGroupItem key={s} value={s}>
                  Sort by {s}
                </ButtonToggleGroupItem>
              ))}
            </ButtonToggleGroup>
          </ActionRow>
          <ActionRow>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setParams({ page: params.page + 1 })}
            >
              Next page ({params.page})
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setParams({ archived: !params.archived })}
            >
              Archived: {params.archived ? 'shown' : 'hidden'}
            </Button>
          </ActionRow>
        </DemoPanel>
        <DemoPanel
          title="Preferences"
          description={<Code>usePreference(key, default, options)</Code>}
        >
          <ActionRow>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDensity(density === 'compact' ? 'comfortable' : 'compact')}
            >
              Density (this browser): {density}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setView(view === 'list' ? 'grid' : 'list')}
            >
              View (in URL): {view}
            </Button>
          </ActionRow>
        </DemoPanel>
        <DemoPanel title="Current state">
          <CodeBlock label="Current params and preferences">
            {JSON.stringify({ ...params, density, view }, null, 2)}
          </CodeBlock>
        </DemoPanel>
      </StoryFrame>
    </Page>
  );
}

const meta: Meta = {
  title: 'App Builder/Foundation/URL params & preferences',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    globalDecorators: 'provider',
    docs: {
      description: {
        component:
          '`usePageParams(schema)` binds typed values (`param.string`, `number`, `boolean`, `enum`, `array`) to the URL search string; malformed values fall back to the default. `usePreference(key, default, { storage })` keeps one value either in the URL (default, shareable) or in `localStorage` (`storage: "local"`), namespaced by the page id. In Next.js, components that read URL params need a `<Suspense>` boundary above them.',
      },
    },
  },
};
export default meta;

export const BrowserAdapter: StoryObj = {
  render: () => (
    <StoryApp>
      <Demo />
    </StoryApp>
  ),
};
