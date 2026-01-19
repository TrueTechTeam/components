import React, { useEffect, type ReactNode } from 'react';
import { ThemeProvider } from '../../contexts/ThemeContext';
import {
  PageMessagesProvider,
  type PageMessagesProviderProps,
} from '../../contexts/PageMessagesContext';
import { DialogProvider, type DialogProviderProps } from '../../components/overlays/Dialog';
import { AlertProvider, type AlertProviderProps } from '../../components/overlays/Alert';
import { ToastProvider, type ToastProviderProps } from '../../components/overlays/Toast';
import type { ThemeConfig } from '../../types';
import '../../styles/index.scss';

export interface GlobalProviderProps {
  /**
   * Child components to render
   */
  children: ReactNode;

  /**
   * Theme configuration
   */
  themeConfig?: ThemeConfig;

  /**
   * Whether to inject global styles (default: true)
   */
  injectGlobalStyles?: boolean;

  /**
   * PageMessages default configuration
   */
  pageMessagesConfig?: Omit<PageMessagesProviderProps, 'children'>;

  /**
   * Dialog provider configuration
   */
  dialogConfig?: Omit<DialogProviderProps, 'children'>;

  /**
   * Alert provider configuration
   */
  alertConfig?: Omit<AlertProviderProps, 'children'>;

  /**
   * Toast provider configuration
   */
  toastConfig?: Omit<ToastProviderProps, 'children'>;
}

/**
 * GlobalProvider component that wraps the entire application
 *
 * Provides:
 * - Theme context for dark/light mode switching
 * - Global CSS styles and utility classes
 * - CSS custom properties for theming
 *
 * @example
 * ```tsx
 * import { GlobalProvider } from '@true-tech-team/ui-components';
 *
 * function App() {
 *   return (
 *     <GlobalProvider themeConfig={{ mode: 'dark' }}>
 *       <YourApp />
 *     </GlobalProvider>
 *   );
 * }
 * ```
 *
 * @example
 * With custom theme override:
 * ```tsx
 * <GlobalProvider
 *   themeConfig={{
 *     mode: 'light',
 *     theme: {
 *       colors: {
 *         primary: '#0066ff',
 *       },
 *     },
 *   }}
 * >
 *   <App />
 * </GlobalProvider>
 * ```
 */
export function GlobalProvider({
  children,
  themeConfig,
  injectGlobalStyles = true,
  pageMessagesConfig,
  dialogConfig,
  alertConfig,
  toastConfig,
}: GlobalProviderProps) {
  // Apply theme overrides if provided
  useEffect(() => {
    if (themeConfig?.theme && injectGlobalStyles) {
      const { colors } = themeConfig.theme;
      if (colors) {
        Object.entries(colors).forEach(([key, value]) => {
          if (value) {
            const cssVarName = `--theme-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            document.documentElement.style.setProperty(cssVarName, value);
          }
        });
      }
    }
  }, [themeConfig, injectGlobalStyles]);

  return (
    <ThemeProvider themeConfig={themeConfig}>
      <PageMessagesProvider {...pageMessagesConfig}>
        <DialogProvider {...dialogConfig}>
          <AlertProvider {...alertConfig}>
            <ToastProvider {...toastConfig}>
              {children}
            </ToastProvider>
          </AlertProvider>
        </DialogProvider>
      </PageMessagesProvider>
    </ThemeProvider>
  );
}

export default GlobalProvider;
