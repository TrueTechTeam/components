import type { ThemeColorOverrides, ThemeMode } from '../../lib/types/theme.types';

export type Mood = 'calm' | 'bold' | 'professional' | 'playful' | 'luxury' | 'techy' | 'earthy';
export type Harmony =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'split-complementary'
  | 'monochrome';
export type ShadowDepth = 'flat' | 'subtle' | 'medium' | 'deep';
export type Density = 'compact' | 'comfortable' | 'spacious';

export interface ThemeInputs {
  primary: string;
  /** Any string accepted by parseColorToOklch */
  secondary: string;
  fontStack: string;
  /** px, 14-18 */
  baseFontSize: number;
  /** 1.125 | 1.2 | 1.25 | 1.333 */
  typeScaleRatio: number;
  /** md radius in px, 0-16 */
  radius: number;
  /** px, 4 by default */
  spacingUnit: number;
  shadowDepth: ShadowDepth;
  density: Density;
  defaultMode: ThemeMode;
}

export interface ColorOverrides {
  light: ThemeColorOverrides;
  dark: ThemeColorOverrides;
}

export const DEFAULT_INPUTS: ThemeInputs = {
  primary: '#00777e',
  secondary: '#64748b',
  fontStack: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  baseFontSize: 16,
  typeScaleRatio: 1.2,
  radius: 8,
  spacingUnit: 4,
  shadowDepth: 'subtle',
  density: 'comfortable',
  defaultMode: 'light',
};
