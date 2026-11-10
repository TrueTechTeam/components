import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DashboardPage } from '../../index';
import { StoryFrame } from '../storyHelpers';
import { CampaignDashboard } from './pages';
import {
  FETCH_ARG_TYPES,
  FETCH_DEFAULTS,
  FOREVER,
  TemplateStory,
  mobileStory,
  type FetchArgs,
} from './templateKit';

interface Args extends FetchArgs {
  /** Make only the "Email engagement" widget fail */
  failWidget: boolean;
  /** Starting URL (`?range=7d|30d|90d`) */
  url: string;
}

const meta: Meta<Args> = {
  title: 'App Builder/Templates/DashboardPage',
  component: DashboardPage as never,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    globalDecorators: 'provider',
    docs: {
      description: {
        component:
          'Numbers over a time range: a URL-bound range toggle (`?range=`) and "Refresh all" in the toolbar, a KPI row, a full-width primary chart, secondary widgets in a responsive grid and recent activity. Every widget is its own `Section`, so each owns its loading, error and refresh states and one failing widget never blanks the others. Charts are plain inline SVG inside `ChartWidget`, whose `summary` is the text alternative. See `guidelines/app/choosing-a-page.md` (APP-5).',
      },
    },
  },
  argTypes: {
    ...FETCH_ARG_TYPES,
    empty: { table: { disable: true } },
    failWidget: { control: 'boolean' },
    url: { control: 'text' },
  },
  args: { ...FETCH_DEFAULTS, failWidget: false, url: '/' },
  render: (args) => (
    <TemplateStory key={JSON.stringify(args)} url={args.url}>
      <StoryFrame>
        <CampaignDashboard fetch={args} failWidget={args.failWidget} />
      </StoryFrame>
    </TemplateStory>
  ),
};
export default meta;

type Story = StoryObj<Args>;

/** Marketing campaign performance over the last 30 days. Change the range or press Refresh all. */
export const CampaignPerformance: Story = { name: 'Campaign performance' };

/** Labels, headings and layout render at once; each value and chart skeletonizes in its shape. */
export const Loading: Story = { args: { delay: FOREVER } };

/** One widget fails on its own: it shows an error with Retry while its siblings render. */
export const WidgetFailing: Story = {
  name: 'One widget failing',
  args: { failWidget: true, delay: 300 },
};

/** The last 7 days, from `?range=7d`. */
export const SevenDays: Story = {
  name: 'Range from URL (7d)',
  args: { url: '/?range=7d', delay: 300 },
};

/** Phone layout: KPIs and widgets stack in one column. */
export const Mobile: Story = { ...mobileStory, tags: ['!autodocs'], args: { delay: 300 } };
