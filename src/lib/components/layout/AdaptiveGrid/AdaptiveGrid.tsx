import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useResizeObserver } from '../../../hooks';
import type { BaseComponentProps } from '../../../types';
import styles from './AdaptiveGrid.module.scss';

/**
 * Props for the AdaptiveGrid component
 */
export interface AdaptiveGridProps extends BaseComponentProps {
  /**
   * Minimum width for each grid item (px)
   * @default 200
   */
  minItemWidth?: number;

  /**
   * Maximum columns (regardless of available space)
   */
  maxColumns?: number;

  /**
   * Minimum columns
   * @default 1
   */
  minColumns?: number;

  /**
   * Gap between items (px)
   * @default 16
   */
  gap?: number;

  /**
   * Row gap (defaults to gap)
   */
  rowGap?: number;

  /**
   * Column gap (defaults to gap)
   */
  columnGap?: number;

  /**
   * How items fill available space
   * - 'auto-fill': Creates as many columns as will fit
   * - 'auto-fit': Collapses empty columns
   * @default 'auto-fill'
   */
  fillMode?: 'auto-fill' | 'auto-fit';

  /**
   * Item alignment within cells
   * @default 'stretch'
   */
  alignItems?: 'start' | 'center' | 'end' | 'stretch';

  /**
   * Content justification
   * @default 'start'
   */
  justifyItems?: 'start' | 'center' | 'end' | 'stretch';

  /**
   * Callback when column count changes
   */
  onColumnCountChange?: (count: number) => void;

  /**
   * Content to render
   */
  children: React.ReactNode;
}

/**
 * AdaptiveGrid - A CSS grid that auto-adjusts columns based on container width
 *
 * @example
 * Basic usage:
 * ```tsx
 * <AdaptiveGrid minItemWidth={250} gap={16}>
 *   {products.map(product => (
 *     <ProductCard key={product.id} {...product} />
 *   ))}
 * </AdaptiveGrid>
 * ```
 *
 * @example
 * With column limits:
 * ```tsx
 * <AdaptiveGrid
 *   minItemWidth={200}
 *   maxColumns={4}
 *   minColumns={2}
 *   gap={24}
 * >
 *   {items.map(item => <Card key={item.id} {...item} />)}
 * </AdaptiveGrid>
 * ```
 *
 * @example
 * Different row and column gaps:
 * ```tsx
 * <AdaptiveGrid
 *   minItemWidth={300}
 *   rowGap={32}
 *   columnGap={16}
 *   fillMode="auto-fit"
 * >
 *   {cards.map(card => <Card key={card.id} {...card} />)}
 * </AdaptiveGrid>
 * ```
 */
export const AdaptiveGrid = ({
  ref,
  minItemWidth = 200,
  maxColumns,
  minColumns = 1,
  gap = 16,
  rowGap,
  columnGap,
  fillMode = 'auto-fill',
  alignItems = 'stretch',
  justifyItems = 'start',
  onColumnCountChange,
  children,
  className,
  style,
  'data-testid': testId,
  'aria-label': ariaLabel,
  ...restProps
}: AdaptiveGridProps & {
  ref?: React.Ref<HTMLDivElement>;
}) => {
  const [columnCount, setColumnCount] = useState(1);
  const onColumnCountChangeRef = useRef(onColumnCountChange);

  useEffect(() => {
    onColumnCountChangeRef.current = onColumnCountChange;
  }, [onColumnCountChange]);

  const { ref: containerRef, width } = useResizeObserver();

  // Calculate column count
  useEffect(() => {
    if (width <= 0) {
      return;
    }

    const effectiveColumnGap = columnGap ?? gap;
    // Calculate how many columns can fit
    // Formula: width >= n * minItemWidth + (n-1) * gap
    // Solving for n: n <= (width + gap) / (minItemWidth + gap)
    let calculatedColumns = Math.floor(
      (width + effectiveColumnGap) / (minItemWidth + effectiveColumnGap)
    );

    // Apply min/max constraints
    calculatedColumns = Math.max(minColumns, calculatedColumns);
    if (maxColumns !== undefined) {
      calculatedColumns = Math.min(maxColumns, calculatedColumns);
    }

    // Ensure at least 1 column
    calculatedColumns = Math.max(1, calculatedColumns);

    if (calculatedColumns !== columnCount) {
      setColumnCount(calculatedColumns);
      onColumnCountChangeRef.current?.(calculatedColumns);
    }
  }, [width, minItemWidth, gap, columnGap, minColumns, maxColumns, columnCount]);

  // Combine refs
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef(node);
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [containerRef, ref]
  );

  const componentClasses = [styles.adaptiveGrid, className].filter(Boolean).join(' ');

  const effectiveRowGap = rowGap ?? gap;
  const effectiveColumnGap = columnGap ?? gap;

  const cssVariables = {
    '--grid-min-item-width': `${minItemWidth}px`,
    '--grid-gap': `${gap}px`,
    '--grid-row-gap': `${effectiveRowGap}px`,
    '--grid-column-gap': `${effectiveColumnGap}px`,
    '--grid-fill-mode': fillMode,
    '--grid-align-items': alignItems,
    '--grid-justify-items': justifyItems,
    '--grid-max-columns': maxColumns ?? 'none',
    ...style,
  } as React.CSSProperties;

  return (
    <div
      ref={setRefs}
      className={componentClasses}
      style={cssVariables}
      data-component="adaptive-grid"
      data-columns={columnCount}
      data-fill-mode={fillMode}
      data-testid={testId}
      aria-label={ariaLabel}
      {...restProps}
    >
      {children}
    </div>
  );
};

export default AdaptiveGrid;
