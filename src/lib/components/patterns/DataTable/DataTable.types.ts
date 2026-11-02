/**
 * DataTable pattern types - Table + Filters + Search, preconfigured
 */

import type { ReactNode, MouseEvent } from 'react';
import type { BaseComponentProps, ComponentSize } from '../../../types';
import type {
  ColumnConfig,
  SortState,
  SelectionMode,
  TablePaginationConfig,
  TableInfiniteScrollConfig,
  TableSkeletonConfig,
} from '../../display/Table';
import type { FilterDefinition, FilterGroup, FilterValue } from '../../filters';

/**
 * How filter controls are presented alongside the table.
 */
export type DataTableFilterLayout = 'none' | 'bar' | 'popover' | 'modal' | 'sidebar' | 'accordion';

/**
 * Column configuration with an opt-in `filterable` shorthand for deriving a filter.
 */
export interface DataTableColumnConfig<T = Record<string, unknown>> extends ColumnConfig<T> {
  /**
   * Enables filtering on this column and derives a `FilterDefinition` for it.
   * Pass `true` to fully auto-derive the filter (type inferred from the column's
   * data - booleans become `toggle`, dates become `date-range`, numbers become
   * `number-range` with min/max computed from the data, low-cardinality strings
   * become `select` with options computed from unique values, everything else
   * becomes a `text` contains-search). Pass a partial `FilterDefinition` to
   * override any part of the derived filter (e.g. `{ type: 'select', options }`).
   * The filter `id` always matches the column's `key`.
   */
  filterable?: true | Omit<Partial<FilterDefinition>, 'id'>;
}

/**
 * Combined search + filters + sort + pagination state, reported via `onQueryChange`.
 * Intended for `mode="server"`, where you use it to refetch `data`.
 */
export interface DataTableQuery {
  search: string;
  filters: Record<string, FilterValue>;
  sort: SortState;
  page: number;
  pageSize: number;
}

export interface DataTableProps<T extends Record<string, unknown> = Record<string, unknown>>
  extends Omit<BaseComponentProps, 'children'> {
  /**
   * Table data. In `mode="server"` this should already reflect the currently
   * applied search/filters/sort/page.
   */
  data: T[];

  /**
   * Column configuration. Required for filter auto-derivation via `filterable`;
   * omit to fall back to `Table`'s own auto-generated columns (filtering will
   * then only use the explicit `filters` prop, if provided).
   */
  columns?: Array<DataTableColumnConfig<T>>;

  /**
   * Unique key for each row.
   * @default 'id'
   */
  rowKey?: keyof T | ((row: T, index: number) => string);

  /**
   * Size applied to both the table and all filter controls.
   * @default 'md'
   */
  size?: ComponentSize;

  /**
   * Table visual variant.
   * @default 'default'
   */
  variant?: 'default' | 'striped' | 'bordered';

  // ---- Filtering ----

  /**
   * Explicit filter definitions. Takes precedence over any `filterable`
   * columns - use this when auto-derivation doesn't fit.
   */
  filters?: FilterDefinition[];

  /**
   * Filter groups, used by the `accordion` layout to organize filters into
   * collapsible sections.
   */
  filterGroups?: FilterGroup[];

  /**
   * Controlled filter values.
   */
  filterValues?: Record<string, FilterValue>;

  /**
   * Default filter values (uncontrolled).
   */
  defaultFilterValues?: Record<string, FilterValue>;

  /**
   * Callback whenever any filter value changes.
   */
  onFilterChange?: (values: Record<string, FilterValue>) => void;

  /**
   * How filter controls are presented. The search box always renders in its own
   * row, separate from filter controls, regardless of this setting.
   * - `popover`: a single trigger button that opens a filter panel, with active
   *   filters shown as chips next to it - nothing but the trigger and current
   *   filters is visible until you click in
   * - `modal`: a trigger button that opens a full filter dialog
   * - `sidebar`: a persistent side panel next to the table
   * - `accordion`: filters grouped into collapsible sections above the table
   * - `bar`: every filter's input rendered inline, with an overflow "More Filters" dropdown
   * - `none`: filter values can still be provided/controlled, but no filter UI is rendered
   * @default 'popover'
   */
  filterLayout?: DataTableFilterLayout;

  /**
   * Escape hatch: additional props forwarded to the underlying layout
   * component - `FilterBarProps`, `FilterPopoverProps`, `FilterModalProps`,
   * `FilterSidebarProps`, or `FilterAccordionProps`, depending on `filterLayout`.
   */
  filterLayoutProps?: Record<string, unknown>;

  /**
   * Show removable chips for currently active filters.
   * @default true
   */
  showActiveFilters?: boolean;

  /**
   * Sync filter values with the URL query string.
   * @default false
   */
  syncFiltersWithUrl?: boolean;

  // ---- Search ----

  /**
   * Enable the search box.
   * @default false
   */
  searchable?: boolean;

  /**
   * @default 'Search...'
   */
  searchPlaceholder?: string;

  /**
   * Fields to search. If not provided, searches all column keys.
   */
  searchFields?: Array<keyof T>;

  /**
   * Custom search predicate, overriding the default "contains" match.
   */
  searchFn?: (item: T, query: string) => boolean;

  /**
   * Search query (controlled).
   */
  searchQuery?: string;

  /**
   * Callback when the search query changes.
   */
  onSearchChange?: (query: string) => void;

  /**
   * Debounce delay for search, in milliseconds.
   * @default 300
   */
  searchDebounce?: number;

  // ---- Query mode ----

  /**
   * `client` filters/searches `data` in the browser. `server` assumes `data`
   * is already filtered/searched/sorted/paged, and instead reports the
   * combined query via `onQueryChange` so you can refetch. In `server` mode,
   * control `sort` and `searchQuery` yourself so the reported query stays
   * accurate.
   * @default 'client'
   */
  mode?: 'client' | 'server';

  /**
   * Fires whenever search, filters, sort, or page change - most useful in
   * `mode="server"` to trigger a refetch.
   */
  onQueryChange?: (query: DataTableQuery) => void;

  // ---- Sorting ----

  sort?: SortState;
  defaultSort?: SortState;
  onSortChange?: (sort: SortState) => void;

  // ---- Selection ----

  selectionMode?: SelectionMode;
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  onSelectionChange?: (selectedKeys: string[]) => void;
  showSelectionControls?: boolean;
  onRowClick?: (row: T, index: number, event: MouseEvent) => void;

  // ---- Expandable rows ----

  expandedRowRender?: (row: T, index: number) => ReactNode;
  expandedKeys?: string[];
  defaultExpandedKeys?: string[];
  onExpandChange?: (expandedKeys: string[]) => void;

  // ---- Pagination ----

  pagination?: TablePaginationConfig;

  // ---- Infinite scroll ----

  infiniteScroll?: TableInfiniteScrollConfig;

  // ---- Responsive ----

  stickyHeader?: boolean;
  stickyFirstColumn?: boolean;
  maxHeight?: string | number;

  // ---- Empty & loading states ----

  emptyContent?: ReactNode;
  loading?: boolean;
  loadingContent?: ReactNode;
  skeleton?: TableSkeletonConfig;

  // ---- Accessibility ----

  caption?: string;
  captionHidden?: boolean;
}
