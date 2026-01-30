/**
 * SortableGrid component - Grid layout with drag and drop reordering
 */

import React, { useCallback, type ReactNode } from 'react';
import { DndProvider, type DragEndEvent } from '../DndProvider';
import { SortableGridItem, type SortableGridItemRenderProps } from './SortableGridItem';
import type { BaseComponentProps, ComponentSize } from '../../../types/component.types';
import styles from './SortableGrid.module.scss';

/**
 * Item type for SortableGrid
 */
export interface SortableGridItemData {
  /**
   * Unique identifier for the item
   */
  id: string;

  /**
   * Additional item data
   */
  [key: string]: unknown;
}

export interface SortableGridProps<T extends SortableGridItemData>
  extends Omit<BaseComponentProps, 'onChange' | 'children'> {
  /**
   * Items to render
   */
  items: T[];

  /**
   * Callback when items are reordered
   */
  onReorder?: (items: T[]) => void;

  /**
   * Render function for each item
   */
  renderItem: (item: T, props: SortableGridItemRenderProps) => ReactNode;

  /**
   * Number of columns
   * @default 'auto'
   */
  columns?: number | 'auto';

  /**
   * Minimum item width (for auto columns)
   * @default 150
   */
  minItemWidth?: number;

  /**
   * Gap between items
   * @default 'md'
   */
  gap?: ComponentSize | number;

  /**
   * Whether the grid is disabled
   * @default false
   */
  disabled?: boolean;
}

/**
 * SortableGrid component for creating reorderable grid layouts
 *
 * @example
 * ```tsx
 * const [items, setItems] = useState([
 *   { id: '1', image: '/img1.jpg' },
 *   { id: '2', image: '/img2.jpg' },
 *   { id: '3', image: '/img3.jpg' },
 * ]);
 *
 * <SortableGrid
 *   items={items}
 *   onReorder={setItems}
 *   columns={3}
 *   renderItem={(item, { isDragging }) => (
 *     <img src={item.image} data-dragging={isDragging} />
 *   )}
 * />
 * ```
 */
export function SortableGrid<T extends SortableGridItemData>({
  items,
  onReorder,
  renderItem,
  columns = 'auto',
  minItemWidth = 150,
  gap = 'md',
  disabled = false,
  className,
  'data-testid': dataTestId,
  'aria-label': ariaLabel,
  style,
}: SortableGridProps<T>) {
  // Handle drag end
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) {
        return;
      }

      const fromIndex = active.data.index as number;
      const toIndex = over.data.index as number;

      if (typeof fromIndex !== 'number' || typeof toIndex !== 'number') {
        return;
      }

      const newItems = [...items];
      const [movedItem] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, movedItem);

      onReorder?.(newItems);
    },
    [items, onReorder]
  );

  // Calculate gap value
  const gapValue = typeof gap === 'number' ? `${gap}px` : `var(--spacing-${gap})`;

  // Calculate grid template
  const gridTemplate =
    columns === 'auto'
      ? `repeat(auto-fill, minmax(${minItemWidth}px, 1fr))`
      : `repeat(${columns}, minmax(${minItemWidth}px, 1fr))`;

  const containerClasses = [styles.sortableGrid, className].filter(Boolean).join(' ');

  const containerStyle: React.CSSProperties = {
    ...style,
    '--grid-gap': gapValue,
    '--grid-template': gridTemplate,
  } as React.CSSProperties;

  return (
    <DndProvider onDragEnd={handleDragEnd}>
      <div
        className={containerClasses}
        style={containerStyle}
        data-testid={dataTestId}
        data-disabled={disabled || undefined}
        role="grid"
        aria-label={ariaLabel || 'Sortable grid'}
      >
        {items.map((item, index) => (
          <SortableGridItem
            key={item.id}
            id={item.id}
            index={index}
            disabled={disabled}
            data={item}
          >
            {(renderProps) => renderItem(item, renderProps)}
          </SortableGridItem>
        ))}
      </div>
    </DndProvider>
  );
}

SortableGrid.displayName = 'SortableGrid';

export default SortableGrid;
