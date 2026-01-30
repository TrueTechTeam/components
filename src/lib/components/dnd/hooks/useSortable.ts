/**
 * useSortable hook - combines draggable and droppable for sortable list items
 */

import { useCallback, useRef, useEffect, useMemo, type DragEvent } from 'react';
import { useDndContext, type DragData, type ActiveDrag } from '../DndProvider';

export interface UseSortableOptions {
  /**
   * Unique identifier for this sortable item
   */
  id: string;

  /**
   * Index of this item in the list
   */
  index: number;

  /**
   * Data attached to this sortable item
   */
  data?: Omit<DragData, 'id' | 'index'>;

  /**
   * Whether sorting is disabled
   */
  disabled?: boolean;

  /**
   * Group ID for cross-list sorting
   */
  groupId?: string;
}

export interface UseSortableReturn {
  /**
   * Whether this item is currently being dragged
   */
  isDragging: boolean;

  /**
   * Whether a draggable is currently over this item
   */
  isOver: boolean;

  /**
   * The currently active drag item (if any)
   */
  active: ActiveDrag | null;

  /**
   * Ref to attach to the sortable element
   */
  setNodeRef: (node: HTMLElement | null) => void;

  /**
   * Attributes to spread on the sortable element
   */
  attributes: {
    draggable: boolean;
    'aria-grabbed': boolean;
    'data-dragging': boolean;
    'data-over': boolean;
    role: string;
    tabIndex: number;
  };

  /**
   * Event listeners to spread on the sortable element
   */
  listeners: {
    onDragStart: (event: DragEvent<HTMLElement>) => void;
    onDragEnd: (event: DragEvent<HTMLElement>) => void;
    onDragEnter: (event: DragEvent<HTMLElement>) => void;
    onDragLeave: (event: DragEvent<HTMLElement>) => void;
    onDragOver: (event: DragEvent<HTMLElement>) => void;
    onDrop: (event: DragEvent<HTMLElement>) => void;
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
  };

  /**
   * CSS transform style for animation
   */
  style: {
    transition?: string;
    opacity?: number;
  };

  /**
   * Get the element node (use this instead of accessing node directly)
   */
  getNode: () => HTMLElement | null;
}

/**
 * Hook to make an element sortable (draggable and droppable)
 *
 * @example
 * ```tsx
 * const { setNodeRef, attributes, listeners, isDragging, isOver } = useSortable({
 *   id: 'item-1',
 *   index: 0,
 * });
 *
 * return (
 *   <div ref={setNodeRef} {...attributes} {...listeners}>
 *     Sortable item
 *   </div>
 * );
 * ```
 */
export function useSortable(options: UseSortableOptions): UseSortableReturn {
  const { id, index, data = {}, disabled = false, groupId } = options;
  const { active, overId, setActive, setOver, registerDroppable } = useDndContext();
  const nodeRef = useRef<HTMLElement | null>(null);
  const dragEnterCountRef = useRef(0);

  // Derive states directly from context
  const isDragging = useMemo(() => active?.id === id, [active, id]);
  const isOver = useMemo(() => overId === id && active?.id !== id, [overId, id, active]);

  // Build full data including index and group
  const fullData: DragData = useMemo(() => {
    const { type, ...rest } = data as DragData;
    return {
      ...rest,
      id,
      index,
      groupId,
      type: type || 'sortable-item',
    };
  }, [id, index, groupId, data]);

  // Register this item as a droppable
  useEffect(() => {
    const unregister = registerDroppable(id, fullData);
    return unregister;
  }, [id, fullData, registerDroppable]);

  const setNodeRef = useCallback((node: HTMLElement | null) => {
    nodeRef.current = node;
  }, []);

  // Check if we accept the dragged item (same group or no group restriction)
  const canAccept = useCallback(
    (dragData: DragData | null): boolean => {
      if (disabled) {
        return false;
      }
      if (!dragData) {
        return false;
      }
      if (dragData.id === id) {
        return false; // Can't drop on self
      }

      // If we have a groupId, only accept items from the same group
      if (groupId) {
        return dragData.groupId === groupId;
      }

      return true;
    },
    [disabled, id, groupId]
  );

  const handleDragStart = useCallback(
    (event: DragEvent<HTMLElement>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }

      event.dataTransfer.setData('application/json', JSON.stringify(fullData));
      event.dataTransfer.effectAllowed = 'move';

      if (nodeRef.current) {
        const rect = nodeRef.current.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        // Create a custom drag image with full opacity
        // The native drag ghost is too translucent, so we clone the element
        const dragImage = nodeRef.current.cloneNode(true) as HTMLElement;
        dragImage.style.position = 'absolute';
        dragImage.style.top = '-9999px';
        dragImage.style.left = '-9999px';
        dragImage.style.opacity = '1';
        dragImage.style.transform = 'none';
        dragImage.style.pointerEvents = 'none';
        document.body.appendChild(dragImage);

        event.dataTransfer.setDragImage(dragImage, offsetX, offsetY);

        // Clean up the drag image element after the drag starts
        requestAnimationFrame(() => {
          document.body.removeChild(dragImage);
        });
      }

      setActive({
        id,
        data: fullData,
        element: nodeRef.current,
      });
    },
    [id, fullData, disabled, setActive]
  );

  const handleDragEnd = useCallback(
    (_event: DragEvent<HTMLElement>) => {
      setActive(null);
    },
    [setActive]
  );

  const handleDragEnter = useCallback(
    (event: DragEvent<HTMLElement>) => {
      event.preventDefault();
      dragEnterCountRef.current++;

      if (active && canAccept(active.data)) {
        setOver(id, fullData);
      }
    },
    [id, fullData, active, canAccept, setOver]
  );

  const handleDragLeave = useCallback(
    (event: DragEvent<HTMLElement>) => {
      event.preventDefault();
      dragEnterCountRef.current--;

      if (dragEnterCountRef.current === 0 && overId === id) {
        setOver(null, null);
      }
    },
    [id, overId, setOver]
  );

  const handleDragOver = useCallback(
    (event: DragEvent<HTMLElement>) => {
      event.preventDefault();

      if (active && canAccept(active.data)) {
        event.dataTransfer.dropEffect = 'move';
        // Also set over state here to handle fast drags where dragEnter might be missed
        if (overId !== id) {
          setOver(id, fullData);
        }
      } else {
        event.dataTransfer.dropEffect = 'none';
      }
    },
    [active, canAccept, overId, id, fullData, setOver]
  );

  const handleDrop = useCallback((event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    dragEnterCountRef.current = 0;
  }, []);

  // Keyboard support
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (disabled) {
        return;
      }

      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();

        if (active?.id === id) {
          setActive(null);
        } else if (!active) {
          setActive({
            id,
            data: fullData,
            element: nodeRef.current,
          });
        }
      }

      if (event.key === 'Escape' && active?.id === id) {
        event.preventDefault();
        setActive(null);
      }

      // Arrow key navigation while dragging
      if (active?.id === id) {
        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
          event.preventDefault();
          // Move focus to previous item
          const prevElement = nodeRef.current?.previousElementSibling as HTMLElement;
          if (prevElement) {
            const prevId = prevElement.getAttribute('data-sortable-id');
            if (prevId) {
              setOver(prevId, { id: prevId, index: index - 1, ...data });
            }
          }
        }

        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
          event.preventDefault();
          // Move focus to next item
          const nextElement = nodeRef.current?.nextElementSibling as HTMLElement;
          if (nextElement) {
            const nextId = nextElement.getAttribute('data-sortable-id');
            if (nextId) {
              setOver(nextId, { id: nextId, index: index + 1, ...data });
            }
          }
        }
      }
    },
    [id, index, data, fullData, disabled, active, setActive, setOver]
  );

  const attributes = {
    draggable: !disabled,
    'aria-grabbed': isDragging,
    'data-dragging': isDragging,
    'data-over': isOver,
    'data-sortable-id': id,
    role: 'listitem',
    tabIndex: disabled ? -1 : 0,
  };

  const listeners = {
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
    onDrop: handleDrop,
    onKeyDown: handleKeyDown,
  };

  const style = {
    transition: 'transform 200ms ease, opacity 200ms ease',
    opacity: isDragging ? 0.5 : 1,
  };

  const getNode = useCallback(() => nodeRef.current, []);

  return {
    isDragging,
    isOver,
    active,
    setNodeRef,
    attributes,
    listeners,
    style,
    getNode,
  };
}
