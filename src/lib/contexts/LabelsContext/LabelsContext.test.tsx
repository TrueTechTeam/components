import React, { type ReactNode } from 'react';
import { renderHook } from '@testing-library/react';
import { LabelsProvider, useLabels, interpolate } from './LabelsContext';
import { DEFAULT_LABELS } from './defaultLabels';
import { GlobalProvider } from '../../providers/GlobalProvider';

describe('LabelsContext', () => {
  it('returns English defaults with no provider', () => {
    const { result } = renderHook(() => useLabels());
    expect(result.current('common.close')).toBe('Close');
    expect(result.current('common.close')).toBe(DEFAULT_LABELS['common.close']);
  });

  it('returns the key itself when it is unknown', () => {
    const { result } = renderHook(() => useLabels());
    expect(result.current('nope.missing')).toBe('nope.missing');
  });

  it('applies labels overrides and interpolation', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <LabelsProvider labels={{ 'x.y': 'Hi {name}' }}>{children}</LabelsProvider>
    );
    const { result } = renderHook(() => useLabels(), { wrapper });
    expect(result.current('x.y', { name: 'Ann' })).toBe('Hi Ann');
    expect(result.current('common.close')).toBe('Close');
  });

  it('prefers translate and prefixes keys with ui.', () => {
    const translate = jest.fn((key: string) => (key === 'ui.common.close' ? 'Fermer' : undefined));
    const wrapper = ({ children }: { children: ReactNode }) => (
      <LabelsProvider labels={{ 'common.close': 'Shut' }} translate={translate}>
        {children}
      </LabelsProvider>
    );
    const { result } = renderHook(() => useLabels(), { wrapper });
    expect(result.current('common.close')).toBe('Fermer');
    expect(translate).toHaveBeenCalledWith('ui.common.close', undefined);
  });

  it('falls back when translate returns the key, empty, null or undefined', () => {
    for (const r of ['ui.common.close', '', null, undefined]) {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <LabelsProvider translate={() => r}>{children}</LabelsProvider>
      );
      const { result } = renderHook(() => useLabels(), { wrapper });
      expect(result.current('common.close')).toBe('Close');
    }
  });

  it('inner provider labels merge over outer', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <LabelsProvider labels={{ 'common.close': 'Outer', 'common.loading': 'Outer loading' }}>
        <LabelsProvider labels={{ 'common.close': 'Inner' }}>{children}</LabelsProvider>
      </LabelsProvider>
    );
    const { result } = renderHook(() => useLabels(), { wrapper });
    expect(result.current('common.close')).toBe('Inner');
    expect(result.current('common.loading')).toBe('Outer loading');
  });

  it('inner translate wins over outer translate', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <LabelsProvider translate={() => 'outer'}>
        <LabelsProvider translate={() => 'inner'}>{children}</LabelsProvider>
      </LabelsProvider>
    );
    const { result } = renderHook(() => useLabels(), { wrapper });
    expect(result.current('common.close')).toBe('inner');
  });

  it('GlobalProvider passes labels and translate through', () => {
    const labelsWrapper = ({ children }: { children: ReactNode }) => (
      <GlobalProvider labels={{ 'common.close': 'Dismiss' }}>{children}</GlobalProvider>
    );
    expect(
      renderHook(() => useLabels(), { wrapper: labelsWrapper }).result.current('common.close')
    ).toBe('Dismiss');
    const translateWrapper = ({ children }: { children: ReactNode }) => (
      <GlobalProvider translate={(k) => (k === 'ui.common.close' ? 'Fermer' : undefined)}>
        {children}
      </GlobalProvider>
    );
    expect(
      renderHook(() => useLabels(), { wrapper: translateWrapper }).result.current('common.close')
    ).toBe('Fermer');
  });

  describe('interpolate', () => {
    it('replaces placeholders and leaves unknown ones as-is', () => {
      expect(interpolate('{a} and {b}', { a: 1 })).toBe('1 and {b}');
      expect(interpolate('plain')).toBe('plain');
    });
  });
});
