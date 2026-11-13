import {
  formatDateTime,
  formatRelativeTime,
  formatNumber,
  formatCurrency,
  formatPercent,
  formatFileSize,
  formatList,
  resolveLocale,
} from './format';

// Some ICU versions use narrow/no-break spaces; normalise so tests are ICU-agnostic.
const n = (s: string) => s.replace(new RegExp('[\u00a0\u202f]', 'g'), ' ');

describe('format utils', () => {
  it('formats dates', () => {
    expect(n(formatDateTime(new Date(2026, 0, 5), undefined, 'en-US'))).toBe('Jan 5, 2026');
  });

  it('formats relative time', () => {
    expect(
      formatRelativeTime(
        new Date(2026, 0, 1, 11, 57),
        { now: new Date(2026, 0, 1, 12, 0) },
        'en-US'
      )
    ).toBe('3 minutes ago');
    expect(
      formatRelativeTime(
        new Date(2026, 0, 2),
        { now: new Date(2026, 0, 1), numeric: 'auto' },
        'en-US'
      )
    ).toBe('tomorrow');
    expect(
      formatRelativeTime(
        new Date(2026, 0, 1, 12, 0, 30),
        { now: new Date(2026, 0, 1, 12) },
        'en-US'
      )
    ).toBe('in 30 seconds');
    expect(formatRelativeTime(new Date(2026, 0, 1), { now: new Date(2026, 0, 15) }, 'en-US')).toBe(
      '2 weeks ago'
    );
    expect(
      formatRelativeTime(new Date(2024, 0, 1), { now: new Date(2026, 0, 1, 1) }, 'en-US')
    ).toBe('2 years ago');
  });

  it('formats numbers, currency, percent', () => {
    expect(formatNumber(1234567.891, undefined, 'en-US')).toBe('1,234,567.891');
    expect(formatCurrency(1234.5, 'USD', undefined, 'en-US')).toBe('$1,234.50');
    expect(formatPercent(0.256, { fractionDigits: 1 }, 'en-US')).toBe('25.6%');
    expect(formatPercent(25, { isRatio: false }, 'en-US')).toBe('25%');
  });

  it('formats file sizes', () => {
    expect(formatFileSize(1536, undefined, 'en-US')).toBe('1.5 kB');
    expect(formatFileSize(1536, { binary: true }, 'en-US')).toBe('1.5 KiB');
    expect(formatFileSize(512, undefined, 'en-US')).toBe('512 B');
    expect(formatFileSize(-1)).toBe('');
  });

  it('formats lists', () => {
    expect(formatList(['a', 'b', 'c'], undefined, 'en-US')).toBe('a, b, and c');
    expect(formatList(['a', 'b'], { type: 'disjunction' }, 'en-US')).toBe('a or b');
  });

  it('returns empty string for invalid input', () => {
    for (const bad of ['nope', NaN, Infinity]) {
      expect(formatDateTime(bad as never)).toBe('');
      expect(formatRelativeTime(bad as never)).toBe('');
    }
    expect(formatNumber(NaN)).toBe('');
    expect(formatCurrency(1, 'NOPE!')).toBe('');
    expect(formatPercent(NaN)).toBe('');
    expect(formatList('x' as never)).toBe('');
  });

  it('resolves locale', () => {
    expect(resolveLocale('fr-FR')).toBe('fr-FR');
    expect(resolveLocale()).toBeTruthy();
  });
});
