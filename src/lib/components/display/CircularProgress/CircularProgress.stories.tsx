import type { Meta, StoryObj } from '@storybook/react';
import { CircularProgress } from './CircularProgress';

const meta: Meta<typeof CircularProgress> = {
  title: 'Display/CircularProgress',
  component: CircularProgress,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    value: {
      control: { type: 'range', min: 0, max: 100 },
    },
    max: {
      control: { type: 'number', min: 1 },
    },
    showValue: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
    strokeWidth: {
      control: { type: 'range', min: 1, max: 10 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CircularProgress>;

export const Default: Story = {
  args: {
    value: 50,
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      <CircularProgress variant="primary" value={75} showValue label="Primary" />
      <CircularProgress variant="secondary" value={60} showValue label="Secondary" />
      <CircularProgress variant="success" value={100} showValue label="Success" />
      <CircularProgress variant="warning" value={45} showValue label="Warning" />
      <CircularProgress variant="danger" value={25} showValue label="Danger" />
      <CircularProgress variant="info" value={80} showValue label="Info" />
      <CircularProgress variant="neutral" value={50} showValue label="Neutral" />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <CircularProgress size="sm" value={75} showValue label="Small" />
      <CircularProgress size="md" value={75} showValue label="Medium" />
      <CircularProgress size="lg" value={75} showValue label="Large" />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const WithLabels: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      <CircularProgress value={75} label="Loading" />
      <CircularProgress variant="success" value={100} label="Done" />
      <CircularProgress variant="warning" value={45} label="Wait" />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const Playground: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    value: 50,
    showValue: true,
  },
};
