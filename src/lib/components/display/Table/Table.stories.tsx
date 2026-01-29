import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, useCallback } from 'react';
import { Table } from './Table';
import type { ColumnConfig, SortState } from './types';
import { Badge } from '../Badge';
import { Button } from '../../buttons/Button';

const meta: Meta<typeof Table> = {
  title: 'Display/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

// Sample data
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  balance: number;
  createdAt: Date;
}

const sampleUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'active',
    balance: 5000,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Editor',
    status: 'active',
    balance: 3500,
    createdAt: new Date('2024-02-20'),
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    role: 'Viewer',
    status: 'pending',
    balance: 1200,
    createdAt: new Date('2024-03-10'),
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice@example.com',
    role: 'Editor',
    status: 'inactive',
    balance: 8900,
    createdAt: new Date('2024-01-05'),
  },
  {
    id: '5',
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    role: 'Admin',
    status: 'active',
    balance: 15000,
    createdAt: new Date('2024-04-01'),
  },
];

// Basic usage with auto-generated columns
export const Default: Story = {
  args: {
    data: sampleUsers.map(({ id, name, email, role, status, balance }) => ({
      id,
      name,
      email,
      role,
      status,
      balance,
    })),
  },
};

// Custom column configuration
const customColumns: Array<ColumnConfig<User>> = [
  { key: 'name', header: 'Name', width: '1fr', sortable: true },
  { key: 'email', header: 'Email', width: '1.5fr' },
  { key: 'role', header: 'Role', width: '100px', align: 'center' },
  {
    key: 'status',
    header: 'Status',
    width: '120px',
    align: 'center',
    render: (value) => {
      const variant =
        value === 'active' ? 'success' : value === 'pending' ? 'warning' : 'danger';
      return <Badge variant={variant}>{String(value)}</Badge>;
    },
  },
  {
    key: 'balance',
    header: 'Balance',
    width: '120px',
    align: 'right',
    sortable: true,
    render: (value) => `$${Number(value).toLocaleString()}`,
  },
];

export const CustomColumns: Story = {
  args: {
    data: sampleUsers,
    columns: customColumns,
    rowKey: 'id',
  },
};

// Striped variant
export const Striped: Story = {
  args: {
    data: sampleUsers,
    columns: customColumns,
    variant: 'striped',
  },
};

// Bordered variant
export const Bordered: Story = {
  args: {
    data: sampleUsers,
    columns: customColumns,
    variant: 'bordered',
  },
};

// Different sizes
export const SizeSmall: Story = {
  args: {
    data: sampleUsers,
    columns: customColumns,
    size: 'sm',
  },
};

export const SizeLarge: Story = {
  args: {
    data: sampleUsers,
    columns: customColumns,
    size: 'lg',
  },
};

// Sorting
function SortingExample() {
  const [sort, setSort] = useState<SortState>({ column: null, direction: null });

  return (
    <div>
      <p style={{ marginBottom: '16px' }}>
        Current sort: {sort.column ? `${sort.column} (${sort.direction})` : 'None'}
      </p>
      <Table<User>
        data={sampleUsers}
        columns={customColumns}
        sort={sort}
        onSortChange={setSort}
      />
    </div>
  );
}

export const Sorting: Story = {
  render: () => <SortingExample />,
};

// Single row selection
function SingleSelectionExample() {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  return (
    <div>
      <p style={{ marginBottom: '16px' }}>
        Selected: {selectedKeys.length ? selectedKeys.join(', ') : 'None'}
      </p>
      <Table<User>
        data={sampleUsers}
        columns={customColumns}
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      />
    </div>
  );
}

export const SingleSelection: Story = {
  render: () => <SingleSelectionExample />,
};

// Multiple selection with checkboxes
function MultipleSelectionExample() {
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['1', '3']);

  return (
    <div>
      <p style={{ marginBottom: '16px' }}>
        Selected ({selectedKeys.length}): {selectedKeys.join(', ') || 'None'}
      </p>
      <Table<User>
        data={sampleUsers}
        columns={customColumns}
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      />
    </div>
  );
}

export const MultipleSelection: Story = {
  render: () => <MultipleSelectionExample />,
};

// Expandable rows
function ExpandableRowsExample() {
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['1']);

  return (
    <Table<User>
      data={sampleUsers}
      columns={customColumns}
      expandedRowRender={(row) => (
        <div style={{ padding: '8px 0' }}>
          <h4 style={{ margin: '0 0 8px 0' }}>User Details</h4>
          <p style={{ margin: '4px 0' }}>
            <strong>Full Name:</strong> {row.name}
          </p>
          <p style={{ margin: '4px 0' }}>
            <strong>Email:</strong> {row.email}
          </p>
          <p style={{ margin: '4px 0' }}>
            <strong>Member Since:</strong> {row.createdAt.toLocaleDateString()}
          </p>
          <p style={{ margin: '4px 0' }}>
            <strong>Account Balance:</strong> ${row.balance.toLocaleString()}
          </p>
        </div>
      )}
      expandedKeys={expandedKeys}
      onExpandChange={setExpandedKeys}
    />
  );
}

export const ExpandableRows: Story = {
  render: () => <ExpandableRowsExample />,
};

// Pagination
function PaginationExample() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2;

  const allData = [...sampleUsers, ...sampleUsers.map((u, i) => ({ ...u, id: `${u.id}-copy-${i}` }))];
  const paginatedData = allData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Table<User>
      data={paginatedData}
      columns={customColumns}
      pagination={{
        pageSize,
        currentPage,
        totalItems: allData.length,
        onPageChange: setCurrentPage,
      }}
    />
  );
}

export const WithPagination: Story = {
  render: () => <PaginationExample />,
};

// Infinite scroll
function InfiniteScrollExample() {
  const [data, setData] = useState(sampleUsers.slice(0, 3));
  const [loading, setLoading] = useState(false);
  const hasMore = data.length < 10;

  const loadMore = useCallback(() => {
    if (loading) {return;}
    setLoading(true);
    setTimeout(() => {
      setData((prev) => [
        ...prev,
        ...sampleUsers.slice(0, 2).map((u, i) => ({
          ...u,
          id: `${u.id}-${prev.length + i}`,
          name: `${u.name} ${prev.length + i}`,
        })),
      ]);
      setLoading(false);
    }, 1000);
  }, [loading]);

  return (
    <Table<User>
      data={data}
      columns={customColumns}
      maxHeight={300}
      infiniteScroll={{
        onLoadMore: loadMore,
        hasMore,
        loading,
      }}
    />
  );
}

export const InfiniteScroll: Story = {
  render: () => <InfiniteScrollExample />,
};

// Sticky header
export const StickyHeader: Story = {
  args: {
    data: [...sampleUsers, ...sampleUsers, ...sampleUsers],
    columns: customColumns,
    stickyHeader: true,
    maxHeight: 300,
  },
};

// Sticky first column
const wideColumns: Array<ColumnConfig<User>> = [
  { key: 'name', header: 'Name', width: '150px', sticky: true },
  { key: 'email', header: 'Email', width: '200px' },
  { key: 'role', header: 'Role', width: '150px' },
  { key: 'status', header: 'Status', width: '150px' },
  { key: 'balance', header: 'Balance', width: '150px' },
  { key: 'createdAt', header: 'Created At', width: '150px' },
];

export const StickyFirstColumn: Story = {
  args: {
    data: sampleUsers,
    columns: wideColumns,
    stickyFirstColumn: true,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 500, overflow: 'auto' }}>
        <Story />
      </div>
    ),
  ],
};

// Loading state
export const Loading: Story = {
  args: {
    data: [],
    columns: customColumns,
    loading: true,
  },
};

// Empty state
export const Empty: Story = {
  args: {
    data: [],
    columns: customColumns,
    emptyContent: 'No users found. Try adjusting your filters.',
  },
};

// Full featured example
function FullFeaturedExample() {
  const [sort, setSort] = useState<SortState>({ column: null, direction: null });
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 3;
  const allData = [...sampleUsers, ...sampleUsers.map((u, i) => ({ ...u, id: `copy-${i}-${u.id}` }))];
  const paginatedData = allData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleBulkDelete = () => {
    alert(`Deleting users: ${selectedKeys.join(', ')}`);
    setSelectedKeys([]);
  };

  return (
    <div>
      {selectedKeys.length > 0 && (
        <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span>{selectedKeys.length} selected</span>
          <Button size="sm" variant="danger" onClick={handleBulkDelete}>
            Delete Selected
          </Button>
        </div>
      )}
      <Table<User>
        data={paginatedData}
        columns={customColumns}
        variant="striped"
        stickyHeader
        maxHeight={400}
        // Sorting
        sort={sort}
        onSortChange={setSort}
        // Selection
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        // Expandable
        expandedRowRender={(row) => (
          <div>
            <p>
              <strong>Account created:</strong> {row.createdAt.toLocaleDateString()}
            </p>
            <p>
              <strong>Last login:</strong> 2 days ago
            </p>
          </div>
        )}
        expandedKeys={expandedKeys}
        onExpandChange={setExpandedKeys}
        // Pagination
        pagination={{
          pageSize,
          currentPage,
          totalItems: allData.length,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}

export const FullFeatured: Story = {
  render: () => <FullFeaturedExample />,
};

// ============================================================
// Selection Controls Stories
// ============================================================

// Single selection with visible controls (radio buttons)
function SingleSelectionWithControlsExample() {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  return (
    <div>
      <p style={{ marginBottom: '16px' }}>
        <strong>Single Selection with Controls</strong> - Radio buttons are visible for selection.
      </p>
      <p style={{ marginBottom: '16px' }}>
        Selected: {selectedKeys.length ? selectedKeys.join(', ') : 'None'}
      </p>
      <Table<User>
        data={sampleUsers}
        columns={customColumns}
        selectionMode="single"
        showSelectionControls
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      />
    </div>
  );
}

export const SingleSelectionWithControls: Story = {
  render: () => <SingleSelectionWithControlsExample />,
};

// Single selection without visible controls (row click only)
function SingleSelectionNoControlsExample() {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  return (
    <div>
      <p style={{ marginBottom: '16px' }}>
        <strong>Single Selection without Controls</strong> - Click on a row to select it. No radio buttons are shown.
      </p>
      <p style={{ marginBottom: '16px' }}>
        Selected: {selectedKeys.length ? selectedKeys.join(', ') : 'None'}
      </p>
      <Table<User>
        data={sampleUsers}
        columns={customColumns}
        selectionMode="single"
        showSelectionControls={false}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      />
    </div>
  );
}

export const SingleSelectionNoControls: Story = {
  render: () => <SingleSelectionNoControlsExample />,
};

// Multiple selection with visible controls (checkboxes)
function MultipleSelectionWithControlsExample() {
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['1']);

  return (
    <div>
      <p style={{ marginBottom: '16px' }}>
        <strong>Multiple Selection with Controls</strong> - Checkboxes are visible for selection. Use the header checkbox to select all.
      </p>
      <p style={{ marginBottom: '16px' }}>
        Selected ({selectedKeys.length}): {selectedKeys.join(', ') || 'None'}
      </p>
      <Table<User>
        data={sampleUsers}
        columns={customColumns}
        selectionMode="multiple"
        showSelectionControls
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      />
    </div>
  );
}

export const MultipleSelectionWithControls: Story = {
  render: () => <MultipleSelectionWithControlsExample />,
};

// Multiple selection without visible controls (row click only)
function MultipleSelectionNoControlsExample() {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  return (
    <div>
      <p style={{ marginBottom: '16px' }}>
        <strong>Multiple Selection without Controls</strong> - Click on rows to toggle selection. No checkboxes are shown.
      </p>
      <p style={{ marginBottom: '16px' }}>
        Selected ({selectedKeys.length}): {selectedKeys.join(', ') || 'None'}
      </p>
      <Table<User>
        data={sampleUsers}
        columns={customColumns}
        selectionMode="multiple"
        showSelectionControls={false}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      />
    </div>
  );
}

export const MultipleSelectionNoControls: Story = {
  render: () => <MultipleSelectionNoControlsExample />,
};

// ============================================================
// Skeleton Loader Story
// ============================================================

export const SkeletonLoader: Story = {
  args: {
    data: [],
    columns: customColumns,
    skeleton: {
      enabled: true,
      rows: 5,
    },
  },
};

// Skeleton loader with different row counts
export const SkeletonLoaderFewRows: Story = {
  args: {
    data: [],
    columns: customColumns,
    skeleton: {
      enabled: true,
      rows: 3,
    },
  },
};

export const SkeletonLoaderManyRows: Story = {
  args: {
    data: [],
    columns: customColumns,
    skeleton: {
      enabled: true,
      rows: 10,
    },
  },
};

// Skeleton with selection and expand columns
export const SkeletonLoaderWithSelectionAndExpand: Story = {
  args: {
    data: [],
    columns: customColumns,
    skeleton: {
      enabled: true,
      rows: 5,
    },
    selectionMode: 'multiple',
    expandedRowRender: () => <div>Expanded content</div>,
  },
};

// ============================================================
// Pagination with Page Size Story
// ============================================================

function PaginationWithPageSizeExample() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const allData = [
    ...sampleUsers,
    ...sampleUsers.map((u, i) => ({ ...u, id: `${u.id}-copy1-${i}` })),
    ...sampleUsers.map((u, i) => ({ ...u, id: `${u.id}-copy2-${i}` })),
    ...sampleUsers.map((u, i) => ({ ...u, id: `${u.id}-copy3-${i}` })),
  ];

  const paginatedData = allData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    // Reset to first page when page size changes
    setCurrentPage(1);
  };

  return (
    <div>
      <p style={{ marginBottom: '16px' }}>
        Showing {paginatedData.length} of {allData.length} items (Page {currentPage}, {pageSize} per page)
      </p>
      <Table<User>
        data={paginatedData}
        columns={customColumns}
        pagination={{
          pageSize,
          currentPage,
          totalItems: allData.length,
          onPageChange: setCurrentPage,
          pageSizeOptions: [5, 10, 15, 20],
          onPageSizeChange: handlePageSizeChange,
        }}
      />
    </div>
  );
}

export const PaginationWithPageSize: Story = {
  render: () => <PaginationWithPageSizeExample />,
};

// ============================================================
// Searchable Table Stories
// ============================================================

// Basic searchable table
export const Searchable: Story = {
  args: {
    data: sampleUsers,
    columns: customColumns,
    searchable: true,
    searchPlaceholder: 'Search users...',
  },
};

// Searchable with specific search fields
export const SearchableWithFields: Story = {
  args: {
    data: sampleUsers,
    columns: customColumns,
    searchable: true,
    searchPlaceholder: 'Search by name or email...',
    searchFields: ['name', 'email'],
  },
};

// Controlled searchable table
function ControlledSearchExample() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      <p style={{ marginBottom: '16px' }}>
        Search query: "{searchQuery}"
      </p>
      <Table<User>
        data={sampleUsers}
        columns={customColumns}
        searchable
        searchPlaceholder="Search users..."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </div>
  );
}

export const SearchableControlled: Story = {
  render: () => <ControlledSearchExample />,
};

// Searchable with custom search function
function CustomSearchFunctionExample() {
  return (
    <div>
      <p style={{ marginBottom: '16px' }}>
        Custom search: Only matches exact role names (case-insensitive)
      </p>
      <Table<User>
        data={sampleUsers}
        columns={customColumns}
        searchable
        searchPlaceholder="Search by role (Admin, Editor, Viewer)..."
        searchFn={(item, query) => {
          if (!query.trim()) {return true;}
          return item.role.toLowerCase() === query.toLowerCase();
        }}
      />
    </div>
  );
}

export const SearchableCustomFunction: Story = {
  render: () => <CustomSearchFunctionExample />,
};

// Searchable with pagination
function SearchableWithPaginationExample() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const pageSize = 3;

  // Extended data for pagination demo
  const allData: User[] = [
    ...sampleUsers,
    ...sampleUsers.map((u, i) => ({ ...u, id: `copy-${i}-${u.id}`, name: `${u.name} Jr.` })),
  ];

  // Filter data based on search
  const filteredData = searchQuery
    ? allData.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allData;

  // Reset to first page when search changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <p style={{ marginBottom: '16px' }}>
        Showing {paginatedData.length} of {filteredData.length} filtered results
        {searchQuery && ` (searching for "${searchQuery}")`}
      </p>
      <Table<User>
        data={paginatedData}
        columns={customColumns}
        searchable
        searchPlaceholder="Search users..."
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        pagination={{
          pageSize,
          currentPage,
          totalItems: filteredData.length,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}

export const SearchableWithPagination: Story = {
  render: () => <SearchableWithPaginationExample />,
};

// Searchable with selection
function SearchableWithSelectionExample() {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  return (
    <div>
      <p style={{ marginBottom: '16px' }}>
        Selected ({selectedKeys.length}): {selectedKeys.join(', ') || 'None'}
      </p>
      <Table<User>
        data={sampleUsers}
        columns={customColumns}
        searchable
        searchPlaceholder="Search and select users..."
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      />
    </div>
  );
}

export const SearchableWithSelection: Story = {
  render: () => <SearchableWithSelectionExample />,
};
