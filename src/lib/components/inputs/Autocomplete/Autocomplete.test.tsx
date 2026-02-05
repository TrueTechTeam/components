import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Autocomplete, type AutocompleteOption } from './Autocomplete';

const mockOptions: AutocompleteOption[] = [
  { key: '1', label: 'Apple' },
  { key: '2', label: 'Banana' },
  { key: '3', label: 'Cherry' },
  { key: '4', label: 'Date' },
  { key: '5', label: 'Elderberry' },
];

const mockDisabledOptions: AutocompleteOption[] = [
  { key: '1', label: 'Apple' },
  { key: '2', label: 'Banana', disabled: true },
  { key: '3', label: 'Cherry' },
];

describe('Autocomplete', () => {
  describe('rendering', () => {
    it('should render', () => {
      render(<Autocomplete options={mockOptions} />);
      expect(screen.getByTestId('autocomplete')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Autocomplete options={mockOptions} className="custom-class" />);
      const wrapper = screen.getByTestId('autocomplete');
      expect(wrapper).toHaveClass('custom-class');
    });

    it('should render with custom data-testid', () => {
      render(<Autocomplete options={mockOptions} data-testid="custom-autocomplete" />);
      expect(screen.getByTestId('custom-autocomplete')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<Autocomplete options={mockOptions} label="Select Fruit" />);
      expect(screen.getByText('Select Fruit')).toBeInTheDocument();
    });

    it('should render with placeholder', () => {
      render(<Autocomplete options={mockOptions} placeholder="Type to search..." />);
      expect(screen.getByPlaceholderText('Type to search...')).toBeInTheDocument();
    });

    it('should render with helper text', () => {
      render(<Autocomplete options={mockOptions} helperText="Choose your favorite fruit" />);
      expect(screen.getByText('Choose your favorite fruit')).toBeInTheDocument();
    });

    it('should render with start icon', () => {
      render(<Autocomplete options={mockOptions} startIcon="search" />);
      const input = screen.getByRole('textbox');
      expect(input.parentElement?.querySelector('svg')).toBeInTheDocument();
    });

    it('should have data-component attribute', () => {
      render(<Autocomplete options={mockOptions} />);
      expect(screen.getByTestId('autocomplete')).toHaveAttribute('data-component', 'autocomplete');
    });
  });

  describe('menu interactions', () => {
    it('should open menu on input focus', async () => {
      const user = userEvent.setup();
      render(<Autocomplete options={mockOptions} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Banana')).toBeInTheDocument();
      });
    });

    it('should open menu on input change', async () => {
      render(<Autocomplete options={mockOptions} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'a' } });

      await waitFor(() => {
        // Menu should be open and showing filtered options
        expect(screen.getByTestId('popover')).toBeInTheDocument();
      });
    });

    it.skip('should filter options based on input value', async () => {
      render(<Autocomplete options={mockOptions} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'ber' } });

      await waitFor(() => {
        expect(screen.getByText('Elderberry')).toBeInTheDocument();
        expect(screen.queryByText('Apple')).not.toBeInTheDocument();
      });
    });

    it.skip('should filter options case-insensitively', async () => {
      render(<Autocomplete options={mockOptions} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'BAN' } });

      await waitFor(() => {
        expect(screen.getByText('Banana')).toBeInTheDocument();
      });
    });

    it('should show no options message when no matches found', async () => {
      render(<Autocomplete options={mockOptions} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'xyz' } });

      await waitFor(() => {
        expect(screen.getByTestId('autocomplete-no-options')).toBeInTheDocument();
        expect(screen.getByText('No options')).toBeInTheDocument();
      });
    });

    it('should show custom no options message', async () => {
      render(<Autocomplete options={mockOptions} noOptionsMessage="Nothing found" />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'xyz' } });

      await waitFor(() => {
        expect(screen.getByText('Nothing found')).toBeInTheDocument();
      });
    });

    it('should display all options when input is empty', async () => {
      const user = userEvent.setup();
      render(<Autocomplete options={mockOptions} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        mockOptions.forEach((option) => {
          expect(screen.getByText(option.label)).toBeInTheDocument();
        });
      });
    });
  });

  describe('selection - single mode', () => {
    it('should select option on click in single mode', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      render(<Autocomplete options={mockOptions} onChange={handleChange} selectionMode="single" />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Banana')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Banana'));

      expect(handleChange).toHaveBeenCalledWith('2');
    });

    it('should update input value with selected label in single mode', async () => {
      const user = userEvent.setup();
      render(<Autocomplete options={mockOptions} selectionMode="single" />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Cherry')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Cherry'));

      await waitFor(() => {
        expect(input.value).toBe('Cherry');
      });
    });

    it('should close menu after selection in single mode', async () => {
      const user = userEvent.setup();
      render(<Autocomplete options={mockOptions} selectionMode="single" />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Apple'));

      await waitFor(() => {
        expect(screen.queryByText('Banana')).not.toBeInTheDocument();
      });
    });

    it('should handle selection with disabled option', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      render(<Autocomplete options={mockDisabledOptions} onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        const disabledItem = screen.getByText('Banana').closest('[data-component="menu-item"]');
        expect(disabledItem).toHaveAttribute('data-disabled', 'true');
      });
    });
  });

  describe('selection - multi mode', () => {
    it('should handle multi selection', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      render(<Autocomplete options={mockOptions} onChange={handleChange} selectionMode="multi" />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Apple'));

      expect(handleChange).toHaveBeenCalledWith(['1']);
    });

    it('should not close menu after selection in multi mode', async () => {
      const user = userEvent.setup();
      render(<Autocomplete options={mockOptions} selectionMode="multi" />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Apple'));

      // Menu should still be open
      await waitFor(() => {
        expect(screen.getByText('Banana')).toBeInTheDocument();
      });
    });
  });

  describe('custom filter function', () => {
    it.skip('should use custom filter function', async () => {
      const customFilter = (option: AutocompleteOption, inputValue: string) => {
        return option.label.startsWith(inputValue);
      };

      render(<Autocomplete options={mockOptions} filterFunction={customFilter} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'B' } });

      await waitFor(() => {
        expect(screen.getByText('Banana')).toBeInTheDocument();
        expect(screen.queryByText('Elderberry')).not.toBeInTheDocument();
      });
    });
  });

  describe.skip('async loading', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should call onLoadOptions with debounced input value', async () => {
      const user = userEvent.setup({ delay: null });
      const loadOptions = jest.fn().mockResolvedValue([
        { key: '1', label: 'Async Option 1' },
        { key: '2', label: 'Async Option 2' },
      ]);

      render(<Autocomplete options={[]} onLoadOptions={loadOptions} debounceDelay={300} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      expect(loadOptions).not.toHaveBeenCalled();

      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(loadOptions).toHaveBeenCalledWith('test');
      });
    });

    it('should display loading state during async loading', async () => {
      const user = userEvent.setup({ delay: null });
      const loadOptions = jest.fn(() => new Promise(() => {})); // Never resolves

      render(<Autocomplete options={[]} onLoadOptions={loadOptions} debounceDelay={300} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(screen.getByTestId('autocomplete-loading')).toBeInTheDocument();
        expect(screen.getByText('Loading...')).toBeInTheDocument();
      });
    });

    it('should display async loaded options', async () => {
      const user = userEvent.setup({ delay: null });
      const loadOptions = jest.fn().mockResolvedValue([
        { key: '1', label: 'Async Apple' },
        { key: '2', label: 'Async Banana' },
      ]);

      render(<Autocomplete options={[]} onLoadOptions={loadOptions} debounceDelay={300} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(screen.getByText('Async Apple')).toBeInTheDocument();
        expect(screen.getByText('Async Banana')).toBeInTheDocument();
      });
    });

    it('should handle async loading errors gracefully', async () => {
      const user = userEvent.setup({ delay: null });
      const loadOptions = jest.fn().mockRejectedValue(new Error('Load failed'));

      render(<Autocomplete options={[]} onLoadOptions={loadOptions} debounceDelay={300} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(loadOptions).toHaveBeenCalled();
      });

      // Should not show loading after error
      await waitFor(() => {
        expect(screen.queryByTestId('autocomplete-loading')).not.toBeInTheDocument();
      });
    });

    it('should cancel async load on unmount', async () => {
      const user = userEvent.setup({ delay: null });
      let resolveFn: any;
      const loadOptions = jest.fn(
        () =>
          new Promise((resolve) => {
            resolveFn = resolve;
          })
      );

      const { unmount } = render(
        <Autocomplete options={[]} onLoadOptions={loadOptions} debounceDelay={300} />
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(loadOptions).toHaveBeenCalled();
      });

      unmount();

      // Resolve after unmount - this should not cause errors
      resolveFn([{ key: '1', label: 'Should not appear' }]);
    });

    it('should not filter async options client-side', async () => {
      const user = userEvent.setup({ delay: null });
      const loadOptions = jest.fn().mockResolvedValue([{ key: '1', label: 'Server Result' }]);

      render(<Autocomplete options={[]} onLoadOptions={loadOptions} debounceDelay={300} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(screen.getByText('Server Result')).toBeInTheDocument();
      });
    });

    it('should use controlled loading state', async () => {
      const user = userEvent.setup();
      render(<Autocomplete options={mockOptions} loading />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByTestId('autocomplete-loading')).toBeInTheDocument();
      });
    });

    it('should not load options when input is empty', async () => {
      const loadOptions = jest.fn().mockResolvedValue([]);

      render(<Autocomplete options={[]} onLoadOptions={loadOptions} debounceDelay={300} />);

      jest.advanceTimersByTime(300);

      expect(loadOptions).not.toHaveBeenCalled();
    });

    it('should handle rapid debounce changes', async () => {
      const loadOptions = jest.fn().mockResolvedValue([]);

      render(<Autocomplete options={[]} onLoadOptions={loadOptions} debounceDelay={300} />);

      const input = screen.getByRole('textbox');

      // Type multiple characters quickly using fireEvent
      fireEvent.change(input, { target: { value: 'a' } });
      jest.advanceTimersByTime(100);
      fireEvent.change(input, { target: { value: 'ab' } });
      jest.advanceTimersByTime(100);
      fireEvent.change(input, { target: { value: 'abc' } });

      // Should not have called yet
      expect(loadOptions).not.toHaveBeenCalled();

      // Now advance past debounce
      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(loadOptions).toHaveBeenCalledWith('abc');
      });
    });
  });

  describe('highlighting', () => {
    it('should highlight matching text by default', async () => {
      render(<Autocomplete options={mockOptions} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'app' } });

      await waitFor(() => {
        const highlights = document.querySelectorAll('[class*="autocompleteHighlight"]');
        expect(highlights.length).toBeGreaterThan(0);
      });
    });

    it('should not highlight when highlightMatch is false', async () => {
      render(<Autocomplete options={mockOptions} highlightMatch={false} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'app' } });

      await waitFor(() => {
        const highlights = document.querySelectorAll('[class*="autocompleteHighlight"]');
        expect(highlights.length).toBe(0);
      });
    });

    it('should highlight case-insensitively', async () => {
      render(<Autocomplete options={mockOptions} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'APP' } });

      await waitFor(() => {
        const highlights = document.querySelectorAll('[class*="autocompleteHighlight"]');
        expect(highlights.length).toBeGreaterThan(0);
      });
    });

    it('should not highlight when input is empty', async () => {
      const user = userEvent.setup();
      render(<Autocomplete options={mockOptions} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument();
      });

      // No input value, so no highlighting
      const highlights = document.querySelectorAll('[class*="autocompleteHighlight"]');
      expect(highlights.length).toBe(0);
    });
  });

  describe('callbacks', () => {
    it('should call onInputChange when input value changes', async () => {
      const handleInputChange = jest.fn();
      render(<Autocomplete options={mockOptions} onInputChange={handleInputChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'a' } });

      expect(handleInputChange).toHaveBeenCalledWith('a');
    });

    it('should call onChange with selected value', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      render(<Autocomplete options={mockOptions} onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Apple'));

      expect(handleChange).toHaveBeenCalledWith('1');
    });
  });

  describe('states', () => {
    it('should apply disabled state', () => {
      render(<Autocomplete options={mockOptions} disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('should apply error state', () => {
      render(<Autocomplete options={mockOptions} error />);
      const input = screen.getByRole('textbox');
      const container = input.parentElement;
      expect(container).toHaveAttribute('data-state', 'error');
    });

    it('should not open menu when disabled', async () => {
      const user = userEvent.setup();
      render(<Autocomplete options={mockOptions} disabled />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      expect(screen.queryByText('Apple')).not.toBeInTheDocument();
    });
  });

  describe('controlled vs uncontrolled', () => {
    it('should work in controlled mode', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = React.useState<string>('');
        return (
          <Autocomplete
            options={mockOptions}
            value={value}
            onChange={(val) => setValue(val as string)}
          />
        );
      };

      render(<TestComponent />);
      const input = screen.getByRole('textbox');

      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Apple'));

      await waitFor(() => {
        expect(input).toHaveValue('Apple');
      });
    });

    it('should work in uncontrolled mode with defaultValue', () => {
      render(<Autocomplete options={mockOptions} defaultValue="2" />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('should accept controlled value as array in multi mode', () => {
      render(<Autocomplete options={mockOptions} value={['1', '2']} selectionMode="multi" />);
      expect(screen.getByTestId('autocomplete')).toBeInTheDocument();
    });

    it('should accept defaultValue as array in multi mode', () => {
      render(
        <Autocomplete options={mockOptions} defaultValue={['1', '2']} selectionMode="multi" />
      );
      expect(screen.getByTestId('autocomplete')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle empty options array', async () => {
      const user = userEvent.setup();
      render(<Autocomplete options={[]} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByTestId('autocomplete-no-options')).toBeInTheDocument();
      });
    });

    it('should handle options with special characters in labels', async () => {
      const specialOptions: AutocompleteOption[] = [
        { key: '1', label: 'Option (with) parentheses' },
        { key: '2', label: 'Option [with] brackets' },
        { key: '3', label: 'Option {with} braces' },
      ];

      const user = userEvent.setup();
      render(<Autocomplete options={specialOptions} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Option (with) parentheses')).toBeInTheDocument();
      });
    });

    it('should handle very long option labels', async () => {
      const longOptions: AutocompleteOption[] = [
        { key: '1', label: 'This is a very long option label that might overflow the container' },
      ];

      const user = userEvent.setup();
      render(<Autocomplete options={longOptions} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(
          screen.getByText('This is a very long option label that might overflow the container')
        ).toBeInTheDocument();
      });
    });

    it('should handle rapid input changes', async () => {
      render(<Autocomplete options={mockOptions} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'abcdef' } });

      expect(input).toHaveValue('abcdef');
    });

    it('should pass through additional props', () => {
      render(<Autocomplete options={mockOptions} data-custom="test" aria-label="Search" />);
      const wrapper = screen.getByTestId('autocomplete');
      expect(wrapper).toHaveAttribute('data-custom', 'test');
    });
  });

  describe('default props', () => {
    it('should use default variant', () => {
      render(<Autocomplete options={mockOptions} />);
      expect(screen.getByTestId('autocomplete')).toBeInTheDocument();
    });

    it('should use default size', () => {
      render(<Autocomplete options={mockOptions} />);
      expect(screen.getByTestId('autocomplete')).toBeInTheDocument();
    });

    it('should use default selectionMode', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      render(<Autocomplete options={mockOptions} onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Apple'));

      // Should call with single value string, not array
      expect(handleChange).toHaveBeenCalledWith('1');
    });

    it('should use default debounceDelay', () => {
      const loadOptions = jest.fn().mockResolvedValue([]);
      render(<Autocomplete options={[]} onLoadOptions={loadOptions} />);
      expect(screen.getByTestId('autocomplete')).toBeInTheDocument();
    });

    it('should use default highlightMatch', async () => {
      render(<Autocomplete options={mockOptions} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'app' } });

      await waitFor(() => {
        const highlights = document.querySelectorAll('[class*="autocompleteHighlight"]');
        expect(highlights.length).toBeGreaterThan(0);
      });
    });
  });

  describe('HighlightedText component', () => {
    it('should render without highlight when highlight is empty', async () => {
      const user = userEvent.setup();
      render(<Autocomplete options={mockOptions} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument();
      });
    });

    it('should split text and highlight matching parts', async () => {
      render(<Autocomplete options={mockOptions} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'e' } });

      await waitFor(() => {
        const highlights = document.querySelectorAll('[class*="autocompleteHighlight"]');
        expect(highlights.length).toBeGreaterThan(0);
      });
    });

    it('should handle multiple matches in same label', async () => {
      const options: AutocompleteOption[] = [{ key: '1', label: 'ABA' }];

      render(<Autocomplete options={options} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'A' } });

      await waitFor(() => {
        const highlights = document.querySelectorAll('[class*="autocompleteHighlight"]');
        expect(highlights.length).toBeGreaterThan(0);
      });
    });
  });
});
