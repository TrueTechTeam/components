import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Button } from '../../buttons/Button';
import { Avatar } from '../Avatar';
import { Badge } from '../Badge';
import { Chip } from '../Chip';

const meta: Meta<typeof Card> = {
  title: 'Display/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['outlined', 'elevated', 'filled'],
      description: 'Visual variant of the card',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the card (affects border-radius)',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Padding inside the card',
    },
    interactive: {
      control: 'boolean',
      description: 'Whether the card is clickable',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the card is disabled',
    },
    hoverable: {
      control: 'boolean',
      description: 'Whether to show hover shadow effect',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the card takes full width',
    },
    headerDivider: {
      control: 'boolean',
      description: 'Whether the header has a bottom divider',
    },
    footerDivider: {
      control: 'boolean',
      description: 'Whether the footer has a top divider',
    },
    onClick: { table: { disable: true } },
    header: { table: { disable: true } },
    footer: { table: { disable: true } },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
    style: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// 1. Default story
export const Default: Story = {
  args: {
    children: 'This is a basic card with some content inside.',
  },
};

// 2. Variants story
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Card variant="outlined" style={{ width: 200 }}>
        <strong>Outlined</strong>
        <p style={{ margin: '8px 0 0' }}>Has a border</p>
      </Card>
      <Card variant="elevated" style={{ width: 200 }}>
        <strong>Elevated</strong>
        <p style={{ margin: '8px 0 0' }}>Has a shadow</p>
      </Card>
      <Card variant="filled" style={{ width: 200 }}>
        <strong>Filled</strong>
        <p style={{ margin: '8px 0 0' }}>Has background</p>
      </Card>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'All available visual variants of the card component.',
      },
    },
  },
};

// 3. Sizes story
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <Card size="sm" style={{ width: 150 }}>
        <strong>Small</strong>
        <p style={{ margin: '4px 0 0', fontSize: '14px' }}>Smaller radius</p>
      </Card>
      <Card size="md" style={{ width: 150 }}>
        <strong>Medium</strong>
        <p style={{ margin: '4px 0 0', fontSize: '14px' }}>Default radius</p>
      </Card>
      <Card size="lg" style={{ width: 150 }}>
        <strong>Large</strong>
        <p style={{ margin: '4px 0 0', fontSize: '14px' }}>Larger radius</p>
      </Card>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Size variants affect the border-radius of the card.',
      },
    },
  },
};

// 4. Padding story
export const Padding: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <Card padding="none" variant="outlined">
        <div style={{ padding: '8px', background: 'rgba(0,0,0,0.05)' }}>No padding</div>
      </Card>
      <Card padding="sm" variant="outlined">
        Small padding
      </Card>
      <Card padding="md" variant="outlined">
        Medium padding
      </Card>
      <Card padding="lg" variant="outlined">
        Large padding
      </Card>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Different padding options for card content.',
      },
    },
  },
};

// 5. With Header and Footer
export const WithHeaderFooter: Story = {
  render: () => (
    <Card
      header={<h3 style={{ margin: 0 }}>Card Title</h3>}
      footer={
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Submit</Button>
        </div>
      }
      style={{ width: 300 }}
    >
      <p style={{ margin: 0 }}>
        This card has a header and footer section with dividers separating them from the main
        content.
      </p>
    </Card>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Card with header and footer sections.',
      },
    },
  },
};

// 6. Without Dividers
export const WithoutDividers: Story = {
  render: () => (
    <Card
      header={<h3 style={{ margin: 0 }}>Card Title</h3>}
      footer={<Button variant="primary">Action</Button>}
      headerDivider={false}
      footerDivider={false}
      style={{ width: 300 }}
    >
      <p style={{ margin: 0 }}>Header and footer without divider lines.</p>
    </Card>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Card with header and footer but no divider lines.',
      },
    },
  },
};

// 7. Interactive story
export const Interactive: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Card
        interactive
        onClick={() => alert('Card clicked!')}
        style={{ width: 200 }}
        variant="outlined"
      >
        <strong>Click me!</strong>
        <p style={{ margin: '8px 0 0' }}>I'm an interactive card</p>
      </Card>
      <Card interactive disabled onClick={() => alert('Card clicked!')} style={{ width: 200 }}>
        <strong>Disabled</strong>
        <p style={{ margin: '8px 0 0' }}>Can't click me</p>
      </Card>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Interactive cards respond to click and keyboard events.',
      },
    },
  },
};

// 8. Hoverable story
export const Hoverable: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Card hoverable variant="outlined" style={{ width: 200 }}>
        <strong>Hover me</strong>
        <p style={{ margin: '8px 0 0' }}>Shows shadow on hover</p>
      </Card>
      <Card hoverable variant="elevated" style={{ width: 200 }}>
        <strong>Hover me</strong>
        <p style={{ margin: '8px 0 0' }}>Enhanced shadow on hover</p>
      </Card>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Cards with hover effect enabled.',
      },
    },
  },
};

// 9. Full Width
export const FullWidth: Story = {
  render: () => (
    <Card fullWidth variant="outlined">
      <strong>Full Width Card</strong>
      <p style={{ margin: '8px 0 0' }}>This card spans the full width of its container.</p>
    </Card>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Card that takes the full width of its container.',
      },
    },
  },
};

// 10. Custom Styling (CSS Variables)
export const CustomStyling: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Card
        style={
          {
            '--card-bg': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '--card-border-radius': '16px',
            color: 'white',
            width: 200,
          } as React.CSSProperties
        }
      >
        <strong>Gradient Card</strong>
        <p style={{ margin: '8px 0 0' }}>Custom background</p>
      </Card>
      <Card
        style={
          {
            '--card-border-color': '#e91e63',
            '--card-border-width': '2px',
            width: 200,
          } as React.CSSProperties
        }
        variant="outlined"
      >
        <strong>Custom Border</strong>
        <p style={{ margin: '8px 0 0' }}>Pink border</p>
      </Card>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Examples of customizing the card using CSS variables.',
      },
    },
  },
};

// 11. Complex Card Example
export const ComplexCard: Story = {
  render: () => (
    <Card
      variant="elevated"
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>User Profile</h3>
          <Badge variant="success" size="sm">
            Active
          </Badge>
        </div>
      }
      footer={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" fullWidth>
            Message
          </Button>
          <Button variant="primary" fullWidth>
            Follow
          </Button>
        </div>
      }
      style={{ width: 320 }}
    >
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Avatar initials="JD" size="lg" status="success" />
        <div>
          <h4 style={{ margin: '0 0 4px' }}>John Doe</h4>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Software Engineer</p>
          <Chip variant="neutral" size="sm">
            San Francisco, CA
          </Chip>
        </div>
      </div>
    </Card>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'A complex card example showing a user profile.',
      },
    },
  },
};

// 12. Playground story with interactive controls
export const Playground: Story = {
  args: {
    variant: 'outlined',
    size: 'md',
    padding: 'md',
    interactive: false,
    disabled: false,
    hoverable: false,
    fullWidth: false,
    children: 'Playground Card - Use the controls to customize this card.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all component props.',
      },
    },
  },
};
