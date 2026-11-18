import React, {
  useEffect,
  useMemo,
  type AnchorHTMLAttributes,
  type ComponentType,
  type MouseEvent,
} from 'react';
import { useNavigationGuard } from '../../lib/contexts/NavigationGuardContext';
import { linkClassName } from './linkClassName';
import type { RouterAdapter, RouterLinkProps } from './types';

export interface ReactRouterBlocker {
  state: string;
  proceed?(): void;
  reset?(): void;
}

export interface ReactRouterDeps {
  /** `useNavigate` from `react-router`. */
  useNavigate: () => (to: string, opts?: { replace?: boolean }) => void;
  /** `useLocation` from `react-router`. */
  useLocation: () => { pathname: string; search: string; hash?: string };
  /** `Link` from `react-router`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- any router's Link component
  Link: ComponentType<any>;
  /**
   * `useBlocker` from `react-router` (data routers only). When given, navigations the app did not
   * already confirm (Back/Forward, plain router links) ask the navigation guards first.
   */
  useBlocker?: (shouldBlock: boolean | (() => boolean)) => ReactRouterBlocker;
}

const unblocked: ReactRouterBlocker = { state: 'unblocked' };
const useNoBlocker = (_shouldBlock: boolean | (() => boolean)) => unblocked;

/**
 * Builds a router adapter hook for React Router from its own hooks, so this library never imports
 * `react-router`. Call it once at module scope and pass the result to `AppProvider`:
 *
 * ```tsx
 * import { Link, useBlocker, useLocation, useNavigate } from 'react-router';
 * const useAppRouter = createReactRouter({ useNavigate, useLocation, Link, useBlocker });
 * <AppProvider router={useAppRouter}>…</AppProvider>
 * ```
 *
 * With `useBlocker`, `supportsBlocking` is true. Navigations through the adapter itself (`navigate`,
 * `setSearchParams`, its `Link`) skip the blocker: `AppLink` and `useAppNavigate` have already
 * asked, and search-param updates are not page changes.
 */
export function createReactRouter(deps: ReactRouterDeps): () => RouterAdapter {
  const { useNavigate, useLocation, Link } = deps;
  const useBlocker = deps.useBlocker ?? useNoBlocker;
  const supportsBlocking = Boolean(deps.useBlocker);
  /** Set while the adapter starts a navigation; React Router asks the blocker synchronously. */
  let bypassBlocker = false;
  const withoutBlocker = (start: () => void) => {
    bypassBlocker = true;
    try {
      start();
    } finally {
      bypassBlocker = false;
    }
  };

  function ReactRouterLink({
    href,
    onClick,
    className,
    ...rest
  }: RouterLinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        // React Router navigates synchronously right after this handler, inside its own onClick.
        bypassBlocker = true;
        queueMicrotask(() => {
          bypassBlocker = false;
        });
      }
    };
    return <Link to={href} onClick={handleClick} className={linkClassName(className)} {...rest} />;
  }

  return function useReactRouter(): RouterAdapter {
    const navigateTo = useNavigate();
    const { pathname, search, hash = '' } = useLocation();
    const guard = useNavigationGuard();

    const blocker = useBlocker(() => !bypassBlocker && guard.isBlocked());
    useEffect(() => {
      if (blocker.state !== 'blocked') {
        return;
      }
      if (guard.confirmNavigation()) {
        blocker.proceed?.();
      } else {
        blocker.reset?.();
      }
      // Only on entering the blocked state, not again for each new blocker object while blocked.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blocker.state]);

    return useMemo(
      () => ({
        Link: ReactRouterLink,
        navigate: (href, opts) => withoutBlocker(() => navigateTo(href, opts)),
        pathname,
        searchParams: new URLSearchParams(search),
        setSearchParams: (next, opts) => {
          const qs = next.toString();
          withoutBlocker(() => navigateTo(`${pathname}${qs ? `?${qs}` : ''}${hash}`, opts));
        },
        supportsBlocking,
      }),
      [navigateTo, pathname, search, hash]
    );
  };
}
