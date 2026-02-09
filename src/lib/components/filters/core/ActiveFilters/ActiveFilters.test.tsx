import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ActiveFilters } from './ActiveFilters';
import { FilterContext } from '../../FilterContext';
import type { FilterContextValue, FilterDefinition } from '../../types';

// Helper to create a mock context
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
  isFilterActive: jest.fn(),
  isFilterVisible: jest.fn(() => true),
  isFilterEnabled: jest.fn(() => true),
  getActiveFilters: jest.fn(),
  toSearchParams: jest.fn(),
  fromSearchParams: jest.fn(),
  getFilter: jest.fn(),
  getFiltersByGroup: jest.fn(),
  getUngroupedFilters: jest.fn(),
  getFilterOptions: jest.fn(),
  reloadFilterOptions: jest.fn(),
  applyFilters: jest.fn(),
  ...overrides,
});

// Helper to render with context
const renderWithContext = (
  ui: React.ReactElement,
  contextValue: Partial<FilterContextValue> = {}
) => {
  const mockContext = createMockContext(contextValue);
  return {
    ...render(<FilterContext.Provider value={mockContext}>{ui}</FilterContext.Provider>),
    mockContext,
  };
};

describe('ActiveFilters', () => {
  // 1. Rendering tests
  describe('rendering', () => {
    it('renders nothing when no active filters', () => {
      const { container } = renderWithContext(<ActiveFilters />, {
        filters: [],
        values: {},
        isFilterActive: jest.fn(() => false),
      });
      expect(container.firstChild).toBeNull();
    });

    it('renders empty content when no active filters and emptyContent provided', () => {
      renderWithContext(<ActiveFilters emptyContent="No filters applied" />, {
        filters: [],
        values: {},
        isFilterActive: jest.fn(() => false),
      });
      expect(screen.getByText('No filters applied')).toBeInTheDocument();
    });

    it('renders active filters as chips', () => {
      const filters: FilterDefinition[] = [
        { id: 'status', type: 'select', label: 'Status' },
        { id: 'category', type: 'select', label: 'Category' },
      ];

      renderWithContext(<ActiveFilters />, {
        filters,
        values: { status: 'active', category: 'tech' },
        isFilterActive: jest.fn((id) => id === 'status' || id === 'category'),
        getFilterMeta: jest.fn((id) => ({
          value: id === 'status' ? 'active' : 'tech',
          displayValue: id === 'status' ? 'Active' : 'Technology',
        })),
      });

      expect(screen.getByText('Status: Active')).toBeInTheDocument();
      expect(screen.getByText('Category: Technology')).toBeInTheDocument();
    });

    it('renders with default props', () => {
      const filters: FilterDefinition[] = [{ id: 'status', type: 'select', label: 'Status' }];

      renderWithContext(<ActiveFilters />, {
        filters,
        values: { status: 'active' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn(() => ({ value: 'active', displayValue: 'Active' })),
      });

      expect(screen.getByText('Status: Active')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const filters: FilterDefinition[] = [{ id: 'status', type: 'select', label: 'Status' }];

      renderWithContext(<ActiveFilters className="custom-class" data-testid="active-filters" />, {
        filters,
        values: { status: 'active' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn(() => ({ value: 'active', displayValue: 'Active' })),
      });

      const element = screen.getByTestId('active-filters');
      expect(element).toHaveClass('custom-class');
    });

    it('uses shortLabel when available', () => {
      const filters: FilterDefinition[] = [
        { id: 'status', type: 'select', label: 'Status Filter', shortLabel: 'Status' },
      ];

      renderWithContext(<ActiveFilters />, {
        filters,
        values: { status: 'active' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn(() => ({ value: 'active', displayValue: 'Active' })),
      });

      expect(screen.getByText('Status: Active')).toBeInTheDocument();
      expect(screen.queryByText('Status Filter: Active')).not.toBeInTheDocument();
    });

    it('falls back to label when shortLabel not available', () => {
      const filters: FilterDefinition[] = [{ id: 'status', type: 'select', label: 'Status' }];

      renderWithContext(<ActiveFilters />, {
        filters,
        values: { status: 'active' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn(() => ({ value: 'active', displayValue: 'Active' })),
      });

      expect(screen.getByText('Status: Active')).toBeInTheDocument();
    });

    it('only renders visible filters', () => {
      const filters: FilterDefinition[] = [
        { id: 'status', type: 'select', label: 'Status' },
        { id: 'hidden', type: 'select', label: 'Hidden' },
      ];

      renderWithContext(<ActiveFilters />, {
        filters,
        values: { status: 'active', hidden: 'value' },
        isFilterActive: jest.fn(() => true),
        isFilterVisible: jest.fn((id) => id === 'status'),
        getFilterMeta: jest.fn((id) => ({
          value: id === 'status' ? 'active' : 'value',
          displayValue: id === 'status' ? 'Active' : 'Hidden Value',
        })),
      });

      expect(screen.getByText('Status: Active')).toBeInTheDocument();
      expect(screen.queryByText('Hidden: Hidden Value')).not.toBeInTheDocument();
    });
  });

  // 2. Chip removal tests
  describe('chip removal', () => {
    it('renders remove button on each chip', () => {
      const filters: FilterDefinition[] = [{ id: 'status', type: 'select', label: 'Status' }];

      renderWithContext(<ActiveFilters />, {
        filters,
        values: { status: 'active' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn(() => ({ value: 'active', displayValue: 'Active' })),
      });

      const removeButton = screen.getByRole('button', { name: /remove status filter/i });
      expect(removeButton).toBeInTheDocument();
    });

    it('calls clearFilter when chip remove button is clicked', () => {
      const filters: FilterDefinition[] = [{ id: 'status', type: 'select', label: 'Status' }];
      const clearFilter = jest.fn();

      renderWithContext(<ActiveFilters />, {
        filters,
        values: { status: 'active' },
        isFilterActive: jest.fn(() => true),
        clearFilter,
        getFilterMeta: jest.fn(() => ({ value: 'active', displayValue: 'Active' })),
      });

      const removeButton = screen.getByRole('button', { name: /remove status filter/i });
      fireEvent.click(removeButton);

      expect(clearFilter).toHaveBeenCalledWith('status');
      expect(clearFilter).toHaveBeenCalledTimes(1);
    });

    it('calls clearFilter with correct filter ID for multiple chips', () => {
      const filters: FilterDefinition[] = [
        { id: 'status', type: 'select', label: 'Status' },
        { id: 'category', type: 'select', label: 'Category' },
      ];
      const clearFilter = jest.fn();

      renderWithContext(<ActiveFilters />, {
        filters,
        values: { status: 'active', category: 'tech' },
        isFilterActive: jest.fn(() => true),
        clearFilter,
        getFilterMeta: jest.fn((id) => ({
          value: id === 'status' ? 'active' : 'tech',
          displayValue: id === 'status' ? 'Active' : 'Technology',
        })),
      });

      const statusRemoveButton = screen.getByRole('button', { name: /remove status filter/i });
      fireEvent.click(statusRemoveButton);
      expect(clearFilter).toHaveBeenCalledWith('status');

      const categoryRemoveButton = screen.getByRole('button', { name: /remove category filter/i });
      fireEvent.click(categoryRemoveButton);
      expect(clearFilter).toHaveBeenCalledWith('category');
    });
  });

  // 3. Clear all functionality tests
  describe('clear all functionality', () => {
    it('renders clear all button by default when multiple filters', () => {
      const filters: FilterDefinition[] = [
        { id: 'status', type: 'select', label: 'Status' },
        { id: 'category', type: 'select', label: 'Category' },
      ];

      renderWithContext(<ActiveFilters />, {
        filters,
        values: { status: 'active', category: 'tech' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn((id) => ({
          value: id === 'status' ? 'active' : 'tech',
          displayValue: id === 'status' ? 'Active' : 'Technology',
        })),
      });

      expect(screen.getByRole('button', { name: 'Clear all' })).toBeInTheDocument();
    });

    it('does not render clear all button when only one filter', () => {
      const filters: FilterDefinition[] = [{ id: 'status', type: 'select', label: 'Status' }];

      renderWithContext(<ActiveFilters />, {
        filters,
        values: { status: 'active' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn(() => ({ value: 'active', displayValue: 'Active' })),
      });

      expect(screen.queryByRole('button', { name: 'Clear all' })).not.toBeInTheDocument();
    });

    it('does not render clear all button when showClearAll is false', () => {
      const filters: FilterDefinition[] = [
        { id: 'status', type: 'select', label: 'Status' },
        { id: 'category', type: 'select', label: 'Category' },
      ];

      renderWithContext(<ActiveFilters showClearAll={false} />, {
        filters,
        values: { status: 'active', category: 'tech' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn((id) => ({
          value: id === 'status' ? 'active' : 'tech',
          displayValue: id === 'status' ? 'Active' : 'Technology',
        })),
      });

      expect(screen.queryByRole('button', { name: 'Clear all' })).not.toBeInTheDocument();
    });

    it('renders custom clear all label', () => {
      const filters: FilterDefinition[] = [
        { id: 'status', type: 'select', label: 'Status' },
        { id: 'category', type: 'select', label: 'Category' },
      ];

      renderWithContext(<ActiveFilters clearAllLabel="Reset Filters" />, {
        filters,
        values: { status: 'active', category: 'tech' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn((id) => ({
          value: id === 'status' ? 'active' : 'tech',
          displayValue: id === 'status' ? 'Active' : 'Technology',
        })),
      });

      expect(screen.getByRole('button', { name: 'Reset Filters' })).toBeInTheDocument();
    });

    it('calls clearAllFilters when clear all button is clicked', () => {
      const filters: FilterDefinition[] = [
        { id: 'status', type: 'select', label: 'Status' },
        { id: 'category', type: 'select', label: 'Category' },
      ];
      const clearAllFilters = jest.fn();

      renderWithContext(<ActiveFilters />, {
        filters,
        values: { status: 'active', category: 'tech' },
        isFilterActive: jest.fn(() => true),
        clearAllFilters,
        getFilterMeta: jest.fn((id) => ({
          value: id === 'status' ? 'active' : 'tech',
          displayValue: id === 'status' ? 'Active' : 'Technology',
        })),
      });

      const clearAllButton = screen.getByRole('button', { name: 'Clear all' });
      fireEvent.click(clearAllButton);

      expect(clearAllFilters).toHaveBeenCalledTimes(1);
    });
  });

  // 4. Chip variant and size tests
  describe('chip variant and size', () => {
    it('renders chips with secondary variant by default', () => {
      const filters: FilterDefinition[] = [{ id: 'status', type: 'select', label: 'Status' }];

      const { container } = renderWithContext(<ActiveFilters />, {
        filters,
        values: { status: 'active' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn(() => ({ value: 'active', displayValue: 'Active' })),
      });

      const chip = container.querySelector('[data-variant="secondary"]');
      expect(chip).toBeInTheDocument();
    });

    it('renders chips with custom variant', () => {
      const filters: FilterDefinition[] = [{ id: 'status', type: 'select', label: 'Status' }];

      const { container } = renderWithContext(<ActiveFilters chipVariant="primary" />, {
        filters,
        values: { status: 'active' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn(() => ({ value: 'active', displayValue: 'Active' })),
      });

      const chip = container.querySelector('[data-variant="primary"]');
      expect(chip).toBeInTheDocument();
    });

    it('renders chips with sm size by default', () => {
      const filters: FilterDefinition[] = [{ id: 'status', type: 'select', label: 'Status' }];

      const { container } = renderWithContext(<ActiveFilters />, {
        filters,
        values: { status: 'active' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn(() => ({ value: 'active', displayValue: 'Active' })),
      });

      const chip = container.querySelector('[data-size="sm"]');
      expect(chip).toBeInTheDocument();
    });

    it('renders chips with custom size', () => {
      const filters: FilterDefinition[] = [{ id: 'status', type: 'select', label: 'Status' }];

      const { container } = renderWithContext(<ActiveFilters chipSize="md" />, {
        filters,
        values: { status: 'active' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn(() => ({ value: 'active', displayValue: 'Active' })),
      });

      const chip = container.querySelector('[data-size="md"]');
      expect(chip).toBeInTheDocument();
    });
  });

  // 5. Custom chip rendering tests
  describe('custom chip rendering', () => {
    it('uses custom renderChip function when provided', () => {
      const filters: FilterDefinition[] = [{ id: 'status', type: 'select', label: 'Status' }];

      const renderChip = jest.fn((filter, value, onRemove) => (
        <div key={filter.id} data-testid="custom-chip">
          Custom: {filter.label} = {String(value)}
          <button onClick={onRemove}>X</button>
        </div>
      ));

      renderWithContext(<ActiveFilters renderChip={renderChip} />, {
        filters,
        values: { status: 'active' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn(() => ({ value: 'active', displayValue: 'Active' })),
      });

      expect(renderChip).toHaveBeenCalled();
      expect(screen.getByTestId('custom-chip')).toBeInTheDocument();
      expect(screen.getByText('Custom: Status = active')).toBeInTheDocument();
    });

    it('custom renderChip receives correct parameters', () => {
      const filters: FilterDefinition[] = [{ id: 'status', type: 'select', label: 'Status' }];
      const clearFilter = jest.fn();

      const renderChip = jest.fn((filter, value, onRemove) => (
        <div key={filter.id}>
          <button onClick={onRemove}>Remove</button>
        </div>
      ));

      renderWithContext(<ActiveFilters renderChip={renderChip} />, {
        filters,
        values: { status: 'active' },
        isFilterActive: jest.fn(() => true),
        clearFilter,
        getFilterMeta: jest.fn(() => ({ value: 'active', displayValue: 'Active' })),
      });

      expect(renderChip).toHaveBeenCalledWith(filters[0], 'active', expect.any(Function));

      // Test that the onRemove callback works
      const onRemove = renderChip.mock.calls[0][2];
      onRemove();
      expect(clearFilter).toHaveBeenCalledWith('status');
    });
  });

  // 6. MaxVisible and show more/less tests
  describe('maxVisible and show more/less', () => {
    it('shows all filters when maxVisible not set', () => {
      const filters: FilterDefinition[] = [
        { id: 'filter1', type: 'select', label: 'Filter 1' },
        { id: 'filter2', type: 'select', label: 'Filter 2' },
        { id: 'filter3', type: 'select', label: 'Filter 3' },
        { id: 'filter4', type: 'select', label: 'Filter 4' },
        { id: 'filter5', type: 'select', label: 'Filter 5' },
      ];

      renderWithContext(<ActiveFilters />, {
        filters,
        values: { filter1: 'a', filter2: 'b', filter3: 'c', filter4: 'd', filter5: 'e' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn((id) => ({
          value: id,
          displayValue: `Value ${id}`,
        })),
      });

      expect(screen.getByText('Filter 1: Value filter1')).toBeInTheDocument();
      expect(screen.getByText('Filter 2: Value filter2')).toBeInTheDocument();
      expect(screen.getByText('Filter 3: Value filter3')).toBeInTheDocument();
      expect(screen.getByText('Filter 4: Value filter4')).toBeInTheDocument();
      expect(screen.getByText('Filter 5: Value filter5')).toBeInTheDocument();
    });

    it('limits visible filters when maxVisible is set', () => {
      const filters: FilterDefinition[] = [
        { id: 'filter1', type: 'select', label: 'Filter 1' },
        { id: 'filter2', type: 'select', label: 'Filter 2' },
        { id: 'filter3', type: 'select', label: 'Filter 3' },
      ];

      renderWithContext(<ActiveFilters maxVisible={2} />, {
        filters,
        values: { filter1: 'a', filter2: 'b', filter3: 'c' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn((id) => ({
          value: id,
          displayValue: `Value ${id}`,
        })),
      });

      expect(screen.getByText('Filter 1: Value filter1')).toBeInTheDocument();
      expect(screen.getByText('Filter 2: Value filter2')).toBeInTheDocument();
      expect(screen.queryByText('Filter 3: Value filter3')).not.toBeInTheDocument();
    });

    it('shows "show more" button when filters exceed maxVisible', () => {
      const filters: FilterDefinition[] = [
        { id: 'filter1', type: 'select', label: 'Filter 1' },
        { id: 'filter2', type: 'select', label: 'Filter 2' },
        { id: 'filter3', type: 'select', label: 'Filter 3' },
      ];

      renderWithContext(<ActiveFilters maxVisible={2} />, {
        filters,
        values: { filter1: 'a', filter2: 'b', filter3: 'c' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn((id) => ({
          value: id,
          displayValue: `Value ${id}`,
        })),
      });

      expect(screen.getByText('+1 more')).toBeInTheDocument();
    });

    it('shows correct count in "show more" button', () => {
      const filters: FilterDefinition[] = [
        { id: 'filter1', type: 'select', label: 'Filter 1' },
        { id: 'filter2', type: 'select', label: 'Filter 2' },
        { id: 'filter3', type: 'select', label: 'Filter 3' },
        { id: 'filter4', type: 'select', label: 'Filter 4' },
        { id: 'filter5', type: 'select', label: 'Filter 5' },
      ];

      renderWithContext(<ActiveFilters maxVisible={2} />, {
        filters,
        values: { filter1: 'a', filter2: 'b', filter3: 'c', filter4: 'd', filter5: 'e' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn((id) => ({
          value: id,
          displayValue: `Value ${id}`,
        })),
      });

      expect(screen.getByText('+3 more')).toBeInTheDocument();
    });

    it('expands to show all filters when "show more" is clicked', () => {
      const filters: FilterDefinition[] = [
        { id: 'filter1', type: 'select', label: 'Filter 1' },
        { id: 'filter2', type: 'select', label: 'Filter 2' },
        { id: 'filter3', type: 'select', label: 'Filter 3' },
      ];

      renderWithContext(<ActiveFilters maxVisible={2} />, {
        filters,
        values: { filter1: 'a', filter2: 'b', filter3: 'c' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn((id) => ({
          value: id,
          displayValue: `Value ${id}`,
        })),
      });

      const showMoreButton = screen.getByRole('button', { name: '+1 more' });
      fireEvent.click(showMoreButton);

      expect(screen.getByText('Filter 1: Value filter1')).toBeInTheDocument();
      expect(screen.getByText('Filter 2: Value filter2')).toBeInTheDocument();
      expect(screen.getByText('Filter 3: Value filter3')).toBeInTheDocument();
    });

    it('shows "show less" button after expanding', () => {
      const filters: FilterDefinition[] = [
        { id: 'filter1', type: 'select', label: 'Filter 1' },
        { id: 'filter2', type: 'select', label: 'Filter 2' },
        { id: 'filter3', type: 'select', label: 'Filter 3' },
      ];

      renderWithContext(<ActiveFilters maxVisible={2} />, {
        filters,
        values: { filter1: 'a', filter2: 'b', filter3: 'c' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn((id) => ({
          value: id,
          displayValue: `Value ${id}`,
        })),
      });

      const showMoreButton = screen.getByRole('button', { name: '+1 more' });
      fireEvent.click(showMoreButton);

      expect(screen.getByRole('button', { name: 'Show less' })).toBeInTheDocument();
    });

    it('collapses filters when "show less" is clicked', () => {
      const filters: FilterDefinition[] = [
        { id: 'filter1', type: 'select', label: 'Filter 1' },
        { id: 'filter2', type: 'select', label: 'Filter 2' },
        { id: 'filter3', type: 'select', label: 'Filter 3' },
      ];

      renderWithContext(<ActiveFilters maxVisible={2} />, {
        filters,
        values: { filter1: 'a', filter2: 'b', filter3: 'c' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn((id) => ({
          value: id,
          displayValue: `Value ${id}`,
        })),
      });

      const showMoreButton = screen.getByRole('button', { name: '+1 more' });
      fireEvent.click(showMoreButton);

      const showLessButton = screen.getByRole('button', { name: 'Show less' });
      fireEvent.click(showLessButton);

      expect(screen.getByText('Filter 1: Value filter1')).toBeInTheDocument();
      expect(screen.getByText('Filter 2: Value filter2')).toBeInTheDocument();
      expect(screen.queryByText('Filter 3: Value filter3')).not.toBeInTheDocument();
      expect(screen.getByText('+1 more')).toBeInTheDocument();
    });

    it('does not show "show more" button when filters equal maxVisible', () => {
      const filters: FilterDefinition[] = [
        { id: 'filter1', type: 'select', label: 'Filter 1' },
        { id: 'filter2', type: 'select', label: 'Filter 2' },
      ];

      renderWithContext(<ActiveFilters maxVisible={2} />, {
        filters,
        values: { filter1: 'a', filter2: 'b' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn((id) => ({
          value: id,
          displayValue: `Value ${id}`,
        })),
      });

      expect(screen.queryByText(/more/i)).not.toBeInTheDocument();
    });

    it('does not show "show more" button when filters less than maxVisible', () => {
      const filters: FilterDefinition[] = [{ id: 'filter1', type: 'select', label: 'Filter 1' }];

      renderWithContext(<ActiveFilters maxVisible={2} />, {
        filters,
        values: { filter1: 'a' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn((id) => ({
          value: id,
          displayValue: `Value ${id}`,
        })),
      });

      expect(screen.queryByText(/more/i)).not.toBeInTheDocument();
    });
  });

  // 7. Display value handling tests
  describe('display value handling', () => {
    it('uses displayValue from getFilterMeta when available', () => {
      const filters: FilterDefinition[] = [{ id: 'status', type: 'select', label: 'Status' }];

      renderWithContext(<ActiveFilters />, {
        filters,
        values: { status: 'active' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn(() => ({
          value: 'active',
          displayValue: 'Currently Active',
        })),
      });

      expect(screen.getByText('Status: Currently Active')).toBeInTheDocument();
    });

    it('falls back to string value when displayValue not available', () => {
      const filters: FilterDefinition[] = [{ id: 'status', type: 'select', label: 'Status' }];

      renderWithContext(<ActiveFilters />, {
        filters,
        values: { status: 'active' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn(() => ({
          value: 'active',
        })),
      });

      expect(screen.getByText('Status: active')).toBeInTheDocument();
    });

    it('handles boolean values', () => {
      const filters: FilterDefinition[] = [{ id: 'enabled', type: 'checkbox', label: 'Enabled' }];

      renderWithContext(<ActiveFilters />, {
        filters,
        values: { enabled: true },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn(() => ({
          value: true,
          displayValue: 'Yes',
        })),
      });

      expect(screen.getByText('Enabled: Yes')).toBeInTheDocument();
    });

    it('handles number values', () => {
      const filters: FilterDefinition[] = [{ id: 'rating', type: 'number', label: 'Rating' }];

      renderWithContext(<ActiveFilters />, {
        filters,
        values: { rating: 5 },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn(() => ({
          value: 5,
          displayValue: '5 stars',
        })),
      });

      expect(screen.getByText('Rating: 5 stars')).toBeInTheDocument();
    });

    it('handles array values', () => {
      const filters: FilterDefinition[] = [{ id: 'tags', type: 'multi-select', label: 'Tags' }];

      renderWithContext(<ActiveFilters />, {
        filters,
        values: { tags: ['tag1', 'tag2'] },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn(() => ({
          value: ['tag1', 'tag2'],
          displayValue: 'Tag 1, Tag 2',
        })),
      });

      expect(screen.getByText('Tags: Tag 1, Tag 2')).toBeInTheDocument();
    });
  });

  // 8. Ref forwarding tests
  describe('ref forwarding', () => {
    it('forwards ref to element', () => {
      const ref = React.createRef<HTMLDivElement>();
      const filters: FilterDefinition[] = [{ id: 'status', type: 'select', label: 'Status' }];

      renderWithContext(<ActiveFilters ref={ref} />, {
        filters,
        values: { status: 'active' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn(() => ({ value: 'active', displayValue: 'Active' })),
      });

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('handles callback ref', () => {
      const refCallback = jest.fn();
      const filters: FilterDefinition[] = [{ id: 'status', type: 'select', label: 'Status' }];

      renderWithContext(<ActiveFilters ref={refCallback} />, {
        filters,
        values: { status: 'active' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn(() => ({ value: 'active', displayValue: 'Active' })),
      });

      expect(refCallback).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });
  });

  // 9. Props spreading tests
  describe('props spreading', () => {
    it('accepts and applies data attributes', () => {
      const filters: FilterDefinition[] = [{ id: 'status', type: 'select', label: 'Status' }];

      renderWithContext(<ActiveFilters data-testid="active-filters" data-custom="value" />, {
        filters,
        values: { status: 'active' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn(() => ({ value: 'active', displayValue: 'Active' })),
      });

      const element = screen.getByTestId('active-filters');
      expect(element).toHaveAttribute('data-custom', 'value');
    });

    it('accepts style prop', () => {
      const filters: FilterDefinition[] = [{ id: 'status', type: 'select', label: 'Status' }];

      renderWithContext(
        <ActiveFilters style={{ backgroundColor: 'red' }} data-testid="active-filters" />,
        {
          filters,
          values: { status: 'active' },
          isFilterActive: jest.fn(() => true),
          getFilterMeta: jest.fn(() => ({ value: 'active', displayValue: 'Active' })),
        }
      );

      const element = screen.getByTestId('active-filters');
      expect(element).toHaveStyle({ backgroundColor: 'red' });
    });

    it('accepts id attribute', () => {
      const filters: FilterDefinition[] = [{ id: 'status', type: 'select', label: 'Status' }];

      renderWithContext(<ActiveFilters id="custom-id" data-testid="active-filters" />, {
        filters,
        values: { status: 'active' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn(() => ({ value: 'active', displayValue: 'Active' })),
      });

      const element = screen.getByTestId('active-filters');
      expect(element).toHaveAttribute('id', 'custom-id');
    });
  });

  // 10. Edge cases
  describe('edge cases', () => {
    it('handles undefined getFilterMeta gracefully', () => {
      const filters: FilterDefinition[] = [{ id: 'status', type: 'select', label: 'Status' }];

      renderWithContext(<ActiveFilters />, {
        filters,
        values: { status: 'active' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn(() => undefined),
      });

      expect(screen.getByText('Status: active')).toBeInTheDocument();
    });

    it('handles empty string displayValue', () => {
      const filters: FilterDefinition[] = [{ id: 'status', type: 'select', label: 'Status' }];

      renderWithContext(<ActiveFilters />, {
        filters,
        values: { status: 'active' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn(() => ({
          value: 'active',
          displayValue: '',
        })),
      });

      // When displayValue is empty, the chip still renders with just the label
      expect(screen.getByText(/Status:/)).toBeInTheDocument();
    });

    it('handles null values', () => {
      const filters: FilterDefinition[] = [{ id: 'date', type: 'date', label: 'Date' }];

      renderWithContext(<ActiveFilters />, {
        filters,
        values: { date: null },
        isFilterActive: jest.fn((id) => id === 'date'),
        getFilterMeta: jest.fn(() => ({
          value: null,
          displayValue: 'Not set',
        })),
      });

      expect(screen.getByText('Date: Not set')).toBeInTheDocument();
    });

    it('renders when empty content is ReactNode', () => {
      renderWithContext(
        <ActiveFilters emptyContent={<div data-testid="custom-empty">No filters</div>} />,
        {
          filters: [],
          values: {},
          isFilterActive: jest.fn(() => false),
        }
      );

      expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
    });

    it('handles filters with same label', () => {
      const filters: FilterDefinition[] = [
        { id: 'status1', type: 'select', label: 'Status' },
        { id: 'status2', type: 'select', label: 'Status' },
      ];

      renderWithContext(<ActiveFilters />, {
        filters,
        values: { status1: 'active', status2: 'pending' },
        isFilterActive: jest.fn(() => true),
        getFilterMeta: jest.fn((id) => ({
          value: id === 'status1' ? 'active' : 'pending',
          displayValue: id === 'status1' ? 'Active' : 'Pending',
        })),
      });

      const chips = screen.getAllByText(/Status:/);
      expect(chips).toHaveLength(2);
    });
  });
});

// 12. Context error handling
describe('context error handling', () => {
  it('throws error when used outside FilterProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<ActiveFilters />);
    }).toThrow('useFilterContextStrict must be used within a FilterProvider');

    console.error = originalError;
  });
});
