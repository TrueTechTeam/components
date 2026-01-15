import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Display/Badge',
  component: Badge,
  tags: ['autodocs'],
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
    children: {
      control: 'text',
      description: 'Content to display inside the component',
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
type Story = StoryObj<typeof Badge>;

// 1. Default story
export const Default: Story = {
  args: {
    children: 'Default Badge',
  },
};

// 2. Variants story
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="neutral">Neutral</Badge>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'All available visual variants of the badge component.',
      },
    },
  },
};

// 3. Sizes story
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
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
      <Badge>Default</Badge>
      <Badge disabled>Disabled</Badge>
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

// 5. Numeric Badges
export const NumericBadges: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge variant="primary">1</Badge>
      <Badge variant="danger">5</Badge>
      <Badge variant="success">99</Badge>
      <Badge variant="warning">99+</Badge>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Badges commonly used for notification counts.',
      },
    },
  },
};

// 6. Status Badges
export const StatusBadges: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Badge variant="success">Active</Badge>
        <Badge variant="danger">Inactive</Badge>
        <Badge variant="warning">Pending</Badge>
        <Badge variant="info">Draft</Badge>
        <Badge variant="neutral">Archived</Badge>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Badges commonly used for status indicators.',
      },
    },
  },
};

// 7. Custom Styling (CSS Variables)
export const CustomStyling: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <Badge
        style={{
          '--badge-bg': '#ff6b6b',
          '--badge-color': '#ffffff',
        } as React.CSSProperties}
      >
        Custom Colors
      </Badge>
      <Badge
        style={{
          '--badge-padding': '12px 24px',
          '--badge-border-radius': '20px',
        } as React.CSSProperties}
      >
        Custom Spacing
      </Badge>
      <Badge
        style={{
          '--badge-font-size': '18px',
        } as React.CSSProperties}
      >
        Custom Font Size
      </Badge>
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
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Badge variant={variant} size="sm">
                Small
              </Badge>
              <Badge variant={variant} size="md">
                Medium
              </Badge>
              <Badge variant={variant} size="lg">
                Large
              </Badge>
              <Badge variant={variant} disabled>
                Disabled
              </Badge>
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
    children: 'Playground Badge',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all component props.',
      },
    },
  },
};
