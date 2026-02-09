/**
 * KanbanBoard component - Multi-column board with drag and drop
 */

import React, { useCallback, useMemo, type ReactNode } from 'react';
import { DndProvider, useDndContext, type DragEndEvent } from '../DndProvider';
import {
  KanbanBoardContext,
  type KanbanBoardContextValue,
  type CardMoveEvent,
} from './KanbanBoardContext';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard, type KanbanCardRenderProps } from './KanbanCard';
import type { BaseComponentProps, ComponentSize } from '../../../types/component.types';
import styles from './KanbanBoard.module.scss';

/**
 * Card data type
 */
export interface KanbanCardData {
  /**
   * Unique identifier for the card
   */
  id: string;

  /**
   * Additional card data
   */
  [key: string]: unknown;
}

/**
 * Column data type
 */
export interface KanbanColumnData {
  /**
   * Unique identifier for the column
   */
  id: string;

  /**
   * Column title
   */
  title: string;

  /**
   * Cards in this column
   */
  items: KanbanCardData[];

  /**
   * Additional column data
   */
  [key: string]: unknown;
}

export interface KanbanBoardProps<T extends KanbanCardData>
  extends Omit<BaseComponentProps, 'onChange' | 'children'> {
  /**
   * Columns configuration
   */
  columns: KanbanColumnData[];

  /**
   * Callback when a card is moved
   */
  onCardMove?: (
    cardId: string,
    fromColumnId: string,
    toColumnId: string,
    fromIndex: number,
    toIndex: number
  ) => void;

  /**
   * Callback when columns are reordered
   */
  onColumnReorder?: (columns: KanbanColumnData[]) => void;

  /**
   * Render function for each card
   */
  renderCard: (card: T, props: KanbanCardRenderProps) => ReactNode;

  /**
   * Render function for column header
   */
  renderColumnHeader?: (column: KanbanColumnData) => ReactNode;

  /**
   * Gap between columns
   * @default 'md'
   */
  columnGap?: ComponentSize | number;

  /**
   * Gap between cards within a column
   * @default 'sm'
   */
  cardGap?: ComponentSize | number;

  /**
   * Column width
   * @default 280
   */
  columnWidth?: number | 'auto' | 'equal';

  /**
   * Minimum column height
   * @default 200
   */
  minColumnHeight?: number;

  /**
   * Whether columns can be reordered
   * @default false
   */
  allowColumnReorder?: boolean;

  /**
   * Whether to use drag handles for cards
   * @default false
   */
  useDragHandle?: boolean;

  /**
   * Whether the board is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Horizontal scroll behavior
   * @default 'scroll'
   */
  overflowBehavior?: 'scroll' | 'wrap' | 'none';
}

/**
 * Inner component that uses DnD context
 */
function KanbanBoardInner<T extends KanbanCardData>({
  columns,
  onCardMove,
  onColumnReorder,
  renderCard,
  renderColumnHeader,
  columnGap = 'md',
  cardGap = 'sm',
  columnWidth = 280,
  minColumnHeight = 200,
  allowColumnReorder = false,
  useDragHandle = false,
  disabled = false,
  overflowBehavior = 'scroll',
  className,
  'data-testid': dataTestId,
  'aria-label': ariaLabel,
  style,
}: KanbanBoardProps<T>) {
  const { active, overId } = useDndContext();

  // Get active card ID
  const getActiveCardId = useCallback((): string | null => {
    if (active?.data.type === 'kanban-card') {
      return active.id;
    }
    return null;
  }, [active]);

  // Get over column ID
  const getOverColumnId = useCallback((): string | null => {
    if (!overId) {
      return null;
    }

    // Extract column ID from overId
    if (overId.startsWith('column-drop-')) {
      return overId.replace('column-drop-', '');
    }

    return null;
  }, [overId]);

  // Handle card move
  const handleCardMove = useCallback(
    (event: CardMoveEvent) => {
      onCardMove?.(
        event.cardId,
        event.fromColumnId,
        event.toColumnId,
        event.fromIndex,
        event.toIndex
      );
    },
    [onCardMove]
  );

  // Handle column reorder
  const handleColumnReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) {
        return;
      }

      const newColumns = [...columns];
      const [movedColumn] = newColumns.splice(fromIndex, 1);
      newColumns.splice(toIndex, 0, movedColumn);

      onColumnReorder?.(newColumns);
    },
    [columns, onColumnReorder]
  );

  // Context value
  const contextValue: KanbanBoardContextValue = useMemo(
    () => ({
      allowColumnReorder,
      useDragHandle,
      disabled,
      columnWidth,
      onCardMove: handleCardMove,
      onColumnReorder: handleColumnReorder,
      getActiveCardId,
      getOverColumnId,
    }),
    [
      allowColumnReorder,
      useDragHandle,
      disabled,
      columnWidth,
      handleCardMove,
      handleColumnReorder,
      getActiveCardId,
      getOverColumnId,
    ]
  );

  // Calculate gap values
  const columnGapValue =
    typeof columnGap === 'number' ? `${columnGap}px` : `var(--spacing-${columnGap})`;
  const cardGapValue = typeof cardGap === 'number' ? `${cardGap}px` : `var(--spacing-${cardGap})`;

  const containerClasses = [styles.kanbanBoard, className].filter(Boolean).join(' ');

  const containerStyle: React.CSSProperties = {
    ...style,
    '--kanban-column-gap': columnGapValue,
    '--kanban-card-gap': cardGapValue,
    '--kanban-min-column-height': `${minColumnHeight}px`,
  } as React.CSSProperties;

  return (
    <KanbanBoardContext.Provider value={contextValue}>
      <div
        className={containerClasses}
        style={containerStyle}
        data-testid={dataTestId}
        data-overflow={overflowBehavior}
        data-disabled={disabled || undefined}
        role="region"
        aria-label={ariaLabel || 'Kanban board'}
      >
        {columns.map((column, columnIndex) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            index={columnIndex}
            title={column.title}
            header={renderColumnHeader?.(column)}
            disabled={disabled}
          >
            {column.items.map((card, cardIndex) => (
              <KanbanCard
                key={card.id}
                id={card.id}
                columnId={column.id}
                index={cardIndex}
                disabled={disabled}
                data={card}
              >
                {(renderProps) => renderCard(card as T, renderProps)}
              </KanbanCard>
            ))}
          </KanbanColumn>
        ))}
      </div>
    </KanbanBoardContext.Provider>
  );
}

/**
 * KanbanBoard component for creating kanban-style boards
 *
 * @example
 * ```tsx
 * const [columns, setColumns] = useState([
 *   { id: 'todo', title: 'To Do', items: [{ id: '1', title: 'Task 1' }] },
 *   { id: 'doing', title: 'In Progress', items: [] },
 *   { id: 'done', title: 'Done', items: [] },
 * ]);
 *
 * <KanbanBoard
 *   columns={columns}
 *   onCardMove={(cardId, fromCol, toCol, fromIdx, toIdx) => {
 *     // Update columns state
 *   }}
 *   renderCard={(card, { isDragging }) => (
 *     <div data-dragging={isDragging}>{card.title}</div>
 *   )}
 * />
 * ```
 */
export function KanbanBoard<T extends KanbanCardData>(props: KanbanBoardProps<T>) {
  const { columns, onCardMove, onColumnReorder } = props;

  // Handle drag end
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) {
        return;
      }

      const activeData = active.data;
      const overData = over.data;

      // Handle card movement
      if (activeData.type === 'kanban-card') {
        const cardId = active.id;
        const fromColumnId = activeData.columnId as string;
        const fromIndex = activeData.index as number;

        let toColumnId: string;
        let toIndex: number;

        if (overData.type === 'kanban-card') {
          // Dropped on another card
          toColumnId = overData.columnId as string;
          toIndex = overData.index as number;

          // If same column and moving down, adjust index
          if (fromColumnId === toColumnId && fromIndex < toIndex) {
            toIndex--;
          }
        } else if (overData.type === 'kanban-column-drop') {
          // Dropped on column (empty area)
          toColumnId = overData.columnId as string;
          const column = columns.find((c) => c.id === toColumnId);
          toIndex = column?.items.length ?? 0;
        } else {
          return;
        }

        if (fromColumnId !== toColumnId || fromIndex !== toIndex) {
          onCardMove?.(cardId, fromColumnId, toColumnId, fromIndex, toIndex);
        }
      }

      // Handle column reordering
      if (activeData.type === 'kanban-column') {
        const fromIndex = activeData.index as number;

        if (overData.type === 'kanban-column') {
          const toIndex = overData.index as number;

          if (fromIndex !== toIndex) {
            const newColumns = [...columns];
            const [movedColumn] = newColumns.splice(fromIndex, 1);
            newColumns.splice(toIndex, 0, movedColumn);
            onColumnReorder?.(newColumns);
          }
        }
      }
    },
    [columns, onCardMove, onColumnReorder]
  );

  return (
    <DndProvider onDragEnd={handleDragEnd}>
      <KanbanBoardInner {...props} />
    </DndProvider>
  );
}

export default KanbanBoard;
