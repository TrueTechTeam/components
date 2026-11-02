import React, { useEffect, type ReactNode } from 'react';
import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import {
  NavigationGuardProvider,
  useNavigationGuard,
} from '../../lib/contexts/NavigationGuardContext';
import { AppProvider } from '../AppProvider';
import { AppLink } from './AppLink';
import { useAppNavigate } from './useAppNavigate';

const silentLogger = { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() };

function BlockingGuard() {
  const guard = useNavigationGuard();
  useEffect(() => guard.register({ isBlocking: () => true, message: 'Discard changes?' }), [guard]);
  return null;
}

function App({ children, blocking = false }: { children: ReactNode; blocking?: boolean }) {
  return (
    <NavigationGuardProvider>
      <AppProvider logger={silentLogger}>
        {blocking && <BlockingGuard />}
        {children}
      </AppProvider>
    </NavigationGuardProvider>
  );
}

describe('AppLink', () => {
  let confirm: jest.SpyInstance;
  beforeEach(() => {
    window.history.replaceState(null, '', '/start');
    confirm = jest.spyOn(window, 'confirm');
  });
  afterEach(() => confirm.mockRestore());

  it('renders the adapter link and navigates in-app when nothing blocks', () => {
    const onClick = jest.fn();
    render(
      <App>
        <AppLink href="/orders" className="nav" aria-current="page" onClick={onClick}>
          Orders
        </AppLink>
      </App>
    );
    const link = screen.getByRole('link', { name: 'Orders' });
    expect(link).toHaveAttribute('href', '/orders');
    expect(link).toHaveClass('nav');
    expect(link).toHaveAttribute('aria-current', 'page');

    fireEvent.click(link);

    expect(onClick).toHaveBeenCalled();
    expect(confirm).not.toHaveBeenCalled();
    expect(window.location.pathname).toBe('/orders');
  });

  it('does not navigate when guard blocks and confirm is cancelled', () => {
    confirm.mockReturnValue(false);
    render(
      <App blocking>
        <AppLink href="/orders">Orders</AppLink>
      </App>
    );
    const notPrevented = fireEvent.click(screen.getByRole('link', { name: 'Orders' }));
    expect(notPrevented).toBe(false);
    expect(confirm).toHaveBeenCalledWith('Discard changes?');
    expect(window.location.pathname).toBe('/start');
  });

  it('navigates when guard blocks and confirm is accepted', () => {
    confirm.mockReturnValue(true);
    render(
      <App blocking>
        <AppLink href="/orders">Orders</AppLink>
      </App>
    );
    fireEvent.click(screen.getByRole('link', { name: 'Orders' }));
    expect(confirm).toHaveBeenCalledTimes(1);
    expect(window.location.pathname).toBe('/orders');
  });

  it('checks page-level guards from inside a scoped guard registry (e.g. a Dialog)', () => {
    confirm.mockReturnValue(false);
    render(
      <App blocking>
        <NavigationGuardProvider>
          <AppLink href="/orders">Orders</AppLink>
        </NavigationGuardProvider>
      </App>
    );
    fireEvent.click(screen.getByRole('link', { name: 'Orders' }));
    expect(confirm).toHaveBeenCalledWith('Discard changes?');
    expect(window.location.pathname).toBe('/start');
  });

  it.each([
    ['a modified click', { ctrlKey: true }, {}],
    ['a new-tab target', {}, { target: '_blank' }],
    ['a download', {}, { download: true }],
    ['another origin', {}, { href: 'https://example.com/x' }],
  ])('does not ask for confirmation on %s', (_label, init, extra) => {
    confirm.mockReturnValue(false);
    render(
      <App blocking>
        <AppLink href="/orders" {...extra}>
          Orders
        </AppLink>
      </App>
    );
    fireEvent.click(screen.getByRole('link', { name: 'Orders' }), init);
    expect(confirm).not.toHaveBeenCalled();
    expect(window.location.pathname).toBe('/start');
  });

  it('skips the guard when onClick prevents default', () => {
    render(
      <App blocking>
        <AppLink href="/orders" onClick={(e) => e.preventDefault()}>
          Orders
        </AppLink>
      </App>
    );
    fireEvent.click(screen.getByRole('link', { name: 'Orders' }));
    expect(confirm).not.toHaveBeenCalled();
    expect(window.location.pathname).toBe('/start');
  });

  it('replace replaces the current history entry', () => {
    const push = jest.spyOn(window.history, 'pushState');
    render(
      <App>
        <AppLink href="/orders" replace>
          Orders
        </AppLink>
      </App>
    );
    fireEvent.click(screen.getByRole('link', { name: 'Orders' }));
    expect(push).not.toHaveBeenCalled();
    expect(window.location.pathname).toBe('/orders');
    push.mockRestore();
  });
});

describe('useAppNavigate', () => {
  let confirm: jest.SpyInstance;
  beforeEach(() => {
    window.history.replaceState(null, '', '/start');
    confirm = jest.spyOn(window, 'confirm');
  });
  afterEach(() => confirm.mockRestore());

  it('navigates when nothing blocks, honoring replace', () => {
    const replace = jest.spyOn(window.history, 'replaceState');
    const { result } = renderHook(() => useAppNavigate(), { wrapper: App });
    act(() => result.current('/orders', { replace: true }));
    expect(window.location.pathname).toBe('/orders');
    expect(replace).toHaveBeenCalled();
    expect(confirm).not.toHaveBeenCalled();
    replace.mockRestore();
  });

  it('confirms through the guard first and stays put when cancelled', () => {
    confirm.mockReturnValue(false);
    const { result } = renderHook(() => useAppNavigate(), {
      wrapper: ({ children }) => <App blocking>{children}</App>,
    });
    act(() => result.current('/orders'));
    expect(confirm).toHaveBeenCalledWith('Discard changes?');
    expect(window.location.pathname).toBe('/start');

    confirm.mockReturnValue(true);
    act(() => result.current('/orders'));
    expect(window.location.pathname).toBe('/orders');
  });

  it('throws outside AppProvider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => renderHook(() => useAppNavigate())).toThrow(
      'useRouterAdapter must be used within AppProvider'
    );
    spy.mockRestore();
  });
});
