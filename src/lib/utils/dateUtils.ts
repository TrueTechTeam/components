/**
 * Date utilities for DatePicker and DateRangePicker components
 */

/**
 * Get the number of days in a month
 */
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * Get the first day of the month (0 = Sunday, 6 = Saturday)
 */
export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

/**
 * Get all days to display in calendar grid for a given month
 * Includes previous/next month days to fill the grid
 */
export const getCalendarDays = (
  year: number,
  month: number
): Array<{ date: Date; isCurrentMonth: boolean }> => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];

  // Add days from previous month
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      date: new Date(prevYear, prevMonth, daysInPrevMonth - i),
      isCurrentMonth: false,
    });
  }

  // Add days from current month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      date: new Date(year, month, day),
      isCurrentMonth: true,
    });
  }

  // Add days from next month to complete the grid (42 cells = 6 weeks)
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  const remainingDays = 42 - days.length;

  for (let day = 1; day <= remainingDays; day++) {
    days.push({
      date: new Date(nextYear, nextMonth, day),
      isCurrentMonth: false,
    });
  }

  return days;
};

/**
 * Check if two dates are the same day
 */
export const isSameDay = (date1: Date | null, date2: Date | null): boolean => {
  if (!date1 || !date2) {
    return false;
  }
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

/**
 * Check if a date is between two dates (inclusive)
 */
export const isDateInRange = (
  date: Date,
  startDate: Date | null,
  endDate: Date | null
): boolean => {
  if (!startDate || !endDate) {
    return false;
  }
  const time = date.getTime();
  return time >= startDate.getTime() && time <= endDate.getTime();
};

/**
 * Check if a date is before another date
 */
export const isDateBefore = (date: Date, compareDate: Date): boolean => {
  return date.getTime() < compareDate.getTime();
};

/**
 * Check if a date is after another date
 */
export const isDateAfter = (date: Date, compareDate: Date): boolean => {
  return date.getTime() > compareDate.getTime();
};

/**
 * Format date to string
 */
export const formatDate = (date: Date | null, format = 'MM/DD/YYYY'): string => {
  if (!date) {
    return '';
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const padZero = (num: number) => num.toString().padStart(2, '0');

  return format
    .replace('YYYY', year.toString())
    .replace('YY', year.toString().slice(-2))
    .replace('MM', padZero(month))
    .replace('M', month.toString())
    .replace('DD', padZero(day))
    .replace('D', day.toString());
};

/**
 * Parse date string to Date object
 */
export const parseDate = (dateString: string, format = 'MM/DD/YYYY'): Date | null => {
  if (!dateString) {
    return null;
  }

  try {
    // Simple parser for MM/DD/YYYY format
    if (format === 'MM/DD/YYYY') {
      const parts = dateString.split('/');
      if (parts.length !== 3) {
        return null;
      }

      const month = parseInt(parts[0], 10) - 1;
      const day = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);

      const date = new Date(year, month, day);
      if (isNaN(date.getTime())) {
        return null;
      }

      return date;
    }

    // Fallback to Date constructor
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};

/**
 * Get month name
 */
export const getMonthName = (month: number, short = false): string => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const name = months[month];
  return short ? name.slice(0, 3) : name;
};

/**
 * Get day name
 */
export const getDayName = (day: number, short = true): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const name = days[day];
  return short ? name.slice(0, 2) : name;
};

/**
 * Add months to a date
 */
export const addMonths = (date: Date, months: number): Date => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

/**
 * Add days to a date
 */
export const addDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

/**
 * Get difference in days between two dates
 */
export const getDaysDifference = (date1: Date, date2: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((date2.getTime() - date1.getTime()) / oneDay);
};

/**
 * Check if year is a leap year
 */
export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

/**
 * Clamp date between min and max
 */
export const clampDate = (date: Date, minDate?: Date, maxDate?: Date): Date => {
  let clampedDate = new Date(date);

  if (minDate && clampedDate < minDate) {
    clampedDate = new Date(minDate);
  }

  if (maxDate && clampedDate > maxDate) {
    clampedDate = new Date(maxDate);
  }

  return clampedDate;
};

/**
 * Check if date is disabled based on constraints
 */
export const isDateDisabled = (
  date: Date,
  minDate?: Date,
  maxDate?: Date,
  disabledDates?: Date[]
): boolean => {
  // Check min/max constraints
  if (minDate && isDateBefore(date, minDate)) {
    return true;
  }
  if (maxDate && isDateAfter(date, maxDate)) {
    return true;
  }

  // Check disabled dates
  if (disabledDates) {
    return disabledDates.some((disabledDate) => isSameDay(date, disabledDate));
  }

  return false;
};

/**
 * Get array of years for year selector
 */
export const getYearRange = (startYear?: number, endYear?: number): number[] => {
  const currentYear = new Date().getFullYear();
  const start = startYear || currentYear - 100;
  const end = endYear || currentYear + 10;

  const years: number[] = [];
  for (let year = start; year <= end; year++) {
    years.push(year);
  }

  return years;
};

/**
 * Set time to start of day (00:00:00)
 */
export const startOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

/**
 * Set time to end of day (23:59:59)
 */
export const endOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};
