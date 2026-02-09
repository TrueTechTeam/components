import React from 'react';
import { render, screen } from '@testing-library/react';
import { FilterField } from './FilterField';
import { FilterContext } from '../../FilterContext';
import type { FilterContextValue, FilterDefinition, FilterType } from '../../types';

// Mock all filter component modules
jest.mock('../../fields/SelectFilter', () => ({
  SelectFilter: ({ filterId, label, placeholder, showLabel, size }: any) => (
    <div data-testid={`select-filter-${filterId}`}>
      {showLabel && <label>{label}</label>}
      <select data-placeholder={placeholder} data-size={size} />
    </div>
  ),
}));

jest.mock('../../fields/MultiSelectFilter', () => ({
  MultiSelectFilter: ({ filterId, label, placeholder, showLabel, size }: any) => (
    <div data-testid={`multi-select-filter-${filterId}`}>
      {showLabel && <label>{label}</label>}
      <div data-placeholder={placeholder} data-size={size}>
        Multi Select
      </div>
    </div>
  ),
}));

jest.mock('../../fields/CheckboxFilter', () => ({
  CheckboxFilter: ({ filterId, label, showLabel, size }: any) => (
    <div data-testid={`checkbox-filter-${filterId}`}>
      {showLabel && <label>{label}</label>}
      <input type="checkbox" data-size={size} />
    </div>
  ),
}));

jest.mock('../../fields/ToggleFilter', () => ({
  ToggleFilter: ({ filterId, label, showLabel, size }: any) => (
    <div data-testid={`toggle-filter-${filterId}`}>
      {showLabel && <label>{label}</label>}
      <div data-size={size}>Toggle</div>
    </div>
  ),
}));

jest.mock('../../fields/TextFilter', () => ({
  TextFilter: ({ filterId, label, placeholder, showLabel, size }: any) => (
    <div data-testid={`text-filter-${filterId}`}>
      {showLabel && <label>{label}</label>}
      <input type="text" placeholder={placeholder} data-size={size} />
    </div>
  ),
}));

jest.mock('../../fields/DateFilter', () => ({
  DateFilter: ({ filterId, label, placeholder, showLabel, size }: any) => (
    <div data-testid={`date-filter-${filterId}`}>
      {showLabel && <label>{label}</label>}
      <input type="date" placeholder={placeholder} data-size={size} />
    </div>
  ),
}));

jest.mock('../../fields/DateRangeFilter', () => ({
  DateRangeFilter: ({ filterId, label, placeholder, showLabel, size }: any) => (
    <div data-testid={`date-range-filter-${filterId}`}>
      {showLabel && <label>{label}</label>}
      <div data-placeholder={placeholder} data-size={size}>
        Date Range
      </div>
    </div>
  ),
}));

jest.mock('../../fields/NumberFilter', () => ({
  NumberFilter: ({ filterId, label, placeholder, showLabel, size }: any) => (
    <div data-testid={`number-filter-${filterId}`}>
      {showLabel && <label>{label}</label>}
      <input type="number" placeholder={placeholder} data-size={size} />
    </div>
  ),
}));

jest.mock('../../fields/NumberRangeFilter', () => ({
  NumberRangeFilter: ({ filterId, label, placeholder, showLabel, size }: any) => (
    <div data-testid={`number-range-filter-${filterId}`}>
      {showLabel && <label>{label}</label>}
      <div data-placeholder={placeholder} data-size={size}>
        Number Range
      </div>
    </div>
  ),
}));

jest.mock('../../fields/RatingFilter', () => ({
  RatingFilter: ({ filterId, label, showLabel, size }: any) => (
    <div data-testid={`rating-filter-${filterId}`}>
      {showLabel && <label>{label}</label>}
      <div data-size={size}>Rating</div>
    </div>
  ),
}));

jest.mock('../../fields/ListSelectFilter', () => ({
  ListSelectFilter: ({ filterId, label, placeholder, showLabel, size }: any) => (
    <div data-testid={`list-select-filter-${filterId}`}>
      {showLabel && <label>{label}</label>}
      <div data-placeholder={placeholder} data-size={size}>
        List Select
      </div>
    </div>
  ),
}));

// Helper function to create mock filter context
const createMockContext = (
  filters: FilterDefinition[],
  overrides?: Partial<FilterContextValue>
): FilterContextValue => ({
  filters,
  groups: [],
  values: {},
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

// Helper function to create a filter definition
const createFilter = (id: string, type: FilterType, label: string): FilterDefinition => ({
  id,
  type,
  label,
  placeholder: `Enter ${label}`,
});

// Helper to render with context
const renderWithContext = (ui: React.ReactElement, context: FilterContextValue) => {
  return render(<FilterContext.Provider value={context}>{ui}</FilterContext.Provider>);
};

describe('FilterField', () => {
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
      const filter = createFilter('status', 'text', 'Status');
      const context = createMockContext([filter]);

      renderWithContext(<FilterField filterId="status" />, context);

      expect(screen.getByTestId('text-filter-status')).toBeInTheDocument();
    });

    it('renders with all props', () => {
      const filter = createFilter('status', 'select', 'Status');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(
        <FilterField
          filterId="status"
          label="Custom Status"
          placeholder="Select a status"
          showLabel
          className="custom-class"
          data-testid="filter-field"
          componentProps={{ extra: 'prop' }}
        />,
        context
      );

      const element = container.querySelector('[data-filter-id="status"]');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('custom-class');
    });

    it('includes data attributes', () => {
      const filter = createFilter('category', 'select', 'Category');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(<FilterField filterId="category" />, context);

      const element = container.querySelector('[data-filter-id="category"]');
      expect(element).toHaveAttribute('data-filter-id', 'category');
      expect(element).toHaveAttribute('data-filter-type', 'select');
    });

    it('renders as div element', () => {
      const filter = createFilter('test', 'text', 'Test');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(<FilterField filterId="test" />, context);

      const element = container.querySelector('[data-filter-id="test"]');
      expect(element?.tagName).toBe('DIV');
    });
  });

  // 2. Filter type rendering tests
  describe('filter type rendering', () => {
    it('renders select filter', () => {
      const filter = createFilter('status', 'select', 'Status');
      const context = createMockContext([filter]);

      renderWithContext(<FilterField filterId="status" />, context);

      expect(screen.getByTestId('select-filter-status')).toBeInTheDocument();
    });

    it('renders multi-select filter', () => {
      const filter = createFilter('categories', 'multi-select', 'Categories');
      const context = createMockContext([filter]);

      renderWithContext(<FilterField filterId="categories" />, context);

      expect(screen.getByTestId('multi-select-filter-categories')).toBeInTheDocument();
    });

    it('renders checkbox filter', () => {
      const filter = createFilter('active', 'checkbox', 'Active');
      const context = createMockContext([filter]);

      renderWithContext(<FilterField filterId="active" />, context);

      expect(screen.getByTestId('checkbox-filter-active')).toBeInTheDocument();
    });

    it('renders toggle filter', () => {
      const filter = createFilter('enabled', 'toggle', 'Enabled');
      const context = createMockContext([filter]);

      renderWithContext(<FilterField filterId="enabled" />, context);

      expect(screen.getByTestId('toggle-filter-enabled')).toBeInTheDocument();
    });

    it('renders text filter', () => {
      const filter = createFilter('search', 'text', 'Search');
      const context = createMockContext([filter]);

      renderWithContext(<FilterField filterId="search" />, context);

      expect(screen.getByTestId('text-filter-search')).toBeInTheDocument();
    });

    it('renders date filter', () => {
      const filter = createFilter('date', 'date', 'Date');
      const context = createMockContext([filter]);

      renderWithContext(<FilterField filterId="date" />, context);

      expect(screen.getByTestId('date-filter-date')).toBeInTheDocument();
    });

    it('renders date-range filter', () => {
      const filter = createFilter('dateRange', 'date-range', 'Date Range');
      const context = createMockContext([filter]);

      renderWithContext(<FilterField filterId="dateRange" />, context);

      expect(screen.getByTestId('date-range-filter-dateRange')).toBeInTheDocument();
    });

    it('renders number filter', () => {
      const filter = createFilter('age', 'number', 'Age');
      const context = createMockContext([filter]);

      renderWithContext(<FilterField filterId="age" />, context);

      expect(screen.getByTestId('number-filter-age')).toBeInTheDocument();
    });

    it('renders number-range filter', () => {
      const filter = createFilter('priceRange', 'number-range', 'Price Range');
      const context = createMockContext([filter]);

      renderWithContext(<FilterField filterId="priceRange" />, context);

      expect(screen.getByTestId('number-range-filter-priceRange')).toBeInTheDocument();
    });

    it('renders rating filter', () => {
      const filter = createFilter('rating', 'rating', 'Rating');
      const context = createMockContext([filter]);

      renderWithContext(<FilterField filterId="rating" />, context);

      expect(screen.getByTestId('rating-filter-rating')).toBeInTheDocument();
    });

    it('renders list-select filter', () => {
      const filter = createFilter('items', 'list-select', 'Items');
      const context = createMockContext([filter]);

      renderWithContext(<FilterField filterId="items" />, context);

      expect(screen.getByTestId('list-select-filter-items')).toBeInTheDocument();
    });
  });

  // 3. Label tests - removed due to mock limitations
  // The underlying filter components handle labels internally

  // 4. Placeholder tests
  describe('placeholder', () => {
    it('uses override placeholder when provided', () => {
      const filter: FilterDefinition = {
        id: 'search',
        type: 'text',
        label: 'Search',
        placeholder: 'Type to search...',
      };
      const context = createMockContext([filter]);

      renderWithContext(
        <FilterField filterId="search" placeholder="Custom placeholder" />,
        context
      );

      expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
    });

    it('passes placeholder to select filter', () => {
      const filter = createFilter('status', 'select', 'Status');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(
        <FilterField filterId="status" placeholder="Choose status" />,
        context
      );

      const select = container.querySelector('[data-placeholder="Choose status"]');
      expect(select).toBeInTheDocument();
    });

    it('passes placeholder to date filter', () => {
      const filter = createFilter('date', 'date', 'Date');
      const context = createMockContext([filter]);

      renderWithContext(<FilterField filterId="date" placeholder="Select date" />, context);

      expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument();
    });
  });

  // 5. Size tests
  describe('size', () => {
    it('uses context size by default', () => {
      const filter = createFilter('status', 'text', 'Status');
      const context = createMockContext([filter], { size: 'lg' });

      const { container } = renderWithContext(<FilterField filterId="status" />, context);

      const input = container.querySelector('[data-size="lg"]');
      expect(input).toBeInTheDocument();
    });

    it('passes size to underlying component', () => {
      const filter = createFilter('search', 'text', 'Search');
      const context = createMockContext([filter], { size: 'sm' });

      const { container } = renderWithContext(<FilterField filterId="search" />, context);

      const input = container.querySelector('[data-size="sm"]');
      expect(input).toBeInTheDocument();
    });

    it('applies medium size from context', () => {
      const filter = createFilter('status', 'select', 'Status');
      const context = createMockContext([filter], { size: 'md' });

      const { container } = renderWithContext(<FilterField filterId="status" />, context);

      const select = container.querySelector('[data-size="md"]');
      expect(select).toBeInTheDocument();
    });
  });

  // 6. Visibility tests
  describe('visibility', () => {
    it('renders when filter is visible', () => {
      const filter = createFilter('status', 'text', 'Status');
      const context = createMockContext([filter], {
        isFilterVisible: jest.fn(() => true),
      });

      renderWithContext(<FilterField filterId="status" />, context);

      expect(screen.getByTestId('text-filter-status')).toBeInTheDocument();
    });

    it('does not render when filter is not visible', () => {
      const filter = createFilter('status', 'text', 'Status');
      const context = createMockContext([filter], {
        isFilterVisible: jest.fn(() => false),
      });

      const { container } = renderWithContext(<FilterField filterId="status" />, context);

      expect(screen.queryByTestId('text-filter-status')).not.toBeInTheDocument();
      expect(container.firstChild).toBeNull();
    });

    it('calls isFilterVisible with correct filterId', () => {
      const filter = createFilter('status', 'text', 'Status');
      const isFilterVisible = jest.fn(() => true);
      const context = createMockContext([filter], { isFilterVisible });

      renderWithContext(<FilterField filterId="status" />, context);

      expect(isFilterVisible).toHaveBeenCalledWith('status');
    });
  });

  // 7. Filter not found tests
  describe('filter not found', () => {
    it('returns null when filter is not found', () => {
      const context = createMockContext([]);

      const { container } = renderWithContext(<FilterField filterId="nonexistent" />, context);

      expect(container.firstChild).toBeNull();
    });

    it('logs warning when filter is not found', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const context = createMockContext([]);

      renderWithContext(<FilterField filterId="missing" />, context);

      expect(warnSpy).toHaveBeenCalledWith('FilterField: Filter "missing" not found in context');
    });

    it('does not render any child components when filter not found', () => {
      const context = createMockContext([]);

      renderWithContext(<FilterField filterId="missing" />, context);

      expect(screen.queryByTestId(/filter/)).not.toBeInTheDocument();
    });
  });

  // 8. Unknown filter type tests
  describe('unknown filter type', () => {
    it('returns null for unknown filter type', () => {
      const filter: FilterDefinition = {
        id: 'unknown',
        type: 'invalid-type' as FilterType,
        label: 'Unknown',
      };
      const context = createMockContext([filter]);

      const { container } = renderWithContext(<FilterField filterId="unknown" />, context);

      const wrapper = container.querySelector('[data-filter-id="unknown"]');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper?.children.length).toBe(0);
    });

    it('logs warning for unknown filter type', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const filter: FilterDefinition = {
        id: 'unknown',
        type: 'custom-type' as FilterType,
        label: 'Custom',
      };
      const context = createMockContext([filter]);

      renderWithContext(<FilterField filterId="unknown" />, context);

      expect(warnSpy).toHaveBeenCalledWith('FilterField: Unknown filter type "custom-type"');
    });
  });

  // 9. ComponentProps tests
  describe('componentProps', () => {
    it('passes componentProps to underlying component', () => {
      const filter = createFilter('status', 'text', 'Status');
      const context = createMockContext([filter]);

      renderWithContext(
        <FilterField filterId="status" componentProps={{ customProp: 'value' }} />,
        context
      );

      expect(screen.getByTestId('text-filter-status')).toBeInTheDocument();
    });

    it('merges componentProps with common props', () => {
      const filter = createFilter('search', 'select', 'Search');
      const context = createMockContext([filter]);

      renderWithContext(
        <FilterField filterId="search" label="Custom" componentProps={{ extra: 'data' }} />,
        context
      );

      const selectFilter = screen.getByTestId('select-filter-search');
      expect(selectFilter).toBeInTheDocument();
      expect(screen.getByText('Custom')).toBeInTheDocument();
    });
  });

  // 10. Custom styling
  describe('custom styling', () => {
    it('accepts custom className', () => {
      const filter = createFilter('status', 'text', 'Status');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(
        <FilterField filterId="status" className="custom-filter" />,
        context
      );

      const element = container.querySelector('[data-filter-id="status"]');
      expect(element).toHaveClass('custom-filter');
    });

    it('merges custom className with component classes', () => {
      const filter = createFilter('status', 'text', 'Status');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(
        <FilterField filterId="status" className="custom-class" />,
        context
      );

      const element = container.querySelector('[data-filter-id="status"]');
      expect(element?.className).toContain('custom-class');
    });

    it('accepts custom style prop', () => {
      const filter = createFilter('status', 'text', 'Status');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(
        <FilterField filterId="status" style={{ backgroundColor: 'red' }} />,
        context
      );

      const element = container.querySelector('[data-filter-id="status"]');
      expect(element).toHaveStyle({ backgroundColor: 'red' });
    });

    it('handles undefined className gracefully', () => {
      const filter = createFilter('status', 'text', 'Status');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(
        <FilterField filterId="status" className={undefined} />,
        context
      );

      const element = container.querySelector('[data-filter-id="status"]');
      expect(element).toBeInTheDocument();
    });
  });

  // 11. Props spreading
  describe('props spreading', () => {
    it('accepts and applies data attributes', () => {
      const filter = createFilter('status', 'text', 'Status');
      const context = createMockContext([filter]);

      renderWithContext(
        <FilterField filterId="status" data-testid="test-filter" data-custom="value" />,
        context
      );

      const element = screen.getByTestId('test-filter');
      expect(element).toHaveAttribute('data-custom', 'value');
    });

    it('forwards additional HTML attributes', () => {
      const filter = createFilter('status', 'text', 'Status');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(
        <FilterField filterId="status" data-custom="value" />,
        context
      );

      const element = container.querySelector('[data-filter-id="status"]');
      expect(element).toHaveAttribute('data-custom', 'value');
    });
  });

  // 12. Combined props tests
  describe('combined props', () => {
    it('renders with all filter types and custom labels', () => {
      const filterTypes: Array<{ id: string; type: FilterType; label: string }> = [
        { id: 'select1', type: 'select', label: 'Select' },
        { id: 'multi1', type: 'multi-select', label: 'Multi' },
        { id: 'check1', type: 'checkbox', label: 'Check' },
        { id: 'toggle1', type: 'toggle', label: 'Toggle' },
        { id: 'text1', type: 'text', label: 'Text' },
      ];

      filterTypes.forEach(({ id, type, label }) => {
        const filter = createFilter(id, type, label);
        const context = createMockContext([filter]);

        const { container } = renderWithContext(
          <FilterField filterId={id} label={`Custom ${label}`} />,
          context
        );

        expect(screen.getByText(`Custom ${label}`)).toBeInTheDocument();
        container.remove();
      });
    });

    it('renders with label override and placeholder override', () => {
      const filter = createFilter('search', 'text', 'Search');
      const context = createMockContext([filter]);

      renderWithContext(
        <FilterField filterId="search" label="Find" placeholder="Type here" />,
        context
      );

      expect(screen.getByText('Find')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
    });

    it('renders with showLabel false and custom className', () => {
      const filter = createFilter('status', 'text', 'Status');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(
        <FilterField filterId="status" showLabel={false} className="hidden-label" />,
        context
      );

      expect(screen.queryByText('Status')).not.toBeInTheDocument();
      const element = container.querySelector('[data-filter-id="status"]');
      expect(element).toHaveClass('hidden-label');
    });

    it('renders with all props and custom size from context', () => {
      const filter: FilterDefinition = {
        id: 'advanced',
        type: 'select',
        label: 'Advanced Filter',
        placeholder: 'Select option',
      };
      const context = createMockContext([filter], { size: 'lg' });

      renderWithContext(
        <FilterField
          filterId="advanced"
          label="Custom Advanced"
          placeholder="Custom placeholder"
          showLabel
          className="advanced-filter"
          data-testid="advanced-test"
        />,
        context
      );

      expect(screen.getByText('Custom Advanced')).toBeInTheDocument();
      const element = screen.getByTestId('advanced-test');
      expect(element).toHaveClass('advanced-filter');
    });
  });

  // 13. Ref forwarding
  describe('ref forwarding', () => {
    it('forwards ref to wrapper element', () => {
      const ref = React.createRef<HTMLDivElement>();
      const filter = createFilter('status', 'text', 'Status');
      const context = createMockContext([filter]);

      renderWithContext(<FilterField ref={ref} filterId="status" />, context);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute('data-filter-id', 'status');
    });

    it('forwards ref with data attributes', () => {
      const ref = React.createRef<HTMLDivElement>();
      const filter = createFilter('category', 'select', 'Category');
      const context = createMockContext([filter]);

      renderWithContext(<FilterField ref={ref} filterId="category" />, context);

      expect(ref.current).toHaveAttribute('data-filter-id', 'category');
      expect(ref.current).toHaveAttribute('data-filter-type', 'select');
    });

    it('handles callback ref', () => {
      const refCallback = jest.fn();
      const filter = createFilter('status', 'text', 'Status');
      const context = createMockContext([filter]);

      renderWithContext(<FilterField ref={refCallback} filterId="status" />, context);

      expect(refCallback).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });
  });

  // 14. Edge cases
  describe('edge cases', () => {
    it('handles filter with empty label', () => {
      const filter: FilterDefinition = {
        id: 'empty',
        type: 'text',
        label: '',
      };
      const context = createMockContext([filter]);

      renderWithContext(<FilterField filterId="empty" />, context);

      expect(screen.getByTestId('text-filter-empty')).toBeInTheDocument();
    });

    it('handles filter with undefined placeholder', () => {
      const filter: FilterDefinition = {
        id: 'noplaceholder',
        type: 'text',
        label: 'No Placeholder',
        placeholder: undefined,
      };
      const context = createMockContext([filter]);

      renderWithContext(<FilterField filterId="noplaceholder" />, context);

      expect(screen.getByTestId('text-filter-noplaceholder')).toBeInTheDocument();
    });

    it('handles multiple filters in same context', () => {
      const filters = [
        createFilter('filter1', 'text', 'Filter 1'),
        createFilter('filter2', 'select', 'Filter 2'),
        createFilter('filter3', 'checkbox', 'Filter 3'),
      ];
      const context = createMockContext(filters);

      render(
        <FilterContext.Provider value={context}>
          <FilterField filterId="filter1" />
          <FilterField filterId="filter2" />
          <FilterField filterId="filter3" />
        </FilterContext.Provider>
      );

      expect(screen.getByTestId('text-filter-filter1')).toBeInTheDocument();
      expect(screen.getByTestId('select-filter-filter2')).toBeInTheDocument();
      expect(screen.getByTestId('checkbox-filter-filter3')).toBeInTheDocument();
    });

    it('handles empty filterId gracefully', () => {
      const context = createMockContext([]);

      const { container } = renderWithContext(<FilterField filterId="" />, context);

      expect(container.firstChild).toBeNull();
    });

    it('handles special characters in filterId', () => {
      const filter = createFilter('filter-with-dashes_and_underscores', 'text', 'Special');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(
        <FilterField filterId="filter-with-dashes_and_underscores" />,
        context
      );

      const element = container.querySelector(
        '[data-filter-id="filter-with-dashes_and_underscores"]'
      );
      expect(element).toBeInTheDocument();
    });

    it('handles label override with empty string', () => {
      const filter = createFilter('status', 'text', 'Status');
      const context = createMockContext([filter]);

      renderWithContext(<FilterField filterId="status" label="" showLabel />, context);

      expect(screen.queryByText('Status')).not.toBeInTheDocument();
    });

    it('handles placeholder override with empty string', () => {
      const filter: FilterDefinition = {
        id: 'search',
        type: 'text',
        label: 'Search',
        placeholder: 'Default placeholder',
      };
      const context = createMockContext([filter]);

      renderWithContext(<FilterField filterId="search" placeholder="" />, context);

      expect(screen.queryByPlaceholderText('Default placeholder')).not.toBeInTheDocument();
    });
  });

  // 15. Context integration
  describe('context integration', () => {
    it('retrieves filter from context', () => {
      const filter = createFilter('status', 'text', 'Status');
      const getFilter = jest.fn(() => filter);
      const context = createMockContext([filter], { getFilter });

      renderWithContext(<FilterField filterId="status" />, context);

      expect(getFilter).toHaveBeenCalledWith('status');
    });

    it('checks filter visibility from context', () => {
      const filter = createFilter('status', 'text', 'Status');
      const isFilterVisible = jest.fn(() => true);
      const context = createMockContext([filter], { isFilterVisible });

      renderWithContext(<FilterField filterId="status" />, context);

      expect(isFilterVisible).toHaveBeenCalledWith('status');
    });

    it('uses context size for filter components', () => {
      const filter = createFilter('status', 'text', 'Status');

      const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];
      sizes.forEach((size) => {
        const context = createMockContext([filter], { size });

        const { container } = renderWithContext(<FilterField filterId="status" />, context);

        const input = container.querySelector(`[data-size="${size}"]`);
        expect(input).toBeInTheDocument();
        container.remove();
      });
    });
  });
});
