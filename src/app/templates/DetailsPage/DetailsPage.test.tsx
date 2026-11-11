import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { LabelsProvider } from '../../../lib/contexts/LabelsContext';
import { NavigationGuardProvider } from '../../../lib/contexts/NavigationGuardContext';
import { AppProvider } from '../../AppProvider';
import type { FieldDef } from '../blocks';
import { DetailsPage, type DetailsPageProps } from './DetailsPage';

const silentLogger = { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() };

interface Order {
  id: string;
  name: string;
  state: 'open' | 'shipped';
  total: number;
}

const ORDER: Order = { id: 'o1', name: 'Order 1042', state: 'open', total: 120 };
const FACTS: Array<FieldDef<Order>> = [{ key: 'total', label: 'Total', kind: 'number' }];

let client: QueryClient;

beforeEach(() => {
  client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
});

afterEach(() => {
  client.clear();
  window.history.replaceState(null, '', '/');
  document.title = '';
});

type Props = Partial<DetailsPageProps<Order>>;

function Harness({ fetcher, ...props }: { fetcher: () => Promise<Order> } & Props) {
  const query = useQuery({ queryKey: ['order'], queryFn: fetcher });
  return (
    <DetailsPage<Order>
      query={query}
      title={(o) => o.name}
      facts={FACTS}
      tabs={[
        {
          value: 'overview',
          label: 'Overview',
          main: <p>overview main</p>,
          side: <p>side info</p>,
        },
        { value: 'history', label: 'History', layout: 'single', main: <p>history main</p> },
      ]}
      {...props}
    />
  );
}

function renderPage(
  url: string,
  fetcher: () => Promise<Order>,
  props: Props = {},
  analytics?: { track: jest.Mock }
) {
  window.history.replaceState(null, '', url);
  return render(
    <LabelsProvider locale="en-US">
      <NavigationGuardProvider>
        <AppProvider queryClient={client} logger={silentLogger} debug={false} analytics={analytics}>
          <Harness fetcher={fetcher} {...props} />
        </AppProvider>
      </NavigationGuardProvider>
    </LabelsProvider>
  );
}

const never = () => new Promise<Order>(() => undefined);

describe('DetailsPage', () => {
  it('renders the structure with a heading skeleton while pending', () => {
    const { container } = renderPage('/', never, {
      breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Orders', href: '/o' }, { label: '…' }],
      actions: [{ id: 'edit', label: 'Edit', variant: 'primary' }],
    });
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(container.querySelector('[data-loadable="heading"]')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument();
  });

  it('shows the loaded title in the h1, document.title, status and facts', async () => {
    renderPage('/', async () => ORDER, {
      status: (o) => ({ label: o.state, tone: 'success' }),
    });
    expect(await screen.findByRole('heading', { level: 1, name: 'Order 1042' })).toBeVisible();
    expect(document.title).toContain('Order 1042');
    expect(screen.getByText('open')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
  });

  it('switches tabs through the URL and labels the panel by its tab', async () => {
    renderPage('/', async () => ORDER);
    await screen.findByText('overview main');
    expect(screen.getByRole('tabpanel', { name: 'Overview' })).toHaveTextContent('overview main');
    fireEvent.click(screen.getByRole('tab', { name: 'History' }));
    expect(new URLSearchParams(window.location.search).get('tab')).toBe('history');
    expect(screen.getByText('history main')).toBeInTheDocument();
    expect(screen.queryByText('overview main')).not.toBeInTheDocument();
    expect(screen.getByRole('tabpanel', { name: 'History' })).toBeInTheDocument();
  });

  it('opens the tab named in the URL', async () => {
    renderPage('/?tab=history', async () => ORDER);
    expect(await screen.findByText('history main')).toBeInTheDocument();
  });

  it('hides the tab bar with a single tab', async () => {
    renderPage('/', async () => ORDER, {
      tabs: [{ value: 'only', label: 'Only', main: <p>only main</p> }],
    });
    expect(await screen.findByText('only main')).toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });

  it('lays out main and side columns, or a single column', async () => {
    renderPage('/', async () => ORDER);
    const panel = await screen.findByRole('tabpanel');
    expect(panel).toHaveAttribute('data-layout', 'main-side');
    expect(within(panel).getByText('side info').closest('aside')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'History' }));
    expect(screen.getByRole('tabpanel')).toHaveAttribute('data-layout', 'single');
  });

  it('shows the not-found state when the predicate matches the error', async () => {
    const notFound = (e: unknown) => (e as { status?: number }).status === 404;
    renderPage(
      '/',
      async () => {
        throw Object.assign(new Error('nope'), { status: 404 });
      },
      { notFound }
    );
    expect(await screen.findByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.queryByText('overview main')).not.toBeInTheDocument();
  });

  it('shows the error state for other errors', async () => {
    renderPage(
      '/',
      async () => {
        throw new Error('boom');
      },
      { notFound: () => false }
    );
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument()
    );
    expect(screen.queryByText('Page Not Found')).not.toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('has exactly one h1 once loaded', async () => {
    renderPage('/', async () => ORDER);
    await screen.findByRole('heading', { level: 1, name: 'Order 1042' });
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('tracks a single page_view across the load', async () => {
    const analytics = { track: jest.fn() };
    renderPage('/', async () => ORDER, {}, analytics);
    await screen.findByRole('heading', { level: 1, name: 'Order 1042' });
    const views = analytics.track.mock.calls.filter(([event]) => event === 'page_view');
    expect(views).toHaveLength(1);
  });

  it('names the page_view with analyticsName', async () => {
    const analytics = { track: jest.fn() };
    renderPage('/', async () => ORDER, { analyticsName: 'order_details' }, analytics);
    await screen.findByRole('heading', { level: 1, name: 'Order 1042' });
    const views = analytics.track.mock.calls.filter(([event]) => event === 'page_view');
    expect(views).toEqual([['page_view', { page: 'order_details' }]]);
  });

  it('names the side column after the tab, or sideLabel', async () => {
    renderPage('/', async () => ORDER);
    expect(await screen.findByRole('complementary', { name: 'Overview' })).toBeInTheDocument();
  });

  it('uses sideLabel and the generic name for a single tab', async () => {
    renderPage('/', async () => ORDER, {
      tabs: [{ value: 'a', label: 'A', main: <p>m</p>, side: <p>s</p> }],
    });
    expect(await screen.findByRole('complementary', { name: 'Details' })).toBeInTheDocument();
  });

  it('renders the fact values once loaded', async () => {
    renderPage('/', async () => ORDER, {
      facts: [
        { key: 'total', label: 'Total', kind: 'number' },
        { key: 'name', label: 'Name', kind: 'text' },
      ],
    });
    expect(await screen.findByText('Order 1042', { selector: 'dd *, dd' })).toBeInTheDocument();
    expect(screen.getByText('Total').nextElementSibling).toHaveTextContent('120');
  });

  it('has no invalid DOM nesting while pending', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    renderPage('/', never);
    const nesting = spy.mock.calls.filter((c) =>
      /validateDOMNesting|cannot be a descendant|cannot contain/.test(String(c[0]))
    );
    spy.mockRestore();
    expect(nesting).toHaveLength(0);
  });
});
