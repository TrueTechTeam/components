import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import type {
  PageMessageStateConfig,
  LoadingStateConfig,
  PageMessagesProps,
} from '../../components/display/PageMessages/types';

/**
 * Default configurations for all page message states
 */
export interface PageMessagesDefaults {
  /** Default loading configuration */
  loading?: LoadingStateConfig;
  /** Default error configuration */
  error?: PageMessageStateConfig;
  /** Default forbidden configuration */
  forbidden?: PageMessageStateConfig;
  /** Default not-found configuration */
  notFound?: PageMessageStateConfig;
  /** Default unauthorized configuration */
  unauthorized?: PageMessageStateConfig;
  /** Default maintenance configuration */
  maintenance?: PageMessageStateConfig;
  /** Default offline configuration */
  offline?: PageMessageStateConfig;
  /** Default timeout configuration */
  timeout?: PageMessageStateConfig;
  /** Default empty configuration */
  empty?: PageMessageStateConfig;
}

/**
 * Global actions that can be provided app-wide
 */
export interface PageMessagesGlobalActions {
  /** Default retry handler */
  onRetry?: () => void;
  /** Default go back handler */
  onGoBack?: () => void;
  /** Default go home handler */
  onGoHome?: () => void;
  /** Default login handler */
  onLogin?: () => void;
}

/**
 * Context value for PageMessages
 */
export interface PageMessagesContextValue {
  /** Default state configurations */
  defaults: PageMessagesDefaults;
  /** Global action handlers */
  actions: PageMessagesGlobalActions;
  /** Default component props */
  defaultProps?: Partial<
    Pick<PageMessagesProps, 'size' | 'fullScreen' | 'centerVertically' | 'minHeight'>
  >;
}

const PageMessagesContext = createContext<PageMessagesContextValue | undefined>(undefined);

export interface PageMessagesProviderProps {
  children: ReactNode;
  /** Default configurations for page message states */
  defaults?: PageMessagesDefaults;
  /** Global action handlers */
  actions?: PageMessagesGlobalActions;
  /** Default component props */
  defaultProps?: PageMessagesContextValue['defaultProps'];
}

/**
 * Provider for PageMessages defaults and global configuration
 *
 * @example
 * ```tsx
 * <PageMessagesProvider
 *   defaults={{
 *     error: {
 *       title: 'Oops! Something went wrong',
 *       description: 'Please try again later',
 *       icon: 'error',
 *     },
 *   }}
 *   actions={{
 *     onGoHome: () => router.push('/'),
 *     onLogin: () => router.push('/login'),
 *   }}
 * >
 *   <App />
 * </PageMessagesProvider>
 * ```
 */
export function PageMessagesProvider({
  children,
  defaults = {},
  actions = {},
  defaultProps = {},
}: PageMessagesProviderProps) {
  const value = useMemo<PageMessagesContextValue>(
    () => ({
      defaults,
      actions,
      defaultProps,
    }),
    [defaults, actions, defaultProps]
  );

  return <PageMessagesContext.Provider value={value}>{children}</PageMessagesContext.Provider>;
}

/**
 * Hook to access PageMessages context
 * Returns undefined if not within provider (uses built-in defaults)
 */
export function usePageMessages(): PageMessagesContextValue | undefined {
  return useContext(PageMessagesContext);
}

/**
 * Hook to get merged configuration (context defaults + component props)
 * For internal use by PageMessages component
 */
export function usePageMessagesConfig(
  componentProps: Partial<PageMessagesProps>
): PageMessagesContextValue {
  const context = useContext(PageMessagesContext);

  return useMemo(
    () => ({
      defaults: context?.defaults ?? {},
      actions: {
        onRetry: componentProps.onRetry ?? context?.actions?.onRetry,
        onGoBack: componentProps.onGoBack ?? context?.actions?.onGoBack,
        onGoHome: componentProps.onGoHome ?? context?.actions?.onGoHome,
        onLogin: componentProps.onLogin ?? context?.actions?.onLogin,
      },
      defaultProps: context?.defaultProps,
    }),
    [context, componentProps.onRetry, componentProps.onGoBack, componentProps.onGoHome, componentProps.onLogin]
  );
}
