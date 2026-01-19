import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Display/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    spinnerStyle: {
      control: 'select',
      options: ['circular', 'dots', 'bars', 'pulse'],
      description: 'Visual style of the spinner animation',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of the spinner',
    },
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'success',
        'warning',
        'danger',
        'info',
        'neutral',
        'currentColor',
      ],
      description: 'Color variant of the spinner',
    },
    speed: {
      control: 'select',
      options: ['slow', 'normal', 'fast'],
      description: 'Animation speed',
    },
    strokeWidth: {
      control: { type: 'number', min: 1, max: 8 },
      description: 'Stroke width for circular style',
    },
    srText: {
      control: 'text',
      description: 'Screen reader text',
    },
    showSrText: {
      control: 'boolean',
      description: 'Show screen reader text visually',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {
    spinnerStyle: 'circular',
    size: 'md',
    variant: 'primary',
    speed: 'normal',
  },
};

export const Styles: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Spinner spinnerStyle="circular" size="lg" />
        <p style={{ marginTop: '8px', fontSize: '14px' }}>Circular</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner spinnerStyle="dots" size="lg" />
        <p style={{ marginTop: '8px', fontSize: '14px' }}>Dots</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner spinnerStyle="bars" size="lg" />
        <p style={{ marginTop: '8px', fontSize: '14px' }}>Bars</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner spinnerStyle="pulse" size="lg" />
        <p style={{ marginTop: '8px', fontSize: '14px' }}>Pulse</p>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Spinner size="xs" />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>xs (16px)</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner size="sm" />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>sm (20px)</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner size="md" />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>md (24px)</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner size="lg" />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>lg (32px)</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner size="xl" />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>xl (48px)</p>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ textAlign: 'center' }}>
        <Spinner variant="primary" size="lg" />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>Primary</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner variant="secondary" size="lg" />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>Secondary</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner variant="success" size="lg" />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>Success</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner variant="warning" size="lg" />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>Warning</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner variant="danger" size="lg" />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>Danger</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner variant="info" size="lg" />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>Info</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner variant="neutral" size="lg" />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>Neutral</p>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Speeds: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Spinner speed="slow" size="lg" />
        <p style={{ marginTop: '8px', fontSize: '14px' }}>Slow</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner speed="normal" size="lg" />
        <p style={{ marginTop: '8px', fontSize: '14px' }}>Normal</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner speed="fast" size="lg" />
        <p style={{ marginTop: '8px', fontSize: '14px' }}>Fast</p>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const StrokeWidths: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Spinner spinnerStyle="circular" size="xl" strokeWidth={2} />
        <p style={{ marginTop: '8px', fontSize: '14px' }}>Thin (2)</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner spinnerStyle="circular" size="xl" strokeWidth={3} />
        <p style={{ marginTop: '8px', fontSize: '14px' }}>Default (3)</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner spinnerStyle="circular" size="xl" strokeWidth={5} />
        <p style={{ marginTop: '8px', fontSize: '14px' }}>Thick (5)</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spinner spinnerStyle="circular" size="xl" strokeWidth={7} />
        <p style={{ marginTop: '8px', fontSize: '14px' }}>Bold (7)</p>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const CurrentColorInherit: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
      <div style={{ color: '#e91e63', textAlign: 'center' }}>
        <Spinner variant="currentColor" size="lg" />
        <p style={{ marginTop: '8px', fontSize: '14px' }}>Pink text</p>
      </div>
      <div style={{ color: '#2196f3', textAlign: 'center' }}>
        <Spinner variant="currentColor" size="lg" />
        <p style={{ marginTop: '8px', fontSize: '14px' }}>Blue text</p>
      </div>
      <div style={{ color: '#4caf50', textAlign: 'center' }}>
        <Spinner variant="currentColor" size="lg" />
        <p style={{ marginTop: '8px', fontSize: '14px' }}>Green text</p>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const WithVisibleText: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Spinner size="sm" showSrText srText="Loading content..." />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Spinner size="md" showSrText srText="Please wait..." />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Spinner size="lg" showSrText srText="Fetching data..." />
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const AllStylesAllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {(['circular', 'dots', 'bars', 'pulse'] as const).map((style) => (
        <div key={style}>
          <h4 style={{ marginBottom: '12px', textTransform: 'capitalize' }}>{style}</h4>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
              <Spinner key={size} spinnerStyle={style} size={size} />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Playground: Story = {
  args: {
    spinnerStyle: 'circular',
    size: 'lg',
    variant: 'primary',
    speed: 'normal',
    strokeWidth: 3,
    srText: 'Loading...',
    showSrText: false,
  },
};
