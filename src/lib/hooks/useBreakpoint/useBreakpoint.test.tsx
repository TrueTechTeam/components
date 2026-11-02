import React from 'react';
import { renderHook } from '@testing-library/react';
import { useBreakpoint, useBreakpointValue } from './useBreakpoint';
import { BreakpointsProvider } from '../../contexts/BreakpointsContext';

function mockViewport(width: number) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => {
      const m = /min-width:\s*(\d+)px/.exec(query);
      return {
        matches: m ? width >= Number(m[1]) : false,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };
    },
  });
}

const originalMatchMedia = window.matchMedia;
afterEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: originalMatchMedia,
  });
});

describe('useBreakpoint', () => {
  it.each([
    [375, 'phone'],
    [768, 'tablet'],
    [1280, 'laptop'],
    [1600, 'desktop'],
  ])('width %i is %s', (width, name) => {
    mockViewport(width);
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.name).toBe(name);
  });

  it('exposes flags and up/down helpers', () => {
    mockViewport(768);
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isPhone).toBe(false);
    expect(result.current.up('tablet')).toBe(true);
    expect(result.current.up('laptop')).toBe(false);
    expect(result.current.down('laptop')).toBe(true);
    expect(result.current.down('tablet')).toBe(false);
  });

  it('honors provider overrides', () => {
    mockViewport(650);
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <BreakpointsProvider breakpoints={{ tablet: 700 }}>{children}</BreakpointsProvider>
    );
    const { result } = renderHook(() => useBreakpoint(), { wrapper });
    expect(result.current.name).toBe('phone');
  });

  it('reports laptop when matchMedia is unavailable (SSR)', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: undefined,
    });
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.name).toBe('laptop');
  });
});

describe('useBreakpointValue', () => {
  it.each([
    [375, 1],
    [768, 1],
    [1280, 3],
    [1600, 3],
  ])('width %i resolves to %i', (width, expected) => {
    mockViewport(width);
    const { result } = renderHook(() => useBreakpointValue({ phone: 1, laptop: 3 }));
    expect(result.current).toBe(expected);
  });

  it('returns undefined when nothing at or below is defined', () => {
    mockViewport(375);
    const { result } = renderHook(() => useBreakpointValue({ desktop: 3 }));
    expect(result.current).toBeUndefined();
  });
});
