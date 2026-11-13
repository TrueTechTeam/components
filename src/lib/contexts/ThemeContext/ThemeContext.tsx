import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { ThemeMode, ThemeConfig, ThemeOverride } from '../../types';
import { themeOverrideToCssVars } from '../../utils/themeVars';

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
  /**
   * Mode and theme override, re-synced when they change. Keep `themeConfig.theme` referentially stable (memoise or
   * hoist it): a new object re-applies all variables. The provider assumes it is the only writer
   * of the CSS variables it sets on the document root.
   */
  themeConfig?: ThemeConfig;
  /**
   * Write theme overrides to the document root as CSS variables (default: true)
   */
  applyOverrides?: boolean;
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
  applyOverrides = true,
}: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(themeConfig?.mode || defaultMode);
  const [themeOverride, setThemeOverride] = useState<ThemeOverride | undefined>(themeConfig?.theme);

  // Sync from props when they change. `mode` is compared as a primitive and `theme` by
  // reference, so a fresh themeConfig object each render neither loops nor resets
  // state set through toggleMode()/setThemeOverride().
  const propMode = themeConfig?.mode;
  const propTheme = themeConfig?.theme;
  const [prevPropMode, setPrevPropMode] = useState(propMode);
  const [prevPropTheme, setPrevPropTheme] = useState(propTheme);
  if (propMode !== prevPropMode) {
    setPrevPropMode(propMode);
    if (propMode) {
      setMode(propMode);
    }
  }
  if (propTheme !== prevPropTheme) {
    setPrevPropTheme(propTheme);
    setThemeOverride(propTheme);
  }

  // Apply theme mode to document root
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', mode);
  }, [mode]);

  // Apply theme overrides as CSS variables, removing exactly what we set on cleanup
  useEffect(() => {
    if (!applyOverrides) {
      return undefined;
    }
    const style = document.documentElement.style;
    const vars = themeOverrideToCssVars(themeOverride, mode);
    const keys = Object.keys(vars);
    keys.forEach((key) => style.setProperty(key, vars[key]));
    return () => keys.forEach((key) => style.removeProperty(key));
  }, [mode, themeOverride, applyOverrides]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      setMode,
      toggleMode,
      themeOverride,
      setThemeOverride,
    }),
    [mode, setMode, toggleMode, themeOverride, setThemeOverride]
  );

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
