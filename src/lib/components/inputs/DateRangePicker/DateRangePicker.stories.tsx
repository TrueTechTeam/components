import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { DateRangePicker } from './DateRangePicker';

const meta: Meta<typeof DateRangePicker> = {
  title: 'Inputs/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
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
