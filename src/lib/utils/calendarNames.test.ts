import {
  getLocalizedMonthName,
  getLocalizedDayName,
  getLocalizedMonthOption,
} from './calendarNames';
import { getMonthName, getDayName } from './dateUtils';

describe('calendarNames', () => {
  it.each(['en-US', 'en-GB', 'en'])('matches the English dateUtils output for %s', (locale) => {
    for (let m = 0; m < 12; m++) {
      expect(getLocalizedMonthName(m, locale, 'long')).toBe(getMonthName(m));
      expect(getLocalizedMonthOption(m, locale)).toBe(getMonthName(m, true));
    }
    for (let d = 0; d < 7; d++) {
      expect(getLocalizedDayName(d, locale)).toBe(getDayName(d));
    }
  });

  it('localizes month and weekday names for other locales', () => {
    expect(getLocalizedMonthName(0, 'fr-FR', 'long')).toBe('janvier');
    expect(getLocalizedMonthOption(0, 'fr-FR')).toBe('janvier');
    expect(getLocalizedDayName(0, 'fr-FR').toLowerCase()).toContain('dim');
    expect(getLocalizedMonthName(11, 'de-DE', 'long')).toBe('Dezember');
  });

  it('falls back to en-US for an invalid locale', () => {
    expect(getLocalizedMonthName(0, 'not a locale!!', 'long')).toBe('January');
  });
});
