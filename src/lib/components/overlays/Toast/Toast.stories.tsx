import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';
import { ToastProvider } from './ToastProvider';
import { useToastContext } from './ToastContext';
import { Button } from '../../buttons/Button';

const meta: Meta<typeof Toast> = {
  title: 'Overlays/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Toast component displays brief notifications with icons, titles, messages, and optional actions.

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
<td><code>--toast-container-z-index</code></td>
<td>1500</td>
<td>Toast container z-index layer</td>
</tr>
<tr>
<td><code>--toast-gap</code></td>
<td>12px</td>
<td>Gap between toasts</td>
</tr>
<tr>
<td><code>--toast-offset</code></td>
<td>16px</td>
<td>Container offset from viewport edge</td>
</tr>
<tr>
<td><code>--toast-bg</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-surface-elevated)</code></a></td>
<td>Toast background color</td>
</tr>
<tr>
<td><code>--toast-shadow</code></td>
<td><a href="?path=/story/theme-css-variables--shadows"><code>var(--theme-shadow-lg)</code></a></td>
<td>Toast box shadow</td>
</tr>
<tr>
<td><code>--toast-border</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-border-primary)</code></a></td>
<td>Toast border color</td>
</tr>
<tr>
<td><code>--toast-border-radius</code></td>
<td><a href="?path=/story/theme-css-variables--borders"><code>var(--radius-md)</code></a></td>
<td>Toast border radius</td>
</tr>
<tr>
<td><code>--toast-padding</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-sm)</code></a></td>
<td>Toast inner padding</td>
</tr>
<tr>
<td><code>--toast-width</code></td>
<td>360px</td>
<td>Toast container width</td>
</tr>
<tr>
<td><code>--toast-animation-duration</code></td>
<td>200ms</td>
<td>Slide in/out animation duration</td>
</tr>
<tr>
<td><code>--toast-animation-easing</code></td>
<td>cubic-bezier(0.16, 1, 0.3, 1)</td>
<td>Animation easing function</td>
</tr>
<tr>
<td><code>--spacing-sm</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-sm)</code></a></td>
<td>Gap between icon and content</td>
</tr>
<tr>
<td><code>--theme-text-secondary</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-text-secondary)</code></a></td>
<td>Message text color</td>
</tr>
<tr>
<td><code>--font-size-sm</code></td>
<td><a href="?path=/story/theme-css-variables--typography"><code>var(--font-size-sm)</code></a></td>
<td>Title and message font size</td>
</tr>
<tr>
<td><code>--font-weight-semibold</code></td>
<td><a href="?path=/story/theme-css-variables--typography"><code>var(--font-weight-semibold)</code></a></td>
<td>Title font weight</td>
</tr>
<tr>
<td><code>--theme-primary</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-primary)</code></a></td>
<td>Action button color</td>
</tr>
<tr>
<td><code>--radius-sm</code></td>
<td><a href="?path=/story/theme-css-variables--borders"><code>var(--radius-sm)</code></a></td>
<td>Action button border radius</td>
</tr>
<tr>
<td><code>--theme-info</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-info)</code></a></td>
<td>Info variant accent color</td>
</tr>
<tr>
<td><code>--theme-success</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-success)</code></a></td>
<td>Success variant accent color</td>
</tr>
<tr>
<td><code>--theme-warning</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-warning)</code></a></td>
<td>Warning variant accent color</td>
</tr>
<tr>
<td><code>--theme-error</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-error)</code></a></td>
<td>Error variant accent color</td>
</tr>
<tr>
<td><code>--toast-progress</code></td>
<td>100%</td>
<td>Progress bar width percentage</td>
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
      options: ['info', 'success', 'warning', 'error', 'loading'],
      description: 'Toast variant',
    },
    position: {
      control: 'select',
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ],
      description: 'Toast position',
    },
    dismissible: {
      control: 'boolean',
      description: 'Show dismiss button',
    },
    showProgress: {
      control: 'boolean',
      description: 'Show progress bar',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

// Basic Toast Examples with Provider
const ToastDemoContent = () => {
  const toast = useToastContext();

  if (!toast) {
    return <p>Toast provider not found</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Button onClick={() => toast.info('This is an info message')}>Info Toast</Button>
      <Button variant="success" onClick={() => toast.success('Operation completed successfully!')}>
        Success Toast
      </Button>
      <Button variant="warning" onClick={() => toast.warning('Please be careful with this action')}>
        Warning Toast
      </Button>
      <Button variant="danger" onClick={() => toast.error('Something went wrong!')}>
        Error Toast
      </Button>
      <Button variant="secondary" onClick={() => toast.loading('Loading data...')}>
        Loading Toast
      </Button>
    </div>
  );
};

const BasicToastExample = () => {
  return (
    <ToastProvider position="top-right">
      <ToastDemoContent />
    </ToastProvider>
  );
};

export const Basic: Story = {
  render: () => <BasicToastExample />,
};

// Toast with Title
const ToastWithTitleContent = () => {
  const toast = useToastContext();

  if (!toast) {
    return null;
  }

  const showToast = () => {
    toast.addToast({
      variant: 'success',
      title: 'Payment Successful',
      message: 'Your payment of $49.99 has been processed.',
      duration: 5000,
    });
  };

  return <Button onClick={showToast}>Show Toast with Title</Button>;
};

const ToastWithTitleExample = () => {
  return (
    <ToastProvider position="top-right">
      <ToastWithTitleContent />
    </ToastProvider>
  );
};

export const WithTitle: Story = {
  render: () => <ToastWithTitleExample />,
};

// Toast with Action
const ToastWithActionContent = () => {
  const toast = useToastContext();

  if (!toast) {
    return null;
  }

  const showToast = () => {
    toast.addToast({
      variant: 'info',
      title: 'New Update Available',
      message: 'Version 2.0 is ready to install.',
      action: {
        label: 'Update',
        onClick: () => alert('Updating...'),
      },
      duration: 10000,
    });
  };

  return <Button onClick={showToast}>Show Toast with Action</Button>;
};

const ToastWithActionExample = () => {
  return (
    <ToastProvider position="top-right">
      <ToastWithActionContent />
    </ToastProvider>
  );
};

export const WithAction: Story = {
  render: () => <ToastWithActionExample />,
};

// Toast with Progress Bar
const ToastWithProgressContent = () => {
  const toast = useToastContext();

  if (!toast) {
    return null;
  }

  const showToast = () => {
    toast.addToast({
      variant: 'info',
      message: 'This toast will auto-dismiss',
      showProgress: true,
      duration: 5000,
    });
  };

  return <Button onClick={showToast}>Show Toast with Progress</Button>;
};

const ToastWithProgressExample = () => {
  return (
    <ToastProvider position="top-right">
      <ToastWithProgressContent />
    </ToastProvider>
  );
};

export const WithProgress: Story = {
  render: () => <ToastWithProgressExample />,
};

// Different Positions
const PositionDemoContent = () => {
  const toast = useToastContext();

  if (!toast) {
    return null;
  }

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Button onClick={() => toast.success('Success message!')}>Add Toast</Button>
      <Button variant="ghost" onClick={() => toast.removeAllToasts()}>
        Clear All
      </Button>
    </div>
  );
};

const PositionExample = ({
  position,
}: {
  position:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
}) => {
  return (
    <ToastProvider position={position}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: '16px' }}>Position: {position}</p>
        <PositionDemoContent />
      </div>
    </ToastProvider>
  );
};

export const TopLeft: Story = {
  render: () => <PositionExample position="top-left" />,
};

export const TopCenter: Story = {
  render: () => <PositionExample position="top-center" />,
};

export const TopRight: Story = {
  render: () => <PositionExample position="top-right" />,
};

export const BottomLeft: Story = {
  render: () => <PositionExample position="bottom-left" />,
};

export const BottomCenter: Story = {
  render: () => <PositionExample position="bottom-center" />,
};

export const BottomRight: Story = {
  render: () => <PositionExample position="bottom-right" />,
};

// Promise Toast
const PromiseToastContent = () => {
  const toast = useToastContext();

  if (!toast) {
    return null;
  }

  const simulateApiCall = () => {
    return new Promise<{ name: string }>((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.3) {
          resolve({ name: 'John Doe' });
        } else {
          reject(new Error('Network error'));
        }
      }, 2000);
    });
  };

  const handleClick = () => {
    toast.promise(simulateApiCall(), {
      loading: 'Saving user...',
      success: (data) => `User ${data.name} saved successfully!`,
      error: (err) => `Failed to save: ${err.message}`,
    });
  };

  return <Button onClick={handleClick}>Save User (Promise Toast)</Button>;
};

const PromiseToastExample = () => {
  return (
    <ToastProvider position="top-right">
      <PromiseToastContent />
    </ToastProvider>
  );
};

export const PromiseToast: Story = {
  render: () => <PromiseToastExample />,
};

// Update Toast
const UpdateToastContent = () => {
  const toast = useToastContext();

  if (!toast) {
    return null;
  }

  const handleClick = () => {
    const id = toast.loading('Processing...');

    setTimeout(() => {
      toast.updateToast(id, {
        variant: 'success',
        message: 'Processing complete!',
        duration: 3000,
      });
    }, 2000);
  };

  return <Button onClick={handleClick}>Start Process (Updates after 2s)</Button>;
};

const UpdateToastExample = () => {
  return (
    <ToastProvider position="top-right">
      <UpdateToastContent />
    </ToastProvider>
  );
};

export const UpdateToast: Story = {
  render: () => <UpdateToastExample />,
};

// Max Visible Toasts
const MaxVisibleContent = () => {
  const toast = useToastContext();

  if (!toast) {
    return null;
  }

  const addMultiple = () => {
    for (let i = 1; i <= 7; i++) {
      setTimeout(() => {
        toast.info(`Toast message #${i}`);
      }, i * 200);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button onClick={addMultiple}>Add 7 Toasts (Max 3 Visible)</Button>
      <Button variant="ghost" onClick={() => toast.removeAllToasts()}>
        Clear All
      </Button>
    </div>
  );
};

const MaxVisibleExample = () => {
  return (
    <ToastProvider position="top-right" maxVisible={3}>
      <MaxVisibleContent />
    </ToastProvider>
  );
};

export const MaxVisibleToasts: Story = {
  render: () => <MaxVisibleExample />,
};

// All Variants Showcase
const AllVariantsContent = () => {
  const toast = useToastContext();

  if (!toast) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Button
        onClick={() =>
          toast.addToast({
            variant: 'info',
            title: 'Information',
            message: 'Here is some helpful information.',
          })
        }
      >
        Info
      </Button>
      <Button
        variant="success"
        onClick={() =>
          toast.addToast({
            variant: 'success',
            title: 'Success',
            message: 'Your action was successful!',
          })
        }
      >
        Success
      </Button>
      <Button
        variant="warning"
        onClick={() =>
          toast.addToast({
            variant: 'warning',
            title: 'Warning',
            message: 'Please proceed with caution.',
          })
        }
      >
        Warning
      </Button>
      <Button
        variant="danger"
        onClick={() =>
          toast.addToast({
            variant: 'error',
            title: 'Error',
            message: 'An error occurred.',
          })
        }
      >
        Error
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.addToast({
            variant: 'loading',
            title: 'Loading',
            message: 'Please wait...',
            duration: 3000,
          })
        }
      >
        Loading
      </Button>
    </div>
  );
};

const AllVariantsExample = () => {
  return (
    <ToastProvider position="top-right">
      <AllVariantsContent />
    </ToastProvider>
  );
};

export const AllVariants: Story = {
  render: () => <AllVariantsExample />,
};

// Persistent Toast (no auto-dismiss)
const PersistentToastContent = () => {
  const toast = useToastContext();

  if (!toast) {
    return null;
  }

  const showPersistent = () => {
    toast.addToast({
      variant: 'warning',
      title: 'Action Required',
      message: 'Please complete your profile to continue.',
      duration: 0, // Persistent
      action: {
        label: 'Complete',
        onClick: () => alert('Navigating to profile...'),
      },
    });
  };

  return <Button onClick={showPersistent}>Show Persistent Toast</Button>;
};

const PersistentToastExample = () => {
  return (
    <ToastProvider position="top-right">
      <PersistentToastContent />
    </ToastProvider>
  );
};

export const PersistentToast: Story = {
  render: () => <PersistentToastExample />,
};

// Custom Duration
const CustomDurationContent = () => {
  const toast = useToastContext();

  if (!toast) {
    return null;
  }

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Button
        onClick={() =>
          toast.addToast({
            variant: 'info',
            message: 'Dismisses in 2 seconds',
            duration: 2000,
            showProgress: true,
          })
        }
      >
        2 seconds
      </Button>
      <Button
        onClick={() =>
          toast.addToast({
            variant: 'info',
            message: 'Dismisses in 5 seconds',
            duration: 5000,
            showProgress: true,
          })
        }
      >
        5 seconds
      </Button>
      <Button
        onClick={() =>
          toast.addToast({
            variant: 'info',
            message: 'Dismisses in 10 seconds',
            duration: 10000,
            showProgress: true,
          })
        }
      >
        10 seconds
      </Button>
    </div>
  );
};

const CustomDurationExample = () => {
  return (
    <ToastProvider position="top-right">
      <CustomDurationContent />
    </ToastProvider>
  );
};

export const CustomDuration: Story = {
  render: () => <CustomDurationExample />,
};
