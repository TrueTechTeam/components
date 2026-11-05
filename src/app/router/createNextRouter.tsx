import React, { useMemo, type AnchorHTMLAttributes, type ComponentType } from 'react';
import { linkClassName } from './linkClassName';
import type { RouterAdapter, RouterLinkProps } from './types';

/** What `next/navigation`'s `useSearchParams` returns (`ReadonlyURLSearchParams`), structurally. */
export interface ReadonlyURLSearchParamsLike {
  toString(): string;
}

export interface NextRouterDeps {
  /** `useRouter` from `next/navigation`. */
  useRouter: () => {
    push(href: string, opts?: { scroll?: boolean }): void;
    replace(href: string, opts?: { scroll?: boolean }): void;
  };
  /** `usePathname` from `next/navigation`. */
  usePathname: () => string | null;
  /** `useSearchParams` from `next/navigation`. */
  useSearchParams: () => URLSearchParams | ReadonlyURLSearchParamsLike | null;
  /** `next/link`'s default export. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- any router's Link component
  Link: ComponentType<any>;
}

/**
 * Builds a router adapter hook for the Next.js App Router from its own hooks, so this library
 * never imports `next`. Call it once at module scope and pass the result to `AppProvider`:
 *
 * ```tsx
 * 'use client';
 * import Link from 'next/link';
 * import { usePathname, useRouter, useSearchParams } from 'next/navigation';
 * const useNextRouter = createNextRouter({ useRouter, usePathname, useSearchParams, Link });
 * <AppProvider router={useNextRouter}>…</AppProvider>
 * ```
 *
 * Next.js cannot block navigation, so `supportsBlocking` is false: guards apply to `AppLink`,
 * `useAppNavigate` and page unload, not to Back/Forward. Search-param updates keep the scroll position.
 *
 * The adapter does not call Next's `useSearchParams` at the root, so `AppProvider` needs no
 * `<Suspense>`. Its `searchParams` is a non-reactive snapshot of `window.location.search` (empty on
 * the server); `usePageParams` and `usePreference` read the reactive `adapter.useSearchParams`
 * instead, so — per Next's rules for `useSearchParams` — components using them need a
 * `<Suspense>` boundary above them in statically rendered routes.
 */
export function createNextRouter(deps: NextRouterDeps): () => RouterAdapter {
  const { useRouter, usePathname, useSearchParams, Link } = deps;

  function NextLink({
    className,
    ...props
  }: RouterLinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
    return <Link {...props} className={linkClassName(className)} />;
  }

  /** Reactive search params; only components that read URL params call it. */
  function useNextSearchParams(): URLSearchParams {
    const search = useSearchParams()?.toString() ?? '';
    return useMemo(() => new URLSearchParams(search), [search]);
  }

  return function useNextRouter(): RouterAdapter {
    const router = useRouter();
    const pathname = usePathname() ?? '/';

    return useMemo(() => {
      const go = (href: string, replace: boolean | undefined, opts?: { scroll?: boolean }) => {
        const method = replace ? router.replace : router.push;
        if (opts) {
          method.call(router, href, opts);
        } else {
          method.call(router, href);
        }
      };
      const hasWindow = typeof window !== 'undefined';
      return {
        Link: NextLink,
        navigate: (href, opts) => go(href, opts?.replace),
        pathname,
        // Snapshot only: reading Next's useSearchParams here, at the app root, would need a
        // Suspense boundary around the whole app. Params hooks use `useSearchParams` below.
        searchParams: new URLSearchParams(hasWindow ? window.location.search : ''),
        useSearchParams: useNextSearchParams,
        setSearchParams: (next, opts) => {
          const qs = next.toString();
          const hash = hasWindow ? window.location.hash : '';
          go(`${pathname}${qs ? `?${qs}` : ''}${hash}`, opts?.replace, { scroll: false });
        },
        supportsBlocking: false,
      };
    }, [router, pathname]);
  };
}
