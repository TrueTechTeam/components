/**
 * SortableItem component - Individual item within a SortableList
 */

import React, { forwardRef, type ReactNode, useCallback, type DragEvent } from 'react';
import type { BaseComponentProps } from '../../../types/component.types';
import { useSortableListContextOptional } from './SortableListContext';
import { useSortable } from '../hooks';
import styles from './SortableList.module.scss';

/**
 * Props passed to renderItem function
 */
export interface SortableItemRenderProps {
  /**
   * Whether this item is being dragged
   */
  isDragging: boolean;

  /**
   * Whether another item is being dragged over this item
   */
  isOver: boolean;

  /**
   * Props to spread on a drag handle element
   */
  dragHandleProps?: {
    draggable: boolean;
    onDragStart: (event: DragEvent<HTMLElement>) => void;
    onDragEnd: (event: DragEvent<HTMLElement>) => void;
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
    role: string;
    tabIndex: number;
    'aria-grabbed': boolean;
  };

  /**
   * Index of the item in the list
   */
  index: number;
}

export interface SortableItemProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Unique identifier for this item
   */
  id: string;

  /**
   * Index of this item in the list
   */
  index: number;

  /**
   * Whether this item is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Element to render as
   * @default 'div'
   */
  as?: React.ElementType;

  /**
   * Data associated with this item
   */
  data?: Record<string, unknown>;

  /**
   * Content to render - can be a ReactNode or a render function
   */
  children?: ReactNode | ((props: SortableItemRenderProps) => ReactNode);
}

/**
 * SortableItem component for use within SortableList
 *
 * @example
 * ```tsx
 * <SortableItem id="item-1" index={0}>
 *   {({ isDragging, dragHandleProps }) => (
 *     <>
 *       <DragHandle {...dragHandleProps} />
 *       <span>Item content</span>
 *     </>
 *   )}
 * </SortableItem>
 * ```
 */
export const SortableItem = forwardRef<HTMLElement, SortableItemProps>(
  (
    {
      id,
      index,
      disabled = false,
      as: Component = 'div',
      children,
      className,
      'data-testid': dataTestId,
      'aria-label': ariaLabel,
      style,
      data = {},
    },
    ref
  ) => {
    const listContext = useSortableListContextOptional();
    const isDisabled = disabled || listContext?.disabled;

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
      data: { ...data, type: 'sortable-item' },
      disabled: isDisabled,
      groupId: listContext?.groupId,
    });

    // Create ref callback that handles both refs
    const handleRef = useCallback(
      (node: HTMLElement | null) => {
        setNodeRef(node);
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLElement | null>).current = node;
        }
      },
      [ref, setNodeRef]
    );

    // Drag handle props for when useDragHandle is true
    const dragHandleProps = listContext?.useDragHandle
      ? {
          draggable: !isDisabled,
          onDragStart: listeners.onDragStart,
          onDragEnd: listeners.onDragEnd,
          onKeyDown: listeners.onKeyDown,
          role: 'button',
          tabIndex: isDisabled ? -1 : 0,
          'aria-grabbed': isDragging,
        }
      : undefined;

    // If using drag handles, don't make the whole item draggable
    const itemListeners = listContext?.useDragHandle
      ? {
          onDragEnter: listeners.onDragEnter,
          onDragLeave: listeners.onDragLeave,
          onDragOver: listeners.onDragOver,
          onDrop: listeners.onDrop,
        }
      : listeners;

    const itemAttributes = listContext?.useDragHandle
      ? {
          ...attributes,
          draggable: false,
        }
      : attributes;

    // Render children with render props
    const renderProps: SortableItemRenderProps = {
      isDragging,
      isOver,
      dragHandleProps,
      index,
    };

    const content =
      typeof children === 'function'
        ? (children as (props: SortableItemRenderProps) => ReactNode)(renderProps)
        : children;

    const containerClasses = [styles.sortableItem, className].filter(Boolean).join(' ');

    return (
      <Component
        ref={handleRef}
        className={containerClasses}
        style={{ ...style, ...sortableStyle }}
        data-testid={dataTestId}
        aria-label={ariaLabel}
        {...itemAttributes}
        {...itemListeners}
      >
        {content}
      </Component>
    );
  }
);

SortableItem.displayName = 'SortableItem';

export default SortableItem;
