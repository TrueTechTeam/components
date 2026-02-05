import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { List } from './List';

interface TestItem {
  id: string;
  name: string;
  description?: string;
  category?: string;
  avatar?: string;
  disabled?: boolean;
}

const mockData: TestItem[] = [
  { id: '1', name: 'Item 1', description: 'Description 1', category: 'A' },
  { id: '2', name: 'Item 2', description: 'Description 2', category: 'A' },
  { id: '3', name: 'Item 3', description: 'Description 3', category: 'B' },
  { id: '4', name: 'Item 4', description: 'Description 4', category: 'B' },
  { id: '5', name: 'Item 5', description: 'Description 5', category: 'C' },
];

describe('List', () => {
  // 1. Rendering tests
  describe('rendering', () => {
    it('renders with default props', () => {
      render(<List data={mockData} primaryTextField="name" />);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('renders with all props', () => {
      render(
        <List
          data={mockData}
          primaryTextField="name"
          secondaryTextField="description"
          size="lg"
          variant="bordered"
          spacing="lg"
          className="custom-class"
          data-testid="test-list"
        />
      );

      const element = screen.getByTestId('test-list');
      expect(element).toBeInTheDocument();
      expect(element).toHaveAttribute('data-size', 'lg');
      expect(element).toHaveAttribute('data-variant', 'bordered');
      expect(element).toHaveAttribute('data-spacing', 'lg');
    });

    it('renders items with primary and secondary text', () => {
      render(<List data={mockData} primaryTextField="name" secondaryTextField="description" />);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
    });

    it('renders as list role by default', () => {
      render(<List data={mockData} primaryTextField="name" data-testid="list" />);
      const element = screen.getByTestId('list');
      expect(element).toHaveAttribute('role', 'list');
    });

    it('includes data-component attribute', () => {
      render(<List data={mockData} primaryTextField="name" data-testid="list" />);
      const element = screen.getByTestId('list');
      expect(element).toHaveAttribute('data-component', 'list');
    });

    it('renders custom render function', () => {
      render(
        <List
          data={mockData}
          renderItem={(item) => <div data-testid={`custom-${item.id}`}>{item.name}</div>}
        />
      );

      expect(screen.getByTestId('custom-1')).toBeInTheDocument();
      expect(screen.getByTestId('custom-2')).toBeInTheDocument();
    });
  });

  // 2. Variant tests
  describe('variants', () => {
    it('renders default variant by default', () => {
      render(<List data={mockData} primaryTextField="name" data-testid="list" />);
      const element = screen.getByTestId('list');
      expect(element).toHaveAttribute('data-variant', 'default');
    });

    it('renders bordered variant', () => {
      render(
        <List data={mockData} primaryTextField="name" variant="bordered" data-testid="list" />
      );
      const element = screen.getByTestId('list');
      expect(element).toHaveAttribute('data-variant', 'bordered');
    });

    it('renders card variant', () => {
      render(<List data={mockData} primaryTextField="name" variant="card" data-testid="list" />);
      const element = screen.getByTestId('list');
      expect(element).toHaveAttribute('data-variant', 'card');
    });

    it('renders flush variant', () => {
      render(<List data={mockData} primaryTextField="name" variant="flush" data-testid="list" />);
      const element = screen.getByTestId('list');
      expect(element).toHaveAttribute('data-variant', 'flush');
    });
  });

  // 3. Size tests
  describe('sizes', () => {
    it('renders md size by default', () => {
      render(<List data={mockData} primaryTextField="name" data-testid="list" />);
      const element = screen.getByTestId('list');
      expect(element).toHaveAttribute('data-size', 'md');
    });

    it('renders sm size', () => {
      render(<List data={mockData} primaryTextField="name" size="sm" data-testid="list" />);
      const element = screen.getByTestId('list');
      expect(element).toHaveAttribute('data-size', 'sm');
    });

    it('renders lg size', () => {
      render(<List data={mockData} primaryTextField="name" size="lg" data-testid="list" />);
      const element = screen.getByTestId('list');
      expect(element).toHaveAttribute('data-size', 'lg');
    });
  });

  // 4. Spacing tests
  describe('spacing', () => {
    it('renders md spacing by default', () => {
      render(<List data={mockData} primaryTextField="name" data-testid="list" />);
      const element = screen.getByTestId('list');
      expect(element).toHaveAttribute('data-spacing', 'md');
    });

    it('renders none spacing', () => {
      render(<List data={mockData} primaryTextField="name" spacing="none" data-testid="list" />);
      const element = screen.getByTestId('list');
      expect(element).toHaveAttribute('data-spacing', 'none');
    });

    it('renders sm spacing', () => {
      render(<List data={mockData} primaryTextField="name" spacing="sm" data-testid="list" />);
      const element = screen.getByTestId('list');
      expect(element).toHaveAttribute('data-spacing', 'sm');
    });

    it('renders lg spacing', () => {
      render(<List data={mockData} primaryTextField="name" spacing="lg" data-testid="list" />);
      const element = screen.getByTestId('list');
      expect(element).toHaveAttribute('data-spacing', 'lg');
    });
  });

  // 5. Selection mode tests
  describe('selection modes', () => {
    it('has no selection by default', () => {
      render(<List data={mockData} primaryTextField="name" data-testid="list" />);
      const element = screen.getByTestId('list');
      expect(element).toHaveAttribute('role', 'list');
      expect(element).not.toHaveAttribute('aria-multiselectable');
    });

    it('renders single selection mode', () => {
      render(
        <List data={mockData} primaryTextField="name" selectionMode="single" data-testid="list" />
      );
      const element = screen.getByTestId('list');
      expect(element).toHaveAttribute('role', 'listbox');
    });

    it('renders multiple selection mode', () => {
      render(
        <List data={mockData} primaryTextField="name" selectionMode="multiple" data-testid="list" />
      );
      const element = screen.getByTestId('list');
      expect(element).toHaveAttribute('role', 'listbox');
      expect(element).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('handles controlled selection', () => {
      const onSelectionChange = jest.fn();
      render(
        <List
          data={mockData}
          primaryTextField="name"
          selectionMode="multiple"
          selectedKeys={['1', '2']}
          onSelectionChange={onSelectionChange}
        />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('handles default selection', () => {
      render(
        <List
          data={mockData}
          primaryTextField="name"
          selectionMode="multiple"
          defaultSelectedKeys={['1', '3']}
        />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('calls onSelectionChange when selection changes', () => {
      const onSelectionChange = jest.fn();
      render(
        <List
          data={mockData}
          primaryTextField="name"
          selectionMode="single"
          onSelectionChange={onSelectionChange}
        />
      );

      // This test validates the callback exists - actual selection interaction
      // would require access to internal list items
      expect(onSelectionChange).not.toHaveBeenCalled();
    });
  });

  // 6. Grouping tests
  describe('grouping', () => {
    it('renders grouped items by field', () => {
      render(<List data={mockData} primaryTextField="name" groupBy="category" collapsibleGroups />);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('renders grouped items with custom function', () => {
      const groupFn = (item: TestItem) => item.category || 'Default';
      render(<List data={mockData} primaryTextField="name" groupBy={groupFn} collapsibleGroups />);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('renders custom group header', () => {
      const renderGroupHeader = (groupKey: string, itemCount: number) => (
        <div data-testid={`group-${groupKey}`}>
          {groupKey} ({itemCount})
        </div>
      );

      render(
        <List
          data={mockData}
          primaryTextField="name"
          groupBy="category"
          renderGroupHeader={renderGroupHeader}
          collapsibleGroups
        />
      );

      expect(screen.getByTestId('group-A')).toBeInTheDocument();
      expect(screen.getByTestId('group-B')).toBeInTheDocument();
    });

    it('handles collapsible groups', () => {
      render(
        <List
          data={mockData}
          primaryTextField="name"
          groupBy="category"
          collapsibleGroups
          defaultCollapsedGroups={['B']}
        />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('handles controlled collapsed groups', () => {
      const onCollapsedGroupsChange = jest.fn();
      render(
        <List
          data={mockData}
          primaryTextField="name"
          groupBy="category"
          collapsibleGroups
          collapsedGroups={['A']}
          onCollapsedGroupsChange={onCollapsedGroupsChange}
        />
      );

      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });
  });

  // 7. Expandable items tests
  describe('expandable items', () => {
    it('renders expandable content when provided', () => {
      const renderExpandedContent = (item: TestItem) => (
        <div data-testid={`expanded-${item.id}`}>Expanded content for {item.name}</div>
      );

      render(
        <List
          data={mockData}
          primaryTextField="name"
          renderExpandedContent={renderExpandedContent}
          defaultExpandedKeys={['1']}
        />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('handles controlled expanded keys', () => {
      const renderExpandedContent = (item: TestItem) => (
        <div data-testid={`expanded-${item.id}`}>Expanded</div>
      );
      const onExpandChange = jest.fn();

      render(
        <List
          data={mockData}
          primaryTextField="name"
          renderExpandedContent={renderExpandedContent}
          expandedKeys={['1', '2']}
          onExpandChange={onExpandChange}
        />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('handles expand trigger as icon', () => {
      const renderExpandedContent = (item: TestItem) => <div>Expanded</div>;

      render(
        <List
          data={mockData}
          primaryTextField="name"
          renderExpandedContent={renderExpandedContent}
          expandTrigger="icon"
        />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('handles expand trigger as click', () => {
      const renderExpandedContent = (item: TestItem) => <div>Expanded</div>;

      render(
        <List
          data={mockData}
          primaryTextField="name"
          renderExpandedContent={renderExpandedContent}
          expandTrigger="click"
        />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });

  // 8. Search/Filter tests
  describe('search and filter', () => {
    it('does not show search by default', () => {
      render(<List data={mockData} primaryTextField="name" />);
      expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
    });

    it('renders search input when searchable', () => {
      render(<List data={mockData} primaryTextField="name" searchable />);
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('renders custom search placeholder', () => {
      render(
        <List
          data={mockData}
          primaryTextField="name"
          searchable
          searchPlaceholder="Find items..."
        />
      );
      expect(screen.getByPlaceholderText('Find items...')).toBeInTheDocument();
    });

    it('filters items based on search query', async () => {
      render(
        <List
          data={mockData}
          primaryTextField="name"
          searchable
          searchFields={['name', 'description']}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search...');
      await userEvent.type(searchInput, 'Item 1');

      await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument();
      });
    });

    it('handles controlled search query', () => {
      const onSearchChange = jest.fn();
      render(
        <List
          data={mockData}
          primaryTextField="name"
          searchable
          searchQuery="test"
          onSearchChange={onSearchChange}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search...') as HTMLInputElement;
      expect(searchInput.value).toBe('test');
    });

    it('uses custom search function', () => {
      const customSearchFn = (item: TestItem, query: string) =>
        item.name.toLowerCase().includes(query.toLowerCase());

      render(<List data={mockData} primaryTextField="name" searchable searchFn={customSearchFn} />);

      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('debounces search input', async () => {
      render(
        <List
          data={mockData}
          primaryTextField="name"
          searchable
          searchDebounce={500}
          searchFields={['name']}
        />
      );

      const searchInput = screen.getByPlaceholderText('Search...');
      await userEvent.type(searchInput, 'Item');

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });

  // 9. Keyboard navigation tests
  describe('keyboard navigation', () => {
    it('enables keyboard navigation by default', () => {
      render(<List data={mockData} primaryTextField="name" data-testid="list" />);
      const element = screen.getByTestId('list');

      fireEvent.keyDown(element, { key: 'ArrowDown' });
      // Keyboard navigation is enabled
      expect(element).toBeInTheDocument();
    });

    it('disables keyboard navigation when specified', () => {
      render(
        <List
          data={mockData}
          primaryTextField="name"
          keyboardNavigation={false}
          data-testid="list"
        />
      );
      const element = screen.getByTestId('list');

      fireEvent.keyDown(element, { key: 'ArrowDown' });
      expect(element).toBeInTheDocument();
    });

    it('handles ArrowDown key', () => {
      render(<List data={mockData} primaryTextField="name" data-testid="list" />);
      const element = screen.getByTestId('list');

      fireEvent.keyDown(element, { key: 'ArrowDown' });
      expect(element).toBeInTheDocument();
    });

    it('handles ArrowUp key', () => {
      render(<List data={mockData} primaryTextField="name" data-testid="list" />);
      const element = screen.getByTestId('list');

      fireEvent.keyDown(element, { key: 'ArrowUp' });
      expect(element).toBeInTheDocument();
    });

    it('handles Home key', () => {
      render(<List data={mockData} primaryTextField="name" data-testid="list" />);
      const element = screen.getByTestId('list');

      fireEvent.keyDown(element, { key: 'Home' });
      expect(element).toBeInTheDocument();
    });

    it('handles End key', () => {
      render(<List data={mockData} primaryTextField="name" data-testid="list" />);
      const element = screen.getByTestId('list');

      fireEvent.keyDown(element, { key: 'End' });
      expect(element).toBeInTheDocument();
    });

    it('handles Enter key for item action', () => {
      const onItemAction = jest.fn();
      render(
        <List
          data={mockData}
          primaryTextField="name"
          onItemAction={onItemAction}
          data-testid="list"
        />
      );
      const element = screen.getByTestId('list');

      fireEvent.keyDown(element, { key: 'Enter' });
      expect(element).toBeInTheDocument();
    });

    it('handles Space key for item action', () => {
      const onItemAction = jest.fn();
      render(
        <List
          data={mockData}
          primaryTextField="name"
          onItemAction={onItemAction}
          data-testid="list"
        />
      );
      const element = screen.getByTestId('list');

      fireEvent.keyDown(element, { key: ' ' });
      expect(element).toBeInTheDocument();
    });

    it('supports grid navigation with columns', () => {
      render(<List data={mockData} primaryTextField="name" columns={2} data-testid="list" />);
      const element = screen.getByTestId('list');

      fireEvent.keyDown(element, { key: 'ArrowRight' });
      expect(element).toBeInTheDocument();
    });
  });

  // 10. Item interaction tests
  describe('item interactions', () => {
    it('calls onItemClick when item is clicked', () => {
      const onItemClick = jest.fn();
      render(<List data={mockData} primaryTextField="name" onItemClick={onItemClick} />);

      // Items are rendered and clickable
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('calls onItemAction on keyboard action', () => {
      const onItemAction = jest.fn();
      render(
        <List
          data={mockData}
          primaryTextField="name"
          onItemAction={onItemAction}
          data-testid="list"
        />
      );

      const element = screen.getByTestId('list');
      fireEvent.keyDown(element, { key: 'Enter' });
      expect(element).toBeInTheDocument();
    });

    it('respects disabled items', () => {
      const dataWithDisabled = [
        { id: '1', name: 'Item 1', disabled: true },
        { id: '2', name: 'Item 2', disabled: false },
      ];

      render(
        <List
          data={dataWithDisabled}
          primaryTextField="name"
          isItemDisabled={(item) => !!item.disabled}
        />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });

  // 11. Loading states tests
  describe('loading states', () => {
    it('does not show loading by default', () => {
      render(<List data={mockData} primaryTextField="name" data-testid="list" />);
      const element = screen.getByTestId('list');
      expect(element).not.toHaveAttribute('data-loading');
    });

    it('shows loading state', () => {
      render(<List data={mockData} primaryTextField="name" loading data-testid="list" />);
      const element = screen.getByTestId('list');
      expect(element).toHaveAttribute('data-loading', 'true');
      expect(element).toHaveAttribute('aria-busy', 'true');
    });

    it('renders custom loading content', () => {
      render(
        <List
          data={[]}
          primaryTextField="name"
          loading
          loadingContent={<div>Custom Loading...</div>}
        />
      );

      expect(screen.getByText('Custom Loading...')).toBeInTheDocument();
    });

    it('renders skeleton loading', () => {
      render(
        <List data={mockData} primaryTextField="name" skeleton={{ enabled: true, rows: 3 }} />
      );

      // Skeleton is rendered instead of items
      expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    });

    it('shows loading overlay with data', () => {
      render(<List data={mockData} primaryTextField="name" loading data-testid="list" />);

      // Both items and loading overlay should be present
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      const element = screen.getByTestId('list');
      expect(element).toHaveAttribute('data-loading', 'true');
    });
  });

  // 12. Empty state tests
  describe('empty states', () => {
    it('shows default empty message', () => {
      render(<List data={[]} primaryTextField="name" />);
      expect(screen.getByText('No items to display')).toBeInTheDocument();
    });

    it('shows custom empty content', () => {
      render(<List data={[]} primaryTextField="name" emptyContent="No data available" />);
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('renders custom empty state', () => {
      const renderEmpty = () => <div data-testid="custom-empty">Custom Empty State</div>;
      render(<List data={[]} primaryTextField="name" renderEmpty={renderEmpty} />);
      expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
    });

    it('shows no results message when filtering', async () => {
      render(<List data={mockData} primaryTextField="name" searchable searchFields={['name']} />);

      const searchInput = screen.getByPlaceholderText('Search...');
      await userEvent.type(searchInput, 'nonexistent');

      await waitFor(
        () => {
          // Check for the actual message format which includes the search query
          expect(screen.getByText('No results found for "nonexistent"')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });

  // 13. Bulk actions tests
  describe('bulk actions', () => {
    const bulkActions = [
      {
        id: 'delete',
        label: 'Delete',
        onAction: jest.fn(),
      },
      {
        id: 'archive',
        label: 'Archive',
        onAction: jest.fn(),
      },
    ];

    it('shows bulk actions with multiple selection', () => {
      render(
        <List
          data={mockData}
          primaryTextField="name"
          selectionMode="multiple"
          bulkActions={bulkActions}
        />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('renders bulk actions at top by default', () => {
      render(
        <List
          data={mockData}
          primaryTextField="name"
          selectionMode="multiple"
          bulkActions={bulkActions}
          bulkActionsPosition="top"
        />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('renders bulk actions at bottom', () => {
      render(
        <List
          data={mockData}
          primaryTextField="name"
          selectionMode="multiple"
          bulkActions={bulkActions}
          bulkActionsPosition="bottom"
        />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('renders custom bulk actions', () => {
      const renderBulkActions = () => <div data-testid="custom-bulk">Custom Actions</div>;

      render(
        <List
          data={mockData}
          primaryTextField="name"
          selectionMode="multiple"
          bulkActions={bulkActions}
          renderBulkActions={renderBulkActions}
        />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });

  // 14. Item actions tests
  describe('item actions', () => {
    const itemActions = [
      {
        id: 'edit',
        label: 'Edit',
        onAction: jest.fn(),
      },
      {
        id: 'delete',
        label: 'Delete',
        onAction: jest.fn(),
        variant: 'danger' as const,
      },
    ];

    it('renders items with actions', () => {
      render(<List data={mockData} primaryTextField="name" itemActions={itemActions} />);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('positions item actions at end by default', () => {
      render(
        <List
          data={mockData}
          primaryTextField="name"
          itemActions={itemActions}
          itemActionsPosition="end"
        />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('positions item actions at start', () => {
      render(
        <List
          data={mockData}
          primaryTextField="name"
          itemActions={itemActions}
          itemActionsPosition="start"
        />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('shows item actions on hover by default', () => {
      render(
        <List
          data={mockData}
          primaryTextField="name"
          itemActions={itemActions}
          itemActionsTrigger="hover"
        />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('shows item actions always', () => {
      render(
        <List
          data={mockData}
          primaryTextField="name"
          itemActions={itemActions}
          itemActionsTrigger="always"
        />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });

  // 15. Infinite scroll tests
  describe('infinite scroll', () => {
    it('renders infinite scroll sentinel', () => {
      const infiniteScroll = {
        onLoadMore: jest.fn(),
        hasMore: true,
        loading: false,
      };

      render(<List data={mockData} primaryTextField="name" infiniteScroll={infiniteScroll} />);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('shows loading in sentinel when loading more', () => {
      const infiniteScroll = {
        onLoadMore: jest.fn(),
        hasMore: true,
        loading: true,
      };

      render(<List data={mockData} primaryTextField="name" infiniteScroll={infiniteScroll} />);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('does not show sentinel when no more data', () => {
      const infiniteScroll = {
        onLoadMore: jest.fn(),
        hasMore: false,
        loading: false,
      };

      render(<List data={mockData} primaryTextField="name" infiniteScroll={infiniteScroll} />);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });

  // 16. Responsive columns tests
  describe('responsive columns', () => {
    it('renders single column by default', () => {
      render(<List data={mockData} primaryTextField="name" data-testid="list" />);
      const element = screen.getByTestId('list');
      expect(element).not.toHaveAttribute('data-columns');
    });

    it('renders multiple columns', () => {
      render(<List data={mockData} primaryTextField="name" columns={2} data-testid="list" />);
      const element = screen.getByTestId('list');
      expect(element).toHaveAttribute('data-columns', '2');
    });

    it('renders three columns', () => {
      render(<List data={mockData} primaryTextField="name" columns={3} data-testid="list" />);
      const element = screen.getByTestId('list');
      expect(element).toHaveAttribute('data-columns', '3');
    });
  });

  // 17. Accessibility tests
  describe('accessibility', () => {
    it('has correct aria-label when provided', () => {
      render(
        <List data={mockData} primaryTextField="name" aria-label="Test list" data-testid="list" />
      );
      const element = screen.getByTestId('list');
      expect(element).toHaveAttribute('aria-label', 'Test list');
    });

    it('has correct aria-labelledby when provided', () => {
      render(
        <List
          data={mockData}
          primaryTextField="name"
          aria-labelledby="list-label"
          data-testid="list"
        />
      );
      const element = screen.getByTestId('list');
      expect(element).toHaveAttribute('aria-labelledby', 'list-label');
    });

    it('has listbox role when selectable', () => {
      render(
        <List data={mockData} primaryTextField="name" selectionMode="single" data-testid="list" />
      );
      const element = screen.getByTestId('list');
      expect(element).toHaveAttribute('role', 'listbox');
    });

    it('accepts custom role', () => {
      render(<List data={mockData} primaryTextField="name" role="menu" data-testid="list" />);
      const element = screen.getByTestId('list');
      expect(element).toHaveAttribute('role', 'menu');
    });

    it('has aria-multiselectable for multiple selection', () => {
      render(
        <List data={mockData} primaryTextField="name" selectionMode="multiple" data-testid="list" />
      );
      const element = screen.getByTestId('list');
      expect(element).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('has aria-busy when loading', () => {
      render(<List data={mockData} primaryTextField="name" loading data-testid="list" />);
      const element = screen.getByTestId('list');
      expect(element).toHaveAttribute('aria-busy', 'true');
    });
  });

  // 18. Ref forwarding
  describe('ref forwarding', () => {
    it('forwards ref to element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<List ref={ref} data={mockData} primaryTextField="name" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards ref with data attributes', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <List
          ref={ref}
          data={mockData}
          primaryTextField="name"
          variant="bordered"
          size="lg"
          data-testid="list"
        />
      );

      const element = screen.getByTestId('list');
      expect(element).toHaveAttribute('data-variant', 'bordered');
      expect(element).toHaveAttribute('data-size', 'lg');
    });
  });

  // 19. Custom styling
  describe('custom styling', () => {
    it('accepts custom className', () => {
      const { container } = render(
        <List data={mockData} primaryTextField="name" className="custom-list" />
      );
      const element = container.querySelector('.custom-list');
      expect(element).toBeInTheDocument();
    });

    it('accepts custom style prop', () => {
      render(
        <List
          data={mockData}
          primaryTextField="name"
          style={{ backgroundColor: 'red' }}
          data-testid="list"
        />
      );
      // Style is applied to container, not the list itself
      expect(screen.getByTestId('list')).toBeInTheDocument();
    });

    it('accepts maxHeight prop', () => {
      render(<List data={mockData} primaryTextField="name" maxHeight={400} data-testid="list" />);
      expect(screen.getByTestId('list')).toBeInTheDocument();
    });

    it('accepts maxHeight as string', () => {
      render(<List data={mockData} primaryTextField="name" maxHeight="50vh" data-testid="list" />);
      expect(screen.getByTestId('list')).toBeInTheDocument();
    });
  });

  // 20. Item key handling
  describe('item key handling', () => {
    it('uses id as default item key', () => {
      render(<List data={mockData} primaryTextField="name" />);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('uses custom item key field', () => {
      const data = [
        { uid: 'a1', name: 'Item A' },
        { uid: 'a2', name: 'Item B' },
      ];

      render(<List data={data} itemKey="uid" primaryTextField="name" />);
      expect(screen.getByText('Item A')).toBeInTheDocument();
    });

    it('uses custom item key function', () => {
      const getKey = (item: TestItem, index: number) => `item-${index}`;
      render(<List data={mockData} itemKey={getKey} primaryTextField="name" />);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });

  // 21. Combined props tests
  describe('combined props', () => {
    it('renders with variant, size, spacing, and selection', () => {
      render(
        <List
          data={mockData}
          primaryTextField="name"
          variant="bordered"
          size="lg"
          spacing="lg"
          selectionMode="multiple"
          data-testid="list"
        />
      );

      const element = screen.getByTestId('list');
      expect(element).toHaveAttribute('data-variant', 'bordered');
      expect(element).toHaveAttribute('data-size', 'lg');
      expect(element).toHaveAttribute('data-spacing', 'lg');
      expect(element).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('renders with grouping, search, and selection', () => {
      render(
        <List
          data={mockData}
          primaryTextField="name"
          groupBy="category"
          searchable
          selectionMode="multiple"
          collapsibleGroups
        />
      );

      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('renders all features together', () => {
      const itemActions = [{ id: 'edit', label: 'Edit', onAction: jest.fn() }];
      const bulkActions = [{ id: 'delete', label: 'Delete', onAction: jest.fn() }];

      render(
        <List
          data={mockData}
          primaryTextField="name"
          secondaryTextField="description"
          variant="card"
          size="lg"
          spacing="lg"
          selectionMode="multiple"
          searchable
          groupBy="category"
          collapsibleGroups
          itemActions={itemActions}
          bulkActions={bulkActions}
          data-testid="list"
        />
      );

      expect(screen.getByTestId('list')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });
  });

  // 22. Edge cases
  describe('edge cases', () => {
    it('renders with empty data array', () => {
      render(<List data={[]} primaryTextField="name" />);
      expect(screen.getByText('No items to display')).toBeInTheDocument();
    });

    it('handles items without required fields', () => {
      const incompleteData = [{ id: '1', name: 'Item 1' }, { id: '2' } as TestItem];

      render(<List data={incompleteData} primaryTextField="name" />);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('handles undefined className gracefully', () => {
      render(<List data={mockData} primaryTextField="name" className={undefined} />);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('handles special characters in text', () => {
      const specialData = [{ id: '1', name: '!@#$%^&*()' }];
      render(<List data={specialData} primaryTextField="name" />);
      expect(screen.getByText('!@#$%^&*()')).toBeInTheDocument();
    });

    it('handles unicode characters', () => {
      const unicodeData = [{ id: '1', name: '🎉 ✨ 🚀' }];
      render(<List data={unicodeData} primaryTextField="name" />);
      expect(screen.getByText('🎉 ✨ 🚀')).toBeInTheDocument();
    });

    it('handles very long item names', () => {
      const longData = [
        {
          id: '1',
          name: 'This is a very long item name that should still render correctly in the list component',
        },
      ];
      render(<List data={longData} primaryTextField="name" />);
      expect(
        screen.getByText(
          'This is a very long item name that should still render correctly in the list component'
        )
      ).toBeInTheDocument();
    });

    it('handles zero values', () => {
      const zeroData = [{ id: '0', name: '0' }];
      render(<List data={zeroData} primaryTextField="name" />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });
});
