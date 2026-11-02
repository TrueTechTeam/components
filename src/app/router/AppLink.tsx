import React, {
  type AnchorHTMLAttributes,
  type ComponentType,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { isInAppLinkClick } from './linkClick';
import { useAppNavigationGuard, useRouterAdapter } from './RouterContext';
import type { RouterLinkProps } from './types';

export interface AppLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  /** Replace the current history entry instead of pushing a new one. */
  replace?: boolean;
}

/**
 * In-app link rendered with the router adapter's `Link`. While a navigation guard blocks (e.g. a
 * form has unsaved changes), a plain click asks for confirmation first and is cancelled when the
 * user declines. Modified clicks, new-tab targets, downloads and other origins are not guarded
 * (the page's `beforeunload` guard covers leaving the app).
 */
export function AppLink({ href, children, replace, onClick, ...rest }: AppLinkProps) {
  // Adapters forward the remaining anchor attributes to the `<a>` they render.
  const Link = useRouterAdapter().Link as ComponentType<
    RouterLinkProps & AnchorHTMLAttributes<HTMLAnchorElement>
  >;
  const guard = useAppNavigationGuard();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (
      isInAppLinkClick(e, { href, target: rest.target, download: rest.download }) &&
      !guard.confirmNavigation()
    ) {
      e.preventDefault();
    }
  };

  return (
    <Link href={href} replace={replace} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
