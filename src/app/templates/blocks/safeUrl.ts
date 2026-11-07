/** Image sources a block may render: relative, http(s), blob, or data images (never `javascript:`). */
export function safeImageSrc(src: string): string | undefined {
  const value = src.trim();
  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(value);
  return value && (!hasScheme || /^(https?:|blob:|data:image\/)/i.test(value)) ? value : undefined;
}

/** Link targets a block may render: relative, http(s) or blob. */
export function safeHref(href: string): string | undefined {
  const value = href.trim();
  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(value);
  return value && (!hasScheme || /^(https?:|blob:)/i.test(value)) ? value : undefined;
}
