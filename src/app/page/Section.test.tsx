import React, { StrictMode, type ReactNode } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { AppProvider, type AppProviderProps, type Logger } from '../AppProvider';
import { Page, Section, usePage, type QueryLike } from './index';

function makeLogger(): Logger {
  return { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() };
}

function wrap(ui: ReactNode, props: Partial<AppProviderProps> = {}) {
  return (
    <AppProvider logger={makeLogger()} {...props}>
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

describe('Section', () => {
  it('renders a labelled section with its heading level', () => {
    render(
      wrap(
        <Page title="Orders">
          <Section title="Recent" headingLevel={3}>
            <p>Recent orders</p>
          </Section>
        </Page>
      )
    );
    const region = screen.getByRole('region', { name: 'Recent' });
    expect(region.tagName).toBe('SECTION');
    expect(within(region).getByRole('heading', { level: 3, name: 'Recent' })).toBeInTheDocument();
    expect(within(region).getByText('Recent orders')).toBeInTheDocument();
  });

  it('defaults to an h2 heading and renders no heading without a title', () => {
    render(
      wrap(
        <Page title="Orders">
          <Section title="Recent">
            <p>Recent orders</p>
          </Section>
          <Section>
            <p>Untitled</p>
          </Section>
        </Page>
      )
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Recent' })).toBeInTheDocument();
    const untitled = screen.getByText('Untitled').closest('section');
    expect(untitled).not.toHaveAttribute('aria-labelledby');
  });

  it('shows the query error message only with showErrorDetails', () => {
    const failed = query({ isError: true, error: new Error('Totals failed') });
    render(
      wrap(
        <Page title="Orders">
          <Section title="Failed" queries={[failed]} showErrorDetails>
            <p>Failed content</p>
          </Section>
        </Page>
      )
    );
    expect(screen.getByText('Totals failed')).toBeInTheDocument();
  });

  it('shows its own skeleton, error and empty states while the page keeps rendering', () => {
    const failed = query({ isError: true, error: new Error('Totals failed') });
    render(
      wrap(
        <Page title="Orders">
          <p>Page content</p>
          <Section title="Pending" queries={[query({ isPending: true })]}>
            <p>Pending content</p>
          </Section>
          <Section title="Failed" queries={[failed]}>
            <p>Failed content</p>
          </Section>
          <Section
            title="Empty"
            queries={[query({ data: [] })]}
            isEmpty={([rows]) => (rows as unknown[]).length === 0}
          >
            <p>Empty content</p>
          </Section>
        </Page>
      )
    );
    expect(screen.getByText('Page content')).toBeInTheDocument();

    const pendingRegion = screen.getByRole('region', { name: 'Pending' });
    expect(within(pendingRegion).getByRole('status', { name: 'Loading…' })).toBeInTheDocument();
    expect(within(pendingRegion).queryByText('Pending content')).not.toBeInTheDocument();

    const failedRegion = screen.getByRole('region', { name: 'Failed' });
    expect(within(failedRegion).getByText('Something went wrong')).toBeInTheDocument();
    expect(within(failedRegion).queryByText('Totals failed')).not.toBeInTheDocument();
    expect(within(failedRegion).getByTestId('page-messages').getAttribute('data-size')).toBe('sm');
    fireEvent.click(within(failedRegion).getByRole('button', { name: /try again/i }));
    expect(failed.refetch).toHaveBeenCalledTimes(1);

    const emptyRegion = screen.getByRole('region', { name: 'Empty' });
    expect(within(emptyRegion).getByText('No Data')).toBeInTheDocument();
  });

  it('keeps its content with an inline alert when a background refetch fails', () => {
    const stale = query({ isError: true, error: new Error('Server down'), data: [1] });
    render(
      wrap(
        <Page title="Orders">
          <Section title="Totals" queries={[stale]}>
            <p>Totals table</p>
          </Section>
        </Page>
      )
    );
    const region = screen.getByRole('region', { name: 'Totals' });
    expect(within(region).getByText('Totals table')).toBeInTheDocument();
    expect(within(region).getByRole('alert')).toHaveTextContent(
      "Couldn't refresh. Showing the last loaded data."
    );
    fireEvent.click(within(region).getByRole('button', { name: 'Retry' }));
    expect(stale.refetch).toHaveBeenCalledTimes(1);
  });

  it('uses the next heading level for state messages under a titled section', () => {
    render(
      wrap(
        <Page title="Orders">
          <Section title="Deep" headingLevel={4} queries={[query({ isError: true, error: 'x' })]}>
            <p>Hidden</p>
          </Section>
          <Section headingLevel={3} queries={[query({ isError: true, error: 'y' })]}>
            <p>Hidden</p>
          </Section>
        </Page>
      )
    );
    expect(
      screen.getByRole('heading', { level: 5, name: 'Something went wrong' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Something went wrong' })
    ).toBeInTheDocument();
  });

  it('shows forbidden when its permission check fails', () => {
    render(
      wrap(
        <Page title="Orders">
          <Section title="Admin" permission={{ action: 'admin' }}>
            <p>Secret</p>
          </Section>
        </Page>,
        { auth: { user: null, can: (action) => action !== 'admin' } }
      )
    );
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.queryByText('Secret')).not.toBeInTheDocument();
  });

  it('a throwing Section shows its own error while sibling Sections and the Page render; logger.error called once', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const logger = makeLogger();
    const boom = new Error('Chart exploded');
    let shouldThrow = true;
    function Chart(): React.JSX.Element {
      if (shouldThrow) {
        throw boom;
      }
      return <p>Chart drawn</p>;
    }
    render(
      <StrictMode>
        <AppProvider logger={logger}>
          <Page title="Dashboard">
            <p>Page header</p>
            <Section title="Revenue">
              <Chart />
            </Section>
            <Section title="Customers">
              <p>Customer table</p>
            </Section>
          </Page>
        </AppProvider>
      </StrictMode>
    );

    expect(screen.getByText('Page header')).toBeInTheDocument();
    expect(screen.getByText('Customer table')).toBeInTheDocument();
    const revenue = screen.getByRole('region', { name: 'Revenue' });
    // Generic text only: the thrown message is logged, never shown (R9).
    expect(within(revenue).getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.queryByText(/Chart exploded/)).not.toBeInTheDocument();
    // The message title nests under the section's h2.
    expect(
      within(revenue).getByRole('heading', { level: 3, name: 'Something went wrong' })
    ).toBeInTheDocument();
    expect(within(revenue).getByTestId('page-messages').getAttribute('data-size')).toBe('sm');

    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(jest.mocked(logger.error).mock.calls[0]).toContain(boom);

    shouldThrow = false;
    fireEvent.click(within(revenue).getByRole('button', { name: /try again/i }));
    expect(within(revenue).getByText('Chart drawn')).toBeInTheDocument();
    expect(logger.error).toHaveBeenCalledTimes(1);
    consoleSpy.mockRestore();
  });

  it('registers its queries with the page and unregisters on unmount', () => {
    const q = query({ data: [1] });
    let queries: Record<string, QueryLike[]> = {};
    function Probe() {
      queries = usePage().queries;
      return null;
    }
    const { rerender } = render(
      wrap(
        <Page title="Orders">
          <Probe />
          <Section id="totals" queries={[q]}>
            <p>Totals</p>
          </Section>
        </Page>
      )
    );
    expect(queries).toEqual({ totals: [q] });
    rerender(
      wrap(
        <Page title="Orders">
          <Probe />
        </Page>
      )
    );
    expect(queries).toEqual({});
  });

  it('does not loop when a page consumer re-creates equal query objects every render', () => {
    let renders = 0;
    function Body() {
      usePage();
      renders += 1;
      // A fresh query object with freshly derived data every render.
      const q = query({ data: [1], refetch: jest.fn() });
      return (
        <Section id="body" queries={[q]}>
          <p>Body</p>
        </Section>
      );
    }
    render(
      wrap(
        <Page title="Orders">
          <Body />
        </Page>
      )
    );
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(renders).toBeLessThan(5);
  });

  it('renders outside a Page', () => {
    render(
      wrap(
        <Section title="Standalone">
          <p>Alone</p>
        </Section>
      )
    );
    expect(screen.getByText('Alone')).toBeInTheDocument();
  });
});
