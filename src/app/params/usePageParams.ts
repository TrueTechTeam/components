import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouterContext, type RouterContextValue } from '../router/RouterContext';
import type { ParamCodec } from './codecs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- codecs of any value type
export type ParamSchema = Record<string, ParamCodec<any>>;
export type ParamValues<S extends ParamSchema> = { [K in keyof S]: S[K]['default'] };
export type SetParams<S extends ParamSchema> = (
  patch: Partial<ParamValues<S>>,
  opts?: { replace?: boolean }
) => void;

const useNoSearchParams = (): URLSearchParams | null => null;

/** `usePageParams` against an explicit router context (null only when `schema` is empty). Internal. */
export function useParamsFromRouter<S extends ParamSchema>(
  router: RouterContextValue | null,
  schema: S
): [ParamValues<S>, SetParams<S>] {
  const adapter = router?.adapter ?? null;
  // Picked once so the hook order never changes (an adapter keeps its `useSearchParams`).
  const [useAdapterSearchParams] = useState(() => adapter?.useSearchParams ?? useNoSearchParams);
  const searchParams = useAdapterSearchParams() ?? adapter?.searchParams;
  const committed = searchParams?.toString() ?? '';

  const keys = Object.keys(schema);
  // The first value of a repeated key wins; codecs turn malformed values into their default.
  const raws = keys.map((key) => searchParams?.get(key) ?? null);
  const signature = JSON.stringify([keys, raws]);

  const values = useMemo(
    () =>
      Object.fromEntries(keys.map((key, i) => [key, schema[key].parse(raws[i])])) as ParamValues<S>,
    // Re-parse only when these params change, so `values` stays referentially stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signature]
  );

  const schemaRef = useRef(schema);
  const routerRef = useRef(router);
  const committedRef = useRef(committed);
  useEffect(() => {
    schemaRef.current = schema;
    routerRef.current = router;
  });
  useEffect(() => {
    committedRef.current = committed;
    // The router committed a different URL (our write landed, or the user navigated): any pending
    // write is now reflected in, or superseded by, the committed params.
    const pending = routerRef.current?.pendingSearch;
    if (pending?.current && pending.current.from !== committed) {
      pending.current = null;
    }
  }, [committed]);

  const setParams = useCallback<SetParams<S>>((patch, opts) => {
    const ctx = routerRef.current;
    if (!ctx) {
      return;
    }
    const current = schemaRef.current;
    const from = committedRef.current;
    const pending = ctx.pendingSearch.current;
    // Writes made before the router re-renders (from any params hook) build on each other.
    const before = pending && pending.from === from ? pending.params : new URLSearchParams(from);
    const next = new URLSearchParams(before);
    for (const key of Object.keys(patch)) {
      const codec = current[key];
      if (!codec) {
        continue;
      }
      const value = patch[key as keyof S];
      const raw = value === undefined ? null : codec.serialize(value);
      if (raw === null || raw === codec.serialize(codec.default)) {
        next.delete(key);
      } else {
        next.set(key, raw);
      }
    }
    if (next.toString() === before.toString()) {
      return;
    }
    ctx.pendingSearch.current = { from, params: next };
    ctx.adapter.setSearchParams(next, { replace: opts?.replace ?? true });
  }, []);

  return [values, setParams];
}

/**
 * Typed URL search params for a page. Each value is parsed with its codec; missing or malformed
 * values (`?page=abc`, unknown enum values) yield the codec default, and a repeated key uses its
 * first value. `values` keeps its identity until one of the schema's params changes.
 *
 * The setter merges a patch: a value equal to its default (or `undefined`) removes the param, and
 * params outside the patch are kept. It replaces the history entry unless `{ replace: false }`.
 *
 * ```tsx
 * const [{ page, status }, setParams] = usePageParams({
 *   page: param.number(1),
 *   status: param.enum(['open', 'closed'], 'open'),
 * });
 * setParams({ page: page + 1 });
 * ```
 */
export function usePageParams<S extends ParamSchema>(schema: S): [ParamValues<S>, SetParams<S>] {
  return useParamsFromRouter(useRouterContext('usePageParams'), schema);
}
