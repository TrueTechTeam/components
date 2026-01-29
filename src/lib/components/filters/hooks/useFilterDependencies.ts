/**
 * Hook to evaluate filter dependencies and cascading logic
 */

import { useMemo, useEffect, useRef } from 'react';
import type { FilterDefinition, FilterValue, FilterDependency } from '../types';

export interface UseFilterDependenciesOptions {
  /** The filter definition */
  filter: FilterDefinition;

  /** All current filter values */
  allValues: Record<string, FilterValue>;

  /** Callback when options should be reloaded */
  onReloadOptions?: () => void;

  /** Callback when value should be reset */
  onResetValue?: () => void;
}

export interface UseFilterDependenciesReturn {
  /** Whether the filter should be visible */
  isVisible: boolean;

  /** Whether the filter should be enabled */
  isEnabled: boolean;

  /** Whether options should be reloaded */
  shouldReloadOptions: boolean;
}

/**
 * Evaluates a single dependency
 */
function evaluateDependency(
  dep: FilterDependency,
  allValues: Record<string, FilterValue>
): { conditionMet: boolean; dependencyValues: Record<string, FilterValue> } {
  const dependsOnFields = Array.isArray(dep.dependsOn) ? dep.dependsOn : [dep.dependsOn];

  // Get dependency values
  const dependencyValues: Record<string, FilterValue> = {};
  for (const field of dependsOnFields) {
    dependencyValues[field] = allValues[field];
  }

  // Evaluate condition
  const conditionMet = dep.condition
    ? dep.condition(dependencyValues)
    : Object.values(dependencyValues).every(
        (v) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0)
      );

  return { conditionMet, dependencyValues };
}

/**
 * Hook to evaluate filter dependencies and manage cascading behavior
 *
 * @param options - Hook options
 * @returns Dependency evaluation results
 *
 * @example
 * ```tsx
 * const { isVisible, isEnabled } = useFilterDependencies({
 *   filter: subcategoryFilter,
 *   allValues: filterValues,
 *   onReloadOptions: () => reloadSubcategories(),
 *   onResetValue: () => clearSubcategory(),
 * });
 * ```
 */
export function useFilterDependencies(
  options: UseFilterDependenciesOptions
): UseFilterDependenciesReturn {
  const { filter, allValues, onReloadOptions, onResetValue } = options;
  const prevDependencyValuesRef = useRef<Record<string, FilterValue>>({});

  // Evaluate dependencies
  const result = useMemo(() => {
    if (!filter.dependencies || filter.dependencies.length === 0) {
      return {
        isVisible: !filter.hidden,
        isEnabled: !filter.disabled,
        shouldReloadOptions: false,
      };
    }

    let isVisible = !filter.hidden;
    let isEnabled = !filter.disabled;
    let shouldReloadOptions = false;

    for (const dep of filter.dependencies) {
      const { conditionMet } = evaluateDependency(dep, allValues);

      // Apply action
      const action = dep.action || 'show';

      switch (action) {
        case 'show':
          if (!conditionMet) {isVisible = false;}
          break;
        case 'hide':
          if (conditionMet) {isVisible = false;}
          break;
        case 'enable':
          if (!conditionMet) {isEnabled = false;}
          break;
        case 'disable':
          if (conditionMet) {isEnabled = false;}
          break;
        case 'reload-options':
          if (conditionMet) {shouldReloadOptions = true;}
          break;
      }
    }

    return { isVisible, isEnabled, shouldReloadOptions };
  }, [filter, allValues]);

  // Track dependency value changes for reset and reload
  useEffect(() => {
    if (!filter.dependencies) {return;}

    for (const dep of filter.dependencies) {
      const dependsOnFields = Array.isArray(dep.dependsOn) ? dep.dependsOn : [dep.dependsOn];

      for (const field of dependsOnFields) {
        const prevValue = prevDependencyValuesRef.current[field];
        const currentValue = allValues[field];

        // Check if value has actually changed (handle reference equality for objects)
        const hasChanged =
          prevValue !== currentValue &&
          JSON.stringify(prevValue) !== JSON.stringify(currentValue);

        if (hasChanged && prevDependencyValuesRef.current[field] !== undefined) {
          // Dependency value changed (not initial mount)
          if (dep.resetOnChange && onResetValue) {
            onResetValue();
          }

          if (dep.action === 'reload-options' && onReloadOptions) {
            onReloadOptions();
          }
        }

        prevDependencyValuesRef.current[field] = currentValue;
      }
    }
  }, [filter.dependencies, allValues, onReloadOptions, onResetValue]);

  return result;
}

/**
 * Get the dependency values for a filter
 */
export function getDependencyValues(
  filter: FilterDefinition,
  allValues: Record<string, FilterValue>
): Record<string, FilterValue> {
  if (!filter.dependencies || filter.dependencies.length === 0) {
    return {};
  }

  const dependencyValues: Record<string, FilterValue> = {};

  for (const dep of filter.dependencies) {
    const dependsOnFields = Array.isArray(dep.dependsOn) ? dep.dependsOn : [dep.dependsOn];
    for (const field of dependsOnFields) {
      dependencyValues[field] = allValues[field];
    }
  }

  return dependencyValues;
}
