import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Display/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'circular', 'rectangular', 'rounded'],
    },
    width: {
      control: 'text',
    },
    height: {
      control: 'text',
    },
    animated: {
      control: 'boolean',
    },
    lines: {
      control: { type: 'number', min: 1, max: 10 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    variant: 'text',
    width: '100%',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
      <div>
        <h4 style={{ marginBottom: '12px' }}>Text</h4>
        <Skeleton variant="text" width="200px" />
      </div>
      <div>
        <h4 style={{ marginBottom: '12px' }}>Circular</h4>
        <Skeleton variant="circular" width={64} height={64} />
      </div>
      <div>
        <h4 style={{ marginBottom: '12px' }}>Rectangular</h4>
        <Skeleton variant="rectangular" width="300px" height="200px" />
      </div>
      <div>
        <h4 style={{ marginBottom: '12px' }}>Rounded</h4>
        <Skeleton variant="rounded" width="300px" height="200px" />
      </div>
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const TextLines: Story = {
  render: () => (
    <div style={{ maxWidth: '600px', width: '100%' }}>
      <Skeleton variant="text" lines={5} />
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Multiple text lines for paragraph skeletons.',
      },
    },
  },
};

export const UserCard: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        border: '1px solid var(--theme-border-primary)',
        borderRadius: '8px',
        maxWidth: '400px',
      }}
    >
      <Skeleton variant="circular" width={64} height={64} />
      <div style={{ flex: 1 }}>
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" style={{ marginTop: '8px' }} />
      </div>
    </div>
  ),
  decorators: [
    (Story) => (
      <div style={{ minWidth: '400px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Example of a user card skeleton loading state.',
      },
    },
  },
};

export const ArticlePreview: Story = {
  render: () => (
    <div style={{ maxWidth: '600px', width: '100%' }}>
      <Skeleton variant="rounded" width="100%" height="200px" />
      <div style={{ marginTop: '16px' }}>
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" lines={3} style={{ marginTop: '12px' }} />
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <Skeleton variant="circular" width={32} height={32} />
          <div style={{ flex: 1 }}>
            <Skeleton variant="text" width="40%" />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Example of an article preview skeleton.',
      },
    },
  },
};

export const Dashboard: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        width: '100%',
      }}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          style={{
            padding: '16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="circular" width={32} height={32} />
          </div>
          <Skeleton variant="text" width="80%" height="2em" />
          <Skeleton variant="text" width="40%" style={{ marginTop: '8px' }} />
        </div>
      ))}
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Example of dashboard KPI cards loading state.',
      },
    },
  },
};

export const WithoutAnimation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Skeleton variant="text" animated={false} />
      <Skeleton variant="rectangular" width="300px" height="150px" animated={false} />
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Skeletons without animation.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    variant: 'text',
    width: '100%',
    animated: true,
  },
};

