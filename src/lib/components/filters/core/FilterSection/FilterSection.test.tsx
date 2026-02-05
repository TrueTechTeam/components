import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterSection } from './FilterSection';
import { FilterContext } from '../../FilterContext';
import type { FilterContextValue } from '../../types';

// Mock the Collapse component
jest.mock('../../../display/Collapse', () => ({
  Collapse: ({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) => (
    <div data-testid="collapse" data-open={isOpen || undefined}>
      {children}
    </div>
  ),
}));

// Mock the Icon component
jest.mock('../../../display/Icon', () => ({
  Icon: ({ name, size }: { name: string; size?: string }) => (
    <span data-testid={`icon-${name}`} data-size={size}>
      {name}
    </span>
  ),
}));

// Helper to create a mock filter context
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
  getActiveFilters: jest.fn(),
  toSearchParams: jest.fn(),
  fromSearchParams: jest.fn(),
  getFilter: jest.fn(),
  getFiltersByGroup: jest.fn(() => []),
  getUngroupedFilters: jest.fn(),
  isFilterVisible: jest.fn(),
  isFilterEnabled: jest.fn(),
  getFilterOptions: jest.fn(),
  reloadFilterOptions: jest.fn(),
  applyFilters: jest.fn(),
  ...overrides,
});

describe('FilterSection', () => {
  // 1. Rendering tests
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<FilterSection>Test Content</FilterSection>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders with all props', () => {
      render(
        <FilterSection
          id="test-section"
          title="Test Section"
          description="Test description"
          icon={<span>Icon</span>}
          collapsible
          defaultCollapsed={false}
          showActiveCount
          className="custom-class"
          data-testid="test-section"
        >
          Content
        </FilterSection>
      );

      const element = screen.getByTestId('test-section');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('custom-class');
      expect(screen.getByText('Test Section')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('renders children correctly', () => {
      render(
        <FilterSection title="Section">
          <span>Child 1</span>
          <span>Child 2</span>
        </FilterSection>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });

    it('renders without title when not provided', () => {
      const { container } = render(<FilterSection>Test</FilterSection>);
      const header = container.querySelector('button');
      expect(header).not.toBeInTheDocument();
    });

    it('renders with complex children structure', () => {
      render(
        <FilterSection title="Section">
          <div>
            <h1>Title</h1>
            <p>Description</p>
          </div>
        </FilterSection>
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });
  });

  // 2. Title and header tests
  describe('title and header', () => {
    it('renders title when provided', () => {
      render(<FilterSection title="My Filters">Content</FilterSection>);
      expect(screen.getByText('My Filters')).toBeInTheDocument();
    });

    it('renders header as button when collapsible', () => {
      render(
        <FilterSection title="Section" collapsible>
          Content
        </FilterSection>
      );
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Section');
    });

    it('renders header as disabled button when not collapsible', () => {
      render(
        <FilterSection title="Section" collapsible={false}>
          Content
        </FilterSection>
      );
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('renders icon when provided', () => {
      render(
        <FilterSection title="Section" icon={<span data-testid="custom-icon">Icon</span>}>
          Content
        </FilterSection>
      );
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('renders chevron icon when collapsible', () => {
      render(
        <FilterSection title="Section" collapsible>
          Content
        </FilterSection>
      );
      expect(screen.getByTestId('icon-chevron-down')).toBeInTheDocument();
    });

    it('does not render chevron when not collapsible', () => {
      render(
        <FilterSection title="Section" collapsible={false}>
          Content
        </FilterSection>
      );
      expect(screen.queryByTestId('icon-chevron-down')).not.toBeInTheDocument();
    });
  });

  // 3. Description tests
  describe('description', () => {
    it('does not render description by default', () => {
      render(<FilterSection title="Section">Content</FilterSection>);
      expect(screen.queryByText('description')).not.toBeInTheDocument();
    });

    it('renders description when provided and not collapsed', () => {
      render(
        <FilterSection title="Section" description="Test description" defaultCollapsed={false}>
          Content
        </FilterSection>
      );
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('does not render description when collapsed', () => {
      render(
        <FilterSection title="Section" description="Test description" defaultCollapsed>
          Content
        </FilterSection>
      );
      expect(screen.queryByText('Test description')).not.toBeInTheDocument();
    });

    it('shows description after expanding', () => {
      render(
        <FilterSection title="Section" description="Test description" defaultCollapsed>
          Content
        </FilterSection>
      );

      expect(screen.queryByText('Test description')).not.toBeInTheDocument();

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(screen.getByText('Test description')).toBeInTheDocument();
    });
  });

  // 4. Collapsible behavior tests
  describe('collapsible behavior', () => {
    it('is collapsible by default', () => {
      render(<FilterSection title="Section">Content</FilterSection>);
      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });

    it('renders expanded by default', () => {
      render(<FilterSection title="Section">Content</FilterSection>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('renders collapsed when defaultCollapsed is true', () => {
      render(
        <FilterSection title="Section" defaultCollapsed>
          Content
        </FilterSection>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('toggles collapsed state when clicked', () => {
      render(<FilterSection title="Section">Content</FilterSection>);
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('aria-expanded', 'true');

      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('does not toggle when collapsible is false', () => {
      render(
        <FilterSection title="Section" collapsible={false}>
          Content
        </FilterSection>
      );
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();

      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('calls onCollapsedChange when toggled', () => {
      const handleChange = jest.fn();
      render(
        <FilterSection title="Section" onCollapsedChange={handleChange}>
          Content
        </FilterSection>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleChange).toHaveBeenCalledWith(true);
      expect(handleChange).toHaveBeenCalledTimes(1);

      fireEvent.click(button);
      expect(handleChange).toHaveBeenCalledWith(false);
      expect(handleChange).toHaveBeenCalledTimes(2);
    });

    it('works in controlled mode', () => {
      const handleChange = jest.fn();
      const { rerender } = render(
        <FilterSection title="Section" collapsed={false} onCollapsedChange={handleChange}>
          Content
        </FilterSection>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'true');

      fireEvent.click(button);
      expect(handleChange).toHaveBeenCalledWith(true);

      // Simulate parent updating the prop
      rerender(
        <FilterSection title="Section" collapsed onCollapsedChange={handleChange}>
          Content
        </FilterSection>
      );

      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('sets data-collapsed attribute when collapsed', () => {
      render(
        <FilterSection title="Section" defaultCollapsed data-testid="section">
          Content
        </FilterSection>
      );
      const element = screen.getByTestId('section');
      expect(element).toHaveAttribute('data-collapsed');
    });

    it('does not set data-collapsed attribute when expanded', () => {
      render(
        <FilterSection title="Section" defaultCollapsed={false} data-testid="section">
          Content
        </FilterSection>
      );
      const element = screen.getByTestId('section');
      expect(element).not.toHaveAttribute('data-collapsed');
    });
  });

  // 5. Active count badge tests
  describe('active count badge', () => {
    it('does not show badge when no context', () => {
      render(<FilterSection title="Section">Content</FilterSection>);
      expect(screen.queryByText(/\d+/)).not.toBeInTheDocument();
    });

    it('does not show badge when showActiveCount is false', () => {
      const mockContext = createMockContext({
        getFiltersByGroup: jest.fn(() => [
          { id: 'filter1', type: 'select', label: 'Filter 1' } as any,
        ]),
        isFilterActive: jest.fn(() => true),
      });

      render(
        <FilterContext.Provider value={mockContext}>
          <FilterSection id="section1" title="Section" showActiveCount={false}>
            Content
          </FilterSection>
        </FilterContext.Provider>
      );

      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });

    it('does not show badge when no id provided', () => {
      const mockContext = createMockContext({
        getFiltersByGroup: jest.fn(() => [
          { id: 'filter1', type: 'select', label: 'Filter 1' } as any,
        ]),
        isFilterActive: jest.fn(() => true),
      });

      render(
        <FilterContext.Provider value={mockContext}>
          <FilterSection title="Section">Content</FilterSection>
        </FilterContext.Provider>
      );

      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });

    it('does not show badge when active count is 0', () => {
      const mockContext = createMockContext({
        getFiltersByGroup: jest.fn(() => [
          { id: 'filter1', type: 'select', label: 'Filter 1' } as any,
        ]),
        isFilterActive: jest.fn(() => false),
      });

      render(
        <FilterContext.Provider value={mockContext}>
          <FilterSection id="section1" title="Section">
            Content
          </FilterSection>
        </FilterContext.Provider>
      );

      expect(screen.queryByText(/\d+/)).not.toBeInTheDocument();
    });

    it('shows badge with active count', () => {
      const mockContext = createMockContext({
        getFiltersByGroup: jest.fn(() => [
          { id: 'filter1', type: 'select', label: 'Filter 1' } as any,
          { id: 'filter2', type: 'select', label: 'Filter 2' } as any,
          { id: 'filter3', type: 'select', label: 'Filter 3' } as any,
        ]),
        isFilterActive: jest.fn((id) => id === 'filter1' || id === 'filter2'),
      });

      render(
        <FilterContext.Provider value={mockContext}>
          <FilterSection id="section1" title="Section">
            Content
          </FilterSection>
        </FilterContext.Provider>
      );

      expect(screen.getByText('2')).toBeInTheDocument();
      expect(mockContext.getFiltersByGroup).toHaveBeenCalledWith('section1');
    });

    it('updates badge count when filters change', () => {
      const mockContext = createMockContext({
        getFiltersByGroup: jest.fn(() => [
          { id: 'filter1', type: 'select', label: 'Filter 1' } as any,
          { id: 'filter2', type: 'select', label: 'Filter 2' } as any,
        ]),
        isFilterActive: jest.fn(() => false),
      });

      const { rerender } = render(
        <FilterContext.Provider value={mockContext}>
          <FilterSection id="section1" title="Section">
            Content
          </FilterSection>
        </FilterContext.Provider>
      );

      expect(screen.queryByText(/\d+/)).not.toBeInTheDocument();

      // Update context to have active filters
      const updatedContext = createMockContext({
        getFiltersByGroup: jest.fn(() => [
          { id: 'filter1', type: 'select', label: 'Filter 1' } as any,
          { id: 'filter2', type: 'select', label: 'Filter 2' } as any,
        ]),
        isFilterActive: jest.fn(() => true),
      });

      rerender(
        <FilterContext.Provider value={updatedContext}>
          <FilterSection id="section1" title="Section">
            Content
          </FilterSection>
        </FilterContext.Provider>
      );

      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  // 6. Collapse integration tests
  describe('collapse integration', () => {
    it('renders Collapse component when collapsible', () => {
      render(<FilterSection title="Section">Content</FilterSection>);
      expect(screen.getByTestId('collapse')).toBeInTheDocument();
    });

    it('does not render Collapse component when not collapsible', () => {
      render(
        <FilterSection title="Section" collapsible={false}>
          Content
        </FilterSection>
      );
      expect(screen.queryByTestId('collapse')).not.toBeInTheDocument();
    });

    it('passes correct isOpen prop to Collapse when expanded', () => {
      render(<FilterSection title="Section">Content</FilterSection>);
      const collapse = screen.getByTestId('collapse');
      expect(collapse).toHaveAttribute('data-open', 'true');
    });

    it('passes correct isOpen prop to Collapse when collapsed', () => {
      render(
        <FilterSection title="Section" defaultCollapsed>
          Content
        </FilterSection>
      );
      const collapse = screen.getByTestId('collapse');
      expect(collapse).not.toHaveAttribute('data-open');
    });
  });

  // 7. No title rendering mode
  describe('no title rendering mode', () => {
    it('renders simplified structure without title and not collapsible', () => {
      render(
        <FilterSection collapsible={false} data-testid="section">
          Content
        </FilterSection>
      );

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(screen.queryByTestId('collapse')).not.toBeInTheDocument();
    });

    it('still renders normally without title if collapsible is true', () => {
      render(
        <FilterSection collapsible data-testid="section">
          Content
        </FilterSection>
      );

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(screen.getByTestId('collapse')).toBeInTheDocument();
    });
  });

  // 8. Accessibility tests
  describe('accessibility', () => {
    it('sets aria-expanded on header button', () => {
      render(<FilterSection title="Section">Content</FilterSection>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('sets aria-controls when id is provided', () => {
      render(
        <FilterSection id="test-section" title="Section">
          Content
        </FilterSection>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-controls', 'filter-section-test-section');
    });

    it('does not set aria-controls when id is not provided', () => {
      render(<FilterSection title="Section">Content</FilterSection>);
      const button = screen.getByRole('button');
      expect(button).not.toHaveAttribute('aria-controls');
    });

    it('sets id on content div when id is provided', () => {
      const { container } = render(
        <FilterSection id="test-section" title="Section">
          <span>Content</span>
        </FilterSection>
      );
      const content = container.querySelector('#filter-section-test-section');
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('Content');
    });

    it('button has correct type', () => {
      render(<FilterSection title="Section">Content</FilterSection>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  // 9. Custom styling tests
  describe('custom styling', () => {
    it('accepts custom className', () => {
      render(
        <FilterSection title="Section" className="custom-section" data-testid="section">
          Content
        </FilterSection>
      );
      const element = screen.getByTestId('section');
      expect(element).toHaveClass('custom-section');
    });

    it('accepts custom style prop', () => {
      render(
        <FilterSection title="Section" style={{ backgroundColor: 'red' }} data-testid="section">
          Content
        </FilterSection>
      );
      const element = screen.getByTestId('section');
      expect(element).toHaveStyle({ backgroundColor: 'red' });
    });

    it('accepts id attribute', () => {
      render(
        <FilterSection title="Section" id="custom-id" data-testid="section">
          Content
        </FilterSection>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-controls', 'filter-section-custom-id');
    });

    it('handles undefined className gracefully', () => {
      render(
        <FilterSection title="Section" className={undefined}>
          Content
        </FilterSection>
      );
      expect(screen.getByText('Section')).toBeInTheDocument();
    });
  });

  // 10. Props spreading tests
  describe('props spreading', () => {
    it('accepts and applies data attributes', () => {
      render(
        <FilterSection title="Section" data-testid="test-section" data-custom="value">
          Content
        </FilterSection>
      );
      const element = screen.getByTestId('test-section');
      expect(element).toHaveAttribute('data-custom', 'value');
    });

    it('forwards additional HTML attributes', () => {
      render(
        <FilterSection title="Section" data-custom="value" data-testid="section">
          Content
        </FilterSection>
      );
      const element = screen.getByTestId('section');
      expect(element).toHaveAttribute('data-custom', 'value');
    });
  });

  // 11. Ref forwarding tests
  describe('ref forwarding', () => {
    it('forwards ref to element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <FilterSection ref={ref} title="Section">
          Test
        </FilterSection>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveTextContent('Section');
    });

    it('handles callback ref', () => {
      const refCallback = jest.fn();
      render(
        <FilterSection ref={refCallback} title="Section">
          Test
        </FilterSection>
      );
      expect(refCallback).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });
  });

  // 12. Edge cases tests
  describe('edge cases', () => {
    it('renders with null children', () => {
      render(
        <FilterSection title="Section" data-testid="section">
          {null}
        </FilterSection>
      );
      const element = screen.getByTestId('section');
      expect(element).toBeInTheDocument();
    });

    it('renders with undefined children', () => {
      render(
        <FilterSection title="Section" data-testid="section">
          {undefined}
        </FilterSection>
      );
      const element = screen.getByTestId('section');
      expect(element).toBeInTheDocument();
    });

    it('renders with zero as content', () => {
      render(<FilterSection title="Section">{0}</FilterSection>);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('renders with empty string content', () => {
      render(<FilterSection title="Section" data-testid="section" />);
      expect(screen.getByTestId('section')).toBeInTheDocument();
    });

    it('renders with long text content', () => {
      const longText =
        'This is a very long text content for the filter section component that should still render correctly';
      render(<FilterSection title="Section">{longText}</FilterSection>);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('renders with special characters', () => {
      render(<FilterSection title="!@#$%^&*()">Content</FilterSection>);
      expect(screen.getByText('!@#$%^&*()')).toBeInTheDocument();
    });

    it('handles controlled mode without onCollapsedChange', () => {
      render(
        <FilterSection title="Section" collapsed={false}>
          Content
        </FilterSection>
      );
      const button = screen.getByRole('button');

      fireEvent.click(button);
      // Should still work without throwing
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('handles empty string title', () => {
      const { container } = render(<FilterSection title="">Content</FilterSection>);
      const button = container.querySelector('button');
      expect(button).not.toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('handles multiple rapid toggles', () => {
      const handleChange = jest.fn();
      render(
        <FilterSection title="Section" onCollapsedChange={handleChange}>
          Content
        </FilterSection>
      );

      const button = screen.getByRole('button');

      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(handleChange).toHaveBeenCalledTimes(4);
    });

    it('handles context with no filters in group', () => {
      const mockContext = createMockContext({
        getFiltersByGroup: jest.fn(() => []),
        isFilterActive: jest.fn(() => false),
      });

      render(
        <FilterContext.Provider value={mockContext}>
          <FilterSection id="section1" title="Section">
            Content
          </FilterSection>
        </FilterContext.Provider>
      );

      expect(screen.queryByText(/\d+/)).not.toBeInTheDocument();
    });
  });

  // 13. Display name test
  describe('display name', () => {
    it('has correct display name', () => {
      expect(FilterSection.displayName).toBe('FilterSection');
    });
  });
});
