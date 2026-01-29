import type { ReactNode, MouseEvent } from 'react';
import type { BaseComponentProps, ComponentSize } from '../../../types';

// ============================================================
// Column Configuration
// ============================================================

export type ColumnAlign = 'left' | 'center' | 'right';
export type SortDirection = 'asc' | 'desc' | null;

export interface ColumnConfig<T = Record<string, unknown>> {
  /**
   * Data key to access row data (supports dot notation for nested properties)
   */
  key: keyof T | string;

  /**
   * Header content - string or ReactNode
   */
  header: ReactNode;

  /**
   * Column width using CSS grid template value
   * @example 'auto', '1fr', '320px', 'minmax(100px, 1fr)'
   * @default 'auto'
   */
  width?: string;

  /**
   * Content alignment
   * @default auto-detected based on data type (numbers right, text left)
   */
  align?: ColumnAlign;

  /**
   * Whether column is sortable
   * @default false
   */
  sortable?: boolean;

  /**
   * Custom render function for cell content
   */
  render?: (value: unknown, row: T, rowIndex: number) => ReactNode;

  /**
   * Whether column is sticky (for horizontal scrolling)
   * @default false
   */
  sticky?: boolean;

  /**
   * Custom sort comparison function
   */
  sortFn?: (a: T, b: T, direction: 'asc' | 'desc') => number;
}

// ============================================================
// Sorting
// ============================================================

export interface SortState {
  column: string | null;
  direction: SortDirection;
}

// ============================================================
// Selection
// ============================================================

export type SelectionMode = 'none' | 'single' | 'multiple';

// ============================================================
// Pagination
// ============================================================

export interface TablePaginationConfig {
  /**
   * Number of items per page
   */
  pageSize: number;

  /**
   * Current page number (1-indexed)
   */
  currentPage: number;

  /**
   * Total number of items
   */
  totalItems: number;

  /**
   * Callback when page changes
   */
  onPageChange: (page: number) => void;

  /**
   * Available page size options for the select dropdown
   * If provided, shows a page size selector
   * @example [10, 25, 50, 100]
   */
  pageSizeOptions?: number[];

  /**
   * Callback when page size changes
   */
  onPageSizeChange?: (pageSize: number) => void;
}

// ============================================================
// Infinite Scroll
// ============================================================

export interface TableInfiniteScrollConfig {
  /**
   * Callback to load more data
   */
  onLoadMore: () => void;

  /**
   * Whether there is more data to load
   */
  hasMore: boolean;

  /**
   * Whether currently loading more data
   * @default false
   */
  loading?: boolean;

  /**
   * Intersection observer threshold (0-1)
   * @default 0.1
   */
  threshold?: number;
}

// ============================================================
// Skeleton Configuration
// ============================================================

export interface TableSkeletonConfig {
  /**
   * Number of skeleton rows to display
   * @default 5
   */
  rows?: number;

  /**
   * Whether to show skeleton state
   * @default false
   */
  enabled?: boolean;
}

// ============================================================
// Table Props
// ============================================================

export interface TableProps<T extends Record<string, unknown> = Record<string, unknown>>
  extends Omit<BaseComponentProps, 'children'> {
  /**
   * Table data array
   */
  data: T[];

  /**
   * Column configurations
   * If not provided, columns are auto-generated from data keys
   */
  columns?: Array<ColumnConfig<T>>;

  /**
   * Unique key for each row
   * @default 'id'
   */
  rowKey?: keyof T | ((row: T, index: number) => string);

  // ---- Sizing & Variants ----

  /**
   * Table size variant
   * @default 'md'
   */
  size?: ComponentSize;

  /**
   * Table visual variant
   * @default 'default'
   */
  variant?: 'default' | 'striped' | 'bordered';

  // ---- Sorting ----

  /**
   * Current sort state (controlled)
   */
  sort?: SortState;

  /**
   * Default sort state (uncontrolled)
   */
  defaultSort?: SortState;

  /**
   * Callback when sort changes
   */
  onSortChange?: (sort: SortState) => void;

  // ---- Selection ----

  /**
   * Selection mode
   * @default 'none'
   */
  selectionMode?: SelectionMode;

  /**
   * Selected row keys (controlled)
   */
  selectedKeys?: string[];

  /**
   * Default selected keys (uncontrolled)
   */
  defaultSelectedKeys?: string[];

  /**
   * Callback when selection changes
   */
  onSelectionChange?: (selectedKeys: string[]) => void;

  /**
   * Whether to show selection controls (checkbox/radio)
   * When false, rows can still be selected by clicking but no visual control is shown
   * @default true
   */
  showSelectionControls?: boolean;

  /**
   * Callback when row is clicked
   */
  onRowClick?: (row: T, index: number, event: MouseEvent) => void;

  // ---- Expandable Rows ----

  /**
   * Render function for expandable content
   * If provided, rows become expandable
   */
  expandedRowRender?: (row: T, index: number) => ReactNode;

  /**
   * Expanded row keys (controlled)
   */
  expandedKeys?: string[];

  /**
   * Default expanded keys (uncontrolled)
   */
  defaultExpandedKeys?: string[];

  /**
   * Callback when expand state changes
   */
  onExpandChange?: (expandedKeys: string[]) => void;

  // ---- Pagination ----

  /**
   * Pagination configuration
   */
  pagination?: TablePaginationConfig;

  // ---- Infinite Scroll ----

  /**
   * Infinite scroll configuration (mutually exclusive with pagination)
   */
  infiniteScroll?: TableInfiniteScrollConfig;

  // ---- Search/Filter ----

  /**
   * Enable built-in search
   * @default false
   */
  searchable?: boolean;

  /**
   * Search placeholder text
   * @default 'Search...'
   */
  searchPlaceholder?: string;

  /**
   * Fields to search (for default search behavior).
   * If not provided, searches all column keys.
   */
  searchFields?: Array<keyof T>;

  /**
   * Custom search function
   */
  searchFn?: (item: T, query: string) => boolean;

  /**
   * Search query (controlled)
   */
  searchQuery?: string;

  /**
   * Callback when search changes
   */
  onSearchChange?: (query: string) => void;

  /**
   * Debounce delay for search in milliseconds
   * @default 300
   */
  searchDebounce?: number;

  // ---- Responsive ----

  /**
   * Enable sticky header
   * @default false
   */
  stickyHeader?: boolean;

  /**
   * Enable sticky first column
   * @default false
   */
  stickyFirstColumn?: boolean;

  /**
   * Maximum height for scrollable table
   */
  maxHeight?: string | number;

  // ---- Empty & Loading States ----

  /**
   * Empty state content
   * @default 'No data available'
   */
  emptyContent?: ReactNode;

  /**
   * Loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Loading indicator content
   */
  loadingContent?: ReactNode;

  /**
   * Skeleton loader configuration
   * Shows skeleton rows instead of a spinner when loading
   */
  skeleton?: TableSkeletonConfig;

  // ---- Accessibility ----

  /**
   * Caption for the table
   */
  caption?: string;

  /**
   * Whether caption is visually hidden
   * @default false
   */
  captionHidden?: boolean;
}

// ============================================================
// Context Value
// ============================================================

export interface TableContextValue<T = Record<string, unknown>> {
  // Data
  data: T[];
  columns: Array<ColumnConfig<T>>;
  getRowKey: (row: T, index: number) => string;

  // Size & Variant
  size: ComponentSize;
  variant: 'default' | 'striped' | 'bordered';

  // Sort
  sort: SortState;
  onSort: (column: string) => void;

  // Selection
  selectionMode: SelectionMode;
  selectedKeys: Set<string>;
  onSelectRow: (key: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  showSelectionControls: boolean;

  // Expand
  expandedKeys: Set<string>;
  onExpand: (key: string, expanded: boolean) => void;
  hasExpandableRows: boolean;
  expandedRowRender?: (row: T, index: number) => ReactNode;

  // Row click
  onRowClick?: (row: T, index: number, event: MouseEvent) => void;

  // Responsive
  stickyHeader: boolean;
  stickyFirstColumn: boolean;
}
