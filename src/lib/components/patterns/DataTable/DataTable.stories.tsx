import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import React, { useMemo, useState } from 'react';
import { DataTable } from './DataTable';
import type { DataTableColumnConfig, DataTableQuery } from './DataTable.types';
import type { FilterDefinition, FilterGroup } from '../../filters';
import { Badge } from '../../display/Badge';
import type { SortState } from '../../display/Table';

const meta: Meta<typeof DataTable> = {
  title: 'Patterns/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A preconfigured pattern that wires \`Table\`, \`FilterProvider\`, and a swappable filter layout
together so search + filters + sort + pagination + selection all work out of the box.

## What's preconfigured
- The search box always sits in its own row, separate from filter controls - typing a search
  term is a different action from opening/editing filters and shouldn't blend with it
- Default filter presentation (\`filterLayout="popover"\`) shows only a trigger button plus
  chips for the currently active filters - not every filter's input rendered inline. You click
  in to edit filters rather than seeing every control by default
- **Auto-derived filters**: mark a column \`filterable: true\` and a \`FilterDefinition\` is generated for
  you (type inferred from the data, \`select\` options and \`number-range\` bounds computed from unique values)
- Search reuses \`Table\`'s own debounced search box/logic; filtering reuses the full \`FilterProvider\` system
- Loading/empty states stay in sync between the toolbar and the table

## What's configurable
- \`filterLayout\`: \`popover\` (default) | \`modal\` | \`sidebar\` | \`accordion\` | \`bar\` (every filter's
  input inline) | \`none\` - swaps the rendering strategy for filter controls without touching filter state
- \`filters\`: supply explicit \`FilterDefinition[]\` to bypass auto-derivation entirely
- \`filterLayoutProps\`: escape hatch forwarded to the underlying layout component
  (\`FilterBarProps\` / \`FilterPopoverProps\` / \`FilterModalProps\` / \`FilterSidebarProps\` / \`FilterAccordionProps\`)
- \`mode\`: \`client\` (filters/searches \`data\` locally) or \`server\` (reports the combined query via
  \`onQueryChange\` so you can refetch)
- Every \`Table\` prop (selection, pagination, expand, variant, size, sticky, etc.) passes straight through
        `,
      },
    },
  },
  argTypes: {
    // Complex/object props - not meaningful as interactive controls
    data: { table: { disable: true } },
    columns: { table: { disable: true } },
    rowKey: { table: { disable: true } },
    filters: { table: { disable: true } },
    filterGroups: { table: { disable: true } },
    filterValues: { table: { disable: true } },
    defaultFilterValues: { table: { disable: true } },
    onFilterChange: { table: { disable: true } },
    filterLayoutProps: { table: { disable: true } },
    searchFields: { table: { disable: true } },
    searchFn: { table: { disable: true } },
    searchQuery: { table: { disable: true } },
    onSearchChange: { table: { disable: true } },
    onQueryChange: { table: { disable: true } },
    sort: { table: { disable: true } },
    defaultSort: { table: { disable: true } },
    onSortChange: { table: { disable: true } },
    selectedKeys: { table: { disable: true } },
    defaultSelectedKeys: { table: { disable: true } },
    onSelectionChange: { table: { disable: true } },
    onRowClick: { table: { disable: true } },
    expandedRowRender: { table: { disable: true } },
    expandedKeys: { table: { disable: true } },
    defaultExpandedKeys: { table: { disable: true } },
    onExpandChange: { table: { disable: true } },
    pagination: { table: { disable: true } },
    infiniteScroll: { table: { disable: true } },
    maxHeight: { table: { disable: true } },
    emptyContent: { table: { disable: true } },
    loadingContent: { table: { disable: true } },
    skeleton: { table: { disable: true } },
    caption: { table: { disable: true } },
    captionHidden: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },

    // Interactive controls - freely combinable
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'striped', 'bordered'] },
    filterLayout: {
      control: 'select',
      options: ['popover', 'modal', 'sidebar', 'accordion', 'bar', 'none'],
    },
    showActiveFilters: { control: 'boolean' },
    syncFiltersWithUrl: { control: 'boolean' },
    searchable: { control: 'boolean' },
    searchPlaceholder: { control: 'text' },
    searchDebounce: { control: 'number' },
    mode: { control: 'radio', options: ['client', 'server'] },
    selectionMode: { control: 'select', options: ['none', 'single', 'multiple'] },
    showSelectionControls: { control: 'boolean' },
    stickyHeader: { control: 'boolean' },
    stickyFirstColumn: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof DataTable>;

// =============================================================================
// Sample data
// =============================================================================

interface Product {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'inactive' | 'discontinued';
  price: number;
  inStock: boolean;
  rating: number;
  releaseDate: Date;
}

const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    category: 'Electronics',
    status: 'active',
    price: 89.99,
    inStock: true,
    rating: 4,
    releaseDate: new Date('2023-11-02'),
  },
  {
    id: '2',
    name: 'Running Shoes',
    category: 'Sports',
    status: 'active',
    price: 64.5,
    inStock: true,
    rating: 5,
    releaseDate: new Date('2024-02-14'),
  },
  {
    id: '3',
    name: 'Coffee Maker',
    category: 'Home',
    status: 'inactive',
    price: 129.0,
    inStock: false,
    rating: 3,
    releaseDate: new Date('2022-06-20'),
  },
  {
    id: '4',
    name: 'Winter Jacket',
    category: 'Clothing',
    status: 'active',
    price: 149.99,
    inStock: true,
    rating: 4,
    releaseDate: new Date('2023-09-10'),
  },
  {
    id: '5',
    name: 'Novel: The Long Way',
    category: 'Books',
    status: 'active',
    price: 14.99,
    inStock: true,
    rating: 5,
    releaseDate: new Date('2021-03-05'),
  },
  {
    id: '6',
    name: 'Bluetooth Speaker',
    category: 'Electronics',
    status: 'discontinued',
    price: 39.99,
    inStock: false,
    rating: 2,
    releaseDate: new Date('2020-08-18'),
  },
  {
    id: '7',
    name: 'Yoga Mat',
    category: 'Sports',
    status: 'active',
    price: 24.99,
    inStock: true,
    rating: 4,
    releaseDate: new Date('2024-01-22'),
  },
  {
    id: '8',
    name: 'Desk Lamp',
    category: 'Home',
    status: 'active',
    price: 34.5,
    inStock: true,
    rating: 3,
    releaseDate: new Date('2023-05-30'),
  },
  {
    id: '9',
    name: 'Denim Jeans',
    category: 'Clothing',
    status: 'inactive',
    price: 54.0,
    inStock: false,
    rating: 3,
    releaseDate: new Date('2022-11-11'),
  },
  {
    id: '10',
    name: 'Cookbook: Fast & Fresh',
    category: 'Books',
    status: 'active',
    price: 19.99,
    inStock: true,
    rating: 4,
    releaseDate: new Date('2024-04-02'),
  },
];

const statusVariant: Record<Product['status'], 'success' | 'warning' | 'danger'> = {
  active: 'success',
  inactive: 'warning',
  discontinued: 'danger',
};

// Columns with auto-derived filters (`filterable: true`) on the ones that make sense to filter by
const autoFilterableColumns: Array<DataTableColumnConfig<Product>> = [
  { key: 'name', header: 'Name', width: '1.5fr', sortable: true },
  { key: 'category', header: 'Category', width: '140px', filterable: true },
  {
    key: 'status',
    header: 'Status',
    width: '130px',
    filterable: true,
    render: (value) => (
      <Badge variant={statusVariant[value as Product['status']]}>{String(value)}</Badge>
    ),
  },
  {
    key: 'price',
    header: 'Price',
    width: '120px',
    align: 'right',
    sortable: true,
    filterable: true,
  },
  {
    key: 'inStock',
    header: 'In Stock',
    width: '100px',
    align: 'center',
    filterable: { label: 'In Stock Only' },
    render: (value) => (value ? 'Yes' : 'No'),
  },
  {
    key: 'rating',
    header: 'Rating',
    width: '110px',
    align: 'center',
    sortable: true,
    filterable: { type: 'rating', label: 'Minimum Rating', config: { max: 5 } },
  },
  {
    key: 'releaseDate',
    header: 'Released',
    width: '140px',
    filterable: true,
    render: (value) => (value as Date).toLocaleDateString(),
  },
];

// Plain columns with no filtering at all
const plainColumns: Array<DataTableColumnConfig<Product>> = autoFilterableColumns.map(
  ({ filterable: _filterable, ...column }) => column
);

// Explicit filter definitions, overriding auto-derivation entirely
const customFilters: FilterDefinition[] = [
  {
    id: 'category',
    type: 'multi-select',
    label: 'Category',
    options: Array.from(new Set(products.map((p) => p.category))).map((value) => ({
      value,
      label: value,
    })),
    config: { displayMode: 'checkbox-group', showSelectAll: true },
  },
  {
    id: 'price',
    type: 'number-range',
    label: 'Price',
    config: { min: 0, max: 200, step: 5, prefix: '$', displayMode: 'slider' },
  },
  {
    id: 'inStock',
    type: 'toggle',
    label: 'In stock only',
  },
];

const filterGroups: FilterGroup[] = [
  { id: 'product', label: 'Product', order: 0 },
  { id: 'availability', label: 'Availability', order: 1 },
];

const groupedFilterableColumns: Array<DataTableColumnConfig<Product>> = [
  { key: 'name', header: 'Name', width: '1.5fr', sortable: true },
  { key: 'category', header: 'Category', width: '140px', filterable: { group: 'product' } },
  {
    key: 'status',
    header: 'Status',
    width: '130px',
    filterable: { group: 'product' },
    render: (value) => (
      <Badge variant={statusVariant[value as Product['status']]}>{String(value)}</Badge>
    ),
  },
  {
    key: 'price',
    header: 'Price',
    width: '120px',
    align: 'right',
    filterable: { group: 'product' },
  },
  {
    key: 'inStock',
    header: 'In Stock',
    width: '100px',
    align: 'center',
    filterable: { group: 'availability', label: 'In Stock Only' },
    render: (value) => (value ? 'Yes' : 'No'),
  },
];

// =============================================================================
// Playground - every combinable prop exposed as a Storybook control
// =============================================================================

export const Playground: Story = {
  args: {
    data: products,
    columns: autoFilterableColumns,
    size: 'md',
    variant: 'default',
    filterLayout: 'popover',
    showActiveFilters: true,
    syncFiltersWithUrl: false,
    searchable: true,
    searchPlaceholder: 'Search products...',
    searchDebounce: 300,
    mode: 'client',
    selectionMode: 'none',
    showSelectionControls: true,
    stickyHeader: false,
    stickyFirstColumn: false,
    loading: false,
  },
};

// =============================================================================
// Common preset combinations
// =============================================================================

export const SearchOnly: Story = {
  name: 'Preset: Search only (no filters)',
  args: {
    data: products,
    columns: plainColumns,
    searchable: true,
    searchPlaceholder: 'Search products...',
    filterLayout: 'none',
  },
};

export const FilterPopoverPreset: Story = {
  name: 'Preset: Filter popover (default)',
  args: {
    data: products,
    columns: autoFilterableColumns,
    searchable: true,
    filterLayout: 'popover',
  },
};

export const AutoDerivedFilterBar: Story = {
  name: 'Preset: Auto-derived filters (opt-in inline bar)',
  args: {
    data: products,
    columns: autoFilterableColumns,
    searchable: true,
    filterLayout: 'bar',
  },
};

export const CustomFilterDefinitions: Story = {
  name: 'Preset: Explicit filter definitions',
  args: {
    data: products,
    columns: plainColumns,
    filters: customFilters,
    searchable: true,
    filterLayout: 'bar',
  },
};

export const FilterModalPreset: Story = {
  name: 'Preset: Filter modal',
  args: {
    data: products,
    columns: autoFilterableColumns,
    searchable: true,
    filterLayout: 'modal',
  },
};

export const FilterSidebarPreset: Story = {
  name: 'Preset: Filter sidebar',
  args: {
    data: products,
    columns: autoFilterableColumns,
    searchable: true,
    filterLayout: 'sidebar',
    filterLayoutProps: { header: <strong>Filters</strong> },
  },
};

export const FilterAccordionPreset: Story = {
  name: 'Preset: Filter accordion (grouped)',
  args: {
    data: products,
    columns: groupedFilterableColumns,
    filterGroups,
    searchable: true,
    filterLayout: 'accordion',
  },
};

export const WithSelectionAndPagination: Story = {
  name: 'Preset: Selection + pagination',
  render: () => {
    function Example() {
      const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
      const [currentPage, setCurrentPage] = useState(1);
      const pageSize = 5;
      const paginated = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

      return (
        <div>
          {selectedKeys.length > 0 && (
            <p style={{ marginBottom: 16 }}>{selectedKeys.length} product(s) selected</p>
          )}
          <DataTable<Product>
            data={paginated}
            columns={autoFilterableColumns}
            searchable
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            pagination={{
              pageSize,
              currentPage,
              totalItems: products.length,
              onPageChange: setCurrentPage,
            }}
          />
        </div>
      );
    }
    return <Example />;
  },
};

export const FullFeatured: Story = {
  name: 'Preset: Full featured',
  render: () => {
    function Example() {
      const [sort, setSort] = useState<SortState>({ column: null, direction: null });
      const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
      const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
      const [currentPage, setCurrentPage] = useState(1);
      const pageSize = 5;
      const paginated = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

      return (
        <DataTable<Product>
          data={paginated}
          columns={autoFilterableColumns}
          variant="striped"
          searchable
          sort={sort}
          onSortChange={setSort}
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          expandedRowRender={(row) => (
            <p style={{ margin: 0 }}>
              <strong>{row.name}</strong> - released {row.releaseDate.toLocaleDateString()}, rated{' '}
              {row.rating}/5
            </p>
          )}
          expandedKeys={expandedKeys}
          onExpandChange={setExpandedKeys}
          pagination={{
            pageSize,
            currentPage,
            totalItems: products.length,
            onPageChange: setCurrentPage,
          }}
        />
      );
    }
    return <Example />;
  },
};

export const ServerSideMode: Story = {
  name: 'Preset: Server-side mode',
  parameters: {
    docs: {
      description: {
        story:
          'In `mode="server"`, `data` is assumed pre-filtered/sorted/paged. `DataTable` reports the ' +
          'combined search/filter/sort/page state via `onQueryChange` instead of filtering locally - ' +
          'wire that to a refetch. `sort` and `searchQuery` are controlled here so the reported query ' +
          'stays accurate.',
      },
    },
  },
  render: () => {
    function Example() {
      const [query, setQuery] = useState<DataTableQuery | null>(null);
      const [searchQuery, setSearchQuery] = useState('');
      const [sort, setSort] = useState<SortState>({ column: null, direction: null });
      const [loading, setLoading] = useState(false);

      // Simulate a server-filtered/sorted page of results
      const data = useMemo(() => {
        let result = products;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          result = result.filter((p) => p.name.toLowerCase().includes(q));
        }
        if (sort.column && sort.direction) {
          const dir = sort.direction === 'asc' ? 1 : -1;
          result = [...result].sort((a, b) => {
            const av = a[sort.column as keyof Product];
            const bv = b[sort.column as keyof Product];
            return av > bv ? dir : av < bv ? -dir : 0;
          });
        }
        return result;
      }, [searchQuery, sort]);

      const handleQueryChange = (nextQuery: DataTableQuery) => {
        setQuery(nextQuery);
        setLoading(true);
        action('onQueryChange')(nextQuery);
        const timer = setTimeout(() => setLoading(false), 400);
        return () => clearTimeout(timer);
      };

      return (
        <div>
          <p style={{ marginBottom: 16 }}>
            Last reported query: <code>{query ? JSON.stringify(query) : 'none yet'}</code>
          </p>
          <DataTable<Product>
            data={data}
            columns={plainColumns}
            mode="server"
            loading={loading}
            searchable
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterLayout="none"
            sort={sort}
            onSortChange={setSort}
            onQueryChange={handleQueryChange}
          />
        </div>
      );
    }
    return <Example />;
  },
};

export const Loading: Story = {
  args: {
    data: [],
    columns: autoFilterableColumns,
    searchable: true,
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    data: [],
    columns: autoFilterableColumns,
    searchable: true,
    emptyContent: 'No products found. Try adjusting your search or filters.',
  },
};
