import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';
import { ButtonToggleGroup } from './ButtonToggleGroup';
import { ButtonToggleGroupItem } from './ButtonToggleGroupItem';

const meta: Meta<typeof ButtonToggleGroup> = {
  title: 'Buttons/ButtonToggleGroup',
  component: ButtonToggleGroup,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Currently selected value (controlled)',
    },
    defaultValue: {
      control: 'text',
      description: 'Default selected value (uncontrolled)',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'success', 'warning', 'danger'],
      description: 'Button variant style',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the button group',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether buttons should take full width',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether all buttons are disabled',
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label for the group',
    },
    // Disable complex props
    onChange: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
    name: { table: { disable: true } },
    children: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonToggleGroup>;

/**
 * Default text button group
 */
export const Default: Story = {
  render: (args) => (
    <ButtonToggleGroup {...args} defaultValue="md" onChange={action('onChange')}>
      <ButtonToggleGroupItem value="sm">Small</ButtonToggleGroupItem>
      <ButtonToggleGroupItem value="md">Medium</ButtonToggleGroupItem>
      <ButtonToggleGroupItem value="lg">Large</ButtonToggleGroupItem>
    </ButtonToggleGroup>
  ),
  args: {
    'aria-label': 'Select size',
  },
};

/**
 * Icon-only buttons
 */
export const IconsOnly: Story = {
  render: () => (
    <ButtonToggleGroup defaultValue="list" aria-label="Select view">
      <ButtonToggleGroupItem value="list" icon="list" />
      <ButtonToggleGroupItem value="grid" icon="grid" />
    </ButtonToggleGroup>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Icons with text labels
 */
export const IconsWithText: Story = {
  render: () => (
    <ButtonToggleGroup defaultValue="list" aria-label="Select view">
      <ButtonToggleGroupItem value="list" icon="list">
        List
      </ButtonToggleGroupItem>
      <ButtonToggleGroupItem value="grid" icon="grid">
        Grid
      </ButtonToggleGroupItem>
      <ButtonToggleGroupItem value="calendar" icon="calendar">
        Calendar
      </ButtonToggleGroupItem>
    </ButtonToggleGroup>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * All size variants
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>Small</p>
        <ButtonToggleGroup defaultValue="a" size="sm" aria-label="Size small">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
          <ButtonToggleGroupItem value="b">Option B</ButtonToggleGroupItem>
          <ButtonToggleGroupItem value="c">Option C</ButtonToggleGroupItem>
        </ButtonToggleGroup>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>Medium</p>
        <ButtonToggleGroup defaultValue="a" size="md" aria-label="Size medium">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
          <ButtonToggleGroupItem value="b">Option B</ButtonToggleGroupItem>
          <ButtonToggleGroupItem value="c">Option C</ButtonToggleGroupItem>
        </ButtonToggleGroup>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>Large</p>
        <ButtonToggleGroup defaultValue="a" size="lg" aria-label="Size large">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
          <ButtonToggleGroupItem value="b">Option B</ButtonToggleGroupItem>
          <ButtonToggleGroupItem value="c">Option C</ButtonToggleGroupItem>
        </ButtonToggleGroup>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * All variant styles
 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>Primary</p>
        <ButtonToggleGroup defaultValue="a" variant="primary" aria-label="Primary">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
          <ButtonToggleGroupItem value="b">Option B</ButtonToggleGroupItem>
        </ButtonToggleGroup>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>Secondary</p>
        <ButtonToggleGroup defaultValue="a" variant="secondary" aria-label="Secondary">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
          <ButtonToggleGroupItem value="b">Option B</ButtonToggleGroupItem>
        </ButtonToggleGroup>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>Outline</p>
        <ButtonToggleGroup defaultValue="a" variant="outline" aria-label="Outline">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
          <ButtonToggleGroupItem value="b">Option B</ButtonToggleGroupItem>
        </ButtonToggleGroup>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>Ghost</p>
        <ButtonToggleGroup defaultValue="a" variant="ghost" aria-label="Ghost">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
          <ButtonToggleGroupItem value="b">Option B</ButtonToggleGroupItem>
        </ButtonToggleGroup>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>Success</p>
        <ButtonToggleGroup defaultValue="a" variant="success" aria-label="Success">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
          <ButtonToggleGroupItem value="b">Option B</ButtonToggleGroupItem>
        </ButtonToggleGroup>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Vertical orientation
 */
export const Vertical: Story = {
  render: () => (
    <ButtonToggleGroup defaultValue="inbox" orientation="vertical" aria-label="Select folder">
      <ButtonToggleGroupItem value="inbox" icon="inbox">
        Inbox
      </ButtonToggleGroupItem>
      <ButtonToggleGroupItem value="sent" icon="send">
        Sent
      </ButtonToggleGroupItem>
      <ButtonToggleGroupItem value="drafts" icon="file">
        Drafts
      </ButtonToggleGroupItem>
      <ButtonToggleGroupItem value="trash" icon="delete">
        Trash
      </ButtonToggleGroupItem>
    </ButtonToggleGroup>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Full width distribution
 */
export const FullWidth: Story = {
  render: () => (
    <div style={{ width: '500px' }}>
      <ButtonToggleGroup defaultValue="monthly" fullWidth aria-label="Billing period">
        <ButtonToggleGroupItem value="monthly">Monthly</ButtonToggleGroupItem>
        <ButtonToggleGroupItem value="quarterly">Quarterly</ButtonToggleGroupItem>
        <ButtonToggleGroupItem value="yearly">Yearly</ButtonToggleGroupItem>
      </ButtonToggleGroup>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          Entire group disabled
        </p>
        <ButtonToggleGroup defaultValue="a" disabled aria-label="Disabled group">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
          <ButtonToggleGroupItem value="b">Option B</ButtonToggleGroupItem>
          <ButtonToggleGroupItem value="c">Option C</ButtonToggleGroupItem>
        </ButtonToggleGroup>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          Individual item disabled
        </p>
        <ButtonToggleGroup defaultValue="a" aria-label="Partially disabled">
          <ButtonToggleGroupItem value="a">Option A</ButtonToggleGroupItem>
          <ButtonToggleGroupItem value="b" disabled>
            Option B
          </ButtonToggleGroupItem>
          <ButtonToggleGroupItem value="c">Option C</ButtonToggleGroupItem>
        </ButtonToggleGroup>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Controlled component example
 */
const ControlledExample = () => {
  const [view, setView] = useState('list');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ButtonToggleGroup value={view} onChange={(value) => setView(value)} aria-label="Select view">
        <ButtonToggleGroupItem value="list" icon="list">
          List
        </ButtonToggleGroupItem>
        <ButtonToggleGroupItem value="grid" icon="grid">
          Grid
        </ButtonToggleGroupItem>
        <ButtonToggleGroupItem value="calendar" icon="calendar">
          Calendar
        </ButtonToggleGroupItem>
      </ButtonToggleGroup>
      <p style={{ fontSize: '14px', color: 'var(--theme-text-secondary)' }}>Selected view: {view}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Real-world example: Text alignment
 */
export const TextAlignment: Story = {
  render: () => (
    <ButtonToggleGroup defaultValue="align-left" aria-label="Text alignment">
      <ButtonToggleGroupItem value="align-left" icon="align-left" />
      <ButtonToggleGroupItem value="align-center" icon="align-center" />
      <ButtonToggleGroupItem value="align-right" icon="align-right" />
      <ButtonToggleGroupItem value="align-justify" icon="align-justify" />
    </ButtonToggleGroup>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Real-world example: Data chart type
 */
export const ChartType: Story = {
  render: () => (
    <ButtonToggleGroup defaultValue="line" aria-label="Chart type">
      <ButtonToggleGroupItem value="line" icon="chart-line">
        Line
      </ButtonToggleGroupItem>
      <ButtonToggleGroupItem value="bar" icon="chart-bar">
        Bar
      </ButtonToggleGroupItem>
      <ButtonToggleGroupItem value="pie" icon="pie-chart">
        Pie
      </ButtonToggleGroupItem>
    </ButtonToggleGroup>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Interactive playground with all controls
 */
export const Playground: Story = {
  render: (args) => (
    <ButtonToggleGroup {...args} onChange={action('onChange')}>
      <ButtonToggleGroupItem value="option1">Option 1</ButtonToggleGroupItem>
      <ButtonToggleGroupItem value="option2">Option 2</ButtonToggleGroupItem>
      <ButtonToggleGroupItem value="option3">Option 3</ButtonToggleGroupItem>
    </ButtonToggleGroup>
  ),
  args: {
    defaultValue: 'option1',
    variant: 'outline',
    size: 'md',
    orientation: 'horizontal',
    fullWidth: false,
    disabled: false,
    'aria-label': 'Button toggle group',
  },
};

