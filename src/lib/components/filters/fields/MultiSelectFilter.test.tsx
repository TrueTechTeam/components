import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MultiSelectFilter } from './MultiSelectFilter';
import { FilterContext } from '../FilterContext';
import type { FilterContextValue, FilterDefinition } from '../types';

jest.mock('../../inputs/CheckboxGroup', () => ({
  CheckboxGroup: ({ onChange, disabled, children }: any) => (
    <div data-testid="checkbox-group" data-disabled={disabled}>
      {children}
      <button onClick={() => onChange(['option1', 'option2'])} data-testid="change-trigger">
        Change
      </button>
    </div>
  ),
  CheckboxGroupItem: ({ value, label, disabled }: any) => (
    <div data-testid={`checkbox-item-${value}`} data-disabled={disabled}>
      {label}
    </div>
  ),
}));

jest.mock('../../inputs/Checkbox', () => ({
  Checkbox: ({ checked, onChange, label, disabled }: any) => (
    <div
      data-testid="checkbox"
      data-checked={checked || undefined}
      data-disabled={disabled || undefined}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={typeof label === 'string' ? label : 'checkbox'}
      />
      <span>{typeof label === 'string' ? label : ''}</span>
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
  getFilterOptions: (filterId: string) => {
    const filter = filters.find((f) => f.id === filterId);
    return {
      options: filter?.options || [],
      loading: false,
      error: null,
      hasMore: false,
      loadMore: jest.fn(),
    };
  },
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

const createFilter = (id: string, label: string, options: any[] = []): FilterDefinition => ({
  id,
  type: 'multi-select',
  label,
  options,
});

const renderWithContext = (ui: React.ReactElement, context: FilterContextValue) =>
  render(<FilterContext.Provider value={context}>{ui}</FilterContext.Provider>);

describe('MultiSelectFilter', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('rendering', () => {
    it('renders with label', () => {
      const options = [
        { value: 'opt1', label: 'Option 1' },
        { value: 'opt2', label: 'Option 2' },
      ];
      const filter = createFilter('multi', 'Multi Select', options);
      const context = createMockContext([filter]);
      renderWithContext(<MultiSelectFilter filterId="multi" />, context);
      expect(screen.getByText('Multi Select')).toBeInTheDocument();
    });

    it('renders checkbox items', () => {
      const options = [
        { value: 'opt1', label: 'Option 1' },
        { value: 'opt2', label: 'Option 2' },
      ];
      const filter = createFilter('multi', 'Multi Select', options);
      const context = createMockContext([filter]);
      renderWithContext(<MultiSelectFilter filterId="multi" />, context);
      expect(screen.getByTestId('checkbox-item-opt1')).toBeInTheDocument();
      expect(screen.getByTestId('checkbox-item-opt2')).toBeInTheDocument();
    });

    it('returns null when filter not found', () => {
      const context = createMockContext([]);
      const { container } = renderWithContext(
        <MultiSelectFilter filterId="nonexistent" />,
        context
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe('disabled state', () => {
    it('disables checkbox group when filter is not enabled', () => {
      const options = [{ value: 'opt1', label: 'Option 1' }];
      const filter = createFilter('multi', 'Multi Select', options);
      const context = createMockContext([filter], {}, { isFilterEnabled: () => false });
      renderWithContext(<MultiSelectFilter filterId="multi" />, context);
      expect(screen.getByTestId('checkbox-group')).toHaveAttribute('data-disabled', 'true');
    });
  });

  describe('interactions', () => {
    it('calls setFilterValue when values change', () => {
      const setFilterValue = jest.fn();
      const options = [
        { value: 'opt1', label: 'Option 1' },
        { value: 'opt2', label: 'Option 2' },
      ];
      const filter = createFilter('multi', 'Multi Select', options);
      const context = createMockContext([filter], {}, { setFilterValue });
      renderWithContext(<MultiSelectFilter filterId="multi" />, context);
      fireEvent.click(screen.getByTestId('change-trigger'));
      expect(setFilterValue).toHaveBeenCalledWith('multi', ['option1', 'option2']);
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      const options = [{ value: 'opt1', label: 'Option 1' }];
      const filter = createFilter('multi', 'Multi Select', options);
      const context = createMockContext([filter]);
      renderWithContext(<MultiSelectFilter ref={ref} filterId="multi" />, context);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
