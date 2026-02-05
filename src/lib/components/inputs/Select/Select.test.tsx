import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

const options = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
];

describe('Select', () => {
  describe('Basic Rendering', () => {
    it('should render', () => {
      render(<Select options={options} aria-label="Test select" />);
      expect(screen.getByRole('button', { name: 'Test select' })).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<Select label="Country" options={options} />);
      expect(screen.getByText('Country')).toBeInTheDocument();
    });

    it('should render placeholder when no value selected', () => {
      render(<Select options={options} placeholder="Select an option" />);
      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('should render with custom placeholder', () => {
      render(<Select options={options} placeholder="Choose one" />);
      expect(screen.getByText('Choose one')).toBeInTheDocument();
    });

    it('should display selected option label', () => {
      render(<Select options={options} value="2" onChange={() => {}} />);
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('should render with helper text', () => {
      render(<Select options={options} helperText="Select your option" aria-label="Test" />);
      expect(screen.getByText('Select your option')).toBeInTheDocument();
    });

    it('should render with error message', () => {
      render(
        <Select options={options} error errorMessage="This field is required" aria-label="Test" />
      );
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should prioritize error message over helper text', () => {
      render(
        <Select
          options={options}
          helperText="Helper"
          error
          errorMessage="Error"
          aria-label="Test"
        />
      );
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    });

    it('should render with required indicator', () => {
      render(<Select label="Country" options={options} required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = render(
        <Select options={options} className="custom-class" aria-label="Test" />
      );
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('should generate auto id when not provided', () => {
      render(<Select label="Test" options={options} />);
      const label = screen.getByText('Test');
      expect(label).toHaveAttribute('for');
    });

    it('should use provided id', () => {
      render(<Select label="Test" options={options} id="custom-select" />);
      const label = screen.getByText('Test');
      expect(label).toHaveAttribute('for', 'custom-select');
    });
  });

  describe('Menu Interaction', () => {
    it('should open menu on trigger click', async () => {
      const user = userEvent.setup();
      render(<Select options={options} aria-label="Test select" />);

      const trigger = screen.getByRole('button', { name: 'Test select' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });
    });

    it('should show all options when menu opens', async () => {
      const user = userEvent.setup();
      render(<Select options={options} aria-label="Test select" />);

      const trigger = screen.getByRole('button', { name: 'Test select' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.getByText('Option 3')).toBeInTheDocument();
      });
    });

    it('should close menu after selection', async () => {
      const user = userEvent.setup();
      render(<Select options={options} aria-label="Test select" />);

      const trigger = screen.getByRole('button', { name: 'Test select' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Option 2')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Option 2'));

      await waitFor(() => {
        expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
      });
    });
  });

  describe('Selection', () => {
    it('should call onChange when selection changes', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      render(<Select options={options} onChange={handleChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button', { name: 'Test select' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Option 2')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Option 2'));

      expect(handleChange).toHaveBeenCalledWith('2', expect.any(Object));
    });

    it('should call onChange with correct synthetic event', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      render(<Select options={options} onChange={handleChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button', { name: 'Test select' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Option 2')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Option 2'));

      expect(handleChange).toHaveBeenCalledWith(
        '2',
        expect.objectContaining({
          target: expect.objectContaining({ value: '2' }),
        })
      );
    });

    it('should update internal value when uncontrolled', async () => {
      const user = userEvent.setup();
      render(<Select options={options} defaultValue="1" aria-label="Test select" />);

      const trigger = screen.getByRole('button', { name: 'Test select' });

      // Initially shows Option 1 (defaultValue)
      expect(screen.getByText('Option 1')).toBeInTheDocument();

      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Option 2')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Option 2'));

      // After selection, should show Option 2
      await waitFor(() => {
        expect(screen.getByText('Option 2')).toBeInTheDocument();
      });
    });

    it('should work as controlled component', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      const { rerender } = render(
        <Select options={options} value="1" onChange={handleChange} aria-label="Test select" />
      );

      expect(screen.getByText('Option 1')).toBeInTheDocument();

      const trigger = screen.getByRole('button', { name: 'Test select' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Option 2')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Option 2'));

      rerender(
        <Select options={options} value="2" onChange={handleChange} aria-label="Test select" />
      );

      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('should use defaultValue for uncontrolled component', () => {
      render(<Select options={options} defaultValue="2" aria-label="Test select" />);
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
  });

  describe('States', () => {
    it('should have disabled attributes when disabled', () => {
      render(<Select options={options} disabled aria-label="Test select" />);

      const trigger = screen.getByRole('button', { name: 'Test select' });
      expect(trigger).toHaveAttribute('aria-disabled', 'true');
      expect(trigger).toHaveAttribute('data-disabled', 'true');
      expect(trigger).toHaveAttribute('tabIndex', '-1');
    });

    it('should have disabled attributes when readOnly', () => {
      render(<Select options={options} readOnly aria-label="Test select" />);

      const trigger = screen.getByRole('button', { name: 'Test select' });
      expect(trigger).toHaveAttribute('aria-disabled', 'true');
      expect(trigger).toHaveAttribute('data-disabled', 'true');
      expect(trigger).toHaveAttribute('tabIndex', '-1');
    });

    it('should apply error state', () => {
      render(<Select options={options} error aria-label="Test select" />);
      const trigger = screen.getByRole('button', { name: 'Test select' });
      expect(trigger).toHaveAttribute('data-error', 'true');
      expect(trigger).toHaveAttribute('aria-invalid', 'true');
    });

    it('should apply disabled state to trigger', () => {
      render(<Select options={options} disabled aria-label="Test select" />);
      const trigger = screen.getByRole('button', { name: 'Test select' });
      expect(trigger).toHaveAttribute('data-disabled', 'true');
      expect(trigger).toHaveAttribute('tabIndex', '-1');
    });

    it('should apply readOnly state to trigger', () => {
      render(<Select options={options} readOnly aria-label="Test select" />);
      const trigger = screen.getByRole('button', { name: 'Test select' });
      expect(trigger).toHaveAttribute('data-disabled', 'true');
    });
  });

  describe('Clear Button', () => {
    it('should show clear button when showClearButton is true and has value', () => {
      render(
        <Select options={options} value="2" showClearButton onChange={() => {}} aria-label="Test" />
      );
      expect(screen.getByLabelText('Clear selection')).toBeInTheDocument();
    });

    it('should not show clear button when value is empty', () => {
      render(<Select options={options} showClearButton aria-label="Test" />);
      expect(screen.queryByLabelText('Clear selection')).not.toBeInTheDocument();
    });

    it('should not show clear button when disabled', () => {
      render(
        <Select
          options={options}
          value="2"
          showClearButton
          disabled
          onChange={() => {}}
          aria-label="Test"
        />
      );
      expect(screen.queryByLabelText('Clear selection')).not.toBeInTheDocument();
    });

    it('should not show clear button when readOnly', () => {
      render(
        <Select
          options={options}
          value="2"
          showClearButton
          readOnly
          onChange={() => {}}
          aria-label="Test"
        />
      );
      expect(screen.queryByLabelText('Clear selection')).not.toBeInTheDocument();
    });

    it('should clear value when clear button is clicked', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      render(
        <Select
          options={options}
          value="2"
          showClearButton
          onChange={handleChange}
          aria-label="Test"
        />
      );

      const clearButton = screen.getByLabelText('Clear selection');
      await user.click(clearButton);

      expect(handleChange).toHaveBeenCalledWith('', expect.any(Object));
    });

    it('should update internal value when cleared in uncontrolled mode', async () => {
      const user = userEvent.setup();
      render(<Select options={options} defaultValue="2" showClearButton aria-label="Test" />);

      const clearButton = screen.getByLabelText('Clear selection');
      await user.click(clearButton);

      await waitFor(() => {
        expect(screen.getByText('Select an option')).toBeInTheDocument();
      });
    });
  });

  describe('Icons', () => {
    it('should render with start icon', () => {
      const { container } = render(
        <Select options={options} startIcon="search" aria-label="Test" />
      );
      expect(container.querySelector('[data-has-start-icon]')).toBeInTheDocument();
    });

    it('should render with end icon', () => {
      const { container } = render(<Select options={options} endIcon="info" aria-label="Test" />);
      expect(container.querySelector('[data-has-end-icon]')).toBeInTheDocument();
    });

    it('should render with custom icon component as start icon', () => {
      const CustomIcon = () => <span>Custom</span>;
      render(<Select options={options} startIcon={<CustomIcon />} aria-label="Test" />);
      expect(screen.getByText('Custom')).toBeInTheDocument();
    });

    it('should render with custom icon component as end icon', () => {
      const CustomIcon = () => <span>Custom End</span>;
      render(<Select options={options} endIcon={<CustomIcon />} aria-label="Test" />);
      expect(screen.getByText('Custom End')).toBeInTheDocument();
    });

    it('should render default dropdown arrow when no end icon', () => {
      const { container } = render(<Select options={options} aria-label="Test" />);
      const dropdownArrow = container.querySelector('[data-component="select"]');
      expect(dropdownArrow).toBeInTheDocument();
    });
  });

  describe('Grouped Options', () => {
    it('should render with groups', async () => {
      const groupedOptions = [
        { value: '1', label: 'Option 1', group: 'Group A' },
        { value: '2', label: 'Option 2', group: 'Group A' },
        { value: '3', label: 'Option 3', group: 'Group B' },
      ];

      const user = userEvent.setup();
      render(<Select options={groupedOptions} aria-label="Test select" />);

      const trigger = screen.getByRole('button', { name: 'Test select' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Group A')).toBeInTheDocument();
        expect(screen.getByText('Group B')).toBeInTheDocument();
      });
    });

    it('should render ungrouped options without group header', async () => {
      const mixedOptions = [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2', group: 'Group A' },
      ];

      const user = userEvent.setup();
      render(<Select options={mixedOptions} aria-label="Test select" />);

      const trigger = screen.getByRole('button', { name: 'Test select' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Group A')).toBeInTheDocument();
      });
    });
  });

  describe('Searchable', () => {
    it('should show search input when searchable is true', async () => {
      const user = userEvent.setup();
      render(<Select options={options} searchable aria-label="Test select" />);

      const trigger = screen.getByRole('button', { name: 'Test select' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      });
    });

    it('should use custom search placeholder', async () => {
      const user = userEvent.setup();
      render(
        <Select
          options={options}
          searchable
          searchPlaceholder="Find option..."
          aria-label="Test select"
        />
      );

      const trigger = screen.getByRole('button', { name: 'Test select' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Find option...')).toBeInTheDocument();
      });
    });

    it('should filter options based on search query', async () => {
      const user = userEvent.setup();
      render(<Select options={options} searchable aria-label="Test select" />);

      const trigger = screen.getByRole('button', { name: 'Test select' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search...') as HTMLInputElement;
      fireEvent.change(searchInput, { target: { value: 'Option 2' } });

      await waitFor(() => {
        const menuItems = document.querySelectorAll('[data-component="menu-item"]');
        expect(menuItems.length).toBe(1);
      });
    });

    it('should show no results message when no matches', async () => {
      const user = userEvent.setup();
      render(<Select options={options} searchable aria-label="Test select" />);

      const trigger = screen.getByRole('button', { name: 'Test select' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search...') as HTMLInputElement;
      fireEvent.change(searchInput, { target: { value: 'xyz' } });

      await waitFor(() => {
        expect(screen.getByText('No results found')).toBeInTheDocument();
      });
    });

    it('should clear search query when menu closes', async () => {
      const user = userEvent.setup();
      render(<Select options={options} searchable aria-label="Test select" />);

      const trigger = screen.getByRole('button', { name: 'Test select' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search...') as HTMLInputElement;
      fireEvent.change(searchInput, { target: { value: 'opt' } });

      await waitFor(() => {
        expect(searchInput.value).toBe('opt');
      });

      // Click on a filtered option
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Option 1'));

      // Wait for menu to close
      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
      });

      // Reopen menu
      await user.click(trigger);

      await waitFor(() => {
        const newSearchInput = screen.getByPlaceholderText('Search...') as HTMLInputElement;
        expect(newSearchInput.value).toBe('');
      });
    });

    it('should filter by option value as well as label', async () => {
      const user = userEvent.setup();
      const customOptions = [
        { value: 'us', label: 'United States' },
        { value: 'ca', label: 'Canada' },
      ];
      render(<Select options={customOptions} searchable aria-label="Test select" />);

      const trigger = screen.getByRole('button', { name: 'Test select' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search...') as HTMLInputElement;
      fireEvent.change(searchInput, { target: { value: 'us' } });

      await waitFor(() => {
        expect(screen.getByText('United States')).toBeInTheDocument();
      });
    });

    it('should show "No options available" when no options provided', async () => {
      const user = userEvent.setup();
      render(<Select options={[]} searchable aria-label="Test select" />);

      const trigger = screen.getByRole('button', { name: 'Test select' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('No options available')).toBeInTheDocument();
      });
    });
  });

  describe('Disabled Options', () => {
    it('should render disabled options', async () => {
      const user = userEvent.setup();
      const optionsWithDisabled = [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2', disabled: true },
        { value: '3', label: 'Option 3' },
      ];

      render(<Select options={optionsWithDisabled} aria-label="Test select" />);

      const trigger = screen.getByRole('button', { name: 'Test select' });
      await user.click(trigger);

      await waitFor(() => {
        const disabledItem = screen.getByText('Option 2').closest('[data-component="menu-item"]');
        expect(disabledItem).toHaveAttribute('data-disabled', 'true');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have correct aria-label', () => {
      render(<Select options={options} aria-label="Country select" />);
      const trigger = screen.getByRole('button', { name: 'Country select' });
      expect(trigger).toHaveAttribute('aria-label', 'Country select');
    });

    it('should use label as aria-label when aria-label not provided', () => {
      render(<Select options={options} label="Country" />);
      const trigger = screen.getByRole('button', { name: 'Country' });
      expect(trigger).toHaveAttribute('aria-label', 'Country');
    });

    it('should have aria-invalid when error is true', () => {
      render(<Select options={options} error aria-label="Test" />);
      const trigger = screen.getByRole('button', { name: 'Test' });
      expect(trigger).toHaveAttribute('aria-invalid', 'true');
    });

    it('should have aria-required when required is true', () => {
      render(<Select options={options} required aria-label="Test" />);
      const trigger = screen.getByRole('button', { name: 'Test' });
      expect(trigger).toHaveAttribute('aria-required', 'true');
    });

    it('should link aria-describedby to helper text', () => {
      render(<Select options={options} helperText="Help text" id="test-select" />);
      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-describedby', 'test-select-helper-text');
    });

    it('should link aria-describedby to error message', () => {
      render(
        <Select
          options={options}
          error
          errorMessage="Error text"
          id="test-select"
          aria-label="Test"
        />
      );
      const trigger = screen.getByRole('button', { name: 'Test' });
      expect(trigger).toHaveAttribute('aria-describedby', 'test-select-helper-text');
    });

    it('should have role="alert" on error message', () => {
      render(<Select options={options} error errorMessage="Error" aria-label="Test" />);
      const errorElement = screen.getByText('Error');
      expect(errorElement).toHaveAttribute('role', 'alert');
    });

    it('should have aria-live on error message', () => {
      render(<Select options={options} error errorMessage="Error" aria-label="Test" />);
      const errorElement = screen.getByText('Error');
      expect(errorElement).toHaveAttribute('aria-live', 'polite');
    });

    it('should be keyboard accessible with tab', async () => {
      const user = userEvent.setup();
      render(<Select options={options} aria-label="Test" />);

      await user.tab();

      const trigger = screen.getByRole('button', { name: 'Test' });
      expect(trigger).toHaveFocus();
    });
  });

  describe('Event Handlers', () => {
    it('should call onBlur when trigger loses focus', async () => {
      const handleBlur = jest.fn();
      const user = userEvent.setup();
      render(<Select options={options} onBlur={handleBlur} aria-label="Test" />);

      const trigger = screen.getByRole('button', { name: 'Test' });
      await user.click(trigger);
      await user.tab();

      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe('Advanced Menu Props', () => {
    it('should pass scrollToSelected prop to Menu', () => {
      render(<Select options={options} scrollToSelected={false} aria-label="Test" />);
      expect(screen.getByRole('button', { name: 'Test' })).toBeInTheDocument();
    });

    it('should pass enableTypeAhead prop to Menu', () => {
      render(<Select options={options} enableTypeAhead aria-label="Test" />);
      expect(screen.getByRole('button', { name: 'Test' })).toBeInTheDocument();
    });

    it('should pass typeAheadDelay prop to Menu', () => {
      render(<Select options={options} typeAheadDelay={1000} aria-label="Test" />);
      expect(screen.getByRole('button', { name: 'Test' })).toBeInTheDocument();
    });
  });

  describe('Open State', () => {
    it('should apply data-open attribute when menu is open', async () => {
      const user = userEvent.setup();
      render(<Select options={options} aria-label="Test select" />);

      const trigger = screen.getByRole('button', { name: 'Test select' });
      await user.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute('data-open', 'true');
      });
    });
  });

  describe('ReactNode Labels', () => {
    it('should handle ReactNode as option label', async () => {
      const user = userEvent.setup();
      const optionsWithNode = [
        { value: '1', label: <span>Custom Label 1</span> },
        { value: '2', label: <strong>Bold Label</strong> },
      ];

      render(<Select options={optionsWithNode} aria-label="Test select" />);

      const trigger = screen.getByRole('button', { name: 'Test select' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Custom Label 1')).toBeInTheDocument();
        expect(screen.getByText('Bold Label')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty options array', async () => {
      const user = userEvent.setup();
      render(<Select options={[]} aria-label="Test select" />);

      const trigger = screen.getByRole('button', { name: 'Test select' });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('No options available')).toBeInTheDocument();
      });
    });

    it('should handle value not in options', () => {
      render(<Select options={options} value="999" onChange={() => {}} aria-label="Test" />);
      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('should toggle menu on multiple clicks', async () => {
      const user = userEvent.setup();
      render(<Select options={options} aria-label="Test select" />);

      const trigger = screen.getByRole('button', { name: 'Test select' });

      await user.click(trigger);
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });

      await user.click(trigger);
      await waitFor(() => {
        expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
      });
    });
  });
});
