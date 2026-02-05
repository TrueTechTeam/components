import React from 'react';
import { renderHook } from '@testing-library/react';
import { useDraggable } from './useDraggable';
import { DndProvider } from '../DndProvider';

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => <DndProvider>{children}</DndProvider>;
};

describe('useDraggable', () => {
  it('returns expected properties', () => {
    const { result } = renderHook(() => useDraggable({ id: 'test-id' }), {
      wrapper: createWrapper(),
    });

    expect(result.current).toHaveProperty('isDragging');
    expect(result.current).toHaveProperty('setNodeRef');
    expect(result.current).toHaveProperty('attributes');
    expect(result.current).toHaveProperty('listeners');
    expect(result.current).toHaveProperty('node');
  });

  it('initializes with isDragging false', () => {
    const { result } = renderHook(() => useDraggable({ id: 'test-id' }), {
      wrapper: createWrapper(),
    });

    expect(result.current.isDragging).toBe(false);
    expect(result.current.node).toBe(null);
  });

  it('returns attributes with expected properties', () => {
    const { result } = renderHook(() => useDraggable({ id: 'test-id' }), {
      wrapper: createWrapper(),
    });

    expect(result.current.attributes).toHaveProperty('draggable');
    expect(result.current.attributes).toHaveProperty('aria-grabbed');
    expect(result.current.attributes).toHaveProperty('role');
  });

  it('returns listeners with expected functions', () => {
    const { result } = renderHook(() => useDraggable({ id: 'test-id' }), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.listeners.onDragStart).toBe('function');
    expect(typeof result.current.listeners.onDragEnd).toBe('function');
    expect(typeof result.current.listeners.onKeyDown).toBe('function');
  });

  it('handles disabled state', () => {
    const { result } = renderHook(() => useDraggable({ id: 'test-id', disabled: true }), {
      wrapper: createWrapper(),
    });

    expect(result.current.attributes.draggable).toBe(false);
    expect(result.current.attributes.tabIndex).toBe(-1);
  });

  it('throws error when used outside DndProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    expect(() => {
      renderHook(() => useDraggable({ id: 'test-id' }));
    }).toThrow('useDndContext must be used within a DndProvider');
    consoleSpy.mockRestore();
  });
});
