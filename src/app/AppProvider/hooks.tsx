import React, { useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { interpolate, useLocale, type LabelVars } from '../../lib/contexts/LabelsContext';
import {
  formatCurrency,
  formatDateTime,
  formatFileSize,
  formatList,
  formatNumber,
  formatPercent,
  formatRelativeTime,
} from '../../lib/utils/format';
import { AppContext, type Analytics, type AppConfigValue, type AuthConfig } from './AppContext';
import { createScopedLogger, type LogEntry, type Logger } from './logger';

function useAppContextFor(hookName: string): AppConfigValue {
  const value = useContext(AppContext);
  if (!value) {
    throw new Error(`${hookName} must be used within AppProvider`);
  }
  return value;
}

/** The full `AppProvider` configuration (used by Page and the debug panel). */
export function useAppConfig(): AppConfigValue {
  return useAppContextFor('useAppConfig');
}

/** A logger whose calls are recorded in the log buffer (with `scope`) and then forwarded. */
export function useLogger(scope?: string): Logger {
  const { logger, logBuffer } = useAppContextFor('useLogger');
  return useMemo(() => createScopedLogger(logger, logBuffer, scope), [logger, logBuffer, scope]);
}

/** The latest 200 log entries, oldest first; re-renders on every new entry. */
export function useLogBuffer(): LogEntry[] {
  const { logBuffer } = useAppContextFor('useLogBuffer');
  return useSyncExternalStore(logBuffer.subscribe, logBuffer.getSnapshot, logBuffer.getSnapshot);
}

export function useTrack(): Analytics['track'] {
  const { analytics } = useAppContextFor('useTrack');
  return useMemo(() => (event, props) => analytics.track(event, props), [analytics]);
}

export function useAuth<U = unknown>(): AuthConfig<U> {
  return useAppContextFor('useAuth').auth as AuthConfig<U>;
}

export function useCan(action: string, subject?: string): boolean {
  return useAppContextFor('useCan').auth.can(action, subject);
}

export interface CanProps {
  action: string;
  subject?: string;
  children: ReactNode;
  /** Rendered when the action is not allowed. Default: nothing. */
  fallback?: ReactNode;
}

/** Renders `children` only when `auth.can(action, subject)`. UI convenience, not a security boundary. */
export function Can({ action, subject, children, fallback = null }: CanProps) {
  const allowed = useAppContextFor('Can').auth.can(action, subject);
  // eslint-disable-next-line react/jsx-no-useless-fragment -- Fragment needed to return ReactNode children
  return <>{allowed ? children : fallback}</>;
}

export function useFlag(name: string): boolean {
  return useAppContextFor('useFlag').flags.isEnabled(name);
}

export interface FeatureProps {
  name: string;
  children: ReactNode;
  /** Rendered when the flag is off. Default: nothing. */
  fallback?: ReactNode;
}

/** Renders `children` only when feature flag `name` is enabled. */
export function Feature({ name, children, fallback = null }: FeatureProps) {
  const enabled = useAppContextFor('Feature').flags.isEnabled(name);
  // eslint-disable-next-line react/jsx-no-useless-fragment -- Fragment needed to return ReactNode children
  return <>{enabled ? children : fallback}</>;
}

/** Translate app keys with the `AppProvider` `translate`; falls back to the key itself. */
export function useAppTranslation(): {
  t: (key: string, vars?: LabelVars) => string;
  locale: string;
} {
  const { translate } = useAppContextFor('useAppTranslation');
  const locale = useLocale();
  return useMemo(
    () => ({
      t: (key: string, vars?: LabelVars) => translate?.(key, vars) || interpolate(key, vars),
      locale,
    }),
    [translate, locale]
  );
}

/** Core formatters bound to the provider locale. */
export function useFormatters() {
  useAppContextFor('useFormatters');
  const locale = useLocale();
  return useMemo(
    () => ({
      dateTime: (value: Date | string | number, opts?: Parameters<typeof formatDateTime>[1]) =>
        formatDateTime(value, opts, locale),
      relativeTime: (
        value: Date | string | number,
        opts?: Parameters<typeof formatRelativeTime>[1]
      ) => formatRelativeTime(value, opts, locale),
      number: (value: number, opts?: Intl.NumberFormatOptions) => formatNumber(value, opts, locale),
      currency: (value: number, currency: string, opts?: Intl.NumberFormatOptions) =>
        formatCurrency(value, currency, opts, locale),
      percent: (value: number, opts?: Parameters<typeof formatPercent>[1]) =>
        formatPercent(value, opts, locale),
      fileSize: (bytes: number, opts?: Parameters<typeof formatFileSize>[1]) =>
        formatFileSize(bytes, opts, locale),
      list: (items: string[], opts?: Parameters<typeof formatList>[1]) =>
        formatList(items, opts, locale),
    }),
    [locale]
  );
}

export type Formatters = ReturnType<typeof useFormatters>;
