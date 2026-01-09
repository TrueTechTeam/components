import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';
import { useState } from 'react';

const meta: Meta<typeof Checkbox> = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger'],
      description: 'Checkbox variant style',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Checkbox size',
    },
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked (controlled)',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Default checked state (uncontrolled)',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Indeterminate state',
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
      description: 'Helper text below checkbox',
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
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
  },
};

const ControlledComponent = () => {
  const [checked, setChecked] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Checkbox
        label="Accept terms and conditions"
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
    label: 'Subscribe to newsletter',
    defaultChecked: true,
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Checkbox variant="primary" label="Primary" defaultChecked />
      <Checkbox variant="secondary" label="Secondary" defaultChecked />
      <Checkbox variant="success" label="Success" defaultChecked />
      <Checkbox variant="warning" label="Warning" defaultChecked />
      <Checkbox variant="danger" label="Danger" defaultChecked />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Checkbox size="sm" label="Small" defaultChecked />
      <Checkbox size="md" label="Medium" defaultChecked />
      <Checkbox size="lg" label="Large" defaultChecked />
    </div>
  ),
};

const IndeterminateStateComponent = () => {
  const [checkedItems, setCheckedItems] = useState([true, false, true]);

  const allChecked = checkedItems.every(Boolean);
  const someChecked = checkedItems.some(Boolean) && !allChecked;

  const handleParentChange = (checked: boolean) => {
    setCheckedItems([checked, checked, checked]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Checkbox
        label="Select all"
        checked={allChecked}
        indeterminate={someChecked}
        onChange={handleParentChange}
      />
      <div style={{ paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Checkbox
          label="Option 1"
          checked={checkedItems[0]}
          onChange={(checked) => setCheckedItems([checked, checkedItems[1], checkedItems[2]])}
        />
        <Checkbox
          label="Option 2"
          checked={checkedItems[1]}
          onChange={(checked) => setCheckedItems([checkedItems[0], checked, checkedItems[2]])}
        />
        <Checkbox
          label="Option 3"
          checked={checkedItems[2]}
          onChange={(checked) => setCheckedItems([checkedItems[0], checkedItems[1], checked])}
        />
      </div>
    </div>
  );
};

export const IndeterminateState: Story = {
  render: () => <IndeterminateStateComponent />,
};

export const WithLabelPlacement: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Checkbox label="Label at end (default)" labelPlacement="end" />
      <Checkbox label="Label at start" labelPlacement="start" />
    </div>
  ),
};

export const WithHelperText: Story = {
  args: {
    label: 'Send me promotional emails',
    helperText: 'You can unsubscribe at any time',
  },
};

export const ErrorState: Story = {
  args: {
    label: 'I agree to the terms',
    error: true,
    errorMessage: 'You must accept the terms to continue',
  },
};

export const DisabledState: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Checkbox label="Disabled (unchecked)" disabled />
      <Checkbox label="Disabled (checked)" disabled defaultChecked />
      <Checkbox label="Disabled (indeterminate)" disabled indeterminate />
    </div>
  ),
};

export const ReadOnlyState: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Checkbox label="Read-only (unchecked)" readOnly />
      <Checkbox label="Read-only (checked)" readOnly defaultChecked />
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
    'aria-label': 'Accept terms',
  },
};

const CheckboxListComponent = () => {
  const [selected, setSelected] = useState<string[]>(['javascript']);

  const options = [
    { id: 'javascript', label: 'JavaScript' },
    { id: 'typescript', label: 'TypeScript' },
    { id: 'python', label: 'Python' },
    { id: 'rust', label: 'Rust' },
    { id: 'go', label: 'Go' },
  ];

  const toggleOption = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <h4>Select your favorite languages:</h4>
      {options.map(option => (
        <Checkbox
          key={option.id}
          label={option.label}
          checked={selected.includes(option.id)}
          onChange={() => toggleOption(option.id)}
        />
      ))}
      <p style={{ marginTop: '1rem' }}>
        Selected: {selected.length > 0 ? selected.join(', ') : 'none'}
      </p>
    </div>
  );
};

export const CheckboxList: Story = {
  render: () => <CheckboxListComponent />,
};

export const Comprehensive: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3>States</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <Checkbox label="Unchecked" />
          <Checkbox label="Checked" defaultChecked />
          <Checkbox label="Indeterminate" indeterminate />
          <Checkbox label="Disabled" disabled />
          <Checkbox label="Disabled (checked)" disabled defaultChecked />
          <Checkbox label="Read-only" readOnly defaultChecked />
          <Checkbox label="Error" error errorMessage="This field is required" />
        </div>
      </div>

      <div>
        <h3>Variants (Checked)</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <Checkbox variant="primary" label="Primary" defaultChecked />
          <Checkbox variant="secondary" label="Secondary" defaultChecked />
          <Checkbox variant="success" label="Success" defaultChecked />
          <Checkbox variant="warning" label="Warning" defaultChecked />
          <Checkbox variant="danger" label="Danger" defaultChecked />
        </div>
      </div>

      <div>
        <h3>Sizes</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <Checkbox size="sm" label="Small" defaultChecked />
          <Checkbox size="md" label="Medium" defaultChecked />
          <Checkbox size="lg" label="Large" defaultChecked />
        </div>
      </div>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    label: 'Checkbox label',
    variant: 'primary',
    size: 'md',
    labelPlacement: 'end',
    helperText: '',
    defaultChecked: false,
  },
};
