import { generateTheme } from './generateTheme';
import { MOODS } from './moods';
import type { PaletteSuggestion } from './suggestPalettes';
import { DEFAULT_INPUTS } from './types';
import {
  INITIAL_STATE,
  STORAGE_KEY,
  builderReducer,
  clearState,
  importThemeJson,
  loadState,
  saveState,
} from './builderState';

function memoryStorage(): Storage & { map: Map<string, string> } {
  const map = new Map<string, string>();
  return {
    map,
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k: string) => map.get(k) ?? null,
    key: (i: number) => Array.from(map.keys())[i] ?? null,
    removeItem: (k: string) => void map.delete(k),
    setItem: (k: string, v: string) => void map.set(k, v),
  };
}

describe('builderReducer', () => {
  it('starts on the entry step with default inputs', () => {
    expect(INITIAL_STATE.step).toBe('entry');
    expect(INITIAL_STATE.inputs).toEqual(DEFAULT_INPUTS);
    expect(INITIAL_STATE.overrides).toEqual({ light: {}, dark: {} });
    expect(INITIAL_STATE.openSections).toEqual(['colors']);
  });

  it('start sets the path and moves to the first step of it', () => {
    expect(builderReducer(INITIAL_STATE, { type: 'start', path: 'guided' })).toMatchObject({
      path: 'guided',
      step: 'mood',
    });
    expect(builderReducer(INITIAL_STATE, { type: 'start', path: 'direct' })).toMatchObject({
      path: 'direct',
      step: 'editor',
    });
  });

  it('toggleMood adds and removes moods and follows the first mood harmony', () => {
    let s = builderReducer(INITIAL_STATE, { type: 'toggleMood', mood: 'bold' });
    expect(s.moods).toEqual(['bold']);
    expect(s.harmony).toBe(MOODS.bold.harmony);
    s = builderReducer(s, { type: 'toggleMood', mood: 'calm' });
    expect(s.moods).toEqual(['bold', 'calm']);
    expect(s.harmony).toBe(MOODS.bold.harmony);
    s = builderReducer(s, { type: 'toggleMood', mood: 'bold' });
    expect(s.moods).toEqual(['calm']);
    expect(s.harmony).toBe(MOODS.calm.harmony);
    s = builderReducer(s, { type: 'toggleMood', mood: 'calm' });
    expect(s.moods).toEqual([]);
    expect(s.harmony).toBe(MOODS.professional.harmony);
  });

  it('setHarmony overrides the mood harmony afterwards', () => {
    let s = builderReducer(INITIAL_STATE, { type: 'toggleMood', mood: 'bold' });
    s = builderReducer(s, { type: 'setHarmony', harmony: 'monochrome' });
    expect(s.harmony).toBe('monochrome');
  });

  it('setHue normalises into 0-360 and shuffle bumps the seed', () => {
    expect(builderReducer(INITIAL_STATE, { type: 'setHue', hue: 400 }).hue).toBe(40);
    expect(builderReducer(INITIAL_STATE, { type: 'setHue', hue: -30 }).hue).toBe(330);
    expect(builderReducer(INITIAL_STATE, { type: 'shuffle' }).shuffleSeed).toBe(
      INITIAL_STATE.shuffleSeed + 1
    );
  });

  it('ignores invalid brand colors and keeps the last valid one', () => {
    const s = builderReducer(INITIAL_STATE, { type: 'setInput', key: 'primary', value: '#12' });
    expect(s.inputs.primary).toBe(INITIAL_STATE.inputs.primary);
  });

  it('stores valid brand colors as typed', () => {
    const s = builderReducer(INITIAL_STATE, { type: 'setInput', key: 'secondary', value: '#ABC' });
    expect(s.inputs.secondary).toBe('#ABC');
  });

  it('sets non-color inputs', () => {
    const s = builderReducer(INITIAL_STATE, { type: 'setInput', key: 'radius', value: 12 });
    expect(s.inputs.radius).toBe(12);
  });

  it('sets and resets an override with null', () => {
    let s = builderReducer(INITIAL_STATE, {
      type: 'setOverride',
      mode: 'dark',
      key: 'success',
      value: '#00ff00',
    });
    expect(s.overrides.dark.success).toBe('#00ff00');
    s = builderReducer(s, { type: 'setOverride', mode: 'dark', key: 'success', value: null });
    expect('success' in s.overrides.dark).toBe(false);
  });

  it('stores override colors as lowercase #rrggbb hex', () => {
    const set = (value: string) =>
      builderReducer(INITIAL_STATE, { type: 'setOverride', mode: 'light', key: 'error', value })
        .overrides.light.error;
    expect(set('rgb(255, 0, 0)')).toBe('#ff0000');
    expect(set('#ABC')).toBe('#aabbcc');
    expect(set('#2563EB')).toBe('#2563eb');
    expect(set('oklch(0.62 0.19 260)')).toMatch(/^#[0-9a-f]{6}$/);
    const s = builderReducer(INITIAL_STATE, {
      type: 'setOverride',
      mode: 'dark',
      key: 'info',
      value: 'hsl(0, 100%, 50%)',
    });
    expect(generateTheme(s.inputs, s.overrides).theme?.modes?.dark?.colors?.info).toBe('#ff0000');
  });

  it('ignores invalid override colors', () => {
    const s = builderReducer(INITIAL_STATE, {
      type: 'setOverride',
      mode: 'light',
      key: 'error',
      value: 'blue',
    });
    expect(s).toBe(INITIAL_STATE);
  });

  it('applyPalette moves to the editor with the palette look', () => {
    const palette: PaletteSuggestion = {
      id: 'p',
      name: 'P',
      primary: '#112233',
      secondary: '#445566',
      look: { radius: 2, shadowDepth: 'deep' },
    };
    const s = builderReducer(INITIAL_STATE, { type: 'applyPalette', palette });
    expect(s.step).toBe('editor');
    expect(s.inputs).toMatchObject({
      primary: '#112233',
      secondary: '#445566',
      radius: 2,
      shadowDepth: 'deep',
    });
    expect(s.inputs.density).toBe(DEFAULT_INPUTS.density);
  });

  it('goto, setPreviewMode and toggleSection', () => {
    expect(builderReducer(INITIAL_STATE, { type: 'goto', step: 'hue' }).step).toBe('hue');
    expect(
      builderReducer(INITIAL_STATE, { type: 'setPreviewMode', mode: 'dark' }).previewMode
    ).toBe('dark');
    let s = builderReducer(INITIAL_STATE, { type: 'toggleSection', id: 'type' });
    expect(s.openSections).toEqual(['colors', 'type']);
    s = builderReducer(s, { type: 'toggleSection', id: 'colors' });
    expect(s.openSections).toEqual(['type']);
  });

  it('load replaces the state', () => {
    const next = { ...INITIAL_STATE, step: 'editor' as const };
    expect(builderReducer(INITIAL_STATE, { type: 'load', state: next })).toBe(next);
  });

  it('reset returns INITIAL_STATE', () => {
    const s = builderReducer(INITIAL_STATE, { type: 'setHue', hue: 10 });
    expect(builderReducer(s, { type: 'reset' })).toEqual(INITIAL_STATE);
  });
});

describe('persistence', () => {
  it('round-trips through storage', () => {
    const storage = memoryStorage();
    const state = builderReducer(INITIAL_STATE, { type: 'setHue', hue: 123 });
    saveState(state, storage);
    expect(storage.map.has(STORAGE_KEY)).toBe(true);
    expect(loadState(storage)).toEqual(state);
  });

  it('clearState removes the stored value', () => {
    const storage = memoryStorage();
    saveState(INITIAL_STATE, storage);
    clearState(storage);
    expect(storage.map.size).toBe(0);
  });

  it.each([
    [
      'throws',
      {
        getItem: () => {
          throw new Error('denied');
        },
      },
    ],
    ['empty', { getItem: () => null }],
    ['corrupt', { getItem: () => '{not json' }],
    ['old version', { getItem: () => JSON.stringify({ version: 0 }) }],
    ['wrong shape', { getItem: () => JSON.stringify({ version: 1, step: 'editor' }) }],
    ['bad nested shape', { getItem: () => JSON.stringify({ ...INITIAL_STATE, inputs: null }) }],
    ['unknown step', { getItem: () => JSON.stringify({ ...INITIAL_STATE, step: 'nope' }) }],
  ])('loadState falls back to INITIAL_STATE when storage %s', (_n, stub) => {
    expect(loadState(stub as unknown as Storage)).toEqual(INITIAL_STATE);
  });

  it('saveState and clearState swallow storage errors', () => {
    const stub = {
      setItem: () => {
        throw new Error('quota');
      },
      removeItem: () => {
        throw new Error('denied');
      },
    } as unknown as Storage;
    expect(() => saveState(INITIAL_STATE, stub)).not.toThrow();
    expect(() => clearState(stub)).not.toThrow();
  });
});

describe('importThemeJson', () => {
  it('imports a valid theme.json into the editor', () => {
    const inputs = { ...DEFAULT_INPUTS, primary: '#2563eb', radius: 12, spacingUnit: 5 };
    const text = JSON.stringify(generateTheme({ ...inputs, defaultMode: 'dark' }));
    const r = importThemeJson(text, INITIAL_STATE);
    expect(r.ok).toBe(true);
    expect(r.errors).toEqual([]);
    expect(r.warnings).toEqual([]);
    expect(r.state).toMatchObject({ path: 'direct', step: 'editor' });
    expect(r.state?.inputs).toMatchObject({
      radius: 12,
      spacingUnit: 5,
      baseFontSize: 16,
      defaultMode: 'dark',
      fontStack: inputs.fontStack,
    });
    expect(r.state?.inputs.primary).toBe(
      generateTheme(inputs).theme?.modes?.light?.colors?.primary
    );
    expect(Object.keys(r.state?.overrides.light ?? {}).length).toBeGreaterThan(10);
    expect(Object.keys(r.state?.overrides.dark ?? {}).length).toBeGreaterThan(10);
  });

  it('puts shared colors into both modes', () => {
    const r = importThemeJson('{"theme":{"colors":{"primary":"#112233"}}}', INITIAL_STATE);
    expect(r.ok).toBe(true);
    expect(r.state?.overrides.light.primary).toBe('#112233');
    expect(r.state?.overrides.dark.primary).toBe('#112233');
    expect(r.state?.inputs.primary).toBe('#112233');
  });

  it.each(['not json', '[]', '{"mode":"sepia"}', '{"theme":{"colors":{"primary":"blue"}}}'])(
    'rejects malformed theme.json %s with errors and no state',
    (text) => {
      const r = importThemeJson(text, INITIAL_STATE);
      expect(r.ok).toBe(false);
      expect(r.errors.length).toBeGreaterThan(0);
      expect(r.state).toBeUndefined();
    }
  );

  it('warns about unknown keys but still imports', () => {
    const r = importThemeJson('{"foo":1,"theme":{"foo":1}}', INITIAL_STATE);
    expect(r.ok).toBe(true);
    expect(r.warnings).toHaveLength(2);
    expect(r.warnings.some((w) => w.startsWith('theme.foo'))).toBe(true);
    expect(r.warnings.some((w) => w.startsWith('foo'))).toBe(true);
  });
});
