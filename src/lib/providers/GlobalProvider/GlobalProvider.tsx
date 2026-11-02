import React, { type ReactNode } from 'react';
import { ThemeProvider } from '../../contexts/ThemeContext';
import {
  PageMessagesProvider,
  type PageMessagesProviderProps,
} from '../../contexts/PageMessagesContext';
import { DialogProvider, type DialogProviderProps } from '../../components/overlays/Dialog';
import { AlertProvider, type AlertProviderProps } from '../../components/overlays/Alert';
import { ToastProvider, type ToastProviderProps } from '../../components/overlays/Toast';
import { LabelsProvider, type LabelsProviderProps } from '../../contexts/LabelsContext';
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
   * Overrides for the library's built-in text (flat `component.key` to string)
   */
  labels?: LabelsProviderProps['labels'];

  /**
   * App translate function, called with `ui.<key>` for built-in text
   */
  translate?: LabelsProviderProps['translate'];

  /**
   * BCP 47 locale (e.g. `fr-FR`) for month and weekday names in date pickers
   */
  locale?: LabelsProviderProps['locale'];

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
  labels,
  translate,
  locale,
}: GlobalProviderProps) {
  return (
    <ThemeProvider themeConfig={themeConfig} applyOverrides={injectGlobalStyles}>
      <LabelsProvider labels={labels} translate={translate} locale={locale}>
        <PageMessagesProvider {...pageMessagesConfig}>
          <DialogProvider {...dialogConfig}>
            <AlertProvider {...alertConfig}>
              <ToastProvider {...toastConfig}>{children}</ToastProvider>
            </AlertProvider>
          </DialogProvider>
        </PageMessagesProvider>
      </LabelsProvider>
    </ThemeProvider>
  );
}

export default GlobalProvider;
