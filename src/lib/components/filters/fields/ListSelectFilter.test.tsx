import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ListSelectFilter } from './ListSelectFilter';
import { FilterContext } from '../FilterContext';
import type { FilterContextValue, FilterDefinition, FilterOption } from '../types';

jest.mock('../../inputs/Input', () => ({
  Input: ({ value, onChange, placeholder, disabled }: any) => (
    <input
      type="search"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      data-testid="search-input"
    />
  ),
}));

jest.mock('../../inputs/Checkbox', () => ({
  Checkbox: ({ checked, onChange, disabled, label }: any) => (
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        data-testid="checkbox"
      />
      {label}
    </label>
  ),
}));

const createMockContext = (overrides?: Partial<FilterContextValue>): FilterContextValue => ({
  filters: [],
  groups: [],
  values: {},
  loadingFilters: new Set(),
  errors: {},
  touched: new Set(),
  isDirty: false,
  activeCount: 0,
  size: 'md',
  hasPendingChanges: false,
  setFilterValue: jest.fn(),
  setFilterValues: jest.fn(),
  clearFilter: jest.fn(),
  clearAllFilters: jest.fn(),
  resetFilters: jest.fn(),
  touchFilter: jest.fn(),
  setFilterError: jest.fn(),
  validateFilters: jest.fn(),
  getFilterMeta: jest.fn(),
  isFilterActive: jest.fn(() => false),
  isFilterVisible: jest.fn(() => true),
  isFilterEnabled: jest.fn(() => true),
  getActiveFilters: jest.fn(() => ({})),
  toSearchParams: jest.fn(() => new URLSearchParams()),
  fromSearchParams: jest.fn(),
  getFilter: jest.fn(),
  getFiltersByGroup: jest.fn(),
  getUngroupedFilters: jest.fn(),
  getFilterOptions: jest.fn(() => ({
    options: [],
    loading: false,
    error: null,
    hasMore: false,
    loadMore: jest.fn(),
  })),
  reloadFilterOptions: jest.fn(),
  applyFilters: jest.fn(),
  ...overrides,
});

const createFilter = (id: string, label: string): FilterDefinition => ({
  id,
  type: 'list-select',
  label,
});

const createOptions = (count: number): FilterOption[] =>
  Array.from({ length: count }, (_, i) => ({
    value: `option-${i + 1}`,
    label: `Option ${i + 1}`,
  }));

const renderWithContext = (ui: React.ReactElement, context: FilterContextValue) =>
  render(<FilterContext.Provider value={context}>{ui}</FilterContext.Provider>);

describe('ListSelectFilter', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('rendering', () => {
    it('renders with label', () => {
      const filter = createFilter('test', 'Test Filter');
      const context = createMockContext({
        filters: [filter],
        getFilter: () => filter,
        getFilterOptions: () => ({
          options: createOptions(3),
          loading: false,
          error: null,
          hasMore: false,
          loadMore: jest.fn(),
        }),
      });
      renderWithContext(<ListSelectFilter filterId="test" />, context);
      expect(screen.getByText('Test Filter')).toBeInTheDocument();
    });

    it('renders options as checkboxes', () => {
      const filter = createFilter('test', 'Test Filter');
      const context = createMockContext({
        filters: [filter],
        getFilter: () => filter,
        getFilterOptions: () => ({
          options: createOptions(3),
          loading: false,
          error: null,
          hasMore: false,
          loadMore: jest.fn(),
        }),
      });
      renderWithContext(<ListSelectFilter filterId="test" />, context);
      expect(screen.getAllByTestId('checkbox')).toHaveLength(3);
    });

    it('returns null when filter not found', () => {
      const context = createMockContext({
        getFilter: () => undefined,
      });
      const { container } = renderWithContext(<ListSelectFilter filterId="nonexistent" />, context);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('interactions', () => {
    it('calls setFilterValue when checkbox is clicked', () => {
      const setFilterValue = jest.fn();
      const filter = createFilter('test', 'Test Filter');
      const context = createMockContext({
        filters: [filter],
        getFilter: () => filter,
        getFilterOptions: () => ({
          options: createOptions(3),
          loading: false,
          error: null,
          hasMore: false,
          loadMore: jest.fn(),
        }),
        setFilterValue,
      });
      renderWithContext(<ListSelectFilter filterId="test" />, context);
      const checkboxes = screen.getAllByTestId('checkbox');
      fireEvent.click(checkboxes[0]);
      expect(setFilterValue).toHaveBeenCalledWith('test', ['option-1']);
    });
  });

  describe('disabled state', () => {
    it('disables checkboxes when filter is not enabled', () => {
      const filter = createFilter('test', 'Test Filter');
      const context = createMockContext({
        filters: [filter],
        getFilter: () => filter,
        getFilterOptions: () => ({
          options: createOptions(2),
          loading: false,
          error: null,
          hasMore: false,
          loadMore: jest.fn(),
        }),
        isFilterEnabled: () => false,
      });
      renderWithContext(<ListSelectFilter filterId="test" />, context);
      const checkboxes = screen.getAllByTestId('checkbox');
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeDisabled();
      });
    });
  });
});
