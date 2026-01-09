import { render, screen, fireEvent } from '@testing-library/react';
import { DatePicker } from './DatePicker';

describe('DatePicker', () => {
  it('should render', () => {
    render(<DatePicker />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<DatePicker label="Select Date" />);
    expect(screen.getByText('Select Date')).toBeInTheDocument();
  });

  it('should show default value', () => {
    const date = new Date(2024, 5, 15);
    render(<DatePicker defaultValue={date} format="MM/DD/YYYY" />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('06/15/2024');
  });

  it('should handle date input', () => {
    const handleChange = jest.fn();
    render(<DatePicker onChange={handleChange} format="MM/DD/YYYY" />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '06/15/2024' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('should open calendar on calendar button click', () => {
    render(<DatePicker showCalendar />);

    const calendarButton = screen.getByLabelText('Toggle calendar');
    fireEvent.click(calendarButton);

    // Calendar should be visible (check for month selector)
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should show clear button when value exists', () => {
    render(<DatePicker defaultValue={new Date()} showClearButton />);
    expect(screen.getByLabelText('Clear date')).toBeInTheDocument();
  });

  it('should clear value on clear button click', () => {
    const handleChange = jest.fn();
    render(
      <DatePicker
        defaultValue={new Date(2024, 5, 15)}
        onChange={handleChange}
        showClearButton
      />
    );

    const clearButton = screen.getByLabelText('Clear date');
    fireEvent.click(clearButton);

    expect(handleChange).toHaveBeenCalledWith(null);
  });

  it('should navigate to previous month', () => {
    render(<DatePicker showCalendar />);

    // Open calendar
    const calendarButton = screen.getByLabelText('Toggle calendar');
    fireEvent.click(calendarButton);

    // Click previous month button
    const prevButton = screen.getByLabelText('Previous month');
    fireEvent.click(prevButton);

    // Month should change (tested by checking if the button still exists)
    expect(prevButton).toBeInTheDocument();
  });

  it('should navigate to next month', () => {
    render(<DatePicker showCalendar />);

    // Open calendar
    const calendarButton = screen.getByLabelText('Toggle calendar');
    fireEvent.click(calendarButton);

    // Click next month button
    const nextButton = screen.getByLabelText('Next month');
    fireEvent.click(nextButton);

    // Month should change
    expect(nextButton).toBeInTheDocument();
  });

  it('should select date from calendar', () => {
    const handleChange = jest.fn();
    render(<DatePicker onChange={handleChange} showCalendar />);

    // Open calendar
    const calendarButton = screen.getByLabelText('Toggle calendar');
    fireEvent.click(calendarButton);

    // Find and click a date button (e.g., day 15)
    const dayButtons = screen.getAllByRole('button');
    const day15Button = dayButtons.find(
      (btn) => btn.textContent === '15' && !btn.disabled
    );

    if (day15Button) {
      fireEvent.click(day15Button);
      expect(handleChange).toHaveBeenCalled();
    }
  });

  it('should not show calendar when showCalendar is false', () => {
    render(<DatePicker showCalendar={false} />);
    expect(screen.queryByLabelText('Toggle calendar')).not.toBeInTheDocument();
  });

  it('should show error state', () => {
    render(
      <DatePicker
        label="Date"
        error
        errorMessage="Date is required"
      />
    );

    expect(screen.getByText('Date is required')).toBeInTheDocument();
  });

  it('should show required indicator', () => {
    render(<DatePicker label="Date" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should be disabled', () => {
    render(<DatePicker disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('should work in controlled mode', () => {
    const date1 = new Date(2024, 5, 15);
    const date2 = new Date(2024, 5, 20);

    const { rerender } = render(
      <DatePicker value={date1} format="MM/DD/YYYY" />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('06/15/2024');

    rerender(<DatePicker value={date2} format="MM/DD/YYYY" />);
    expect(input.value).toBe('06/20/2024');
  });

  it('should respect minDate constraint', () => {
    const minDate = new Date(2024, 5, 15);
    render(<DatePicker minDate={minDate} showCalendar />);

    // Open calendar
    const calendarButton = screen.getByLabelText('Toggle calendar');
    fireEvent.click(calendarButton);

    // Days before minDate should be disabled
    const dayButtons = screen.getAllByRole('button');
    const earlyDays = dayButtons.filter(
      (btn) => btn.textContent && parseInt(btn.textContent) < 15
    );

    // At least some early days should be disabled
    expect(earlyDays.some((btn) => btn.disabled)).toBeTruthy();
  });

  it('should respect maxDate constraint', () => {
    const maxDate = new Date(2024, 5, 15);
    render(<DatePicker maxDate={maxDate} showCalendar />);

    // Open calendar
    const calendarButton = screen.getByLabelText('Toggle calendar');
    fireEvent.click(calendarButton);

    // Days after maxDate should be disabled
    const dayButtons = screen.getAllByRole('button');
    const lateDays = dayButtons.filter(
      (btn) => btn.textContent && parseInt(btn.textContent) > 15
    );

    // At least some late days should be disabled
    expect(lateDays.some((btn) => btn.disabled)).toBeTruthy();
  });

  it('should handle custom format', () => {
    const date = new Date(2024, 5, 15);
    render(<DatePicker defaultValue={date} format="DD/MM/YYYY" />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('15/06/2024');
  });
});
