import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { IconButton } from './IconButton';
import { iconRegistry } from '../../display/Icon/icons';

const iconOptions = Object.keys(iconRegistry) as const;

const meta: Meta<typeof IconButton> = {
  title: 'Buttons/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'select',
      options: iconOptions,
      description: 'Icon to display',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'success', 'warning', 'danger'],
      description: 'Button variant style',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Button size (also determines icon size)',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label (REQUIRED)',
    },
    // Disable complex props
    onClick: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    id: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
    type: { table: { disable: true } },
    ref: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

/**
 * Default icon button with ghost variant and md size
 */
export const Default: Story = {
  args: {
    icon: 'check',
    'aria-label': 'Confirm',
    variant: 'ghost',
    size: 'md',
    onClick: action('onClick'),
  },
};

/**
 * All button variants
 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <IconButton icon="check" aria-label="Primary" variant="primary" />
      <IconButton icon="check" aria-label="Secondary" variant="secondary" />
      <IconButton icon="check" aria-label="Outline" variant="outline" />
      <IconButton icon="check" aria-label="Ghost" variant="ghost" />
      <IconButton icon="check" aria-label="Success" variant="success" />
      <IconButton icon="warning" aria-label="Warning" variant="warning" />
      <IconButton icon="error" aria-label="Danger" variant="danger" />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * All button sizes (xs to xl)
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <IconButton icon="check" aria-label="Extra Small" size="xs" />
      <IconButton icon="check" aria-label="Small" size="sm" />
      <IconButton icon="check" aria-label="Medium" size="md" />
      <IconButton icon="check" aria-label="Large" size="lg" />
      <IconButton icon="check" aria-label="Extra Large" size="xl" />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Common use cases with different icons
 */
export const CommonUseCases: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <IconButton icon="close" aria-label="Close" variant="ghost" />
      <IconButton icon="edit" aria-label="Edit" variant="ghost" />
      <IconButton icon="delete" aria-label="Delete" variant="ghost" />
      <IconButton icon="settings" aria-label="Settings" variant="ghost" />
      <IconButton icon="info" aria-label="Info" variant="outline" />
      <IconButton icon="plus" aria-label="Add" variant="primary" />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Disabled state across variants
 */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <IconButton icon="check" aria-label="Primary Disabled" variant="primary" disabled />
      <IconButton icon="check" aria-label="Secondary Disabled" variant="secondary" disabled />
      <IconButton icon="check" aria-label="Outline Disabled" variant="outline" disabled />
      <IconButton icon="check" aria-label="Ghost Disabled" variant="ghost" disabled />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Icon size correlation demonstration
 */
export const IconSizeCorrelation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>
          XS (12px icon, 20px button)
        </p>
        <IconButton icon="check" aria-label="Extra Small" size="xs" variant="outline" />
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>
          SM (16px icon, 28px button)
        </p>
        <IconButton icon="check" aria-label="Small" size="sm" variant="outline" />
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>
          MD (20px icon, 36px button)
        </p>
        <IconButton icon="check" aria-label="Medium" size="md" variant="outline" />
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>
          LG (24px icon, 48px button)
        </p>
        <IconButton icon="check" aria-label="Large" size="lg" variant="outline" />
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>
          XL (32px icon, 64px button)
        </p>
        <IconButton icon="check" aria-label="Extra Large" size="xl" variant="outline" />
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Playground story with all interactive controls
 */
export const Playground: Story = {
  args: {
    icon: 'check',
    'aria-label': 'Icon Button',
    variant: 'primary',
    size: 'md',
    disabled: false,
    onClick: action('onClick'),
  },
};
