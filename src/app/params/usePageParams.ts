import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useRouterAdapter } from '../router/RouterContext';
import type { RouterAdapter } from '../router/types';
import type { ParamCodec } from './codecs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- codecs of any value type
export type ParamSchema = Record<string, ParamCodec<any>>;
export type ParamValues<S extends ParamSchema> = { [K in keyof S]: S[K]['default'] };
export type SetParams<S extends ParamSchema> = (
  patch: Partial<ParamValues<S>>,
  opts?: { replace?: boolean }
) => void;

/** `usePageParams` against an explicit adapter (null only when `schema` is empty). Internal. */
export function useParamsFromAdapter<S extends ParamSchema>(
  adapter: RouterAdapter | null,
  schema: S
): [ParamValues<S>, SetParams<S>] {
  const searchParams = adapter?.searchParams;
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
  const adapterRef = useRef(adapter);
  /** Params as last written, so several updates before the next render compose. */
  const latestRef = useRef(searchParams);
  useEffect(() => {
    schemaRef.current = schema;
    adapterRef.current = adapter;
  });
  useEffect(() => {
    latestRef.current = searchParams;
  }, [searchParams]);

  const setParams = useCallback<SetParams<S>>((patch, opts) => {
    const current = schemaRef.current;
    const before = new URLSearchParams(latestRef.current);
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
    latestRef.current = next;
    adapterRef.current?.setSearchParams(next, { replace: opts?.replace ?? true });
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
  return useParamsFromAdapter(useRouterAdapter(), schema);
}
