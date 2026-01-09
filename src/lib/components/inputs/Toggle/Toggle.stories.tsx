import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './Toggle';
import { useState } from 'react';

const meta: Meta<typeof Toggle> = {
  title: 'Forms/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger'],
      description: 'Toggle variant style',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Toggle size',
    },
    checked: {
      control: 'boolean',
      description: 'Whether the toggle is checked (controlled)',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Default checked state (uncontrolled)',
    },
    label: {
      control: 'text',
      description: 'Label text',
    },
    labelPlacement: {
      control: 'select',
      options: ['start', 'end'],
      description: 'Label placement',
    },
    helperText: {
      control: 'text',
      description: 'Helper text below toggle',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message',
    },
    error: {
      control: 'boolean',
      description: 'Error state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    readOnly: {
      control: 'boolean',
      description: 'Read-only state',
    },
    required: {
      control: 'boolean',
      description: 'Required field',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: {
    label: 'Enable notifications',
  },
};

const ControlledComponent = () => {
  const [checked, setChecked] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Toggle
        label="Enable notifications"
        checked={checked}
        onChange={(newChecked) => setChecked(newChecked)}
      />
      <p>Checked: {checked ? 'Yes' : 'No'}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledComponent />,
};

export const Uncontrolled: Story = {
  args: {
    label: 'Enable notifications',
    defaultChecked: true,
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Toggle variant="primary" label="Primary" defaultChecked />
      <Toggle variant="secondary" label="Secondary" defaultChecked />
      <Toggle variant="success" label="Success" defaultChecked />
      <Toggle variant="warning" label="Warning" defaultChecked />
      <Toggle variant="danger" label="Danger" defaultChecked />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Toggle size="sm" label="Small" defaultChecked />
      <Toggle size="md" label="Medium" defaultChecked />
      <Toggle size="lg" label="Large" defaultChecked />
    </div>
  ),
};

export const WithLabelPlacement: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Toggle label="Label at end (default)" labelPlacement="end" />
      <Toggle label="Label at start" labelPlacement="start" />
    </div>
  ),
};

export const WithHelperText: Story = {
  args: {
    label: 'Email notifications',
    helperText: 'Receive notifications about new messages',
  },
};

export const ErrorState: Story = {
  args: {
    label: 'Accept terms and conditions',
    error: true,
    errorMessage: 'You must accept the terms to continue',
  },
};

export const DisabledState: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Toggle label="Disabled (unchecked)" disabled />
      <Toggle label="Disabled (checked)" disabled defaultChecked />
    </div>
  ),
};

export const ReadOnlyState: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Toggle label="Read-only (unchecked)" readOnly />
      <Toggle label="Read-only (checked)" readOnly defaultChecked />
    </div>
  ),
};

export const RequiredField: Story = {
  args: {
    label: 'I agree to the terms and conditions',
    required: true,
    helperText: 'This field is required',
  },
};

export const WithoutLabel: Story = {
  args: {
    'aria-label': 'Toggle notifications',
  },
};

const ComprehensiveComponent = () => {
  const [states, setStates] = useState({
    simple: false,
    withHelper: true,
    required: false,
    error: false,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h3>Interactive Examples</h3>

      <Toggle
        label="Simple toggle"
        checked={states.simple}
        onChange={(checked) => setStates({ ...states, simple: checked })}
      />

      <Toggle
        label="With helper text"
        helperText="This toggle has helpful information below it"
        checked={states.withHelper}
        onChange={(checked) => setStates({ ...states, withHelper: checked })}
      />

      <Toggle
        label="Required field"
        required
        helperText="This field is required"
        checked={states.required}
        onChange={(checked) => setStates({ ...states, required: checked })}
      />

      <Toggle
        label="With error"
        error
        errorMessage="This field has an error"
        checked={states.error}
        onChange={(checked) => setStates({ ...states, error: checked })}
      />

      <h3>All Variants (Checked)</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Toggle variant="primary" label="Primary" defaultChecked />
        <Toggle variant="secondary" label="Secondary" defaultChecked />
        <Toggle variant="success" label="Success" defaultChecked />
        <Toggle variant="warning" label="Warning" defaultChecked />
        <Toggle variant="danger" label="Danger" defaultChecked />
      </div>

      <h3>All Sizes</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Toggle size="sm" label="Small" defaultChecked />
        <Toggle size="md" label="Medium" defaultChecked />
        <Toggle size="lg" label="Large" defaultChecked />
      </div>

      <h3>States</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Toggle label="Normal" />
        <Toggle label="Disabled" disabled />
        <Toggle label="Disabled (checked)" disabled defaultChecked />
        <Toggle label="Read-only" readOnly defaultChecked />
      </div>
    </div>
  );
};

export const Comprehensive: Story = {
  render: () => <ComprehensiveComponent />,
};

export const Playground: Story = {
  args: {
    label: 'Toggle label',
    variant: 'primary',
    size: 'md',
    labelPlacement: 'end',
    helperText: '',
    defaultChecked: false,
  },
};
