import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { DatePicker } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Inputs/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
DatePicker component with interactive calendar interface. Supports date range restrictions, disabled dates, custom formats, and keyboard navigation.

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
<td>Extra small spacing</td>
</tr>
<tr>
<td><code>--spacing-sm</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-sm)</code></a></td>
<td>Small spacing</td>
</tr>
<tr>
<td><code>--spacing-md</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-md)</code></a></td>
<td>Medium spacing</td>
</tr>
<tr>
<td><code>--font-size-base</code></td>
<td><a href="?path=/story/theme-css-variables--typography"><code>var(--font-size-base)</code></a></td>
<td>Base font size</td>
</tr>
<tr>
<td><code>--font-size-sm</code></td>
<td><a href="?path=/story/theme-css-variables--typography"><code>var(--font-size-sm)</code></a></td>
<td>Small font size</td>
</tr>
<tr>
<td><code>--font-size-xs</code></td>
<td><a href="?path=/story/theme-css-variables--typography"><code>var(--font-size-xs)</code></a></td>
<td>Extra small font size</td>
</tr>
<tr>
<td><code>--theme-text-primary</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-primary)</code></a></td>
<td>Primary text color</td>
</tr>
<tr>
<td><code>--theme-text-secondary</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-secondary)</code></a></td>
<td>Secondary text color</td>
</tr>
<tr>
<td><code>--theme-text-disabled</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-disabled)</code></a></td>
<td>Disabled text color</td>
</tr>
<tr>
<td><code>--theme-surface-elevated</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-surface-elevated)</code></a></td>
<td>Elevated surface color</td>
</tr>
<tr>
<td><code>--theme-input-border</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-input-border)</code></a></td>
<td>Input border color</td>
</tr>
<tr>
<td><code>--theme-primary-500</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-primary-500)</code></a></td>
<td>Primary color 500</td>
</tr>
<tr>
<td><code>--theme-primary-600</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-primary-600)</code></a></td>
<td>Primary color 600</td>
</tr>
<tr>
<td><code>--theme-primary-700</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-primary-700)</code></a></td>
<td>Primary color 700</td>
</tr>
<tr>
<td><code>--theme-white</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-white)</code></a></td>
<td>White color</td>
</tr>
<tr>
<td><code>--theme-neutral-100</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-neutral-100)</code></a></td>
<td>Neutral color 100</td>
</tr>
<tr>
<td><code>--theme-neutral-200</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-neutral-200)</code></a></td>
<td>Neutral color 200</td>
</tr>
<tr>
<td><code>--theme-error</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-error)</code></a></td>
<td>Error color</td>
</tr>
<tr>
<td><code>--radius-sm</code></td>
<td><a href="?path=/story/theme-css-variables--borders"><code>var(--radius-sm)</code></a></td>
<td>Small border radius</td>
</tr>
<tr>
<td><code>--radius-md</code></td>
<td><a href="?path=/story/theme-css-variables--borders"><code>var(--radius-md)</code></a></td>
<td>Medium border radius</td>
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
      description: 'Input label text',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the input',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message (shows when error is true)',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    error: {
      control: 'boolean',
      description: 'Whether the input is in an error state',
    },
    format: {
      control: 'text',
      description: 'Date format string',
    },
    showCalendar: {
      control: 'boolean',
      description: 'Show calendar popup',
    },
    showClearButton: {
      control: 'boolean',
      description: 'Show clear button',
    },
    // Disabled complex props
    onChange: { table: { disable: true } },
    onBlur: { table: { disable: true } },
    className: {
      table: { disable: true },
    },
    style: {
      table: { disable: true },
    },
    value: {
      table: { disable: true },
      description: 'Controlled date value',
    },
    defaultValue: {
      table: { disable: true },
      description: 'Default date value (uncontrolled)',
    },
    minDate: {
      table: { disable: true },
      description: 'Minimum selectable date',
    },
    maxDate: {
      table: { disable: true },
      description: 'Maximum selectable date',
    },
    disabledDates: {
      table: { disable: true },
      description: 'Array of disabled dates',
    },
    startIcon: {
      table: { disable: true },
      description: 'Start icon (calendar icon by default)',
    },
    'data-testid': {
      table: { disable: true },
    },
    'aria-label': {
      table: { disable: true },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

/**
 * Default DatePicker with label
 */
export const Default: Story = {
  args: {
    label: 'Select Date',
    onChange: action('date-changed'),
    onBlur: action('blurred'),
  },
};

/**
 * DatePicker with a pre-selected default value
 */
export const WithDefaultValue: Story = {
  args: {
    label: 'Event Date',
    defaultValue: new Date(2024, 5, 15), // June 15, 2024
  },
  parameters: {
    controls: { disable: true },
  },
};

/**
 * DatePicker with minimum date restriction
 */
export const WithMinDate: Story = {
  args: {
    label: 'Select Future Date',
    minDate: new Date(),
    helperText: 'You can only select dates from today onwards',
  },
  parameters: {
    controls: { disable: true },
  },
};

/**
 * DatePicker with maximum date restriction
 */
export const WithMaxDate: Story = {
  args: {
    label: 'Select Past Date',
    maxDate: new Date(),
    helperText: 'You can only select dates up to today',
  },
  parameters: {
    controls: { disable: true },
  },
};

/**
 * DatePicker with both minimum and maximum date restrictions
 */
export const WithDateRange: Story = {
  args: {
    label: 'Select Date',
    minDate: (() => {
      const date = new Date();
      date.setMonth(date.getMonth() - 3); // 3 months ago
      return date;
    })(),
    maxDate: (() => {
      const date = new Date();
      date.setMonth(date.getMonth() + 3); // 3 months from now
      return date;
    })(),
    helperText: 'Only dates within 3 months of today are selectable',
  },
  parameters: {
    controls: { disable: true },
  },
};

/**
 * DatePicker with specific disabled dates (weekends)
 */
export const WithDisabledDates: Story = {
  args: {
    label: 'Select Weekday',
    disabledDates: (() => {
      const today = new Date();
      const disabled: Date[] = [];

      // Get the next 30 days and disable all Saturdays and Sundays
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dayOfWeek = date.getDay();

        // If Saturday (6) or Sunday (0), add to disabled dates
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          disabled.push(date);
        }
      }

      return disabled;
    })(),
    helperText: 'Weekends are disabled for the next 30 days',
  },
  parameters: {
    controls: { disable: true },
  },
};

/**
 * DatePicker with custom date format
 */
export const CustomFormat: Story = {
  args: {
    label: 'Birth Date',
    format: 'DD/MM/YYYY',
    placeholder: 'DD/MM/YYYY',
  },
  parameters: {
    controls: { disable: true },
  },
};

/**
 * DatePicker without clear button
 */
export const NoClearButton: Story = {
  args: {
    label: 'Select Date',
    showClearButton: false,
  },
  parameters: {
    controls: { disable: true },
  },
};

/**
 * DatePicker without calendar popup (manual input only)
 */
export const NoCalendar: Story = {
  args: {
    label: 'Enter Date',
    showCalendar: false,
    placeholder: 'MM/DD/YYYY',
    helperText: 'Type the date manually',
  },
  parameters: {
    controls: { disable: true },
  },
};

/**
 * DatePicker with helper text
 */
export const WithHelperText: Story = {
  args: {
    label: 'Appointment Date',
    helperText: 'Choose your preferred appointment date',
  },
  parameters: {
    controls: { disable: true },
  },
};

/**
 * DatePicker in error state
 */
export const WithError: Story = {
  args: {
    label: 'Date',
    error: true,
    errorMessage: 'Date is required',
  },
  parameters: {
    controls: { disable: true },
  },
};

/**
 * DatePicker with required field indicator
 */
export const Required: Story = {
  args: {
    label: 'Start Date',
    required: true,
    helperText: 'This field is required',
  },
  parameters: {
    controls: { disable: true },
  },
};

/**
 * DatePicker in disabled state
 */
export const Disabled: Story = {
  args: {
    label: 'Date',
    defaultValue: new Date(2024, 5, 15),
    disabled: true,
  },
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Real-world example: Birthday picker
 */
export const BirthdayPicker: Story = {
  args: {
    label: 'Date of Birth',
    maxDate: new Date(),
    format: 'MM/DD/YYYY',
    helperText: 'Enter your birth date',
  },
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Real-world example: Event planner
 */
export const EventPlanner: Story = {
  args: {
    label: 'Event Date',
    minDate: new Date(),
    helperText: 'Select a future date for your event',
  },
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Interactive playground for testing all props
 */
export const Playground: Story = {
  args: {
    label: 'Date Picker',
    format: 'MM/DD/YYYY',
    showCalendar: true,
    showClearButton: true,
    helperText: 'Select or enter a date',
    onChange: action('date-changed'),
    onBlur: action('blurred'),
  },
};
