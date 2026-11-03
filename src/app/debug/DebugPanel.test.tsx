import React, { useEffect } from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { AppProvider, useLogger, type Logger } from '../AppProvider';
import { Page, usePageStore, type QueryLike } from '../page';
import { useRouterAdapter } from '../router';

const silentLogger: Logger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

function query(overrides: Partial<QueryLike> = {}): QueryLike {
  return {
    isPending: false,
    isError: false,
    error: null,
    isFetching: false,
    data: undefined,
    dataUpdatedAt: Date.now(),
    refetch: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  } as QueryLike;
}

function Logs() {
  const logger = useLogger('demo');
  useEffect(() => {
    logger.warn('something odd happened');
  }, [logger]);
  return null;
}

function Store() {
  const [state] = usePageStore<{ count: number }>();
  return <p>count {state.count}</p>;
}

const reducer = (s: { count: number }) => s;

function setup(debug: boolean) {
  return render(
    <AppProvider logger={silentLogger} debug={debug}>
      <Page
        title="Orders"
        queries={[query({ isFetching: true })]}
        reducer={reducer}
        initialState={{ count: 7 }}
      >
        <Logs />
        <Store />
      </Page>
    </AppProvider>
  );
}

describe('DebugPanel', () => {
  it('renders nothing when debug is false', () => {
    setup(false);
    expect(screen.queryByRole('button', { name: 'Open debug panel' })).not.toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'D', ctrlKey: true, shiftKey: true });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('toggles with the button and Ctrl+Shift+D', () => {
    setup(true);
    const toggle = screen.getByRole('button', { name: 'Open debug panel' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(toggle);
    const dialog = screen.getByRole('dialog', { name: 'Debug panel' });
    expect(dialog).toHaveFocus();
    fireEvent.click(toggle);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'D', ctrlKey: true, shiftKey: true });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'D', ctrlKey: true, shiftKey: true });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on Escape and returns focus to the toggle', () => {
    setup(true);
    const toggle = screen.getByRole('button', { name: 'Open debug panel' });
    fireEvent.click(toggle);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(toggle).toHaveFocus();
  });

  it('shows query status, the page store and logged lines', () => {
    setup(true);
    fireEvent.click(screen.getByRole('button', { name: 'Open debug panel' }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/Fetching/)).toBeInTheDocument();
    expect(within(dialog).getByText(/"count": 7/)).toBeInTheDocument();
    expect(within(dialog).getByText(/something odd happened/)).toBeInTheDocument();
    expect(within(dialog).getByText('warn')).toBeInTheDocument();
  });

  it('shows URL params', () => {
    try {
      window.history.replaceState(null, '', '/?tab=open');
      setup(true);
      fireEvent.click(screen.getByRole('button', { name: 'Open debug panel' }));
      expect(within(screen.getByRole('dialog')).getByText('tab')).toBeInTheDocument();
      expect(within(screen.getByRole('dialog')).getByText('open')).toBeInTheDocument();
    } finally {
      window.history.replaceState(null, '', '/');
    }
  });

  it('updates URL params after they change with the panel open', () => {
    function SetTab() {
      const adapter = useRouterAdapter();
      return (
        <button
          type="button"
          onClick={() => adapter.setSearchParams(new URLSearchParams('tab=closed'))}
        >
          Close tab
        </button>
      );
    }
    try {
      window.history.replaceState(null, '', '/?tab=open');
      render(
        <AppProvider logger={silentLogger} debug>
          <Page title="Orders">
            <SetTab />
          </Page>
        </AppProvider>
      );
      fireEvent.click(screen.getByRole('button', { name: 'Open debug panel' }));
      expect(within(screen.getByRole('dialog')).getByText('open')).toBeInTheDocument();
      act(() => {
        fireEvent.click(screen.getByRole('button', { name: 'Close tab' }));
      });
      expect(within(screen.getByRole('dialog')).getByText('closed')).toBeInTheDocument();
    } finally {
      window.history.replaceState(null, '', '/');
    }
  });

  it('closes on Escape even when focus is outside the panel', () => {
    setup(true);
    const toggle = screen.getByRole('button', { name: 'Open debug panel' });
    fireEvent.click(toggle);
    document.body.focus();
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(toggle).toHaveFocus();
  });

  it('shows pending and error statuses and never renders query data', () => {
    render(
      <AppProvider logger={silentLogger} debug>
        <Page
          title="Orders"
          queries={[
            query({ isPending: true, dataUpdatedAt: 0 }),
            query({ isError: true, error: new Error('boom'), data: { secret: 'SECRET-DATA' } }),
          ]}
        >
          <p>content</p>
        </Page>
      </AppProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open debug panel' }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Pending')).toBeInTheDocument();
    expect(within(dialog).getByText('Error')).toBeInTheDocument();
    expect(dialog).not.toHaveTextContent('SECRET-DATA');
  });
});
