import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Toggle } from './Toggle';
import { useState } from 'react';

const meta: Meta<typeof Toggle> = {
  title: 'Inputs/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    // Simple controls
    label: {
      control: 'text',
      description: 'Label text to display next to toggle',
    },
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
    labelPlacement: {
      control: 'select',
      options: ['start', 'end'],
      description: 'Label placement relative to toggle',
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display below the toggle',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display when toggle is in error state',
    },
    error: {
      control: 'boolean',
      description: 'Whether the toggle is in an error state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the toggle is disabled',
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether the toggle is read-only',
    },
    required: {
      control: 'boolean',
      description: 'Whether the toggle is required',
    },
    // Disable complex props
    onChange: { table: { disable: true } },
    onBlur: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    id: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
    'aria-label': { table: { disable: true } },
    'aria-describedby': { table: { disable: true } },
    'aria-invalid': { table: { disable: true } },
    'aria-required': { table: { disable: true } },
    ref: { table: { disable: true } },
    checked: { table: { disable: true } },
    defaultChecked: { table: { disable: true } },
    name: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: {
    label: 'Enable notifications',
    onChange: action('onChange'),
    onBlur: action('onBlur'),
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
  parameters: {
    controls: { disable: true },
  },
};

export const Uncontrolled: Story = {
  args: {
    label: 'Enable notifications',
    defaultChecked: true,
  },
  parameters: {
    controls: { disable: true },
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
  parameters: {
    controls: { disable: true },
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Toggle size="sm" label="Small" defaultChecked />
      <Toggle size="md" label="Medium" defaultChecked />
      <Toggle size="lg" label="Large" defaultChecked />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const WithLabelPlacement: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Toggle label="Label at end (default)" labelPlacement="end" />
      <Toggle label="Label at start" labelPlacement="start" />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Email notifications',
    helperText: 'Receive notifications about new messages',
  },
  parameters: {
    controls: { disable: true },
  },
};

export const ErrorState: Story = {
  args: {
    label: 'Accept terms and conditions',
    error: true,
    errorMessage: 'You must accept the terms to continue',
  },
  parameters: {
    controls: { disable: true },
  },
};

export const DisabledState: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Toggle label="Disabled (unchecked)" disabled />
      <Toggle label="Disabled (checked)" disabled defaultChecked />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const ReadOnlyState: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Toggle label="Read-only (unchecked)" readOnly />
      <Toggle label="Read-only (checked)" readOnly defaultChecked />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const RequiredField: Story = {
  args: {
    label: 'I agree to the terms and conditions',
    required: true,
    helperText: 'This field is required',
  },
  parameters: {
    controls: { disable: true },
  },
};

export const WithoutLabel: Story = {
  args: {
    'aria-label': 'Toggle notifications',
  },
  parameters: {
    controls: { disable: true },
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
  parameters: {
    controls: { disable: true },
  },
};

export const Playground: Story = {
  args: {
    label: 'Toggle label',
    variant: 'primary',
    size: 'md',
    labelPlacement: 'end',
    helperText: '',
    defaultChecked: false,
    onChange: action('onChange'),
    onBlur: action('onBlur'),
  },
};
