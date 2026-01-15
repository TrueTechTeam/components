import type { Meta, StoryObj } from '@storybook/react';
import { {{ComponentName}} } from './{{ComponentName}}';

const meta: Meta<typeof {{ComponentName}}> = {
  title: 'Display/{{ComponentName}}',
  component: {{ComponentName}},
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger'],
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
type Story = StoryObj<typeof {{ComponentName}}>;

// 1. Default story
export const Default: Story = {
  args: {
    children: 'Default {{ComponentName}}',
  },
};

// 2. Variants story
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <{{ComponentName}} variant="primary">Primary</{{ComponentName}}>
      <{{ComponentName}} variant="secondary">Secondary</{{ComponentName}}>
      <{{ComponentName}} variant="success">Success</{{ComponentName}}>
      <{{ComponentName}} variant="warning">Warning</{{ComponentName}}>
      <{{ComponentName}} variant="danger">Danger</{{ComponentName}}>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'All available visual variants of the component.',
      },
    },
  },
};

// 3. Sizes story
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <{{ComponentName}} size="sm">Small</{{ComponentName}}>
      <{{ComponentName}} size="md">Medium</{{ComponentName}}>
      <{{ComponentName}} size="lg">Large</{{ComponentName}}>
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
      <{{ComponentName}}>Default</{{ComponentName}}>
      <{{ComponentName}} disabled>Disabled</{{ComponentName}}>
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

// 5. With Long Content
export const WithLongContent: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <{{ComponentName}}>Short</{{ComponentName}}>
      <{{ComponentName}}>This is a longer piece of content</{{ComponentName}}>
      <{{ComponentName}}>This is an even longer piece of content that demonstrates text wrapping</{{ComponentName}}>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Component behavior with different content lengths.',
      },
    },
  },
};

// 6. Custom Styling (CSS Variables)
export const CustomStyling: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <{{ComponentName}}
        style={{
          '--component-bg': '#ff6b6b',
          '--component-color': '#ffffff',
        } as React.CSSProperties}
      >
        Custom Colors
      </{{ComponentName}}>
      <{{ComponentName}}
        style={{
          '--component-padding': '12px 24px',
          '--component-border-radius': '20px',
        } as React.CSSProperties}
      >
        Custom Spacing
      </{{ComponentName}}>
      <{{ComponentName}}
        style={{
          '--component-font-size': '18px',
        } as React.CSSProperties}
      >
        Custom Font Size
      </{{ComponentName}}>
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

// 7. All Combinations (Grid)
export const AllCombinations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {(['primary', 'secondary', 'success', 'warning', 'danger'] as const).map((variant) => (
        <div key={variant}>
          <h4 style={{ marginBottom: '12px', textTransform: 'capitalize' }}>{variant}</h4>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <{{ComponentName}} variant={variant} size="sm">Small</{{ComponentName}}>
            <{{ComponentName}} variant={variant} size="md">Medium</{{ComponentName}}>
            <{{ComponentName}} variant={variant} size="lg">Large</{{ComponentName}}>
            <{{ComponentName}} variant={variant} disabled>Disabled</{{ComponentName}}>
          </div>
        </div>
      ))}
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

// 8. Playground story with interactive controls
export const Playground: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    children: 'Playground {{ComponentName}}',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all component props.',
      },
    },
  },
};
