import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToggleFilter } from './ToggleFilter';
import { FilterContext } from '../FilterContext';
import type { FilterContextValue, FilterDefinition } from '../types';

// Mock the Toggle component
jest.mock('../../inputs/Toggle', () => ({
  Toggle: ({
    checked,
    onChange,
    label,
    disabled,
    error,
    errorMessage,
    helperText,
    size,
    ...props
  }: any) => (
    <div data-testid={`toggle-${label}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          // Only call onChange if not disabled
          if (!disabled) {
            onChange?.(e.target.checked);
          }
        }}
        disabled={disabled}
        aria-label={label}
        data-size={size}
        data-error={error}
        data-error-message={errorMessage}
        data-helper-text={helperText}
        {...props}
      />
      {label && <label>{label}</label>}
      {error && errorMessage && <span role="alert">{errorMessage}</span>}
      {!error && helperText && <span>{helperText}</span>}
    </div>
  ),
}));

// Helper function to create mock filter context
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

// Helper function to create a boolean filter definition
const createBooleanFilter = (
  id: string,
  label: string,
  helperText?: string
): FilterDefinition<boolean> => ({
  id,
  type: 'toggle',
  label,
  helperText,
});

// Helper to render with context
const renderWithContext = (ui: React.ReactElement, context: FilterContextValue) => {
  return render(<FilterContext.Provider value={context}>{ui}</FilterContext.Provider>);
};

describe('ToggleFilter', () => {
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
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext([filter]);

      renderWithContext(<ToggleFilter filterId="active" />, context);

      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders with all props', () => {
      const filter = createBooleanFilter('enabled', 'Enabled', 'Toggle this option');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(
        <ToggleFilter
          filterId="enabled"
          label="Custom Enabled"
          size="lg"
          className="custom-class"
          data-testid="test-filter"
          toggleProps={{ 'data-custom': 'value' }}
        />,
        context
      );

      expect(screen.getByText('Custom Enabled')).toBeInTheDocument();
      const wrapper = container.querySelector('.custom-class');
      expect(wrapper).toBeInTheDocument();
    });

    it('renders as div element', () => {
      const filter = createBooleanFilter('test', 'Test');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(<ToggleFilter filterId="test" />, context);

      const wrapper = container.firstChild;
      expect(wrapper?.nodeName).toBe('DIV');
    });

    it('applies custom className', () => {
      const filter = createBooleanFilter('test', 'Test');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(
        <ToggleFilter filterId="test" className="custom-filter" />,
        context
      );

      const wrapper = container.querySelector('.custom-filter');
      expect(wrapper).toBeInTheDocument();
    });

    it('forwards additional props to wrapper div', () => {
      const filter = createBooleanFilter('test', 'Test');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(
        <ToggleFilter filterId="test" data-custom="value" id="custom-id" />,
        context
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveAttribute('data-custom', 'value');
      expect(wrapper).toHaveAttribute('id', 'custom-id');
    });
  });

  // 2. Filter not found tests
  describe('filter not found', () => {
    it('returns null when filter is not found', () => {
      const context = createMockContext([]);

      const { container } = renderWithContext(<ToggleFilter filterId="nonexistent" />, context);

      expect(container.firstChild).toBeNull();
    });

    it('logs warning when filter is not found', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const context = createMockContext([]);

      renderWithContext(<ToggleFilter filterId="missing" />, context);

      expect(warnSpy).toHaveBeenCalledWith('ToggleFilter: Filter "missing" not found');
    });

    it('does not render Toggle when filter not found', () => {
      const context = createMockContext([]);

      renderWithContext(<ToggleFilter filterId="missing" />, context);

      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });
  });

  // 3. Label tests
  describe('label', () => {
    it('uses filter definition label by default', () => {
      const filter = createBooleanFilter('active', 'Active Status');
      const context = createMockContext([filter]);

      renderWithContext(<ToggleFilter filterId="active" />, context);

      expect(screen.getByText('Active Status')).toBeInTheDocument();
    });

    it('uses override label when provided', () => {
      const filter = createBooleanFilter('active', 'Active Status');
      const context = createMockContext([filter]);

      renderWithContext(<ToggleFilter filterId="active" label="Custom Label" />, context);

      expect(screen.getByText('Custom Label')).toBeInTheDocument();
      expect(screen.queryByText('Active Status')).not.toBeInTheDocument();
    });

    it('passes label to Toggle component', () => {
      const filter = createBooleanFilter('enabled', 'Enabled');
      const context = createMockContext([filter]);

      renderWithContext(<ToggleFilter filterId="enabled" label="Is Enabled" />, context);

      const toggle = screen.getByRole('checkbox');
      expect(toggle).toHaveAttribute('aria-label', 'Is Enabled');
    });

    it('handles empty label override', () => {
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext([filter]);

      renderWithContext(<ToggleFilter filterId="active" label="" />, context);

      expect(screen.queryByText('Active')).not.toBeInTheDocument();
    });
  });

  // 4. Value tests
  describe('value', () => {
    it('renders with false value by default', () => {
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext([filter], {});

      renderWithContext(<ToggleFilter filterId="active" />, context);

      const toggle = screen.getByRole('checkbox') as HTMLInputElement;
      expect(toggle.checked).toBe(false);
    });

    it('renders with true value from context', () => {
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext([filter], { active: true });

      renderWithContext(<ToggleFilter filterId="active" />, context);

      const toggle = screen.getByRole('checkbox') as HTMLInputElement;
      expect(toggle.checked).toBe(true);
    });

    it('renders with false value from context', () => {
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext([filter], { active: false });

      renderWithContext(<ToggleFilter filterId="active" />, context);

      const toggle = screen.getByRole('checkbox') as HTMLInputElement;
      expect(toggle.checked).toBe(false);
    });

    it('treats undefined value as false', () => {
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext([filter], { active: undefined });

      renderWithContext(<ToggleFilter filterId="active" />, context);

      const toggle = screen.getByRole('checkbox') as HTMLInputElement;
      expect(toggle.checked).toBe(false);
    });

    it('treats null value as false', () => {
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext([filter], { active: null });

      renderWithContext(<ToggleFilter filterId="active" />, context);

      const toggle = screen.getByRole('checkbox') as HTMLInputElement;
      expect(toggle.checked).toBe(false);
    });
  });

  // 5. onChange tests
  describe('onChange', () => {
    it('calls setFilterValue when toggled on', () => {
      const filter = createBooleanFilter('active', 'Active');
      const setFilterValue = jest.fn();
      const context = createMockContext([filter], { active: false }, { setFilterValue });

      renderWithContext(<ToggleFilter filterId="active" />, context);

      const toggle = screen.getByRole('checkbox');
      fireEvent.click(toggle);

      expect(setFilterValue).toHaveBeenCalledWith('active', true);
    });

    it('calls setFilterValue when toggled off', () => {
      const filter = createBooleanFilter('active', 'Active');
      const setFilterValue = jest.fn();
      const context = createMockContext([filter], { active: true }, { setFilterValue });

      renderWithContext(<ToggleFilter filterId="active" />, context);

      const toggle = screen.getByRole('checkbox');
      fireEvent.click(toggle);

      expect(setFilterValue).toHaveBeenCalledWith('active', false);
    });

    it('calls setFilterValue exactly once per click', () => {
      const filter = createBooleanFilter('active', 'Active');
      const setFilterValue = jest.fn();
      const context = createMockContext([filter], {}, { setFilterValue });

      renderWithContext(<ToggleFilter filterId="active" />, context);

      const toggle = screen.getByRole('checkbox');
      fireEvent.click(toggle);

      expect(setFilterValue).toHaveBeenCalledTimes(1);
    });

    it('handles multiple toggles', () => {
      const filter = createBooleanFilter('active', 'Active');
      const setFilterValue = jest.fn();
      const context = createMockContext([filter], {}, { setFilterValue });

      renderWithContext(<ToggleFilter filterId="active" />, context);

      const toggle = screen.getByRole('checkbox');
      fireEvent.click(toggle);
      fireEvent.click(toggle);
      fireEvent.click(toggle);

      expect(setFilterValue).toHaveBeenCalledTimes(3);
      // Since the component is controlled and we're not updating the context value,
      // each click will call setValue with the same value based on the current checked state
      expect(setFilterValue).toHaveBeenNthCalledWith(1, 'active', true);
      expect(setFilterValue).toHaveBeenNthCalledWith(2, 'active', true);
      expect(setFilterValue).toHaveBeenNthCalledWith(3, 'active', true);
    });
  });

  // 6. Size tests
  describe('size', () => {
    it('uses md size by default', () => {
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(<ToggleFilter filterId="active" />, context);

      const toggle = container.querySelector('[data-size="md"]');
      expect(toggle).toBeInTheDocument();
    });

    it('applies sm size', () => {
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(
        <ToggleFilter filterId="active" size="sm" />,
        context
      );

      const toggle = container.querySelector('[data-size="sm"]');
      expect(toggle).toBeInTheDocument();
    });

    it('applies lg size', () => {
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(
        <ToggleFilter filterId="active" size="lg" />,
        context
      );

      const toggle = container.querySelector('[data-size="lg"]');
      expect(toggle).toBeInTheDocument();
    });

    it('passes size to Toggle component', () => {
      const filter = createBooleanFilter('enabled', 'Enabled');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(
        <ToggleFilter filterId="enabled" size="sm" />,
        context
      );

      const toggle = container.querySelector('[data-size="sm"]');
      expect(toggle).toBeInTheDocument();
    });
  });

  // 7. Disabled state tests
  describe('disabled state', () => {
    it('is enabled when isEnabled returns true', () => {
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext(
        [filter],
        {},
        {
          isFilterEnabled: jest.fn(() => true),
        }
      );

      renderWithContext(<ToggleFilter filterId="active" />, context);

      const toggle = screen.getByRole('checkbox');
      expect(toggle).not.toBeDisabled();
    });

    it('is disabled when isEnabled returns false', () => {
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext(
        [filter],
        {},
        {
          isFilterEnabled: jest.fn(() => false),
        }
      );

      renderWithContext(<ToggleFilter filterId="active" />, context);

      const toggle = screen.getByRole('checkbox');
      expect(toggle).toBeDisabled();
    });

    it('does not call setFilterValue when disabled', () => {
      const filter = createBooleanFilter('active', 'Active');
      const setFilterValue = jest.fn();
      const context = createMockContext(
        [filter],
        {},
        {
          isFilterEnabled: jest.fn(() => false),
          setFilterValue,
        }
      );

      renderWithContext(<ToggleFilter filterId="active" />, context);

      const toggle = screen.getByRole('checkbox');
      fireEvent.click(toggle);

      expect(setFilterValue).not.toHaveBeenCalled();
    });

    it('calls isFilterEnabled with correct filterId', () => {
      const filter = createBooleanFilter('active', 'Active');
      const isFilterEnabled = jest.fn(() => true);
      const context = createMockContext([filter], {}, { isFilterEnabled });

      renderWithContext(<ToggleFilter filterId="active" />, context);

      expect(isFilterEnabled).toHaveBeenCalledWith('active');
    });
  });

  // 8. Error state tests
  describe('error state', () => {
    it('shows no error by default', () => {
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(<ToggleFilter filterId="active" />, context);

      const toggle = container.querySelector('[data-error="true"]');
      expect(toggle).not.toBeInTheDocument();
    });

    it('shows error when error exists in context', () => {
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext(
        [filter],
        {},
        {
          errors: { active: 'This field is required' },
        }
      );

      const { container } = renderWithContext(<ToggleFilter filterId="active" />, context);

      const toggle = container.querySelector('[data-error="true"]');
      expect(toggle).toBeInTheDocument();
    });

    it('passes error message to Toggle', () => {
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext(
        [filter],
        {},
        {
          errors: { active: 'This field is required' },
        }
      );

      renderWithContext(<ToggleFilter filterId="active" />, context);

      expect(screen.getByRole('alert')).toHaveTextContent('This field is required');
    });

    it('handles empty string error', () => {
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext(
        [filter],
        {},
        {
          errors: { active: '' },
        }
      );

      const { container } = renderWithContext(<ToggleFilter filterId="active" />, context);

      const toggle = container.querySelector('[data-error="true"]');
      expect(toggle).not.toBeInTheDocument();
    });

    it('handles null error', () => {
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext(
        [filter],
        {},
        {
          errors: { active: null },
        }
      );

      const { container } = renderWithContext(<ToggleFilter filterId="active" />, context);

      const toggle = container.querySelector('[data-error="true"]');
      expect(toggle).not.toBeInTheDocument();
    });
  });

  // 9. Helper text tests
  describe('helper text', () => {
    it('displays helper text from filter definition', () => {
      const filter = createBooleanFilter('active', 'Active', 'Toggle to enable or disable');
      const context = createMockContext([filter]);

      renderWithContext(<ToggleFilter filterId="active" />, context);

      expect(screen.getByText('Toggle to enable or disable')).toBeInTheDocument();
    });

    it('passes helper text to Toggle component', () => {
      const filter = createBooleanFilter('enabled', 'Enabled', 'Enable this feature');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(<ToggleFilter filterId="enabled" />, context);

      const helperText = container.querySelector('[data-helper-text="Enable this feature"]');
      expect(helperText).toBeInTheDocument();
    });

    it('does not show helper text when undefined', () => {
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext([filter]);

      renderWithContext(<ToggleFilter filterId="active" />, context);

      const helperText = screen.queryByText(/enable or disable/i);
      expect(helperText).not.toBeInTheDocument();
    });

    it('shows error message instead of helper text when error exists', () => {
      const filter = createBooleanFilter('active', 'Active', 'Helper text');
      const context = createMockContext(
        [filter],
        {},
        {
          errors: { active: 'Error message' },
        }
      );

      renderWithContext(<ToggleFilter filterId="active" />, context);

      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });
  });

  // 10. ToggleProps tests
  describe('toggleProps', () => {
    it('passes toggleProps to Toggle component', () => {
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(
        <ToggleFilter filterId="active" toggleProps={{ 'data-custom': 'value' }} />,
        context
      );

      const toggle = container.querySelector('[data-custom="value"]');
      expect(toggle).toBeInTheDocument();
    });

    it('merges toggleProps with component props', () => {
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(
        <ToggleFilter filterId="active" size="lg" toggleProps={{ 'data-extra': 'prop' }} />,
        context
      );

      const toggle = container.querySelector('[data-size="lg"][data-extra="prop"]');
      expect(toggle).toBeInTheDocument();
    });

    it('handles empty toggleProps', () => {
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext([filter]);

      renderWithContext(<ToggleFilter filterId="active" toggleProps={{}} />, context);

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('handles undefined toggleProps', () => {
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext([filter]);

      renderWithContext(<ToggleFilter filterId="active" toggleProps={undefined} />, context);

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });
  });

  // 11. Ref forwarding tests
  describe('ref forwarding', () => {
    it('forwards ref to wrapper div element', () => {
      const ref = React.createRef<HTMLDivElement>();
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext([filter]);

      renderWithContext(<ToggleFilter ref={ref} filterId="active" />, context);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards ref with className', () => {
      const ref = React.createRef<HTMLDivElement>();
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext([filter]);

      renderWithContext(<ToggleFilter ref={ref} filterId="active" className="custom" />, context);

      expect(ref.current).toHaveClass('custom');
    });

    it('handles callback ref', () => {
      const refCallback = jest.fn();
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext([filter]);

      renderWithContext(<ToggleFilter ref={refCallback} filterId="active" />, context);

      expect(refCallback).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });
  });

  // 12. Edge cases
  describe('edge cases', () => {
    it('handles filter with empty label', () => {
      const filter: FilterDefinition<boolean> = {
        id: 'empty',
        type: 'toggle',
        label: '',
      };
      const context = createMockContext([filter]);

      renderWithContext(<ToggleFilter filterId="empty" />, context);

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('handles multiple ToggleFilter instances', () => {
      const filters = [
        createBooleanFilter('filter1', 'Filter 1'),
        createBooleanFilter('filter2', 'Filter 2'),
        createBooleanFilter('filter3', 'Filter 3'),
      ];
      const context = createMockContext(filters);

      render(
        <FilterContext.Provider value={context}>
          <ToggleFilter filterId="filter1" />
          <ToggleFilter filterId="filter2" />
          <ToggleFilter filterId="filter3" />
        </FilterContext.Provider>
      );

      expect(screen.getByText('Filter 1')).toBeInTheDocument();
      expect(screen.getByText('Filter 2')).toBeInTheDocument();
      expect(screen.getByText('Filter 3')).toBeInTheDocument();
    });

    it('handles empty filterId gracefully', () => {
      const context = createMockContext([]);

      const { container } = renderWithContext(<ToggleFilter filterId="" />, context);

      expect(container.firstChild).toBeNull();
    });

    it('handles special characters in filterId', () => {
      const filter = createBooleanFilter('filter-with-dashes_and_underscores', 'Special');
      const context = createMockContext([filter]);

      renderWithContext(<ToggleFilter filterId="filter-with-dashes_and_underscores" />, context);

      expect(screen.getByText('Special')).toBeInTheDocument();
    });

    it('handles rapid toggle clicks', () => {
      const filter = createBooleanFilter('active', 'Active');
      const setFilterValue = jest.fn();
      const context = createMockContext([filter], {}, { setFilterValue });

      renderWithContext(<ToggleFilter filterId="active" />, context);

      const toggle = screen.getByRole('checkbox');
      fireEvent.click(toggle);
      fireEvent.click(toggle);
      fireEvent.click(toggle);
      fireEvent.click(toggle);

      expect(setFilterValue).toHaveBeenCalledTimes(4);
    });
  });

  // 13. Combined props tests
  describe('combined props', () => {
    it('renders with all props and custom values', () => {
      const filter = createBooleanFilter('advanced', 'Advanced Filter', 'Helper text');
      const context = createMockContext(
        [filter],
        { advanced: true },
        {
          errors: { advanced: 'Error message' },
          isFilterEnabled: jest.fn(() => false),
        }
      );

      const { container } = renderWithContext(
        <ToggleFilter
          filterId="advanced"
          label="Custom Advanced"
          size="lg"
          className="advanced-filter"
          data-testid="advanced-test"
          toggleProps={{ 'data-custom': 'value' }}
        />,
        context
      );

      expect(screen.getByText('Custom Advanced')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent('Error message');
      const wrapper = container.querySelector('.advanced-filter');
      expect(wrapper).toBeInTheDocument();
      const toggle = screen.getByRole('checkbox');
      expect(toggle).toBeDisabled();
    });

    it('renders with label override and size override', () => {
      const filter = createBooleanFilter('enabled', 'Enabled', 'Toggle me');
      const context = createMockContext([filter], { enabled: false });

      const { container } = renderWithContext(
        <ToggleFilter filterId="enabled" label="Is Enabled" size="sm" />,
        context
      );

      expect(screen.getByText('Is Enabled')).toBeInTheDocument();
      const toggle = container.querySelector('[data-size="sm"]');
      expect(toggle).toBeInTheDocument();
    });

    it('renders with error and disabled state', () => {
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext(
        [filter],
        {},
        {
          errors: { active: 'Required field' },
          isFilterEnabled: jest.fn(() => false),
        }
      );

      renderWithContext(<ToggleFilter filterId="active" />, context);

      const toggle = screen.getByRole('checkbox');
      expect(toggle).toBeDisabled();
      expect(screen.getByRole('alert')).toHaveTextContent('Required field');
    });
  });

  // 14. Display name
  describe('display name', () => {
    it('has correct display name', () => {
      expect(ToggleFilter.displayName).toBe('ToggleFilter');
    });
  });

  // 15. Context integration
  describe('context integration', () => {
    it('retrieves filter from context', () => {
      const filter = createBooleanFilter('active', 'Active');
      const getFilter = jest.fn(() => filter);
      const context = createMockContext([filter], {}, { getFilter });

      renderWithContext(<ToggleFilter filterId="active" />, context);

      expect(getFilter).toHaveBeenCalledWith('active');
    });

    it('checks filter enabled state from context', () => {
      const filter = createBooleanFilter('active', 'Active');
      const isFilterEnabled = jest.fn(() => true);
      const context = createMockContext([filter], {}, { isFilterEnabled });

      renderWithContext(<ToggleFilter filterId="active" />, context);

      expect(isFilterEnabled).toHaveBeenCalledWith('active');
    });

    it('retrieves value from context', () => {
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext([filter], { active: true });

      renderWithContext(<ToggleFilter filterId="active" />, context);

      const toggle = screen.getByRole('checkbox') as HTMLInputElement;
      expect(toggle.checked).toBe(true);
    });

    it('retrieves error from context', () => {
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext(
        [filter],
        {},
        {
          errors: { active: 'Error from context' },
        }
      );

      renderWithContext(<ToggleFilter filterId="active" />, context);

      expect(screen.getByRole('alert')).toHaveTextContent('Error from context');
    });

    it('calls setFilterValue from context on change', () => {
      const filter = createBooleanFilter('active', 'Active');
      const setFilterValue = jest.fn();
      const context = createMockContext([filter], {}, { setFilterValue });

      renderWithContext(<ToggleFilter filterId="active" />, context);

      const toggle = screen.getByRole('checkbox');
      fireEvent.click(toggle);

      expect(setFilterValue).toHaveBeenCalledWith('active', true);
    });
  });

  // 16. Data attributes
  describe('data attributes', () => {
    it('accepts and applies data attributes to wrapper', () => {
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext([filter]);

      renderWithContext(
        <ToggleFilter filterId="active" data-testid="test-filter" data-custom="value" />,
        context
      );

      const element = screen.getByTestId('test-filter');
      expect(element).toHaveAttribute('data-custom', 'value');
    });

    it('forwards title attribute to wrapper', () => {
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(
        <ToggleFilter filterId="active" title="Filter title" />,
        context
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveAttribute('title', 'Filter title');
    });

    it('handles multiple data attributes', () => {
      const filter = createBooleanFilter('active', 'Active');
      const context = createMockContext([filter]);

      const { container } = renderWithContext(
        <ToggleFilter
          filterId="active"
          data-custom="value1"
          data-another="value2"
          id="custom-id"
        />,
        context
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveAttribute('data-custom', 'value1');
      expect(wrapper).toHaveAttribute('data-another', 'value2');
      expect(wrapper).toHaveAttribute('id', 'custom-id');
    });
  });
});
