import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextFilter } from './TextFilter';
import { FilterContext } from '../FilterContext';
import type { FilterContextValue, FilterDefinition, TextFilterConfig } from '../types';

// Mock the Input component
jest.mock('../../inputs/Input', () => ({
  Input: ({
    value,
    onChange,
    onClear,
    label,
    placeholder,
    disabled,
    error,
    errorMessage,
    helperText,
    maxLength,
    showClearButton,
    startIcon,
    type,
    ...props
  }: any) => (
    <div data-testid="mock-input">
      {label && <label>{label}</label>}
      <input
        data-testid="input"
        type={type || 'text'}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        data-error={error}
        data-error-message={errorMessage}
        data-helper-text={helperText}
        data-max-length={maxLength}
        data-show-clear-button={showClearButton}
        data-start-icon={typeof startIcon === 'string' ? startIcon : startIcon ? 'icon' : undefined}
        {...props}
      />
      {showClearButton && value && (
        <button data-testid="clear-button" onClick={onClear}>
          Clear
        </button>
      )}
    </div>
  ),
}));

// Helper function to create mock filter context
const createMockContext = (
  filters: FilterDefinition[],
  values: Record<string, any> = {},
  errors: Record<string, string> = {},
  overrides?: Partial<FilterContextValue>
): FilterContextValue => ({
  filters,
  groups: [],
  values,
  loadingFilters: new Set(),
  errors,
  touched: new Set(),
  isDirty: false,
  activeCount: 0,
  size: 'md',
  hasPendingChanges: false,
  getFilter: (filterId: string) => filters.find((f) => f.id === filterId),
  getFiltersByGroup: () => [],
  getUngroupedFilters: () => filters,
  isFilterVisible: () => true,
  isFilterEnabled: () => true,
  getFilterOptions: () => ({
    options: [],
    loading: false,
    error: null,
    hasMore: false,
    loadMore: jest.fn(),
  }),
  reloadFilterOptions: jest.fn(),
  setFilterValue: jest.fn(),
  setFilterValues: jest.fn(),
  clearFilter: jest.fn(),
  clearAllFilters: jest.fn(),
  resetFilters: jest.fn(),
  touchFilter: jest.fn(),
  setFilterError: jest.fn(),
  validateFilters: jest.fn(() => true),
  getFilterMeta: jest.fn(),
  isFilterActive: jest.fn(() => false),
  getActiveFilters: jest.fn(() => ({})),
  toSearchParams: jest.fn(() => new URLSearchParams()),
  fromSearchParams: jest.fn(),
  applyFilters: jest.fn(),
  ...overrides,
});

// Helper to render with context
const renderWithContext = (ui: React.ReactElement, context: FilterContextValue) => {
  return render(<FilterContext.Provider value={context}>{ui}</FilterContext.Provider>);
};

// Helper to create a text filter definition
const createTextFilter = (
  id: string,
  label: string,
  config?: Partial<TextFilterConfig>
): FilterDefinition => ({
  id,
  type: 'text',
  label,
  placeholder: `Enter ${label}`,
  config,
});

describe('TextFilter', () => {
  // Mock timers for debounce testing
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // Suppress console warnings for expected warnings
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      const filter = createTextFilter('search', 'Search');
      const context = createMockContext([filter]);

      renderWithContext(<TextFilter filterId="search" />, context);

      expect(screen.getByTestId('input')).toBeInTheDocument();
    });

    it('renders with all props', () => {
      const filter = createTextFilter('search', 'Search');
      const context = createMockContext([filter]);

      renderWithContext(
        <TextFilter
          filterId="search"
          label="Custom Label"
          placeholder="Custom placeholder"
          showLabel
          size="lg"
          className="custom-class"
          data-testid="text-filter"
        />,
        context
      );

      const wrapper = screen.getByTestId('text-filter');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass('custom-class');
    });

    it('returns null when filter is not found', () => {
      const context = createMockContext([]);
      const { container } = renderWithContext(<TextFilter filterId="missing" />, context);

      expect(container.firstChild).toBeNull();
    });

    it('logs warning when filter is not found', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const context = createMockContext([]);

      renderWithContext(<TextFilter filterId="missing" />, context);

      expect(warnSpy).toHaveBeenCalledWith('TextFilter: Filter "missing" not found');
    });

    it('renders as div element', () => {
      const filter = createTextFilter('search', 'Search');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(<TextFilter filterId="search" />, context);

      expect(container.firstChild?.nodeName).toBe('DIV');
    });
  });

  describe('label', () => {
    it('uses filter definition label by default', () => {
      const filter = createTextFilter('search', 'Search Label');
      const context = createMockContext([filter]);

      renderWithContext(<TextFilter filterId="search" showLabel />, context);

      expect(screen.getByText('Search Label')).toBeInTheDocument();
    });

    it('uses override label when provided', () => {
      const filter = createTextFilter('search', 'Search Label');
      const context = createMockContext([filter]);

      renderWithContext(<TextFilter filterId="search" label="Custom Label" showLabel />, context);

      expect(screen.getByText('Custom Label')).toBeInTheDocument();
      expect(screen.queryByText('Search Label')).not.toBeInTheDocument();
    });

    it('shows label when showLabel is true', () => {
      const filter = createTextFilter('search', 'Search');
      const context = createMockContext([filter]);

      renderWithContext(<TextFilter filterId="search" showLabel />, context);

      expect(screen.getByText('Search')).toBeInTheDocument();
    });

    it('hides label when showLabel is false', () => {
      const filter = createTextFilter('search', 'Search');
      const context = createMockContext([filter]);

      renderWithContext(<TextFilter filterId="search" showLabel={false} />, context);

      expect(screen.queryByText('Search')).not.toBeInTheDocument();
    });

    it('defaults to showing label', () => {
      const filter = createTextFilter('search', 'Search');
      const context = createMockContext([filter]);

      renderWithContext(<TextFilter filterId="search" />, context);

      expect(screen.getByText('Search')).toBeInTheDocument();
    });
  });

  describe('placeholder', () => {
    it('uses filter definition placeholder by default', () => {
      const filter: FilterDefinition = {
        id: 'search',
        type: 'text',
        label: 'Search',
        placeholder: 'Type to search...',
      };
      const context = createMockContext([filter]);

      renderWithContext(<TextFilter filterId="search" />, context);

      const input = screen.getByPlaceholderText('Type to search...');
      expect(input).toBeInTheDocument();
    });

    it('uses override placeholder when provided', () => {
      const filter: FilterDefinition = {
        id: 'search',
        type: 'text',
        label: 'Search',
        placeholder: 'Type to search...',
      };
      const context = createMockContext([filter]);

      renderWithContext(<TextFilter filterId="search" placeholder="Custom placeholder" />, context);

      expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
      expect(screen.queryByPlaceholderText('Type to search...')).not.toBeInTheDocument();
    });

    it('generates placeholder from label when not defined', () => {
      const filter = createTextFilter('search', 'Search');
      delete filter.placeholder;
      const context = createMockContext([filter]);

      renderWithContext(<TextFilter filterId="search" />, context);

      expect(screen.getByPlaceholderText('Enter Search')).toBeInTheDocument();
    });
  });

  describe('value synchronization', () => {
    it('displays current filter value', () => {
      const filter = createTextFilter('search', 'Search');
      const context = createMockContext([filter], { search: 'test value' });

      renderWithContext(<TextFilter filterId="search" />, context);

      const input = screen.getByTestId('input') as HTMLInputElement;
      expect(input.value).toBe('test value');
    });

    it('syncs local value when external value changes', () => {
      const filter = createTextFilter('search', 'Search');
      const context = createMockContext([filter], { search: 'initial' });

      const { rerender } = renderWithContext(<TextFilter filterId="search" />, context);

      const input = screen.getByTestId('input') as HTMLInputElement;
      expect(input.value).toBe('initial');

      // Simulate external value change
      const updatedContext = createMockContext([filter], { search: 'updated' });
      rerender(
        <FilterContext.Provider value={updatedContext}>
          <TextFilter filterId="search" />
        </FilterContext.Provider>
      );

      expect(input.value).toBe('updated');
    });

    it('handles undefined value', () => {
      const filter = createTextFilter('search', 'Search');
      const context = createMockContext([filter], {});

      renderWithContext(<TextFilter filterId="search" />, context);

      const input = screen.getByTestId('input') as HTMLInputElement;
      expect(input.value).toBe('');
    });

    it('handles null value', () => {
      const filter = createTextFilter('search', 'Search');
      const context = createMockContext([filter], { search: null });

      renderWithContext(<TextFilter filterId="search" />, context);

      const input = screen.getByTestId('input') as HTMLInputElement;
      expect(input.value).toBe('');
    });
  });

  describe('user input', () => {
    it('updates local state immediately on input', async () => {
      const user = userEvent.setup({ delay: null });
      const filter = createTextFilter('search', 'Search');
      const setFilterValue = jest.fn();
      const context = createMockContext([filter], {}, {}, { setFilterValue });

      renderWithContext(<TextFilter filterId="search" />, context);

      const input = screen.getByTestId('input');
      await user.type(input, 'test');

      // Local state should update immediately
      expect(input).toHaveValue('test');
    });

    it('calls onChange handler', async () => {
      const user = userEvent.setup({ delay: null });
      const filter = createTextFilter('search', 'Search');
      const setFilterValue = jest.fn();
      const context = createMockContext([filter], {}, {}, { setFilterValue });

      renderWithContext(<TextFilter filterId="search" />, context);

      const input = screen.getByTestId('input');
      await user.type(input, 'a');

      expect(input).toHaveValue('a');
    });

    it('handles rapid typing', async () => {
      const user = userEvent.setup({ delay: null });
      const filter = createTextFilter('search', 'Search');
      const setFilterValue = jest.fn();
      const context = createMockContext([filter], {}, {}, { setFilterValue });

      renderWithContext(<TextFilter filterId="search" />, context);

      const input = screen.getByTestId('input');
      await user.type(input, 'testing');

      expect(input).toHaveValue('testing');
    });
  });

  describe('debounce behavior', () => {
    it('debounces filter updates by default (300ms)', async () => {
      const user = userEvent.setup({ delay: null });
      const filter = createTextFilter('search', 'Search');
      const setFilterValue = jest.fn();
      const context = createMockContext([filter], {}, {}, { setFilterValue });

      renderWithContext(<TextFilter filterId="search" />, context);

      const input = screen.getByTestId('input');
      await user.type(input, 'test');

      // Should not call setValue immediately
      expect(setFilterValue).not.toHaveBeenCalled();

      // Fast-forward time
      jest.advanceTimersByTime(300);

      // Should call setValue after debounce
      await waitFor(() => {
        expect(setFilterValue).toHaveBeenCalledWith('search', 'test');
      });
    });

    it('respects custom debounceMs from config', async () => {
      const user = userEvent.setup({ delay: null });
      const filter = createTextFilter('search', 'Search', { debounceMs: 500 });
      const setFilterValue = jest.fn();
      const context = createMockContext([filter], {}, {}, { setFilterValue });

      renderWithContext(<TextFilter filterId="search" />, context);

      const input = screen.getByTestId('input');
      await user.type(input, 'test');

      // Should not call setValue before 500ms
      jest.advanceTimersByTime(300);
      expect(setFilterValue).not.toHaveBeenCalled();

      // Should call setValue after 500ms
      jest.advanceTimersByTime(200);
      await waitFor(() => {
        expect(setFilterValue).toHaveBeenCalledWith('search', 'test');
      });
    });

    it('cancels previous debounce on new input', async () => {
      const user = userEvent.setup({ delay: null });
      const filter = createTextFilter('search', 'Search');
      const setFilterValue = jest.fn();
      const context = createMockContext([filter], {}, {}, { setFilterValue });

      renderWithContext(<TextFilter filterId="search" />, context);

      const input = screen.getByTestId('input');
      await user.type(input, 'te');

      jest.advanceTimersByTime(200);

      // Type more before debounce completes
      await user.type(input, 'st');

      // Advance to where first debounce would have fired
      jest.advanceTimersByTime(100);
      expect(setFilterValue).not.toHaveBeenCalled();

      // Advance to where second debounce fires
      jest.advanceTimersByTime(200);
      await waitFor(() => {
        expect(setFilterValue).toHaveBeenCalledTimes(1);
        expect(setFilterValue).toHaveBeenCalledWith('search', 'test');
      });
    });

    it('calls setValue immediately when debounceMs is 0', async () => {
      const user = userEvent.setup({ delay: null });
      const filter = createTextFilter('search', 'Search', { debounceMs: 0 });
      const setFilterValue = jest.fn();
      const context = createMockContext([filter], {}, {}, { setFilterValue });

      renderWithContext(<TextFilter filterId="search" />, context);

      const input = screen.getByTestId('input');
      await user.type(input, 't');

      // Should call setValue immediately (no debounce)
      await waitFor(() => {
        expect(setFilterValue).toHaveBeenCalledWith('search', 't');
      });
    });

    it('only calls setValue once for final value after debounce', async () => {
      const user = userEvent.setup({ delay: null });
      const filter = createTextFilter('search', 'Search');
      const setFilterValue = jest.fn();
      const context = createMockContext([filter], {}, {}, { setFilterValue });

      renderWithContext(<TextFilter filterId="search" />, context);

      const input = screen.getByTestId('input');
      await user.type(input, 'testing');

      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(setFilterValue).toHaveBeenCalledTimes(1);
        expect(setFilterValue).toHaveBeenCalledWith('search', 'testing');
      });
    });
  });

  describe('clear functionality', () => {
    it('clears local state when handleClear is called', async () => {
      const user = userEvent.setup({ delay: null });
      const filter = createTextFilter('search', 'Search', { showClearButton: true });
      const setFilterValue = jest.fn();
      const context = createMockContext([filter], { search: 'test' }, {}, { setFilterValue });

      renderWithContext(<TextFilter filterId="search" />, context);

      const clearButton = screen.getByTestId('clear-button');
      await user.click(clearButton);

      const input = screen.getByTestId('input') as HTMLInputElement;
      expect(input.value).toBe('');
    });

    it('calls setValue with empty string when clearing', async () => {
      const user = userEvent.setup({ delay: null });
      const filter = createTextFilter('search', 'Search', { showClearButton: true });
      const setFilterValue = jest.fn();
      const context = createMockContext([filter], { search: 'test' }, {}, { setFilterValue });

      renderWithContext(<TextFilter filterId="search" />, context);

      const clearButton = screen.getByTestId('clear-button');
      await user.click(clearButton);

      await waitFor(() => {
        expect(setFilterValue).toHaveBeenCalledWith('search', '');
      });
    });

    it('does not debounce clear action', async () => {
      const user = userEvent.setup({ delay: null });
      const filter = createTextFilter('search', 'Search', { showClearButton: true });
      const setFilterValue = jest.fn();
      const context = createMockContext([filter], { search: 'test' }, {}, { setFilterValue });

      renderWithContext(<TextFilter filterId="search" />, context);

      const clearButton = screen.getByTestId('clear-button');
      await user.click(clearButton);

      // setValue should be called immediately without debounce
      await waitFor(() => {
        expect(setFilterValue).toHaveBeenCalledWith('search', '');
      });
    });
  });

  describe('disabled state', () => {
    it('disables input when filter is not enabled', () => {
      const filter = createTextFilter('search', 'Search');
      const context = createMockContext([filter], {}, {}, { isFilterEnabled: () => false });

      renderWithContext(<TextFilter filterId="search" />, context);

      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('disabled');
    });

    it('enables input when filter is enabled', () => {
      const filter = createTextFilter('search', 'Search');
      const context = createMockContext([filter], {}, {}, { isFilterEnabled: () => true });

      renderWithContext(<TextFilter filterId="search" />, context);

      const input = screen.getByTestId('input');
      expect(input).not.toHaveAttribute('disabled');
    });
  });

  describe('error state', () => {
    it('shows error state when filter has error', () => {
      const filter = createTextFilter('search', 'Search');
      const context = createMockContext([filter], {}, { search: 'Invalid search term' });

      renderWithContext(<TextFilter filterId="search" />, context);

      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('data-error', 'true');
    });

    it('passes error message to Input', () => {
      const filter = createTextFilter('search', 'Search');
      const context = createMockContext([filter], {}, { search: 'Invalid search term' });

      renderWithContext(<TextFilter filterId="search" />, context);

      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('data-error-message', 'Invalid search term');
    });

    it('does not show error when no error exists', () => {
      const filter = createTextFilter('search', 'Search');
      const context = createMockContext([filter]);

      renderWithContext(<TextFilter filterId="search" />, context);

      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('data-error', 'false');
    });
  });

  describe('helper text', () => {
    it('passes helper text to Input', () => {
      const filter: FilterDefinition = {
        id: 'search',
        type: 'text',
        label: 'Search',
        helperText: 'Enter keywords to search',
      };
      const context = createMockContext([filter]);

      renderWithContext(<TextFilter filterId="search" />, context);

      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('data-helper-text', 'Enter keywords to search');
    });

    it('does not pass helper text when not defined', () => {
      const filter = createTextFilter('search', 'Search');
      const context = createMockContext([filter]);

      renderWithContext(<TextFilter filterId="search" />, context);

      const input = screen.getByTestId('input');
      expect(input).not.toHaveAttribute('data-helper-text');
    });
  });

  describe('config options', () => {
    it('passes inputType from config to Input', () => {
      const filter = createTextFilter('email', 'Email', { inputType: 'email' });
      const context = createMockContext([filter]);

      renderWithContext(<TextFilter filterId="email" />, context);

      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('defaults to text input type when not configured', () => {
      const filter = createTextFilter('search', 'Search');
      const context = createMockContext([filter]);

      renderWithContext(<TextFilter filterId="search" />, context);

      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('passes maxLength from config to Input', () => {
      const filter = createTextFilter('search', 'Search', { maxLength: 50 });
      const context = createMockContext([filter]);

      renderWithContext(<TextFilter filterId="search" />, context);

      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('data-max-length', '50');
    });

    it('passes showClearButton from config to Input', () => {
      const filter = createTextFilter('search', 'Search', { showClearButton: true });
      const context = createMockContext([filter]);

      renderWithContext(<TextFilter filterId="search" />, context);

      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('data-show-clear-button', 'true');
    });

    it('passes startIcon from config to Input', () => {
      const filter = createTextFilter('search', 'Search', { startIcon: 'search' as any });
      const context = createMockContext([filter]);

      renderWithContext(<TextFilter filterId="search" />, context);

      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('data-start-icon', 'search');
    });

    it('supports search input type', () => {
      const filter = createTextFilter('search', 'Search', { inputType: 'search' });
      const context = createMockContext([filter]);

      renderWithContext(<TextFilter filterId="search" />, context);

      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'search');
    });

    it('supports tel input type', () => {
      const filter = createTextFilter('phone', 'Phone', { inputType: 'tel' });
      const context = createMockContext([filter]);

      renderWithContext(<TextFilter filterId="phone" />, context);

      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'tel');
    });

    it('supports url input type', () => {
      const filter = createTextFilter('website', 'Website', { inputType: 'url' });
      const context = createMockContext([filter]);

      renderWithContext(<TextFilter filterId="website" />, context);

      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'url');
    });
  });

  describe('size prop', () => {
    it('defaults to md size', () => {
      const filter = createTextFilter('search', 'Search');
      const context = createMockContext([filter]);

      renderWithContext(<TextFilter filterId="search" />, context);

      expect(screen.getByTestId('input')).toBeInTheDocument();
    });

    it('accepts custom size prop', () => {
      const filter = createTextFilter('search', 'Search');
      const context = createMockContext([filter]);

      renderWithContext(<TextFilter filterId="search" size="lg" />, context);

      expect(screen.getByTestId('input')).toBeInTheDocument();
    });

    it('accepts sm size', () => {
      const filter = createTextFilter('search', 'Search');
      const context = createMockContext([filter]);

      renderWithContext(<TextFilter filterId="search" size="sm" />, context);

      expect(screen.getByTestId('input')).toBeInTheDocument();
    });
  });

  describe('inputProps', () => {
    it('passes additional inputProps to Input', () => {
      const filter = createTextFilter('search', 'Search');
      const context = createMockContext([filter]);

      renderWithContext(
        <TextFilter filterId="search" inputProps={{ 'data-custom': 'value' }} />,
        context
      );

      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('data-custom', 'value');
    });

    it('merges inputProps with component props', () => {
      const filter = createTextFilter('search', 'Search');
      const context = createMockContext([filter]);

      renderWithContext(
        <TextFilter filterId="search" inputProps={{ autoComplete: 'off', 'data-test': 'value' }} />,
        context
      );

      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('autoComplete', 'off');
      expect(input).toHaveAttribute('data-test', 'value');
    });
  });

  describe('custom styling', () => {
    it('accepts custom className', () => {
      const filter = createTextFilter('search', 'Search');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(
        <TextFilter filterId="search" className="custom-filter" />,
        context
      );

      expect(container.firstChild).toHaveClass('custom-filter');
    });

    it('accepts custom style prop', () => {
      const filter = createTextFilter('search', 'Search');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(
        <TextFilter filterId="search" style={{ backgroundColor: 'red' }} />,
        context
      );

      expect(container.firstChild).toHaveStyle({ backgroundColor: 'red' });
    });

    it('accepts id attribute', () => {
      const filter = createTextFilter('search', 'Search');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(
        <TextFilter filterId="search" id="custom-id" />,
        context
      );

      expect(container.firstChild).toHaveAttribute('id', 'custom-id');
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to wrapper element', () => {
      const ref = React.createRef<HTMLDivElement>();
      const filter = createTextFilter('search', 'Search');
      const context = createMockContext([filter]);

      renderWithContext(<TextFilter ref={ref} filterId="search" />, context);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('handles callback ref', () => {
      const refCallback = jest.fn();
      const filter = createTextFilter('search', 'Search');
      const context = createMockContext([filter]);

      renderWithContext(<TextFilter ref={refCallback} filterId="search" />, context);

      expect(refCallback).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });
  });

  describe('cleanup', () => {
    it('cleans up debounce timeout on unmount', async () => {
      const user = userEvent.setup({ delay: null });
      const filter = createTextFilter('search', 'Search');
      const setFilterValue = jest.fn();
      const context = createMockContext([filter], {}, {}, { setFilterValue });

      const { unmount } = renderWithContext(<TextFilter filterId="search" />, context);

      const input = screen.getByTestId('input');
      await user.type(input, 'test');

      // Unmount before debounce fires
      unmount();

      // Advance timers
      jest.advanceTimersByTime(300);

      // setValue should not be called after unmount
      expect(setFilterValue).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('handles empty filter label', () => {
      const filter: FilterDefinition = {
        id: 'search',
        type: 'text',
        label: '',
      };
      const context = createMockContext([filter]);

      renderWithContext(<TextFilter filterId="search" />, context);

      expect(screen.getByTestId('input')).toBeInTheDocument();
    });

    it('handles special characters in value', async () => {
      const user = userEvent.setup({ delay: null });
      const filter = createTextFilter('search', 'Search');
      const setFilterValue = jest.fn();
      const context = createMockContext([filter], {}, {}, { setFilterValue });

      renderWithContext(<TextFilter filterId="search" />, context);

      const input = screen.getByTestId('input');
      await user.type(input, '<script>alert("test")</script>');

      expect(input).toHaveValue('<script>alert("test")</script>');

      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(setFilterValue).toHaveBeenCalledWith('search', '<script>alert("test")</script>');
      });
    });

    it('handles unicode characters', async () => {
      const user = userEvent.setup({ delay: null });
      const filter = createTextFilter('search', 'Search');
      const context = createMockContext([filter]);

      renderWithContext(<TextFilter filterId="search" />, context);

      const input = screen.getByTestId('input');
      await user.type(input, '你好世界');

      expect(input).toHaveValue('你好世界');
    });

    it('handles empty string input', async () => {
      const user = userEvent.setup({ delay: null });
      const filter = createTextFilter('search', 'Search');
      const setFilterValue = jest.fn();
      const context = createMockContext([filter], { search: 'test' }, {}, { setFilterValue });

      renderWithContext(<TextFilter filterId="search" />, context);

      const input = screen.getByTestId('input');
      await user.clear(input);

      expect(input).toHaveValue('');

      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(setFilterValue).toHaveBeenCalledWith('search', '');
      });
    });

    it('handles very long input', async () => {
      const user = userEvent.setup({ delay: null });
      const filter = createTextFilter('search', 'Search');
      const longText = 'a'.repeat(1000);
      const context = createMockContext([filter]);

      renderWithContext(<TextFilter filterId="search" />, context);

      const input = screen.getByTestId('input');
      await user.type(input, longText);

      expect(input).toHaveValue(longText);
    });
  });

  describe('display name', () => {
    it('has correct display name', () => {
      expect(TextFilter.displayName).toBe('TextFilter');
    });
  });
});
