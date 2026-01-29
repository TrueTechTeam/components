/**
 * KanbanColumn component - Individual column within a KanbanBoard
 */

import React, { forwardRef, useCallback, type ReactNode } from 'react';
import type { BaseComponentProps } from '../../../types/component.types';
import { useKanbanBoardContextOptional } from './KanbanBoardContext';
import { useDroppable, useSortable } from '../hooks';
import styles from './KanbanBoard.module.scss';

export interface KanbanColumnProps extends BaseComponentProps {
  /**
   * Unique identifier for this column
   */
  id: string;

  /**
   * Index of this column in the board
   */
  index: number;

  /**
   * Column title
   */
  title?: string;

  /**
   * Custom header content
   */
  header?: ReactNode;

  /**
   * Whether this column is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional data associated with this column
   */
  data?: Record<string, unknown>;
}

/**
 * KanbanColumn component for use within KanbanBoard
 *
 * @example
 * ```tsx
 * <KanbanColumn id="todo" index={0} title="To Do">
 *   <KanbanCard id="card-1" columnId="todo" index={0}>
 *     Card content
 *   </KanbanCard>
 * </KanbanColumn>
 * ```
 */
export const KanbanColumn = forwardRef<HTMLDivElement, KanbanColumnProps>(
  (
    {
      id,
      index,
      title,
      header,
      disabled = false,
      children,
      className,
      'data-testid': dataTestId,
      'aria-label': ariaLabel,
      style,
      data = {},
    },
    ref
  ) => {
    const boardContext = useKanbanBoardContextOptional();
    const isDisabled = disabled || boardContext?.disabled;
    const allowColumnReorder = boardContext?.allowColumnReorder ?? false;

    // Use sortable if column reordering is allowed
    const sortable = useSortable({
      id: `column-${id}`,
      index,
      data: { ...data, type: 'kanban-column', columnId: id },
      disabled: isDisabled || !allowColumnReorder,
      groupId: 'kanban-columns',
    });

    // Use droppable for the column body (drop zone for cards)
    const droppable = useDroppable({
      id: `column-drop-${id}`,
      data: { type: 'kanban-column-drop', columnId: id },
      disabled: isDisabled,
      accepts: ['kanban-card'],
    });

    // Combine refs
    const handleRef = useCallback(
      (node: HTMLElement | null) => {
        sortable.setNodeRef(node);
        if (typeof ref === 'function') {
          ref(node as HTMLDivElement);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node as HTMLDivElement;
        }
      },
      [ref, sortable]
    );

    const handleDropZoneRef = useCallback(
      (node: HTMLElement | null) => {
        droppable.setNodeRef(node);
      },
      [droppable]
    );

    // Column width
    const columnWidth = boardContext?.columnWidth ?? 280;
    const widthStyle =
      columnWidth === 'auto'
        ? { minWidth: '200px', flex: '1 1 auto' }
        : columnWidth === 'equal'
          ? { flex: '1 1 0' }
          : { width: `${columnWidth}px`, flexShrink: 0 };

    const containerClasses = [styles.kanbanColumn, className].filter(Boolean).join(' ');

    const columnAttributes = allowColumnReorder ? sortable.attributes : {};
    const columnListeners = allowColumnReorder ? sortable.listeners : {};

    return (
      <div
        ref={handleRef}
        className={containerClasses}
        style={{ ...style, ...widthStyle, ...sortable.style }}
        data-testid={dataTestId}
        aria-label={ariaLabel || title}
        data-column-id={id}
        data-dragging={sortable.isDragging || undefined}
        data-over={droppable.isOver || undefined}
        {...columnAttributes}
        {...columnListeners}
      >
        {/* Column header */}
        {(title || header) && (
          <div className={styles.columnHeader}>
            {header || <h3 className={styles.columnTitle}>{title}</h3>}
          </div>
        )}

        {/* Column body (drop zone) */}
        <div
          ref={handleDropZoneRef}
          className={styles.columnBody}
          {...droppable.attributes}
          {...droppable.listeners}
          data-over={droppable.isOver || undefined}
        >
          {children}

          {/* Empty state indicator */}
          {!React.Children.count(children) && (
            <div className={styles.emptyColumn}>Drop items here</div>
          )}
        </div>
      </div>
    );
  }
);

KanbanColumn.displayName = 'KanbanColumn';

export default KanbanColumn;

