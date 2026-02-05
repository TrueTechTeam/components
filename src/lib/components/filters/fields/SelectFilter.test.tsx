import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SelectFilter } from './SelectFilter';
import { FilterContext } from '../FilterContext';
import type { FilterContextValue, FilterDefinition } from '../types';

jest.mock('../../inputs/Select', () => ({
  Select: ({
    value,
    onChange,
    options,
    label,
    placeholder,
    disabled,
    error,
    errorMessage,
  }: any) => (
    <div data-testid="select-component">
      {label && <label>{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        aria-invalid={error}
      >
        <option value="">{placeholder}</option>
        {options?.map((opt: any) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && errorMessage && <span data-testid="error-message">{errorMessage}</span>}
    </div>
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
    options: [
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2' },
    ],
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
  type: 'select',
  label,
});

const renderWithContext = (ui: React.ReactElement, context: FilterContextValue) =>
  render(<FilterContext.Provider value={context}>{ui}</FilterContext.Provider>);

describe('SelectFilter', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('rendering', () => {
    it('renders with label', () => {
      const filter = createFilter('select', 'Select Filter');
      const context = createMockContext({
        filters: [filter],
        getFilter: () => filter,
      });
      renderWithContext(<SelectFilter filterId="select" />, context);
      expect(screen.getByText('Select Filter')).toBeInTheDocument();
    });

    it('returns null when filter not found', () => {
      const context = createMockContext({ getFilter: () => undefined });
      const { container } = renderWithContext(<SelectFilter filterId="nonexistent" />, context);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('disabled state', () => {
    it('disables select when filter is not enabled', () => {
      const filter = createFilter('select', 'Select Filter');
      const context = createMockContext({
        filters: [filter],
        getFilter: () => filter,
        isFilterEnabled: () => false,
      });
      renderWithContext(<SelectFilter filterId="select" />, context);
      expect(screen.getByRole('combobox')).toBeDisabled();
    });
  });

  describe('interactions', () => {
    it('calls setFilterValue when option is selected', () => {
      const setFilterValue = jest.fn();
      const filter = createFilter('select', 'Select Filter');
      const context = createMockContext({
        filters: [filter],
        getFilter: () => filter,
        setFilterValue,
      });
      renderWithContext(<SelectFilter filterId="select" />, context);
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'opt1' } });
      expect(setFilterValue).toHaveBeenCalledWith('select', 'opt1');
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      const filter = createFilter('select', 'Select Filter');
      const context = createMockContext({
        filters: [filter],
        getFilter: () => filter,
      });
      renderWithContext(<SelectFilter ref={ref} filterId="select" />, context);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
