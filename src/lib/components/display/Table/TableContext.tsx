import { createContext, useContext } from 'react';
import type { TableContextValue } from './types';

export const TableContext = createContext<TableContextValue | null>(null);

/**
 * Hook to optionally access Table context
 */
export function useTableContext<
  T = Record<string, unknown>
>(): TableContextValue<T> | null {
  return useContext(TableContext) as TableContextValue<T> | null;
}

/**
 * Hook that throws if not within Table
 */
export function useTableContextStrict<
  T = Record<string, unknown>
>(): TableContextValue<T> {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('Table sub-components must be used within a Table component');
  }
  return context as TableContextValue<T>;
}
