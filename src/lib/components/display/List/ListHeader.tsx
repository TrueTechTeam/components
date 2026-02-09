import React, { type ReactNode } from 'react';
import { Button } from '../../buttons/Button';
import { Checkbox } from '../../inputs/Checkbox';
import type { BulkAction, SelectionMode } from './types';
import type { ComponentSize } from '../../../types';
import styles from './List.module.scss';

export interface ListHeaderProps<T extends Record<string, unknown> = Record<string, unknown>> {
  /**
   * Selection mode
   */
  selectionMode: SelectionMode;

  /**
   * Whether all items are selected
   */
  isAllSelected: boolean;

  /**
   * Whether selection is indeterminate
   */
  isIndeterminate: boolean;

  /**
   * Callback to select/deselect all
   */
  onSelectAll: (selected: boolean) => void;

  /**
   * Number of selected items
   */
  selectedCount: number;

  /**
   * Total number of items
   */
  totalCount: number;

  /**
   * Selected items data
   */
  selectedItems: T[];

  /**
   * Selected item keys
   */
  selectedKeys: string[];

  /**
   * Bulk actions configuration
   */
  bulkActions?: Array<BulkAction<T>>;

  /**
   * Custom render for bulk actions
   */
  renderBulkActions?: (
    selectedItems: T[],
    selectedKeys: string[],
    actions: Array<BulkAction<T>>
  ) => ReactNode;

  /**
   * Position of header (for sticky behavior)
   */
  position: 'top' | 'bottom' | 'sticky-top' | 'sticky-bottom';

  /**
   * Size variant
   */
  size: ComponentSize;

  /**
   * Search component to render
   */
  searchComponent?: ReactNode;
}

export function ListHeader<T extends Record<string, unknown>>({
  selectionMode,
  isAllSelected,
  isIndeterminate,
  onSelectAll,
  selectedCount,
  totalCount,
  selectedItems,
  selectedKeys,
  bulkActions,
  renderBulkActions,
  position,
  size,
  searchComponent,
}: ListHeaderProps<T>) {
  const showSelectAll = selectionMode === 'multiple';
  const hasSelectedItems = selectedCount > 0;
  const isSticky = position === 'sticky-top' || position === 'sticky-bottom';

  // If custom render is provided, use it
  if (hasSelectedItems && renderBulkActions && bulkActions) {
    return (
      <div className={styles.listHeader} data-sticky={isSticky || undefined}>
        {renderBulkActions(selectedItems, selectedKeys, bulkActions)}
      </div>
    );
  }

  // Don't render header if no search, no select all, and no bulk actions when selected
  if (!searchComponent && !showSelectAll && !(hasSelectedItems && bulkActions?.length)) {
    return null;
  }

  return (
    <div className={styles.listHeader} data-sticky={isSticky || undefined}>
      <div className={styles.listHeaderLeft}>
        {showSelectAll && (
          <Checkbox
            checked={isAllSelected}
            indeterminate={isIndeterminate}
            onChange={(checked) => onSelectAll(checked)}
            size={size === 'lg' ? 'md' : 'sm'}
            aria-label="Select all items"
          />
        )}

        {hasSelectedItems && (
          <span className={styles.selectionInfo}>
            {selectedCount} of {totalCount} selected
          </span>
        )}

        {hasSelectedItems && bulkActions && bulkActions.length > 0 && (
          <div className={styles.bulkActions}>
            {bulkActions.map((action) => {
              const isDisabled =
                typeof action.disabled === 'function'
                  ? action.disabled(selectedItems)
                  : action.disabled;

              return (
                <Button
                  key={action.id}
                  size="sm"
                  variant={
                    action.variant === 'danger'
                      ? 'danger'
                      : action.variant === 'primary'
                        ? 'primary'
                        : 'outline'
                  }
                  onClick={() => action.onAction(selectedItems, selectedKeys)}
                  disabled={isDisabled}
                  startIcon={action.icon}
                >
                  {action.label}
                </Button>
              );
            })}
          </div>
        )}
      </div>

      {searchComponent && <div className={styles.listHeaderRight}>{searchComponent}</div>}
    </div>
  );
}

export default ListHeader;
