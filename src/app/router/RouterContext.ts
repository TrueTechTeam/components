import { createContext, useContext } from 'react';
import type { NavigationGuardApi } from '../../lib/contexts/NavigationGuardContext';
import type { RouterAdapter } from './types';

export interface RouterContextValue {
  adapter: RouterAdapter;
  /**
   * The guard registry where `AppProvider` is mounted. It sees every guard registered below it,
   * including those in scoped registries (e.g. inside a Dialog), so leaving the page checks all.
   */
  guard: NavigationGuardApi;
}

/**
 * Kept apart from `AppContext` so consumers of auth, flags, logging and analytics do not
 * re-render on every navigation.
 */
export const RouterContext = createContext<RouterContextValue | null>(null);
RouterContext.displayName = 'RouterContext';

function useRouterContext(hookName: string): RouterContextValue {
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

/** The app-level navigation guard registry (internal: used by `AppLink` and `useAppNavigate`). */
export function useAppNavigationGuard(): NavigationGuardApi {
  return useRouterContext('useRouterAdapter').guard;
}
