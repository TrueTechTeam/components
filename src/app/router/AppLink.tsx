import React, {
  type AnchorHTMLAttributes,
  type ComponentType,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { isInAppLinkClick } from './linkClick';
import { linkClassName } from './linkClassName';
import { useRouterContext } from './RouterContext';
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
 * (the page's `beforeunload` guard covers leaving the app). Styled as a library link (primary
 * text tone, underline, focus ring); `className` is merged.
 */
export function AppLink({ href, children, replace, onClick, className, ...rest }: AppLinkProps) {
  // Adapters forward the remaining anchor attributes to the `<a>` they render.
  const { adapter, guard } = useRouterContext('AppLink');
  const Link = adapter.Link as ComponentType<
    RouterLinkProps & AnchorHTMLAttributes<HTMLAnchorElement>
  >;

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
    <Link
      href={href}
      replace={replace}
      onClick={handleClick}
      className={linkClassName(className)}
      {...rest}
    >
      {children}
    </Link>
  );
}
