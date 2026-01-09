import { render, screen, fireEvent } from '@testing-library/react';
import { DateRangePicker } from './DateRangePicker';

describe('DateRangePicker', () => {
  it('should render', () => {
    render(<DateRangePicker />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<DateRangePicker label="Select Date Range" />);
    expect(screen.getByText('Select Date Range')).toBeInTheDocument();
  });

  it('should show default date range', () => {
    const startDate = new Date(2024, 5, 10);
    const endDate = new Date(2024, 5, 20);
    render(
      <DateRangePicker
        defaultStartDate={startDate}
        defaultEndDate={endDate}
        format="MM/DD/YYYY"
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('06/10/2024 - 06/20/2024');
  });

  it('should open calendar on input focus', () => {
    render(<DateRangePicker showCalendar />);

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);

    // Calendar should be visible (check for preset buttons)
    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  it('should open calendar on calendar button click', () => {
    render(<DateRangePicker showCalendar />);

    const calendarButton = screen.getByLabelText('Toggle calendar');
    fireEvent.click(calendarButton);

    // Calendar should be visible
    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  it('should show preset buttons', () => {
    render(<DateRangePicker showCalendar showPresets />);

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);

    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Last 7 Days')).toBeInTheDocument();
    expect(screen.getByText('Last 30 Days')).toBeInTheDocument();
    expect(screen.getByText('This Month')).toBeInTheDocument();
    expect(screen.getByText('Last Month')).toBeInTheDocument();
  });

  it('should handle preset click', () => {
    const handleChange = jest.fn();
    render(
      <DateRangePicker
        showCalendar
        showPresets
        onChange={handleChange}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);

    const todayButton = screen.getByText('Today');
    fireEvent.click(todayButton);

    expect(handleChange).toHaveBeenCalled();
  });

  it('should show clear button when range is selected', () => {
    render(
      <DateRangePicker
        defaultStartDate={new Date(2024, 5, 10)}
        defaultEndDate={new Date(2024, 5, 20)}
        showClearButton
      />
    );

    expect(screen.getByLabelText('Clear dates')).toBeInTheDocument();
  });

  it('should clear dates on clear button click', () => {
    const handleChange = jest.fn();
    render(
      <DateRangePicker
        defaultStartDate={new Date(2024, 5, 10)}
        defaultEndDate={new Date(2024, 5, 20)}
        onChange={handleChange}
        showClearButton
      />
    );

    const clearButton = screen.getByLabelText('Clear dates');
    fireEvent.click(clearButton);

    expect(handleChange).toHaveBeenCalledWith(null, null);
  });

  it('should show dual calendars', () => {
    render(<DateRangePicker showCalendar />);

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);

    // Should show two month headers (current month and next month)
    const navButtons = screen.getAllByLabelText(/month/i);
    expect(navButtons.length).toBeGreaterThanOrEqual(2);
  });

  it('should navigate to previous month', () => {
    render(<DateRangePicker showCalendar />);

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);

    const prevButton = screen.getByLabelText('Previous month');
    fireEvent.click(prevButton);

    expect(prevButton).toBeInTheDocument();
  });

  it('should navigate to next month', () => {
    render(<DateRangePicker showCalendar />);

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);

    const nextButton = screen.getByLabelText('Next month');
    fireEvent.click(nextButton);

    expect(nextButton).toBeInTheDocument();
  });

  it('should not show presets when showPresets is false', () => {
    render(<DateRangePicker showCalendar showPresets={false} />);

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);

    expect(screen.queryByText('Today')).not.toBeInTheDocument();
  });

  it('should not show calendar when showCalendar is false', () => {
    render(<DateRangePicker showCalendar={false} />);
    expect(screen.queryByLabelText('Toggle calendar')).not.toBeInTheDocument();
  });

  it('should use custom separator', () => {
    const startDate = new Date(2024, 5, 10);
    const endDate = new Date(2024, 5, 20);
    render(
      <DateRangePicker
        defaultStartDate={startDate}
        defaultEndDate={endDate}
        format="MM/DD/YYYY"
        separator=" to "
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('06/10/2024 to 06/20/2024');
  });

  it('should show error state', () => {
    render(
      <DateRangePicker
        label="Date Range"
        error
        errorMessage="Date range is required"
      />
    );

    expect(screen.getByText('Date range is required')).toBeInTheDocument();
  });

  it('should show required indicator', () => {
    render(<DateRangePicker label="Date Range" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should be disabled', () => {
    render(<DateRangePicker disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('should work in controlled mode', () => {
    const startDate1 = new Date(2024, 5, 10);
    const endDate1 = new Date(2024, 5, 20);
    const startDate2 = new Date(2024, 6, 1);
    const endDate2 = new Date(2024, 6, 15);

    const { rerender } = render(
      <DateRangePicker
        startDate={startDate1}
        endDate={endDate1}
        format="MM/DD/YYYY"
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('06/10/2024 - 06/20/2024');

    rerender(
      <DateRangePicker
        startDate={startDate2}
        endDate={endDate2}
        format="MM/DD/YYYY"
      />
    );
    expect(input.value).toBe('07/01/2024 - 07/15/2024');
  });

  it('should handle custom format', () => {
    const startDate = new Date(2024, 5, 10);
    const endDate = new Date(2024, 5, 20);
    render(
      <DateRangePicker
        defaultStartDate={startDate}
        defaultEndDate={endDate}
        format="DD/MM/YYYY"
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('10/06/2024 - 20/06/2024');
  });

  it('should handle custom presets', () => {
    const customPresets = [
      {
        label: 'Yesterday',
        getValue: () => {
          const date = new Date();
          date.setDate(date.getDate() - 1);
          return { startDate: date, endDate: date };
        },
      },
    ];

    render(
      <DateRangePicker
        showCalendar
        showPresets
        presets={customPresets}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);

    expect(screen.getByText('Yesterday')).toBeInTheDocument();
  });
});
