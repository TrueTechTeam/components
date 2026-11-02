import { createContext } from 'react';
import type { TranslateFn } from '../../lib/contexts/LabelsContext';
import type { RouterAdapter } from '../router/types';
import type { LogBuffer, Logger } from './logger';

export interface Analytics {
  track(event: string, props?: Record<string, unknown>): void;
}

export interface AuthConfig<U = unknown> {
  user: U | null;
  can(action: string, subject?: string): boolean;
}

export interface FlagsConfig {
  isEnabled(flag: string): boolean;
}

export interface AppConfigValue {
  router: RouterAdapter;
  /** The logger calls are forwarded to (custom, console in development, no-op in production). */
  logger: Logger;
  logBuffer: LogBuffer;
  analytics: Analytics;
  auth: AuthConfig;
  flags: FlagsConfig;
  translate?: TranslateFn;
  titleTemplate: (title: string) => string;
  debug: boolean;
}

export const AppContext = createContext<AppConfigValue | null>(null);
AppContext.displayName = 'AppContext';
