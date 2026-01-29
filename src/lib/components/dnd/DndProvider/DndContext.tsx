/**
 * DnD context for sharing drag state across components
 */

import { createContext, useContext } from 'react';

/**
 * Data attached to a draggable item
 */
export interface DragData {
  /** Unique identifier */
  id: string;
  /** Item type for filtering drop targets */
  type?: string;
  /** Index in list (for sortable) */
  index?: number;
  /** Additional custom data */
  [key: string]: unknown;
}

/**
 * Active drag state
 */
export interface ActiveDrag {
  /** ID of the dragged item */
  id: string;
  /** Data attached to the dragged item */
  data: DragData;
  /** Element being dragged */
  element: HTMLElement | null;
}

/**
 * DnD context value
 */
export interface DndContextValue {
  /** Currently active drag, null if nothing is being dragged */
  active: ActiveDrag | null;
  /** ID of the element currently being dragged over */
  overId: string | null;
  /** Data of the element currently being dragged over */
  overData: DragData | null;
  /** Set active drag state */
  setActive: (active: ActiveDrag | null) => void;
  /** Set over state */
  setOver: (id: string | null, data: DragData | null) => void;
  /** Register a droppable and return unregister function */
  registerDroppable: (id: string, data: DragData) => () => void;
  /** Get all registered droppables */
  getDroppables: () => Map<string, DragData>;
  /** Drag end callback */
  onDragEnd?: (event: DragEndEvent) => void;
}

/**
 * Event fired when drag ends
 */
export interface DragEndEvent {
  /** The dragged item */
  active: ActiveDrag;
  /** The drop target, null if dropped outside */
  over: { id: string; data: DragData } | null;
}

/**
 * Event fired when drag starts
 */
export interface DragStartEvent {
  /** The dragged item */
  active: ActiveDrag;
}

/**
 * Event fired when dragging over a droppable
 */
export interface DragOverEvent {
  /** The dragged item */
  active: ActiveDrag;
  /** The element being dragged over */
  over: { id: string; data: DragData };
}

/**
 * DnD context
 */
export const DndContext = createContext<DndContextValue | null>(null);

/**
 * Hook to access DnD context (throws if not in provider)
 */
export function useDndContext(): DndContextValue {
  const context = useContext(DndContext);

  if (!context) {
    throw new Error('useDndContext must be used within a DndProvider');
  }

  return context;
}

/**
 * Hook to access DnD context (returns null if not in provider)
 */
export function useDndContextOptional(): DndContextValue | null {
  return useContext(DndContext);
}
