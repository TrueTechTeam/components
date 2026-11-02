import { createContext, useContext, type MutableRefObject } from 'react';
import type { NavigationGuardApi } from '../../lib/contexts/NavigationGuardContext';
import type { RouterAdapter } from './types';

/** Search params written but not yet committed by the router, shared by every params hook. */
export interface PendingSearch {
  /** The committed search string the write was based on. */
  from: string;
  params: URLSearchParams;
}

export interface RouterContextValue {
  adapter: RouterAdapter;
  /**
   * The guard registry where `AppProvider` is mounted. It sees every guard registered below it,
   * including those in scoped registries (e.g. inside a Dialog), so leaving the page checks all.
   */
  guard: NavigationGuardApi;
  /** Lets several param updates in one handler compose, across hook instances. */
  pendingSearch: MutableRefObject<PendingSearch | null>;
}

/**
 * Kept apart from `AppContext` so consumers of auth, flags, logging and analytics do not
 * re-render on every navigation.
 */
export const RouterContext = createContext<RouterContextValue | null>(null);
RouterContext.displayName = 'RouterContext';

/** The router context; throws `'<hookName> must be used within AppProvider'` outside it. Internal. */
export function useRouterContext(hookName: string): RouterContextValue {
  const value = useContext(RouterContext);
  if (!value) {
    throw new Error(`${hookName} must be used within AppProvider`);
  }
  return value;
}

/** The router adapter `AppProvider` was given (History API by default). */
export function useRouterAdapter(): RouterAdapter {
  return useRouterContext('useRouterAdapter').adapter;
}
