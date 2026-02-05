import { useState, useCallback, useMemo } from 'react';
import type { UseListExpandOptions, UseListExpandReturn } from '../types';

/**
 * Hook for managing expandable list items
 * Supports controlled/uncontrolled patterns
 */
export function useListExpand({
  expandedKeys: controlledKeys,
  defaultExpandedKeys = [],
  onExpandChange,
}: UseListExpandOptions): UseListExpandReturn {
  const [uncontrolledKeys, setUncontrolledKeys] = useState<Set<string>>(
    new Set(defaultExpandedKeys)
  );

  const isControlled = controlledKeys !== undefined;
  const expandedSet = useMemo(
    () => (isControlled ? new Set(controlledKeys) : uncontrolledKeys),
    [isControlled, controlledKeys, uncontrolledKeys]
  );

  const onExpandItem = useCallback(
    (key: string) => {
      const newKeys = new Set(expandedSet);

      if (newKeys.has(key)) {
        newKeys.delete(key);
      } else {
        newKeys.add(key);
      }

      if (!isControlled) {
        setUncontrolledKeys(newKeys);
      }
      onExpandChange?.(Array.from(newKeys));
    },
    [expandedSet, isControlled, onExpandChange]
  );

  const isExpanded = useCallback((key: string) => expandedSet.has(key), [expandedSet]);

  return {
    expandedKeys: expandedSet,
    onExpandItem,
    isExpanded,
  };
}
