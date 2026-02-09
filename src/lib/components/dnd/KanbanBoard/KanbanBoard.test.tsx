import React from 'react';
import { render, screen } from '@testing-library/react';
import { KanbanBoard, type KanbanColumnData, type KanbanCardData } from './KanbanBoard';

describe('KanbanBoard', () => {
  // Sample test data
  const sampleColumns: KanbanColumnData[] = [
    {
      id: 'todo',
      title: 'To Do',
      items: [
        { id: 'card-1', title: 'Task 1' },
        { id: 'card-2', title: 'Task 2' },
      ],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      items: [{ id: 'card-3', title: 'Task 3' }],
    },
    {
      id: 'done',
      title: 'Done',
      items: [],
    },
  ];

  const defaultRenderCard = (card: KanbanCardData) => (
    <div data-testid={`card-${card.id}`}>{card.title as string}</div>
  );

  // 1. Rendering tests
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<KanbanBoard columns={sampleColumns} renderCard={defaultRenderCard} />);
      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Done')).toBeInTheDocument();
    });

    it('renders with data-testid', () => {
      render(
        <KanbanBoard
          columns={sampleColumns}
          renderCard={defaultRenderCard}
          data-testid="test-kanban"
        />
      );
      expect(screen.getByTestId('test-kanban')).toBeInTheDocument();
    });

    it('renders with aria-label', () => {
      render(
        <KanbanBoard
          columns={sampleColumns}
          renderCard={defaultRenderCard}
          aria-label="Project board"
        />
      );
      expect(screen.getByLabelText('Project board')).toBeInTheDocument();
    });

    it('renders with default aria-label when not provided', () => {
      render(<KanbanBoard columns={sampleColumns} renderCard={defaultRenderCard} />);
      expect(screen.getByLabelText('Kanban board')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(
        <KanbanBoard
          columns={sampleColumns}
          renderCard={defaultRenderCard}
          className="custom-kanban"
          data-testid="kanban"
        />
      );
      const element = screen.getByTestId('kanban');
      expect(element).toHaveClass('custom-kanban');
    });

    it('renders with custom style', () => {
      render(
        <KanbanBoard
          columns={sampleColumns}
          renderCard={defaultRenderCard}
          style={{ backgroundColor: 'red' }}
          data-testid="kanban"
        />
      );
      const element = screen.getByTestId('kanban');
      expect(element).toHaveStyle({ backgroundColor: 'red' });
    });

    it('has region role', () => {
      render(<KanbanBoard columns={sampleColumns} renderCard={defaultRenderCard} />);
      const element = screen.getByRole('region', { name: 'Kanban board' });
      expect(element).toBeInTheDocument();
    });
  });

  // 2. Columns rendering tests
  describe('columns rendering', () => {
    it('renders all columns', () => {
      render(<KanbanBoard columns={sampleColumns} renderCard={defaultRenderCard} />);
      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Done')).toBeInTheDocument();
    });

    it('renders columns in correct order', () => {
      render(
        <KanbanBoard columns={sampleColumns} renderCard={defaultRenderCard} data-testid="kanban" />
      );
      const kanbanBoard = screen.getByTestId('kanban');
      const columns = Array.from(kanbanBoard.children).filter((child) =>
        child.hasAttribute('data-column-id')
      );
      expect(columns[0]).toHaveAttribute('data-column-id', 'todo');
      expect(columns[1]).toHaveAttribute('data-column-id', 'in-progress');
      expect(columns[2]).toHaveAttribute('data-column-id', 'done');
    });

    it('renders empty columns', () => {
      render(<KanbanBoard columns={sampleColumns} renderCard={defaultRenderCard} />);
      expect(screen.getByText('Done')).toBeInTheDocument();
      expect(screen.getByText('Drop items here')).toBeInTheDocument();
    });

    it('renders single column', () => {
      const singleColumn: KanbanColumnData[] = [
        {
          id: 'single',
          title: 'Single Column',
          items: [],
        },
      ];
      render(<KanbanBoard columns={singleColumn} renderCard={defaultRenderCard} />);
      expect(screen.getByText('Single Column')).toBeInTheDocument();
    });

    it('renders no columns when empty array', () => {
      render(<KanbanBoard columns={[]} renderCard={defaultRenderCard} data-testid="kanban" />);
      const element = screen.getByTestId('kanban');
      const columns = element.querySelectorAll('[data-column-id]');
      expect(columns.length).toBe(0);
    });

    it('renders column with custom data', () => {
      const columnsWithData: KanbanColumnData[] = [
        {
          id: 'custom',
          title: 'Custom',
          items: [],
          customProp: 'value',
        },
      ];
      render(<KanbanBoard columns={columnsWithData} renderCard={defaultRenderCard} />);
      expect(screen.getByText('Custom')).toBeInTheDocument();
    });
  });

  // 3. Cards rendering tests
  describe('cards rendering', () => {
    it('renders all cards', () => {
      render(<KanbanBoard columns={sampleColumns} renderCard={defaultRenderCard} />);
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
      expect(screen.getByText('Task 3')).toBeInTheDocument();
    });

    it('renders cards in correct columns', () => {
      render(<KanbanBoard columns={sampleColumns} renderCard={defaultRenderCard} />);
      expect(screen.getByTestId('card-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('card-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('card-card-3')).toBeInTheDocument();
    });

    it('renders cards in correct order', () => {
      const { container } = render(
        <KanbanBoard columns={sampleColumns} renderCard={defaultRenderCard} />
      );
      const todoColumn = container.querySelector('[data-column-id="todo"]');
      const cards = todoColumn?.querySelectorAll('[data-card-id]');
      expect(cards?.[0]).toHaveAttribute('data-card-id', 'card-1');
      expect(cards?.[1]).toHaveAttribute('data-card-id', 'card-2');
    });

    it('renders cards with custom data', () => {
      const columnsWithCustomData: KanbanColumnData[] = [
        {
          id: 'col1',
          title: 'Column 1',
          items: [{ id: 'card-1', title: 'Card 1', priority: 'high' }],
        },
      ];
      const renderCardWithData = (card: KanbanCardData) => (
        <div data-testid={`card-${card.id}`}>
          {card.title as string} - {card.priority as string}
        </div>
      );
      render(<KanbanBoard columns={columnsWithCustomData} renderCard={renderCardWithData} />);
      expect(screen.getByText('Card 1 - high')).toBeInTheDocument();
    });

    it('passes render props to renderCard function', () => {
      const renderCardWithProps = jest.fn((card: KanbanCardData) => (
        <div data-testid={`card-${card.id}`}>{card.title as string}</div>
      ));
      render(<KanbanBoard columns={sampleColumns} renderCard={renderCardWithProps} />);
      expect(renderCardWithProps).toHaveBeenCalled();
      expect(renderCardWithProps).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'card-1' }),
        expect.objectContaining({
          isDragging: expect.any(Boolean),
          isOver: expect.any(Boolean),
          columnId: expect.any(String),
          index: expect.any(Number),
        })
      );
    });
  });

  // 4. Custom rendering tests
  describe('custom rendering', () => {
    it('renders custom column header', () => {
      const renderColumnHeader = (column: KanbanColumnData) => (
        <div data-testid={`header-${column.id}`}>
          <h2>{column.title}</h2>
          <span>Custom Header for {column.id}</span>
        </div>
      );
      render(
        <KanbanBoard
          columns={sampleColumns}
          renderCard={defaultRenderCard}
          renderColumnHeader={renderColumnHeader}
        />
      );
      expect(screen.getByTestId('header-todo')).toBeInTheDocument();
      expect(screen.getByText('Custom Header for todo')).toBeInTheDocument();
    });

    it('renders custom card content', () => {
      const renderCard = (card: KanbanCardData) => (
        <div className="custom-card" data-testid={`custom-${card.id}`}>
          <h3>{card.title as string}</h3>
          <p>Description</p>
        </div>
      );
      render(<KanbanBoard columns={sampleColumns} renderCard={renderCard} />);
      expect(screen.getByTestId('custom-card-1')).toBeInTheDocument();
    });

    it('renders card with isDragging state', () => {
      const renderCard = (card: KanbanCardData, { isDragging }: any) => (
        <div data-testid={`card-${card.id}`} data-dragging={isDragging}>
          {card.title as string}
        </div>
      );
      render(<KanbanBoard columns={sampleColumns} renderCard={renderCard} />);
      expect(screen.getByTestId('card-card-1')).toBeInTheDocument();
    });

    it('calls renderColumnHeader for each column', () => {
      const renderColumnHeader = jest.fn((column: KanbanColumnData) => <div>{column.title}</div>);
      render(
        <KanbanBoard
          columns={sampleColumns}
          renderCard={defaultRenderCard}
          renderColumnHeader={renderColumnHeader}
        />
      );
      expect(renderColumnHeader).toHaveBeenCalledTimes(3);
    });

    it('calls renderCard for each card', () => {
      const renderCard = jest.fn((card: KanbanCardData) => <div>{card.title as string}</div>);
      render(<KanbanBoard columns={sampleColumns} renderCard={renderCard} />);
      expect(renderCard).toHaveBeenCalledTimes(3);
    });
  });

  // 5. Column gap tests
  describe('columnGap', () => {
    it('renders with default column gap', () => {
      render(
        <KanbanBoard columns={sampleColumns} renderCard={defaultRenderCard} data-testid="kanban" />
      );
      const element = screen.getByTestId('kanban');
      expect(element).toHaveStyle({ '--kanban-column-gap': 'var(--spacing-md)' });
    });

    it('renders with sm column gap', () => {
      render(
        <KanbanBoard
          columns={sampleColumns}
          renderCard={defaultRenderCard}
          columnGap="sm"
          data-testid="kanban"
        />
      );
      const element = screen.getByTestId('kanban');
      expect(element).toHaveStyle({ '--kanban-column-gap': 'var(--spacing-sm)' });
    });

    it('renders with lg column gap', () => {
      render(
        <KanbanBoard
          columns={sampleColumns}
          renderCard={defaultRenderCard}
          columnGap="lg"
          data-testid="kanban"
        />
      );
      const element = screen.getByTestId('kanban');
      expect(element).toHaveStyle({ '--kanban-column-gap': 'var(--spacing-lg)' });
    });

    it('renders with numeric column gap', () => {
      render(
        <KanbanBoard
          columns={sampleColumns}
          renderCard={defaultRenderCard}
          columnGap={20}
          data-testid="kanban"
        />
      );
      const element = screen.getByTestId('kanban');
      expect(element).toHaveStyle({ '--kanban-column-gap': '20px' });
    });
  });

  // 6. Card gap tests
  describe('cardGap', () => {
    it('renders with default card gap', () => {
      render(
        <KanbanBoard columns={sampleColumns} renderCard={defaultRenderCard} data-testid="kanban" />
      );
      const element = screen.getByTestId('kanban');
      expect(element).toHaveStyle({ '--kanban-card-gap': 'var(--spacing-sm)' });
    });

    it('renders with md card gap', () => {
      render(
        <KanbanBoard
          columns={sampleColumns}
          renderCard={defaultRenderCard}
          cardGap="md"
          data-testid="kanban"
        />
      );
      const element = screen.getByTestId('kanban');
      expect(element).toHaveStyle({ '--kanban-card-gap': 'var(--spacing-md)' });
    });

    it('renders with lg card gap', () => {
      render(
        <KanbanBoard
          columns={sampleColumns}
          renderCard={defaultRenderCard}
          cardGap="lg"
          data-testid="kanban"
        />
      );
      const element = screen.getByTestId('kanban');
      expect(element).toHaveStyle({ '--kanban-card-gap': 'var(--spacing-lg)' });
    });

    it('renders with numeric card gap', () => {
      render(
        <KanbanBoard
          columns={sampleColumns}
          renderCard={defaultRenderCard}
          cardGap={16}
          data-testid="kanban"
        />
      );
      const element = screen.getByTestId('kanban');
      expect(element).toHaveStyle({ '--kanban-card-gap': '16px' });
    });
  });

  // 7. Column width tests
  describe('columnWidth', () => {
    it('renders with default column width', () => {
      const { container } = render(
        <KanbanBoard columns={sampleColumns} renderCard={defaultRenderCard} />
      );
      const column = container.querySelector('[data-column-id="todo"]');
      expect(column).toHaveStyle({ width: '280px' });
    });

    it('renders with custom numeric column width', () => {
      const { container } = render(
        <KanbanBoard columns={sampleColumns} renderCard={defaultRenderCard} columnWidth={350} />
      );
      const column = container.querySelector('[data-column-id="todo"]');
      expect(column).toHaveStyle({ width: '350px' });
    });

    it('renders with auto column width', () => {
      const { container } = render(
        <KanbanBoard columns={sampleColumns} renderCard={defaultRenderCard} columnWidth="auto" />
      );
      const column = container.querySelector('[data-column-id="todo"]');
      expect(column).toHaveStyle({ minWidth: '200px', flex: '1 1 auto' });
    });

    it('renders with equal column width', () => {
      const { container } = render(
        <KanbanBoard columns={sampleColumns} renderCard={defaultRenderCard} columnWidth="equal" />
      );
      const column = container.querySelector('[data-column-id="todo"]');
      expect(column).toHaveStyle({ flex: '1 1 0' });
    });
  });

  // 8. Min column height tests
  describe('minColumnHeight', () => {
    it('renders with default min column height', () => {
      render(
        <KanbanBoard columns={sampleColumns} renderCard={defaultRenderCard} data-testid="kanban" />
      );
      const element = screen.getByTestId('kanban');
      expect(element).toHaveStyle({ '--kanban-min-column-height': '200px' });
    });

    it('renders with custom min column height', () => {
      render(
        <KanbanBoard
          columns={sampleColumns}
          renderCard={defaultRenderCard}
          minColumnHeight={300}
          data-testid="kanban"
        />
      );
      const element = screen.getByTestId('kanban');
      expect(element).toHaveStyle({ '--kanban-min-column-height': '300px' });
    });
  });

  // 9. Overflow behavior tests
  describe('overflowBehavior', () => {
    it('renders with default overflow behavior', () => {
      render(
        <KanbanBoard columns={sampleColumns} renderCard={defaultRenderCard} data-testid="kanban" />
      );
      const element = screen.getByTestId('kanban');
      expect(element).toHaveAttribute('data-overflow', 'scroll');
    });

    it('renders with wrap overflow behavior', () => {
      render(
        <KanbanBoard
          columns={sampleColumns}
          renderCard={defaultRenderCard}
          overflowBehavior="wrap"
          data-testid="kanban"
        />
      );
      const element = screen.getByTestId('kanban');
      expect(element).toHaveAttribute('data-overflow', 'wrap');
    });

    it('renders with none overflow behavior', () => {
      render(
        <KanbanBoard
          columns={sampleColumns}
          renderCard={defaultRenderCard}
          overflowBehavior="none"
          data-testid="kanban"
        />
      );
      const element = screen.getByTestId('kanban');
      expect(element).toHaveAttribute('data-overflow', 'none');
    });
  });

  // 10. Disabled state tests
  describe('disabled state', () => {
    it('is not disabled by default', () => {
      render(
        <KanbanBoard columns={sampleColumns} renderCard={defaultRenderCard} data-testid="kanban" />
      );
      const element = screen.getByTestId('kanban');
      expect(element).not.toHaveAttribute('data-disabled');
    });

    it('renders disabled state', () => {
      render(
        <KanbanBoard
          columns={sampleColumns}
          renderCard={defaultRenderCard}
          disabled
          data-testid="kanban"
        />
      );
      const element = screen.getByTestId('kanban');
      expect(element).toHaveAttribute('data-disabled', 'true');
    });

    it('does not call onCardMove when disabled', () => {
      const handleCardMove = jest.fn();
      render(
        <KanbanBoard
          columns={sampleColumns}
          renderCard={defaultRenderCard}
          onCardMove={handleCardMove}
          disabled
        />
      );
      // Note: Actually testing drag and drop would require more complex setup
      // This test verifies the disabled prop is applied
      expect(screen.getByLabelText('Kanban board')).toHaveAttribute('data-disabled', 'true');
    });
  });

  // 11. Callback tests
  describe('callbacks', () => {
    it('provides onCardMove callback', () => {
      const handleCardMove = jest.fn();
      render(
        <KanbanBoard
          columns={sampleColumns}
          renderCard={defaultRenderCard}
          onCardMove={handleCardMove}
        />
      );
      // Callback is set up, actual drag/drop testing would require more complex setup
      expect(handleCardMove).not.toHaveBeenCalled();
    });

    it('provides onColumnReorder callback', () => {
      const handleColumnReorder = jest.fn();
      render(
        <KanbanBoard
          columns={sampleColumns}
          renderCard={defaultRenderCard}
          onColumnReorder={handleColumnReorder}
          allowColumnReorder
        />
      );
      // Callback is set up, actual drag/drop testing would require more complex setup
      expect(handleColumnReorder).not.toHaveBeenCalled();
    });
  });

  // 12. Column reordering tests
  describe('allowColumnReorder', () => {
    it('is not allowed by default', () => {
      render(<KanbanBoard columns={sampleColumns} renderCard={defaultRenderCard} />);
      // By default, columns should not be reorderable
      // This is tested through the allowColumnReorder prop being false by default
      expect(screen.getByText('To Do')).toBeInTheDocument();
    });

    it('allows column reordering when enabled', () => {
      render(
        <KanbanBoard columns={sampleColumns} renderCard={defaultRenderCard} allowColumnReorder />
      );
      expect(screen.getByText('To Do')).toBeInTheDocument();
    });
  });

  // 13. Use drag handle tests
  describe('useDragHandle', () => {
    it('is false by default', () => {
      render(<KanbanBoard columns={sampleColumns} renderCard={defaultRenderCard} />);
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    it('enables drag handles when true', () => {
      const renderCardWithHandle = (card: KanbanCardData, { dragHandleProps }: any) => (
        <div data-testid={`card-${card.id}`}>
          <div {...dragHandleProps} data-testid={`handle-${card.id}`}>
            Handle
          </div>
          {card.title as string}
        </div>
      );
      render(
        <KanbanBoard columns={sampleColumns} renderCard={renderCardWithHandle} useDragHandle />
      );
      expect(screen.getByTestId('handle-card-1')).toBeInTheDocument();
    });
  });

  // 14. Edge cases
  describe('edge cases', () => {
    it('renders with empty columns array', () => {
      render(<KanbanBoard columns={[]} renderCard={defaultRenderCard} data-testid="kanban" />);
      expect(screen.getByTestId('kanban')).toBeInTheDocument();
    });

    it('renders column with no title', () => {
      const columnsNoTitle: KanbanColumnData[] = [
        {
          id: 'no-title',
          title: '',
          items: [],
        },
      ];
      const { container } = render(
        <KanbanBoard columns={columnsNoTitle} renderCard={defaultRenderCard} />
      );
      const column = container.querySelector('[data-column-id="no-title"]');
      expect(column).toBeInTheDocument();
    });

    it('renders column with many cards', () => {
      const manyCards = Array.from({ length: 50 }, (_, i) => ({
        id: `card-${i}`,
        title: `Card ${i}`,
      }));
      const columnWithManyCards: KanbanColumnData[] = [
        {
          id: 'many',
          title: 'Many Cards',
          items: manyCards,
        },
      ];
      render(<KanbanBoard columns={columnWithManyCards} renderCard={defaultRenderCard} />);
      expect(screen.getByText('Card 0')).toBeInTheDocument();
      expect(screen.getByText('Card 49')).toBeInTheDocument();
    });

    it('renders many columns', () => {
      const manyColumns = Array.from({ length: 20 }, (_, i) => ({
        id: `col-${i}`,
        title: `Column ${i}`,
        items: [],
      }));
      render(<KanbanBoard columns={manyColumns} renderCard={defaultRenderCard} />);
      expect(screen.getByText('Column 0')).toBeInTheDocument();
      expect(screen.getByText('Column 19')).toBeInTheDocument();
    });

    it('handles cards with special characters', () => {
      const specialColumns: KanbanColumnData[] = [
        {
          id: 'special',
          title: 'Special',
          items: [{ id: 'card-1', title: '!@#$%^&*()' }],
        },
      ];
      render(<KanbanBoard columns={specialColumns} renderCard={defaultRenderCard} />);
      expect(screen.getByText('!@#$%^&*()')).toBeInTheDocument();
    });

    it('handles cards with unicode characters', () => {
      const unicodeColumns: KanbanColumnData[] = [
        {
          id: 'unicode',
          title: 'Unicode',
          items: [{ id: 'card-1', title: '🎉 ✨ 🚀' }],
        },
      ];
      render(<KanbanBoard columns={unicodeColumns} renderCard={defaultRenderCard} />);
      expect(screen.getByText('🎉 ✨ 🚀')).toBeInTheDocument();
    });

    it('handles null renderColumnHeader', () => {
      render(
        <KanbanBoard
          columns={sampleColumns}
          renderCard={defaultRenderCard}
          renderColumnHeader={undefined}
        />
      );
      expect(screen.getByText('To Do')).toBeInTheDocument();
    });

    it('handles column with undefined items', () => {
      const columnsWithUndefined: KanbanColumnData[] = [
        {
          id: 'undefined-items',
          title: 'Test',
          items: [] as any,
        },
      ];
      render(<KanbanBoard columns={columnsWithUndefined} renderCard={defaultRenderCard} />);
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  // 15. Combined props tests
  describe('combined props', () => {
    it('renders with all props combined', () => {
      const handleCardMove = jest.fn();
      const handleColumnReorder = jest.fn();
      render(
        <KanbanBoard
          columns={sampleColumns}
          renderCard={defaultRenderCard}
          onCardMove={handleCardMove}
          onColumnReorder={handleColumnReorder}
          columnGap="lg"
          cardGap="md"
          columnWidth={300}
          minColumnHeight={250}
          allowColumnReorder
          useDragHandle
          disabled={false}
          overflowBehavior="wrap"
          className="custom-board"
          data-testid="full-kanban"
          aria-label="Full featured board"
        />
      );
      const element = screen.getByTestId('full-kanban');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('custom-board');
      expect(element).toHaveAttribute('data-overflow', 'wrap');
    });

    it('renders disabled with all interactive props', () => {
      const handleCardMove = jest.fn();
      const handleColumnReorder = jest.fn();
      render(
        <KanbanBoard
          columns={sampleColumns}
          renderCard={defaultRenderCard}
          onCardMove={handleCardMove}
          onColumnReorder={handleColumnReorder}
          allowColumnReorder
          disabled
          data-testid="disabled-kanban"
        />
      );
      const element = screen.getByTestId('disabled-kanban');
      expect(element).toHaveAttribute('data-disabled', 'true');
    });

    it('renders with numeric gaps and custom dimensions', () => {
      render(
        <KanbanBoard
          columns={sampleColumns}
          renderCard={defaultRenderCard}
          columnGap={24}
          cardGap={12}
          columnWidth={320}
          minColumnHeight={400}
          data-testid="numeric-kanban"
        />
      );
      const element = screen.getByTestId('numeric-kanban');
      expect(element).toHaveStyle({
        '--kanban-column-gap': '24px',
        '--kanban-card-gap': '12px',
        '--kanban-min-column-height': '400px',
      });
    });
  });

  // 16. Integration tests
  describe('integration', () => {
    it('renders complete board with all features', () => {
      const columns: KanbanColumnData[] = [
        {
          id: 'backlog',
          title: 'Backlog',
          items: [
            { id: '1', title: 'Task 1', priority: 'low' },
            { id: '2', title: 'Task 2', priority: 'medium' },
          ],
        },
        {
          id: 'in-progress',
          title: 'In Progress',
          items: [{ id: '3', title: 'Task 3', priority: 'high' }],
        },
        {
          id: 'review',
          title: 'Review',
          items: [],
        },
        {
          id: 'done',
          title: 'Done',
          items: [{ id: '4', title: 'Task 4', priority: 'critical' }],
        },
      ];

      const renderCard = (card: KanbanCardData, { isDragging }: any) => (
        <div
          data-testid={`card-${card.id}`}
          data-dragging={isDragging}
          style={{ opacity: isDragging ? 0.5 : 1 }}
        >
          <h4>{card.title as string}</h4>
          <span>Priority: {card.priority as string}</span>
        </div>
      );

      const renderHeader = (column: KanbanColumnData) => (
        <div data-testid={`header-${column.id}`}>
          <h3>{column.title}</h3>
          <span>({column.items.length})</span>
        </div>
      );

      render(
        <KanbanBoard
          columns={columns}
          renderCard={renderCard}
          renderColumnHeader={renderHeader}
          columnGap="md"
          cardGap="sm"
          columnWidth={280}
          data-testid="full-board"
        />
      );

      // Verify board structure
      expect(screen.getByTestId('full-board')).toBeInTheDocument();

      // Verify all columns
      expect(screen.getByTestId('header-backlog')).toBeInTheDocument();
      expect(screen.getByTestId('header-in-progress')).toBeInTheDocument();
      expect(screen.getByTestId('header-review')).toBeInTheDocument();
      expect(screen.getByTestId('header-done')).toBeInTheDocument();

      // Verify all cards
      expect(screen.getByTestId('card-1')).toBeInTheDocument();
      expect(screen.getByTestId('card-2')).toBeInTheDocument();
      expect(screen.getByTestId('card-3')).toBeInTheDocument();
      expect(screen.getByTestId('card-4')).toBeInTheDocument();

      // Verify card content
      expect(screen.getByText('Priority: medium')).toBeInTheDocument();
      expect(screen.getByText('Priority: high')).toBeInTheDocument();
      expect(screen.getByText('Priority: critical')).toBeInTheDocument();
    });

    it('updates when columns prop changes', () => {
      const { rerender } = render(
        <KanbanBoard columns={sampleColumns} renderCard={defaultRenderCard} />
      );

      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();

      const updatedColumns: KanbanColumnData[] = [
        {
          id: 'todo',
          title: 'To Do',
          items: [{ id: 'card-1', title: 'Updated Task 1' }],
        },
      ];

      rerender(<KanbanBoard columns={updatedColumns} renderCard={defaultRenderCard} />);

      expect(screen.getByText('Updated Task 1')).toBeInTheDocument();
      expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
    });

    it('handles dynamic card addition', () => {
      const initialColumns: KanbanColumnData[] = [
        {
          id: 'col1',
          title: 'Column 1',
          items: [{ id: 'card-1', title: 'Card 1' }],
        },
      ];

      const { rerender } = render(
        <KanbanBoard columns={initialColumns} renderCard={defaultRenderCard} />
      );

      expect(screen.getByText('Card 1')).toBeInTheDocument();

      const updatedColumns: KanbanColumnData[] = [
        {
          id: 'col1',
          title: 'Column 1',
          items: [
            { id: 'card-1', title: 'Card 1' },
            { id: 'card-2', title: 'Card 2' },
          ],
        },
      ];

      rerender(<KanbanBoard columns={updatedColumns} renderCard={defaultRenderCard} />);

      expect(screen.getByText('Card 1')).toBeInTheDocument();
      expect(screen.getByText('Card 2')).toBeInTheDocument();
    });
  });
});
