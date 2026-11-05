import React, { useEffect, type ReactNode } from 'react';
import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import {
  NavigationGuardProvider,
  useNavigationGuard,
} from '../../lib/contexts/NavigationGuardContext';
import { useBrowserRouter } from './browserRouter';

describe('useBrowserRouter', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/start');
  });

  it('navigate pushes a history entry and updates pathname and searchParams', () => {
    const push = jest.spyOn(window.history, 'pushState');
    const { result } = renderHook(() => useBrowserRouter());
    expect(result.current.pathname).toBe('/start');
    expect(result.current.supportsBlocking).toBe(true);

    act(() => result.current.navigate('/orders?page=2'));

    expect(push).toHaveBeenCalledTimes(1);
    expect(window.location.pathname).toBe('/orders');
    expect(result.current.pathname).toBe('/orders');
    expect(result.current.searchParams.get('page')).toBe('2');
    push.mockRestore();
  });

  it('navigate with replace uses replaceState', () => {
    const push = jest.spyOn(window.history, 'pushState');
    const replace = jest.spyOn(window.history, 'replaceState');
    const { result } = renderHook(() => useBrowserRouter());

    act(() => result.current.navigate('/other', { replace: true }));

    expect(replace).toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
    expect(result.current.pathname).toBe('/other');
    push.mockRestore();
    replace.mockRestore();
  });

  it('setSearchParams keeps the pathname', () => {
    const { result } = renderHook(() => useBrowserRouter());
    act(() => result.current.setSearchParams(new URLSearchParams('q=shoes')));
    expect(window.location.pathname).toBe('/start');
    expect(result.current.searchParams.get('q')).toBe('shoes');
  });

  it('Link navigates on a plain click without a full reload', () => {
    const onClick = jest.fn();
    function Nav() {
      const { Link, pathname } = useBrowserRouter();
      return (
        <>
          <Link href="/reports" onClick={onClick}>
            Reports
          </Link>
          <span data-testid="path">{pathname}</span>
        </>
      );
    }
    render(<Nav />);
    const link = screen.getByRole('link', { name: 'Reports' });
    expect(link).toHaveAttribute('href', '/reports');
    expect(link).toHaveClass('link');

    const notPrevented = fireEvent.click(link);

    expect(notPrevented).toBe(false);
    expect(onClick).toHaveBeenCalled();
    expect(screen.getByTestId('path')).toHaveTextContent('/reports');
  });

  it.each([{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { button: 1 }])(
    'Link does not intercept %p',
    (init) => {
      function Nav() {
        const { Link } = useBrowserRouter();
        return <Link href="/reports">Reports</Link>;
      }
      render(<Nav />);
      const notPrevented = fireEvent.click(screen.getByRole('link', { name: 'Reports' }), init);
      expect(notPrevented).toBe(true);
      expect(window.location.pathname).toBe('/start');
    }
  );

  it.each(['https://example.com/elsewhere', 'mailto:help@example.com', 'tel:+15551234'])(
    'Link does not intercept %s',
    (href) => {
      const push = jest.spyOn(window.history, 'pushState');
      function Nav() {
        const { Link } = useBrowserRouter();
        return <Link href={href}>Out</Link>;
      }
      render(<Nav />);
      const notPrevented = fireEvent.click(screen.getByRole('link', { name: 'Out' }));
      expect(notPrevented).toBe(true);
      expect(push).not.toHaveBeenCalled();
      push.mockRestore();
    }
  );

  it.each([{ download: true }, { download: 'report.csv' }, { target: '_blank' }])(
    'Link does not intercept same-origin links with %p',
    (extra) => {
      function Nav() {
        const { Link } = useBrowserRouter();
        return (
          <Link href="/files/report.csv" {...extra}>
            File
          </Link>
        );
      }
      render(<Nav />);
      const notPrevented = fireEvent.click(screen.getByRole('link', { name: 'File' }));
      expect(notPrevented).toBe(true);
      expect(window.location.pathname).toBe('/start');
    }
  );

  it('ignores hash-only popstate even while blocked', () => {
    const confirm = jest.spyOn(window, 'confirm').mockReturnValue(false);
    function BlockingGuard() {
      const guard = useNavigationGuard();
      useEffect(() => guard.register({ isBlocking: () => true, message: 'Discard?' }), [guard]);
      return null;
    }
    const wrapper = ({ children }: { children: ReactNode }) => (
      <NavigationGuardProvider>
        <BlockingGuard />
        {children}
      </NavigationGuardProvider>
    );
    const { result } = renderHook(() => useBrowserRouter(), { wrapper });
    act(() => result.current.navigate('/doc#intro'));
    act(() => {
      window.history.replaceState(null, '', '/doc#usage');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(confirm).not.toHaveBeenCalled();
    expect(window.location.hash).toBe('#usage');
    // A later real navigation away is still guarded against the hash-updated URL.
    act(() => {
      window.history.replaceState(null, '', '/elsewhere');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(confirm).toHaveBeenCalledTimes(1);
    expect(window.location.pathname + window.location.hash).toBe('/doc#usage');
    confirm.mockRestore();
  });

  it('restores the previous URL when popstate happens while blocked and the user cancels', () => {
    const confirm = jest.spyOn(window, 'confirm').mockReturnValue(false);
    function BlockingGuard() {
      const guard = useNavigationGuard();
      useEffect(() => guard.register({ isBlocking: () => true, message: 'Discard?' }), [guard]);
      return null;
    }
    const wrapper = ({ children }: { children: ReactNode }) => (
      <NavigationGuardProvider>
        <BlockingGuard />
        {children}
      </NavigationGuardProvider>
    );
    const { result } = renderHook(() => useBrowserRouter(), { wrapper });

    act(() => result.current.navigate('/edit'));
    // Simulate the browser Back button: the URL changes, then popstate fires.
    act(() => {
      window.history.replaceState(null, '', '/start');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(confirm).toHaveBeenCalledWith('Discard?');
    expect(window.location.pathname).toBe('/edit');
    expect(result.current.pathname).toBe('/edit');
    confirm.mockRestore();
  });

  it('follows popstate when nothing blocks', () => {
    const { result } = renderHook(() => useBrowserRouter());
    act(() => result.current.navigate('/a'));
    act(() => {
      window.history.replaceState(null, '', '/b?x=1');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(result.current.pathname).toBe('/b');
    expect(result.current.searchParams.get('x')).toBe('1');
  });
});
