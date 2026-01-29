/**
 * FilterProvider - Main provider component for filter state management
 */

import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import { FilterContext } from '../../FilterContext';
import type {
  FilterProviderProps,
  FilterContextValue,
  FilterValue,
  FilterDefinition,
  FilterValueWithMeta,
  FilterOptionsState,
  FilterOption,
  NumberRangeValue,
  DateRangeValue,
} from '../../types';

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get the default value for a filter based on its type
 */
function getDefaultValue(filter: FilterDefinition): FilterValue {
  if (filter.defaultValue !== undefined) {
    return filter.defaultValue;
  }

  switch (filter.type) {
    case 'select':
    case 'text':
      return '';
    case 'multi-select':
    case 'list-select':
      return [];
    case 'checkbox':
    case 'toggle':
      return false;
    case 'number':
    case 'rating':
      return 0;
    case 'number-range':
      return { min: undefined, max: undefined };
    case 'date':
      return null;
    case 'date-range':
      return { startDate: null, endDate: null };
    default:
      return '';
  }
}

/**
 * Check if a filter value is considered empty
 */
function isValueEmpty(value: FilterValue, filter: FilterDefinition): boolean {
  // Use custom isEmpty if provided
  if (filter.isEmpty) {
    return filter.isEmpty(value);
  }

  if (value === undefined || value === null) {return true;}
  if (value === '') {return true;}
  if (Array.isArray(value) && value.length === 0) {return true;}

  // Check number range
  if (
    typeof value === 'object' &&
    'min' in value &&
    'max' in value
  ) {
    const rangeValue = value as NumberRangeValue;
    return rangeValue.min === undefined && rangeValue.max === undefined;
  }

  // Check date range
  if (
    typeof value === 'object' &&
    'startDate' in value &&
    'endDate' in value
  ) {
    const dateValue = value as DateRangeValue;
    return dateValue.startDate === null && dateValue.endDate === null;
  }

  // For boolean types, false is not considered empty
  if (filter.type === 'checkbox' || filter.type === 'toggle') {
    return false;
  }

  // For number types, 0 might be a valid value
  if (filter.type === 'number' || filter.type === 'rating') {
    return false;
  }

  return false;
}

/**
 * Get display value for a filter
 */
function getDisplayValue(
  value: FilterValue,
  filter: FilterDefinition,
  options?: FilterOption[]
): string {
  if (filter.renderValue) {
    const rendered = filter.renderValue(value);
    return typeof rendered === 'string' ? rendered : String(rendered);
  }

  switch (filter.type) {
    case 'select': {
      const option = options?.find((o) => o.value === value);
      return option ? String(option.label) : String(value);
    }
    case 'multi-select':
    case 'list-select': {
      const values = value as string[];
      if (values.length === 0) {return '';}
      if (values.length === 1) {
        const option = options?.find((o) => o.value === values[0]);
        return option ? String(option.label) : values[0];
      }
      return `${values.length} selected`;
    }
    case 'checkbox':
    case 'toggle':
      return value ? 'Yes' : 'No';
    case 'date':
      return value instanceof Date ? value.toLocaleDateString() : '';
    case 'date-range': {
      const dateRange = value as DateRangeValue;
      const parts: string[] = [];
      if (dateRange.startDate) {parts.push(dateRange.startDate.toLocaleDateString());}
      if (dateRange.endDate) {parts.push(dateRange.endDate.toLocaleDateString());}
      return parts.join(' - ');
    }
    case 'number-range': {
      const numRange = value as NumberRangeValue;
      if (numRange.min !== undefined && numRange.max !== undefined) {
        return `${numRange.min} - ${numRange.max}`;
      }
      if (numRange.min !== undefined) {return `>= ${numRange.min}`;}
      if (numRange.max !== undefined) {return `<= ${numRange.max}`;}
      return '';
    }
    case 'rating':
      return `${value} stars`;
    default:
      return String(value ?? '');
  }
}

/**
 * Serialize filter value to URL parameter
 */
function serializeValue(value: FilterValue, filter: FilterDefinition): string {
  if (value === null || value === undefined) {return '';}

  switch (filter.type) {
    case 'multi-select':
    case 'list-select':
      return (value as string[]).join(',');
    case 'date':
      return value instanceof Date ? value.toISOString() : '';
    case 'date-range': {
      const dateRange = value as DateRangeValue;
      const start = dateRange.startDate?.toISOString() ?? '';
      const end = dateRange.endDate?.toISOString() ?? '';
      return `${start}|${end}`;
    }
    case 'number-range': {
      const numRange = value as NumberRangeValue;
      return `${numRange.min ?? ''}|${numRange.max ?? ''}`;
    }
    case 'checkbox':
    case 'toggle':
      return value ? '1' : '0';
    default:
      return String(value);
  }
}

/**
 * Deserialize filter value from URL parameter
 */
function deserializeValue(param: string, filter: FilterDefinition): FilterValue {
  if (!param) {return getDefaultValue(filter);}

  switch (filter.type) {
    case 'multi-select':
    case 'list-select':
      return param.split(',').filter(Boolean);
    case 'date':
      return param ? new Date(param) : null;
    case 'date-range': {
      const [start, end] = param.split('|');
      return {
        startDate: start ? new Date(start) : null,
        endDate: end ? new Date(end) : null,
      };
    }
    case 'number-range': {
      const [min, max] = param.split('|');
      return {
        min: min ? Number(min) : undefined,
        max: max ? Number(max) : undefined,
      };
    }
    case 'number':
    case 'rating':
      return Number(param);
    case 'checkbox':
    case 'toggle':
      return param === '1' || param === 'true';
    default:
      return param;
  }
}

// =============================================================================
// Options Manager Hook
// =============================================================================

interface OptionsManagerProps {
  filters: FilterDefinition[];
  values: Record<string, FilterValue>;
}

function useOptionsManager({ filters, values: _values }: OptionsManagerProps) {
  const optionsStateRef = useRef<Map<string, FilterOptionsState>>(new Map());
  const [, forceUpdate] = useState({});

  // Create options hooks for each filter that needs them
  const optionsMap = useMemo(() => {
    const map = new Map<string, FilterOptionsState>();

    for (const filter of filters) {
      if (filter.options) {
        // Static options
        map.set(filter.id, {
          options: filter.options,
          loading: false,
          error: null,
          hasMore: false,
          loadMore: () => {},
        });
      }
    }

    return map;
  }, [filters]);

  // For filters with loaders, we need to track them separately
  const getFilterOptions = useCallback(
    (filterId: string): FilterOptionsState => {
      const filter = filters.find((f) => f.id === filterId);

      if (!filter) {
        return {
          options: [],
          loading: false,
          error: 'Filter not found',
          hasMore: false,
          loadMore: () => {},
        };
      }

      // Check if we have cached options state
      const cached = optionsStateRef.current.get(filterId);
      if (cached) {return cached;}

      // Static options
      if (filter.options) {
        const state: FilterOptionsState = {
          options: filter.options,
          loading: false,
          error: null,
          hasMore: false,
          loadMore: () => {},
        };
        optionsStateRef.current.set(filterId, state);
        return state;
      }

      // No options
      return {
        options: [],
        loading: false,
        error: null,
        hasMore: false,
        loadMore: () => {},
      };
    },
    [filters]
  );

  const reloadFilterOptions = useCallback((filterId: string) => {
    optionsStateRef.current.delete(filterId);
    forceUpdate({});
  }, []);

  return { getFilterOptions, reloadFilterOptions, optionsMap };
}

// =============================================================================
// FilterProvider Component
// =============================================================================

export const FilterProvider: React.FC<FilterProviderProps> = ({
  filters,
  groups = [],
  values: controlledValues,
  defaultValues = {},
  onChange,
  onApply,
  onClear,
  onReset,
  applyOnChange = true,
  applyDebounceMs = 0,
  syncWithUrl = false,
  urlParamPrefix = 'filter_',
  size = 'md',
  children,
}) => {
  // Initialize default values for all filters
  const initialValues = useMemo(() => {
    const initial: Record<string, FilterValue> = {};
    for (const filter of filters) {
      initial[filter.id] = defaultValues[filter.id] ?? getDefaultValue(filter);
    }
    return initial;
  }, [filters, defaultValues]);

  // State
  const [internalValues, setInternalValues] = useState<Record<string, FilterValue>>(
    () => {
      // Load from URL if syncWithUrl is enabled
      if (syncWithUrl && typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const urlValues: Record<string, FilterValue> = { ...initialValues };

        for (const filter of filters) {
          const paramValue = params.get(`${urlParamPrefix}${filter.id}`);
          if (paramValue) {
            urlValues[filter.id] = deserializeValue(paramValue, filter);
          }
        }

        return urlValues;
      }
      return initialValues;
    }
  );
  const [pendingValues, setPendingValues] = useState<Record<string, FilterValue> | null>(null);
  const [loadingFilters, _setLoadingFilters] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  // Determine current values (controlled vs uncontrolled)
  const values = controlledValues ?? internalValues;
  const displayValues = pendingValues ?? values;

  // Debounce timer ref
  const applyDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Options manager
  const { getFilterOptions, reloadFilterOptions } = useOptionsManager({
    filters,
    values,
  });

  // Calculate derived state
  const isDirty = useMemo(() => {
    return Object.keys(values).some((key) => {
      const currentValue = values[key];
      const initialValue = initialValues[key];
      return JSON.stringify(currentValue) !== JSON.stringify(initialValue);
    });
  }, [values, initialValues]);

  const activeCount = useMemo(() => {
    return filters.filter((filter) => {
      const value = values[filter.id];
      return !isValueEmpty(value, filter);
    }).length;
  }, [filters, values]);

  const hasPendingChanges = pendingValues !== null;

  // =============================================================================
  // Actions
  // =============================================================================

  const setFilterValue = useCallback(
    (filterId: string, value: FilterValue) => {
      const newValues = { ...values, [filterId]: value };

      if (controlledValues === undefined) {
        setInternalValues(newValues);
      }

      // Mark as touched
      setTouched((prev) => new Set(prev).add(filterId));

      // Clear error
      setErrors((prev) => {
        const next = { ...prev };
        delete next[filterId];
        return next;
      });

      if (applyOnChange) {
        // Debounced apply
        if (applyDebounceRef.current) {
          clearTimeout(applyDebounceRef.current);
        }

        if (applyDebounceMs > 0) {
          applyDebounceRef.current = setTimeout(() => {
            onChange?.(newValues, filterId);
            onApply?.(newValues);
          }, applyDebounceMs);
        } else {
          onChange?.(newValues, filterId);
          onApply?.(newValues);
        }
      } else {
        // Store pending values
        setPendingValues(newValues);
        onChange?.(newValues, filterId);
      }

      // Sync with URL
      if (syncWithUrl && typeof window !== 'undefined') {
        const filter = filters.find((f) => f.id === filterId);
        if (filter) {
          const params = new URLSearchParams(window.location.search);
          const serialized = serializeValue(value, filter);
          if (serialized && !isValueEmpty(value, filter)) {
            params.set(`${urlParamPrefix}${filterId}`, serialized);
          } else {
            params.delete(`${urlParamPrefix}${filterId}`);
          }
          const newUrl = `${window.location.pathname}?${params.toString()}`;
          window.history.replaceState({}, '', newUrl);
        }
      }
    },
    [
      values,
      controlledValues,
      applyOnChange,
      applyDebounceMs,
      onChange,
      onApply,
      syncWithUrl,
      urlParamPrefix,
      filters,
    ]
  );

  const setFilterValues = useCallback(
    (newValues: Record<string, FilterValue>) => {
      const mergedValues = { ...values, ...newValues };

      if (controlledValues === undefined) {
        setInternalValues(mergedValues);
      }

      // Mark all as touched
      setTouched((prev) => {
        const next = new Set(prev);
        Object.keys(newValues).forEach((key) => next.add(key));
        return next;
      });

      if (applyOnChange) {
        onChange?.(mergedValues, Object.keys(newValues)[0]);
        onApply?.(mergedValues);
      } else {
        setPendingValues(mergedValues);
        onChange?.(mergedValues, Object.keys(newValues)[0]);
      }
    },
    [values, controlledValues, applyOnChange, onChange, onApply]
  );

  const clearFilter = useCallback(
    (filterId: string) => {
      const filter = filters.find((f) => f.id === filterId);
      if (filter) {
        const defaultValue = getDefaultValue(filter);
        setFilterValue(filterId, defaultValue);
      }
    },
    [filters, setFilterValue]
  );

  const clearAllFilters = useCallback(() => {
    const clearedValues: Record<string, FilterValue> = {};
    for (const filter of filters) {
      clearedValues[filter.id] = getDefaultValue(filter);
    }

    if (controlledValues === undefined) {
      setInternalValues(clearedValues);
    }

    setTouched(new Set());
    setErrors({});
    setPendingValues(null);

    onChange?.(clearedValues, '');
    onApply?.(clearedValues);
    onClear?.();

    // Clear URL params
    if (syncWithUrl && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      for (const filter of filters) {
        params.delete(`${urlParamPrefix}${filter.id}`);
      }
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [filters, controlledValues, onChange, onApply, onClear, syncWithUrl, urlParamPrefix]);

  const resetFilters = useCallback(() => {
    if (controlledValues === undefined) {
      setInternalValues(initialValues);
    }

    setTouched(new Set());
    setErrors({});
    setPendingValues(null);

    onChange?.(initialValues, '');
    onReset?.();
  }, [initialValues, controlledValues, onChange, onReset]);

  const applyFilters = useCallback(() => {
    if (pendingValues) {
      onApply?.(pendingValues);
      setPendingValues(null);
    } else {
      onApply?.(values);
    }
  }, [pendingValues, values, onApply]);

  const touchFilter = useCallback((filterId: string) => {
    setTouched((prev) => new Set(prev).add(filterId));
  }, []);

  const setFilterError = useCallback((filterId: string, error: string | null) => {
    setErrors((prev) => {
      if (error === null) {
        const next = { ...prev };
        delete next[filterId];
        return next;
      }
      return { ...prev, [filterId]: error };
    });
  }, []);

  const validateFilters = useCallback(() => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    for (const filter of filters) {
      if (filter.validate) {
        const value = values[filter.id];
        const error = filter.validate(value);
        if (error) {
          newErrors[filter.id] = error;
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [filters, values]);

  const getFilterMeta = useCallback(
    (filterId: string): FilterValueWithMeta | undefined => {
      const filter = filters.find((f) => f.id === filterId);
      if (!filter) {return undefined;}

      const value = displayValues[filterId];
      const optionsState = getFilterOptions(filterId);

      return {
        value,
        label: filter.shortLabel || filter.label,
        displayValue: getDisplayValue(value, filter, optionsState.options),
        isEmpty: isValueEmpty(value, filter),
      };
    },
    [filters, displayValues, getFilterOptions]
  );

  const isFilterActive = useCallback(
    (filterId: string): boolean => {
      const filter = filters.find((f) => f.id === filterId);
      if (!filter) {return false;}
      return !isValueEmpty(displayValues[filterId], filter);
    },
    [filters, displayValues]
  );

  const getActiveFilters = useCallback((): Record<string, FilterValue> => {
    const active: Record<string, FilterValue> = {};
    for (const filter of filters) {
      const value = displayValues[filter.id];
      if (!isValueEmpty(value, filter)) {
        active[filter.id] = value;
      }
    }
    return active;
  }, [filters, displayValues]);

  const toSearchParams = useCallback((): URLSearchParams => {
    const params = new URLSearchParams();
    for (const filter of filters) {
      const value = displayValues[filter.id];
      if (!isValueEmpty(value, filter)) {
        const serialized = serializeValue(value, filter);
        if (serialized) {
          params.set(`${urlParamPrefix}${filter.id}`, serialized);
        }
      }
    }
    return params;
  }, [filters, displayValues, urlParamPrefix]);

  const fromSearchParams = useCallback(
    (params: URLSearchParams) => {
      const newValues: Record<string, FilterValue> = { ...initialValues };
      for (const filter of filters) {
        const paramValue = params.get(`${urlParamPrefix}${filter.id}`);
        if (paramValue) {
          newValues[filter.id] = deserializeValue(paramValue, filter);
        }
      }
      setFilterValues(newValues);
    },
    [filters, initialValues, urlParamPrefix, setFilterValues]
  );

  // =============================================================================
  // Filter Helpers
  // =============================================================================

  const getFilter = useCallback(
    (filterId: string): FilterDefinition | undefined => {
      return filters.find((f) => f.id === filterId);
    },
    [filters]
  );

  const getFiltersByGroup = useCallback(
    (groupId: string): FilterDefinition[] => {
      return filters
        .filter((f) => f.group === groupId)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    },
    [filters]
  );

  const getUngroupedFilters = useCallback((): FilterDefinition[] => {
    return filters
      .filter((f) => !f.group)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [filters]);

  const isFilterVisible = useCallback(
    (filterId: string): boolean => {
      const filter = filters.find((f) => f.id === filterId);
      if (!filter) {return false;}
      if (filter.hidden) {return false;}

      // Check dependencies
      if (filter.dependencies) {
        for (const dep of filter.dependencies) {
          const dependsOnFields = Array.isArray(dep.dependsOn)
            ? dep.dependsOn
            : [dep.dependsOn];

          const dependencyValues: Record<string, FilterValue> = {};
          for (const field of dependsOnFields) {
            dependencyValues[field] = displayValues[field];
          }

          const conditionMet = dep.condition
            ? dep.condition(dependencyValues)
            : Object.values(dependencyValues).every(
                (v) =>
                  v !== undefined &&
                  v !== null &&
                  v !== '' &&
                  !(Array.isArray(v) && v.length === 0)
              );

          const action = dep.action ?? 'show';
          if (action === 'show' && !conditionMet) {return false;}
          if (action === 'hide' && conditionMet) {return false;}
        }
      }

      return true;
    },
    [filters, displayValues]
  );

  const isFilterEnabled = useCallback(
    (filterId: string): boolean => {
      const filter = filters.find((f) => f.id === filterId);
      if (!filter) {return false;}
      if (filter.disabled) {return false;}

      // Check dependencies
      if (filter.dependencies) {
        for (const dep of filter.dependencies) {
          const dependsOnFields = Array.isArray(dep.dependsOn)
            ? dep.dependsOn
            : [dep.dependsOn];

          const dependencyValues: Record<string, FilterValue> = {};
          for (const field of dependsOnFields) {
            dependencyValues[field] = displayValues[field];
          }

          const conditionMet = dep.condition
            ? dep.condition(dependencyValues)
            : Object.values(dependencyValues).every(
                (v) =>
                  v !== undefined &&
                  v !== null &&
                  v !== '' &&
                  !(Array.isArray(v) && v.length === 0)
              );

          const action = dep.action ?? 'show';
          if (action === 'enable' && !conditionMet) {return false;}
          if (action === 'disable' && conditionMet) {return false;}
        }
      }

      return true;
    },
    [filters, displayValues]
  );

  // =============================================================================
  // Context Value
  // =============================================================================

  const contextValue = useMemo<FilterContextValue>(
    () => ({
      // State
      filters,
      groups,
      values: displayValues,
      loadingFilters,
      errors,
      touched,
      isDirty,
      activeCount,
      hasPendingChanges,
      size,

      // Actions
      setFilterValue,
      setFilterValues,
      clearFilter,
      clearAllFilters,
      resetFilters,
      applyFilters,
      touchFilter,
      setFilterError,
      validateFilters,
      getFilterMeta,
      isFilterActive,
      getActiveFilters,
      toSearchParams,
      fromSearchParams,

      // Helpers
      getFilter,
      getFiltersByGroup,
      getUngroupedFilters,
      isFilterVisible,
      isFilterEnabled,
      getFilterOptions,
      reloadFilterOptions,
    }),
    [
      filters,
      groups,
      displayValues,
      loadingFilters,
      errors,
      touched,
      isDirty,
      activeCount,
      hasPendingChanges,
      size,
      setFilterValue,
      setFilterValues,
      clearFilter,
      clearAllFilters,
      resetFilters,
      applyFilters,
      touchFilter,
      setFilterError,
      validateFilters,
      getFilterMeta,
      isFilterActive,
      getActiveFilters,
      toSearchParams,
      fromSearchParams,
      getFilter,
      getFiltersByGroup,
      getUngroupedFilters,
      isFilterVisible,
      isFilterEnabled,
      getFilterOptions,
      reloadFilterOptions,
    ]
  );

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (applyDebounceRef.current) {
        clearTimeout(applyDebounceRef.current);
      }
    };
  }, []);

  return (
    <FilterContext.Provider value={contextValue}>{children}</FilterContext.Provider>
  );
};

FilterProvider.displayName = 'FilterProvider';

export default FilterProvider;
