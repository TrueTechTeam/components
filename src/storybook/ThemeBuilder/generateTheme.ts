import type {
  ThemeColorOverrides,
  ThemeConfig,
  ThemeMode,
  ThemeShadeKey,
} from '../../lib/types/theme.types';
import {
  getContrastRatio,
  hexToOklch,
  hexToRgb,
  oklchToHex,
  parseColorToOklch,
  rgbToHex,
  type OKLCH,
} from '../../lib/utils/colorUtils';
import { auditContrast } from './contrast';
import { DEFAULT_INPUTS, type ColorOverrides, type ThemeInputs } from './types';

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
const SHADE_LIGHTNESS: Record<number, number> = {
  50: 0.97,
  100: 0.93,
  200: 0.87,
  300: 0.78,
  400: 0.68,
  500: 0.58,
  600: 0.5,
  700: 0.42,
  800: 0.34,
  900: 0.26,
};
const SHADE_CHROMA: Record<number, number> = {
  50: 0.25,
  100: 0.4,
  200: 0.6,
  300: 0.8,
  400: 0.95,
  500: 1,
  600: 1,
  700: 0.9,
  800: 0.8,
  900: 0.7,
};

const WHITE = '#ffffff';
const NEAR_BLACK = '#111111';

interface Seed {
  oklch: OKLCH;
  /** Hex used verbatim as the light-mode brand color. */
  hex: string;
}

function parseSeed(input: string, fallback: string): Seed {
  for (const candidate of [input, fallback]) {
    const oklch = parseColorToOklch(candidate ?? '');
    if (oklch) {
      const rgb = hexToRgb(candidate.trim());
      const hex = rgb ? rgbToHex(rgb) : oklchToHex(oklch);
      return { oklch, hex };
    }
  }
  // Unreachable while the fallback is a valid hex; kept so generation can never throw.
  return { oklch: hexToOklch('#00777e') as OKLCH, hex: '#00777e' };
}

const shadeHex = (seed: OKLCH, shade: number): string =>
  oklchToHex({ l: SHADE_LIGHTNESS[shade], c: seed.c * SHADE_CHROMA[shade], h: seed.h });

interface BrandSet {
  base: string;
  hover: string;
  active: string;
  disabled: string;
  shades: Record<number, string>;
}

function buildBrand(seed: Seed, mode: ThemeMode, enforceTextOnPrimary: boolean): BrandSet {
  const shades: Record<number, string> = {};
  for (const shade of SHADES) {
    shades[shade] = shadeHex(seed.oklch, shade);
  }

  let base: string;
  let baseOklch: OKLCH;
  if (mode === 'light' || seed.oklch.l >= 0.6) {
    base = seed.hex;
    baseOklch = seed.oklch;
  } else {
    base = shades[400];
    baseOklch = hexToOklch(base) as OKLCH;
  }

  // textOnPrimary rule: if neither white nor near-black reaches 4.5, move the brand lightness.
  if (enforceTextOnPrimary) {
    const best = (hex: string) =>
      Math.max(getContrastRatio(WHITE, hex), getContrastRatio(NEAR_BLACK, hex));
    if (best(base) < 4.5) {
      const step = mode === 'light' ? -0.02 : 0.02;
      const target = mode === 'light' ? WHITE : NEAR_BLACK;
      let l = baseOklch.l;
      while (l >= 0 && l <= 1 && getContrastRatio(target, base) < 4.5) {
        l += step;
        base = oklchToHex({ ...baseOklch, l });
      }
      baseOklch = hexToOklch(base) as OKLCH;
    }
  }

  const delta = mode === 'light' ? -1 : 1;
  const shift = (amount: number) => oklchToHex({ ...baseOklch, l: baseOklch.l + delta * amount });
  return {
    base,
    hover: shift(0.06),
    active: shift(0.12),
    disabled: mode === 'light' ? shades[200] : shades[800],
    shades,
  };
}

/** Generate every color token (plus primary/secondary 50-900) for one mode. */
export function generateColors(
  inputs: Pick<ThemeInputs, 'primary' | 'secondary'>,
  mode: ThemeMode
): ThemeColorOverrides {
  const primarySeed = parseSeed(inputs.primary, DEFAULT_INPUTS.primary);
  const secondarySeed = parseSeed(inputs.secondary, DEFAULT_INPUTS.secondary);
  const primary = buildBrand(primarySeed, mode, true);
  const secondary = buildBrand(secondarySeed, mode, false);

  const light = mode === 'light';
  const hue = primarySeed.oklch.h;
  const neutral = (l: number) => oklchToHex({ l, c: 0.01, h: hue });
  const status = (h: number) => oklchToHex({ l: light ? 0.55 : 0.72, c: 0.15, h });

  const backgroundPrimary = neutral(light ? 0.99 : 0.18);
  const backgroundSecondary = neutral(light ? 0.97 : 0.22);
  const backgroundTertiary = neutral(light ? 0.94 : 0.26);
  const surfacePrimary = neutral(light ? 1 : 0.21);
  const surfaceSecondary = neutral(light ? 0.98 : 0.24);
  const surfaceElevated = neutral(light ? 1 : 0.28);
  const textPrimary = neutral(light ? 0.21 : 0.96);
  const textSecondary = neutral(light ? 0.45 : 0.8);
  const textTertiary = neutral(light ? 0.55 : 0.7);
  const textDisabled = neutral(light ? 0.7 : 0.5);
  const strongBorder = neutral(light ? 0.6 : 0.55);
  const strongBorderHover = neutral(light ? 0.5 : 0.65);

  const colors: ThemeColorOverrides = {
    primary: primary.base,
    primaryHover: primary.hover,
    primaryActive: primary.active,
    primaryDisabled: primary.disabled,
    secondary: secondary.base,
    secondaryHover: secondary.hover,
    secondaryActive: secondary.active,
    secondaryDisabled: secondary.disabled,
    success: status(145),
    warning: status(75),
    error: status(27),
    info: status(240),
    backgroundPrimary,
    backgroundSecondary,
    backgroundTertiary,
    surfacePrimary,
    surfaceSecondary,
    surfaceElevated,
    textPrimary,
    textSecondary,
    textTertiary,
    textDisabled,
    textOnPrimary:
      getContrastRatio(WHITE, primary.base) >= getContrastRatio(NEAR_BLACK, primary.base)
        ? WHITE
        : NEAR_BLACK,
    borderPrimary: neutral(light ? 0.88 : 0.35),
    borderSecondary: neutral(light ? 0.92 : 0.3),
    borderFocus: primary.base,
    interactiveHover: backgroundTertiary,
    interactiveFocus: primary.shades[light ? 100 : 800],
    interactiveActive: neutral(light ? 0.9 : 0.32),
    interactiveDisabled: backgroundSecondary,
    inputBg: surfacePrimary,
    inputBgDisabled: backgroundTertiary,
    inputBorder: strongBorder,
    inputBorderHover: strongBorderHover,
    inputBorderFocus: primary.base,
    inputText: textPrimary,
    inputPlaceholder: textTertiary,
    controlBg: surfacePrimary,
    controlBgChecked: primary.base,
    controlBorder: strongBorder,
    controlBorderHover: strongBorderHover,
  };
  for (const shade of SHADES) {
    colors[`primary${shade}` as ThemeShadeKey] = primary.shades[shade];
    colors[`secondary${shade}` as ThemeShadeKey] = secondary.shades[shade];
  }

  // Repair failing neutral foregrounds; brand colors are never silently changed.
  const brandForeground = new Set(['primary', 'borderFocus', 'textOnPrimary']);
  for (const check of auditContrast(colors)) {
    if (!check.pass && check.suggestion && !brandForeground.has(check.fg)) {
      colors[check.fg] = check.suggestion;
    }
  }
  return colors;
}

const BASE_SHADOWS = {
  sm: '0 1px 2px 0 rgb(16 24 40 / 6%), 0 1px 3px 0 rgb(16 24 40 / 10%)',
  md: '0 2px 4px -2px rgb(16 24 40 / 6%), 0 4px 8px -2px rgb(16 24 40 / 10%)',
  lg: '0 4px 6px -2px rgb(16 24 40 / 5%), 0 12px 16px -4px rgb(16 24 40 / 10%)',
  xl: '0 8px 8px -4px rgb(16 24 40 / 4%), 0 20px 24px -4px rgb(16 24 40 / 12%)',
};
const SHADOW_SCALE = { subtle: 0.6, medium: 1, deep: 1.6 } as const;

export function buildShadows(
  depth: ThemeInputs['shadowDepth']
): Record<keyof typeof BASE_SHADOWS, string> {
  const out = {} as Record<keyof typeof BASE_SHADOWS, string>;
  for (const key of Object.keys(BASE_SHADOWS) as Array<keyof typeof BASE_SHADOWS>) {
    out[key] =
      depth === 'flat'
        ? 'none'
        : BASE_SHADOWS[key].replace(/(\d+(?:\.\d+)?)%\)/g, (_, alpha: string) => {
            const scaled = Math.min(
              100,
              Math.round(parseFloat(alpha) * SHADOW_SCALE[depth] * 100) / 100
            );
            return `${scaled}%)`;
          });
  }
  return out;
}

export const DENSITY_MULTIPLIER = { compact: 0.75, comfortable: 1, spacious: 1.25 } as const;
// Steps relative to base; one modular-scale step per size from xs -2 up to 4xl +5.
const FONT_STEPS = { xs: -2, sm: -1, base: 0, lg: 1, xl: 2, '2xl': 3, '3xl': 4, '4xl': 5 } as const;

function buildFontSizes(base: number, ratio: number): Record<keyof typeof FONT_STEPS, string> {
  const out = {} as Record<keyof typeof FONT_STEPS, string>;
  for (const key of Object.keys(FONT_STEPS) as Array<keyof typeof FONT_STEPS>) {
    const px = base * Math.pow(ratio, FONT_STEPS[key]);
    out[key] = `${Math.round((px / 16) * 1000) / 1000}rem`;
  }
  return out;
}

/** Generate a full ThemeConfig (both modes) from builder inputs, with user overrides merged last. */
export function generateTheme(inputs: ThemeInputs, overrides?: ColorOverrides): ThemeConfig {
  const colorsFor = (mode: ThemeMode): ThemeColorOverrides => ({
    ...generateColors(inputs, mode),
    ...overrides?.[mode],
  });

  const unit = inputs.spacingUnit;
  const mult = DENSITY_MULTIPLIER[inputs.density];
  const space = (n: number) => `${Math.round(unit * n * mult)}px`;
  const md = inputs.radius;

  return {
    mode: inputs.defaultMode,
    theme: {
      modes: {
        light: { colors: colorsFor('light') },
        dark: { colors: colorsFor('dark') },
      },
      spacing: {
        unit,
        xs: space(1),
        sm: space(2),
        md: space(4),
        lg: space(6),
        xl: space(8),
        xxl: space(12),
      },
      typography: {
        fontFamily: { primary: inputs.fontStack, secondary: inputs.fontStack },
        fontSize: buildFontSizes(inputs.baseFontSize, inputs.typeScaleRatio),
      },
      borderRadius: {
        none: '0',
        sm: `${Math.round(md / 2)}px`,
        md: `${Math.round(md)}px`,
        lg: `${Math.round(md * 1.5)}px`,
        xl: `${Math.round(md * 2)}px`,
        full: '9999px',
      },
      shadows: buildShadows(inputs.shadowDepth),
    },
  };
}
