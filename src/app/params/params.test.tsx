import React, { useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { act, renderHook } from '@testing-library/react';
import { AppProvider } from '../AppProvider';
import type { RouterAdapter } from '../router';
import { param } from './codecs';
import { PageIdContext } from './PageIdContext';
import { usePageParams } from './usePageParams';
import { usePreference } from './usePreference';

const silentLogger = { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() };

/** In-memory router adapter: the URL lives in a variable instead of window.location. */
function createMemoryRouter(initial: string) {
  let url = initial;
  const listeners = new Set<() => void>();
  const subscribe = (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  };
  const navigate = jest.fn((href: string, _opts?: { replace?: boolean }) => {
    url = href;
    listeners.forEach((l) => l());
  });
  const setSearchParams = jest.fn((next: URLSearchParams, opts?: { replace?: boolean }) => {
    const qs = next.toString();
    navigate(`${url.split('?')[0]}${qs ? `?${qs}` : ''}`, opts);
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
        setSearchParams,
        supportsBlocking: false,
      };
    }, [current]);
  }
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AppProvider router={useMemoryRouter} logger={silentLogger}>
      {children}
    </AppProvider>
  );
  return { wrapper, navigate, setSearchParams, url: () => url };
}

const schema = {
  page: param.number(1),
  sort: param.enum(['date', 'name'] as const, 'date'),
  status: param.enum(['open', 'closed'] as const, 'open'),
  q: param.string(),
};

describe('usePageParams', () => {
  it('parses typed params with defaults', () => {
    const { wrapper } = createMemoryRouter('/orders?page=3&sort=name');
    const { result } = renderHook(() => usePageParams(schema), { wrapper });
    expect(result.current[0]).toEqual({ page: 3, sort: 'name', status: 'open', q: '' });
  });

  it.each(['?page=abc', '?page=', '?status=bogus', '?page=1&page=2', '?page=abc&page=2'])(
    'falls back safely for %s',
    (search) => {
      const { wrapper } = createMemoryRouter(`/orders${search}`);
      const { result } = renderHook(() => usePageParams(schema), { wrapper });
      const [values] = result.current;
      expect(values.page).toBe(1);
      expect(Number.isNaN(values.page)).toBe(false);
      expect(values.status).toBe('open');
    }
  );

  it('setting a value equal to default removes it; other params kept', () => {
    const router = createMemoryRouter('/orders?page=2&x=1');
    const { result } = renderHook(() => usePageParams(schema), { wrapper: router.wrapper });
    act(() => result.current[1]({ page: 1 }));
    expect(router.url()).toBe('/orders?x=1');
    expect(router.setSearchParams).toHaveBeenLastCalledWith(expect.any(URLSearchParams), {
      replace: true,
    });
    expect(result.current[0].page).toBe(1);
  });

  it('sets non-default values and passes replace: false through', () => {
    const router = createMemoryRouter('/orders');
    const { result } = renderHook(() => usePageParams(schema), { wrapper: router.wrapper });
    act(() => result.current[1]({ page: 4, status: 'closed' }, { replace: false }));
    expect(router.url()).toBe('/orders?page=4&status=closed');
    expect(router.setSearchParams).toHaveBeenLastCalledWith(expect.any(URLSearchParams), {
      replace: false,
    });
    expect(result.current[0]).toMatchObject({ page: 4, status: 'closed' });
  });

  it('an undefined value in the patch resets that param', () => {
    const router = createMemoryRouter('/orders?q=shoes&page=2');
    const { result } = renderHook(() => usePageParams(schema), { wrapper: router.wrapper });
    act(() => result.current[1]({ q: undefined }));
    expect(router.url()).toBe('/orders?page=2');
  });

  it('composes several updates made before the URL re-renders', () => {
    const router = createMemoryRouter('/orders');
    const { result } = renderHook(() => usePageParams(schema), { wrapper: router.wrapper });
    act(() => {
      result.current[1]({ page: 2 });
      result.current[1]({ q: 'shoes' });
    });
    expect(router.url()).toBe('/orders?page=2&q=shoes');
  });

  it('keeps values and setter referentially stable while its params are unchanged', () => {
    const router = createMemoryRouter('/orders?page=2');
    const { result } = renderHook(() => usePageParams(schema), { wrapper: router.wrapper });
    const [values, set] = result.current;
    act(() => router.navigate('/orders?page=2&other=1'));
    expect(result.current[0]).toBe(values);
    expect(result.current[1]).toBe(set);
    act(() => router.navigate('/orders?page=3&other=1'));
    expect(result.current[0]).not.toBe(values);
    expect(result.current[0].page).toBe(3);
  });

  it('throws outside AppProvider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => renderHook(() => usePageParams(schema))).toThrow(
      'useRouterAdapter must be used within AppProvider'
    );
    spy.mockRestore();
  });
});

describe('usePreference', () => {
  beforeEach(() => window.localStorage.clear());

  it('url storage (default) infers the codec from the default value', () => {
    const router = createMemoryRouter('/orders?size=abc');
    const { result } = renderHook(
      () => ({
        size: usePreference('size', 25),
        dense: usePreference('dense', false),
        view: usePreference('view', 'table'),
        cols: usePreference('cols', ['a', 'b']),
      }),
      { wrapper: router.wrapper }
    );
    expect(result.current.size[0]).toBe(25);
    expect(result.current.dense[0]).toBe(false);
    expect(result.current.view[0]).toBe('table');
    expect(result.current.cols[0]).toEqual(['a', 'b']);

    act(() => result.current.size[1](50));
    act(() => result.current.dense[1](true));
    act(() => result.current.cols[1](['c']));
    expect(router.url()).toBe('/orders?size=50&dense=true&cols=c');
    expect(result.current.size[0]).toBe(50);
    expect(result.current.dense[0]).toBe(true);
    expect(result.current.cols[0]).toEqual(['c']);

    act(() => result.current.size[1](25));
    expect(router.url()).toBe('/orders?dense=true&cols=c');
  });

  it('url storage uses a given codec', () => {
    const router = createMemoryRouter('/orders?view=bogus');
    const codec = param.enum(['table', 'cards'] as const, 'table');
    const { result } = renderHook(() => usePreference('view', codec.default, { codec }), {
      wrapper: router.wrapper,
    });
    expect(result.current[0]).toBe('table');
    act(() => result.current[1]('cards'));
    expect(router.url()).toBe('/orders?view=cards');
  });

  it('usePreference local storage is namespaced by page id', () => {
    const router = createMemoryRouter('/orders');
    const pageWrapper = ({ children }: { children: ReactNode }) => (
      <router.wrapper>
        <PageIdContext.Provider value="orders">{children}</PageIdContext.Provider>
      </router.wrapper>
    );
    const onPage = renderHook(() => usePreference('view', 'table', { storage: 'local' }), {
      wrapper: pageWrapper,
    });
    act(() => onPage.result.current[1]('cards'));
    expect(onPage.result.current[0]).toBe('cards');
    expect(window.localStorage.getItem('pref:orders:view')).toBe(JSON.stringify('cards'));

    const appWide = renderHook(() => usePreference('view', 'table', { storage: 'local' }), {
      wrapper: router.wrapper,
    });
    expect(appWide.result.current[0]).toBe('table');
    act(() => appWide.result.current[1]('list'));
    expect(window.localStorage.getItem('pref:app:view')).toBe(JSON.stringify('list'));
    expect(window.localStorage.getItem('pref:orders:view')).toBe(JSON.stringify('cards'));
    expect(router.url()).toBe('/orders');
  });

  it('local storage reads a stored value and works without AppProvider', () => {
    window.localStorage.setItem('pref:app:size', '50');
    const { result } = renderHook(() => usePreference('size', 25, { storage: 'local' }));
    expect(result.current[0]).toBe(50);
  });
});
