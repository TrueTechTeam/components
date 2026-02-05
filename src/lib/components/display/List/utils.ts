/**
 * Utility functions for the List component
 */

/**
 * Get a nested property value from an object using dot notation
 * @param obj - The object to get the value from
 * @param path - The path to the property (e.g., 'user.name')
 * @returns The value at the path, or undefined if not found
 */
export function getNestedValue<T>(obj: T, path: string): unknown {
  return path.split('.').reduce((acc: unknown, part: string) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
}

/**
 * Format a value for display
 * @param value - The value to format
 * @returns A string representation of the value
 */
export function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

/**
 * Generate a stable key from an item
 * @param item - The item to generate a key for
 * @param index - The index of the item
 * @param keyField - Optional field to use as the key
 * @returns A stable key string
 */
export function generateItemKey<T extends Record<string, unknown>>(
  item: T,
  index: number,
  keyField?: keyof T
): string {
  if (keyField && item[keyField] !== undefined) {
    return String(item[keyField]);
  }

  // Try common key fields
  const commonKeyFields = ['id', 'key', '_id', 'uuid'] as const;
  for (const field of commonKeyFields) {
    if (field in item && item[field as keyof T] !== undefined) {
      return String(item[field as keyof T]);
    }
  }

  // Fall back to index
  return String(index);
}

/**
 * Search items using a simple text match
 * @param items - The items to search
 * @param query - The search query
 * @param fields - Fields to search in
 * @returns Filtered items
 */
export function searchItems<T extends Record<string, unknown>>(
  items: T[],
  query: string,
  fields?: Array<keyof T>
): T[] {
  if (!query.trim()) {
    return items;
  }

  const lowerQuery = query.toLowerCase();
  const searchFields = fields || (Object.keys(items[0] || {}) as Array<keyof T>);

  return items.filter((item) =>
    searchFields.some((field) => {
      const value = item[field];
      if (value === null || value === undefined) {
        return false;
      }
      return String(value).toLowerCase().includes(lowerQuery);
    })
  );
}

/**
 * Group items by a key or function
 * @param items - The items to group
 * @param groupBy - The field or function to group by
 * @returns Map of group key to items
 */
export function groupItems<T extends Record<string, unknown>>(
  items: T[],
  groupBy: keyof T | ((item: T) => string)
): Map<string, T[]> {
  const groups = new Map<string, T[]>();

  items.forEach((item) => {
    const groupKey =
      typeof groupBy === 'function' ? groupBy(item) : String(item[groupBy] ?? 'Other');

    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)?.push(item);
  });

  return groups;
}

/**
 * Sort items by a key
 * @param items - The items to sort
 * @param sortKey - The key to sort by
 * @param direction - Sort direction ('asc' or 'desc')
 * @returns Sorted items
 */
export function sortItems<T extends Record<string, unknown>>(
  items: T[],
  sortKey: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (aValue === bValue) {
      return 0;
    }
    if (aValue === null || aValue === undefined) {
      return 1;
    }
    if (bValue === null || bValue === undefined) {
      return -1;
    }

    let comparison = 0;
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    } else if (aValue instanceof Date && bValue instanceof Date) {
      comparison = aValue.getTime() - bValue.getTime();
    } else {
      comparison = String(aValue).localeCompare(String(bValue));
    }

    return direction === 'desc' ? -comparison : comparison;
  });
}
