import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Autocomplete } from './Autocomplete';

const mockOptions = [
  { key: '1', label: 'Option 1' },
  { key: '2', label: 'Option 2' },
  { key: '3', label: 'Option 3' },
  { key: '4', label: 'Another Option' },
];

describe('Autocomplete', () => {
  describe('rendering', () => {
    it('should render input', () => {
      render(<Autocomplete options={mockOptions} placeholder="Search..." />);

      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('should render label', () => {
      render(<Autocomplete options={mockOptions} label="Select Option" />);

      expect(screen.getByText('Select Option')).toBeInTheDocument();
    });

    it('should not show options initially', () => {
      render(<Autocomplete options={mockOptions} />);

      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });
  });

  describe('filtering', () => {
    it('should show all options on focus', async () => {
      const user = userEvent.setup();
      render(<Autocomplete options={mockOptions} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.getByText('Option 3')).toBeInTheDocument();
        expect(screen.getByText('Another Option')).toBeInTheDocument();
      });
    });

    it('should filter options based on input', async () => {
      render(<Autocomplete options={mockOptions} />);

      const input = screen.getByRole('textbox') as HTMLInputElement;

      // Use fireEvent to trigger input change since userEvent may not work correctly here
      fireEvent.change(input, { target: { value: 'Another' } });

      // The filtered options should only include "Another Option"
      // Note: text is split by highlighting, so use function matcher
      await waitFor(
        () => {
          // Check that there's exactly one menu item (Another Option)
          const menuItems = document.querySelectorAll('[data-component="menu-item"]');
          expect(menuItems.length).toBe(1);
          // Verify the menu item contains "Another" (the highlighted part)
          expect(menuItems[0].textContent).toContain('Another');
        },
        { timeout: 2000 }
      );
    });

    it('should show no options message when no matches', async () => {
      render(<Autocomplete options={mockOptions} noOptionsMessage="Not found" />);

      const input = screen.getByRole('textbox') as HTMLInputElement;

      // Use fireEvent to trigger input change
      fireEvent.change(input, { target: { value: 'xyz' } });

      // The no options message should appear when filtering returns empty
      await waitFor(
        () => {
          expect(screen.getByTestId('autocomplete-no-options')).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });

  describe('selection', () => {
    it('should handle single selection', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<Autocomplete options={mockOptions} onChange={onChange} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Option 1'));

      expect(onChange).toHaveBeenCalledWith('1');
    });

    it('should update input value on selection', async () => {
      const user = userEvent.setup();
      render(<Autocomplete options={mockOptions} />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Option 1'));

      await waitFor(() => {
        expect(input.value).toBe('Option 1');
      });
    });

    it('should close menu after single selection', async () => {
      const user = userEvent.setup();
      render(<Autocomplete options={mockOptions} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Option 1'));

      await waitFor(() => {
        expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
      });
    });
  });

  describe('highlighting', () => {
    it('should highlight matching text by default', async () => {
      render(<Autocomplete options={mockOptions} />);

      const input = screen.getByRole('textbox') as HTMLInputElement;

      // Use fireEvent to trigger input change
      fireEvent.change(input, { target: { value: 'Option' } });

      // Wait for options to render and check for highlights
      await waitFor(
        () => {
          // CSS modules transform class names, so we use a substring selector
          const highlights = document.querySelectorAll('[class*="autocompleteHighlight"]');
          expect(highlights.length).toBeGreaterThan(0);
        },
        { timeout: 2000 }
      );
    });

    it('should not highlight when highlightMatch is false', async () => {
      render(<Autocomplete options={mockOptions} highlightMatch={false} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Option' } });

      await waitFor(() => {
        // CSS modules transform class names, so we use a substring selector
        const highlights = document.querySelectorAll('[class*="autocompleteHighlight"]');
        expect(highlights.length).toBe(0);
      });
    });
  });

  describe('custom filter', () => {
    it('should accept custom filter function', () => {
      const customFilter = (option: { key: string; label: string }, input: string) => {
        return option.label.startsWith(input);
      };

      // Verify the component accepts the filterFunction prop without errors
      render(<Autocomplete options={mockOptions} filterFunction={customFilter} />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('should show loading indicator', async () => {
      const user = userEvent.setup();
      render(<Autocomplete options={mockOptions} loading />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByTestId('autocomplete-loading')).toBeInTheDocument();
      });
    });
  });

  describe('disabled options', () => {
    it('should render disabled options', async () => {
      const user = userEvent.setup();
      const options = [...mockOptions, { key: '5', label: 'Disabled Option', disabled: true }];

      render(<Autocomplete options={options} />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      await waitFor(() => {
        const disabledItem = screen
          .getByText('Disabled Option')
          .closest('[data-component="menu-item"]');
        expect(disabledItem).toHaveAttribute('data-disabled', 'true');
      });
    });
  });

  describe('accessibility', () => {
    it('should have data-testid', () => {
      render(<Autocomplete options={mockOptions} data-testid="custom-autocomplete" />);

      expect(screen.getByTestId('custom-autocomplete')).toBeInTheDocument();
    });

    it('should have data-component attribute', () => {
      render(<Autocomplete options={mockOptions} />);

      expect(screen.getByTestId('autocomplete')).toHaveAttribute('data-component', 'autocomplete');
    });
  });
});
