import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Button } from './Button';
import { Icon } from '../../display/Icon';
import { iconRegistry } from '../../display/Icon/icons';

// Dynamically generate icon options from iconRegistry
const iconOptions = [null, ...Object.keys(iconRegistry)] as const;

const meta: Meta<typeof Button> = {
  title: 'Buttons/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
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
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the button takes full width',
    },
    startIcon: {
      control: 'select',
      options: iconOptions,
      description: 'Icon to display before the text (string name or component)',
    },
    endIcon: {
      control: 'select',
      options: iconOptions,
      description: 'Icon to display after the text (string name or component)',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the button is in loading state',
    },
    loadingText: {
      control: 'text',
      description: 'Text to display while loading',
    },
    loadingPosition: {
      control: 'select',
      options: ['start', 'end', 'center'],
      description: 'Position of the loading spinner',
    },
    // Hide other controls
    onClick: { table: { disable: true } },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
    'aria-label': { table: { disable: true } },
    style: { table: { disable: true } },
    type: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/**
 * Default button with primary variant
 */
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
    onClick: action('clicked'),
  },
};

/**
 * All button variants
 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="success">Success</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Semantic color variants for success, warning, and danger actions
 */
export const SemanticVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button variant="success" startIcon="check">
        Success
      </Button>
      <Button variant="warning" startIcon="warning">
        Warning
      </Button>
      <Button variant="danger" startIcon="error">
        Danger
      </Button>
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/**
 * All button sizes
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Buttons with icons
 */
export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button startIcon={<Icon name="check" size={16} />}>Save</Button>
      <Button endIcon={<Icon name="chevron-right" size={16} />}>Next</Button>
      <Button
        variant="outline"
        startIcon={<Icon name="info" size={16} />}
        endIcon={<Icon name="chevron-down" size={16} />}
      >
        More Info
      </Button>
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button disabled>Primary Disabled</Button>
      <Button variant="secondary" disabled>
        Secondary Disabled
      </Button>
      <Button variant="outline" disabled>
        Outline Disabled
      </Button>
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Full width button
 */
export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    fullWidth: true,
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button loading>Loading</Button>
      <Button loading loadingText="Saving...">
        Save
      </Button>
      <Button loading loadingPosition="end">
        Submit
      </Button>
      <Button loading loadingPosition="center" style={{ minWidth: '100px' }} />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Loading state with different variants
 */
export const LoadingVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button variant="primary" loading>
        Primary
      </Button>
      <Button variant="secondary" loading>
        Secondary
      </Button>
      <Button variant="outline" loading>
        Outline
      </Button>
      <Button variant="ghost" loading>
        Ghost
      </Button>
      <Button variant="success" loading>
        Success
      </Button>
      <Button variant="warning" loading>
        Warning
      </Button>
      <Button variant="danger" loading>
        Danger
      </Button>
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Loading state with different sizes
 */
export const LoadingSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button size="xs" loading>
        Extra Small
      </Button>
      <Button size="sm" loading>
        Small
      </Button>
      <Button size="md" loading>
        Medium
      </Button>
      <Button size="lg" loading>
        Large
      </Button>
      <Button size="xl" loading>
        Extra Large
      </Button>
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Interactive playground for testing all button props
 */
export const Playground: Story = {
  args: {
    children: 'Playground Button',
    variant: 'primary',
    size: 'md',
    disabled: false,
    fullWidth: false,
    loading: false,
    loadingPosition: 'start',
    onClick: action('clicked'),
  },
};
