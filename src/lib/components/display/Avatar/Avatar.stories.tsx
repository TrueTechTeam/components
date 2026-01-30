import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';
import { Icon } from '../Icon/Icon';

const meta: Meta<typeof Avatar> = {
  title: 'Display/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['circular', 'rounded', 'square'],
      description: 'Visual variant of the avatar',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of the avatar',
    },
    status: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info', 'neutral', 'processing'],
      description: 'Status indicator',
    },
    src: {
      control: 'text',
      description: 'Image source URL',
    },
    alt: {
      control: 'text',
      description: 'Alt text for the image',
    },
    initials: {
      control: 'text',
      description: 'Initials to display when no image is available',
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
    fallback: {
      table: { disable: true },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

// 1. Default story
export const Default: Story = {
  args: {
    initials: 'JD',
  },
};

// 2. With Image
export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=1',
    alt: 'User Avatar',
  },
};

// 3. Variants story
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Avatar variant="circular" initials="JD" />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>Circular</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar variant="rounded" initials="JD" />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>Rounded</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar variant="square" initials="JD" />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>Square</div>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'All available visual variants: circular (default), rounded, and square.',
      },
    },
  },
};

// 4. Sizes story
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Avatar size="xs" initials="XS" />
      <Avatar size="sm" initials="SM" />
      <Avatar size="md" initials="MD" />
      <Avatar size="lg" initials="LG" />
      <Avatar size="xl" initials="XL" />
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'All available size options from xs to xl.',
      },
    },
  },
};

// 5. With Initials
export const WithInitials: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Avatar initials="JD" size="md" />
      <Avatar initials="AB" size="md" />
      <Avatar initials="CD" size="md" />
      <Avatar initials="EF" size="md" />
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Avatars displaying user initials when no image is available.',
      },
    },
  },
};

// 6. Status Indicators
export const StatusIndicators: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Avatar initials="JD" status="success" size="lg" />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>Success</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar initials="AB" status="warning" size="lg" />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>Warning</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar initials="CD" status="error" size="lg" />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>Error</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar initials="EF" status="info" size="lg" />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>Info</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar initials="GH" status="neutral" size="lg" />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>Neutral</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar initials="IJ" status="processing" size="lg" />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>Processing</div>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Avatars with different status indicators: success, warning, error, info, neutral, and processing.',
      },
    },
  },
};

// 7. With Images and Status
export const WithImagesAndStatus: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Avatar src="https://i.pravatar.cc/150?img=1" alt="User 1" status="success" size="lg" />
      <Avatar src="https://i.pravatar.cc/150?img=2" alt="User 2" status="warning" size="lg" />
      <Avatar src="https://i.pravatar.cc/150?img=3" alt="User 3" status="error" size="lg" />
      <Avatar src="https://i.pravatar.cc/150?img=4" alt="User 4" status="info" size="lg" />
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Avatars with profile images and status indicators.',
      },
    },
  },
};

// 8. With Fallback Icon
export const WithFallbackIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Avatar fallback={<Icon name="user" size="md" />} size="md" />
      <Avatar fallback={<Icon name="users" size="md" />} size="md" />
      <Avatar fallback={<Icon name="building" size="md" />} size="md" />
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Avatars with custom fallback content using icon components.',
      },
    },
  },
};

// 9. Size and Variant Combinations
export const SizeAndVariantCombinations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {(['circular', 'rounded', 'square'] as const).map((variant) => (
        <div key={variant}>
          <h4 style={{ marginBottom: '12px', textTransform: 'capitalize' }}>{variant}</h4>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Avatar variant={variant} size="xs" initials="XS" />
            <Avatar variant={variant} size="sm" initials="SM" />
            <Avatar variant={variant} size="md" initials="MD" />
            <Avatar variant={variant} size="lg" initials="LG" />
            <Avatar variant={variant} size="xl" initials="XL" />
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

// 10. Custom Styling (CSS Variables)
export const CustomStyling: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Avatar
        initials="AB"
        style={
          {
            '--avatar-bg': '#ff6b6b',
            '--avatar-color': '#ffffff',
          } as React.CSSProperties
        }
      />
      <Avatar
        initials="CD"
        style={
          {
            '--avatar-bg': '#4ecdc4',
            '--avatar-color': '#ffffff',
          } as React.CSSProperties
        }
      />
      <Avatar
        initials="EF"
        style={
          {
            '--avatar-bg': '#ffe66d',
            '--avatar-color': '#2d3436',
          } as React.CSSProperties
        }
      />
      <Avatar
        initials="GH"
        style={
          {
            '--avatar-bg': '#a8e6cf',
            '--avatar-color': '#2d3436',
          } as React.CSSProperties
        }
      />
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Examples of customizing the avatar using CSS variables for background and text colors.',
      },
    },
  },
};

// 11. Avatar Group
export const AvatarGroup: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ marginLeft: '-8px' }}>
        <Avatar
          src="https://i.pravatar.cc/150?img=1"
          alt="User 1"
          size="md"
          style={{ marginLeft: '-8px' } as React.CSSProperties}
        />
      </div>
      <div style={{ marginLeft: '-8px' }}>
        <Avatar
          src="https://i.pravatar.cc/150?img=2"
          alt="User 2"
          size="md"
          style={{ marginLeft: '-8px' } as React.CSSProperties}
        />
      </div>
      <div style={{ marginLeft: '-8px' }}>
        <Avatar
          src="https://i.pravatar.cc/150?img=3"
          alt="User 3"
          size="md"
          style={{ marginLeft: '-8px' } as React.CSSProperties}
        />
      </div>
      <div style={{ marginLeft: '-8px' }}>
        <Avatar initials="+3" size="md" style={{ marginLeft: '-8px' } as React.CSSProperties} />
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Multiple avatars grouped together with overlapping effect.',
      },
    },
  },
};

// 12. Playground story with interactive controls
export const Playground: Story = {
  args: {
    variant: 'circular',
    size: 'md',
    initials: 'JD',
    status: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all avatar props.',
      },
    },
  },
};
