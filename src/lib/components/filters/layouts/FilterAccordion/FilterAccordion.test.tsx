import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterAccordion } from './FilterAccordion';
import { FilterContext } from '../../FilterContext';
import type { FilterContextValue, FilterDefinition, FilterGroup } from '../../types';

// Mock child components
jest.mock('../../../buttons/Button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

jest.mock('../../../display/Accordion', () => ({
  AccordionContainer: ({ children, mode, ...props }: any) => (
    <div data-testid="accordion-container" data-mode={mode} {...props}>
      {children}
    </div>
  ),
  Accordion: ({ id, header, isOpen, onOpenChange, children, ...props }: any) => (
    <div data-testid={`accordion-${id}`} data-open={isOpen} {...props}>
      <button onClick={() => onOpenChange()}>{header}</button>
      {isOpen && <div data-testid={`accordion-content-${id}`}>{children}</div>}
    </div>
  ),
}));

jest.mock('../../../display/Badge', () => ({
  Badge: ({ children, ...props }: any) => (
    <span data-testid="badge" {...props}>
      {children}
    </span>
  ),
}));

jest.mock('../../core/FilterField', () => ({
  FilterField: ({ filterId, ...props }: any) => (
    <div data-testid={`filter-field-${filterId}`} {...props}>
      FilterField-{filterId}
    </div>
  ),
}));

jest.mock('../../core/ActiveFilters', () => ({
  ActiveFilters: ({ maxVisible, showClearAll, ...props }: any) => (
    <div
      data-testid="active-filters"
      data-max-visible={maxVisible}
      data-show-clear-all={showClearAll}
      {...props}
    >
      ActiveFilters
    </div>
  ),
}));

// Helper function to create mock context
const createMockContext = (overrides?: Partial<FilterContextValue>): FilterContextValue => ({
  filters: [],
  groups: [],
  values: {},
  loadingFilters: new Set(),
  errors: {},
  touched: new Set(),
  isDirty: false,
  activeCount: 0,
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
  getActiveFilters: jest.fn(() => ({})),
  toSearchParams: jest.fn(() => new URLSearchParams()),
  fromSearchParams: jest.fn(),
  getFilter: jest.fn(),
  getFiltersByGroup: jest.fn(() => []),
  getUngroupedFilters: jest.fn(() => []),
  isFilterVisible: jest.fn(() => true),
  isFilterEnabled: jest.fn(() => true),
  getFilterOptions: jest.fn(() => ({
    options: [],
    loading: false,
    error: null,
    hasMore: false,
    loadMore: jest.fn(),
  })),
  reloadFilterOptions: jest.fn(),
  size: 'md',
  applyFilters: jest.fn(),
  hasPendingChanges: false,
  ...overrides,
});

describe('FilterAccordion', () => {
  // 1. Rendering tests
  describe('rendering', () => {
    it('renders with default props', () => {
      const mockContext = createMockContext();
      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion />
        </FilterContext.Provider>
      );
      expect(screen.getByTestId('accordion-container')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const mockContext = createMockContext();
      const { container } = render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion className="custom-class" />
        </FilterContext.Provider>
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });

    it('renders with data-testid', () => {
      const mockContext = createMockContext();
      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion data-testid="test-accordion" />
        </FilterContext.Provider>
      );
      expect(screen.getByTestId('test-accordion')).toBeInTheDocument();
    });

    it('renders without filter context', () => {
      render(<FilterAccordion />);
      expect(screen.getByTestId('accordion-container')).toBeInTheDocument();
    });

    it('forwards ref to element', () => {
      const ref = React.createRef<HTMLDivElement>();
      const mockContext = createMockContext();
      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion ref={ref} />
        </FilterContext.Provider>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  // 2. Accordion mode tests
  describe('accordion mode', () => {
    it('renders with multiple mode by default', () => {
      const mockContext = createMockContext();
      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion />
        </FilterContext.Provider>
      );
      const container = screen.getByTestId('accordion-container');
      expect(container).toHaveAttribute('data-mode', 'multiple');
    });

    it('renders with single mode', () => {
      const mockContext = createMockContext();
      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion mode="single" />
        </FilterContext.Provider>
      );
      const container = screen.getByTestId('accordion-container');
      expect(container).toHaveAttribute('data-mode', 'single');
    });
  });

  // 3. Auto-generated groups tests
  describe('auto-generated groups', () => {
    it('renders filter groups with filters', () => {
      const filters: FilterDefinition[] = [
        { id: 'filter1', type: 'text', label: 'Filter 1', group: 'group1' },
        { id: 'filter2', type: 'select', label: 'Filter 2', group: 'group1' },
      ];
      const groups: FilterGroup[] = [{ id: 'group1', label: 'Group 1' }];
      const mockContext = createMockContext({
        filters,
        groups,
        getFiltersByGroup: jest.fn((groupId) => filters.filter((f) => f.group === groupId)),
      });

      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion />
        </FilterContext.Provider>
      );

      expect(screen.getByTestId('accordion-group1')).toBeInTheDocument();
      expect(screen.getByText('Group 1')).toBeInTheDocument();
    });

    it('renders ungrouped filters in "General" section', () => {
      const filters: FilterDefinition[] = [{ id: 'filter1', type: 'text', label: 'Filter 1' }];
      const mockContext = createMockContext({
        filters,
        groups: [],
        getUngroupedFilters: jest.fn(() => filters),
      });

      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion />
        </FilterContext.Provider>
      );

      expect(screen.getByTestId('accordion-ungrouped')).toBeInTheDocument();
      expect(screen.getByText('General')).toBeInTheDocument();
    });

    it('renders filter fields within groups', () => {
      const filters: FilterDefinition[] = [
        { id: 'filter1', type: 'text', label: 'Filter 1', group: 'group1' },
        { id: 'filter2', type: 'select', label: 'Filter 2', group: 'group1' },
      ];
      const groups: FilterGroup[] = [{ id: 'group1', label: 'Group 1' }];
      const mockContext = createMockContext({
        filters,
        groups,
        getFiltersByGroup: jest.fn((groupId) => filters.filter((f) => f.group === groupId)),
      });

      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion defaultExpandedGroups={['group1']} />
        </FilterContext.Provider>
      );

      expect(screen.getByTestId('filter-field-filter1')).toBeInTheDocument();
      expect(screen.getByTestId('filter-field-filter2')).toBeInTheDocument();
    });

    it('does not render groups with no visible filters', () => {
      const filters: FilterDefinition[] = [
        { id: 'filter1', type: 'text', label: 'Filter 1', group: 'group1' },
      ];
      const groups: FilterGroup[] = [
        { id: 'group1', label: 'Group 1' },
        { id: 'group2', label: 'Group 2' },
      ];
      const mockContext = createMockContext({
        filters,
        groups,
        getFiltersByGroup: jest.fn((groupId) => filters.filter((f) => f.group === groupId)),
        isFilterVisible: jest.fn(() => true),
      });

      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion />
        </FilterContext.Provider>
      );

      expect(screen.getByTestId('accordion-group1')).toBeInTheDocument();
      expect(screen.queryByTestId('accordion-group2')).not.toBeInTheDocument();
    });

    it('filters out hidden filters', () => {
      const filters: FilterDefinition[] = [
        { id: 'filter1', type: 'text', label: 'Filter 1', group: 'group1' },
        { id: 'filter2', type: 'select', label: 'Filter 2', group: 'group1', hidden: true },
      ];
      const groups: FilterGroup[] = [{ id: 'group1', label: 'Group 1' }];
      const mockContext = createMockContext({
        filters,
        groups,
        getFiltersByGroup: jest.fn((groupId) => filters.filter((f) => f.group === groupId)),
        isFilterVisible: jest.fn((filterId) => filterId !== 'filter2'),
      });

      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion defaultExpandedGroups={['group1']} />
        </FilterContext.Provider>
      );

      expect(screen.getByTestId('filter-field-filter1')).toBeInTheDocument();
      expect(screen.queryByTestId('filter-field-filter2')).not.toBeInTheDocument();
    });
  });

  // 4. Group expansion tests
  describe('group expansion', () => {
    it('uses defaultExpandedGroups for initial state', () => {
      const groups: FilterGroup[] = [{ id: 'group1', label: 'Group 1' }];
      const mockContext = createMockContext({
        groups,
        getFiltersByGroup: jest.fn(() => [
          { id: 'filter1', type: 'text', label: 'Filter 1', group: 'group1' },
        ]),
      });

      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion defaultExpandedGroups={['group1']} />
        </FilterContext.Provider>
      );

      const accordion = screen.getByTestId('accordion-group1');
      expect(accordion).toHaveAttribute('data-open', 'true');
    });

    it('handles controlled expandedGroups', () => {
      const groups: FilterGroup[] = [{ id: 'group1', label: 'Group 1' }];
      const mockContext = createMockContext({
        groups,
        getFiltersByGroup: jest.fn(() => [
          { id: 'filter1', type: 'text', label: 'Filter 1', group: 'group1' },
        ]),
      });

      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion expandedGroups={['group1']} />
        </FilterContext.Provider>
      );

      const accordion = screen.getByTestId('accordion-group1');
      expect(accordion).toHaveAttribute('data-open', 'true');
    });

    it('calls onExpandedGroupsChange when group is toggled', () => {
      const handleChange = jest.fn();
      const groups: FilterGroup[] = [{ id: 'group1', label: 'Group 1' }];
      const mockContext = createMockContext({
        groups,
        getFiltersByGroup: jest.fn(() => [
          { id: 'filter1', type: 'text', label: 'Filter 1', group: 'group1' },
        ]),
      });

      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion onExpandedGroupsChange={handleChange} />
        </FilterContext.Provider>
      );

      const toggleButton = screen.getByText('Group 1');
      fireEvent.click(toggleButton);

      expect(handleChange).toHaveBeenCalledWith(['group1']);
    });

    it('handles single mode correctly - closes other groups', () => {
      const handleChange = jest.fn();
      const groups: FilterGroup[] = [
        { id: 'group1', label: 'Group 1' },
        { id: 'group2', label: 'Group 2' },
      ];
      const mockContext = createMockContext({
        groups,
        getFiltersByGroup: jest.fn((groupId) => [
          { id: `filter-${groupId}`, type: 'text', label: `Filter ${groupId}`, group: groupId },
        ]),
      });

      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion
            mode="single"
            defaultExpandedGroups={['group1']}
            onExpandedGroupsChange={handleChange}
          />
        </FilterContext.Provider>
      );

      const group2Toggle = screen.getByText('Group 2');
      fireEvent.click(group2Toggle);

      // Should only have group2 expanded (group1 should be closed)
      expect(handleChange).toHaveBeenCalledWith(['group2']);
    });

    it('handles multiple mode correctly - allows multiple groups open', () => {
      const handleChange = jest.fn();
      const groups: FilterGroup[] = [
        { id: 'group1', label: 'Group 1' },
        { id: 'group2', label: 'Group 2' },
      ];
      const mockContext = createMockContext({
        groups,
        getFiltersByGroup: jest.fn((groupId) => [
          { id: `filter-${groupId}`, type: 'text', label: `Filter ${groupId}`, group: groupId },
        ]),
      });

      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion
            mode="multiple"
            defaultExpandedGroups={['group1']}
            onExpandedGroupsChange={handleChange}
          />
        </FilterContext.Provider>
      );

      const group2Toggle = screen.getByText('Group 2');
      fireEvent.click(group2Toggle);

      // Should have both groups expanded
      expect(handleChange).toHaveBeenCalledWith(['group1', 'group2']);
    });

    it('collapses group when clicking on open group', () => {
      const handleChange = jest.fn();
      const groups: FilterGroup[] = [{ id: 'group1', label: 'Group 1' }];
      const mockContext = createMockContext({
        groups,
        getFiltersByGroup: jest.fn(() => [
          { id: 'filter1', type: 'text', label: 'Filter 1', group: 'group1' },
        ]),
      });

      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion
            defaultExpandedGroups={['group1']}
            onExpandedGroupsChange={handleChange}
          />
        </FilterContext.Provider>
      );

      const toggleButton = screen.getByText('Group 1');
      fireEvent.click(toggleButton);

      expect(handleChange).toHaveBeenCalledWith([]);
    });
  });

  // 5. Group counts and badges tests
  describe('group counts and badges', () => {
    it('shows active count badge when showGroupCounts is true', () => {
      const groups: FilterGroup[] = [{ id: 'group1', label: 'Group 1' }];
      const mockContext = createMockContext({
        groups,
        getFiltersByGroup: jest.fn(() => [
          { id: 'filter1', type: 'text', label: 'Filter 1', group: 'group1' },
        ]),
        isFilterActive: jest.fn(() => true),
      });

      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion showGroupCounts />
        </FilterContext.Provider>
      );

      expect(screen.getByTestId('badge')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('does not show badge when showGroupCounts is false', () => {
      const groups: FilterGroup[] = [{ id: 'group1', label: 'Group 1' }];
      const mockContext = createMockContext({
        groups,
        getFiltersByGroup: jest.fn(() => [
          { id: 'filter1', type: 'text', label: 'Filter 1', group: 'group1' },
        ]),
        isFilterActive: jest.fn(() => true),
      });

      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion showGroupCounts={false} />
        </FilterContext.Provider>
      );

      expect(screen.queryByTestId('badge')).not.toBeInTheDocument();
    });

    it('does not show badge when no active filters in group', () => {
      const groups: FilterGroup[] = [{ id: 'group1', label: 'Group 1' }];
      const mockContext = createMockContext({
        groups,
        getFiltersByGroup: jest.fn(() => [
          { id: 'filter1', type: 'text', label: 'Filter 1', group: 'group1' },
        ]),
        isFilterActive: jest.fn(() => false),
      });

      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion showGroupCounts />
        </FilterContext.Provider>
      );

      expect(screen.queryByTestId('badge')).not.toBeInTheDocument();
    });

    it('shows correct count for multiple active filters', () => {
      const groups: FilterGroup[] = [{ id: 'group1', label: 'Group 1' }];
      const mockContext = createMockContext({
        groups,
        getFiltersByGroup: jest.fn(() => [
          { id: 'filter1', type: 'text', label: 'Filter 1', group: 'group1' },
          { id: 'filter2', type: 'select', label: 'Filter 2', group: 'group1' },
          { id: 'filter3', type: 'toggle', label: 'Filter 3', group: 'group1' },
        ]),
        isFilterActive: jest.fn(() => true),
      });

      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion showGroupCounts />
        </FilterContext.Provider>
      );

      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  // 6. Group icon tests
  describe('group icons', () => {
    it('renders group icon when provided', () => {
      const groups: FilterGroup[] = [
        { id: 'group1', label: 'Group 1', icon: <span data-testid="group-icon">Icon</span> },
      ];
      const mockContext = createMockContext({
        groups,
        getFiltersByGroup: jest.fn(() => [
          { id: 'filter1', type: 'text', label: 'Filter 1', group: 'group1' },
        ]),
      });

      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion />
        </FilterContext.Provider>
      );

      expect(screen.getByTestId('group-icon')).toBeInTheDocument();
    });

    it('does not render icon when not provided', () => {
      const groups: FilterGroup[] = [{ id: 'group1', label: 'Group 1' }];
      const mockContext = createMockContext({
        groups,
        getFiltersByGroup: jest.fn(() => [
          { id: 'filter1', type: 'text', label: 'Filter 1', group: 'group1' },
        ]),
      });

      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion />
        </FilterContext.Provider>
      );

      expect(screen.queryByTestId('group-icon')).not.toBeInTheDocument();
    });
  });

  // 7. Group description tests
  describe('group descriptions', () => {
    it('renders group description when provided', () => {
      const groups: FilterGroup[] = [
        { id: 'group1', label: 'Group 1', description: 'This is a description' },
      ];
      const mockContext = createMockContext({
        groups,
        getFiltersByGroup: jest.fn(() => [
          { id: 'filter1', type: 'text', label: 'Filter 1', group: 'group1' },
        ]),
      });

      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion defaultExpandedGroups={['group1']} />
        </FilterContext.Provider>
      );

      expect(screen.getByText('This is a description')).toBeInTheDocument();
    });

    it('does not render description when not provided', () => {
      const groups: FilterGroup[] = [{ id: 'group1', label: 'Group 1' }];
      const mockContext = createMockContext({
        groups,
        getFiltersByGroup: jest.fn(() => [
          { id: 'filter1', type: 'text', label: 'Filter 1', group: 'group1' },
        ]),
      });

      const { container } = render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion defaultExpandedGroups={['group1']} />
        </FilterContext.Provider>
      );

      expect(container.querySelector('p')).not.toBeInTheDocument();
    });
  });

  // 8. Active filters display tests
  describe('active filters display', () => {
    it('does not show active filters by default', () => {
      const mockContext = createMockContext({ activeCount: 2 });
      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion />
        </FilterContext.Provider>
      );

      expect(screen.queryByTestId('active-filters')).not.toBeInTheDocument();
    });

    it('shows active filters at top when showActiveFilters is true and activeFiltersPosition is top', () => {
      const mockContext = createMockContext({ activeCount: 2 });
      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion showActiveFilters activeFiltersPosition="top" />
        </FilterContext.Provider>
      );

      expect(screen.getByTestId('active-filters')).toBeInTheDocument();
    });

    it('shows active filters at bottom when activeFiltersPosition is bottom', () => {
      const mockContext = createMockContext({ activeCount: 2 });
      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion showActiveFilters activeFiltersPosition="bottom" />
        </FilterContext.Provider>
      );

      expect(screen.getByTestId('active-filters')).toBeInTheDocument();
    });

    it('does not show active filters when activeCount is 0', () => {
      const mockContext = createMockContext({ activeCount: 0 });
      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion showActiveFilters />
        </FilterContext.Provider>
      );

      expect(screen.queryByTestId('active-filters')).not.toBeInTheDocument();
    });

    it('passes correct props to ActiveFilters component', () => {
      const mockContext = createMockContext({ activeCount: 2 });
      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion showActiveFilters />
        </FilterContext.Provider>
      );

      const activeFilters = screen.getByTestId('active-filters');
      expect(activeFilters).toHaveAttribute('data-max-visible', '5');
      expect(activeFilters).toHaveAttribute('data-show-clear-all', 'false');
    });
  });

  // 9. Action buttons tests
  describe('action buttons', () => {
    it('does not show action buttons by default', () => {
      const mockContext = createMockContext();
      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion />
        </FilterContext.Provider>
      );

      expect(screen.queryByRole('button', { name: /apply/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /reset/i })).not.toBeInTheDocument();
    });

    it('shows apply button when showApplyButton is true and has pending changes', () => {
      const mockContext = createMockContext({ hasPendingChanges: true });
      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion showApplyButton />
        </FilterContext.Provider>
      );

      expect(screen.getByText('Apply')).toBeInTheDocument();
    });

    it('does not show apply button when no pending changes', () => {
      const mockContext = createMockContext({ hasPendingChanges: false });
      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion showApplyButton />
        </FilterContext.Provider>
      );

      expect(screen.queryByText('Apply')).not.toBeInTheDocument();
    });

    it('shows clear button when showClearButton is true and has active filters', () => {
      const mockContext = createMockContext({ activeCount: 2 });
      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion showClearButton />
        </FilterContext.Provider>
      );

      expect(screen.getByText('Clear')).toBeInTheDocument();
    });

    it('does not show clear button when no active filters', () => {
      const mockContext = createMockContext({ activeCount: 0 });
      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion showClearButton />
        </FilterContext.Provider>
      );

      expect(screen.queryByText('Clear')).not.toBeInTheDocument();
    });

    it('shows reset button when showResetButton is true', () => {
      const mockContext = createMockContext();
      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion showResetButton />
        </FilterContext.Provider>
      );

      expect(screen.getByText('Reset')).toBeInTheDocument();
    });

    it('uses custom button labels', () => {
      const mockContext = createMockContext({
        activeCount: 2,
        hasPendingChanges: true,
      });
      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion
            showApplyButton
            showClearButton
            showResetButton
            applyButtonLabel="Apply Filters"
            clearButtonLabel="Clear All"
            resetButtonLabel="Reset All"
          />
        </FilterContext.Provider>
      );

      expect(screen.getByText('Apply Filters')).toBeInTheDocument();
      expect(screen.getByText('Clear All')).toBeInTheDocument();
      expect(screen.getByText('Reset All')).toBeInTheDocument();
    });

    it('calls applyFilters when apply button is clicked', () => {
      const mockContext = createMockContext({ hasPendingChanges: true });
      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion showApplyButton />
        </FilterContext.Provider>
      );

      const applyButton = screen.getByText('Apply');
      fireEvent.click(applyButton);

      expect(mockContext.applyFilters).toHaveBeenCalledTimes(1);
    });

    it('calls clearAllFilters when clear button is clicked', () => {
      const mockContext = createMockContext({ activeCount: 2 });
      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion showClearButton />
        </FilterContext.Provider>
      );

      const clearButton = screen.getByText('Clear');
      fireEvent.click(clearButton);

      expect(mockContext.clearAllFilters).toHaveBeenCalledTimes(1);
    });

    it('calls resetFilters when reset button is clicked', () => {
      const mockContext = createMockContext();
      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion showResetButton />
        </FilterContext.Provider>
      );

      const resetButton = screen.getByText('Reset');
      fireEvent.click(resetButton);

      expect(mockContext.resetFilters).toHaveBeenCalledTimes(1);
    });

    it('shows all three buttons together', () => {
      const mockContext = createMockContext({
        activeCount: 2,
        hasPendingChanges: true,
      });
      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion showApplyButton showClearButton showResetButton />
        </FilterContext.Provider>
      );

      expect(screen.getByText('Apply')).toBeInTheDocument();
      expect(screen.getByText('Clear')).toBeInTheDocument();
      expect(screen.getByText('Reset')).toBeInTheDocument();
    });
  });

  // 10. Children render mode tests
  describe('children render mode', () => {
    it('renders custom children when provided', () => {
      const mockContext = createMockContext();
      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion>
            <div data-testid="custom-content">Custom Content</div>
          </FilterAccordion>
        </FilterContext.Provider>
      );

      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
      expect(screen.getByText('Custom Content')).toBeInTheDocument();
    });

    it('renders AccordionContainer with children', () => {
      const mockContext = createMockContext();
      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion>
            <div>Child 1</div>
            <div>Child 2</div>
          </FilterAccordion>
        </FilterContext.Provider>
      );

      expect(screen.getByTestId('accordion-container')).toBeInTheDocument();
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });

    it('shows action buttons with custom children', () => {
      const mockContext = createMockContext({
        activeCount: 2,
        hasPendingChanges: true,
      });
      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion showApplyButton showClearButton>
            <div>Custom Content</div>
          </FilterAccordion>
        </FilterContext.Provider>
      );

      expect(screen.getByText('Apply')).toBeInTheDocument();
      expect(screen.getByText('Clear')).toBeInTheDocument();
    });

    it('shows active filters with custom children', () => {
      const mockContext = createMockContext({ activeCount: 2 });
      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion showActiveFilters activeFiltersPosition="top">
            <div>Custom Content</div>
          </FilterAccordion>
        </FilterContext.Provider>
      );

      expect(screen.getByTestId('active-filters')).toBeInTheDocument();
    });
  });

  // 11. Group ordering tests
  describe('group ordering', () => {
    it('sorts groups by order property', () => {
      const groups: FilterGroup[] = [
        { id: 'group3', label: 'Group 3', order: 3 },
        { id: 'group1', label: 'Group 1', order: 1 },
        { id: 'group2', label: 'Group 2', order: 2 },
      ];
      const mockContext = createMockContext({
        groups,
        getFiltersByGroup: jest.fn(() => [{ id: 'filter1', type: 'text', label: 'Filter 1' }]),
      });

      const { container } = render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion />
        </FilterContext.Provider>
      );

      const accordions = container.querySelectorAll('[data-testid^="accordion-group"]');
      expect(accordions[0]).toHaveAttribute('data-testid', 'accordion-group1');
      expect(accordions[1]).toHaveAttribute('data-testid', 'accordion-group2');
      expect(accordions[2]).toHaveAttribute('data-testid', 'accordion-group3');
    });

    it('handles groups without order property', () => {
      const groups: FilterGroup[] = [
        { id: 'group1', label: 'Group 1' },
        { id: 'group2', label: 'Group 2', order: 1 },
      ];
      const mockContext = createMockContext({
        groups,
        getFiltersByGroup: jest.fn(() => [{ id: 'filter1', type: 'text', label: 'Filter 1' }]),
      });

      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion />
        </FilterContext.Provider>
      );

      expect(screen.getByTestId('accordion-group2')).toBeInTheDocument();
      expect(screen.getByTestId('accordion-group1')).toBeInTheDocument();
    });
  });

  // 12. Edge cases
  describe('edge cases', () => {
    it('handles null context gracefully', () => {
      render(<FilterAccordion />);
      expect(screen.getByTestId('accordion-container')).toBeInTheDocument();
    });

    it('handles empty filters array', () => {
      const mockContext = createMockContext({
        filters: [],
        groups: [],
      });

      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion />
        </FilterContext.Provider>
      );

      expect(screen.getByTestId('accordion-container')).toBeInTheDocument();
    });

    it('handles empty groups array', () => {
      const mockContext = createMockContext({
        filters: [{ id: 'filter1', type: 'text', label: 'Filter 1' }],
        groups: [],
        getUngroupedFilters: jest.fn(() => [{ id: 'filter1', type: 'text', label: 'Filter 1' }]),
      });

      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion />
        </FilterContext.Provider>
      );

      expect(screen.getByTestId('accordion-ungrouped')).toBeInTheDocument();
    });

    it('handles undefined context methods gracefully', () => {
      const mockContext = createMockContext({
        applyFilters: undefined as any,
        clearAllFilters: undefined as any,
        resetFilters: undefined as any,
      });

      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion showApplyButton showClearButton showResetButton />
        </FilterContext.Provider>
      );

      // Should not throw errors
      expect(screen.getByTestId('accordion-container')).toBeInTheDocument();
    });

    it('handles multiple accordions with same mode', () => {
      const groups: FilterGroup[] = [
        { id: 'group1', label: 'Group 1' },
        { id: 'group2', label: 'Group 2' },
      ];
      const mockContext = createMockContext({
        groups,
        getFiltersByGroup: jest.fn(() => [{ id: 'filter1', type: 'text', label: 'Filter 1' }]),
      });

      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion mode="single" />
        </FilterContext.Provider>
      );

      expect(screen.getByTestId('accordion-group1')).toBeInTheDocument();
      expect(screen.getByTestId('accordion-group2')).toBeInTheDocument();
    });

    it('handles rapid toggling of groups', () => {
      const handleChange = jest.fn();
      const groups: FilterGroup[] = [{ id: 'group1', label: 'Group 1' }];
      const mockContext = createMockContext({
        groups,
        getFiltersByGroup: jest.fn(() => [{ id: 'filter1', type: 'text', label: 'Filter 1' }]),
      });

      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion onExpandedGroupsChange={handleChange} />
        </FilterContext.Provider>
      );

      const toggleButton = screen.getByText('Group 1');
      fireEvent.click(toggleButton);
      fireEvent.click(toggleButton);
      fireEvent.click(toggleButton);

      expect(handleChange).toHaveBeenCalledTimes(3);
    });
  });

  // 13. Accessibility tests
  describe('accessibility', () => {
    it('accepts aria-label', () => {
      const mockContext = createMockContext();
      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion aria-label="Filter options" />
        </FilterContext.Provider>
      );

      expect(screen.getByLabelText('Filter options')).toBeInTheDocument();
    });

    it('forwards additional HTML attributes', () => {
      const mockContext = createMockContext();
      render(
        <FilterContext.Provider value={mockContext}>
          <FilterAccordion data-custom="value" id="filter-accordion" />
        </FilterContext.Provider>
      );

      const element = screen.getByTestId('accordion-container').parentElement;
      expect(element).toHaveAttribute('data-custom', 'value');
      expect(element).toHaveAttribute('id', 'filter-accordion');
    });
  });

  // 14. Display name
  describe('display name', () => {
    it('has correct display name', () => {
      expect(FilterAccordion.displayName).toBe('FilterAccordion');
    });
  });
});
