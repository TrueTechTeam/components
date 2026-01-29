/**
 * Filter context for coordinating filter state across components
 */

import { createContext, useContext } from 'react';
import type { FilterContextValue } from './types';

/**
 * Filter context
 * Provides state coordination for filter components
 */
export const FilterContext = createContext<FilterContextValue | null>(null);

/**
 * Hook to optionally access filter context
 * Returns null if not within FilterProvider
 *
 * @returns FilterContextValue or null if outside provider
 *
 * @example
 * ```tsx
 * const context = useFilterContext();
 * if (context) {
 *   // Use context...
 * }
 * ```
 */
export function useFilterContext(): FilterContextValue | null {
  return useContext(FilterContext);
}

/**
 * Hook that throws if not within FilterProvider
 * Use this when filter components must be within a provider
 *
 * @throws Error if used outside FilterProvider
 * @returns FilterContextValue
 *
 * @example
 * ```tsx
 * const { values, setFilterValue } = useFilterContextStrict();
 * ```
 */
export function useFilterContextStrict(): FilterContextValue {
  const context = useContext(FilterContext);

  if (!context) {
    throw new Error(
      'useFilterContextStrict must be used within a FilterProvider. ' +
        'Wrap your filter components with <FilterProvider> to use this hook.'
    );
  }

  return context;
}
