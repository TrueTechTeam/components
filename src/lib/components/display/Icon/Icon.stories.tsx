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
      description: 'Name of the icon from the icon registry',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of the icon (xs: 12px, sm: 16px, md: 20px, lg: 24px, xl: 32px)',
    },
    color: {
      control: 'color',
      description: 'Color of the icon (CSS color value or theme variable)',
    },
    // Hide complex props
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
    'aria-label': { table: { disable: true } },
    title: { table: { disable: true } },
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
    size: 'lg',
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
          <Icon name={iconName as keyof typeof iconRegistry} size="xl" />
          <span style={{ fontSize: '12px', textAlign: 'center' }}>{iconName}</span>
        </div>
      ))}
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/**
 * All icon sizes
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Icon name="check" size="xs" />
        <span style={{ fontSize: '12px' }}>xs (12px)</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Icon name="check" size="sm" />
        <span style={{ fontSize: '12px' }}>sm (16px)</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Icon name="check" size="md" />
        <span style={{ fontSize: '12px' }}>md (20px)</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Icon name="check" size="lg" />
        <span style={{ fontSize: '12px' }}>lg (24px)</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <Icon name="check" size="xl" />
        <span style={{ fontSize: '12px' }}>xl (32px)</span>
      </div>
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Custom colors
 */
export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <Icon name="info" size="xl" color="var(--theme-primary)" />
      <Icon name="check" size="xl" color="var(--theme-success)" />
      <Icon name="warning" size="xl" color="var(--theme-warning)" />
      <Icon name="error" size="xl" color="var(--theme-error)" />
      <Icon name="close" size="xl" color="#ff1744" />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Directional icons
 */
export const Directional: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Icon name="chevron-up" size="xl" />
      <Icon name="chevron-right" size="xl" />
      <Icon name="chevron-down" size="xl" />
      <Icon name="chevron-left" size="xl" />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Status icons
 */
export const Status: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Icon name="info" size="xl" color="var(--theme-info)" />
      <Icon name="check" size="xl" color="var(--theme-success)" />
      <Icon name="warning" size="xl" color="var(--theme-warning)" />
      <Icon name="error" size="xl" color="var(--theme-error)" />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Interactive playground for testing all icon props
 */
export const Playground: Story = {
  args: {
    name: 'check',
    size: 'xl',
    color: 'var(--theme-primary)',
  },
};
