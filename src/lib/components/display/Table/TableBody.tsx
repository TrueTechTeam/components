import React from 'react';
import { useTableContextStrict } from './TableContext';
import { TableRow } from './TableRow';
import styles from './Table.module.scss';

export function TableBody() {
  const { data, getRowKey } = useTableContextStrict();

  return (
    <div className={styles.tableBody} role="rowgroup">
      {data.map((row, rowIndex) => (
        <TableRow key={getRowKey(row, rowIndex)} row={row} rowIndex={rowIndex} />
      ))}
    </div>
  );
}
