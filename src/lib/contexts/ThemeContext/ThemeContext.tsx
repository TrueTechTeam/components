import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { ThemeMode, ThemeConfig, ThemeOverride } from '../../types';

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  themeOverride?: ThemeOverride;
  setThemeOverride: (override?: ThemeOverride) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
  themeConfig?: ThemeConfig;
}

/**
 * ThemeProvider component that manages theme state
 *
 * @example
 * ```tsx
 * <ThemeProvider defaultMode="light">
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({
  children,
  defaultMode = 'light',
  themeConfig,
}: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(themeConfig?.mode || defaultMode);
  const [themeOverride, setThemeOverride] = useState<ThemeOverride | undefined>(
    themeConfig?.theme
  );

  // Apply theme mode to document root
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const value: ThemeContextValue = {
    mode,
    setMode,
    toggleMode,
    themeOverride,
    setThemeOverride,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Hook to access theme context
 *
 * @throws {Error} If used outside of ThemeProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { mode, toggleMode } = useTheme();
 *   return <button onClick={toggleMode}>Current mode: {mode}</button>;
 * }
 * ```
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
