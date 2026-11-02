import { useCallback } from 'react';
import { useRouterContext } from './RouterContext';

/**
 * Programmatic navigation that asks the navigation guards first: when a guard blocks and the user
 * cancels the confirmation, nothing happens.
 */
export function useAppNavigate(): (href: string, opts?: { replace?: boolean }) => void {
  const {
    adapter: { navigate },
    guard,
  } = useRouterContext('useAppNavigate');
  return useCallback(
    (href: string, opts?: { replace?: boolean }) => {
      if (guard.confirmNavigation()) {
        navigate(href, opts);
      }
    },
    [navigate, guard]
  );
}
