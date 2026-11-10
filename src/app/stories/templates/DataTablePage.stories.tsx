import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DataTablePage } from '../../index';
import { StoryFrame } from '../storyHelpers';
import { AssetsPage, ProjectsPage } from './pages';
import {
  FETCH_ARG_TYPES,
  FETCH_DEFAULTS,
  FOREVER,
  TemplateStory,
  mobileStory,
  type FetchArgs,
} from './templateKit';

interface Args extends FetchArgs {
  /** Starting URL (search params are the table state) */
  url: string;
}

const meta: Meta<Args> = {
  title: 'App Builder/Templates/DataTablePage',
  component: DataTablePage as never,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    globalDecorators: 'provider',
    docs: {
      description: {
        component:
          'A list of many records: header with one primary action, search, filters, view toggle, last updated, a server-sorted table (or card grid), pagination, row actions with toasts and a detail panel. Search, filters, sort, page, size, view and the selected record live in the URL (`?q=`, `?f=`, `?sort=`, `?page=`, `?size=`, `?view=`, `?selected=`), so every state is a shareable link. Each story starts from its own URL in an in-memory router. See `guidelines/app/choosing-a-page.md` (APP-2, APP-3).',
      },
    },
  },
  argTypes: { ...FETCH_ARG_TYPES, url: { control: 'text' } },
  args: { ...FETCH_DEFAULTS, url: '/projects' },
  render: (args) => (
    // Remount on any change so each scenario starts from a fresh cache and URL.
    <TemplateStory key={JSON.stringify(args)} url={args.url}>
      <StoryFrame>
        <ProjectsPage fetch={args} />
      </StoryFrame>
    </TemplateStory>
  ),
};
export default meta;

type Story = StoryObj<Args>;

/** Software projects: filter by status or team, search, sort by a column header, open a row. */
export const Projects: Story = {};

/** Design assets in the grid view with thumbnails; switch to the table with the view toggle. */
export const AssetsGrid: Story = {
  name: 'Assets (grid view)',
  args: { url: '/assets' },
  render: (args) => (
    <TemplateStory key={JSON.stringify(args)} url={args.url}>
      <StoryFrame>
        <AssetsPage fetch={args} />
      </StoryFrame>
    </TemplateStory>
  ),
};

/** Structure first: header, toolbar and column headers render; only the rows skeletonize. */
export const Loading: Story = { args: { delay: FOREVER } };

/** An empty collection: "nothing yet" with the create action. */
export const Empty: Story = { name: 'Empty (nothing yet)', args: { empty: true, delay: 200 } };

/** A search that matches nothing: "No results" with Clear all. */
export const NoResults: Story = {
  name: 'No results',
  args: { url: '/projects?q=kubernetes', delay: 200 },
};

/** The list request failed: the error state with Retry, under the page title. */
export const ErrorState: Story = { name: 'Error', args: { fail: true, delay: 200 } };

/** A deep link with `?selected=` opens the detail panel beside the table. */
export const DetailPanelOpen: Story = {
  name: 'Detail panel open (deep link)',
  args: { url: '/projects?selected=prj-002', delay: 300 },
};

/** Filtered and sorted from the URL: `?f={"status":["at_risk","off_track"]}&sort=openIssues:desc`. */
export const FilteredAndSorted: Story = {
  name: 'Filtered and sorted (from URL)',
  args: {
    url: `/projects?f=${encodeURIComponent(JSON.stringify({ status: ['at_risk', 'off_track'] }))}&sort=openIssues:desc`,
    delay: 300,
  },
};

/** Below the laptop breakpoint the detail opens in a full-screen Dialog. */
export const MobileDialog: Story = {
  ...mobileStory,
  tags: ['!autodocs'],
  name: 'Mobile (detail dialog)',
  args: { url: '/projects?selected=prj-003', delay: 300 },
};

/** The phone layout of the list: actions collapse into "More actions", the toolbar wraps. */
export const MobileList: Story = {
  ...mobileStory,
  tags: ['!autodocs'],
  name: 'Mobile (list)',
  args: { delay: 300 },
};
