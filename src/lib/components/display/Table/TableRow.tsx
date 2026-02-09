import React from 'react';
import { useTableContextStrict } from './TableContext';
import { TableCell } from './TableCell';
import { Checkbox } from '../../inputs/Checkbox';
import { Collapse } from '../Collapse';
import { Icon } from '../Icon';
import styles from './Table.module.scss';

interface TableRowProps<T = Record<string, unknown>> {
  row: T;
  rowIndex: number;
}

export function TableRow<T extends Record<string, unknown>>({ row, rowIndex }: TableRowProps<T>) {
  const {
    columns,
    getRowKey,
    size,
    selectionMode,
    selectedKeys,
    onSelectRow,
    showSelectionControls,
    expandedKeys,
    onExpand,
    hasExpandableRows,
    expandedRowRender,
    onRowClick,
  } = useTableContextStrict<T>();

  const rowKey = getRowKey(row, rowIndex);
  const isSelected = selectedKeys.has(rowKey);
  const isExpanded = expandedKeys.has(rowKey);

  const handleRowClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Don't trigger row click if clicking on interactive elements (except our radio button)
    const target = event.target as HTMLElement;
    const isRadioClick = target.closest('[data-type="radio-selection"]');

    if (
      (!isRadioClick && target.closest('[data-type="selection"]')) ||
      target.closest('[data-type="expand"]') ||
      target.closest('button') ||
      target.closest('a') ||
      target.closest('input')
    ) {
      return;
    }

    // For single selection, toggle selection on row click
    if (selectionMode === 'single') {
      onSelectRow(rowKey, !isSelected);
    }

    // For multiple selection, toggle selection on row click (outside checkbox)
    if (selectionMode === 'multiple') {
      onSelectRow(rowKey, !isSelected);
    }

    onRowClick?.(row, rowIndex, event);
  };

  const handleExpandClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onExpand(rowKey, !isExpanded);
  };

  const handleCheckboxChange = (checked: boolean) => {
    onSelectRow(rowKey, checked);
  };

  const isClickable = selectionMode !== 'none' || !!onRowClick;

  return (
    <>
      <div
        className={styles.tableRow}
        role="row"
        data-selected={isSelected || undefined}
        data-expanded={isExpanded || undefined}
        data-clickable={isClickable || undefined}
        onClick={isClickable ? handleRowClick : undefined}
        aria-selected={selectionMode !== 'none' ? isSelected : undefined}
      >
        {/* Expand cell */}
        {hasExpandableRows && (
          <div className={styles.tableCell} data-type="expand" role="cell">
            <button
              type="button"
              className={styles.expandButton}
              onClick={handleExpandClick}
              aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
              aria-expanded={isExpanded}
            >
              <Icon name={isExpanded ? 'chevron-down' : 'chevron-right'} size={16} />
            </button>
          </div>
        )}

        {/* Selection cell - multiple mode (checkbox) */}
        {selectionMode === 'multiple' && showSelectionControls && (
          <div className={styles.tableCell} data-type="selection" role="cell">
            <Checkbox
              checked={isSelected}
              onChange={handleCheckboxChange}
              size={size}
              aria-label={`Select row ${rowIndex + 1}`}
            />
          </div>
        )}

        {/* Selection cell - single mode (radio button) */}
        {selectionMode === 'single' && showSelectionControls && (
          <div className={styles.tableCell} data-type="radio-selection" role="cell">
            <button
              type="button"
              className={styles.radioButton}
              onClick={() => onSelectRow(rowKey, true)}
              aria-label={`Select row ${rowIndex + 1}`}
              aria-pressed={isSelected}
            >
              <span className={styles.radioIndicator} data-selected={isSelected || undefined} />
            </button>
          </div>
        )}

        {/* Data cells */}
        {columns.map((column, colIndex) => (
          <TableCell
            key={String(column.key)}
            column={column}
            row={row}
            rowIndex={rowIndex}
            isFirstColumn={colIndex === 0}
          />
        ))}
      </div>

      {/* Expandable content */}
      {hasExpandableRows && expandedRowRender && (
        <Collapse isOpen={isExpanded} unmountOnCollapse>
          <div className={styles.expandedRow} role="row">
            <div className={styles.expandedContent}>{expandedRowRender(row, rowIndex)}</div>
          </div>
        </Collapse>
      )}
    </>
  );
}
