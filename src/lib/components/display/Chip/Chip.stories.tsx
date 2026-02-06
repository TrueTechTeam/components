import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Chip } from './Chip';

const meta: Meta<typeof Chip> = {
  title: 'Display/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Chip component for displaying small, interactive labels or tags.

The Chip component is a versatile component for displaying categorical content, tags, or status information. It supports multiple visual variants, sizes, and can include an optional remove button.

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
<td><code>--chip-bg</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-primary-100)</code></a></td>
<td>Background color of the chip</td>
</tr>
<tr>
<td><code>--chip-color</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-primary-700)</code></a></td>
<td>Text color of the chip</td>
</tr>
<tr>
<td><code>--chip-padding</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-xs) var(--spacing-sm)</code></a></td>
<td>Padding inside the chip</td>
</tr>
<tr>
<td><code>--chip-font-size</code></td>
<td><a href="?path=/story/theme-css-variables--typography"><code>var(--font-size-sm)</code></a></td>
<td>Font size of chip text</td>
</tr>
<tr>
<td><code>--chip-border-radius</code></td>
<td><a href="?path=/story/theme-css-variables--borders"><code>var(--radius-full)</code></a></td>
<td>Border radius of the chip</td>
</tr>
<tr>
<td><code>--chip-transition</code></td>
<td><code>background-color 0.15s ease</code></td>
<td>Transition effect for color changes</td>
</tr>
<tr>
<td><code>--chip-remove-size</code></td>
<td><code>16px</code></td>
<td>Size of the remove button</td>
</tr>
<tr>
<td><code>--chip-remove-icon-size</code></td>
<td><code>12px</code></td>
<td>Size of the remove button icon</td>
</tr>
<tr>
<td><code>--chip-remove-hover-bg</code></td>
<td><code>rgba(0, 0, 0, 0.1)</code></td>
<td>Background color on remove button hover</td>
</tr>
</tbody>
</table>
`,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'],
      description: 'Visual variant of the component',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the component',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
    },
    removeButtonAriaLabel: {
      control: 'text',
      description: 'ARIA label for the remove button',
    },
    children: {
      control: 'text',
      description: 'Content to display inside the component',
    },
    onRemove: { table: { disable: true } },
    removeButtonClassName: { table: { disable: true } },
    className: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
    style: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

// 1. Default story
export const Default: Story = {
  args: {
    children: 'Default Chip',
  },
};

// 2. Variants story
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Chip variant="primary">Primary</Chip>
      <Chip variant="secondary">Secondary</Chip>
      <Chip variant="success">Success</Chip>
      <Chip variant="warning">Warning</Chip>
      <Chip variant="danger">Danger</Chip>
      <Chip variant="info">Info</Chip>
      <Chip variant="neutral">Neutral</Chip>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'All available visual variants of the chip component.',
      },
    },
  },
};

// 3. Sizes story
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Chip size="sm">Small</Chip>
      <Chip size="md">Medium</Chip>
      <Chip size="lg">Large</Chip>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'All available size options.',
      },
    },
  },
};

// 4. States story
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Chip>Default</Chip>
      <Chip disabled>Disabled</Chip>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Different component states.',
      },
    },
  },
};

// 5. With Remove Button
export const WithRemoveButton: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Chip variant="primary" onRemove={action('primary-removed')}>
        Removable Primary
      </Chip>
      <Chip variant="secondary" onRemove={action('secondary-removed')}>
        Removable Secondary
      </Chip>
      <Chip variant="success" onRemove={action('success-removed')}>
        Removable Success
      </Chip>
      <Chip variant="warning" onRemove={action('warning-removed')}>
        Removable Warning
      </Chip>
      <Chip variant="danger" onRemove={action('danger-removed')}>
        Removable Danger
      </Chip>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Chips with remove button functionality.',
      },
    },
  },
};

// 6. Tag Selection Example
const TagSelectionExample = () => {
  const [tags, setTags] = React.useState(['React', 'TypeScript', 'CSS', 'HTML', 'JavaScript']);

  const handleRemove = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {tags.map((tag) => (
        <Chip key={tag} variant="primary" onRemove={() => handleRemove(tag)}>
          {tag}
        </Chip>
      ))}
    </div>
  );
};

export const TagSelection: Story = {
  render: () => <TagSelectionExample />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Example of using chips for tag selection with remove functionality.',
      },
    },
  },
};

// 7. Custom Styling (CSS Variables)
export const CustomStyling: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <Chip
        style={
          {
            '--chip-bg': '#ff6b6b',
            '--chip-color': '#ffffff',
          } as React.CSSProperties
        }
      >
        Custom Colors
      </Chip>
      <Chip
        style={
          {
            '--chip-padding': '12px 24px',
            '--chip-border-radius': '8px',
          } as React.CSSProperties
        }
      >
        Custom Spacing
      </Chip>
      <Chip
        style={
          {
            '--chip-font-size': '18px',
          } as React.CSSProperties
        }
      >
        Custom Font Size
      </Chip>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Examples of customizing the component using CSS variables.',
      },
    },
  },
};

// 8. All Combinations (Grid)
export const AllCombinations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {(['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'] as const).map(
        (variant) => (
          <div key={variant}>
            <h4 style={{ marginBottom: '12px', textTransform: 'capitalize' }}>{variant}</h4>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Chip variant={variant} size="sm">
                Small
              </Chip>
              <Chip variant={variant} size="md">
                Medium
              </Chip>
              <Chip variant={variant} size="lg">
                Large
              </Chip>
              <Chip variant={variant} onRemove={action('chip-removed')}>
                Removable
              </Chip>
              <Chip variant={variant} disabled>
                Disabled
              </Chip>
            </div>
          </div>
        )
      )}
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'All variant and size combinations in a comprehensive grid.',
      },
    },
  },
};

// 9. Playground story with interactive controls
export const Playground: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    children: 'Playground Chip',
    onRemove: action('chip-removed'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all component props.',
      },
    },
  },
};
