import { getContrastRatio, hexToOklch } from '../../lib/utils/colorUtils';
import type { ThemeMode } from '../../lib/types/theme.types';
import { auditContrast } from './contrast';
import { generateColors, generateTheme } from './generateTheme';
import { DEFAULT_INPUTS } from './types';

const SEEDS = ['#2563eb', '#00777e', '#f59e0b', '#ffff00', '#000000', '#ffffff', '#888888'];
const MODES: ThemeMode[] = ['light', 'dark'];
const BRAND_FILL_FG = ['primary', 'borderFocus'];
const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const TOKEN_KEYS = [
  'primary',
  'primaryHover',
  'primaryActive',
  'primaryDisabled',
  'secondary',
  'secondaryHover',
  'secondaryActive',
  'secondaryDisabled',
  'success',
  'warning',
  'error',
  'info',
  'backgroundPrimary',
  'backgroundSecondary',
  'backgroundTertiary',
  'surfacePrimary',
  'surfaceSecondary',
  'surfaceElevated',
  'textPrimary',
  'textSecondary',
  'textTertiary',
  'textDisabled',
  'textOnPrimary',
  'borderPrimary',
  'borderSecondary',
  'borderFocus',
  'interactiveHover',
  'interactiveFocus',
  'interactiveActive',
  'interactiveDisabled',
  'inputBg',
  'inputBgDisabled',
  'inputBorder',
  'inputBorderHover',
  'inputBorderFocus',
  'inputText',
  'inputPlaceholder',
  'controlBg',
  'controlBgChecked',
  'controlBorder',
  'controlBorderHover',
];

describe('generateColors', () => {
  it.each(SEEDS)('every audited pair passes in both modes for seed %s', (seed) => {
    for (const mode of MODES) {
      const colors = generateColors({ primary: seed, secondary: '#64748b' }, mode);
      const failing = auditContrast(colors).filter((c) => !c.pass);
      expect(failing.filter((c) => !BRAND_FILL_FG.includes(c.fg))).toEqual([]);
      for (const c of failing) {
        expect(c.suggestion).toBeTruthy();
        expect(getContrastRatio(c.suggestion!, colors[c.bg]!)).toBeGreaterThanOrEqual(c.min);
      }
    }
  });

  it('emits every token key plus primary/secondary 50-900 as hex', () => {
    const expected = [...TOKEN_KEYS, ...SHADES.flatMap((s) => [`primary${s}`, `secondary${s}`])];
    for (const mode of MODES) {
      const colors = generateColors(DEFAULT_INPUTS, mode) as Record<string, string>;
      expect(Object.keys(colors)).toEqual(expect.arrayContaining(expected));
      for (const key of expected) {
        expect(colors[key]).toMatch(/^#[0-9a-f]{6}$/);
      }
    }
  });

  it.each(SEEDS)('produces strictly decreasing lightness from 50 to 900 for seed %s', (seed) => {
    const colors = generateColors({ ...DEFAULT_INPUTS, primary: seed }, 'light') as Record<
      string,
      string
    >;
    const ls = SHADES.map((s) => hexToOklch(colors[`primary${s}`])!.l);
    for (let i = 1; i < ls.length; i++) {
      expect(ls[i]).toBeLessThan(ls[i - 1]);
    }
  });

  it('normalises shorthand seeds to 6-digit lowercase hex in both modes', () => {
    for (const mode of MODES) {
      const colors = generateColors({ primary: '#F90', secondary: 'ABC' }, mode);
      for (const value of Object.values(colors)) {
        expect(value).toMatch(/^#[0-9a-f]{6}$/);
      }
    }
    expect(generateColors({ primary: '#f90', secondary: '#64748b' }, 'light').primary).toBe(
      '#ff9900'
    );
  });

  it('keeps the seed as light-mode primary', () =>
    expect(generateColors({ primary: '#2563eb', secondary: '#64748b' }, 'light').primary).toBe(
      '#2563eb'
    ));

  it('falls back to DEFAULT_INPUTS colors for unparseable input instead of throwing', () => {
    expect(() => generateColors({ primary: 'blue', secondary: '' }, 'light')).not.toThrow();
    expect(generateColors({ primary: 'blue', secondary: '' }, 'light').primary).toBe('#00777e');
  });
});

describe('generateTheme', () => {
  it('applies user overrides last', () => {
    const t = generateTheme(DEFAULT_INPUTS, { light: { primary: '#ff0000' }, dark: {} });
    expect(t.theme!.modes!.light!.colors!.primary).toBe('#ff0000');
    expect(t.theme!.modes!.dark!.colors!.primary).not.toBe('#ff0000');
  });

  it('maps non-color inputs', () => {
    const t = generateTheme({
      ...DEFAULT_INPUTS,
      radius: 10,
      density: 'compact',
      shadowDepth: 'flat',
    }).theme!;
    expect(t.borderRadius).toMatchObject({ sm: '5px', md: '10px', lg: '15px', xl: '20px' });
    expect(t.spacing).toMatchObject({ unit: 4, md: '12px' });
    expect(t.shadows!.md).toBe('none');
    expect(t.typography!.fontSize!.base).toBe('1rem');
  });

  it('scales shadow alpha by depth', () => {
    const deep = generateTheme({ ...DEFAULT_INPUTS, shadowDepth: 'deep' }).theme!.shadows!;
    const medium = generateTheme({ ...DEFAULT_INPUTS, shadowDepth: 'medium' }).theme!.shadows!;
    expect(medium.sm).toContain('6%');
    expect(deep.sm).toContain('9.6%');
  });

  it('scales the type scale one step per size', () => {
    const fs = generateTheme(DEFAULT_INPUTS).theme!.typography!.fontSize!;
    expect(fs).toMatchObject({
      xs: '0.694rem',
      lg: '1.2rem',
      '2xl': '1.728rem',
      '3xl': '2.074rem',
      '4xl': '2.488rem',
    });
  });

  it('uses defaultMode as the config mode', () =>
    expect(generateTheme({ ...DEFAULT_INPUTS, defaultMode: 'dark' }).mode).toBe('dark'));
});
