/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo } from 'react';
import { Table, useTableFilter } from '../../display/Table';
import { Input } from '../../inputs/Input';
import {
  FilterProvider,
  FilterField,
  FilterBar,
  FilterPopover,
  FilterModal,
  FilterSidebar,
  FilterAccordion,
  ActiveFilters,
  useFilterContextStrict,
  type FilterDefinition,
  type FilterValue,
} from '../../filters';
import {
  deriveFiltersFromColumns,
  applyDataTableFilters,
  getDefaultFilterValue,
} from './DataTable.utils';
import type { DataTableProps, DataTableColumnConfig } from './DataTable.types';
import styles from './DataTable.module.scss';
import { useLabels } from '../../../contexts/LabelsContext';

interface DataTableContentProps<T extends Record<string, unknown>>
  extends Omit<
    DataTableProps<T>,
    | 'filters'
    | 'filterGroups'
    | 'filterValues'
    | 'defaultFilterValues'
    | 'onFilterChange'
    | 'syncFiltersWithUrl'
  > {
  ref?: React.Ref<HTMLDivElement>;
  effectiveFilters: FilterDefinition[];
}

function DataTableContent<T extends Record<string, unknown>>({
  ref,
  data,
  columns,
  rowKey,
  size = 'md',
  variant = 'default',
  effectiveFilters,
  filterLayout = 'popover',
  filterLayoutProps,
  showActiveFilters = true,
  searchable = false,
  searchPlaceholder: searchPlaceholderProp,
  searchFields,
  searchFn,
  searchQuery: controlledSearchQuery,
  onSearchChange,
  searchDebounce = 300,
  mode = 'client',
  onQueryChange,
  sort,
  defaultSort,
  onSortChange,
  selectionMode,
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  showSelectionControls,
  onRowClick,
  expandedRowRender,
  expandedKeys,
  defaultExpandedKeys,
  onExpandChange,
  pagination,
  infiniteScroll,
  stickyHeader,
  stickyFirstColumn,
  maxHeight,
  emptyContent,
  loading,
  loadingContent,
  skeleton,
  caption,
  captionHidden,
  className,
  style,
  'data-testid': testId,
  'aria-label': ariaLabel,
}: DataTableContentProps<T>) {
  const t = useLabels();
  const searchPlaceholder =
    searchPlaceholderProp === undefined ? t('table.searchPlaceholder') : searchPlaceholderProp;
  const filterCtx = useFilterContextStrict();
  const hasFilters = effectiveFilters.length > 0;
  const filterIds = useMemo(() => effectiveFilters.map((filter) => filter.id), [effectiveFilters]);

  // Apply active filter values to the data (client mode only - server mode assumes
  // the caller already filtered `data` and is driven by `onQueryChange` instead).
  const filterMatchedData = useMemo(() => {
    if (mode === 'server' || !hasFilters) {
      return data;
    }
    return applyDataTableFilters(data, effectiveFilters, filterCtx.getActiveFilters());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, effectiveFilters, hasFilters, mode, filterCtx.values]);

  // Reuse Table's own search hook so search behaves identically to Table's
  // built-in `searchable` prop (debounce, controlled/uncontrolled, custom searchFn).
  const { filteredData, searchQuery, setSearchQuery, isFiltering } = useTableFilter<T>({
    data: filterMatchedData,
    columns: (columns as any) ?? [],
    searchQuery: controlledSearchQuery,
    onSearchChange,
    searchFields,
    searchFn,
    debounceMs: searchDebounce,
  });

  const tableData = mode === 'server' ? data : filteredData;

  useEffect(() => {
    if (mode !== 'server') {
      return;
    }
    onQueryChange?.({
      search: searchQuery,
      filters: filterCtx.getActiveFilters(),
      sort: sort ?? { column: null, direction: null },
      page: pagination?.currentPage ?? 1,
      pageSize: pagination?.pageSize ?? data.length,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, searchQuery, filterCtx.values, sort, pagination?.currentPage, pagination?.pageSize]);

  // The shared Input component, not Table's own bespoke TableSearch box - TableSearch is
  // styled to sit flush under a Table's grey header row, which reads as an odd, too-dark
  // box once it's sitting alone in its own row instead of attached to the table.
  const searchElement = searchable ? (
    <Input
      type="search"
      value={searchQuery}
      onChange={(event) => setSearchQuery(event.target.value)}
      placeholder={searchPlaceholder}
      startIcon="search"
      showClearButton
      onClear={() => setSearchQuery('')}
      loading={isFiltering}
      aria-label={searchPlaceholder}
      className={styles.searchInput}
    />
  ) : null;

  // "bar" packs every field into one dense horizontal row (FilterBar already spaces its
  // own children), so labels stay off there to save width. Every other layout is a
  // dedicated editing panel with room to spare, so fields get a label and breathing room.
  const compactFilterFieldsElement = (
    <>
      {filterIds.map((id) => (
        <FilterField key={id} filterId={id} showLabel={false} />
      ))}
    </>
  );

  const filterFieldsElement = (
    <div className={styles.filterFieldsList}>
      {filterIds.map((id) => (
        <FilterField key={id} filterId={id} showLabel />
      ))}
    </div>
  );

  const activeFiltersElement =
    showActiveFilters && hasFilters ? <ActiveFilters maxVisible={5} /> : null;

  const tableElement = (
    <Table<T>
      ref={ref}
      data={tableData}
      columns={columns as any}
      rowKey={rowKey}
      size={size}
      variant={variant}
      sort={sort}
      defaultSort={defaultSort}
      onSortChange={onSortChange}
      selectionMode={selectionMode}
      selectedKeys={selectedKeys}
      defaultSelectedKeys={defaultSelectedKeys}
      onSelectionChange={onSelectionChange}
      showSelectionControls={showSelectionControls}
      onRowClick={onRowClick}
      expandedRowRender={expandedRowRender}
      expandedKeys={expandedKeys}
      defaultExpandedKeys={defaultExpandedKeys}
      onExpandChange={onExpandChange}
      pagination={pagination}
      infiniteScroll={infiniteScroll}
      stickyHeader={stickyHeader}
      stickyFirstColumn={stickyFirstColumn}
      maxHeight={maxHeight}
      emptyContent={emptyContent}
      loading={loading}
      loadingContent={loadingContent}
      skeleton={skeleton}
      caption={caption}
      captionHidden={captionHidden}
      className={className}
      style={style}
      data-testid={testId}
      aria-label={ariaLabel}
    />
  );

  const componentClasses = [styles.dataTable, className].filter(Boolean).join(' ');

  // The search box always gets its own row, kept separate from filter controls
  // regardless of `filterLayout` - typing a search term is a different action
  // from opening/editing filters and shouldn't visually blend with it.
  const searchRow = searchElement ? <div className={styles.toolbar}>{searchElement}</div> : null;

  if (!hasFilters || filterLayout === 'none') {
    return (
      <div className={componentClasses}>
        {searchRow}
        {activeFiltersElement && <div className={styles.toolbar}>{activeFiltersElement}</div>}
        {tableElement}
      </div>
    );
  }

  switch (filterLayout) {
    case 'bar':
      return (
        <div className={componentClasses}>
          {searchRow}
          <FilterBar
            visibleFilters={filterIds}
            showActiveFilters={showActiveFilters}
            {...filterLayoutProps}
          >
            {compactFilterFieldsElement}
          </FilterBar>
          {tableElement}
        </div>
      );

    case 'popover':
      return (
        <div className={componentClasses}>
          {searchRow}
          <div className={styles.toolbar}>
            {/* wider than FilterPopover's own 320px default: a number-range filter's
                paired Min/Max inputs each reserve space for two 40px stepper buttons,
                which doesn't fit 320px minus padding once digits are added in */}
            <FilterPopover width={380} showActiveFilters={false} {...filterLayoutProps}>
              {filterFieldsElement}
            </FilterPopover>
            {activeFiltersElement}
          </div>
          {tableElement}
        </div>
      );

    case 'modal':
      return (
        <div className={componentClasses}>
          {searchRow}
          <div className={styles.toolbar}>
            <FilterModal showActiveFilters={false} {...filterLayoutProps}>
              {filterFieldsElement}
            </FilterModal>
            {activeFiltersElement}
          </div>
          {tableElement}
        </div>
      );

    case 'accordion':
      return (
        <div className={componentClasses}>
          {searchRow}
          {activeFiltersElement && <div className={styles.toolbar}>{activeFiltersElement}</div>}
          <FilterAccordion showActiveFilters={false} {...filterLayoutProps}>
            {filterFieldsElement}
          </FilterAccordion>
          {tableElement}
        </div>
      );

    case 'sidebar':
      return (
        <div className={[styles.dataTableWithSidebar, className].filter(Boolean).join(' ')}>
          {/* wider than FilterSidebar's own 280px default - same number-range width issue as the popover */}
          <FilterSidebar width={340} showActiveFilters={false} {...filterLayoutProps}>
            {filterFieldsElement}
          </FilterSidebar>
          <div className={styles.dataTableMain}>
            {searchRow}
            {activeFiltersElement && <div className={styles.toolbar}>{activeFiltersElement}</div>}
            {tableElement}
          </div>
        </div>
      );

    default:
      return (
        <div className={componentClasses}>
          {searchRow}
          {tableElement}
        </div>
      );
  }
}

function DataTableInner<T extends Record<string, any>>({
  ref,
  data,
  columns,
  filters,
  filterGroups = [],
  filterValues,
  defaultFilterValues,
  onFilterChange,
  syncFiltersWithUrl = false,
  size = 'md',
  ...rest
}: DataTableProps<T> & { ref?: React.Ref<HTMLDivElement> }) {
  const t = useLabels();
  const effectiveFilters = useMemo<FilterDefinition[]>(() => {
    if (filters) {
      return filters;
    }
    if (columns) {
      return deriveFiltersFromColumns(columns as Array<DataTableColumnConfig<T>>, data, t);
    }
    return [];
  }, [filters, columns, data, t]);

  // FilterProvider doesn't backfill defaults for filter ids missing from a controlled
  // `values` object, which crashes range-type filters. Fill them in here so callers can
  // pass just the filters they care about controlling.
  const mergedFilterValues = useMemo<Record<string, FilterValue> | undefined>(() => {
    if (!filterValues) {
      return undefined;
    }
    const merged: Record<string, FilterValue> = {};
    for (const filter of effectiveFilters) {
      merged[filter.id] = filterValues[filter.id] ?? getDefaultFilterValue(filter);
    }
    return merged;
  }, [filterValues, effectiveFilters]);

  return (
    <FilterProvider
      filters={effectiveFilters}
      groups={filterGroups}
      values={mergedFilterValues}
      defaultValues={defaultFilterValues}
      onChange={onFilterChange}
      syncWithUrl={syncFiltersWithUrl}
      size={size}
    >
      <DataTableContent<T>
        ref={ref}
        data={data}
        columns={columns}
        size={size}
        effectiveFilters={effectiveFilters}
        {...rest}
      />
    </FilterProvider>
  );
}

export const DataTable = DataTableInner as <
  T extends Record<string, unknown> = Record<string, unknown>,
>(
  props: DataTableProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => React.ReactElement;

export default DataTable;
