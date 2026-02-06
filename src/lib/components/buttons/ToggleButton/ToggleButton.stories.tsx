import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';
import { ToggleButton } from './ToggleButton';

const meta: Meta<typeof ToggleButton> = {
  title: 'Buttons/ToggleButton',
  component: ToggleButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
ToggleButton component - an icon button that toggles between two states.

Perfect for like buttons, favorites, bookmarks, and similar toggle interactions.
Displays different icons and colors for active and inactive states with optional animation.

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
      <td><code>--toggle-button-active-color</code></td>
      <td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-error)</code></a></td>
      <td>Icon color when active</td>
    </tr>
    <tr>
      <td><code>--toggle-button-inactive-color</code></td>
      <td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-text-secondary)</code></a></td>
      <td>Icon color when inactive</td>
    </tr>
    <tr>
      <td><code>--toggle-button-bg</code></td>
      <td><code>transparent</code></td>
      <td>Background color</td>
    </tr>
    <tr>
      <td><code>--toggle-button-bg-hover</code></td>
      <td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-interactive-hover)</code></a></td>
      <td>Background color on hover</td>
    </tr>
    <tr>
      <td><code>--toggle-button-bg-active</code></td>
      <td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-interactive-active)</code></a></td>
      <td>Background color on active/pressed</td>
    </tr>
    <tr>
      <td><code>--toggle-button-radius</code></td>
      <td><a href="?path=/story/theme-css-variables--borders"><code>var(--radius-full)</code></a></td>
      <td>Border radius</td>
    </tr>
    <tr>
      <td><code>--toggle-button-disabled-opacity</code></td>
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
    active: {
      control: 'boolean',
      description: 'Whether the toggle is in active state (controlled)',
    },
    defaultActive: {
      control: 'boolean',
      description: 'Default active state for uncontrolled component',
    },
    activeIcon: {
      control: 'select',
      options: ['heart-filled', 'star-filled', 'bookmark-filled', 'thumbs-up-filled'],
      description: 'Icon to display when active',
    },
    inactiveIcon: {
      control: 'select',
      options: ['heart', 'star', 'bookmark', 'thumbs-up'],
      description: 'Icon to display when inactive',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Button size (also determines icon size)',
    },
    activeColor: {
      control: 'color',
      description: 'Color when active (CSS color value)',
    },
    inactiveColor: {
      control: 'color',
      description: 'Color when inactive (CSS color value)',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    animated: {
      control: 'boolean',
      description: 'Whether to show animation on toggle',
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label (REQUIRED for icon-only buttons)',
    },
    onChange: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
    type: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof ToggleButton>;

/**
 * Default toggle button - a like/heart button
 */
export const Default: Story = {
  args: {
    'aria-label': 'Like',
    activeIcon: 'heart-filled',
    inactiveIcon: 'heart',
    size: 'md',
    activeColor: 'var(--theme-error)',
    inactiveColor: 'var(--theme-text-secondary)',
    defaultActive: false,
    disabled: false,
    animated: true,
    onChange: action('onChange'),
  },
};

/**
 * Toggle button with default active state
 */
export const DefaultActive: Story = {
  args: {
    'aria-label': 'Unlike',
    activeIcon: 'heart-filled',
    inactiveIcon: 'heart',
    defaultActive: true,
    size: 'md',
    activeColor: 'var(--theme-error)',
    inactiveColor: 'var(--theme-text-secondary)',
    onChange: action('onChange'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Toggle button with active state as the default.',
      },
    },
  },
};

/**
 * All available sizes
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <ToggleButton aria-label="Like" size="xs" defaultActive />
      <ToggleButton aria-label="Like" size="sm" defaultActive />
      <ToggleButton aria-label="Like" size="md" defaultActive />
      <ToggleButton aria-label="Like" size="lg" defaultActive />
      <ToggleButton aria-label="Like" size="xl" defaultActive />
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'All available toggle button sizes from extra small to extra large.',
      },
    },
  },
};

/**
 * Different icon types for various use cases
 * Active state shows filled icons, inactive state shows outline icons
 */
export const IconVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <ToggleButton
          aria-label="Like"
          activeIcon="heart-filled"
          inactiveIcon="heart"
          activeColor="var(--theme-error)"
          defaultActive
        />
        <p style={{ fontSize: '12px', marginTop: '8px', color: 'var(--theme-text-secondary)' }}>
          Like
        </p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <ToggleButton
          aria-label="Favorite"
          activeIcon="star-filled"
          inactiveIcon="star"
          activeColor="var(--theme-warning)"
          defaultActive
        />
        <p style={{ fontSize: '12px', marginTop: '8px', color: 'var(--theme-text-secondary)' }}>
          Favorite
        </p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <ToggleButton
          aria-label="Bookmark"
          activeIcon="bookmark-filled"
          inactiveIcon="bookmark"
          activeColor="var(--theme-primary)"
          defaultActive
        />
        <p style={{ fontSize: '12px', marginTop: '8px', color: 'var(--theme-text-secondary)' }}>
          Bookmark
        </p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <ToggleButton
          aria-label="Thumbs up"
          activeIcon="thumbs-up-filled"
          inactiveIcon="thumbs-up"
          activeColor="var(--theme-success)"
          defaultActive
        />
        <p style={{ fontSize: '12px', marginTop: '8px', color: 'var(--theme-text-secondary)' }}>
          Thumbs Up
        </p>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Different icon combinations for various use cases like/star/bookmark/thumbs-up with contextual colors.',
      },
    },
  },
};

/**
 * Active vs Inactive state comparison
 */
export const ActiveStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <ToggleButton aria-label="Inactive like" defaultActive={false} />
        <p style={{ fontSize: '12px', marginTop: '8px', color: 'var(--theme-text-secondary)' }}>
          Inactive
        </p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <ToggleButton aria-label="Active like" defaultActive />
        <p style={{ fontSize: '12px', marginTop: '8px', color: 'var(--theme-text-secondary)' }}>
          Active
        </p>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Visual comparison of active and inactive toggle button states.',
      },
    },
  },
};

/**
 * Custom colors for different themes
 */
export const CustomColors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <ToggleButton
        aria-label="Error"
        activeColor="var(--theme-error)"
        inactiveColor="var(--theme-text-secondary)"
        defaultActive
      />
      <ToggleButton
        aria-label="Warning"
        activeColor="var(--theme-warning)"
        inactiveColor="var(--theme-text-secondary)"
        defaultActive
      />
      <ToggleButton
        aria-label="Primary"
        activeColor="var(--theme-primary)"
        inactiveColor="var(--theme-text-secondary)"
        defaultActive
      />
      <ToggleButton
        aria-label="Info"
        activeColor="var(--theme-info)"
        inactiveColor="var(--theme-text-secondary)"
        defaultActive
      />
      <ToggleButton
        aria-label="Success"
        activeColor="var(--theme-success)"
        inactiveColor="var(--theme-text-secondary)"
        defaultActive
      />
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Toggle buttons with custom colors for different semantic meanings.',
      },
    },
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <ToggleButton aria-label="Disabled inactive" disabled />
      <ToggleButton aria-label="Disabled active" disabled defaultActive />
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Disabled toggle buttons that cannot be interacted with.',
      },
    },
  },
};

/**
 * With and without animation
 */
export const Animation: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <ToggleButton aria-label="With animation" animated />
        <p style={{ fontSize: '12px', marginTop: '8px', color: 'var(--theme-text-secondary)' }}>
          With Animation
        </p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <ToggleButton aria-label="Without animation" animated={false} />
        <p style={{ fontSize: '12px', marginTop: '8px', color: 'var(--theme-text-secondary)' }}>
          No Animation
        </p>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Toggle button animation toggle showing animated and non-animated states.',
      },
    },
  },
};

/**
 * Controlled component example
 */
const ControlledExample = () => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(42);

  const handleChange = (active: boolean) => {
    setLiked(active);
    setLikeCount((prev) => (active ? prev + 1 : prev - 1));
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <ToggleButton aria-label={liked ? 'Unlike' : 'Like'} active={liked} onChange={handleChange} />
      <span
        style={{
          fontSize: '14px',
          color: liked ? 'var(--theme-error)' : 'var(--theme-text-secondary)',
        }}
      >
        {likeCount} likes
      </span>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Controlled component example with value managed by parent state.',
      },
    },
  },
};

/**
 * Real-world social media example
 */
const SocialMediaExample = () => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        padding: '12px',
        border: '1px solid var(--theme-border-primary)',
        borderRadius: '8px',
        maxWidth: '400px',
      }}
    >
      <ToggleButton
        aria-label={liked ? 'Unlike' : 'Like'}
        active={liked}
        onChange={setLiked}
        activeIcon="heart-filled"
        inactiveIcon="heart"
        activeColor="var(--theme-error)"
      />
      <ToggleButton
        aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}
        active={bookmarked}
        onChange={setBookmarked}
        activeIcon="bookmark-filled"
        inactiveIcon="bookmark"
        activeColor="var(--theme-primary)"
      />
    </div>
  );
};

export const SocialMediaActions: Story = {
  render: () => <SocialMediaExample />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Real-world example: social media post with like and bookmark actions.',
      },
    },
  },
};

/**
 * Interactive playground with all controls
 */
export const Playground: Story = {
  args: {
    'aria-label': 'Toggle Button',
    activeIcon: 'heart-filled',
    inactiveIcon: 'heart',
    size: 'md',
    activeColor: 'var(--theme-error)',
    inactiveColor: 'var(--theme-text-secondary)',
    defaultActive: false,
    disabled: false,
    animated: true,
    onChange: action('onChange'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground with all toggle button props available for experimentation.',
      },
    },
  },
};
