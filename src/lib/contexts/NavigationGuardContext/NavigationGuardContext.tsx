import React, { createContext, useContext, useMemo, type ReactNode } from 'react';

export interface NavigationGuard {
  /** Whether this guard currently wants to block navigation */
  isBlocking(): boolean;
  /** Confirmation text shown when navigation is attempted while blocking */
  message: string;
}

export interface NavigationGuardApi {
  /** Register a guard; returns an unregister function */
  register(guard: NavigationGuard): () => void;
  /** Whether any registered guard is currently blocking */
  isBlocked(): boolean;
  /** True if nothing blocks, otherwise the result of window.confirm with the first blocking guard's message */
  confirmNavigation(): boolean;
}

/**
 * Create a guard registry. A registry with a parent also registers every guard with the parent,
 * so a scoped registry (e.g. a Dialog) sees only its own guards while the root sees all of them.
 */
export function createNavigationGuardRegistry(parent?: NavigationGuardApi): NavigationGuardApi {
  const guards = new Set<NavigationGuard>();
  const firstBlocking = () => {
    for (const guard of guards) {
      if (guard.isBlocking()) {
        return guard;
      }
    }
    return undefined;
  };
  return {
    register(guard) {
      guards.add(guard);
      const unregisterParent = parent?.register(guard);
      return () => {
        guards.delete(guard);
        unregisterParent?.();
      };
    },
    isBlocked: () => firstBlocking() !== undefined,
    confirmNavigation() {
      const blocking = firstBlocking();
      if (!blocking) {
        return true;
      }
      // eslint-disable-next-line no-alert
      return window.confirm(blocking.message);
    },
  };
}

const fallbackRegistry = createNavigationGuardRegistry();

export const NavigationGuardContext = createContext<NavigationGuardApi | null>(null);

export interface NavigationGuardProviderProps {
  children: ReactNode;
}

export function NavigationGuardProvider({ children }: NavigationGuardProviderProps) {
  const parent = useContext(NavigationGuardContext);
  const registry = useMemo(() => createNavigationGuardRegistry(parent ?? undefined), [parent]);
  return (
    <NavigationGuardContext.Provider value={registry}>{children}</NavigationGuardContext.Provider>
  );
}

/** Access the nearest guard registry (module-level fallback when there is no provider) */
export function useNavigationGuard(): NavigationGuardApi {
  return useContext(NavigationGuardContext) ?? fallbackRegistry;
}
