import { useCallback, useContext } from 'react';
import { useLocalStorage } from '../../lib/hooks/useLocalStorage';
import { RouterContext } from '../router/RouterContext';
import { param, type ParamCodec } from './codecs';
import { PageIdContext } from './PageIdContext';
import { useParamsFromAdapter, type ParamSchema } from './usePageParams';

export interface UsePreferenceOptions<T> {
  /** `'url'` (default): a search param, shareable. `'local'`: this browser only. Keep it constant. */
  storage?: 'url' | 'local';
  /** URL codec. Default: inferred from the type of the default value. */
  codec?: ParamCodec<T>;
}

function jsonCodec<T>(def: T): ParamCodec<T> {
  return {
    default: def,
    parse(raw) {
      if (raw === null) {
        return def;
      }
      try {
        return JSON.parse(raw) as T;
      } catch {
        return def;
      }
    },
    serialize: (v) => JSON.stringify(v),
  };
}

function inferCodec<T>(def: T): ParamCodec<T> {
  const codec =
    typeof def === 'string'
      ? param.string(def)
      : typeof def === 'number'
        ? param.number(def)
        : typeof def === 'boolean'
          ? param.boolean(def)
          : Array.isArray(def) && def.every((v) => typeof v === 'string')
            ? param.array(def)
            : jsonCodec(def);
  return codec as unknown as ParamCodec<T>;
}

const noParams: ParamSchema = {};

/**
 * A user preference (view mode, page size, visible columns…). With `storage: 'url'` (default) it
 * is one search param read through `codec`; with `'local'` it is stored as JSON in localStorage
 * under `pref:<page id>:<key>` (page id from the enclosing `Page`, or `'app'`).
 */
export function usePreference<T>(
  key: string,
  def: T,
  opts: UsePreferenceOptions<T> = {}
): [T, (v: T) => void] {
  const { storage = 'url', codec } = opts;
  const pageId = useContext(PageIdContext);
  const router = useContext(RouterContext);
  if (storage === 'url' && !router) {
    throw new Error('usePreference must be used within AppProvider');
  }

  // Both stores are always read so the hook order never depends on `storage`.
  const [localValue, setLocalValue] = useLocalStorage<T>(`pref:${pageId ?? 'app'}:${key}`, def);
  const schema = storage === 'url' ? { [key]: codec ?? inferCodec(def) } : noParams;
  const [values, setValues] = useParamsFromAdapter(router?.adapter ?? null, schema);
  const setUrlValue = useCallback((v: T) => setValues({ [key]: v }), [setValues, key]);

  if (storage === 'local') {
    return [localValue, setLocalValue];
  }
  return [values[key] as T, setUrlValue];
}
