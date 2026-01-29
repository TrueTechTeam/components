import { useState, useCallback } from 'react';
import type { SortState, SortDirection } from '../types';

export interface UseTableSortOptions {
  sort?: SortState;
  defaultSort?: SortState;
  onSortChange?: (sort: SortState) => void;
}

export interface UseTableSortReturn {
  sort: SortState;
  onSort: (column: string) => void;
}

const DEFAULT_SORT: SortState = { column: null, direction: null };

export function useTableSort({
  sort: controlledSort,
  defaultSort = DEFAULT_SORT,
  onSortChange,
}: UseTableSortOptions): UseTableSortReturn {
  const [uncontrolledSort, setUncontrolledSort] = useState<SortState>(defaultSort);

  const isControlled = controlledSort !== undefined;
  const sort = isControlled ? controlledSort : uncontrolledSort;

  const onSort = useCallback(
    (column: string) => {
      let newDirection: SortDirection = 'asc';

      // Cycle through: none -> asc -> desc -> none
      if (sort.column === column) {
        if (sort.direction === 'asc') {
          newDirection = 'desc';
        } else if (sort.direction === 'desc') {
          newDirection = null;
        }
      }

      const newSort: SortState = {
        column: newDirection ? column : null,
        direction: newDirection,
      };

      if (!isControlled) {
        setUncontrolledSort(newSort);
      }
      onSortChange?.(newSort);
    },
    [sort, isControlled, onSortChange]
  );

  return { sort, onSort };
}
