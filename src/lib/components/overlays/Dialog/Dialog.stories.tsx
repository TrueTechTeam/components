import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dialog } from './Dialog';
import { DialogProvider } from './DialogProvider';
import { useDialogContext } from './DialogContext';
import { Button } from '../../buttons/Button';
import { Input } from '../../inputs/Input';

const meta: Meta<typeof Dialog> = {
  title: 'Overlays/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Dialog component displays content in a modal overlay with customizable sizes and styling.

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
<td><code>--dialog-backdrop-opacity</code></td>
<td>0.5</td>
<td>Backdrop overlay opacity</td>
</tr>
<tr>
<td><code>--dialog-backdrop-blur</code></td>
<td>4px</td>
<td>Backdrop blur effect</td>
</tr>
<tr>
<td><code>--dialog-animation-duration</code></td>
<td>200ms</td>
<td>Animation duration for open/close</td>
</tr>
<tr>
<td><code>--dialog-animation-easing</code></td>
<td>cubic-bezier(0.16, 1, 0.3, 1)</td>
<td>Animation easing function</td>
</tr>
<tr>
<td><code>--z-modal-backdrop</code></td>
<td>1300</td>
<td>Backdrop z-index layer</td>
</tr>
<tr>
<td><code>--theme-surface-elevated</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-surface-elevated)</code></a></td>
<td>Dialog background color</td>
</tr>
<tr>
<td><code>--theme-shadow-xl</code></td>
<td><a href="?path=/story/theme-css-variables--shadows"><code>var(--theme-shadow-xl)</code></a></td>
<td>Dialog box shadow</td>
</tr>
<tr>
<td><code>--theme-border-primary</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-border-primary)</code></a></td>
<td>Dialog border color</td>
</tr>
<tr>
<td><code>--radius-lg</code></td>
<td><a href="?path=/story/theme-css-variables--borders"><code>var(--radius-lg)</code></a></td>
<td>Dialog border radius</td>
</tr>
<tr>
<td><code>--spacing-lg</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-lg)</code></a></td>
<td>Dialog padding</td>
</tr>
<tr>
<td><code>--spacing-md</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-md)</code></a></td>
<td>Header/footer padding adjustments</td>
</tr>
<tr>
<td><code>--theme-text-primary</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-text-primary)</code></a></td>
<td>Title text color</td>
</tr>
<tr>
<td><code>--theme-text-secondary</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-text-secondary)</code></a></td>
<td>Body text color</td>
</tr>
<tr>
<td><code>--z-modal</code></td>
<td>1400</td>
<td>Dialog content z-index layer</td>
</tr>
</tbody>
</table>
`,
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'full'],
      description: 'Dialog size preset',
    },
    closeOnBackdropClick: {
      control: 'boolean',
      description: 'Close when clicking the backdrop',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Close when pressing Escape key',
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Show close button in header',
    },
    blurBackdrop: {
      control: 'boolean',
      description: 'Apply blur effect to backdrop',
    },
    backdropOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Backdrop opacity',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

// Basic Dialog
const BasicDialogExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Dialog</Button>
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Dialog Title"
        actions={
          <>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>Confirm</Button>
          </>
        }
      >
        <p>This is the dialog content. You can put any content here.</p>
      </Dialog>
    </>
  );
};

export const Basic: Story = {
  render: () => <BasicDialogExample />,
};

// Sizes
const SizesExample = () => {
  const [size, setSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | null>(null);

  return (
    <>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {(['xs', 'sm', 'md', 'lg', 'xl', 'full'] as const).map((s) => (
          <Button key={s} onClick={() => setSize(s)}>
            {s.toUpperCase()}
          </Button>
        ))}
      </div>
      {size && (
        <Dialog
          isOpen
          onClose={() => setSize(null)}
          title={`Size: ${size}`}
          size={size}
          actions={<Button onClick={() => setSize(null)}>Close</Button>}
        >
          <p>This dialog is using the {size} size preset.</p>
        </Dialog>
      )}
    </>
  );
};

export const Sizes: Story = {
  render: () => <SizesExample />,
};

// Form Dialog
const FormDialogExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Form Dialog</Button>
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create New User"
        size="md"
        actions={
          <>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>Create User</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input label="Full Name" placeholder="Enter full name" />
          <Input label="Email" type="email" placeholder="Enter email address" />
          <Input label="Password" type="password" placeholder="Enter password" />
        </div>
      </Dialog>
    </>
  );
};

export const FormDialog: Story = {
  render: () => <FormDialogExample />,
};

// Custom Header and Footer
const CustomLayoutExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Custom Dialog</Button>
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        showCloseButton={false}
        renderHeader={({ onClose }) => (
          <div
            style={{
              padding: '24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textAlign: 'center',
            }}
          >
            <h2 style={{ margin: 0 }}>Custom Header</h2>
            <p style={{ margin: '8px 0 0', opacity: 0.9 }}>With custom styling</p>
          </div>
        )}
        renderFooter={({ onClose }) => (
          <div
            style={{
              padding: '16px 24px',
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
            }}
          >
            <Button variant="outline" onClick={onClose}>
              Maybe Later
            </Button>
            <Button onClick={onClose}>Get Started</Button>
          </div>
        )}
      >
        <p style={{ textAlign: 'center', padding: '0 24px' }}>
          You can completely customize the header and footer using render props.
        </p>
      </Dialog>
    </>
  );
};

export const CustomLayout: Story = {
  render: () => <CustomLayoutExample />,
};

// Backdrop Options
const BackdropOptionsExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open with Blur Backdrop</Button>
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Blur Backdrop"
        blurBackdrop
        backdropOpacity={0.3}
        actions={<Button onClick={() => setIsOpen(false)}>Close</Button>}
      >
        <p>This dialog has a blurred backdrop with reduced opacity.</p>
      </Dialog>
    </>
  );
};

export const BackdropOptions: Story = {
  render: () => <BackdropOptionsExample />,
};

// Nested Dialogs
const NestedDialogsExample = () => {
  const [firstOpen, setFirstOpen] = useState(false);
  const [secondOpen, setSecondOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setFirstOpen(true)}>Open First Dialog</Button>
      <Dialog
        isOpen={firstOpen}
        onClose={() => setFirstOpen(false)}
        title="First Dialog"
        actions={
          <>
            <Button variant="ghost" onClick={() => setFirstOpen(false)}>
              Close
            </Button>
            <Button onClick={() => setSecondOpen(true)}>Open Second Dialog</Button>
          </>
        }
      >
        <p>This is the first dialog. Click the button to open a nested dialog.</p>
      </Dialog>
      <Dialog
        isOpen={secondOpen}
        onClose={() => setSecondOpen(false)}
        title="Second Dialog (Nested)"
        size="sm"
        actions={<Button onClick={() => setSecondOpen(false)}>Close</Button>}
      >
        <p>This is a nested dialog. Note that it appears on top with a higher z-index.</p>
      </Dialog>
    </>
  );
};

export const NestedDialogs: Story = {
  render: () => <NestedDialogsExample />,
};

// Programmatic Dialog with Provider
const ProgrammaticDialogContent = () => {
  const dialog = useDialogContext();

  const handleOpenDialog = async () => {
    if (!dialog) {
      return;
    }

    const result = await dialog.openDialog<boolean>({
      title: 'Confirm Action',
      children: <p>Are you sure you want to proceed with this action?</p>,
      actions: (
        <>
          <Button variant="ghost" onClick={() => dialog.closeTopDialog(false)}>
            Cancel
          </Button>
          <Button onClick={() => dialog.closeTopDialog(true)}>Confirm</Button>
        </>
      ),
    });

    if (result) {
      alert('You confirmed!');
    } else {
      alert('You cancelled!');
    }
  };

  return <Button onClick={handleOpenDialog}>Open Programmatic Dialog</Button>;
};

const ProgrammaticDialogExample = () => {
  return (
    <DialogProvider>
      <ProgrammaticDialogContent />
    </DialogProvider>
  );
};

export const ProgrammaticDialog: Story = {
  render: () => <ProgrammaticDialogExample />,
};

// Alert Dialog Role
const AlertDialogExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="danger" onClick={() => setIsOpen(true)}>
        Delete Item
      </Button>
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Delete Item"
        role="alertdialog"
        closeOnBackdropClick={false}
        size="sm"
        actions={
          <>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setIsOpen(false)}>
              Delete
            </Button>
          </>
        }
      >
        <p>Are you sure you want to delete this item? This action cannot be undone.</p>
      </Dialog>
    </>
  );
};

export const AlertDialog: Story = {
  render: () => <AlertDialogExample />,
};

// Scrollable Content
const ScrollableContentExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Scrollable Dialog</Button>
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Terms and Conditions"
        maxHeight="400px"
        actions={
          <>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Decline
            </Button>
            <Button onClick={() => setIsOpen(false)}>Accept</Button>
          </>
        }
      >
        <div>
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris.
            </p>
          ))}
        </div>
      </Dialog>
    </>
  );
};

export const ScrollableContent: Story = {
  render: () => <ScrollableContentExample />,
};
