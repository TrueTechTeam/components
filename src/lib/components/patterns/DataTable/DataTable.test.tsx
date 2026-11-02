import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DataTable } from './DataTable';
import type { DataTableColumnConfig, DataTableQuery } from './DataTable.types';
import type { FilterDefinition } from '../../filters';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
}

const products: Product[] = [
  { id: '1', name: 'Widget', category: 'Tools', price: 10, inStock: true },
  { id: '2', name: 'Gadget', category: 'Electronics', price: 50, inStock: false },
  { id: '3', name: 'Gizmo', category: 'Electronics', price: 30, inStock: true },
];

const filterableColumns: Array<DataTableColumnConfig<Product>> = [
  { key: 'name', header: 'Name' },
  { key: 'category', header: 'Category', filterable: true },
  { key: 'price', header: 'Price', filterable: true },
  { key: 'inStock', header: 'In Stock', filterable: true },
];

const plainColumns: Array<DataTableColumnConfig<Product>> = [
  { key: 'name', header: 'Name' },
  { key: 'category', header: 'Category' },
  { key: 'price', header: 'Price' },
  { key: 'inStock', header: 'In Stock' },
];

describe('DataTable', () => {
  describe('rendering', () => {
    it('renders the table with data', () => {
      render(<DataTable data={products} columns={plainColumns} />);
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('Widget')).toBeInTheDocument();
      expect(screen.getByText('Gadget')).toBeInTheDocument();
    });

    it('renders with no filter UI when there are no filterable columns', () => {
      const { container } = render(<DataTable data={products} columns={plainColumns} />);
      expect(container.querySelector('[data-filter-id]')).not.toBeInTheDocument();
    });
  });

  describe('filter derivation', () => {
    // filterLayout="bar" renders every filter field inline so derivation can be asserted
    // directly - the default "popover" layout only mounts fields once opened (covered below).
    it('derives a select filter for a low-cardinality string column', () => {
      const { container } = render(
        <DataTable data={products} columns={filterableColumns} filterLayout="bar" />
      );
      expect(container.querySelector('[data-filter-id="category"]')).toHaveAttribute(
        'data-filter-type',
        'select'
      );
    });

    it('derives a number-range filter for a numeric column', () => {
      const { container } = render(
        <DataTable data={products} columns={filterableColumns} filterLayout="bar" />
      );
      expect(container.querySelector('[data-filter-id="price"]')).toHaveAttribute(
        'data-filter-type',
        'number-range'
      );
    });

    it('derives an optional Yes/No select filter for a boolean column (not `toggle`, which is always active)', () => {
      const { container } = render(
        <DataTable data={products} columns={filterableColumns} filterLayout="bar" />
      );
      expect(container.querySelector('[data-filter-id="inStock"]')).toHaveAttribute(
        'data-filter-type',
        'select'
      );
    });

    it('derives an "inputs" (not slider) display mode for number-range filters, so it fits a narrow panel', () => {
      const { container } = render(
        <DataTable data={products} columns={filterableColumns} filterLayout="bar" />
      );
      expect(container.querySelector('[data-filter-id="price"] [data-mode]')).toHaveAttribute(
        'data-mode',
        'inputs'
      );
    });

    it('lets an explicit `filters` prop override auto-derivation entirely', () => {
      const customFilters: FilterDefinition[] = [
        { id: 'category', type: 'text', label: 'Category' },
      ];
      const { container } = render(
        <DataTable
          data={products}
          columns={filterableColumns}
          filters={customFilters}
          filterLayout="bar"
        />
      );
      expect(container.querySelector('[data-filter-id="category"]')).toHaveAttribute(
        'data-filter-type',
        'text'
      );
      expect(container.querySelector('[data-filter-id="price"]')).not.toBeInTheDocument();
    });
  });

  describe('client-side filtering', () => {
    it('filters rows by an active select filter value', () => {
      render(
        <DataTable
          data={products}
          columns={filterableColumns}
          filterValues={{ category: 'Electronics' }}
        />
      );
      expect(screen.queryByText('Widget')).not.toBeInTheDocument();
      expect(screen.getByText('Gadget')).toBeInTheDocument();
      expect(screen.getByText('Gizmo')).toBeInTheDocument();
    });

    it('filters rows by an active number-range filter value', () => {
      render(
        <DataTable
          data={products}
          columns={filterableColumns}
          filterValues={{ price: { min: 20, max: 40 } }}
        />
      );
      expect(screen.getByText('Gizmo')).toBeInTheDocument();
      expect(screen.queryByText('Widget')).not.toBeInTheDocument();
      expect(screen.queryByText('Gadget')).not.toBeInTheDocument();
    });

    it('combines multiple active filters with AND semantics', () => {
      render(
        <DataTable
          data={products}
          columns={filterableColumns}
          filterValues={{ category: 'Electronics', inStock: true }}
        />
      );
      expect(screen.getByText('Gizmo')).toBeInTheDocument();
      expect(screen.queryByText('Gadget')).not.toBeInTheDocument();
      expect(screen.queryByText('Widget')).not.toBeInTheDocument();
    });
  });

  describe('active filters', () => {
    it('shows a removable chip for an active filter and clears it on removal', async () => {
      render(
        <DataTable
          data={products}
          columns={filterableColumns}
          defaultFilterValues={{ category: 'Electronics' }}
          filterLayout="none"
        />
      );
      expect(screen.queryByText('Widget')).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Remove Category filter' }));

      await waitFor(() => expect(screen.getByText('Widget')).toBeInTheDocument());
    });
  });

  describe('default layout (popover)', () => {
    it('does not render filter inputs inline until the trigger is opened', () => {
      const { container } = render(<DataTable data={products} columns={filterableColumns} />);
      expect(container.querySelector('[data-filter-id]')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /filters/i })).toBeInTheDocument();
    });

    it('reveals filter inputs once the trigger is clicked', () => {
      render(<DataTable data={products} columns={filterableColumns} />);

      fireEvent.click(screen.getByRole('button', { name: /filters/i }));

      // the popover panel renders through a portal, outside the render container
      expect(document.querySelector('[data-filter-id="category"]')).toBeInTheDocument();
    });

    it("does not close when selecting an option from a nested Select filter's dropdown", () => {
      render(<DataTable data={products} columns={filterableColumns} />);

      fireEvent.click(screen.getByRole('button', { name: /filters/i }));
      const selectTrigger = document.querySelector('[data-filter-id="category"] [role="button"]');
      fireEvent.mouseDown(selectTrigger as Element);
      fireEvent.click(selectTrigger as Element);

      // Select renders its own dropdown through a nested Popover, which lives in the
      // portal root as a sibling of the outer FilterPopover, not a DOM descendant of it -
      // without registerOpenOverlay, the outer popover's click-outside check can't tell
      // this apart from a genuine outside click and closes itself before the option's
      // click handler (and the resulting filter value) can apply.
      const option = document.querySelector('[data-testid="menu-item-Electronics"]');
      expect(option).toBeTruthy();
      fireEvent.mouseDown(option as Element);
      fireEvent.click(option as Element);

      expect(document.querySelector('.filterFieldsList')).toBeInTheDocument();
      expect(screen.getByText('Category: Electronics')).toBeInTheDocument();
    });

    it('shows active filter chips without opening the trigger', () => {
      render(
        <DataTable
          data={products}
          columns={filterableColumns}
          defaultFilterValues={{ category: 'Electronics' }}
        />
      );
      expect(screen.getByText('Category: Electronics')).toBeInTheDocument();
    });

    it('keeps the search box out of the filter trigger row', () => {
      const { container } = render(
        <DataTable data={products} columns={filterableColumns} searchable />
      );
      const searchInput = screen.getByPlaceholderText('Search...');
      const filtersButton = screen.getByRole('button', { name: /filters/i });

      const toolbarRows = container.querySelectorAll('.toolbar');
      expect(toolbarRows.length).toBeGreaterThanOrEqual(2);
      expect(searchInput.closest('.toolbar')).not.toBe(filtersButton.closest('.toolbar'));
    });

    it('labels each field and spaces them apart once the panel is open', () => {
      render(<DataTable data={products} columns={filterableColumns} />);

      fireEvent.click(screen.getByRole('button', { name: /filters/i }));

      expect(document.querySelector('.filterFieldsList')).toBeInTheDocument();
      // a real <label>, not just a placeholder, so it reads correctly with no value selected
      const categoryLabel = document.querySelector('[data-filter-id="category"] label');
      expect(categoryLabel).toHaveTextContent('Category');
    });
  });

  describe('search', () => {
    it('renders the search box with the shared Input component, not a bespoke table search box', () => {
      render(<DataTable data={products} columns={plainColumns} searchable />);
      const searchInput = screen.getByPlaceholderText('Search...');
      expect(searchInput.closest('[data-component="input"]')).toBeInTheDocument();
    });

    it('filters rows via the search box', async () => {
      render(
        <DataTable
          data={products}
          columns={plainColumns}
          searchable
          searchPlaceholder="Search products..."
          searchDebounce={0}
        />
      );

      fireEvent.change(screen.getByPlaceholderText('Search products...'), {
        target: { value: 'Gadget' },
      });

      await waitFor(() => expect(screen.queryByText('Widget')).not.toBeInTheDocument());
      expect(screen.getByText('Gadget')).toBeInTheDocument();
    });
  });

  describe('filterLayout', () => {
    it.each(['bar', 'popover', 'modal', 'sidebar', 'accordion', 'none'] as const)(
      'renders without crashing with filterLayout="%s"',
      (filterLayout) => {
        render(
          <DataTable data={products} columns={filterableColumns} filterLayout={filterLayout} />
        );
        expect(screen.getByRole('table')).toBeInTheDocument();
      }
    );

    it('renders a persistent side panel for the sidebar layout', () => {
      const { container } = render(
        <DataTable data={products} columns={filterableColumns} filterLayout="sidebar" />
      );
      expect(container.querySelector('aside')).toBeInTheDocument();
    });

    it("widens the popover panel past its 320px default to fit a number-range filter's Min/Max inputs", () => {
      render(<DataTable data={products} columns={filterableColumns} />);

      fireEvent.click(screen.getByRole('button', { name: /filters/i }));

      // Popover's own wrapper div and FilterPopover's inner content div share the class
      // name "popoverContent" (untransformed by the identity-obj-proxy CSS module mock
      // used in tests) - walk up from a known-inner element to get FilterPopover's own.
      const widthedPanel = document.querySelector('.filterFieldsList')?.closest('.popoverContent');
      expect(widthedPanel).toHaveStyle({ width: '380px' });
    });

    it('widens the sidebar panel past its 280px default for the same reason', () => {
      const { container } = render(
        <DataTable data={products} columns={filterableColumns} filterLayout="sidebar" />
      );
      expect(container.querySelector('aside')).toHaveStyle({ '--sidebar-width': '340px' });
    });

    it('lets `filterLayoutProps` override the widened default panel width', () => {
      render(
        <DataTable data={products} columns={filterableColumns} filterLayoutProps={{ width: 500 }} />
      );

      fireEvent.click(screen.getByRole('button', { name: /filters/i }));

      const widthedPanel = document.querySelector('.filterFieldsList')?.closest('.popoverContent');
      expect(widthedPanel).toHaveStyle({ width: '500px' });
    });

    it('keeps the search box out of the inline filter fields row, even in "bar" layout', () => {
      const { container } = render(
        <DataTable data={products} columns={filterableColumns} filterLayout="bar" searchable />
      );
      const searchInput = screen.getByPlaceholderText('Search...');
      expect(searchInput.closest('.filterBar')).toBeNull();
      expect(container.querySelector('[data-filter-id="category"]')).toBeInTheDocument();
    });
  });

  describe('table passthrough', () => {
    it('passes selectionMode through to the underlying Table', () => {
      render(<DataTable data={products} columns={plainColumns} selectionMode="multiple" />);
      expect(screen.getAllByRole('checkbox').length).toBeGreaterThan(0);
    });

    it('passes sort props through to the underlying Table', () => {
      const onSortChange = jest.fn();
      const sortableColumns: Array<DataTableColumnConfig<Product>> = [
        { key: 'name', header: 'Name', sortable: true },
      ];
      render(
        <DataTable
          data={products}
          columns={sortableColumns}
          sort={{ column: null, direction: null }}
          onSortChange={onSortChange}
        />
      );
      fireEvent.click(screen.getByText('Name'));
      expect(onSortChange).toHaveBeenCalledWith({ column: 'name', direction: 'asc' });
    });
  });

  describe('server mode', () => {
    it('reports the combined query via onQueryChange instead of filtering locally', () => {
      const onQueryChange = jest.fn();
      render(
        <DataTable
          data={products}
          columns={plainColumns}
          mode="server"
          searchable
          searchQuery="anything"
          filterLayout="none"
          onQueryChange={onQueryChange}
        />
      );

      // server mode does not filter `data` itself, even though the search query is set
      expect(screen.getByText('Widget')).toBeInTheDocument();

      expect(onQueryChange).toHaveBeenCalled();
      const lastQuery = onQueryChange.mock.calls[
        onQueryChange.mock.calls.length - 1
      ][0] as DataTableQuery;
      expect(lastQuery.search).toBe('anything');
    });
  });
});
