import React, { forwardRef, useMemo } from 'react';
import type { TableProps, ColumnConfig, TableContextValue } from './types';
import { TableContext } from './TableContext';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import { TableSkeleton } from './TableSkeleton';
import { Pagination } from '../../navigation/Pagination';
import { Select } from '../../inputs/Select';
import { Spinner } from '../Spinner';
import { useTableSelection } from './hooks/useTableSelection';
import { useTableSort } from './hooks/useTableSort';
import { useTableExpand } from './hooks/useTableExpand';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import { useTableFilter } from './hooks/useTableFilter';
import { TableSearch } from './TableSearch';
import { autoGenerateColumns, sortData, calculateColumnWidths } from './utils';
import styles from './Table.module.scss';

// Generic component with forwardRef
function TableInner<T extends Record<string, unknown>>(
  {
    data,
    columns: columnsProp,
    rowKey = 'id' as keyof T,
    size = 'md',
    variant = 'default',
    // Sorting
    sort: controlledSort,
    defaultSort,
    onSortChange,
    // Selection
    selectionMode = 'none',
    selectedKeys: controlledSelectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    showSelectionControls = true,
    onRowClick,
    // Expand
    expandedRowRender,
    expandedKeys: controlledExpandedKeys,
    defaultExpandedKeys,
    onExpandChange,
    // Pagination
    pagination,
    // Infinite scroll
    infiniteScroll,
    // Search/Filter
    searchable = false,
    searchPlaceholder = 'Search...',
    searchFields,
    searchFn,
    searchQuery: controlledSearchQuery,
    onSearchChange,
    searchDebounce = 300,
    // Responsive
    stickyHeader = false,
    stickyFirstColumn = false,
    maxHeight,
    // Empty & Loading
    emptyContent = 'No data available',
    loading = false,
    loadingContent,
    skeleton,
    // Accessibility
    caption,
    captionHidden = false,
    // Base props
    className,
    style,
    'data-testid': testId,
    'aria-label': ariaLabel,
    ...restProps
  }: TableProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  // Generate or use provided columns
  const columns = useMemo<Array<ColumnConfig<T>>>(
    () => columnsProp || autoGenerateColumns(data),
    [columnsProp, data]
  );

  // Row key getter
  const getRowKey = useMemo(() => {
    if (typeof rowKey === 'function') {
      return rowKey;
    }
    return (row: T, index: number) => String(row[rowKey] ?? index);
  }, [rowKey]);

  // Search/Filter hook
  const { filteredData, searchQuery, setSearchQuery, isFiltering } = useTableFilter({
    data,
    columns,
    searchQuery: controlledSearchQuery,
    onSearchChange,
    searchFields,
    searchFn,
    debounceMs: searchDebounce,
  });

  // All row keys for selection (use filtered data)
  const allRowKeys = useMemo(
    () => filteredData.map((row, index) => getRowKey(row, index)),
    [filteredData, getRowKey]
  );

  // Hooks
  const { sort, onSort } = useTableSort({
    sort: controlledSort,
    defaultSort,
    onSortChange,
  });

  const { selectedKeys, onSelectRow, onSelectAll, isAllSelected, isIndeterminate } =
    useTableSelection({
      selectionMode,
      selectedKeys: controlledSelectedKeys,
      defaultSelectedKeys,
      onSelectionChange,
      allRowKeys,
    });

  const { expandedKeys, onExpand } = useTableExpand({
    expandedKeys: controlledExpandedKeys,
    defaultExpandedKeys,
    onExpandChange,
  });

  // Infinite scroll
  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: infiniteScroll?.onLoadMore || (() => {}),
    hasMore: infiniteScroll?.hasMore || false,
    loading: infiniteScroll?.loading,
    threshold: infiniteScroll?.threshold,
  });

  // Sort data (client-side sorting) - uses filtered data
  const sortedData = useMemo(
    () => (sort.column ? sortData(filteredData, sort, columns) : filteredData),
    [filteredData, sort, columns]
  );

  // Grid template columns - applies column width rules:
  // 1. All columns must have min width > 0
  // 2. Only one column can have dynamic width (1fr)
  // 3. Uses average data size to calculate width when not specified
  const gridTemplateColumns = useMemo(() => {
    const parts: string[] = [];

    // Expand column
    if (expandedRowRender) {
      parts.push('40px');
    }

    // Selection column (only if showing controls)
    if (selectionMode !== 'none' && showSelectionControls) {
      parts.push('40px');
    }

    // Calculate data column widths using the utility
    const columnWidths = calculateColumnWidths(columns, data);
    parts.push(...columnWidths);

    return parts.join(' ');
  }, [columns, data, expandedRowRender, selectionMode, showSelectionControls]);

  // Context value
  const contextValue = useMemo<TableContextValue<T>>(
    () => ({
      data: sortedData,
      columns,
      getRowKey,
      size,
      variant,
      sort,
      onSort,
      selectionMode,
      selectedKeys,
      onSelectRow,
      onSelectAll,
      isAllSelected,
      isIndeterminate,
      showSelectionControls,
      expandedKeys,
      onExpand,
      hasExpandableRows: !!expandedRowRender,
      expandedRowRender,
      onRowClick,
      stickyHeader,
      stickyFirstColumn,
    }),
    [
      sortedData,
      columns,
      getRowKey,
      size,
      variant,
      sort,
      onSort,
      selectionMode,
      selectedKeys,
      onSelectRow,
      onSelectAll,
      isAllSelected,
      isIndeterminate,
      showSelectionControls,
      expandedKeys,
      onExpand,
      expandedRowRender,
      onRowClick,
      stickyHeader,
      stickyFirstColumn,
    ]
  );

  const tableClasses = [styles.tableContainer, className].filter(Boolean).join(' ');

  const tableStyle = {
    '--table-grid-template-columns': gridTemplateColumns,
    '--table-max-height': typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
    ...style,
  } as React.CSSProperties;

  const totalPages = pagination ? Math.ceil(pagination.totalItems / pagination.pageSize) : 0;

  return (
    <div className={tableClasses} style={tableStyle}>
      {/* Search bar */}
      {searchable && (
        <TableSearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={searchPlaceholder}
          isFiltering={isFiltering}
        />
      )}

      <div
        ref={ref}
        className={styles.table}
        data-component="table"
        data-size={size}
        data-variant={variant}
        data-sticky-header={stickyHeader || undefined}
        data-sticky-first-column={stickyFirstColumn || undefined}
        data-loading={loading || undefined}
        data-testid={testId || 'table'}
        aria-label={ariaLabel}
        role="table"
        {...restProps}
      >
        {caption && (
          <div className={styles.caption} data-hidden={captionHidden || undefined}>
            {caption}
          </div>
        )}

        <TableContext.Provider value={contextValue as TableContextValue}>
          <TableHeader />

          {skeleton?.enabled ? (
            <TableSkeleton
              rows={skeleton.rows ?? 5}
              columns={columns}
              hasExpandColumn={!!expandedRowRender}
              hasSelectionColumn={selectionMode !== 'none' && showSelectionControls}
            />
          ) : loading && !sortedData.length ? (
            <div className={styles.loadingState}>{loadingContent || <Spinner size="md" />}</div>
          ) : sortedData.length === 0 ? (
            <div className={styles.emptyState}>{emptyContent}</div>
          ) : (
            <TableBody />
          )}
        </TableContext.Provider>

        {/* Infinite scroll sentinel */}
        {infiniteScroll && (
          <div ref={sentinelRef} className={styles.infiniteScrollSentinel} aria-hidden="true">
            {infiniteScroll.loading && <Spinner size="sm" />}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && (totalPages > 1 || pagination.pageSizeOptions) && (
        <div className={styles.paginationWrapper}>
          {pagination.pageSizeOptions && pagination.onPageSizeChange && (
            <div className={styles.pageSizeSelector}>
              <span className={styles.pageSizeLabel}>Rows per page:</span>
              <Select
                options={pagination.pageSizeOptions.map((size) => ({
                  value: String(size),
                  label: String(size),
                }))}
                value={String(pagination.pageSize)}
                onChange={(value) => pagination.onPageSizeChange?.(Number(value))}
                aria-label="Rows per page"
              />
            </div>
          )}
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={pagination.currentPage}
              onPageChange={pagination.onPageChange}
              size={size}
            />
          )}
        </div>
      )}
    </div>
  );
}

// Wrap with forwardRef while preserving generic type
export const Table = forwardRef(TableInner) as <
  T extends Record<string, unknown> = Record<string, unknown>,
>(
  props: TableProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement;

// Add displayName
(Table as React.FC).displayName = 'Table';

export default Table;
