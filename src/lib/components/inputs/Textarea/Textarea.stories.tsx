import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';
import { useState } from 'react';

const meta: Meta<typeof Textarea> = {
  title: 'Forms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ minWidth: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter your description...',
  },
};

export const WithCharacterCounter: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself...',
    maxLength: 200,
    showCounter: true,
  },
};

const AutoResizeComponent = () => {
  const [value, setValue] = useState('');
  return (
    <Textarea
      label="Auto-resizing textarea"
      placeholder="Type to see auto-resize..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      autoResize
      minRows={3}
      maxRows={10}
    />
  );
};

export const AutoResize: Story = {
  render: () => <AutoResizeComponent />,
};

export const WithHelperText: Story = {
  args: {
    label: 'Feedback',
    helperText: 'Please provide detailed feedback',
    placeholder: 'Your feedback...',
  },
};

export const ErrorState: Story = {
  args: {
    label: 'Comments',
    error: true,
    errorMessage: 'This field is required',
  },
};

export const DisabledAndReadOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Textarea label="Disabled" disabled defaultValue="This is disabled" />
      <Textarea label="Read-only" readOnly defaultValue="This is read-only" />
    </div>
  ),
};

export const ResizeControl: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Textarea label="Resize: None" resize="none" placeholder="Cannot be resized" />
      <Textarea label="Resize: Vertical" resize="vertical" placeholder="Can resize vertically" />
      <Textarea label="Resize: Horizontal" resize="horizontal" placeholder="Can resize horizontally" />
      <Textarea label="Resize: Both" resize="both" placeholder="Can resize in both directions" />
    </div>
  ),
};

export const Playground: Story = {
  args: {
    label: 'Textarea',
    placeholder: 'Enter text...',
    rows: 4,
  },
};
