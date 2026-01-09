import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup } from './RadioGroup';
import { Radio } from './Radio';
import { useState } from 'react';

const meta: Meta<typeof RadioGroup> = {
  title: 'Forms/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger'],
      description: 'Radio variant style',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Radio size',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Layout orientation',
    },
    value: {
      control: 'text',
      description: 'Selected value (controlled)',
    },
    defaultValue: {
      control: 'text',
      description: 'Default selected value (uncontrolled)',
    },
    label: {
      control: 'text',
      description: 'Group label',
    },
    helperText: {
      control: 'text',
      description: 'Helper text below group',
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
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => (
    <RadioGroup label="Select size">
      <Radio value="small" label="Small" />
      <Radio value="medium" label="Medium" />
      <Radio value="large" label="Large" />
    </RadioGroup>
  ),
};

const ControlledComponent = () => {
  const [value, setValue] = useState('medium');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <RadioGroup label="Select size" value={value} onChange={setValue}>
        <Radio value="small" label="Small" />
        <Radio value="medium" label="Medium" />
        <Radio value="large" label="Large" />
      </RadioGroup>
      <p>Selected: {value}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledComponent />,
};

export const Uncontrolled: Story = {
  render: () => (
    <RadioGroup label="Select size" defaultValue="medium">
      <Radio value="small" label="Small" />
      <Radio value="medium" label="Medium" />
      <Radio value="large" label="Large" />
    </RadioGroup>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <RadioGroup label="Primary" variant="primary" defaultValue="option2">
        <Radio value="option1" label="Option 1" />
        <Radio value="option2" label="Option 2" />
        <Radio value="option3" label="Option 3" />
      </RadioGroup>

      <RadioGroup label="Secondary" variant="secondary" defaultValue="option2">
        <Radio value="option1" label="Option 1" />
        <Radio value="option2" label="Option 2" />
        <Radio value="option3" label="Option 3" />
      </RadioGroup>

      <RadioGroup label="Success" variant="success" defaultValue="option2">
        <Radio value="option1" label="Option 1" />
        <Radio value="option2" label="Option 2" />
        <Radio value="option3" label="Option 3" />
      </RadioGroup>

      <RadioGroup label="Warning" variant="warning" defaultValue="option2">
        <Radio value="option1" label="Option 1" />
        <Radio value="option2" label="Option 2" />
        <Radio value="option3" label="Option 3" />
      </RadioGroup>

      <RadioGroup label="Danger" variant="danger" defaultValue="option2">
        <Radio value="option1" label="Option 1" />
        <Radio value="option2" label="Option 2" />
        <Radio value="option3" label="Option 3" />
      </RadioGroup>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <RadioGroup label="Small" size="sm" defaultValue="option2">
        <Radio value="option1" label="Option 1" />
        <Radio value="option2" label="Option 2" />
        <Radio value="option3" label="Option 3" />
      </RadioGroup>

      <RadioGroup label="Medium" size="md" defaultValue="option2">
        <Radio value="option1" label="Option 1" />
        <Radio value="option2" label="Option 2" />
        <Radio value="option3" label="Option 3" />
      </RadioGroup>

      <RadioGroup label="Large" size="lg" defaultValue="option2">
        <Radio value="option1" label="Option 1" />
        <Radio value="option2" label="Option 2" />
        <Radio value="option3" label="Option 3" />
      </RadioGroup>
    </div>
  ),
};

export const Orientation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <RadioGroup label="Vertical (default)" orientation="vertical" defaultValue="option2">
        <Radio value="option1" label="Option 1" />
        <Radio value="option2" label="Option 2" />
        <Radio value="option3" label="Option 3" />
      </RadioGroup>

      <RadioGroup label="Horizontal" orientation="horizontal" defaultValue="option2">
        <Radio value="option1" label="Option 1" />
        <Radio value="option2" label="Option 2" />
        <Radio value="option3" label="Option 3" />
      </RadioGroup>
    </div>
  ),
};

export const WithHelperText: Story = {
  render: () => (
    <RadioGroup
      label="Shipping method"
      helperText="Select your preferred shipping method"
      defaultValue="standard"
    >
      <Radio value="express" label="Express (1-2 days)" helperText="$15.00" />
      <Radio value="standard" label="Standard (5-7 days)" helperText="$5.00" />
      <Radio value="economy" label="Economy (10-14 days)" helperText="Free" />
    </RadioGroup>
  ),
};

export const ErrorState: Story = {
  render: () => (
    <RadioGroup
      label="Select payment method"
      error
      errorMessage="Please select a payment method"
      required
    >
      <Radio value="credit" label="Credit Card" />
      <Radio value="debit" label="Debit Card" />
      <Radio value="paypal" label="PayPal" />
    </RadioGroup>
  ),
};

export const DisabledState: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <RadioGroup label="Entire group disabled" disabled defaultValue="option2">
        <Radio value="option1" label="Option 1" />
        <Radio value="option2" label="Option 2" />
        <Radio value="option3" label="Option 3" />
      </RadioGroup>

      <RadioGroup label="Individual options disabled" defaultValue="option2">
        <Radio value="option1" label="Option 1" />
        <Radio value="option2" label="Option 2 (selected)" />
        <Radio value="option3" label="Option 3 (disabled)" disabled />
      </RadioGroup>
    </div>
  ),
};

export const ReadOnlyState: Story = {
  render: () => (
    <RadioGroup label="Read-only group" readOnly defaultValue="option2">
      <Radio value="option1" label="Option 1" />
      <Radio value="option2" label="Option 2" />
      <Radio value="option3" label="Option 3" />
    </RadioGroup>
  ),
};

export const RequiredField: Story = {
  render: () => (
    <RadioGroup
      label="Select your plan"
      required
      helperText="This field is required"
      defaultValue="basic"
    >
      <Radio value="basic" label="Basic" helperText="Free forever" />
      <Radio value="pro" label="Pro" helperText="$10/month" />
      <Radio value="enterprise" label="Enterprise" helperText="Contact sales" />
    </RadioGroup>
  ),
};

export const LabelPlacement: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <RadioGroup label="Labels at end (default)" defaultValue="option2">
        <Radio value="option1" label="Option 1" labelPlacement="end" />
        <Radio value="option2" label="Option 2" labelPlacement="end" />
      </RadioGroup>

      <RadioGroup label="Labels at start" defaultValue="option2">
        <Radio value="option1" label="Option 1" labelPlacement="start" />
        <Radio value="option2" label="Option 2" labelPlacement="start" />
      </RadioGroup>
    </div>
  ),
};

const ComplexExampleComponent = () => {
  const [plan, setPlan] = useState('pro');

  const plans = [
    {
      value: 'free',
      label: 'Free',
      price: '$0',
      features: 'Basic features, 1 user',
    },
    {
      value: 'pro',
      label: 'Pro',
      price: '$10/month',
      features: 'Advanced features, up to 5 users',
    },
    {
      value: 'enterprise',
      label: 'Enterprise',
      price: 'Custom pricing',
      features: 'All features, unlimited users',
    },
  ];

  return (
    <div>
      <RadioGroup
        label="Choose your plan"
        value={plan}
        onChange={setPlan}
        helperText="You can change your plan at any time"
      >
        {plans.map((item) => (
          <Radio
            key={item.value}
            value={item.value}
            label={`${item.label} - ${item.price}`}
            helperText={item.features}
          />
        ))}
      </RadioGroup>
      <div style={{ marginTop: '1.5rem' }}>
        <strong>Selected plan:</strong> {plans.find((p) => p.value === plan)?.label}
      </div>
    </div>
  );
};

export const ComplexExample: Story = {
  render: () => <ComplexExampleComponent />,
};

export const Playground: Story = {
  args: {
    label: 'Select an option',
    variant: 'primary',
    size: 'md',
    orientation: 'vertical',
    helperText: '',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="option1" label="Option 1" />
      <Radio value="option2" label="Option 2" />
      <Radio value="option3" label="Option 3" />
    </RadioGroup>
  ),
};

