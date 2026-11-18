import { Component, type ErrorInfo, type ReactNode } from 'react';

export interface ErrorBoundaryProps {
  /** Rendered instead of `children` after a render error. A function receives the error and a reset. */
  fallback: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  /** Called once per caught error. */
  onError?(error: Error, info: ErrorInfo): void;
  /** When any value changes (shallow, by position) while showing the fallback, the boundary resets. */
  resetKeys?: unknown[];
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value));
}

function keysChanged(a: unknown[] = [], b: unknown[] = []): boolean {
  return a.length !== b.length || a.some((value, index) => !Object.is(value, b[index]));
}

/** Catches render errors in `children` and renders `fallback` until reset. */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  /** The last error passed to `onError`, so a replayed render error is reported only once. */
  private reported: Error | null = null;

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { error: toError(error) };
  }

  componentDidCatch(error: unknown, info: ErrorInfo): void {
    const caught = this.state.error ?? toError(error);
    if (this.reported === caught) {
      return;
    }
    this.reported = caught;
    this.props.onError?.(caught, info);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (this.state.error && keysChanged(prevProps.resetKeys, this.props.resetKeys)) {
      this.reset();
    }
  }

  reset = (): void => {
    this.reported = null;
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    if (error) {
      const { fallback } = this.props;
      return typeof fallback === 'function' ? fallback(error, this.reset) : fallback;
    }
    return this.props.children;
  }
}
