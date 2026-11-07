import React, { useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { LabelsProvider } from '../../../lib/contexts/LabelsContext';
import { NavigationGuardProvider } from '../../../lib/contexts/NavigationGuardContext';
import { AppProvider } from '../../AppProvider';
import type { RouterAdapter } from '../../router';
import { PageHeader, getPageTabId, type PageHeaderProps } from './PageHeader';

const silentLogger = { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() };

function createMemoryRouter(initial: string) {
  let url = initial;
  const listeners = new Set<() => void>();
  const subscribe = (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  };
  const navigate = jest.fn((href: string) => {
    url = href;
    listeners.forEach((l) => l());
  });
  function useMemoryRouter(): RouterAdapter {
    const current = useSyncExternalStore(subscribe, () => url);
    return useMemo(() => {
      const [pathname, search = ''] = current.split('?');
      return {
        Link: ({ href, children }) => <a href={href}>{children}</a>,
        navigate,
        pathname,
        searchParams: new URLSearchParams(search),
        setSearchParams: (next: URLSearchParams) => {
          const qs = next.toString();
          navigate(`${pathname}${qs ? `?${qs}` : ''}`);
        },
        supportsBlocking: false,
      };
    }, [current]);
  }
  return { useMemoryRouter, navigate, url: () => url };
}

function mockViewport(width: number) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => {
      const m = /min-width:\s*(\d+)px/.exec(query);
      return {
        matches: m ? width >= Number(m[1]) : false,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };
    },
  });
}

const originalMatchMedia = window.matchMedia;
afterEach(() => {
  Object.defineProperty(window, 'matchMedia', { writable: true, value: originalMatchMedia });
});

function setup(
  props: Partial<PageHeaderProps> = {},
  {
    url = '/orders',
    can = () => true,
  }: { url?: string; can?: (action: string, subject?: string) => boolean } = {}
) {
  const router = createMemoryRouter(url);
  const ui: ReactNode = (
    <LabelsProvider locale="en-US">
      <NavigationGuardProvider>
        <AppProvider
          router={router.useMemoryRouter}
          logger={silentLogger}
          auth={{ user: null, can }}
        >
          <PageHeader title="Orders" {...props} />
        </AppProvider>
      </NavigationGuardProvider>
    </LabelsProvider>
  );
  render(ui);
  return router;
}

const crumbs = [
  { label: 'Home', href: '/' },
  { label: 'Orders', href: '/orders' },
  { label: 'Order 1001' },
];

describe('PageHeader', () => {
  beforeEach(() => mockViewport(1280));

  it('renders the title as an h1 by default', () => {
    setup();
    expect(screen.getByRole('heading', { level: 1, name: 'Orders' })).toBeInTheDocument();
  });

  it('supports headingLevel 2', () => {
    setup({ headingLevel: 2 });
    expect(screen.getByRole('heading', { level: 2, name: 'Orders' })).toBeInTheDocument();
  });

  it('hides breadcrumbs for two levels', () => {
    setup({ breadcrumbs: crumbs.slice(1) });
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('shows breadcrumbs for three levels; the last is the current page, not a link', () => {
    setup({ breadcrumbs: crumbs });
    const nav = screen.getByRole('navigation');
    expect(within(nav).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    const current = within(nav).getByText('Order 1001');
    expect(current.closest('[aria-current="page"]')).not.toBeNull();
    expect(within(nav).queryByRole('link', { name: 'Order 1001' })).not.toBeInTheDocument();
  });

  it('renders the description and status text', () => {
    setup({ description: 'All orders', status: { label: 'Paid', tone: 'success' } });
    expect(screen.getByText('All orders')).toBeInTheDocument();
    expect(screen.getByText('Paid')).toBeInTheDocument();
  });

  it('renders the primary action last in DOM order', () => {
    setup({
      actions: [
        { id: 'p', label: 'Create', variant: 'primary' },
        { id: 'a', label: 'Export', variant: 'secondary' },
        { id: 'b', label: 'Import' },
      ],
    });
    const labels = screen.getAllByRole('button').map((b) => b.textContent);
    expect(labels).toEqual(['Export', 'Import', 'Create']);
  });

  it('calls onClick and renders href actions as links', () => {
    const onClick = jest.fn();
    setup({
      actions: [
        { id: 'a', label: 'Docs', href: '/docs' },
        { id: 'b', label: 'Go', onClick },
      ],
    });
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs');
    fireEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('at 360px only the primary action and "More actions" render; the menu lists the rest', () => {
    mockViewport(360);
    const onClick = jest.fn();
    setup({
      actions: [
        { id: 'a', label: 'Export', onClick },
        { id: 'b', label: 'Import' },
        { id: 'c', label: 'Archive', variant: 'danger' },
        { id: 'p', label: 'Create', variant: 'primary' },
      ],
    });
    const buttons = screen.getAllByRole('button').map((b) => b.textContent);
    expect(buttons).toEqual(['More actions', 'Create']);
    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'More actions' }));
    // The popover stays visibility:hidden until it is positioned, which jsdom never does.
    const items = screen.getAllByRole('menuitem', { hidden: true }).map((i) => i.textContent);
    expect(items).toEqual(['Export', 'Import', 'Archive']);
    fireEvent.click(screen.getByText('Export'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('hides a permission-gated action when can() is false', () => {
    const can = jest.fn((action: string) => action !== 'delete');
    setup(
      {
        actions: [{ id: 'd', label: 'Delete', permission: { action: 'delete', subject: 'order' } }],
      },
      { can }
    );
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
    expect(can).toHaveBeenCalledWith('delete', 'order');
  });

  it('shows a permission-gated action when allowed', () => {
    setup({ actions: [{ id: 'd', label: 'Delete', permission: { action: 'delete' } }] });
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('hides the "More actions" trigger when every other action is permission-hidden', () => {
    mockViewport(360);
    setup(
      {
        actions: [
          { id: 'a', label: 'Export', permission: { action: 'export' } },
          { id: 'p', label: 'Create', variant: 'primary' },
        ],
      },
      { can: () => false }
    );
    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual(['Create']);
  });

  it('warns once about extra primary actions and renders them as secondary', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    setup({
      actions: [
        { id: 'p1', label: 'One', variant: 'primary' },
        { id: 'p2', label: 'Two', variant: 'primary' },
      ],
    });
    expect(warn).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'One' })).toHaveAttribute('data-variant', 'primary');
    expect(screen.getByRole('button', { name: 'Two' })).toHaveAttribute('data-variant', 'outline');
    warn.mockRestore();
  });

  describe('tabs', () => {
    it('gives tabs stable ids and no dangling aria-controls', () => {
      setup({
        tabs: [
          { value: 'overview', label: 'Overview' },
          { value: 'items', label: 'Items' },
        ],
      });
      const tab = screen.getByRole('tab', { name: 'Items' });
      expect(tab).toHaveAttribute('id', getPageTabId('items'));
      expect(getPageTabId('items', 'view')).toBe('pagetab-view-items');
      document.querySelectorAll('[aria-controls]').forEach((el) => {
        expect(document.getElementById(el.getAttribute('aria-controls') ?? '')).not.toBeNull();
      });
      expect(tab).not.toHaveAttribute('aria-controls');
    });

    const tabs = [
      { value: 'overview', label: 'Overview' },
      { value: 'items', label: 'Items', badge: 3 },
    ];

    it('selects the first tab by default and shows the badge', () => {
      setup({ tabs });
      expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
        'aria-selected',
        'true'
      );
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('reads the tab from ?tab=', () => {
      setup({ tabs }, { url: '/orders?tab=items' });
      expect(screen.getByRole('tab', { name: /Items/ })).toHaveAttribute('aria-selected', 'true');
    });

    it('falls back to the first tab for an unknown ?tab=', () => {
      setup({ tabs }, { url: '/orders?tab=bogus' });
      expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
        'aria-selected',
        'true'
      );
    });

    it('writes the selected tab to the URL and calls onTabChange', () => {
      const onTabChange = jest.fn();
      const router = setup({ tabs, onTabChange });
      fireEvent.click(screen.getByRole('tab', { name: /Items/ }));
      expect(router.url()).toBe('/orders?tab=items');
      expect(onTabChange).toHaveBeenCalledWith('items');
      expect(screen.getByRole('tab', { name: /Items/ })).toHaveAttribute('aria-selected', 'true');
    });

    it('uses a custom tabParam', () => {
      const router = setup({ tabs, tabParam: 'view' });
      fireEvent.click(screen.getByRole('tab', { name: /Items/ }));
      expect(router.url()).toBe('/orders?view=items');
    });
  });
});
