import React, { type ReactNode } from 'react';
import { render, renderHook, screen } from '@testing-library/react';
import { AppProvider } from '../AppProvider';
import { AppLink } from './AppLink';
import { createNextRouter } from './createNextRouter';

function setup(search: URLSearchParams | { toString(): string } = new URLSearchParams('page=2')) {
  const router = { push: jest.fn(), replace: jest.fn() };
  const linkProps = jest.fn();
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
    useSearchParams: () => search,
    Link: NextLink,
  });
  return { router, linkProps, useNextRouter };
}

describe('createNextRouter', () => {
  it('maps push/replace/pathname/searchParams from injected hooks', () => {
    const { router, useNextRouter } = setup();
    const { result } = renderHook(() => useNextRouter());

    expect(result.current.pathname).toBe('/orders');
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
  });

  it('accepts a read-only search params object and returns a real URLSearchParams', () => {
    const readonly = { toString: () => 'a=1&b=2', get: () => null };
    const { useNextRouter } = setup(readonly);
    const { result } = renderHook(() => useNextRouter());
    expect(result.current.searchParams).toBeInstanceOf(URLSearchParams);
    expect(result.current.searchParams.get('b')).toBe('2');
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
