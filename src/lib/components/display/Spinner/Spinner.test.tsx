import { render, screen } from '@testing-library/react';
import { LabelsProvider } from '../../../contexts/LabelsContext';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('uses the English loading text by default', () => {
    render(<Spinner />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('translates the loading text, but an explicit srText wins', () => {
    const { rerender } = render(
      <LabelsProvider labels={{ 'spinner.loading': 'Chargement' }}>
        <Spinner />
      </LabelsProvider>
    );
    expect(screen.getByText('Chargement')).toBeInTheDocument();
    rerender(
      <LabelsProvider labels={{ 'spinner.loading': 'Chargement' }}>
        <Spinner srText="Patientez" />
      </LabelsProvider>
    );
    expect(screen.getByText('Patientez')).toBeInTheDocument();
  });
});
