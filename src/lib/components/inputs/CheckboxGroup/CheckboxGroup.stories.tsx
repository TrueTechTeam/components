import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';
import { CheckboxGroup } from './CheckboxGroup';
import { CheckboxGroupItem } from './CheckboxGroupItem';

const meta: Meta<typeof CheckboxGroup> = {
  title: 'Inputs/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
CheckboxGroup component manages multiple checkbox selections with support for min/max constraints, validation, and accessibility features.

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
<td><code>--checkbox-group-gap</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-sm)</code></a></td>
<td>Gap between checkboxes</td>
</tr>
<tr>
<td><code>--checkbox-size</code></td>
<td><code>18px</code></td>
<td>Size of checkbox element</td>
</tr>
<tr>
<td><code>--checkbox-bg</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-background-primary)</code></a></td>
<td>Background color of checkbox</td>
</tr>
<tr>
<td><code>--checkbox-bg-checked</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-primary)</code></a></td>
<td>Background color when checked</td>
</tr>
<tr>
<td><code>--checkbox-border-color</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-border-primary)</code></a></td>
<td>Border color of checkbox</td>
</tr>
<tr>
<td><code>--checkbox-border-color-checked</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-primary)</code></a></td>
<td>Border color when checked</td>
</tr>
<tr>
<td><code>--checkbox-icon-color</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-on-primary)</code></a></td>
<td>Color of check icon</td>
</tr>
</tbody>
</table>
`,
      },
    },
  },
  argTypes: {
    value: {
      control: 'object',
      description: 'Array of selected values (controlled)',
    },
    defaultValue: {
      control: 'object',
      description: 'Default selected values (uncontrolled)',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger'],
      description: 'Checkbox variant style',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Checkbox size',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Layout orientation',
    },
    label: {
      control: 'text',
      description: 'Group label',
    },
    helperText: {
      control: 'text',
      description: 'Helper text below the group',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message when in error state',
    },
    error: {
      control: 'boolean',
      description: 'Whether the group is in error state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether all checkboxes are disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether at least one selection is required',
    },
    min: {
      control: 'number',
      description: 'Minimum number of selections',
    },
    max: {
      control: 'number',
      description: 'Maximum number of selections',
    },
    // Disable complex props
    onChange: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
    name: { table: { disable: true } },
    id: { table: { disable: true } },
    children: { table: { disable: true } },
    gap: { table: { disable: true } },
    readOnly: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof CheckboxGroup>;

/**
 * Default checkbox group
 */
export const Default: Story = {
  render: (args) => (
    <CheckboxGroup {...args} label="Select options" onChange={action('onChange')}>
      <CheckboxGroupItem value="option1" label="Option 1" />
      <CheckboxGroupItem value="option2" label="Option 2" />
      <CheckboxGroupItem value="option3" label="Option 3" />
    </CheckboxGroup>
  ),
  args: {
    defaultValue: ['option1'],
  },
};

/**
 * With pre-selected values
 */
export const WithDefaultValues: Story = {
  render: () => (
    <CheckboxGroup
      defaultValue={['apple', 'banana']}
      label="Select your favorite fruits"
      onChange={action('onChange')}
    >
      <CheckboxGroupItem value="apple" label="Apple" />
      <CheckboxGroupItem value="banana" label="Banana" />
      <CheckboxGroupItem value="orange" label="Orange" />
      <CheckboxGroupItem value="grape" label="Grape" />
    </CheckboxGroup>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Horizontal orientation
 */
export const Horizontal: Story = {
  render: () => (
    <CheckboxGroup orientation="horizontal" label="Select colors" onChange={action('onChange')}>
      <CheckboxGroupItem value="red" label="Red" />
      <CheckboxGroupItem value="green" label="Green" />
      <CheckboxGroupItem value="blue" label="Blue" />
    </CheckboxGroup>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * All size variants
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <CheckboxGroup size="sm" label="Small checkboxes" defaultValue={['a']}>
        <CheckboxGroupItem value="a" label="Option A" />
        <CheckboxGroupItem value="b" label="Option B" />
        <CheckboxGroupItem value="c" label="Option C" />
      </CheckboxGroup>

      <CheckboxGroup size="md" label="Medium checkboxes (default)" defaultValue={['a']}>
        <CheckboxGroupItem value="a" label="Option A" />
        <CheckboxGroupItem value="b" label="Option B" />
        <CheckboxGroupItem value="c" label="Option C" />
      </CheckboxGroup>

      <CheckboxGroup size="lg" label="Large checkboxes" defaultValue={['a']}>
        <CheckboxGroupItem value="a" label="Option A" />
        <CheckboxGroupItem value="b" label="Option B" />
        <CheckboxGroupItem value="c" label="Option C" />
      </CheckboxGroup>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Color variants
 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <CheckboxGroup variant="primary" label="Primary" defaultValue={['a']}>
        <CheckboxGroupItem value="a" label="Option A" />
        <CheckboxGroupItem value="b" label="Option B" />
      </CheckboxGroup>

      <CheckboxGroup variant="secondary" label="Secondary" defaultValue={['a']}>
        <CheckboxGroupItem value="a" label="Option A" />
        <CheckboxGroupItem value="b" label="Option B" />
      </CheckboxGroup>

      <CheckboxGroup variant="success" label="Success" defaultValue={['a']}>
        <CheckboxGroupItem value="a" label="Option A" />
        <CheckboxGroupItem value="b" label="Option B" />
      </CheckboxGroup>

      <CheckboxGroup variant="warning" label="Warning" defaultValue={['a']}>
        <CheckboxGroupItem value="a" label="Option A" />
        <CheckboxGroupItem value="b" label="Option B" />
      </CheckboxGroup>

      <CheckboxGroup variant="danger" label="Danger" defaultValue={['a']}>
        <CheckboxGroupItem value="a" label="Option A" />
        <CheckboxGroupItem value="b" label="Option B" />
      </CheckboxGroup>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * With helper text
 */
export const WithHelperText: Story = {
  render: () => (
    <CheckboxGroup
      label="Notification preferences"
      helperText="Select which notifications you'd like to receive"
      onChange={action('onChange')}
    >
      <CheckboxGroupItem value="email" label="Email notifications" />
      <CheckboxGroupItem value="sms" label="SMS notifications" />
      <CheckboxGroupItem value="push" label="Push notifications" />
    </CheckboxGroup>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Error state
 */
export const ErrorState: Story = {
  render: () => (
    <CheckboxGroup
      label="Terms and Conditions"
      error
      errorMessage="You must agree to the terms to continue"
      required
      onChange={action('onChange')}
    >
      <CheckboxGroupItem value="terms" label="I agree to the Terms of Service" />
      <CheckboxGroupItem value="privacy" label="I agree to the Privacy Policy" />
    </CheckboxGroup>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <CheckboxGroup label="All disabled" disabled defaultValue={['option1']}>
        <CheckboxGroupItem value="option1" label="Option 1" />
        <CheckboxGroupItem value="option2" label="Option 2" />
        <CheckboxGroupItem value="option3" label="Option 3" />
      </CheckboxGroup>

      <CheckboxGroup label="Individual item disabled" defaultValue={['option1']}>
        <CheckboxGroupItem value="option1" label="Option 1" />
        <CheckboxGroupItem value="option2" label="Option 2 (disabled)" disabled />
        <CheckboxGroupItem value="option3" label="Option 3" />
      </CheckboxGroup>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * With min/max constraints
 */
const ConstrainedExample = () => {
  const [selected, setSelected] = useState<string[]>(['feature1']);

  return (
    <div>
      <CheckboxGroup
        value={selected}
        onChange={setSelected}
        label="Select 1-3 features"
        helperText={`Selected: ${selected.length}/3`}
        min={1}
        max={3}
      >
        <CheckboxGroupItem value="feature1" label="Feature 1" />
        <CheckboxGroupItem value="feature2" label="Feature 2" />
        <CheckboxGroupItem value="feature3" label="Feature 3" />
        <CheckboxGroupItem value="feature4" label="Feature 4" />
        <CheckboxGroupItem value="feature5" label="Feature 5" />
      </CheckboxGroup>
      <p style={{ marginTop: '16px', fontSize: '14px', color: 'var(--theme-text-secondary)' }}>
        Try to select more than 3 or deselect all - the constraints prevent it.
      </p>
    </div>
  );
};

export const WithConstraints: Story = {
  render: () => <ConstrainedExample />,
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Controlled component example
 */
const ControlledExample = () => {
  const [selected, setSelected] = useState<string[]>(['js']);

  return (
    <div>
      <CheckboxGroup
        value={selected}
        onChange={setSelected}
        label="Select your programming languages"
      >
        <CheckboxGroupItem value="js" label="JavaScript" />
        <CheckboxGroupItem value="ts" label="TypeScript" />
        <CheckboxGroupItem value="py" label="Python" />
        <CheckboxGroupItem value="go" label="Go" />
        <CheckboxGroupItem value="rust" label="Rust" />
      </CheckboxGroup>
      <p style={{ marginTop: '16px', fontSize: '14px', color: 'var(--theme-text-secondary)' }}>
        Selected: {selected.join(', ') || 'None'}
      </p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
  parameters: {
    controls: { disable: true },
  },
};

/**
 * With item helper text
 */
export const WithItemHelperText: Story = {
  render: () => (
    <CheckboxGroup label="Subscription options" onChange={action('onChange')}>
      <CheckboxGroupItem value="basic" label="Basic Plan" helperText="Free, limited features" />
      <CheckboxGroupItem value="pro" label="Pro Plan" helperText="$9.99/month, all features" />
      <CheckboxGroupItem
        value="enterprise"
        label="Enterprise Plan"
        helperText="Custom pricing, dedicated support"
      />
    </CheckboxGroup>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Real-world form example
 */
export const FormExample: Story = {
  render: () => (
    <div style={{ maxWidth: '400px' }}>
      <CheckboxGroup
        label="Interests"
        helperText="Select all that apply"
        defaultValue={['tech']}
        onChange={action('onChange')}
      >
        <CheckboxGroupItem value="tech" label="Technology" />
        <CheckboxGroupItem value="sports" label="Sports" />
        <CheckboxGroupItem value="music" label="Music" />
        <CheckboxGroupItem value="travel" label="Travel" />
        <CheckboxGroupItem value="food" label="Food & Cooking" />
        <CheckboxGroupItem value="art" label="Art & Design" />
      </CheckboxGroup>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Interactive playground
 */
export const Playground: Story = {
  render: (args) => (
    <CheckboxGroup {...args} onChange={action('onChange')}>
      <CheckboxGroupItem value="option1" label="Option 1" />
      <CheckboxGroupItem value="option2" label="Option 2" />
      <CheckboxGroupItem value="option3" label="Option 3" />
    </CheckboxGroup>
  ),
  args: {
    label: 'Checkbox Group',
    defaultValue: ['option1'],
    variant: 'primary',
    size: 'md',
    orientation: 'vertical',
    error: false,
    disabled: false,
    required: false,
  },
};
