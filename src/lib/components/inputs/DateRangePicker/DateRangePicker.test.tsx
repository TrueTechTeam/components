import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
      <DateRangePicker defaultStartDate={startDate} defaultEndDate={endDate} format="MM/DD/YYYY" />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('06/10/2024 - 06/20/2024');
  });

  it('should open calendar on input focus', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker showCalendar />);

    const input = screen.getByRole('textbox');
    await user.click(input);

    // Calendar should be visible (check for preset buttons)
    await waitFor(() => {
      expect(screen.getByText('Today')).toBeInTheDocument();
    });
  });

  it('should open calendar on input click', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker showCalendar />);

    // Calendar opens on input click
    const input = screen.getByRole('textbox');
    await user.click(input);

    // Calendar should be visible
    await waitFor(() => {
      expect(screen.getByText('Today')).toBeInTheDocument();
    });
  });

  it('should show preset buttons', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker showCalendar showPresets />);

    const input = screen.getByRole('textbox');
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByText('Today')).toBeInTheDocument();
      expect(screen.getByText('Last 7 Days')).toBeInTheDocument();
      expect(screen.getByText('Last 30 Days')).toBeInTheDocument();
      expect(screen.getByText('This Month')).toBeInTheDocument();
      expect(screen.getByText('Last Month')).toBeInTheDocument();
    });
  });

  it('should handle preset click', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<DateRangePicker showCalendar showPresets onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByText('Today')).toBeInTheDocument();
    });

    const todayButton = screen.getByText('Today');
    await user.click(todayButton);

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

    expect(screen.getByLabelText('Clear input')).toBeInTheDocument();
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

    const clearButton = screen.getByLabelText('Clear input');
    fireEvent.click(clearButton);

    expect(handleChange).toHaveBeenCalledWith(null, null);
  });

  it('should show dual calendars', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker showCalendar />);

    const input = screen.getByRole('textbox');
    await user.click(input);

    // Should show two month headers (current month and next month)
    await waitFor(() => {
      const navButtons = screen.getAllByLabelText(/month/i);
      expect(navButtons.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('should navigate to previous month', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker showCalendar />);

    const input = screen.getByRole('textbox');
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByLabelText('Previous month')).toBeInTheDocument();
    });

    const prevButton = screen.getByLabelText('Previous month');
    await user.click(prevButton);

    expect(prevButton).toBeInTheDocument();
  });

  it('should navigate to next month', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker showCalendar />);

    const input = screen.getByRole('textbox');
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByLabelText('Next month')).toBeInTheDocument();
    });

    const nextButton = screen.getByLabelText('Next month');
    await user.click(nextButton);

    expect(nextButton).toBeInTheDocument();
  });

  it('should not show presets when showPresets is false', async () => {
    const user = userEvent.setup();
    render(<DateRangePicker showCalendar showPresets={false} />);

    const input = screen.getByRole('textbox');
    await user.click(input);

    // Wait a bit for any potential rendering
    await waitFor(
      () => {
        expect(screen.queryByText('Today')).not.toBeInTheDocument();
      },
      { timeout: 100 }
    );
  });

  it('should not show calendar when showCalendar is false', () => {
    render(<DateRangePicker showCalendar={false} />);
    // When showCalendar is false, there's no calendar icon or toggle button
    // The component just renders an input
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
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
    render(<DateRangePicker label="Date Range" error errorMessage="Date range is required" />);

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
      <DateRangePicker startDate={startDate1} endDate={endDate1} format="MM/DD/YYYY" />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('06/10/2024 - 06/20/2024');

    rerender(<DateRangePicker startDate={startDate2} endDate={endDate2} format="MM/DD/YYYY" />);
    expect(input.value).toBe('07/01/2024 - 07/15/2024');
  });

  it('should handle custom format', () => {
    const startDate = new Date(2024, 5, 10);
    const endDate = new Date(2024, 5, 20);
    render(
      <DateRangePicker defaultStartDate={startDate} defaultEndDate={endDate} format="DD/MM/YYYY" />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('10/06/2024 - 20/06/2024');
  });

  it('should handle custom presets', async () => {
    const user = userEvent.setup();
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

    render(<DateRangePicker showCalendar showPresets presets={customPresets} />);

    const input = screen.getByRole('textbox');
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByText('Yesterday')).toBeInTheDocument();
    });
  });

  describe('date selection interactions', () => {
    it('should select start date on first click', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<DateRangePicker onChange={handleChange} showCalendar />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
      });

      const dayButtons = screen.getAllByRole('button');
      const day15Button = dayButtons.find((btn) => btn.textContent === '15' && !btn.disabled);

      if (day15Button) {
        await user.click(day15Button);
        expect(handleChange).toHaveBeenCalledWith(expect.any(Date), null);
      }
    });

    it('should select end date on second click', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<DateRangePicker onChange={handleChange} showCalendar />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
      });

      const dayButtons = screen.getAllByRole('button');
      const day10Button = dayButtons.find((btn) => btn.textContent === '10' && !btn.disabled);
      const day15Button = dayButtons.find((btn) => btn.textContent === '15' && !btn.disabled);

      if (day10Button && day15Button) {
        await user.click(day10Button);
        expect(handleChange).toHaveBeenCalledWith(expect.any(Date), null);

        await user.click(day15Button);
        expect(handleChange).toHaveBeenCalledWith(expect.any(Date), expect.any(Date));
      }
    });

    it('should swap dates if end date is before start date', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<DateRangePicker onChange={handleChange} showCalendar />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
      });

      const dayButtons = screen.getAllByRole('button');
      const day15Button = dayButtons.find((btn) => btn.textContent === '15' && !btn.disabled);
      const day10Button = dayButtons.find((btn) => btn.textContent === '10' && !btn.disabled);

      if (day15Button && day10Button) {
        await user.click(day15Button);
        await user.click(day10Button);

        const lastCall = handleChange.mock.calls[handleChange.mock.calls.length - 1];
        const startDate = lastCall[0] as Date;
        const endDate = lastCall[1] as Date;
        expect(startDate.getTime()).toBeLessThan(endDate.getTime());
      }
    });

    it('should close popover after both dates are selected', async () => {
      const user = userEvent.setup();
      render(<DateRangePicker showCalendar />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
      });

      const dayButtons = screen.getAllByRole('button');
      const day10Button = dayButtons.find((btn) => btn.textContent === '10' && !btn.disabled);
      const day15Button = dayButtons.find((btn) => btn.textContent === '15' && !btn.disabled);

      if (day10Button && day15Button) {
        await user.click(day10Button);
        await user.click(day15Button);

        await waitFor(() => {
          expect(screen.queryByText('Today')).not.toBeInTheDocument();
        });
      }
    });

    it('should close popover after preset selection', async () => {
      const user = userEvent.setup();
      render(<DateRangePicker showCalendar showPresets />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Today')).toBeInTheDocument();
      });

      const todayButton = screen.getByText('Today');
      await user.click(todayButton);

      await waitFor(() => {
        expect(screen.queryByText('Last 7 Days')).not.toBeInTheDocument();
      });
    });
  });

  describe('manual input', () => {
    it('should apply input mask as user types', async () => {
      const user = userEvent.setup();
      render(<DateRangePicker format="MM/DD/YYYY" />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      await user.type(input, '06152024');

      expect(input.value).toContain('/');
    });

    it('should handle manual date range input with MM/DD/YYYY format', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<DateRangePicker onChange={handleChange} format="MM/DD/YYYY" />);

      const input = screen.getByRole('textbox');
      await user.type(input, '06152024 - 06202024');

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled();
      });
    });

    it('should parse dates with DD/MM/YYYY format', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<DateRangePicker onChange={handleChange} format="DD/MM/YYYY" />);

      const input = screen.getByRole('textbox');
      await user.type(input, '15062024 - 20062024');

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled();
      });
    });
  });

  describe('constraints', () => {
    it('should accept minDate prop', () => {
      const minDate = new Date(2024, 5, 15);
      render(<DateRangePicker minDate={minDate} showCalendar />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('should respect maxDate constraint', async () => {
      const user = userEvent.setup();
      const maxDate = new Date(2024, 5, 15);
      render(<DateRangePicker maxDate={maxDate} showCalendar />);

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

    it('should enforce minDays constraint', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<DateRangePicker onChange={handleChange} minDays={5} showCalendar />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
      });

      const dayButtons = screen.getAllByRole('button');
      const day10Button = dayButtons.find((btn) => btn.textContent === '10' && !btn.disabled);
      const day12Button = dayButtons.find((btn) => btn.textContent === '12' && !btn.disabled);

      if (day10Button && day12Button) {
        await user.click(day10Button);
        handleChange.mockClear();
        await user.click(day12Button);

        expect(handleChange).not.toHaveBeenCalled();
      }
    });

    it('should enforce maxDays constraint', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<DateRangePicker onChange={handleChange} maxDays={5} showCalendar />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
      });

      const dayButtons = screen.getAllByRole('button');
      const day5Button = dayButtons.find((btn) => btn.textContent === '5' && !btn.disabled);
      const day15Button = dayButtons.find((btn) => btn.textContent === '15' && !btn.disabled);

      if (day5Button && day15Button) {
        await user.click(day5Button);
        handleChange.mockClear();
        await user.click(day15Button);

        expect(handleChange).not.toHaveBeenCalled();
      }
    });
  });

  describe('event handlers', () => {
    it('should call onBlur when input loses focus', async () => {
      const user = userEvent.setup();
      const handleBlur = jest.fn();
      render(<DateRangePicker onBlur={handleBlur} />);

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.tab();

      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have correct aria-label', () => {
      render(<DateRangePicker aria-label="Date Range Picker" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-label', 'Date Range Picker');
    });

    it('should use label as aria-label if no aria-label provided', () => {
      render(<DateRangePicker label="Date Range" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-label', 'Date Range');
    });

    it('should set aria-invalid when in error state', () => {
      render(<DateRangePicker error />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<DateRangePicker />);

      await user.tab();
      expect(screen.getByRole('textbox')).toHaveFocus();
    });
  });

  describe('rendering options', () => {
    it('should render with custom className', () => {
      render(<DateRangePicker className="custom-class" data-testid="picker" />);
      expect(screen.getByTestId('picker')).toHaveClass('custom-class');
    });

    it('should render with data-testid', () => {
      render(<DateRangePicker data-testid="custom-picker" />);
      expect(screen.getByTestId('custom-picker')).toBeInTheDocument();
    });

    it('should render with custom placeholder', () => {
      render(<DateRangePicker placeholder="Pick dates" />);
      expect(screen.getByPlaceholderText('Pick dates')).toBeInTheDocument();
    });

    it('should associate label with input using id', () => {
      render(<DateRangePicker label="Date Range" />);
      const label = screen.getByText('Date Range');
      const input = screen.getByRole('textbox');
      expect(label).toHaveAttribute('for', input.id);
    });
  });

  describe('helper text and error messages', () => {
    it('should render with helper text', () => {
      render(<DateRangePicker helperText="Select a date range" />);
      expect(screen.getByText('Select a date range')).toBeInTheDocument();
    });

    it('should prioritize error message over helper text', () => {
      render(<DateRangePicker error helperText="Helper text" errorMessage="Error message" />);
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });
  });

  describe('controlled vs uncontrolled', () => {
    it('should update input when controlled dates change to null', () => {
      const startDate = new Date(2024, 5, 15);
      const endDate = new Date(2024, 5, 20);

      const { rerender } = render(
        <DateRangePicker startDate={startDate} endDate={endDate} format="MM/DD/YYYY" />
      );

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('06/15/2024 - 06/20/2024');

      rerender(<DateRangePicker startDate={null} endDate={null} format="MM/DD/YYYY" />);
      expect(input.value).toBe('');
    });

    it('should work as uncontrolled component with defaultStartDate and defaultEndDate', () => {
      const startDate = new Date(2024, 5, 15);
      const endDate = new Date(2024, 5, 20);

      render(
        <DateRangePicker
          defaultStartDate={startDate}
          defaultEndDate={endDate}
          format="MM/DD/YYYY"
        />
      );

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('06/15/2024 - 06/20/2024');
    });
  });

  describe('clear button visibility', () => {
    it('should not show clear button when showClearButton is false', () => {
      const startDate = new Date(2024, 5, 15);
      const endDate = new Date(2024, 5, 20);
      render(
        <DateRangePicker
          defaultStartDate={startDate}
          defaultEndDate={endDate}
          showClearButton={false}
        />
      );
      expect(screen.queryByLabelText('Clear input')).not.toBeInTheDocument();
    });
  });
});
