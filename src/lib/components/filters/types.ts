/**
 * Filter component system types
 */

import type { ReactNode } from 'react';
import type { BaseComponentProps, ComponentSize } from '../../types';
import type { PopoverPosition } from '../../utils/positioning';

// =============================================================================
// Filter Types
// =============================================================================

/**
 * Supported filter types
 */
export type FilterType =
  | 'select' // Single select dropdown
  | 'multi-select' // Multi-select (checkbox group or dropdown)
  | 'checkbox' // Single boolean checkbox
  | 'toggle' // Boolean toggle switch
  | 'text' // Text input (search/keyword)
  | 'number' // Single number input
  | 'number-range' // Min/max number range
  | 'date' // Single date picker
  | 'date-range' // Date range picker
  | 'rating' // Star rating
  | 'list-select'; // Searchable list selection

// =============================================================================
// Filter Values
// =============================================================================

/**
 * Number range value
 */
export interface NumberRangeValue {
  min?: number;
  max?: number;
}

/**
 * Date range value
 */
export interface DateRangeValue {
  startDate?: Date | null;
  endDate?: Date | null;
}

/**
 * Possible filter values by type
 */
export type FilterValue =
  | string // select, text
  | string[] // multi-select, list-select
  | number // number, rating
  | boolean // checkbox, toggle
  | Date // date
  | null // cleared date
  | NumberRangeValue // number-range
  | DateRangeValue; // date-range

/**
 * Filter value with metadata for display
 */
export interface FilterValueWithMeta<T extends FilterValue = FilterValue> {
  value: T;
  label?: string;
  displayValue?: string;
  isEmpty?: boolean;
}

// =============================================================================
// Filter Options
// =============================================================================

/**
 * Filter option for select-based filters
 */
export interface FilterOption<T = string> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
  group?: string;
  count?: number;
  icon?: ReactNode;
  description?: string;
}

/**
 * Parameters passed to async options loader
 */
export interface FilterOptionsLoaderParams {
  searchQuery?: string;
  page?: number;
  pageSize?: number;
  dependencyValues?: Record<string, FilterValue>;
}

/**
 * Result from async options loader
 */
export interface FilterOptionsLoadResult<T = string> {
  options: Array<FilterOption<T>>;
  hasMore?: boolean;
  totalCount?: number;
}

/**
 * Async options loader configuration
 */
export interface FilterOptionsLoader<T = string> {
  /**
   * Function to load options (can be async)
   */
  load: (params: FilterOptionsLoaderParams) => Promise<FilterOptionsLoadResult<T>>;

  /**
   * Debounce delay for search input (ms)
   * @default 300
   */
  debounceMs?: number;

  /**
   * Enable pagination for options
   */
  paginated?: boolean;

  /**
   * Page size for pagination
   * @default 20
   */
  pageSize?: number;

  /**
   * Cache options after loading
   * @default true
   */
  cache?: boolean;

  /**
   * Cache TTL in milliseconds
   * @default 300000 (5 minutes)
   */
  cacheTtl?: number;
}

// =============================================================================
// Filter Dependencies
// =============================================================================

/**
 * Dependency action types
 */
export type FilterDependencyAction = 'show' | 'hide' | 'enable' | 'disable' | 'reload-options';

/**
 * Filter dependency configuration
 */
export interface FilterDependency {
  /**
   * Field name(s) this filter depends on
   */
  dependsOn: string | string[];

  /**
   * Condition to evaluate (receives dependent field values)
   */
  condition?: (dependencyValues: Record<string, FilterValue>) => boolean;

  /**
   * Action when condition is met
   * @default 'show'
   */
  action?: FilterDependencyAction;

  /**
   * Whether to reset this filter's value when dependencies change
   * @default false
   */
  resetOnChange?: boolean;

  /**
   * Transform options based on dependency values
   */
  transformOptions?: (
    options: FilterOption[],
    dependencyValues: Record<string, FilterValue>
  ) => FilterOption[];
}

// =============================================================================
// Type-Specific Configurations
// =============================================================================

/**
 * Select filter configuration
 */
export interface SelectFilterConfig {
  searchable?: boolean;
  searchPlaceholder?: string;
  showClearButton?: boolean;
  scrollToSelected?: boolean;
}

/**
 * Multi-select filter display modes
 */
export type MultiSelectDisplayMode = 'checkbox-group' | 'dropdown' | 'list';

/**
 * Multi-select filter configuration
 */
export interface MultiSelectFilterConfig {
  displayMode?: MultiSelectDisplayMode;
  orientation?: 'horizontal' | 'vertical';
  min?: number;
  max?: number;
  showSelectAll?: boolean;
  selectAllLabel?: string;
}

/**
 * Text filter configuration
 */
export interface TextFilterConfig {
  debounceMs?: number;
  minLength?: number;
  maxLength?: number;
  inputType?: 'text' | 'search' | 'email' | 'tel' | 'url';
  showClearButton?: boolean;
  startIcon?: ReactNode;
}

/**
 * Number filter configuration
 */
export interface NumberFilterConfig {
  min?: number;
  max?: number;
  step?: number;
  showButtons?: boolean;
  prefix?: string;
  suffix?: string;
}

/**
 * Number range filter display modes
 */
export type NumberRangeDisplayMode = 'inputs' | 'slider' | 'both';

/**
 * Number range filter configuration
 */
export interface NumberRangeFilterConfig extends NumberFilterConfig {
  displayMode?: NumberRangeDisplayMode;
  showLabels?: boolean;
  minLabel?: string;
  maxLabel?: string;
}

/**
 * Date filter configuration
 */
export interface DateFilterConfig {
  minDate?: Date;
  maxDate?: Date;
  format?: string;
  showCalendar?: boolean;
  showClearButton?: boolean;
}

/**
 * Date range preset
 */
export interface DateRangePreset {
  label: string;
  getValue: () => { startDate: Date; endDate: Date };
}

/**
 * Date range filter configuration
 */
export interface DateRangeFilterConfig extends DateFilterConfig {
  showPresets?: boolean;
  presets?: DateRangePreset[];
  minDays?: number;
  maxDays?: number;
}

/**
 * Rating filter configuration
 */
export interface RatingFilterConfig {
  max?: number;
  allowClear?: boolean;
  icon?: ReactNode;
  emptyIcon?: ReactNode;
}

/**
 * List select filter configuration
 */
export interface ListSelectFilterConfig {
  selectionMode?: 'single' | 'multiple';
  searchable?: boolean;
  searchPlaceholder?: string;
  showCounts?: boolean;
  maxHeight?: number | string;
  virtualized?: boolean;
  groupBy?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Union of all filter type configs
 */
export type FilterTypeConfig =
  | SelectFilterConfig
  | MultiSelectFilterConfig
  | TextFilterConfig
  | NumberFilterConfig
  | NumberRangeFilterConfig
  | DateFilterConfig
  | DateRangeFilterConfig
  | RatingFilterConfig
  | ListSelectFilterConfig;

// =============================================================================
// Filter Definition
// =============================================================================

/**
 * Complete filter definition
 */
export interface FilterDefinition<T extends FilterValue = FilterValue> {
  /**
   * Unique filter identifier
   */
  id: string;

  /**
   * Filter type
   */
  type: FilterType;

  /**
   * Display label
   */
  label: string;

  /**
   * Short label for compact displays (e.g., active filters)
   */
  shortLabel?: string;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Helper text
   */
  helperText?: string;

  /**
   * Default value
   */
  defaultValue?: T;

  /**
   * Static options (for select-based filters)
   */
  options?: FilterOption[];

  /**
   * Async options loader
   */
  optionsLoader?: FilterOptionsLoader;

  /**
   * Filter dependencies
   */
  dependencies?: FilterDependency[];

  /**
   * Whether filter is required
   * @default false
   */
  required?: boolean;

  /**
   * Whether filter is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether filter is hidden
   * @default false
   */
  hidden?: boolean;

  /**
   * Group/section this filter belongs to
   */
  group?: string;

  /**
   * Sort order within group
   */
  order?: number;

  /**
   * Custom render function for the filter value display
   */
  renderValue?: (value: T) => ReactNode;

  /**
   * Custom empty value check
   */
  isEmpty?: (value: T) => boolean;

  /**
   * Validation function
   */
  validate?: (value: T) => string | null;

  /**
   * Type-specific configuration
   */
  config?: FilterTypeConfig;
}

// =============================================================================
// Filter Group
// =============================================================================

/**
 * Filter group definition
 */
export interface FilterGroup {
  /**
   * Unique group identifier
   */
  id: string;

  /**
   * Group label
   */
  label: string;

  /**
   * Group description
   */
  description?: string;

  /**
   * Group icon
   */
  icon?: ReactNode;

  /**
   * Whether group is collapsible
   * @default true
   */
  collapsible?: boolean;

  /**
   * Default collapsed state
   * @default false
   */
  defaultCollapsed?: boolean;

  /**
   * Sort order
   */
  order?: number;
}

// =============================================================================
// Filter State
// =============================================================================

/**
 * Complete filter state
 */
export interface FilterState {
  /**
   * Current filter values by filter ID
   */
  values: Record<string, FilterValue>;

  /**
   * Filters that are currently loading options
   */
  loadingFilters: Set<string>;

  /**
   * Filters with errors
   */
  errors: Record<string, string>;

  /**
   * Filters that have been touched/interacted with
   */
  touched: Set<string>;

  /**
   * Whether any filter has been modified from default
   */
  isDirty: boolean;

  /**
   * Count of active (non-empty) filters
   */
  activeCount: number;
}

/**
 * Filter actions for state management
 */
export interface FilterActions {
  /**
   * Set a single filter value
   */
  setFilterValue: (filterId: string, value: FilterValue) => void;

  /**
   * Set multiple filter values at once
   */
  setFilterValues: (values: Record<string, FilterValue>) => void;

  /**
   * Clear a single filter (reset to default)
   */
  clearFilter: (filterId: string) => void;

  /**
   * Clear all filters (reset to defaults)
   */
  clearAllFilters: () => void;

  /**
   * Reset filters to initial values
   */
  resetFilters: () => void;

  /**
   * Mark a filter as touched
   */
  touchFilter: (filterId: string) => void;

  /**
   * Set filter error
   */
  setFilterError: (filterId: string, error: string | null) => void;

  /**
   * Validate all filters
   */
  validateFilters: () => boolean;

  /**
   * Get filter value with metadata
   */
  getFilterMeta: (filterId: string) => FilterValueWithMeta | undefined;

  /**
   * Check if a filter is active (has non-default value)
   */
  isFilterActive: (filterId: string) => boolean;

  /**
   * Get all active filter values (for API calls)
   */
  getActiveFilters: () => Record<string, FilterValue>;

  /**
   * Get URL search params from current filters
   */
  toSearchParams: () => URLSearchParams;

  /**
   * Load filters from URL search params
   */
  fromSearchParams: (params: URLSearchParams) => void;
}

// =============================================================================
// Filter Context
// =============================================================================

/**
 * Options loading state
 */
export interface FilterOptionsState {
  options: FilterOption[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
}

/**
 * Filter context value
 */
export interface FilterContextValue extends FilterState, FilterActions {
  /**
   * All filter definitions
   */
  filters: FilterDefinition[];

  /**
   * Filter groups
   */
  groups: FilterGroup[];

  /**
   * Get filter definition by ID
   */
  getFilter: (filterId: string) => FilterDefinition | undefined;

  /**
   * Get filters by group
   */
  getFiltersByGroup: (groupId: string) => FilterDefinition[];

  /**
   * Get ungrouped filters
   */
  getUngroupedFilters: () => FilterDefinition[];

  /**
   * Check if filter is visible (considering dependencies)
   */
  isFilterVisible: (filterId: string) => boolean;

  /**
   * Check if filter is enabled (considering dependencies)
   */
  isFilterEnabled: (filterId: string) => boolean;

  /**
   * Get options for a filter (handles async loading)
   */
  getFilterOptions: (filterId: string) => FilterOptionsState;

  /**
   * Reload options for a filter
   */
  reloadFilterOptions: (filterId: string) => void;

  /**
   * Size variant
   */
  size: ComponentSize;

  /**
   * Apply filters (for non-immediate apply mode)
   */
  applyFilters: () => void;

  /**
   * Whether changes are pending (for non-immediate apply mode)
   */
  hasPendingChanges: boolean;
}

// =============================================================================
// Component Props
// =============================================================================

/**
 * FilterProvider props
 */
export interface FilterProviderProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Filter definitions
   */
  filters: FilterDefinition[];

  /**
   * Filter groups
   */
  groups?: FilterGroup[];

  /**
   * Controlled filter values
   */
  values?: Record<string, FilterValue>;

  /**
   * Default filter values (uncontrolled)
   */
  defaultValues?: Record<string, FilterValue>;

  /**
   * Callback when filter values change
   */
  onChange?: (values: Record<string, FilterValue>, changedFilterId: string) => void;

  /**
   * Callback when filters are applied (e.g., user clicks Apply button)
   */
  onApply?: (values: Record<string, FilterValue>) => void;

  /**
   * Callback when filters are cleared
   */
  onClear?: () => void;

  /**
   * Callback when filters are reset
   */
  onReset?: () => void;

  /**
   * Apply filters immediately on change
   * @default true
   */
  applyOnChange?: boolean;

  /**
   * Debounce delay for apply (ms)
   * @default 0
   */
  applyDebounceMs?: number;

  /**
   * Sync filter values with URL
   * @default false
   */
  syncWithUrl?: boolean;

  /**
   * URL parameter prefix
   * @default 'filter_'
   */
  urlParamPrefix?: string;

  /**
   * Size variant for all filters
   * @default 'md'
   */
  size?: ComponentSize;

  /**
   * Children components
   */
  children: ReactNode;
}

/**
 * ActiveFilters component props
 */
export interface ActiveFiltersProps extends BaseComponentProps {
  /**
   * Maximum number of chips to show before collapsing
   */
  maxVisible?: number;

  /**
   * Show "Clear All" button
   * @default true
   */
  showClearAll?: boolean;

  /**
   * Clear all button label
   * @default 'Clear all'
   */
  clearAllLabel?: string;

  /**
   * Empty state content
   */
  emptyContent?: ReactNode;

  /**
   * Chip variant
   * @default 'secondary'
   */
  chipVariant?: 'primary' | 'secondary' | 'neutral';

  /**
   * Chip size
   * @default 'sm'
   */
  chipSize?: 'sm' | 'md';

  /**
   * Custom render for filter chip
   */
  renderChip?: (filter: FilterDefinition, value: FilterValue, onRemove: () => void) => ReactNode;
}

/**
 * FilterSection props
 */
export interface FilterSectionProps extends BaseComponentProps {
  /**
   * Section ID (links to group)
   */
  id?: string;

  /**
   * Section title
   */
  title?: string;

  /**
   * Section description
   */
  description?: string;

  /**
   * Section icon
   */
  icon?: ReactNode;

  /**
   * Whether section is collapsible
   * @default true
   */
  collapsible?: boolean;

  /**
   * Default collapsed state
   * @default false
   */
  defaultCollapsed?: boolean;

  /**
   * Controlled collapsed state
   */
  collapsed?: boolean;

  /**
   * Callback when collapsed state changes
   */
  onCollapsedChange?: (collapsed: boolean) => void;

  /**
   * Show active filter count badge
   * @default true
   */
  showActiveCount?: boolean;

  /**
   * Section children (filter components)
   */
  children: ReactNode;
}

/**
 * FilterField props (unified wrapper)
 */
export interface FilterFieldProps extends BaseComponentProps {
  /**
   * Filter ID (references FilterDefinition)
   */
  filterId: string;

  /**
   * Override label
   */
  label?: string;

  /**
   * Override placeholder
   */
  placeholder?: string;

  /**
   * Show label
   * @default true
   */
  showLabel?: boolean;

  /**
   * Additional props to pass to underlying component
   */
  componentProps?: Record<string, unknown>;
}

// =============================================================================
// Layout Component Props
// =============================================================================

/**
 * Layout component base props
 */
export interface FilterLayoutProps extends BaseComponentProps {
  /**
   * Show active filters display
   * @default true
   */
  showActiveFilters?: boolean;

  /**
   * Active filters position
   * @default 'top'
   */
  activeFiltersPosition?: 'top' | 'bottom' | 'inline';

  /**
   * Show apply button (for non-immediate apply mode)
   */
  showApplyButton?: boolean;

  /**
   * Apply button label
   * @default 'Apply'
   */
  applyButtonLabel?: string;

  /**
   * Show clear button
   * @default true
   */
  showClearButton?: boolean;

  /**
   * Clear button label
   * @default 'Clear'
   */
  clearButtonLabel?: string;

  /**
   * Show reset button
   * @default false
   */
  showResetButton?: boolean;

  /**
   * Reset button label
   * @default 'Reset'
   */
  resetButtonLabel?: string;

  /**
   * Filter children
   */
  children: ReactNode;
}

/**
 * FilterSidebar props
 */
export interface FilterSidebarProps extends FilterLayoutProps {
  /**
   * Sidebar width when expanded
   * @default 280
   */
  width?: number;

  /**
   * Whether sidebar is collapsible
   * @default false
   */
  collapsible?: boolean;

  /**
   * Controlled collapsed state
   */
  collapsed?: boolean;

  /**
   * Default collapsed state
   * @default false
   */
  defaultCollapsed?: boolean;

  /**
   * Callback when collapsed state changes
   */
  onCollapsedChange?: (collapsed: boolean) => void;

  /**
   * Sidebar header content
   */
  header?: ReactNode;

  /**
   * Sidebar footer content
   */
  footer?: ReactNode;

  /**
   * Position of sidebar
   * @default 'left'
   */
  position?: 'left' | 'right';
}

/**
 * FilterBar props (horizontal inline filters)
 */
export interface FilterBarProps extends FilterLayoutProps {
  /**
   * Filter IDs to show in the bar (others go to "More" dropdown)
   */
  visibleFilters?: string[];

  /**
   * Show "More Filters" dropdown for overflow
   * @default true
   */
  showMoreFilters?: boolean;

  /**
   * "More Filters" label
   * @default 'More Filters'
   */
  moreFiltersLabel?: string;

  /**
   * Wrap filters on overflow
   * @default true
   */
  wrap?: boolean;

  /**
   * Gap between filters
   * @default 'md'
   */
  gap?: 'sm' | 'md' | 'lg';
}

/**
 * FilterPopover props
 */
export interface FilterPopoverProps extends FilterLayoutProps {
  /**
   * Trigger element/button
   */
  trigger?: ReactNode;

  /**
   * Trigger button label (if no custom trigger)
   * @default 'Filters'
   */
  triggerLabel?: string;

  /**
   * Show active count on trigger
   * @default true
   */
  showTriggerBadge?: boolean;

  /**
   * Popover position
   * @default 'bottom-start'
   */
  position?: PopoverPosition;

  /**
   * Popover width
   * @default 320
   */
  width?: number | string;

  /**
   * Maximum height
   */
  maxHeight?: number | string;

  /**
   * Controlled open state
   */
  isOpen?: boolean;

  /**
   * Default open state
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Close on apply
   * @default true
   */
  closeOnApply?: boolean;

  /**
   * Close on click outside
   * @default true
   */
  closeOnClickOutside?: boolean;
}

/**
 * FilterModal props
 */
export interface FilterModalProps extends FilterLayoutProps {
  /**
   * Modal title
   * @default 'Filters'
   */
  title?: string;

  /**
   * Modal size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';

  /**
   * Controlled open state
   */
  isOpen?: boolean;

  /**
   * Default open state
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Close on apply
   * @default true
   */
  closeOnApply?: boolean;

  /**
   * Show footer with action buttons
   * @default true
   */
  showFooter?: boolean;

  /**
   * Render function for trigger button
   */
  renderTrigger?: (props: { onClick: () => void; activeCount: number }) => ReactNode;
}

/**
 * FilterAccordion props
 */
export interface FilterAccordionProps extends Omit<FilterLayoutProps, 'children'> {
  /**
   * Filter children (optional - auto-generates from groups if not provided)
   */
  children?: ReactNode;
  /**
   * Accordion mode
   * @default 'multiple'
   */
  mode?: 'single' | 'multiple';

  /**
   * Default expanded groups
   */
  defaultExpandedGroups?: string[];

  /**
   * Controlled expanded groups
   */
  expandedGroups?: string[];

  /**
   * Callback when expanded groups change
   */
  onExpandedGroupsChange?: (groups: string[]) => void;

  /**
   * Show group active counts
   * @default true
   */
  showGroupCounts?: boolean;
}

