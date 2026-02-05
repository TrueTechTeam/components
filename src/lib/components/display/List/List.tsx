/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef, useMemo, useId, useCallback, type KeyboardEvent } from 'react';
import type { ListProps, ListContextValue } from './types';
import { ListContext } from './ListContext';
import { ListItem } from './ListItem';
import { ListHeader } from './ListHeader';
import { ListGroup } from './ListGroup';
import { ListSearch } from './ListSearch';
import { ListSkeleton } from './ListSkeleton';
import { ListEmpty } from './ListEmpty';
import { useListSelection } from './hooks/useListSelection';
import { useListExpand } from './hooks/useListExpand';
import { useListFilter } from './hooks/useListFilter';
import { useListKeyboardNav } from './hooks/useListKeyboardNav';
import { useListGroups } from './hooks/useListGroups';
import { useInfiniteScroll } from '../Table/hooks/useInfiniteScroll';
import { Spinner } from '../Spinner';
import styles from './List.module.scss';

function ListInner<T extends Record<string, any>>(
  {
    // Data
    data,
    itemKey = 'id' as keyof T,
    isItemDisabled: isItemDisabledProp,

    // Rendering
    renderItem,
    primaryTextField,
    secondaryTextField,
    avatarField,

    // Sizing & Variants
    size = 'md',
    variant = 'default',
    spacing = 'md',

    // Selection
    selectionMode = 'none',
    selectedKeys: controlledSelectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    showSelectionControls = selectionMode !== 'none',
    selectionControlPosition = 'start',

    // Bulk Actions
    bulkActions,
    bulkActionsPosition = 'top',
    renderBulkActions,

    // Item Actions
    itemActions,
    itemActionsPosition = 'end',
    itemActionsTrigger = 'hover',

    // Grouping
    groupBy,
    renderGroupHeader,
    collapsibleGroups = false,
    defaultCollapsedGroups,
    collapsedGroups: controlledCollapsedGroups,
    onCollapsedGroupsChange,

    // Expandable Items
    renderExpandedContent,
    expandedKeys: controlledExpandedKeys,
    defaultExpandedKeys,
    onExpandChange,
    expandTrigger = 'icon',

    // Search/Filter
    searchable = false,
    searchPlaceholder = 'Search...',
    searchFields,
    searchFn,
    searchQuery: controlledSearchQuery,
    onSearchChange,
    searchDebounce = 300,

    // Infinite Scroll
    infiniteScroll,

    // Interaction
    onItemClick,
    onItemAction,
    keyboardNavigation = true,

    // Loading & Empty States
    loading = false,
    loadingContent,
    skeleton,
    emptyContent = 'No items to display',
    renderEmpty,

    // Responsive
    maxHeight,
    columns = 1,

    // Accessibility
    role: roleProp,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,

    // Base props
    className,
    style,
    'data-testid': testId,
    ...restProps
  }: ListProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const listId = useId();

  // Item key getter
  const getItemKey = useMemo(() => {
    if (typeof itemKey === 'function') {
      return itemKey;
    }
    return (item: T, index: number) => String(item[itemKey] ?? index);
  }, [itemKey]);

  // Item disabled checker
  const isItemDisabled = useCallback(
    (item: T, index: number) => {
      if (isItemDisabledProp) {
        return isItemDisabledProp(item, index);
      }
      return false;
    },
    [isItemDisabledProp]
  );

  // All item keys for selection
  const allItemKeys = useMemo(
    () => data.map((item, index) => getItemKey(item, index)),
    [data, getItemKey]
  );

  // Hooks
  const { filteredData, searchQuery, setSearchQuery, isFiltering } = useListFilter<T>({
    data,
    searchQuery: controlledSearchQuery,
    onSearchChange,
    searchFields,
    searchFn,
    debounceMs: searchDebounce,
  });

  const { selectedKeys, onSelectItem, onSelectAll, isAllSelected, isIndeterminate } =
    useListSelection({
      selectionMode,
      selectedKeys: controlledSelectedKeys,
      defaultSelectedKeys,
      onSelectionChange,
      allItemKeys,
    });

  const { expandedKeys, onExpandItem } = useListExpand({
    expandedKeys: controlledExpandedKeys,
    defaultExpandedKeys,
    onExpandChange,
  });

  const { groups, collapsedGroups, onToggleGroup, isGroupCollapsed } = useListGroups<T>({
    data: filteredData,
    groupBy,
    collapsedGroups: controlledCollapsedGroups,
    defaultCollapsedGroups,
    onCollapsedGroupsChange,
  });

  // Flatten groups to get total visible item count for keyboard nav
  const visibleItems = useMemo(() => {
    const items: Array<{ item: T; index: number }> = [];
    groups.forEach((group) => {
      if (group.key === '__default__' || !isGroupCollapsed(group.key)) {
        group.items.forEach((item) => {
          const originalIndex = data.indexOf(item);
          items.push({ item, index: originalIndex });
        });
      }
    });
    return items;
  }, [groups, isGroupCollapsed, data]);

  const { focusedIndex, setFocusedIndex, handleKeyDown } = useListKeyboardNav({
    itemCount: visibleItems.length,
    onItemAction: (index) => {
      const { item, index: originalIndex } = visibleItems[index];

      // Toggle selection if in selection mode
      if (selectionMode !== 'none') {
        const key = getItemKey(item, originalIndex);
        onSelectItem(key, !selectedKeys.has(key));
      }

      // Call custom action handler
      if (onItemAction) {
        // Create a synthetic keyboard event
        const syntheticEvent = { key: 'Enter', preventDefault: () => {} } as KeyboardEvent;
        onItemAction(item, originalIndex, syntheticEvent);
      }
    },
    disabled: !keyboardNavigation,
    orientation: typeof columns === 'number' && columns > 1 ? 'grid' : 'vertical',
    columns: typeof columns === 'number' ? columns : 1,
  });

  // Infinite scroll
  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: infiniteScroll?.onLoadMore || (() => {}),
    hasMore: infiniteScroll?.hasMore || false,
    loading: infiniteScroll?.loading,
    threshold: infiniteScroll?.threshold,
    rootMargin: infiniteScroll?.rootMargin,
  });

  // Get selected items for bulk actions
  const selectedItems = useMemo(
    () => data.filter((item, index) => selectedKeys.has(getItemKey(item, index))),
    [data, selectedKeys, getItemKey]
  );

  // Context value
  const contextValue = useMemo<ListContextValue<T>>(
    () => ({
      data,
      filteredData,
      getItemKey,
      isItemDisabled,
      size,
      variant,
      spacing,
      selectionMode,
      selectedKeys,
      onSelectItem,
      onSelectAll,
      isAllSelected,
      isIndeterminate,
      showSelectionControls,
      selectionControlPosition,
      expandedKeys,
      onExpandItem,
      renderExpandedContent,
      expandTrigger,
      itemActions,
      itemActionsPosition,
      itemActionsTrigger,
      focusedIndex,
      setFocusedIndex,
      onItemClick,
      onItemAction,
      renderItem,
      primaryTextField,
      secondaryTextField,
      avatarField,
      groupBy,
      collapsedGroups,
      onToggleGroup,
      collapsibleGroups,
      renderGroupHeader,
      listId,
    }),
    [
      data,
      filteredData,
      getItemKey,
      isItemDisabled,
      size,
      variant,
      spacing,
      selectionMode,
      selectedKeys,
      onSelectItem,
      onSelectAll,
      isAllSelected,
      isIndeterminate,
      showSelectionControls,
      selectionControlPosition,
      expandedKeys,
      onExpandItem,
      renderExpandedContent,
      expandTrigger,
      itemActions,
      itemActionsPosition,
      itemActionsTrigger,
      focusedIndex,
      setFocusedIndex,
      onItemClick,
      onItemAction,
      renderItem,
      primaryTextField,
      secondaryTextField,
      avatarField,
      groupBy,
      collapsedGroups,
      onToggleGroup,
      collapsibleGroups,
      renderGroupHeader,
      listId,
    ]
  );

  // Styles
  const listClasses = [styles.listContainer, className].filter(Boolean).join(' ');

  const listStyle = {
    '--list-max-height': typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
    '--list-columns': typeof columns === 'number' ? columns : 1,
    ...style,
  } as React.CSSProperties;

  // Compute ARIA role
  const role = roleProp || (selectionMode !== 'none' ? 'listbox' : 'list');

  // Render search component
  const searchComponent = searchable ? (
    <ListSearch
      value={searchQuery}
      onChange={setSearchQuery}
      placeholder={searchPlaceholder}
      isFiltering={isFiltering}
    />
  ) : null;

  // Should show header
  const showHeader =
    searchable ||
    selectionMode === 'multiple' ||
    (selectedKeys.size > 0 && bulkActions && bulkActions.length > 0);

  // Render content
  const renderContent = () => {
    // Skeleton loading
    if (skeleton?.enabled) {
      return (
        <ListSkeleton
          rows={skeleton.rows ?? 5}
          showAvatar={!!avatarField}
          showSecondaryText={!!secondaryTextField}
          size={size}
        />
      );
    }

    // Loading with no data
    if (loading && filteredData.length === 0) {
      return <div className={styles.loadingState}>{loadingContent || <Spinner size="md" />}</div>;
    }

    // Empty state
    if (filteredData.length === 0) {
      return (
        <ListEmpty
          content={emptyContent}
          renderEmpty={renderEmpty}
          isNoResults={searchQuery.length > 0}
          searchQuery={searchQuery}
        />
      );
    }

    // Render grouped items
    let flatIndex = 0;
    return groups.map((group) => {
      const isCollapsed = isGroupCollapsed(group.key);
      const startIndex = flatIndex;

      // Only increment index for visible items
      if (!isCollapsed || group.key === '__default__') {
        flatIndex += group.items.length;
      }

      return (
        <ListGroup
          key={group.key}
          groupKey={group.key}
          itemCount={group.items.length}
          collapsible={collapsibleGroups && group.key !== '__default__'}
          isCollapsed={isCollapsed}
          onToggle={() => onToggleGroup(group.key)}
          renderHeader={renderGroupHeader}
        >
          {group.items.map((item, indexInGroup) => {
            const originalIndex = data.indexOf(item);
            const filteredIndex = startIndex + indexInGroup;

            return (
              <ListItem
                key={getItemKey(item, originalIndex)}
                item={item}
                index={originalIndex}
                filteredIndex={filteredIndex}
              />
            );
          })}
        </ListGroup>
      );
    });
  };

  return (
    <div className={listClasses} style={listStyle}>
      <ListContext.Provider value={contextValue as ListContextValue}>
        {/* Header with bulk actions and search */}
        {showHeader && (bulkActionsPosition === 'top' || bulkActionsPosition === 'sticky-top') && (
          <ListHeader
            selectionMode={selectionMode}
            isAllSelected={isAllSelected}
            isIndeterminate={isIndeterminate}
            onSelectAll={onSelectAll}
            selectedCount={selectedKeys.size}
            totalCount={filteredData.length}
            selectedItems={selectedItems}
            selectedKeys={Array.from(selectedKeys)}
            bulkActions={bulkActions}
            renderBulkActions={renderBulkActions}
            position={bulkActionsPosition}
            size={size}
            searchComponent={searchComponent}
          />
        )}

        {/* List container */}
        <div
          ref={ref}
          className={styles.list}
          data-component="list"
          data-size={size}
          data-variant={variant}
          data-spacing={spacing}
          data-columns={typeof columns === 'number' && columns > 1 ? columns : undefined}
          data-loading={loading || undefined}
          data-testid={testId || 'list'}
          role={role}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-multiselectable={selectionMode === 'multiple' || undefined}
          aria-busy={loading || undefined}
          onKeyDown={keyboardNavigation ? handleKeyDown : undefined}
          {...restProps}
        >
          {renderContent()}

          {/* Loading overlay for loading state with data */}
          {loading && filteredData.length > 0 && (
            <div className={styles.loadingOverlay} aria-hidden="true">
              <Spinner size="md" />
            </div>
          )}

          {/* Infinite scroll sentinel */}
          {infiniteScroll && (
            <div ref={sentinelRef} className={styles.infiniteScrollSentinel} aria-hidden="true">
              {infiniteScroll.loading && <Spinner size="sm" />}
            </div>
          )}
        </div>

        {/* Bottom bulk actions */}
        {showHeader &&
          (bulkActionsPosition === 'bottom' || bulkActionsPosition === 'sticky-bottom') && (
            <ListHeader
              selectionMode={selectionMode}
              isAllSelected={isAllSelected}
              isIndeterminate={isIndeterminate}
              onSelectAll={onSelectAll}
              selectedCount={selectedKeys.size}
              totalCount={filteredData.length}
              selectedItems={selectedItems}
              selectedKeys={Array.from(selectedKeys)}
              bulkActions={bulkActions}
              renderBulkActions={renderBulkActions}
              position={bulkActionsPosition}
              size={size}
              searchComponent={searchComponent}
            />
          )}
      </ListContext.Provider>
    </div>
  );
}

// Wrap with forwardRef while preserving generic type
export const List = forwardRef(ListInner) as <T extends Record<string, any> = Record<string, any>>(
  props: ListProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement;

// Add displayName
(List as React.FC).displayName = 'List';

export default List;
