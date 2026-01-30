/**
 * Color conversion utilities for ColorPicker component
 */

export interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface RGBA extends RGB {
  a: number; // 0-1
}

export interface HSLA extends HSL {
  a: number; // 0-1
}

/**
 * Convert HEX to RGB
 */
export const hexToRgb = (hex: string): RGB | null => {
  // Remove # if present
  const cleanHex = hex.replace(/^#/, '');

  // Support both 3 and 6 character hex codes
  const match =
    cleanHex.length === 3
      ? cleanHex.match(/^([a-f\d])([a-f\d])([a-f\d])$/i)
      : cleanHex.match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);

  if (!match) {
    return null;
  }

  const [, r, g, b] = match;

  return {
    r: parseInt(cleanHex.length === 3 ? r + r : r, 16),
    g: parseInt(cleanHex.length === 3 ? g + g : g, 16),
    b: parseInt(cleanHex.length === 3 ? b + b : b, 16),
  };
};

/**
 * Convert RGB to HEX
 */
export const rgbToHex = (rgb: RGB): string => {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
};

/**
 * Convert RGB to HSL
 */
export const rgbToHsl = (rgb: RGB): HSL => {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / diff + 2) / 6;
        break;
      case b:
        h = ((r - g) / diff + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

/**
 * Convert HSL to RGB
 */
export const hslToRgb = (hsl: HSL): RGB => {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) {
        t += 1;
      }
      if (t > 1) {
        t -= 1;
      }
      if (t < 1 / 6) {
        return p + (q - p) * 6 * t;
      }
      if (t < 1 / 2) {
        return q;
      }
      if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6;
      }
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

/**
 * Convert HEX to HSL
 */
export const hexToHsl = (hex: string): HSL | null => {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return null;
  }
  return rgbToHsl(rgb);
};

/**
 * Convert HSL to HEX
 */
export const hslToHex = (hsl: HSL): string => {
  const rgb = hslToRgb(hsl);
  return rgbToHex(rgb);
};

/**
 * Format RGB to CSS string
 */
export const rgbToString = (rgb: RGB | RGBA): string => {
  if ('a' in rgb && rgb.a !== undefined) {
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;
  }
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
};

/**
 * Format HSL to CSS string
 */
export const hslToString = (hsl: HSL | HSLA): string => {
  if ('a' in hsl && hsl.a !== undefined) {
    return `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${hsl.a})`;
  }
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
};

/**
 * Parse color string (hex, rgb, hsl) to RGB
 */
export const parseColorToRgb = (color: string): RGB | null => {
  // Try HEX
  if (color.startsWith('#')) {
    return hexToRgb(color);
  }

  // Try RGB
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
    };
  }

  // Try HSL
  const hslMatch = color.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*([\d.]+))?\)/);
  if (hslMatch) {
    const hsl: HSL = {
      h: parseInt(hslMatch[1], 10),
      s: parseInt(hslMatch[2], 10),
      l: parseInt(hslMatch[3], 10),
    };
    return hslToRgb(hsl);
  }

  return null;
};

/**
 * Validate hex color string
 */
export const isValidHex = (hex: string): boolean => {
  return /^#?([a-f\d]{3}|[a-f\d]{6})$/i.test(hex);
};

/**
 * Clamp number between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Get color brightness (0-255)
 */
export const getBrightness = (rgb: RGB): number => {
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
};

/**
 * Determine if color is light or dark
 */
export const isLightColor = (rgb: RGB): boolean => {
  return getBrightness(rgb) > 128;
};
