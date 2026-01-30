import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Pill } from './Pill';

const meta: Meta<typeof Pill> = {
  title: 'Display/Pill',
  component: Pill,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'outlined', 'subtle'],
      description: 'Visual variant of the component',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'],
      description: 'Color theme of the component',
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
type Story = StoryObj<typeof Pill>;

// 1. Default story
export const Default: Story = {
  args: {
    children: 'Default Pill',
  },
};

// 2. Colors with Filled Variant
export const FilledColors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Pill color="primary" variant="filled">
        Primary
      </Pill>
      <Pill color="secondary" variant="filled">
        Secondary
      </Pill>
      <Pill color="success" variant="filled">
        Success
      </Pill>
      <Pill color="warning" variant="filled">
        Warning
      </Pill>
      <Pill color="danger" variant="filled">
        Danger
      </Pill>
      <Pill color="info" variant="filled">
        Info
      </Pill>
      <Pill color="neutral" variant="filled">
        Neutral
      </Pill>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'All available colors with filled variant.',
      },
    },
  },
};

// 3. Colors with Outlined Variant
export const OutlinedColors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Pill color="primary" variant="outlined">
        Primary
      </Pill>
      <Pill color="secondary" variant="outlined">
        Secondary
      </Pill>
      <Pill color="success" variant="outlined">
        Success
      </Pill>
      <Pill color="warning" variant="outlined">
        Warning
      </Pill>
      <Pill color="danger" variant="outlined">
        Danger
      </Pill>
      <Pill color="info" variant="outlined">
        Info
      </Pill>
      <Pill color="neutral" variant="outlined">
        Neutral
      </Pill>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'All available colors with outlined variant.',
      },
    },
  },
};

// 4. Colors with Subtle Variant
export const SubtleColors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Pill color="primary" variant="subtle">
        Primary
      </Pill>
      <Pill color="secondary" variant="subtle">
        Secondary
      </Pill>
      <Pill color="success" variant="subtle">
        Success
      </Pill>
      <Pill color="warning" variant="subtle">
        Warning
      </Pill>
      <Pill color="danger" variant="subtle">
        Danger
      </Pill>
      <Pill color="info" variant="subtle">
        Info
      </Pill>
      <Pill color="neutral" variant="subtle">
        Neutral
      </Pill>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'All available colors with subtle variant.',
      },
    },
  },
};

// 5. Sizes story
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Pill size="sm">Small</Pill>
      <Pill size="md">Medium</Pill>
      <Pill size="lg">Large</Pill>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'All available sizes of the pill component.',
      },
    },
  },
};

// 6. Clickable Pills
export const Clickable: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Pill color="primary" onClick={action('clicked')}>
        Clickable Pill
      </Pill>
      <Pill color="success" onClick={action('clicked')}>
        Click Me
      </Pill>
      <Pill color="info" onClick={action('clicked')}>
        Interactive
      </Pill>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Pills with onClick handlers render as buttons and are interactive.',
      },
    },
  },
};

// 7. Removable Pills
export const Removable: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Pill color="primary" onRemove={action('removed')}>
        Removable
      </Pill>
      <Pill color="danger" onRemove={action('removed')}>
        Delete Me
      </Pill>
      <Pill color="warning" onRemove={action('removed')}>
        Remove
      </Pill>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Pills with onRemove handlers display a remove button.',
      },
    },
  },
};

// 8. Disabled State
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Pill disabled>Disabled</Pill>
      <Pill disabled onClick={action('clicked-disabled')}>
        Disabled Clickable
      </Pill>
      <Pill disabled onRemove={action('removed-disabled')}>
        Disabled Removable
      </Pill>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Pills in disabled state with reduced opacity and no interactions.',
      },
    },
  },
};

// 9. Filter Pills
export const FilterPills: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Pill color="primary" variant="outlined" onClick={action('filter-clicked')}>
        React
      </Pill>
      <Pill color="primary" variant="outlined" onClick={action('filter-clicked')}>
        TypeScript
      </Pill>
      <Pill color="primary" variant="outlined" onClick={action('filter-clicked')}>
        CSS
      </Pill>
      <Pill color="primary" variant="outlined" onClick={action('filter-clicked')}>
        JavaScript
      </Pill>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Example of using pills for filtering.',
      },
    },
  },
};
