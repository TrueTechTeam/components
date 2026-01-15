import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar';
import { Button } from '../../buttons/Button';

const meta: Meta<typeof ProgressBar> = {
  title: 'Display/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
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
      <Button
        onClick={() => setProgress(0)}
        style={{ marginTop: '16px' }}
      >
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

// 9. All Combinations (Grid)
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

// 10. Playground story with interactive controls
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
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all component props.',
      },
    },
  },
};

