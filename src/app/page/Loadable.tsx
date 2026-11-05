import React, { useContext, type CSSProperties, type ReactNode } from 'react';
import { Card } from '../../lib/components/display/Card';
import { Skeleton } from '../../lib/components/display/Skeleton';
import { LoadingContext } from './LoadingContext';
import styles from './Loadable.module.scss';

export type LoadableShape = 'text' | 'heading' | 'box' | 'card' | 'avatar' | 'table';

export interface LoadableProps {
  /** Skeleton shape shown while the owning Page/Section is loading. @default 'text' */
  shape?: LoadableShape;
  /** Text lines (`text`). The last line is shorter when there are several. @default 1 */
  lines?: number;
  /** Body rows (`table`). @default 5 */
  rows?: number;
  /** Columns (`table`). @default 4 */
  columns?: number;
  /** Width override (`text`, `heading`, `box`, `card`, `avatar`). */
  width?: string | number;
  /** Height override (`box`, `card`, `avatar`). */
  height?: string | number;
  /** The real content. A function is evaluated only once the data has loaded. */
  children: ReactNode | (() => ReactNode);
}

const range = (n: number) => Array.from({ length: Math.max(1, Math.floor(n)) }, (_, i) => i);

function TextLines({ lines, width }: { lines: number; width?: string | number }) {
  const all = range(lines);
  return (
    <div className={styles.lines} style={width === undefined ? undefined : { width }}>
      {all.map((i) => (
        <Skeleton
          key={i}
          variant="text"
          width={all.length > 1 && i === all.length - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
}

function ShapeSkeleton({
  shape,
  lines,
  rows,
  columns,
  width,
  height,
}: Required<Pick<LoadableProps, 'shape' | 'lines' | 'rows' | 'columns'>> &
  Pick<LoadableProps, 'width' | 'height'>) {
  switch (shape) {
    case 'heading':
      return (
        <Skeleton
          variant="text"
          width={width ?? '40%'}
          height="var(--font-size-2xl)"
          className={styles.heading}
        />
      );
    case 'box':
      return <Skeleton variant="rounded" width={width ?? '100%'} height={height ?? '8rem'} />;
    case 'avatar': {
      const size = width ?? height ?? 40;
      return <Skeleton variant="circular" width={size} height={height ?? size} />;
    }
    case 'card': {
      const style: CSSProperties = { width, minHeight: height };
      return (
        <Card padding="md" style={style} className={styles.card}>
          <div className={styles.cardBody}>
            <Skeleton variant="text" width="45%" height="var(--font-size-lg)" />
            <TextLines lines={2} />
          </div>
        </Card>
      );
    }
    case 'table': {
      const cols = range(columns);
      const grid: CSSProperties = { gridTemplateColumns: `repeat(${cols.length}, minmax(0, 1fr))` };
      return (
        <div className={styles.table}>
          {[-1, ...range(rows)].map((row) => (
            <div
              key={row}
              className={styles.tableRow}
              data-header={row === -1 || undefined}
              style={grid}
            >
              {cols.map((col) => (
                <Skeleton
                  key={col}
                  variant="text"
                  width={row === -1 ? '50%' : col === 0 ? '80%' : '65%'}
                />
              ))}
            </div>
          ))}
        </div>
      );
    }
    default:
      return <TextLines lines={lines} width={width} />;
  }
}

/**
 * Marks a data-dependent piece of a `Page` or `Section`. While the nearest owner with queries
 * (the Section if it has `queries`, else the Page) is pending, it renders a skeleton in `shape`
 * so the page keeps its structure; once loaded it renders `children`. Pass a function as
 * children to read query data safely: it is not called until the data is there.
 */
export function Loadable({
  shape = 'text',
  lines = 1,
  rows = 5,
  columns = 4,
  width,
  height,
  children,
}: LoadableProps) {
  const { pending } = useContext(LoadingContext);
  if (!pending) {
    return typeof children === 'function' ? children() : children;
  }
  return (
    <div className={styles.loadable} data-loadable={shape} aria-hidden="true">
      <ShapeSkeleton
        shape={shape}
        lines={lines}
        rows={rows}
        columns={columns}
        width={width}
        height={height}
      />
    </div>
  );
}
