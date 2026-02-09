/**
 * SortableGridItem component - Individual item within a SortableGrid
 */

import React, { useCallback, type ReactNode } from 'react';
import type { BaseComponentProps } from '../../../types/component.types';
import { useSortable } from '../hooks';
import styles from './SortableGrid.module.scss';

/**
 * Props passed to renderItem function
 */
export interface SortableGridItemRenderProps {
  /**
   * Whether this item is being dragged
   */
  isDragging: boolean;

  /**
   * Whether another item is being dragged over this item
   */
  isOver: boolean;

  /**
   * Index of the item in the grid
   */
  index: number;
}

export interface SortableGridItemProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Unique identifier for this item
   */
  id: string;

  /**
   * Index of this item in the grid
   */
  index: number;

  /**
   * Whether this item is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Data associated with this item
   */
  data?: Record<string, unknown>;

  /**
   * Content to render - can be a ReactNode or a render function
   */
  children?: ReactNode | ((props: SortableGridItemRenderProps) => ReactNode);
}

/**
 * SortableGridItem component for use within SortableGrid
 */
export const SortableGridItem = ({
  ref,
  id,
  index,
  disabled = false,
  children,
  className,
  'data-testid': dataTestId,
  'aria-label': ariaLabel,
  style,
  data = {},
}: SortableGridItemProps & {
  ref?: React.Ref<HTMLDivElement>;
}) => {
  const {
    isDragging,
    isOver,
    setNodeRef,
    attributes,
    listeners,
    style: sortableStyle,
  } = useSortable({
    id,
    index,
    data: { ...data, type: 'grid-item' },
    disabled,
    groupId: 'sortable-grid',
  });

  // Create ref callback
  const handleRef = useCallback(
    (node: HTMLElement | null) => {
      setNodeRef(node);
      if (typeof ref === 'function') {
        ref(node as HTMLDivElement);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node as HTMLDivElement;
      }
    },
    [ref, setNodeRef]
  );

  // Render props
  const renderProps: SortableGridItemRenderProps = {
    isDragging,
    isOver,
    index,
  };

  const content =
    typeof children === 'function'
      ? (children as (props: SortableGridItemRenderProps) => ReactNode)(renderProps)
      : children;

  const containerClasses = [styles.sortableGridItem, className].filter(Boolean).join(' ');

  return (
    <div
      ref={handleRef}
      className={containerClasses}
      style={{ ...style, ...sortableStyle }}
      data-testid={dataTestId}
      {...attributes}
      {...listeners}
      aria-label={ariaLabel}
      role="gridcell"
    >
      {content}
    </div>
  );
};

export default SortableGridItem;
