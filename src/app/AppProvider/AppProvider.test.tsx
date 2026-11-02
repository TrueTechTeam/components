import React, { type ReactNode } from 'react';
import { act, render, renderHook, screen } from '@testing-library/react';
import { useQueryClient } from '@tanstack/react-query';
import { Dialog } from '../../lib/components/overlays/Dialog';
import { useBreakpoints } from '../../lib/contexts/BreakpointsContext';
import {
  AppProvider,
  Can,
  Feature,
  useAppConfig,
  useAppTranslation,
  useAuth,
  useCan,
  useFlag,
  useFormatters,
  useLogBuffer,
  useLogger,
  useTrack,
  type AppProviderProps,
  type Logger,
} from './index';

const silentLogger: Logger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

function makeWrapper(props: Partial<AppProviderProps> = {}) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <AppProvider logger={silentLogger} {...props}>
        {children}
      </AppProvider>
    );
  };
}

describe('AppProvider', () => {
  it('provides permissive defaults: can is true, flags are off, track is a no-op', () => {
    const { result } = renderHook(
      () => ({ auth: useAuth(), flag: useFlag('beta'), track: useTrack(), can: useCan('edit') }),
      { wrapper: makeWrapper() }
    );
    expect(result.current.auth.user).toBeNull();
    expect(result.current.auth.can('delete', 'post')).toBe(true);
    expect(result.current.can).toBe(true);
    expect(result.current.flag).toBe(false);
    expect(() => result.current.track('clicked', { a: 1 })).not.toThrow();
  });

  it('forwards track calls to the analytics adapter', () => {
    const analytics = { track: jest.fn() };
    const { result } = renderHook(() => useTrack(), { wrapper: makeWrapper({ analytics }) });
    result.current('saved', { id: 3 });
    expect(analytics.track).toHaveBeenCalledWith('saved', { id: 3 });
  });

  it('Can hides children and shows the fallback when can() is false', () => {
    const auth = { user: { id: 1 }, can: (action: string) => action !== 'edit' };
    render(
      <AppProvider logger={silentLogger} auth={auth}>
        <Can action="edit" fallback={<span>No access</span>}>
          <button type="button">Edit</button>
        </Can>
        <Can action="view">
          <span>Visible</span>
        </Can>
      </AppProvider>
    );
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument();
    expect(screen.getByText('No access')).toBeInTheDocument();
    expect(screen.getByText('Visible')).toBeInTheDocument();
  });

  it('passes action and subject to can()', () => {
    const can = jest.fn(() => false);
    const { result } = renderHook(() => useCan('delete', 'invoice'), {
      wrapper: makeWrapper({ auth: { user: null, can } }),
    });
    expect(result.current).toBe(false);
    expect(can).toHaveBeenCalledWith('delete', 'invoice');
  });

  it('Feature renders children only when the flag is enabled', () => {
    const flags = { isEnabled: (f: string) => f === 'new-ui' };
    render(
      <AppProvider logger={silentLogger} flags={flags}>
        <Feature name="new-ui">
          <span>New UI</span>
        </Feature>
        <Feature name="old-ui" fallback={<span>Old fallback</span>}>
          <span>Old UI</span>
        </Feature>
      </AppProvider>
    );
    expect(screen.getByText('New UI')).toBeInTheDocument();
    expect(screen.queryByText('Old UI')).not.toBeInTheDocument();
    expect(screen.getByText('Old fallback')).toBeInTheDocument();
  });

  it('useLogger forwards to the custom logger and records the call with its scope', () => {
    const logger: Logger = { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() };
    const { result } = renderHook(() => ({ log: useLogger('orders'), buffer: useLogBuffer() }), {
      wrapper: makeWrapper({ logger }),
    });
    act(() => {
      result.current.log.error('boom', 42);
    });
    expect(logger.error).toHaveBeenCalledWith('[orders]', 'boom', 42);
    const last = result.current.buffer[result.current.buffer.length - 1];
    expect(last).toMatchObject({ level: 'error', scope: 'orders', args: ['boom', 42] });
    expect(typeof last.time).toBe('number');
  });

  it('keeps only the latest 200 log entries', () => {
    const { result } = renderHook(() => ({ log: useLogger(), buffer: useLogBuffer() }), {
      wrapper: makeWrapper(),
    });
    act(() => {
      for (let i = 0; i < 205; i++) {
        result.current.log.info(i);
      }
    });
    expect(result.current.buffer).toHaveLength(200);
    expect(result.current.buffer[0].args).toEqual([5]);
    expect(result.current.buffer[199].args).toEqual([204]);
    expect(result.current.buffer[0].scope).toBeUndefined();
  });

  it('routes translate into core labels', () => {
    const translate = (key: string) => (key === 'ui.dialog.close' ? 'Fermer la boîte' : undefined);
    render(
      <AppProvider logger={silentLogger} translate={translate}>
        <Dialog isOpen title="Hello" />
      </AppProvider>
    );
    expect(screen.getByRole('button', { name: 'Fermer la boîte' })).toBeInTheDocument();
  });

  it('useAppTranslation uses translate, falling back to the key', () => {
    const translate = (key: string, vars?: Record<string, string | number>) =>
      key === 'orders.title' ? `Commandes (${vars?.count})` : undefined;
    const { result } = renderHook(() => useAppTranslation(), {
      wrapper: makeWrapper({ translate, locale: 'fr-FR' }),
    });
    expect(result.current.t('orders.title', { count: 2 })).toBe('Commandes (2)');
    expect(result.current.t('orders.missing')).toBe('orders.missing');
    expect(result.current.locale).toBe('fr-FR');
  });

  it('useFormatters binds the provider locale', () => {
    const { result } = renderHook(() => useFormatters(), {
      wrapper: makeWrapper({ locale: 'de-DE' }),
    });
    const expected = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
      5
    );
    expect(result.current.currency(5, 'EUR')).toBe(expected);
    expect(result.current.number(1234.5)).toBe(new Intl.NumberFormat('de-DE').format(1234.5));
  });

  it('provides a default QueryClient with the documented defaults, or the given one', () => {
    const { result } = renderHook(() => useQueryClient(), { wrapper: makeWrapper() });
    expect(result.current.getDefaultOptions().queries).toMatchObject({
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: true,
    });
  });

  it('passes breakpoints through and exposes titleTemplate and the router', () => {
    const { result } = renderHook(() => ({ config: useAppConfig(), bp: useBreakpoints() }), {
      wrapper: makeWrapper({ breakpoints: { tablet: 700 }, titleTemplate: (t) => `${t} | Acme` }),
    });
    expect(result.current.bp.tablet).toBe(700);
    expect(result.current.config.titleTemplate('Orders')).toBe('Orders | Acme');
    expect(result.current.config.router.pathname).toBe(window.location.pathname);
  });

  it('uses the router hook passed in', () => {
    const fakeRouter = () => ({
      Link: () => null,
      navigate: jest.fn(),
      pathname: '/fake',
      searchParams: new URLSearchParams('a=1'),
      setSearchParams: jest.fn(),
      supportsBlocking: false,
    });
    const { result } = renderHook(() => useAppConfig(), {
      wrapper: makeWrapper({ router: fakeRouter }),
    });
    expect(result.current.router.pathname).toBe('/fake');
  });

  it('throws a named error when a hook is used outside AppProvider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used within AppProvider');
    expect(() => renderHook(() => useFlag('x'))).toThrow('useFlag must be used within AppProvider');
    spy.mockRestore();
  });
});
