import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';
import { AlertProvider } from './AlertProvider';
import { useAlertContext } from './AlertContext';
import { Button } from '../../buttons/Button';

const meta: Meta<typeof Alert> = {
  title: 'Overlays/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Alert component displays important messages with icons, titles, and optional actions.

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
<td><code>--spacing-md</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-md)</code></a></td>
<td>Gap between alert header and actions</td>
</tr>
<tr>
<td><code>--spacing-lg</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-lg)</code></a></td>
<td>Padding for header and actions</td>
</tr>
<tr>
<td><code>--spacing-sm</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-sm)</code></a></td>
<td>Gap between action buttons</td>
</tr>
<tr>
<td><code>--font-size-lg</code></td>
<td><a href="?path=/story/theme-css-variables--typography"><code>var(--font-size-lg)</code></a></td>
<td>Alert title font size</td>
</tr>
<tr>
<td><code>--font-weight-semibold</code></td>
<td><a href="?path=/story/theme-css-variables--typography"><code>var(--font-weight-semibold)</code></a></td>
<td>Alert title font weight</td>
</tr>
<tr>
<td><code>--font-size-base</code></td>
<td><a href="?path=/story/theme-css-variables--typography"><code>var(--font-size-base)</code></a></td>
<td>Alert description font size</td>
</tr>
<tr>
<td><code>--theme-text-primary</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-text-primary)</code></a></td>
<td>Title and icon text color</td>
</tr>
<tr>
<td><code>--theme-text-secondary</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-text-secondary)</code></a></td>
<td>Description text color</td>
</tr>
<tr>
<td><code>--theme-info</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-info)</code></a></td>
<td>Info variant color</td>
</tr>
<tr>
<td><code>--theme-success</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-success)</code></a></td>
<td>Success variant color</td>
</tr>
<tr>
<td><code>--theme-warning</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-warning)</code></a></td>
<td>Warning variant color</td>
</tr>
<tr>
<td><code>--theme-error</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-error)</code></a></td>
<td>Error variant color</td>
</tr>
<tr>
<td><code>--theme-primary</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-primary)</code></a></td>
<td>Confirm variant color</td>
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
      options: ['info', 'success', 'warning', 'error', 'confirm'],
      description: 'Alert variant',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Alert size',
    },
    hideIcon: {
      control: 'boolean',
      description: 'Hide the icon',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state on confirm button',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

// Info Alert
const InfoAlertExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Show Info Alert</Button>
      <Alert
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        variant="info"
        title="Information"
        description="This is an informational message to let you know about something important."
      />
    </>
  );
};

export const Info: Story = {
  render: () => <InfoAlertExample />,
};

// Success Alert
const SuccessAlertExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="success" onClick={() => setIsOpen(true)}>
        Show Success Alert
      </Button>
      <Alert
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        variant="success"
        title="Success!"
        description="Your changes have been saved successfully."
      />
    </>
  );
};

export const Success: Story = {
  render: () => <SuccessAlertExample />,
};

// Warning Alert
const WarningAlertExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="warning" onClick={() => setIsOpen(true)}>
        Show Warning Alert
      </Button>
      <Alert
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        variant="warning"
        title="Warning"
        description="This action may have unintended consequences. Please proceed with caution."
      />
    </>
  );
};

export const Warning: Story = {
  render: () => <WarningAlertExample />,
};

// Error Alert
const ErrorAlertExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="danger" onClick={() => setIsOpen(true)}>
        Show Error Alert
      </Button>
      <Alert
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        variant="error"
        title="Error"
        description="Something went wrong. Please try again or contact support if the problem persists."
      />
    </>
  );
};

export const Error: Story = {
  render: () => <ErrorAlertExample />,
};

// Confirmation Alert
const ConfirmAlertExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleConfirm = () => {
    setResult('Confirmed!');
    setIsOpen(false);
  };

  const handleCancel = () => {
    setResult('Cancelled');
    setIsOpen(false);
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
        <Button onClick={() => setIsOpen(true)}>Show Confirmation</Button>
        {result && <p>Result: {result}</p>}
      </div>
      <Alert
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        variant="confirm"
        title="Confirm Action"
        description="Are you sure you want to proceed with this action?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};

export const Confirmation: Story = {
  render: () => <ConfirmAlertExample />,
};

// Delete Confirmation
const DeleteConfirmExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="danger" onClick={() => setIsOpen(true)}>
        Delete Item
      </Button>
      <Alert
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        variant="confirm"
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}
      />
    </>
  );
};

export const DeleteConfirmation: Story = {
  render: () => <DeleteConfirmExample />,
};

// Loading State
const LoadingAlertExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Show with Async Action</Button>
      <Alert
        isOpen={isOpen}
        onClose={() => !loading && setIsOpen(false)}
        variant="confirm"
        title="Save Changes"
        description="Do you want to save your changes before leaving?"
        confirmText="Save"
        loading={loading}
        closeOnBackdropClick={!loading}
        closeOnEscape={!loading}
        onConfirm={handleConfirm}
        onCancel={() => setIsOpen(false)}
      />
    </>
  );
};

export const LoadingState: Story = {
  render: () => <LoadingAlertExample />,
};

// All Variants
const AllVariantsExample = () => {
  const [variant, setVariant] = useState<
    'info' | 'success' | 'warning' | 'error' | 'confirm' | null
  >(null);

  return (
    <>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button onClick={() => setVariant('info')}>Info</Button>
        <Button variant="success" onClick={() => setVariant('success')}>
          Success
        </Button>
        <Button variant="warning" onClick={() => setVariant('warning')}>
          Warning
        </Button>
        <Button variant="danger" onClick={() => setVariant('error')}>
          Error
        </Button>
        <Button variant="secondary" onClick={() => setVariant('confirm')}>
          Confirm
        </Button>
      </div>
      {variant && (
        <Alert
          isOpen
          onClose={() => setVariant(null)}
          variant={variant}
          title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Alert`}
          description={`This is a ${variant} alert example.`}
          showCancel={variant === 'confirm'}
          onConfirm={() => setVariant(null)}
          onCancel={() => setVariant(null)}
        />
      )}
    </>
  );
};

export const AllVariants: Story = {
  render: () => <AllVariantsExample />,
};

// Programmatic Alerts with useAlert
const ProgrammaticAlertContent = () => {
  const alert = useAlertContext();

  if (!alert) {
    return <p>Alert provider not found</p>;
  }

  const handleInfo = () => alert.info('Information', 'This is an info message.');
  const handleSuccess = () => alert.success('Success', 'Operation completed successfully.');
  const handleWarning = () => alert.warning('Warning', 'Please be careful.');
  const handleError = () => alert.error('Error', 'Something went wrong.');

  const handleConfirm = async () => {
    const result = await alert.confirm('Confirm Action', 'Do you want to proceed?');
    if (result) {
      alert.success('Confirmed', 'You confirmed the action.');
    }
  };

  const handleDelete = async () => {
    const result = await alert.confirm('Delete Item', 'This action cannot be undone.', {
      confirmVariant: 'danger',
      confirmText: 'Delete',
    });
    if (result) {
      alert.success('Deleted', 'Item has been deleted.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Button onClick={handleInfo}>Info Alert</Button>
      <Button variant="success" onClick={handleSuccess}>
        Success Alert
      </Button>
      <Button variant="warning" onClick={handleWarning}>
        Warning Alert
      </Button>
      <Button variant="danger" onClick={handleError}>
        Error Alert
      </Button>
      <Button variant="secondary" onClick={handleConfirm}>
        Confirm Dialog
      </Button>
      <Button variant="danger" onClick={handleDelete}>
        Delete Confirmation
      </Button>
    </div>
  );
};

const ProgrammaticAlertExample = () => {
  return (
    <AlertProvider>
      <ProgrammaticAlertContent />
    </AlertProvider>
  );
};

export const ProgrammaticAlerts: Story = {
  render: () => <ProgrammaticAlertExample />,
};

// Custom Content
const CustomContentExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Show Custom Alert</Button>
      <Alert
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        variant="info"
        title="Custom Content"
        description="You can add any custom content below:"
        onConfirm={() => setIsOpen(false)}
      >
        <div
          style={{
            marginTop: '16px',
            padding: '16px',
            background: 'var(--theme-surface)',
            borderRadius: '8px',
          }}
        >
          <p style={{ margin: 0, fontSize: '14px' }}>
            This is custom content rendered inside the alert body. You can add forms, lists, or any
            other React components here.
          </p>
        </div>
      </Alert>
    </>
  );
};

export const CustomContent: Story = {
  render: () => <CustomContentExample />,
};
