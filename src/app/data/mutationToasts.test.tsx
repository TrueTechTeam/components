import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { useMutation } from '@tanstack/react-query';
import { GlobalProvider } from '../../lib/providers/GlobalProvider';
import { AppProvider, type Logger } from '../AppProvider';
import { useMutationFeedback } from './index';

// Real GlobalProvider + AppProvider toasts (no useToast mock): how long settled toasts stay up.
const logger: Logger = { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() };

function Demo({ fail, pending }: { fail: boolean; pending: boolean }) {
  const save = useMutation({
    mutationFn: async () => {
      if (fail) {
        throw new Error('Server said no');
      }
      return 'ok';
    },
  });
  const { mutate } = useMutationFeedback(save, {
    pending: pending ? 'Saving…' : undefined,
    success: 'Saved the report',
    error: 'Could not save the report',
  });
  return (
    <button type="button" onClick={() => mutate(undefined)}>
      Save
    </button>
  );
}

// Small steps, so React renders (and arms the dismiss timer) as the clock moves, like a browser.
async function advance(ms: number) {
  for (let elapsed = 0; elapsed < ms; elapsed += 50) {
    await act(async () => {
      await jest.advanceTimersByTimeAsync(Math.min(50, ms - elapsed));
    });
  }
}

describe('useMutationFeedback toasts (real ToastProvider)', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it.each([
    ['success', 'direct', false, false, 'Saved the report', 5000],
    ['success', 'pending toast', false, true, 'Saved the report', 5000],
    ['error', 'direct', true, false, 'Could not save the report', 8000],
    ['error', 'pending toast', true, true, 'Could not save the report', 8000],
  ])(
    'keeps a settled %s toast (%s path) readable for at least its minimum time',
    async (_kind, _path, fail, pending, message, minimum) => {
      render(
        <GlobalProvider>
          <AppProvider logger={logger} debug={false}>
            <Demo fail={fail} pending={pending} />
          </AppProvider>
        </GlobalProvider>
      );
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));
      // Let the mutation settle and the toast enter.
      await advance(10);
      expect(screen.getByText(message)).toBeInTheDocument();

      await advance(minimum - 100);
      expect(screen.getByText(message)).toBeInTheDocument();

      // Past the duration plus the enter and exit animations.
      await advance(1000);
      expect(screen.queryByText(message)).not.toBeInTheDocument();
    }
  );
});
