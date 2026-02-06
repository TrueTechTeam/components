import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { DateRangePicker } from './DateRangePicker';

const meta: Meta<typeof DateRangePicker> = {
  title: 'Inputs/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Date range picker component for selecting a range of dates with an interactive dual-month calendar.

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
<td>Extra small spacing between flex items</td>
</tr>
<tr>
<td><code>--font-size-base</code></td>
<td><a href="?path=/story/theme-css-variables--typography"><code>var(--font-size-base)</code></a></td>
<td>Base font size for label</td>
</tr>
<tr>
<td><code>--theme-text-primary</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-primary)</code></a></td>
<td>Primary text color for labels</td>
</tr>
<tr>
<td><code>--theme-surface-elevated</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-surface-elevated)</code></a></td>
<td>Background color for calendar popup</td>
</tr>
<tr>
<td><code>--theme-input-border</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-input-border)</code></a></td>
<td>Border color for calendar</td>
</tr>
<tr>
<td><code>--radius-md</code></td>
<td><a href="?path=/story/theme-css-variables--borders"><code>var(--radius-md)</code></a></td>
<td>Medium border radius</td>
</tr>
<tr>
<td><code>--spacing-md</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-md)</code></a></td>
<td>Medium spacing in calendar</td>
</tr>
<tr>
<td><code>--theme-secondary-400</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-secondary-400)</code></a></td>
<td>Secondary variant border color</td>
</tr>
<tr>
<td><code>--theme-tertiary-400</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-tertiary-400)</code></a></td>
<td>Tertiary variant border color</td>
</tr>
<tr>
<td><code>--font-size-sm</code></td>
<td><a href="?path=/story/theme-css-variables--typography"><code>var(--font-size-sm)</code></a></td>
<td>Small font size for preset buttons and month labels</td>
</tr>
<tr>
<td><code>--theme-neutral-100</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-neutral-100)</code></a></td>
<td>Neutral background on hover</td>
</tr>
<tr>
<td><code>--theme-neutral-200</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-neutral-200)</code></a></td>
<td>Neutral background on active</td>
</tr>
<tr>
<td><code>--radius-sm</code></td>
<td><a href="?path=/story/theme-css-variables--borders"><code>var(--radius-sm)</code></a></td>
<td>Small border radius</td>
</tr>
<tr>
<td><code>--theme-text-secondary</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-secondary)</code></a></td>
<td>Secondary text color</td>
</tr>
<tr>
<td><code>--font-size-xs</code></td>
<td><a href="?path=/story/theme-css-variables--typography"><code>var(--font-size-xs)</code></a></td>
<td>Extra small font size for day headers</td>
</tr>
<tr>
<td><code>--theme-text-disabled</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-disabled)</code></a></td>
<td>Text color for disabled dates</td>
</tr>
<tr>
<td><code>--theme-primary-500</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-primary-500)</code></a></td>
<td>Border color for today marker</td>
</tr>
<tr>
<td><code>--theme-primary-600</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-primary-600)</code></a></td>
<td>Background for selected date</td>
</tr>
<tr>
<td><code>--theme-white</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-white)</code></a></td>
<td>Text color for selected date</td>
</tr>
<tr>
<td><code>--theme-primary-700</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-primary-700)</code></a></td>
<td>Background on hover for selected date</td>
</tr>
<tr>
<td><code>--theme-primary-100</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-primary-100)</code></a></td>
<td>Background for in-range dates</td>
</tr>
<tr>
<td><code>--theme-primary-900</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-primary-900)</code></a></td>
<td>Text color for in-range dates</td>
</tr>
<tr>
<td><code>--theme-primary-200</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-primary-200)</code></a></td>
<td>Background on hover for in-range dates</td>
</tr>
<tr>
<td><code>--theme-primary-50</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-primary-50)</code></a></td>
<td>Background for hover range dates</td>
</tr>
<tr>
<td><code>--theme-primary-700</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-primary-700)</code></a></td>
<td>Text color for hover range dates</td>
</tr>
<tr>
<td><code>--theme-error</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-error)</code></a></td>
<td>Color for required indicator and error message</td>
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
      control: 'select',
      options: ['MM/DD/YYYY', 'DD/MM/YYYY'],
      description: 'Date format string',
    },
    separator: {
      control: 'text',
      description: 'Separator between start and end dates',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    showCalendar: {
      control: 'boolean',
      description: 'Show calendar popup',
    },
    showClearButton: {
      control: 'boolean',
      description: 'Show clear button',
    },
    showPresets: {
      control: 'boolean',
      description: 'Show preset ranges',
    },
    minDays: {
      control: 'number',
      description: 'Minimum number of days in range',
    },
    maxDays: {
      control: 'number',
      description: 'Maximum number of days in range',
    },
    // Disable complex props
    onChange: {
      table: { disable: true },
    },
    onBlur: {
      table: { disable: true },
    },
    className: {
      table: { disable: true },
    },
    style: {
      table: { disable: true },
    },
    id: {
      table: { disable: true },
    },
    'data-testid': {
      table: { disable: true },
    },
    'aria-label': {
      table: { disable: true },
    },
    startDate: {
      table: { disable: true },
    },
    endDate: {
      table: { disable: true },
    },
    defaultStartDate: {
      table: { disable: true },
    },
    defaultEndDate: {
      table: { disable: true },
    },
    minDate: {
      table: { disable: true },
    },
    maxDate: {
      table: { disable: true },
    },
    presets: {
      table: { disable: true },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

/**
 * Default date range picker
 */
export const Default: Story = {
  args: {
    label: 'Select Date Range',
    onChange: action('changed'),
    onBlur: action('blurred'),
  },
};

export const WithDefaultRange: Story = {
  render: () => (
    <DateRangePicker
      label="Date Range"
      defaultStartDate={(() => {
        const date = new Date();
        date.setDate(date.getDate() - 10);
        return date;
      })()}
      defaultEndDate={new Date()}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const WithPresets: Story = {
  render: () => <DateRangePicker label="Date Range" showPresets />,
  parameters: {
    controls: { disable: true },
  },
};

export const NoPresets: Story = {
  render: () => <DateRangePicker label="Date Range" showPresets={false} />,
  parameters: {
    controls: { disable: true },
  },
};

export const CustomPresets: Story = {
  render: () => (
    <DateRangePicker
      label="Analytics Period"
      showPresets
      presets={[
        {
          label: 'Yesterday',
          getValue: () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            return { startDate: yesterday, endDate: yesterday };
          },
        },
        {
          label: 'Last Week',
          getValue: () => {
            const end = new Date();
            const start = new Date();
            start.setDate(start.getDate() - 7);
            return { startDate: start, endDate: end };
          },
        },
        {
          label: 'Last Quarter',
          getValue: () => {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 3);
            return { startDate: start, endDate: end };
          },
        },
        {
          label: 'Last Year',
          getValue: () => {
            const end = new Date();
            const start = new Date();
            start.setFullYear(start.getFullYear() - 1);
            return { startDate: start, endDate: end };
          },
        },
      ]}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const WithMinDate: Story = {
  render: () => (
    <DateRangePicker
      label="Select Future Range"
      minDate={new Date()}
      helperText="You can only select future dates"
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const WithMaxDate: Story = {
  render: () => (
    <DateRangePicker
      label="Select Past Range"
      maxDate={new Date()}
      helperText="You can only select past dates"
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const WithDateConstraints: Story = {
  render: () => (
    <DateRangePicker
      label="Select Range (Current Year Only)"
      minDate={(() => {
        const date = new Date();
        date.setMonth(0, 1);
        return date;
      })()}
      maxDate={(() => {
        const date = new Date();
        date.setMonth(11, 31);
        return date;
      })()}
      helperText="Only dates in the current year are selectable"
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const WithMinDays: Story = {
  render: () => (
    <DateRangePicker
      label="Select Range (Min 7 Days)"
      minDays={7}
      helperText="You must select at least 7 days"
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const WithMaxDays: Story = {
  render: () => (
    <DateRangePicker
      label="Select Range (Max 30 Days)"
      maxDays={30}
      helperText="You can select up to 30 days"
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const WithDayConstraints: Story = {
  render: () => (
    <DateRangePicker
      label="Select Range (7-30 Days)"
      minDays={7}
      maxDays={30}
      helperText="Select between 7 and 30 days"
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const CustomFormat: Story = {
  render: () => (
    <DateRangePicker label="Date Range" format="DD/MM/YYYY" placeholder="DD/MM/YYYY - DD/MM/YYYY" />
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const CustomSeparator: Story = {
  render: () => (
    <DateRangePicker label="Date Range" separator=" to " placeholder="MM/DD/YYYY to MM/DD/YYYY" />
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const NoClearButton: Story = {
  render: () => <DateRangePicker label="Date Range" showClearButton={false} />,
  parameters: {
    controls: { disable: true },
  },
};

export const NoCalendar: Story = {
  render: () => <DateRangePicker label="Date Range" showCalendar={false} />,
  parameters: {
    controls: { disable: true },
  },
};

export const WithHelperText: Story = {
  render: () => (
    <DateRangePicker label="Booking Period" helperText="Select your check-in and check-out dates" />
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const WithError: Story = {
  render: () => <DateRangePicker label="Date Range" error errorMessage="Date range is required" />,
  parameters: {
    controls: { disable: true },
  },
};

export const Required: Story = {
  render: () => <DateRangePicker label="Date Range" required helperText="This field is required" />,
  parameters: {
    controls: { disable: true },
  },
};

export const Disabled: Story = {
  render: () => (
    <DateRangePicker
      label="Date Range"
      defaultStartDate={(() => {
        const date = new Date();
        date.setDate(date.getDate() - 10);
        return date;
      })()}
      defaultEndDate={new Date()}
      disabled
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const HotelBooking: Story = {
  render: () => (
    <DateRangePicker
      label="Check-in / Check-out"
      minDate={new Date()}
      minDays={1}
      maxDays={30}
      showPresets
      helperText="Select your stay dates (1-30 nights)"
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const AnalyticsReport: Story = {
  render: () => (
    <DateRangePicker
      label="Report Period"
      showPresets
      maxDate={new Date()}
      helperText="Select the time period for your report"
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Interactive playground to test all props
 */
export const Playground: Story = {
  args: {
    label: 'Date Range Picker',
    format: 'MM/DD/YYYY',
    separator: ' - ',
    showCalendar: true,
    showClearButton: true,
    showPresets: true,
    helperText: 'Select a date range',
    onChange: action('changed'),
    onBlur: action('blurred'),
  },
};
