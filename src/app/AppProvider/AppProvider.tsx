import React, { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LabelsProvider, type TranslateFn } from '../../lib/contexts/LabelsContext';
import { BreakpointsProvider, type Breakpoints } from '../../lib/contexts/BreakpointsContext';
import { useNavigationGuard } from '../../lib/contexts/NavigationGuardContext';
import { useBrowserRouter } from '../router/browserRouter';
import {
  RouterContext,
  type PendingSearch,
  type RouterContextValue,
} from '../router/RouterContext';
import type { RouterAdapter } from '../router/types';
import {
  AppContext,
  type Analytics,
  type AppConfigValue,
  type AuthConfig,
  type FlagsConfig,
} from './AppContext';
import { consoleLogger, createLogBuffer, isDevelopment, noopLogger, type Logger } from './logger';

export interface AppProviderProps {
  children: ReactNode;
  /** Router adapter hook. Must stay the same function for the provider's lifetime. Default: History API. */
  router?: () => RouterAdapter;
  /** Default: a QueryClient with `staleTime: 30_000, retry: 1, refetchOnWindowFocus: true`, created once. */
  queryClient?: QueryClient;
  /** App translate function; also feeds core component labels (as `ui.<key>`). */
  translate?: TranslateFn;
  /** BCP 47 locale for labels and formatters. */
  locale?: string;
  /** Default: console in development, no-op in production. */
  logger?: Logger;
  analytics?: Analytics;
  /** Default: `{ user: null, can: () => true }`. */
  auth?: AuthConfig;
  /** Default: every flag off. */
  flags?: FlagsConfig;
  breakpoints?: Partial<Breakpoints>;
  /** Formats page titles. Default: the title unchanged. */
  titleTemplate?: (title: string) => string;
  /** Enables developer aids. Default: `process.env.NODE_ENV !== 'production'`. */
  debug?: boolean;
}

const defaultAnalytics: Analytics = { track: () => undefined };
const defaultAuth: AuthConfig = { user: null, can: () => true };
const defaultFlags: FlagsConfig = { isEnabled: () => false };
const identity = (title: string) => title;

function createDefaultQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: true } },
  });
}

/**
 * Root of an `/app` application: data fetching (TanStack Query), routing, labels/locale,
 * breakpoints, auth, feature flags, logging and analytics. Render it inside `GlobalProvider`.
 */
export function AppProvider({
  children,
  router,
  queryClient,
  translate,
  locale,
  logger,
  analytics = defaultAnalytics,
  auth = defaultAuth,
  flags = defaultFlags,
  breakpoints,
  titleTemplate = identity,
  debug = isDevelopment(),
}: AppProviderProps) {
  const useRouter = router ?? useBrowserRouter;
  const routerAdapter = useRouter();
  const guard = useNavigationGuard();
  const pendingSearch = useRef<PendingSearch | null>(null);
  // Pending param writes belong to the page they were made on; drop them when the path changes,
  // even if the hook that wrote them has unmounted.
  useEffect(() => {
    pendingSearch.current = null;
  }, [routerAdapter.pathname]);
  // Created once and kept, so dropping the `queryClient` prop later never loses the cache.
  const [defaultClient] = useState(createDefaultQueryClient);
  const [logBuffer] = useState(() => createLogBuffer());
  const client = queryClient ?? defaultClient;
  const resolvedLogger = logger ?? (debug ? consoleLogger : noopLogger);

  const routerValue = useMemo<RouterContextValue>(
    () => ({ adapter: routerAdapter, guard, pendingSearch }),
    [routerAdapter, guard]
  );

  // The router lives in its own context so these consumers don't re-render on navigation.
  const value = useMemo<AppConfigValue>(
    () => ({
      logger: resolvedLogger,
      logBuffer,
      analytics,
      auth,
      flags,
      translate,
      titleTemplate,
      debug,
    }),
    [resolvedLogger, logBuffer, analytics, auth, flags, translate, titleTemplate, debug]
  );

  return (
    <QueryClientProvider client={client}>
      <LabelsProvider translate={translate} locale={locale}>
        <BreakpointsProvider breakpoints={breakpoints}>
          <AppContext.Provider value={value}>
            <RouterContext.Provider value={routerValue}>{children}</RouterContext.Provider>
          </AppContext.Provider>
        </BreakpointsProvider>
      </LabelsProvider>
    </QueryClientProvider>
  );
}
