import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar';
import { Button } from '../../buttons/Button';

const meta: Meta<typeof ProgressBar> = {
  title: 'Display/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Linear progress indicator for showing task completion, loading states, and buffering.
Supports determinate and indeterminate modes, striped patterns, and buffer progress.

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
<td><code>--progress-bar-gap</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-xs)</code></a></td>
<td>Gap between label/value and progress track</td>
</tr>
<tr>
<td><code>--progress-bar-font-size</code></td>
<td><a href="?path=/story/theme-css-variables--typography"><code>var(--font-size-sm)</code></a></td>
<td>Font size for label and value (default md)</td>
</tr>
<tr>
<td><code>--progress-track-height</code></td>
<td><code>8px</code></td>
<td>Height of the progress track (default md)</td>
</tr>
<tr>
<td><code>--progress-track-bg</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-neutral-200)</code></a></td>
<td>Background color of track</td>
</tr>
<tr>
<td><code>--progress-track-radius</code></td>
<td><a href="?path=/story/theme-css-variables--borders"><code>var(--radius-full)</code></a></td>
<td>Border radius of track</td>
</tr>
<tr>
<td><code>--progress-fill-bg</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-primary-500)</code></a></td>
<td>Background color of fill bar</td>
</tr>
<tr>
<td><code>--progress-fill-transition</code></td>
<td><code>width 0.3s ease</code></td>
<td>Transition for fill bar width</td>
</tr>
<tr>
<td><code>--spacing-sm</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>8px</code></a></td>
<td>Spacing in header area</td>
</tr>
<tr>
<td><code>--theme-text-primary</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>#111827</code></a></td>
<td>Color of label and value text</td>
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
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'],
      description: 'Visual variant of the component',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the component',
    },
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Current progress value (0-100)',
    },
    max: {
      control: { type: 'number', min: 1, max: 1000 },
      description: 'Maximum value',
    },
    showValue: {
      control: 'boolean',
      description: 'Whether to show the value label',
    },
    label: {
      control: 'text',
      description: 'Custom label to display',
    },
    animated: {
      control: 'boolean',
      description: 'Whether to animate the progress',
    },
    striped: {
      control: 'boolean',
      description: 'Whether to show striped pattern',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Indeterminate mode for infinite loading',
    },
    bufferValue: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Buffer/secondary progress value',
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
    formatValue: {
      table: { disable: true },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

// 1. Default story
export const Default: Story = {
  args: {
    value: 50,
  },
};

// 2. Variants story
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <ProgressBar variant="primary" value={75} label="Primary" showValue />
      <ProgressBar variant="secondary" value={60} label="Secondary" showValue />
      <ProgressBar variant="success" value={100} label="Success" showValue />
      <ProgressBar variant="warning" value={45} label="Warning" showValue />
      <ProgressBar variant="danger" value={25} label="Danger" showValue />
      <ProgressBar variant="info" value={80} label="Info" showValue />
      <ProgressBar variant="neutral" value={50} label="Neutral" showValue />
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'All available visual variants of the progress bar component.',
      },
    },
  },
};

// 3. Sizes story
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <ProgressBar size="sm" value={75} label="Small" showValue />
      <ProgressBar size="md" value={75} label="Medium" showValue />
      <ProgressBar size="lg" value={75} label="Large" showValue />
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'All available size options.',
      },
    },
  },
};

// 4. With Labels
export const WithLabels: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <ProgressBar value={75} label="Downloading..." showValue />
      <ProgressBar value={45} label="Processing files..." showValue />
      <ProgressBar value={90} label="Almost done..." showValue />
      <ProgressBar value={100} label="Complete!" showValue />
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Progress bars with labels and values.',
      },
    },
  },
};

// 5. Striped Pattern
export const StripedPattern: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <ProgressBar value={75} label="Striped (Static)" striped animated={false} />
      <ProgressBar value={75} label="Striped (Animated)" striped animated />
      <ProgressBar variant="success" value={60} label="Success Striped" striped animated />
      <ProgressBar variant="warning" value={45} label="Warning Striped" striped animated />
      <ProgressBar variant="danger" value={30} label="Danger Striped" striped animated />
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Progress bars with striped patterns, both static and animated.',
      },
    },
  },
};

// 6. File Upload Example
const FileUploadExampleComponent = () => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (progress < 100) {
      const timer = setTimeout(() => {
        setProgress((prev) => Math.min(prev + 1, 100));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <div style={{ width: '100%' }}>
      <ProgressBar
        variant={progress === 100 ? 'success' : 'primary'}
        value={progress}
        label={progress === 100 ? 'Upload complete!' : 'Uploading file...'}
        showValue
        animated
      />
      <Button onClick={() => setProgress(0)} style={{ marginTop: '16px' }}>
        Reset
      </Button>
    </div>
  );
};

export const FileUploadExample: Story = {
  render: () => <FileUploadExampleComponent />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Interactive example of a file upload progress indicator.',
      },
    },
  },
};

// 7. Custom Max Value
export const CustomMaxValue: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <ProgressBar
        value={50}
        max={200}
        showValue
        formatValue={(value, max) => `${value} / ${max} items`}
        label="Items processed"
      />
      <ProgressBar
        value={750}
        max={1000}
        showValue
        formatValue={(value, max) => `${value}MB / ${max}MB`}
        label="Storage used"
      />
      <ProgressBar
        value={15}
        max={20}
        showValue
        formatValue={(value, max) => `Day ${value} of ${max}`}
        label="Challenge progress"
      />
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Progress bars with custom max values and custom value formatting.',
      },
    },
  },
};

// 8. Loading States
export const LoadingStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <ProgressBar variant="info" value={0} label="Waiting..." showValue />
      <ProgressBar variant="primary" value={25} label="In progress..." showValue />
      <ProgressBar variant="warning" value={75} label="Almost there..." showValue />
      <ProgressBar variant="success" value={100} label="Completed" showValue />
      <ProgressBar variant="danger" value={15} label="Failed" showValue />
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Different loading states with appropriate variants.',
      },
    },
  },
};

// 9. Indeterminate Mode
export const Indeterminate: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <ProgressBar indeterminate label="Loading..." />
      <ProgressBar indeterminate variant="secondary" label="Processing..." />
      <ProgressBar indeterminate variant="success" label="Syncing..." />
      <ProgressBar indeterminate variant="info" size="sm" label="Small indeterminate" />
      <ProgressBar indeterminate variant="warning" size="lg" label="Large indeterminate" />
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Indeterminate progress bars for unknown duration tasks.',
      },
    },
  },
};

// 10. Buffer Progress
export const BufferProgress: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <ProgressBar value={30} bufferValue={60} label="Video loading (buffering)" showValue />
      <ProgressBar value={45} bufferValue={80} variant="info" label="Streaming..." showValue />
      <ProgressBar
        value={10}
        bufferValue={50}
        variant="success"
        label="Download progress"
        showValue
      />
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Progress bars with buffer/secondary progress for buffering states.',
      },
    },
  },
};

// 11. All Combinations (Grid)
export const AllCombinations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {(['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'] as const).map(
        (variant) => (
          <div key={variant}>
            <h4 style={{ marginBottom: '16px', textTransform: 'capitalize' }}>{variant}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <ProgressBar variant={variant} size="sm" value={75} showValue />
              <ProgressBar variant={variant} size="md" value={75} showValue />
              <ProgressBar variant={variant} size="lg" value={75} showValue />
              <ProgressBar variant={variant} value={75} striped animated showValue />
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
        story: 'All variant and size combinations in a comprehensive grid.',
      },
    },
  },
};

// 12. Playground story with interactive controls
export const Playground: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    value: 50,
    max: 100,
    showValue: true,
    label: 'Progress',
    animated: true,
    striped: false,
    indeterminate: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all component props.',
      },
    },
  },
};
