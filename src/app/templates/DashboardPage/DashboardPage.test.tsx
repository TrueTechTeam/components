import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { LabelsProvider } from '../../../lib/contexts/LabelsContext';
import { NavigationGuardProvider } from '../../../lib/contexts/NavigationGuardContext';
import { AppProvider } from '../../AppProvider';
import { ChartWidget } from './ChartWidget';
import { DashboardPage, useTimeRange, type DashboardPageProps } from './DashboardPage';
import { DashboardWidget } from './DashboardWidget';
import { KpiWidget } from './KpiWidget';

const silentLogger = { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() };

let client: QueryClient;

beforeEach(() => {
  client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
});

afterEach(() => {
  client.clear();
  window.history.replaceState(null, '', '/');
});

function renderDashboard(url: string, props: Partial<DashboardPageProps> = {}) {
  window.history.replaceState(null, '', url);
  return render(
    <LabelsProvider locale="en-US">
      <NavigationGuardProvider>
        <AppProvider queryClient={client} logger={silentLogger} debug={false}>
          <DashboardPage title="Overview" {...props} />
        </AppProvider>
      </NavigationGuardProvider>
    </LabelsProvider>
  );
}

function Revenue({ fetcher }: { fetcher: () => Promise<number> }) {
  const query = useQuery({ queryKey: ['dash', 'revenue'], queryFn: fetcher });
  return (
    <KpiWidget
      label="Revenue"
      query={query}
      kind="currency"
      value={() => query.data}
      delta={() => ({ value: 12, direction: 'up', good: true })}
    />
  );
}

function RangeProbe() {
  const [range] = useTimeRange();
  return <p>probe:{range}</p>;
}

describe('DashboardPage', () => {
  it('reads the range from the URL and writes it on change', () => {
    renderDashboard('/?range=7d', { primary: <RangeProbe /> });
    expect(screen.getByText('probe:7d')).toBeInTheDocument();
    const group = screen.getByRole('radiogroup', { name: 'Time range' });
    expect(within(group).getByRole('radio', { name: '7d' })).toHaveAttribute(
      'aria-checked',
      'true'
    );
    fireEvent.click(within(group).getByRole('radio', { name: '90d' }));
    expect(new URLSearchParams(window.location.search).get('range')).toBe('90d');
    expect(screen.getByText('probe:90d')).toBeInTheDocument();
  });

  it('uses the default range for an unknown value', () => {
    renderDashboard('/?range=bogus');
    expect(screen.getByRole('radio', { name: '30d' })).toHaveAttribute('aria-checked', 'true');
  });

  it('shares the effective range with widgets when the URL value is not offered', () => {
    renderDashboard('/?range=ytd', { ranges: ['7d', '30d'], primary: <RangeProbe /> });
    expect(screen.getByText('probe:30d')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '30d' })).toHaveAttribute('aria-checked', 'true');
  });

  it('falls back to the first offered range when defaultRange is not offered', () => {
    renderDashboard('/', { ranges: ['7d', '90d'], defaultRange: '30d', primary: <RangeProbe /> });
    expect(screen.getByText('probe:7d')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '7d' })).toHaveAttribute('aria-checked', 'true');
  });

  it('ignores Refresh all clicks while busy and keeps focus', async () => {
    let release!: () => void;
    const gate = new Promise<void>((r) => (release = r));
    const fetcher = jest.fn(async () => {
      if (fetcher.mock.calls.length > 1) {
        await gate;
      }
      return 1;
    });
    function Probe() {
      useQuery({ queryKey: ['dash', 'slow'], queryFn: fetcher });
      return null;
    }
    renderDashboard('/', { queryKeyPrefix: ['dash'], primary: <Probe /> });
    const refresh = screen.getByRole('button', { name: 'Refresh all' });
    await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(refresh).not.toHaveAttribute('aria-disabled'));
    refresh.focus();
    fireEvent.click(refresh);
    await waitFor(() => expect(refresh).toHaveAttribute('aria-disabled', 'true'));
    expect(refresh).toHaveAttribute('aria-busy', 'true');
    expect(refresh).not.toBeDisabled();
    fireEvent.click(refresh);
    fireEvent.click(refresh);
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(refresh).toHaveFocus();
    release();
    await waitFor(() => expect(refresh).not.toHaveAttribute('aria-disabled'));
  });

  it('Refresh all invalidates only queries under queryKeyPrefix', async () => {
    const inside = jest.fn(async () => 1);
    const outside = jest.fn(async () => 2);
    function Probes() {
      useQuery({ queryKey: ['dash', 'a'], queryFn: inside });
      useQuery({ queryKey: ['other'], queryFn: outside });
      return null;
    }
    renderDashboard('/', { queryKeyPrefix: ['dash'], primary: <Probes /> });
    await waitFor(() => expect(inside).toHaveBeenCalledTimes(1));
    expect(outside).toHaveBeenCalledTimes(1);
    const refresh = screen.getByRole('button', { name: 'Refresh all' });
    await waitFor(() => expect(refresh).toBeEnabled());
    fireEvent.click(refresh);
    await waitFor(() => expect(inside).toHaveBeenCalledTimes(2));
    expect(outside).toHaveBeenCalledTimes(1);
  });

  it('stretches KPI and secondary widgets to fill their grid columns', () => {
    const { container } = renderDashboard('/', {
      kpis: <Revenue fetcher={async () => 1} />,
      secondary: (
        <DashboardWidget title="Healthy">
          <p>fine</p>
        </DashboardWidget>
      ),
    });
    const grids = Array.from(container.querySelectorAll<HTMLElement>('[data-fill-mode]'));
    expect(grids).toHaveLength(2);
    for (const grid of grids) {
      expect(grid).toHaveAttribute('data-fill-mode', 'auto-fit');
      expect(grid.style.getPropertyValue('--grid-justify-items')).toBe('stretch');
    }
  });

  it('a failing widget shows its own error while siblings render', async () => {
    function Failing() {
      const query = useQuery({
        queryKey: ['dash', 'bad'],
        queryFn: async () => {
          throw new Error('boom');
        },
      });
      return (
        <DashboardWidget title="Broken" query={query}>
          <p>never</p>
        </DashboardWidget>
      );
    }
    renderDashboard('/', {
      kpis: <Revenue fetcher={async () => 1500} />,
      primary: <Failing />,
      secondary: (
        <DashboardWidget title="Healthy">
          <p>fine</p>
        </DashboardWidget>
      ),
    });
    expect(await screen.findByText('Something went wrong')).toBeInTheDocument();
    expect(screen.queryByText('never')).not.toBeInTheDocument();
    expect(screen.getByText('fine')).toBeInTheDocument();
    expect(await screen.findByText('$1,500.00')).toBeInTheDocument();
  });
});

describe('KpiWidget', () => {
  it('shows a skeleton while pending, then the value and a non-color-only delta', async () => {
    let resolve!: (n: number) => void;
    const fetcher = () => new Promise<number>((r) => (resolve = r));
    const { container } = renderDashboard('/', { kpis: <Revenue fetcher={fetcher} /> });
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(container.querySelector('[data-loadable]')).toBeInTheDocument();
    expect(screen.queryByText(/12%/)).not.toBeInTheDocument();
    resolve(1500);
    expect(await screen.findByText('$1,500.00')).toBeInTheDocument();
    expect(container.querySelector('[data-loadable]')).not.toBeInTheDocument();
    const delta = screen.getByText(/12%/);
    expect(delta).toHaveTextContent('▲');
    expect(delta).toHaveTextContent('up');
    expect(delta).toHaveAttribute('data-tone', 'success');
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('has no invalid DOM nesting while pending', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    renderDashboard('/', {
      kpis: <Revenue fetcher={() => new Promise<number>(() => undefined)} />,
    });
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    const nesting = spy.mock.calls.filter((c) =>
      /validateDOMNesting|cannot be a descendant|cannot contain/.test(String(c[0]))
    );
    spy.mockRestore();
    expect(nesting).toHaveLength(0);
  });

  it('keeps its label and tile while showing a compact error when its query fails', async () => {
    const { container } = renderDashboard('/', {
      kpis: <Revenue fetcher={() => Promise.reject(new Error('boom'))} />,
    });
    const error = await screen.findByRole('heading', { level: 3 });
    const tile = container.querySelector('[data-component="card"]');
    expect(tile).not.toBeNull();
    expect(tile).toContainElement(error);
    expect(within(tile as HTMLElement).getByText('Revenue')).toBeInTheDocument();
    // The message sits below the label inside the tile, not in place of it.
    expect(
      within(tile as HTMLElement)
        .getByText('Revenue')
        .compareDocumentPosition(error) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  });

  it('keeps tone independent of direction', () => {
    const { container } = render(
      <LabelsProvider locale="en-US">
        <AppProvider queryClient={client} logger={silentLogger} debug={false}>
          <KpiWidget
            label="Churn"
            value={() => '2%'}
            delta={() => ({ value: 3, direction: 'down', good: true })}
          />
          <KpiWidget
            label="Errors"
            value={() => '9'}
            delta={() => ({ value: 5, direction: 'down', good: false })}
          />
        </AppProvider>
      </LabelsProvider>
    );
    const [good, bad] = Array.from(container.querySelectorAll('[data-tone]'));
    expect(good).toHaveTextContent('▼');
    expect(good).toHaveTextContent('3%');
    expect(good).toHaveTextContent('down');
    expect(good).toHaveAttribute('data-tone', 'success');
    expect(bad).toHaveAttribute('data-tone', 'danger');
  });
});

describe('ChartWidget', () => {
  it('exposes summary as the accessible text alternative and hides the chart', () => {
    renderDashboard('/', {
      primary: (
        <ChartWidget title="Sales" summary="Sales rose from 10 to 40 over the period.">
          <svg data-testid="chart" />
        </ChartWidget>
      ),
    });
    const figure = screen.getByRole('figure');
    expect(figure.querySelector('figcaption')).toHaveTextContent(
      'Sales rose from 10 to 40 over the period.'
    );
    expect(screen.getByTestId('chart').closest('[aria-hidden="true"]')).not.toBeNull();
  });
});

describe('DashboardWidget', () => {
  it('shows LastUpdated for its query in the header', async () => {
    function Widget() {
      const query = useQuery({ queryKey: ['dash', 'w'], queryFn: async () => 1 });
      return (
        <DashboardWidget title="Traffic" query={query}>
          <p>content</p>
        </DashboardWidget>
      );
    }
    renderDashboard('/', { primary: <Widget /> });
    expect(await screen.findByText('Updated just now')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Traffic' })).toBeInTheDocument();
  });

  it('shows "As of" when given asOf and no query', () => {
    renderDashboard('/', {
      primary: (
        <DashboardWidget title="Static" asOf={new Date('2026-01-02T03:04:00Z')}>
          <p>x</p>
        </DashboardWidget>
      ),
    });
    expect(screen.getByText(/^As of /)).toBeInTheDocument();
  });
});
