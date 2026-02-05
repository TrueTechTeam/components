import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterBar } from './FilterBar';
import { FilterContext } from '../../FilterContext';
import type { FilterContextValue } from '../../types';

// Mock dependencies
jest.mock('../../../buttons/Button', () => ({
  Button: ({
    children,
    onClick,
    variant,
    size,
    endIcon,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: string;
    size?: string;
    endIcon?: React.ReactNode;
  }) => (
    <button onClick={onClick} data-variant={variant} data-size={size} {...props}>
      {children}
      {endIcon}
    </button>
  ),
}));

jest.mock('../../../overlays/Popover', () => ({
  Popover: ({
    trigger,
    children,
    isOpen,
    onOpenChange,
  }: {
    trigger: React.ReactNode;
    children: React.ReactNode;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
  }) => (
    <div data-testid="popover" data-open={isOpen}>
      <div onClick={() => onOpenChange(!isOpen)}>{trigger}</div>
      {isOpen && <div data-testid="popover-content">{children}</div>}
    </div>
  ),
}));

jest.mock('../../../display/Icon', () => ({
  Icon: ({ name, size }: { name: string; size?: string }) => (
    <span data-testid={`icon-${name}`} data-size={size}>
      {name}
    </span>
  ),
}));

jest.mock('../../core/ActiveFilters', () => ({
  ActiveFilters: ({ maxVisible, showClearAll }: { maxVisible: number; showClearAll: boolean }) => (
    <div
      data-testid="active-filters"
      data-max-visible={maxVisible}
      data-show-clear-all={showClearAll}
    >
      Active Filters
    </div>
  ),
}));

jest.mock('../../core/FilterField', () => ({
  FilterField: ({ filterId, showLabel }: { filterId: string; showLabel?: boolean }) => (
    <div data-testid={`filter-field-${filterId}`} data-show-label={showLabel}>
      FilterField: {filterId}
    </div>
  ),
}));

describe('FilterBar', () => {
  const mockFilters = [
    { id: 'status', label: 'Status', type: 'select' as const },
    { id: 'date', label: 'Date', type: 'date' as const },
    { id: 'priority', label: 'Priority', type: 'select' as const },
    { id: 'category', label: 'Category', type: 'select' as const },
  ];

  const createMockContext = (overrides?: Partial<FilterContextValue>): FilterContextValue => ({
    filters: mockFilters,
    groups: [],
    values: {},
    loadingFilters: new Set(),
    errors: {},
    touched: new Set(),
    isDirty: false,
    activeCount: 0,
    hasPendingChanges: false,
    size: 'md',
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
    toSearchParams: jest.fn(),
    fromSearchParams: jest.fn(),
    getFilter: jest.fn((id) => mockFilters.find((f) => f.id === id)),
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
    applyFilters: jest.fn(),
    ...overrides,
  });

  const renderWithContext = (
    ui: React.ReactElement,
    contextValue: FilterContextValue | null = createMockContext()
  ) => {
    return render(<FilterContext.Provider value={contextValue}>{ui}</FilterContext.Provider>);
  };

  // 1. Rendering tests
  describe('rendering', () => {
    it('renders with default props', () => {
      renderWithContext(
        <FilterBar>
          <div>Filter Content</div>
        </FilterBar>
      );
      expect(screen.getByText('Filter Content')).toBeInTheDocument();
    });

    it('renders children correctly', () => {
      renderWithContext(
        <FilterBar>
          <span>Child 1</span>
          <span>Child 2</span>
        </FilterBar>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = renderWithContext(
        <FilterBar className="custom-class">
          <div>Content</div>
        </FilterBar>
      );

      const filterBar = container.firstChild as HTMLElement;
      expect(filterBar).toHaveClass('custom-class');
    });

    it('accepts data-testid', () => {
      renderWithContext(
        <FilterBar data-testid="test-filter-bar">
          <div>Content</div>
        </FilterBar>
      );

      expect(screen.getByTestId('test-filter-bar')).toBeInTheDocument();
    });

    it('renders without context', () => {
      renderWithContext(
        <FilterBar>
          <div>Content</div>
        </FilterBar>,
        null
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  // 2. Layout tests
  describe('layout', () => {
    it('renders with wrap enabled by default', () => {
      const { container } = renderWithContext(
        <FilterBar>
          <div>Content</div>
        </FilterBar>
      );

      const filterBar = container.firstChild as HTMLElement;
      expect(filterBar).toHaveAttribute('data-wrap', 'true');
    });

    it('renders without wrap when disabled', () => {
      const { container } = renderWithContext(
        <FilterBar wrap={false}>
          <div>Content</div>
        </FilterBar>
      );

      const filterBar = container.firstChild as HTMLElement;
      expect(filterBar).not.toHaveAttribute('data-wrap');
    });

    it('renders with md gap by default', () => {
      const { container } = renderWithContext(
        <FilterBar>
          <div>Content</div>
        </FilterBar>
      );

      const filterBar = container.firstChild as HTMLElement;
      expect(filterBar).toHaveAttribute('data-gap', 'md');
    });

    it('renders with sm gap', () => {
      const { container } = renderWithContext(
        <FilterBar gap="sm">
          <div>Content</div>
        </FilterBar>
      );

      const filterBar = container.firstChild as HTMLElement;
      expect(filterBar).toHaveAttribute('data-gap', 'sm');
    });

    it('renders with lg gap', () => {
      const { container } = renderWithContext(
        <FilterBar gap="lg">
          <div>Content</div>
        </FilterBar>
      );

      const filterBar = container.firstChild as HTMLElement;
      expect(filterBar).toHaveAttribute('data-gap', 'lg');
    });
  });

  // 3. Active filters tests
  describe('active filters', () => {
    it('shows active filters inline by default', () => {
      renderWithContext(
        <FilterBar>
          <div>Content</div>
        </FilterBar>
      );

      const activeFilters = screen.getByTestId('active-filters');
      expect(activeFilters).toBeInTheDocument();
      expect(activeFilters).toHaveAttribute('data-max-visible', '3');
      expect(activeFilters).toHaveAttribute('data-show-clear-all', 'false');
    });

    it('shows active filters at top position', () => {
      renderWithContext(
        <FilterBar activeFiltersPosition="top">
          <div>Content</div>
        </FilterBar>
      );

      const activeFilters = screen.getByTestId('active-filters');
      expect(activeFilters).toBeInTheDocument();
      expect(activeFilters).toHaveAttribute('data-max-visible', '5');
      expect(activeFilters.parentElement).toHaveClass('activeFiltersRow');
    });

    it('shows active filters at bottom position', () => {
      renderWithContext(
        <FilterBar activeFiltersPosition="bottom">
          <div>Content</div>
        </FilterBar>
      );

      const activeFilters = screen.getByTestId('active-filters');
      expect(activeFilters).toBeInTheDocument();
      expect(activeFilters).toHaveAttribute('data-max-visible', '5');
      expect(activeFilters).toHaveAttribute('data-show-clear-all', 'true');
    });

    it('hides active filters when showActiveFilters is false', () => {
      renderWithContext(
        <FilterBar showActiveFilters={false}>
          <div>Content</div>
        </FilterBar>
      );

      expect(screen.queryByTestId('active-filters')).not.toBeInTheDocument();
    });
  });

  // 4. More Filters dropdown tests
  describe('more filters dropdown', () => {
    it('does not show More Filters button when no overflow filters', () => {
      const ctx = createMockContext();
      renderWithContext(
        <FilterBar visibleFilters={['status', 'date', 'priority', 'category']}>
          <div>Content</div>
        </FilterBar>,
        ctx
      );

      expect(screen.queryByText('More Filters')).not.toBeInTheDocument();
    });

    it('shows More Filters button when filters overflow', () => {
      const ctx = createMockContext();
      renderWithContext(
        <FilterBar visibleFilters={['status', 'date']}>
          <div>Content</div>
        </FilterBar>,
        ctx
      );

      expect(screen.getByText('More Filters')).toBeInTheDocument();
    });

    it('does not show More Filters button when showMoreFilters is false', () => {
      const ctx = createMockContext();
      renderWithContext(
        <FilterBar visibleFilters={['status']} showMoreFilters={false}>
          <div>Content</div>
        </FilterBar>,
        ctx
      );

      expect(screen.queryByText('More Filters')).not.toBeInTheDocument();
    });

    it('renders custom More Filters label', () => {
      const ctx = createMockContext();
      renderWithContext(
        <FilterBar visibleFilters={['status']} moreFiltersLabel="Additional Filters">
          <div>Content</div>
        </FilterBar>,
        ctx
      );

      expect(screen.getByText('Additional Filters')).toBeInTheDocument();
    });

    it('toggles More Filters dropdown on click', () => {
      const ctx = createMockContext();
      renderWithContext(
        <FilterBar visibleFilters={['status']}>
          <div>Content</div>
        </FilterBar>,
        ctx
      );

      const moreFiltersButton = screen.getByText('More Filters');

      // Initially closed
      expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();

      // Click to open
      fireEvent.click(moreFiltersButton);
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();

      // Click to close
      fireEvent.click(moreFiltersButton);
      expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
    });

    it('renders overflow filters in More Filters dropdown', () => {
      const ctx = createMockContext();
      renderWithContext(
        <FilterBar visibleFilters={['status']}>
          <div>Content</div>
        </FilterBar>,
        ctx
      );

      // Open dropdown
      const moreFiltersButton = screen.getByText('More Filters');
      fireEvent.click(moreFiltersButton);

      // Check that overflow filters are rendered with labels
      expect(screen.getByTestId('filter-field-date')).toBeInTheDocument();
      expect(screen.getByTestId('filter-field-date')).toHaveAttribute('data-show-label', 'true');
      expect(screen.getByTestId('filter-field-priority')).toBeInTheDocument();
      expect(screen.getByTestId('filter-field-category')).toBeInTheDocument();
    });

    it('shows badge with active filter count in More Filters', () => {
      const ctx = createMockContext({
        isFilterActive: jest.fn((id) => id === 'priority' || id === 'category'),
      });

      renderWithContext(
        <FilterBar visibleFilters={['status']}>
          <div>Content</div>
        </FilterBar>,
        ctx
      );

      const moreFiltersButton = screen.getByText('More Filters').parentElement;
      expect(moreFiltersButton?.textContent).toContain('2');
    });

    it('does not show badge when no overflow filters are active', () => {
      const ctx = createMockContext({
        isFilterActive: jest.fn(() => false),
      });

      const { container } = renderWithContext(
        <FilterBar visibleFilters={['status']}>
          <div>Content</div>
        </FilterBar>,
        ctx
      );

      const badge = container.querySelector('.moreFiltersBadge');
      expect(badge).not.toBeInTheDocument();
    });

    it('excludes hidden filters from More Filters dropdown', () => {
      const ctx = createMockContext({
        isFilterVisible: jest.fn((id) => id !== 'priority'),
      });

      renderWithContext(
        <FilterBar visibleFilters={['status']}>
          <div>Content</div>
        </FilterBar>,
        ctx
      );

      // Open dropdown
      const moreFiltersButton = screen.getByText('More Filters');
      fireEvent.click(moreFiltersButton);

      // Priority should not be in dropdown (hidden)
      expect(screen.queryByTestId('filter-field-priority')).not.toBeInTheDocument();
      expect(screen.getByTestId('filter-field-date')).toBeInTheDocument();
      expect(screen.getByTestId('filter-field-category')).toBeInTheDocument();
    });
  });

  // 5. Action buttons tests
  describe('action buttons', () => {
    it('does not show action buttons by default', () => {
      renderWithContext(
        <FilterBar>
          <div>Content</div>
        </FilterBar>
      );

      expect(screen.queryByText('Apply')).not.toBeInTheDocument();
      expect(screen.queryByText('Clear')).not.toBeInTheDocument();
      expect(screen.queryByText('Reset')).not.toBeInTheDocument();
    });

    it('shows Apply button when showApplyButton is true and has pending changes', () => {
      const ctx = createMockContext({
        hasPendingChanges: true,
      });

      renderWithContext(
        <FilterBar showApplyButton>
          <div>Content</div>
        </FilterBar>,
        ctx
      );

      expect(screen.getByText('Apply')).toBeInTheDocument();
    });

    it('does not show Apply button when no pending changes', () => {
      const ctx = createMockContext({
        hasPendingChanges: false,
      });

      renderWithContext(
        <FilterBar showApplyButton>
          <div>Content</div>
        </FilterBar>,
        ctx
      );

      expect(screen.queryByText('Apply')).not.toBeInTheDocument();
    });

    it('calls applyFilters when Apply button is clicked', () => {
      const ctx = createMockContext({
        hasPendingChanges: true,
      });

      renderWithContext(
        <FilterBar showApplyButton>
          <div>Content</div>
        </FilterBar>,
        ctx
      );

      const applyButton = screen.getByText('Apply');
      fireEvent.click(applyButton);

      expect(ctx.applyFilters).toHaveBeenCalledTimes(1);
    });

    it('renders custom Apply button label', () => {
      const ctx = createMockContext({
        hasPendingChanges: true,
      });

      renderWithContext(
        <FilterBar showApplyButton applyButtonLabel="Apply Filters">
          <div>Content</div>
        </FilterBar>,
        ctx
      );

      expect(screen.getByText('Apply Filters')).toBeInTheDocument();
    });

    it('shows Clear button when showClearButton is true and has active filters', () => {
      const ctx = createMockContext({
        activeCount: 2,
      });

      renderWithContext(
        <FilterBar showClearButton>
          <div>Content</div>
        </FilterBar>,
        ctx
      );

      expect(screen.getByText('Clear')).toBeInTheDocument();
    });

    it('does not show Clear button when no active filters', () => {
      const ctx = createMockContext({
        activeCount: 0,
      });

      renderWithContext(
        <FilterBar showClearButton>
          <div>Content</div>
        </FilterBar>,
        ctx
      );

      expect(screen.queryByText('Clear')).not.toBeInTheDocument();
    });

    it('calls clearAllFilters when Clear button is clicked', () => {
      const ctx = createMockContext({
        activeCount: 2,
      });

      renderWithContext(
        <FilterBar showClearButton>
          <div>Content</div>
        </FilterBar>,
        ctx
      );

      const clearButton = screen.getByText('Clear');
      fireEvent.click(clearButton);

      expect(ctx.clearAllFilters).toHaveBeenCalledTimes(1);
    });

    it('renders custom Clear button label', () => {
      const ctx = createMockContext({
        activeCount: 2,
      });

      renderWithContext(
        <FilterBar showClearButton clearButtonLabel="Clear All">
          <div>Content</div>
        </FilterBar>,
        ctx
      );

      expect(screen.getByText('Clear All')).toBeInTheDocument();
    });

    it('shows Reset button when showResetButton is true', () => {
      renderWithContext(
        <FilterBar showResetButton>
          <div>Content</div>
        </FilterBar>
      );

      expect(screen.getByText('Reset')).toBeInTheDocument();
    });

    it('calls resetFilters when Reset button is clicked', () => {
      const ctx = createMockContext();

      renderWithContext(
        <FilterBar showResetButton>
          <div>Content</div>
        </FilterBar>,
        ctx
      );

      const resetButton = screen.getByText('Reset');
      fireEvent.click(resetButton);

      expect(ctx.resetFilters).toHaveBeenCalledTimes(1);
    });

    it('renders custom Reset button label', () => {
      renderWithContext(
        <FilterBar showResetButton resetButtonLabel="Reset All">
          <div>Content</div>
        </FilterBar>
      );

      expect(screen.getByText('Reset All')).toBeInTheDocument();
    });

    it('shows all action buttons together', () => {
      const ctx = createMockContext({
        hasPendingChanges: true,
        activeCount: 2,
      });

      renderWithContext(
        <FilterBar showApplyButton showClearButton showResetButton>
          <div>Content</div>
        </FilterBar>,
        ctx
      );

      expect(screen.getByText('Apply')).toBeInTheDocument();
      expect(screen.getByText('Clear')).toBeInTheDocument();
      expect(screen.getByText('Reset')).toBeInTheDocument();
    });
  });

  // 6. Ref forwarding
  describe('ref forwarding', () => {
    it('forwards ref to element', () => {
      const ref = React.createRef<HTMLDivElement>();
      renderWithContext(
        <FilterBar ref={ref}>
          <div>Content</div>
        </FilterBar>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards ref with attributes', () => {
      const ref = React.createRef<HTMLDivElement>();
      renderWithContext(
        <FilterBar ref={ref} data-testid="test-bar" wrap={false} gap="lg">
          <div>Content</div>
        </FilterBar>
      );

      expect(ref.current).toHaveAttribute('data-testid', 'test-bar');
      expect(ref.current).toHaveAttribute('data-gap', 'lg');
    });
  });

  // 7. Props spreading
  describe('props spreading', () => {
    it('accepts and applies data attributes', () => {
      renderWithContext(
        <FilterBar data-testid="test-bar" data-custom="value">
          <div>Content</div>
        </FilterBar>
      );

      const element = screen.getByTestId('test-bar');
      expect(element).toHaveAttribute('data-custom', 'value');
    });

    it('accepts id attribute', () => {
      const { container } = renderWithContext(
        <FilterBar id="filter-bar-1">
          <div>Content</div>
        </FilterBar>
      );

      const element = container.firstChild as HTMLElement;
      expect(element).toHaveAttribute('id', 'filter-bar-1');
    });

    it('accepts style prop', () => {
      const { container } = renderWithContext(
        <FilterBar style={{ backgroundColor: 'red' }}>
          <div>Content</div>
        </FilterBar>
      );

      const element = container.firstChild as HTMLElement;
      expect(element).toHaveStyle({ backgroundColor: 'red' });
    });
  });

  // 8. Edge cases
  describe('edge cases', () => {
    it('renders with null children', () => {
      renderWithContext(<FilterBar data-testid="empty-bar">{null}</FilterBar>);

      expect(screen.getByTestId('empty-bar')).toBeInTheDocument();
    });

    it('renders with undefined children', () => {
      renderWithContext(<FilterBar data-testid="empty-bar">{undefined}</FilterBar>);

      expect(screen.getByTestId('empty-bar')).toBeInTheDocument();
    });

    it('renders with empty visibleFilters array', () => {
      const ctx = createMockContext();
      renderWithContext(
        <FilterBar visibleFilters={[]}>
          <div>Content</div>
        </FilterBar>,
        ctx
      );

      // All filters should go to More Filters
      expect(screen.getByText('More Filters')).toBeInTheDocument();
    });

    it('renders with undefined visibleFilters', () => {
      const ctx = createMockContext();
      renderWithContext(
        <FilterBar>
          <div>Content</div>
        </FilterBar>,
        ctx
      );

      // Should not show More Filters when visibleFilters is undefined
      expect(screen.queryByText('More Filters')).not.toBeInTheDocument();
    });

    it('handles null context gracefully', () => {
      renderWithContext(
        <FilterBar visibleFilters={['status']}>
          <div>Content</div>
        </FilterBar>,
        null
      );

      // Should not crash, just not show More Filters
      expect(screen.queryByText('More Filters')).not.toBeInTheDocument();
    });

    it('handles empty filters array in context', () => {
      const ctx = createMockContext({
        filters: [],
      });

      renderWithContext(
        <FilterBar visibleFilters={['status']}>
          <div>Content</div>
        </FilterBar>,
        ctx
      );

      expect(screen.queryByText('More Filters')).not.toBeInTheDocument();
    });

    it('does not show Clear button without context', () => {
      renderWithContext(
        <FilterBar showClearButton>
          <div>Content</div>
        </FilterBar>,
        null
      );

      expect(screen.queryByText('Clear')).not.toBeInTheDocument();
    });

    it('does not show Apply button without context', () => {
      renderWithContext(
        <FilterBar showApplyButton>
          <div>Content</div>
        </FilterBar>,
        null
      );

      expect(screen.queryByText('Apply')).not.toBeInTheDocument();
    });
  });

  // 9. Integration tests
  describe('integration', () => {
    it('renders complete filter bar with all features', () => {
      const ctx = createMockContext({
        hasPendingChanges: true,
        activeCount: 3,
        isFilterActive: jest.fn((id) => id === 'priority'),
      });

      renderWithContext(
        <FilterBar
          visibleFilters={['status', 'date']}
          showMoreFilters
          showApplyButton
          showClearButton
          showResetButton
          showActiveFilters
          activeFiltersPosition="inline"
          wrap
          gap="md"
          className="custom-filter-bar"
          data-testid="full-filter-bar"
        >
          <div>Filter Controls</div>
        </FilterBar>,
        ctx
      );

      // Main content
      expect(screen.getByText('Filter Controls')).toBeInTheDocument();

      // More Filters button
      expect(screen.getByText('More Filters')).toBeInTheDocument();

      // Active filters
      expect(screen.getByTestId('active-filters')).toBeInTheDocument();

      // Action buttons
      expect(screen.getByText('Apply')).toBeInTheDocument();
      expect(screen.getByText('Clear')).toBeInTheDocument();
      expect(screen.getByText('Reset')).toBeInTheDocument();

      // Custom attributes
      const filterBar = screen.getByTestId('full-filter-bar');
      expect(filterBar).toHaveClass('custom-filter-bar');
      expect(filterBar).toHaveAttribute('data-wrap', 'true');
      expect(filterBar).toHaveAttribute('data-gap', 'md');
    });

    it('handles multiple action button interactions', () => {
      const ctx = createMockContext({
        hasPendingChanges: true,
        activeCount: 2,
      });

      renderWithContext(
        <FilterBar showApplyButton showClearButton showResetButton>
          <div>Content</div>
        </FilterBar>,
        ctx
      );

      // Click Apply
      fireEvent.click(screen.getByText('Apply'));
      expect(ctx.applyFilters).toHaveBeenCalledTimes(1);

      // Click Clear
      fireEvent.click(screen.getByText('Clear'));
      expect(ctx.clearAllFilters).toHaveBeenCalledTimes(1);

      // Click Reset
      fireEvent.click(screen.getByText('Reset'));
      expect(ctx.resetFilters).toHaveBeenCalledTimes(1);
    });

    it('updates when context values change', () => {
      const ctx = createMockContext({
        activeCount: 0,
        hasPendingChanges: false,
      });

      const { rerender } = renderWithContext(
        <FilterBar showApplyButton showClearButton>
          <div>Content</div>
        </FilterBar>,
        ctx
      );

      // Initially no buttons shown
      expect(screen.queryByText('Apply')).not.toBeInTheDocument();
      expect(screen.queryByText('Clear')).not.toBeInTheDocument();

      // Update context
      const updatedCtx = createMockContext({
        activeCount: 2,
        hasPendingChanges: true,
      });

      rerender(
        <FilterContext.Provider value={updatedCtx}>
          <FilterBar showApplyButton showClearButton>
            <div>Content</div>
          </FilterBar>
        </FilterContext.Provider>
      );

      // Now buttons should be shown
      expect(screen.getByText('Apply')).toBeInTheDocument();
      expect(screen.getByText('Clear')).toBeInTheDocument();
    });
  });

  // 10. Display name
  describe('display name', () => {
    it('has correct display name', () => {
      expect(FilterBar.displayName).toBe('FilterBar');
    });
  });
});
