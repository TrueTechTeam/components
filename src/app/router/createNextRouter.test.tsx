import React, { type ReactNode } from 'react';
import { act, render, renderHook, screen } from '@testing-library/react';
import { AppProvider } from '../AppProvider';
import { param, usePageParams } from '../params';
import { AppLink } from './AppLink';
import { createNextRouter } from './createNextRouter';

function setup(
  search: URLSearchParams | { toString(): string } | null = new URLSearchParams('page=2')
) {
  const router = { push: jest.fn(), replace: jest.fn() };
  const linkProps = jest.fn();
  const useSearchParams = jest.fn(() => search);
  function NextLink({ href, children, replace, ...rest }: Record<string, unknown>) {
    linkProps({ href, replace, ...rest });
    return (
      <a href={href as string} {...rest}>
        {children as ReactNode}
      </a>
    );
  }
  const useNextRouter = createNextRouter({
    useRouter: () => router,
    usePathname: () => '/orders',
    useSearchParams,
    Link: NextLink,
  });
  return { router, linkProps, useNextRouter, useSearchParams };
}

describe('createNextRouter', () => {
  beforeEach(() => window.history.replaceState(null, '', '/orders?page=2'));

  it('maps push/replace/pathname from injected hooks without reading search params at the root', () => {
    const { router, useNextRouter, useSearchParams } = setup();
    const { result } = renderHook(() => useNextRouter());

    expect(useSearchParams).not.toHaveBeenCalled();
    expect(result.current.pathname).toBe('/orders');
    // Non-reactive snapshot of window.location.search.
    expect(result.current.searchParams.get('page')).toBe('2');
    expect(result.current.supportsBlocking).toBe(false);

    result.current.navigate('/reports');
    expect(router.push).toHaveBeenCalledWith('/reports');
    result.current.navigate('/reports', { replace: true });
    expect(router.replace).toHaveBeenCalledWith('/reports');

    result.current.setSearchParams(new URLSearchParams('page=3&q=a'));
    expect(router.push).toHaveBeenLastCalledWith('/orders?page=3&q=a', { scroll: false });
    result.current.setSearchParams(new URLSearchParams(), { replace: true });
    expect(router.replace).toHaveBeenLastCalledWith('/orders', { scroll: false });
    expect(useSearchParams).not.toHaveBeenCalled();
  });

  it('keeps the hash when setting search params', () => {
    window.history.replaceState(null, '', '/orders#totals');
    const { router, useNextRouter } = setup();
    const { result } = renderHook(() => useNextRouter());
    result.current.setSearchParams(new URLSearchParams('a=1'));
    expect(router.push).toHaveBeenLastCalledWith('/orders?a=1#totals', { scroll: false });
  });

  it('useSearchParams wraps the injected hook and accepts read-only or null params', () => {
    const readonly = { toString: () => 'a=1&b=2', get: () => null };
    const { useNextRouter } = setup(readonly);
    const { result: adapter } = renderHook(() => useNextRouter());
    const { result, rerender } = renderHook(() => adapter.current.useSearchParams!());
    expect(result.current).toBeInstanceOf(URLSearchParams);
    expect(result.current.get('b')).toBe('2');
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);

    const empty = setup(null);
    const { result: emptyAdapter } = renderHook(() => empty.useNextRouter());
    const { result: emptyParams } = renderHook(() => emptyAdapter.current.useSearchParams!());
    expect(emptyParams.current.toString()).toBe('');
  });

  it('usePageParams reads params through the adapter useSearchParams', () => {
    // The URL snapshot disagrees with what Next reports; Next's hook must win.
    window.history.replaceState(null, '', '/orders?page=9');
    const { useNextRouter, useSearchParams, router } = setup(new URLSearchParams('page=4&x=1'));
    const { result } = renderHook(() => usePageParams({ page: param.number(1) }), {
      wrapper: ({ children }) => (
        <AppProvider router={useNextRouter} debug={false}>
          {children}
        </AppProvider>
      ),
    });
    expect(useSearchParams).toHaveBeenCalled();
    expect(result.current[0].page).toBe(4);
    act(() => result.current[1]({ page: 5 }));
    expect(router.replace).toHaveBeenLastCalledWith('/orders?page=5&x=1', { scroll: false });
  });

  it('keeps the adapter stable while the location is unchanged', () => {
    const { useNextRouter } = setup();
    const { result, rerender } = renderHook(() => useNextRouter());
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it('renders the injected Link with href and replace through AppLink', () => {
    const { linkProps, useNextRouter } = setup();
    render(
      <AppProvider router={useNextRouter} debug={false}>
        <AppLink href="/reports" replace className="x">
          Reports
        </AppLink>
      </AppProvider>
    );
    const link = screen.getByRole('link', { name: 'Reports' });
    expect(link).toHaveAttribute('href', '/reports');
    expect(link).toHaveClass('x');
    expect(linkProps).toHaveBeenLastCalledWith(
      expect.objectContaining({ href: '/reports', replace: true })
    );
  });
});
