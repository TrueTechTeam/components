import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';

describe('ThemeContext', () => {
  describe('ThemeProvider', () => {
    it('should provide light theme by default', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      expect(result.current.mode).toBe('light');
    });

    it('should provide custom default mode', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => (
          <ThemeProvider defaultMode="dark">{children}</ThemeProvider>
        ),
      });

      expect(result.current.mode).toBe('dark');
    });

    it('should use mode from themeConfig', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => (
          <ThemeProvider themeConfig={{ mode: 'dark' }}>{children}</ThemeProvider>
        ),
      });

      expect(result.current.mode).toBe('dark');
    });
  });

  describe('useTheme', () => {
    it('should throw error when used outside provider', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      expect(() => {
        renderHook(() => useTheme());
      }).toThrow('useTheme must be used within a ThemeProvider');
      consoleErrorSpy.mockRestore();
    });

    it('should toggle theme mode', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      expect(result.current.mode).toBe('light');

      act(() => {
        result.current.toggleMode();
      });

      expect(result.current.mode).toBe('dark');

      act(() => {
        result.current.toggleMode();
      });

      expect(result.current.mode).toBe('light');
    });

    it('should set theme mode', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      act(() => {
        result.current.setMode('dark');
      });

      expect(result.current.mode).toBe('dark');

      act(() => {
        result.current.setMode('light');
      });

      expect(result.current.mode).toBe('light');
    });

    it('should set theme override', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      const override = {
        colors: {
          primary: '#ff0000',
        },
      };

      act(() => {
        result.current.setThemeOverride(override);
      });

      expect(result.current.themeOverride).toEqual(override);
    });

    it('should apply data-theme attribute to document', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      expect(document.documentElement.getAttribute('data-theme')).toBe('light');

      act(() => {
        result.current.setMode('dark');
      });

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });
});
