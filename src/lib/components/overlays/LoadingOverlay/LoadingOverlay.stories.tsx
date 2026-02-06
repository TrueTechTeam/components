import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LoadingOverlay } from './LoadingOverlay';
import { Button } from '../../buttons/Button';

const meta: Meta<typeof LoadingOverlay> = {
  title: 'Overlays/LoadingOverlay',
  component: LoadingOverlay,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
LoadingOverlay displays a loading spinner over content with optional blur and backdrop effects.

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
<td><code>--z-modal</code></td>
<td>1000</td>
<td>Overlay z-index layer</td>
</tr>
<tr>
<td><code>--backdrop-opacity</code></td>
<td>0.7</td>
<td>Backdrop opacity</td>
</tr>
<tr>
<td><code>--transition-duration</code></td>
<td>200ms</td>
<td>Fade in/out transition duration</td>
</tr>
<tr>
<td><code>--spacing-md</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-md)</code></a></td>
<td>Gap between spinner and message</td>
</tr>
<tr>
<td><code>--theme-text-secondary</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-text-secondary)</code></a></td>
<td>Message text color</td>
</tr>
<tr>
<td><code>--font-size-sm</code></td>
<td><a href="?path=/story/theme-css-variables--typography"><code>var(--font-size-sm)</code></a></td>
<td>Message font size</td>
</tr>
<tr>
<td><code>--font-family-primary</code></td>
<td><a href="?path=/story/theme-css-variables--typography"><code>var(--font-family-primary)</code></a></td>
<td>Message font family</td>
</tr>
</tbody>
</table>
`,
      },
    },
  },
  argTypes: {
    visible: {
      control: 'boolean',
      description: 'Whether the overlay is visible',
    },
    mode: {
      control: 'select',
      options: ['container', 'fullscreen'],
      description: 'Overlay mode',
    },
    spinnerStyle: {
      control: 'select',
      options: ['circular', 'dots', 'bars', 'pulse'],
      description: 'Spinner style',
    },
    spinnerSize: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Spinner size',
    },
    spinnerVariant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'],
      description: 'Spinner color variant',
    },
    spinnerSpeed: {
      control: 'select',
      options: ['slow', 'normal', 'fast'],
      description: 'Spinner animation speed',
    },
    message: {
      control: 'text',
      description: 'Message to display below spinner',
    },
    blur: {
      control: 'boolean',
      description: 'Enable backdrop blur',
    },
    backdropOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Backdrop opacity (0-1)',
    },
    zIndex: {
      control: 'number',
      description: 'Custom z-index',
    },
    transitionDuration: {
      control: 'number',
      description: 'Transition duration in ms',
    },
    borderRadius: {
      control: 'text',
      description: 'Border radius for the overlay',
    },
    // Hide complex controls
    children: { table: { disable: true } },
    customSpinner: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingOverlay>;

const SampleContent = () => (
  <div
    style={{
      padding: '24px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '8px',
      color: 'white',
    }}
  >
    <h3 style={{ margin: '0 0 16px 0' }}>Sample Card Content</h3>
    <p style={{ margin: '0 0 16px 0' }}>
      This is some sample content that will be covered by the loading overlay. The overlay appears
      on top of this content while data is being loaded.
    </p>
    <Button variant="secondary">Click Me</Button>
  </div>
);

export const Default: Story = {
  args: {
    visible: true,
    mode: 'container',
    spinnerStyle: 'circular',
    spinnerSize: 'lg',
    spinnerVariant: 'primary',
    borderRadius: 8,
  },
  render: (args) => (
    <div style={{ width: '400px', height: '250px' }}>
      <LoadingOverlay {...args}>
        <SampleContent />
      </LoadingOverlay>
    </div>
  ),
};

export const WithMessage: Story = {
  args: {
    visible: true,
    message: 'Loading your data, please wait...',
    borderRadius: 8,
  },
  render: (args) => (
    <div style={{ width: '400px', height: '250px' }}>
      <LoadingOverlay {...args}>
        <SampleContent />
      </LoadingOverlay>
    </div>
  ),
};

export const WithBlur: Story = {
  args: {
    visible: true,
    blur: true,
    backdropOpacity: 0.5,
    message: 'Processing...',
    borderRadius: 8,
  },
  render: (args) => (
    <div style={{ width: '400px', height: '250px' }}>
      <LoadingOverlay {...args}>
        <SampleContent />
      </LoadingOverlay>
    </div>
  ),
};

export const SpinnerStyles: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      {(['circular', 'dots', 'bars', 'pulse'] as const).map((style) => (
        <div key={style} style={{ width: '200px', height: '150px' }}>
          <LoadingOverlay visible spinnerStyle={style} borderRadius={8}>
            <div
              style={{
                padding: '16px',
                background: '#f5f5f5',
                borderRadius: '8px',
                height: '100%',
                boxSizing: 'border-box',
              }}
            >
              <p style={{ margin: 0, textTransform: 'capitalize' }}>{style} spinner</p>
            </div>
          </LoadingOverlay>
        </div>
      ))}
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const SpinnerVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      {(['primary', 'secondary', 'success', 'warning', 'danger', 'info'] as const).map(
        (variant) => (
          <div key={variant} style={{ width: '150px', height: '100px' }}>
            <LoadingOverlay visible spinnerVariant={variant} spinnerSize="md" borderRadius={8}>
              <div
                style={{
                  padding: '12px',
                  background: '#f5f5f5',
                  borderRadius: '8px',
                  height: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <p style={{ margin: 0, fontSize: '12px', textTransform: 'capitalize' }}>
                  {variant}
                </p>
              </div>
            </LoadingOverlay>
          </div>
        )
      )}
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const BackdropOpacity: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      {[0.3, 0.5, 0.7, 0.9].map((opacity) => (
        <div key={opacity} style={{ width: '180px', height: '120px' }}>
          <LoadingOverlay visible backdropOpacity={opacity} spinnerSize="md" borderRadius={8}>
            <div
              style={{
                padding: '16px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '8px',
                height: '100%',
                boxSizing: 'border-box',
                color: 'white',
              }}
            >
              <p style={{ margin: 0, fontSize: '14px' }}>Opacity: {opacity}</p>
            </div>
          </LoadingOverlay>
        </div>
      ))}
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const ToggleDemo: Story = {
  render: function ToggleDemoRender() {
    const [loading, setLoading] = useState(false);

    const handleClick = () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
    };

    return (
      <div style={{ width: '400px' }}>
        <LoadingOverlay visible={loading} message="Saving changes..." blur borderRadius={8}>
          <div
            style={{
              padding: '24px',
              background: 'var(--theme-surface-primary)',
              borderRadius: '8px',
            }}
          >
            <h3 style={{ margin: '0 0 16px 0', color: 'var(--theme-text-primary)' }}>
              Toggle Loading Demo
            </h3>
            <p style={{ margin: '0 0 16px 0', color: 'var(--theme-text-secondary)' }}>
              Click the button below to simulate a loading state for 2 seconds.
            </p>
            <Button onClick={handleClick} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </LoadingOverlay>
      </div>
    );
  },
  parameters: { controls: { disable: true } },
};

export const FullscreenMode: Story = {
  render: function FullscreenDemoRender() {
    const [loading, setLoading] = useState(false);

    return (
      <div>
        <Button onClick={() => setLoading(true)}>Show Fullscreen Loader</Button>

        <LoadingOverlay
          visible={loading}
          mode="fullscreen"
          message="Loading application..."
          blur
          backdropOpacity={0.8}
        />

        {loading && (
          <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 10001 }}>
            <Button variant="danger" onClick={() => setLoading(false)}>
              Close
            </Button>
          </div>
        )}
      </div>
    );
  },
  parameters: { controls: { disable: true } },
};

export const CustomSpinner: Story = {
  args: {
    visible: true,
    customSpinner: (
      <div
        style={{
          width: '60px',
          height: '60px',
          border: '4px solid #e0e0e0',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
    ),
    message: 'Custom spinner example',
    borderRadius: 8,
  },
  render: (args) => (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={{ width: '400px', height: '250px' }}>
        <LoadingOverlay {...args}>
          <SampleContent />
        </LoadingOverlay>
      </div>
    </>
  ),
};

export const Playground: Story = {
  args: {
    visible: true,
    mode: 'container',
    spinnerStyle: 'circular',
    spinnerSize: 'lg',
    spinnerVariant: 'primary',
    spinnerSpeed: 'normal',
    blur: false,
    backdropOpacity: 0.7,
    transitionDuration: 200,
    borderRadius: 8,
  },
  render: (args) => (
    <div style={{ width: '400px', height: '250px' }}>
      <LoadingOverlay {...args}>
        <SampleContent />
      </LoadingOverlay>
    </div>
  ),
};
