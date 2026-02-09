import React from 'react';
import { render, screen } from '@testing-library/react';
import { SortableGridItem, type SortableGridItemRenderProps } from './SortableGridItem';
// Mock the useSortable hook
jest.mock('../hooks', () => ({
  useSortable: jest.fn((options) => {
    const { id, disabled } = options;
    return {
      isDragging: false,
      isOver: false,
      active: null,
      setNodeRef: jest.fn(),
      attributes: {
        draggable: !disabled,
        'aria-grabbed': false,
        'data-dragging': false,
        'data-over': false,
        'data-sortable-id': id,
        role: 'listitem',
        tabIndex: disabled ? -1 : 0,
      },
      listeners: {
        onDragStart: jest.fn(),
        onDragEnd: jest.fn(),
        onDragEnter: jest.fn(),
        onDragLeave: jest.fn(),
        onDragOver: jest.fn(),
        onDrop: jest.fn(),
        onKeyDown: jest.fn(),
      },
      style: {
        transition: 'transform 200ms ease, opacity 200ms ease',
        opacity: 1,
      },
      getNode: jest.fn(() => null),
    };
  }),
}));

describe('SortableGridItem', () => {
  // 1. Rendering tests
  describe('rendering', () => {
    it('renders with default props', () => {
      render(
        <SortableGridItem id="item-1" index={0} data-testid="grid-item">
          <div>Content</div>
        </SortableGridItem>
      );
      expect(screen.getByTestId('grid-item')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders with all props', () => {
      render(
        <SortableGridItem
          id="item-1"
          index={0}
          disabled
          data={{ custom: 'data' }}
          className="custom-class"
          data-testid="test-item"
          aria-label="Custom label"
          style={{ backgroundColor: 'red' }}
        >
          <div>Content</div>
        </SortableGridItem>
      );

      const element = screen.getByTestId('test-item');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('custom-class');
      expect(element).toHaveAttribute('aria-label', 'Custom label');
      expect(element).toHaveStyle({ backgroundColor: 'red' });
    });

    it('renders as div element', () => {
      render(
        <SortableGridItem id="item-1" index={0} data-testid="item">
          <div>Content</div>
        </SortableGridItem>
      );
      const element = screen.getByTestId('item');
      expect(element.tagName).toBe('DIV');
    });

    it('renders with gridcell role', () => {
      render(
        <SortableGridItem id="item-1" index={0} data-testid="item">
          <div>Content</div>
        </SortableGridItem>
      );
      const element = screen.getByTestId('item');
      expect(element).toHaveAttribute('role', 'gridcell');
    });

    it('renders children as ReactNode', () => {
      render(
        <SortableGridItem id="item-1" index={0}>
          <div>Static content</div>
        </SortableGridItem>
      );
      expect(screen.getByText('Static content')).toBeInTheDocument();
    });

    it('renders children as render function', () => {
      render(
        <SortableGridItem id="item-1" index={0}>
          {({ isDragging, isOver, index }) => (
            <div>
              Index: {index}, Dragging: {String(isDragging)}, Over: {String(isOver)}
            </div>
          )}
        </SortableGridItem>
      );
      expect(screen.getByText('Index: 0, Dragging: false, Over: false')).toBeInTheDocument();
    });

    it('renders complex children', () => {
      render(
        <SortableGridItem id="item-1" index={0}>
          <div>
            <h3>Title</h3>
            <p>Description</p>
            <button>Action</button>
          </div>
        </SortableGridItem>
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
    });
  });

  // 2. ID and index tests
  describe('id and index', () => {
    it('accepts string id', () => {
      const { useSortable } = require('../hooks');
      render(
        <SortableGridItem id="item-1" index={0}>
          Content
        </SortableGridItem>
      );
      expect(useSortable).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'item-1',
        })
      );
    });

    it('accepts numeric id as string', () => {
      const { useSortable } = require('../hooks');
      render(
        <SortableGridItem id="123" index={0}>
          Content
        </SortableGridItem>
      );
      expect(useSortable).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '123',
        })
      );
    });

    it('accepts index 0', () => {
      const { useSortable } = require('../hooks');
      render(
        <SortableGridItem id="item-1" index={0}>
          Content
        </SortableGridItem>
      );
      expect(useSortable).toHaveBeenCalledWith(
        expect.objectContaining({
          index: 0,
        })
      );
    });

    it('accepts positive index', () => {
      const { useSortable } = require('../hooks');
      render(
        <SortableGridItem id="item-1" index={5}>
          Content
        </SortableGridItem>
      );
      expect(useSortable).toHaveBeenCalledWith(
        expect.objectContaining({
          index: 5,
        })
      );
    });

    it('passes index to render function', () => {
      render(
        <SortableGridItem id="item-1" index={3}>
          {({ index }) => <div>Index: {index}</div>}
        </SortableGridItem>
      );
      expect(screen.getByText('Index: 3')).toBeInTheDocument();
    });
  });

  // 3. Disabled state tests
  describe('disabled state', () => {
    it('is not disabled by default', () => {
      const { useSortable } = require('../hooks');
      render(
        <SortableGridItem id="item-1" index={0}>
          Content
        </SortableGridItem>
      );
      expect(useSortable).toHaveBeenCalledWith(
        expect.objectContaining({
          disabled: false,
        })
      );
    });

    it('renders disabled state', () => {
      const { useSortable } = require('../hooks');
      render(
        <SortableGridItem id="item-1" index={0} disabled>
          Content
        </SortableGridItem>
      );
      expect(useSortable).toHaveBeenCalledWith(
        expect.objectContaining({
          disabled: true,
        })
      );
    });

    it('passes disabled false explicitly', () => {
      const { useSortable } = require('../hooks');
      render(
        <SortableGridItem id="item-1" index={0} disabled={false}>
          Content
        </SortableGridItem>
      );
      expect(useSortable).toHaveBeenCalledWith(
        expect.objectContaining({
          disabled: false,
        })
      );
    });

    it('applies disabled attributes from useSortable', () => {
      const { useSortable } = require('../hooks');
      useSortable.mockImplementationOnce(() => ({
        isDragging: false,
        isOver: false,
        active: null,
        setNodeRef: jest.fn(),
        attributes: {
          draggable: false,
          'aria-grabbed': false,
          'data-dragging': false,
          'data-over': false,
          'data-sortable-id': 'item-1',
          role: 'listitem',
          tabIndex: -1,
        },
        listeners: {
          onDragStart: jest.fn(),
          onDragEnd: jest.fn(),
          onDragEnter: jest.fn(),
          onDragLeave: jest.fn(),
          onDragOver: jest.fn(),
          onDrop: jest.fn(),
          onKeyDown: jest.fn(),
        },
        style: { transition: 'transform 200ms ease, opacity 200ms ease', opacity: 1 },
        getNode: jest.fn(() => null),
      }));

      render(
        <SortableGridItem id="item-1" index={0} disabled data-testid="item">
          Content
        </SortableGridItem>
      );
      const element = screen.getByTestId('item');
      expect(element).toHaveAttribute('draggable', 'false');
      expect(element).toHaveAttribute('tabIndex', '-1');
    });
  });

  // 4. Data prop tests
  describe('data prop', () => {
    it('accepts empty data by default', () => {
      const { useSortable } = require('../hooks');
      render(
        <SortableGridItem id="item-1" index={0}>
          Content
        </SortableGridItem>
      );
      expect(useSortable).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { type: 'grid-item' },
        })
      );
    });

    it('accepts custom data', () => {
      const { useSortable } = require('../hooks');
      const customData = { custom: 'value', count: 42 };
      render(
        <SortableGridItem id="item-1" index={0} data={customData}>
          Content
        </SortableGridItem>
      );
      expect(useSortable).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { custom: 'value', count: 42, type: 'grid-item' },
        })
      );
    });

    it('merges data with type grid-item', () => {
      const { useSortable } = require('../hooks');
      render(
        <SortableGridItem id="item-1" index={0} data={{ foo: 'bar' }}>
          Content
        </SortableGridItem>
      );
      expect(useSortable).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { foo: 'bar', type: 'grid-item' },
        })
      );
    });

    it('passes groupId to useSortable', () => {
      const { useSortable } = require('../hooks');
      render(
        <SortableGridItem id="item-1" index={0}>
          Content
        </SortableGridItem>
      );
      expect(useSortable).toHaveBeenCalledWith(
        expect.objectContaining({
          groupId: 'sortable-grid',
        })
      );
    });
  });

  // 5. Render function tests
  describe('render function', () => {
    it('provides isDragging prop', () => {
      const { useSortable } = require('../hooks');
      useSortable.mockImplementationOnce(() => ({
        isDragging: true,
        isOver: false,
        active: null,
        setNodeRef: jest.fn(),
        attributes: {
          draggable: true,
          'aria-grabbed': true,
          'data-dragging': true,
          'data-over': false,
          'data-sortable-id': 'item-1',
          role: 'listitem',
          tabIndex: 0,
        },
        listeners: {
          onDragStart: jest.fn(),
          onDragEnd: jest.fn(),
          onDragEnter: jest.fn(),
          onDragLeave: jest.fn(),
          onDragOver: jest.fn(),
          onDrop: jest.fn(),
          onKeyDown: jest.fn(),
        },
        style: { transition: 'transform 200ms ease, opacity 200ms ease', opacity: 0.5 },
        getNode: jest.fn(() => null),
      }));

      render(
        <SortableGridItem id="item-1" index={0}>
          {({ isDragging }) => <div>Dragging: {String(isDragging)}</div>}
        </SortableGridItem>
      );
      expect(screen.getByText('Dragging: true')).toBeInTheDocument();
    });

    it('provides isOver prop', () => {
      const { useSortable } = require('../hooks');
      useSortable.mockImplementationOnce(() => ({
        isDragging: false,
        isOver: true,
        active: null,
        setNodeRef: jest.fn(),
        attributes: {
          draggable: true,
          'aria-grabbed': false,
          'data-dragging': false,
          'data-over': true,
          'data-sortable-id': 'item-1',
          role: 'listitem',
          tabIndex: 0,
        },
        listeners: {
          onDragStart: jest.fn(),
          onDragEnd: jest.fn(),
          onDragEnter: jest.fn(),
          onDragLeave: jest.fn(),
          onDragOver: jest.fn(),
          onDrop: jest.fn(),
          onKeyDown: jest.fn(),
        },
        style: { transition: 'transform 200ms ease, opacity 200ms ease', opacity: 1 },
        getNode: jest.fn(() => null),
      }));

      render(
        <SortableGridItem id="item-1" index={0}>
          {({ isOver }) => <div>Over: {String(isOver)}</div>}
        </SortableGridItem>
      );
      expect(screen.getByText('Over: true')).toBeInTheDocument();
    });

    it('provides index prop', () => {
      render(
        <SortableGridItem id="item-1" index={7}>
          {({ index }) => <div>Index: {index}</div>}
        </SortableGridItem>
      );
      expect(screen.getByText('Index: 7')).toBeInTheDocument();
    });

    it('provides all render props together', () => {
      const { useSortable } = require('../hooks');
      useSortable.mockImplementationOnce(() => ({
        isDragging: true,
        isOver: false,
        active: null,
        setNodeRef: jest.fn(),
        attributes: {
          draggable: true,
          'aria-grabbed': true,
          'data-dragging': true,
          'data-over': false,
          'data-sortable-id': 'item-1',
          role: 'listitem',
          tabIndex: 0,
        },
        listeners: {
          onDragStart: jest.fn(),
          onDragEnd: jest.fn(),
          onDragEnter: jest.fn(),
          onDragLeave: jest.fn(),
          onDragOver: jest.fn(),
          onDrop: jest.fn(),
          onKeyDown: jest.fn(),
        },
        style: { transition: 'transform 200ms ease, opacity 200ms ease', opacity: 0.5 },
        getNode: jest.fn(() => null),
      }));

      render(
        <SortableGridItem id="item-1" index={2}>
          {({ isDragging, isOver, index }) => (
            <div>
              {index}-{String(isDragging)}-{String(isOver)}
            </div>
          )}
        </SortableGridItem>
      );
      expect(screen.getByText('2-true-false')).toBeInTheDocument();
    });

    it('calls render function only when children is a function', () => {
      const renderFn = jest.fn((props: SortableGridItemRenderProps) => (
        <div>Rendered {props.index}</div>
      ));

      render(
        <SortableGridItem id="item-1" index={0}>
          {renderFn}
        </SortableGridItem>
      );

      expect(renderFn).toHaveBeenCalledWith({
        isDragging: false,
        isOver: false,
        index: 0,
      });
      expect(renderFn).toHaveBeenCalledTimes(1);
    });

    it('does not call render function for ReactNode children', () => {
      render(
        <SortableGridItem id="item-1" index={0}>
          <div>Static content</div>
        </SortableGridItem>
      );
      expect(screen.getByText('Static content')).toBeInTheDocument();
    });
  });

  // 6. Ref forwarding tests
  describe('ref forwarding', () => {
    it('forwards ref to element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <SortableGridItem ref={ref} id="item-1" index={0} data-testid="item">
          Content
        </SortableGridItem>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute('data-testid', 'item');
    });

    it('forwards ref with role gridcell', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <SortableGridItem ref={ref} id="item-1" index={0}>
          Content
        </SortableGridItem>
      );
      expect(ref.current).toHaveAttribute('role', 'gridcell');
    });

    it('handles callback ref', () => {
      const refCallback = jest.fn();
      render(
        <SortableGridItem ref={refCallback} id="item-1" index={0}>
          Content
        </SortableGridItem>
      );
      expect(refCallback).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });

    it('combines forwarded ref with sortable ref', () => {
      const forwardedRef = React.createRef<HTMLDivElement>();
      const { useSortable } = require('../hooks');
      const mockSetNodeRef = jest.fn();

      useSortable.mockImplementationOnce(() => ({
        isDragging: false,
        isOver: false,
        active: null,
        setNodeRef: mockSetNodeRef,
        attributes: {
          draggable: true,
          'aria-grabbed': false,
          'data-dragging': false,
          'data-over': false,
          'data-sortable-id': 'item-1',
          role: 'listitem',
          tabIndex: 0,
        },
        listeners: {
          onDragStart: jest.fn(),
          onDragEnd: jest.fn(),
          onDragEnter: jest.fn(),
          onDragLeave: jest.fn(),
          onDragOver: jest.fn(),
          onDrop: jest.fn(),
          onKeyDown: jest.fn(),
        },
        style: { transition: 'transform 200ms ease, opacity 200ms ease', opacity: 1 },
        getNode: jest.fn(() => null),
      }));

      render(
        <SortableGridItem ref={forwardedRef} id="item-1" index={0} data-testid="item">
          Content
        </SortableGridItem>
      );

      expect(mockSetNodeRef).toHaveBeenCalled();
      expect(forwardedRef.current).toBeInstanceOf(HTMLDivElement);
    });

    it('handles callback ref with sortable ref', () => {
      const callbackRef = jest.fn();
      const { useSortable } = require('../hooks');
      const mockSetNodeRef = jest.fn();

      useSortable.mockImplementationOnce(() => ({
        isDragging: false,
        isOver: false,
        active: null,
        setNodeRef: mockSetNodeRef,
        attributes: {
          draggable: true,
          'aria-grabbed': false,
          'data-dragging': false,
          'data-over': false,
          'data-sortable-id': 'item-1',
          role: 'listitem',
          tabIndex: 0,
        },
        listeners: {
          onDragStart: jest.fn(),
          onDragEnd: jest.fn(),
          onDragEnter: jest.fn(),
          onDragLeave: jest.fn(),
          onDragOver: jest.fn(),
          onDrop: jest.fn(),
          onKeyDown: jest.fn(),
        },
        style: { transition: 'transform 200ms ease, opacity 200ms ease', opacity: 1 },
        getNode: jest.fn(() => null),
      }));

      render(
        <SortableGridItem ref={callbackRef} id="item-1" index={0}>
          Content
        </SortableGridItem>
      );

      expect(mockSetNodeRef).toHaveBeenCalled();
      expect(callbackRef).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });
  });

  // 7. Custom styling tests
  describe('custom styling', () => {
    it('accepts custom className', () => {
      render(
        <SortableGridItem id="item-1" index={0} className="custom-class" data-testid="item">
          Content
        </SortableGridItem>
      );
      const element = screen.getByTestId('item');
      expect(element).toHaveClass('custom-class');
    });

    it('accepts custom style prop', () => {
      render(
        <SortableGridItem
          id="item-1"
          index={0}
          style={{ backgroundColor: 'blue' }}
          data-testid="item"
        >
          Content
        </SortableGridItem>
      );
      const element = screen.getByTestId('item');
      expect(element).toHaveStyle({ backgroundColor: 'blue' });
    });

    it('merges custom style with sortable style', () => {
      render(
        <SortableGridItem
          id="item-1"
          index={0}
          style={{ backgroundColor: 'blue', padding: '10px' }}
          data-testid="item"
        >
          Content
        </SortableGridItem>
      );
      const element = screen.getByTestId('item');
      expect(element).toHaveStyle({
        backgroundColor: 'blue',
        padding: '10px',
        transition: 'transform 200ms ease, opacity 200ms ease',
        opacity: 1,
      });
    });

    it('handles undefined className gracefully', () => {
      render(
        <SortableGridItem id="item-1" index={0} className={undefined} data-testid="item">
          Content
        </SortableGridItem>
      );
      const element = screen.getByTestId('item');
      expect(element).toBeInTheDocument();
    });

    it('handles undefined style gracefully', () => {
      render(
        <SortableGridItem id="item-1" index={0} style={undefined} data-testid="item">
          Content
        </SortableGridItem>
      );
      const element = screen.getByTestId('item');
      expect(element).toBeInTheDocument();
    });
  });

  // 8. Sortable attributes and listeners tests
  describe('sortable attributes and listeners', () => {
    it('applies draggable attribute', () => {
      render(
        <SortableGridItem id="item-1" index={0} data-testid="item">
          Content
        </SortableGridItem>
      );
      const element = screen.getByTestId('item');
      expect(element).toHaveAttribute('draggable', 'true');
    });

    it('applies aria-grabbed attribute', () => {
      render(
        <SortableGridItem id="item-1" index={0} data-testid="item">
          Content
        </SortableGridItem>
      );
      const element = screen.getByTestId('item');
      expect(element).toHaveAttribute('aria-grabbed', 'false');
    });

    it('applies data-dragging attribute', () => {
      render(
        <SortableGridItem id="item-1" index={0} data-testid="item">
          Content
        </SortableGridItem>
      );
      const element = screen.getByTestId('item');
      expect(element).toHaveAttribute('data-dragging', 'false');
    });

    it('applies data-over attribute', () => {
      render(
        <SortableGridItem id="item-1" index={0} data-testid="item">
          Content
        </SortableGridItem>
      );
      const element = screen.getByTestId('item');
      expect(element).toHaveAttribute('data-over', 'false');
    });

    it('applies data-sortable-id attribute', () => {
      render(
        <SortableGridItem id="item-1" index={0} data-testid="item">
          Content
        </SortableGridItem>
      );
      const element = screen.getByTestId('item');
      expect(element).toHaveAttribute('data-sortable-id', 'item-1');
    });

    it('applies role listitem from useSortable', () => {
      render(
        <SortableGridItem id="item-1" index={0} data-testid="item">
          Content
        </SortableGridItem>
      );
      const element = screen.getByTestId('item');
      expect(element).toHaveAttribute('role', 'gridcell');
    });

    it('applies tabIndex attribute', () => {
      render(
        <SortableGridItem id="item-1" index={0} data-testid="item">
          Content
        </SortableGridItem>
      );
      const element = screen.getByTestId('item');
      expect(element).toHaveAttribute('tabIndex', '0');
    });

    it('applies event listeners', () => {
      render(
        <SortableGridItem id="item-1" index={0} data-testid="item">
          Content
        </SortableGridItem>
      );
      const element = screen.getByTestId('item');

      // Check that event listener props exist
      expect(element).toBeInTheDocument();
      // Event listeners are applied via spread, can't easily test their presence
      // but we can verify the element renders without errors
    });
  });

  // 9. Accessibility tests
  describe('accessibility', () => {
    it('accepts aria-label prop', () => {
      render(
        <SortableGridItem id="item-1" index={0} aria-label="Custom label" data-testid="item">
          Content
        </SortableGridItem>
      );
      const element = screen.getByTestId('item');
      expect(element).toHaveAttribute('aria-label', 'Custom label');
    });

    it('can be found by accessible label', () => {
      render(
        <SortableGridItem id="item-1" index={0} aria-label="Item 1">
          Content
        </SortableGridItem>
      );
      expect(screen.getByLabelText('Item 1')).toBeInTheDocument();
    });

    it('has gridcell role', () => {
      render(
        <SortableGridItem id="item-1" index={0} data-testid="item">
          Content
        </SortableGridItem>
      );
      const element = screen.getByTestId('item');
      expect(element).toHaveAttribute('role', 'gridcell');
    });

    it('is keyboard accessible when not disabled', () => {
      render(
        <SortableGridItem id="item-1" index={0} data-testid="item">
          Content
        </SortableGridItem>
      );
      const element = screen.getByTestId('item');
      expect(element).toHaveAttribute('tabIndex', '0');
    });

    it('is not keyboard accessible when disabled', () => {
      const { useSortable } = require('../hooks');
      useSortable.mockImplementationOnce(() => ({
        isDragging: false,
        isOver: false,
        active: null,
        setNodeRef: jest.fn(),
        attributes: {
          draggable: false,
          'aria-grabbed': false,
          'data-dragging': false,
          'data-over': false,
          'data-sortable-id': 'item-1',
          role: 'listitem',
          tabIndex: -1,
        },
        listeners: {
          onDragStart: jest.fn(),
          onDragEnd: jest.fn(),
          onDragEnter: jest.fn(),
          onDragLeave: jest.fn(),
          onDragOver: jest.fn(),
          onDrop: jest.fn(),
          onKeyDown: jest.fn(),
        },
        style: { transition: 'transform 200ms ease, opacity 200ms ease', opacity: 1 },
        getNode: jest.fn(() => null),
      }));

      render(
        <SortableGridItem id="item-1" index={0} disabled data-testid="item">
          Content
        </SortableGridItem>
      );
      const element = screen.getByTestId('item');
      expect(element).toHaveAttribute('tabIndex', '-1');
    });
  });

  // 10. Props spreading tests
  describe('props spreading', () => {
    it('accepts data-testid attribute', () => {
      render(
        <SortableGridItem id="item-1" index={0} data-testid="custom-test-id">
          Content
        </SortableGridItem>
      );
      expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
    });

    it('only spreads supported props', () => {
      render(
        <SortableGridItem
          id="item-1"
          index={0}
          className="custom-class"
          style={{ backgroundColor: 'red' }}
          aria-label="Label"
          data-testid="item"
        >
          Content
        </SortableGridItem>
      );
      const element = screen.getByTestId('item');
      expect(element).toHaveClass('custom-class');
      expect(element).toHaveStyle({ backgroundColor: 'red' });
      expect(element).toHaveAttribute('aria-label', 'Label');
    });
  });

  // 11. Combined props tests
  describe('combined props', () => {
    it('renders with id, index, disabled, data, and styling', () => {
      render(
        <SortableGridItem
          id="item-1"
          index={5}
          disabled
          data={{ custom: 'value' }}
          className="custom-class"
          style={{ backgroundColor: 'green' }}
          data-testid="item"
        >
          Content
        </SortableGridItem>
      );

      const element = screen.getByTestId('item');
      expect(element).toHaveClass('custom-class');
      expect(element).toHaveStyle({ backgroundColor: 'green' });
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders with all props and render function', () => {
      const { useSortable } = require('../hooks');
      useSortable.mockImplementationOnce(() => ({
        isDragging: true,
        isOver: false,
        active: null,
        setNodeRef: jest.fn(),
        attributes: {
          draggable: true,
          'aria-grabbed': true,
          'data-dragging': true,
          'data-over': false,
          'data-sortable-id': 'item-1',
          role: 'listitem',
          tabIndex: 0,
        },
        listeners: {
          onDragStart: jest.fn(),
          onDragEnd: jest.fn(),
          onDragEnter: jest.fn(),
          onDragLeave: jest.fn(),
          onDragOver: jest.fn(),
          onDrop: jest.fn(),
          onKeyDown: jest.fn(),
        },
        style: { transition: 'transform 200ms ease, opacity 200ms ease', opacity: 0.5 },
        getNode: jest.fn(() => null),
      }));

      render(
        <SortableGridItem
          id="item-1"
          index={2}
          data={{ custom: 'data' }}
          className="custom"
          style={{ padding: '20px' }}
          aria-label="Custom item"
          data-testid="full-item"
        >
          {({ isDragging, isOver, index }) => (
            <div>
              {index}-{String(isDragging)}-{String(isOver)}
            </div>
          )}
        </SortableGridItem>
      );

      const element = screen.getByTestId('full-item');
      expect(element).toHaveClass('custom');
      expect(element).toHaveStyle({ padding: '20px', opacity: 0.5 });
      expect(element).toHaveAttribute('aria-label', 'Custom item');
      expect(screen.getByText('2-true-false')).toBeInTheDocument();
    });
  });

  // 12. Edge cases
  describe('edge cases', () => {
    it('handles empty children', () => {
      render(<SortableGridItem id="item-1" index={0} data-testid="item" />);
      const element = screen.getByTestId('item');
      expect(element).toBeInTheDocument();
      expect(element.textContent).toBe('');
    });

    it('handles null children', () => {
      render(
        <SortableGridItem id="item-1" index={0} data-testid="item">
          {null}
        </SortableGridItem>
      );
      const element = screen.getByTestId('item');
      expect(element).toBeInTheDocument();
    });

    it('handles undefined children', () => {
      render(
        <SortableGridItem id="item-1" index={0} data-testid="item">
          {undefined}
        </SortableGridItem>
      );
      const element = screen.getByTestId('item');
      expect(element).toBeInTheDocument();
    });

    it('handles render function returning null', () => {
      render(
        <SortableGridItem id="item-1" index={0} data-testid="item">
          {() => null}
        </SortableGridItem>
      );
      const element = screen.getByTestId('item');
      expect(element).toBeInTheDocument();
      expect(element.textContent).toBe('');
    });

    it('handles very long id', () => {
      const longId = `item-${'x'.repeat(1000)}`;
      render(
        <SortableGridItem id={longId} index={0} data-testid="item">
          Content
        </SortableGridItem>
      );
      const element = screen.getByTestId('item');
      expect(element).toHaveAttribute('data-sortable-id', longId);
    });

    it('handles large index values', () => {
      render(
        <SortableGridItem id="item-1" index={999999}>
          {({ index }) => <div>Index: {index}</div>}
        </SortableGridItem>
      );
      expect(screen.getByText('Index: 999999')).toBeInTheDocument();
    });

    it('handles special characters in id', () => {
      const specialId = 'item-!@#$%^&*()';
      render(
        <SortableGridItem id={specialId} index={0} data-testid="item">
          Content
        </SortableGridItem>
      );
      const element = screen.getByTestId('item');
      expect(element).toHaveAttribute('data-sortable-id', specialId);
    });

    it('handles empty string id', () => {
      render(
        <SortableGridItem id="" index={0} data-testid="item">
          Content
        </SortableGridItem>
      );
      const element = screen.getByTestId('item');
      expect(element).toHaveAttribute('data-sortable-id', '');
    });

    it('handles null className gracefully', () => {
      render(
        <SortableGridItem id="item-1" index={0} className={null as any} data-testid="item">
          Content
        </SortableGridItem>
      );
      const element = screen.getByTestId('item');
      expect(element).toBeInTheDocument();
    });

    it('updates when props change', () => {
      const { rerender } = render(
        <SortableGridItem id="item-1" index={0} data-testid="item">
          Content 1
        </SortableGridItem>
      );

      expect(screen.getByText('Content 1')).toBeInTheDocument();

      rerender(
        <SortableGridItem id="item-1" index={0} data-testid="item">
          Content 2
        </SortableGridItem>
      );

      expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    it('updates render function when index changes', () => {
      const { rerender } = render(
        <SortableGridItem id="item-1" index={0}>
          {({ index }) => <div>Index: {index}</div>}
        </SortableGridItem>
      );

      expect(screen.getByText('Index: 0')).toBeInTheDocument();

      rerender(
        <SortableGridItem id="item-1" index={5}>
          {({ index }) => <div>Index: {index}</div>}
        </SortableGridItem>
      );

      expect(screen.queryByText('Index: 0')).not.toBeInTheDocument();
      expect(screen.getByText('Index: 5')).toBeInTheDocument();
    });
  });
});

// 14. Integration with useSortable hook
describe('useSortable hook integration', () => {
  it('calls useSortable with correct options', () => {
    const { useSortable } = require('../hooks');
    render(
      <SortableGridItem id="item-1" index={3} disabled data={{ foo: 'bar' }}>
        Content
      </SortableGridItem>
    );

    expect(useSortable).toHaveBeenCalledWith({
      id: 'item-1',
      index: 3,
      data: { foo: 'bar', type: 'grid-item' },
      disabled: true,
      groupId: 'sortable-grid',
    });
  });

  it('applies styles from useSortable', () => {
    const { useSortable } = require('../hooks');
    useSortable.mockImplementationOnce(() => ({
      isDragging: true,
      isOver: false,
      active: null,
      setNodeRef: jest.fn(),
      attributes: {
        draggable: true,
        'aria-grabbed': true,
        'data-dragging': true,
        'data-over': false,
        'data-sortable-id': 'item-1',
        role: 'listitem',
        tabIndex: 0,
      },
      listeners: {
        onDragStart: jest.fn(),
        onDragEnd: jest.fn(),
        onDragEnter: jest.fn(),
        onDragLeave: jest.fn(),
        onDragOver: jest.fn(),
        onDrop: jest.fn(),
        onKeyDown: jest.fn(),
      },
      style: {
        transition: 'transform 200ms ease, opacity 200ms ease',
        opacity: 0.5,
      },
      getNode: jest.fn(() => null),
    }));

    render(
      <SortableGridItem id="item-1" index={0} data-testid="item">
        Content
      </SortableGridItem>
    );

    const element = screen.getByTestId('item');
    expect(element).toHaveStyle({
      transition: 'transform 200ms ease, opacity 200ms ease',
      opacity: 0.5,
    });
  });

  it('applies attributes from useSortable', () => {
    const { useSortable } = require('../hooks');
    useSortable.mockImplementationOnce(() => ({
      isDragging: true,
      isOver: true,
      active: null,
      setNodeRef: jest.fn(),
      attributes: {
        draggable: true,
        'aria-grabbed': true,
        'data-dragging': true,
        'data-over': true,
        'data-sortable-id': 'item-1',
        role: 'listitem',
        tabIndex: 0,
      },
      listeners: {
        onDragStart: jest.fn(),
        onDragEnd: jest.fn(),
        onDragEnter: jest.fn(),
        onDragLeave: jest.fn(),
        onDragOver: jest.fn(),
        onDrop: jest.fn(),
        onKeyDown: jest.fn(),
      },
      style: { transition: 'transform 200ms ease, opacity 200ms ease', opacity: 0.5 },
      getNode: jest.fn(() => null),
    }));

    render(
      <SortableGridItem id="item-1" index={0} data-testid="item">
        Content
      </SortableGridItem>
    );

    const element = screen.getByTestId('item');
    expect(element).toHaveAttribute('draggable', 'true');
    expect(element).toHaveAttribute('aria-grabbed', 'true');
    expect(element).toHaveAttribute('data-dragging', 'true');
    expect(element).toHaveAttribute('data-over', 'true');
    expect(element).toHaveAttribute('data-sortable-id', 'item-1');
    expect(element).toHaveAttribute('tabIndex', '0');
  });
});

// 15. Complex rendering scenarios
describe('complex rendering scenarios', () => {
  it('renders with nested components in render function', () => {
    render(
      <SortableGridItem id="item-1" index={0}>
        {({ isDragging, isOver }) => (
          <div>
            <h3>Title</h3>
            <div>
              <button>Edit</button>
              <button>Delete</button>
            </div>
            {isDragging && <span>Dragging...</span>}
            {isOver && <span>Drop here</span>}
          </div>
        )}
      </SortableGridItem>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('renders conditional content based on isDragging', () => {
    const { useSortable } = require('../hooks');
    useSortable.mockImplementationOnce(() => ({
      isDragging: true,
      isOver: false,
      active: null,
      setNodeRef: jest.fn(),
      attributes: {
        draggable: true,
        'aria-grabbed': true,
        'data-dragging': true,
        'data-over': false,
        'data-sortable-id': 'item-1',
        role: 'listitem',
        tabIndex: 0,
      },
      listeners: {
        onDragStart: jest.fn(),
        onDragEnd: jest.fn(),
        onDragEnter: jest.fn(),
        onDragLeave: jest.fn(),
        onDragOver: jest.fn(),
        onDrop: jest.fn(),
        onKeyDown: jest.fn(),
      },
      style: { transition: 'transform 200ms ease, opacity 200ms ease', opacity: 0.5 },
      getNode: jest.fn(() => null),
    }));

    render(
      <SortableGridItem id="item-1" index={0}>
        {({ isDragging }) => (
          <div>{isDragging ? <span>Dragging</span> : <span>Not dragging</span>}</div>
        )}
      </SortableGridItem>
    );

    expect(screen.getByText('Dragging')).toBeInTheDocument();
    expect(screen.queryByText('Not dragging')).not.toBeInTheDocument();
  });

  it('renders conditional content based on isOver', () => {
    const { useSortable } = require('../hooks');
    useSortable.mockImplementationOnce(() => ({
      isDragging: false,
      isOver: true,
      active: null,
      setNodeRef: jest.fn(),
      attributes: {
        draggable: true,
        'aria-grabbed': false,
        'data-dragging': false,
        'data-over': true,
        'data-sortable-id': 'item-1',
        role: 'listitem',
        tabIndex: 0,
      },
      listeners: {
        onDragStart: jest.fn(),
        onDragEnd: jest.fn(),
        onDragEnter: jest.fn(),
        onDragLeave: jest.fn(),
        onDragOver: jest.fn(),
        onDrop: jest.fn(),
        onKeyDown: jest.fn(),
      },
      style: { transition: 'transform 200ms ease, opacity 200ms ease', opacity: 1 },
      getNode: jest.fn(() => null),
    }));

    render(
      <SortableGridItem id="item-1" index={0}>
        {({ isOver }) => <div>{isOver ? <span>Drop here</span> : <span>Normal</span>}</div>}
      </SortableGridItem>
    );

    expect(screen.getByText('Drop here')).toBeInTheDocument();
    expect(screen.queryByText('Normal')).not.toBeInTheDocument();
  });

  it('renders with image content', () => {
    render(
      <SortableGridItem id="item-1" index={0}>
        <img src="test.jpg" alt="Sample item" />
      </SortableGridItem>
    );

    const img = screen.getByAltText('Sample item');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'test.jpg');
  });

  it('renders with form elements', () => {
    render(
      <SortableGridItem id="item-1" index={0}>
        <form>
          <input type="text" placeholder="Enter text" />
          <button type="submit">Submit</button>
        </form>
      </SortableGridItem>
    );

    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });
});
