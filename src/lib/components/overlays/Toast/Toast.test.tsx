import { act, fireEvent, render, screen } from '@testing-library/react';
import { LabelsProvider } from '../../../contexts/LabelsContext';
import { useToast } from '../../../hooks/useToast';
import { Toast } from './Toast';
import { ToastContainer } from './ToastContainer';
import { ToastProvider } from './ToastProvider';

describe('Toast', () => {
  it('uses English labels by default', () => {
    render(
      <ToastContainer>
        <Toast id="1" message="Saved" duration={0} onDismiss={() => {}} />
      </ToastContainer>
    );
    expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
    expect(screen.getByLabelText('Dismiss toast')).toBeInTheDocument();
  });

  it('translates the dismiss and notifications labels', () => {
    render(
      <LabelsProvider
        labels={{ 'toast.dismiss': 'Fermer la notification', 'toast.notifications': 'Alertes' }}
      >
        <ToastContainer>
          <Toast id="1" message="Saved" duration={0} onDismiss={() => {}} />
        </ToastContainer>
      </LabelsProvider>
    );
    expect(screen.getByLabelText('Alertes')).toBeInTheDocument();
    expect(screen.getByLabelText('Fermer la notification')).toBeInTheDocument();
  });
});

describe('ToastProvider dismiss timer', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  // One fake-clock advance inside act; React renders and runs effects when it ends.
  const tick = (ms: number) =>
    act(async () => {
      await jest.advanceTimersByTimeAsync(ms);
    });

  function Trigger() {
    const toast = useToast();
    return (
      <button
        type="button"
        onClick={() => {
          const id = toast.loading('Saving');
          setTimeout(() => toast.update(id, { message: 'Saved', variant: 'success' }), 1000);
        }}
      >
        Save
      </button>
    );
  }

  it('re-arms the full duration when a loading toast settles', async () => {
    render(
      <ToastProvider defaultDuration={5000}>
        <Trigger />
      </ToastProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    // Let the loading toast finish entering (200 ms), then settle it at 1000 ms. The update
    // renders when that tick ends, which re-arms the dismiss timer from 1000 ms.
    await tick(200);
    expect(screen.getByText('Saving').closest('[data-component="toast"]')).toHaveAttribute(
      'data-state',
      'entered'
    );
    await tick(800);
    expect(screen.getByText('Saved')).toBeInTheDocument();
    await tick(4999);
    expect(screen.getByText('Saved')).toBeInTheDocument();
    // Duration plus the 200 ms exit animation.
    await tick(1 + 200);
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });
});
