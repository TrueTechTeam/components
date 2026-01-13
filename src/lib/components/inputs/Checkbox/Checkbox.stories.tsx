import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Checkbox } from './Checkbox';
import { useState } from 'react';

const meta: Meta<typeof Checkbox> = {
  title: 'Inputs/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    // Simple controls
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
    indeterminate: {
      control: 'boolean',
      description: 'Indeterminate state',
    },
    // Disable complex props
    checked: { table: { disable: true } },
    defaultChecked: { table: { disable: true } },
    onChange: { table: { disable: true } },
    checkIcon: { table: { disable: true } },
    indeterminateIcon: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    id: { table: { disable: true } },
    name: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
    'aria-label': { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
    onChange: action('onChange'),
  },
};

const ControlledComponent = () => {
  const [checked, setChecked] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Checkbox
        label="Accept terms and conditions"
        checked={checked}
        onChange={(newChecked) => {
          action('onChange')(newChecked);
          setChecked(newChecked);
        }}
      />
      <p>Checked: {checked ? 'Yes' : 'No'}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledComponent />,
  parameters: { controls: { disable: true } },
};

export const Uncontrolled: Story = {
  args: {
    label: 'Subscribe to newsletter',
    defaultChecked: true,
    onChange: action('onChange'),
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
  parameters: { controls: { disable: true } },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Checkbox size="sm" label="Small" defaultChecked />
      <Checkbox size="md" label="Medium" defaultChecked />
      <Checkbox size="lg" label="Large" defaultChecked />
    </div>
  ),
  parameters: { controls: { disable: true } },
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
  parameters: { controls: { disable: true } },
};

export const WithLabelPlacement: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Checkbox label="Label at end (default)" labelPlacement="end" />
      <Checkbox label="Label at start" labelPlacement="start" />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const WithHelperText: Story = {
  args: {
    label: 'Send me promotional emails',
    helperText: 'You can unsubscribe at any time',
    onChange: action('onChange'),
  },
};

export const ErrorState: Story = {
  args: {
    label: 'I agree to the terms',
    error: true,
    errorMessage: 'You must accept the terms to continue',
    onChange: action('onChange'),
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
  parameters: { controls: { disable: true } },
};

export const ReadOnlyState: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Checkbox label="Read-only (unchecked)" readOnly />
      <Checkbox label="Read-only (checked)" readOnly defaultChecked />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const RequiredField: Story = {
  args: {
    label: 'I agree to the terms and conditions',
    required: true,
    helperText: 'This field is required',
    onChange: action('onChange'),
  },
};

export const WithoutLabel: Story = {
  args: {
    'aria-label': 'Accept terms',
    onChange: action('onChange'),
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
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <h4>Select your favorite languages:</h4>
      {options.map((option) => (
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
  parameters: { controls: { disable: true } },
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
  parameters: { controls: { disable: true } },
};

export const Playground: Story = {
  args: {
    label: 'Checkbox label',
    variant: 'primary',
    size: 'md',
    labelPlacement: 'end',
    helperText: '',
    defaultChecked: false,
    onChange: action('onChange'),
  },
};
