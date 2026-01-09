/**
 * Color family names available in the theme
 */
export type ColorFamily =
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose'
  | 'slate'
  | 'gray'
  | 'zinc'
  | 'neutral'
  | 'stone'
  | 'brown'
  | 'copper'
  | 'gold'
  | 'silver'
  | 'olive'
  | 'mint'
  | 'navy'
  | 'coral'
  | 'turquoise'
  | 'magenta';

/**
 * Color shade levels (50-900)
 */
export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

/**
 * Semantic color roles in the theme
 */
export interface ThemeColorTokens {
  // Primary brand color
  primary: string;
  primaryHover: string;
  primaryActive: string;
  primaryDisabled: string;

  // Secondary brand color
  secondary: string;
  secondaryHover: string;
  secondaryActive: string;
  secondaryDisabled: string;

  // Semantic colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // Backgrounds
  backgroundPrimary: string;
  backgroundSecondary: string;
  backgroundTertiary: string;

  // Surfaces
  surfacePrimary: string;
  surfaceSecondary: string;
  surfaceElevated: string;

  // Text colors
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textDisabled: string;
  textOnPrimary: string;

  // Borders
  borderPrimary: string;
  borderSecondary: string;
  borderFocus: string;

  // Interactive
  interactiveHover: string;
  interactiveFocus: string;
  interactiveActive: string;
  interactiveDisabled: string;
}

/**
 * Spacing values based on 4px grid
 */
export interface ThemeSpacing {
  unit: number; // 4px
  xs: string; // 4px
  sm: string; // 8px
  md: string; // 16px
  lg: string; // 24px
  xl: string; // 32px
  xxl: string; // 48px
}

/**
 * Typography scale
 */
export interface ThemeTypography {
  fontFamily: {
    primary: string;
    secondary: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

/**
 * Border radius values
 */
export interface ThemeBorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

/**
 * Shadow definitions
 */
export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

/**
 * Complete theme definition
 */
export interface Theme {
  mode: 'light' | 'dark';
  colors: ThemeColorTokens;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
}

/**
 * Partial theme override for customization
 */
export type ThemeOverride = Partial<{
  colors: Partial<ThemeColorTokens>;
  spacing: Partial<ThemeSpacing>;
  typography: Partial<ThemeTypography>;
  borderRadius: Partial<ThemeBorderRadius>;
  shadows: Partial<ThemeShadows>;
}>;

/**
 * Theme configuration for GlobalProvider
 */
export interface ThemeConfig {
  mode?: 'light' | 'dark';
  theme?: ThemeOverride;
}

/**
 * Theme mode type
 */
export type ThemeMode = 'light' | 'dark';
