const BASE = 'http://placeholder.invalid';

/**
 * Browsers drop tab, newline and other C0 control characters (and surrounding spaces) before
 * parsing a URL, so `java\tscript:` is still `javascript:`. Parse a copy with all of them removed
 * and judge that, not the raw text.
 */
// eslint-disable-next-line no-control-regex
const STRIPPED = /[\u0000- \u007F]/g;

function parse(value: unknown): { url: URL; clean: string; original: string } | null {
  if (typeof value !== 'string') {
    return null;
  }
  const original = value.trim();
  const clean = original.replace(STRIPPED, '');
  if (!clean) {
    return null;
  }
  try {
    return { url: new URL(clean, BASE), clean, original };
  } catch {
    return null;
  }
}

/** A relative or http(s) link target; `undefined` for anything else (`javascript:`, `data:`, ...). */
export function safeHref(value: unknown): string | undefined {
  const parsed = parse(value);
  return parsed && /^https?:$/.test(parsed.url.protocol) ? parsed.original : undefined;
}

/** An image source: relative, http(s), blob, or a `data:image/` URL. */
export function safeImageSrc(value: unknown): string | undefined {
  const parsed = parse(value);
  if (!parsed) {
    return undefined;
  }
  const { protocol } = parsed.url;
  if (/^(https?|blob):$/.test(protocol)) {
    return parsed.original;
  }
  return protocol === 'data:' && /^data:image\//i.test(parsed.clean) ? parsed.original : undefined;
}

/** An absolute http(s) URL (no relative targets); `null` otherwise. */
export function safeHttpUrl(value: unknown): URL | null {
  const parsed = parse(value);
  if (!parsed || !/^https?:\/\//i.test(parsed.clean) || !/^https?:$/.test(parsed.url.protocol)) {
    return null;
  }
  return parsed.url;
}
