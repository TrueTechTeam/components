import type { Meta, StoryObj } from '@storybook/react';
import { MasonryLayout } from './MasonryLayout';

const meta: Meta<typeof MasonryLayout> = {
  title: 'Layout/MasonryLayout',
  component: MasonryLayout,
  tags: ['autodocs'],
  argTypes: {
    columnWidth: {
      control: { type: 'number', min: 100, max: 400 },
    },
    gap: {
      control: { type: 'number', min: 0, max: 48 },
    },
    maxColumns: {
      control: { type: 'number', min: 1, max: 8 },
    },
    minColumns: {
      control: { type: 'number', min: 1, max: 4 },
    },
    animationDuration: {
      control: { type: 'number', min: 0, max: 1000 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MasonryLayout>;

const Card = ({
  height,
  color,
  children,
}: {
  height: number;
  color: string;
  children?: React.ReactNode;
}) => (
  <div
    style={{
      background: color,
      height,
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      fontSize: 14,
    }}
  >
    {children}
  </div>
);

const generateItems = (count: number) => {
  const colors = [
    '#e3f2fd',
    '#f3e5f5',
    '#e8f5e9',
    '#fff3e0',
    '#fce4ec',
    '#e0f2f1',
    '#fff8e1',
    '#f1f8e9',
  ];
  const heights = [150, 200, 250, 180, 220, 160, 280, 190];

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    height: heights[i % heights.length],
    color: colors[i % colors.length],
  }));
};

/**
 * Default masonry layout
 */
export const Default: Story = {
  args: {
    columnWidth: 200,
    gap: 16,
  },
  render: (args) => {
    const items = generateItems(12);

    return (
      <div
        style={{
          resize: 'horizontal',
          overflow: 'auto',
          border: '2px dashed #ccc',
          padding: 16,
          minWidth: 200,
          width: 800,
        }}
      >
        <p style={{ margin: '0 0 16px', color: '#666' }}>
          Resize the container to see the masonry layout adapt:
        </p>
        <MasonryLayout {...args}>
          {items.map((item) => (
            <Card key={item.id} height={item.height} color={item.color}>
              Item {item.id + 1}
            </Card>
          ))}
        </MasonryLayout>
      </div>
    );
  },
};

/**
 * With column count callback
 */
export const WithColumnCallback: Story = {
  render: () => {
    const items = generateItems(10);

    return (
      <div
        style={{
          resize: 'horizontal',
          overflow: 'auto',
          border: '2px dashed #ccc',
          padding: 16,
          minWidth: 200,
          width: 800,
        }}
      >
        <p style={{ margin: '0 0 16px', color: '#666' }}>Check console for column count changes:</p>
        <MasonryLayout
          columnWidth={200}
          gap={16}
          onColumnCountChange={(count) => console.log('Column count:', count)}
        >
          {items.map((item) => (
            <Card key={item.id} height={item.height} color={item.color}>
              Item {item.id + 1}
            </Card>
          ))}
        </MasonryLayout>
      </div>
    );
  },
};

/**
 * Different column widths
 */
export const ColumnWidthVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48, width: 600 }}>
      {[150, 200, 300].map((colWidth) => {
        const items = generateItems(6);
        return (
          <div key={colWidth}>
            <p style={{ margin: '0 0 8px' }}>
              <strong>columnWidth: {colWidth}px</strong>
            </p>
            <div style={{ border: '1px dashed #ccc', padding: 16 }}>
              <MasonryLayout columnWidth={colWidth} gap={12}>
                {items.map((item) => (
                  <Card key={item.id} height={item.height} color={item.color}>
                    {item.id + 1}
                  </Card>
                ))}
              </MasonryLayout>
            </div>
          </div>
        );
      })}
    </div>
  ),
};

/**
 * Column constraints
 */
export const ColumnConstraints: Story = {
  render: () => {
    const items = generateItems(8);

    return (
      <div
        style={{
          resize: 'horizontal',
          overflow: 'auto',
          border: '2px dashed #ccc',
          padding: 16,
          minWidth: 200,
          width: 800,
        }}
      >
        <p style={{ margin: '0 0 16px', color: '#666' }}>
          minColumns: 2, maxColumns: 4 - resize to see constraints in action
        </p>
        <MasonryLayout columnWidth={150} gap={16} minColumns={2} maxColumns={4}>
          {items.map((item) => (
            <Card key={item.id} height={item.height} color={item.color}>
              Item {item.id + 1}
            </Card>
          ))}
        </MasonryLayout>
      </div>
    );
  },
};

/**
 * Different gap sizes
 */
export const GapVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48, width: 600 }}>
      {[8, 16, 24, 32].map((gapSize) => {
        const items = generateItems(6);
        return (
          <div key={gapSize}>
            <p style={{ margin: '0 0 8px' }}>
              <strong>gap: {gapSize}px</strong>
            </p>
            <div style={{ border: '1px dashed #ccc', padding: 16 }}>
              <MasonryLayout columnWidth={150} gap={gapSize}>
                {items.map((item) => (
                  <Card key={item.id} height={item.height} color={item.color}>
                    {item.id + 1}
                  </Card>
                ))}
              </MasonryLayout>
            </div>
          </div>
        );
      })}
    </div>
  ),
};

/**
 * Image gallery simulation
 */
export const ImageGallery: Story = {
  render: () => {
    const images = [
      { id: 1, height: 200, color: '#e3f2fd', label: 'Landscape' },
      { id: 2, height: 300, color: '#f3e5f5', label: 'Portrait' },
      { id: 3, height: 180, color: '#e8f5e9', label: 'Wide' },
      { id: 4, height: 250, color: '#fff3e0', label: 'Tall' },
      { id: 5, height: 220, color: '#fce4ec', label: 'Square-ish' },
      { id: 6, height: 280, color: '#e0f2f1', label: 'Vertical' },
      { id: 7, height: 160, color: '#fff8e1', label: 'Banner' },
      { id: 8, height: 240, color: '#f1f8e9', label: 'Standard' },
    ];

    return (
      <div
        style={{
          resize: 'horizontal',
          overflow: 'auto',
          border: '2px dashed #ccc',
          padding: 16,
          minWidth: 300,
          width: 800,
        }}
      >
        <MasonryLayout columnWidth={200} gap={12}>
          {images.map((img) => (
            <div
              key={img.id}
              style={{
                background: img.color,
                height: img.height,
                borderRadius: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <span style={{ fontSize: 32 }}>🖼️</span>
              <span style={{ fontSize: 12, opacity: 0.7 }}>{img.label}</span>
            </div>
          ))}
        </MasonryLayout>
      </div>
    );
  },
};

/**
 * Blog cards example
 */
export const BlogCards: Story = {
  render: () => {
    const posts = [
      {
        id: 1,
        title: 'Getting Started with React',
        excerpt: 'Learn the basics of React and build your first component.',
        color: '#e3f2fd',
      },
      {
        id: 2,
        title: 'Advanced TypeScript Patterns',
        excerpt:
          'Explore advanced TypeScript patterns including generics, conditional types, and mapped types for better type safety.',
        color: '#f3e5f5',
      },
      {
        id: 3,
        title: 'CSS Grid Mastery',
        excerpt: 'Master CSS Grid layout with practical examples.',
        color: '#e8f5e9',
      },
      {
        id: 4,
        title: 'Building Accessible UIs',
        excerpt:
          'A comprehensive guide to building accessible user interfaces that work for everyone. Learn about ARIA, keyboard navigation, and more.',
        color: '#fff3e0',
      },
      {
        id: 5,
        title: 'State Management',
        excerpt: 'Compare different state management solutions for React applications.',
        color: '#fce4ec',
      },
      {
        id: 6,
        title: 'Performance Tips',
        excerpt: 'Quick tips to improve your React app performance.',
        color: '#e0f2f1',
      },
    ];

    return (
      <div
        style={{
          resize: 'horizontal',
          overflow: 'auto',
          border: '2px dashed #ccc',
          padding: 16,
          minWidth: 300,
          width: 1000,
        }}
      >
        <MasonryLayout columnWidth={250} gap={20}>
          {posts.map((post) => (
            <div
              key={post.id}
              style={{
                background: 'var(--theme-background-primary)',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ background: post.color, height: 120 }} />
              <div style={{ padding: 16 }}>
                <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>{post.title}</h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    color: 'var(--theme-text-secondary)',
                    lineHeight: 1.5,
                  }}
                >
                  {post.excerpt}
                </p>
              </div>
            </div>
          ))}
        </MasonryLayout>
      </div>
    );
  },
};

/**
 * Animation duration variants
 */
export const AnimationDurations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {[100, 250, 500].map((duration) => {
        const items = generateItems(6);
        return (
          <div key={duration}>
            <p style={{ margin: '0 0 8px' }}>
              <strong>animationDuration: {duration}ms</strong>
            </p>
            <div
              style={{
                resize: 'horizontal',
                overflow: 'auto',
                border: '1px dashed #ccc',
                padding: 16,
                minWidth: 200,
                width: 600,
              }}
            >
              <MasonryLayout columnWidth={150} gap={12} animationDuration={duration}>
                {items.map((item) => (
                  <Card key={item.id} height={item.height} color={item.color}>
                    {item.id + 1}
                  </Card>
                ))}
              </MasonryLayout>
            </div>
          </div>
        );
      })}
    </div>
  ),
};

/**
 * Many items
 */
export const ManyItems: Story = {
  render: () => {
    const items = generateItems(24);

    return (
      <div
        style={{
          resize: 'horizontal',
          overflow: 'auto',
          border: '2px dashed #ccc',
          padding: 16,
          minWidth: 300,
          width: 1200,
          maxHeight: 600,
          overflowY: 'auto',
        }}
      >
        <MasonryLayout columnWidth={180} gap={12}>
          {items.map((item) => (
            <Card key={item.id} height={item.height} color={item.color}>
              Item {item.id + 1}
            </Card>
          ))}
        </MasonryLayout>
      </div>
    );
  },
};
