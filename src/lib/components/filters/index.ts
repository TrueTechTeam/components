/**
 * Filter component system - Main exports
 *
 * A highly configurable filter component system supporting multiple filter types,
 * cascading dependencies, lazy-loaded options, and various UI layouts.
 *
 * @example Basic usage
 * ```tsx
 * import {
 *   FilterProvider,
 *   FilterSidebar,
 *   FilterSection,
 *   FilterField,
 *   ActiveFilters,
 * } from '@ui-components';
 *
 * const filters = [
 *   { id: 'status', type: 'select', label: 'Status', options: [...] },
 *   { id: 'date', type: 'date-range', label: 'Date Range' },
 * ];
 *
 * <FilterProvider filters={filters} onChange={handleChange}>
 *   <FilterSidebar>
 *     <FilterSection title="Filters">
 *       <FilterField filterId="status" />
 *       <FilterField filterId="date" />
 *     </FilterSection>
 *   </FilterSidebar>
 *   <ActiveFilters />
 * </FilterProvider>
 * ```
 */

// =============================================================================
// Types
// =============================================================================

export type {
  // Core types
  FilterType,
  FilterValue,
  FilterValueWithMeta,
  FilterOption,
  FilterOptionsLoader,
  FilterOptionsLoaderParams,
  FilterOptionsLoadResult,
  FilterDependency,
  FilterDependencyAction,
  FilterDefinition,
  FilterGroup,
  FilterState,
  FilterActions,
  FilterContextValue,
  FilterOptionsState,
  NumberRangeValue,
  DateRangeValue,
  // Config types
  SelectFilterConfig,
  MultiSelectFilterConfig,
  MultiSelectDisplayMode,
  TextFilterConfig,
  NumberFilterConfig,
  NumberRangeFilterConfig,
  NumberRangeDisplayMode,
  DateFilterConfig,
  DateRangeFilterConfig,
  DateRangePreset,
  RatingFilterConfig,
  ListSelectFilterConfig,
  FilterTypeConfig,
  // Component props
  FilterProviderProps,
  FilterFieldProps,
  FilterSectionProps,
  ActiveFiltersProps,
  FilterLayoutProps,
  FilterSidebarProps,
  FilterBarProps,
  FilterPopoverProps,
  FilterModalProps,
  FilterAccordionProps,
} from './types';

// =============================================================================
// Context
// =============================================================================

export { FilterContext, useFilterContext, useFilterContextStrict } from './FilterContext';

// =============================================================================
// Hooks
// =============================================================================

export {
  useFilter,
  useFilterDependencies,
  useFilterOptions,
  getDependencyValues,
  clearOptionsCache,
} from './hooks';

export type {
  UseFilterOptions,
  UseFilterReturn,
  UseFilterDependenciesOptions,
  UseFilterDependenciesReturn,
  UseFilterOptionsOptions,
  UseFilterOptionsReturn,
} from './hooks';

// =============================================================================
// Core Components
// =============================================================================

export { FilterProvider } from './core/FilterProvider';
export { FilterField } from './core/FilterField';
export { FilterSection } from './core/FilterSection';
export { ActiveFilters } from './core/ActiveFilters';

// =============================================================================
// Filter Field Components
// =============================================================================

export {
  SelectFilter,
  MultiSelectFilter,
  CheckboxFilter,
  ToggleFilter,
  TextFilter,
  DateFilter,
  DateRangeFilter,
  NumberFilter,
  NumberRangeFilter,
  RatingFilter,
  ListSelectFilter,
} from './fields';

export type {
  SelectFilterProps,
  MultiSelectFilterProps,
  CheckboxFilterProps,
  ToggleFilterProps,
  TextFilterProps,
  DateFilterProps,
  DateRangeFilterProps,
  NumberFilterProps,
  NumberRangeFilterProps,
  RatingFilterProps,
  ListSelectFilterProps,
} from './fields';

// =============================================================================
// Layout Components
// =============================================================================

export { FilterSidebar, FilterBar, FilterPopover, FilterModal, FilterAccordion } from './layouts';
