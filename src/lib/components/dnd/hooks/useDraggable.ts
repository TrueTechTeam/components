/**
 * useDraggable hook - makes an element draggable using HTML5 Drag and Drop API
 */

import { useCallback, useRef, useEffect, useState, type DragEvent } from 'react';
import { useDndContext, type DragData } from '../DndProvider';

export interface UseDraggableOptions {
  /**
   * Unique identifier for this draggable
   */
  id: string;

  /**
   * Data attached to this draggable
   */
  data?: Omit<DragData, 'id'>;

  /**
   * Whether dragging is disabled
   */
  disabled?: boolean;
}

export interface UseDraggableReturn {
  /**
   * Whether this element is currently being dragged
   */
  isDragging: boolean;

  /**
   * Ref to attach to the draggable element
   */
  setNodeRef: (node: HTMLElement | null) => void;

  /**
   * Attributes to spread on the draggable element
   */
  attributes: {
    draggable: boolean;
    'aria-grabbed': boolean;
    'data-dragging': boolean;
    role: string;
    tabIndex: number;
  };

  /**
   * Event listeners to spread on the draggable element
   */
  listeners: {
    onDragStart: (event: DragEvent<HTMLElement>) => void;
    onDragEnd: (event: DragEvent<HTMLElement>) => void;
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
  };

  /**
   * The element node ref
   */
  node: HTMLElement | null;
}

/**
 * Hook to make an element draggable
 *
 * @example
 * ```tsx
 * const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
 *   id: 'item-1',
 *   data: { type: 'card', index: 0 },
 * });
 *
 * return (
 *   <div ref={setNodeRef} {...attributes} {...listeners} data-dragging={isDragging}>
 *     Drag me!
 *   </div>
 * );
 * ```
 */
export function useDraggable(options: UseDraggableOptions): UseDraggableReturn {
  const { id, data = {}, disabled = false } = options;
  const { active, setActive } = useDndContext();
  const nodeRef = useRef<HTMLElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Sync dragging state with context
  useEffect(() => {
    setIsDragging(active?.id === id);
  }, [active, id]);

  const setNodeRef = useCallback((node: HTMLElement | null) => {
    nodeRef.current = node;
  }, []);

  const handleDragStart = useCallback(
    (event: DragEvent<HTMLElement>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }

      // Set drag data for transfer
      const dragData: DragData = { id, ...data };
      event.dataTransfer.setData('application/json', JSON.stringify(dragData));
      event.dataTransfer.effectAllowed = 'move';

      // Create drag image (use a clone of the element)
      if (nodeRef.current) {
        const rect = nodeRef.current.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
        event.dataTransfer.setDragImage(nodeRef.current, offsetX, offsetY);
      }

      // Update context state
      setActive({
        id,
        data: dragData,
        element: nodeRef.current,
      });
    },
    [id, data, disabled, setActive]
  );

  const handleDragEnd = useCallback(
    (_event: DragEvent<HTMLElement>) => {
      setActive(null);
    },
    [setActive]
  );

  // Keyboard support for accessibility
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (disabled) {
        return;
      }

      // Space or Enter to start/stop dragging
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();

        if (active?.id === id) {
          // Currently dragging, drop it
          setActive(null);
        } else {
          // Start dragging
          const dragData: DragData = { id, ...data };
          setActive({
            id,
            data: dragData,
            element: nodeRef.current,
          });
        }
      }

      // Escape to cancel
      if (event.key === 'Escape' && active?.id === id) {
        event.preventDefault();
        setActive(null);
      }
    },
    [id, data, disabled, active, setActive]
  );

  const attributes = {
    draggable: !disabled,
    'aria-grabbed': isDragging,
    'data-dragging': isDragging,
    role: 'button',
    tabIndex: disabled ? -1 : 0,
  };

  const listeners = {
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    onKeyDown: handleKeyDown,
  };

  return {
    isDragging,
    setNodeRef,
    attributes,
    listeners,
    node: nodeRef.current,
  };
}
