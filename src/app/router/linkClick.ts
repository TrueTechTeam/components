import type { MouseEvent } from 'react';

function isSameOrigin(href: string) {
  try {
    return new URL(href, window.location.href).origin === window.location.origin;
  } catch {
    return false;
  }
}

/**
 * True when a click on a link will navigate in-app: a plain left-click on a same-origin link with
 * no `download` and no `target` other than `_self`. Modified clicks, other origins and schemes
 * (`mailto:`, `tel:`) keep browser behavior.
 */
export function isInAppLinkClick(
  e: MouseEvent<HTMLAnchorElement>,
  link: { href: string; target?: string; download?: boolean | string }
): boolean {
  return !(
    e.defaultPrevented ||
    e.button !== 0 ||
    e.metaKey ||
    e.ctrlKey ||
    e.shiftKey ||
    e.altKey ||
    (link.target && link.target !== '_self') ||
    (link.download !== undefined && link.download !== false) ||
    !isSameOrigin(link.href)
  );
}
