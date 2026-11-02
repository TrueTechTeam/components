import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LabelsProvider } from '../../../contexts/LabelsContext';
import { FormBuilder } from './FormBuilder';
import { validateField } from './hooks/useFormValidation';

const withLabels = (labels: Record<string, string>, ui: React.ReactElement) =>
  render(<LabelsProvider labels={labels}>{ui}</LabelsProvider>);

describe('FormBuilder labels', () => {
  it('FormBuilder translates submit and reset buttons', () => {
    withLabels(
      { 'formBuilder.submit': 'Envoyer', 'formBuilder.reset': 'Effacer' },
      <FormBuilder fields={[{ name: 'a', type: 'input', label: 'A' }]} showResetButton />
    );
    expect(screen.getByRole('button', { name: 'Envoyer' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Effacer' })).toBeInTheDocument();
  });

  it('FormBuilder keeps an explicit submit label', () => {
    withLabels(
      { 'formBuilder.submit': 'Envoyer' },
      <FormBuilder fields={[{ name: 'a', type: 'input', label: 'A' }]} submitButtonText="Go" />
    );
    expect(screen.getByRole('button', { name: 'Go' })).toBeInTheDocument();
  });

  it('FormBuilder translates validation messages', async () => {
    withLabels(
      { 'formBuilder.required': 'Champ obligatoire' },
      <FormBuilder
        fields={[{ name: 'a', type: 'input', label: 'A', validation: { required: true } }]}
      />
    );
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.blur(input);
    await waitFor(() => expect(screen.getByText('Champ obligatoire')).toBeInTheDocument());
  });

  it('validateField keeps English defaults without a translator', () => {
    expect(validateField('', { required: true })).toBe('This field is required');
    expect(validateField('a', { minLength: 3 })).toBe('Minimum length is 3 characters');
    expect(validateField(5, { max: 3 })).toBe('Maximum value is 3');
    expect(validateField('a', { minLength: 3, messages: { minLength: 'custom' } })).toBe('custom');
  });
});
