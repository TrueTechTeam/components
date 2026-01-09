import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './Slider';
import { useState } from 'react';

const meta: Meta<typeof Slider> = {
  title: 'Forms/Slider',
  component: Slider,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {
    label: 'Volume',
    defaultValue: 50,
  },
};

const ControlledComponent = () => {
  const [value, setValue] = useState(30);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Slider label="Volume" value={value} onChange={setValue} showValue />
      <p>Current value: {value}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledComponent />,
};

export const WithMarks: Story = {
  args: {
    label: 'Temperature',
    min: 0,
    max: 100,
    step: 25,
    marks: true,
    defaultValue: 50,
  },
};

export const WithCustomMarks: Story = {
  args: {
    label: 'Size',
    min: 0,
    max: 100,
    step: 25,
    marks: [
      { value: 0, label: 'XS' },
      { value: 25, label: 'S' },
      { value: 50, label: 'M' },
      { value: 75, label: 'L' },
      { value: 100, label: 'XL' },
    ],
    defaultValue: 50,
    valueLabelDisplay: 'auto',
    valueLabelFormat: (value) => {
      const sizeMap: Record<number, string> = {
        0: 'XS',
        25: 'S',
        50: 'M',
        75: 'L',
        100: 'XL',
      };
      return sizeMap[value] || String(value);
    },
  },
};

const RangeSliderComponent = () => {
  const [value, setValue] = useState([20, 80]);
  return (
    <Slider
      label="Price Range"
      value={value}
      onChange={(value) => setValue(value as number[])}
      min={0}
      max={100}
      valueLabelDisplay="on"
      valueLabelFormat={(val) => `$${val}`}
    />
  );
};

export const RangeSlider: Story = {
  render: () => <RangeSliderComponent />,
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <Slider size="sm" label="Small" defaultValue={30} />
      <Slider size="md" label="Medium" defaultValue={50} />
      <Slider size="lg" label="Large" defaultValue={70} />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <Slider variant="primary" label="Primary" defaultValue={50} />
      <Slider variant="secondary" label="Secondary" defaultValue={50} />
      <Slider variant="success" label="Success" defaultValue={50} />
      <Slider variant="warning" label="Warning" defaultValue={50} />
      <Slider variant="danger" label="Danger" defaultValue={50} />
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    label: 'Volume',
    orientation: 'vertical',
    defaultValue: 50,
    valueLabelDisplay: 'auto',
  },
};

export const Playground: Story = {
  args: {
    label: 'Slider',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
    variant: 'primary',
    size: 'md',
  },
};

