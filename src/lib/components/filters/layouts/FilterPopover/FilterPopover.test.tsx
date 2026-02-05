import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterPopover } from './FilterPopover';
import { FilterContext } from '../../FilterContext';
import type { FilterContextValue } from '../../types';

// Mock dependencies
jest.mock('../../../buttons/Button', () => ({
  Button: ({ children, onClick, variant, size, startIcon, endIcon, ...props }: any) => (
    <button onClick={onClick} data-variant={variant} data-size={size} {...props}>
      {startIcon}
      {children}
      {endIcon}
    </button>
  ),
}));

jest.mock('../../../display/Icon', () => ({
  Icon: ({ name, size, ...props }: any) => (
    <span data-icon={name} data-size={size} data-testid={`icon-${name}`} {...props}>
      {name}
    </span>
  ),
}));

jest.mock('../../../overlays/Popover', () => ({
  Popover: ({ isOpen, onOpenChange, trigger, children, position, closeOnClickOutside }: any) => (
    <div data-testid="mock-popover">
      <div
        data-testid="popover-trigger"
        onClick={() => onOpenChange?.(!isOpen)}
        data-position={position}
        data-close-on-click-outside={closeOnClickOutside}
      >
        {trigger}
      </div>
      {isOpen && <div data-testid="popover-content">{children}</div>}
    </div>
  ),
}));

jest.mock('../../core/ActiveFilters', () => ({
  ActiveFilters: ({ maxVisible, showClearAll, chipSize }: any) => (
    <div
      data-testid="active-filters"
      data-max-visible={maxVisible}
      data-show-clear-all={showClearAll}
      data-chip-size={chipSize}
    >
      Active Filters
    </div>
  ),
}));

describe('FilterPopover', () => {
  const createMockContext = (overrides?: Partial<FilterContextValue>): FilterContextValue => ({
    filters: [],
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
    applyFilters: jest.fn(),
    ...overrides,
  });

  const renderWithContext = (
    ui: React.ReactElement,
    contextValue?: Partial<FilterContextValue>
  ) => {
    const mockContext = createMockContext(contextValue);
    return render(<FilterContext.Provider value={mockContext}>{ui}</FilterContext.Provider>);
  };

  // 1. Rendering tests
  describe('rendering', () => {
    it('renders with default props', () => {
      renderWithContext(
        <FilterPopover>
          <div>Filter Content</div>
        </FilterPopover>
      );
      expect(screen.getByTestId('mock-popover')).toBeInTheDocument();
    });

    it('renders children correctly', () => {
      renderWithContext(
        <FilterPopover isOpen>
          <div>Filter Content</div>
        </FilterPopover>
      );
      expect(screen.getByText('Filter Content')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = renderWithContext(
        <FilterPopover className="custom-class">
          <div>Content</div>
        </FilterPopover>
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });

    it('renders with data-testid', () => {
      renderWithContext(
        <FilterPopover data-testid="custom-popover">
          <div>Content</div>
        </FilterPopover>
      );
      expect(screen.getByTestId('custom-popover')).toBeInTheDocument();
    });

    it('includes filterPopover class', () => {
      const { container } = renderWithContext(
        <FilterPopover>
          <div>Content</div>
        </FilterPopover>
      );
      const element = container.querySelector('[class*="filterPopover"]');
      expect(element).toBeInTheDocument();
    });
  });

  // 2. Trigger button tests
  describe('trigger button', () => {
    it('renders default trigger button', () => {
      renderWithContext(
        <FilterPopover>
          <div>Content</div>
        </FilterPopover>
      );
      expect(screen.getByText('Filters')).toBeInTheDocument();
    });

    it('renders custom trigger label', () => {
      renderWithContext(
        <FilterPopover triggerLabel="Custom Filters">
          <div>Content</div>
        </FilterPopover>
      );
      expect(screen.getByText('Custom Filters')).toBeInTheDocument();
    });

    it('renders custom trigger element', () => {
      renderWithContext(
        <FilterPopover trigger={<button>Custom Trigger</button>}>
          <div>Content</div>
        </FilterPopover>
      );
      expect(screen.getByText('Custom Trigger')).toBeInTheDocument();
    });

    it('renders filter icon in default trigger', () => {
      renderWithContext(
        <FilterPopover>
          <div>Content</div>
        </FilterPopover>
      );
      expect(screen.getByTestId('icon-filter')).toBeInTheDocument();
    });

    it('renders chevron-down icon in default trigger', () => {
      renderWithContext(
        <FilterPopover>
          <div>Content</div>
        </FilterPopover>
      );
      expect(screen.getByTestId('icon-chevron-down')).toBeInTheDocument();
    });

    it('sets icon size to 1em', () => {
      renderWithContext(
        <FilterPopover>
          <div>Content</div>
        </FilterPopover>
      );
      expect(screen.getByTestId('icon-filter')).toHaveAttribute('data-size', '1em');
      expect(screen.getByTestId('icon-chevron-down')).toHaveAttribute('data-size', '1em');
    });
  });

  // 3. Badge tests
  describe('badge', () => {
    it('does not show badge when activeCount is 0', () => {
      renderWithContext(
        <FilterPopover>
          <div>Content</div>
        </FilterPopover>,
        { activeCount: 0 }
      );
      const badge = screen.queryByText('0');
      expect(badge).not.toBeInTheDocument();
    });

    it('shows badge with activeCount when greater than 0', () => {
      renderWithContext(
        <FilterPopover>
          <div>Content</div>
        </FilterPopover>,
        { activeCount: 3 }
      );
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('does not show badge when showTriggerBadge is false', () => {
      renderWithContext(
        <FilterPopover showTriggerBadge={false}>
          <div>Content</div>
        </FilterPopover>,
        { activeCount: 5 }
      );
      const badge = screen.queryByText('5');
      expect(badge).not.toBeInTheDocument();
    });

    it('shows badge when showTriggerBadge is true and activeCount > 0', () => {
      renderWithContext(
        <FilterPopover showTriggerBadge>
          <div>Content</div>
        </FilterPopover>,
        { activeCount: 7 }
      );
      expect(screen.getByText('7')).toBeInTheDocument();
    });

    it('does not show badge with custom trigger', () => {
      renderWithContext(
        <FilterPopover trigger={<button>Custom</button>}>
          <div>Content</div>
        </FilterPopover>,
        { activeCount: 3 }
      );
      const badge = screen.queryByText('3');
      expect(badge).not.toBeInTheDocument();
    });

    it('updates badge when activeCount changes', () => {
      const { rerender } = renderWithContext(
        <FilterPopover>
          <div>Content</div>
        </FilterPopover>,
        { activeCount: 2 }
      );
      expect(screen.getByText('2')).toBeInTheDocument();

      const mockContext = createMockContext({ activeCount: 5 });
      rerender(
        <FilterContext.Provider value={mockContext}>
          <FilterPopover>
            <div>Content</div>
          </FilterPopover>
        </FilterContext.Provider>
      );
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  // 4. Popover state tests
  describe('popover state', () => {
    it('is closed by default', () => {
      renderWithContext(
        <FilterPopover>
          <div>Content</div>
        </FilterPopover>
      );
      expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
    });

    it('opens when defaultOpen is true', () => {
      renderWithContext(
        <FilterPopover defaultOpen>
          <div>Content</div>
        </FilterPopover>
      );
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    });

    it('respects controlled isOpen prop', () => {
      renderWithContext(
        <FilterPopover isOpen>
          <div>Content</div>
        </FilterPopover>
      );
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    });

    it('respects controlled isOpen={false} prop', () => {
      renderWithContext(
        <FilterPopover isOpen={false}>
          <div>Content</div>
        </FilterPopover>
      );
      expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
    });

    it('calls onOpenChange when state changes', () => {
      const onOpenChange = jest.fn();
      renderWithContext(
        <FilterPopover onOpenChange={onOpenChange}>
          <div>Content</div>
        </FilterPopover>
      );

      fireEvent.click(screen.getByTestId('popover-trigger'));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('updates controlled state when isOpen changes', () => {
      const { rerender } = renderWithContext(
        <FilterPopover isOpen={false}>
          <div>Content</div>
        </FilterPopover>
      );
      expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();

      const mockContext = createMockContext();
      rerender(
        <FilterContext.Provider value={mockContext}>
          <FilterPopover isOpen>
            <div>Content</div>
          </FilterPopover>
        </FilterContext.Provider>
      );
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    });
  });

  // 5. Position tests
  describe('position', () => {
    it('applies custom position', () => {
      renderWithContext(
        <FilterPopover position="bottom-end">
          <div>Content</div>
        </FilterPopover>
      );
      const trigger = screen.getByTestId('popover-trigger');
      expect(trigger).toHaveAttribute('data-position', 'bottom-end');
    });

    it('applies top position', () => {
      renderWithContext(
        <FilterPopover position="top">
          <div>Content</div>
        </FilterPopover>
      );
      const trigger = screen.getByTestId('popover-trigger');
      expect(trigger).toHaveAttribute('data-position', 'top');
    });
  });

  // 6. Width and height tests
  describe('width and height', () => {
    it('applies default width of 320px', () => {
      renderWithContext(
        <FilterPopover isOpen>
          <div>Content</div>
        </FilterPopover>
      );
      const content = screen.getByTestId('popover-content');
      const popoverContent = content.querySelector('[class*="popoverContent"]');
      expect(popoverContent).toHaveStyle({ width: '320px' });
    });

    it('applies custom numeric width', () => {
      renderWithContext(
        <FilterPopover isOpen width={400}>
          <div>Content</div>
        </FilterPopover>
      );
      const content = screen.getByTestId('popover-content');
      const popoverContent = content.querySelector('[class*="popoverContent"]');
      expect(popoverContent).toHaveStyle({ width: '400px' });
    });

    it('applies custom string width', () => {
      renderWithContext(
        <FilterPopover isOpen width="500px">
          <div>Content</div>
        </FilterPopover>
      );
      const content = screen.getByTestId('popover-content');
      const popoverContent = content.querySelector('[class*="popoverContent"]');
      expect(popoverContent).toHaveStyle({ width: '500px' });
    });

    it('does not apply maxHeight by default', () => {
      renderWithContext(
        <FilterPopover isOpen>
          <div>Content</div>
        </FilterPopover>
      );
      const content = screen.getByTestId('popover-content');
      const popoverContent = content.querySelector('[class*="popoverContent"]');
      expect(popoverContent).not.toHaveStyle({ maxHeight: expect.anything() });
    });

    it('applies custom numeric maxHeight', () => {
      renderWithContext(
        <FilterPopover isOpen maxHeight={300}>
          <div>Content</div>
        </FilterPopover>
      );
      const content = screen.getByTestId('popover-content');
      const popoverContent = content.querySelector('[class*="popoverContent"]');
      expect(popoverContent).toHaveStyle({ maxHeight: '300px' });
    });

    it('applies custom string maxHeight', () => {
      renderWithContext(
        <FilterPopover isOpen maxHeight="50vh">
          <div>Content</div>
        </FilterPopover>
      );
      const content = screen.getByTestId('popover-content');
      const popoverContent = content.querySelector('[class*="popoverContent"]');
      expect(popoverContent).toHaveStyle({ maxHeight: '50vh' });
    });
  });

  // 7. Action buttons tests
  describe('action buttons', () => {
    it('renders apply button by default', () => {
      renderWithContext(
        <FilterPopover isOpen>
          <div>Content</div>
        </FilterPopover>
      );
      expect(screen.getByText('Apply')).toBeInTheDocument();
    });

    it('renders custom apply button label', () => {
      renderWithContext(
        <FilterPopover isOpen applyButtonLabel="Submit Filters">
          <div>Content</div>
        </FilterPopover>
      );
      expect(screen.getByText('Submit Filters')).toBeInTheDocument();
    });

    it('does not render apply button when showApplyButton is false', () => {
      renderWithContext(
        <FilterPopover isOpen showApplyButton={false}>
          <div>Content</div>
        </FilterPopover>
      );
      expect(screen.queryByText('Apply')).not.toBeInTheDocument();
    });

    it('renders clear button when activeCount > 0', () => {
      renderWithContext(
        <FilterPopover isOpen>
          <div>Content</div>
        </FilterPopover>,
        { activeCount: 2 }
      );
      expect(screen.getByText('Clear')).toBeInTheDocument();
    });

    it('does not render clear button when activeCount is 0', () => {
      renderWithContext(
        <FilterPopover isOpen>
          <div>Content</div>
        </FilterPopover>,
        { activeCount: 0 }
      );
      expect(screen.queryByText('Clear')).not.toBeInTheDocument();
    });

    it('renders custom clear button label', () => {
      renderWithContext(
        <FilterPopover isOpen clearButtonLabel="Clear All Filters">
          <div>Content</div>
        </FilterPopover>,
        { activeCount: 2 }
      );
      expect(screen.getByText('Clear All Filters')).toBeInTheDocument();
    });

    it('does not render clear button when showClearButton is false', () => {
      renderWithContext(
        <FilterPopover isOpen showClearButton={false}>
          <div>Content</div>
        </FilterPopover>,
        { activeCount: 2 }
      );
      expect(screen.queryByText('Clear')).not.toBeInTheDocument();
    });

    it('does not render reset button by default', () => {
      renderWithContext(
        <FilterPopover isOpen>
          <div>Content</div>
        </FilterPopover>
      );
      expect(screen.queryByText('Reset')).not.toBeInTheDocument();
    });

    it('renders reset button when showResetButton is true', () => {
      renderWithContext(
        <FilterPopover isOpen showResetButton>
          <div>Content</div>
        </FilterPopover>
      );
      expect(screen.getByText('Reset')).toBeInTheDocument();
    });

    it('renders custom reset button label', () => {
      renderWithContext(
        <FilterPopover isOpen showResetButton resetButtonLabel="Reset to Default">
          <div>Content</div>
        </FilterPopover>
      );
      expect(screen.getByText('Reset to Default')).toBeInTheDocument();
    });
  });

  // 8. Button interactions tests
  describe('button interactions', () => {
    it('calls applyFilters when apply button is clicked', () => {
      const applyFilters = jest.fn();
      renderWithContext(
        <FilterPopover isOpen>
          <div>Content</div>
        </FilterPopover>,
        { applyFilters }
      );

      fireEvent.click(screen.getByText('Apply'));
      expect(applyFilters).toHaveBeenCalledTimes(1);
    });

    it('calls clearAllFilters when clear button is clicked', () => {
      const clearAllFilters = jest.fn();
      renderWithContext(
        <FilterPopover isOpen>
          <div>Content</div>
        </FilterPopover>,
        { activeCount: 2, clearAllFilters }
      );

      fireEvent.click(screen.getByText('Clear'));
      expect(clearAllFilters).toHaveBeenCalledTimes(1);
    });

    it('calls resetFilters when reset button is clicked', () => {
      const resetFilters = jest.fn();
      renderWithContext(
        <FilterPopover isOpen showResetButton>
          <div>Content</div>
        </FilterPopover>,
        { resetFilters }
      );

      fireEvent.click(screen.getByText('Reset'));
      expect(resetFilters).toHaveBeenCalledTimes(1);
    });

    it('closes popover after apply when closeOnApply is true', () => {
      const onOpenChange = jest.fn();
      renderWithContext(
        <FilterPopover isOpen onOpenChange={onOpenChange} closeOnApply>
          <div>Content</div>
        </FilterPopover>
      );

      fireEvent.click(screen.getByText('Apply'));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('does not close popover after apply when closeOnApply is false', () => {
      const onOpenChange = jest.fn();
      renderWithContext(
        <FilterPopover isOpen onOpenChange={onOpenChange} closeOnApply={false}>
          <div>Content</div>
        </FilterPopover>
      );

      fireEvent.click(screen.getByText('Apply'));
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('does not close popover after clear', () => {
      const onOpenChange = jest.fn();
      renderWithContext(
        <FilterPopover isOpen onOpenChange={onOpenChange}>
          <div>Content</div>
        </FilterPopover>,
        { activeCount: 2 }
      );

      fireEvent.click(screen.getByText('Clear'));
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('does not close popover after reset', () => {
      const onOpenChange = jest.fn();
      renderWithContext(
        <FilterPopover isOpen onOpenChange={onOpenChange} showResetButton>
          <div>Content</div>
        </FilterPopover>
      );

      fireEvent.click(screen.getByText('Reset'));
      expect(onOpenChange).not.toHaveBeenCalled();
    });
  });

  // 9. Active filters display tests
  describe('active filters display', () => {
    it('does not show active filters by default', () => {
      renderWithContext(
        <FilterPopover isOpen>
          <div>Content</div>
        </FilterPopover>,
        { activeCount: 2 }
      );
      expect(screen.queryByTestId('active-filters')).not.toBeInTheDocument();
    });

    it('shows active filters when showActiveFilters is true', () => {
      renderWithContext(
        <FilterPopover isOpen showActiveFilters>
          <div>Content</div>
        </FilterPopover>,
        { activeCount: 2 }
      );
      expect(screen.getByTestId('active-filters')).toBeInTheDocument();
    });

    it('does not show active filters when activeCount is 0', () => {
      renderWithContext(
        <FilterPopover isOpen showActiveFilters>
          <div>Content</div>
        </FilterPopover>,
        { activeCount: 0 }
      );
      expect(screen.queryByTestId('active-filters')).not.toBeInTheDocument();
    });

    it('shows active filters at bottom when activeFiltersPosition is bottom', () => {
      renderWithContext(
        <FilterPopover isOpen showActiveFilters activeFiltersPosition="bottom">
          <div>Content</div>
        </FilterPopover>,
        { activeCount: 2 }
      );
      const content = screen.getByTestId('popover-content');

      // Active filters should appear after content
      expect(content.innerHTML.indexOf('Content')).toBeLessThan(
        content.innerHTML.indexOf('active-filters')
      );
    });

    it('passes correct props to ActiveFilters component', () => {
      renderWithContext(
        <FilterPopover isOpen showActiveFilters>
          <div>Content</div>
        </FilterPopover>,
        { activeCount: 2 }
      );
      const activeFilters = screen.getByTestId('active-filters');
      expect(activeFilters).toHaveAttribute('data-max-visible', '3');
      expect(activeFilters).toHaveAttribute('data-show-clear-all', 'false');
      expect(activeFilters).toHaveAttribute('data-chip-size', 'sm');
    });
  });

  // 10. Close behavior tests
  describe('close behavior', () => {
    it('passes closeOnClickOutside to Popover', () => {
      renderWithContext(
        <FilterPopover closeOnClickOutside>
          <div>Content</div>
        </FilterPopover>
      );
      const trigger = screen.getByTestId('popover-trigger');
      expect(trigger).toHaveAttribute('data-close-on-click-outside', 'true');
    });

    it('passes closeOnClickOutside={false} to Popover', () => {
      renderWithContext(
        <FilterPopover closeOnClickOutside={false}>
          <div>Content</div>
        </FilterPopover>
      );
      const trigger = screen.getByTestId('popover-trigger');
      expect(trigger).toHaveAttribute('data-close-on-click-outside', 'false');
    });

    it('defaults closeOnClickOutside to true', () => {
      renderWithContext(
        <FilterPopover>
          <div>Content</div>
        </FilterPopover>
      );
      const trigger = screen.getByTestId('popover-trigger');
      expect(trigger).toHaveAttribute('data-close-on-click-outside', 'true');
    });
  });

  // 11. Context handling tests
  describe('context handling', () => {
    it('renders without context', () => {
      render(
        <FilterPopover>
          <div>Content</div>
        </FilterPopover>
      );
      expect(screen.getByTestId('mock-popover')).toBeInTheDocument();
    });

    it('shows activeCount of 0 when no context', () => {
      render(
        <FilterPopover>
          <div>Content</div>
        </FilterPopover>
      );
      expect(screen.queryByText(/\d+/)).not.toBeInTheDocument();
    });

    it('does not call context methods when no context', () => {
      render(
        <FilterPopover isOpen showResetButton>
          <div>Content</div>
        </FilterPopover>
      );

      // Should not throw errors
      fireEvent.click(screen.getByText('Apply'));
      fireEvent.click(screen.getByText('Reset'));
    });
  });

  // 12. Footer layout tests
  describe('footer layout', () => {
    it('renders footer with correct structure', () => {
      renderWithContext(
        <FilterPopover isOpen>
          <div>Content</div>
        </FilterPopover>
      );
      const content = screen.getByTestId('popover-content');
      const footer = content.querySelector('[class*="footer"]');
      expect(footer).toBeInTheDocument();
    });

    it('renders footer left section with reset button', () => {
      renderWithContext(
        <FilterPopover isOpen showResetButton>
          <div>Content</div>
        </FilterPopover>
      );
      const content = screen.getByTestId('popover-content');
      const footerLeft = content.querySelector('[class*="footerLeft"]');
      expect(footerLeft).toBeInTheDocument();
      expect(footerLeft).toContainElement(screen.getByText('Reset'));
    });

    it('renders footer right section with action buttons', () => {
      renderWithContext(
        <FilterPopover isOpen>
          <div>Content</div>
        </FilterPopover>,
        { activeCount: 2 }
      );
      const content = screen.getByTestId('popover-content');
      const footerRight = content.querySelector('[class*="footerRight"]');
      expect(footerRight).toBeInTheDocument();
      expect(footerRight).toContainElement(screen.getByText('Clear'));
      expect(footerRight).toContainElement(screen.getByText('Apply'));
    });
  });

  // 13. Ref forwarding tests
  describe('ref forwarding', () => {
    it('forwards ref to wrapper element', () => {
      const ref = React.createRef<HTMLDivElement>();
      renderWithContext(
        <FilterPopover ref={ref}>
          <div>Content</div>
        </FilterPopover>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('handles callback ref', () => {
      const refCallback = jest.fn();
      renderWithContext(
        <FilterPopover ref={refCallback}>
          <div>Content</div>
        </FilterPopover>
      );
      expect(refCallback).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });
  });

  // 14. Props spreading tests
  describe('props spreading', () => {
    it('accepts and applies additional HTML attributes', () => {
      renderWithContext(
        <FilterPopover data-custom="value" id="custom-id">
          <div>Content</div>
        </FilterPopover>
      );
      const element = document.getElementById('custom-id');
      expect(element).toBeInTheDocument();
      expect(element).toHaveAttribute('data-custom', 'value');
    });

    it('accepts style prop', () => {
      const { container } = renderWithContext(
        <FilterPopover style={{ backgroundColor: 'red' }}>
          <div>Content</div>
        </FilterPopover>
      );
      const element = container.querySelector('[class*="filterPopover"]');
      expect(element).toHaveStyle({ backgroundColor: 'red' });
    });

    it('accepts aria attributes', () => {
      renderWithContext(
        <FilterPopover aria-label="Filter controls">
          <div>Content</div>
        </FilterPopover>
      );
      const element = screen.getByLabelText('Filter controls');
      expect(element).toBeInTheDocument();
    });
  });

  // 15. Edge cases tests
  describe('edge cases', () => {
    it('renders with null children', () => {
      renderWithContext(<FilterPopover isOpen>{null}</FilterPopover>);
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    });

    it('renders with undefined children', () => {
      renderWithContext(<FilterPopover isOpen>{undefined}</FilterPopover>);
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    });

    it('renders with multiple children', () => {
      renderWithContext(
        <FilterPopover isOpen>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </FilterPopover>
      );
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
      expect(screen.getByText('Child 3')).toBeInTheDocument();
    });

    it('handles very large activeCount', () => {
      renderWithContext(
        <FilterPopover>
          <div>Content</div>
        </FilterPopover>,
        { activeCount: 999 }
      );
      expect(screen.getByText('999')).toBeInTheDocument();
    });

    it('handles empty string triggerLabel', () => {
      renderWithContext(
        <FilterPopover triggerLabel="">
          <div>Content</div>
        </FilterPopover>
      );
      // Should still render trigger with icons
      expect(screen.getByTestId('icon-filter')).toBeInTheDocument();
    });

    it('handles undefined className gracefully', () => {
      const { container } = renderWithContext(
        <FilterPopover className={undefined}>
          <div>Content</div>
        </FilterPopover>
      );
      expect(container.querySelector('[class*="filterPopover"]')).toBeInTheDocument();
    });

    it('handles both controlled and uncontrolled state transitions', () => {
      const { rerender } = render(
        <FilterPopover defaultOpen>
          <div>Content</div>
        </FilterPopover>
      );
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();

      // Switch to controlled
      rerender(
        <FilterPopover isOpen={false}>
          <div>Content</div>
        </FilterPopover>
      );
      expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
    });
  });

  // 16. Display name test
  describe('display name', () => {
    it('has correct display name', () => {
      expect(FilterPopover.displayName).toBe('FilterPopover');
    });
  });

  // 17. Combined props tests
  describe('combined props', () => {
    it('renders with all props combined', () => {
      const onOpenChange = jest.fn();
      const applyFilters = jest.fn();
      const clearAllFilters = jest.fn();
      const resetFilters = jest.fn();

      renderWithContext(
        <FilterPopover
          trigger={<button>Custom Trigger</button>}
          triggerLabel="Should not show"
          showTriggerBadge={false}
          position="top-start"
          width={500}
          maxHeight={400}
          isOpen
          onOpenChange={onOpenChange}
          closeOnApply
          closeOnClickOutside={false}
          showActiveFilters
          activeFiltersPosition="bottom"
          showApplyButton
          applyButtonLabel="Submit"
          showClearButton
          clearButtonLabel="Clear All"
          showResetButton
          resetButtonLabel="Reset All"
          className="custom-class"
          data-testid="full-featured-popover"
        >
          <div>Complex Content</div>
        </FilterPopover>,
        { activeCount: 5, applyFilters, clearAllFilters, resetFilters }
      );

      expect(screen.getByTestId('full-featured-popover')).toBeInTheDocument();
      expect(screen.getByText('Custom Trigger')).toBeInTheDocument();
      expect(screen.getByText('Complex Content')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();
      expect(screen.getByText('Clear All')).toBeInTheDocument();
      expect(screen.getByText('Reset All')).toBeInTheDocument();
      expect(screen.getByTestId('active-filters')).toBeInTheDocument();
    });

    it('handles all button clicks in complex scenario', () => {
      const applyFilters = jest.fn();
      const clearAllFilters = jest.fn();
      const resetFilters = jest.fn();
      const onOpenChange = jest.fn();

      renderWithContext(
        <FilterPopover isOpen onOpenChange={onOpenChange} showResetButton closeOnApply>
          <div>Content</div>
        </FilterPopover>,
        { activeCount: 3, applyFilters, clearAllFilters, resetFilters }
      );

      fireEvent.click(screen.getByText('Clear'));
      expect(clearAllFilters).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByText('Reset'));
      expect(resetFilters).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByText('Apply'));
      expect(applyFilters).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
