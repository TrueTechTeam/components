import React, { type ReactNode } from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LabelsProvider } from '../../../lib/contexts/LabelsContext';
import { NavigationGuardProvider } from '../../../lib/contexts/NavigationGuardContext';
import { AppProvider } from '../../AppProvider';
import type { QueryLike } from '../../page';
import type { RouterAdapter } from '../../router';
import {
  ActivityTimeline,
  KeyFacts,
  MediaGallery,
  Notes,
  PropertyList,
  RelatedRecords,
  type FieldDef,
} from '.';

const silentLogger = { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() };

const adapter: RouterAdapter = {
  Link: ({ href, children }) => <a href={href}>{children}</a>,
  navigate: jest.fn(),
  pathname: '/',
  searchParams: new URLSearchParams(),
  setSearchParams: jest.fn(),
  supportsBlocking: false,
};

function wrap(ui: ReactNode) {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return render(
    <LabelsProvider locale="en-US">
      <NavigationGuardProvider>
        <QueryClientProvider client={client}>
          <AppProvider router={() => adapter} logger={silentLogger} auth={{ user: null }}>
            {ui}
          </AppProvider>
        </QueryClientProvider>
      </NavigationGuardProvider>
    </LabelsProvider>
  );
}

const query = (patch: Partial<QueryLike>): QueryLike => ({
  isPending: false,
  isError: false,
  error: null,
  isFetching: false,
  data: undefined,
  refetch: jest.fn() as unknown as QueryLike['refetch'],
  dataUpdatedAt: 1,
  ...patch,
});
const pending = query({ isPending: true });
const skeletons = (container: HTMLElement, shape?: string) =>
  container.querySelectorAll(shape ? `[data-loadable="${shape}"]` : '[data-loadable]');

interface Order {
  id: string;
  customer: string;
  total: number;
  note: string | null;
}
const order: Order = { id: 'o1', customer: 'Acme', total: 1234.5, note: null };
const fields: Array<FieldDef<Order>> = [
  { key: 'id', label: 'Order', kind: 'id' },
  { key: 'customer', label: 'Customer', kind: 'text' },
  { key: 'total', label: 'Total', kind: 'currency' },
  { key: 'note', label: 'Note', kind: 'text' },
];
const emptyCfg = { title: 'Nothing to show' };

describe('PropertyList', () => {
  it('renders a definition list using FieldValue formatting', () => {
    wrap(<PropertyList title="Details" fields={fields} data={order} />);
    const dl = document.querySelector('dl') as HTMLElement;
    expect(within(dl).getByText('Customer')).toBeInTheDocument();
    expect(within(dl).getByText('Acme')).toBeInTheDocument();
    expect(within(dl).getByText('$1,234.50')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Details' })).toBeInTheDocument();
  });

  it('reads data from the query when no data prop', () => {
    wrap(<PropertyList fields={fields} query={query({ data: order })} />);
    expect(screen.getByText('Acme')).toBeInTheDocument();
  });

  it('data wins over query.data', () => {
    wrap(
      <PropertyList
        fields={fields}
        data={order}
        query={query({ data: { ...order, customer: 'Other' } })}
      />
    );
    expect(screen.getByText('Acme')).toBeInTheDocument();
  });

  it('shows one label/value skeleton pair per field while pending', () => {
    const { container } = wrap(<PropertyList fields={fields} query={pending} />);
    expect(container.querySelectorAll('dt')).toHaveLength(4);
    expect(skeletons(container, 'text')).toHaveLength(4);
  });

  it('shows the empty state when every field is empty', () => {
    wrap(
      <PropertyList
        fields={[fields[3]]}
        data={order}
        empty={emptyCfg}
        query={query({ data: order })}
      />
    );
    expect(screen.getByText('Nothing to show')).toBeInTheDocument();
  });

  it('shows the empty state for data given without a query', () => {
    wrap(<PropertyList fields={[fields[3]]} data={order} empty={emptyCfg} />);
    expect(screen.getByText('Nothing to show')).toBeInTheDocument();
  });
});

describe('KeyFacts', () => {
  it('renders each fact', () => {
    wrap(<KeyFacts fields={fields.slice(1, 3)} data={order} />);
    expect(screen.getByText('Acme')).toBeInTheDocument();
    expect(screen.getByText('$1,234.50')).toBeInTheDocument();
  });

  it('shows box skeletons while pending', () => {
    const { container } = wrap(<KeyFacts fields={fields.slice(0, 3)} query={pending} />);
    expect(skeletons(container, 'box')).toHaveLength(3);
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('shows the empty state', () => {
    wrap(<KeyFacts fields={[fields[3]]} data={order} empty={emptyCfg} />);
    expect(screen.getByText('Nothing to show')).toBeInTheDocument();
  });
});

describe('ActivityTimeline', () => {
  const now = Date.now();
  const items = [1, 2, 3, 4].map((n) => ({
    id: `a${n}`,
    at: new Date(now - (5 - n) * 3_600_000),
    actor: { name: `User ${n}` },
    text: `Event ${n}`,
  }));

  it('lists newest first in an ordered list with time elements', () => {
    const { container } = wrap(<ActivityTimeline items={items} />);
    const li = within(container.querySelector('ol') as HTMLElement).getAllByRole('listitem');
    expect(li[0]).toHaveTextContent('Event 4');
    expect(li[3]).toHaveTextContent('Event 1');
    expect(container.querySelector('time[datetime]')).not.toBeNull();
  });

  it('collapses beyond limit and expands with Show all', () => {
    wrap(<ActivityTimeline items={items} limit={2} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: /Show all/ }));
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
  });

  it('moves focus to the first revealed item after Show all', () => {
    wrap(<ActivityTimeline items={items} limit={2} />);
    fireEvent.click(screen.getByRole('button', { name: /Show all/ }));
    expect(screen.getAllByRole('listitem')[2]).toHaveFocus();
  });

  it('shows a skeleton while pending', () => {
    const { container } = wrap(<ActivityTimeline query={pending} />);
    expect(skeletons(container)).toHaveLength(1);
    expect(container.querySelector('ol')).toBeNull();
  });

  it('shows the empty state', () => {
    wrap(<ActivityTimeline items={[]} empty={emptyCfg} />);
    expect(screen.getByText('Nothing to show')).toBeInTheDocument();
  });
});

describe('MediaGallery', () => {
  const items = [
    { id: 'm1', src: '/a.png', alt: 'Front view', name: 'front.png', size: 2048 },
    { id: 'm2', src: '/b.png', alt: 'Back view', href: '/files/b.png' },
  ];

  it('renders thumbnails with alt text, names and sizes', () => {
    wrap(<MediaGallery items={items} />);
    expect(screen.getByAltText('Front view')).toHaveAttribute('src', '/a.png');
    expect(screen.getByText('front.png')).toBeInTheDocument();
    expect(screen.getByText('2 kB')).toBeInTheDocument();
    expect(screen.getByAltText('Back view').closest('a')).toHaveAttribute('href', '/files/b.png');
  });

  it('never renders a javascript: href or src; shows the alt text as a placeholder', () => {
    const { container } = wrap(
      <MediaGallery
        items={[
          { id: 'x', src: 'java	script:alert(1)', alt: 'Bad image', href: 'javascript:alert(1)' },
        ]}
      />
    );
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('a')).toBeNull();
    expect(screen.getByText('Bad image')).toBeInTheDocument();
  });

  it('shows a grid of box skeletons while pending', () => {
    const { container } = wrap(<MediaGallery query={pending} />);
    expect(skeletons(container, 'box').length).toBeGreaterThanOrEqual(3);
  });

  it('shows the empty state', () => {
    wrap(<MediaGallery items={[]} empty={emptyCfg} />);
    expect(screen.getByText('Nothing to show')).toBeInTheDocument();
  });
});

describe('Notes', () => {
  const items = [{ id: 'n1', author: 'Ann', at: new Date(), body: 'Call back Monday' }];

  it('renders notes', () => {
    wrap(<Notes items={items} />);
    expect(screen.getByText('Call back Monday')).toBeInTheDocument();
    expect(screen.getByText('Ann')).toBeInTheDocument();
  });

  it('disables Add when empty and posts the trimmed body with inline success', async () => {
    const onAdd = jest.fn().mockResolvedValue(undefined);
    wrap(<Notes items={items} onAdd={onAdd} />);
    const add = screen.getByRole('button', { name: 'Add note' });
    expect(add).toBeDisabled();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '  hello  ' } });
    expect(add).toBeEnabled();
    fireEvent.click(add);
    await waitFor(() => expect(onAdd).toHaveBeenCalledWith('hello'));
    expect(await screen.findByText('Note added.')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('shows an inline error and keeps the text when adding fails', async () => {
    const onAdd = jest.fn().mockRejectedValue(new Error('x'));
    wrap(<Notes items={items} onAdd={onAdd} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hi' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add note' }));
    expect(await screen.findByText('Something went wrong. Please try again.')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('hi');
  });

  it('hides the form when canAdd is false', () => {
    wrap(<Notes items={items} onAdd={jest.fn()} canAdd={false} />);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('shows a skeleton while pending and keeps the form', () => {
    const { container } = wrap(<Notes query={pending} onAdd={jest.fn()} />);
    expect(skeletons(container).length).toBeGreaterThan(0);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('shows the empty state but still the form', () => {
    wrap(<Notes items={[]} onAdd={jest.fn()} empty={emptyCfg} />);
    expect(screen.getByText('Nothing to show')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});

describe('RelatedRecords', () => {
  const rows: Order[] = Array.from({ length: 8 }, (_, i) => ({
    id: `o${i}`,
    customer: `Cust ${i}`,
    total: 10 * (i + 1),
    note: null,
  }));
  const columns = fields.slice(1, 3);

  it('caps at 5 rows and links to View all (total)', () => {
    wrap(<RelatedRecords rows={rows} columns={columns} total={12} viewAllHref="/orders" />);
    expect(screen.getAllByText(/^Cust /)).toHaveLength(5);
    expect(screen.getByText('$10.00')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View all (12)' })).toHaveAttribute('href', '/orders');
  });

  it('links the first column to rowHref', () => {
    wrap(
      <RelatedRecords rows={rows.slice(0, 2)} columns={columns} rowHref={(r) => `/o/${r.id}`} />
    );
    expect(screen.getByRole('link', { name: 'Cust 0' })).toHaveAttribute('href', '/o/o0');
  });

  it('hides View all when everything is shown', () => {
    wrap(<RelatedRecords rows={rows.slice(0, 2)} columns={columns} viewAllHref="/orders" />);
    expect(screen.queryByRole('link', { name: /View all/ })).not.toBeInTheDocument();
  });

  it('shows a table skeleton while pending', () => {
    const { container } = wrap(<RelatedRecords query={pending} columns={columns} />);
    expect(skeletons(container, 'table')).toHaveLength(1);
  });

  it('names the table when there is no title', () => {
    wrap(<RelatedRecords rows={rows.slice(0, 2)} columns={columns} />);
    expect(screen.getByLabelText('Related records')).toBeInTheDocument();
  });

  it('shows the error state when the query failed', () => {
    wrap(
      <RelatedRecords columns={columns} query={query({ isError: true, error: new Error('x') })} />
    );
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.getByTestId('page-messages')).toHaveAttribute('data-state', 'error');
  });

  it('shows the empty state for an empty query result', () => {
    wrap(<RelatedRecords columns={columns} query={query({ data: [] })} empty={emptyCfg} />);
    expect(screen.getByText('Nothing to show')).toBeInTheDocument();
  });

  it('shows the empty state', () => {
    wrap(<RelatedRecords rows={[]} columns={columns} empty={emptyCfg} />);
    expect(screen.getByText('Nothing to show')).toBeInTheDocument();
  });
});
