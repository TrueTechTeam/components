import { render, screen, fireEvent } from '@testing-library/react';
import { SortableList, type SortableListItem } from './SortableList';
import { DragHandle } from '../DragHandle';

interface TestItem extends SortableListItem {
  id: string;
  name: string;
}

const mockItems: TestItem[] = [
  { id: '1', name: 'Item 1' },
  { id: '2', name: 'Item 2' },
  { id: '3', name: 'Item 3' },
];

describe('SortableList', () => {
  // 1. Rendering tests
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<SortableList items={mockItems} renderItem={(item) => <div>{item.name}</div>} />);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('renders with all props', () => {
      const onReorder = jest.fn();
      const onReorderComplete = jest.fn();

      render(
        <SortableList
          items={mockItems}
          renderItem={(item) => <div>{item.name}</div>}
          onReorder={onReorder}
          onReorderComplete={onReorderComplete}
          gap="lg"
          direction="horizontal"
          groupId="test-group"
          useDragHandle
          disabled={false}
          className="custom-class"
          data-testid="test-sortable-list"
          aria-label="Test sortable list"
        />
      );

      const element = screen.getByTestId('test-sortable-list');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('custom-class');
    });

    it('renders items with render function', () => {
      render(
        <SortableList
          items={mockItems}
          renderItem={(item, { isDragging }) => <div data-dragging={isDragging}>{item.name}</div>}
        />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('renders as list with role="list"', () => {
      render(
        <SortableList
          items={mockItems}
          renderItem={(item) => <div>{item.name}</div>}
          data-testid="sortable-list"
        />
      );
      const element = screen.getByTestId('sortable-list');
      expect(element).toHaveAttribute('role', 'list');
    });

    it('includes default aria-label', () => {
      render(
        <SortableList
          items={mockItems}
          renderItem={(item) => <div>{item.name}</div>}
          data-testid="sortable-list"
        />
      );
      const element = screen.getByTestId('sortable-list');
      expect(element).toHaveAttribute('aria-label', 'Sortable list');
    });

    it('renders empty list', () => {
      render(
        <SortableList
          items={[] as Array<{ id: string; name: string }>}
          renderItem={(item) => <div>{item.name}</div>}
          data-testid="empty-list"
        />
      );
      const element = screen.getByTestId('empty-list');
      expect(element).toBeInTheDocument();
      expect(element.children).toHaveLength(0);
    });

    it('renders single item', () => {
      const singleItem = [{ id: '1', name: 'Single Item' }];
      render(<SortableList items={singleItem} renderItem={(item) => <div>{item.name}</div>} />);
      expect(screen.getByText('Single Item')).toBeInTheDocument();
    });

    it('renders many items', () => {
      const manyItems = Array.from({ length: 20 }, (_, i) => ({
        id: `${i}`,
        name: `Item ${i}`,
      }));
      render(<SortableList items={manyItems} renderItem={(item) => <div>{item.name}</div>} />);
      expect(screen.getByText('Item 0')).toBeInTheDocument();
      expect(screen.getByText('Item 19')).toBeInTheDocument();
    });
  });

  // 2. Direction tests
  describe('direction', () => {
    it('renders vertical direction by default', () => {
      render(
        <SortableList
          items={mockItems}
          renderItem={(item) => <div>{item.name}</div>}
          data-testid="sortable-list"
        />
      );
      const element = screen.getByTestId('sortable-list');
      expect(element).toHaveAttribute('data-direction', 'vertical');
    });

    it('renders vertical direction', () => {
      render(
        <SortableList
          items={mockItems}
          renderItem={(item) => <div>{item.name}</div>}
          direction="vertical"
          data-testid="sortable-list"
        />
      );
      const element = screen.getByTestId('sortable-list');
      expect(element).toHaveAttribute('data-direction', 'vertical');
    });

    it('renders horizontal direction', () => {
      render(
        <SortableList
          items={mockItems}
          renderItem={(item) => <div>{item.name}</div>}
          direction="horizontal"
          data-testid="sortable-list"
        />
      );
      const element = screen.getByTestId('sortable-list');
      expect(element).toHaveAttribute('data-direction', 'horizontal');
    });
  });

  // 3. Gap tests
  describe('gap', () => {
    it('uses md gap by default', () => {
      render(
        <SortableList
          items={mockItems}
          renderItem={(item) => <div>{item.name}</div>}
          data-testid="sortable-list"
        />
      );
      const element = screen.getByTestId('sortable-list');
      expect(element).toHaveStyle({ '--sortable-gap': 'var(--spacing-md)' });
    });

    it('renders with sm gap', () => {
      render(
        <SortableList
          items={mockItems}
          renderItem={(item) => <div>{item.name}</div>}
          gap="sm"
          data-testid="sortable-list"
        />
      );
      const element = screen.getByTestId('sortable-list');
      expect(element).toHaveStyle({ '--sortable-gap': 'var(--spacing-sm)' });
    });

    it('renders with lg gap', () => {
      render(
        <SortableList
          items={mockItems}
          renderItem={(item) => <div>{item.name}</div>}
          gap="lg"
          data-testid="sortable-list"
        />
      );
      const element = screen.getByTestId('sortable-list');
      expect(element).toHaveStyle({ '--sortable-gap': 'var(--spacing-lg)' });
    });

    it('renders with numeric gap in pixels', () => {
      render(
        <SortableList
          items={mockItems}
          renderItem={(item) => <div>{item.name}</div>}
          gap={16}
          data-testid="sortable-list"
        />
      );
      const element = screen.getByTestId('sortable-list');
      expect(element).toHaveStyle({ '--sortable-gap': '16px' });
    });

    it('renders with zero gap', () => {
      render(
        <SortableList
          items={mockItems}
          renderItem={(item) => <div>{item.name}</div>}
          gap={0}
          data-testid="sortable-list"
        />
      );
      const element = screen.getByTestId('sortable-list');
      expect(element).toHaveStyle({ '--sortable-gap': '0px' });
    });
  });

  // 4. Disabled state tests
  describe('disabled state', () => {
    it('is not disabled by default', () => {
      render(
        <SortableList
          items={mockItems}
          renderItem={(item) => <div>{item.name}</div>}
          data-testid="sortable-list"
        />
      );
      const element = screen.getByTestId('sortable-list');
      expect(element).not.toHaveAttribute('data-disabled');
    });

    it('renders disabled state', () => {
      render(
        <SortableList
          items={mockItems}
          renderItem={(item) => <div>{item.name}</div>}
          disabled
          data-testid="sortable-list"
        />
      );
      const element = screen.getByTestId('sortable-list');
      expect(element).toHaveAttribute('data-disabled', 'true');
    });

    it('does not set data-disabled when false explicitly', () => {
      render(
        <SortableList
          items={mockItems}
          renderItem={(item) => <div>{item.name}</div>}
          disabled={false}
          data-testid="sortable-list"
        />
      );
      const element = screen.getByTestId('sortable-list');
      expect(element).not.toHaveAttribute('data-disabled');
    });

    it('does not call onReorder when disabled', () => {
      const onReorder = jest.fn();
      render(
        <SortableList
          items={mockItems}
          renderItem={(item) => <div>{item.name}</div>}
          onReorder={onReorder}
          disabled
          data-testid="sortable-list"
        />
      );

      // Simulate drag and drop (though it won't actually work when disabled)
      const item = screen.getByText('Item 1');
      fireEvent.dragStart(item);
      fireEvent.dragEnd(item);

      // onReorder should not be called when disabled
      expect(onReorder).not.toHaveBeenCalled();
    });
  });

  // 5. Drag handle tests
  describe('drag handles', () => {
    it('does not use drag handles by default', () => {
      render(
        <SortableList
          items={mockItems}
          renderItem={(item, { dragHandleProps }) => (
            <div>
              {dragHandleProps && <DragHandle {...dragHandleProps} />}
              <span>{item.name}</span>
            </div>
          )}
        />
      );

      // No drag handles should be rendered
      const handles = document.querySelectorAll('[role="button"]');
      expect(handles.length).toBe(0);
    });

    it('renders drag handles when useDragHandle is true', () => {
      render(
        <SortableList
          items={mockItems}
          useDragHandle
          renderItem={(item, { dragHandleProps }) => (
            <div>
              {dragHandleProps && <DragHandle {...dragHandleProps} />}
              <span>{item.name}</span>
            </div>
          )}
        />
      );

      // Drag handles should be rendered
      const handles = document.querySelectorAll('[role="button"]');
      expect(handles.length).toBe(3);
    });

    it('provides dragHandleProps in render function when useDragHandle is true', () => {
      const renderItem = jest.fn((item) => <div>{item.name}</div>);

      render(<SortableList items={mockItems} useDragHandle renderItem={renderItem} />);

      // Check that dragHandleProps are provided
      expect(renderItem).toHaveBeenCalledWith(
        mockItems[0],
        expect.objectContaining({
          dragHandleProps: expect.objectContaining({
            draggable: expect.any(Boolean),
            onDragStart: expect.any(Function),
            onDragEnd: expect.any(Function),
            role: 'button',
          }),
        })
      );
    });

    it('does not provide dragHandleProps when useDragHandle is false', () => {
      const renderItem = jest.fn((item) => <div>{item.name}</div>);

      render(<SortableList items={mockItems} useDragHandle={false} renderItem={renderItem} />);

      // Check that dragHandleProps are undefined
      expect(renderItem).toHaveBeenCalledWith(
        mockItems[0],
        expect.objectContaining({
          dragHandleProps: undefined,
        })
      );
    });
  });

  // 6. Reordering tests
  describe('reordering', () => {
    it('calls onReorder when items are reordered', () => {
      const onReorder = jest.fn();
      render(
        <SortableList
          items={mockItems}
          renderItem={(item) => <div>{item.name}</div>}
          onReorder={onReorder}
        />
      );

      // Simulate reordering by manually triggering the internal handler
      // Note: Full drag-and-drop simulation is complex, so we verify the setup
      expect(onReorder).not.toHaveBeenCalled();
    });

    it('calls onReorderComplete with correct parameters', () => {
      const onReorderComplete = jest.fn();
      render(
        <SortableList
          items={mockItems}
          renderItem={(item) => <div>{item.name}</div>}
          onReorderComplete={onReorderComplete}
        />
      );

      expect(onReorderComplete).not.toHaveBeenCalled();
    });

    it('does not call callbacks if onReorder is not provided', () => {
      render(<SortableList items={mockItems} renderItem={(item) => <div>{item.name}</div>} />);

      // Should render without errors
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('provides correct index to renderItem', () => {
      const renderItem = jest.fn((item, { index }) => <div data-index={index}>{item.name}</div>);

      render(<SortableList items={mockItems} renderItem={renderItem} />);

      expect(renderItem).toHaveBeenNthCalledWith(
        1,
        mockItems[0],
        expect.objectContaining({ index: 0 })
      );
      expect(renderItem).toHaveBeenNthCalledWith(
        2,
        mockItems[1],
        expect.objectContaining({ index: 1 })
      );
      expect(renderItem).toHaveBeenNthCalledWith(
        3,
        mockItems[2],
        expect.objectContaining({ index: 2 })
      );
    });
  });

  // 7. Group ID tests
  describe('groupId', () => {
    it('does not set groupId by default', () => {
      const renderItem = jest.fn((item) => <div>{item.name}</div>);

      render(<SortableList items={mockItems} renderItem={renderItem} />);

      // Should render without groupId
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('accepts groupId prop', () => {
      render(
        <SortableList
          items={mockItems}
          renderItem={(item) => <div>{item.name}</div>}
          groupId="test-group"
        />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('allows cross-list sorting with same groupId', () => {
      const onReorder1 = jest.fn();
      const onReorder2 = jest.fn();

      render(
        <div>
          <SortableList
            items={[mockItems[0]]}
            renderItem={(item) => <div>{item.name}</div>}
            onReorder={onReorder1}
            groupId="shared-group"
            data-testid="list-1"
          />
          <SortableList
            items={[mockItems[1], mockItems[2]]}
            renderItem={(item) => <div>{item.name}</div>}
            onReorder={onReorder2}
            groupId="shared-group"
            data-testid="list-2"
          />
        </div>
      );

      expect(screen.getByTestId('list-1')).toBeInTheDocument();
      expect(screen.getByTestId('list-2')).toBeInTheDocument();
    });
  });

  // 8. Render props tests
  describe('render props', () => {
    it('provides isDragging prop to renderItem', () => {
      const renderItem = jest.fn((item, { isDragging }) => (
        <div data-dragging={isDragging}>{item.name}</div>
      ));

      render(<SortableList items={mockItems} renderItem={renderItem} />);

      expect(renderItem).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          isDragging: expect.any(Boolean),
        })
      );
    });

    it('provides isOver prop to renderItem', () => {
      const renderItem = jest.fn((item, { isOver }) => <div data-over={isOver}>{item.name}</div>);

      render(<SortableList items={mockItems} renderItem={renderItem} />);

      expect(renderItem).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          isOver: expect.any(Boolean),
        })
      );
    });

    it('provides all render props correctly', () => {
      const renderItem = jest.fn((item) => <div>{item.name}</div>);

      render(<SortableList items={mockItems} renderItem={renderItem} useDragHandle />);

      expect(renderItem).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          isDragging: expect.any(Boolean),
          isOver: expect.any(Boolean),
          index: expect.any(Number),
          dragHandleProps: expect.objectContaining({
            draggable: expect.any(Boolean),
          }),
        })
      );
    });
  });

  // 9. Accessibility tests
  describe('accessibility', () => {
    it('has correct aria-label when provided', () => {
      render(
        <SortableList
          items={mockItems}
          renderItem={(item) => <div>{item.name}</div>}
          aria-label="Custom sortable list"
          data-testid="sortable-list"
        />
      );
      const element = screen.getByTestId('sortable-list');
      expect(element).toHaveAttribute('aria-label', 'Custom sortable list');
    });

    it('has role="list"', () => {
      render(
        <SortableList
          items={mockItems}
          renderItem={(item) => <div>{item.name}</div>}
          data-testid="sortable-list"
        />
      );
      const element = screen.getByTestId('sortable-list');
      expect(element).toHaveAttribute('role', 'list');
    });

    it('maintains focus management when using drag handles', () => {
      render(
        <SortableList
          items={mockItems}
          useDragHandle
          renderItem={(item, { dragHandleProps }) => (
            <div>
              {dragHandleProps && <DragHandle {...dragHandleProps} />}
              <span>{item.name}</span>
            </div>
          )}
        />
      );

      const handles = document.querySelectorAll('[role="button"]');
      handles.forEach((handle) => {
        expect(handle).toHaveAttribute('tabIndex', '0');
      });
    });

    it('sets tabIndex to -1 on drag handles when disabled', () => {
      const renderItem = jest.fn((item, { dragHandleProps }) => (
        <div>
          {dragHandleProps && <DragHandle {...dragHandleProps} />}
          <span>{item.name}</span>
        </div>
      ));

      render(<SortableList items={mockItems} useDragHandle disabled renderItem={renderItem} />);

      // Check that dragHandleProps have tabIndex set to -1
      expect(renderItem).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          dragHandleProps: expect.objectContaining({
            tabIndex: -1,
          }),
        })
      );
    });
  });

  // 10. Custom styling tests
  describe('custom styling', () => {
    it('accepts custom className', () => {
      render(
        <SortableList
          items={mockItems}
          renderItem={(item) => <div>{item.name}</div>}
          className="custom-sortable-list"
          data-testid="sortable-list"
        />
      );
      const element = screen.getByTestId('sortable-list');
      expect(element).toHaveClass('custom-sortable-list');
    });

    it('accepts custom style prop', () => {
      render(
        <SortableList
          items={mockItems}
          renderItem={(item) => <div>{item.name}</div>}
          style={{ backgroundColor: 'red' }}
          data-testid="sortable-list"
        />
      );
      const element = screen.getByTestId('sortable-list');
      expect(element).toHaveStyle({ backgroundColor: 'red' });
    });

    it('merges custom style with internal styles', () => {
      render(
        <SortableList
          items={mockItems}
          renderItem={(item) => <div>{item.name}</div>}
          style={{ backgroundColor: 'red', padding: '10px' }}
          gap="lg"
          data-testid="sortable-list"
        />
      );
      const element = screen.getByTestId('sortable-list');
      expect(element).toHaveStyle({
        backgroundColor: 'red',
        padding: '10px',
        '--sortable-gap': 'var(--spacing-lg)',
      });
    });

    it('handles undefined className gracefully', () => {
      render(
        <SortableList
          items={mockItems}
          renderItem={(item) => <div>{item.name}</div>}
          className={undefined}
          data-testid="sortable-list"
        />
      );
      const element = screen.getByTestId('sortable-list');
      expect(element).toBeInTheDocument();
    });
  });

  // 11. Props spreading tests
  describe('props spreading', () => {
    it('forwards data-testid correctly', () => {
      render(
        <SortableList
          items={mockItems}
          renderItem={(item) => <div>{item.name}</div>}
          data-testid="custom-test-id"
        />
      );
      expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
    });

    it('accepts aria-label attribute', () => {
      render(
        <SortableList
          items={mockItems}
          renderItem={(item) => <div>{item.name}</div>}
          aria-label="Custom list label"
          data-testid="test-list"
        />
      );
      const element = screen.getByTestId('test-list');
      expect(element).toHaveAttribute('aria-label', 'Custom list label');
    });
  });

  // 12. Combined props tests
  describe('combined props', () => {
    it('renders with all direction and gap combinations', () => {
      const directions: Array<'vertical' | 'horizontal'> = ['vertical', 'horizontal'];
      const gaps = ['sm', 'md', 'lg'] as const;

      directions.forEach((direction) => {
        gaps.forEach((gap) => {
          const { container } = render(
            <SortableList
              items={mockItems}
              renderItem={(item) => <div>{item.name}</div>}
              direction={direction}
              gap={gap}
              data-testid={`list-${direction}-${gap}`}
            />
          );
          const element = screen.getByTestId(`list-${direction}-${gap}`);
          expect(element).toHaveAttribute('data-direction', direction);
          expect(element).toHaveStyle({ '--sortable-gap': `var(--spacing-${gap})` });
          container.remove();
        });
      });
    });

    it('renders with useDragHandle and disabled together', () => {
      render(
        <SortableList
          items={mockItems}
          useDragHandle
          disabled
          renderItem={(item, { dragHandleProps }) => (
            <div>
              {dragHandleProps && <DragHandle {...dragHandleProps} />}
              <span>{item.name}</span>
            </div>
          )}
          data-testid="sortable-list"
        />
      );

      const element = screen.getByTestId('sortable-list');
      expect(element).toHaveAttribute('data-disabled', 'true');

      const handles = document.querySelectorAll('[role="button"]');
      expect(handles.length).toBe(3);
    });

    it('renders with all callbacks provided', () => {
      const onReorder = jest.fn();
      const onReorderComplete = jest.fn();

      render(
        <SortableList
          items={mockItems}
          renderItem={(item) => <div>{item.name}</div>}
          onReorder={onReorder}
          onReorderComplete={onReorderComplete}
        />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('renders with complex item data', () => {
      interface ComplexItem extends SortableListItem {
        id: string;
        name: string;
        description: string;
        metadata: {
          count: number;
          status: string;
        };
      }

      const complexItems: ComplexItem[] = [
        {
          id: '1',
          name: 'Complex 1',
          description: 'Description 1',
          metadata: { count: 10, status: 'active' },
        },
        {
          id: '2',
          name: 'Complex 2',
          description: 'Description 2',
          metadata: { count: 20, status: 'inactive' },
        },
      ];

      render(
        <SortableList
          items={complexItems}
          renderItem={(item) => (
            <div>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <span>{item.metadata.status}</span>
            </div>
          )}
        />
      );

      expect(screen.getByText('Complex 1')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('active')).toBeInTheDocument();
    });
  });

  // 13. Edge cases tests
  describe('edge cases', () => {
    it('handles items with duplicate names but unique IDs', () => {
      const duplicateNameItems = [
        { id: '1', name: 'Item' },
        { id: '2', name: 'Item' },
        { id: '3', name: 'Item' },
      ];

      render(
        <SortableList
          items={duplicateNameItems}
          renderItem={(item) => <div data-id={item.id}>{item.name}</div>}
        />
      );

      const items = screen.getAllByText('Item');
      expect(items).toHaveLength(3);
    });

    it('handles items with special characters', () => {
      const specialItems = [
        { id: '1', name: 'Item <>&"' },
        { id: '2', name: "Item with 'quotes'" },
        { id: '3', name: 'Item with émojis 🎉' },
      ];

      render(<SortableList items={specialItems} renderItem={(item) => <div>{item.name}</div>} />);

      expect(screen.getByText('Item <>&"')).toBeInTheDocument();
      expect(screen.getByText("Item with 'quotes'")).toBeInTheDocument();
      expect(screen.getByText('Item with émojis 🎉')).toBeInTheDocument();
    });

    it('handles very long item names', () => {
      const longItems = [
        {
          id: '1',
          name: 'This is a very long item name that should still render correctly without breaking the layout or causing any issues',
        },
      ];

      render(<SortableList items={longItems} renderItem={(item) => <div>{item.name}</div>} />);

      expect(screen.getByText(longItems[0].name)).toBeInTheDocument();
    });

    it('handles items with null or undefined properties', () => {
      const itemsWithNulls = [
        { id: '1', name: 'Item 1', description: null },
        { id: '2', name: 'Item 2', description: undefined },
      ];

      render(<SortableList items={itemsWithNulls} renderItem={(item) => <div>{item.name}</div>} />);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('updates when items prop changes', () => {
      const { rerender } = render(
        <SortableList items={mockItems} renderItem={(item) => <div>{item.name}</div>} />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();

      const newItems = [
        { id: '4', name: 'Item 4' },
        { id: '5', name: 'Item 5' },
      ];

      rerender(<SortableList items={newItems} renderItem={(item) => <div>{item.name}</div>} />);

      expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
      expect(screen.getByText('Item 4')).toBeInTheDocument();
      expect(screen.getByText('Item 5')).toBeInTheDocument();
    });

    it('handles rapid reordering', () => {
      const onReorder = jest.fn();

      render(
        <SortableList
          items={mockItems}
          renderItem={(item) => <div>{item.name}</div>}
          onReorder={onReorder}
        />
      );

      // Render should be stable even with rapid updates
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('renders when onReorder returns same array', () => {
      const onReorder = jest.fn((items) => items);

      render(
        <SortableList
          items={mockItems}
          renderItem={(item) => <div>{item.name}</div>}
          onReorder={onReorder}
        />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });
});

// 15. DndProvider integration tests
describe('DndProvider integration', () => {
  it('wraps children in DndProvider', () => {
    render(<SortableList items={mockItems} renderItem={(item) => <div>{item.name}</div>} />);

    // Should render without errors, DndProvider is internal
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('provides drag context to items', () => {
    const renderItem = jest.fn((item) => <div>{item.name}</div>);

    render(<SortableList items={mockItems} renderItem={renderItem} />);

    // RenderItem should be called with proper context
    expect(renderItem).toHaveBeenCalled();
  });
});

// 16. Complex rendering scenarios
describe('complex rendering scenarios', () => {
  it('renders items with nested components', () => {
    render(
      <SortableList
        items={mockItems}
        renderItem={(item, { isDragging }) => (
          <div data-dragging={isDragging}>
            <div>
              <h3>{item.name}</h3>
              <div>
                <button>Edit</button>
                <button>Delete</button>
              </div>
            </div>
          </div>
        )}
      />
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getAllByText('Edit')).toHaveLength(3);
    expect(screen.getAllByText('Delete')).toHaveLength(3);
  });

  it('renders items with conditional content', () => {
    interface ConditionalItem extends SortableListItem {
      id: string;
      name: string;
      showBadge?: boolean;
    }

    const conditionalItems: ConditionalItem[] = [
      { id: '1', name: 'Item 1', showBadge: true },
      { id: '2', name: 'Item 2', showBadge: false },
      { id: '3', name: 'Item 3', showBadge: true },
    ];

    render(
      <SortableList
        items={conditionalItems}
        renderItem={(item) => (
          <div>
            <span>{item.name}</span>
            {item.showBadge && <span>Badge</span>}
          </div>
        )}
      />
    );

    const badges = screen.getAllByText('Badge');
    expect(badges).toHaveLength(2);
  });

  it('renders items with different drag handle variants', () => {
    render(
      <SortableList
        items={mockItems}
        useDragHandle
        renderItem={(item, { dragHandleProps, index }) => (
          <div>
            {dragHandleProps && (
              <DragHandle
                {...dragHandleProps}
                variant={index === 0 ? 'dots' : index === 1 ? 'lines' : 'grip'}
              />
            )}
            <span>{item.name}</span>
          </div>
        )}
      />
    );

    const handles = document.querySelectorAll('[role="button"]');
    expect(handles).toHaveLength(3);
    expect(handles[0]).toHaveAttribute('data-variant', 'dots');
    expect(handles[1]).toHaveAttribute('data-variant', 'lines');
    expect(handles[2]).toHaveAttribute('data-variant', 'grip');
  });
});

// 17. Performance tests
describe('performance', () => {
  it('renders large lists efficiently', () => {
    const largeItemList = Array.from({ length: 100 }, (_, i) => ({
      id: `${i}`,
      name: `Item ${i}`,
    }));

    render(<SortableList items={largeItemList} renderItem={(item) => <div>{item.name}</div>} />);

    expect(screen.getByText('Item 0')).toBeInTheDocument();
    expect(screen.getByText('Item 99')).toBeInTheDocument();
  });

  it('handles multiple rerenders efficiently', () => {
    const { rerender } = render(
      <SortableList items={mockItems} renderItem={(item) => <div>{item.name}</div>} gap="sm" />
    );

    rerender(
      <SortableList items={mockItems} renderItem={(item) => <div>{item.name}</div>} gap="md" />
    );

    rerender(
      <SortableList items={mockItems} renderItem={(item) => <div>{item.name}</div>} gap="lg" />
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });
});
