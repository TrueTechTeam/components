import { useState, useCallback, useMemo } from 'react';
import type { SelectionMode } from '../types';

export interface UseTableSelectionOptions {
  selectionMode: SelectionMode;
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
  allRowKeys: string[];
}

export interface UseTableSelectionReturn {
  selectedKeys: Set<string>;
  onSelectRow: (key: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
}

export function useTableSelection({
  selectionMode,
  selectedKeys: controlledKeys,
  defaultSelectedKeys = [],
  onSelectionChange,
  allRowKeys,
}: UseTableSelectionOptions): UseTableSelectionReturn {
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

  const onSelectRow = useCallback(
    (key: string, selected: boolean) => {
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

      const newKeys = selected ? new Set(allRowKeys) : new Set<string>();
      updateSelection(newKeys);
    },
    [selectionMode, allRowKeys, updateSelection]
  );

  const isAllSelected = useMemo(
    () => allRowKeys.length > 0 && allRowKeys.every((key) => selectedSet.has(key)),
    [allRowKeys, selectedSet]
  );

  const isIndeterminate = useMemo(
    () => selectedSet.size > 0 && !isAllSelected,
    [selectedSet.size, isAllSelected]
  );

  return {
    selectedKeys: selectedSet,
    onSelectRow,
    onSelectAll,
    isAllSelected,
    isIndeterminate,
  };
}
