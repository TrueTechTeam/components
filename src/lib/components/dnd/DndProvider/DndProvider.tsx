/**
 * DndProvider - Context provider for drag and drop functionality
 */

import React, { useState, useCallback, useRef, useMemo, type ReactNode } from 'react';
import {
  DndContext,
  type DndContextValue,
  type ActiveDrag,
  type DragData,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
} from './DndContext';
import type { BaseComponentProps } from '../../../types/component.types';

export interface DndProviderProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Children components
   */
  children: ReactNode;

  /**
   * Callback when drag starts
   */
  onDragStart?: (event: DragStartEvent) => void;

  /**
   * Callback when dragging over a droppable
   */
  onDragOver?: (event: DragOverEvent) => void;

  /**
   * Callback when drag ends
   */
  onDragEnd?: (event: DragEndEvent) => void;

  /**
   * Callback when drag is cancelled
   */
  onDragCancel?: (event: DragStartEvent) => void;
}

/**
 * DndProvider component that wraps the application to enable drag and drop
 *
 * @example
 * ```tsx
 * <DndProvider onDragEnd={handleDragEnd}>
 *   <SortableList items={items} onReorder={setItems} />
 * </DndProvider>
 * ```
 */
export const DndProvider: React.FC<DndProviderProps> = ({
  children,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDragCancel: _onDragCancel,
}) => {
  const [active, setActiveState] = useState<ActiveDrag | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [overData, setOverData] = useState<DragData | null>(null);

  const droppablesRef = useRef<Map<string, DragData>>(new Map());

  const setActive = useCallback(
    (newActive: ActiveDrag | null) => {
      if (newActive && !active) {
        // Drag starting
        onDragStart?.({ active: newActive });
      } else if (!newActive && active) {
        // Drag ending
        const overInfo = overId && overData ? { id: overId, data: overData } : null;
        onDragEnd?.({ active, over: overInfo });
        setOverId(null);
        setOverData(null);
      }
      setActiveState(newActive);
    },
    [active, overId, overData, onDragStart, onDragEnd]
  );

  const setOver = useCallback(
    (id: string | null, data: DragData | null) => {
      setOverId(id);
      setOverData(data);

      if (id && data && active) {
        onDragOver?.({ active, over: { id, data } });
      }
    },
    [active, onDragOver]
  );

  const registerDroppable = useCallback((id: string, data: DragData) => {
    droppablesRef.current.set(id, data);
    return () => {
      droppablesRef.current.delete(id);
    };
  }, []);

  const getDroppables = useCallback(() => {
    return droppablesRef.current;
  }, []);

  const contextValue: DndContextValue = useMemo(
    () => ({
      active,
      overId,
      overData,
      setActive,
      setOver,
      registerDroppable,
      getDroppables,
      onDragEnd,
    }),
    [active, overId, overData, setActive, setOver, registerDroppable, getDroppables, onDragEnd]
  );

  return <DndContext.Provider value={contextValue}>{children}</DndContext.Provider>;
};

export default DndProvider;
