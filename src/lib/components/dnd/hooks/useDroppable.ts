/**
 * useDroppable hook - makes an element a drop target using HTML5 Drag and Drop API
 */

import { useCallback, useRef, useEffect, useState, type DragEvent } from 'react';
import { useDndContext, type DragData, type ActiveDrag } from '../DndProvider';

export interface UseDroppableOptions {
  /**
   * Unique identifier for this droppable
   */
  id: string;

  /**
   * Data attached to this droppable (for validation/filtering)
   */
  data?: Omit<DragData, 'id'>;

  /**
   * Whether dropping is disabled
   */
  disabled?: boolean;

  /**
   * Types of draggables this droppable accepts (by type field in data)
   * If not specified, accepts all types
   */
  accepts?: string[];
}

export interface UseDroppableReturn {
  /**
   * Whether a draggable is currently over this droppable
   */
  isOver: boolean;

  /**
   * The currently active drag item (if any)
   */
  active: ActiveDrag | null;

  /**
   * Ref to attach to the droppable element
   */
  setNodeRef: (node: HTMLElement | null) => void;

  /**
   * Attributes to spread on the droppable element
   */
  attributes: {
    'aria-dropeffect': 'move' | 'none';
    'data-over': boolean;
  };

  /**
   * Event listeners to spread on the droppable element
   */
  listeners: {
    onDragEnter: (event: DragEvent<HTMLElement>) => void;
    onDragLeave: (event: DragEvent<HTMLElement>) => void;
    onDragOver: (event: DragEvent<HTMLElement>) => void;
    onDrop: (event: DragEvent<HTMLElement>) => void;
  };

  /**
   * The element node ref
   */
  node: HTMLElement | null;
}

/**
 * Hook to make an element a drop target
 *
 * @example
 * ```tsx
 * const { setNodeRef, attributes, listeners, isOver } = useDroppable({
 *   id: 'drop-zone-1',
 *   accepts: ['card'],
 * });
 *
 * return (
 *   <div ref={setNodeRef} {...attributes} {...listeners} data-over={isOver}>
 *     Drop here
 *   </div>
 * );
 * ```
 */
export function useDroppable(options: UseDroppableOptions): UseDroppableReturn {
  const { id, data = {}, disabled = false, accepts } = options;
  const { active, overId, setOver, registerDroppable } = useDndContext();
  const nodeRef = useRef<HTMLElement | null>(null);
  const [isOver, setIsOver] = useState(false);
  const dragEnterCountRef = useRef(0);

  // Register this droppable with the context
  useEffect(() => {
    const droppableData: DragData = { id, ...data };
    const unregister = registerDroppable(id, droppableData);
    return unregister;
  }, [id, data, registerDroppable]);

  // Sync isOver state with context
  useEffect(() => {
    setIsOver(overId === id);
  }, [overId, id]);

  const setNodeRef = useCallback((node: HTMLElement | null) => {
    nodeRef.current = node;
  }, []);

  // Check if we accept the dragged item
  const canAccept = useCallback(
    (dragData: DragData | null): boolean => {
      if (disabled) {
        return false;
      }
      if (!dragData) {
        return false;
      }
      if (!accepts || accepts.length === 0) {
        return true;
      }
      return dragData.type ? accepts.includes(dragData.type) : false;
    },
    [disabled, accepts]
  );

  const handleDragEnter = useCallback(
    (event: DragEvent<HTMLElement>) => {
      event.preventDefault();
      dragEnterCountRef.current++;

      if (active && canAccept(active.data)) {
        const droppableData: DragData = { id, ...data };
        setOver(id, droppableData);
      }
    },
    [id, data, active, canAccept, setOver]
  );

  const handleDragLeave = useCallback(
    (event: DragEvent<HTMLElement>) => {
      event.preventDefault();
      dragEnterCountRef.current--;

      // Only set over to null when we've left all nested elements
      if (dragEnterCountRef.current === 0) {
        if (overId === id) {
          setOver(null, null);
        }
      }
    },
    [id, overId, setOver]
  );

  const handleDragOver = useCallback(
    (event: DragEvent<HTMLElement>) => {
      event.preventDefault();

      if (active && canAccept(active.data)) {
        event.dataTransfer.dropEffect = 'move';
      } else {
        event.dataTransfer.dropEffect = 'none';
      }
    },
    [active, canAccept]
  );

  const handleDrop = useCallback((event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    dragEnterCountRef.current = 0;

    // The actual drop handling is done by the DndProvider's onDragEnd
    // which is triggered when setActive(null) is called
  }, []);

  const attributes = {
    'aria-dropeffect': (active && canAccept(active.data) ? 'move' : 'none') as 'move' | 'none',
    'data-over': isOver,
  };

  const listeners = {
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
    onDrop: handleDrop,
  };

  return {
    isOver,
    active,
    setNodeRef,
    attributes,
    listeners,
    node: nodeRef.current,
  };
}
