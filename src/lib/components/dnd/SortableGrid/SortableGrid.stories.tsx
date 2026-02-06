import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SortableGrid } from './SortableGrid';

const meta: Meta<typeof SortableGrid> = {
  title: 'DnD/SortableGrid',
  component: SortableGrid,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
SortableGrid component for creating reorderable grid layouts with drag-and-drop functionality.

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
<td><code>--grid-gap</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-md)</code></a></td>
<td>Gap between grid items</td>
</tr>
<tr>
<td><code>--grid-template</code></td>
<td><code>repeat(auto-fill, minmax(150px, 1fr))</code></td>
<td>CSS grid template columns</td>
</tr>
<tr>
<td><code>--theme-surface-primary</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-surface-primary)</code></a></td>
<td>Background color for items</td>
</tr>
<tr>
<td><code>--radius-md</code></td>
<td><a href="?path=/story/theme-css-variables--borders"><code>var(--radius-md)</code></a></td>
<td>Border radius for items</td>
</tr>
<tr>
<td><code>--shadow-lg</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--shadow-lg)</code></a></td>
<td>Shadow for dragging items</td>
</tr>
<tr>
<td><code>--shadow-md</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--shadow-md)</code></a></td>
<td>Shadow on hover</td>
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
    renderItem: { table: { disable: true } },
    columns: {
      control: 'number',
      description: 'Number of columns (or "auto")',
    },
    minItemWidth: {
      control: 'number',
      description: 'Minimum item width for auto columns',
    },
    gap: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Gap between items',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the grid is disabled',
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
type Story = StoryObj<typeof SortableGrid>;

const colors = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEAA7',
  '#DDA0DD',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
];

const defaultItems = colors.map((color, i) => ({
  id: `item-${i + 1}`,
  color,
  label: `${i + 1}`,
}));

/**
 * Basic sortable grid for reordering items
 */
function DefaultStory() {
  const [items, setItems] = useState(defaultItems);

  return (
    <div style={{ maxWidth: 600 }}>
      <SortableGrid
        items={items}
        onReorder={setItems}
        columns={3}
        gap="md"
        renderItem={(item, { isDragging }) => (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: item.color,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
              opacity: isDragging ? 0.5 : 1,
              cursor: 'grab',
            }}
          >
            {item.label}
          </div>
        )}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <DefaultStory />,
};

/**
 * Image gallery with sortable grid
 */
function ImageGalleryStory() {
  const [items, setItems] = useState(
    Array.from({ length: 8 }, (_, i) => ({
      id: `img-${i + 1}`,
      src: `https://picsum.photos/200/200?random=${i + 1}`,
      alt: `Image ${i + 1}`,
    }))
  );

  return (
    <div style={{ maxWidth: 800 }}>
      <SortableGrid
        items={items}
        onReorder={setItems}
        columns={4}
        gap="sm"
        renderItem={(item, { isDragging, isOver }) => (
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '8px',
              overflow: 'hidden',
              opacity: isDragging ? 0.5 : 1,
              boxShadow: isOver ? '0 0 0 3px var(--theme-primary)' : undefined,
              cursor: 'grab',
            }}
          >
            <img
              src={item.src}
              alt={item.alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        )}
      />
    </div>
  );
}

export const ImageGallery: Story = {
  render: () => <ImageGalleryStory />,
};

/**
 * Auto-fill columns based on container width
 */
function AutoColumnsStory() {
  const [items, setItems] = useState(defaultItems.slice(0, 6));

  return (
    <div style={{ width: '100%' }}>
      <SortableGrid
        items={items}
        onReorder={setItems}
        columns="auto"
        minItemWidth={120}
        gap="md"
        renderItem={(item, { isDragging }) => (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: item.color,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white',
              opacity: isDragging ? 0.5 : 1,
            }}
          >
            {item.label}
          </div>
        )}
      />
    </div>
  );
}

export const AutoColumns: Story = {
  render: () => <AutoColumnsStory />,
};
