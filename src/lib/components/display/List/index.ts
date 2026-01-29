// Main component
export { List, default } from './List';

// Sub-components
export { ListItem } from './ListItem';
export { ListHeader } from './ListHeader';
export { ListGroup } from './ListGroup';
export { ListSearch } from './ListSearch';
export { ListSkeleton } from './ListSkeleton';
export { ListEmpty } from './ListEmpty';

// Context
export { ListContext, useListContext, useListContextStrict } from './ListContext';

// Hooks
export {
  useListSelection,
  useListExpand,
  useListFilter,
  useListKeyboardNav,
  useListGroups,
} from './hooks';

// Types
export type {
  // Main props
  ListProps,
  ListItemRenderContext,
  ListContextValue,

  // Selection
  SelectionMode,
  SelectionState,

  // Actions
  BulkAction,
  ItemAction,

  // Infinite scroll
  ListInfiniteScrollConfig,

  // Skeleton
  ListSkeletonConfig,

  // Responsive
  ResponsiveColumns,

  // Hook types
  UseListSelectionOptions,
  UseListSelectionReturn,
  UseListExpandOptions,
  UseListExpandReturn,
  UseListFilterOptions,
  UseListFilterReturn,
  UseListKeyboardNavOptions,
  UseListKeyboardNavReturn,
  UseListGroupsOptions,
  UseListGroupsReturn,
  ListGroup as ListGroupType,
} from './types';

// Utilities
export {
  getNestedValue,
  formatValue,
  generateItemKey,
  searchItems,
  groupItems,
  sortItems,
} from './utils';
