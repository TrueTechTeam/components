import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Page, param, usePageParams, usePreference } from '../index';
import { Button } from '../../lib/components/buttons/Button';
import { Input } from '../../lib/components/inputs/Input';
import { StoryApp } from './storyHelpers';

const schema = {
  q: param.string(''),
  page: param.number(1),
  sort: param.enum(['name', 'date', 'total'] as const, 'name'),
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
      <div
        style={{
          padding: 'var(--spacing-lg)',
          display: 'grid',
          gap: 'var(--spacing-md)',
          maxWidth: 640,
        }}
      >
        <h1 style={{ margin: 0 }}>URL params and preferences</h1>
        <p>
          State lives in the URL search string (this uses the History API adapter, so the preview
          iframe URL changes). Reload to see it restored.
        </p>
        <Input
          label="Search (q)"
          value={params.q}
          onChange={(e) => setParams({ q: e.target.value, page: 1 }, { replace: true })}
        />
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
          <Button size="sm" onClick={() => setParams({ page: params.page + 1 })}>
            Next page ({params.page})
          </Button>
          {(['name', 'date', 'total'] as const).map((s) => (
            <Button
              key={s}
              size="sm"
              variant={params.sort === s ? 'primary' : 'outline'}
              onClick={() => setParams({ sort: s })}
            >
              Sort: {s}
            </Button>
          ))}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setParams({ archived: !params.archived })}
          >
            Archived: {String(params.archived)}
          </Button>
        </div>
        <h2 style={{ margin: 0 }}>Preferences</h2>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
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
        </div>
        <pre style={{ margin: 0 }}>{JSON.stringify({ ...params, density, view }, null, 2)}</pre>
      </div>
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
