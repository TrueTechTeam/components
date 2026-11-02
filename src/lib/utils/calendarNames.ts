import { resolveLocale } from './format';

const SAMPLE_YEAR = 2021; // Jan 3 2021 is a Sunday
const formatters = new Map<string, Intl.DateTimeFormat>();

function formatPart(locale: string, opts: Intl.DateTimeFormatOptions, date: Date): string {
  const loc = resolveLocale(locale);
  const key = `${loc}|${JSON.stringify(opts)}`;
  let fmt = formatters.get(key);
  if (!fmt) {
    try {
      fmt = new Intl.DateTimeFormat(loc, opts);
    } catch {
      fmt = new Intl.DateTimeFormat('en-US', opts);
    }
    formatters.set(key, fmt);
  }
  return fmt.format(date);
}

function isEnglish(locale: string): boolean {
  return resolveLocale(locale).toLowerCase().split(/[-_]/)[0] === 'en';
}

/** Month name for `month` (0-11) in `locale`. English output matches `getMonthName`. */
export function getLocalizedMonthName(month: number, locale: string, style: 'long' | 'short') {
  return formatPart(
    locale,
    { month: style, timeZone: 'UTC' },
    new Date(Date.UTC(SAMPLE_YEAR, month, 1))
  );
}

/**
 * Weekday header for `day` (0 = Sunday). English keeps the library's two-letter form
 * ("Su", "Mo"), which `Intl` has no equivalent for; other locales use Intl's short weekday.
 */
export function getLocalizedDayName(day: number, locale: string) {
  const date = new Date(Date.UTC(SAMPLE_YEAR, 0, 3 + day));
  if (isEnglish(locale)) {
    return formatPart(locale, { weekday: 'long', timeZone: 'UTC' }, date).slice(0, 2);
  }
  return formatPart(locale, { weekday: 'short', timeZone: 'UTC' }, date);
}

/**
 * Month name for the DatePicker's month select. English keeps the three-letter form ("Jan", never "Sept");
 * other locales use the full name because Intl's abbreviations vary in length and punctuation.
 */
export function getLocalizedMonthOption(month: number, locale: string) {
  const long = getLocalizedMonthName(month, locale, 'long');
  return isEnglish(locale) ? long.slice(0, 3) : long;
}
