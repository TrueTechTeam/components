export interface Logger {
  debug(...a: unknown[]): void;
  info(...a: unknown[]): void;
  warn(...a: unknown[]): void;
  error(...a: unknown[]): void;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  scope?: string;
  args: unknown[];
  time: number;
}

export const LOG_LEVELS: readonly LogLevel[] = ['debug', 'info', 'warn', 'error'];
export const LOG_BUFFER_SIZE = 200;

const noop = () => undefined;

export const noopLogger: Logger = { debug: noop, info: noop, warn: noop, error: noop };

/* eslint-disable no-console */
export const consoleLogger: Logger = {
  debug: (...a) => console.debug(...a),
  info: (...a) => console.info(...a),
  warn: (...a) => console.warn(...a),
  error: (...a) => console.error(...a),
};
/* eslint-enable no-console */

/** Ring buffer of the latest log entries with a subscribable, immutable snapshot. */
export interface LogBuffer {
  push(entry: LogEntry): void;
  getSnapshot(): LogEntry[];
  subscribe(listener: () => void): () => void;
}

export function createLogBuffer(size = LOG_BUFFER_SIZE): LogBuffer {
  let entries: LogEntry[] = [];
  const listeners = new Set<() => void>();
  let notifyQueued = false;
  // Entries are appended immediately, but subscribers are told in a coalesced microtask so that
  // logging during render never updates another component (`useLogBuffer`) mid-render.
  const notify = () => {
    if (notifyQueued) {
      return;
    }
    notifyQueued = true;
    queueMicrotask(() => {
      notifyQueued = false;
      listeners.forEach((l) => l());
    });
  };
  return {
    push(entry) {
      entries =
        entries.length >= size
          ? [...entries.slice(entries.length - size + 1), entry]
          : [...entries, entry];
      notify();
    },
    getSnapshot: () => entries,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

/** A logger that records each call in `buffer`, then forwards to `target` (prefixed with `[scope]`). */
export function createScopedLogger(target: Logger, buffer: LogBuffer, scope?: string): Logger {
  const make =
    (level: LogLevel) =>
    (...args: unknown[]) => {
      buffer.push({ level, scope, args, time: Date.now() });
      if (scope) {
        target[level](`[${scope}]`, ...args);
      } else {
        target[level](...args);
      }
    };
  return { debug: make('debug'), info: make('info'), warn: make('warn'), error: make('error') };
}

/** `process.env.NODE_ENV !== 'production'`, tolerating environments without `process`. */
export function isDevelopment(): boolean {
  try {
    return process.env.NODE_ENV !== 'production';
  } catch {
    return false;
  }
}
