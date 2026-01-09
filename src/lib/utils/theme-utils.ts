import type { ColorFamily, ColorShade } from '../types';

/**
 * Get a CSS custom property value from the document
 *
 * @param propertyName - CSS variable name (with or without --)
 * @returns The value of the CSS variable
 *
 * @example
 * ```ts
 * const primaryColor = getThemeValue('--theme-primary');
 * const spacing = getThemeValue('spacing-md');
 * ```
 */
export function getThemeValue(propertyName: string): string {
  const prop = propertyName.startsWith('--') ? propertyName : `--${propertyName}`;
  return getComputedStyle(document.documentElement).getPropertyValue(prop).trim();
}

/**
 * Get a color value from the color palette
 *
 * @param family - Color family name
 * @param shade - Color shade (50-900)
 * @returns The hex color value
 *
 * @example
 * ```ts
 * const blue500 = getColorValue('blue', 500);
 * const red700 = getColorValue('red', 700);
 * ```
 */
export function getColorValue(family: ColorFamily, shade: ColorShade): string {
  return getThemeValue(`color-${family}-${shade}`);
}

/**
 * Set a CSS custom property on the document root
 *
 * @param propertyName - CSS variable name (with or without --)
 * @param value - Value to set
 *
 * @example
 * ```ts
 * setThemeValue('--theme-primary', '#0066ff');
 * setThemeValue('spacing-custom', '24px');
 * ```
 */
export function setThemeValue(propertyName: string, value: string): void {
  const prop = propertyName.startsWith('--') ? propertyName : `--${propertyName}`;
  document.documentElement.style.setProperty(prop, value);
}

/**
 * Apply multiple theme values at once
 *
 * @param values - Object of CSS variable names and values
 *
 * @example
 * ```ts
 * applyThemeValues({
 *   '--theme-primary': '#0066ff',
 *   '--theme-secondary': '#708090',
 * });
 * ```
 */
export function applyThemeValues(values: Record<string, string>): void {
  Object.entries(values).forEach(([key, value]) => {
    setThemeValue(key, value);
  });
}

/**
 * Convert pixels to rem units
 *
 * @param pixels - Pixel value
 * @param baseFontSize - Base font size in pixels (default: 16)
 * @returns rem value as string
 *
 * @example
 * ```ts
 * const rem = pxToRem(24); // '1.5rem'
 * ```
 */
export function pxToRem(pixels: number, baseFontSize = 16): string {
  return `${pixels / baseFontSize}rem`;
}

/**
 * Generate spacing value based on 4px grid
 *
 * @param units - Number of 4px units
 * @returns Pixel value as string
 *
 * @example
 * ```ts
 * const spacing = gridSpacing(4); // '16px'
 * const margin = gridSpacing(6); // '24px'
 * ```
 */
export function gridSpacing(units: number): string {
  return `${units * 4}px`;
}

/**
 * Check if current theme mode is dark
 *
 * @returns true if dark mode is active
 *
 * @example
 * ```ts
 * if (isDarkMode()) {
 *   // Apply dark mode specific logic
 * }
 * ```
 */
export function isDarkMode(): boolean {
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

/**
 * Get current theme mode
 *
 * @returns Current theme mode
 *
 * @example
 * ```ts
 * const mode = getThemeMode(); // 'light' | 'dark'
 * ```
 */
export function getThemeMode(): 'light' | 'dark' {
  const theme = document.documentElement.getAttribute('data-theme');
  return theme === 'dark' ? 'dark' : 'light';
}
