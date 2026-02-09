import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { Textarea } from './Textarea';
import { useState } from 'react';

const meta: Meta<typeof Textarea> = {
  title: 'Inputs/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Textarea component for multi-line text input with auto-resize, character counting, and validation support.

## CSS Variables

<table>
<thead>
<tr>
<th>Variable</th>
<th>Default</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>--textarea-bg</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-background-primary)</code></a></td>
<td>Background color of textarea</td>
</tr>
<tr>
<td><code>--textarea-border</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-neutral-400)</code></a></td>
<td>Border color of textarea</td>
</tr>
<tr>
<td><code>--textarea-text</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-primary)</code></a></td>
<td>Text color</td>
</tr>
<tr>
<td><code>--textarea-placeholder</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-tertiary)</code></a></td>
<td>Placeholder text color</td>
</tr>
<tr>
<td><code>--textarea-focus-border</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-primary-500)</code></a></td>
<td>Border color when focused</td>
</tr>
<tr>
<td><code>--textarea-focus-ring</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-primary-200)</code></a></td>
<td>Focus ring color</td>
</tr>
<tr>
<td><code>--textarea-padding</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-sm)</code></a></td>
<td>Padding inside textarea</td>
</tr>
<tr>
<td><code>--textarea-font-size</code></td>
<td><a href="?path=/story/theme-css-variables--typography"><code>var(--font-size-base)</code></a></td>
<td>Font size of text</td>
</tr>
<tr>
<td><code>--textarea-line-height</code></td>
<td><code>1.5</code></td>
<td>Line height</td>
</tr>
<tr>
<td><code>--textarea-transition</code></td>
<td><code>all 0.15s ease-in-out</code></td>
<td>Transition timing</td>
</tr>
</tbody>
</table>
`,
      },
    },
  },
  argTypes: {
    // Simple controls
    label: {
      control: 'text',
      description: 'Label text to display above textarea',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display below textarea',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display when in error state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the textarea is disabled',
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether the textarea is read-only',
    },
    required: {
      control: 'boolean',
      description: 'Whether the textarea is required',
    },
    error: {
      control: 'boolean',
      description: 'Whether the textarea is in an error state',
    },
    rows: {
      control: 'number',
      description: 'Number of visible text rows',
    },
    cols: {
      control: 'number',
      description: 'Number of visible text columns',
    },
    maxLength: {
      control: 'number',
      description: 'Maximum character length',
    },
    resize: {
      control: 'select',
      options: ['none', 'both', 'horizontal', 'vertical'],
      description: 'Control resize behavior',
    },
    autoResize: {
      control: 'boolean',
      description: 'Auto-resize textarea based on content',
    },
    showCounter: {
      control: 'boolean',
      description: 'Show character counter',
    },
    minRows: {
      control: 'number',
      description: 'Minimum number of rows (for auto-resize)',
    },
    maxRows: {
      control: 'number',
      description: 'Maximum number of rows (for auto-resize)',
    },
    validateOn: {
      control: 'select',
      options: ['blur', 'change'],
      description: 'When to perform validation',
    },
    // Disable complex props
    onChange: { table: { disable: true } },
    onBlur: { table: { disable: true } },
    onFocus: { table: { disable: true } },
    onValidate: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    id: { table: { disable: true } },
    ref: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    validationRegex: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

/**
 * Default textarea with basic configuration
 */
export const Default: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter your description...',
    onChange: action('onChange'),
    onBlur: action('onBlur'),
    onFocus: action('onFocus'),
  },
};

/**
 * Textarea with character counter and max length
 */
export const WithCharacterCounter: Story = {
  render: () => (
    <Textarea
      label="Bio"
      placeholder="Tell us about yourself..."
      maxLength={200}
      showCounter
      onChange={action('onChange')}
      onBlur={action('onBlur')}
      onFocus={action('onFocus')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

const AutoResizeComponent = () => {
  const [value, setValue] = useState('');
  return (
    <Textarea
      label="Auto-resizing textarea"
      placeholder="Type to see auto-resize..."
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        action('onChange')(e);
      }}
      onBlur={action('onBlur')}
      onFocus={action('onFocus')}
      autoResize
      minRows={3}
      maxRows={10}
    />
  );
};

/**
 * Auto-resizing textarea that adjusts height based on content
 */
export const AutoResize: Story = {
  render: () => <AutoResizeComponent />,
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Textarea with helper text
 */
export const WithHelperText: Story = {
  render: () => (
    <Textarea
      label="Feedback"
      helperText="Please provide detailed feedback"
      placeholder="Your feedback..."
      onChange={action('onChange')}
      onBlur={action('onBlur')}
      onFocus={action('onFocus')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Textarea in error state
 */
export const ErrorState: Story = {
  render: () => (
    <Textarea
      label="Comments"
      error
      errorMessage="This field is required"
      onChange={action('onChange')}
      onBlur={action('onBlur')}
      onFocus={action('onFocus')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Disabled and read-only states
 */
export const DisabledAndReadOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Textarea label="Disabled" disabled defaultValue="This is disabled" />
      <Textarea label="Read-only" readOnly defaultValue="This is read-only" />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Different resize control options
 */
export const ResizeControl: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Textarea label="Resize: None" resize="none" placeholder="Cannot be resized" />
      <Textarea label="Resize: Vertical" resize="vertical" placeholder="Can resize vertically" />
      <Textarea
        label="Resize: Horizontal"
        resize="horizontal"
        placeholder="Can resize horizontally"
      />
      <Textarea label="Resize: Both" resize="both" placeholder="Can resize in both directions" />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Interactive playground for testing all textarea features
 */
export const Playground: Story = {
  args: {
    label: 'Textarea',
    placeholder: 'Enter text...',
    rows: 4,
    onChange: action('onChange'),
    onBlur: action('onBlur'),
    onFocus: action('onFocus'),
    onValidate: action('onValidate'),
  },
};
