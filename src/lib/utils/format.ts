/**
 * Zero-dependency, `Intl`-based formatters. Every function takes an optional trailing
 * `locale`, falls back to `resolveLocale`, and returns '' for invalid input (never throws).
 */

const cache = new Map<string, unknown>();

function cached<T>(kind: string, locale: string, opts: unknown, create: () => T): T {
  const key = `${kind}|${locale}|${JSON.stringify(opts ?? null)}`;
  let hit = cache.get(key) as T | undefined;
  if (!hit) {
    hit = create();
    cache.set(key, hit);
  }
  return hit;
}

/** Explicit locale, else `navigator.language`, else 'en-US'. SSR-safe. */
export function resolveLocale(locale?: string): string {
  if (locale) {
    return locale;
  }
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language;
  }
  return 'en-US';
}

function toDate(value: Date | string | number): Date | null {
  const d = value instanceof Date ? value : new Date(value);
  return Number.isFinite(d.getTime()) ? d : null;
}

function safe(fn: () => string): string {
  try {
    return fn();
  } catch {
    return '';
  }
}

export function formatDateTime(
  value: Date | string | number,
  opts: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
  locale?: string
): string {
  return safe(() => {
    const d = toDate(value);
    if (!d) {
      return '';
    }
    const loc = resolveLocale(locale);
    return cached('dt', loc, opts, () => new Intl.DateTimeFormat(loc, opts)).format(d);
  });
}

export function formatRelativeTime(
  value: Date | string | number,
  opts: { now?: Date | number; numeric?: 'always' | 'auto' } = {},
  locale?: string
): string {
  return safe(() => {
    const d = toDate(value);
    if (!d) {
      return '';
    }
    const now = opts.now === undefined ? Date.now() : +opts.now;
    if (!Number.isFinite(now)) {
      return '';
    }
    const diffSec = (d.getTime() - now) / 1000;
    const abs = Math.abs(diffSec);
    const DAY = 86400;
    // [unit, seconds per unit, upper bound (exclusive) in seconds]
    const units: Array<[Intl.RelativeTimeFormatUnit, number, number]> = [
      ['second', 1, 60],
      ['minute', 60, 3600],
      ['hour', 3600, DAY],
      ['day', DAY, 7 * DAY],
      ['week', 7 * DAY, 35 * DAY],
      ['month', 30.4375 * DAY, 365.25 * DAY],
      ['year', 365.25 * DAY, Infinity],
    ];
    const [unit, secs] = units.find(([, , max]) => abs < max) as [
      Intl.RelativeTimeFormatUnit,
      number,
      number,
    ];
    const amount = Math.round(diffSec / secs);
    const loc = resolveLocale(locale);
    const numeric = opts.numeric ?? 'always';
    return cached(
      'rt',
      loc,
      { numeric },
      () => new Intl.RelativeTimeFormat(loc, { numeric })
    ).format(amount, unit);
  });
}

export function formatNumber(
  value: number,
  opts?: Intl.NumberFormatOptions,
  locale?: string
): string {
  return safe(() => {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      return '';
    }
    const loc = resolveLocale(locale);
    return cached('num', loc, opts, () => new Intl.NumberFormat(loc, opts)).format(value);
  });
}

export function formatCurrency(
  value: number,
  currency: string,
  opts?: Intl.NumberFormatOptions,
  locale?: string
): string {
  return formatNumber(value, { ...opts, style: 'currency', currency }, locale);
}

export function formatPercent(
  value: number,
  opts: { fractionDigits?: number; isRatio?: boolean } = {},
  locale?: string
): string {
  const { fractionDigits = 0, isRatio = true } = opts;
  return formatNumber(
    isRatio ? value : value / 100,
    { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: fractionDigits },
    locale
  );
}

export function formatFileSize(
  bytes: number,
  opts: { binary?: boolean; fractionDigits?: number } = {},
  locale?: string
): string {
  if (typeof bytes !== 'number' || !Number.isFinite(bytes) || bytes < 0) {
    return '';
  }
  const { binary = false, fractionDigits = 1 } = opts;
  const base = binary ? 1024 : 1000;
  const units = binary
    ? ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB']
    : ['B', 'kB', 'MB', 'GB', 'TB', 'PB'];
  let i = 0;
  let size = bytes;
  while (size >= base && i < units.length - 1) {
    size /= base;
    i++;
  }
  const num = formatNumber(
    size,
    { minimumFractionDigits: 0, maximumFractionDigits: i === 0 ? 0 : fractionDigits },
    locale
  );
  return num ? `${num} ${units[i]}` : '';
}

export function formatList(
  items: string[],
  opts: { type?: 'conjunction' | 'disjunction' | 'unit'; style?: 'long' | 'short' | 'narrow' } = {},
  locale?: string
): string {
  return safe(() => {
    if (!Array.isArray(items)) {
      return '';
    }
    const loc = resolveLocale(locale);
    const o = { type: opts.type ?? 'conjunction', style: opts.style ?? 'long' };
    return cached('list', loc, o, () => new Intl.ListFormat(loc, o)).format(items);
  });
}
