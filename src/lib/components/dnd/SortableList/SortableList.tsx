/**
 * SortableList component - Reorderable list with drag and drop
 */

import React, { useCallback, useMemo, type ReactNode } from 'react';
import { DndProvider, useDndContext, type DragEndEvent, type DragData } from '../DndProvider';
import { SortableListContext, type SortableListContextValue } from './SortableListContext';
import { SortableItem, type SortableItemRenderProps } from './SortableItem';
import type { BaseComponentProps, ComponentSize } from '../../../types/component.types';
import styles from './SortableList.module.scss';

/**
 * Item type for SortableList
 */
export interface SortableListItem {
  /**
   * Unique identifier for the item
   */
  id: string;

  /**
   * Additional item data
   */
  [key: string]: unknown;
}

export interface SortableListProps<T extends SortableListItem>
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
   * Callback when reorder completes (with from/to indices)
   */
  onReorderComplete?: (items: T[], fromIndex: number, toIndex: number) => void;

  /**
   * Render function for each item
   */
  renderItem: (item: T, props: SortableItemRenderProps) => ReactNode;

  /**
   * Gap between items
   * @default 'md'
   */
  gap?: ComponentSize | number;

  /**
   * Sorting direction
   * @default 'vertical'
   */
  direction?: 'vertical' | 'horizontal';

  /**
   * Group ID for cross-list drag
   */
  groupId?: string;

  /**
   * Whether to use drag handles (requires DragHandle in renderItem)
   * @default false
   */
  useDragHandle?: boolean;

  /**
   * Whether the list is disabled
   * @default false
   */
  disabled?: boolean;
}

/**
 * Inner component that uses DnD context
 */
function SortableListInner<T extends SortableListItem>({
  items,
  onReorder,
  onReorderComplete,
  renderItem,
  gap = 'md',
  direction = 'vertical',
  groupId,
  useDragHandle = false,
  disabled = false,
  className,
  'data-testid': dataTestId,
  'aria-label': ariaLabel,
  style,
}: SortableListProps<T>) {
  const { active } = useDndContext();

  // Handle item move
  const handleItemMove = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) {
        return;
      }

      const newItems = [...items];
      const [movedItem] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, movedItem);

      onReorder?.(newItems);
      onReorderComplete?.(newItems, fromIndex, toIndex);
    },
    [items, onReorder, onReorderComplete]
  );

  // Get active data
  const getActiveData = useCallback((): DragData | null => {
    return active?.data || null;
  }, [active]);

  // Context value
  const contextValue: SortableListContextValue = useMemo(
    () => ({
      direction,
      useDragHandle,
      groupId,
      disabled,
      onItemMove: handleItemMove,
      getActiveData,
    }),
    [direction, useDragHandle, groupId, disabled, handleItemMove, getActiveData]
  );

  // Calculate gap value
  const gapValue =
    typeof gap === 'number'
      ? `${gap}px`
      : `var(--spacing-${gap})`;

  const containerClasses = [styles.sortableList, className].filter(Boolean).join(' ');

  const containerStyle: React.CSSProperties = {
    ...style,
    '--sortable-gap': gapValue,
  } as React.CSSProperties;

  return (
    <SortableListContext.Provider value={contextValue}>
      <div
        className={containerClasses}
        style={containerStyle}
        data-testid={dataTestId}
        data-direction={direction}
        data-disabled={disabled || undefined}
        role="list"
        aria-label={ariaLabel || 'Sortable list'}
      >
        {items.map((item, index) => (
          <SortableItem
            key={item.id}
            id={item.id}
            index={index}
            disabled={disabled}
            data={item}
          >
            {(renderProps) => renderItem(item, renderProps)}
          </SortableItem>
        ))}
      </div>
    </SortableListContext.Provider>
  );
}

/**
 * SortableList component for creating reorderable lists
 *
 * @example
 * ```tsx
 * const [items, setItems] = useState([
 *   { id: '1', name: 'Item 1' },
 *   { id: '2', name: 'Item 2' },
 *   { id: '3', name: 'Item 3' },
 * ]);
 *
 * <SortableList
 *   items={items}
 *   onReorder={setItems}
 *   renderItem={(item, { isDragging }) => (
 *     <div data-dragging={isDragging}>{item.name}</div>
 *   )}
 * />
 * ```
 *
 * @example with drag handle
 * ```tsx
 * <SortableList
 *   items={items}
 *   onReorder={setItems}
 *   useDragHandle
 *   renderItem={(item, { isDragging, dragHandleProps }) => (
 *     <div data-dragging={isDragging}>
 *       <DragHandle {...dragHandleProps} />
 *       <span>{item.name}</span>
 *     </div>
 *   )}
 * />
 * ```
 */
export function SortableList<T extends SortableListItem>(props: SortableListProps<T>) {
  const { items, onReorder, onReorderComplete, groupId } = props;

  // Handle drag end at the provider level
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) {
        return;
      }

      // Check if same group (or no group restriction)
      if (groupId && active.data.groupId !== over.data.groupId) {
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
      onReorderComplete?.(newItems, fromIndex, toIndex);
    },
    [items, onReorder, onReorderComplete, groupId]
  );

  return (
    <DndProvider onDragEnd={handleDragEnd}>
      <SortableListInner {...props} />
    </DndProvider>
  );
}

SortableList.displayName = 'SortableList';

export default SortableList;
