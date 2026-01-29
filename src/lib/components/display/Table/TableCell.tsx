import React from 'react';
import type { ColumnConfig } from './types';
import { useTableContextStrict } from './TableContext';
import { getCellValue, detectAlignment, formatCellValue } from './utils';
import styles from './Table.module.scss';

interface TableCellProps<T = Record<string, unknown>> {
  column: ColumnConfig<T>;
  row: T;
  rowIndex: number;
  isFirstColumn: boolean;
}

export function TableCell<T extends Record<string, unknown>>({
  column,
  row,
  rowIndex,
  isFirstColumn,
}: TableCellProps<T>) {
  const { stickyFirstColumn } = useTableContextStrict<T>();

  const value = getCellValue(row, String(column.key));
  const alignment = column.align || detectAlignment(value);

  const content = column.render
    ? column.render(value, row, rowIndex)
    : formatCellValue(value);

  return (
    <div
      className={styles.tableCell}
      data-align={alignment}
      data-sticky={(stickyFirstColumn && isFirstColumn) || undefined}
      role="cell"
    >
      <span className={styles.cellContent}>{content}</span>
    </div>
  );
}

TableCell.displayName = 'TableCell';
