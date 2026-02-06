import type { Meta, StoryObj } from '@storybook/react';
import { DragHandle } from './DragHandle';

const meta: Meta<typeof DragHandle> = {
  title: 'DnD/DragHandle',
  component: DragHandle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
DragHandle component provides visual feedback for draggable items in drag-and-drop interfaces.

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
<td><code>--handle-color</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-secondary)</code></a></td>
<td>Color of the handle icon</td>
</tr>
<tr>
<td><code>--handle-color-hover</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-primary)</code></a></td>
<td>Color on hover</td>
</tr>
<tr>
<td><code>--handle-color-active</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-primary)</code></a></td>
<td>Color when active</td>
</tr>
<tr>
<td><code>--handle-bg-hover</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-interactive-hover)</code></a></td>
<td>Background color on hover</td>
</tr>
<tr>
<td><code>--handle-size</code></td>
<td><code>24px</code></td>
<td>Size of the handle</td>
</tr>
</tbody>
</table>
`,
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of the handle',
    },
    variant: {
      control: 'select',
      options: ['dots', 'lines', 'grip'],
      description: 'Visual style of the handle',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the handle is disabled',
    },
    label: {
      control: 'text',
      description: 'Accessible label for the handle',
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
type Story = StoryObj<typeof DragHandle>;

/**
 * Default drag handle with dots pattern
 */
export const Default: Story = {
  args: {
    size: 'md',
    variant: 'dots',
  },
};

/**
 * All size variants
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
      <div style={{ textAlign: 'center' }}>
        <DragHandle size="xs" />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>XS</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <DragHandle size="sm" />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>SM</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <DragHandle size="md" />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>MD</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <DragHandle size="lg" />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>LG</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <DragHandle size="xl" />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>XL</div>
      </div>
    </div>
  ),
};

/**
 * All visual variants
 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
      <div style={{ textAlign: 'center' }}>
        <DragHandle variant="dots" size="lg" />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>Dots</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <DragHandle variant="lines" size="lg" />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>Lines</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <DragHandle variant="grip" size="lg" />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>Grip</div>
      </div>
    </div>
  ),
};

/**
 * In context with list item
 */
export const InContext: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '300px' }}>
      {['Item 1', 'Item 2', 'Item 3'].map((item) => (
        <div
          key={item}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            backgroundColor: 'var(--theme-surface-secondary)',
            borderRadius: '8px',
          }}
        >
          <DragHandle variant="dots" />
          <span>{item}</span>
        </div>
      ))}
    </div>
  ),
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    size: 'md',
    variant: 'dots',
    disabled: true,
  },
};
