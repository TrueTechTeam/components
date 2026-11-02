import { render, screen } from '@testing-library/react';
import { LabelsProvider } from '../../../contexts/LabelsContext';
import { Toast } from './Toast';
import { ToastContainer } from './ToastContainer';

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
