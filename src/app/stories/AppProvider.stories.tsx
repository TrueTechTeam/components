import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  AppProvider,
  Can,
  Feature,
  useAppTranslation,
  useFormatters,
  useLogger,
  useTrack,
} from '../index';
import { Button } from '../../lib/components/buttons/Button';
import { StoryApp } from './storyHelpers';

const meta: Meta<typeof AppProvider> = {
  title: 'App Builder/Foundation/AppProvider',
  component: AppProvider,
  tags: ['autodocs'],
  parameters: {
    globalDecorators: 'provider',
    docs: {
      description: {
        component: `
\`AppProvider\` is the root of an \`/app\` application. It wires TanStack Query, routing, labels and
locale, breakpoints, auth, feature flags, logging and analytics.

## Provider nesting

\`GlobalProvider\` must be the **outer** provider and \`AppProvider\` the inner one:

\`\`\`tsx
<GlobalProvider>
  <AppProvider router={useNextRouter} translate={i18n.t} locale="fr-FR">
    {children}
  </AppProvider>
</GlobalProvider>
\`\`\`

With the order reversed, \`AppLink\` and \`useAppNavigate\` silently stop seeing navigation guards
(unsaved-changes prompts no longer fire).

## Props

| Prop | Purpose |
| --- | --- |
| \`router\` | Router adapter hook: \`createNextRouter(...)\`, \`createReactRouter(...)\` or the default History API \`useBrowserRouter\`. Must be the same function for the provider's lifetime. |
| \`queryClient\` | Your \`QueryClient\`. Default: \`staleTime 30s\`, \`retry 1\`, refetch on window focus. |
| \`translate\` | App translate function, e.g. \`i18n.t\`. Built-in text is requested as \`ui.<key>\`; return nothing to fall back to English. |
| \`locale\` | BCP 47 locale for labels and formatters. |
| \`logger\` | \`{ debug, info, warn, error }\`. Default: console in development, no-op in production. |
| \`analytics\` | \`{ track(event, props) }\`. \`Page\` sends \`page_view\`. |
| \`auth\` | \`{ user, can(action, subject?) }\`. Default: signed out, everything allowed. |
| \`flags\` | \`{ isEnabled(flag) }\`. Default: every flag off. |
| \`breakpoints\` | Override the named breakpoint min-widths (phone, tablet, laptop, desktop). |
| \`titleTemplate\` | Formats \`document.title\`, for example appending the app name. |
| \`debug\` | Enables the debug panel and console logging. Default: not production. |
`,
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof AppProvider>;

function Services() {
  const logger = useLogger('story');
  const track = useTrack();
  const { t, locale } = useAppTranslation();
  const { currency, dateTime } = useFormatters();
  return (
    <div style={{ display: 'grid', gap: 'var(--spacing-md)', maxWidth: 520 }}>
      <p>
        {t('Hello, {name}', { name: 'Ada' })} ({locale}): {currency(1234.5, 'EUR')},{' '}
        {dateTime(new Date(2026, 10, 2))}
      </p>
      <Can action="orders.delete" fallback={<em>You cannot delete orders.</em>}>
        <span>You can delete orders.</span>
      </Can>
      <Feature name="newCheckout" fallback={<em>New checkout is off.</em>}>
        <span>New checkout is on.</span>
      </Feature>
      <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
        <Button size="sm" onClick={() => logger.info('Clicked', { at: Date.now() })}>
          Log (see console)
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => track('story_clicked', { story: 'app' })}
        >
          Track event
        </Button>
      </div>
    </div>
  );
}

/** Services configured on the provider are read through hooks anywhere below it. */
export const Overview: Story = {
  render: () => (
    <StoryApp
      locale="en-GB"
      logger={{
        debug: console.debug,
        info: console.info,
        warn: console.warn,
        error: console.error,
      }}
      auth={{ user: { name: 'Ada' }, can: (action) => action !== 'orders.delete' }}
      flags={{ isEnabled: (flag) => flag === 'newCheckout' }}
      analytics={{ track: (event, props) => console.info('track', event, props) }}
    >
      <Services />
    </StoryApp>
  ),
};
