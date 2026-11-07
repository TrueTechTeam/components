import React, { useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { LabelsProvider } from '../../../lib/contexts/LabelsContext';
import { NavigationGuardProvider } from '../../../lib/contexts/NavigationGuardContext';
import { AppProvider } from '../../AppProvider';
import type { RouterAdapter } from '../../router';
import { AppShell, type AppShellProps, type NavItem } from './AppShell';

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
        Link: ({ href, children, ...rest }) => (
          <a href={href} {...rest}>
            {children}
          </a>
        ),
        navigate,
        pathname,
        searchParams: new URLSearchParams(search),
        setSearchParams: jest.fn(),
        supportsBlocking: false,
      };
    }, [current]);
  }
  return { useMemoryRouter, navigate };
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
  window.localStorage.clear();
});

const nav: NavItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  {
    id: 'orders',
    label: 'Orders',
    href: '/orders',
    children: [{ id: 'returns', label: 'Returns', href: '/orders/returns' }],
  },
  { id: 'admin', label: 'Admin', href: '/admin', permission: { action: 'manage', subject: 'all' } },
];

function ui(
  props: Partial<AppShellProps>,
  can: (a: string, s?: string) => boolean,
  router: ReturnType<typeof createMemoryRouter>
): ReactNode {
  return (
    <LabelsProvider locale="en-US">
      <NavigationGuardProvider>
        <AppProvider
          router={router.useMemoryRouter}
          logger={silentLogger}
          auth={{ user: null, can }}
        >
          <AppShell brand="Acme" nav={nav} {...props}>
            <p>Content</p>
          </AppShell>
        </AppProvider>
      </NavigationGuardProvider>
    </LabelsProvider>
  );
}

function setup(
  props: Partial<AppShellProps> = {},
  url = '/orders',
  can: (a: string, s?: string) => boolean = () => true
) {
  const router = createMemoryRouter(url);
  return { router, ...render(ui(props, can, router)) };
}

describe('AppShell', () => {
  beforeEach(() => mockViewport(1280));

  it('has the skip link as the first focusable element and it moves focus to main', () => {
    setup();
    const skip = screen.getByRole('link', { name: 'Skip to main content' });
    const focusable = document.querySelectorAll<HTMLElement>('a[href], button');
    expect(focusable[0]).toBe(skip);
    fireEvent.click(skip);
    expect(screen.getByRole('main')).toHaveFocus();
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
  });

  it('renders exactly one main landmark containing the children', () => {
    setup();
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(within(screen.getByRole('main')).getByText('Content')).toBeInTheDocument();
  });

  it('marks only the deepest active item as the current page; ancestors are just active', () => {
    setup({}, '/orders/returns');
    const sidebar = screen.getByRole('navigation', { name: 'Side navigation' });
    const orders = within(sidebar).getByRole('menuitem', { name: 'Orders' });
    expect(orders).not.toHaveAttribute('aria-current');
    expect(orders).toHaveAttribute('data-active', 'true');
    expect(within(sidebar).getByRole('menuitem', { name: 'Returns' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(within(sidebar).getByRole('menuitem', { name: 'Home' })).not.toHaveAttribute(
      'aria-current'
    );
  });

  it('marks a parent with children as current on its own path (prefix by default)', () => {
    setup({}, '/orders');
    const sidebar = screen.getByRole('navigation', { name: 'Side navigation' });
    expect(within(sidebar).getByRole('menuitem', { name: 'Orders' })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('does not treat a root "/" item as active on every path, even with prefix', () => {
    setup({ nav: [{ id: 'h', label: 'Home', href: '/', match: 'prefix' }] }, '/orders');
    expect(screen.getByRole('menuitem', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });

  it('matches exactly when match is not set and there are no children', () => {
    setup({}, '/admin/users');
    const sidebar = screen.getByRole('navigation', { name: 'Side navigation' });
    expect(within(sidebar).getByRole('menuitem', { name: 'Admin' })).not.toHaveAttribute(
      'aria-current'
    );
  });

  it('honours an explicit prefix match', () => {
    setup({ nav: [{ id: 'a', label: 'Admin', href: '/admin', match: 'prefix' }] }, '/admin/users');
    expect(screen.getByRole('menuitem', { name: 'Admin' })).toHaveAttribute('aria-current', 'page');
  });

  it('hides permission-gated items the user cannot access', () => {
    setup({}, '/', (a) => a !== 'manage');
    expect(screen.queryByRole('menuitem', { name: 'Admin' })).not.toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Home' })).toBeInTheDocument();
  });

  it('persists the collapsed state across remounts', () => {
    const { unmount } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Collapse sidebar' }));
    expect(window.localStorage.getItem('pref:app:sidebarCollapsed')).toBe('true');
    unmount();
    setup();
    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toBeInTheDocument();
  });

  it('below laptop hides the sidebar and shows the drawer toggle that reveals the nav', () => {
    mockViewport(800);
    setup();
    expect(screen.queryByRole('navigation', { name: 'Side navigation' })).not.toBeInTheDocument();
    const toggle = screen.getByRole('button', { name: 'Open menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(screen.getByRole('menuitem', { name: 'Home' })).toBeInTheDocument();
  });

  it('with mobileNav="bottom" shows at most five items for mobile !== false', () => {
    mockViewport(800);
    const many: NavItem[] = Array.from({ length: 7 }, (_, i) => ({
      id: `i${i}`,
      label: `Item ${i}`,
      href: `/i${i}`,
    }));
    many[1] = { ...many[1], mobile: false };
    setup({ nav: many, mobileNav: 'bottom' }, '/i0');
    const bottom = screen.getByRole('navigation', { name: 'Bottom navigation' });
    const links = within(bottom).getAllByRole('link');
    expect(links).toHaveLength(5);
    expect(within(bottom).queryByText('Item 1')).not.toBeInTheDocument();
    expect(links[0]).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('button', { name: 'Open menu' })).not.toBeInTheDocument();
  });

  it('navigates client-side from the bottom navigation', () => {
    mockViewport(800);
    const { router } = setup({ mobileNav: 'bottom' }, '/');
    const bottom = screen.getByRole('navigation', { name: 'Bottom navigation' });
    fireEvent.click(within(bottom).getByRole('link', { name: 'Orders' }));
    expect(router.navigate).toHaveBeenCalledWith('/orders', undefined);
  });
});
