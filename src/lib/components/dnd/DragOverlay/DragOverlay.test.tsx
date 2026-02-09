import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { DragOverlay } from './DragOverlay';
import { DndContext, type DndContextValue, type ActiveDrag } from '../DndProvider';

// Mock DnD context values
const createMockDndContext = (active: ActiveDrag | null = null): DndContextValue => ({
  active,
  overId: null,
  overData: null,
  setActive: jest.fn(),
  setOver: jest.fn(),
  registerDroppable: jest.fn(() => jest.fn()),
  getDroppables: jest.fn(() => new Map()),
  onDragEnd: jest.fn(),
});

// Helper to render with DnD context
const renderWithDndContext = (ui: React.ReactElement, contextValue: DndContextValue) => {
  return render(<DndContext.Provider value={contextValue}>{ui}</DndContext.Provider>);
};

describe('DragOverlay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // 1. Rendering tests
  describe('rendering', () => {
    it('should render when active drag exists', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1', title: 'Test Item' },
        element: null,
      };
      const context = createMockDndContext(active);

      renderWithDndContext(<DragOverlay data-testid="drag-overlay">Dragging</DragOverlay>, context);

      expect(screen.getByTestId('drag-overlay')).toBeInTheDocument();
    });

    it('should render children correctly', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context = createMockDndContext(active);

      renderWithDndContext(
        <DragOverlay>
          <div data-testid="child-content">Drag Content</div>
        </DragOverlay>,
        context
      );

      expect(screen.getByTestId('child-content')).toBeInTheDocument();
      expect(screen.getByText('Drag Content')).toBeInTheDocument();
    });

    it('should render with render function children', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1', title: 'Test Item' },
        element: null,
      };
      const context = createMockDndContext(active);

      renderWithDndContext(
        <DragOverlay>
          {(id, data) => (
            <div data-testid="render-fn-content">
              {id} - {data.title}
            </div>
          )}
        </DragOverlay>,
        context
      );

      expect(screen.getByTestId('render-fn-content')).toBeInTheDocument();
      expect(screen.getByText('item-1 - Test Item')).toBeInTheDocument();
    });

    it('should include aria-hidden attribute', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context = createMockDndContext(active);

      renderWithDndContext(<DragOverlay data-testid="drag-overlay">Content</DragOverlay>, context);

      const element = screen.getByTestId('drag-overlay');
      expect(element).toHaveAttribute('aria-hidden', 'true');
    });
  });

  // 2. Portal rendering tests
  describe('portal rendering', () => {
    it('should render in document.body', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context = createMockDndContext(active);

      renderWithDndContext(
        <DragOverlay data-testid="drag-overlay">Portal Content</DragOverlay>,
        context
      );

      const element = screen.getByTestId('drag-overlay');
      expect(document.body).toContainElement(element);
    });

    it('should render multiple overlays in document.body', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context = createMockDndContext(active);

      renderWithDndContext(
        <>
          <DragOverlay data-testid="overlay-1">Content 1</DragOverlay>
          <DragOverlay data-testid="overlay-2">Content 2</DragOverlay>
        </>,
        context
      );

      expect(screen.getByTestId('overlay-1')).toBeInTheDocument();
      expect(screen.getByTestId('overlay-2')).toBeInTheDocument();
      expect(document.body).toContainElement(screen.getByTestId('overlay-1'));
      expect(document.body).toContainElement(screen.getByTestId('overlay-2'));
    });
  });

  // 3. Mouse position tracking tests
  describe('mouse position tracking', () => {
    it('should track mousemove events', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context = createMockDndContext(active);

      renderWithDndContext(<DragOverlay data-testid="drag-overlay">Content</DragOverlay>, context);

      const element = screen.getByTestId('drag-overlay');

      // Fire mousemove event
      act(() => {
        fireEvent.mouseMove(window, { clientX: 100, clientY: 200 });
      });

      // Check if position is updated
      expect(element.style.left).toBe('100px');
      expect(element.style.top).toBe('200px');
    });

    it('should update position on multiple mousemove events', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context = createMockDndContext(active);

      renderWithDndContext(<DragOverlay data-testid="drag-overlay">Content</DragOverlay>, context);

      const element = screen.getByTestId('drag-overlay');

      // Fire multiple mousemove events
      act(() => {
        fireEvent.mouseMove(window, { clientX: 50, clientY: 50 });
      });
      expect(element.style.left).toBe('50px');
      expect(element.style.top).toBe('50px');

      act(() => {
        fireEvent.mouseMove(window, { clientX: 100, clientY: 100 });
      });
      expect(element.style.left).toBe('100px');
      expect(element.style.top).toBe('100px');

      act(() => {
        fireEvent.mouseMove(window, { clientX: 200, clientY: 300 });
      });
      expect(element.style.left).toBe('200px');
      expect(element.style.top).toBe('300px');
    });
  });

  // 4. Drop animation tests
  describe('drop animation', () => {
    it('should apply animation when drag ends', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context = createMockDndContext(active);

      const { rerender } = renderWithDndContext(
        <DragOverlay data-testid="drag-overlay" dropAnimationDuration={200}>
          Content
        </DragOverlay>,
        context
      );

      expect(screen.getByTestId('drag-overlay')).toBeInTheDocument();

      // Simulate drag end by setting active to null
      const updatedContext = createMockDndContext(null);
      rerender(
        <DndContext.Provider value={updatedContext}>
          <DragOverlay data-testid="drag-overlay" dropAnimationDuration={200}>
            Content
          </DragOverlay>
        </DndContext.Provider>
      );

      // Overlay should still be visible during animation
      const element = screen.getByTestId('drag-overlay');
      expect(element).toBeInTheDocument();
      expect(element).toHaveAttribute('data-animating', 'true');
    });

    it('should remove overlay after animation duration', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context = createMockDndContext(active);

      const { rerender } = renderWithDndContext(
        <DragOverlay data-testid="drag-overlay" dropAnimationDuration={200}>
          Content
        </DragOverlay>,
        context
      );

      // Simulate drag end
      const updatedContext = createMockDndContext(null);
      rerender(
        <DndContext.Provider value={updatedContext}>
          <DragOverlay data-testid="drag-overlay" dropAnimationDuration={200}>
            Content
          </DragOverlay>
        </DndContext.Provider>
      );

      // Fast-forward time
      act(() => {
        jest.advanceTimersByTime(200);
      });

      // Overlay should be removed after animation
      expect(screen.queryByTestId('drag-overlay')).not.toBeInTheDocument();
    });

    it('should skip animation when duration is 0', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context = createMockDndContext(active);

      const { rerender } = renderWithDndContext(
        <DragOverlay data-testid="drag-overlay" dropAnimationDuration={0}>
          Content
        </DragOverlay>,
        context
      );

      // Simulate drag end
      const updatedContext = createMockDndContext(null);
      rerender(
        <DndContext.Provider value={updatedContext}>
          <DragOverlay data-testid="drag-overlay" dropAnimationDuration={0}>
            Content
          </DragOverlay>
        </DndContext.Provider>
      );

      // Overlay should be removed immediately
      expect(screen.queryByTestId('drag-overlay')).not.toBeInTheDocument();
    });

    it('should apply transition styles during animation', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context = createMockDndContext(active);

      const { rerender } = renderWithDndContext(
        <DragOverlay data-testid="drag-overlay" dropAnimationDuration={300}>
          Content
        </DragOverlay>,
        context
      );

      // Simulate drag end
      const updatedContext = createMockDndContext(null);
      rerender(
        <DndContext.Provider value={updatedContext}>
          <DragOverlay data-testid="drag-overlay" dropAnimationDuration={300}>
            Content
          </DragOverlay>
        </DndContext.Provider>
      );

      const element = screen.getByTestId('drag-overlay');
      expect(element.style.transition).toContain('300ms');
    });

    it('should not apply transition when adjustScale is false', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context = createMockDndContext(active);

      const { rerender } = renderWithDndContext(
        <DragOverlay data-testid="drag-overlay" dropAnimationDuration={300} adjustScale={false}>
          Content
        </DragOverlay>,
        context
      );

      // Simulate drag end
      const updatedContext = createMockDndContext(null);
      rerender(
        <DndContext.Provider value={updatedContext}>
          <DragOverlay data-testid="drag-overlay" dropAnimationDuration={300} adjustScale={false}>
            Content
          </DragOverlay>
        </DndContext.Provider>
      );

      const element = screen.getByTestId('drag-overlay');
      expect(element.style.transition).toBe('');
    });
  });

  // 5. Styling tests
  describe('styling', () => {
    it('should apply default z-index', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context = createMockDndContext(active);

      renderWithDndContext(<DragOverlay data-testid="drag-overlay">Content</DragOverlay>, context);

      const element = screen.getByTestId('drag-overlay');
      expect(element.style.zIndex).toBe('9999');
    });

    it('should apply custom z-index', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context = createMockDndContext(active);

      renderWithDndContext(
        <DragOverlay data-testid="drag-overlay" zIndex={5000}>
          Content
        </DragOverlay>,
        context
      );

      const element = screen.getByTestId('drag-overlay');
      expect(element.style.zIndex).toBe('5000');
    });

    it('should apply fixed positioning', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context = createMockDndContext(active);

      renderWithDndContext(<DragOverlay data-testid="drag-overlay">Content</DragOverlay>, context);

      const element = screen.getByTestId('drag-overlay');
      expect(element.style.position).toBe('fixed');
    });

    it('should apply translate transform', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context = createMockDndContext(active);

      renderWithDndContext(<DragOverlay data-testid="drag-overlay">Content</DragOverlay>, context);

      const element = screen.getByTestId('drag-overlay');
      expect(element.style.transform).toBe('translate(-50%, -50%)');
    });

    it('should have pointer-events none', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context = createMockDndContext(active);

      renderWithDndContext(<DragOverlay data-testid="drag-overlay">Content</DragOverlay>, context);

      const element = screen.getByTestId('drag-overlay');
      expect(element.style.pointerEvents).toBe('none');
    });

    it('should accept custom className', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context = createMockDndContext(active);

      renderWithDndContext(
        <DragOverlay data-testid="drag-overlay" className="custom-overlay">
          Content
        </DragOverlay>,
        context
      );

      const element = screen.getByTestId('drag-overlay');
      expect(element).toHaveClass('custom-overlay');
    });

    it('should accept custom style prop', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context = createMockDndContext(active);

      renderWithDndContext(
        <DragOverlay data-testid="drag-overlay" style={{ backgroundColor: 'red', opacity: 0.5 }}>
          Content
        </DragOverlay>,
        context
      );

      const element = screen.getByTestId('drag-overlay');
      expect(element).toHaveStyle({ backgroundColor: 'red', opacity: 0.5 });
    });

    it('should merge custom style with component styles', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context = createMockDndContext(active);

      renderWithDndContext(
        <DragOverlay data-testid="drag-overlay" style={{ backgroundColor: 'red' }}>
          Content
        </DragOverlay>,
        context
      );

      const element = screen.getByTestId('drag-overlay');
      expect(element).toHaveStyle({ backgroundColor: 'red' });
      expect(element.style.position).toBe('fixed');
      expect(element.style.zIndex).toBe('9999');
    });
  });

  // 6. Render function tests
  describe('render function children', () => {
    it('should call render function with active id and data', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1', title: 'Test', index: 0 },
        element: null,
      };
      const context = createMockDndContext(active);
      const renderFn = jest.fn((id) => <div>{id}</div>);

      renderWithDndContext(<DragOverlay>{renderFn}</DragOverlay>, context);

      expect(renderFn).toHaveBeenCalledWith('item-1', {
        id: 'item-1',
        title: 'Test',
        index: 0,
      });
    });

    it('should render content from render function', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1', title: 'Dragging Item' },
        element: null,
      };
      const context = createMockDndContext(active);

      renderWithDndContext(
        <DragOverlay>
          {(id, data) => (
            <div data-testid="custom-content">
              {id}: {data.title}
            </div>
          )}
        </DragOverlay>,
        context
      );

      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
      expect(screen.getByText('item-1: Dragging Item')).toBeInTheDocument();
    });

    it('should update render function output when data changes', () => {
      const active1: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1', title: 'First' },
        element: null,
      };
      const context1 = createMockDndContext(active1);

      const { rerender } = renderWithDndContext(
        <DragOverlay>{(id, data) => <div>{data.title}</div>}</DragOverlay>,
        context1
      );

      expect(screen.getByText('First')).toBeInTheDocument();

      const active2: ActiveDrag = {
        id: 'item-2',
        data: { id: 'item-2', title: 'Second' },
        element: null,
      };
      const context2 = createMockDndContext(active2);

      rerender(
        <DndContext.Provider value={context2}>
          <DragOverlay>{(id, data) => <div>{data.title}</div>}</DragOverlay>
        </DndContext.Provider>
      );

      expect(screen.getByText('Second')).toBeInTheDocument();
    });
  });

  // 7. Element cloning tests
  describe('element cloning', () => {
    it('should render cloned element when no children provided', () => {
      const mockElement = document.createElement('div');
      mockElement.textContent = 'Cloned Element';
      mockElement.className = 'original-class';

      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: mockElement,
      };
      const context = createMockDndContext(active);

      renderWithDndContext(<DragOverlay data-testid="drag-overlay" />, context);

      const overlay = screen.getByTestId('drag-overlay');
      expect(overlay).toBeInTheDocument();
      expect(overlay.innerHTML).toContain('Cloned Element');
    });

    it('should prefer children over cloned element', () => {
      const mockElement = document.createElement('div');
      mockElement.textContent = 'Cloned Element';

      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: mockElement,
      };
      const context = createMockDndContext(active);

      renderWithDndContext(
        <DragOverlay data-testid="drag-overlay">
          <div>Custom Children</div>
        </DragOverlay>,
        context
      );

      expect(screen.getByText('Custom Children')).toBeInTheDocument();
      expect(screen.queryByText('Cloned Element')).not.toBeInTheDocument();
    });
  });

  // 8. Event cleanup tests
  describe('event cleanup', () => {
    it('should clean up event listeners when unmounted', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context = createMockDndContext(active);

      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

      const { unmount } = renderWithDndContext(
        <DragOverlay data-testid="drag-overlay">Content</DragOverlay>,
        context
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('dragover', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });

    it('should clean up event listeners when active changes to null', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context = createMockDndContext(active);

      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

      const { rerender } = renderWithDndContext(
        <DragOverlay data-testid="drag-overlay">Content</DragOverlay>,
        context
      );

      // Change to null
      const updatedContext = createMockDndContext(null);
      rerender(
        <DndContext.Provider value={updatedContext}>
          <DragOverlay data-testid="drag-overlay">Content</DragOverlay>
        </DndContext.Provider>
      );

      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('dragover', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });

    it('should clean up animation timer on unmount', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context = createMockDndContext(active);

      const { rerender, unmount } = renderWithDndContext(
        <DragOverlay data-testid="drag-overlay" dropAnimationDuration={200}>
          Content
        </DragOverlay>,
        context
      );

      // Simulate drag end
      const updatedContext = createMockDndContext(null);
      rerender(
        <DndContext.Provider value={updatedContext}>
          <DragOverlay data-testid="drag-overlay" dropAnimationDuration={200}>
            Content
          </DragOverlay>
        </DndContext.Provider>
      );

      // Unmount before animation completes
      unmount();

      // Advance timers - should not throw
      act(() => {
        jest.advanceTimersByTime(200);
      });
    });
  });

  // 9. Props tests
  describe('props', () => {
    it('should use default adjustScale value', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context = createMockDndContext(active);

      const { rerender } = renderWithDndContext(
        <DragOverlay data-testid="drag-overlay" dropAnimationDuration={200}>
          Content
        </DragOverlay>,
        context
      );

      // Simulate drag end
      const updatedContext = createMockDndContext(null);
      rerender(
        <DndContext.Provider value={updatedContext}>
          <DragOverlay data-testid="drag-overlay" dropAnimationDuration={200}>
            Content
          </DragOverlay>
        </DndContext.Provider>
      );

      const element = screen.getByTestId('drag-overlay');
      // Should have transition since adjustScale defaults to true
      expect(element.style.transition).toContain('200ms');
    });

    it('should use default dropAnimationDuration value', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context = createMockDndContext(active);

      const { rerender } = renderWithDndContext(
        <DragOverlay data-testid="drag-overlay">Content</DragOverlay>,
        context
      );

      // Simulate drag end
      const updatedContext = createMockDndContext(null);
      rerender(
        <DndContext.Provider value={updatedContext}>
          <DragOverlay data-testid="drag-overlay">Content</DragOverlay>
        </DndContext.Provider>
      );

      // Should animate for 200ms (default)
      expect(screen.getByTestId('drag-overlay')).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(199);
      });
      expect(screen.getByTestId('drag-overlay')).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(1);
      });
      expect(screen.queryByTestId('drag-overlay')).not.toBeInTheDocument();
    });

    it('should accept data-testid prop', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context = createMockDndContext(active);

      renderWithDndContext(<DragOverlay data-testid="custom-testid">Content</DragOverlay>, context);

      expect(screen.getByTestId('custom-testid')).toBeInTheDocument();
    });
  });

  // 10. Edge cases
  describe('edge cases', () => {
    it('should handle null children', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context = createMockDndContext(active);

      renderWithDndContext(<DragOverlay data-testid="drag-overlay">{null}</DragOverlay>, context);

      expect(screen.getByTestId('drag-overlay')).toBeInTheDocument();
    });

    it('should handle undefined children', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context = createMockDndContext(active);

      renderWithDndContext(
        <DragOverlay data-testid="drag-overlay">{undefined}</DragOverlay>,
        context
      );

      expect(screen.getByTestId('drag-overlay')).toBeInTheDocument();
    });

    it('should handle empty data object', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context = createMockDndContext(active);

      renderWithDndContext(
        <DragOverlay>
          {(id, data) => <div data-testid="content">{JSON.stringify(data)}</div>}
        </DragOverlay>,
        context
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('should handle position at origin', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context = createMockDndContext(active);

      renderWithDndContext(<DragOverlay data-testid="drag-overlay">Content</DragOverlay>, context);

      const element = screen.getByTestId('drag-overlay');

      act(() => {
        fireEvent.mouseMove(window, { clientX: 0, clientY: 0 });
      });

      expect(element.style.left).toBe('0px');
      expect(element.style.top).toBe('0px');
    });

    it('should handle large position values', () => {
      const active: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context = createMockDndContext(active);

      renderWithDndContext(<DragOverlay data-testid="drag-overlay">Content</DragOverlay>, context);

      const element = screen.getByTestId('drag-overlay');

      act(() => {
        fireEvent.mouseMove(window, { clientX: 9999, clientY: 9999 });
      });

      expect(element.style.left).toBe('9999px');
      expect(element.style.top).toBe('9999px');
    });

    it('should handle rapid drag state changes', () => {
      const active1: ActiveDrag = {
        id: 'item-1',
        data: { id: 'item-1' },
        element: null,
      };
      const context1 = createMockDndContext(active1);

      const { rerender } = renderWithDndContext(
        <DragOverlay data-testid="drag-overlay">Content 1</DragOverlay>,
        context1
      );

      expect(screen.getByText('Content 1')).toBeInTheDocument();

      // Change to null
      const context2 = createMockDndContext(null);
      rerender(
        <DndContext.Provider value={context2}>
          <DragOverlay data-testid="drag-overlay">Content 1</DragOverlay>
        </DndContext.Provider>
      );

      // Immediately change to new active
      const active2: ActiveDrag = {
        id: 'item-2',
        data: { id: 'item-2' },
        element: null,
      };
      const context3 = createMockDndContext(active2);
      rerender(
        <DndContext.Provider value={context3}>
          <DragOverlay data-testid="drag-overlay">Content 2</DragOverlay>
        </DndContext.Provider>
      );

      expect(screen.getByTestId('drag-overlay')).toBeInTheDocument();
    });
  });
});
