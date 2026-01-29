/**
 * KanbanBoard context for sharing state across kanban components
 */

import { createContext, useContext } from 'react';

/**
 * Card move event data
 */
export interface CardMoveEvent {
  cardId: string;
  fromColumnId: string;
  toColumnId: string;
  fromIndex: number;
  toIndex: number;
}

/**
 * KanbanBoard context value
 */
export interface KanbanBoardContextValue {
  /**
   * Whether column reordering is allowed
   */
  allowColumnReorder: boolean;

  /**
   * Whether to use drag handles for cards
   */
  useDragHandle: boolean;

  /**
   * Whether the board is disabled
   */
  disabled: boolean;

  /**
   * Column width
   */
  columnWidth: number | 'auto' | 'equal';

  /**
   * Callback when a card is moved
   */
  onCardMove: (event: CardMoveEvent) => void;

  /**
   * Callback when columns are reordered
   */
  onColumnReorder: (fromIndex: number, toIndex: number) => void;

  /**
   * Get the ID of the currently dragged card
   */
  getActiveCardId: () => string | null;

  /**
   * Get the ID of the column being dragged over
   */
  getOverColumnId: () => string | null;
}

/**
 * KanbanBoard context
 */
export const KanbanBoardContext = createContext<KanbanBoardContextValue | null>(null);

/**
 * Hook to access KanbanBoard context (throws if not in provider)
 */
export function useKanbanBoardContext(): KanbanBoardContextValue {
  const context = useContext(KanbanBoardContext);

  if (!context) {
    throw new Error('useKanbanBoardContext must be used within a KanbanBoard');
  }

  return context;
}

/**
 * Hook to access KanbanBoard context (returns null if not in provider)
 */
export function useKanbanBoardContextOptional(): KanbanBoardContextValue | null {
  return useContext(KanbanBoardContext);
}
