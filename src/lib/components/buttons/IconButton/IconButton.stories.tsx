import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { IconButton } from './IconButton';
import { iconRegistry } from '../../display/Icon/icons';

const iconOptions = Object.keys(iconRegistry) as const;

const meta: Meta<typeof IconButton> = {
  title: 'Buttons/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
IconButton component - a button that displays only an icon.

Icon-only buttons are commonly used for compact UIs, toolbars, and actions like
close, edit, delete, or settings. The component automatically scales the icon to match
the button size and requires an aria-label for accessibility.

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
      <td><code>--button-bg</code></td>
      <td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-primary)</code></a></td>
      <td>Background color</td>
    </tr>
    <tr>
      <td><code>--button-bg-hover</code></td>
      <td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-primary-hover)</code></a></td>
      <td>Background color on hover</td>
    </tr>
    <tr>
      <td><code>--button-bg-active</code></td>
      <td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-primary-active)</code></a></td>
      <td>Background color on active/pressed</td>
    </tr>
    <tr>
      <td><code>--button-bg-disabled</code></td>
      <td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-primary-disabled)</code></a></td>
      <td>Background color when disabled</td>
    </tr>
    <tr>
      <td><code>--button-color</code></td>
      <td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-text-on-primary)</code></a></td>
      <td>Icon color</td>
    </tr>
    <tr>
      <td><code>--button-border-color</code></td>
      <td><code>transparent</code></td>
      <td>Border color</td>
    </tr>
    <tr>
      <td><code>--button-border-color-hover</code></td>
      <td><code>transparent</code></td>
      <td>Border color on hover</td>
    </tr>
    <tr>
      <td><code>--button-border-width</code></td>
      <td><code>1px</code></td>
      <td>Border width</td>
    </tr>
    <tr>
      <td><code>--button-radius</code></td>
      <td><a href="?path=/story/theme-css-variables--borders"><code>var(--radius-md)</code></a></td>
      <td>Border radius</td>
    </tr>
    <tr>
      <td><code>--button-disabled-opacity</code></td>
      <td><code>0.5</code></td>
      <td>Opacity when disabled</td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  argTypes: {
    icon: {
      control: 'select',
      options: iconOptions,
      description: 'Icon name to display (REQUIRED)',
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
      description: 'Accessible label (REQUIRED for icon-only buttons)',
    },
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
    docs: {
      description: {
        story: 'All available icon button variants showing different visual styles.',
      },
    },
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
    docs: {
      description: {
        story: 'All available icon button sizes from extra small to extra large.',
      },
    },
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
    docs: {
      description: {
        story:
          'Common icon button use cases including close, edit, delete, settings, info, and add.',
      },
    },
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
    docs: {
      description: {
        story: 'Disabled icon buttons that cannot be interacted with.',
      },
    },
  },
};

/**
 * Icon size correlation demonstration
 */
export const IconSizeCorrelation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          XS (12px icon, 20px button)
        </p>
        <IconButton icon="check" aria-label="Extra Small" size="xs" variant="outline" />
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          SM (16px icon, 28px button)
        </p>
        <IconButton icon="check" aria-label="Small" size="sm" variant="outline" />
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          MD (20px icon, 36px button)
        </p>
        <IconButton icon="check" aria-label="Medium" size="md" variant="outline" />
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          LG (24px icon, 48px button)
        </p>
        <IconButton icon="check" aria-label="Large" size="lg" variant="outline" />
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          XL (32px icon, 64px button)
        </p>
        <IconButton icon="check" aria-label="Extra Large" size="xl" variant="outline" />
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Icon size automatically scales with button size for visual consistency.',
      },
    },
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
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground with all icon button props available for experimentation.',
      },
    },
  },
};
