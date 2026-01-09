import type { Meta, StoryObj } from '@storybook/react';
import { NumberInput } from './NumberInput';

const meta: Meta<typeof NumberInput> = {
  title: 'Forms/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

export const Default: Story = {
  args: {
    label: 'Quantity',
    defaultValue: 1,
    min: 0,
  },
};

export const WithMinMax: Story = {
  args: {
    label: 'Age',
    defaultValue: 25,
    min: 0,
    max: 120,
  },
};

export const WithStep: Story = {
  args: {
    label: 'Amount',
    defaultValue: 0,
    step: 5,
    min: 0,
    max: 100,
  },
};

export const Currency: Story = {
  args: {
    label: 'Price',
    defaultValue: 100,
    formatDisplay: (val) => `$${val.toFixed(2)}`,
    step: 0.01,
    min: 0,
  },
};

export const Playground: Story = {
  args: {
    label: 'Number Input',
    defaultValue: 0,
  },
};
