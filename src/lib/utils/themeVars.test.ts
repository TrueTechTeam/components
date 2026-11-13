import { themeOverrideToCssVars } from './themeVars';

describe('themeOverrideToCssVars', () => {
  it('maps every override group to its CSS variable', () => {
    const vars = themeOverrideToCssVars(
      {
        colors: { primary: '#111111', surfaceElevated: '#222222', primary500: '#333333' },
        spacing: { unit: 5, md: '20px' },
        typography: {
          fontFamily: { primary: 'Inter' },
          fontSize: { '2xl': '1.6rem' },
          fontWeight: { bold: 800 },
          lineHeight: { tight: 1.2 },
        },
        borderRadius: { md: '10px' },
        shadows: { lg: 'none' },
      },
      'light'
    );
    expect(vars).toEqual({
      '--theme-primary': '#111111',
      '--theme-surface-elevated': '#222222',
      '--theme-primary-500': '#333333',
      '--spacing-unit': '5px',
      '--spacing-md': '20px',
      '--font-family-primary': 'Inter',
      '--font-size-2xl': '1.6rem',
      '--font-weight-bold': '800',
      '--line-height-tight': '1.2',
      '--radius-md': '10px',
      '--theme-shadow-lg': 'none',
    });
  });

  it('lets the active mode override shared colors', () => {
    const o = {
      colors: { primary: '#111111' },
      modes: { dark: { colors: { primary: '#eeeeee' } } },
    };
    expect(themeOverrideToCssVars(o, 'light')['--theme-primary']).toBe('#111111');
    expect(themeOverrideToCssVars(o, 'dark')['--theme-primary']).toBe('#eeeeee');
  });

  it('skips empty and undefined values', () => {
    expect(
      themeOverrideToCssVars({ colors: { primary: '', secondary: undefined } }, 'light')
    ).toEqual({});
  });

  it('returns {} for undefined', () =>
    expect(themeOverrideToCssVars(undefined, 'light')).toEqual({}));
});
