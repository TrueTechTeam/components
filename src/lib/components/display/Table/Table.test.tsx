import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Table } from './Table';
import type { ColumnConfig } from './types';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
}

const sampleUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'active' },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'Viewer', status: 'pending' },
];

const basicColumns: Array<ColumnConfig<User>> = [
  { key: 'name', header: 'Name', width: '1fr' },
  { key: 'email', header: 'Email', width: '1.5fr' },
  { key: 'role', header: 'Role', width: '100px' },
  { key: 'status', header: 'Status', width: '120px' },
];

describe('Table', () => {
  describe('rendering', () => {
    it('renders with data', () => {
      render(<Table data={sampleUsers} columns={basicColumns} />);
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('renders column headers', () => {
      render(<Table data={sampleUsers} columns={basicColumns} />);
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('renders row data', () => {
      render(<Table data={sampleUsers} columns={basicColumns} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <Table data={sampleUsers} columns={basicColumns} className="custom-table" />
      );
      expect(container.querySelector('.custom-table')).toBeInTheDocument();
    });

    it('renders with aria-label', () => {
      render(<Table data={sampleUsers} columns={basicColumns} aria-label="User table" />);
      expect(screen.getByLabelText('User table')).toBeInTheDocument();
    });

    it('renders with caption', () => {
      render(<Table data={sampleUsers} columns={basicColumns} caption="List of Users" />);
      expect(screen.getByText('List of Users')).toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    it('renders md size by default', () => {
      render(<Table data={sampleUsers} columns={basicColumns} />);
      expect(screen.getByRole('table')).toHaveAttribute('data-size', 'md');
    });

    it('renders sm size', () => {
      render(<Table data={sampleUsers} columns={basicColumns} size="sm" />);
      expect(screen.getByRole('table')).toHaveAttribute('data-size', 'sm');
    });

    it('renders lg size', () => {
      render(<Table data={sampleUsers} columns={basicColumns} size="lg" />);
      expect(screen.getByRole('table')).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('variants', () => {
    it('renders default variant', () => {
      render(<Table data={sampleUsers} columns={basicColumns} variant="default" />);
      expect(screen.getByRole('table')).toHaveAttribute('data-variant', 'default');
    });

    it('renders striped variant', () => {
      render(<Table data={sampleUsers} columns={basicColumns} variant="striped" />);
      expect(screen.getByRole('table')).toHaveAttribute('data-variant', 'striped');
    });

    it('renders bordered variant', () => {
      render(<Table data={sampleUsers} columns={basicColumns} variant="bordered" />);
      expect(screen.getByRole('table')).toHaveAttribute('data-variant', 'bordered');
    });
  });

  describe('selection', () => {
    it('renders with multiple selection mode', () => {
      render(<Table data={sampleUsers} columns={basicColumns} selectionMode="multiple" />);
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    it('calls onSelectionChange when checkbox is clicked', () => {
      const handleSelectionChange = jest.fn();
      render(
        <Table
          data={sampleUsers}
          columns={basicColumns}
          selectionMode="multiple"
          onSelectionChange={handleSelectionChange}
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[1]);
      expect(handleSelectionChange).toHaveBeenCalled();
    });
  });

  describe('expandable rows', () => {
    it('renders expand column when expandedRowRender is provided', () => {
      render(
        <Table
          data={sampleUsers}
          columns={basicColumns}
          expandedRowRender={(row) => <div>Details for {row.name}</div>}
        />
      );

      const expandButtons = screen.getAllByRole('button', { name: /expand/i });
      expect(expandButtons.length).toBeGreaterThan(0);
    });

    it('expands row when expand button is clicked', async () => {
      render(
        <Table
          data={sampleUsers}
          columns={basicColumns}
          expandedRowRender={(row) => <div>Details for {row.name}</div>}
        />
      );

      const expandButtons = screen.getAllByRole('button', { name: /expand/i });
      fireEvent.click(expandButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Details for John Doe')).toBeInTheDocument();
      });
    });
  });

  describe('empty and loading states', () => {
    it('renders empty state when data is empty', () => {
      render(<Table data={[]} columns={basicColumns} />);
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('renders custom empty content', () => {
      render(<Table data={[]} columns={basicColumns} emptyContent="No users found" />);
      expect(screen.getByText('No users found')).toBeInTheDocument();
    });
  });

  describe('sticky header', () => {
    it('sets sticky header attribute when stickyHeader is true', () => {
      render(<Table data={sampleUsers} columns={basicColumns} stickyHeader />);
      expect(screen.getByRole('table')).toHaveAttribute('data-sticky-header', 'true');
    });
  });

  describe('custom column rendering', () => {
    it('renders custom cell content using render function', () => {
      const customColumns: Array<ColumnConfig<User>> = [
        { key: 'name', header: 'Name' },
        {
          key: 'status',
          header: 'Status',
          render: (value) => <span data-testid="custom-status">Status: {String(value)}</span>,
        },
      ];

      render(<Table data={[sampleUsers[0]]} columns={customColumns} />);
      expect(screen.getByTestId('custom-status')).toHaveTextContent('Status: active');
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to table element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Table ref={ref} data={sampleUsers} columns={basicColumns} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('edge cases', () => {
    it('handles empty data array', () => {
      render(<Table data={[]} columns={basicColumns} />);
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('handles single row of data', () => {
      render(<Table data={[sampleUsers[0]]} columns={basicColumns} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('handles data updates correctly', () => {
      const { rerender } = render(<Table data={[sampleUsers[0]]} columns={basicColumns} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();

      rerender(<Table data={[sampleUsers[1]]} columns={basicColumns} />);
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });
});
