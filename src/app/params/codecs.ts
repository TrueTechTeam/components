/** Reads and writes one typed URL search param. `parse` never throws and never returns NaN. */
export interface ParamCodec<T> {
  /** `raw` is the first value of the param, or null when absent. Invalid input yields `default`. */
  parse(raw: string | null): T;
  /** null removes the param. */
  serialize(v: T): string | null;
  default: T;
}

function string(def = ''): ParamCodec<string> {
  return { default: def, parse: (raw) => raw ?? def, serialize: (v) => v };
}

function number(def = 0): ParamCodec<number> {
  return {
    default: def,
    parse(raw) {
      if (raw === null || raw.trim() === '') {
        return def;
      }
      const n = Number(raw);
      return Number.isFinite(n) ? n : def;
    },
    serialize: (v) => (Number.isFinite(v) ? String(v) : null),
  };
}

function boolean(def = false): ParamCodec<boolean> {
  return {
    default: def,
    parse(raw) {
      if (raw === 'true' || raw === '1') {
        return true;
      }
      if (raw === 'false' || raw === '0') {
        return false;
      }
      return def;
    },
    serialize: (v) => String(v),
  };
}

function enumCodec<T extends string>(values: readonly T[], def: T): ParamCodec<T> {
  return {
    default: def,
    parse: (raw) =>
      raw !== null && (values as readonly string[]).includes(raw) ? (raw as T) : def,
    serialize: (v) => v,
  };
}

/** Comma-separated; values must not contain commas. Empty segments are dropped. */
function array(def: string[] = []): ParamCodec<string[]> {
  return {
    default: def,
    parse: (raw) => (raw === null ? def : raw.split(',').filter(Boolean)),
    serialize: (v) => v.join(','),
  };
}

/** Typed URL param codecs for `usePageParams` and `usePreference`. */
export const param = { string, number, boolean, enum: enumCodec, array };
