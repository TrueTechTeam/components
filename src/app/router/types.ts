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
  searchParams: URLSearchParams;
  setSearchParams(next: URLSearchParams, opts?: { replace?: boolean }): void;
  /** True when the adapter itself blocks navigation (e.g. Back/Forward) while a guard is blocking. */
  supportsBlocking: boolean;
}
