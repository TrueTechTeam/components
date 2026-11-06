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

const ENTER_MS = 200; // ToastProvider default animationDuration
const EXIT_MS = 200;

/** One fake-clock advance inside act; React renders and runs effects when it ends. */
const tick = (ms: number) =>
  act(async () => {
    await jest.advanceTimersByTimeAsync(ms);
  });

/**
 * Steps the clock until the settled toast has finished entering (its dismiss timer is armed in
 * the effect committed by that render) and returns the fake time it armed at. Stepping keeps
 * React rendering between timers, as a browser would; a single large advance would defer the
 * entering -> entered render and arm the timer late.
 */
async function waitUntilArmed(message: string): Promise<number> {
  for (let i = 0; i < 20; i++) {
    const toast = screen.queryByText(message)?.closest('[data-component="toast"]');
    if (
      toast?.getAttribute('data-state') === 'entered' &&
      ['success', 'error'].includes(toast.getAttribute('data-variant') ?? '')
    ) {
      return Date.now();
    }
    await tick(ENTER_MS / 4);
  }
  throw new Error(`"${message}" never settled and entered`);
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
      const armedAt = await waitUntilArmed(message);

      // Measured from the moment the settled toast's timer is armed: 1 ms before the minimum
      // it is still on screen...
      await tick(minimum - 1);
      expect(Date.now() - armedAt).toBe(minimum - 1);
      expect(screen.getByText(message)).toBeInTheDocument();

      // ...and once the minimum and the exit animation have passed, it is gone.
      await tick(1 + EXIT_MS);
      expect(screen.queryByText(message)).not.toBeInTheDocument();
    }
  );
});
