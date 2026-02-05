import { useState, useMemo, useCallback } from 'react';
import type { UseListGroupsOptions, UseListGroupsReturn, ListGroup } from '../types';

/**
 * Hook for grouping list items with collapsible support
 * Supports controlled/uncontrolled patterns for collapsed state
 */
export function useListGroups<T extends Record<string, unknown>>({
  data,
  groupBy,
  collapsedGroups: controlledCollapsed,
  defaultCollapsedGroups = [],
  onCollapsedGroupsChange,
}: UseListGroupsOptions<T>): UseListGroupsReturn<T> {
  const [uncontrolledCollapsed, setUncontrolledCollapsed] = useState<Set<string>>(
    new Set(defaultCollapsedGroups)
  );

  const isControlled = controlledCollapsed !== undefined;
  const collapsedSet = useMemo(
    () => (isControlled ? new Set(controlledCollapsed) : uncontrolledCollapsed),
    [isControlled, controlledCollapsed, uncontrolledCollapsed]
  );

  // Group items by the specified key or function
  const groups = useMemo<Array<ListGroup<T>>>(() => {
    if (!groupBy) {
      return [{ key: '__default__', items: data }];
    }

    const groupMap = new Map<string, T[]>();

    data.forEach((item) => {
      const groupKey =
        typeof groupBy === 'function' ? groupBy(item) : String(item[groupBy] ?? 'Other');

      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, []);
      }
      groupMap.get(groupKey)?.push(item);
    });

    return Array.from(groupMap.entries()).map(([key, items]) => ({
      key,
      items,
    }));
  }, [data, groupBy]);

  const onToggleGroup = useCallback(
    (groupKey: string) => {
      const newCollapsed = new Set(collapsedSet);

      if (newCollapsed.has(groupKey)) {
        newCollapsed.delete(groupKey);
      } else {
        newCollapsed.add(groupKey);
      }

      if (!isControlled) {
        setUncontrolledCollapsed(newCollapsed);
      }
      onCollapsedGroupsChange?.(Array.from(newCollapsed));
    },
    [collapsedSet, isControlled, onCollapsedGroupsChange]
  );

  const isGroupCollapsed = useCallback(
    (groupKey: string) => collapsedSet.has(groupKey),
    [collapsedSet]
  );

  return {
    groups,
    collapsedGroups: collapsedSet,
    onToggleGroup,
    isGroupCollapsed,
  };
}
