import type { ThemeColorOverrides, ThemeColorTokens } from '../../lib/types/theme.types';
import {
  getContrastRatio,
  hexToOklch,
  oklchToHex,
  parseColorToOklch,
} from '../../lib/utils/colorUtils';

type TokenKey = keyof ThemeColorTokens;

export interface ContrastCheck {
  fg: TokenKey;
  bg: TokenKey;
  min: 3 | 4.5;
  ratio: number;
  pass: boolean;
  suggestion?: string;
}

/** WCAG pairs to audit. `textDisabled` is exempt per WCAG. */
export const CONTRAST_PAIRS: ReadonlyArray<[TokenKey, TokenKey, 3 | 4.5]> = [
  ['textPrimary', 'backgroundPrimary', 4.5],
  ['textSecondary', 'backgroundPrimary', 4.5],
  ['textPrimary', 'surfacePrimary', 4.5],
  ['textPrimary', 'surfaceElevated', 4.5],
  ['textOnPrimary', 'primary', 4.5],
  ['inputText', 'inputBg', 4.5],
  ['inputPlaceholder', 'inputBg', 4.5],
  ['primary', 'backgroundPrimary', 3],
  ['borderFocus', 'backgroundPrimary', 3],
  ['inputBorder', 'inputBg', 3],
  ['controlBorder', 'backgroundPrimary', 3],
];

/** Normalise any parseable color to a hex string, or null when it does not parse. */
function toHex(value: string | undefined): string | null {
  if (!value) {
    return null;
  }
  if (hexToOklch(value)) {
    return value;
  }
  const parsed = parseColorToOklch(value);
  return parsed ? oklchToHex(parsed) : null;
}

/**
 * Nearest-lightness OKLCH change to `fg` (keeping hue and chroma) that reaches `min` contrast
 * against `bg`. Falls back to black or white when no lightness works.
 */
export function suggestPassingColor(fg: string, bg: string, min: number): string {
  const fgHex = toHex(fg);
  const bgHex = toHex(bg);
  if (!fgHex || !bgHex) {
    return fg;
  }
  const origin = hexToOklch(fgHex);
  if (!origin) {
    return fg;
  }

  const STEP = 0.005;
  for (let d = 0; d <= 1 + 1e-9; d += STEP) {
    const candidates = [origin.l + d, origin.l - d]
      .filter((l) => l >= 0 && l <= 1)
      .map((l) => oklchToHex({ ...origin, l }))
      .filter((hex) => getContrastRatio(hex, bgHex) >= min);
    if (candidates.length) {
      return candidates.reduce((best, hex) =>
        getContrastRatio(hex, bgHex) > getContrastRatio(best, bgHex) ? hex : best
      );
    }
  }
  return getContrastRatio('#ffffff', bgHex) >= getContrastRatio('#000000', bgHex)
    ? '#ffffff'
    : '#000000';
}

/** Audit every contrast pair whose two colors are present and parseable. */
export function auditContrast(colors: ThemeColorOverrides): ContrastCheck[] {
  const checks: ContrastCheck[] = [];
  for (const [fgKey, bgKey, min] of CONTRAST_PAIRS) {
    const fg = toHex(colors[fgKey]);
    const bg = toHex(colors[bgKey]);
    if (!fg || !bg) {
      continue;
    }
    const ratio = getContrastRatio(fg, bg);
    const pass = ratio >= min;
    checks.push({
      fg: fgKey,
      bg: bgKey,
      min,
      ratio,
      pass,
      ...(pass ? {} : { suggestion: suggestPassingColor(fg, bg, min) }),
    });
  }
  return checks;
}
