import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { NumberInput } from './NumberInput';

const meta: Meta<typeof NumberInput> = {
  title: 'Inputs/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  argTypes: {
    // Simple controls
    label: {
      control: 'text',
      description: 'Label text for the number input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the input',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message displayed when error is true',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether the input is read-only',
    },
    required: {
      control: 'boolean',
      description: 'Whether the input is required',
    },
    error: {
      control: 'boolean',
      description: 'Whether the input is in error state',
    },
    min: {
      control: 'number',
      description: 'Minimum allowed value',
    },
    max: {
      control: 'number',
      description: 'Maximum allowed value',
    },
    step: {
      control: 'number',
      description: 'Step increment for the stepper buttons',
    },
    // Disabled complex props
    onChange: { table: { disable: true } },
    onBlur: { table: { disable: true } },
    onFocus: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    id: { table: { disable: true } },
    ref: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    formatDisplay: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

/**
 * Default number input with basic configuration
 */
export const Default: Story = {
  args: {
    label: 'Quantity',
    defaultValue: 1,
    min: 0,
    onChange: action('onChange'),
    onBlur: action('onBlur'),
    onFocus: action('onFocus'),
  },
};

/**
 * Number input with minimum and maximum values
 */
export const WithMinMax: Story = {
  render: () => (
    <NumberInput
      label="Age"
      defaultValue={25}
      min={0}
      max={120}
      onChange={action('onChange')}
      onBlur={action('onBlur')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Number input with custom step increment
 */
export const WithStep: Story = {
  render: () => (
    <NumberInput
      label="Amount"
      defaultValue={0}
      step={5}
      min={0}
      max={100}
      onChange={action('onChange')}
      onBlur={action('onBlur')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Number input with custom formatting for currency
 */
export const Currency: Story = {
  render: () => (
    <NumberInput
      label="Price"
      defaultValue={100}
      formatDisplay={(val) => `$${val.toFixed(2)}`}
      step={0.01}
      min={0}
      onChange={action('onChange')}
      onBlur={action('onBlur')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Number input with helper text
 */
export const WithHelperText: Story = {
  render: () => (
    <NumberInput
      label="Items"
      defaultValue={1}
      helperText="Enter the number of items"
      min={1}
      max={99}
      onChange={action('onChange')}
      onBlur={action('onBlur')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Number input in error state
 */
export const WithError: Story = {
  render: () => (
    <NumberInput
      label="Quantity"
      defaultValue={150}
      error
      errorMessage="Value must be between 1 and 100"
      min={1}
      max={100}
      onChange={action('onChange')}
      onBlur={action('onBlur')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Disabled number input
 */
export const Disabled: Story = {
  render: () => (
    <NumberInput
      label="Disabled Input"
      defaultValue={50}
      disabled
      onChange={action('onChange')}
      onBlur={action('onBlur')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Read-only number input
 */
export const ReadOnly: Story = {
  render: () => (
    <NumberInput
      label="Read-only Input"
      defaultValue={75}
      readOnly
      onChange={action('onChange')}
      onBlur={action('onBlur')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Required number input
 */
export const Required: Story = {
  render: () => (
    <NumberInput
      label="Required Input"
      defaultValue={0}
      required
      onChange={action('onChange')}
      onBlur={action('onBlur')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Playground for testing all props interactively
 */
export const Playground: Story = {
  args: {
    label: 'Number Input',
    defaultValue: 0,
    onChange: action('onChange'),
    onBlur: action('onBlur'),
    onFocus: action('onFocus'),
  },
};
