import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PageHeader, useRouterAdapter, type PageAction, type PageHeaderProps } from '../../index';
import { Code, Note, StoryFrame } from '../storyHelpers';
import { TemplateStory } from './templateKit';

const ACTIONS: PageAction[] = [
  { id: 'edit', label: 'Edit', onClick: () => undefined },
  { id: 'duplicate', label: 'Duplicate', onClick: () => undefined },
  { id: 'archive', label: 'Archive', onClick: () => undefined },
  { id: 'launch', label: 'Launch campaign', onClick: () => undefined, variant: 'primary' },
];

const FULL: PageHeaderProps = {
  title: 'Spring launch 2026',
  status: { label: 'Scheduled', tone: 'info' },
  description:
    'Paid search and social push for the spring collection. Budget $42,000 across five channels, starting March 3.',
  breadcrumbs: [
    { label: 'Marketing', href: '/marketing' },
    { label: 'Campaigns', href: '/marketing/campaigns' },
    { label: 'Spring launch 2026' },
  ],
  actions: ACTIONS,
  tabs: [
    { value: 'overview', label: 'Overview' },
    { value: 'ads', label: 'Ads', badge: 12 },
    { value: 'audience', label: 'Audience' },
    { value: 'activity', label: 'Activity' },
  ],
};

/** Shows the in-memory URL, so the tab param is visible. */
function CurrentUrl() {
  const { pathname, searchParams } = useRouterAdapter();
  const qs = searchParams.toString();
  return (
    <Note>
      URL: <Code>{`${pathname}${qs ? `?${qs}` : ''}`}</Code>. The selected tab is <Code>?tab=</Code>
      , so a link opens the same tab.
    </Note>
  );
}

const meta: Meta<PageHeaderProps> = {
  title: 'App Builder/Templates/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    globalDecorators: 'provider',
    docs: {
      description: {
        component:
          'The page title area every template uses, for custom pages: breadcrumbs (3+ levels), the `h1` with a status badge, actions (at most one `primary`, rendered rightmost; below the tablet breakpoint the others collapse into "More actions"), a description and URL-bound tabs. Actions with a failing `permission` are hidden. See `guidelines/app/hierarchy.md` (HIER-1, HIER-2).',
      },
    },
  },
  args: FULL,
  render: (args) => (
    <TemplateStory url="/marketing/campaigns/spring">
      <StoryFrame>
        <PageHeader {...args} />
        <CurrentUrl />
      </StoryFrame>
    </TemplateStory>
  ),
};
export default meta;

type Story = StoryObj<PageHeaderProps>;

/** Breadcrumbs, status, description, four actions (one primary) and tabs with a count. */
export const Full: Story = {};

/** Just a title, a description and the primary action. */
export const Simple: Story = {
  args: {
    title: 'Campaigns',
    description: 'Every paid and owned campaign, with spend and results.',
    status: undefined,
    breadcrumbs: undefined,
    tabs: undefined,
    actions: [{ id: 'new', label: 'New campaign', onClick: () => undefined, variant: 'primary' }],
  },
};

/** Two-level breadcrumbs are not shown: the header renders them from three levels. */
export const ShortBreadcrumbs: Story = {
  name: 'Breadcrumbs need 3+ levels',
  args: {
    breadcrumbs: [{ label: 'Campaigns', href: '/campaigns' }, { label: 'Spring launch 2026' }],
  },
};

/**
 * In a 360px column (a small phone): the long title wraps, secondary actions collapse into
 * "More actions" and the tab list scrolls instead of overflowing.
 */
export const Overflow360: Story = {
  name: 'Overflow at 360px',
  tags: ['!autodocs'],
  parameters: {
    viewport: {
      options: {
        small: {
          name: 'Small phone (360×780)',
          styles: { width: '360px', height: '780px' },
          type: 'mobile',
        },
      },
    },
  },
  globals: { viewport: { value: 'small', isRotated: false } },
  args: { title: 'Spring launch 2026: paid search and social for the new collection' },
};
