import React from 'react';
import { renderHook } from '@testing-library/react';
import { useDroppable } from './useDroppable';
import { DndProvider } from '../DndProvider';

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => <DndProvider>{children}</DndProvider>;
};

describe('useDroppable', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useDroppable({ id: 'droppable-1' }), {
      wrapper: createWrapper(),
    });

    expect(result.current.isOver).toBe(false);
    expect(result.current.active).toBe(null);
    expect(result.current.node).toBe(null);
    expect(typeof result.current.setNodeRef).toBe('function');
  });

  it('returns proper attributes', () => {
    const { result } = renderHook(() => useDroppable({ id: 'droppable-1' }), {
      wrapper: createWrapper(),
    });

    expect(result.current.attributes).toHaveProperty('aria-dropeffect');
    expect(result.current.attributes).toHaveProperty('data-over');
  });

  it('returns proper listeners', () => {
    const { result } = renderHook(() => useDroppable({ id: 'droppable-1' }), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.listeners.onDragEnter).toBe('function');
    expect(typeof result.current.listeners.onDragLeave).toBe('function');
    expect(typeof result.current.listeners.onDragOver).toBe('function');
    expect(typeof result.current.listeners.onDrop).toBe('function');
  });

  it('throws error when used outside DndProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    expect(() => {
      renderHook(() => useDroppable({ id: 'droppable-1' }));
    }).toThrow('useDndContext must be used within a DndProvider');
    consoleSpy.mockRestore();
  });
});
