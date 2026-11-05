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

  // Small steps, so React renders (and arms the dismiss timer) as the clock moves.
  async function advance(ms: number) {
    for (let elapsed = 0; elapsed < ms; elapsed += 50) {
      await act(async () => {
        await jest.advanceTimersByTimeAsync(Math.min(50, ms - elapsed));
      });
    }
  }

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
    await advance(1000);
    expect(screen.getByText('Saved')).toBeInTheDocument();
    await advance(4900);
    expect(screen.getByText('Saved')).toBeInTheDocument();
    await advance(400);
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });
});
