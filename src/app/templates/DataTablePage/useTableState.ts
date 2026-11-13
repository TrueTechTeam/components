import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { FilterValue } from '../../../lib/components/filters';
import { param, type ParamCodec } from '../../params/codecs';
import { usePageParams } from '../../params/usePageParams';

export type TableView = 'table' | 'grid' | 'list';
export interface TableSort {
  key: string;
  direction: 'asc' | 'desc';
}

export interface TableState {
  page: number;
  pageSize: number;
  sort?: TableSort;
  search: string;
  filters: Record<string, FilterValue>;
  view: TableView;
  selected: string | null;
}

export interface UseTableStateOptions {
  /** @default 10 */
  defaultPageSize?: number;
  defaultSort?: TableState['sort'];
  /** Allowed views; the first is the default. @default ['table'] */
  views?: TableView[];
  /** Allowed page sizes; any other `?size=` falls back to `defaultPageSize`. */
  pageSizes?: number[];
}

const ALL_VIEWS: TableView[] = ['table', 'grid', 'list'];

/**
 * `?sort=key:asc`. Without the param the default applies; `?sort=` (empty) means "unsorted",
 * so clearing a default sort survives a reload.
 */
export function sortCodec(def?: TableSort): ParamCodec<TableSort | null> {
  const fallback = def ?? null;
  return {
    default: fallback,
    parse(raw) {
      if (raw === null) {
        return fallback;
      }
      if (raw === '') {
        return null;
      }
      const at = raw.lastIndexOf(':');
      const direction = raw.slice(at + 1);
      if (at <= 0 || (direction !== 'asc' && direction !== 'desc')) {
        return fallback;
      }
      return { key: raw.slice(0, at), direction };
    },
    serialize: (v) => (v ? `${v.key}:${v.direction}` : def ? '' : null),
  };
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

/** `?f=` holds the active filters as JSON; dates round-trip as ISO strings. */
export const filtersCodec: ParamCodec<Record<string, FilterValue>> = {
  default: {},
  parse(raw) {
    if (!raw) {
      return {};
    }
    try {
      const value: unknown = JSON.parse(raw, (_key, v: unknown) =>
        typeof v === 'string' && ISO_DATE.test(v) ? new Date(v) : v
      );
      return value !== null && typeof value === 'object' && !Array.isArray(value)
        ? (value as Record<string, FilterValue>)
        : {};
    } catch {
      return {};
    }
  },
  serialize: (v) => (Object.keys(v).length === 0 ? null : JSON.stringify(v)),
};

const sameJson = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/**
 * Collection page state bound to the URL: `page`, `size`, `sort` (`key:asc`), `q`, `f` (JSON
 * filters), `view` and `selected`. Malformed values fall back to their defaults. The setter
 * merges a patch; changing search, filters, sort or page size returns to page 1.
 */
export function useTableState(
  opts: UseTableStateOptions = {}
): [TableState, (patch: Partial<TableState>) => void] {
  const { defaultPageSize = 10, defaultSort, views = ['table'], pageSizes } = opts;
  const allowedViews = views.filter((v) => ALL_VIEWS.includes(v));
  const defaultView = allowedViews[0] ?? 'table';
  const sortKey = defaultSort ? `${defaultSort.key}:${defaultSort.direction}` : '';

  const schema = useMemo(
    () => ({
      page: param.number(1),
      size: param.number(defaultPageSize),
      sort: sortCodec(defaultSort),
      q: param.string(''),
      f: filtersCodec,
      view: param.enum(allowedViews.length > 0 ? allowedViews : ['table'], defaultView),
      selected: param.string(''),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on the option values
    [defaultPageSize, sortKey, allowedViews.join(','), defaultView]
  );
  const [params, setParams] = usePageParams(schema);

  const sizeKey = pageSizes?.join(',');
  const state = useMemo<TableState>(() => {
    const size = Math.floor(params.size);
    const sizeOk = size >= 1 && (!pageSizes || pageSizes.includes(size));
    return {
      page: Math.max(1, Math.floor(params.page)),
      pageSize: sizeOk ? size : defaultPageSize,
      sort: params.sort ?? undefined,
      search: params.q,
      filters: params.f,
      view: params.view,
      selected: params.selected === '' ? null : params.selected,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pageSizes compared by value
  }, [params, defaultPageSize, sizeKey]);

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  });

  const setState = useCallback(
    (patch: Partial<TableState>) => {
      const current = stateRef.current;
      const has = (key: keyof TableState) => key in patch && !sameJson(patch[key], current[key]);
      const resets = has('search') || has('filters') || has('sort') || has('pageSize');
      const next: Partial<typeof params> = {};
      const page = 'page' in patch ? patch.page : resets ? 1 : undefined;
      if (page !== undefined) {
        next.page = page;
      }
      if ('pageSize' in patch) {
        next.size = patch.pageSize;
      }
      if ('sort' in patch) {
        next.sort = patch.sort ?? null;
      }
      if ('search' in patch) {
        next.q = patch.search;
      }
      if ('filters' in patch) {
        next.f = patch.filters ?? {};
      }
      if ('view' in patch) {
        next.view = patch.view;
      }
      if ('selected' in patch) {
        next.selected = patch.selected ?? '';
      }
      // Several setter calls in one event build on the pending URL, so keep the ref in step.
      stateRef.current = { ...current, ...patch, page: page ?? current.page };
      // Opening a detail adds a history entry, so Back closes it.
      setParams(next, { replace: !(typeof patch.selected === 'string' && patch.selected !== '') });
    },
    [setParams]
  );

  return [state, setState];
}
