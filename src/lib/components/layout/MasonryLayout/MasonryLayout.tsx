import React, {
  forwardRef,
  useState,
  useCallback,
  useEffect,
  useRef,
  Children,
  isValidElement,
} from 'react';
import { useResizeObserver } from '../../../hooks';
import type { BaseComponentProps } from '../../../types';
import styles from './MasonryLayout.module.scss';

/**
 * Props for the MasonryLayout component
 */
export interface MasonryLayoutProps extends BaseComponentProps {
  /**
   * Target column width (px) - determines number of columns
   * @default 250
   */
  columnWidth?: number;

  /**
   * Gap between items (px)
   * @default 16
   */
  gap?: number;

  /**
   * Maximum columns
   */
  maxColumns?: number;

  /**
   * Minimum columns
   * @default 1
   */
  minColumns?: number;

  /**
   * Animation duration for layout changes (ms)
   * @default 250
   */
  animationDuration?: number;

  /**
   * Animation easing function
   * @default 'ease-out'
   */
  animationEasing?: string;

  /**
   * Callback when column count changes
   */
  onColumnCountChange?: (count: number) => void;

  /**
   * Content to render
   */
  children: React.ReactNode;
}

interface ItemPosition {
  left: number;
  top: number;
  width: number;
}

/**
 * MasonryLayout - Pinterest-style masonry layout that responds to container width
 *
 * @example
 * Basic usage:
 * ```tsx
 * <MasonryLayout columnWidth={250} gap={16}>
 *   {images.map(img => (
 *     <img key={img.id} src={img.url} alt={img.alt} />
 *   ))}
 * </MasonryLayout>
 * ```
 *
 * @example
 * With column constraints:
 * ```tsx
 * <MasonryLayout
 *   columnWidth={200}
 *   gap={24}
 *   minColumns={2}
 *   maxColumns={5}
 * >
 *   {cards.map(card => (
 *     <Card key={card.id} {...card} />
 *   ))}
 * </MasonryLayout>
 * ```
 */
export const MasonryLayout = forwardRef<HTMLDivElement, MasonryLayoutProps>(
  (
    {
      columnWidth = 250,
      gap = 16,
      maxColumns,
      minColumns = 1,
      animationDuration = 250,
      animationEasing = 'ease-out',
      onColumnCountChange,
      children,
      className,
      style,
      'data-testid': testId,
      'aria-label': ariaLabel,
      ...restProps
    },
    ref
  ) => {
    const [columnCount, setColumnCount] = useState(1);
    const [positions, setPositions] = useState<Map<number, ItemPosition>>(new Map());
    const [containerHeight, setContainerHeight] = useState(0);
    const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());
    const onColumnCountChangeRef = useRef(onColumnCountChange);

    useEffect(() => {
      onColumnCountChangeRef.current = onColumnCountChange;
    }, [onColumnCountChange]);

    const { ref: containerRef, width: containerWidth } = useResizeObserver();

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

    // Calculate column count based on container width
    useEffect(() => {
      if (containerWidth <= 0) {
        return;
      }

      // Calculate how many columns fit
      // Formula: width >= n * columnWidth + (n-1) * gap
      let calculatedColumns = Math.floor((containerWidth + gap) / (columnWidth + gap));

      // Apply constraints
      calculatedColumns = Math.max(minColumns, calculatedColumns);
      if (maxColumns !== undefined) {
        calculatedColumns = Math.min(maxColumns, calculatedColumns);
      }
      calculatedColumns = Math.max(1, calculatedColumns);

      if (calculatedColumns !== columnCount) {
        setColumnCount(calculatedColumns);
        onColumnCountChangeRef.current?.(calculatedColumns);
      }
    }, [containerWidth, columnWidth, gap, minColumns, maxColumns, columnCount]);

    // Calculate item positions
    useEffect(() => {
      if (containerWidth <= 0 || columnCount <= 0) {
        return;
      }

      const childArray = Children.toArray(children);
      const actualColumnWidth = (containerWidth - (columnCount - 1) * gap) / columnCount;

      // Track the bottom of each column
      const columnHeights = new Array(columnCount).fill(0);
      const newPositions = new Map<number, ItemPosition>();

      childArray.forEach((_, index) => {
        // Find the shortest column
        const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
        const left = shortestColumn * (actualColumnWidth + gap);
        const top = columnHeights[shortestColumn];

        newPositions.set(index, {
          left,
          top,
          width: actualColumnWidth,
        });

        // Get actual item height from ref
        const itemElement = itemRefs.current.get(index);
        const itemHeight = itemElement?.offsetHeight ?? 0;

        columnHeights[shortestColumn] = top + itemHeight + gap;
      });

      setPositions(newPositions);
      setContainerHeight(Math.max(...columnHeights) - gap);
    }, [children, containerWidth, columnCount, gap]);

    // Re-calculate positions when items resize
    useEffect(() => {
      if (typeof window === 'undefined') {
        return;
      }

      const observers: ResizeObserver[] = [];

      itemRefs.current.forEach((element) => {
        const observer = new ResizeObserver(() => {
          // Trigger recalculation
          const childArray = Children.toArray(children);
          if (containerWidth <= 0 || columnCount <= 0) {
            return;
          }

          const actualColumnWidth = (containerWidth - (columnCount - 1) * gap) / columnCount;
          const columnHeights = new Array(columnCount).fill(0);
          const newPositions = new Map<number, ItemPosition>();

          childArray.forEach((_, index) => {
            const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
            const left = shortestColumn * (actualColumnWidth + gap);
            const top = columnHeights[shortestColumn];

            newPositions.set(index, {
              left,
              top,
              width: actualColumnWidth,
            });

            const itemElement = itemRefs.current.get(index);
            const itemHeight = itemElement?.offsetHeight ?? 0;
            columnHeights[shortestColumn] = top + itemHeight + gap;
          });

          setPositions(newPositions);
          setContainerHeight(Math.max(...columnHeights) - gap);
        });

        observer.observe(element);
        observers.push(observer);
      });

      return () => {
        observers.forEach((observer) => observer.disconnect());
      };
    }, [children, containerWidth, columnCount, gap]);

    const setItemRef = useCallback((index: number, node: HTMLDivElement | null) => {
      if (node) {
        itemRefs.current.set(index, node);
      } else {
        itemRefs.current.delete(index);
      }
    }, []);

    const componentClasses = [styles.masonryLayout, className].filter(Boolean).join(' ');

    const cssVariables = {
      '--masonry-gap': `${gap}px`,
      '--masonry-animation-duration': `${animationDuration}ms`,
      '--masonry-animation-easing': animationEasing,
      ...style,
    } as React.CSSProperties;

    return (
      <div
        ref={setRefs}
        className={componentClasses}
        style={{
          ...cssVariables,
          height: containerHeight > 0 ? containerHeight : 'auto',
        }}
        data-component="masonry-layout"
        data-columns={columnCount}
        data-testid={testId}
        aria-label={ariaLabel}
        {...restProps}
      >
        {Children.map(children, (child, index) => {
          if (!isValidElement(child)) {
            return child;
          }

          const position = positions.get(index);
          const itemStyle: React.CSSProperties = position
            ? {
                position: 'absolute',
                left: position.left,
                top: position.top,
                width: position.width,
              }
            : {
                position: 'absolute',
                opacity: 0,
              };

          return (
            <div
              ref={(node) => setItemRef(index, node)}
              className={styles.masonryItem}
              style={itemStyle}
              data-index={index}
            >
              {child}
            </div>
          );
        })}
      </div>
    );
  }
);

MasonryLayout.displayName = 'MasonryLayout';

export default MasonryLayout;
