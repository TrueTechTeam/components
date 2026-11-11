import React, { useState } from 'react';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import { LabelsProvider } from '../../../lib/contexts/LabelsContext';
import { NavigationGuardProvider } from '../../../lib/contexts/NavigationGuardContext';
import type { FilterDefinition } from '../../../lib/components/filters';
import { Menu, MenuItem, MenuList } from '../../../lib/components/overlays/Menu';
import { AppProvider } from '../../AppProvider';
import type { FieldDef } from '../blocks';
import { DataTablePage, type DataTablePageProps } from './DataTablePage';
import type { TableState } from './useTableState';

const silentLogger = { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() };

interface Issue {
  id: string;
  title: string;
  status: 'open' | 'closed';
  points: number;
}

const ALL: Issue[] = Array.from({ length: 23 }, (_, i) => ({
  id: `ISS-${i + 1}`,
  title: `Issue ${i + 1}`,
  status: i % 2 === 0 ? 'open' : 'closed',
  points: i + 1,
}));

/** A fake server: search on title, `status` filter, sort and paging. */
function createServer(items: Issue[] = ALL) {
  const fetch = jest.fn(async (state: TableState) => {
    let rows = items.filter((r) => r.title.toLowerCase().includes(state.search.toLowerCase()));
    const status = state.filters.status;
    if (typeof status === 'string' && status) {
      rows = rows.filter((r) => r.status === status);
    }
    if (state.sort) {
      const { key, direction } = state.sort;
      rows = [...rows].sort((a, b) => {
        const x = a[key as keyof Issue];
        const y = b[key as keyof Issue];
        const cmp = x < y ? -1 : x > y ? 1 : 0;
        return direction === 'asc' ? cmp : -cmp;
      });
    }
    const start = (state.page - 1) * state.pageSize;
    return { rows: rows.slice(start, start + state.pageSize), total: rows.length };
  });
  return fetch;
}

const columns: Array<FieldDef<Issue> & { sortable?: boolean }> = [
  { key: 'title', label: 'Title', kind: 'text', sortable: true },
  {
    key: 'status',
    label: 'Status',
    kind: 'status',
    statusTones: { open: 'info', closed: 'neutral' },
  },
  { key: 'points', label: 'Points', kind: 'number', sortable: true },
];

const filters: FilterDefinition[] = [
  {
    id: 'status',
    type: 'select',
    label: 'Status',
    options: [
      { value: 'open', label: 'Open' },
      { value: 'closed', label: 'Closed' },
    ],
  },
];

function mockViewport(width: number) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => {
      const m = /min-width:\s*(\d+)px/.exec(query);
      return {
        matches: m ? width >= Number(m[1]) : false,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };
    },
  });
}

const originalMatchMedia = window.matchMedia;
let client: QueryClient;
/** A `window.confirm` spy, restored after each test even when the test fails. */
let confirmSpy: jest.SpyInstance | undefined;

function mockConfirm(answer: boolean) {
  confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(answer);
  return confirmSpy;
}

beforeEach(() => {
  mockViewport(1280);
  client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
});

afterEach(() => {
  confirmSpy?.mockRestore();
  confirmSpy = undefined;
  Object.defineProperty(window, 'matchMedia', { writable: true, value: originalMatchMedia });
  client.clear();
  window.history.replaceState(null, '', '/');
});

const params = () => new URLSearchParams(window.location.search);

function setup(
  url: string,
  props: Partial<DataTablePageProps<Issue>> = {},
  fetch = createServer()
) {
  window.history.replaceState(null, '', url);
  const ui = (
    <LabelsProvider locale="en-US">
      <NavigationGuardProvider>
        <AppProvider queryClient={client} logger={silentLogger} debug={false}>
          <DataTablePage<Issue>
            title="Issues"
            columns={columns}
            rowKey={(row) => row.id}
            queryOptions={(state) => ({
              queryKey: [
                'issues',
                state.page,
                state.pageSize,
                state.sort,
                state.search,
                state.filters,
              ],
              queryFn: () => fetch(state),
            })}
            filters={filters}
            create={{ label: 'New issue', onClick: jest.fn() }}
            detail={{
              title: (id) => `Issue ${id}`,
              render: (id) => <p>Details of {id}</p>,
              fullPageHref: (id) => `/issues/${id}`,
            }}
            {...props}
          />
        </AppProvider>
      </NavigationGuardProvider>
    </LabelsProvider>
  );
  const result = render(ui);
  return { ...result, fetch };
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** A server that answers after `ms`, so placeholder states are observable. */
function slowServer(ms = 40) {
  const server = createServer();
  return jest.fn(async (state: TableState) => {
    await delay(ms);
    return server(state);
  });
}

/** Records whether `text` was ever in the document while observing. */
function watchFor(text: string) {
  const state = { seen: false };
  const check = () => {
    if (document.body.textContent?.includes(text)) {
      state.seen = true;
    }
  };
  const observer = new MutationObserver(check);
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  return {
    seen: () => {
      check();
      observer.disconnect();
      return state.seen;
    },
  };
}

function NestedMenu() {
  const [open, setOpen] = useState(false);
  return (
    <Menu isOpen={open} onOpenChange={setOpen} trigger={<button type="button">More</button>}>
      <MenuList>
        <MenuItem itemKey="archive">Archive</MenuItem>
      </MenuList>
    </Menu>
  );
}

const rowsShown = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[0].textContent);

describe('DataTablePage', () => {
  it('renders header and toolbar while loading with a table-shaped skeleton', () => {
    const never = jest.fn(() => new Promise<{ rows: Issue[]; total: number }>(() => undefined));
    const { container } = setup('/issues', {
      queryOptions: () => ({ queryKey: ['never'], queryFn: never }),
    });
    expect(screen.getByRole('heading', { level: 1, name: 'Issues' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'New issue' })).toBeDisabled();
    const skeleton = container.querySelector('[data-loadable="table"]');
    expect(skeleton).not.toBeNull();
    // Header row + 10 body rows (page size 10), three columns each.
    expect(skeleton!.querySelectorAll('[data-component="skeleton"]')).toHaveLength(11 * 3);
  });

  it('writes page, size, sort, search, filters and view to the URL and restores them on mount', async () => {
    const { fetch, unmount } = setup('/issues', { views: ['table', 'grid'] });
    await screen.findByText('Issue 1');

    const next = screen.getByRole('button', { name: 'Go to next page' });
    fireEvent.click(next);
    await waitFor(() => expect(params().get('page')).toBe('2'));
    // The pagination stays mounted while the next page loads.
    expect(next).toBeInTheDocument();
    await screen.findByText('Issue 11');

    fireEvent.click(screen.getByRole('columnheader', { name: /Points/ }));
    await waitFor(() => expect(params().get('sort')).toBe('points:asc'));

    fireEvent.click(screen.getByRole('button', { name: 'Rows per page' }));
    fireEvent.click(await screen.findByRole('menuitem', { name: '25' }));
    await waitFor(() => expect(params().get('size')).toBe('25'));

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'issue 2' } });
    await waitFor(() => expect(params().get('q')).toBe('issue 2'));

    fireEvent.click(screen.getByRole('radio', { name: 'Grid' }));
    await waitFor(() => expect(params().get('view')).toBe('grid'));
    unmount();

    // Restore from a URL holding every param.
    fetch.mockClear();
    const url =
      '/issues?page=2&size=25&sort=points%3Adesc&q=issue&f=%7B%22status%22%3A%22open%22%7D&view=table';
    setup(url, { views: ['table', 'grid'] }, fetch);
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(fetch.mock.calls[0][0]).toMatchObject({
      page: 2,
      pageSize: 25,
      sort: { key: 'points', direction: 'desc' },
      search: 'issue',
      filters: { status: 'open' },
      view: 'table',
    });
    expect(screen.getByRole('searchbox')).toHaveValue('issue');
    expect(screen.getByRole('button', { name: 'Remove Status filter' })).toBeInTheDocument();
  });

  it('resets page to 1 when search or filters change', async () => {
    setup('/issues?page=2&f=%7B%22status%22%3A%22open%22%7D');
    await screen.findByText('Issue 21');
    fireEvent.click(screen.getByRole('button', { name: 'Remove Status filter' }));
    await waitFor(() => expect(params().get('f')).toBeNull());
    expect(params().get('page')).toBeNull();

    window.history.replaceState(null, '', '/issues?page=2');
    act(() => window.dispatchEvent(new PopStateEvent('popstate')));
    await screen.findByText('Issue 11');
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Issue 1' } });
    await waitFor(() => expect(params().get('q')).toBe('Issue 1'));
    expect(params().get('page')).toBeNull();
  });

  it('clamps ?page=99 to the last page instead of showing an empty state', async () => {
    setup('/issues?page=99');
    await waitFor(() => expect(params().get('page')).toBe('3'));
    await screen.findByText('Issue 21');
    expect(rowsShown()).toEqual(['Issue 21', 'Issue 22', 'Issue 23']);
    expect(screen.queryByText('Nothing here yet')).not.toBeInTheDocument();
    expect(screen.queryByText('No results')).not.toBeInTheDocument();
  });

  it('never shows an empty table while clamping a page past the end', async () => {
    const empty = watchFor('No data available');
    setup('/issues?page=99', {}, slowServer());
    await screen.findByText('Issue 21');
    expect(params().get('page')).toBe('3');
    expect(empty.seen()).toBe(false);
    expect(screen.getByText('21–23 of 23')).toHaveAttribute('role', 'status');
  });

  it('keeps the range text of the rows shown while the next page loads', async () => {
    setup('/issues', {}, slowServer());
    await screen.findByText('1–10 of 23');
    fireEvent.click(screen.getByRole('button', { name: 'Go to next page' }));
    await waitFor(() => expect(params().get('page')).toBe('2'));
    // Page 1 rows are still shown, so the range still describes them.
    expect(screen.getByText('Issue 1')).toBeInTheDocument();
    expect(screen.getByText('1–10 of 23')).toBeInTheDocument();
    expect(await screen.findByText('11–20 of 23')).toBeInTheDocument();
  });

  it('shows "nothing yet" with the create action for an empty collection', async () => {
    const onCreate = jest.fn();
    setup(
      '/issues',
      { create: { label: 'New issue', onClick: onCreate }, emptyTitle: 'No issues yet' },
      createServer([])
    );
    expect(await screen.findByText('No issues yet')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    const buttons = screen.getAllByRole('button', { name: 'New issue' });
    // Header primary action + empty-state action.
    expect(buttons).toHaveLength(2);
    fireEvent.click(buttons[1]);
    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  it('shows "No results" with Clear all when search/filters match nothing; Clear all resets them', async () => {
    const server = createServer();
    const slow = jest.fn(async (state: TableState) => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return server(state);
    });
    setup('/issues?page=2&q=zzz&f=%7B%22status%22%3A%22open%22%7D', {}, slow);
    expect(await screen.findByText('No results')).toBeInTheDocument();
    expect(screen.queryByText('Nothing here yet')).not.toBeInTheDocument();
    const clear = within(screen.getByTestId('data-table-page-no-results')).getByRole('button', {
      name: 'Clear all',
    });
    fireEvent.click(clear);
    await waitFor(() => expect(window.location.search).toBe(''));
    // The previous (empty) result is not mistaken for an empty collection while refetching.
    expect(screen.queryByText('Nothing here yet')).not.toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toBeEnabled();
    await screen.findByText('Issue 1');
    expect(screen.getByRole('searchbox')).toHaveValue('');
  });

  it('opens the detail panel from a row click, writes ?selected=, closes with Escape and restores focus', async () => {
    setup('/issues');
    await screen.findByText('Issue 3');
    const row = screen.getByText('Issue 3').closest('[role="row"]') as HTMLElement;
    // A click anywhere on the row (here: the points cell).
    fireEvent.click(within(row).getByText('3'));
    await waitFor(() => expect(params().get('selected')).toBe('ISS-3'));

    const panel = screen.getByRole('complementary', { name: 'Issue ISS-3' });
    expect(within(panel).getByText('Details of ISS-3')).toBeInTheDocument();
    expect(within(row).getByRole('button', { name: 'Issue 3' })).toHaveAttribute(
      'aria-current',
      'true'
    );
    expect(within(panel).getByRole('link', { name: 'Open full page' })).toHaveAttribute(
      'href',
      '/issues/ISS-3'
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(panel).toContainElement(document.activeElement as HTMLElement));

    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'Escape' });
    await waitFor(() => expect(params().get('selected')).toBeNull());
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
    expect(document.activeElement).toBe(within(row).getByRole('button', { name: 'Issue 3' }));

    // The first cell is a keyboard-reachable button that opens the same detail.
    fireEvent.click(within(row).getByRole('button', { name: 'Issue 3' }));
    await waitFor(() => expect(params().get('selected')).toBe('ISS-3'));
    fireEvent.click(screen.getByRole('button', { name: 'Close details' }));
    await waitFor(() => expect(params().get('selected')).toBeNull());
  });

  it('opens the detail from a deep link ?selected=<id> even when the row is not on the page', async () => {
    setup('/issues?selected=ISS-999');
    await screen.findByText('Issue 1');
    const panel = screen.getByRole('complementary', { name: 'Issue ISS-999' });
    expect(within(panel).getByText('Details of ISS-999')).toBeInTheDocument();
    // A deep link does not steal focus on load.
    expect(panel).not.toContainElement(document.activeElement as HTMLElement);
    // ISS-999 has no row here: closing focuses the content region instead.
    fireEvent.click(within(panel).getByRole('button', { name: 'Close details' }));
    await waitFor(() => expect(params().get('selected')).toBeNull());
    expect(document.activeElement).toContainElement(screen.getByRole('table'));
  });

  it('closes the detail with Back: opening it adds a history entry', async () => {
    setup('/issues');
    await screen.findByText('Issue 3');
    fireEvent.click(screen.getByRole('button', { name: 'Issue 3' }));
    await waitFor(() => expect(params().get('selected')).toBe('ISS-3'));
    act(() => window.history.back());
    await waitFor(() => expect(params().get('selected')).toBeNull());
    await waitFor(() => expect(screen.queryByRole('complementary')).not.toBeInTheDocument());
  });

  it('Escape in an overlay inside the detail closes the overlay, not the panel', async () => {
    setup('/issues?selected=ISS-2', {
      detail: { title: (id) => `Issue ${id}`, render: () => <NestedMenu /> },
    });
    const panel = await screen.findByRole('complementary', { name: 'Issue ISS-2' });
    fireEvent.click(within(panel).getByRole('button', { name: 'More' }));
    const item = await screen.findByRole('menuitem', { name: 'Archive' });
    expect(panel).not.toContainElement(item);
    fireEvent.keyDown(item, { key: 'Escape' });
    await waitFor(() =>
      expect(screen.queryByRole('menuitem', { name: 'Archive' })).not.toBeInTheDocument()
    );
    expect(screen.getByRole('complementary', { name: 'Issue ISS-2' })).toBeInTheDocument();
    expect(params().get('selected')).toBe('ISS-2');
  });

  it('uses a full-screen dialog for details below laptop', async () => {
    mockViewport(800);
    setup('/issues');
    await screen.findByText('Issue 2');
    fireEvent.click(screen.getByRole('button', { name: 'Issue 2' }));
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveAttribute('data-size', 'full');
    expect(within(dialog).getByText('Details of ISS-2')).toBeInTheDocument();
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });

  it('keeps a link in a default card field clickable without opening the detail', async () => {
    setup('/issues?view=grid', {
      views: ['table', 'grid'],
      columns: [
        ...columns,
        {
          key: 'id',
          label: 'Link',
          kind: 'url',
          get: (row) => `https://${row.id.toLowerCase()}.example.com/`,
        },
      ],
    });
    await screen.findByText('Issue 1');
    const link = screen.getByRole('link', { name: 'iss-1.example.com' });
    // The link sits in the field, outside the stretched open-details control.
    expect(screen.getByRole('button', { name: 'Issue 1' })).not.toContainElement(link);
    fireEvent.click(link);
    expect(params().get('selected')).toBeNull();
  });

  it('runs a row action with confirm and shows a success toast, then refetches', async () => {
    const run = jest.fn().mockResolvedValue(undefined);
    const confirm = mockConfirm(true);
    const hidden = jest.fn();
    const { fetch } = setup('/issues', {
      rowActions: [
        {
          id: 'close',
          label: 'Close issue',
          confirm: 'Close this issue?',
          run,
          success: 'Issue closed',
        },
        {
          id: 'delete',
          label: 'Delete',
          danger: true,
          run: hidden,
          permission: { action: 'delete', subject: 'Issue' },
        },
      ],
    });
    await screen.findByText('Issue 1');
    // Page 2 is cached too; the action makes every page of the collection stale.
    fireEvent.click(screen.getByRole('button', { name: 'Go to next page' }));
    await screen.findByText('Issue 11');
    fireEvent.click(screen.getByRole('button', { name: 'Go to previous page' }));
    await screen.findByText('Issue 1');
    const calls = fetch.mock.calls.length;
    // Each trigger names its row; the column header keeps the generic label.
    expect(screen.getByRole('columnheader', { name: 'Row actions' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Row actions for Issue 2' })).toBeInTheDocument();
    const row = screen.getByText('Issue 1').closest('[role="row"]') as HTMLElement;
    fireEvent.click(within(row).getByRole('button', { name: 'Row actions for Issue 1' }));
    expect(await screen.findByRole('menuitem', { name: 'Delete' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Close issue' }));

    expect(confirm).toHaveBeenCalledWith('Close this issue?');
    await waitFor(() => expect(run).toHaveBeenCalledWith(ALL[0]));
    expect(await screen.findByText('Issue closed')).toBeInTheDocument();
    await waitFor(() => expect(fetch.mock.calls.length).toBeGreaterThan(calls));
    const page2 = client.getQueryCache().findAll({ queryKey: ['issues', 2] });
    expect(page2.length).toBeGreaterThan(0);
    page2.forEach((q) => expect(q.state.isInvalidated).toBe(true));
    // The row click underneath the menu did not open the detail.
    expect(params().get('selected')).toBeNull();
  });

  it('hides permission-gated row actions and skips a declined confirm', async () => {
    const run = jest.fn().mockResolvedValue(undefined);
    const confirm = mockConfirm(false);
    window.history.replaceState(null, '', '/issues');
    const fetch = createServer();
    render(
      <LabelsProvider locale="en-US">
        <NavigationGuardProvider>
          <AppProvider
            queryClient={client}
            logger={silentLogger}
            debug={false}
            auth={{ user: null, can: (action) => action !== 'delete' }}
          >
            <DataTablePage<Issue>
              title="Issues"
              columns={columns}
              rowKey={(row) => row.id}
              queryOptions={(state) => ({
                queryKey: ['issues', state.page],
                queryFn: () => fetch(state),
              })}
              rowActions={[
                { id: 'close', label: 'Close issue', confirm: 'Sure?', run },
                {
                  id: 'delete',
                  label: 'Delete',
                  run,
                  permission: { action: 'delete', subject: 'Issue' },
                },
              ]}
            />
          </AppProvider>
        </NavigationGuardProvider>
      </LabelsProvider>
    );
    await screen.findByText('Issue 1');
    const row = screen.getByText('Issue 1').closest('[role="row"]') as HTMLElement;
    fireEvent.click(within(row).getByRole('button', { name: 'Row actions for Issue 1' }));
    fireEvent.click(await screen.findByRole('menuitem', { name: 'Close issue' }));
    expect(screen.queryByRole('menuitem', { name: 'Delete' })).not.toBeInTheDocument();
    expect(confirm).toHaveBeenCalledWith('Sure?');
    expect(run).not.toHaveBeenCalled();
  });

  it('disables a row action while it runs', async () => {
    let finish: () => void = () => undefined;
    const run = jest.fn(() => new Promise<void>((resolve) => (finish = resolve)));
    setup('/issues', { rowActions: [{ id: 'close', label: 'Close issue', run }] });
    await screen.findByText('Issue 1');
    const trigger = screen.getByRole('button', { name: 'Row actions for Issue 1' });
    fireEvent.click(trigger);
    fireEvent.click(await screen.findByRole('menuitem', { name: 'Close issue' }));
    await waitFor(() => expect(run).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(screen.queryByRole('menuitem', { name: 'Close issue' })).not.toBeInTheDocument()
    );
    fireEvent.click(trigger);
    const item = await screen.findByRole('menuitem', { name: 'Close issue' });
    expect(item).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(item);
    expect(run).toHaveBeenCalledTimes(1);
    await act(async () => finish());
    await screen.findByText('Done.');
  });

  it('grid view renders renderCard for each row', async () => {
    setup('/issues?view=grid', {
      views: ['table', 'grid'],
      renderCard: (row) => <div data-testid="card">{row.title}</div>,
    });
    await screen.findByText('Issue 1');
    expect(screen.getAllByTestId('card')).toHaveLength(10);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    // The card stays normal content; a dedicated control opens the detail.
    expect(screen.getByText('Issue 4').closest('button')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Open details for Issue 4' }));
    await waitFor(() => expect(params().get('selected')).toBe('ISS-4'));
    expect(screen.getByRole('button', { name: 'Open details for Issue 4' })).toHaveAttribute(
      'aria-current',
      'true'
    );
  });

  it('default cards make the title the control and keep the fields as content', async () => {
    setup('/issues?view=grid', { views: ['table', 'grid'] });
    await screen.findByText('Issue 1');
    const title = screen.getByRole('button', { name: 'Issue 4' });
    const card = title.closest('li') as HTMLElement;
    expect(within(card).getByText('Points').closest('button')).toBeNull();
    fireEvent.click(title);
    await waitFor(() => expect(params().get('selected')).toBe('ISS-4'));
  });
});
