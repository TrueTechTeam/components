import {
  getThemeValue,
  getColorValue,
  setThemeValue,
  applyThemeValues,
  pxToRem,
  gridSpacing,
  isDarkMode,
  getThemeMode,
} from './theme-utils';

describe('theme-utils', () => {
  describe('getThemeValue', () => {
    beforeEach(() => {
      // Clear any previously set properties
      document.documentElement.style.cssText = '';
    });

    it('should get CSS custom property value with -- prefix', () => {
      document.documentElement.style.setProperty('--theme-primary', '#0066ff');
      const value = getThemeValue('--theme-primary');
      expect(value).toBe('#0066ff');
    });

    it('should get CSS custom property value without -- prefix', () => {
      document.documentElement.style.setProperty('--spacing-md', '16px');
      const value = getThemeValue('spacing-md');
      expect(value).toBe('16px');
    });

    it('should return trimmed value', () => {
      document.documentElement.style.setProperty('--spacing-lg', '  24px  ');
      const value = getThemeValue('--spacing-lg');
      expect(value).toBe('24px');
    });

    it('should return empty string for non-existent property', () => {
      const value = getThemeValue('--non-existent');
      expect(value).toBe('');
    });
  });

  describe('getColorValue', () => {
    beforeEach(() => {
      document.documentElement.style.cssText = '';
    });

    it('should get color value for valid family and shade', () => {
      document.documentElement.style.setProperty('--color-blue-500', '#3b82f6');
      const value = getColorValue('blue', 500);
      expect(value).toBe('#3b82f6');
    });

    it('should get color value for different shades', () => {
      document.documentElement.style.setProperty('--color-red-700', '#b91c1c');
      const value = getColorValue('red', 700);
      expect(value).toBe('#b91c1c');
    });

    it('should get color value for all shade levels', () => {
      const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
      shades.forEach((shade) => {
        document.documentElement.style.setProperty(`--color-green-${shade}`, `#green${shade}`);
        const value = getColorValue('green', shade);
        expect(value).toBe(`#green${shade}`);
      });
    });

    it('should get color value for different color families', () => {
      const families = ['red', 'blue', 'green', 'purple', 'gray'] as const;
      families.forEach((family) => {
        document.documentElement.style.setProperty(`--color-${family}-500`, `#${family}500`);
        const value = getColorValue(family, 500);
        expect(value).toBe(`#${family}500`);
      });
    });
  });

  describe('setThemeValue', () => {
    beforeEach(() => {
      document.documentElement.style.cssText = '';
    });

    it('should set CSS custom property with -- prefix', () => {
      setThemeValue('--theme-primary', '#0066ff');
      const value = document.documentElement.style.getPropertyValue('--theme-primary');
      expect(value).toBe('#0066ff');
    });

    it('should set CSS custom property without -- prefix', () => {
      setThemeValue('spacing-custom', '24px');
      const value = document.documentElement.style.getPropertyValue('--spacing-custom');
      expect(value).toBe('24px');
    });

    it('should overwrite existing property', () => {
      setThemeValue('--theme-primary', '#0066ff');
      setThemeValue('--theme-primary', '#ff0000');
      const value = document.documentElement.style.getPropertyValue('--theme-primary');
      expect(value).toBe('#ff0000');
    });

    it('should handle empty string value', () => {
      setThemeValue('--empty-value', '');
      const value = document.documentElement.style.getPropertyValue('--empty-value');
      expect(value).toBe('');
    });
  });

  describe('applyThemeValues', () => {
    beforeEach(() => {
      document.documentElement.style.cssText = '';
    });

    it('should apply multiple theme values at once', () => {
      applyThemeValues({
        '--theme-primary': '#0066ff',
        '--theme-secondary': '#708090',
      });

      expect(document.documentElement.style.getPropertyValue('--theme-primary')).toBe('#0066ff');
      expect(document.documentElement.style.getPropertyValue('--theme-secondary')).toBe('#708090');
    });

    it('should handle properties with and without -- prefix', () => {
      applyThemeValues({
        '--with-prefix': 'value1',
        'without-prefix': 'value2',
      });

      expect(document.documentElement.style.getPropertyValue('--with-prefix')).toBe('value1');
      expect(document.documentElement.style.getPropertyValue('--without-prefix')).toBe('value2');
    });

    it('should handle empty object', () => {
      applyThemeValues({});
      // Should not throw error
      expect(document.documentElement.style.cssText).toBe('');
    });

    it('should apply many properties', () => {
      const values = {
        '--color-1': '#111',
        '--color-2': '#222',
        '--color-3': '#333',
        '--spacing-1': '8px',
        '--spacing-2': '16px',
      };

      applyThemeValues(values);

      Object.entries(values).forEach(([key, value]) => {
        expect(document.documentElement.style.getPropertyValue(key)).toBe(value);
      });
    });
  });

  describe('pxToRem', () => {
    it('should convert pixels to rem with default base font size', () => {
      expect(pxToRem(16)).toBe('1rem');
    });

    it('should convert pixels to rem with custom base font size', () => {
      expect(pxToRem(24, 12)).toBe('2rem');
    });

    it('should handle decimal values', () => {
      expect(pxToRem(24)).toBe('1.5rem');
    });

    it('should handle zero', () => {
      expect(pxToRem(0)).toBe('0rem');
    });

    it('should handle negative values', () => {
      expect(pxToRem(-16)).toBe('-1rem');
    });

    it('should handle fractional pixels', () => {
      expect(pxToRem(8)).toBe('0.5rem');
    });

    it('should handle large values', () => {
      expect(pxToRem(160)).toBe('10rem');
    });

    it('should handle custom base font sizes', () => {
      expect(pxToRem(20, 10)).toBe('2rem');
      expect(pxToRem(32, 8)).toBe('4rem');
      expect(pxToRem(40, 20)).toBe('2rem');
    });

    it('should maintain precision for common design values', () => {
      expect(pxToRem(12)).toBe('0.75rem');
      expect(pxToRem(14)).toBe('0.875rem');
      expect(pxToRem(18)).toBe('1.125rem');
      expect(pxToRem(20)).toBe('1.25rem');
    });
  });

  describe('gridSpacing', () => {
    it('should generate spacing based on 4px grid', () => {
      expect(gridSpacing(1)).toBe('4px');
      expect(gridSpacing(2)).toBe('8px');
      expect(gridSpacing(4)).toBe('16px');
      expect(gridSpacing(6)).toBe('24px');
      expect(gridSpacing(8)).toBe('32px');
    });

    it('should handle zero', () => {
      expect(gridSpacing(0)).toBe('0px');
    });

    it('should handle negative values', () => {
      expect(gridSpacing(-2)).toBe('-8px');
    });

    it('should handle large values', () => {
      expect(gridSpacing(100)).toBe('400px');
    });

    it('should handle fractional units', () => {
      expect(gridSpacing(1.5)).toBe('6px');
      expect(gridSpacing(2.5)).toBe('10px');
    });
  });

  describe('isDarkMode', () => {
    beforeEach(() => {
      document.documentElement.removeAttribute('data-theme');
    });

    it('should return true when data-theme is dark', () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      expect(isDarkMode()).toBe(true);
    });

    it('should return false when data-theme is light', () => {
      document.documentElement.setAttribute('data-theme', 'light');
      expect(isDarkMode()).toBe(false);
    });

    it('should return false when data-theme is not set', () => {
      expect(isDarkMode()).toBe(false);
    });

    it('should return false when data-theme is an invalid value', () => {
      document.documentElement.setAttribute('data-theme', 'invalid');
      expect(isDarkMode()).toBe(false);
    });
  });

  describe('getThemeMode', () => {
    beforeEach(() => {
      document.documentElement.removeAttribute('data-theme');
    });

    it('should return "dark" when data-theme is dark', () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      expect(getThemeMode()).toBe('dark');
    });

    it('should return "light" when data-theme is light', () => {
      document.documentElement.setAttribute('data-theme', 'light');
      expect(getThemeMode()).toBe('light');
    });

    it('should return "light" when data-theme is not set', () => {
      expect(getThemeMode()).toBe('light');
    });

    it('should return "light" when data-theme is an invalid value', () => {
      document.documentElement.setAttribute('data-theme', 'invalid');
      expect(getThemeMode()).toBe('light');
    });

    it('should return "light" when data-theme is empty string', () => {
      document.documentElement.setAttribute('data-theme', '');
      expect(getThemeMode()).toBe('light');
    });
  });
});
