import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterSidebar } from './FilterSidebar';
import { FilterContext } from '../../FilterContext';
import type { FilterContextValue } from '../../types';

// Mock dependencies
jest.mock('../../../buttons/Button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

jest.mock('../../../display/Icon', () => ({
  Icon: ({ name, size, ...props }: any) => (
    <span data-icon={name} data-size={size} {...props}>
      {name}
    </span>
  ),
}));

jest.mock('../../../display/ScrollArea', () => ({
  ScrollArea: ({ children, className, ...props }: any) => (
    <div className={className} data-component="scroll-area" data-testid="scroll-area" {...props}>
      {children}
    </div>
  ),
}));

jest.mock('../../core/ActiveFilters', () => ({
  ActiveFilters: ({ maxVisible, showClearAll }: any) => (
    <div
      data-testid="active-filters"
      data-max-visible={maxVisible}
      data-show-clear-all={showClearAll}
    >
      Active Filters
    </div>
  ),
}));

describe('FilterSidebar', () => {
  const mockContextValue: FilterContextValue = {
    filters: [],
    groups: [],
    values: {},
    loadingFilters: new Set(),
    errors: {},
    touched: new Set(),
    isDirty: false,
    activeCount: 0,
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
    getActiveFilters: jest.fn(),
    toSearchParams: jest.fn(),
    fromSearchParams: jest.fn(),
    getFilter: jest.fn(),
    getFiltersByGroup: jest.fn(),
    getUngroupedFilters: jest.fn(),
    isFilterVisible: jest.fn(),
    isFilterEnabled: jest.fn(),
    getFilterOptions: jest.fn(),
    reloadFilterOptions: jest.fn(),
    size: 'md',
    applyFilters: jest.fn(),
  };

  const renderWithContext = (ui: React.ReactElement, contextValue = mockContextValue) => {
    return render(<FilterContext.Provider value={contextValue}>{ui}</FilterContext.Provider>);
  };

  // 1. Rendering tests
  describe('rendering', () => {
    it('renders with default props', () => {
      renderWithContext(<FilterSidebar>Test Content</FilterSidebar>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders as aside element', () => {
      const { container } = renderWithContext(<FilterSidebar>Test</FilterSidebar>);
      const aside = container.querySelector('aside');
      expect(aside).toBeInTheDocument();
      expect(aside?.tagName).toBe('ASIDE');
    });

    it('renders children in scroll area', () => {
      renderWithContext(
        <FilterSidebar>
          <div>Filter Content</div>
        </FilterSidebar>
      );
      const scrollArea = screen.getByTestId('scroll-area');
      expect(scrollArea).toBeInTheDocument();
      expect(scrollArea).toHaveAttribute('data-component', 'scroll-area');
      expect(screen.getByText('Filter Content')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = renderWithContext(
        <FilterSidebar className="custom-class">Test</FilterSidebar>
      );
      const aside = container.querySelector('aside');
      expect(aside).toHaveClass('custom-class');
    });

    it('applies custom width via CSS variable', () => {
      const { container } = renderWithContext(<FilterSidebar width={320}>Test</FilterSidebar>);
      const aside = container.querySelector('aside');
      expect(aside).toHaveStyle({ '--sidebar-width': '320px' });
    });

    it('renders without context', () => {
      render(<FilterSidebar>Test Content</FilterSidebar>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  // 2. Position tests
  describe('position', () => {
    it('renders left position by default', () => {
      const { container } = renderWithContext(<FilterSidebar>Test</FilterSidebar>);
      const aside = container.querySelector('aside');
      expect(aside).toHaveAttribute('data-position', 'left');
    });

    it('renders left position', () => {
      const { container } = renderWithContext(<FilterSidebar position="left">Test</FilterSidebar>);
      const aside = container.querySelector('aside');
      expect(aside).toHaveAttribute('data-position', 'left');
    });

    it('renders right position', () => {
      const { container } = renderWithContext(<FilterSidebar position="right">Test</FilterSidebar>);
      const aside = container.querySelector('aside');
      expect(aside).toHaveAttribute('data-position', 'right');
    });
  });

  // 3. Collapsible behavior tests
  describe('collapsible behavior', () => {
    it('is not collapsible by default', () => {
      renderWithContext(<FilterSidebar>Test</FilterSidebar>);
      expect(screen.queryByLabelText(/collapse|expand/i)).not.toBeInTheDocument();
    });

    it('shows collapse button when collapsible is true', () => {
      renderWithContext(<FilterSidebar collapsible>Test</FilterSidebar>);
      expect(screen.getByLabelText('Collapse filters')).toBeInTheDocument();
    });

    it('is not collapsed by default', () => {
      const { container } = renderWithContext(<FilterSidebar collapsible>Test</FilterSidebar>);
      const aside = container.querySelector('aside');
      expect(aside).not.toHaveAttribute('data-collapsed');
    });

    it('collapses when collapse button is clicked', () => {
      const { container } = renderWithContext(<FilterSidebar collapsible>Test</FilterSidebar>);
      const aside = container.querySelector('aside');
      const collapseButton = screen.getByLabelText('Collapse filters');

      fireEvent.click(collapseButton);

      expect(aside).toHaveAttribute('data-collapsed', 'true');
      expect(screen.getByLabelText('Expand filters')).toBeInTheDocument();
    });

    it('expands when expand button is clicked', () => {
      const { container } = renderWithContext(
        <FilterSidebar collapsible defaultCollapsed>
          Test
        </FilterSidebar>
      );
      const aside = container.querySelector('aside');
      const expandButton = screen.getByLabelText('Expand filters');

      fireEvent.click(expandButton);

      expect(aside).not.toHaveAttribute('data-collapsed');
      expect(screen.getByLabelText('Collapse filters')).toBeInTheDocument();
    });

    it('respects defaultCollapsed prop', () => {
      const { container } = renderWithContext(
        <FilterSidebar collapsible defaultCollapsed>
          Test
        </FilterSidebar>
      );
      const aside = container.querySelector('aside');
      expect(aside).toHaveAttribute('data-collapsed', 'true');
    });

    it('calls onCollapsedChange when collapsed state changes', () => {
      const onCollapsedChange = jest.fn();
      renderWithContext(
        <FilterSidebar collapsible onCollapsedChange={onCollapsedChange}>
          Test
        </FilterSidebar>
      );

      const collapseButton = screen.getByLabelText('Collapse filters');
      fireEvent.click(collapseButton);

      expect(onCollapsedChange).toHaveBeenCalledWith(true);
    });

    it('calls onCollapsedChange when expanded', () => {
      const onCollapsedChange = jest.fn();
      renderWithContext(
        <FilterSidebar collapsible defaultCollapsed onCollapsedChange={onCollapsedChange}>
          Test
        </FilterSidebar>
      );

      const expandButton = screen.getByLabelText('Expand filters');
      fireEvent.click(expandButton);

      expect(onCollapsedChange).toHaveBeenCalledWith(false);
    });

    it('supports controlled collapsed state', () => {
      const { container, rerender } = renderWithContext(
        <FilterSidebar collapsible collapsed={false}>
          Test
        </FilterSidebar>
      );
      const aside = container.querySelector('aside');
      expect(aside).not.toHaveAttribute('data-collapsed');

      rerender(
        <FilterContext.Provider value={mockContextValue}>
          <FilterSidebar collapsible collapsed>
            Test
          </FilterSidebar>
        </FilterContext.Provider>
      );
      expect(aside).toHaveAttribute('data-collapsed', 'true');
    });

    it('hides content when collapsed', () => {
      renderWithContext(
        <FilterSidebar collapsible defaultCollapsed>
          <div>Hidden Content</div>
        </FilterSidebar>
      );

      expect(screen.queryByTestId('scroll-area')).not.toBeInTheDocument();
      expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument();
    });

    it('shows left chevron icon for left position', () => {
      renderWithContext(
        <FilterSidebar collapsible position="left">
          Test
        </FilterSidebar>
      );
      const icon = screen.getByLabelText('Collapse filters').querySelector('[data-icon]');
      expect(icon).toHaveAttribute('data-icon', 'chevron-left');
    });

    it('shows right chevron icon for right position', () => {
      renderWithContext(
        <FilterSidebar collapsible position="right">
          Test
        </FilterSidebar>
      );
      const icon = screen.getByLabelText('Collapse filters').querySelector('[data-icon]');
      expect(icon).toHaveAttribute('data-icon', 'chevron-right');
    });
  });

  // 4. Header tests
  describe('header', () => {
    it('does not render header by default', () => {
      const { container } = renderWithContext(<FilterSidebar>Test</FilterSidebar>);
      const header = container.querySelector('[class*="header"]');
      expect(header).not.toBeInTheDocument();
    });

    it('renders header when provided', () => {
      renderWithContext(<FilterSidebar header={<h3>Filter Title</h3>}>Test</FilterSidebar>);
      expect(screen.getByText('Filter Title')).toBeInTheDocument();
    });

    it('renders header with string content', () => {
      renderWithContext(<FilterSidebar header="Filters">Test</FilterSidebar>);
      expect(screen.getByText('Filters')).toBeInTheDocument();
    });

    it('renders header with complex content', () => {
      renderWithContext(
        <FilterSidebar
          header={
            <div>
              <h3>Title</h3>
              <p>Description</p>
            </div>
          }
        >
          Test
        </FilterSidebar>
      );
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('renders header with collapse button when collapsible', () => {
      renderWithContext(
        <FilterSidebar collapsible header={<h3>Filters</h3>}>
          Test
        </FilterSidebar>
      );
      expect(screen.getByText('Filters')).toBeInTheDocument();
      expect(screen.getByLabelText('Collapse filters')).toBeInTheDocument();
    });

    it('renders header without content when only collapsible', () => {
      const { container } = renderWithContext(<FilterSidebar collapsible>Test</FilterSidebar>);
      const header = container.querySelector('[class*="header"]');
      expect(header).toBeInTheDocument();
      expect(screen.getByLabelText('Collapse filters')).toBeInTheDocument();
    });
  });

  // 5. Footer tests
  describe('footer', () => {
    it('does not render footer by default', () => {
      const { container } = renderWithContext(<FilterSidebar>Test</FilterSidebar>);
      const footer = container.querySelector('[class*="footer"]');
      expect(footer).not.toBeInTheDocument();
    });

    it('renders footer when provided', () => {
      renderWithContext(
        <FilterSidebar footer={<button>Footer Action</button>}>Test</FilterSidebar>
      );
      expect(screen.getByText('Footer Action')).toBeInTheDocument();
    });

    it('renders footer with string content', () => {
      renderWithContext(<FilterSidebar footer="Footer text">Test</FilterSidebar>);
      expect(screen.getByText('Footer text')).toBeInTheDocument();
    });

    it('renders footer with complex content', () => {
      renderWithContext(
        <FilterSidebar
          footer={
            <div>
              <button>Cancel</button>
              <button>Apply</button>
            </div>
          }
        >
          Test
        </FilterSidebar>
      );
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Apply')).toBeInTheDocument();
    });

    it('hides footer when collapsed', () => {
      renderWithContext(
        <FilterSidebar collapsible defaultCollapsed footer={<div>Footer</div>}>
          Test
        </FilterSidebar>
      );
      expect(screen.queryByText('Footer')).not.toBeInTheDocument();
    });

    it('shows footer when expanded', () => {
      renderWithContext(
        <FilterSidebar collapsible footer={<div>Footer</div>}>
          Test
        </FilterSidebar>
      );
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });
  });

  // 6. Header and footer combined
  describe('header and footer combined', () => {
    it('renders both header and footer', () => {
      renderWithContext(
        <FilterSidebar header={<h3>Header</h3>} footer={<button>Footer</button>}>
          Body
        </FilterSidebar>
      );
      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Body')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    it('hides footer but shows header when collapsed', () => {
      renderWithContext(
        <FilterSidebar
          collapsible
          defaultCollapsed
          header={<h3>Header</h3>}
          footer={<div>Footer</div>}
        >
          Body
        </FilterSidebar>
      );
      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.queryByText('Footer')).not.toBeInTheDocument();
      expect(screen.queryByText('Body')).not.toBeInTheDocument();
    });
  });

  // 7. Active filters tests
  describe('active filters', () => {
    it('shows active filters by default', () => {
      renderWithContext(<FilterSidebar>Test</FilterSidebar>);
      expect(screen.getByTestId('active-filters')).toBeInTheDocument();
    });

    it('hides active filters when showActiveFilters is false', () => {
      renderWithContext(<FilterSidebar showActiveFilters={false}>Test</FilterSidebar>);
      expect(screen.queryByTestId('active-filters')).not.toBeInTheDocument();
    });

    it('shows active filters at top by default', () => {
      const { container } = renderWithContext(<FilterSidebar>Test</FilterSidebar>);
      const aside = container.querySelector('aside');

      // Check order: active filters container should come before scroll area in DOM
      const children = Array.from(aside?.children || []);
      const activeFiltersContainerIndex = children.findIndex((child) =>
        child.classList.contains('activeFiltersContainer')
      );
      const scrollAreaIndex = children.findIndex(
        (child) => child.getAttribute('data-component') === 'scroll-area'
      );

      expect(activeFiltersContainerIndex).toBeGreaterThanOrEqual(0);
      expect(scrollAreaIndex).toBeGreaterThanOrEqual(0);
      expect(activeFiltersContainerIndex).toBeLessThan(scrollAreaIndex);
    });

    it('shows active filters at bottom when activeFiltersPosition is bottom', () => {
      const { container } = renderWithContext(
        <FilterSidebar activeFiltersPosition="bottom">Test</FilterSidebar>
      );
      const activeFilters = screen.getByTestId('active-filters');
      const scrollArea = screen.getByTestId('scroll-area');
      const aside = container.querySelector('aside');

      // Check order: scroll area should come before active filters in DOM
      const children = Array.from(aside?.children || []);
      const activeFiltersIndex = children.indexOf(activeFilters.parentElement as Element);
      const scrollAreaIndex = children.indexOf(scrollArea.parentElement as Element);

      expect(scrollAreaIndex).toBeLessThan(activeFiltersIndex);
    });

    it('hides active filters when collapsed', () => {
      renderWithContext(
        <FilterSidebar collapsible defaultCollapsed>
          Test
        </FilterSidebar>
      );
      expect(screen.queryByTestId('active-filters')).not.toBeInTheDocument();
    });

    it('passes correct props to ActiveFilters component', () => {
      renderWithContext(<FilterSidebar>Test</FilterSidebar>);
      const activeFilters = screen.getByTestId('active-filters');
      expect(activeFilters).toHaveAttribute('data-max-visible', '3');
      expect(activeFilters).toHaveAttribute('data-show-clear-all', 'false');
    });
  });

  // 8. Action buttons tests
  describe('action buttons', () => {
    it('does not show action buttons by default', () => {
      renderWithContext(<FilterSidebar>Test</FilterSidebar>);
      expect(screen.queryByText('Apply')).not.toBeInTheDocument();
      expect(screen.queryByText('Clear')).not.toBeInTheDocument();
      expect(screen.queryByText('Reset')).not.toBeInTheDocument();
    });

    it('shows apply button when showApplyButton is true and has pending changes', () => {
      const contextWithPending = { ...mockContextValue, hasPendingChanges: true };
      renderWithContext(<FilterSidebar showApplyButton>Test</FilterSidebar>, contextWithPending);
      expect(screen.getByText('Apply')).toBeInTheDocument();
    });

    it('does not show apply button when no pending changes', () => {
      renderWithContext(<FilterSidebar showApplyButton>Test</FilterSidebar>);
      expect(screen.queryByText('Apply')).not.toBeInTheDocument();
    });

    it('shows clear button when showClearButton is true and has active filters', () => {
      const contextWithActive = { ...mockContextValue, activeCount: 2 };
      renderWithContext(<FilterSidebar showClearButton>Test</FilterSidebar>, contextWithActive);
      expect(screen.getByText('Clear')).toBeInTheDocument();
    });

    it('does not show clear button when no active filters', () => {
      renderWithContext(<FilterSidebar showClearButton>Test</FilterSidebar>);
      expect(screen.queryByText('Clear')).not.toBeInTheDocument();
    });

    it('shows reset button when showResetButton is true', () => {
      renderWithContext(<FilterSidebar showResetButton>Test</FilterSidebar>);
      expect(screen.getByText('Reset')).toBeInTheDocument();
    });

    it('uses custom button labels', () => {
      const contextWithData = { ...mockContextValue, activeCount: 2, hasPendingChanges: true };
      renderWithContext(
        <FilterSidebar
          showApplyButton
          showClearButton
          showResetButton
          applyButtonLabel="Apply Filters"
          clearButtonLabel="Clear All"
          resetButtonLabel="Reset All"
        >
          Test
        </FilterSidebar>,
        contextWithData
      );
      expect(screen.getByText('Apply Filters')).toBeInTheDocument();
      expect(screen.getByText('Clear All')).toBeInTheDocument();
      expect(screen.getByText('Reset All')).toBeInTheDocument();
    });

    it('calls applyFilters when apply button is clicked', () => {
      const contextWithPending = { ...mockContextValue, hasPendingChanges: true };
      renderWithContext(<FilterSidebar showApplyButton>Test</FilterSidebar>, contextWithPending);
      const applyButton = screen.getByText('Apply');
      fireEvent.click(applyButton);
      expect(contextWithPending.applyFilters).toHaveBeenCalled();
    });

    it('calls clearAllFilters when clear button is clicked', () => {
      const contextWithActive = { ...mockContextValue, activeCount: 2 };
      renderWithContext(<FilterSidebar showClearButton>Test</FilterSidebar>, contextWithActive);
      const clearButton = screen.getByText('Clear');
      fireEvent.click(clearButton);
      expect(contextWithActive.clearAllFilters).toHaveBeenCalled();
    });

    it('calls resetFilters when reset button is clicked', () => {
      renderWithContext(<FilterSidebar showResetButton>Test</FilterSidebar>);
      const resetButton = screen.getByText('Reset');
      fireEvent.click(resetButton);
      expect(mockContextValue.resetFilters).toHaveBeenCalled();
    });

    it('hides action buttons when collapsed', () => {
      const contextWithData = { ...mockContextValue, activeCount: 2, hasPendingChanges: true };
      renderWithContext(
        <FilterSidebar collapsible defaultCollapsed showApplyButton showClearButton showResetButton>
          Test
        </FilterSidebar>,
        contextWithData
      );
      expect(screen.queryByText('Apply')).not.toBeInTheDocument();
      expect(screen.queryByText('Clear')).not.toBeInTheDocument();
      expect(screen.queryByText('Reset')).not.toBeInTheDocument();
    });

    it('shows all three buttons together', () => {
      const contextWithData = { ...mockContextValue, activeCount: 2, hasPendingChanges: true };
      renderWithContext(
        <FilterSidebar showApplyButton showClearButton showResetButton>
          Test
        </FilterSidebar>,
        contextWithData
      );
      expect(screen.getByText('Apply')).toBeInTheDocument();
      expect(screen.getByText('Clear')).toBeInTheDocument();
      expect(screen.getByText('Reset')).toBeInTheDocument();
    });

    it('handles missing context gracefully', () => {
      render(
        <FilterSidebar showApplyButton showClearButton showResetButton>
          Test
        </FilterSidebar>
      );
      // Should render reset button (doesn't depend on context)
      expect(screen.getByText('Reset')).toBeInTheDocument();
      // Should not render apply/clear (depend on context)
      expect(screen.queryByText('Apply')).not.toBeInTheDocument();
      expect(screen.queryByText('Clear')).not.toBeInTheDocument();
    });
  });

  // 9. Width tests
  describe('width', () => {
    it('uses default width of 280px', () => {
      const { container } = renderWithContext(<FilterSidebar>Test</FilterSidebar>);
      const aside = container.querySelector('aside');
      expect(aside).toHaveStyle({ '--sidebar-width': '280px' });
    });

    it('applies custom width', () => {
      const { container } = renderWithContext(<FilterSidebar width={350}>Test</FilterSidebar>);
      const aside = container.querySelector('aside');
      expect(aside).toHaveStyle({ '--sidebar-width': '350px' });
    });

    it('applies different widths', () => {
      const widths = [200, 280, 320, 400];
      widths.forEach((width) => {
        const { container, unmount } = renderWithContext(
          <FilterSidebar width={width}>Test</FilterSidebar>
        );
        const aside = container.querySelector('aside');
        expect(aside).toHaveStyle({ '--sidebar-width': `${width}px` });
        unmount();
      });
    });
  });

  // 10. Accessibility tests
  describe('accessibility', () => {
    it('has correct aria-label on collapse button', () => {
      renderWithContext(<FilterSidebar collapsible>Test</FilterSidebar>);
      const collapseButton = screen.getByLabelText('Collapse filters');
      expect(collapseButton).toHaveAttribute('aria-label', 'Collapse filters');
    });

    it('updates aria-label when collapsed', () => {
      renderWithContext(<FilterSidebar collapsible>Test</FilterSidebar>);
      const collapseButton = screen.getByLabelText('Collapse filters');
      fireEvent.click(collapseButton);
      expect(screen.getByLabelText('Expand filters')).toHaveAttribute(
        'aria-label',
        'Expand filters'
      );
    });

    it('collapse button is a button element', () => {
      renderWithContext(<FilterSidebar collapsible>Test</FilterSidebar>);
      const collapseButton = screen.getByLabelText('Collapse filters');
      expect(collapseButton.tagName).toBe('BUTTON');
      expect(collapseButton).toHaveAttribute('type', 'button');
    });

    it('accepts additional ARIA attributes', () => {
      const { container } = renderWithContext(
        <FilterSidebar aria-label="Filter panel" role="complementary">
          Test
        </FilterSidebar>
      );
      const aside = container.querySelector('aside');
      expect(aside).toHaveAttribute('aria-label', 'Filter panel');
      expect(aside).toHaveAttribute('role', 'complementary');
    });
  });

  // 11. Ref forwarding
  describe('ref forwarding', () => {
    it('forwards ref to aside element', () => {
      const ref = React.createRef<HTMLDivElement>();
      renderWithContext(<FilterSidebar ref={ref}>Test</FilterSidebar>);
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName).toBe('ASIDE');
    });

    it('forwards ref with attributes', () => {
      const ref = React.createRef<HTMLDivElement>();
      renderWithContext(
        <FilterSidebar ref={ref} position="right" width={320}>
          Test
        </FilterSidebar>
      );
      expect(ref.current).toHaveAttribute('data-position', 'right');
      expect(ref.current).toHaveStyle({ '--sidebar-width': '320px' });
    });

    it('handles callback ref', () => {
      const refCallback = jest.fn();
      renderWithContext(<FilterSidebar ref={refCallback}>Test</FilterSidebar>);
      expect(refCallback).toHaveBeenCalledWith(expect.any(HTMLElement));
    });
  });

  // 12. Custom styling
  describe('custom styling', () => {
    it('accepts custom className', () => {
      const { container } = renderWithContext(
        <FilterSidebar className="custom-sidebar">Test</FilterSidebar>
      );
      const aside = container.querySelector('aside');
      expect(aside).toHaveClass('custom-sidebar');
    });

    it('accepts custom style prop', () => {
      const { container } = renderWithContext(
        <FilterSidebar style={{ backgroundColor: 'red' }}>Test</FilterSidebar>
      );
      const aside = container.querySelector('aside');
      expect(aside).toHaveStyle({ backgroundColor: 'red' });
    });

    it('accepts id attribute', () => {
      const { container } = renderWithContext(
        <FilterSidebar id="filter-sidebar-1">Test</FilterSidebar>
      );
      const aside = container.querySelector('aside');
      expect(aside).toHaveAttribute('id', 'filter-sidebar-1');
    });

    it('handles undefined className gracefully', () => {
      const { container } = renderWithContext(
        <FilterSidebar className={undefined}>Test</FilterSidebar>
      );
      const aside = container.querySelector('aside');
      expect(aside).toBeInTheDocument();
    });
  });

  // 13. Props spreading
  describe('props spreading', () => {
    it('accepts and applies data attributes', () => {
      const { container } = renderWithContext(
        <FilterSidebar data-testid="test-sidebar" data-custom="value">
          Test
        </FilterSidebar>
      );
      const aside = container.querySelector('aside');
      expect(aside).toHaveAttribute('data-testid', 'test-sidebar');
      expect(aside).toHaveAttribute('data-custom', 'value');
    });

    it('accepts and applies title attribute', () => {
      const { container } = renderWithContext(
        <FilterSidebar title="Sidebar title">Test</FilterSidebar>
      );
      const aside = container.querySelector('aside');
      expect(aside).toHaveAttribute('title', 'Sidebar title');
    });

    it('forwards additional HTML attributes', () => {
      const { container } = renderWithContext(
        <FilterSidebar data-custom="value" id="custom-id">
          Test
        </FilterSidebar>
      );
      const aside = container.querySelector('aside');
      expect(aside).toHaveAttribute('data-custom', 'value');
      expect(aside).toHaveAttribute('id', 'custom-id');
    });
  });

  // 14. Combined props tests
  describe('combined props', () => {
    it('renders with all features enabled', () => {
      const contextWithData = { ...mockContextValue, activeCount: 2, hasPendingChanges: true };
      renderWithContext(
        <FilterSidebar
          width={320}
          collapsible
          position="right"
          header={<h3>Filters</h3>}
          footer={<div>Footer</div>}
          showActiveFilters
          activeFiltersPosition="bottom"
          showApplyButton
          showClearButton
          showResetButton
          className="custom-class"
        >
          <div>Content</div>
        </FilterSidebar>,
        contextWithData
      );

      expect(screen.getByText('Filters')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
      expect(screen.getByTestId('active-filters')).toBeInTheDocument();
      expect(screen.getByText('Apply')).toBeInTheDocument();
      expect(screen.getByText('Clear')).toBeInTheDocument();
      expect(screen.getByText('Reset')).toBeInTheDocument();
      expect(screen.getByLabelText('Collapse filters')).toBeInTheDocument();
    });

    it('renders collapsed sidebar with header only', () => {
      renderWithContext(
        <FilterSidebar
          collapsible
          defaultCollapsed
          header={<h3>Filters</h3>}
          footer={<div>Footer</div>}
          showActiveFilters
        >
          <div>Content</div>
        </FilterSidebar>
      );

      expect(screen.getByText('Filters')).toBeInTheDocument();
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
      expect(screen.queryByText('Footer')).not.toBeInTheDocument();
      expect(screen.queryByTestId('active-filters')).not.toBeInTheDocument();
    });

    it('handles toggle while having all features', () => {
      const contextWithData = { ...mockContextValue, activeCount: 2, hasPendingChanges: true };
      renderWithContext(
        <FilterSidebar
          collapsible
          header={<h3>Filters</h3>}
          footer={<div>Footer</div>}
          showApplyButton
          showClearButton
          showResetButton
        >
          <div>Content</div>
        </FilterSidebar>,
        contextWithData
      );

      // Verify expanded state
      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
      expect(screen.getByText('Apply')).toBeInTheDocument();

      // Collapse
      fireEvent.click(screen.getByLabelText('Collapse filters'));

      // Verify collapsed state
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
      expect(screen.queryByText('Footer')).not.toBeInTheDocument();
      expect(screen.queryByText('Apply')).not.toBeInTheDocument();

      // Expand
      fireEvent.click(screen.getByLabelText('Expand filters'));

      // Verify expanded again
      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
      expect(screen.getByText('Apply')).toBeInTheDocument();
    });
  });

  // 15. Edge cases
  describe('edge cases', () => {
    it('renders with null children', () => {
      const { container } = renderWithContext(
        <FilterSidebar data-testid="sidebar">{null}</FilterSidebar>
      );
      const aside = container.querySelector('[data-testid="sidebar"]');
      expect(aside).toBeInTheDocument();
    });

    it('renders with undefined children', () => {
      const { container } = renderWithContext(
        <FilterSidebar data-testid="sidebar">{undefined}</FilterSidebar>
      );
      const aside = container.querySelector('[data-testid="sidebar"]');
      expect(aside).toBeInTheDocument();
    });

    it('renders with empty string children', () => {
      renderWithContext(<FilterSidebar data-testid="sidebar" />);
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    it('handles null header', () => {
      const { container } = renderWithContext(<FilterSidebar header={null}>Body</FilterSidebar>);
      const header = container.querySelector('[class*="header"]');
      expect(header).not.toBeInTheDocument();
    });

    it('handles null footer', () => {
      const { container } = renderWithContext(<FilterSidebar footer={null}>Body</FilterSidebar>);
      const footer = container.querySelector('[class*="footer"]');
      expect(footer).not.toBeInTheDocument();
    });

    it('handles empty string header', () => {
      const { container } = renderWithContext(<FilterSidebar header="">Body</FilterSidebar>);
      const header = container.querySelector('[class*="header"]');
      // Empty string is falsy, so header shouldn't render
      expect(header).not.toBeInTheDocument();
    });

    it('handles empty string footer', () => {
      const { container } = renderWithContext(<FilterSidebar footer="">Body</FilterSidebar>);
      const footer = container.querySelector('[class*="footer"]');
      // Empty string is falsy, so footer shouldn't render
      expect(footer).not.toBeInTheDocument();
    });

    it('handles context without applyFilters method', () => {
      const incompleteContext = { ...mockContextValue, applyFilters: undefined } as any;
      render(
        <FilterContext.Provider value={incompleteContext}>
          <FilterSidebar showApplyButton>Test</FilterSidebar>
        </FilterContext.Provider>
      );
      // Should not crash
      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('handles context without clearAllFilters method', () => {
      const incompleteContext = { ...mockContextValue, clearAllFilters: undefined } as any;
      render(
        <FilterContext.Provider value={incompleteContext}>
          <FilterSidebar showClearButton>Test</FilterSidebar>
        </FilterContext.Provider>
      );
      // Should not crash
      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('handles context without resetFilters method', () => {
      const incompleteContext = { ...mockContextValue, resetFilters: undefined } as any;
      render(
        <FilterContext.Provider value={incompleteContext}>
          <FilterSidebar showResetButton>Test</FilterSidebar>
        </FilterContext.Provider>
      );
      // Should not crash
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  // 16. Display name
  describe('display name', () => {
    it('has correct display name', () => {
      expect(FilterSidebar.displayName).toBe('FilterSidebar');
    });
  });
});
