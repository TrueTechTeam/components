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

/**
 * OKLCH color space (Björn Ottosson's OKLab, polar form).
 * l: 0..1, c: >= 0, h: 0..360 (0 when achromatic)
 */
export interface OKLCH {
  l: number;
  c: number;
  h: number;
}

const ACHROMATIC_CHROMA = 0.0001;
const GAMUT_EPSILON = 1e-6;

const srgbToLinear = (channel: number): number => {
  const v = channel / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};

const linearToSrgb = (value: number): number => {
  const v = value <= 0.0031308 ? value * 12.92 : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
  return v * 255;
};

/**
 * Normalise a hue angle to [0, 360)
 */
export const rotateHue = (h: number, degrees: number): number => {
  const result = (((h + degrees) % 360) + 360) % 360;
  return result === 360 ? 0 : result;
};

const rgbToOklch = (rgb: RGB): OKLCH => {
  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  const c = Math.sqrt(A * A + B * B);
  if (c < ACHROMATIC_CHROMA) {
    return { l: L, c, h: 0 };
  }
  return { l: L, c, h: rotateHue((Math.atan2(B, A) * 180) / Math.PI, 0) };
};

const oklchToLinearRgb = ({ l: L, c, h }: OKLCH): [number, number, number] => {
  const hr = (h * Math.PI) / 180;
  const A = c * Math.cos(hr);
  const B = c * Math.sin(hr);

  const l = Math.pow(L + 0.3963377774 * A + 0.2158037573 * B, 3);
  const m = Math.pow(L - 0.1055613458 * A - 0.0638541728 * B, 3);
  const s = Math.pow(L - 0.0894841775 * A - 1.291485548 * B, 3);

  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
};

const inGamut = (channels: [number, number, number]): boolean =>
  channels.every((v) => v >= -GAMUT_EPSILON && v <= 1 + GAMUT_EPSILON);

export const hexToOklch = (hex: string): OKLCH | null => {
  const rgb = hexToRgb(hex);
  return rgb ? rgbToOklch(rgb) : null;
};

/**
 * Convert OKLCH to HEX, reducing chroma (keeping lightness and hue) until the color fits sRGB.
 */
export const oklchToHex = (color: OKLCH): string => {
  const l = clamp(color.l, 0, 1);
  const h = color.h;
  let c = Math.max(0, color.c);

  let linear = oklchToLinearRgb({ l, c, h });
  if (!inGamut(linear)) {
    let lo = 0;
    let hi = c;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (inGamut(oklchToLinearRgb({ l, c: mid, h }))) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
    c = lo;
    linear = oklchToLinearRgb({ l, c, h });
  }

  const [r, g, b] = linear.map((v) => Math.round(clamp(linearToSrgb(clamp(v, 0, 1)), 0, 255)));
  return rgbToHex({ r, g, b });
};

/**
 * Parse hex, rgb(), hsl() or oklch(L C H) / oklch(L% C H) into OKLCH
 */
export const parseColorToOklch = (input: string): OKLCH | null => {
  const color = input.trim();

  const match = color.match(
    /^oklch\(\s*(\d*\.?\d+)(%?)\s+(\d*\.?\d+)\s+(\d*\.?\d+)(?:deg)?\s*(?:\/[^)]*)?\)$/i
  );
  if (match) {
    const lightness = parseFloat(match[1]) / (match[2] ? 100 : 1);
    return {
      l: clamp(lightness, 0, 1),
      c: Math.max(0, parseFloat(match[3])),
      h: rotateHue(parseFloat(match[4]), 0),
    };
  }

  const rgb = parseColorToRgb(color);
  return rgb ? rgbToOklch(rgb) : null;
};

/**
 * WCAG 2.x relative luminance of a hex color (0..1). Invalid input is treated as black.
 */
export const getRelativeLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex) ?? { r: 0, g: 0, b: 0 };
  return 0.2126 * srgbToLinear(rgb.r) + 0.7152 * srgbToLinear(rgb.g) + 0.0722 * srgbToLinear(rgb.b);
};

/**
 * WCAG 2.x contrast ratio between two hex colors (1..21)
 */
export const getContrastRatio = (a: string, b: string): number => {
  const la = getRelativeLuminance(a);
  const lb = getRelativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};
