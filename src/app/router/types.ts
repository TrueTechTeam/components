import type { AriaAttributes, ComponentType, MouseEventHandler, ReactNode } from 'react';

/**
 * Props every router adapter's `Link` accepts. Adapters forward any other anchor attributes to
 * the rendered `<a>`. The adapter `Link` does not consult navigation guards; use `AppLink`.
 */
export interface RouterLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  download?: boolean | string;
  /** Replace the current history entry instead of pushing a new one. */
  replace?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  'aria-current'?: AriaAttributes['aria-current'];
}

/** The router-agnostic surface the `/app` layer navigates through. */
export interface RouterAdapter {
  Link: ComponentType<RouterLinkProps>;
  /** Navigates without consulting navigation guards; use `useAppNavigate` for guarded navigation. */
  navigate(href: string, opts?: { replace?: boolean }): void;
  pathname: string;
  /**
   * Current search params. Adapters that provide `useSearchParams` may make this a non-reactive
   * snapshot; read params through `useSearchParams` when it is defined.
   */
  searchParams: URLSearchParams;
  /**
   * Optional hook returning the reactive search params, for routers that must not read them at the
   * app root (Next.js: `useSearchParams` needs a Suspense boundary). The returned object keeps its
   * identity while the search string is unchanged. Must be the same function for the adapter's lifetime.
   */
  useSearchParams?: () => URLSearchParams;
  setSearchParams(next: URLSearchParams, opts?: { replace?: boolean }): void;
  /** True when the adapter itself blocks navigation (e.g. Back/Forward) while a guard is blocking. */
  supportsBlocking: boolean;
}
