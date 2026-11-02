import React, { useEffect, type MouseEvent, type ReactNode } from 'react';
import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import {
  NavigationGuardProvider,
  useNavigationGuard,
} from '../../lib/contexts/NavigationGuardContext';
import { AppProvider } from '../AppProvider';
import { AppLink } from './AppLink';
import { createReactRouter } from './createReactRouter';
import { useRouterAdapter } from './RouterContext';

const silentLogger = { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() };

interface Blocker {
  state: string;
  proceed?(): void;
  reset?(): void;
}

/** A fake React Router: `navigate` consults the registered blocker synchronously, like a data router. */
function setup(opts: { withBlocker?: boolean; location?: { pathname: string; search: string } }) {
  let shouldBlock: (() => boolean) | undefined;
  const blockedOn: boolean[] = [];
  const navigate = jest.fn((_to: string, _o?: { replace?: boolean }) => {
    blockedOn.push(shouldBlock ? shouldBlock() : false);
  });
  const blocker: Blocker = { state: 'unblocked', proceed: jest.fn(), reset: jest.fn() };
  const useBlocker = jest.fn((fn: boolean | (() => boolean)) => {
    shouldBlock = typeof fn === 'function' ? fn : () => fn;
    return blocker;
  });
  function RRLink({
    to,
    replace,
    onClick,
    children,
    ...rest
  }: {
    to: string;
    replace?: boolean;
    onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
    children: ReactNode;
  }) {
    return (
      <a
        href={to}
        {...rest}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) {
            e.preventDefault();
            navigate(to, { replace });
          }
        }}
      >
        {children}
      </a>
    );
  }
  const location = opts.location ?? { pathname: '/orders', search: '?page=2' };
  const useRR = createReactRouter({
    useNavigate: () => navigate,
    useLocation: () => location,
    Link: RRLink,
    ...(opts.withBlocker ? { useBlocker } : {}),
  });
  return { useRR, navigate, blocker, useBlocker, blockedOn, shouldBlock: () => shouldBlock?.() };
}

function BlockingGuard() {
  const guard = useNavigationGuard();
  useEffect(() => guard.register({ isBlocking: () => true, message: 'Discard?' }), [guard]);
  return null;
}

describe('createReactRouter', () => {
  let confirm: jest.SpyInstance;
  beforeEach(() => {
    confirm = jest.spyOn(window, 'confirm');
  });
  afterEach(() => confirm.mockRestore());

  it('maps navigate, location and setSearchParams from injected hooks', () => {
    const { useRR, navigate } = setup({});
    const { result } = renderHook(() => useRR());
    expect(result.current.pathname).toBe('/orders');
    expect(result.current.searchParams.get('page')).toBe('2');
    expect(result.current.supportsBlocking).toBe(false);

    result.current.navigate('/reports', { replace: true });
    expect(navigate).toHaveBeenLastCalledWith('/reports', { replace: true });

    result.current.setSearchParams(new URLSearchParams('q=x'));
    expect(navigate).toHaveBeenLastCalledWith('/orders?q=x', undefined);
    result.current.setSearchParams(new URLSearchParams(), { replace: true });
    expect(navigate).toHaveBeenLastCalledWith('/orders', { replace: true });
  });

  it('keeps the hash when setting search params', () => {
    const { useRR, navigate } = setup({
      location: { pathname: '/doc', search: '', hash: '#intro' } as never,
    });
    const { result } = renderHook(() => useRR());
    result.current.setSearchParams(new URLSearchParams('a=1'));
    expect(navigate).toHaveBeenLastCalledWith('/doc?a=1#intro', undefined);
  });

  it('maps href to the Link "to" prop and passes replace', () => {
    const { useRR, navigate } = setup({});
    render(
      <AppProvider router={useRR} logger={silentLogger}>
        <AppLink href="/reports" replace>
          Reports
        </AppLink>
      </AppProvider>
    );
    const link = screen.getByRole('link', { name: 'Reports' });
    expect(link).toHaveAttribute('href', '/reports');
    fireEvent.click(link);
    expect(navigate).toHaveBeenCalledWith('/reports', { replace: true });
  });

  it('uses useBlocker when provided and proceeds/resets per confirm', () => {
    const { useRR, blocker, useBlocker, shouldBlock } = setup({ withBlocker: true });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <NavigationGuardProvider>
        <AppProvider router={useRR} logger={silentLogger}>
          <BlockingGuard />
          {children}
        </AppProvider>
      </NavigationGuardProvider>
    );
    const { result, rerender } = renderHook(() => useRouterAdapter(), { wrapper });
    expect(result.current.supportsBlocking).toBe(true);
    expect(useBlocker).toHaveBeenCalled();
    expect(shouldBlock()).toBe(true);

    // The router reports a blocked navigation (e.g. Back) and the user accepts.
    confirm.mockReturnValue(true);
    blocker.state = 'blocked';
    rerender();
    expect(confirm).toHaveBeenCalledWith('Discard?');
    expect(blocker.proceed).toHaveBeenCalledTimes(1);
    expect(blocker.reset).not.toHaveBeenCalled();

    blocker.state = 'unblocked';
    rerender();

    // Blocked again and the user cancels.
    confirm.mockReturnValue(false);
    blocker.state = 'blocked';
    rerender();
    expect(blocker.reset).toHaveBeenCalledTimes(1);
    expect(blocker.proceed).toHaveBeenCalledTimes(1);
    expect(confirm).toHaveBeenCalledTimes(2);
  });

  it('does not block when no guard is blocking', () => {
    const { useRR, shouldBlock } = setup({ withBlocker: true });
    renderHook(() => useRR(), {
      wrapper: ({ children }) => <NavigationGuardProvider>{children}</NavigationGuardProvider>,
    });
    expect(shouldBlock()).toBe(false);
  });

  it('does not prompt twice for navigations already confirmed by AppLink', () => {
    const { useRR, blockedOn } = setup({ withBlocker: true });
    confirm.mockReturnValue(true);
    render(
      <NavigationGuardProvider>
        <AppProvider router={useRR} logger={silentLogger}>
          <BlockingGuard />
          <AppLink href="/reports">Reports</AppLink>
        </AppProvider>
      </NavigationGuardProvider>
    );
    fireEvent.click(screen.getByRole('link', { name: 'Reports' }));
    expect(confirm).toHaveBeenCalledTimes(1);
    expect(blockedOn).toEqual([false]);
  });

  it('adapter navigate and setSearchParams bypass the blocker; other navigations do not', () => {
    const { useRR, blockedOn, shouldBlock } = setup({ withBlocker: true });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <NavigationGuardProvider>
        <AppProvider router={useRR} logger={silentLogger}>
          <BlockingGuard />
          {children}
        </AppProvider>
      </NavigationGuardProvider>
    );
    const { result } = renderHook(() => useRouterAdapter(), { wrapper });
    act(() => result.current.setSearchParams(new URLSearchParams('page=3')));
    act(() => result.current.navigate('/x'));
    expect(blockedOn).toEqual([false, false]);
    expect(shouldBlock()).toBe(true);
  });
});
