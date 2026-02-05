import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NumberFilter } from './NumberFilter';
import { FilterContext } from '../FilterContext';
import type { FilterContextValue, FilterDefinition, NumberFilterConfig } from '../types';

// Mock NumberInput component
jest.mock('../../inputs/NumberInput', () => ({
  NumberInput: ({
    value,
    onChange,
    label,
    disabled,
    error,
    errorMessage,
    helperText,
    min,
    max,
    step,
    formatDisplay,
    ...rest
  }: any) => (
    <div data-testid="number-input">
      {label && <label>{label}</label>}
      <input
        type="number"
        value={value ?? ''}
        onChange={(e) => onChange?.(Number(e.target.value))}
        disabled={disabled}
        aria-invalid={error}
        min={min}
        max={max}
        step={step}
        data-format={formatDisplay ? 'custom' : undefined}
        {...rest}
      />
      {helperText && !error && <span data-testid="helper-text">{helperText}</span>}
      {error && errorMessage && <span data-testid="error-message">{errorMessage}</span>}
    </div>
  ),
}));

// Helper function to create mock filter context
const createMockContext = (
  filters: FilterDefinition[],
  values: Record<string, any> = {},
  overrides?: Partial<FilterContextValue>
): FilterContextValue => ({
  filters,
  groups: [],
  values,
  loadingFilters: new Set(),
  errors: {},
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

// Helper to create a number filter definition
const createNumberFilter = (
  id: string,
  label: string,
  config?: NumberFilterConfig
): FilterDefinition => ({
  id,
  type: 'number',
  label,
  config,
});

describe('NumberFilter', () => {
  // Suppress console.warn for expected warnings
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // 1. Basic rendering tests
  describe('rendering', () => {
    it('renders without crashing', () => {
      const filter = createNumberFilter('age', 'Age');
      const context = createMockContext([filter], { age: 0 });

      renderWithContext(<NumberFilter filterId="age" />, context);

      expect(screen.getByTestId('number-input')).toBeInTheDocument();
    });

    it('renders with default props', () => {
      const filter = createNumberFilter('quantity', 'Quantity');
      const context = createMockContext([filter], { quantity: 5 });

      renderWithContext(<NumberFilter filterId="quantity" />, context);

      expect(screen.getByTestId('number-input')).toBeInTheDocument();
      expect(screen.getByText('Quantity')).toBeInTheDocument();
    });

    it('renders with all props', () => {
      const filter = createNumberFilter('price', 'Price');
      const context = createMockContext([filter], { price: 100 });

      const { container } = renderWithContext(
        <NumberFilter
          filterId="price"
          label="Custom Price"
          showLabel
          size="lg"
          className="custom-class"
          data-testid="price-filter"
        />,
        context
      );

      const wrapper = container.querySelector('.custom-class');
      expect(wrapper).toBeInTheDocument();
      expect(screen.getByText('Custom Price')).toBeInTheDocument();
    });

    it('renders as div element', () => {
      const filter = createNumberFilter('test', 'Test');
      const context = createMockContext([filter], { test: 0 });

      const { container } = renderWithContext(<NumberFilter filterId="test" />, context);

      expect(container.firstChild?.nodeName).toBe('DIV');
    });
  });

  // 2. Filter not found tests
  describe('filter not found', () => {
    it('returns null when filter is not found', () => {
      const context = createMockContext([]);

      const { container } = renderWithContext(<NumberFilter filterId="nonexistent" />, context);

      expect(container.firstChild).toBeNull();
    });

    it('logs warning when filter is not found', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const context = createMockContext([]);

      renderWithContext(<NumberFilter filterId="missing" />, context);

      expect(warnSpy).toHaveBeenCalledWith('NumberFilter: Filter "missing" not found');
    });

    it('does not render NumberInput when filter not found', () => {
      const context = createMockContext([]);

      renderWithContext(<NumberFilter filterId="missing" />, context);

      expect(screen.queryByTestId('number-input')).not.toBeInTheDocument();
    });
  });

  // 3. Label tests
  describe('label', () => {
    it('uses filter definition label by default', () => {
      const filter = createNumberFilter('age', 'Age Label');
      const context = createMockContext([filter], { age: 25 });

      renderWithContext(<NumberFilter filterId="age" />, context);

      expect(screen.getByText('Age Label')).toBeInTheDocument();
    });

    it('uses override label when provided', () => {
      const filter = createNumberFilter('age', 'Age Label');
      const context = createMockContext([filter], { age: 25 });

      renderWithContext(<NumberFilter filterId="age" label="Custom Age" />, context);

      expect(screen.getByText('Custom Age')).toBeInTheDocument();
      expect(screen.queryByText('Age Label')).not.toBeInTheDocument();
    });

    it('shows label when showLabel is true', () => {
      const filter = createNumberFilter('age', 'Age');
      const context = createMockContext([filter], { age: 30 });

      renderWithContext(<NumberFilter filterId="age" showLabel />, context);

      expect(screen.getByText('Age')).toBeInTheDocument();
    });

    it('hides label when showLabel is false', () => {
      const filter = createNumberFilter('age', 'Age');
      const context = createMockContext([filter], { age: 30 });

      renderWithContext(<NumberFilter filterId="age" showLabel={false} />, context);

      expect(screen.queryByText('Age')).not.toBeInTheDocument();
    });

    it('passes custom label to NumberInput', () => {
      const filter = createNumberFilter('quantity', 'Quantity');
      const context = createMockContext([filter], { quantity: 10 });

      renderWithContext(<NumberFilter filterId="quantity" label="Item Count" />, context);

      expect(screen.getByText('Item Count')).toBeInTheDocument();
    });
  });

  // 4. Value tests
  describe('value', () => {
    it('displays current filter value', () => {
      const filter = createNumberFilter('age', 'Age');
      const context = createMockContext([filter], { age: 42 });

      renderWithContext(<NumberFilter filterId="age" />, context);

      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      expect(input.value).toBe('42');
    });

    it('defaults to 0 when value is undefined', () => {
      const filter = createNumberFilter('age', 'Age');
      const context = createMockContext([filter], {});

      renderWithContext(<NumberFilter filterId="age" />, context);

      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      expect(input.value).toBe('0');
    });

    it('calls setValue when value changes', () => {
      const filter = createNumberFilter('age', 'Age');
      const setFilterValue = jest.fn();
      const context = createMockContext([filter], { age: 25 }, { setFilterValue });

      renderWithContext(<NumberFilter filterId="age" />, context);

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '30' } });

      expect(setFilterValue).toHaveBeenCalledWith('age', 30);
    });

    it('handles zero as a valid value', () => {
      const filter = createNumberFilter('quantity', 'Quantity');
      const context = createMockContext([filter], { quantity: 0 });

      renderWithContext(<NumberFilter filterId="quantity" />, context);

      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      expect(input.value).toBe('0');
    });

    it('handles negative numbers', () => {
      const filter = createNumberFilter('temperature', 'Temperature');
      const context = createMockContext([filter], { temperature: -15 });

      renderWithContext(<NumberFilter filterId="temperature" />, context);

      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      expect(input.value).toBe('-15');
    });
  });

  // 5. Config tests - min, max, step
  describe('config - constraints', () => {
    it('passes min constraint from config', () => {
      const filter = createNumberFilter('age', 'Age', { min: 0 });
      const context = createMockContext([filter], { age: 5 });

      renderWithContext(<NumberFilter filterId="age" />, context);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('min', '0');
    });

    it('passes max constraint from config', () => {
      const filter = createNumberFilter('age', 'Age', { max: 100 });
      const context = createMockContext([filter], { age: 50 });

      renderWithContext(<NumberFilter filterId="age" />, context);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('max', '100');
    });

    it('passes step from config', () => {
      const filter = createNumberFilter('quantity', 'Quantity', { step: 5 });
      const context = createMockContext([filter], { quantity: 10 });

      renderWithContext(<NumberFilter filterId="quantity" />, context);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('step', '5');
    });

    it('passes all constraints together', () => {
      const filter = createNumberFilter('rating', 'Rating', {
        min: 1,
        max: 5,
        step: 0.5,
      });
      const context = createMockContext([filter], { rating: 3 });

      renderWithContext(<NumberFilter filterId="rating" />, context);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('min', '1');
      expect(input).toHaveAttribute('max', '5');
      expect(input).toHaveAttribute('step', '0.5');
    });

    it('works without any config constraints', () => {
      const filter = createNumberFilter('value', 'Value');
      const context = createMockContext([filter], { value: 42 });

      renderWithContext(<NumberFilter filterId="value" />, context);

      const input = screen.getByRole('spinbutton');
      expect(input).not.toHaveAttribute('min');
      expect(input).not.toHaveAttribute('max');
    });
  });

  // 6. Config tests - prefix and suffix
  describe('config - formatting', () => {
    it('applies prefix from config', () => {
      const filter = createNumberFilter('price', 'Price', { prefix: '$' });
      const context = createMockContext([filter], { price: 100 });

      renderWithContext(<NumberFilter filterId="price" />, context);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('data-format', 'custom');
    });

    it('applies suffix from config', () => {
      const filter = createNumberFilter('percentage', 'Percentage', { suffix: '%' });
      const context = createMockContext([filter], { percentage: 50 });

      renderWithContext(<NumberFilter filterId="percentage" />, context);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('data-format', 'custom');
    });

    it('applies both prefix and suffix from config', () => {
      const filter = createNumberFilter('price', 'Price', {
        prefix: '$',
        suffix: ' USD',
      });
      const context = createMockContext([filter], { price: 250 });

      renderWithContext(<NumberFilter filterId="price" />, context);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('data-format', 'custom');
    });

    it('does not set formatDisplay when no prefix or suffix', () => {
      const filter = createNumberFilter('quantity', 'Quantity');
      const context = createMockContext([filter], { quantity: 10 });

      renderWithContext(<NumberFilter filterId="quantity" />, context);

      const input = screen.getByRole('spinbutton');
      expect(input).not.toHaveAttribute('data-format');
    });

    it('handles empty prefix', () => {
      const filter = createNumberFilter('value', 'Value', { prefix: '' });
      const context = createMockContext([filter], { value: 100 });

      renderWithContext(<NumberFilter filterId="value" />, context);

      const input = screen.getByRole('spinbutton');
      expect(input).not.toHaveAttribute('data-format');
    });

    it('handles empty suffix', () => {
      const filter = createNumberFilter('value', 'Value', { suffix: '' });
      const context = createMockContext([filter], { value: 100 });

      renderWithContext(<NumberFilter filterId="value" />, context);

      const input = screen.getByRole('spinbutton');
      expect(input).not.toHaveAttribute('data-format');
    });
  });

  // 7. Config tests - combined
  describe('config - combined settings', () => {
    it('applies all config options together', () => {
      const filter = createNumberFilter('price', 'Price', {
        min: 0,
        max: 1000,
        step: 10,
        prefix: '$',
        suffix: '.00',
      });
      const context = createMockContext([filter], { price: 100 });

      renderWithContext(<NumberFilter filterId="price" />, context);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '1000');
      expect(input).toHaveAttribute('step', '10');
      expect(input).toHaveAttribute('data-format', 'custom');
    });

    it('works with partial config', () => {
      const filter = createNumberFilter('discount', 'Discount', {
        max: 100,
        suffix: '%',
      });
      const context = createMockContext([filter], { discount: 20 });

      renderWithContext(<NumberFilter filterId="discount" />, context);

      const input = screen.getByRole('spinbutton');
      expect(input).not.toHaveAttribute('min');
      expect(input).toHaveAttribute('max', '100');
      expect(input).toHaveAttribute('data-format', 'custom');
    });

    it('works with empty config object', () => {
      const filter = createNumberFilter('value', 'Value', {});
      const context = createMockContext([filter], { value: 50 });

      renderWithContext(<NumberFilter filterId="value" />, context);

      expect(screen.getByTestId('number-input')).toBeInTheDocument();
    });
  });

  // 8. Helper text tests
  describe('helper text', () => {
    it('displays helper text from filter definition', () => {
      const filter: FilterDefinition = {
        ...createNumberFilter('age', 'Age'),
        helperText: 'Enter your age',
      };
      const context = createMockContext([filter], { age: 25 });

      renderWithContext(<NumberFilter filterId="age" />, context);

      expect(screen.getByTestId('helper-text')).toHaveTextContent('Enter your age');
    });

    it('does not display helper text when not provided', () => {
      const filter = createNumberFilter('age', 'Age');
      const context = createMockContext([filter], { age: 25 });

      renderWithContext(<NumberFilter filterId="age" />, context);

      expect(screen.queryByTestId('helper-text')).not.toBeInTheDocument();
    });
  });

  // 9. Error state tests
  describe('error state', () => {
    it('displays error message when error exists', () => {
      const filter = createNumberFilter('age', 'Age');
      const context = createMockContext(
        [filter],
        { age: 5 },
        { errors: { age: 'Must be at least 18' } }
      );

      renderWithContext(<NumberFilter filterId="age" />, context);

      expect(screen.getByTestId('error-message')).toHaveTextContent('Must be at least 18');
    });

    it('sets error prop on NumberInput when error exists', () => {
      const filter = createNumberFilter('age', 'Age');
      const context = createMockContext([filter], { age: 5 }, { errors: { age: 'Invalid' } });

      renderWithContext(<NumberFilter filterId="age" />, context);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('does not show error when no error exists', () => {
      const filter = createNumberFilter('age', 'Age');
      const context = createMockContext([filter], { age: 25 });

      renderWithContext(<NumberFilter filterId="age" />, context);

      expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });

    it('shows error message instead of helper text', () => {
      const filter: FilterDefinition = {
        ...createNumberFilter('age', 'Age'),
        helperText: 'Enter your age',
      };
      const context = createMockContext([filter], { age: 5 }, { errors: { age: 'Too young' } });

      renderWithContext(<NumberFilter filterId="age" />, context);

      expect(screen.getByTestId('error-message')).toHaveTextContent('Too young');
      expect(screen.queryByTestId('helper-text')).not.toBeInTheDocument();
    });
  });

  // 10. Enabled/disabled state tests
  describe('enabled/disabled state', () => {
    it('is enabled by default', () => {
      const filter = createNumberFilter('age', 'Age');
      const context = createMockContext([filter], { age: 25 });

      renderWithContext(<NumberFilter filterId="age" />, context);

      const input = screen.getByRole('spinbutton');
      expect(input).not.toBeDisabled();
    });

    it('is disabled when filter is not enabled', () => {
      const filter = createNumberFilter('age', 'Age');
      const context = createMockContext(
        [filter],
        { age: 25 },
        { isFilterEnabled: jest.fn(() => false) }
      );

      renderWithContext(<NumberFilter filterId="age" />, context);

      const input = screen.getByRole('spinbutton');
      expect(input).toBeDisabled();
    });

    it('checks enabled state with correct filterId', () => {
      const filter = createNumberFilter('age', 'Age');
      const isFilterEnabled = jest.fn(() => true);
      const context = createMockContext([filter], { age: 25 }, { isFilterEnabled });

      renderWithContext(<NumberFilter filterId="age" />, context);

      expect(isFilterEnabled).toHaveBeenCalledWith('age');
    });

    it('respects disabled state from context', () => {
      const filter = createNumberFilter('salary', 'Salary');
      const context = createMockContext(
        [filter],
        { salary: 50000 },
        { isFilterEnabled: jest.fn(() => false) }
      );

      renderWithContext(<NumberFilter filterId="salary" />, context);

      const input = screen.getByRole('spinbutton');
      expect(input).toBeDisabled();
    });
  });

  // 11. Size prop tests
  describe('size prop', () => {
    it('accepts size prop sm', () => {
      const filter = createNumberFilter('age', 'Age');
      const context = createMockContext([filter], { age: 25 });

      renderWithContext(<NumberFilter filterId="age" size="sm" />, context);

      expect(screen.getByTestId('number-input')).toBeInTheDocument();
    });

    it('accepts size prop md', () => {
      const filter = createNumberFilter('age', 'Age');
      const context = createMockContext([filter], { age: 25 });

      renderWithContext(<NumberFilter filterId="age" size="md" />, context);

      expect(screen.getByTestId('number-input')).toBeInTheDocument();
    });

    it('accepts size prop lg', () => {
      const filter = createNumberFilter('age', 'Age');
      const context = createMockContext([filter], { age: 25 });

      renderWithContext(<NumberFilter filterId="age" size="lg" />, context);

      expect(screen.getByTestId('number-input')).toBeInTheDocument();
    });

    it('defaults to md size', () => {
      const filter = createNumberFilter('age', 'Age');
      const context = createMockContext([filter], { age: 25 });

      renderWithContext(<NumberFilter filterId="age" />, context);

      expect(screen.getByTestId('number-input')).toBeInTheDocument();
    });
  });

  // 12. NumberInputProps tests
  describe('numberInputProps', () => {
    it('passes additional numberInputProps to NumberInput', () => {
      const filter = createNumberFilter('age', 'Age');
      const context = createMockContext([filter], { age: 25 });

      renderWithContext(
        <NumberFilter filterId="age" numberInputProps={{ 'data-custom': 'value', width: 200 }} />,
        context
      );

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('data-custom', 'value');
    });

    it('merges numberInputProps with component props', () => {
      const filter = createNumberFilter('quantity', 'Quantity');
      const context = createMockContext([filter], { quantity: 10 });

      renderWithContext(
        <NumberFilter
          filterId="quantity"
          label="Item Count"
          numberInputProps={{ placeholder: 'Enter quantity' }}
        />,
        context
      );

      expect(screen.getByText('Item Count')).toBeInTheDocument();
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('placeholder', 'Enter quantity');
    });

    it('works without numberInputProps', () => {
      const filter = createNumberFilter('age', 'Age');
      const context = createMockContext([filter], { age: 25 });

      renderWithContext(<NumberFilter filterId="age" />, context);

      expect(screen.getByTestId('number-input')).toBeInTheDocument();
    });
  });

  // 13. Custom styling tests
  describe('custom styling', () => {
    it('accepts custom className', () => {
      const filter = createNumberFilter('age', 'Age');
      const context = createMockContext([filter], { age: 25 });

      const { container } = renderWithContext(
        <NumberFilter filterId="age" className="custom-filter" />,
        context
      );

      const wrapper = container.querySelector('.custom-filter');
      expect(wrapper).toBeInTheDocument();
    });

    it('accepts custom style prop', () => {
      const filter = createNumberFilter('age', 'Age');
      const context = createMockContext([filter], { age: 25 });

      const { container } = renderWithContext(
        <NumberFilter filterId="age" style={{ backgroundColor: 'red' }} />,
        context
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ backgroundColor: 'red' });
    });

    it('accepts id attribute', () => {
      const filter = createNumberFilter('age', 'Age');
      const context = createMockContext([filter], { age: 25 });

      const { container } = renderWithContext(
        <NumberFilter filterId="age" id="custom-id" />,
        context
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveAttribute('id', 'custom-id');
    });

    it('handles undefined className gracefully', () => {
      const filter = createNumberFilter('age', 'Age');
      const context = createMockContext([filter], { age: 25 });

      const { container } = renderWithContext(
        <NumberFilter filterId="age" className={undefined} />,
        context
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  // 14. Props spreading tests
  describe('props spreading', () => {
    it('accepts and applies data attributes', () => {
      const filter = createNumberFilter('age', 'Age');
      const context = createMockContext([filter], { age: 25 });

      renderWithContext(
        <NumberFilter filterId="age" data-testid="test-filter" data-custom="value" />,
        context
      );

      const element = screen.getByTestId('test-filter');
      expect(element).toHaveAttribute('data-custom', 'value');
    });

    it('accepts and applies title attribute', () => {
      const filter = createNumberFilter('age', 'Age');
      const context = createMockContext([filter], { age: 25 });

      const { container } = renderWithContext(
        <NumberFilter filterId="age" title="Age filter" />,
        context
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveAttribute('title', 'Age filter');
    });

    it('forwards additional HTML attributes', () => {
      const filter = createNumberFilter('age', 'Age');
      const context = createMockContext([filter], { age: 25 });

      const { container } = renderWithContext(
        <NumberFilter filterId="age" data-custom="value" id="custom-id" />,
        context
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveAttribute('data-custom', 'value');
      expect(wrapper).toHaveAttribute('id', 'custom-id');
    });
  });

  // 15. Ref forwarding tests
  describe('ref forwarding', () => {
    it('forwards ref to wrapper element', () => {
      const ref = React.createRef<HTMLDivElement>();
      const filter = createNumberFilter('age', 'Age');
      const context = createMockContext([filter], { age: 25 });

      renderWithContext(<NumberFilter ref={ref} filterId="age" />, context);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('handles callback ref', () => {
      const refCallback = jest.fn();
      const filter = createNumberFilter('age', 'Age');
      const context = createMockContext([filter], { age: 25 });

      renderWithContext(<NumberFilter ref={refCallback} filterId="age" />, context);

      expect(refCallback).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });

    it('ref is null when filter not found', () => {
      const ref = React.createRef<HTMLDivElement>();
      const context = createMockContext([]);

      renderWithContext(<NumberFilter ref={ref} filterId="missing" />, context);

      expect(ref.current).toBeNull();
    });
  });

  // 16. Edge cases tests
  describe('edge cases', () => {
    it('handles filter with empty label', () => {
      const filter = createNumberFilter('test', '');
      const context = createMockContext([filter], { test: 10 });

      renderWithContext(<NumberFilter filterId="test" />, context);

      expect(screen.getByTestId('number-input')).toBeInTheDocument();
    });

    it('handles label override with empty string', () => {
      const filter = createNumberFilter('age', 'Age');
      const context = createMockContext([filter], { age: 25 });

      renderWithContext(<NumberFilter filterId="age" label="" showLabel />, context);

      expect(screen.queryByText('Age')).not.toBeInTheDocument();
    });

    it('handles special characters in filterId', () => {
      const filter = createNumberFilter('filter-with-dashes_and_underscores', 'Special');
      const context = createMockContext([filter], { 'filter-with-dashes_and_underscores': 42 });

      renderWithContext(<NumberFilter filterId="filter-with-dashes_and_underscores" />, context);

      expect(screen.getByTestId('number-input')).toBeInTheDocument();
    });

    it('handles empty filterId gracefully', () => {
      const context = createMockContext([]);

      const { container } = renderWithContext(<NumberFilter filterId="" />, context);

      expect(container.firstChild).toBeNull();
    });

    it('handles undefined config', () => {
      const filter: FilterDefinition = {
        id: 'test',
        type: 'number',
        label: 'Test',
        config: undefined,
      };
      const context = createMockContext([filter], { test: 50 });

      renderWithContext(<NumberFilter filterId="test" />, context);

      expect(screen.getByTestId('number-input')).toBeInTheDocument();
    });

    it('handles very large numbers', () => {
      const filter = createNumberFilter('large', 'Large Number');
      const context = createMockContext([filter], { large: 9999999 });

      renderWithContext(<NumberFilter filterId="large" />, context);

      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      expect(input.value).toBe('9999999');
    });

    it('handles decimal values', () => {
      const filter = createNumberFilter('decimal', 'Decimal', { step: 0.1 });
      const context = createMockContext([filter], { decimal: 3.14 });

      renderWithContext(<NumberFilter filterId="decimal" />, context);

      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      expect(input.value).toBe('3.14');
    });

    it('handles null value from context', () => {
      const filter = createNumberFilter('nullable', 'Nullable');
      const context = createMockContext([filter], { nullable: null });

      renderWithContext(<NumberFilter filterId="nullable" />, context);

      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      expect(input.value).toBe('0');
    });
  });

  // 17. Combined props tests
  describe('combined props', () => {
    it('renders with all props and config together', () => {
      const filter: FilterDefinition = {
        ...createNumberFilter('price', 'Price', {
          min: 0,
          max: 1000,
          step: 10,
          prefix: '$',
        }),
        helperText: 'Enter price',
      };
      const context = createMockContext([filter], { price: 100 });

      const { container } = renderWithContext(
        <NumberFilter
          filterId="price"
          label="Product Price"
          showLabel
          className="price-filter"
          data-testid="price-test"
        />,
        context
      );

      expect(screen.getByText('Product Price')).toBeInTheDocument();
      expect(screen.getByTestId('helper-text')).toHaveTextContent('Enter price');
      const wrapper = container.querySelector('.price-filter');
      expect(wrapper).toBeInTheDocument();
    });

    it('renders with label override and custom props', () => {
      const filter = createNumberFilter('age', 'Age');
      const context = createMockContext([filter], { age: 30 });

      renderWithContext(
        <NumberFilter
          filterId="age"
          label="Your Age"
          showLabel
          numberInputProps={{ width: 150 }}
        />,
        context
      );

      expect(screen.getByText('Your Age')).toBeInTheDocument();
    });

    it('renders with showLabel false and custom className', () => {
      const filter = createNumberFilter('quantity', 'Quantity');
      const context = createMockContext([filter], { quantity: 5 });

      const { container } = renderWithContext(
        <NumberFilter filterId="quantity" showLabel={false} className="hidden-label" />,
        context
      );

      expect(screen.queryByText('Quantity')).not.toBeInTheDocument();
      const wrapper = container.querySelector('.hidden-label');
      expect(wrapper).toBeInTheDocument();
    });
  });

  // 18. Integration with useFilter hook tests
  describe('integration with useFilter hook', () => {
    it('retrieves filter from context', () => {
      const filter = createNumberFilter('age', 'Age');
      const getFilter = jest.fn(() => filter);
      const context = createMockContext([filter], { age: 25 }, { getFilter });

      renderWithContext(<NumberFilter filterId="age" />, context);

      expect(getFilter).toHaveBeenCalledWith('age');
    });

    it('uses value from context', () => {
      const filter = createNumberFilter('salary', 'Salary');
      const context = createMockContext([filter], { salary: 75000 });

      renderWithContext(<NumberFilter filterId="salary" />, context);

      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      expect(input.value).toBe('75000');
    });

    it('calls setFilterValue from context on change', () => {
      const filter = createNumberFilter('age', 'Age');
      const setFilterValue = jest.fn();
      const context = createMockContext([filter], { age: 25 }, { setFilterValue });

      renderWithContext(<NumberFilter filterId="age" />, context);

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '35' } });

      expect(setFilterValue).toHaveBeenCalledWith('age', 35);
    });

    it('checks isFilterEnabled from context', () => {
      const filter = createNumberFilter('age', 'Age');
      const isFilterEnabled = jest.fn(() => true);
      const context = createMockContext([filter], { age: 25 }, { isFilterEnabled });

      renderWithContext(<NumberFilter filterId="age" />, context);

      expect(isFilterEnabled).toHaveBeenCalledWith('age');
    });
  });

  // 19. Display name test
  describe('display name', () => {
    it('has correct display name', () => {
      expect(NumberFilter.displayName).toBe('NumberFilter');
    });
  });
});
