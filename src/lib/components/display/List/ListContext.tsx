import { createContext, useContext } from 'react';
import type { ListContextValue } from './types';

/**
 * Context for sharing List state with child components
 */
export const ListContext = createContext<ListContextValue | null>(null);

/**
 * Hook to access List context (optional access)
 * Returns null if used outside of List component
 */
export function useListContext<T = Record<string, unknown>>(): ListContextValue<T> | null {
  return useContext(ListContext) as ListContextValue<T> | null;
}

/**
 * Hook to access List context (strict access)
 * Throws error if used outside of List component
 */
export function useListContextStrict<T = Record<string, unknown>>(): ListContextValue<T> {
  const context = useContext(ListContext) as ListContextValue<T> | null;
  if (!context) {
    throw new Error('useListContextStrict must be used within a List component');
  }
  return context;
}

ListContext.displayName = 'ListContext';
