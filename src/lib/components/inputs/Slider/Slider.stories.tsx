import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Slider } from './Slider';
import { useState } from 'react';

const meta: Meta<typeof Slider> = {
  title: 'Inputs/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    // Simple controls
    label: {
      control: 'text',
      description: 'Label text displayed above the slider',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the slider',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message displayed when error is true',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the slider is disabled',
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether the slider is read-only',
    },
    required: {
      control: 'boolean',
      description: 'Whether the slider is required',
    },
    error: {
      control: 'boolean',
      description: 'Whether the slider is in error state',
    },
    min: {
      control: 'number',
      description: 'Minimum value of the slider',
    },
    max: {
      control: 'number',
      description: 'Maximum value of the slider',
    },
    step: {
      control: 'number',
      description: 'Step increment for the slider',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the slider',
    },
    showValue: {
      control: 'boolean',
      description: 'Whether to show the value label',
    },
    valueLabelDisplay: {
      control: 'select',
      options: ['on', 'auto', 'off'],
      description: 'When to display the value label',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger'],
      description: 'Slider variant style',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Slider size',
    },
    // Disable complex props
    marks: { table: { disable: true } },
    valueLabelFormat: { table: { disable: true } },
    onChange: { table: { disable: true } },
    onChangeCommitted: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    id: { table: { disable: true } },
    ref: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

/**
 * Default slider with primary variant
 */
export const Default: Story = {
  args: {
    label: 'Volume',
    defaultValue: 50,
    onChange: action('onChange'),
    onChangeCommitted: action('onChangeCommitted'),
  },
};

/**
 * Controlled slider example
 */
const ControlledComponent = () => {
  const [value, setValue] = useState(30);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Slider
        label="Volume"
        value={value}
        onChange={(val) => {
          setValue(val as number);
          action('onChange')(val);
        }}
        onChangeCommitted={action('onChangeCommitted')}
        showValue
      />
      <p>Current value: {value}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledComponent />,
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Slider with automatic marks
 */
export const WithMarks: Story = {
  render: () => (
    <Slider
      label="Temperature"
      min={0}
      max={100}
      step={25}
      marks={true}
      defaultValue={50}
      onChange={action('onChange')}
      onChangeCommitted={action('onChangeCommitted')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Slider with custom marks and value formatting
 */
export const WithCustomMarks: Story = {
  render: () => (
    <Slider
      label="Size"
      min={0}
      max={100}
      step={25}
      marks={[
        { value: 0, label: 'XS' },
        { value: 25, label: 'S' },
        { value: 50, label: 'M' },
        { value: 75, label: 'L' },
        { value: 100, label: 'XL' },
      ]}
      defaultValue={50}
      valueLabelDisplay="auto"
      valueLabelFormat={(value) => {
        const sizeMap: Record<number, string> = {
          0: 'XS',
          25: 'S',
          50: 'M',
          75: 'L',
          100: 'XL',
        };
        return sizeMap[value] || String(value);
      }}
      onChange={action('onChange')}
      onChangeCommitted={action('onChangeCommitted')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Range slider with two thumbs
 */
const RangeSliderComponent = () => {
  const [value, setValue] = useState([20, 80]);
  return (
    <Slider
      label="Price Range"
      value={value}
      onChange={(val) => {
        setValue(val as number[]);
        action('onChange')(val);
      }}
      onChangeCommitted={action('onChangeCommitted')}
      min={0}
      max={100}
      valueLabelDisplay="on"
      valueLabelFormat={(val) => `$${val}`}
    />
  );
};

export const RangeSlider: Story = {
  render: () => <RangeSliderComponent />,
  parameters: {
    controls: { disable: true },
  },
};

/**
 * All slider sizes
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <Slider
        size="sm"
        label="Small"
        defaultValue={30}
        onChange={action('onChange')}
        onChangeCommitted={action('onChangeCommitted')}
      />
      <Slider
        size="md"
        label="Medium"
        defaultValue={50}
        onChange={action('onChange')}
        onChangeCommitted={action('onChangeCommitted')}
      />
      <Slider
        size="lg"
        label="Large"
        defaultValue={70}
        onChange={action('onChange')}
        onChangeCommitted={action('onChangeCommitted')}
      />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * All slider variants
 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <Slider
        variant="primary"
        label="Primary"
        defaultValue={50}
        onChange={action('onChange')}
        onChangeCommitted={action('onChangeCommitted')}
      />
      <Slider
        variant="secondary"
        label="Secondary"
        defaultValue={50}
        onChange={action('onChange')}
        onChangeCommitted={action('onChangeCommitted')}
      />
      <Slider
        variant="success"
        label="Success"
        defaultValue={50}
        onChange={action('onChange')}
        onChangeCommitted={action('onChangeCommitted')}
      />
      <Slider
        variant="warning"
        label="Warning"
        defaultValue={50}
        onChange={action('onChange')}
        onChangeCommitted={action('onChangeCommitted')}
      />
      <Slider
        variant="danger"
        label="Danger"
        defaultValue={50}
        onChange={action('onChange')}
        onChangeCommitted={action('onChangeCommitted')}
      />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Vertical orientation slider
 */
export const Vertical: Story = {
  render: () => (
    <Slider
      label="Volume"
      orientation="vertical"
      defaultValue={50}
      valueLabelDisplay="auto"
      onChange={action('onChange')}
      onChangeCommitted={action('onChangeCommitted')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Interactive playground for testing all props
 */
export const Playground: Story = {
  args: {
    label: 'Slider',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
    variant: 'primary',
    size: 'md',
    onChange: action('onChange'),
    onChangeCommitted: action('onChangeCommitted'),
  },
};
