import React from 'react';
import { render, screen } from '@testing-library/react';
import { SortableGrid, type SortableGridItemData } from './SortableGrid';

// Mock the DndProvider to capture onDragEnd callback
let mockOnDragEnd: ((event: any) => void) | undefined;

jest.mock('../DndProvider', () => ({
  DndProvider: ({
    children,
    onDragEnd,
  }: {
    children: React.ReactNode;
    onDragEnd?: (event: any) => void;
  }) => {
    mockOnDragEnd = onDragEnd;
    return <div data-testid="dnd-provider">{children}</div>;
  },
}));

jest.mock('./SortableGridItem', () => ({
  SortableGridItem: ({
    id,
    index,
    disabled,
    children,
  }: {
    id: string;
    index: number;
    disabled?: boolean;
    children: (props: any) => React.ReactNode;
  }) => {
    return (
      <div
        data-testid={`sortable-item-${id}`}
        data-index={index}
        data-disabled={disabled}
        data-id={id}
      >
        {children({ isDragging: false, isOver: false, index })}
      </div>
    );
  },
}));

interface TestItem extends SortableGridItemData {
  id: string;
  label: string;
}

describe('SortableGrid', () => {
  const mockItems: TestItem[] = [
    { id: '1', label: 'Item 1' },
    { id: '2', label: 'Item 2' },
    { id: '3', label: 'Item 3' },
  ];

  const mockRenderItem = (item: TestItem) => <div>{item.label}</div>;

  beforeEach(() => {
    mockOnDragEnd = undefined;
  });

  // 1. Rendering tests
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<SortableGrid items={mockItems} renderItem={mockRenderItem} />);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('renders with all props', () => {
      render(
        <SortableGrid
          items={mockItems}
          renderItem={mockRenderItem}
          columns={3}
          minItemWidth={200}
          gap="lg"
          disabled={false}
          className="custom-grid"
          data-testid="test-grid"
          aria-label="Test Grid"
        />
      );

      const element = screen.getByTestId('test-grid');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('custom-grid');
      expect(element).toHaveAttribute('aria-label', 'Test Grid');
    });

    it('renders all items in correct order', () => {
      render(<SortableGrid items={mockItems} renderItem={mockRenderItem} />);
      const item1 = screen.getByTestId('sortable-item-1');
      const item2 = screen.getByTestId('sortable-item-2');
      const item3 = screen.getByTestId('sortable-item-3');

      expect(item1).toHaveAttribute('data-index', '0');
      expect(item2).toHaveAttribute('data-index', '1');
      expect(item3).toHaveAttribute('data-index', '2');
    });

    it('renders as grid role', () => {
      render(<SortableGrid items={mockItems} renderItem={mockRenderItem} data-testid="grid" />);
      const element = screen.getByTestId('grid');
      expect(element).toHaveAttribute('role', 'grid');
    });

    it('renders with default aria-label', () => {
      render(<SortableGrid items={mockItems} renderItem={mockRenderItem} data-testid="grid" />);
      const element = screen.getByTestId('grid');
      expect(element).toHaveAttribute('aria-label', 'Sortable grid');
    });

    it('renders with custom aria-label', () => {
      render(
        <SortableGrid
          items={mockItems}
          renderItem={mockRenderItem}
          aria-label="My Custom Grid"
          data-testid="grid"
        />
      );
      const element = screen.getByTestId('grid');
      expect(element).toHaveAttribute('aria-label', 'My Custom Grid');
    });

    it('wraps items in DndProvider', () => {
      render(<SortableGrid items={mockItems} renderItem={mockRenderItem} />);
      expect(screen.getByTestId('dnd-provider')).toBeInTheDocument();
    });

    it('renders with empty items array', () => {
      render(<SortableGrid items={[]} renderItem={mockRenderItem} data-testid="empty-grid" />);
      const element = screen.getByTestId('empty-grid');
      expect(element).toBeInTheDocument();
      expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    });
  });

  // 2. Column configuration tests
  describe('columns', () => {
    it('renders with auto columns by default', () => {
      render(<SortableGrid items={mockItems} renderItem={mockRenderItem} data-testid="grid" />);
      const element = screen.getByTestId('grid');
      const style = element.getAttribute('style');
      expect(style).toContain('repeat(auto-fill');
    });

    it('renders with fixed number of columns', () => {
      render(
        <SortableGrid
          items={mockItems}
          renderItem={mockRenderItem}
          columns={3}
          data-testid="grid"
        />
      );
      const element = screen.getByTestId('grid');
      const style = element.getAttribute('style');
      expect(style).toContain('repeat(3');
    });

    it('renders with 2 columns', () => {
      render(
        <SortableGrid
          items={mockItems}
          renderItem={mockRenderItem}
          columns={2}
          data-testid="grid"
        />
      );
      const element = screen.getByTestId('grid');
      const style = element.getAttribute('style');
      expect(style).toContain('repeat(2');
    });

    it('renders with 4 columns', () => {
      render(
        <SortableGrid
          items={mockItems}
          renderItem={mockRenderItem}
          columns={4}
          data-testid="grid"
        />
      );
      const element = screen.getByTestId('grid');
      const style = element.getAttribute('style');
      expect(style).toContain('repeat(4');
    });

    it('renders with auto columns explicitly set', () => {
      render(
        <SortableGrid
          items={mockItems}
          renderItem={mockRenderItem}
          columns="auto"
          data-testid="grid"
        />
      );
      const element = screen.getByTestId('grid');
      const style = element.getAttribute('style');
      expect(style).toContain('repeat(auto-fill');
    });
  });

  // 3. Gap configuration tests
  describe('gap', () => {
    it('renders with md gap by default', () => {
      render(<SortableGrid items={mockItems} renderItem={mockRenderItem} data-testid="grid" />);
      const element = screen.getByTestId('grid');
      const style = element.getAttribute('style');
      expect(style).toContain('--spacing-md');
    });

    it('renders with sm gap', () => {
      render(
        <SortableGrid items={mockItems} renderItem={mockRenderItem} gap="sm" data-testid="grid" />
      );
      const element = screen.getByTestId('grid');
      const style = element.getAttribute('style');
      expect(style).toContain('--spacing-sm');
    });

    it('renders with lg gap', () => {
      render(
        <SortableGrid items={mockItems} renderItem={mockRenderItem} gap="lg" data-testid="grid" />
      );
      const element = screen.getByTestId('grid');
      const style = element.getAttribute('style');
      expect(style).toContain('--spacing-lg');
    });

    it('renders with numeric gap', () => {
      render(
        <SortableGrid items={mockItems} renderItem={mockRenderItem} gap={20} data-testid="grid" />
      );
      const element = screen.getByTestId('grid');
      const style = element.getAttribute('style');
      expect(style).toContain('20px');
    });

    it('renders with zero gap', () => {
      render(
        <SortableGrid items={mockItems} renderItem={mockRenderItem} gap={0} data-testid="grid" />
      );
      const element = screen.getByTestId('grid');
      const style = element.getAttribute('style');
      expect(style).toContain('0px');
    });
  });

  // 4. Min item width tests
  describe('minItemWidth', () => {
    it('renders with default min item width of 150px', () => {
      render(<SortableGrid items={mockItems} renderItem={mockRenderItem} data-testid="grid" />);
      const element = screen.getByTestId('grid');
      const style = element.getAttribute('style');
      expect(style).toContain('150px');
    });

    it('renders with custom min item width', () => {
      render(
        <SortableGrid
          items={mockItems}
          renderItem={mockRenderItem}
          minItemWidth={200}
          data-testid="grid"
        />
      );
      const element = screen.getByTestId('grid');
      const style = element.getAttribute('style');
      expect(style).toContain('200px');
    });

    it('renders with small min item width', () => {
      render(
        <SortableGrid
          items={mockItems}
          renderItem={mockRenderItem}
          minItemWidth={100}
          data-testid="grid"
        />
      );
      const element = screen.getByTestId('grid');
      const style = element.getAttribute('style');
      expect(style).toContain('100px');
    });

    it('renders with large min item width', () => {
      render(
        <SortableGrid
          items={mockItems}
          renderItem={mockRenderItem}
          minItemWidth={300}
          data-testid="grid"
        />
      );
      const element = screen.getByTestId('grid');
      const style = element.getAttribute('style');
      expect(style).toContain('300px');
    });
  });

  // 5. Disabled state tests
  describe('disabled state', () => {
    it('is not disabled by default', () => {
      render(<SortableGrid items={mockItems} renderItem={mockRenderItem} data-testid="grid" />);
      const element = screen.getByTestId('grid');
      expect(element).not.toHaveAttribute('data-disabled');
    });

    it('renders disabled state', () => {
      render(
        <SortableGrid items={mockItems} renderItem={mockRenderItem} disabled data-testid="grid" />
      );
      const element = screen.getByTestId('grid');
      expect(element).toHaveAttribute('data-disabled', 'true');
    });

    it('passes disabled state to grid items', () => {
      render(<SortableGrid items={mockItems} renderItem={mockRenderItem} disabled />);
      const item1 = screen.getByTestId('sortable-item-1');
      const item2 = screen.getByTestId('sortable-item-2');
      const item3 = screen.getByTestId('sortable-item-3');

      expect(item1).toHaveAttribute('data-disabled', 'true');
      expect(item2).toHaveAttribute('data-disabled', 'true');
      expect(item3).toHaveAttribute('data-disabled', 'true');
    });

    it('does not render disabled state when false', () => {
      render(
        <SortableGrid
          items={mockItems}
          renderItem={mockRenderItem}
          disabled={false}
          data-testid="grid"
        />
      );
      const element = screen.getByTestId('grid');
      expect(element).not.toHaveAttribute('data-disabled');
    });
  });

  // 6. Render function tests
  describe('renderItem function', () => {
    it('calls renderItem for each item', () => {
      const mockRender = jest.fn((item: TestItem) => <div>{item.label}</div>);
      render(<SortableGrid items={mockItems} renderItem={mockRender} />);
      expect(mockRender).toHaveBeenCalledTimes(3);
    });

    it('passes correct item to renderItem', () => {
      const mockRender = jest.fn((item: TestItem) => <div>{item.label}</div>);
      render(<SortableGrid items={mockItems} renderItem={mockRender} />);

      expect(mockRender).toHaveBeenCalledWith(
        mockItems[0],
        expect.objectContaining({ isDragging: false, isOver: false, index: 0 })
      );
      expect(mockRender).toHaveBeenCalledWith(
        mockItems[1],
        expect.objectContaining({ isDragging: false, isOver: false, index: 1 })
      );
      expect(mockRender).toHaveBeenCalledWith(
        mockItems[2],
        expect.objectContaining({ isDragging: false, isOver: false, index: 2 })
      );
    });

    it('renders complex content from renderItem', () => {
      const complexRenderItem = (item: TestItem) => (
        <div>
          <h3>{item.label}</h3>
          <p>Description for {item.id}</p>
        </div>
      );

      render(<SortableGrid items={mockItems} renderItem={complexRenderItem} />);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Description for 1')).toBeInTheDocument();
    });

    it('renders with render function that uses props', () => {
      const renderWithProps = (item: TestItem, props: any) => (
        <div>
          {item.label}
          {props.isDragging && ' (dragging)'}
        </div>
      );

      render(<SortableGrid items={mockItems} renderItem={renderWithProps} />);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });

  // 7. Reordering tests
  describe('onReorder callback', () => {
    it('does not call onReorder when not provided', () => {
      render(<SortableGrid items={mockItems} renderItem={mockRenderItem} />);
      expect(screen.getByTestId('dnd-provider')).toBeInTheDocument();
    });

    it('registers onDragEnd handler with DndProvider', () => {
      const mockOnReorder = jest.fn();
      render(
        <SortableGrid items={mockItems} renderItem={mockRenderItem} onReorder={mockOnReorder} />
      );

      expect(mockOnDragEnd).toBeDefined();
    });

    it('handles reordering from first to last position', () => {
      const mockOnReorder = jest.fn();
      render(
        <SortableGrid items={mockItems} renderItem={mockRenderItem} onReorder={mockOnReorder} />
      );

      // Simulate drag end event through the captured handler
      mockOnDragEnd?.({
        active: { id: '1', data: { index: 0 } },
        over: { id: '3', data: { index: 2 } },
      });

      expect(mockOnReorder).toHaveBeenCalledWith([
        { id: '2', label: 'Item 2' },
        { id: '3', label: 'Item 3' },
        { id: '1', label: 'Item 1' },
      ]);
    });

    it('handles reordering from last to first position', () => {
      const mockOnReorder = jest.fn();
      render(
        <SortableGrid items={mockItems} renderItem={mockRenderItem} onReorder={mockOnReorder} />
      );

      mockOnDragEnd?.({
        active: { id: '3', data: { index: 2 } },
        over: { id: '1', data: { index: 0 } },
      });

      expect(mockOnReorder).toHaveBeenCalledWith([
        { id: '3', label: 'Item 3' },
        { id: '1', label: 'Item 1' },
        { id: '2', label: 'Item 2' },
      ]);
    });

    it('handles reordering from middle position', () => {
      const mockOnReorder = jest.fn();
      render(
        <SortableGrid items={mockItems} renderItem={mockRenderItem} onReorder={mockOnReorder} />
      );

      mockOnDragEnd?.({
        active: { id: '2', data: { index: 1 } },
        over: { id: '1', data: { index: 0 } },
      });

      expect(mockOnReorder).toHaveBeenCalledWith([
        { id: '2', label: 'Item 2' },
        { id: '1', label: 'Item 1' },
        { id: '3', label: 'Item 3' },
      ]);
    });

    it('does not call onReorder when dragging to same position', () => {
      const mockOnReorder = jest.fn();
      render(
        <SortableGrid items={mockItems} renderItem={mockRenderItem} onReorder={mockOnReorder} />
      );

      mockOnDragEnd?.({
        active: { id: '1', data: { index: 0 } },
        over: { id: '1', data: { index: 0 } },
      });

      expect(mockOnReorder).not.toHaveBeenCalled();
    });

    it('does not call onReorder when no over target', () => {
      const mockOnReorder = jest.fn();
      render(
        <SortableGrid items={mockItems} renderItem={mockRenderItem} onReorder={mockOnReorder} />
      );

      mockOnDragEnd?.({
        active: { id: '1', data: { index: 0 } },
        over: null,
      });

      expect(mockOnReorder).not.toHaveBeenCalled();
    });

    it('does not call onReorder when fromIndex is invalid', () => {
      const mockOnReorder = jest.fn();
      render(
        <SortableGrid items={mockItems} renderItem={mockRenderItem} onReorder={mockOnReorder} />
      );

      mockOnDragEnd?.({
        active: { id: '1', data: { index: 'invalid' } },
        over: { id: '2', data: { index: 1 } },
      });

      expect(mockOnReorder).not.toHaveBeenCalled();
    });

    it('does not call onReorder when toIndex is invalid', () => {
      const mockOnReorder = jest.fn();
      render(
        <SortableGrid items={mockItems} renderItem={mockRenderItem} onReorder={mockOnReorder} />
      );

      mockOnDragEnd?.({
        active: { id: '1', data: { index: 0 } },
        over: { id: '2', data: { index: 'invalid' } },
      });

      expect(mockOnReorder).not.toHaveBeenCalled();
    });

    it('does not throw when onReorder is not provided', () => {
      render(<SortableGrid items={mockItems} renderItem={mockRenderItem} />);

      expect(() => {
        mockOnDragEnd?.({
          active: { id: '1', data: { index: 0 } },
          over: { id: '3', data: { index: 2 } },
        });
      }).not.toThrow();
    });
  });

  // 8. Custom styling tests
  describe('custom styling', () => {
    it('accepts custom className', () => {
      render(
        <SortableGrid
          items={mockItems}
          renderItem={mockRenderItem}
          className="custom-grid"
          data-testid="grid"
        />
      );
      const element = screen.getByTestId('grid');
      expect(element).toHaveClass('custom-grid');
    });

    it('accepts custom style prop', () => {
      render(
        <SortableGrid
          items={mockItems}
          renderItem={mockRenderItem}
          style={{ backgroundColor: 'red' }}
          data-testid="grid"
        />
      );
      const element = screen.getByTestId('grid');
      expect(element).toHaveStyle({ backgroundColor: 'red' });
    });

    it('merges custom style with grid styles', () => {
      render(
        <SortableGrid
          items={mockItems}
          renderItem={mockRenderItem}
          style={{ backgroundColor: 'red', padding: '10px' }}
          data-testid="grid"
        />
      );
      const element = screen.getByTestId('grid');
      expect(element).toHaveStyle({ backgroundColor: 'red', padding: '10px' });
      expect(element.getAttribute('style')).toContain('--grid-gap');
      expect(element.getAttribute('style')).toContain('--grid-template');
    });

    it('handles undefined className gracefully', () => {
      render(
        <SortableGrid
          items={mockItems}
          renderItem={mockRenderItem}
          className={undefined}
          data-testid="grid"
        />
      );
      const element = screen.getByTestId('grid');
      expect(element).toBeInTheDocument();
    });
  });

  // 9. Grid layout style tests
  describe('grid layout styles', () => {
    it('applies correct CSS custom properties', () => {
      render(<SortableGrid items={mockItems} renderItem={mockRenderItem} data-testid="grid" />);
      const element = screen.getByTestId('grid');
      const style = element.getAttribute('style');

      expect(style).toContain('--grid-gap');
      expect(style).toContain('--grid-template');
    });

    it('applies correct grid template for auto columns', () => {
      render(
        <SortableGrid
          items={mockItems}
          renderItem={mockRenderItem}
          columns="auto"
          minItemWidth={200}
          data-testid="grid"
        />
      );
      const element = screen.getByTestId('grid');
      const style = element.getAttribute('style');

      expect(style).toContain('repeat(auto-fill, minmax(200px, 1fr))');
    });

    it('applies correct grid template for fixed columns', () => {
      render(
        <SortableGrid
          items={mockItems}
          renderItem={mockRenderItem}
          columns={3}
          minItemWidth={150}
          data-testid="grid"
        />
      );
      const element = screen.getByTestId('grid');
      const style = element.getAttribute('style');

      expect(style).toContain('repeat(3, minmax(150px, 1fr))');
    });
  });

  // 10. Combined props tests
  describe('combined props', () => {
    it('renders with all column and gap combinations', () => {
      const columns = [2, 3, 4, 'auto'] as const;
      const gaps = ['sm', 'md', 'lg'] as const;

      columns.forEach((col) => {
        gaps.forEach((gapSize) => {
          const { container } = render(
            <SortableGrid
              items={mockItems}
              renderItem={mockRenderItem}
              columns={col}
              gap={gapSize}
              data-testid={`grid-${col}-${gapSize}`}
            />
          );
          const element = screen.getByTestId(`grid-${col}-${gapSize}`);
          expect(element).toBeInTheDocument();
          container.remove();
        });
      });
    });

    it('renders with columns, gap, minItemWidth, and disabled', () => {
      render(
        <SortableGrid
          items={mockItems}
          renderItem={mockRenderItem}
          columns={3}
          gap="lg"
          minItemWidth={200}
          disabled
          data-testid="grid"
        />
      );

      const element = screen.getByTestId('grid');
      expect(element).toHaveAttribute('data-disabled', 'true');
      expect(element.getAttribute('style')).toContain('--spacing-lg');
      expect(element.getAttribute('style')).toContain('repeat(3');
      expect(element.getAttribute('style')).toContain('200px');
    });

    it('renders with all props and custom styles', () => {
      const mockOnReorder = jest.fn();
      render(
        <SortableGrid
          items={mockItems}
          renderItem={mockRenderItem}
          onReorder={mockOnReorder}
          columns={4}
          gap={16}
          minItemWidth={180}
          disabled={false}
          className="custom-class"
          style={{ border: '1px solid red' }}
          data-testid="full-grid"
          aria-label="Full Grid"
        />
      );

      const element = screen.getByTestId('full-grid');
      expect(element).toHaveClass('custom-class');
      expect(element).toHaveStyle({ border: '1px solid red' });
      expect(element).toHaveAttribute('aria-label', 'Full Grid');
      expect(element.getAttribute('style')).toContain('16px');
      expect(element.getAttribute('style')).toContain('repeat(4');
      expect(element.getAttribute('style')).toContain('180px');
    });
  });

  // 11. Data attributes tests
  describe('data attributes', () => {
    it('accepts data-testid attribute', () => {
      render(
        <SortableGrid items={mockItems} renderItem={mockRenderItem} data-testid="test-grid" />
      );
      expect(screen.getByTestId('test-grid')).toBeInTheDocument();
    });
  });

  // 12. Edge cases
  describe('edge cases', () => {
    it('renders with single item', () => {
      const singleItem = [{ id: '1', label: 'Single Item' }];
      render(<SortableGrid items={singleItem} renderItem={mockRenderItem} />);
      expect(screen.getByText('Single Item')).toBeInTheDocument();
    });

    it('renders with many items', () => {
      const manyItems = Array.from({ length: 20 }, (_, i) => ({
        id: `${i + 1}`,
        label: `Item ${i + 1}`,
      }));
      render(<SortableGrid items={manyItems} renderItem={mockRenderItem} />);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 20')).toBeInTheDocument();
    });

    it('handles items with special characters', () => {
      const specialItems = [
        { id: '1', label: 'Item with !@#$%' },
        { id: '2', label: 'Item with <>&"' },
      ];
      render(<SortableGrid items={specialItems} renderItem={mockRenderItem} />);
      expect(screen.getByText('Item with !@#$%')).toBeInTheDocument();
      expect(screen.getByText('Item with <>&"')).toBeInTheDocument();
    });

    it('handles items with unicode characters', () => {
      const unicodeItems = [
        { id: '1', label: 'Party' },
        { id: '2', label: 'Sparkle' },
      ];
      render(<SortableGrid items={unicodeItems} renderItem={mockRenderItem} />);
      expect(screen.getByText('Party')).toBeInTheDocument();
      expect(screen.getByText('Sparkle')).toBeInTheDocument();
    });

    it('handles items with additional properties', () => {
      const itemsWithProps = [
        { id: '1', label: 'Item 1', color: 'red', size: 'large' },
        { id: '2', label: 'Item 2', color: 'blue', size: 'small' },
      ];

      const renderWithProps = (item: any) => (
        <div>
          {item.label} - {item.color} - {item.size}
        </div>
      );

      render(<SortableGrid items={itemsWithProps} renderItem={renderWithProps} />);
      expect(screen.getByText('Item 1 - red - large')).toBeInTheDocument();
      expect(screen.getByText('Item 2 - blue - small')).toBeInTheDocument();
    });

    it('handles very small gap values', () => {
      render(
        <SortableGrid items={mockItems} renderItem={mockRenderItem} gap={1} data-testid="grid" />
      );
      const element = screen.getByTestId('grid');
      expect(element.getAttribute('style')).toContain('1px');
    });

    it('handles very large gap values', () => {
      render(
        <SortableGrid items={mockItems} renderItem={mockRenderItem} gap={100} data-testid="grid" />
      );
      const element = screen.getByTestId('grid');
      expect(element.getAttribute('style')).toContain('100px');
    });

    it('handles very small minItemWidth', () => {
      render(
        <SortableGrid
          items={mockItems}
          renderItem={mockRenderItem}
          minItemWidth={50}
          data-testid="grid"
        />
      );
      const element = screen.getByTestId('grid');
      expect(element.getAttribute('style')).toContain('50px');
    });

    it('handles very large minItemWidth', () => {
      render(
        <SortableGrid
          items={mockItems}
          renderItem={mockRenderItem}
          minItemWidth={500}
          data-testid="grid"
        />
      );
      const element = screen.getByTestId('grid');
      expect(element.getAttribute('style')).toContain('500px');
    });

    it('handles single column', () => {
      render(
        <SortableGrid
          items={mockItems}
          renderItem={mockRenderItem}
          columns={1}
          data-testid="grid"
        />
      );
      const element = screen.getByTestId('grid');
      expect(element.getAttribute('style')).toContain('repeat(1');
    });

    it('handles many columns', () => {
      render(
        <SortableGrid
          items={mockItems}
          renderItem={mockRenderItem}
          columns={10}
          data-testid="grid"
        />
      );
      const element = screen.getByTestId('grid');
      expect(element.getAttribute('style')).toContain('repeat(10');
    });

    it('handles reordering with many items', () => {
      const manyItems = Array.from({ length: 10 }, (_, i) => ({
        id: `${i + 1}`,
        label: `Item ${i + 1}`,
      }));
      const mockOnReorder = jest.fn();
      render(
        <SortableGrid items={manyItems} renderItem={mockRenderItem} onReorder={mockOnReorder} />
      );

      mockOnDragEnd?.({
        active: { id: '1', data: { index: 0 } },
        over: { id: '10', data: { index: 9 } },
      });

      expect(mockOnReorder).toHaveBeenCalled();
      const reorderedItems = mockOnReorder.mock.calls[0][0];
      expect(reorderedItems[9].id).toBe('1');
    });

    it('updates when items prop changes', () => {
      const { rerender } = render(<SortableGrid items={mockItems} renderItem={mockRenderItem} />);

      expect(screen.getByText('Item 1')).toBeInTheDocument();

      const newItems = [
        { id: '4', label: 'Item 4' },
        { id: '5', label: 'Item 5' },
      ];

      rerender(<SortableGrid items={newItems} renderItem={mockRenderItem} />);

      expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
      expect(screen.getByText('Item 4')).toBeInTheDocument();
      expect(screen.getByText('Item 5')).toBeInTheDocument();
    });
  });

  // 14. Item data passing tests
  describe('item data passing', () => {
    it('passes item data to SortableGridItem', () => {
      const itemsWithData = [{ id: '1', label: 'Item 1', metadata: { count: 5 } }];

      render(<SortableGrid items={itemsWithData} renderItem={mockRenderItem} />);

      const item = screen.getByTestId('sortable-item-1');
      expect(item).toBeInTheDocument();
    });

    it('renders items with correct keys', () => {
      const { container } = render(<SortableGrid items={mockItems} renderItem={mockRenderItem} />);

      const items = container.querySelectorAll('[data-testid^="sortable-item-"]');
      expect(items).toHaveLength(3);
    });
  });

  // 15. Callback behavior tests
  describe('callback behavior', () => {
    it('calls onReorder only when positions actually change', () => {
      const mockOnReorder = jest.fn();
      render(
        <SortableGrid items={mockItems} renderItem={mockRenderItem} onReorder={mockOnReorder} />
      );

      // Move to different position
      mockOnDragEnd?.({
        active: { id: '1', data: { index: 0 } },
        over: { id: '2', data: { index: 1 } },
      });

      expect(mockOnReorder).toHaveBeenCalledTimes(1);

      // Move to same position
      mockOnDragEnd?.({
        active: { id: '1', data: { index: 0 } },
        over: { id: '1', data: { index: 0 } },
      });

      // Should still be 1 call, not 2
      expect(mockOnReorder).toHaveBeenCalledTimes(1);
    });

    it('provides correctly reordered array to onReorder', () => {
      const mockOnReorder = jest.fn();
      render(
        <SortableGrid items={mockItems} renderItem={mockRenderItem} onReorder={mockOnReorder} />
      );

      mockOnDragEnd?.({
        active: { id: '1', data: { index: 0 } },
        over: { id: '2', data: { index: 1 } },
      });

      const [newItems] = mockOnReorder.mock.calls[0];
      expect(newItems).toHaveLength(3);
      expect(newItems[0].id).toBe('2');
      expect(newItems[1].id).toBe('1');
      expect(newItems[2].id).toBe('3');
    });

    it('maintains item references in reordered array', () => {
      const mockOnReorder = jest.fn();
      render(
        <SortableGrid items={mockItems} renderItem={mockRenderItem} onReorder={mockOnReorder} />
      );

      mockOnDragEnd?.({
        active: { id: '1', data: { index: 0 } },
        over: { id: '3', data: { index: 2 } },
      });

      const [newItems] = mockOnReorder.mock.calls[0];
      expect(newItems[2]).toBe(mockItems[0]);
    });
  });

  // 16. Integration tests
  describe('integration with grid layout', () => {
    it('combines all layout properties correctly', () => {
      render(
        <SortableGrid
          items={mockItems}
          renderItem={mockRenderItem}
          columns={3}
          minItemWidth={200}
          gap={16}
          data-testid="grid"
        />
      );

      const element = screen.getByTestId('grid');
      const style = element.getAttribute('style');

      expect(style).toContain('16px');
      expect(style).toContain('repeat(3, minmax(200px, 1fr))');
    });

    it('applies auto-fill correctly with minItemWidth', () => {
      render(
        <SortableGrid
          items={mockItems}
          renderItem={mockRenderItem}
          columns="auto"
          minItemWidth={250}
          data-testid="grid"
        />
      );

      const element = screen.getByTestId('grid');
      const style = element.getAttribute('style');

      expect(style).toContain('repeat(auto-fill, minmax(250px, 1fr))');
    });
  });
});
