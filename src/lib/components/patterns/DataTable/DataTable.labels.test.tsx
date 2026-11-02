import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LabelsProvider } from '../../../contexts/LabelsContext';
import { DataTable } from './DataTable';

const rows = [
  { id: '1', name: 'Widget', inStock: true },
  { id: '2', name: 'Gadget', inStock: false },
];

const withLabels = (labels: Record<string, string>, ui: React.ReactElement) =>
  render(<LabelsProvider labels={labels}>{ui}</LabelsProvider>);

describe('DataTable labels', () => {
  it('DataTable translates the search placeholder', () => {
    withLabels(
      { 'table.searchPlaceholder': 'Chercher' },
      <DataTable data={rows} rowKey="id" columns={[{ key: 'name', header: 'Name' }]} searchable />
    );
    expect(screen.getByPlaceholderText('Chercher')).toBeInTheDocument();
  });

  it('DataTable keeps an explicit search placeholder', () => {
    withLabels(
      { 'table.searchPlaceholder': 'Chercher' },
      <DataTable
        data={rows}
        rowKey="id"
        columns={[{ key: 'name', header: 'Name' }]}
        searchable
        searchPlaceholder="Find"
      />
    );
    expect(screen.getByPlaceholderText('Find')).toBeInTheDocument();
  });

  it('DataTable translates the derived boolean filter options', async () => {
    const user = userEvent.setup();
    withLabels(
      { 'filters.yes': 'Oui', 'filters.no': 'Non', 'filters.title': 'Filtres' },
      <DataTable
        data={rows}
        rowKey="id"
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'inStock', header: 'In Stock', filterable: true },
        ]}
        filterLayout="popover"
      />
    );
    await user.click(screen.getByText('Filtres'));
    await user.click(await screen.findByRole('button', { name: 'In Stock' }));
    expect(await screen.findByText('Oui')).toBeInTheDocument();
    expect(screen.getByText('Non')).toBeInTheDocument();
  });
});
