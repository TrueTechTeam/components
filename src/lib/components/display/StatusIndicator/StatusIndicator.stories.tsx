import type { Meta, StoryObj } from '@storybook/react';
import { StatusIndicator } from './StatusIndicator';

const meta: Meta<typeof StatusIndicator> = {
  title: 'Display/StatusIndicator',
  component: StatusIndicator,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info', 'neutral', 'processing'],
      description: 'Status variant of the indicator',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of the indicator',
    },
    pulse: {
      control: 'boolean',
      description: 'Whether to show pulse animation',
    },
    withText: {
      control: 'boolean',
      description: 'Whether to display text alongside the indicator',
    },
    children: {
      control: 'text',
      description: 'Text content to display (requires withText=true)',
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
type Story = StoryObj<typeof StatusIndicator>;

// 1. Default story
export const Default: Story = {
  args: {},
};

// 2. Status variants story
export const StatusVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <StatusIndicator status="success" />
      <StatusIndicator status="warning" />
      <StatusIndicator status="error" />
      <StatusIndicator status="info" />
      <StatusIndicator status="neutral" />
      <StatusIndicator status="processing" />
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'All available status variants of the indicator.',
      },
    },
  },
};

// 3. Sizes story
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <StatusIndicator status="success" size="xs" />
      <StatusIndicator status="success" size="sm" />
      <StatusIndicator status="success" size="md" />
      <StatusIndicator status="success" size="lg" />
      <StatusIndicator status="success" size="xl" />
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

// 4. With text story
export const WithText: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexDirection: 'column' }}>
      <StatusIndicator status="success" withText>
        Online
      </StatusIndicator>
      <StatusIndicator status="warning" withText>
        Warning
      </StatusIndicator>
      <StatusIndicator status="error" withText>
        Offline
      </StatusIndicator>
      <StatusIndicator status="info" withText>
        Information
      </StatusIndicator>
      <StatusIndicator status="neutral" withText>
        Inactive
      </StatusIndicator>
      <StatusIndicator status="processing" withText>
        Processing
      </StatusIndicator>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Status indicators with text labels.',
      },
    },
  },
};

// 5. Pulse animation story
export const PulseAnimation: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexDirection: 'column' }}>
      <StatusIndicator status="processing" pulse withText>
        Processing
      </StatusIndicator>
      <StatusIndicator status="success" pulse withText>
        Live
      </StatusIndicator>
      <StatusIndicator status="error" pulse withText>
        Alert
      </StatusIndicator>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Indicators with pulse animation to draw attention.',
      },
    },
  },
};

// 6. Size combinations with text
export const SizesWithText: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexDirection: 'column' }}>
      <StatusIndicator status="success" size="xs" withText>
        Extra small status
      </StatusIndicator>
      <StatusIndicator status="success" size="sm" withText>
        Small status
      </StatusIndicator>
      <StatusIndicator status="success" size="md" withText>
        Medium status
      </StatusIndicator>
      <StatusIndicator status="success" size="lg" withText>
        Large status
      </StatusIndicator>
      <StatusIndicator status="success" size="xl" withText>
        Extra large status
      </StatusIndicator>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Different sizes with text labels from xs to xl.',
      },
    },
  },
};

// 7. Real-world examples
export const RealWorldExamples: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexDirection: 'column' }}>
      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>
          Server Status
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <StatusIndicator status="success" withText>
            API Server: Online
          </StatusIndicator>
          <StatusIndicator status="success" withText>
            Database: Connected
          </StatusIndicator>
          <StatusIndicator status="warning" withText>
            Cache: Degraded
          </StatusIndicator>
        </div>
      </div>

      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>
          User Activity
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <StatusIndicator status="success" pulse withText>
            John Doe - Active now
          </StatusIndicator>
          <StatusIndicator status="neutral" withText>
            Jane Smith - Away
          </StatusIndicator>
          <StatusIndicator status="neutral" withText>
            Bob Johnson - Offline
          </StatusIndicator>
        </div>
      </div>

      <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>
          Build Pipeline
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <StatusIndicator status="success" withText>
            Tests: Passed
          </StatusIndicator>
          <StatusIndicator status="processing" pulse withText>
            Build: In Progress
          </StatusIndicator>
          <StatusIndicator status="neutral" withText>
            Deploy: Pending
          </StatusIndicator>
        </div>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Real-world usage examples of status indicators.',
      },
    },
  },
};

// 8. All Combinations (Grid)
export const AllCombinations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {(['success', 'warning', 'error', 'info', 'neutral', 'processing'] as const).map(
        (status) => (
          <div key={status}>
            <h4 style={{ marginBottom: '12px', textTransform: 'capitalize' }}>{status}</h4>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
              <StatusIndicator status={status} size="xs" />
              <StatusIndicator status={status} size="sm" />
              <StatusIndicator status={status} size="md" />
              <StatusIndicator status={status} size="lg" />
              <StatusIndicator status={status} size="xl" />
              <StatusIndicator status={status} pulse />
              <StatusIndicator status={status} withText>
                {status}
              </StatusIndicator>
              <StatusIndicator status={status} pulse withText>
                {status} pulse
              </StatusIndicator>
            </div>
          </div>
        )
      )}
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'All status, size, and state combinations in a comprehensive grid.',
      },
    },
  },
};

// 9. Custom Styling (CSS Variables)
export const CustomStyling: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexDirection: 'column' }}>
      <StatusIndicator
        withText
        style={{
          '--indicator-dot-color': '#ff6b6b',
          '--indicator-dot-size': '12px',
        } as React.CSSProperties}
      >
        Custom color and size
      </StatusIndicator>
      <StatusIndicator
        withText
        style={{
          '--indicator-gap': '12px',
          '--indicator-font-size': '18px',
        } as React.CSSProperties}
      >
        Custom spacing and font
      </StatusIndicator>
      <StatusIndicator
        pulse
        withText
        style={{
          '--indicator-dot-color': '#9333ea',
        } as React.CSSProperties}
      >
        Custom purple indicator
      </StatusIndicator>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Examples of customizing the indicator using CSS variables.',
      },
    },
  },
};

// 10. Playground story with interactive controls
export const Playground: Story = {
  args: {
    status: 'success',
    size: 'md',
    pulse: false,
    withText: true,
    children: 'Online',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all component props.',
      },
    },
  },
};
