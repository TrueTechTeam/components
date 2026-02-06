import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { KanbanBoard, type KanbanColumnData } from './KanbanBoard';

const meta: Meta<typeof KanbanBoard> = {
  title: 'DnD/KanbanBoard',
  component: KanbanBoard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
KanbanBoard component for creating multi-column board layouts with drag-and-drop card management.

## CSS Variables
<table>
<thead>
<tr>
<th>Variable</th>
<th>Default</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>--kanban-column-gap</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-md)</code></a></td>
<td>Gap between columns</td>
</tr>
<tr>
<td><code>--kanban-card-gap</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-sm)</code></a></td>
<td>Gap between cards within a column</td>
</tr>
<tr>
<td><code>--kanban-min-column-height</code></td>
<td><code>200px</code></td>
<td>Minimum height of each column</td>
</tr>
</tbody>
</table>
`,
      },
    },
  },
  argTypes: {
    columns: { table: { disable: true } },
    onCardMove: { table: { disable: true } },
    onColumnReorder: { table: { disable: true } },
    renderCard: { table: { disable: true } },
    renderColumnHeader: { table: { disable: true } },
    columnWidth: {
      control: 'number',
      description: 'Width of each column in pixels',
    },
    columnGap: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Gap between columns',
    },
    cardGap: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Gap between cards',
    },
    minColumnHeight: {
      control: 'number',
      description: 'Minimum column height',
    },
    allowColumnReorder: {
      control: 'boolean',
      description: 'Whether columns can be reordered',
    },
    useDragHandle: {
      control: 'boolean',
      description: 'Whether to use drag handles',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the board is disabled',
    },
    overflowBehavior: {
      control: 'select',
      options: ['scroll', 'wrap', 'none'],
      description: 'How columns overflow',
    },
    className: {
      table: { disable: true },
    },
    'data-testid': {
      table: { disable: true },
    },
    style: {
      table: { disable: true },
    },
  },
};

export default meta;
type Story = StoryObj<typeof KanbanBoard>;

const initialColumns: KanbanColumnData[] = [
  {
    id: 'todo',
    title: 'To Do',
    items: [
      { id: '1', title: 'Research competitors', priority: 'high' },
      { id: '2', title: 'Design wireframes', priority: 'medium' },
      { id: '3', title: 'Write documentation', priority: 'low' },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    items: [
      { id: '4', title: 'Implement drag and drop', priority: 'high' },
      { id: '5', title: 'Code review', priority: 'medium' },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    items: [{ id: '6', title: 'Setup project', priority: 'high' }],
  },
];

const cardStyle: React.CSSProperties = {
  padding: '12px',
  backgroundColor: 'var(--theme-surface-primary)',
  borderRadius: '8px',
};

const priorityColors: Record<string, string> = {
  high: 'var(--theme-error)',
  medium: 'var(--theme-warning)',
  low: 'var(--theme-success)',
};

function DefaultStory() {
  const [columns, setColumns] = useState(initialColumns);

  const handleCardMove = (
    _cardId: string,
    fromColumnId: string,
    toColumnId: string,
    fromIndex: number,
    toIndex: number
  ) => {
    setColumns((prev) => {
      const newColumns = prev.map((col) => ({
        ...col,
        items: [...col.items],
      }));

      const fromColumn = newColumns.find((c) => c.id === fromColumnId);
      const toColumn = newColumns.find((c) => c.id === toColumnId);

      if (!fromColumn || !toColumn) {
        return prev;
      }

      const [movedCard] = fromColumn.items.splice(fromIndex, 1);
      toColumn.items.splice(toIndex, 0, movedCard);

      return newColumns;
    });
  };

  return (
    <div style={{ height: 500 }}>
      <KanbanBoard
        columns={columns}
        onCardMove={handleCardMove}
        columnWidth={280}
        renderCard={(card, { isDragging }) => (
          <div style={{ ...cardStyle, opacity: isDragging ? 0.5 : 1 }}>
            <div style={{ fontWeight: 500, marginBottom: '8px' }}>{String(card.title)}</div>
            <div
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                backgroundColor: priorityColors[card.priority as string] || 'gray',
                color: 'white',
              }}
            >
              {String(card.priority)}
            </div>
          </div>
        )}
        renderColumnHeader={(column) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 600 }}>{column.title}</span>
            <span
              style={{
                backgroundColor: 'var(--theme-surface-tertiary)',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
              }}
            >
              {column.items.length}
            </span>
          </div>
        )}
      />
    </div>
  );
}

/**
 * Basic Kanban board with drag and drop between columns
 */
export const Default: Story = {
  render: () => <DefaultStory />,
};

function WithColumnReorderStory() {
  const [columns, setColumns] = useState(initialColumns);

  const handleCardMove = (
    _cardId: string,
    fromColumnId: string,
    toColumnId: string,
    fromIndex: number,
    toIndex: number
  ) => {
    setColumns((prev) => {
      const newColumns = prev.map((col) => ({
        ...col,
        items: [...col.items],
      }));

      const fromColumn = newColumns.find((c) => c.id === fromColumnId);
      const toColumn = newColumns.find((c) => c.id === toColumnId);

      if (!fromColumn || !toColumn) {
        return prev;
      }

      const [movedCard] = fromColumn.items.splice(fromIndex, 1);
      toColumn.items.splice(toIndex, 0, movedCard);

      return newColumns;
    });
  };

  return (
    <div style={{ height: 500 }}>
      <KanbanBoard
        columns={columns}
        onCardMove={handleCardMove}
        onColumnReorder={setColumns}
        allowColumnReorder
        columnWidth={280}
        renderCard={(card, { isDragging }) => (
          <div style={{ ...cardStyle, opacity: isDragging ? 0.5 : 1 }}>
            <div style={{ fontWeight: 500 }}>{String(card.title)}</div>
          </div>
        )}
      />
    </div>
  );
}

/**
 * Kanban board with column reordering enabled
 */
export const WithColumnReorder: Story = {
  render: () => <WithColumnReorderStory />,
};

function MinimalStory() {
  const [columns, setColumns] = useState<KanbanColumnData[]>([
    { id: 'a', title: 'Column A', items: [{ id: '1' }, { id: '2' }] },
    { id: 'b', title: 'Column B', items: [{ id: '3' }] },
    { id: 'c', title: 'Column C', items: [] },
  ]);

  const handleCardMove = (
    _cardId: string,
    fromColumnId: string,
    toColumnId: string,
    fromIndex: number,
    toIndex: number
  ) => {
    setColumns((prev) => {
      const newColumns = prev.map((col) => ({
        ...col,
        items: [...col.items],
      }));

      const fromColumn = newColumns.find((c) => c.id === fromColumnId);
      const toColumn = newColumns.find((c) => c.id === toColumnId);

      if (!fromColumn || !toColumn) {
        return prev;
      }

      const [movedCard] = fromColumn.items.splice(fromIndex, 1);
      toColumn.items.splice(toIndex, 0, movedCard);

      return newColumns;
    });
  };

  return (
    <div style={{ height: 400 }}>
      <KanbanBoard
        columns={columns}
        onCardMove={handleCardMove}
        columnWidth={200}
        minColumnHeight={150}
        renderCard={(card, { isDragging }) => (
          <div
            style={{
              ...cardStyle,
              opacity: isDragging ? 0.5 : 1,
              textAlign: 'center',
            }}
          >
            Card {card.id}
          </div>
        )}
      />
    </div>
  );
}

/**
 * Minimal Kanban board
 */
export const Minimal: Story = {
  render: () => <MinimalStory />,
};
