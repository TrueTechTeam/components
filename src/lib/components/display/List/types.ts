import type { ReactNode, MouseEvent, KeyboardEvent } from 'react';
import type { BaseComponentProps, ComponentSize } from '../../../types';

// ============================================================
// Selection Types
// ============================================================

export type SelectionMode = 'none' | 'single' | 'multiple';

export interface SelectionState {
  selectedKeys: Set<string>;
  isAllSelected: boolean;
  isIndeterminate: boolean;
}

// ============================================================
// Infinite Scroll
// ============================================================

export interface ListInfiniteScrollConfig {
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

  /**
   * Root margin for intersection observer
   * @default '100px'
   */
  rootMargin?: string;
}

// ============================================================
// Bulk Actions
// ============================================================

export interface BulkAction<T = Record<string, unknown>> {
  /**
   * Unique identifier for the action
   */
  id: string;

  /**
   * Label displayed in the action button/menu
   */
  label: ReactNode;

  /**
   * Icon to display (optional)
   */
  icon?: ReactNode;

  /**
   * Action handler - receives selected items
   */
  onAction: (selectedItems: T[], selectedKeys: string[]) => void;

  /**
   * Whether action is disabled
   */
  disabled?: boolean | ((selectedItems: T[]) => boolean);

  /**
   * Variant for styling (affects button appearance)
   * @default 'default'
   */
  variant?: 'default' | 'danger' | 'primary';
}

// ============================================================
// Item Actions
// ============================================================

export interface ItemAction<T = Record<string, unknown>> {
  /**
   * Unique identifier for the action
   */
  id: string;

  /**
   * Label displayed in the action menu
   */
  label: ReactNode;

  /**
   * Icon to display (optional)
   */
  icon?: ReactNode;

  /**
   * Action handler - receives the item and its index
   */
  onAction: (item: T, index: number) => void;

  /**
   * Whether action is disabled
   */
  disabled?: boolean | ((item: T) => boolean);

  /**
   * Variant for styling
   * @default 'default'
   */
  variant?: 'default' | 'danger';

  /**
   * Show divider before this action
   * @default false
   */
  divider?: boolean;
}

// ============================================================
// Skeleton Configuration
// ============================================================

export interface ListSkeletonConfig {
  /**
   * Enable skeleton loading state
   * @default false
   */
  enabled?: boolean;

  /**
   * Number of skeleton rows to display
   * @default 5
   */
  rows?: number;
}

// ============================================================
// List Item Render Context
// ============================================================

export interface ListItemRenderContext {
  /**
   * Whether item is currently selected
   */
  isSelected: boolean;

  /**
   * Whether item is disabled
   */
  isDisabled: boolean;

  /**
   * Whether item has keyboard focus
   */
  isFocused: boolean;

  /**
   * Whether item is expanded
   */
  isExpanded: boolean;

  /**
   * Toggle selection for this item
   */
  toggleSelection: () => void;

  /**
   * Toggle expansion for this item
   */
  toggleExpand: () => void;

  /**
   * The item's unique key
   */
  itemKey: string;
}

// ============================================================
// Responsive Columns
// ============================================================

export interface ResponsiveColumns {
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

// ============================================================
// Main List Props
// ============================================================

export interface ListProps<T extends Record<string, unknown> = Record<string, unknown>>
  extends Omit<BaseComponentProps, 'children'> {
  // ---- Data ----

  /**
   * Array of items to display
   */
  data: T[];

  /**
   * Unique key for each item. Can be a key from the item object or a function.
   * @default 'id'
   */
  itemKey?: keyof T | ((item: T, index: number) => string);

  /**
   * Function to determine if an item is disabled
   */
  isItemDisabled?: (item: T, index: number) => boolean;

  // ---- Rendering ----

  /**
   * Custom render function for each item.
   * If not provided, uses default rendering based on primaryTextField/secondaryTextField.
   */
  renderItem?: (item: T, index: number, context: ListItemRenderContext) => ReactNode;

  /**
   * Key from item to use as primary text (for default rendering)
   */
  primaryTextField?: keyof T;

  /**
   * Key from item to use as secondary text (for default rendering)
   */
  secondaryTextField?: keyof T;

  /**
   * Key from item to use for avatar/icon (for default rendering)
   */
  avatarField?: keyof T;

  // ---- Sizing & Variants ----

  /**
   * List size variant
   * @default 'md'
   */
  size?: ComponentSize;

  /**
   * Visual variant
   * @default 'default'
   */
  variant?: 'default' | 'bordered' | 'card' | 'flush';

  /**
   * Spacing between items
   * @default 'md'
   */
  spacing?: 'none' | 'sm' | 'md' | 'lg';

  // ---- Selection ----

  /**
   * Selection mode
   * @default 'none'
   */
  selectionMode?: SelectionMode;

  /**
   * Selected item keys (controlled)
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
   * @default true when selectionMode !== 'none'
   */
  showSelectionControls?: boolean;

  /**
   * Position of selection controls
   * @default 'start'
   */
  selectionControlPosition?: 'start' | 'end';

  // ---- Bulk Actions ----

  /**
   * Bulk actions configuration.
   * Only shown when selectionMode is 'multiple' and items are selected.
   */
  bulkActions?: Array<BulkAction<T>>;

  /**
   * Position of bulk actions bar
   * @default 'top'
   */
  bulkActionsPosition?: 'top' | 'bottom' | 'sticky-top' | 'sticky-bottom';

  /**
   * Custom render for bulk actions bar
   */
  renderBulkActions?: (
    selectedItems: T[],
    selectedKeys: string[],
    actions: Array<BulkAction<T>>
  ) => ReactNode;

  // ---- Item Actions ----

  /**
   * Actions available per item (shown in dropdown menu)
   */
  itemActions?: Array<ItemAction<T>>;

  /**
   * Position of item action button
   * @default 'end'
   */
  itemActionsPosition?: 'start' | 'end';

  /**
   * When to show item actions
   * @default 'hover'
   */
  itemActionsTrigger?: 'hover' | 'always';

  // ---- Grouping ----

  /**
   * Group items by a field or custom function
   */
  groupBy?: keyof T | ((item: T) => string);

  /**
   * Custom group header renderer
   */
  renderGroupHeader?: (groupKey: string, itemCount: number, isCollapsed: boolean) => ReactNode;

  /**
   * Whether groups are collapsible
   * @default false
   */
  collapsibleGroups?: boolean;

  /**
   * Default collapsed group keys (uncontrolled)
   */
  defaultCollapsedGroups?: string[];

  /**
   * Collapsed group keys (controlled)
   */
  collapsedGroups?: string[];

  /**
   * Callback when group collapse state changes
   */
  onCollapsedGroupsChange?: (collapsedGroups: string[]) => void;

  // ---- Expandable Items ----

  /**
   * Render function for expanded item content
   */
  renderExpandedContent?: (item: T, index: number) => ReactNode;

  /**
   * Expanded item keys (controlled)
   */
  expandedKeys?: string[];

  /**
   * Default expanded item keys (uncontrolled)
   */
  defaultExpandedKeys?: string[];

  /**
   * Callback when expansion changes
   */
  onExpandChange?: (expandedKeys: string[]) => void;

  /**
   * How to trigger expansion
   * @default 'icon'
   */
  expandTrigger?: 'click' | 'icon';

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
   * Fields to search (for default search behavior)
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

  // ---- Infinite Scroll ----

  /**
   * Infinite scroll configuration
   */
  infiniteScroll?: ListInfiniteScrollConfig;

  // ---- Interaction ----

  /**
   * Callback when item is clicked
   */
  onItemClick?: (item: T, index: number, event: MouseEvent) => void;

  /**
   * Callback when item receives keyboard action (Enter/Space)
   */
  onItemAction?: (item: T, index: number, event: KeyboardEvent) => void;

  /**
   * Enable keyboard navigation
   * @default true
   */
  keyboardNavigation?: boolean;

  // ---- Loading & Empty States ----

  /**
   * Loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Custom loading content
   */
  loadingContent?: ReactNode;

  /**
   * Skeleton configuration
   */
  skeleton?: ListSkeletonConfig;

  /**
   * Empty state content
   * @default 'No items to display'
   */
  emptyContent?: ReactNode;

  /**
   * Custom empty state render
   */
  renderEmpty?: () => ReactNode;

  // ---- Responsive ----

  /**
   * Maximum height (enables scrolling)
   */
  maxHeight?: string | number;

  /**
   * Number of columns for responsive grid layout
   * @default 1
   */
  columns?: number | ResponsiveColumns;

  // ---- Accessibility ----

  /**
   * ARIA role for the list
   * @default 'list' or 'listbox' when selectable
   */
  role?: 'list' | 'listbox' | 'menu' | 'grid';

  /**
   * ID of element that labels this list
   */
  'aria-labelledby'?: string;
}

// ============================================================
// Context Value
// ============================================================

export interface ListContextValue<T = Record<string, unknown>> {
  // Data
  data: T[];
  filteredData: T[];
  getItemKey: (item: T, index: number) => string;
  isItemDisabled: (item: T, index: number) => boolean;

  // Size & Variant
  size: ComponentSize;
  variant: 'default' | 'bordered' | 'card' | 'flush';
  spacing: 'none' | 'sm' | 'md' | 'lg';

  // Selection
  selectionMode: SelectionMode;
  selectedKeys: Set<string>;
  onSelectItem: (key: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  showSelectionControls: boolean;
  selectionControlPosition: 'start' | 'end';

  // Expansion
  expandedKeys: Set<string>;
  onExpandItem: (key: string) => void;
  renderExpandedContent?: (item: T, index: number) => ReactNode;
  expandTrigger: 'click' | 'icon';

  // Item Actions
  itemActions?: Array<ItemAction<T>>;
  itemActionsPosition: 'start' | 'end';
  itemActionsTrigger: 'hover' | 'always';

  // Keyboard navigation
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;

  // Interaction
  onItemClick?: (item: T, index: number, event: MouseEvent) => void;
  onItemAction?: (item: T, index: number, event: KeyboardEvent) => void;

  // Rendering
  renderItem?: (item: T, index: number, context: ListItemRenderContext) => ReactNode;
  primaryTextField?: keyof T;
  secondaryTextField?: keyof T;
  avatarField?: keyof T;

  // Grouping
  groupBy?: keyof T | ((item: T) => string);
  collapsedGroups: Set<string>;
  onToggleGroup: (groupKey: string) => void;
  collapsibleGroups: boolean;
  renderGroupHeader?: (groupKey: string, itemCount: number, isCollapsed: boolean) => ReactNode;

  // List ID for accessibility
  listId: string;
}

// ============================================================
// Hook Return Types
// ============================================================

export interface UseListSelectionOptions {
  selectionMode: SelectionMode;
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
  allItemKeys: string[];
}

export interface UseListSelectionReturn {
  selectedKeys: Set<string>;
  onSelectItem: (key: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
}

export interface UseListExpandOptions {
  expandedKeys?: string[];
  defaultExpandedKeys?: string[];
  onExpandChange?: (keys: string[]) => void;
}

export interface UseListExpandReturn {
  expandedKeys: Set<string>;
  onExpandItem: (key: string) => void;
  isExpanded: (key: string) => boolean;
}

export interface UseListFilterOptions<T> {
  data: T[];
  searchQuery?: string;
  defaultSearchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchFields?: Array<keyof T>;
  searchFn?: (item: T, query: string) => boolean;
  debounceMs?: number;
}

export interface UseListFilterReturn<T> {
  filteredData: T[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isFiltering: boolean;
}

export interface UseListKeyboardNavOptions {
  itemCount: number;
  onItemAction?: (index: number) => void;
  onEscape?: () => void;
  loop?: boolean;
  orientation?: 'vertical' | 'horizontal' | 'grid';
  columns?: number;
  disabled?: boolean;
}

export interface UseListKeyboardNavReturn {
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  handleKeyDown: (event: KeyboardEvent) => void;
  getItemTabIndex: (index: number) => 0 | -1;
}

export interface UseListGroupsOptions<T> {
  data: T[];
  groupBy?: keyof T | ((item: T) => string);
  collapsedGroups?: string[];
  defaultCollapsedGroups?: string[];
  onCollapsedGroupsChange?: (collapsedGroups: string[]) => void;
}

export interface ListGroup<T> {
  key: string;
  items: T[];
}

export interface UseListGroupsReturn<T> {
  groups: Array<ListGroup<T>>;
  collapsedGroups: Set<string>;
  onToggleGroup: (groupKey: string) => void;
  isGroupCollapsed: (groupKey: string) => boolean;
}
