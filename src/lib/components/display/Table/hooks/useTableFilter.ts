import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { ColumnConfig } from '../types';

export interface UseTableFilterOptions<T> {
  data: T[];
  columns: Array<ColumnConfig<T>>;
  searchQuery?: string;
  defaultSearchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchFields?: Array<keyof T>;
  searchFn?: (item: T, query: string) => boolean;
  debounceMs?: number;
}

export interface UseTableFilterReturn<T> {
  filteredData: T[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isFiltering: boolean;
}

/**
 * Hook for filtering table data with optional debounce
 * Supports controlled/uncontrolled patterns and custom filter functions
 */
export function useTableFilter<T extends Record<string, unknown>>({
  data,
  columns,
  searchQuery: controlledQuery,
  defaultSearchQuery = '',
  onSearchChange,
  searchFields,
  searchFn,
  debounceMs = 300,
}: UseTableFilterOptions<T>): UseTableFilterReturn<T> {
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

  // Default filter function - searches through specified fields or all column keys
  const defaultFilterFn = useCallback(
    (item: T, query: string): boolean => {
      if (!query.trim()) {
        return true;
      }

      const lowerQuery = query.toLowerCase();

      // Determine fields to search: explicit searchFields, or derive from columns
      const fieldsToSearch = searchFields || columns.map((col) => col.key as keyof T);

      return fieldsToSearch.some((field) => {
        const value = item[field];
        if (value === null || value === undefined) {
          return false;
        }
        return String(value).toLowerCase().includes(lowerQuery);
      });
    },
    [searchFields, columns]
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
