/**
 * DataTable helpers - deriving filters from columns and applying them to data
 */

import type { FilterDefinition, FilterOption, FilterType, FilterValue } from '../../filters';
import { isSameDay } from '../../../utils/dateUtils';
import type { DataTableColumnConfig } from './DataTable.types';

const MAX_AUTO_SELECT_OPTIONS = 20;

interface NumberRangeLike {
  min?: number;
  max?: number;
}

interface DateRangeLike {
  startDate?: Date | null;
  endDate?: Date | null;
}

/**
 * The empty/default value for a filter, matching `FilterProvider`'s own defaults.
 * Used to backfill any filter ids missing from a controlled `filterValues` object,
 * since `FilterProvider` does not fill in per-filter defaults for controlled values.
 */
export function getDefaultFilterValue(filter: FilterDefinition): FilterValue {
  if (filter.defaultValue !== undefined) {
    return filter.defaultValue;
  }

  switch (filter.type) {
    case 'select':
    case 'text':
      return '';
    case 'multi-select':
    case 'list-select':
      return [];
    case 'checkbox':
    case 'toggle':
      return false;
    case 'number':
    case 'rating':
      return 0;
    case 'number-range':
      return { min: undefined, max: undefined };
    case 'date':
      return null;
    case 'date-range':
      return { startDate: null, endDate: null };
    default:
      return '';
  }
}

function inferFilterFromColumn<T extends Record<string, unknown>>(
  column: DataTableColumnConfig<T>,
  data: T[]
): FilterDefinition {
  const id = String(column.key);
  const override = column.filterable === true ? {} : (column.filterable ?? {});

  const label = override.label ?? (typeof column.header === 'string' ? column.header : id);

  const rawValues = (data.map((row) => row[id as keyof T]) as unknown[]).filter(
    (value) => value !== null && value !== undefined
  );
  const sample = rawValues[0];

  let type: FilterType = override.type ?? 'text';

  if (!override.type) {
    if (typeof sample === 'boolean') {
      // Not `toggle`: FilterProvider treats a toggle's `false` default as always
      // "active", which would make an auto-derived boolean filter permanently
      // apply. `select` with explicit Yes/No options stays optional like every
      // other derived filter, only applying once a value is chosen.
      type = 'select';
    } else if (sample instanceof Date) {
      type = 'date-range';
    } else if (typeof sample === 'number') {
      type = 'number-range';
    } else {
      const uniqueCount = new Set(rawValues.map(String)).size;
      type = uniqueCount > 0 && uniqueCount <= MAX_AUTO_SELECT_OPTIONS ? 'select' : 'text';
    }
  }

  let options: FilterOption[] | undefined = override.options;
  if (!options && typeof sample === 'boolean') {
    options = [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' },
    ];
  } else if (!options && (type === 'select' || type === 'multi-select' || type === 'list-select')) {
    const unique = Array.from(new Set(rawValues.map(String))).sort();
    options = unique.map((value) => ({ value, label: value }));
  }

  let config = override.config;
  if (!config && type === 'number-range') {
    const nums = rawValues.filter((value): value is number => typeof value === 'number');
    // `inputs` (labeled Min/Max fields), not the default `slider`: a slider's width is
    // fixed by the track/thumbs and doesn't compress well inside a narrow filter panel,
    // where it can end up wider than the panel itself.
    config = { displayMode: 'inputs', showLabels: true };
    if (nums.length > 0) {
      config = { ...config, min: Math.min(...nums), max: Math.max(...nums) };
    }
  }

  return {
    ...override,
    id,
    type,
    label,
    options,
    config,
  } as FilterDefinition;
}

/**
 * Builds a `FilterDefinition[]` from any column marked `filterable`.
 */
export function deriveFiltersFromColumns<T extends Record<string, unknown>>(
  columns: Array<DataTableColumnConfig<T>>,
  data: T[]
): FilterDefinition[] {
  return columns
    .filter((column) => column.filterable)
    .map((column) => inferFilterFromColumn(column, data));
}

function rowMatchesFilter<T extends Record<string, unknown>>(
  row: T,
  filter: FilterDefinition,
  value: FilterValue
): boolean {
  const raw = row[filter.id as keyof T] as unknown;

  switch (filter.type) {
    case 'text': {
      const query = String(value ?? '')
        .trim()
        .toLowerCase();
      if (!query) {
        return true;
      }
      return String(raw ?? '')
        .toLowerCase()
        .includes(query);
    }

    case 'select':
      return String(raw ?? '') === String(value ?? '');

    case 'multi-select':
    case 'list-select': {
      const selected = (value as string[] | undefined) ?? [];
      if (selected.length === 0) {
        return true;
      }
      return selected.includes(String(raw ?? ''));
    }

    case 'checkbox':
    case 'toggle':
      // Treated as an opt-in "only show matching rows" constraint (the common case for a
      // data-table filter, e.g. "In stock only"): off/false never excludes rows, since
      // FilterProvider considers a toggle's `false` default "active" and would otherwise
      // permanently hide every non-matching row before the user has touched the filter.
      return value !== true || Boolean(raw) === true;

    case 'number':
      return Number(raw) === Number(value);

    case 'number-range': {
      const { min, max } = (value as NumberRangeLike | undefined) ?? {};
      const num = Number(raw);
      if (Number.isNaN(num)) {
        return false;
      }
      if (min !== undefined && num < min) {
        return false;
      }
      if (max !== undefined && num > max) {
        return false;
      }
      return true;
    }

    case 'date':
      return isSameDay(raw instanceof Date ? raw : null, value instanceof Date ? value : null);

    case 'date-range': {
      const { startDate, endDate } = (value as DateRangeLike | undefined) ?? {};
      if (!(raw instanceof Date)) {
        return false;
      }
      if (startDate && raw < startDate) {
        return false;
      }
      if (endDate && raw > endDate) {
        return false;
      }
      return true;
    }

    case 'rating':
      return Number(raw) >= Number(value);

    default:
      return true;
  }
}

/**
 * Filters `data` against the currently active values for the given filters.
 * Only filters present in `activeValues` (i.e. non-empty) are applied.
 */
export function applyDataTableFilters<T extends Record<string, unknown>>(
  data: T[],
  filters: FilterDefinition[],
  activeValues: Record<string, FilterValue>
): T[] {
  const activeFilters = filters.filter((filter) => filter.id in activeValues);
  if (activeFilters.length === 0) {
    return data;
  }
  return data.filter((row) =>
    activeFilters.every((filter) => rowMatchesFilter(row, filter, activeValues[filter.id]))
  );
}
