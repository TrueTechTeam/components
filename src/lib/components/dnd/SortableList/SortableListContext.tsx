/**
 * SortableList context for sharing state across sortable components
 */

import { createContext, useContext } from 'react';
import type { DragData } from '../DndProvider';

/**
 * SortableList context value
 */
export interface SortableListContextValue {
  /**
   * Direction of the list
   */
  direction: 'vertical' | 'horizontal';

  /**
   * Whether to use drag handles
   */
  useDragHandle: boolean;

  /**
   * Group ID for cross-list sorting
   */
  groupId?: string;

  /**
   * Whether the list is disabled
   */
  disabled: boolean;

  /**
   * Callback when an item is moved
   */
  onItemMove: (fromIndex: number, toIndex: number) => void;

  /**
   * Get the current active drag data
   */
  getActiveData: () => DragData | null;
}

/**
 * SortableList context
 */
export const SortableListContext = createContext<SortableListContextValue | null>(null);

/**
 * Hook to access SortableList context (throws if not in provider)
 */
export function useSortableListContext(): SortableListContextValue {
  const context = useContext(SortableListContext);

  if (!context) {
    throw new Error('useSortableListContext must be used within a SortableList');
  }

  return context;
}

/**
 * Hook to access SortableList context (returns null if not in provider)
 */
export function useSortableListContextOptional(): SortableListContextValue | null {
  return useContext(SortableListContext);
}
