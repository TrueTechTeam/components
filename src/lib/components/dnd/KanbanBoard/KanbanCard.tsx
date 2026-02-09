/**
 * KanbanCard component - Individual card within a KanbanColumn
 */

import React, { useCallback, type ReactNode, type DragEvent } from 'react';
import type { BaseComponentProps } from '../../../types/component.types';
import { useKanbanBoardContextOptional } from './KanbanBoardContext';
import { useSortable } from '../hooks';
import styles from './KanbanBoard.module.scss';

/**
 * Props passed to renderCard function
 */
export interface KanbanCardRenderProps {
  /**
   * Whether this card is being dragged
   */
  isDragging: boolean;

  /**
   * Whether another card is being dragged over this card
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
   * Column ID this card belongs to
   */
  columnId: string;

  /**
   * Index of the card in the column
   */
  index: number;
}

export interface KanbanCardProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Unique identifier for this card
   */
  id: string;

  /**
   * ID of the column this card belongs to
   */
  columnId: string;

  /**
   * Index of this card in the column
   */
  index: number;

  /**
   * Whether this card is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional data associated with this card
   */
  data?: Record<string, unknown>;

  /**
   * Card content - can be a ReactNode or a render function
   */
  children?: ReactNode | ((props: KanbanCardRenderProps) => ReactNode);
}

/**
 * KanbanCard component for use within KanbanColumn
 *
 * @example
 * ```tsx
 * <KanbanCard id="card-1" columnId="todo" index={0}>
 *   {({ isDragging }) => (
 *     <div data-dragging={isDragging}>Card content</div>
 *   )}
 * </KanbanCard>
 * ```
 */
export const KanbanCard = ({
  ref,
  id,
  columnId,
  index,
  disabled = false,
  children,
  className,
  'data-testid': dataTestId,
  'aria-label': ariaLabel,
  style,
  data = {},
}: KanbanCardProps & {
  ref?: React.Ref<HTMLDivElement>;
}) => {
  const boardContext = useKanbanBoardContextOptional();
  const isDisabled = disabled || boardContext?.disabled;

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
    data: { ...data, type: 'kanban-card', columnId },
    disabled: isDisabled,
    groupId: 'kanban-cards', // All cards can move between columns
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

  // Drag handle props
  const dragHandleProps = boardContext?.useDragHandle
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

  // Item listeners
  const cardListeners = boardContext?.useDragHandle
    ? {
        onDragEnter: listeners.onDragEnter,
        onDragLeave: listeners.onDragLeave,
        onDragOver: listeners.onDragOver,
        onDrop: listeners.onDrop,
      }
    : listeners;

  const cardAttributes = boardContext?.useDragHandle
    ? { ...attributes, draggable: false }
    : attributes;

  // Render props
  const renderProps: KanbanCardRenderProps = {
    isDragging,
    isOver,
    dragHandleProps,
    columnId,
    index,
  };

  const content =
    typeof children === 'function'
      ? (children as (props: KanbanCardRenderProps) => ReactNode)(renderProps)
      : children;

  const containerClasses = [styles.kanbanCard, className].filter(Boolean).join(' ');

  return (
    <div
      ref={handleRef}
      className={containerClasses}
      style={{ ...style, ...sortableStyle }}
      data-testid={dataTestId}
      aria-label={ariaLabel}
      data-card-id={id}
      data-column-id={columnId}
      {...cardAttributes}
      {...cardListeners}
    >
      {content}
    </div>
  );
};

export default KanbanCard;
