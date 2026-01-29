/**
 * Hook to access a single filter's state and actions
 */

import { useCallback, useMemo } from 'react';
import { useFilterContextStrict } from '../FilterContext';
import type {
  FilterValue,
  FilterValueWithMeta,
  FilterDefinition,
  FilterOptionsState,
} from '../types';

export interface UseFilterOptions {
  filterId: string;
}

export interface UseFilterReturn<T extends FilterValue = FilterValue> {
  /** Filter definition */
  filter: FilterDefinition<T> | undefined;

  /** Current value */
  value: T | undefined;

  /** Value with metadata */
  valueMeta: FilterValueWithMeta<T> | undefined;

  /** Whether filter has a non-empty value */
  isActive: boolean;

  /** Whether filter is visible (considering dependencies) */
  isVisible: boolean;

  /** Whether filter is enabled (considering dependencies) */
  isEnabled: boolean;

  /** Whether options are loading */
  isLoading: boolean;

  /** Whether filter has been interacted with */
  isTouched: boolean;

  /** Validation error message */
  error: string | null;

  /** Options state for select-based filters */
  options: FilterOptionsState;

  /** Set the filter value */
  setValue: (value: T) => void;

  /** Clear the filter (reset to default) */
  clear: () => void;

  /** Mark filter as touched */
  touch: () => void;

  /** Validate the filter value */
  validate: () => boolean;
}

/**
 * Hook to access a single filter's state and actions
 *
 * @param options - Hook options with filterId
 * @returns Filter state and actions
 *
 * @example
 * ```tsx
 * function StatusFilter() {
 *   const { value, setValue, options, isLoading } = useFilter({ filterId: 'status' });
 *
 *   return (
 *     <Select
 *       value={value as string}
 *       onChange={setValue}
 *       options={options.items}
 *       loading={isLoading}
 *     />
 *   );
 * }
 * ```
 */
export function useFilter<T extends FilterValue = FilterValue>(
  options: UseFilterOptions
): UseFilterReturn<T> {
  const { filterId } = options;
  const ctx = useFilterContextStrict();

  const filter = ctx.getFilter(filterId) as FilterDefinition<T> | undefined;
  const value = ctx.values[filterId] as T | undefined;
  const valueMeta = ctx.getFilterMeta(filterId) as FilterValueWithMeta<T> | undefined;

  const isActive = ctx.isFilterActive(filterId);
  const isVisible = ctx.isFilterVisible(filterId);
  const isEnabled = ctx.isFilterEnabled(filterId);
  const isLoading = ctx.loadingFilters.has(filterId);
  const isTouched = ctx.touched.has(filterId);
  const error = ctx.errors[filterId] || null;

  const optionsState = ctx.getFilterOptions(filterId);

  const setValue = useCallback(
    (newValue: T) => {
      ctx.setFilterValue(filterId, newValue);
    },
    [ctx, filterId]
  );

  const clear = useCallback(() => {
    ctx.clearFilter(filterId);
  }, [ctx, filterId]);

  const touch = useCallback(() => {
    ctx.touchFilter(filterId);
  }, [ctx, filterId]);

  const validate = useCallback(() => {
    if (!filter?.validate) {return true;}
    const validationError = filter.validate(value as T);
    ctx.setFilterError(filterId, validationError);
    return validationError === null;
  }, [ctx, filter, filterId, value]);

  return useMemo(
    () => ({
      filter,
      value,
      valueMeta,
      isActive,
      isVisible,
      isEnabled,
      isLoading,
      isTouched,
      error,
      options: optionsState,
      setValue,
      clear,
      touch,
      validate,
    }),
    [
      filter,
      value,
      valueMeta,
      isActive,
      isVisible,
      isEnabled,
      isLoading,
      isTouched,
      error,
      optionsState,
      setValue,
      clear,
      touch,
      validate,
    ]
  );
}
