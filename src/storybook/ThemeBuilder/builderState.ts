import type { ThemeColorOverrides, ThemeMode } from '../../lib/types/theme.types';
import { parseColorToOklch } from '../../lib/utils/colorUtils';
import { MOODS } from './moods';
import type { PaletteSuggestion } from './suggestPalettes';
import {
  DEFAULT_INPUTS,
  type ColorOverrides,
  type Harmony,
  type Mood,
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
      if (!isValidColor(action.value)) {
        return state;
      }
      return {
        ...state,
        overrides: {
          ...state.overrides,
          [action.mode]: { ...state.overrides[action.mode], [action.key]: action.value },
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
    v.moods.every((m) => typeof m === 'string' && m in MOODS) &&
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

function readColors(
  value: unknown,
  path: string,
  errors: string[]
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
    if (isValidColor(color)) {
      out[key] = color;
    } else {
      errors.push(`${path}.${key} is not a valid color`);
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

  const shared = readColors(theme.colors, 'theme.colors', errors);
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
            errors
          );
        }
      }
    }
  }

  const inputs: ThemeInputs = { ...current.inputs };
  const spacing = theme.spacing;
  if (spacing !== undefined) {
    if (!isRecord(spacing)) {
      errors.push('theme.spacing must be an object');
    } else if (spacing.unit !== undefined) {
      if (isNum(spacing.unit)) {
        inputs.spacingUnit = spacing.unit;
      } else {
        errors.push('theme.spacing.unit must be a number');
      }
    }
  }
  const radius = theme.borderRadius;
  if (radius !== undefined) {
    if (!isRecord(radius)) {
      errors.push('theme.borderRadius must be an object');
    } else if (radius.md !== undefined) {
      const px = toPx(radius.md);
      if (px === null) {
        errors.push('theme.borderRadius.md must be a length');
      } else {
        inputs.radius = px;
      }
    }
  }
  const typography = theme.typography;
  if (typography !== undefined) {
    if (!isRecord(typography)) {
      errors.push('theme.typography must be an object');
    } else {
      const family = typography.fontFamily;
      if (isRecord(family) && family.primary !== undefined) {
        if (typeof family.primary === 'string') {
          inputs.fontStack = family.primary;
        } else {
          errors.push('theme.typography.fontFamily.primary must be a string');
        }
      }
      const sizes = typography.fontSize;
      if (isRecord(sizes) && sizes.base !== undefined) {
        const px = toPx(sizes.base);
        if (px === null) {
          errors.push('theme.typography.fontSize.base must be a length');
        } else {
          inputs.baseFontSize = px;
        }
      }
    }
  }

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
      overrides: { light, dark },
    },
  };
}
