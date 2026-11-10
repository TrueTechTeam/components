import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from '../../../lib/components/buttons/IconButton';
import { Avatar } from '../../../lib/components/display/Avatar';
import { Badge } from '../../../lib/components/display/Badge';
import { Icon } from '../../../lib/components/display/Icon';
import { PageMessages } from '../../../lib/components/display/PageMessages';
import { AppShell, Page, PageHeader, useRouterAdapter, type NavItem } from '../../index';
import { AssetsPage, CampaignDashboard, ProjectsPage, ReleasePage } from './pages';
import { FETCH_DEFAULTS, TemplateStory, mobileStory, type FetchArgs } from './templateKit';
import styles from './templates.module.scss';

const NAV: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/', icon: <Icon name="chart-line" /> },
  {
    id: 'projects',
    label: 'Projects',
    href: '/projects',
    icon: <Icon name="folder" />,
    badge: (
      <Badge size="sm" variant="primary">
        24
      </Badge>
    ),
  },
  {
    id: 'releases',
    label: 'Releases',
    href: '/releases',
    match: 'prefix',
    icon: <Icon name="send" />,
  },
  { id: 'assets', label: 'Assets', href: '/assets', icon: <Icon name="image" /> },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: <Icon name="settings" />,
    mobile: false,
  },
];

function Brand() {
  return (
    <span className={styles.brand}>
      <span className={styles.brandMark} aria-hidden="true">
        A
      </span>
      Acme Studio
    </span>
  );
}

function HeaderActions() {
  return (
    <div className={styles.headerActions}>
      <IconButton icon="bell" variant="ghost" aria-label="Notifications" />
      <Avatar size="sm" initials="MP" alt="Maya Patel" />
    </div>
  );
}

function SettingsPage() {
  return (
    <Page title="Settings">
      <PageHeader title="Settings" description="Workspace, members and billing." />
      <PageMessages
        empty
        size="md"
        headingLevel={2}
        emptyConfig={{
          title: 'Nothing to configure in this demo',
          description: 'Pick Dashboard, Projects, Releases or Assets in the navigation.',
        }}
      />
    </Page>
  );
}

/** Picks the page for the in-memory URL, like an app's router outlet. */
function Routes({ fetch }: { fetch: FetchArgs }) {
  const { pathname } = useRouterAdapter();
  if (pathname.startsWith('/projects')) {
    return <ProjectsPage fetch={fetch} />;
  }
  if (pathname.startsWith('/assets')) {
    return <AssetsPage fetch={fetch} />;
  }
  if (pathname.startsWith('/releases')) {
    return <ReleasePage fetch={fetch} />;
  }
  if (pathname.startsWith('/settings')) {
    return <SettingsPage />;
  }
  return <CampaignDashboard fetch={fetch} />;
}

interface Args {
  /** Starting URL */
  url: string;
  mobileNav: 'drawer' | 'bottom';
}

const meta: Meta<Args> = {
  title: 'App Builder/Templates/AppShell',
  component: AppShell as never,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    globalDecorators: 'provider',
    docs: {
      description: {
        component:
          'The app frame, once per app: skip link, Navbar with brand and header actions, a collapsible sidebar from 1024px (its state remembered in this browser), the `main` landmark and mobile navigation (a Navbar drawer or a bottom bar of up to 5 items). Nav links go through `AppLink`, so they respect unsaved-changes guards. This demo is a small app: the nav switches between the template stories. See `guidelines/app/choosing-a-page.md` (APP-9).',
      },
      story: { inline: false, iframeHeight: 760 },
    },
  },
  argTypes: {
    url: { control: 'text' },
    mobileNav: { control: 'inline-radio', options: ['drawer', 'bottom'] },
  },
  args: { url: '/projects', mobileNav: 'drawer' },
  render: (args) => (
    <TemplateStory key={JSON.stringify(args)} url={args.url}>
      <AppShell
        brand={<Brand />}
        nav={NAV}
        headerActions={<HeaderActions />}
        mobileNav={args.mobileNav}
      >
        <Routes fetch={{ ...FETCH_DEFAULTS, delay: 400 }} />
      </AppShell>
    </TemplateStory>
  ),
};
export default meta;

type Story = StoryObj<Args>;

/** Desktop: sidebar navigation around a DataTablePage. Click the nav items to switch pages. */
export const Desktop: Story = {};

/** Desktop on the dashboard route. */
export const DesktopDashboard: Story = { name: 'Desktop (dashboard)', args: { url: '/' } };

/** Phone with a bottom navigation bar (Settings is left out with `mobile: false`). */
export const MobileBottomNav: Story = {
  ...mobileStory,
  tags: ['!autodocs'],
  name: 'Mobile (bottom nav)',
  args: { mobileNav: 'bottom' },
};

/** Phone with the Navbar drawer: the menu button opens the full navigation. */
export const MobileDrawer: Story = {
  ...mobileStory,
  tags: ['!autodocs'],
  name: 'Mobile (drawer)',
  args: { mobileNav: 'drawer' },
};
