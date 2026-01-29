import { useState, useCallback } from 'react';

export interface UseTableExpandOptions {
  expandedKeys?: string[];
  defaultExpandedKeys?: string[];
  onExpandChange?: (keys: string[]) => void;
}

export interface UseTableExpandReturn {
  expandedKeys: Set<string>;
  onExpand: (key: string, expanded: boolean) => void;
}

export function useTableExpand({
  expandedKeys: controlledKeys,
  defaultExpandedKeys = [],
  onExpandChange,
}: UseTableExpandOptions): UseTableExpandReturn {
  const [uncontrolledKeys, setUncontrolledKeys] = useState<Set<string>>(
    new Set(defaultExpandedKeys)
  );

  const isControlled = controlledKeys !== undefined;
  const expandedSet = isControlled ? new Set(controlledKeys) : uncontrolledKeys;

  const onExpand = useCallback(
    (key: string, expanded: boolean) => {
      const newKeys = new Set(expandedSet);

      if (expanded) {
        newKeys.add(key);
      } else {
        newKeys.delete(key);
      }

      if (!isControlled) {
        setUncontrolledKeys(newKeys);
      }
      onExpandChange?.(Array.from(newKeys));
    },
    [expandedSet, isControlled, onExpandChange]
  );

  return {
    expandedKeys: expandedSet,
    onExpand,
  };
}
