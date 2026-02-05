import { validateField } from './useFormValidation';

describe('useFormValidation.validateField', () => {
  it('returns required error when value is empty', () => {
    const error = validateField('', { required: true });
    expect(error).toBe('This field is required');
  });

  it('uses custom required message when provided', () => {
    const error = validateField('', { required: true, messages: { required: 'Needed' } });
    expect(error).toBe('Needed');
  });

  it('validates pattern for strings', () => {
    const error = validateField('abc', { pattern: /^\d+$/ });
    expect(error).toBe('Invalid format');

    const ok = validateField('123', { pattern: /^\d+$/ });
    expect(ok).toBeNull();
  });

  it('validates minLength and maxLength', () => {
    const minErr = validateField('ab', { minLength: 3 });
    expect(minErr).toContain('Minimum length');

    const maxErr = validateField('abcdef', { maxLength: 3 });
    expect(maxErr).toContain('Maximum length');
  });

  it('validates numeric min and max', () => {
    const minErr = validateField(1, { min: 2 });
    expect(minErr).toContain('Minimum value');

    const maxErr = validateField(10, { max: 5 });
    expect(maxErr).toContain('Maximum value');
  });

  it('runs custom validator', () => {
    const custom = (v: any) => (v === 'bad' ? 'Custom error' : null);
    expect(validateField('bad', { custom })).toBe('Custom error');
    expect(validateField('good', { custom })).toBeNull();
  });

  it('validates required for arrays', () => {
    const err = validateField([], { required: true });
    expect(err).toBe('This field is required');
  });

  it('skips other validations when value is empty and not required', () => {
    const err = validateField('', { minLength: 5 });
    expect(err).toBeNull();
  });
});
