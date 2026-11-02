import { useCallback } from 'react';
import { useAppNavigationGuard, useRouterAdapter } from './RouterContext';

/**
 * Programmatic navigation that asks the navigation guards first: when a guard blocks and the user
 * cancels the confirmation, nothing happens.
 */
export function useAppNavigate(): (href: string, opts?: { replace?: boolean }) => void {
  const { navigate } = useRouterAdapter();
  const guard = useAppNavigationGuard();
  return useCallback(
    (href: string, opts?: { replace?: boolean }) => {
      if (guard.confirmNavigation()) {
        navigate(href, opts);
      }
    },
    [navigate, guard]
  );
}
