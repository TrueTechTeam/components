import type { ReactNode } from 'react';
import type { ColumnConfig, ColumnAlign, SortState } from './types';

// ============================================================
// Column Width Calculation
// ============================================================

/**
 * Default minimum column width in pixels
 */
const DEFAULT_MIN_WIDTH = 80;

/**
 * Approximate character width in pixels (based on typical font sizes)
 */
const CHAR_WIDTH_PX = 8;

/**
 * Padding per cell (both sides)
 */
const CELL_PADDING_PX = 24;

/**
 * Extra padding added to calculated column widths
 */
const EXTRA_PADDING_PX = 16;

/**
 * Calculate the maximum content width for a column based on data
 */
function calculateMaxColumnWidth<T>(data: T[], columnKey: string, headerText: string): number {
  // Calculate header width
  const headerWidth = headerText.length * CHAR_WIDTH_PX + CELL_PADDING_PX;

  if (data.length === 0) {
    return Math.max(headerWidth, DEFAULT_MIN_WIDTH) + EXTRA_PADDING_PX;
  }

  // Calculate maximum content width from data
  let maxContentWidth = 0;

  for (const row of data) {
    const value = getCellValue(row, columnKey);
    if (value !== null && value !== undefined) {
      const strValue = formatCellValueForWidth(value);
      const contentWidth = strValue.length * CHAR_WIDTH_PX + CELL_PADDING_PX;
      if (contentWidth > maxContentWidth) {
        maxContentWidth = contentWidth;
      }
    }
  }

  // Return max of header width, content width, and minimum, plus extra padding
  return Math.max(maxContentWidth, headerWidth, DEFAULT_MIN_WIDTH) + EXTRA_PADDING_PX;
}

/**
 * Format cell value to string for width calculation
 */
function formatCellValueForWidth(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  if (typeof value === 'number') {
    return value.toLocaleString();
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  return String(value);
}

/**
 * Check if a width value is dynamic (uses fractional units)
 */
function isDynamicWidth(width: string): boolean {
  return width.includes('fr') || width === 'auto' || width.includes('minmax');
}

/**
 * Column width validation rules:
 * 1. All columns must have a minimum width > 0
 * 2. Only one column can have a dynamic width (1fr) to prevent uneven column widths
 * 3. If no width is specified, use the average size of data to calculate width
 */
export function calculateColumnWidths<T extends Record<string, unknown>>(
  columns: Array<ColumnConfig<T>>,
  data: T[]
): string[] {
  // First pass: identify columns with explicit widths and dynamic widths
  let dynamicColumnIndex = -1;
  const widths: string[] = [];

  for (let i = 0; i < columns.length; i++) {
    const col = columns[i];
    const headerText = typeof col.header === 'string' ? col.header : String(col.key);

    if (col.width) {
      // Column has explicit width
      if (isDynamicWidth(col.width)) {
        if (dynamicColumnIndex === -1) {
          // First dynamic column - allow it
          dynamicColumnIndex = i;
          widths.push('1fr');
        } else {
          // Additional dynamic columns - calculate fixed width instead
          const calculatedWidth = calculateMaxColumnWidth(data, String(col.key), headerText);
          widths.push(`${Math.round(calculatedWidth)}px`);
        }
      } else {
        // Fixed width - use as is
        widths.push(col.width);
      }
    } else {
      // No width specified - calculate from data
      const calculatedWidth = calculateMaxColumnWidth(data, String(col.key), headerText);
      widths.push(`${Math.round(calculatedWidth)}px`);
    }
  }

  // If no dynamic column was found, make the last column dynamic (if there are columns)
  // This ensures the table fills available space
  if (dynamicColumnIndex === -1 && widths.length > 0) {
    // Find the best candidate for dynamic width (usually the longest text column)
    let bestIndex = widths.length - 1;
    let maxWidth = 0;

    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      // Prefer columns that might have variable content (not numbers, not centered)
      if (col.align !== 'right' && col.align !== 'center') {
        const headerText = typeof col.header === 'string' ? col.header : String(col.key);
        const avgWidth = calculateMaxColumnWidth(data, String(col.key), headerText);
        if (avgWidth > maxWidth) {
          maxWidth = avgWidth;
          bestIndex = i;
        }
      }
    }

    // Convert the selected column to dynamic with a minimum width
    const minWidth = widths[bestIndex].replace('px', '');
    widths[bestIndex] = `minmax(${minWidth}px, 1fr)`;
  }

  return widths;
}

/**
 * Auto-generate columns from the first data item's keys
 */
export function autoGenerateColumns<T extends Record<string, unknown>>(
  data: T[]
): Array<ColumnConfig<T>> {
  if (data.length === 0) {
    return [];
  }

  const firstRow = data[0];
  return Object.keys(firstRow).map((key) => ({
    key: key as keyof T,
    header: formatHeaderFromKey(key),
  }));
}

/**
 * Format header text from key (camelCase/snake_case -> Title Case)
 */
export function formatHeaderFromKey(key: string): string {
  return (
    key
      // Handle camelCase
      .replace(/([A-Z])/g, ' $1')
      // Handle snake_case
      .replace(/_/g, ' ')
      // Capitalize first letter of each word
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .trim()
  );
}

/**
 * Detect column alignment based on data type
 */
export function detectAlignment(value: unknown): ColumnAlign {
  if (typeof value === 'number') {
    return 'right';
  }
  if (typeof value === 'boolean') {
    return 'center';
  }
  return 'left';
}

/**
 * Get cell value by column key (supports dot notation for nested properties)
 */
export function getCellValue<T>(row: T, key: string): unknown {
  const keys = key.split('.');
  let value: unknown = row;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return undefined;
    }
  }

  return value;
}

/**
 * Default sort comparison function
 */
export function defaultSortFn<T>(a: T, b: T, column: string, direction: 'asc' | 'desc'): number {
  const aVal = getCellValue(a, column);
  const bVal = getCellValue(b, column);

  let comparison = 0;

  // Handle null/undefined
  if (aVal === null || aVal === undefined) {
    comparison = 1;
  } else if (bVal === null || bVal === undefined) {
    comparison = -1;
  }
  // Numbers
  else if (typeof aVal === 'number' && typeof bVal === 'number') {
    comparison = aVal - bVal;
  }
  // Dates
  else if (aVal instanceof Date && bVal instanceof Date) {
    comparison = aVal.getTime() - bVal.getTime();
  }
  // Booleans
  else if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
    comparison = aVal === bVal ? 0 : aVal ? -1 : 1;
  }
  // Strings (and fallback)
  else {
    comparison = String(aVal).localeCompare(String(bVal));
  }

  return direction === 'desc' ? -comparison : comparison;
}

/**
 * Sort data by column
 */
export function sortData<T>(data: T[], sort: SortState, columns: Array<ColumnConfig<T>>): T[] {
  if (!sort.column || !sort.direction) {
    return data;
  }

  const column = columns.find((col) => col.key === sort.column);
  const sortFn = column?.sortFn;
  const { column: sortColumn, direction } = sort;

  return [...data].sort((a, b) => {
    if (sortFn && direction) {
      return sortFn(a, b, direction);
    }
    if (sortColumn && direction) {
      return defaultSortFn(a, b, sortColumn, direction);
    }
    return 0;
  });
}

/**
 * Format cell value for display
 */
export function formatCellValue(value: unknown): ReactNode {
  if (value === null || value === undefined) {
    return '-';
  }
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (typeof value === 'number') {
    return value.toLocaleString();
  }
  return String(value);
}
