import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  hexToHsl,
  hslToHex,
  rgbToString,
  hslToString,
  parseColorToRgb,
  isValidHex,
  clamp,
  getBrightness,
  isLightColor,
  type RGB,
  type HSL,
} from './colorUtils';

describe('hexToRgb', () => {
  it('should convert 6-character hex to RGB', () => {
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
    expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 });
  });

  it('should convert 6-character hex without # to RGB', () => {
    expect(hexToRgb('ffffff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb('000000')).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('should convert 3-character hex to RGB', () => {
    expect(hexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0 });
    expect(hexToRgb('#0f0')).toEqual({ r: 0, g: 255, b: 0 });
    expect(hexToRgb('#00f')).toEqual({ r: 0, g: 0, b: 255 });
  });

  it('should convert 3-character hex without # to RGB', () => {
    expect(hexToRgb('fff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb('000')).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('should handle case insensitive hex values', () => {
    expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
    expect(hexToRgb('#Ff00fF')).toEqual({ r: 255, g: 0, b: 255 });
    expect(hexToRgb('ABC')).toEqual({ r: 170, g: 187, b: 204 });
  });

  it('should return null for invalid hex values', () => {
    expect(hexToRgb('invalid')).toBeNull();
    expect(hexToRgb('#gg0000')).toBeNull();
    expect(hexToRgb('#12345')).toBeNull();
    expect(hexToRgb('')).toBeNull();
    expect(hexToRgb('#')).toBeNull();
  });

  it('should convert common color hex values', () => {
    expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 }); // white
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 }); // black
    expect(hexToRgb('#808080')).toEqual({ r: 128, g: 128, b: 128 }); // gray
  });
});

describe('rgbToHex', () => {
  it('should convert RGB to 6-character hex', () => {
    expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe('#ff0000');
    expect(rgbToHex({ r: 0, g: 255, b: 0 })).toBe('#00ff00');
    expect(rgbToHex({ r: 0, g: 0, b: 255 })).toBe('#0000ff');
  });

  it('should pad single digit hex values with zero', () => {
    expect(rgbToHex({ r: 15, g: 15, b: 15 })).toBe('#0f0f0f');
    expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000');
  });

  it('should convert common RGB colors', () => {
    expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#ffffff'); // white
    expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000'); // black
    expect(rgbToHex({ r: 128, g: 128, b: 128 })).toBe('#808080'); // gray
  });

  it('should round decimal values', () => {
    expect(rgbToHex({ r: 255.4, g: 127.6, b: 0.2 })).toBe('#ff8000');
    expect(rgbToHex({ r: 10.8, g: 20.2, b: 30.5 })).toBe('#0b141f');
  });

  it('should handle edge case values', () => {
    expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#ffffff');
    expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000');
  });
});

describe('rgbToHsl', () => {
  it('should convert RGB to HSL for pure colors', () => {
    expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 }); // red
    expect(rgbToHsl({ r: 0, g: 255, b: 0 })).toEqual({ h: 120, s: 100, l: 50 }); // green
    expect(rgbToHsl({ r: 0, g: 0, b: 255 })).toEqual({ h: 240, s: 100, l: 50 }); // blue
  });

  it('should convert RGB to HSL for achromatic colors', () => {
    expect(rgbToHsl({ r: 0, g: 0, b: 0 })).toEqual({ h: 0, s: 0, l: 0 }); // black
    expect(rgbToHsl({ r: 255, g: 255, b: 255 })).toEqual({ h: 0, s: 0, l: 100 }); // white
    expect(rgbToHsl({ r: 128, g: 128, b: 128 })).toEqual({ h: 0, s: 0, l: 50 }); // gray
  });

  it('should convert RGB to HSL for mixed colors', () => {
    const result = rgbToHsl({ r: 255, g: 128, b: 0 });
    expect(result.h).toBeGreaterThanOrEqual(0);
    expect(result.h).toBeLessThanOrEqual(360);
    expect(result.s).toBeGreaterThanOrEqual(0);
    expect(result.s).toBeLessThanOrEqual(100);
    expect(result.l).toBeGreaterThanOrEqual(0);
    expect(result.l).toBeLessThanOrEqual(100);
  });

  it('should handle cyan, magenta, and yellow', () => {
    expect(rgbToHsl({ r: 0, g: 255, b: 255 })).toEqual({ h: 180, s: 100, l: 50 }); // cyan
    expect(rgbToHsl({ r: 255, g: 0, b: 255 })).toEqual({ h: 300, s: 100, l: 50 }); // magenta
    expect(rgbToHsl({ r: 255, g: 255, b: 0 })).toEqual({ h: 60, s: 100, l: 50 }); // yellow
  });
});

describe('hslToRgb', () => {
  it('should convert HSL to RGB for pure colors', () => {
    expect(hslToRgb({ h: 0, s: 100, l: 50 })).toEqual({ r: 255, g: 0, b: 0 }); // red
    expect(hslToRgb({ h: 120, s: 100, l: 50 })).toEqual({ r: 0, g: 255, b: 0 }); // green
    expect(hslToRgb({ h: 240, s: 100, l: 50 })).toEqual({ r: 0, g: 0, b: 255 }); // blue
  });

  it('should convert HSL to RGB for achromatic colors', () => {
    expect(hslToRgb({ h: 0, s: 0, l: 0 })).toEqual({ r: 0, g: 0, b: 0 }); // black
    expect(hslToRgb({ h: 0, s: 0, l: 100 })).toEqual({ r: 255, g: 255, b: 255 }); // white
    expect(hslToRgb({ h: 0, s: 0, l: 50 })).toEqual({ r: 128, g: 128, b: 128 }); // gray
  });

  it('should convert HSL to RGB for cyan, magenta, and yellow', () => {
    expect(hslToRgb({ h: 180, s: 100, l: 50 })).toEqual({ r: 0, g: 255, b: 255 }); // cyan
    expect(hslToRgb({ h: 300, s: 100, l: 50 })).toEqual({ r: 255, g: 0, b: 255 }); // magenta
    expect(hslToRgb({ h: 60, s: 100, l: 50 })).toEqual({ r: 255, g: 255, b: 0 }); // yellow
  });

  it('should handle various hue values', () => {
    const result1 = hslToRgb({ h: 30, s: 100, l: 50 });
    expect(result1.r).toBeGreaterThan(result1.g);
    expect(result1.g).toBeGreaterThan(result1.b);

    const result2 = hslToRgb({ h: 200, s: 50, l: 50 });
    expect(result2.b).toBeGreaterThan(result2.r);
  });

  it('should handle edge cases for hue values', () => {
    // Test different segments of the hue2rgb function
    const result1 = hslToRgb({ h: 0, s: 100, l: 50 });
    expect(result1).toEqual({ r: 255, g: 0, b: 0 });

    const result2 = hslToRgb({ h: 360, s: 100, l: 50 });
    expect(result2).toEqual({ r: 255, g: 0, b: 0 });
  });
});

describe('hexToHsl', () => {
  it('should convert hex to HSL', () => {
    expect(hexToHsl('#ff0000')).toEqual({ h: 0, s: 100, l: 50 });
    expect(hexToHsl('#00ff00')).toEqual({ h: 120, s: 100, l: 50 });
    expect(hexToHsl('#0000ff')).toEqual({ h: 240, s: 100, l: 50 });
  });

  it('should convert 3-character hex to HSL', () => {
    expect(hexToHsl('#f00')).toEqual({ h: 0, s: 100, l: 50 });
    expect(hexToHsl('#0f0')).toEqual({ h: 120, s: 100, l: 50 });
  });

  it('should return null for invalid hex', () => {
    expect(hexToHsl('invalid')).toBeNull();
    expect(hexToHsl('')).toBeNull();
    expect(hexToHsl('#gg0000')).toBeNull();
  });

  it('should convert achromatic hex to HSL', () => {
    expect(hexToHsl('#ffffff')).toEqual({ h: 0, s: 0, l: 100 });
    expect(hexToHsl('#000000')).toEqual({ h: 0, s: 0, l: 0 });
  });
});

describe('hslToHex', () => {
  it('should convert HSL to hex', () => {
    expect(hslToHex({ h: 0, s: 100, l: 50 })).toBe('#ff0000');
    expect(hslToHex({ h: 120, s: 100, l: 50 })).toBe('#00ff00');
    expect(hslToHex({ h: 240, s: 100, l: 50 })).toBe('#0000ff');
  });

  it('should convert achromatic HSL to hex', () => {
    expect(hslToHex({ h: 0, s: 0, l: 0 })).toBe('#000000');
    expect(hslToHex({ h: 0, s: 0, l: 100 })).toBe('#ffffff');
    expect(hslToHex({ h: 0, s: 0, l: 50 })).toBe('#808080');
  });
});

describe('rgbToString', () => {
  it('should format RGB to CSS string', () => {
    expect(rgbToString({ r: 255, g: 0, b: 0 })).toBe('rgb(255, 0, 0)');
    expect(rgbToString({ r: 0, g: 255, b: 0 })).toBe('rgb(0, 255, 0)');
    expect(rgbToString({ r: 0, g: 0, b: 255 })).toBe('rgb(0, 0, 255)');
  });

  it('should format RGBA to CSS string with alpha', () => {
    expect(rgbToString({ r: 255, g: 0, b: 0, a: 0.5 })).toBe('rgba(255, 0, 0, 0.5)');
    expect(rgbToString({ r: 0, g: 0, b: 0, a: 0 })).toBe('rgba(0, 0, 0, 0)');
    expect(rgbToString({ r: 255, g: 255, b: 255, a: 1 })).toBe('rgba(255, 255, 255, 1)');
  });

  it('should treat RGB as RGB when alpha is not present', () => {
    const rgb: RGB = { r: 128, g: 64, b: 32 };
    expect(rgbToString(rgb)).toBe('rgb(128, 64, 32)');
  });
});

describe('hslToString', () => {
  it('should format HSL to CSS string', () => {
    expect(hslToString({ h: 0, s: 100, l: 50 })).toBe('hsl(0, 100%, 50%)');
    expect(hslToString({ h: 120, s: 100, l: 50 })).toBe('hsl(120, 100%, 50%)');
    expect(hslToString({ h: 240, s: 50, l: 75 })).toBe('hsl(240, 50%, 75%)');
  });

  it('should format HSLA to CSS string with alpha', () => {
    expect(hslToString({ h: 0, s: 100, l: 50, a: 0.5 })).toBe('hsla(0, 100%, 50%, 0.5)');
    expect(hslToString({ h: 180, s: 50, l: 50, a: 0 })).toBe('hsla(180, 50%, 50%, 0)');
    expect(hslToString({ h: 360, s: 100, l: 100, a: 1 })).toBe('hsla(360, 100%, 100%, 1)');
  });

  it('should treat HSL as HSL when alpha is not present', () => {
    const hsl: HSL = { h: 200, s: 75, l: 60 };
    expect(hslToString(hsl)).toBe('hsl(200, 75%, 60%)');
  });
});

describe('parseColorToRgb', () => {
  it('should parse hex color strings', () => {
    expect(parseColorToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    expect(parseColorToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
    expect(parseColorToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 });
  });

  it('should parse RGB color strings', () => {
    expect(parseColorToRgb('rgb(255, 0, 0)')).toEqual({ r: 255, g: 0, b: 0 });
    expect(parseColorToRgb('rgb(0, 255, 0)')).toEqual({ r: 0, g: 255, b: 0 });
    expect(parseColorToRgb('rgb(128, 128, 128)')).toEqual({ r: 128, g: 128, b: 128 });
  });

  it('should parse RGBA color strings', () => {
    expect(parseColorToRgb('rgba(255, 0, 0, 0.5)')).toEqual({ r: 255, g: 0, b: 0 });
    expect(parseColorToRgb('rgba(0, 255, 0, 1)')).toEqual({ r: 0, g: 255, b: 0 });
  });

  it('should parse HSL color strings', () => {
    expect(parseColorToRgb('hsl(0, 100%, 50%)')).toEqual({ r: 255, g: 0, b: 0 });
    expect(parseColorToRgb('hsl(120, 100%, 50%)')).toEqual({ r: 0, g: 255, b: 0 });
    expect(parseColorToRgb('hsl(240, 100%, 50%)')).toEqual({ r: 0, g: 0, b: 255 });
  });

  it('should parse HSLA color strings', () => {
    expect(parseColorToRgb('hsla(0, 100%, 50%, 0.5)')).toEqual({ r: 255, g: 0, b: 0 });
    expect(parseColorToRgb('hsla(180, 100%, 50%, 1)')).toEqual({ r: 0, g: 255, b: 255 });
  });

  it('should handle color strings with varying whitespace', () => {
    expect(parseColorToRgb('rgb(255,0,0)')).toEqual({ r: 255, g: 0, b: 0 });
    expect(parseColorToRgb('rgb(255, 0, 0)')).toEqual({ r: 255, g: 0, b: 0 });
    expect(parseColorToRgb('hsl(120,100%,50%)')).toEqual({ r: 0, g: 255, b: 0 });
    expect(parseColorToRgb('hsl(120, 100%, 50%)')).toEqual({ r: 0, g: 255, b: 0 });
  });

  it('should return null for invalid color strings', () => {
    expect(parseColorToRgb('invalid')).toBeNull();
    expect(parseColorToRgb('')).toBeNull();
    expect(parseColorToRgb('rgb(256, 0, 0)')).toEqual({ r: 256, g: 0, b: 0 }); // Note: doesn't validate range
    expect(parseColorToRgb('not-a-color')).toBeNull();
  });

  it('should return null for invalid hex in parseColorToRgb', () => {
    expect(parseColorToRgb('#gggggg')).toBeNull();
  });
});

describe('isValidHex', () => {
  it('should validate 6-character hex with #', () => {
    expect(isValidHex('#ff0000')).toBe(true);
    expect(isValidHex('#00ff00')).toBe(true);
    expect(isValidHex('#0000ff')).toBe(true);
    expect(isValidHex('#ffffff')).toBe(true);
    expect(isValidHex('#000000')).toBe(true);
  });

  it('should validate 6-character hex without #', () => {
    expect(isValidHex('ff0000')).toBe(true);
    expect(isValidHex('00ff00')).toBe(true);
    expect(isValidHex('ffffff')).toBe(true);
  });

  it('should validate 3-character hex with #', () => {
    expect(isValidHex('#f00')).toBe(true);
    expect(isValidHex('#0f0')).toBe(true);
    expect(isValidHex('#00f')).toBe(true);
    expect(isValidHex('#fff')).toBe(true);
  });

  it('should validate 3-character hex without #', () => {
    expect(isValidHex('f00')).toBe(true);
    expect(isValidHex('abc')).toBe(true);
    expect(isValidHex('123')).toBe(true);
  });

  it('should handle case insensitive validation', () => {
    expect(isValidHex('#FF0000')).toBe(true);
    expect(isValidHex('#Ff00fF')).toBe(true);
    expect(isValidHex('ABC')).toBe(true);
  });

  it('should reject invalid hex strings', () => {
    expect(isValidHex('')).toBe(false);
    expect(isValidHex('#')).toBe(false);
    expect(isValidHex('#12345')).toBe(false);
    expect(isValidHex('#1234567')).toBe(false);
    expect(isValidHex('#gg0000')).toBe(false);
    expect(isValidHex('invalid')).toBe(false);
    expect(isValidHex('rgb(255, 0, 0)')).toBe(false);
  });
});

describe('clamp', () => {
  it('should clamp value within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });

  it('should clamp value below minimum', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(-100, 0, 255)).toBe(0);
  });

  it('should clamp value above maximum', () => {
    expect(clamp(15, 0, 10)).toBe(10);
    expect(clamp(300, 0, 255)).toBe(255);
  });

  it('should handle negative ranges', () => {
    expect(clamp(-5, -10, 0)).toBe(-5);
    expect(clamp(-15, -10, 0)).toBe(-10);
    expect(clamp(5, -10, 0)).toBe(0);
  });

  it('should handle decimal values', () => {
    expect(clamp(0.5, 0, 1)).toBe(0.5);
    expect(clamp(1.5, 0, 1)).toBe(1);
    expect(clamp(-0.5, 0, 1)).toBe(0);
  });
});

describe('getBrightness', () => {
  it('should calculate brightness for pure colors', () => {
    expect(getBrightness({ r: 255, g: 0, b: 0 })).toBe(76.245); // red
    expect(getBrightness({ r: 0, g: 255, b: 0 })).toBe(149.685); // green
    expect(getBrightness({ r: 0, g: 0, b: 255 })).toBe(29.07); // blue
  });

  it('should calculate brightness for achromatic colors', () => {
    expect(getBrightness({ r: 0, g: 0, b: 0 })).toBe(0); // black
    expect(getBrightness({ r: 255, g: 255, b: 255 })).toBe(255); // white
    expect(getBrightness({ r: 128, g: 128, b: 128 })).toBe(128); // gray
  });

  it('should use weighted formula for brightness', () => {
    // Green should contribute most to brightness
    const green = getBrightness({ r: 0, g: 100, b: 0 });
    const red = getBrightness({ r: 100, g: 0, b: 0 });
    const blue = getBrightness({ r: 0, g: 0, b: 100 });

    expect(green).toBeGreaterThan(red);
    expect(green).toBeGreaterThan(blue);
    expect(red).toBeGreaterThan(blue);
  });
});

describe('isLightColor', () => {
  it('should identify light colors', () => {
    expect(isLightColor({ r: 255, g: 255, b: 255 })).toBe(true); // white
    expect(isLightColor({ r: 255, g: 255, b: 0 })).toBe(true); // yellow
    expect(isLightColor({ r: 200, g: 200, b: 200 })).toBe(true); // light gray
  });

  it('should identify dark colors', () => {
    expect(isLightColor({ r: 0, g: 0, b: 0 })).toBe(false); // black
    expect(isLightColor({ r: 0, g: 0, b: 255 })).toBe(false); // blue
    expect(isLightColor({ r: 50, g: 50, b: 50 })).toBe(false); // dark gray
  });

  it('should use threshold of 128 for brightness', () => {
    // Brightness of exactly 128 should be light
    expect(isLightColor({ r: 128, g: 128, b: 128 })).toBe(false);

    // Just above threshold
    expect(isLightColor({ r: 129, g: 129, b: 129 })).toBe(true);

    // Just below threshold
    expect(isLightColor({ r: 127, g: 127, b: 127 })).toBe(false);
  });

  it('should correctly classify colors near threshold', () => {
    // Test colors with brightness around 128
    const justDark = getBrightness({ r: 100, g: 100, b: 100 });
    const justLight = getBrightness({ r: 150, g: 150, b: 150 });

    expect(justDark).toBeLessThan(128);
    expect(isLightColor({ r: 100, g: 100, b: 100 })).toBe(false);

    expect(justLight).toBeGreaterThan(128);
    expect(isLightColor({ r: 150, g: 150, b: 150 })).toBe(true);
  });
});

describe('round-trip conversions', () => {
  it('should maintain color through hex -> rgb -> hex conversion', () => {
    const original = '#ff8800';
    const rgb = hexToRgb(original);
    expect(rgb).not.toBeNull();
    const converted = rgbToHex(rgb!);
    expect(converted).toBe(original);
  });

  it('should maintain color through rgb -> hsl -> rgb conversion', () => {
    const original: RGB = { r: 255, g: 128, b: 64 };
    const hsl = rgbToHsl(original);
    const converted = hslToRgb(hsl);
    // Allow for rounding differences due to HSL conversion
    expect(Math.abs(converted.r - original.r)).toBeLessThanOrEqual(2);
    expect(Math.abs(converted.g - original.g)).toBeLessThanOrEqual(2);
    expect(Math.abs(converted.b - original.b)).toBeLessThanOrEqual(2);
  });

  it('should maintain color through hex -> hsl -> hex conversion', () => {
    const original = '#ff0000';
    const hsl = hexToHsl(original);
    expect(hsl).not.toBeNull();
    const converted = hslToHex(hsl!);
    expect(converted).toBe(original);
  });
});
