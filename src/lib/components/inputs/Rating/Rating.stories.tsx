import type { Meta, StoryObj } from '@storybook/react';
import { Rating } from './Rating';
import { useState } from 'react';

const meta: Meta<typeof Rating> = {
  title: 'Forms/Rating',
  component: Rating,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Rating>;

export const Default: Story = {
  args: {
    label: 'Rate this product',
    defaultValue: 3,
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
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Rating size="sm" label="Small" defaultValue={3} />
      <Rating size="md" label="Medium" defaultValue={3} />
      <Rating size="lg" label="Large" defaultValue={3} />
    </div>
  ),
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
};

export const Playground: Story = {
  args: {
    label: 'Rating',
    max: 5,
    defaultValue: 0,
    size: 'md',
  },
};
