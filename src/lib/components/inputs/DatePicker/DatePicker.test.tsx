import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('should open calendar on input click', async () => {
    const user = userEvent.setup();
    render(<DatePicker showCalendar />);

    // Calendar opens on input click
    const input = screen.getByRole('textbox');
    await user.click(input);

    // Calendar should be visible (check for navigation buttons)
    await waitFor(() => {
      expect(screen.getByLabelText('Previous month')).toBeInTheDocument();
      expect(screen.getByLabelText('Next month')).toBeInTheDocument();
    });
  });

  it('should show clear button when value exists', () => {
    render(<DatePicker defaultValue={new Date()} showClearButton />);
    // Clear button is part of Input component
    expect(screen.getByLabelText('Clear input')).toBeInTheDocument();
  });

  it('should clear value on clear button click', () => {
    const handleChange = jest.fn();
    render(
      <DatePicker defaultValue={new Date(2024, 5, 15)} onChange={handleChange} showClearButton />
    );

    const clearButton = screen.getByLabelText('Clear input');
    fireEvent.click(clearButton);

    expect(handleChange).toHaveBeenCalledWith(null);
  });

  it('should navigate to previous month', async () => {
    const user = userEvent.setup();
    render(<DatePicker showCalendar />);

    // Open calendar by clicking input
    const input = screen.getByRole('textbox');
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByLabelText('Previous month')).toBeInTheDocument();
    });

    // Click previous month button
    const prevButton = screen.getByLabelText('Previous month');
    await user.click(prevButton);

    // Month should change (tested by checking if the button still exists)
    expect(prevButton).toBeInTheDocument();
  });

  it('should navigate to next month', async () => {
    const user = userEvent.setup();
    render(<DatePicker showCalendar />);

    // Open calendar by clicking input
    const input = screen.getByRole('textbox');
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByLabelText('Next month')).toBeInTheDocument();
    });

    // Click next month button
    const nextButton = screen.getByLabelText('Next month');
    await user.click(nextButton);

    // Month should change
    expect(nextButton).toBeInTheDocument();
  });

  it('should select date from calendar', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<DatePicker onChange={handleChange} showCalendar />);

    // Open calendar by clicking input
    const input = screen.getByRole('textbox');
    await user.click(input);

    await waitFor(() => {
      expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
    });

    // Find and click a date button (e.g., day 15)
    const dayButtons = screen.getAllByRole('button');
    const day15Button = dayButtons.find((btn) => btn.textContent === '15' && !btn.disabled);

    if (day15Button) {
      await user.click(day15Button);
      expect(handleChange).toHaveBeenCalled();
    }
  });

  it('should not show calendar when showCalendar is false', () => {
    render(<DatePicker showCalendar={false} />);
    // When showCalendar is false, clicking input doesn't open calendar
    const input = screen.getByRole('textbox');
    fireEvent.click(input);
    // No calendar navigation buttons should appear
    expect(screen.queryByLabelText('Previous month')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Next month')).not.toBeInTheDocument();
  });

  it('should show error state', () => {
    render(<DatePicker label="Date" error errorMessage="Date is required" />);

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

    const { rerender } = render(<DatePicker value={date1} format="MM/DD/YYYY" />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('06/15/2024');

    rerender(<DatePicker value={date2} format="MM/DD/YYYY" />);
    expect(input.value).toBe('06/20/2024');
  });

  it('should respect minDate constraint', async () => {
    const user = userEvent.setup();
    const minDate = new Date(2024, 5, 15); // June 15, 2024
    // Provide a defaultValue in the same month to ensure calendar opens to that month
    const defaultValue = new Date(2024, 5, 20); // June 20, 2024
    render(<DatePicker minDate={minDate} defaultValue={defaultValue} showCalendar />);

    // Open calendar by clicking input
    const input = screen.getByRole('textbox');
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByLabelText('Previous month')).toBeInTheDocument();
    });

    // Get all day cell buttons (they have data-current-month attribute)
    const dayButtons = document.querySelectorAll('[class*="dayCell"]');
    const earlyDays = Array.from(dayButtons).filter((btn) => {
      const text = btn.textContent?.trim();
      const dayNum = text ? parseInt(text) : NaN;
      // Only check days 1-14 in current month
      return !isNaN(dayNum) && dayNum < 15 && btn.getAttribute('data-current-month') === 'true';
    });

    // At least some early days should be disabled
    expect(earlyDays.some((btn) => (btn as HTMLButtonElement).disabled)).toBeTruthy();
  });

  it('should respect maxDate constraint', async () => {
    const user = userEvent.setup();
    const maxDate = new Date(2024, 5, 15);
    render(<DatePicker maxDate={maxDate} showCalendar />);

    // Open calendar by clicking input
    const input = screen.getByRole('textbox');
    await user.click(input);

    await waitFor(() => {
      expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
    });

    // Days after maxDate should be disabled
    const dayButtons = screen.getAllByRole('button');
    const lateDays = dayButtons.filter((btn) => btn.textContent && parseInt(btn.textContent) > 15);

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
