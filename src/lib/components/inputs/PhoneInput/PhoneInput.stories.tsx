import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { PhoneInput } from './PhoneInput';

const meta: Meta<typeof PhoneInput> = {
  title: 'Inputs/PhoneInput',
  component: PhoneInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Phone input component with country code selector and automatic formatting based on country.

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
<td><code>--spacing-xs</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-xs)</code></a></td>
<td>Small spacing between container elements</td>
</tr>
<tr>
<td><code>--font-size-base</code></td>
<td><a href="?path=/story/theme-css-variables--typography"><code>var(--font-size-base)</code></a></td>
<td>Font size for label text</td>
</tr>
<tr>
<td><code>--theme-text-primary</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-primary)</code></a></td>
<td>Label text color</td>
</tr>
<tr>
<td><code>--spacing-md</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-md)</code></a></td>
<td>Medium spacing between label and input (left placement)</td>
</tr>
<tr>
<td><code>--select-border-color</code></td>
<td><code>transparent</code></td>
<td>Country select border color override</td>
</tr>
<tr>
<td><code>--select-background-color</code></td>
<td><code>transparent</code></td>
<td>Country select background override</td>
</tr>
<tr>
<td><code>--spacing-sm</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-sm)</code></a></td>
<td>Padding in country select</td>
</tr>
<tr>
<td><code>--theme-background-secondary</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-background-secondary)</code></a></td>
<td>Country select hover background</td>
</tr>
<tr>
<td><code>--theme-input-border-focus</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-input-border-focus)</code></a></td>
<td>Country select focus outline color</td>
</tr>
<tr>
<td><code>--input-padding-x</code></td>
<td><code>0</code></td>
<td>Phone number input horizontal padding override</td>
</tr>
<tr>
<td><code>--input-padding-y</code></td>
<td><code>0</code></td>
<td>Phone number input vertical padding override</td>
</tr>
<tr>
<td><code>--theme-text-secondary</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-secondary)</code></a></td>
<td>Dial code text color</td>
</tr>
<tr>
<td><code>--theme-error</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-error)</code></a></td>
<td>Required indicator color</td>
</tr>
</tbody>
</table>

**Note:** PhoneInput extends the Input component, so it inherits all Input CSS variables for styling the phone number field itself.
`,
      },
    },
  },
  argTypes: {
    // Simple text controls
    label: {
      control: 'text',
      description: 'Input label text',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text (auto-generated from country format)',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the input',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message (shows when error is true)',
    },
    defaultCountry: {
      control: 'text',
      description: 'Default country code (ISO 3166-1 alpha-2)',
    },
    countrySearchPlaceholder: {
      control: 'text',
      description: 'Placeholder for country search',
    },

    // Boolean controls
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
      description: 'Whether the field is required',
    },
    error: {
      control: 'boolean',
      description: 'Whether the input is in an error state',
    },
    showCountrySearch: {
      control: 'boolean',
      description: 'Whether to show the country search dropdown',
    },
    autoFormat: {
      control: 'boolean',
      description: 'Whether to format the phone number based on country format',
    },

    // Select controls
    labelPlacement: {
      control: 'select',
      options: ['top', 'left'],
      description: 'Label placement',
    },

    // Disabled controls - complex props
    onChange: { table: { disable: true } },
    onBlur: { table: { disable: true } },
    onFocus: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    id: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
    'aria-label': { table: { disable: true } },
    ref: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    countries: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof PhoneInput>;

/**
 * Default phone input with US country code
 */
export const Default: Story = {
  args: {
    label: 'Phone Number',
    defaultCountry: 'US',
    onChange: action('onChange'),
    onBlur: action('onBlur'),
    onFocus: action('onFocus'),
  },
};

/**
 * Phone input with pre-filled value
 */
export const WithValue: Story = {
  args: {
    label: 'Phone Number',
    defaultCountry: 'US',
    defaultValue: '(555) 123-4567',
    onChange: action('onChange'),
    onBlur: action('onBlur'),
    onFocus: action('onFocus'),
  },
};

/**
 * Phone inputs for different countries showing various formats
 */
export const DifferentCountries: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <PhoneInput label="United States" defaultCountry="US" onChange={action('onChange - US')} />
      <PhoneInput label="United Kingdom" defaultCountry="GB" onChange={action('onChange - GB')} />
      <PhoneInput label="Germany" defaultCountry="DE" onChange={action('onChange - DE')} />
      <PhoneInput label="Japan" defaultCountry="JP" onChange={action('onChange - JP')} />
      <PhoneInput label="Australia" defaultCountry="AU" onChange={action('onChange - AU')} />
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Phone input without automatic formatting
 */
export const WithoutAutoFormat: Story = {
  render: () => (
    <PhoneInput
      label="Phone Number (No Formatting)"
      defaultCountry="US"
      autoFormat={false}
      onChange={action('onChange')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Phone input without country search functionality
 */
export const WithoutCountrySearch: Story = {
  render: () => (
    <PhoneInput
      label="Phone Number"
      defaultCountry="US"
      showCountrySearch={false}
      onChange={action('onChange')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Phone input with helper text
 */
export const WithHelperText: Story = {
  render: () => (
    <PhoneInput
      label="Phone Number"
      defaultCountry="US"
      helperText="Enter your phone number including area code"
      onChange={action('onChange')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Phone input in error state
 */
export const WithError: Story = {
  render: () => (
    <PhoneInput
      label="Phone Number"
      defaultCountry="US"
      error
      errorMessage="Invalid phone number format"
      onChange={action('onChange')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Required phone input field
 */
export const Required: Story = {
  render: () => (
    <PhoneInput
      label="Phone Number"
      defaultCountry="US"
      required
      helperText="This field is required"
      onChange={action('onChange')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Disabled phone input
 */
export const Disabled: Story = {
  render: () => (
    <PhoneInput
      label="Phone Number"
      defaultCountry="US"
      defaultValue="(555) 123-4567"
      disabled
      onChange={action('onChange')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Phone input with horizontal label placement
 */
export const HorizontalLabel: Story = {
  render: () => (
    <PhoneInput
      label="Phone"
      labelPlacement="left"
      defaultCountry="US"
      onChange={action('onChange')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Interactive playground for testing all phone input features
 */
export const Playground: Story = {
  args: {
    label: 'Phone Number',
    defaultCountry: 'US',
    helperText: 'Enter your contact phone number',
    required: true,
    autoFormat: true,
    showCountrySearch: true,
    onChange: action('onChange'),
    onBlur: action('onBlur'),
    onFocus: action('onFocus'),
  },
};
