import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Rating } from './Rating';
import { useState } from 'react';

const meta: Meta<typeof Rating> = {
  title: 'Inputs/Rating',
  component: Rating,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text for the rating',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the rating is disabled',
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether the rating is read-only',
    },
    required: {
      control: 'boolean',
      description: 'Whether the rating is required',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the rating',
    },
    max: {
      control: 'number',
      description: 'Maximum number of stars',
    },
    precision: {
      control: 'number',
      description: 'Step precision for rating values',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the rating component',
    },
    // Disable complex props
    onChange: {
      table: { disable: true },
      action: 'onChange',
    },
    onBlur: {
      table: { disable: true },
      action: 'onBlur',
    },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    id: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    emptyIcon: { table: { disable: true } },
    icon: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Rating>;

export const Default: Story = {
  args: {
    label: 'Rate this product',
    defaultValue: 3,
    onChange: action('onChange'),
    onBlur: action('onBlur'),
  },
};

const ControlledComponent = () => {
  const [value, setValue] = useState(4);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Rating label="Your rating" value={value} onChange={setValue} />
      <p>Rating: {value} stars</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledComponent />,
  parameters: {
    controls: { disable: true },
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Rating size="sm" label="Small" defaultValue={3} />
      <Rating size="md" label="Medium" defaultValue={3} />
      <Rating size="lg" label="Large" defaultValue={3} />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const ReadOnly: Story = {
  args: {
    label: 'Average rating',
    value: 4.5,
    readOnly: true,
    helperText: 'Based on 128 reviews',
  },
};

export const MaxStars: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Rating label="5 stars (default)" max={5} defaultValue={3} />
      <Rating label="10 stars" max={10} defaultValue={7} />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Playground: Story = {
  args: {
    label: 'Rating',
    max: 5,
    defaultValue: 0,
    size: 'md',
    onChange: action('onChange'),
    onBlur: action('onBlur'),
  },
};
