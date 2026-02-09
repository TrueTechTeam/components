import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FilterModal } from './FilterModal';
import { FilterContext } from '../../FilterContext';
import type { FilterContextValue } from '../../types';

// Mock filter context value
const createMockFilterContext = (overrides?: Partial<FilterContextValue>): FilterContextValue => ({
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
  hasPendingChanges: false,
  ...overrides,
});

// Wrapper component with context
const FilterModalWithContext: React.FC<{
  children: React.ReactNode;
  contextValue?: Partial<FilterContextValue>;
}> = ({ children, contextValue }) => {
  const mockContext = createMockFilterContext(contextValue);
  return <FilterContext.Provider value={mockContext}>{children}</FilterContext.Provider>;
};

describe('FilterModal', () => {
  // 1. Rendering tests
  describe('rendering', () => {
    it('renders with default props', () => {
      render(
        <FilterModalWithContext>
          <FilterModal>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.getByText('Filters')).toBeInTheDocument();
    });

    it('renders with custom title', () => {
      render(
        <FilterModalWithContext>
          <FilterModal defaultOpen title="Advanced Filters">
            Filter Content
          </FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.getByText('Advanced Filters')).toBeInTheDocument();
    });

    it('renders children correctly', () => {
      render(
        <FilterModalWithContext>
          <FilterModal>
            <div>Custom Filter Content</div>
          </FilterModal>
        </FilterModalWithContext>
      );
      const trigger = screen.getByText('Filters');
      fireEvent.click(trigger);
      expect(screen.getByText('Custom Filter Content')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = render(
        <FilterModalWithContext>
          <FilterModal className="custom-class">Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      const element = container.querySelector('.custom-class');
      expect(element).toBeInTheDocument();
    });

    it('renders with data-testid', () => {
      render(
        <FilterModalWithContext>
          <FilterModal data-testid="custom-filter-modal">Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.getByTestId('custom-filter-modal')).toBeInTheDocument();
    });

    it('renders default trigger button', () => {
      render(
        <FilterModalWithContext>
          <FilterModal>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.getByText('Filters')).toBeInTheDocument();
    });

    it('renders custom trigger via renderTrigger', () => {
      render(
        <FilterModalWithContext>
          <FilterModal
            renderTrigger={({ onClick }) => <button onClick={onClick}>Custom Trigger</button>}
          >
            Filter Content
          </FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.getByText('Custom Trigger')).toBeInTheDocument();
      expect(screen.queryByText('Filters')).not.toBeInTheDocument();
    });

    it('passes activeCount to renderTrigger', () => {
      const renderTrigger = jest.fn(({ onClick }) => <button onClick={onClick}>Trigger</button>);
      render(
        <FilterModalWithContext contextValue={{ activeCount: 3 }}>
          <FilterModal renderTrigger={renderTrigger}>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      expect(renderTrigger).toHaveBeenCalledWith(
        expect.objectContaining({
          activeCount: 3,
          onClick: expect.any(Function),
        })
      );
    });
  });

  // 2. Dialog open/close state tests
  describe('dialog open/close state', () => {
    it('dialog is closed by default', () => {
      render(
        <FilterModalWithContext>
          <FilterModal>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
    });

    it('opens dialog when trigger is clicked', () => {
      render(
        <FilterModalWithContext>
          <FilterModal>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      const trigger = screen.getByText('Filters');
      fireEvent.click(trigger);
      expect(screen.getByTestId('dialog')).toBeInTheDocument();
    });

    it('opens dialog with defaultOpen prop', () => {
      render(
        <FilterModalWithContext>
          <FilterModal defaultOpen>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.getByTestId('dialog')).toBeInTheDocument();
    });

    it('respects controlled isOpen prop', () => {
      const { rerender } = render(
        <FilterModalWithContext>
          <FilterModal isOpen={false}>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();

      rerender(
        <FilterModalWithContext>
          <FilterModal isOpen>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.getByTestId('dialog')).toBeInTheDocument();
    });

    it('calls onOpenChange when dialog opens', () => {
      const handleOpenChange = jest.fn();
      render(
        <FilterModalWithContext>
          <FilterModal onOpenChange={handleOpenChange}>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      const trigger = screen.getByText('Filters');
      fireEvent.click(trigger);
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });

    it('calls onOpenChange when dialog closes', () => {
      const handleOpenChange = jest.fn();
      render(
        <FilterModalWithContext>
          <FilterModal defaultOpen onOpenChange={handleOpenChange}>
            Filter Content
          </FilterModal>
        </FilterModalWithContext>
      );
      const closeButton = screen.getByTestId('dialog-close-button');
      fireEvent.click(closeButton);
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });

    it('closes dialog when close button is clicked', async () => {
      render(
        <FilterModalWithContext>
          <FilterModal defaultOpen>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.getByTestId('dialog')).toBeInTheDocument();
      const closeButton = screen.getByTestId('dialog-close-button');
      fireEvent.click(closeButton);
      await waitFor(() => {
        expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
      });
    });

    it('closes dialog when Cancel button is clicked', async () => {
      render(
        <FilterModalWithContext>
          <FilterModal defaultOpen>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.getByTestId('dialog')).toBeInTheDocument();
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
      await waitFor(() => {
        expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
      });
    });
  });

  // 3. Size tests
  describe('size', () => {
    it('renders with md size by default', () => {
      render(
        <FilterModalWithContext>
          <FilterModal defaultOpen>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      const dialog = screen.getByTestId('dialog');
      expect(dialog).toHaveAttribute('data-size', 'md');
    });

    it.each(['sm', 'md', 'lg', 'xl', 'full'] as const)('renders with %s size', (size) => {
      render(
        <FilterModalWithContext>
          <FilterModal defaultOpen size={size}>
            Filter Content
          </FilterModal>
        </FilterModalWithContext>
      );
      const dialog = screen.getByTestId('dialog');
      expect(dialog).toHaveAttribute('data-size', size);
    });
  });

  // 4. Active count badge tests
  describe('active count badge', () => {
    it('does not show badge on trigger when activeCount is 0', () => {
      render(
        <FilterModalWithContext contextValue={{ activeCount: 0 }}>
          <FilterModal>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      const trigger = screen.getByText('Filters').closest('button');
      const badge = trigger?.querySelector('[class*="triggerBadge"]');
      expect(badge).not.toBeInTheDocument();
    });

    it('shows badge on trigger when activeCount > 0', () => {
      render(
        <FilterModalWithContext contextValue={{ activeCount: 3 }}>
          <FilterModal>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('shows active count in dialog header when activeCount > 0', () => {
      render(
        <FilterModalWithContext contextValue={{ activeCount: 5 }}>
          <FilterModal defaultOpen>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.getByText('5 active')).toBeInTheDocument();
    });

    it('does not show active count badge in dialog header when activeCount is 0', () => {
      render(
        <FilterModalWithContext contextValue={{ activeCount: 0 }}>
          <FilterModal defaultOpen>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.queryByText('0 active')).not.toBeInTheDocument();
    });
  });

  // 5. Apply button tests
  describe('apply button', () => {
    it('shows Apply Filters button by default', () => {
      render(
        <FilterModalWithContext>
          <FilterModal defaultOpen>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.getByText('Apply Filters')).toBeInTheDocument();
    });

    it('hides Apply button when showApplyButton is false', () => {
      render(
        <FilterModalWithContext>
          <FilterModal defaultOpen showApplyButton={false}>
            Filter Content
          </FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.queryByText('Apply Filters')).not.toBeInTheDocument();
    });

    it('renders custom apply button label', () => {
      render(
        <FilterModalWithContext>
          <FilterModal defaultOpen applyButtonLabel="Apply All">
            Filter Content
          </FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.getByText('Apply All')).toBeInTheDocument();
    });

    it('calls applyFilters when Apply button is clicked', () => {
      const applyFilters = jest.fn();
      render(
        <FilterModalWithContext contextValue={{ applyFilters }}>
          <FilterModal defaultOpen>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      const applyButton = screen.getByText('Apply Filters');
      fireEvent.click(applyButton);
      expect(applyFilters).toHaveBeenCalledTimes(1);
    });

    it('closes dialog after apply when closeOnApply is true', async () => {
      const applyFilters = jest.fn();
      render(
        <FilterModalWithContext contextValue={{ applyFilters }}>
          <FilterModal defaultOpen closeOnApply>
            Filter Content
          </FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.getByTestId('dialog')).toBeInTheDocument();
      const applyButton = screen.getByText('Apply Filters');
      fireEvent.click(applyButton);
      await waitFor(() => {
        expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
      });
    });

    it('keeps dialog open after apply when closeOnApply is false', () => {
      const applyFilters = jest.fn();
      render(
        <FilterModalWithContext contextValue={{ applyFilters }}>
          <FilterModal defaultOpen closeOnApply={false}>
            Filter Content
          </FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.getByTestId('dialog')).toBeInTheDocument();
      const applyButton = screen.getByText('Apply Filters');
      fireEvent.click(applyButton);
      expect(screen.getByTestId('dialog')).toBeInTheDocument();
    });
  });

  // 6. Clear button tests
  describe('clear button', () => {
    it('shows Clear All button by default when activeCount > 0', () => {
      render(
        <FilterModalWithContext contextValue={{ activeCount: 2 }}>
          <FilterModal defaultOpen>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.getByText('Clear All')).toBeInTheDocument();
    });

    it('hides Clear All button when activeCount is 0', () => {
      render(
        <FilterModalWithContext contextValue={{ activeCount: 0 }}>
          <FilterModal defaultOpen>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
    });

    it('hides Clear All button when showClearButton is false', () => {
      render(
        <FilterModalWithContext contextValue={{ activeCount: 2 }}>
          <FilterModal defaultOpen showClearButton={false}>
            Filter Content
          </FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
    });

    it('renders custom clear button label', () => {
      render(
        <FilterModalWithContext contextValue={{ activeCount: 2 }}>
          <FilterModal defaultOpen clearButtonLabel="Reset All">
            Filter Content
          </FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.getByText('Reset All')).toBeInTheDocument();
    });

    it('calls clearAllFilters when Clear button is clicked', () => {
      const clearAllFilters = jest.fn();
      render(
        <FilterModalWithContext contextValue={{ activeCount: 2, clearAllFilters }}>
          <FilterModal defaultOpen>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      const clearButton = screen.getByText('Clear All');
      fireEvent.click(clearButton);
      expect(clearAllFilters).toHaveBeenCalledTimes(1);
    });
  });

  // 7. Reset button tests
  describe('reset button', () => {
    it('does not show Reset button by default', () => {
      render(
        <FilterModalWithContext>
          <FilterModal defaultOpen>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.queryByText('Reset')).not.toBeInTheDocument();
    });

    it('shows Reset button when showResetButton is true', () => {
      render(
        <FilterModalWithContext>
          <FilterModal defaultOpen showResetButton>
            Filter Content
          </FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.getByText('Reset')).toBeInTheDocument();
    });

    it('renders custom reset button label', () => {
      render(
        <FilterModalWithContext>
          <FilterModal defaultOpen showResetButton resetButtonLabel="Restore Defaults">
            Filter Content
          </FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.getByText('Restore Defaults')).toBeInTheDocument();
    });

    it('calls resetFilters when Reset button is clicked', () => {
      const resetFilters = jest.fn();
      render(
        <FilterModalWithContext contextValue={{ resetFilters }}>
          <FilterModal defaultOpen showResetButton>
            Filter Content
          </FilterModal>
        </FilterModalWithContext>
      );
      const resetButton = screen.getByText('Reset');
      fireEvent.click(resetButton);
      expect(resetFilters).toHaveBeenCalledTimes(1);
    });
  });

  // 8. Footer tests
  describe('footer', () => {
    it('shows footer by default', () => {
      render(
        <FilterModalWithContext>
          <FilterModal defaultOpen>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Apply Filters')).toBeInTheDocument();
    });

    it('hides footer when showFooter is false', () => {
      render(
        <FilterModalWithContext>
          <FilterModal defaultOpen showFooter={false}>
            Filter Content
          </FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
      expect(screen.queryByText('Apply Filters')).not.toBeInTheDocument();
    });

    it('renders all footer buttons correctly', () => {
      render(
        <FilterModalWithContext contextValue={{ activeCount: 3 }}>
          <FilterModal defaultOpen showResetButton>
            Filter Content
          </FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.getByText('Reset')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Clear All')).toBeInTheDocument();
      expect(screen.getByText('Apply Filters')).toBeInTheDocument();
    });
  });

  // 9. Active filters display tests
  describe('active filters display', () => {
    it('shows active filters at top by default when activeCount > 0', () => {
      render(
        <FilterModalWithContext contextValue={{ activeCount: 2 }}>
          <FilterModal defaultOpen>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      const dialog = screen.getByTestId('dialog');
      expect(dialog.textContent).toContain('Filter Content');
    });

    it('does not show active filters when showActiveFilters is false', () => {
      render(
        <FilterModalWithContext contextValue={{ activeCount: 2 }}>
          <FilterModal defaultOpen showActiveFilters={false}>
            Filter Content
          </FilterModal>
        </FilterModalWithContext>
      );
      const dialog = screen.getByTestId('dialog');
      expect(dialog).toBeInTheDocument();
    });

    it('shows active filters at bottom when activeFiltersPosition is bottom', () => {
      render(
        <FilterModalWithContext contextValue={{ activeCount: 2 }}>
          <FilterModal defaultOpen activeFiltersPosition="bottom">
            Filter Content
          </FilterModal>
        </FilterModalWithContext>
      );
      const dialog = screen.getByTestId('dialog');
      expect(dialog).toBeInTheDocument();
    });

    it('does not show active filters when activeCount is 0', () => {
      render(
        <FilterModalWithContext contextValue={{ activeCount: 0 }}>
          <FilterModal defaultOpen>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      const dialog = screen.getByTestId('dialog');
      expect(dialog).toBeInTheDocument();
    });
  });

  // 10. Context integration tests
  describe('context integration', () => {
    it('works without FilterContext', () => {
      render(<FilterModal>Filter Content</FilterModal>);
      expect(screen.getByText('Filters')).toBeInTheDocument();
    });

    it('shows 0 activeCount when no context is provided', () => {
      render(<FilterModal>Filter Content</FilterModal>);
      const trigger = screen.getByText('Filters').closest('button');
      const badge = trigger?.querySelector('[class*="triggerBadge"]');
      expect(badge).not.toBeInTheDocument();
    });

    it('does not call context methods when context is null', async () => {
      render(
        <FilterModal defaultOpen>
          <div>Filter Content</div>
        </FilterModal>
      );
      const applyButton = screen.getByText('Apply Filters');
      fireEvent.click(applyButton);
      // Should not throw error
      await waitFor(() => {
        expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
      });
    });
  });

  // 11. Accessibility tests
  describe('accessibility', () => {
    it('trigger button has correct aria attributes', () => {
      render(
        <FilterModalWithContext>
          <FilterModal>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      const trigger = screen.getByText('Filters').closest('button');
      expect(trigger).toBeInTheDocument();
    });

    it('accepts custom aria-label', () => {
      render(
        <FilterModalWithContext>
          <FilterModal aria-label="Filter options">Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.getByLabelText('Filter options')).toBeInTheDocument();
    });

    it('dialog has proper accessibility structure', () => {
      render(
        <FilterModalWithContext>
          <FilterModal defaultOpen title="Advanced Filters">
            Filter Content
          </FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.getByText('Advanced Filters')).toBeInTheDocument();
      expect(screen.getByTestId('dialog')).toBeInTheDocument();
    });
  });

  // 12. Ref forwarding tests
  describe('ref forwarding', () => {
    it('forwards ref to wrapper element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <FilterModalWithContext>
          <FilterModal ref={ref}>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('handles callback ref', () => {
      const refCallback = jest.fn();
      render(
        <FilterModalWithContext>
          <FilterModal ref={refCallback}>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      expect(refCallback).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });
  });

  // 13. Edge cases tests
  describe('edge cases', () => {
    it('renders with null children', () => {
      render(
        <FilterModalWithContext>
          <FilterModal>{null}</FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.getByText('Filters')).toBeInTheDocument();
    });

    it('renders with undefined children', () => {
      render(
        <FilterModalWithContext>
          <FilterModal>{undefined}</FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.getByText('Filters')).toBeInTheDocument();
    });

    it('handles multiple rapid open/close actions', async () => {
      render(
        <FilterModalWithContext>
          <FilterModal>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      const trigger = screen.getByText('Filters');

      fireEvent.click(trigger);
      expect(screen.getByTestId('dialog')).toBeInTheDocument();

      const closeButton = screen.getByTestId('dialog-close-button');
      fireEvent.click(closeButton);
      await waitFor(() => {
        expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
      });

      fireEvent.click(trigger);
      expect(screen.getByTestId('dialog')).toBeInTheDocument();
    });

    it('handles controlled state changes', async () => {
      const { rerender } = render(
        <FilterModalWithContext>
          <FilterModal isOpen={false}>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();

      rerender(
        <FilterModalWithContext>
          <FilterModal isOpen>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.getByTestId('dialog')).toBeInTheDocument();

      rerender(
        <FilterModalWithContext>
          <FilterModal isOpen={false}>Filter Content</FilterModal>
        </FilterModalWithContext>
      );
      await waitFor(() => {
        expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
      });
    });

    it('handles empty title string', () => {
      render(
        <FilterModalWithContext>
          <FilterModal defaultOpen title="">
            Filter Content
          </FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.getByTestId('dialog')).toBeInTheDocument();
    });

    it('handles complex children structure', () => {
      render(
        <FilterModalWithContext>
          <FilterModal defaultOpen>
            <div>
              <h3>Section 1</h3>
              <div>Content 1</div>
              <h3>Section 2</h3>
              <div>Content 2</div>
            </div>
          </FilterModal>
        </FilterModalWithContext>
      );
      expect(screen.getByText('Section 1')).toBeInTheDocument();
      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.getByText('Section 2')).toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });
  });

  // 14. Combined props tests
  describe('combined props', () => {
    it('renders with all custom props', () => {
      const handleOpenChange = jest.fn();
      const applyFilters = jest.fn();
      const clearAllFilters = jest.fn();
      const resetFilters = jest.fn();

      render(
        <FilterModalWithContext
          contextValue={{ activeCount: 5, applyFilters, clearAllFilters, resetFilters }}
        >
          <FilterModal
            title="Custom Filters"
            size="lg"
            defaultOpen
            onOpenChange={handleOpenChange}
            closeOnApply={false}
            showFooter
            showApplyButton
            applyButtonLabel="Apply Now"
            showClearButton
            clearButtonLabel="Clear Filters"
            showResetButton
            resetButtonLabel="Reset to Default"
            showActiveFilters
            activeFiltersPosition="top"
            className="custom-modal"
            data-testid="filter-modal"
          >
            <div>Filter Controls</div>
          </FilterModal>
        </FilterModalWithContext>
      );

      expect(screen.getByTestId('filter-modal')).toBeInTheDocument();
      expect(screen.getByText('Custom Filters')).toBeInTheDocument();
      expect(screen.getByText('5 active')).toBeInTheDocument();
      expect(screen.getByText('Filter Controls')).toBeInTheDocument();
      expect(screen.getByText('Apply Now')).toBeInTheDocument();
      expect(screen.getByText('Clear Filters')).toBeInTheDocument();
      expect(screen.getByText('Reset to Default')).toBeInTheDocument();
    });

    it('works correctly with controlled state and callbacks', () => {
      const handleOpenChange = jest.fn();
      const applyFilters = jest.fn();

      const { rerender } = render(
        <FilterModalWithContext contextValue={{ applyFilters }}>
          <FilterModal isOpen={false} onOpenChange={handleOpenChange} closeOnApply>
            Filter Content
          </FilterModal>
        </FilterModalWithContext>
      );

      expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();

      rerender(
        <FilterModalWithContext contextValue={{ applyFilters }}>
          <FilterModal isOpen onOpenChange={handleOpenChange} closeOnApply>
            Filter Content
          </FilterModal>
        </FilterModalWithContext>
      );

      expect(screen.getByTestId('dialog')).toBeInTheDocument();
      expect(handleOpenChange).not.toHaveBeenCalled();

      const applyButton = screen.getByText('Apply Filters');
      fireEvent.click(applyButton);

      expect(applyFilters).toHaveBeenCalledTimes(1);
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
