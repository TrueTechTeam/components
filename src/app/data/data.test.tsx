import React, { type ReactNode } from 'react';
import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { AppProvider, type Logger } from '../AppProvider';
import { createOptimisticHandlers, LastUpdated, useMutationFeedback } from './index';

const toastMock = {
  success: jest.fn(),
  error: jest.fn(),
  loading: jest.fn(() => 'toast-1'),
  update: jest.fn(),
  dismiss: jest.fn(),
};
jest.mock('../../lib/hooks/useToast', () => ({ useToast: () => toastMock }));

const logger: Logger = { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() };
const wrapper = ({ children }: { children: ReactNode }) => (
  <AppProvider logger={logger}>{children}</AppProvider>
);

function useTest(
  fn: (v: string) => Promise<string>,
  opts?: Parameters<typeof useMutationFeedback<string, Error, string>>[1]
) {
  const m = useMutation<string, Error, string>({ mutationFn: fn });
  return useMutationFeedback(m, opts);
}

describe('useMutationFeedback', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows a success toast', async () => {
    const { result } = renderHook(
      () => useTest(async (v) => v.toUpperCase(), { success: (d) => `Saved ${d}` }),
      { wrapper }
    );
    act(() => result.current.mutate('a'));
    await waitFor(() =>
      expect(toastMock.success).toHaveBeenCalledWith('Saved A', { duration: 5000 })
    );
    expect(toastMock.error).not.toHaveBeenCalled();
  });

  it('shows the default error toast', async () => {
    const { result } = renderHook(
      () =>
        useTest(async () => {
          throw new Error('x');
        }),
      { wrapper }
    );
    act(() => result.current.mutate('a'));
    await waitFor(() =>
      expect(toastMock.error).toHaveBeenCalledWith('Something went wrong. Please try again.', {
        duration: 8000,
      })
    );
  });

  it('mutateAsync rejects and still reports', async () => {
    const { result } = renderHook(
      () =>
        useTest(
          async () => {
            throw new Error('x');
          },
          { error: (e) => `Failed: ${(e as Error).message}` }
        ),
      { wrapper }
    );
    await act(async () => {
      await expect(result.current.mutateAsync('a')).rejects.toThrow('x');
    });
    expect(toastMock.error).toHaveBeenCalledWith('Failed: x', { duration: 8000 });
  });

  it('updates a pending toast on settle', async () => {
    const { result } = renderHook(
      () => useTest(async (v) => v, { pending: 'Saving…', success: 'Saved' }),
      { wrapper }
    );
    act(() => result.current.mutate('a'));
    expect(toastMock.loading).toHaveBeenCalledWith('Saving…');
    await waitFor(() =>
      expect(toastMock.update).toHaveBeenCalledWith(
        'toast-1',
        expect.objectContaining({ message: 'Saved', variant: 'success' })
      )
    );
  });

  it('inline mode exposes feedback and never toasts', async () => {
    const { result } = renderHook(() => useTest(async (v) => v, { via: 'inline', success: 'OK' }), {
      wrapper,
    });
    act(() => result.current.mutate('a'));
    await waitFor(() =>
      expect(result.current.feedback).toEqual({ type: 'success', message: 'OK' })
    );
    act(() => result.current.clearFeedback());
    expect(result.current.feedback).toBeNull();
    expect(toastMock.success).not.toHaveBeenCalled();
    expect(toastMock.loading).not.toHaveBeenCalled();
  });
});

describe('createOptimisticHandlers', () => {
  it('updates, rolls back and invalidates', async () => {
    const qc = new QueryClient();
    qc.setQueryData(['todos'], ['a']);
    const spy = jest.spyOn(qc, 'invalidateQueries');
    const h = createOptimisticHandlers<string[], string>(qc, ['todos'], (old, v) => [
      ...(old ?? []),
      v,
    ]);
    const ctx = await h.onMutate('b');
    expect(qc.getQueryData(['todos'])).toEqual(['a', 'b']);
    expect(ctx.previous).toEqual(['a']);
    h.onError(new Error('x'), 'b', ctx);
    expect(qc.getQueryData(['todos'])).toEqual(['a']);
    await h.onSettled();
    expect(spy).toHaveBeenCalledWith({ queryKey: ['todos'] });
  });
});

describe('LastUpdated', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('renders relative text and refreshes over time', () => {
    const now = Date.now();
    render(<LastUpdated query={{ dataUpdatedAt: now, isFetching: false, refetch: jest.fn() }} />, {
      wrapper,
    });
    expect(screen.getByText(/^Updated /)).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(3 * 60_000);
    });
    expect(screen.getByText('Updated 3 minutes ago')).toBeInTheDocument();
  });

  it('says "just now" for fresh data and never phrases it in the future', () => {
    const now = Date.now();
    const { rerender } = render(
      <LastUpdated query={{ dataUpdatedAt: now, isFetching: false, refetch: jest.fn() }} />,
      { wrapper }
    );
    expect(screen.getByText('Updated just now')).toBeInTheDocument();
    // Clock skew: an update stamped slightly in the future is still "just now".
    rerender(
      <LastUpdated query={{ dataUpdatedAt: now + 5_000, isFetching: false, refetch: jest.fn() }} />
    );
    expect(screen.getByText('Updated just now')).toBeInTheDocument();
    // Far in the future is clamped to now, never "in 10 minutes".
    rerender(
      <LastUpdated
        query={{ dataUpdatedAt: now + 600_000, isFetching: false, refetch: jest.fn() }}
      />
    );
    expect(screen.getByText('Updated just now')).toBeInTheDocument();
    rerender(
      <LastUpdated query={{ dataUpdatedAt: now - 44_000, isFetching: false, refetch: jest.fn() }} />
    );
    expect(screen.getByText('Updated just now')).toBeInTheDocument();
    rerender(
      <LastUpdated query={{ dataUpdatedAt: now - 50_000, isFetching: false, refetch: jest.fn() }} />
    );
    expect(screen.getByText('Updated 50 seconds ago')).toBeInTheDocument();
    expect(screen.queryByText(/ in /)).not.toBeInTheDocument();
  });

  it('refresh button calls refetch and is disabled while fetching', () => {
    const refetch = jest.fn().mockResolvedValue(undefined);
    const { rerender } = render(
      <LastUpdated query={{ dataUpdatedAt: 1, isFetching: false, refetch }} />,
      { wrapper }
    );
    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }));
    expect(refetch).toHaveBeenCalledTimes(1);
    rerender(<LastUpdated query={{ dataUpdatedAt: 1, isFetching: true, refetch }} />);
    expect(screen.getByRole('button', { name: 'Refresh' })).toBeDisabled();
  });

  it('renders nothing without data and clears its timer on unmount', () => {
    const { container, unmount } = render(
      <LastUpdated query={{ dataUpdatedAt: 0, isFetching: false, refetch: jest.fn() }} />,
      { wrapper }
    );
    expect(container).toBeEmptyDOMElement();
    unmount();
    const q = { dataUpdatedAt: 1, isFetching: false, refetch: jest.fn() };
    const u = render(<LastUpdated query={q} />, { wrapper });
    u.unmount();
    expect(jest.getTimerCount()).toBe(0);
  });
});
