import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Forms/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  args: {
    label: 'Select Date',
  },
};

export const WithDefaultValue: Story = {
  args: {
    label: 'Event Date',
    defaultValue: new Date(2024, 5, 15), // June 15, 2024
  },
};

export const WithMinDate: Story = {
  args: {
    label: 'Select Future Date',
    minDate: new Date(),
    helperText: 'You can only select dates from today onwards',
  },
};

export const WithMaxDate: Story = {
  args: {
    label: 'Select Past Date',
    maxDate: new Date(),
    helperText: 'You can only select dates up to today',
  },
};

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
};

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
};

export const CustomFormat: Story = {
  args: {
    label: 'Birth Date',
    format: 'DD/MM/YYYY',
    placeholder: 'DD/MM/YYYY',
  },
};

export const NoClearButton: Story = {
  args: {
    label: 'Select Date',
    showClearButton: false,
  },
};

export const NoCalendar: Story = {
  args: {
    label: 'Enter Date',
    showCalendar: false,
    placeholder: 'MM/DD/YYYY',
    helperText: 'Type the date manually',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Appointment Date',
    helperText: 'Choose your preferred appointment date',
  },
};

export const WithError: Story = {
  args: {
    label: 'Date',
    error: true,
    errorMessage: 'Date is required',
  },
};

export const Required: Story = {
  args: {
    label: 'Start Date',
    required: true,
    helperText: 'This field is required',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Date',
    defaultValue: new Date(2024, 5, 15),
    disabled: true,
  },
};

export const BirthdayPicker: Story = {
  args: {
    label: 'Date of Birth',
    maxDate: new Date(),
    format: 'MM/DD/YYYY',
    helperText: 'Enter your birth date',
  },
};

export const EventPlanner: Story = {
  args: {
    label: 'Event Date',
    minDate: new Date(),
    helperText: 'Select a future date for your event',
  },
};

export const Playground: Story = {
  args: {
    label: 'Date Picker',
    format: 'MM/DD/YYYY',
    showCalendar: true,
    showClearButton: true,
    helperText: 'Select or enter a date',
  },
};

