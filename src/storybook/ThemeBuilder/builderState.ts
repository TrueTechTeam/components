import type { ThemeColorOverrides, ThemeMode } from '../../lib/types/theme.types';
import { hexToRgb, oklchToHex, parseColorToOklch, rgbToHex } from '../../lib/utils/colorUtils';
import { DENSITY_MULTIPLIER, buildShadows, generateColors } from './generateTheme';
import { MOODS } from './moods';
import type { PaletteSuggestion } from './suggestPalettes';
import {
  DEFAULT_INPUTS,
  type ColorOverrides,
  type Density,
  type Harmony,
  type Mood,
  type ShadowDepth,
  type ThemeInputs,
} from './types';

export type Step = 'entry' | 'mood' | 'hue' | 'palette' | 'editor';

export interface BuilderState {
  version: 1;
  path: 'guided' | 'direct' | null;
  step: Step;
  moods: Mood[];
  hue: number;
  harmony: Harmony;
  shuffleSeed: number;
  inputs: ThemeInputs;
  overrides: ColorOverrides;
  previewMode: ThemeMode;
  openSections: string[];
}

export const INITIAL_STATE: BuilderState = {
  version: 1,
  path: null,
  step: 'entry',
  moods: [],
  hue: 190,
  harmony: MOODS.professional.harmony,
  shuffleSeed: 0,
  inputs: DEFAULT_INPUTS,
  overrides: { light: {}, dark: {} },
  previewMode: 'light',
  openSections: ['colors'],
};

export type BuilderAction =
  | { type: 'start'; path: 'guided' | 'direct' }
  | { type: 'goto'; step: Step }
  | { type: 'toggleMood'; mood: Mood }
  | { type: 'setHue'; hue: number }
  | { type: 'setHarmony'; harmony: Harmony }
  | { type: 'shuffle' }
  | { type: 'applyPalette'; palette: PaletteSuggestion }
  | { type: 'setInput'; key: keyof ThemeInputs; value: ThemeInputs[keyof ThemeInputs] }
  | { type: 'setOverride'; mode: ThemeMode; key: keyof ThemeColorOverrides; value: string | null }
  | { type: 'setPreviewMode'; mode: ThemeMode }
  | { type: 'toggleSection'; id: string }
  | { type: 'load'; state: BuilderState }
  | { type: 'reset' };

const isValidColor = (value: unknown): value is string =>
  typeof value === 'string' && parseColorToOklch(value) !== null;

/**
 * Normalise any parseable color to lowercase `#rrggbb` (spec §4.6: exported colors are hex).
 * Hex input is expanded exactly so it round-trips; other formats go through OKLCH.
 */
export function toHexColor(value: string): string | null {
  const trimmed = value.trim();
  const rgb = trimmed.startsWith('#') ? hexToRgb(trimmed) : null;
  if (rgb) {
    return rgbToHex(rgb);
  }
  const oklch = parseColorToOklch(trimmed);
  return oklch ? oklchToHex(oklch) : null;
}

export function builderReducer(state: BuilderState, action: BuilderAction): BuilderState {
  switch (action.type) {
    case 'start':
      return { ...state, path: action.path, step: action.path === 'guided' ? 'mood' : 'editor' };
    case 'goto':
      return { ...state, step: action.step };
    case 'toggleMood': {
      const moods = state.moods.includes(action.mood)
        ? state.moods.filter((m) => m !== action.mood)
        : [...state.moods, action.mood];
      return { ...state, moods, harmony: MOODS[moods[0] ?? 'professional'].harmony };
    }
    case 'setHue':
      return { ...state, hue: ((action.hue % 360) + 360) % 360 };
    case 'setHarmony':
      return { ...state, harmony: action.harmony };
    case 'shuffle':
      return { ...state, shuffleSeed: state.shuffleSeed + 1 };
    case 'applyPalette':
      return {
        ...state,
        step: 'editor',
        inputs: {
          ...state.inputs,
          ...{ ...action.palette.look },
          primary: action.palette.primary,
          secondary: action.palette.secondary,
        },
      };
    case 'setInput': {
      if ((action.key === 'primary' || action.key === 'secondary') && !isValidColor(action.value)) {
        return state;
      }
      return { ...state, inputs: { ...state.inputs, [action.key]: action.value } };
    }
    case 'setOverride': {
      const { [action.key]: _removed, ...rest } = state.overrides[action.mode];
      if (action.value === null) {
        return { ...state, overrides: { ...state.overrides, [action.mode]: rest } };
      }
      const hex = toHexColor(action.value);
      if (!hex) {
        return state;
      }
      return {
        ...state,
        overrides: {
          ...state.overrides,
          [action.mode]: { ...state.overrides[action.mode], [action.key]: hex },
        },
      };
    }
    case 'setPreviewMode':
      return { ...state, previewMode: action.mode };
    case 'toggleSection':
      return {
        ...state,
        openSections: state.openSections.includes(action.id)
          ? state.openSections.filter((s) => s !== action.id)
          : [...state.openSections, action.id],
      };
    case 'load':
      return action.state;
    case 'reset':
      return INITIAL_STATE;
  }
}

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

export const STORAGE_KEY = 'ttt-theme-builder:v1';

const STEPS: Step[] = ['entry', 'mood', 'hue', 'palette', 'editor'];
const HARMONIES: Harmony[] = [
  'complementary',
  'analogous',
  'triadic',
  'split-complementary',
  'monochrome',
];
const SHADOWS = ['flat', 'subtle', 'medium', 'deep'];
const DENSITIES = ['compact', 'comfortable', 'spacious'];
const MODES = ['light', 'dark'];

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const isOneOf = (list: readonly string[], v: unknown): boolean =>
  typeof v === 'string' && list.includes(v);
const isColorMap = (v: unknown): boolean =>
  isRecord(v) && Object.values(v).every((c) => isValidColor(c));

function isValidState(v: unknown): v is BuilderState {
  if (!isRecord(v) || v.version !== 1) {
    return false;
  }
  const { inputs, overrides } = v;
  return (
    (v.path === null || v.path === 'guided' || v.path === 'direct') &&
    isOneOf(STEPS, v.step) &&
    Array.isArray(v.moods) &&
    v.moods.every((m) => typeof m === 'string' && Object.hasOwn(MOODS, m)) &&
    isNum(v.hue) &&
    isOneOf(HARMONIES, v.harmony) &&
    isNum(v.shuffleSeed) &&
    isRecord(inputs) &&
    isValidColor(inputs.primary) &&
    isValidColor(inputs.secondary) &&
    typeof inputs.fontStack === 'string' &&
    isNum(inputs.baseFontSize) &&
    isNum(inputs.typeScaleRatio) &&
    isNum(inputs.radius) &&
    isNum(inputs.spacingUnit) &&
    isOneOf(SHADOWS, inputs.shadowDepth) &&
    isOneOf(DENSITIES, inputs.density) &&
    isOneOf(MODES, inputs.defaultMode) &&
    isRecord(overrides) &&
    isColorMap(overrides.light) &&
    isColorMap(overrides.dark) &&
    isOneOf(MODES, v.previewMode) &&
    Array.isArray(v.openSections) &&
    v.openSections.every((s) => typeof s === 'string')
  );
}

function defaultStorage(): Storage | undefined {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage;
  } catch {
    return undefined;
  }
}

export function loadState(storage: Storage | undefined = defaultStorage()): BuilderState {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) {
      return INITIAL_STATE;
    }
    const parsed: unknown = JSON.parse(raw);
    return isValidState(parsed) ? parsed : INITIAL_STATE;
  } catch {
    return INITIAL_STATE;
  }
}

export function saveState(
  state: BuilderState,
  storage: Storage | undefined = defaultStorage()
): void {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Persistence is best-effort (private mode, quota, disabled storage).
  }
}

export function clearState(storage: Storage | undefined = defaultStorage()): void {
  try {
    storage?.removeItem(STORAGE_KEY);
  } catch {
    // Best-effort.
  }
}

// ---------------------------------------------------------------------------
// theme.json import
// ---------------------------------------------------------------------------

export interface ImportResult {
  ok: boolean;
  state?: BuilderState;
  errors: string[];
  warnings: string[];
}

const KNOWN_TOP = ['mode', 'theme'];
const KNOWN_THEME = ['colors', 'modes', 'spacing', 'typography', 'borderRadius', 'shadows'];

/** Parse "12px" / "0.75rem" / 12 to px; null when not a plain length. */
function toPx(value: unknown): number | null {
  if (isNum(value)) {
    return value;
  }
  if (typeof value !== 'string') {
    return null;
  }
  const m = /^\s*(-?\d+(?:\.\d+)?)(px|rem)?\s*$/.exec(value);
  if (!m) {
    return null;
  }
  return parseFloat(m[1]) * (m[2] === 'rem' ? 16 : 1);
}

let knownColorKeys: Set<string> | undefined;
/** Every color token the builder knows (semantic tokens plus primary/secondary shades). */
function isKnownColorKey(key: string): boolean {
  knownColorKeys ??= new Set(Object.keys(generateColors(DEFAULT_INPUTS, 'light')));
  return knownColorKeys.has(key);
}

function readColors(
  value: unknown,
  path: string,
  errors: string[],
  warnings: string[]
): ThemeColorOverrides | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (!isRecord(value)) {
    errors.push(`${path} must be an object of colors`);
    return undefined;
  }
  const out: Record<string, string> = {};
  for (const [key, color] of Object.entries(value)) {
    const hex = typeof color === 'string' ? toHexColor(color) : null;
    if (!hex) {
      errors.push(`${path}.${key} is not a valid color`);
    } else if (!isKnownColorKey(key)) {
      warnings.push(`${path}.${key} is not a known color token (ignored)`);
    } else {
      out[key] = hex;
    }
  }
  return out as ThemeColorOverrides;
}

const UNITS = [4, 5, 6];
const RATIOS = [1.125, 1.2, 1.25, 1.333];
const DENSITY_KEYS = Object.keys(DENSITY_MULTIPLIER) as Density[];
const SHADOW_DEPTHS: Array<Exclude<ShadowDepth, 'flat'>> = ['subtle', 'medium', 'deep'];
const SHADOW_KEYS = ['sm', 'md', 'lg', 'xl'] as const;
const REGENERATED = 'regenerated from builder settings';

/** The item whose `distance` is smallest (first wins ties). */
function nearest<T>(items: readonly T[], distance: (item: T) => number): T {
  return items.reduce((best, item) => (distance(item) < distance(best) ? item : best));
}

const mean = (values: number[]): number => values.reduce((a, b) => a + b, 0) / values.length;

/** Alpha percentages in a builder-style shadow (`rgb(16 24 40 / 6%)`). */
const shadowAlphas = (shadow: string): number[] =>
  Array.from(shadow.matchAll(/(\d+(?:\.\d+)?)%\)/g), (m) => parseFloat(m[1]));

/** Infer the builder shadow depth from `theme.shadows`. */
function readShadows(
  value: unknown,
  inputs: ThemeInputs,
  errors: string[],
  warnings: string[]
): void {
  if (value === undefined) {
    return;
  }
  if (!isRecord(value)) {
    errors.push('theme.shadows must be an object');
    return;
  }
  const shadows: Partial<Record<(typeof SHADOW_KEYS)[number], string>> = {};
  for (const key of SHADOW_KEYS) {
    const shadow = value[key];
    if (typeof shadow === 'string') {
      shadows[key] = shadow.trim();
    } else if (shadow !== undefined) {
      errors.push(`theme.shadows.${key} must be a string`);
    }
  }
  const keys = SHADOW_KEYS.filter((k) => shadows[k] !== undefined);
  if (keys.length > 0 && keys.every((k) => shadows[k] === 'none')) {
    inputs.shadowDepth = 'flat';
    return;
  }
  const exact = SHADOW_DEPTHS.find((depth) => {
    const generated = buildShadows(depth);
    return keys.length > 0 && keys.every((k) => shadows[k] === generated[k]);
  });
  if (exact) {
    inputs.shadowDepth = exact;
    return;
  }
  const tuned = keys.filter((k) => shadowAlphas(shadows[k] ?? '').length > 0);
  if (tuned.length === 0) {
    warnings.push(`theme.shadows could not be matched to a shadow depth; ${REGENERATED}`);
    return;
  }
  const fileAlpha = mean(tuned.flatMap((k) => shadowAlphas(shadows[k] ?? '')));
  const depth = nearest(SHADOW_DEPTHS, (d) => {
    const generated = buildShadows(d);
    return Math.abs(mean(tuned.flatMap((k) => shadowAlphas(generated[k]))) - fileAlpha);
  });
  inputs.shadowDepth = depth;
  warnings.push(`theme.shadows do not match a builder shadow depth; using nearest "${depth}"`);
}

/** Infer spacing unit (4, 5 or 6px) and density from `theme.spacing`. */
function readSpacing(
  value: unknown,
  inputs: ThemeInputs,
  errors: string[],
  warnings: string[]
): void {
  if (value === undefined) {
    return;
  }
  if (!isRecord(value)) {
    errors.push('theme.spacing must be an object');
    return;
  }
  if (value.unit === undefined) {
    warnings.push(`theme.spacing.unit is missing; ${REGENERATED}`);
  } else if (!isNum(value.unit)) {
    errors.push('theme.spacing.unit must be a number');
  } else {
    const fileUnit = value.unit;
    inputs.spacingUnit = nearest(UNITS, (u) => Math.abs(u - fileUnit));
    if (inputs.spacingUnit !== fileUnit) {
      warnings.push(`theme.spacing.unit ${fileUnit} is not 4, 5 or 6; using ${inputs.spacingUnit}`);
    }
  }
  if (value.md === undefined) {
    warnings.push(`theme.spacing.md is missing; density ${REGENERATED}`);
    return;
  }
  const md = toPx(value.md);
  if (md === null) {
    errors.push('theme.spacing.md must be a length');
    return;
  }
  const unit = inputs.spacingUnit;
  inputs.density = nearest(DENSITY_KEYS, (d) => Math.abs(4 * unit * DENSITY_MULTIPLIER[d] - md));
  if (Math.round(4 * unit * DENSITY_MULTIPLIER[inputs.density]) !== md) {
    warnings.push(
      `theme.spacing.md ${md}px does not match a builder density; using "${inputs.density}"`
    );
  }
}

/** Read the md radius, clamped and rounded to the editor range (0-16px, whole px). */
function readRadius(
  value: unknown,
  inputs: ThemeInputs,
  errors: string[],
  warnings: string[]
): void {
  if (value === undefined) {
    return;
  }
  if (!isRecord(value)) {
    errors.push('theme.borderRadius must be an object');
    return;
  }
  if (value.md === undefined) {
    warnings.push(`theme.borderRadius.md is missing; ${REGENERATED}`);
    return;
  }
  const px = toPx(value.md);
  if (px === null) {
    errors.push('theme.borderRadius.md must be a length');
    return;
  }
  inputs.radius = Math.min(16, Math.max(0, Math.round(px)));
  if (inputs.radius !== px) {
    warnings.push(`theme.borderRadius.md ${px}px is outside 0-16px; using ${inputs.radius}px`);
  }
}

/** Read font stack, base size (whole px, 14-18) and scale ratio from `theme.typography`. */
function readTypography(
  value: unknown,
  inputs: ThemeInputs,
  errors: string[],
  warnings: string[]
): void {
  if (value === undefined) {
    return;
  }
  if (!isRecord(value)) {
    errors.push('theme.typography must be an object');
    return;
  }
  const family = value.fontFamily;
  if (family !== undefined) {
    if (!isRecord(family)) {
      errors.push('theme.typography.fontFamily must be an object');
    } else if (family.primary === undefined) {
      warnings.push(`theme.typography.fontFamily.primary is missing; ${REGENERATED}`);
    } else if (typeof family.primary === 'string') {
      inputs.fontStack = family.primary;
    } else {
      errors.push('theme.typography.fontFamily.primary must be a string');
    }
  }

  const sizes = value.fontSize;
  if (sizes === undefined) {
    return;
  }
  if (!isRecord(sizes)) {
    errors.push('theme.typography.fontSize must be an object');
    return;
  }
  if (sizes.base === undefined) {
    warnings.push(`theme.typography.fontSize.base is missing; size and ratio ${REGENERATED}`);
    return;
  }
  const base = toPx(sizes.base);
  if (base === null) {
    errors.push('theme.typography.fontSize.base must be a length');
    return;
  }
  // Exported sizes are rem rounded to 3 decimals, so allow a little drift before warning.
  inputs.baseFontSize = Math.min(18, Math.max(14, Math.round(base)));
  if (Math.abs(inputs.baseFontSize - base) > 0.05) {
    warnings.push(
      `theme.typography.fontSize.base ${Math.round(base * 100) / 100}px is not a whole size from 14 to 18px; using ${inputs.baseFontSize}px`
    );
  }

  if (sizes.lg === undefined) {
    warnings.push(`theme.typography.fontSize.lg is missing; scale ratio ${REGENERATED}`);
    return;
  }
  const lg = toPx(sizes.lg);
  if (lg === null) {
    errors.push('theme.typography.fontSize.lg must be a length');
    return;
  }
  const ratio = lg / base;
  if (!Number.isFinite(ratio) || ratio <= 0) {
    warnings.push(`theme.typography.fontSize.lg gives no usable scale ratio; ${REGENERATED}`);
    return;
  }
  inputs.typeScaleRatio = nearest(RATIOS, (r) => Math.abs(r - ratio));
  if (Math.abs(inputs.typeScaleRatio - ratio) > 0.005) {
    warnings.push(
      `theme.typography.fontSize.lg gives scale ratio ${Math.round(ratio * 1000) / 1000}; using ${inputs.typeScaleRatio}`
    );
  }
}

/**
 * An exported theme.json carries every color token. Keep as overrides only the colors that differ
 * from what the builder would generate for the recovered inputs, so unedited tokens keep following
 * brand changes. Both sides are lowercase #rrggbb.
 */
function editedColors(
  colors: ThemeColorOverrides,
  inputs: ThemeInputs,
  mode: ThemeMode
): ThemeColorOverrides {
  const generated: Record<string, string | undefined> = { ...generateColors(inputs, mode) };
  const out: Record<string, string> = {};
  for (const [key, color] of Object.entries(colors)) {
    if (typeof color === 'string' && generated[key]?.toLowerCase() !== color) {
      out[key] = color;
    }
  }
  return out as ThemeColorOverrides;
}

export function importThemeJson(text: string, current: BuilderState): ImportResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const fail = (): ImportResult => ({ ok: false, errors, warnings });

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    errors.push('File is not valid JSON');
    return fail();
  }
  if (!isRecord(data)) {
    errors.push('theme.json must be a JSON object');
    return fail();
  }

  for (const key of Object.keys(data)) {
    if (!KNOWN_TOP.includes(key)) {
      warnings.push(`${key} is not a known theme.json key (ignored)`);
    }
  }
  if (data.mode !== undefined && !isOneOf(MODES, data.mode)) {
    errors.push('mode must be "light" or "dark"');
  }

  let theme: Record<string, unknown> = {};
  if (data.theme !== undefined) {
    if (isRecord(data.theme)) {
      theme = data.theme;
    } else {
      errors.push('theme must be an object');
    }
  }
  for (const key of Object.keys(theme)) {
    if (!KNOWN_THEME.includes(key)) {
      warnings.push(`theme.${key} is not a known key (ignored)`);
    }
  }

  const shared = readColors(theme.colors, 'theme.colors', errors, warnings);
  const perMode: Partial<Record<ThemeMode, ThemeColorOverrides>> = {};
  if (theme.modes !== undefined) {
    if (!isRecord(theme.modes)) {
      errors.push('theme.modes must be an object');
    } else {
      for (const [mode, entry] of Object.entries(theme.modes)) {
        if (!isOneOf(MODES, mode)) {
          warnings.push(`theme.modes.${mode} is not a known mode (ignored)`);
        } else if (!isRecord(entry)) {
          errors.push(`theme.modes.${mode} must be an object`);
        } else {
          perMode[mode as ThemeMode] = readColors(
            entry.colors,
            `theme.modes.${mode}.colors`,
            errors,
            warnings
          );
        }
      }
    }
  }

  const inputs: ThemeInputs = { ...current.inputs };
  readSpacing(theme.spacing, inputs, errors, warnings);
  readRadius(theme.borderRadius, inputs, errors, warnings);
  readTypography(theme.typography, inputs, errors, warnings);
  readShadows(theme.shadows, inputs, errors, warnings);

  if (errors.length > 0) {
    return fail();
  }

  const light = { ...shared, ...perMode.light };
  const dark = { ...shared, ...perMode.dark };
  if (typeof light.primary === 'string') {
    inputs.primary = light.primary;
  }
  if (typeof light.secondary === 'string') {
    inputs.secondary = light.secondary;
  }
  if (data.mode !== undefined) {
    inputs.defaultMode = data.mode as ThemeMode;
  }

  return {
    ok: true,
    errors,
    warnings,
    state: {
      ...current,
      path: 'direct',
      step: 'editor',
      inputs,
      overrides: {
        light: editedColors(light, inputs, 'light'),
        dark: editedColors(dark, inputs, 'dark'),
      },
    },
  };
}
