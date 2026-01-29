import { useState, useCallback, useMemo } from 'react';
import type { UseListSelectionOptions, UseListSelectionReturn } from '../types';

/**
 * Hook for managing list item selection
 * Supports single and multiple selection modes with controlled/uncontrolled patterns
 */
export function useListSelection({
  selectionMode,
  selectedKeys: controlledKeys,
  defaultSelectedKeys = [],
  onSelectionChange,
  allItemKeys,
}: UseListSelectionOptions): UseListSelectionReturn {
  const [uncontrolledKeys, setUncontrolledKeys] = useState<Set<string>>(
    new Set(defaultSelectedKeys)
  );

  const isControlled = controlledKeys !== undefined;
  const selectedSet = isControlled ? new Set(controlledKeys) : uncontrolledKeys;

  const updateSelection = useCallback(
    (newKeys: Set<string>) => {
      if (!isControlled) {
        setUncontrolledKeys(newKeys);
      }
      onSelectionChange?.(Array.from(newKeys));
    },
    [isControlled, onSelectionChange]
  );

  const onSelectItem = useCallback(
    (key: string, selected: boolean) => {
      if (selectionMode === 'none') {return;}

      const newKeys = new Set(selectedSet);

      if (selectionMode === 'single') {
        newKeys.clear();
        if (selected) {newKeys.add(key);}
      } else if (selectionMode === 'multiple') {
        if (selected) {
          newKeys.add(key);
        } else {
          newKeys.delete(key);
        }
      }

      updateSelection(newKeys);
    },
    [selectionMode, selectedSet, updateSelection]
  );

  const onSelectAll = useCallback(
    (selected: boolean) => {
      if (selectionMode !== 'multiple') {return;}

      const newKeys = selected ? new Set(allItemKeys) : new Set<string>();
      updateSelection(newKeys);
    },
    [selectionMode, allItemKeys, updateSelection]
  );

  const isAllSelected = useMemo(
    () => allItemKeys.length > 0 && allItemKeys.every((key) => selectedSet.has(key)),
    [allItemKeys, selectedSet]
  );

  const isIndeterminate = useMemo(
    () => selectedSet.size > 0 && !isAllSelected,
    [selectedSet.size, isAllSelected]
  );

  return {
    selectedKeys: selectedSet,
    onSelectItem,
    onSelectAll,
    isAllSelected,
    isIndeterminate,
  };
}
