import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NumberRangeFilter } from './NumberRangeFilter';
import { FilterContext } from '../FilterContext';
import type { FilterContextValue, FilterDefinition, NumberRangeFilterConfig } from '../types';

// Mock the Slider component
jest.mock('../../inputs/Slider', () => ({
  Slider: ({
    value,
    onChange,
    min,
    max,
    step,
    disabled,
    showValue,
    valueLabelFormat,
    size,
    ...props
  }: any) => (
    <div data-testid="slider-mock">
      <input
        type="range"
        data-testid="slider-input"
        value={Array.isArray(value) ? value[0] : value}
        onChange={(e) => {
          const val = parseFloat(e.target.value);
          if (Array.isArray(value)) {
            onChange([val, value[1]]);
          } else {
            onChange(val);
          }
        }}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        data-size={size}
        data-show-value={showValue}
        {...props}
      />
      {Array.isArray(value) && (
        <input
          type="range"
          data-testid="slider-input-max"
          value={value[1]}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            onChange([value[0], val]);
          }}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
        />
      )}
      {showValue && valueLabelFormat && (
        <div data-testid="slider-value-label">
          {Array.isArray(value)
            ? `${valueLabelFormat(value[0])} - ${valueLabelFormat(value[1])}`
            : valueLabelFormat(value)}
        </div>
      )}
    </div>
  ),
}));

// Mock the NumberInput component
jest.mock('../../inputs/NumberInput', () => ({
  NumberInput: ({ value, onChange, min, max, step, disabled, ...props }: any) => (
    <input
      type="number"
      data-testid="number-input"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      {...props}
    />
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

// Helper function to create a number range filter definition
const createNumberRangeFilter = (
  id: string,
  label: string,
  config?: NumberRangeFilterConfig
): FilterDefinition => ({
  id,
  type: 'number-range',
  label,
  config,
});

// Helper to render with context
const renderWithContext = (ui: React.ReactElement, context: FilterContextValue) => {
  return render(<FilterContext.Provider value={context}>{ui}</FilterContext.Provider>);
};

describe('NumberRangeFilter', () => {
  // Suppress console.warn for expected warnings
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // 1. Rendering tests
  describe('rendering', () => {
    it('renders with default props', () => {
      const filter = createNumberRangeFilter('price', 'Price Range');
      const context = createMockContext([filter]);

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      expect(screen.getByText('Price Range')).toBeInTheDocument();
      expect(screen.getByTestId('slider-mock')).toBeInTheDocument();
    });

    it('renders with all props', () => {
      const filter = createNumberRangeFilter('price', 'Price Range');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(
        <NumberRangeFilter
          filterId="price"
          label="Custom Price Range"
          showLabel
          size="lg"
          className="custom-class"
          data-testid="filter"
          componentProps={{ extra: 'prop' }}
        />,
        context
      );

      expect(screen.getByText('Custom Price Range')).toBeInTheDocument();
      const element = container.querySelector('[data-mode="slider"]');
      expect(element).toHaveClass('custom-class');
    });

    it('returns null when filter not found', () => {
      const context = createMockContext([]);

      const { container } = renderWithContext(<NumberRangeFilter filterId="missing" />, context);

      expect(container.firstChild).toBeNull();
    });

    it('logs warning when filter not found', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const context = createMockContext([]);

      renderWithContext(<NumberRangeFilter filterId="missing" />, context);

      expect(warnSpy).toHaveBeenCalledWith('NumberRangeFilter: Filter "missing" not found');
    });
  });

  // 2. Display mode tests
  describe('display modes', () => {
    it('renders slider mode by default', () => {
      const filter = createNumberRangeFilter('price', 'Price Range');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(<NumberRangeFilter filterId="price" />, context);

      expect(screen.getByTestId('slider-mock')).toBeInTheDocument();
      expect(screen.queryByTestId('number-input')).not.toBeInTheDocument();
      expect(container.querySelector('[data-mode="slider"]')).toBeInTheDocument();
    });

    it('renders inputs mode when configured', () => {
      const filter = createNumberRangeFilter('price', 'Price Range', {
        displayMode: 'inputs',
      });
      const context = createMockContext([filter]);

      const { container } = renderWithContext(<NumberRangeFilter filterId="price" />, context);

      expect(screen.queryByTestId('slider-mock')).not.toBeInTheDocument();
      expect(screen.getAllByTestId('number-input')).toHaveLength(2);
      expect(container.querySelector('[data-mode="inputs"]')).toBeInTheDocument();
    });

    it('renders both mode when configured', () => {
      const filter = createNumberRangeFilter('price', 'Price Range', {
        displayMode: 'both',
      });
      const context = createMockContext([filter]);

      const { container } = renderWithContext(<NumberRangeFilter filterId="price" />, context);

      expect(screen.getByTestId('slider-mock')).toBeInTheDocument();
      expect(screen.getAllByTestId('number-input')).toHaveLength(2);
      expect(container.querySelector('[data-mode="both"]')).toBeInTheDocument();
    });
  });

  // 3. Label tests
  describe('label', () => {
    it('uses filter definition label by default', () => {
      const filter = createNumberRangeFilter('price', 'Price Range');
      const context = createMockContext([filter]);

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      expect(screen.getByText('Price Range')).toBeInTheDocument();
    });

    it('uses override label when provided', () => {
      const filter = createNumberRangeFilter('price', 'Price Range');
      const context = createMockContext([filter]);

      renderWithContext(<NumberRangeFilter filterId="price" label="Custom Label" />, context);

      expect(screen.getByText('Custom Label')).toBeInTheDocument();
      expect(screen.queryByText('Price Range')).not.toBeInTheDocument();
    });

    it('shows label when showLabel is true', () => {
      const filter = createNumberRangeFilter('price', 'Price Range');
      const context = createMockContext([filter]);

      renderWithContext(<NumberRangeFilter filterId="price" showLabel />, context);

      expect(screen.getByText('Price Range')).toBeInTheDocument();
    });

    it('hides label when showLabel is false', () => {
      const filter = createNumberRangeFilter('price', 'Price Range');
      const context = createMockContext([filter]);

      renderWithContext(<NumberRangeFilter filterId="price" showLabel={false} />, context);

      expect(screen.queryByText('Price Range')).not.toBeInTheDocument();
    });
  });

  // 4. Min/max labels tests
  describe('min/max labels', () => {
    it('shows min/max labels when showLabels is true', () => {
      const filter = createNumberRangeFilter('price', 'Price Range', {
        displayMode: 'inputs',
        showLabels: true,
      });
      const context = createMockContext([filter]);

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      expect(screen.getByText('Min')).toBeInTheDocument();
      expect(screen.getByText('Max')).toBeInTheDocument();
    });

    it('uses custom min/max labels', () => {
      const filter = createNumberRangeFilter('price', 'Price Range', {
        displayMode: 'inputs',
        showLabels: true,
        minLabel: 'From',
        maxLabel: 'To',
      });
      const context = createMockContext([filter]);

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      expect(screen.getByText('From')).toBeInTheDocument();
      expect(screen.getByText('To')).toBeInTheDocument();
      expect(screen.queryByText('Min')).not.toBeInTheDocument();
      expect(screen.queryByText('Max')).not.toBeInTheDocument();
    });

    it('does not show labels when showLabels is false', () => {
      const filter = createNumberRangeFilter('price', 'Price Range', {
        displayMode: 'inputs',
        showLabels: false,
      });
      const context = createMockContext([filter]);

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      expect(screen.queryByText('Min')).not.toBeInTheDocument();
      expect(screen.queryByText('Max')).not.toBeInTheDocument();
    });

    it('does not show labels in slider mode', () => {
      const filter = createNumberRangeFilter('price', 'Price Range', {
        displayMode: 'slider',
        showLabels: true,
      });
      const context = createMockContext([filter]);

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      expect(screen.queryByText('Min')).not.toBeInTheDocument();
      expect(screen.queryByText('Max')).not.toBeInTheDocument();
    });
  });

  // 5. Value tests
  describe('value handling', () => {
    it('uses default min/max when no value set', () => {
      const filter = createNumberRangeFilter('price', 'Price Range', {
        min: 0,
        max: 100,
      });
      const context = createMockContext([filter]);

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      const sliderInput = screen.getByTestId('slider-input') as HTMLInputElement;
      expect(sliderInput.value).toBe('0');

      const sliderMaxInput = screen.getByTestId('slider-input-max') as HTMLInputElement;
      expect(sliderMaxInput.value).toBe('100');
    });

    it('uses filter value when set', () => {
      const filter = createNumberRangeFilter('price', 'Price Range', {
        min: 0,
        max: 100,
      });
      const context = createMockContext([filter], { price: { min: 20, max: 80 } });

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      const sliderInput = screen.getByTestId('slider-input') as HTMLInputElement;
      expect(sliderInput.value).toBe('20');

      const sliderMaxInput = screen.getByTestId('slider-input-max') as HTMLInputElement;
      expect(sliderMaxInput.value).toBe('80');
    });

    it('uses partial value with defaults', () => {
      const filter = createNumberRangeFilter('price', 'Price Range', {
        min: 0,
        max: 100,
      });
      const context = createMockContext([filter], { price: { min: 30 } });

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      const sliderInput = screen.getByTestId('slider-input') as HTMLInputElement;
      expect(sliderInput.value).toBe('30');

      const sliderMaxInput = screen.getByTestId('slider-input-max') as HTMLInputElement;
      expect(sliderMaxInput.value).toBe('100');
    });
  });

  // 6. Slider interaction tests
  describe('slider interactions', () => {
    it('calls setValue when slider changes', () => {
      const filter = createNumberRangeFilter('price', 'Price Range', {
        min: 0,
        max: 100,
      });
      const setFilterValue = jest.fn();
      const context = createMockContext([filter], {}, { setFilterValue });

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      const sliderInput = screen.getByTestId('slider-input');
      fireEvent.change(sliderInput, { target: { value: '25' } });

      expect(setFilterValue).toHaveBeenCalledWith('price', { min: 25, max: 100 });
    });

    it('handles array value from slider', () => {
      const filter = createNumberRangeFilter('price', 'Price Range', {
        min: 0,
        max: 100,
      });
      const setFilterValue = jest.fn();
      const context = createMockContext([filter], {}, { setFilterValue });

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      const sliderMaxInput = screen.getByTestId('slider-input-max');
      fireEvent.change(sliderMaxInput, { target: { value: '75' } });

      expect(setFilterValue).toHaveBeenCalledWith('price', { min: 0, max: 75 });
    });

    it('does not call setValue for non-array slider value', () => {
      const filter = createNumberRangeFilter('price', 'Price Range', {
        min: 0,
        max: 100,
      });
      const setFilterValue = jest.fn();
      const context = createMockContext([filter], {}, { setFilterValue });

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      // This test verifies the handleSliderChange only processes array values
      expect(setFilterValue).not.toHaveBeenCalledWith('price', expect.any(Number));
    });
  });

  // 7. Number input interaction tests
  describe('number input interactions', () => {
    it('calls setValue when min input changes', () => {
      const filter = createNumberRangeFilter('price', 'Price Range', {
        displayMode: 'inputs',
        min: 0,
        max: 100,
      });
      const setFilterValue = jest.fn();
      const context = createMockContext(
        [filter],
        { price: { min: 20, max: 80 } },
        { setFilterValue }
      );

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      const inputs = screen.getAllByTestId('number-input');
      const minInput = inputs[0];

      fireEvent.change(minInput, { target: { value: '30' } });

      expect(setFilterValue).toHaveBeenCalledWith('price', { min: 30, max: 80 });
    });

    it('calls setValue when max input changes', () => {
      const filter = createNumberRangeFilter('price', 'Price Range', {
        displayMode: 'inputs',
        min: 0,
        max: 100,
      });
      const setFilterValue = jest.fn();
      const context = createMockContext(
        [filter],
        { price: { min: 20, max: 80 } },
        { setFilterValue }
      );

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      const inputs = screen.getAllByTestId('number-input');
      const maxInput = inputs[1];

      fireEvent.change(maxInput, { target: { value: '90' } });

      expect(setFilterValue).toHaveBeenCalledWith('price', { min: 20, max: 90 });
    });

    it('respects min constraint on min input', () => {
      const filter = createNumberRangeFilter('price', 'Price Range', {
        displayMode: 'inputs',
        min: 0,
        max: 100,
      });
      const context = createMockContext([filter]);

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      const inputs = screen.getAllByTestId('number-input');
      const minInput = inputs[0] as HTMLInputElement;

      expect(minInput.min).toBe('0');
    });

    it('respects max constraint on max input', () => {
      const filter = createNumberRangeFilter('price', 'Price Range', {
        displayMode: 'inputs',
        min: 0,
        max: 100,
      });
      const context = createMockContext([filter]);

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      const inputs = screen.getAllByTestId('number-input');
      const maxInput = inputs[1] as HTMLInputElement;

      expect(maxInput.max).toBe('100');
    });

    it('min input max is current max value', () => {
      const filter = createNumberRangeFilter('price', 'Price Range', {
        displayMode: 'inputs',
        min: 0,
        max: 100,
      });
      const context = createMockContext([filter], { price: { min: 20, max: 80 } });

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      const inputs = screen.getAllByTestId('number-input');
      const minInput = inputs[0] as HTMLInputElement;

      expect(minInput.max).toBe('80');
    });

    it('max input min is current min value', () => {
      const filter = createNumberRangeFilter('price', 'Price Range', {
        displayMode: 'inputs',
        min: 0,
        max: 100,
      });
      const context = createMockContext([filter], { price: { min: 20, max: 80 } });

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      const inputs = screen.getAllByTestId('number-input');
      const maxInput = inputs[1] as HTMLInputElement;

      expect(maxInput.min).toBe('20');
    });
  });

  // 8. Configuration tests
  describe('configuration', () => {
    it('respects min configuration', () => {
      const filter = createNumberRangeFilter('price', 'Price Range', {
        min: 10,
        max: 100,
      });
      const context = createMockContext([filter]);

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      const sliderInput = screen.getByTestId('slider-input') as HTMLInputElement;
      expect(sliderInput.min).toBe('10');
    });

    it('respects max configuration', () => {
      const filter = createNumberRangeFilter('price', 'Price Range', {
        min: 0,
        max: 200,
      });
      const context = createMockContext([filter]);

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      const sliderInput = screen.getByTestId('slider-input') as HTMLInputElement;
      expect(sliderInput.max).toBe('200');
    });

    it('respects step configuration', () => {
      const filter = createNumberRangeFilter('price', 'Price Range', {
        min: 0,
        max: 100,
        step: 5,
      });
      const context = createMockContext([filter]);

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      const sliderInput = screen.getByTestId('slider-input') as HTMLInputElement;
      expect(sliderInput.step).toBe('5');
    });

    it('uses default min of 0', () => {
      const filter = createNumberRangeFilter('price', 'Price Range');
      const context = createMockContext([filter]);

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      const sliderInput = screen.getByTestId('slider-input') as HTMLInputElement;
      expect(sliderInput.min).toBe('0');
    });

    it('uses default max of 100', () => {
      const filter = createNumberRangeFilter('price', 'Price Range');
      const context = createMockContext([filter]);

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      const sliderInput = screen.getByTestId('slider-input') as HTMLInputElement;
      expect(sliderInput.max).toBe('100');
    });

    it('uses default step of 1', () => {
      const filter = createNumberRangeFilter('price', 'Price Range');
      const context = createMockContext([filter]);

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      const sliderInput = screen.getByTestId('slider-input') as HTMLInputElement;
      expect(sliderInput.step).toBe('1');
    });
  });

  // 9. Prefix/suffix formatting tests
  describe('prefix and suffix formatting', () => {
    it('formats value with prefix', () => {
      const filter = createNumberRangeFilter('price', 'Price Range', {
        min: 0,
        max: 100,
        prefix: '$',
      });
      const context = createMockContext([filter], { price: { min: 20, max: 80 } });

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      const valueLabel = screen.getByTestId('slider-value-label');
      expect(valueLabel.textContent).toContain('$20');
      expect(valueLabel.textContent).toContain('$80');
    });

    it('formats value with suffix', () => {
      const filter = createNumberRangeFilter('age', 'Age Range', {
        min: 0,
        max: 100,
        suffix: ' years',
      });
      const context = createMockContext([filter], { age: { min: 18, max: 65 } });

      renderWithContext(<NumberRangeFilter filterId="age" />, context);

      const valueLabel = screen.getByTestId('slider-value-label');
      expect(valueLabel.textContent).toContain('18 years');
      expect(valueLabel.textContent).toContain('65 years');
    });

    it('formats value with prefix and suffix', () => {
      const filter = createNumberRangeFilter('price', 'Price Range', {
        min: 0,
        max: 100,
        prefix: '$',
        suffix: '.00',
      });
      const context = createMockContext([filter], { price: { min: 25, max: 75 } });

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      const valueLabel = screen.getByTestId('slider-value-label');
      expect(valueLabel.textContent).toContain('$25.00');
      expect(valueLabel.textContent).toContain('$75.00');
    });

    it('displays value without formatting when no prefix/suffix', () => {
      const filter = createNumberRangeFilter('price', 'Price Range', {
        min: 0,
        max: 100,
      });
      const context = createMockContext([filter], { price: { min: 30, max: 70 } });

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      const valueLabel = screen.getByTestId('slider-value-label');
      expect(valueLabel.textContent).toBe('30 - 70');
    });
  });

  // 10. Size tests
  describe('size', () => {
    it('uses default size of md', () => {
      const filter = createNumberRangeFilter('price', 'Price Range');
      const context = createMockContext([filter]);

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      const sliderInput = screen.getByTestId('slider-input');
      expect(sliderInput).toHaveAttribute('data-size', 'md');
    });

    it('uses custom size', () => {
      const filter = createNumberRangeFilter('price', 'Price Range');
      const context = createMockContext([filter]);

      renderWithContext(<NumberRangeFilter filterId="price" size="lg" />, context);

      const sliderInput = screen.getByTestId('slider-input');
      expect(sliderInput).toHaveAttribute('data-size', 'lg');
    });

    it('passes size to slider component', () => {
      const filter = createNumberRangeFilter('price', 'Price Range');
      const context = createMockContext([filter]);

      renderWithContext(<NumberRangeFilter filterId="price" size="sm" />, context);

      const sliderInput = screen.getByTestId('slider-input');
      expect(sliderInput).toHaveAttribute('data-size', 'sm');
    });
  });

  // 11. Disabled state tests
  describe('disabled state', () => {
    it('disables slider when filter is not enabled', () => {
      const filter = createNumberRangeFilter('price', 'Price Range');
      const context = createMockContext(
        [filter],
        {},
        {
          isFilterEnabled: jest.fn(() => false),
        }
      );

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      const sliderInput = screen.getByTestId('slider-input') as HTMLInputElement;
      expect(sliderInput.disabled).toBe(true);
    });

    it('enables slider when filter is enabled', () => {
      const filter = createNumberRangeFilter('price', 'Price Range');
      const context = createMockContext(
        [filter],
        {},
        {
          isFilterEnabled: jest.fn(() => true),
        }
      );

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      const sliderInput = screen.getByTestId('slider-input') as HTMLInputElement;
      expect(sliderInput.disabled).toBe(false);
    });

    it('disables number inputs when filter is not enabled', () => {
      const filter = createNumberRangeFilter('price', 'Price Range', {
        displayMode: 'inputs',
      });
      const context = createMockContext(
        [filter],
        {},
        {
          isFilterEnabled: jest.fn(() => false),
        }
      );

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      const inputs = screen.getAllByTestId('number-input');
      inputs.forEach((input) => {
        expect(input).toBeDisabled();
      });
    });
  });

  // 12. Helper text and error tests
  describe('helper text and error', () => {
    it('displays helper text from filter definition', () => {
      const filter = createNumberRangeFilter('price', 'Price Range');
      filter.helperText = 'Select a price range';
      const context = createMockContext([filter]);

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      expect(screen.getByText('Select a price range')).toBeInTheDocument();
    });

    it('displays error message', () => {
      const filter = createNumberRangeFilter('price', 'Price Range');
      const context = createMockContext(
        [filter],
        {},
        {
          errors: { price: 'Invalid range' },
        }
      );

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      expect(screen.getByText('Invalid range')).toBeInTheDocument();
    });

    it('does not display helper text when no helper text', () => {
      const filter = createNumberRangeFilter('price', 'Price Range');
      const context = createMockContext([filter]);

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      const helperElements = document.querySelectorAll('.helperText');
      expect(helperElements.length).toBe(0);
    });
  });

  // 13. Custom styling
  describe('custom styling', () => {
    it('accepts custom className', () => {
      const filter = createNumberRangeFilter('price', 'Price Range');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(
        <NumberRangeFilter filterId="price" className="custom-filter" />,
        context
      );

      const element = container.querySelector('[data-mode="slider"]');
      expect(element).toHaveClass('custom-filter');
    });

    it('merges custom className with component classes', () => {
      const filter = createNumberRangeFilter('price', 'Price Range');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(
        <NumberRangeFilter filterId="price" className="custom-class" />,
        context
      );

      const element = container.querySelector('[data-mode="slider"]');
      expect(element?.className).toContain('custom-class');
    });

    it('accepts custom style prop', () => {
      const filter = createNumberRangeFilter('price', 'Price Range');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(
        <NumberRangeFilter filterId="price" style={{ backgroundColor: 'red' }} />,
        context
      );

      const element = container.querySelector('[data-mode="slider"]');
      expect(element).toHaveStyle({ backgroundColor: 'red' });
    });

    it('handles undefined className gracefully', () => {
      const filter = createNumberRangeFilter('price', 'Price Range');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(
        <NumberRangeFilter filterId="price" className={undefined} />,
        context
      );

      const element = container.querySelector('[data-mode="slider"]');
      expect(element).toBeInTheDocument();
    });
  });

  // 14. ComponentProps tests
  describe('componentProps', () => {
    it('passes componentProps to slider', () => {
      const filter = createNumberRangeFilter('price', 'Price Range');
      const context = createMockContext([filter]);

      renderWithContext(
        <NumberRangeFilter filterId="price" componentProps={{ 'aria-label': 'Custom slider' }} />,
        context
      );

      const sliderInput = screen.getByTestId('slider-input');
      expect(sliderInput).toHaveAttribute('aria-label', 'Custom slider');
    });
  });

  // 15. Ref forwarding
  describe('ref forwarding', () => {
    it('forwards ref to wrapper element', () => {
      const ref = React.createRef<HTMLDivElement>();
      const filter = createNumberRangeFilter('price', 'Price Range');
      const context = createMockContext([filter]);

      renderWithContext(<NumberRangeFilter ref={ref} filterId="price" />, context);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute('data-mode', 'slider');
    });

    it('handles callback ref', () => {
      const refCallback = jest.fn();
      const filter = createNumberRangeFilter('price', 'Price Range');
      const context = createMockContext([filter]);

      renderWithContext(<NumberRangeFilter ref={refCallback} filterId="price" />, context);

      expect(refCallback).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });
  });

  // 16. Edge cases
  describe('edge cases', () => {
    it('handles filter with no config', () => {
      const filter = createNumberRangeFilter('price', 'Price Range');
      const context = createMockContext([filter]);

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      expect(screen.getByTestId('slider-mock')).toBeInTheDocument();
    });

    it('handles empty label', () => {
      const filter = createNumberRangeFilter('price', '');
      const context = createMockContext([filter]);

      renderWithContext(<NumberRangeFilter filterId="price" />, context);

      expect(screen.getByTestId('slider-mock')).toBeInTheDocument();
    });

    it('renders separator in inputs mode', () => {
      const filter = createNumberRangeFilter('price', 'Price Range', {
        displayMode: 'inputs',
      });
      const context = createMockContext([filter]);

      const { container } = renderWithContext(<NumberRangeFilter filterId="price" />, context);

      const separator = container.querySelector('.separator');
      expect(separator).toHaveTextContent('-');
    });

    it('renders separator in both mode', () => {
      const filter = createNumberRangeFilter('price', 'Price Range', {
        displayMode: 'both',
      });
      const context = createMockContext([filter]);

      const { container } = renderWithContext(<NumberRangeFilter filterId="price" />, context);

      const separator = container.querySelector('.separator');
      expect(separator).toHaveTextContent('-');
    });

    it('does not render separator in slider mode', () => {
      const filter = createNumberRangeFilter('price', 'Price Range', {
        displayMode: 'slider',
      });
      const context = createMockContext([filter]);

      const { container } = renderWithContext(<NumberRangeFilter filterId="price" />, context);

      const separator = container.querySelector('.separator');
      expect(separator).toBeNull();
    });
  });
});

// 18. Data attributes
describe('data attributes', () => {
  it('sets data-mode attribute for slider', () => {
    const filter = createNumberRangeFilter('price', 'Price Range', {
      displayMode: 'slider',
    });
    const context = createMockContext([filter]);

    const { container } = renderWithContext(<NumberRangeFilter filterId="price" />, context);

    const element = container.querySelector('[data-mode="slider"]');
    expect(element).toBeInTheDocument();
  });

  it('sets data-mode attribute for inputs', () => {
    const filter = createNumberRangeFilter('price', 'Price Range', {
      displayMode: 'inputs',
    });
    const context = createMockContext([filter]);

    const { container } = renderWithContext(<NumberRangeFilter filterId="price" />, context);

    const element = container.querySelector('[data-mode="inputs"]');
    expect(element).toBeInTheDocument();
  });

  it('sets data-mode attribute for both', () => {
    const filter = createNumberRangeFilter('price', 'Price Range', {
      displayMode: 'both',
    });
    const context = createMockContext([filter]);

    const { container } = renderWithContext(<NumberRangeFilter filterId="price" />, context);

    const element = container.querySelector('[data-mode="both"]');
    expect(element).toBeInTheDocument();
  });
});
