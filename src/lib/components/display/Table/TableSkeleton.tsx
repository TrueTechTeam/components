import React from 'react';
import { Skeleton } from '../Skeleton';
import type { ColumnConfig } from './types';
import styles from './Table.module.scss';

interface TableSkeletonProps {
  rows: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: Array<ColumnConfig<any>>;
  hasExpandColumn?: boolean;
  hasSelectionColumn?: boolean;
}

export function TableSkeleton({
  rows,
  columns,
  hasExpandColumn = false,
  hasSelectionColumn = false,
}: TableSkeletonProps) {
  return (
    <div className={styles.tableBody} role="rowgroup">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className={styles.tableRow} role="row">
          {/* Expand column skeleton */}
          {hasExpandColumn && (
            <div className={styles.tableCell} data-type="expand" role="cell">
              <Skeleton variant="circular" width={20} height={20} />
            </div>
          )}

          {/* Selection column skeleton */}
          {hasSelectionColumn && (
            <div className={styles.tableCell} data-type="selection" role="cell">
              <Skeleton variant="circular" width={16} height={16} />
            </div>
          )}

          {/* Data columns skeleton */}
          {columns.map((column, colIndex) => (
            <div
              key={String(column.key)}
              className={styles.tableCell}
              data-align={column.align || 'left'}
              role="cell"
            >
              <Skeleton
                variant="text"
                width={colIndex === columns.length - 1 ? '60%' : '80%'}
                height="1em"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

TableSkeleton.displayName = 'TableSkeleton';
