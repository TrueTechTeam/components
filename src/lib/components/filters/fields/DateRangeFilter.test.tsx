import React from 'react';
import { render, screen } from '@testing-library/react';
import { DateRangeFilter } from './DateRangeFilter';
import { FilterContext } from '../FilterContext';
import type {
  FilterContextValue,
  FilterDefinition,
  DateRangeValue,
  DateRangeFilterConfig,
} from '../types';

// Mock DateRangePicker component - only extract props we need
jest.mock('../../inputs/DateRangePicker', () => ({
  DateRangePicker: ({
    startDate,
    endDate,
    onChange,
    label,
    disabled,
    error,
    errorMessage,
    helperText,
  }: any) => (
    <div data-testid="date-range-picker" data-disabled={disabled} data-error={error}>
      {label && <label>{label}</label>}
      <input
        type="text"
        value={
          startDate && endDate
            ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
            : ''
        }
        onChange={(e) => {
          const dates = e.target.value.split(' - ');
          if (dates.length === 2) {
            onChange(new Date(dates[0]), new Date(dates[1]));
          }
        }}
        disabled={disabled}
        aria-invalid={error}
        data-testid="date-input"
      />
      {helperText && <span data-testid="helper-text">{helperText}</span>}
      {error && errorMessage && <span data-testid="error-message">{errorMessage}</span>}
    </div>
  ),
}));

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

const createDateRangeFilter = (
  id: string,
  label: string,
  config?: DateRangeFilterConfig
): FilterDefinition<DateRangeValue> => ({
  id,
  type: 'date-range',
  label,
  config,
});

const renderWithContext = (ui: React.ReactElement, context: FilterContextValue) => {
  return render(<FilterContext.Provider value={context}>{ui}</FilterContext.Provider>);
};

describe('DateRangeFilter', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('rendering', () => {
    it('renders the date range picker', () => {
      const filter = createDateRangeFilter('dateRange', 'Date Range');
      const context = createMockContext([filter]);
      renderWithContext(<DateRangeFilter filterId="dateRange" />, context);
      expect(screen.getByTestId('date-range-picker')).toBeInTheDocument();
    });

    it('renders with custom label', () => {
      const filter = createDateRangeFilter('dateRange', 'Date Range');
      const context = createMockContext([filter]);
      renderWithContext(<DateRangeFilter filterId="dateRange" label="Custom Label" />, context);
      expect(screen.getByText('Custom Label')).toBeInTheDocument();
    });

    it('returns null when filter not found', () => {
      const context = createMockContext([]);
      const { container } = renderWithContext(<DateRangeFilter filterId="nonexistent" />, context);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('disabled state', () => {
    it('disables picker when filter is not enabled', () => {
      const filter = createDateRangeFilter('dateRange', 'Date Range');
      const context = createMockContext(
        [filter],
        {},
        {
          isFilterEnabled: () => false,
        }
      );
      renderWithContext(<DateRangeFilter filterId="dateRange" />, context);
      expect(screen.getByTestId('date-range-picker')).toHaveAttribute('data-disabled', 'true');
    });
  });

  describe('error state', () => {
    it('shows error state when filter has error', () => {
      const filter = createDateRangeFilter('dateRange', 'Date Range');
      const context = createMockContext(
        [filter],
        {},
        {
          errors: { dateRange: 'Invalid date range' },
        }
      );
      renderWithContext(<DateRangeFilter filterId="dateRange" />, context);
      expect(screen.getByTestId('date-range-picker')).toHaveAttribute('data-error', 'true');
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      const filter = createDateRangeFilter('dateRange', 'Date Range');
      const context = createMockContext([filter]);
      renderWithContext(<DateRangeFilter ref={ref} filterId="dateRange" />, context);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
