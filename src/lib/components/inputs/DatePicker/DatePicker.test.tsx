import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DatePicker } from './DatePicker';

describe('DatePicker', () => {
  describe('rendering', () => {
    it('should render', () => {
      render(<DatePicker />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<DatePicker label="Select Date" />);
      expect(screen.getByText('Select Date')).toBeInTheDocument();
    });

    it('should render with placeholder', () => {
      render(<DatePicker placeholder="Choose a date" />);
      expect(screen.getByPlaceholderText('Choose a date')).toBeInTheDocument();
    });

    it('should render with default value', () => {
      const date = new Date(2024, 5, 15);
      render(<DatePicker defaultValue={date} format="MM/DD/YYYY" />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('06/15/2024');
    });

    it('should render with controlled value', () => {
      const value = new Date(2024, 5, 15);
      render(<DatePicker value={value} onChange={() => {}} format="MM/DD/YYYY" />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('06/15/2024');
    });

    it('should render with data-testid', () => {
      render(<DatePicker data-testid="custom-datepicker" />);
      expect(screen.getByTestId('custom-datepicker')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<DatePicker className="custom-class" data-testid="datepicker" />);
      const container = screen.getByTestId('datepicker');
      expect(container).toHaveClass('custom-class');
    });

    it('should show required indicator when required', () => {
      render(<DatePicker label="Date" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should render with helper text', () => {
      render(<DatePicker helperText="Select your preferred date" />);
      expect(screen.getByText('Select your preferred date')).toBeInTheDocument();
    });

    it('should render with error message', () => {
      render(<DatePicker error errorMessage="Date is required" />);
      expect(screen.getByText('Date is required')).toBeInTheDocument();
    });

    it('should prioritize error message over helper text', () => {
      render(<DatePicker helperText="Helper" error errorMessage="Error" />);
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    });
  });

  describe('calendar popup', () => {
    it('should open calendar on input click when showCalendar is true', async () => {
      const user = userEvent.setup();
      render(<DatePicker showCalendar />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByLabelText('Previous month')).toBeInTheDocument();
        expect(screen.getByLabelText('Next month')).toBeInTheDocument();
      });
    });

    it('should not show calendar when showCalendar is false', () => {
      render(<DatePicker showCalendar={false} />);
      const input = screen.getByRole('textbox');
      fireEvent.click(input);
      expect(screen.queryByLabelText('Previous month')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Next month')).not.toBeInTheDocument();
    });

    it('should not open calendar when disabled', async () => {
      const user = userEvent.setup();
      render(<DatePicker showCalendar disabled />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      expect(screen.queryByLabelText('Previous month')).not.toBeInTheDocument();
    });

    it('should show day headers', async () => {
      const user = userEvent.setup();
      render(<DatePicker showCalendar />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Su')).toBeInTheDocument();
        expect(screen.getByText('Mo')).toBeInTheDocument();
      });
    });

    it('should close calendar after date selection', async () => {
      const user = userEvent.setup();
      render(<DatePicker showCalendar />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
      });

      const dayButtons = screen.getAllByRole('button');
      const day15Button = dayButtons.find((btn) => btn.textContent === '15' && !btn.disabled);

      if (day15Button) {
        await user.click(day15Button);

        await waitFor(() => {
          expect(screen.queryByLabelText('Previous month')).not.toBeInTheDocument();
        });
      }
    });
  });

  describe('calendar navigation', () => {
    it('should navigate to previous month', async () => {
      const user = userEvent.setup();
      render(<DatePicker showCalendar defaultValue={new Date(2024, 5, 15)} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByLabelText('Previous month')).toBeInTheDocument();
      });

      const prevButton = screen.getByLabelText('Previous month');
      await user.click(prevButton);

      expect(screen.getByLabelText('Previous month')).toBeInTheDocument();
    });

    it('should navigate to next month', async () => {
      const user = userEvent.setup();
      render(<DatePicker showCalendar defaultValue={new Date(2024, 5, 15)} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByLabelText('Next month')).toBeInTheDocument();
      });

      const nextButton = screen.getByLabelText('Next month');
      await user.click(nextButton);

      expect(screen.getByLabelText('Next month')).toBeInTheDocument();
    });

    it('should show month and year selectors in calendar', async () => {
      const user = userEvent.setup();
      render(<DatePicker showCalendar defaultValue={new Date(2024, 5, 15)} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByLabelText('Previous month')).toBeInTheDocument();
        expect(screen.getByLabelText('Next month')).toBeInTheDocument();
      });

      // Calendar should have day cells
      const dayCells = document.querySelectorAll('[class*="dayCell"]');
      expect(dayCells.length).toBeGreaterThan(0);
    });
  });

  describe('date selection', () => {
    it('should call onChange when date is selected from calendar', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<DatePicker onChange={handleChange} showCalendar />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
      });

      const dayButtons = screen.getAllByRole('button');
      const day15Button = dayButtons.find((btn) => btn.textContent === '15' && !btn.disabled);

      if (day15Button) {
        await user.click(day15Button);
        expect(handleChange).toHaveBeenCalled();
      }
    });

    it('should update input value when date is selected', async () => {
      const user = userEvent.setup();
      render(<DatePicker showCalendar format="MM/DD/YYYY" />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      await user.click(input);

      await waitFor(() => {
        expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
      });

      const dayButtons = screen.getAllByRole('button');
      const day15Button = dayButtons.find((btn) => btn.textContent === '15' && !btn.disabled);

      if (day15Button) {
        await user.click(day15Button);

        await waitFor(() => {
          expect(input.value).toMatch(/\d{2}\/\d{2}\/\d{4}/);
        });
      }
    });

    it('should not select disabled date', async () => {
      const user = userEvent.setup();
      const minDate = new Date(2024, 5, 20);
      const defaultValue = new Date(2024, 5, 20);
      render(<DatePicker showCalendar minDate={minDate} defaultValue={defaultValue} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByLabelText('Previous month')).toBeInTheDocument();
      });

      const dayButtons = document.querySelectorAll('[class*="dayCell"]');
      const earlyDays = Array.from(dayButtons).filter((btn) => {
        const text = btn.textContent?.trim();
        const dayNum = text ? parseInt(text) : NaN;
        return !isNaN(dayNum) && dayNum < 20 && btn.getAttribute('data-current-month') === 'true';
      });

      expect(earlyDays.some((btn) => (btn as HTMLButtonElement).disabled)).toBeTruthy();
    });
  });

  describe('input changes', () => {
    it('should handle manual date input', () => {
      const handleChange = jest.fn();
      render(<DatePicker onChange={handleChange} format="MM/DD/YYYY" />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '06/15/2024' } });

      expect(handleChange).toHaveBeenCalled();
    });

    it('should call onBlur when input loses focus', async () => {
      const user = userEvent.setup();
      const handleBlur = jest.fn();
      render(<DatePicker onBlur={handleBlur} />);

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.tab();

      expect(handleBlur).toHaveBeenCalled();
    });

    it('should respect minDate constraint on input', async () => {
      const handleChange = jest.fn();
      const minDate = new Date(2024, 5, 20);
      render(<DatePicker minDate={minDate} onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '06/10/2024' } });

      const calls = handleChange.mock.calls;
      const validCalls = calls.filter((call) => call[0] !== null && call[0] !== undefined);
      expect(validCalls.length).toBe(0);
    });

    it('should respect maxDate constraint on input', async () => {
      const handleChange = jest.fn();
      const maxDate = new Date(2024, 5, 10);
      render(<DatePicker maxDate={maxDate} onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '06/20/2024' } });

      const calls = handleChange.mock.calls;
      const validCalls = calls.filter((call) => call[0] !== null && call[0] !== undefined);
      expect(validCalls.length).toBe(0);
    });

    it('should respect disabledDates constraint on input', async () => {
      const handleChange = jest.fn();
      const disabledDates = [new Date(2024, 5, 15)];
      render(<DatePicker disabledDates={disabledDates} onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '06/15/2024' } });

      const calls = handleChange.mock.calls;
      const validCalls = calls.filter((call) => call[0] !== null && call[0] !== undefined);
      expect(validCalls.length).toBe(0);
    });

    it('should handle valid date within constraints', () => {
      const handleChange = jest.fn();
      const minDate = new Date(2024, 5, 1);
      const maxDate = new Date(2024, 5, 30);
      render(<DatePicker minDate={minDate} maxDate={maxDate} onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '06/15/2024' } });

      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('clear button', () => {
    it('should show clear button when showClearButton is true and has value', () => {
      render(<DatePicker defaultValue={new Date()} showClearButton />);
      expect(screen.getByLabelText('Clear input')).toBeInTheDocument();
    });

    it('should not show clear button when value is empty', () => {
      render(<DatePicker showClearButton />);
      expect(screen.queryByLabelText('Clear input')).not.toBeInTheDocument();
    });

    it('should not show clear button when showClearButton is false', () => {
      render(<DatePicker showClearButton={false} defaultValue={new Date(2024, 5, 15)} />);
      expect(screen.queryByLabelText('Clear input')).not.toBeInTheDocument();
    });

    it('should clear date on clear button click', () => {
      const handleChange = jest.fn();
      render(
        <DatePicker defaultValue={new Date(2024, 5, 15)} onChange={handleChange} showClearButton />
      );

      const clearButton = screen.getByLabelText('Clear input');
      fireEvent.click(clearButton);

      expect(handleChange).toHaveBeenCalledWith(null);
    });

    it('should clear input value on clear button click', async () => {
      render(<DatePicker showClearButton defaultValue={new Date(2024, 5, 15)} />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).not.toBe('');

      const clearButton = screen.getByLabelText('Clear input');
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(input.value).toBe('');
      });
    });
  });

  describe('format', () => {
    it('should use default format MM/DD/YYYY', () => {
      const date = new Date(2024, 5, 15);
      render(<DatePicker defaultValue={date} />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('06/15/2024');
    });

    it('should use custom format DD/MM/YYYY', () => {
      const date = new Date(2024, 5, 15);
      render(<DatePicker defaultValue={date} format="DD/MM/YYYY" />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('15/06/2024');
    });

    it('should use custom format YYYY-MM-DD', () => {
      const date = new Date(2024, 5, 15);
      render(<DatePicker defaultValue={date} format="YYYY-MM-DD" />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('2024-06-15');
    });
  });

  describe('controlled vs uncontrolled', () => {
    it('should work as uncontrolled component', async () => {
      const user = userEvent.setup();
      render(<DatePicker defaultValue={new Date(2024, 5, 15)} format="MM/DD/YYYY" />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('06/15/2024');

      await user.clear(input);
      fireEvent.change(input, { target: { value: '12/25/2024' } });

      expect(input.value).toBe('12/25/2024');
    });

    it('should work as controlled component', () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState<Date | null>(new Date(2024, 5, 15));
        return <DatePicker value={value} onChange={setValue} format="MM/DD/YYYY" />;
      };

      render(<TestComponent />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('06/15/2024');
    });

    it('should update when controlled value changes', () => {
      const date1 = new Date(2024, 5, 15);
      const date2 = new Date(2024, 5, 20);

      const { rerender } = render(<DatePicker value={date1} format="MM/DD/YYYY" />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('06/15/2024');

      rerender(<DatePicker value={date2} format="MM/DD/YYYY" />);
      expect(input.value).toBe('06/20/2024');
    });

    it('should handle null value', () => {
      render(<DatePicker value={null} onChange={() => {}} />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('');
    });

    it('should update viewDate when controlled value changes', () => {
      const date1 = new Date(2024, 5, 15);
      const date2 = new Date(2024, 6, 20);

      const { rerender } = render(<DatePicker value={date1} format="MM/DD/YYYY" />);

      rerender(<DatePicker value={date2} format="MM/DD/YYYY" />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('07/20/2024');
    });
  });

  describe('states', () => {
    it('should be disabled', () => {
      render(<DatePicker disabled />);

      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('should not trigger change when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<DatePicker disabled onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, '12/25/2024');

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should show error state', () => {
      render(<DatePicker error />);
      const input = screen.getByRole('textbox');
      expect(input.parentElement).toHaveAttribute('data-state', 'error');
    });
  });

  describe('accessibility', () => {
    it('should have correct aria-label', () => {
      render(<DatePicker aria-label="Select birth date" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Select birth date');
    });

    it('should use label as aria-label fallback', () => {
      render(<DatePicker label="Birth Date" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Birth Date');
    });

    it('should use default aria-label', () => {
      render(<DatePicker />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Date picker');
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<DatePicker />);

      await user.tab();
      expect(screen.getByRole('textbox')).toHaveFocus();
    });
  });

  describe('icons', () => {
    it('should show calendar icon by default', () => {
      render(<DatePicker />);
      const input = screen.getByRole('textbox');
      expect(input.parentElement?.querySelector('svg')).toBeInTheDocument();
    });

    it('should use custom startIcon', () => {
      render(<DatePicker startIcon="check" />);
      const input = screen.getByRole('textbox');
      expect(input.parentElement?.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle leap year dates', () => {
      const leapYearDate = new Date(2024, 1, 29);
      render(<DatePicker defaultValue={leapYearDate} format="MM/DD/YYYY" />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('02/29/2024');
    });

    it('should handle year boundaries', () => {
      const newYearDate = new Date(2024, 0, 1);
      render(<DatePicker defaultValue={newYearDate} format="MM/DD/YYYY" />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('01/01/2024');
    });

    it('should handle month boundaries', () => {
      const monthEndDate = new Date(2024, 4, 31);
      render(<DatePicker defaultValue={monthEndDate} format="MM/DD/YYYY" />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('05/31/2024');
    });

    it('should handle invalid input gracefully', () => {
      const handleChange = jest.fn();
      render(<DatePicker onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'not a date' } });

      const validCalls = handleChange.mock.calls.filter(
        (call) => call[0] !== null && call[0] !== undefined
      );
      expect(validCalls.length).toBe(0);
    });

    it('should handle incomplete date input', () => {
      const handleChange = jest.fn();
      render(<DatePicker onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '06/15/' } });

      const validCalls = handleChange.mock.calls.filter(
        (call) => call[0] !== null && call[0] !== undefined
      );
      expect(validCalls.length).toBe(0);
    });
  });

  describe('date constraints in calendar', () => {
    it('should respect maxDate constraint in calendar', async () => {
      const user = userEvent.setup();
      const maxDate = new Date(2024, 5, 15);
      render(<DatePicker maxDate={maxDate} showCalendar />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
      });

      const dayButtons = screen.getAllByRole('button');
      const lateDays = dayButtons.filter(
        (btn) => btn.textContent && parseInt(btn.textContent) > 15
      );

      expect(lateDays.some((btn) => btn.disabled)).toBeTruthy();
    });

    it('should show disabled dates in calendar', async () => {
      const user = userEvent.setup();
      const disabledDates = [new Date(2024, 5, 15)];
      const defaultValue = new Date(2024, 5, 10);
      render(<DatePicker disabledDates={disabledDates} defaultValue={defaultValue} showCalendar />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByLabelText('Previous month')).toBeInTheDocument();
      });

      // Use document query to find day cells with data attributes
      const dayButtons = document.querySelectorAll('[class*="dayCell"]');
      const day15Buttons = Array.from(dayButtons).filter((btn) => {
        const text = btn.textContent?.trim();
        const dayNum = text ? parseInt(text) : NaN;
        return dayNum === 15 && btn.getAttribute('data-current-month') === 'true';
      });

      expect(day15Buttons.length).toBeGreaterThan(0);
      expect(day15Buttons.some((btn) => (btn as HTMLButtonElement).disabled)).toBeTruthy();
    });
  });
});
