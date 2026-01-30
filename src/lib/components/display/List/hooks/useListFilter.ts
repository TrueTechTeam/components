import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { UseListFilterOptions, UseListFilterReturn } from '../types';

/**
 * Hook for filtering list items with optional debounce
 * Supports controlled/uncontrolled patterns and custom filter functions
 */
export function useListFilter<T extends Record<string, unknown>>({
  data,
  searchQuery: controlledQuery,
  defaultSearchQuery = '',
  onSearchChange,
  searchFields,
  searchFn,
  debounceMs = 300,
}: UseListFilterOptions<T>): UseListFilterReturn<T> {
  const [uncontrolledQuery, setUncontrolledQuery] = useState(defaultSearchQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(defaultSearchQuery);
  const [isFiltering, setIsFiltering] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isControlled = controlledQuery !== undefined;
  const currentQuery = isControlled ? controlledQuery : uncontrolledQuery;

  // Debounce the query for filtering
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (currentQuery !== debouncedQuery) {
      setIsFiltering(true);
      debounceTimerRef.current = setTimeout(() => {
        setDebouncedQuery(currentQuery);
        setIsFiltering(false);
      }, debounceMs);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [currentQuery, debouncedQuery, debounceMs]);

  const setSearchQuery = useCallback(
    (query: string) => {
      if (!isControlled) {
        setUncontrolledQuery(query);
      }
      onSearchChange?.(query);
    },
    [isControlled, onSearchChange]
  );

  // Default filter function
  const defaultFilterFn = useCallback(
    (item: T, query: string): boolean => {
      if (!query.trim()) {
        return true;
      }

      const lowerQuery = query.toLowerCase();
      const fieldsToSearch = searchFields || (Object.keys(item) as Array<keyof T>);

      return fieldsToSearch.some((field) => {
        const value = item[field];
        if (value === null || value === undefined) {
          return false;
        }
        return String(value).toLowerCase().includes(lowerQuery);
      });
    },
    [searchFields]
  );

  const filterFn = searchFn || defaultFilterFn;

  const filteredData = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return data;
    }
    return data.filter((item) => filterFn(item, debouncedQuery));
  }, [data, debouncedQuery, filterFn]);

  return {
    filteredData,
    searchQuery: currentQuery,
    setSearchQuery,
    isFiltering,
  };
}
