import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useBreakpoint, useBreakpointValue } from '../../lib/hooks/useBreakpoint';
import { StoryApp } from './storyHelpers';

function BreakpointReadout() {
  const bp = useBreakpoint();
  const columns = useBreakpointValue({ phone: 1, tablet: 2, laptop: 3, desktop: 4 });
  const padding = useBreakpointValue({ phone: 'var(--spacing-sm)', laptop: 'var(--spacing-lg)' });
  return (
    <div style={{ display: 'grid', gap: 'var(--spacing-md)', padding }}>
      <h1 style={{ margin: 0 }}>Current breakpoint: {bp.name}</h1>
      <p>
        Resize the preview to change it. Phone below 600px, tablet 600+, laptop 1024+, desktop
        1440+.
      </p>
      <ul style={{ margin: 0 }}>
        <li>up(&quot;tablet&quot;): {String(bp.up('tablet'))}</li>
        <li>down(&quot;laptop&quot;): {String(bp.down('laptop'))}</li>
        <li>useBreakpointValue columns: {columns}</li>
      </ul>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 'var(--spacing-sm)',
        }}
      >
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            style={{
              padding: 'var(--spacing-md)',
              border: '1px solid var(--theme-border, currentColor)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            Card {i + 1}
          </div>
        ))}
      </div>
    </div>
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
