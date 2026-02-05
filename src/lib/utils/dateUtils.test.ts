import {
  getDaysInMonth,
  getFirstDayOfMonth,
  getCalendarDays,
  isSameDay,
  isToday,
  isDateInRange,
  isDateBefore,
  isDateAfter,
  formatDate,
  parseDate,
  getMonthName,
  getDayName,
  addMonths,
  addDays,
  getDaysDifference,
  isLeapYear,
  clampDate,
  isDateDisabled,
  getYearRange,
  startOfDay,
  endOfDay,
} from './dateUtils';

describe('dateUtils', () => {
  describe('getDaysInMonth', () => {
    it('should return correct number of days for regular months', () => {
      expect(getDaysInMonth(2024, 0)).toBe(31); // January
      expect(getDaysInMonth(2024, 3)).toBe(30); // April
      expect(getDaysInMonth(2024, 6)).toBe(31); // July
      expect(getDaysInMonth(2024, 8)).toBe(30); // September
    });

    it('should return 29 days for February in leap year', () => {
      expect(getDaysInMonth(2024, 1)).toBe(29); // 2024 is a leap year
      expect(getDaysInMonth(2020, 1)).toBe(29); // 2020 is a leap year
    });

    it('should return 28 days for February in non-leap year', () => {
      expect(getDaysInMonth(2023, 1)).toBe(28);
      expect(getDaysInMonth(2025, 1)).toBe(28);
    });

    it('should handle December correctly', () => {
      expect(getDaysInMonth(2024, 11)).toBe(31);
    });
  });

  describe('getFirstDayOfMonth', () => {
    it('should return correct day of week for first day of month', () => {
      // June 1, 2024 is a Saturday (6)
      expect(getFirstDayOfMonth(2024, 5)).toBe(6);
      // January 1, 2024 is a Monday (1)
      expect(getFirstDayOfMonth(2024, 0)).toBe(1);
    });

    it('should return 0 for Sunday', () => {
      // September 1, 2024 is a Sunday
      expect(getFirstDayOfMonth(2024, 8)).toBe(0);
    });

    it('should handle different years', () => {
      expect(getFirstDayOfMonth(2023, 5)).toBe(4); // June 1, 2023 is Thursday
      expect(getFirstDayOfMonth(2025, 5)).toBe(0); // June 1, 2025 is Sunday
    });
  });

  describe('getCalendarDays', () => {
    it('should return 42 days for calendar grid', () => {
      const days = getCalendarDays(2024, 5);
      expect(days).toHaveLength(42);
    });

    it('should mark current month days correctly', () => {
      const days = getCalendarDays(2024, 5); // June 2024
      const currentMonthDays = days.filter((day) => day.isCurrentMonth);
      expect(currentMonthDays).toHaveLength(30); // June has 30 days
    });

    it('should include days from previous month', () => {
      const days = getCalendarDays(2024, 5); // June 2024
      // June 1, 2024 is Saturday (6), so we need 6 days from previous month
      const prevMonthDays = days.slice(0, 6);
      expect(prevMonthDays.every((day) => !day.isCurrentMonth)).toBe(true);
      // Last day should be May 31
      expect(prevMonthDays[prevMonthDays.length - 1].date.getDate()).toBe(31);
    });

    it('should include days from next month', () => {
      const days = getCalendarDays(2024, 5); // June 2024
      const nextMonthDays = days.filter((day) => !day.isCurrentMonth && day.date.getMonth() === 6);
      expect(nextMonthDays.length).toBeGreaterThan(0);
    });

    it('should handle January correctly', () => {
      const days = getCalendarDays(2024, 0);
      expect(days).toHaveLength(42);
      const currentMonthDays = days.filter((day) => day.isCurrentMonth);
      expect(currentMonthDays).toHaveLength(31);
    });

    it('should handle December correctly', () => {
      const days = getCalendarDays(2024, 11);
      expect(days).toHaveLength(42);
      const currentMonthDays = days.filter((day) => day.isCurrentMonth);
      expect(currentMonthDays).toHaveLength(31);
    });

    it('should handle year transitions', () => {
      const days = getCalendarDays(2024, 0); // January 2024
      // Should include some days from December 2023
      const prevMonthDays = days.filter((day) => !day.isCurrentMonth && day.date.getMonth() === 11);
      expect(prevMonthDays.length).toBeGreaterThan(0);
      expect(prevMonthDays[0].date.getFullYear()).toBe(2023);
    });
  });

  describe('isSameDay', () => {
    it('should return true for same date', () => {
      const date1 = new Date(2024, 5, 15);
      const date2 = new Date(2024, 5, 15);
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('should return true for same day with different times', () => {
      const date1 = new Date(2024, 5, 15, 10, 30, 0);
      const date2 = new Date(2024, 5, 15, 14, 45, 30);
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('should return false for different dates', () => {
      const date1 = new Date(2024, 5, 15);
      const date2 = new Date(2024, 5, 16);
      expect(isSameDay(date1, date2)).toBe(false);
    });

    it('should return false for different months', () => {
      const date1 = new Date(2024, 5, 15);
      const date2 = new Date(2024, 6, 15);
      expect(isSameDay(date1, date2)).toBe(false);
    });

    it('should return false for different years', () => {
      const date1 = new Date(2024, 5, 15);
      const date2 = new Date(2025, 5, 15);
      expect(isSameDay(date1, date2)).toBe(false);
    });

    it('should return false when first date is null', () => {
      const date2 = new Date(2024, 5, 15);
      expect(isSameDay(null, date2)).toBe(false);
    });

    it('should return false when second date is null', () => {
      const date1 = new Date(2024, 5, 15);
      expect(isSameDay(date1, null)).toBe(false);
    });

    it('should return false when both dates are null', () => {
      expect(isSameDay(null, null)).toBe(false);
    });
  });

  describe('isToday', () => {
    it('should return true for today', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    it('should return true for today with different time', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      expect(isToday(today)).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });

    it('should return false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isToday(tomorrow)).toBe(false);
    });
  });

  describe('isDateInRange', () => {
    it('should return true for date within range', () => {
      const date = new Date(2024, 5, 15);
      const startDate = new Date(2024, 5, 10);
      const endDate = new Date(2024, 5, 20);
      expect(isDateInRange(date, startDate, endDate)).toBe(true);
    });

    it('should return true for date equal to start date', () => {
      const date = new Date(2024, 5, 10);
      const startDate = new Date(2024, 5, 10);
      const endDate = new Date(2024, 5, 20);
      expect(isDateInRange(date, startDate, endDate)).toBe(true);
    });

    it('should return true for date equal to end date', () => {
      const date = new Date(2024, 5, 20);
      const startDate = new Date(2024, 5, 10);
      const endDate = new Date(2024, 5, 20);
      expect(isDateInRange(date, startDate, endDate)).toBe(true);
    });

    it('should return false for date before range', () => {
      const date = new Date(2024, 5, 5);
      const startDate = new Date(2024, 5, 10);
      const endDate = new Date(2024, 5, 20);
      expect(isDateInRange(date, startDate, endDate)).toBe(false);
    });

    it('should return false for date after range', () => {
      const date = new Date(2024, 5, 25);
      const startDate = new Date(2024, 5, 10);
      const endDate = new Date(2024, 5, 20);
      expect(isDateInRange(date, startDate, endDate)).toBe(false);
    });

    it('should return false when startDate is null', () => {
      const date = new Date(2024, 5, 15);
      const endDate = new Date(2024, 5, 20);
      expect(isDateInRange(date, null, endDate)).toBe(false);
    });

    it('should return false when endDate is null', () => {
      const date = new Date(2024, 5, 15);
      const startDate = new Date(2024, 5, 10);
      expect(isDateInRange(date, startDate, null)).toBe(false);
    });
  });

  describe('isDateBefore', () => {
    it('should return true when date is before compareDate', () => {
      const date = new Date(2024, 5, 10);
      const compareDate = new Date(2024, 5, 15);
      expect(isDateBefore(date, compareDate)).toBe(true);
    });

    it('should return false when date is after compareDate', () => {
      const date = new Date(2024, 5, 20);
      const compareDate = new Date(2024, 5, 15);
      expect(isDateBefore(date, compareDate)).toBe(false);
    });

    it('should return false when dates are equal', () => {
      const date = new Date(2024, 5, 15);
      const compareDate = new Date(2024, 5, 15);
      expect(isDateBefore(date, compareDate)).toBe(false);
    });

    it('should compare with time precision', () => {
      const date = new Date(2024, 5, 15, 10, 0, 0);
      const compareDate = new Date(2024, 5, 15, 11, 0, 0);
      expect(isDateBefore(date, compareDate)).toBe(true);
    });
  });

  describe('isDateAfter', () => {
    it('should return true when date is after compareDate', () => {
      const date = new Date(2024, 5, 20);
      const compareDate = new Date(2024, 5, 15);
      expect(isDateAfter(date, compareDate)).toBe(true);
    });

    it('should return false when date is before compareDate', () => {
      const date = new Date(2024, 5, 10);
      const compareDate = new Date(2024, 5, 15);
      expect(isDateAfter(date, compareDate)).toBe(false);
    });

    it('should return false when dates are equal', () => {
      const date = new Date(2024, 5, 15);
      const compareDate = new Date(2024, 5, 15);
      expect(isDateAfter(date, compareDate)).toBe(false);
    });

    it('should compare with time precision', () => {
      const date = new Date(2024, 5, 15, 12, 0, 0);
      const compareDate = new Date(2024, 5, 15, 11, 0, 0);
      expect(isDateAfter(date, compareDate)).toBe(true);
    });
  });

  describe('formatDate', () => {
    it('should format date with default MM/DD/YYYY format', () => {
      const date = new Date(2024, 5, 15);
      expect(formatDate(date)).toBe('06/15/2024');
    });

    it('should format date with DD/MM/YYYY format', () => {
      const date = new Date(2024, 5, 15);
      expect(formatDate(date, 'DD/MM/YYYY')).toBe('15/06/2024');
    });

    it('should format date with YYYY-MM-DD format', () => {
      const date = new Date(2024, 5, 15);
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-06-15');
    });

    it('should format date with M/D/YYYY format (no padding)', () => {
      const date = new Date(2024, 5, 5);
      expect(formatDate(date, 'M/D/YYYY')).toBe('6/5/2024');
    });

    it('should format date with YY format for year', () => {
      const date = new Date(2024, 5, 15);
      expect(formatDate(date, 'MM/DD/YY')).toBe('06/15/24');
    });

    it('should return empty string for null date', () => {
      expect(formatDate(null)).toBe('');
    });

    it('should pad single digit months and days', () => {
      const date = new Date(2024, 0, 5); // January 5
      expect(formatDate(date, 'MM/DD/YYYY')).toBe('01/05/2024');
    });

    it('should handle different month numbers', () => {
      const date = new Date(2024, 11, 25); // December 25
      expect(formatDate(date, 'MM/DD/YYYY')).toBe('12/25/2024');
    });
  });

  describe('parseDate', () => {
    it('should parse date string with MM/DD/YYYY format', () => {
      const date = parseDate('06/15/2024');
      expect(date).not.toBeNull();
      expect(date?.getFullYear()).toBe(2024);
      expect(date?.getMonth()).toBe(5); // June (0-indexed)
      expect(date?.getDate()).toBe(15);
    });

    it('should parse date string with single digit month and day', () => {
      const date = parseDate('6/5/2024');
      expect(date).not.toBeNull();
      expect(date?.getMonth()).toBe(5);
      expect(date?.getDate()).toBe(5);
    });

    it('should return null for empty string', () => {
      expect(parseDate('')).toBeNull();
    });

    it('should return null for invalid date format', () => {
      expect(parseDate('invalid')).toBeNull();
    });

    it('should return null for incomplete date string', () => {
      expect(parseDate('06/15')).toBeNull();
    });

    it('should return null for date with too many parts', () => {
      expect(parseDate('06/15/2024/extra')).toBeNull();
    });

    it('should handle invalid date values gracefully', () => {
      // JavaScript Date constructor is lenient and will adjust invalid dates
      // e.g., month 13 becomes month 1 of next year, day 32 becomes next month
      // So we test that the function returns a date object even if invalid
      const result = parseDate('13/32/2024');
      expect(result).toBeInstanceOf(Date);
    });

    it('should fallback to Date constructor for other formats', () => {
      const date = parseDate('2024-06-15T10:30:00', 'ISO');
      expect(date).not.toBeNull();
      expect(date?.getFullYear()).toBe(2024);
    });

    it('should return null for unparseable date string', () => {
      expect(parseDate('not a date', 'CUSTOM')).toBeNull();
    });
  });

  describe('getMonthName', () => {
    it('should return full month names', () => {
      expect(getMonthName(0)).toBe('January');
      expect(getMonthName(5)).toBe('June');
      expect(getMonthName(11)).toBe('December');
    });

    it('should return short month names when short is true', () => {
      expect(getMonthName(0, true)).toBe('Jan');
      expect(getMonthName(5, true)).toBe('Jun');
      expect(getMonthName(11, true)).toBe('Dec');
    });

    it('should return correct names for all months', () => {
      expect(getMonthName(1)).toBe('February');
      expect(getMonthName(2)).toBe('March');
      expect(getMonthName(3)).toBe('April');
      expect(getMonthName(4)).toBe('May');
      expect(getMonthName(6)).toBe('July');
      expect(getMonthName(7)).toBe('August');
      expect(getMonthName(8)).toBe('September');
      expect(getMonthName(9)).toBe('October');
      expect(getMonthName(10)).toBe('November');
    });
  });

  describe('getDayName', () => {
    it('should return short day names by default', () => {
      expect(getDayName(0)).toBe('Su');
      expect(getDayName(3)).toBe('We');
      expect(getDayName(6)).toBe('Sa');
    });

    it('should return full day names when short is false', () => {
      expect(getDayName(0, false)).toBe('Sunday');
      expect(getDayName(3, false)).toBe('Wednesday');
      expect(getDayName(6, false)).toBe('Saturday');
    });

    it('should return correct names for all days', () => {
      expect(getDayName(1, false)).toBe('Monday');
      expect(getDayName(2, false)).toBe('Tuesday');
      expect(getDayName(4, false)).toBe('Thursday');
      expect(getDayName(5, false)).toBe('Friday');
    });

    it('should return 2-character abbreviations', () => {
      expect(getDayName(1)).toBe('Mo');
      expect(getDayName(2)).toBe('Tu');
      expect(getDayName(4)).toBe('Th');
      expect(getDayName(5)).toBe('Fr');
    });
  });

  describe('addMonths', () => {
    it('should add positive months', () => {
      const date = new Date(2024, 5, 15);
      const result = addMonths(date, 2);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(7); // August
      expect(result.getDate()).toBe(15);
    });

    it('should subtract months with negative value', () => {
      const date = new Date(2024, 5, 15);
      const result = addMonths(date, -2);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(3); // April
      expect(result.getDate()).toBe(15);
    });

    it('should handle year transitions', () => {
      const date = new Date(2024, 11, 15);
      const result = addMonths(date, 2);
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(1); // February
    });

    it('should handle negative year transitions', () => {
      const date = new Date(2024, 1, 15);
      const result = addMonths(date, -3);
      expect(result.getFullYear()).toBe(2023);
      expect(result.getMonth()).toBe(10); // November
    });

    it('should not modify original date', () => {
      const date = new Date(2024, 5, 15);
      const originalMonth = date.getMonth();
      addMonths(date, 2);
      expect(date.getMonth()).toBe(originalMonth);
    });
  });

  describe('addDays', () => {
    it('should add positive days', () => {
      const date = new Date(2024, 5, 15);
      const result = addDays(date, 5);
      expect(result.getDate()).toBe(20);
    });

    it('should subtract days with negative value', () => {
      const date = new Date(2024, 5, 15);
      const result = addDays(date, -5);
      expect(result.getDate()).toBe(10);
    });

    it('should handle month transitions', () => {
      const date = new Date(2024, 5, 28);
      const result = addDays(date, 5);
      expect(result.getMonth()).toBe(6); // July
      expect(result.getDate()).toBe(3);
    });

    it('should handle year transitions', () => {
      const date = new Date(2024, 11, 30);
      const result = addDays(date, 5);
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getDate()).toBe(4);
    });

    it('should not modify original date', () => {
      const date = new Date(2024, 5, 15);
      const originalDate = date.getDate();
      addDays(date, 5);
      expect(date.getDate()).toBe(originalDate);
    });
  });

  describe('getDaysDifference', () => {
    it('should calculate positive difference', () => {
      const date1 = new Date(2024, 5, 10);
      const date2 = new Date(2024, 5, 15);
      expect(getDaysDifference(date1, date2)).toBe(5);
    });

    it('should calculate negative difference', () => {
      const date1 = new Date(2024, 5, 15);
      const date2 = new Date(2024, 5, 10);
      expect(getDaysDifference(date1, date2)).toBe(-5);
    });

    it('should return 0 for same date', () => {
      const date1 = new Date(2024, 5, 15);
      const date2 = new Date(2024, 5, 15);
      expect(getDaysDifference(date1, date2)).toBe(0);
    });

    it('should handle month transitions', () => {
      const date1 = new Date(2024, 5, 28);
      const date2 = new Date(2024, 6, 5);
      expect(getDaysDifference(date1, date2)).toBe(7);
    });

    it('should handle year transitions', () => {
      const date1 = new Date(2024, 11, 28);
      const date2 = new Date(2025, 0, 2);
      expect(getDaysDifference(date1, date2)).toBe(5);
    });
  });

  describe('isLeapYear', () => {
    it('should return true for leap years divisible by 4', () => {
      expect(isLeapYear(2024)).toBe(true);
      expect(isLeapYear(2020)).toBe(true);
      expect(isLeapYear(2016)).toBe(true);
    });

    it('should return false for non-leap years', () => {
      expect(isLeapYear(2023)).toBe(false);
      expect(isLeapYear(2025)).toBe(false);
      expect(isLeapYear(2026)).toBe(false);
    });

    it('should return false for century years not divisible by 400', () => {
      expect(isLeapYear(1900)).toBe(false);
      expect(isLeapYear(2100)).toBe(false);
    });

    it('should return true for century years divisible by 400', () => {
      expect(isLeapYear(2000)).toBe(true);
      expect(isLeapYear(2400)).toBe(true);
    });
  });

  describe('clampDate', () => {
    it('should return date unchanged when within range', () => {
      const date = new Date(2024, 5, 15);
      const minDate = new Date(2024, 5, 10);
      const maxDate = new Date(2024, 5, 20);
      const result = clampDate(date, minDate, maxDate);
      expect(result.getTime()).toBe(date.getTime());
    });

    it('should clamp to minDate when date is before minDate', () => {
      const date = new Date(2024, 5, 5);
      const minDate = new Date(2024, 5, 10);
      const maxDate = new Date(2024, 5, 20);
      const result = clampDate(date, minDate, maxDate);
      expect(result.getTime()).toBe(minDate.getTime());
    });

    it('should clamp to maxDate when date is after maxDate', () => {
      const date = new Date(2024, 5, 25);
      const minDate = new Date(2024, 5, 10);
      const maxDate = new Date(2024, 5, 20);
      const result = clampDate(date, minDate, maxDate);
      expect(result.getTime()).toBe(maxDate.getTime());
    });

    it('should handle undefined minDate', () => {
      const date = new Date(2024, 5, 5);
      const maxDate = new Date(2024, 5, 20);
      const result = clampDate(date, undefined, maxDate);
      expect(result.getTime()).toBe(date.getTime());
    });

    it('should handle undefined maxDate', () => {
      const date = new Date(2024, 5, 25);
      const minDate = new Date(2024, 5, 10);
      const result = clampDate(date, minDate, undefined);
      expect(result.getTime()).toBe(date.getTime());
    });

    it('should handle both dates undefined', () => {
      const date = new Date(2024, 5, 15);
      const result = clampDate(date);
      expect(result.getTime()).toBe(date.getTime());
    });

    it('should not modify original date', () => {
      const date = new Date(2024, 5, 5);
      const minDate = new Date(2024, 5, 10);
      const originalTime = date.getTime();
      clampDate(date, minDate);
      expect(date.getTime()).toBe(originalTime);
    });
  });

  describe('isDateDisabled', () => {
    it('should return false when date is not disabled', () => {
      const date = new Date(2024, 5, 15);
      expect(isDateDisabled(date)).toBe(false);
    });

    it('should return true when date is before minDate', () => {
      const date = new Date(2024, 5, 5);
      const minDate = new Date(2024, 5, 10);
      expect(isDateDisabled(date, minDate)).toBe(true);
    });

    it('should return false when date equals minDate', () => {
      const date = new Date(2024, 5, 10);
      const minDate = new Date(2024, 5, 10);
      expect(isDateDisabled(date, minDate)).toBe(false);
    });

    it('should return true when date is after maxDate', () => {
      const date = new Date(2024, 5, 25);
      const maxDate = new Date(2024, 5, 20);
      expect(isDateDisabled(date, undefined, maxDate)).toBe(true);
    });

    it('should return false when date equals maxDate', () => {
      const date = new Date(2024, 5, 20);
      const maxDate = new Date(2024, 5, 20);
      expect(isDateDisabled(date, undefined, maxDate)).toBe(false);
    });

    it('should return true when date is in disabledDates array', () => {
      const date = new Date(2024, 5, 15);
      const disabledDates = [new Date(2024, 5, 15), new Date(2024, 5, 20)];
      expect(isDateDisabled(date, undefined, undefined, disabledDates)).toBe(true);
    });

    it('should return false when date is not in disabledDates array', () => {
      const date = new Date(2024, 5, 15);
      const disabledDates = [new Date(2024, 5, 10), new Date(2024, 5, 20)];
      expect(isDateDisabled(date, undefined, undefined, disabledDates)).toBe(false);
    });

    it('should check all constraints together', () => {
      const date = new Date(2024, 5, 15);
      const minDate = new Date(2024, 5, 10);
      const maxDate = new Date(2024, 5, 20);
      const disabledDates = [new Date(2024, 5, 18)];
      expect(isDateDisabled(date, minDate, maxDate, disabledDates)).toBe(false);
    });

    it('should return true if any constraint fails', () => {
      const date = new Date(2024, 5, 15);
      const minDate = new Date(2024, 5, 10);
      const maxDate = new Date(2024, 5, 20);
      const disabledDates = [new Date(2024, 5, 15)];
      expect(isDateDisabled(date, minDate, maxDate, disabledDates)).toBe(true);
    });
  });

  describe('getYearRange', () => {
    it('should generate range with custom start and end', () => {
      const years = getYearRange(2020, 2025);
      expect(years).toEqual([2020, 2021, 2022, 2023, 2024, 2025]);
    });

    it('should generate default range when no params provided', () => {
      const years = getYearRange();
      const currentYear = new Date().getFullYear();
      expect(years.length).toBe(111); // 100 years back + current + 10 forward
      expect(years[0]).toBe(currentYear - 100);
      expect(years[years.length - 1]).toBe(currentYear + 10);
    });

    it('should use default start when only endYear provided', () => {
      const currentYear = new Date().getFullYear();
      const years = getYearRange(undefined, currentYear);
      expect(years[0]).toBe(currentYear - 100);
      expect(years[years.length - 1]).toBe(currentYear);
    });

    it('should use default end when only startYear provided', () => {
      const currentYear = new Date().getFullYear();
      const years = getYearRange(currentYear - 10);
      expect(years[0]).toBe(currentYear - 10);
      expect(years[years.length - 1]).toBe(currentYear + 10);
    });

    it('should handle single year range', () => {
      const years = getYearRange(2024, 2024);
      expect(years).toEqual([2024]);
    });

    it('should generate ascending order', () => {
      const years = getYearRange(2020, 2023);
      expect(years[0]).toBeLessThan(years[years.length - 1]);
    });
  });

  describe('startOfDay', () => {
    it('should set time to 00:00:00.000', () => {
      const date = new Date(2024, 5, 15, 14, 30, 45, 500);
      const result = startOfDay(date);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });

    it('should preserve the date', () => {
      const date = new Date(2024, 5, 15, 14, 30, 45);
      const result = startOfDay(date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(5);
      expect(result.getDate()).toBe(15);
    });

    it('should not modify original date', () => {
      const date = new Date(2024, 5, 15, 14, 30, 45);
      const originalHours = date.getHours();
      startOfDay(date);
      expect(date.getHours()).toBe(originalHours);
    });

    it('should handle date already at start of day', () => {
      const date = new Date(2024, 5, 15, 0, 0, 0, 0);
      const result = startOfDay(date);
      expect(result.getTime()).toBe(date.getTime());
    });
  });

  describe('endOfDay', () => {
    it('should set time to 23:59:59.999', () => {
      const date = new Date(2024, 5, 15, 10, 30, 45, 100);
      const result = endOfDay(date);
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
      expect(result.getMilliseconds()).toBe(999);
    });

    it('should preserve the date', () => {
      const date = new Date(2024, 5, 15, 10, 30, 45);
      const result = endOfDay(date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(5);
      expect(result.getDate()).toBe(15);
    });

    it('should not modify original date', () => {
      const date = new Date(2024, 5, 15, 10, 30, 45);
      const originalHours = date.getHours();
      endOfDay(date);
      expect(date.getHours()).toBe(originalHours);
    });

    it('should handle date already at end of day', () => {
      const date = new Date(2024, 5, 15, 23, 59, 59, 999);
      const result = endOfDay(date);
      expect(result.getTime()).toBe(date.getTime());
    });
  });
});
