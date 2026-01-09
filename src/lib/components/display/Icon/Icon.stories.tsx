import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';
import { iconRegistry } from '../../../assets/icons';

const meta: Meta<typeof Icon> = {
  title: 'Display/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: Object.keys(iconRegistry),
      description: 'Icon name from the registry',
    },
    size: {
      control: { type: 'number', min: 12, max: 96, step: 4 },
      description: 'Icon size in pixels',
    },
    color: {
      control: 'color',
      description: 'Icon color (CSS color value)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

/**
 * Default icon
 */
export const Default: Story = {
  args: {
    name: 'check',
    size: 24,
  },
};

/**
 * All available icons
 */
export const AllIcons: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '24px',
        minWidth: '800px',
      }}
    >
      {Object.keys(iconRegistry).map((iconName) => (
        <div
          key={iconName}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Icon name={iconName as keyof typeof iconRegistry} size={32} />
          <span style={{ fontSize: '12px', textAlign: 'center' }}>{iconName}</span>
        </div>
      ))}
    </div>
  ),
};

/**
 * Different sizes
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <Icon name="check" size={16} />
      <Icon name="check" size={24} />
      <Icon name="check" size={32} />
      <Icon name="check" size={48} />
      <Icon name="check" size={64} />
    </div>
  ),
};

/**
 * Custom colors
 */
export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <Icon name="info" size={32} color="var(--theme-primary)" />
      <Icon name="check" size={32} color="var(--theme-success)" />
      <Icon name="warning" size={32} color="var(--theme-warning)" />
      <Icon name="error" size={32} color="var(--theme-error)" />
      <Icon name="close" size={32} color="#ff1744" />
    </div>
  ),
};

/**
 * Directional icons
 */
export const Directional: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Icon name="chevron-up" size={32} />
      <Icon name="chevron-right" size={32} />
      <Icon name="chevron-down" size={32} />
      <Icon name="chevron-left" size={32} />
    </div>
  ),
};

/**
 * Status icons
 */
export const Status: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Icon name="info" size={32} color="var(--theme-info)" />
      <Icon name="check" size={32} color="var(--theme-success)" />
      <Icon name="warning" size={32} color="var(--theme-warning)" />
      <Icon name="error" size={32} color="var(--theme-error)" />
    </div>
  ),
};

/**
 * Interactive example
 */
export const Interactive: Story = {
  args: {
    name: 'check',
    size: 32,
    color: 'var(--theme-primary)',
  },
};

