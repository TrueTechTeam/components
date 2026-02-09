import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { Button } from './Button';
import { Icon } from '../../display/Icon';
import { iconRegistry } from '../../display/Icon/icons';

// Dynamically generate icon options from iconRegistry
const iconOptions = [null, ...Object.keys(iconRegistry)] as const;

const meta: Meta<typeof Button> = {
  title: 'Buttons/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Button component with multiple variants, sizes, and states.

Supports icons, loading states, and full-width layouts. The button component
is the primary interaction element for user actions throughout the application.

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
      <td>Text color</td>
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
      <td><code>--button-gap</code></td>
      <td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-sm)</code></a></td>
      <td>Gap between icon and text</td>
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
    <tr>
      <td><code>--button-icon-padding</code></td>
      <td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-sm)</code></a></td>
      <td>Padding for icon-only buttons</td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'success', 'warning', 'danger'],
      description: 'Button variant style',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
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
    children: {
      control: 'text',
      description: 'Button text content',
    },
    onClick: { table: { disable: true } },
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
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'All available button variants showing different visual styles.',
      },
    },
  },
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
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Semantic color variants with appropriate icons for success, warning, and error actions.',
      },
    },
  },
};

/**
 * All button sizes
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'All available button sizes from extra small to extra large.',
      },
    },
  },
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
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Buttons with start and/or end icons to enhance visual communication.',
      },
    },
  },
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
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Disabled buttons that cannot be interacted with.',
      },
    },
  },
};

/**
 * Full width button
 */
export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    fullWidth: true,
    onClick: action('clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Button that expands to fill its container width.',
      },
    },
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
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Loading state with spinner displayed in different positions.',
      },
    },
  },
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
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Loading state combined with different button variants.',
      },
    },
  },
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
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Loading state with spinner automatically sized for each button size.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground with all button props available for experimentation.',
      },
    },
  },
};
