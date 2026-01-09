import type { Meta, StoryObj } from '@storybook/react';
import { DateRangePicker } from './DateRangePicker';

const meta: Meta<typeof DateRangePicker> = {
  title: 'Forms/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

export const Default: Story = {
  args: {
    label: 'Select Date Range',
  },
};

export const WithDefaultRange: Story = {
  args: {
    label: 'Date Range',
    defaultStartDate: (() => {
      const date = new Date();
      date.setDate(date.getDate() - 10);
      return date;
    })(),
    defaultEndDate: new Date(),
  },
};

export const WithPresets: Story = {
  args: {
    label: 'Date Range',
    showPresets: true,
  },
};

export const NoPresets: Story = {
  args: {
    label: 'Date Range',
    showPresets: false,
  },
};

export const CustomPresets: Story = {
  args: {
    label: 'Analytics Period',
    showPresets: true,
    presets: [
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
    ],
  },
};

export const WithMinDate: Story = {
  args: {
    label: 'Select Future Range',
    minDate: new Date(),
    helperText: 'You can only select future dates',
  },
};

export const WithMaxDate: Story = {
  args: {
    label: 'Select Past Range',
    maxDate: new Date(),
    helperText: 'You can only select past dates',
  },
};

export const WithDateConstraints: Story = {
  args: {
    label: 'Select Range (Current Year Only)',
    minDate: (() => {
      const date = new Date();
      date.setMonth(0, 1);
      return date;
    })(),
    maxDate: (() => {
      const date = new Date();
      date.setMonth(11, 31);
      return date;
    })(),
    helperText: 'Only dates in the current year are selectable',
  },
};

export const WithMinDays: Story = {
  args: {
    label: 'Select Range (Min 7 Days)',
    minDays: 7,
    helperText: 'You must select at least 7 days',
  },
};

export const WithMaxDays: Story = {
  args: {
    label: 'Select Range (Max 30 Days)',
    maxDays: 30,
    helperText: 'You can select up to 30 days',
  },
};

export const WithDayConstraints: Story = {
  args: {
    label: 'Select Range (7-30 Days)',
    minDays: 7,
    maxDays: 30,
    helperText: 'Select between 7 and 30 days',
  },
};

export const CustomFormat: Story = {
  args: {
    label: 'Date Range',
    format: 'DD/MM/YYYY',
    placeholder: 'DD/MM/YYYY - DD/MM/YYYY',
  },
};

export const CustomSeparator: Story = {
  args: {
    label: 'Date Range',
    separator: ' to ',
    placeholder: 'MM/DD/YYYY to MM/DD/YYYY',
  },
};

export const NoClearButton: Story = {
  args: {
    label: 'Date Range',
    showClearButton: false,
  },
};

export const NoCalendar: Story = {
  args: {
    label: 'Date Range',
    showCalendar: false,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Booking Period',
    helperText: 'Select your check-in and check-out dates',
  },
};

export const WithError: Story = {
  args: {
    label: 'Date Range',
    error: true,
    errorMessage: 'Date range is required',
  },
};

export const Required: Story = {
  args: {
    label: 'Date Range',
    required: true,
    helperText: 'This field is required',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Date Range',
    defaultStartDate: (() => {
      const date = new Date();
      date.setDate(date.getDate() - 10);
      return date;
    })(),
    defaultEndDate: new Date(),
    disabled: true,
  },
};

export const HotelBooking: Story = {
  args: {
    label: 'Check-in / Check-out',
    minDate: new Date(),
    minDays: 1,
    maxDays: 30,
    showPresets: true,
    helperText: 'Select your stay dates (1-30 nights)',
  },
};

export const AnalyticsReport: Story = {
  args: {
    label: 'Report Period',
    showPresets: true,
    maxDate: new Date(),
    helperText: 'Select the time period for your report',
  },
};

export const Playground: Story = {
  args: {
    label: 'Date Range Picker',
    format: 'MM/DD/YYYY',
    separator: ' - ',
    showCalendar: true,
    showClearButton: true,
    showPresets: true,
    helperText: 'Select a date range',
  },
};
