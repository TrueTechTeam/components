import React from 'react';
import { renderHook } from '@testing-library/react';
import { useSortable } from './useSortable';
import { DndProvider } from '../DndProvider';

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => <DndProvider>{children}</DndProvider>;
};

describe('useSortable', () => {
  it('returns expected properties', () => {
    const { result } = renderHook(() => useSortable({ id: 'item-1', index: 0 }), {
      wrapper: createWrapper(),
    });

    expect(result.current).toHaveProperty('isDragging');
    expect(result.current).toHaveProperty('isOver');
    expect(result.current).toHaveProperty('setNodeRef');
    expect(result.current).toHaveProperty('attributes');
    expect(result.current).toHaveProperty('listeners');
  });

  it('initializes with isDragging false', () => {
    const { result } = renderHook(() => useSortable({ id: 'item-1', index: 0 }), {
      wrapper: createWrapper(),
    });

    expect(result.current.isDragging).toBe(false);
    expect(result.current.isOver).toBe(false);
  });

  it('returns attributes with expected properties', () => {
    const { result } = renderHook(() => useSortable({ id: 'item-1', index: 0 }), {
      wrapper: createWrapper(),
    });

    expect(result.current.attributes).toHaveProperty('draggable');
    expect(result.current.attributes).toHaveProperty('role');
  });

  it('returns listeners with expected functions', () => {
    const { result } = renderHook(() => useSortable({ id: 'item-1', index: 0 }), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.listeners.onDragStart).toBe('function');
    expect(typeof result.current.listeners.onDragEnd).toBe('function');
  });

  it('handles disabled state', () => {
    const { result } = renderHook(() => useSortable({ id: 'item-1', index: 0, disabled: true }), {
      wrapper: createWrapper(),
    });

    expect(result.current.attributes.draggable).toBe(false);
  });
});
