import { createContext, useContext, type Dispatch } from 'react';
import type { UseQueryResult } from '@tanstack/react-query';

/** The parts of a TanStack Query result that `Page` and `Section` read. */
export type QueryLike = Pick<
  UseQueryResult<unknown, unknown>,
  'isPending' | 'isError' | 'error' | 'isFetching' | 'data' | 'refetch' | 'dataUpdatedAt'
>;

export interface PageContextValue {
  id: string;
  title: string;
  description?: string;
  /** Registers `queries` under `id` (a Section or the page itself). Returns the unregister function. */
  registerQueries(id: string, queries: QueryLike[]): () => void;
  /**
   * Every registered query list by owner id (read by the debug panel). Only the status fields
   * (`isPending`, `isError`, `error`, `isFetching`, `dataUpdatedAt`) are tracked: an entry is
   * replaced when one of them changes, so its `data` (and `refetch`) may be a stale reference.
   */
  queries: Record<string, QueryLike[]>;
}

export const PageContext = createContext<PageContextValue | null>(null);
PageContext.displayName = 'PageContext';

/** `[state, dispatch]` of the page reducer; `null` when the Page has no `reducer`. */
export type PageStoreValue = [unknown, Dispatch<unknown>] | null;

export const PageStoreContext = createContext<PageStoreValue | undefined>(undefined);
PageStoreContext.displayName = 'PageStoreContext';

/** The current page: id, title, description and its query registry. */
export function usePage(): PageContextValue {
  const value = useContext(PageContext);
  if (!value) {
    throw new Error('usePage must be used within a Page');
  }
  return value;
}
