/**
 * Hook to manage filter options with async loading support
 */

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import type { FilterOption, FilterOptionsLoader, FilterValue } from '../types';

export interface UseFilterOptionsOptions<T = string> {
  /** Static options (takes precedence if provided) */
  staticOptions?: Array<FilterOption<T>>;

  /** Async options loader configuration */
  loader?: FilterOptionsLoader<T>;

  /** Current search query */
  searchQuery?: string;

  /** Dependency values (for cascading filters) */
  dependencyValues?: Record<string, FilterValue>;

  /** Whether to load options immediately
   * @default true
   */
  loadOnMount?: boolean;

  /** Filter ID (used for cache key) */
  filterId?: string;
}

export interface UseFilterOptionsReturn<T = string> {
  /** Current options */
  options: Array<FilterOption<T>>;

  /** Whether options are loading */
  loading: boolean;

  /** Error message if loading failed */
  error: string | null;

  /** Whether more options are available */
  hasMore: boolean;

  /** Total count of options (if known) */
  totalCount: number | undefined;

  /** Load more options (pagination) */
  loadMore: () => void;

  /** Reload options from scratch */
  reload: () => void;

  /** Update search query */
  search: (query: string) => void;
}

// Simple in-memory cache for options
const optionsCache = new Map<string, { data: Array<FilterOption<unknown>>; timestamp: number }>();

/**
 * Debounce helper
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook to manage filter options with async loading, caching, and pagination
 *
 * @param options - Hook options
 * @returns Options state and actions
 *
 * @example
 * ```tsx
 * // Static options
 * const { options } = useFilterOptions({
 *   staticOptions: [
 *     { value: 'active', label: 'Active' },
 *     { value: 'inactive', label: 'Inactive' },
 *   ],
 * });
 *
 * // Async options with pagination
 * const { options, loading, hasMore, loadMore, search } = useFilterOptions({
 *   loader: {
 *     load: async ({ searchQuery, page, pageSize }) => {
 *       const response = await fetch(`/api/items?q=${searchQuery}&page=${page}`);
 *       const data = await response.json();
 *       return { options: data.items, hasMore: data.hasMore };
 *     },
 *     paginated: true,
 *     debounceMs: 300,
 *   },
 * });
 * ```
 */
export function useFilterOptions<T = string>(
  options: UseFilterOptionsOptions<T>
): UseFilterOptionsReturn<T> {
  const {
    staticOptions,
    loader,
    searchQuery: externalSearchQuery = '',
    dependencyValues = {},
    loadOnMount = true,
    filterId = 'default',
  } = options;

  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const searchQuery = externalSearchQuery || internalSearchQuery;

  const [asyncOptions, setAsyncOptions] = useState<Array<FilterOption<T>>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [_hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const debounceMs = loader?.debounceMs ?? 300;
  const debouncedSearchQuery = useDebounce(searchQuery, debounceMs);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Generate cache key (used for cache invalidation)
  const _cacheKey = useMemo(() => {
    if (!loader) {return '';}
    return `${filterId}:${JSON.stringify({
      search: debouncedSearchQuery,
      deps: dependencyValues,
      page,
    })}`;
  }, [loader, filterId, debouncedSearchQuery, dependencyValues, page]);

  // Load options function
  const loadOptions = useCallback(
    async (isLoadMore = false) => {
      if (!loader) {return;}

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const currentPage = isLoadMore ? page + 1 : 1;

      // Check cache (only for non-loadMore requests)
      if (!isLoadMore && loader.cache !== false) {
        const cacheKeyForPage = `${filterId}:${JSON.stringify({
          search: debouncedSearchQuery,
          deps: dependencyValues,
          page: currentPage,
        })}`;
        const cached = optionsCache.get(cacheKeyForPage);
        const cacheTtl = loader.cacheTtl ?? 300000; // 5 minutes default
        if (cached && Date.now() - cached.timestamp < cacheTtl) {
          setAsyncOptions(cached.data as Array<FilterOption<T>>);
          setHasLoadedOnce(true);
          return;
        }
      }

      setLoading(true);
      setError(null);

      try {
        const result = await loader.load({
          searchQuery: debouncedSearchQuery,
          page: currentPage,
          pageSize: loader.pageSize ?? 20,
          dependencyValues,
        });

        // Check if request was aborted
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        const newOptions = isLoadMore
          ? [...asyncOptions, ...result.options]
          : result.options;

        setAsyncOptions(newOptions as Array<FilterOption<T>>);
        setHasMore(result.hasMore ?? false);
        setTotalCount(result.totalCount);
        setHasLoadedOnce(true);

        if (!isLoadMore) {
          setPage(1);
        } else {
          setPage(currentPage);
        }

        // Cache result
        if (loader.cache !== false) {
          const cacheKeyForPage = `${filterId}:${JSON.stringify({
            search: debouncedSearchQuery,
            deps: dependencyValues,
            page: currentPage,
          })}`;
          optionsCache.set(cacheKeyForPage, {
            data: newOptions,
            timestamp: Date.now(),
          });
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError((err as Error).message || 'Failed to load options');
        }
      } finally {
        setLoading(false);
      }
    },
    [loader, filterId, debouncedSearchQuery, dependencyValues, page, asyncOptions]
  );

  // Load on mount or when dependencies change
  useEffect(() => {
    if (loader && loadOnMount) {
      loadOptions();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
    // Only reload when search query or dependency values change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader, loadOnMount, debouncedSearchQuery, JSON.stringify(dependencyValues)]);

  // Use static options if provided, otherwise async options
  const finalOptions = staticOptions ?? asyncOptions;

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadOptions(true);
    }
  }, [loading, hasMore, loadOptions]);

  const reload = useCallback(() => {
    setPage(1);
    // Clear cache for this filter
    for (const key of optionsCache.keys()) {
      if (key.startsWith(`${filterId}:`)) {
        optionsCache.delete(key);
      }
    }
    loadOptions();
  }, [filterId, loadOptions]);

  const search = useCallback((query: string) => {
    setInternalSearchQuery(query);
    setPage(1);
  }, []);

  return {
    options: finalOptions,
    loading,
    error,
    hasMore,
    totalCount,
    loadMore,
    reload,
    search,
  };
}

/**
 * Clear the options cache for a specific filter or all filters
 */
export function clearOptionsCache(filterId?: string): void {
  if (filterId) {
    for (const key of optionsCache.keys()) {
      if (key.startsWith(`${filterId}:`)) {
        optionsCache.delete(key);
      }
    }
  } else {
    optionsCache.clear();
  }
}
