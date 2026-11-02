import React, {
  useEffect,
  useMemo,
  useSyncExternalStore,
  type AnchorHTMLAttributes,
  type MouseEvent,
} from 'react';
import {
  useNavigationGuard,
  type NavigationGuardApi,
} from '../../lib/contexts/NavigationGuardContext';
import type { RouterAdapter, RouterLinkProps } from './types';

const hasWindow = () => typeof window !== 'undefined';

const listeners = new Set<() => void>();
/** Guard registries of mounted `useBrowserRouter` callers, ref-counted. */
const guards = new Map<NavigationGuardApi, number>();
/** Last URL the app accepted; restored when a blocked Back/Forward is cancelled. */
let lastUrl = '';

const readUrl = () => window.location.pathname + window.location.search + window.location.hash;
const emit = () => listeners.forEach((l) => l());

function onPopState() {
  for (const guard of guards.keys()) {
    if (guard.isBlocked()) {
      if (!guard.confirmNavigation()) {
        window.history.pushState(null, '', lastUrl);
        emit();
        return;
      }
      break;
    }
  }
  lastUrl = readUrl();
  emit();
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) {
    lastUrl = readUrl();
    window.addEventListener('popstate', onPopState);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener('popstate', onPopState);
    }
  };
}

const getSnapshot = () => window.location.pathname + window.location.search;
const getServerSnapshot = () => '/';

function navigate(href: string, opts?: { replace?: boolean }) {
  if (!hasWindow()) {
    return;
  }
  if (opts?.replace) {
    window.history.replaceState(null, '', href);
  } else {
    window.history.pushState(null, '', href);
  }
  lastUrl = readUrl();
  emit();
}

function setSearchParams(next: URLSearchParams, opts?: { replace?: boolean }) {
  if (!hasWindow()) {
    return;
  }
  const qs = next.toString();
  navigate(`${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`, opts);
}

function isModifiedClick(e: MouseEvent<HTMLAnchorElement>) {
  return e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
}

/** `<a href>` that handles plain left-clicks in-app; modified clicks and `target` keep browser behavior. */
function BrowserLink({
  href,
  children,
  onClick,
  target,
  ...rest
}: RouterLinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || isModifiedClick(e) || (target && target !== '_self')) {
      return;
    }
    e.preventDefault();
    navigate(href);
  };
  return (
    <a href={href} target={target} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}

/**
 * Router adapter backed by the History API (no router library). Back/Forward while a navigation
 * guard blocks asks for confirmation and restores the previous URL when cancelled.
 */
export function useBrowserRouter(): RouterAdapter {
  const guard = useNavigationGuard();
  useEffect(() => {
    guards.set(guard, (guards.get(guard) ?? 0) + 1);
    return () => {
      const count = (guards.get(guard) ?? 1) - 1;
      if (count > 0) {
        guards.set(guard, count);
      } else {
        guards.delete(guard);
      }
    };
  }, [guard]);

  const url = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return useMemo(() => {
    const q = url.indexOf('?');
    return {
      Link: BrowserLink,
      navigate,
      pathname: q === -1 ? url : url.slice(0, q),
      searchParams: new URLSearchParams(q === -1 ? '' : url.slice(q + 1)),
      setSearchParams,
      supportsBlocking: true,
    };
  }, [url]);
}
