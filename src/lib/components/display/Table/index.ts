// Main component
export { Table, default } from './Table';

// Sub-components (for advanced usage)
export { TableHeader } from './TableHeader';
export { TableBody } from './TableBody';
export { TableRow } from './TableRow';
export { TableCell } from './TableCell';
export { TableSkeleton } from './TableSkeleton';
export { TableSearch } from './TableSearch';
export type { TableSearchProps } from './TableSearch';

// Context
export { TableContext, useTableContext, useTableContextStrict } from './TableContext';

// Types
export type {
  TableProps,
  TableContextValue,
  ColumnConfig,
  ColumnAlign,
  SortState,
  SortDirection,
  SelectionMode,
  TablePaginationConfig,
  TableInfiniteScrollConfig,
  TableSkeletonConfig,
} from './types';

// Utilities
export { autoGenerateColumns, getCellValue, sortData, formatCellValue } from './utils';

// Hooks (for custom implementations)
export {
  useTableSelection,
  useTableSort,
  useTableExpand,
  useInfiniteScroll,
  useTableFilter,
} from './hooks';
export type {
  UseTableSelectionOptions,
  UseTableSelectionReturn,
  UseTableSortOptions,
  UseTableSortReturn,
  UseTableExpandOptions,
  UseTableExpandReturn,
  UseInfiniteScrollOptions,
  UseInfiniteScrollReturn,
  UseTableFilterOptions,
  UseTableFilterReturn,
} from './hooks';
