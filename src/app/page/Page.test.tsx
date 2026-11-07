import React, { StrictMode, useContext, type ReactNode } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { AppProvider, type AppProviderProps, type Logger } from '../AppProvider';
import { PageIdContext } from '../params';
import { Button } from '../../lib/components/buttons/Button';
import { Loadable, Page, usePage, usePageStore, type QueryLike } from './index';

const silentLogger: Logger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

function wrap(ui: ReactNode, props: Partial<AppProviderProps> = {}) {
  return (
    <AppProvider logger={silentLogger} {...props}>
      {ui}
    </AppProvider>
  );
}

function query(overrides: Partial<QueryLike> = {}): QueryLike {
  return {
    isPending: false,
    isError: false,
    error: null,
    isFetching: false,
    data: undefined,
    dataUpdatedAt: 0,
    refetch: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  } as QueryLike;
}

const pending = () => query({ isPending: true, isFetching: true });
const success = (data: unknown) => query({ data, dataUpdatedAt: 1 });

describe('Page', () => {
  afterEach(() => {
    document.title = '';
    document.head.querySelectorAll('meta[name="description"]').forEach((m) => m.remove());
  });

  it('renders its structure while pending, disabled, with Loadable skeletons', () => {
    const rows = jest.fn(() => <p>Order rows</p>);
    const ui = (queries: QueryLike[]) =>
      wrap(
        <Page title="Orders" queries={queries}>
          <h1>Orders</h1>
          <Button>New order</Button>
          <Loadable shape="text" lines={3}>
            {rows}
          </Loadable>
        </Page>
      );
    const { container, rerender } = render(ui([pending()]));

    // Structure renders immediately; native controls are disabled by the busy fieldset.
    expect(screen.getByRole('heading', { level: 1, name: 'Orders' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New order' })).toBeDisabled();
    const region = screen.getByRole('group');
    expect(region.tagName).toBe('FIELDSET');
    expect(region).toHaveAttribute('aria-busy', 'true');
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Loading…');
    // The live region sits outside the busy fieldset, so screen readers speak it.
    expect(region).not.toContainElement(status);
    // Only the data-dependent piece is a skeleton, shaped as 3 text lines, hidden from AT.
    const skeletons = container.querySelectorAll('[data-component="skeleton"]');
    expect(skeletons).toHaveLength(3);
    skeletons.forEach((el) => expect(el.closest('[aria-hidden="true"]')).not.toBeNull());
    expect(rows).not.toHaveBeenCalled();

    rerender(ui([success([1])]));
    expect(screen.getByText('Order rows')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New order' })).toBeEnabled();
    expect(screen.queryByRole('group')).not.toBeInTheDocument();
    // Same element, always mounted: only its text changes, so the change is announced.
    expect(screen.getByRole('status')).toBe(status);
    expect(status).toBeEmptyDOMElement();
    expect(container.querySelector('[aria-busy="true"]')).toBeNull();
    expect(container.querySelector('[data-component="skeleton"]')).toBeNull();
  });

  it('mounts its loading status before the load starts and keeps it afterwards', () => {
    const ui = (queries: QueryLike[]) =>
      wrap(
        <Page title="Orders" queries={queries}>
          <p>Body</p>
        </Page>
      );
    const { rerender } = render(ui([success([1])]));
    const status = screen.getByRole('status');
    expect(status).toBeEmptyDOMElement();
    rerender(ui([pending()]));
    expect(screen.getByRole('status')).toBe(status);
    expect(status).toHaveTextContent('Loading…');
    rerender(ui([success([2])]));
    expect(screen.getByRole('status')).toBe(status);
    expect(status).toBeEmptyDOMElement();
  });

  it('recovers a child that crashed while pending once the data arrives', () => {
    function Rows({ data }: { data?: number[] }) {
      // Reads the data without a guard: throws while pending.
      return <p>Rows: {data!.length}</p>;
    }
    const ui = (q: QueryLike) =>
      wrap(
        <Page title="Orders" queries={[q]}>
          <h1>Orders</h1>
          <Rows data={q.data as number[] | undefined} />
        </Page>
      );
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      const { rerender } = render(ui(pending()));
      // No error flash while loading.
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
      rerender(ui(success([1, 2])));
      expect(screen.getByText('Rows: 2')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
    } finally {
      spy.mockRestore();
    }
  });

  it('still shows the error state for a child that crashes after loading', () => {
    function Broken(): never {
      throw new Error('boom');
    }
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      render(
        wrap(
          <Page title="Orders" queries={[success([1])]}>
            <Broken />
          </Page>
        )
      );
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    } finally {
      spy.mockRestore();
    }
  });

  it('keeps the same child instances when loading finishes (no remount)', () => {
    const mounts = jest.fn();
    function Child() {
      React.useEffect(() => mounts(), []);
      return <p>Child</p>;
    }
    const { rerender } = render(
      wrap(
        <Page title="Orders" queries={[pending()]}>
          <Child />
        </Page>
      )
    );
    rerender(
      wrap(
        <Page title="Orders" queries={[success([1])]}>
          <Child />
        </Page>
      )
    );
    expect(mounts).toHaveBeenCalledTimes(1);
  });

  it('never shows a skeleton when the data is already cached', () => {
    const rows = jest.fn(() => <p>Order rows</p>);
    const { container } = render(
      wrap(
        <Page title="Orders" queries={[success([1])]}>
          <Loadable shape="table">{rows}</Loadable>
        </Page>
      )
    );
    expect(screen.getByText('Order rows')).toBeInTheDocument();
    expect(container.querySelector('[data-component="skeleton"]')).toBeNull();
    expect(container.querySelector('[aria-busy="true"]')).toBeNull();
  });

  it('renders each Loadable shape while pending', () => {
    const { container } = render(
      wrap(
        <Page title="Orders" queries={[pending()]}>
          <Loadable shape="heading">Heading</Loadable>
          <Loadable shape="text" width="12rem">
            Text
          </Loadable>
          <Loadable shape="box" height={80}>
            Box
          </Loadable>
          <Loadable shape="avatar">Avatar</Loadable>
          <Loadable shape="card">Card</Loadable>
          <Loadable shape="table" rows={2} columns={3}>
            Table
          </Loadable>
        </Page>
      )
    );
    const shape = (name: string) => container.querySelector(`[data-loadable="${name}"]`);
    ['heading', 'box', 'avatar', 'card', 'table'].forEach((name) => {
      expect(shape(name)).toHaveAttribute('aria-hidden', 'true');
      expect(shape(name)?.querySelector('[data-component="skeleton"]')).not.toBeNull();
    });
    expect(shape('avatar')?.querySelector('[data-variant="circular"]')).not.toBeNull();
    expect(shape('text')?.firstElementChild).toHaveStyle({ width: '12rem' });
    // Header row + 2 body rows, 3 cells each.
    expect(shape('table')?.querySelectorAll('[data-component="skeleton"]')).toHaveLength(9);
    ['Heading', 'Box', 'Avatar', 'Card', 'Table'].forEach((text) =>
      expect(screen.queryByText(text)).not.toBeInTheDocument()
    );
  });

  it('renders Loadable children directly outside a Page', () => {
    render(wrap(<Loadable>{() => <p>Loaded</p>}</Loadable>));
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });

  it('drives its states from a real useQuery result', async () => {
    let resolve: (rows: string[]) => void = () => undefined;
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    function OrdersPage() {
      const orders = useQuery({
        queryKey: ['orders'],
        queryFn: () => new Promise<string[]>((r) => (resolve = r)),
      });
      return (
        <Page title="Orders" queries={[orders]}>
          <p>{orders.data?.join(', ')}</p>
        </Page>
      );
    }
    render(wrap(<OrdersPage />, { queryClient }));
    expect(screen.getByRole('status')).toHaveTextContent('Loading…');
    await act(async () => resolve(['A-1', 'A-2']));
    expect(await screen.findByText('A-1, A-2')).toBeInTheDocument();
    queryClient.clear();
  });

  it('renders a custom skeleton', () => {
    render(
      wrap(
        <Page title="Orders" queries={[pending()]} skeleton={<p>Custom skeleton</p>}>
          <p>Order list</p>
        </Page>
      )
    );
    expect(screen.getByText('Custom skeleton')).toBeInTheDocument();
    // The override replaces the structure: children are not rendered while pending.
    expect(screen.queryByText('Order list')).not.toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'Loading…' })).toHaveAttribute('aria-busy', 'true');
  });

  it('shows error with retry that refetches every errored query', () => {
    const failedA = query({ isError: true, error: new Error('Orders failed') });
    const failedB = query({ isError: true, error: new Error('Totals failed') });
    const ok = success([1]);
    render(
      wrap(
        <Page title="Orders" queries={[failedA, ok, failedB]}>
          <p>Order list</p>
        </Page>
      )
    );
    expect(screen.queryByText('Order list')).not.toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    // Raw error messages are not shown to end users by default.
    expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
    expect(screen.queryByText('Orders failed')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(failedA.refetch).toHaveBeenCalledTimes(1);
    expect(failedB.refetch).toHaveBeenCalledTimes(1);
    expect(ok.refetch).not.toHaveBeenCalled();
  });

  it('prefers the skeleton over an error while another query is pending', () => {
    render(
      wrap(
        <Page title="Orders" queries={[query({ isError: true, error: 'x' }), pending()]}>
          <p>Order list</p>
        </Page>
      )
    );
    expect(screen.getByRole('status')).toHaveTextContent('Loading…');
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('keeps loaded content with an inline alert when a background refetch fails', () => {
    const stale = query({ isError: true, error: new Error('Server down'), data: [1] });
    const ok = success([2]);
    render(
      wrap(
        <Page title="Orders" queries={[stale, ok]}>
          <p>Order list</p>
        </Page>
      )
    );
    expect(screen.getByText('Order list')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent(
      "Couldn't refresh. Showing the last loaded data."
    );
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(stale.refetch).toHaveBeenCalledTimes(1);
    expect(ok.refetch).not.toHaveBeenCalled();
  });

  it('shows the full error when any errored query has no data, retrying every errored query', () => {
    const stale = query({ isError: true, error: new Error('Stale'), data: [1] });
    const failed = query({ isError: true, error: new Error('No data') });
    render(
      wrap(
        <Page title="Orders" queries={[stale, failed]}>
          <p>Order list</p>
        </Page>
      )
    );
    expect(screen.queryByText('Order list')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(stale.refetch).toHaveBeenCalledTimes(1);
    expect(failed.refetch).toHaveBeenCalledTimes(1);
  });

  it('shows the query error message only with showErrorDetails', () => {
    const failed = query({ isError: true, error: new Error('Orders failed') });
    render(
      wrap(
        <Page title="Orders" queries={[failed]} showErrorDetails>
          <p>Order list</p>
        </Page>
      )
    );
    expect(screen.getByText('Orders failed')).toBeInTheDocument();
  });

  it('shows empty state when isEmpty returns true', () => {
    const isEmpty = jest.fn((data: unknown[]) => (data[0] as unknown[]).length === 0);
    render(
      wrap(
        <Page
          title="Orders"
          queries={[success([])]}
          isEmpty={isEmpty}
          empty={{ title: 'No orders yet' }}
        >
          <p>Order list</p>
        </Page>
      )
    );
    expect(isEmpty).toHaveBeenCalledWith([[]]);
    expect(screen.getByText('No orders yet')).toBeInTheDocument();
    expect(screen.queryByText('Order list')).not.toBeInTheDocument();
  });

  it('does not evaluate isEmpty until every query succeeded', () => {
    const isEmpty = jest.fn(() => true);
    render(
      wrap(
        <Page title="Orders" queries={[pending()]} isEmpty={isEmpty}>
          <p>Order list</p>
        </Page>
      )
    );
    expect(isEmpty).not.toHaveBeenCalled();
  });

  it('renders one hidden h1 with the title in the forbidden state', () => {
    render(
      wrap(
        <Page title="Orders" permission={{ action: 'view' }}>
          <h1>Real heading</h1>
        </Page>,
        { auth: { user: null, can: () => false } }
      )
    );
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent('Orders');
  });

  it('shows forbidden when permission check fails', () => {
    const can = jest.fn((action: string) => action !== 'view');
    render(
      wrap(
        <Page
          title="Orders"
          permission={{ action: 'view', subject: 'orders' }}
          queries={[pending()]}
        >
          <p>Order list</p>
        </Page>,
        { auth: { user: null, can } }
      )
    );
    expect(can).toHaveBeenCalledWith('view', 'orders');
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.queryByText('Order list')).not.toBeInTheDocument();
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument();
  });

  it('keeps content and shows refreshing bar while background fetching', () => {
    const { rerender } = render(
      wrap(
        <Page title="Orders" queries={[query({ data: [1], isFetching: true })]}>
          <p>Order list</p>
        </Page>
      )
    );
    expect(screen.getByText('Order list')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Refreshing…' })).toBeInTheDocument();

    rerender(
      wrap(
        <Page title="Orders" queries={[success([1])]}>
          <p>Order list</p>
        </Page>
      )
    );
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('sets document.title through titleTemplate and restores it on unmount', () => {
    document.title = 'Before';
    const { unmount } = render(
      wrap(
        <Page title="Orders" description="All orders">
          <p>Order list</p>
        </Page>,
        { titleTemplate: (t) => `${t} | Shop` }
      )
    );
    expect(document.title).toBe('Orders | Shop');
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      'All orders'
    );
    unmount();
    expect(document.title).toBe('Before');
    expect(document.querySelector('meta[name="description"]')).toBeNull();
  });

  it('restores an existing description meta on unmount', () => {
    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = 'Site description';
    document.head.appendChild(meta);
    const { unmount } = render(
      wrap(
        <Page title="Orders" description="All orders">
          <p>Order list</p>
        </Page>
      )
    );
    expect(meta).toHaveAttribute('content', 'All orders');
    unmount();
    expect(meta).toHaveAttribute('content', 'Site description');
  });

  it('tracks one page_view on mount', () => {
    const analytics = { track: jest.fn() };
    const { rerender } = render(
      <StrictMode>
        {wrap(
          <Page title="Orders" analyticsName="orders_list">
            <p>Order list</p>
          </Page>,
          { analytics }
        )}
      </StrictMode>
    );
    rerender(
      <StrictMode>
        {wrap(
          <Page title="Orders" analyticsName="orders_list" queries={[success([1])]}>
            <p>Order list</p>
          </Page>,
          { analytics }
        )}
      </StrictMode>
    );
    const views = analytics.track.mock.calls.filter(([event]) => event === 'page_view');
    expect(views).toEqual([['page_view', { page: 'orders_list' }]]);
  });

  it('tracks page_view with the title when no analyticsName is given', () => {
    const analytics = { track: jest.fn() };
    render(
      wrap(
        <Page title="Orders">
          <p>Order list</p>
        </Page>,
        { analytics }
      )
    );
    expect(analytics.track).toHaveBeenCalledWith('page_view', { page: 'Orders' });
  });

  it('provides a page id (slug of the title by default) through usePage and PageIdContext', () => {
    let seen: { id: string; title: string; pageId: string | null } | undefined;
    function Probe() {
      const page = usePage();
      seen = { id: page.id, title: page.title, pageId: useContext(PageIdContext) };
      return null;
    }
    const { rerender } = render(
      wrap(
        <Page title="Open Orders & Returns">
          <Probe />
        </Page>
      )
    );
    expect(seen).toEqual({
      id: 'open-orders-returns',
      title: 'Open Orders & Returns',
      pageId: 'open-orders-returns',
    });
    rerender(
      wrap(
        <Page title="Open Orders & Returns" id="orders">
          <Probe />
        </Page>
      )
    );
    expect(seen?.pageId).toBe('orders');
  });

  it('registers its own queries with the page registry', () => {
    const q = success([1]);
    let queries: Record<string, QueryLike[]> = {};
    function Probe() {
      queries = usePage().queries;
      return null;
    }
    render(
      wrap(
        <Page title="Orders" queries={[q]}>
          <Probe />
        </Page>
      )
    );
    expect(queries).toEqual({ orders: [q] });
  });

  it('usePageStore reads and dispatches the page reducer', () => {
    interface State {
      count: number;
    }
    interface Action {
      type: 'inc';
    }
    const reducer = (state: State, action: Action) =>
      action.type === 'inc' ? { count: state.count + 1 } : state;
    function Counter() {
      const [state, dispatch] = usePageStore<State, Action>();
      return (
        <button type="button" onClick={() => dispatch({ type: 'inc' })}>
          Count {state.count}
        </button>
      );
    }
    render(
      wrap(
        <Page title="Orders" reducer={reducer} initialState={{ count: 0 }}>
          <Counter />
        </Page>
      )
    );
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Count 0' }));
    });
    expect(screen.getByRole('button', { name: 'Count 1' })).toBeInTheDocument();
  });

  it('usePageStore throws a clear error without a page reducer', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const logger: Logger = { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() };
    function Reader() {
      usePageStore();
      return null;
    }
    expect(() =>
      render(
        wrap(
          <Page title="Orders" id="orders">
            <Reader />
          </Page>,
          { logger }
        )
      )
    ).not.toThrow();
    // The page error boundary catches it; the message names the missing reducer.
    expect(jest.mocked(logger.error).mock.calls[0]).toContainEqual(
      expect.objectContaining({
        message: 'usePageStore requires the Page to have a `reducer` prop',
      })
    );
    expect(() => render(<Reader />)).toThrow('usePageStore must be used within a Page');
    spy.mockRestore();
  });

  it('catches a render error in its children, logs it and resets on retry', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const logger: Logger = { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() };
    let shouldThrow = true;
    function Flaky() {
      if (shouldThrow) {
        throw new Error('Render failed');
      }
      return <p>Recovered</p>;
    }
    render(
      wrap(
        <Page title="Orders">
          <Flaky />
        </Page>,
        { logger }
      )
    );
    // Generic text only: the thrown message is logged, never shown (R9).
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
    expect(screen.queryByText(/Render failed/)).not.toBeInTheDocument();
    expect(jest.mocked(logger.error).mock.calls[0]).toContainEqual(
      expect.objectContaining({ message: 'Render failed' })
    );
    expect(logger.error).toHaveBeenCalledTimes(1);
    shouldThrow = false;
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(screen.getByText('Recovered')).toBeInTheDocument();
    spy.mockRestore();
  });

  it('usePage throws outside a Page', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    function Reader() {
      usePage();
      return null;
    }
    expect(() => render(<Reader />)).toThrow('usePage must be used within a Page');
    spy.mockRestore();
  });
});
