import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { SortableList } from './SortableList';
import { DragHandle } from '../DragHandle';

const meta: Meta<typeof SortableList> = {
  title: 'DnD/SortableList',
  component: SortableList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
SortableList component for creating reorderable list layouts with drag-and-drop functionality.

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
<td><code>--sortable-gap</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-md)</code></a></td>
<td>Gap between list items</td>
</tr>
<tr>
<td><code>--shadow-md</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--shadow-md)</code></a></td>
<td>Shadow for dragging items</td>
</tr>
<tr>
<td><code>--theme-primary</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-primary)</code></a></td>
<td>Color for drop indicator</td>
</tr>
</tbody>
</table>
`,
      },
    },
  },
  argTypes: {
    items: { table: { disable: true } },
    onReorder: { table: { disable: true } },
    onReorderComplete: { table: { disable: true } },
    renderItem: { table: { disable: true } },
    direction: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Direction of the list',
    },
    gap: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Gap between items',
    },
    groupId: {
      control: 'text',
      description: 'Group ID for cross-list drag',
    },
    useDragHandle: {
      control: 'boolean',
      description: 'Whether to use drag handles',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the list is disabled',
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
type Story = StoryObj<typeof SortableList>;

const defaultItems = [
  { id: '1', title: 'Item 1', description: 'First item in the list' },
  { id: '2', title: 'Item 2', description: 'Second item in the list' },
  { id: '3', title: 'Item 3', description: 'Third item in the list' },
  { id: '4', title: 'Item 4', description: 'Fourth item in the list' },
  { id: '5', title: 'Item 5', description: 'Fifth item in the list' },
];

const itemStyle: React.CSSProperties = {
  padding: '12px 16px',
  backgroundColor: 'var(--theme-surface-primary)',
  border: '1px solid var(--theme-border-primary)',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

function DefaultStory() {
  const [items, setItems] = useState(defaultItems);

  return (
    <div style={{ maxWidth: 400 }}>
      <SortableList
        items={items}
        onReorder={setItems}
        renderItem={(item, { isDragging }) => (
          <div style={{ ...itemStyle, opacity: isDragging ? 0.5 : 1 }}>
            <span style={{ fontWeight: 500 }}>{item.title}</span>
            <span style={{ color: 'var(--theme-text-secondary)', fontSize: '14px' }}>
              {item.description}
            </span>
          </div>
        )}
      />
    </div>
  );
}

/**
 * Basic sortable list with drag to reorder
 */
export const Default: Story = {
  render: () => <DefaultStory />,
};

function WithDragHandleStory() {
  const [items, setItems] = useState(defaultItems);

  return (
    <div style={{ maxWidth: 400 }}>
      <SortableList
        items={items}
        onReorder={setItems}
        useDragHandle
        renderItem={(item, { isDragging, dragHandleProps }) => (
          <div style={{ ...itemStyle, opacity: isDragging ? 0.5 : 1 }}>
            <DragHandle {...dragHandleProps} variant="dots" />
            <div>
              <div style={{ fontWeight: 500 }}>{item.title}</div>
              <div style={{ color: 'var(--theme-text-secondary)', fontSize: '14px' }}>
                {item.description}
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}

/**
 * Sortable list with explicit drag handles
 */
export const WithDragHandle: Story = {
  render: () => <WithDragHandleStory />,
};

function HorizontalStory() {
  const [items, setItems] = useState([
    { id: '1', label: 'Tag 1' },
    { id: '2', label: 'Tag 2' },
    { id: '3', label: 'Tag 3' },
    { id: '4', label: 'Tag 4' },
  ]);

  return (
    <SortableList
      items={items}
      onReorder={setItems}
      direction="horizontal"
      gap="sm"
      renderItem={(item, { isDragging }) => (
        <div
          style={{
            padding: '8px 16px',
            backgroundColor: 'var(--theme-primary)',
            color: 'var(--theme-text-on-primary)',
            borderRadius: '20px',
            opacity: isDragging ? 0.5 : 1,
            cursor: 'grab',
          }}
        >
          {item.label}
        </div>
      )}
    />
  );
}

/**
 * Horizontal sortable list
 */
export const Horizontal: Story = {
  render: () => <HorizontalStory />,
};

function DisabledStory() {
  const [items, setItems] = useState(defaultItems.slice(0, 3));

  return (
    <div style={{ maxWidth: 400 }}>
      <SortableList
        items={items}
        onReorder={setItems}
        disabled
        renderItem={(item) => (
          <div style={itemStyle}>
            <span style={{ fontWeight: 500 }}>{item.title}</span>
          </div>
        )}
      />
    </div>
  );
}

/**
 * Disabled sortable list
 */
export const Disabled: Story = {
  render: () => <DisabledStory />,
};
