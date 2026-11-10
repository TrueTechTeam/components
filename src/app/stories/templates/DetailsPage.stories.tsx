import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DetailsPage } from '../../index';
import { StoryFrame } from '../storyHelpers';
import { ReleasePage } from './pages';
import {
  FETCH_ARG_TYPES,
  FETCH_DEFAULTS,
  FOREVER,
  TemplateStory,
  mobileStory,
  type FetchArgs,
} from './templateKit';

interface Args extends FetchArgs {
  /** Respond with a 404 */
  notFound: boolean;
  /** Starting URL (`?tab=overview|activity|files`) */
  url: string;
}

const meta: Meta<Args> = {
  title: 'App Builder/Templates/DetailsPage',
  component: DetailsPage as never,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    globalDecorators: 'provider',
    docs: {
      description: {
        component:
          'One record with related content: breadcrumbs, title with status, actions (one primary), a key facts strip, URL-bound tabs (`?tab=`) and a body of `main` plus a `side` column that stacks under it below 1024px. The structure renders while the record loads; only the title and facts skeletonize. A 404 shows the not-found state. See `guidelines/app/choosing-a-page.md` (APP-4) and `hierarchy.md` (HIER-5 to HIER-7).',
      },
    },
  },
  argTypes: {
    ...FETCH_ARG_TYPES,
    empty: { table: { disable: true } },
    notFound: { control: 'boolean' },
    url: { control: 'text' },
  },
  args: { ...FETCH_DEFAULTS, notFound: false, url: '/releases/v3.4.0' },
  render: (args) => (
    <TemplateStory key={JSON.stringify(args)} url={args.url}>
      <StoryFrame>
        <ReleasePage fetch={args} notFound={args.notFound} />
      </StoryFrame>
    </TemplateStory>
  ),
};
export default meta;

type Story = StoryObj<Args>;

/** A software release: key facts, Overview / Activity / Files tabs and a details side column. */
export const Release: Story = {};

/** The Activity tab, deep linked with `?tab=activity`. */
export const ActivityTab: Story = {
  name: 'Activity tab (deep link)',
  args: { url: '/releases/v3.4.0?tab=activity', delay: 200 },
};

/** The Files tab: a media gallery of attachments. */
export const FilesTab: Story = {
  name: 'Files tab',
  args: { url: '/releases/v3.4.0?tab=files', delay: 200 },
};

/** Structure first: breadcrumbs, tabs and layout render; the title and facts skeletonize. */
export const Loading: Story = { args: { delay: FOREVER } };

/** The record does not exist (404): the not-found state replaces the page. */
export const NotFound: Story = { name: 'Not found', args: { notFound: true, delay: 200 } };

/** Any other failure: the error state with Retry. */
export const ErrorState: Story = { name: 'Error', args: { fail: true, delay: 200 } };

/** Phone layout: secondary actions collapse into "More actions" and the side column stacks. */
export const Mobile: Story = { ...mobileStory, tags: ['!autodocs'], args: { delay: 300 } };
