// Shared plumbing for the App Builder template stories: an in-memory router (so each story, and
// each story on a docs page, has its own URL state and deep links), a fake list endpoint, the
// story wrapper and viewport presets. Story-only; not part of the library build.
import React, {
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import type { FilterValue } from '../../../lib/components/filters';
import type { AuthConfig, RouterAdapter, RouterLinkProps, TableState } from '../../index';
import { linkClassName } from '../../router/linkClassName';
import { isInAppLinkClick } from '../../router/linkClick';
import { StoryApp, wait } from '../storyHelpers';

/**
 * A router adapter kept in memory, starting at `initialUrl` (`/projects?selected=prj-002`).
 * Returns the hook to pass as `AppProvider`'s `router`; create it once per story mount.
 */
export function createMemoryRouter(initialUrl = '/'): () => RouterAdapter {
  let url = initialUrl;
  const listeners = new Set<() => void>();
  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const getSnapshot = () => url;
  const pathOf = (value: string) => value.split('?')[0] || '/';

  const navigate = (href: string) => {
    const next = new URL(href, `http://story.local${pathOf(url)}`);
    url = next.pathname + next.search;
    listeners.forEach((listener) => listener());
  };
  const setSearchParams = (next: URLSearchParams) => {
    const qs = next.toString();
    navigate(`${pathOf(url)}${qs ? `?${qs}` : ''}`);
  };

  function MemoryLink({
    href,
    children,
    onClick,
    target,
    download,
    replace: _replace,
    className,
    ...rest
  }: RouterLinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (isInAppLinkClick(e, { href, target, download })) {
        e.preventDefault();
        navigate(href);
      }
    };
    return (
      <a
        href={href}
        target={target}
        download={download}
        onClick={handleClick}
        className={linkClassName(className)}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return function useMemoryRouter(): RouterAdapter {
    const current = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
    return useMemo(() => {
      const q = current.indexOf('?');
      return {
        Link: MemoryLink,
        navigate,
        pathname: q === -1 ? current : current.slice(0, q),
        searchParams: new URLSearchParams(q === -1 ? '' : current.slice(q + 1)),
        setSearchParams,
        supportsBlocking: false,
      };
    }, [current]);
  };
}

/** Fetch behaviour every template story exposes as controls. */
export interface FetchArgs {
  /** Response delay in ms */
  delay: number;
  /** Make the fetcher throw */
  fail: boolean;
  /** Return no records */
  empty: boolean;
}

export const FETCH_ARG_TYPES = {
  delay: { control: { type: 'number', min: 0, max: 10000, step: 250 } },
  fail: { control: 'boolean' },
  empty: { control: 'boolean' },
} as const;

export const FETCH_DEFAULTS: FetchArgs = { delay: 700, fail: false, empty: false };

/** A delay long enough that a story stays in its loading state. */
export const FOREVER = 600_000;

/** The latest fetch args, readable from query functions without re-keying the queries. */
export function useFetchControl(args: FetchArgs) {
  const ref = useRef(args);
  ref.current = args;
  return ref;
}

/** Waits `delay`, then throws when `fail`. */
export async function respond<T>(control: { current: FetchArgs }, value: () => T): Promise<T> {
  await wait(control.current.delay);
  if (control.current.fail) {
    throw new Error('Service unavailable');
  }
  return value();
}

/** A fake list endpoint: search, `filters` (`field: value | value[]`), sort and pagination. */
export function queryRows<T extends object>(
  rows: T[],
  state: TableState,
  searchKeys: Array<keyof T>
): { rows: T[]; total: number } {
  const needle = state.search.trim().toLowerCase();
  let result = rows.filter((row) =>
    needle === '' ? true : searchKeys.some((k) => String(row[k]).toLowerCase().includes(needle))
  );
  for (const [key, value] of Object.entries(state.filters) as Array<[keyof T, FilterValue]>) {
    const wanted = Array.isArray(value) ? value.map(String) : [String(value)];
    result = result.filter((row) => wanted.includes(String(row[key])));
  }
  if (state.sort) {
    const { key, direction } = state.sort;
    const sign = direction === 'asc' ? 1 : -1;
    result = [...result].sort((a, b) => {
      const x = (a as Record<string, unknown>)[key];
      const y = (b as Record<string, unknown>)[key];
      return (
        (typeof x === 'number' && typeof y === 'number'
          ? x - y
          : String(x).localeCompare(String(y))) * sign
      );
    });
  }
  const start = (state.page - 1) * state.pageSize;
  return { rows: result.slice(start, start + state.pageSize), total: result.length };
}

export interface TemplateStoryProps {
  /** Starting URL of the in-memory router. @default '/' */
  url?: string;
  auth?: AuthConfig;
  children: ReactNode;
}

/** `StoryApp` with its own in-memory router at `url`. Remount (via `key`) to start over. */
export function TemplateStory({ url = '/', auth, children }: TemplateStoryProps) {
  const [router] = useState(() => createMemoryRouter(url));
  return (
    <StoryApp router={router} auth={auth}>
      {children}
    </StoryApp>
  );
}

/** Viewport presets: a 390×844 phone. */
export const PHONE_VIEWPORT = {
  options: {
    phone: {
      name: 'Phone (390×844)',
      styles: { width: '390px', height: '844px' },
      type: 'mobile',
    },
  },
} as const;

/**
 * Parameters and globals for a phone-sized story. Also give the story a literal
 * `tags: ['!autodocs']` (tags are read statically): the docs page is desktop-wide.
 */
export const mobileStory = {
  parameters: { viewport: PHONE_VIEWPORT },
  globals: { viewport: { value: 'phone', isRotated: false } },
};
