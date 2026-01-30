import React from 'react';
import { useTableContextStrict } from './TableContext';
import { Checkbox } from '../../inputs/Checkbox';
import { Icon } from '../Icon';
import styles from './Table.module.scss';

export function TableHeader() {
  const {
    columns,
    size,
    sort,
    onSort,
    selectionMode,
    onSelectAll,
    isAllSelected,
    isIndeterminate,
    showSelectionControls,
    hasExpandableRows,
    stickyHeader,
    stickyFirstColumn,
  } = useTableContextStrict();

  const handleSelectAllChange = (_checked: boolean) => {
    // Toggle logic: if any are unchecked, select all; if all checked, deselect all
    onSelectAll(!isAllSelected);
  };

  return (
    <div className={styles.tableHeader} role="rowgroup" data-sticky={stickyHeader || undefined}>
      <div className={styles.tableRow} role="row">
        {/* Expand column header */}
        {hasExpandableRows && (
          <div
            className={styles.tableCell}
            data-type="expand"
            role="columnheader"
            aria-label="Expand"
          />
        )}

        {/* Selection column header */}
        {selectionMode === 'multiple' && showSelectionControls && (
          <div className={styles.tableCell} data-type="selection" role="columnheader">
            <Checkbox
              checked={isAllSelected}
              indeterminate={isIndeterminate}
              onChange={handleSelectAllChange}
              size={size}
              aria-label={isAllSelected ? 'Deselect all rows' : 'Select all rows'}
            />
          </div>
        )}

        {selectionMode === 'single' && showSelectionControls && (
          <div
            className={styles.tableCell}
            data-type="selection"
            role="columnheader"
            aria-label="Selection"
          />
        )}

        {/* Data column headers */}
        {columns.map((column, colIndex) => {
          const isSorted = sort.column === column.key;
          const isFirstColumn = colIndex === 0;

          return (
            <div
              key={String(column.key)}
              className={styles.tableCell}
              data-align={column.align || 'left'}
              data-sortable={column.sortable || undefined}
              data-sorted={isSorted || undefined}
              data-sort-direction={isSorted ? sort.direction : undefined}
              data-sticky={(stickyFirstColumn && isFirstColumn) || undefined}
              role="columnheader"
              aria-sort={
                isSorted ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined
              }
              onClick={column.sortable ? () => onSort(String(column.key)) : undefined}
              tabIndex={column.sortable ? 0 : undefined}
              onKeyDown={
                column.sortable
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSort(String(column.key));
                      }
                    }
                  : undefined
              }
            >
              <span className={styles.headerContent}>{column.header}</span>

              {column.sortable && (
                <span className={styles.sortIcon} data-unsorted={!isSorted || undefined}>
                  <Icon
                    name={
                      isSorted ? (sort.direction === 'asc' ? 'arrow-up' : 'arrow-down') : 'arrow-up'
                    }
                    size={14}
                  />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

TableHeader.displayName = 'TableHeader';
