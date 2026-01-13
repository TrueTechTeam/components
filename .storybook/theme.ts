import { create } from '@storybook/theming/create';

export const lightTheme = create({
  base: 'light',

  // Brand
  brandTitle:
    '<div style="display: flex; flex-direction: column; align-items: flex-start; gap: 8px;"><img src="./logo/logo.svg" style="height: 50px" /> True Tech Team Components</div>',
  brandUrl: 'https://truetechteam.com',
  brandTarget: '_self',

  // Colors
  colorPrimary: '#0066ff',
  colorSecondary: '#708090',

  // UI
  appBg: '#f5f7fa',
  appContentBg: '#ffffff',
  appBorderColor: '#e0e0e0',
  appBorderRadius: 8,

  // Typography
  fontBase: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontCode: '"Courier New", monospace',

  // Text colors
  textColor: '#333333',
  textInverseColor: '#ffffff',

  // Toolbar
  barTextColor: '#666666',
  barSelectedColor: '#0066ff',
  barBg: '#ffffff',

  // Form colors
  inputBg: '#ffffff',
  inputBorder: '#e0e0e0',
  inputTextColor: '#333333',
  inputBorderRadius: 4,
});

export const darkTheme = create({
  base: 'dark',

  // Brand
  brandTitle:
    '<div style="display: flex; flex-direction: column; align-items: flex-start; gap: 8px;"><img src="./logo/logo.svg" style="height: 50px" /> True Tech Team Components</div>',
  brandUrl: 'https://truetechteam.com',
  brandTarget: '_self',

  // Colors
  colorPrimary: '#4d94ff',
  colorSecondary: '#9ca3af',

  // UI
  appBg: '#1a1a1a',
  appContentBg: '#252525',
  appBorderColor: '#3a3a3a',
  appBorderRadius: 8,

  // Typography
  fontBase: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontCode: '"Courier New", monospace',

  // Text colors
  textColor: '#e5e5e5',
  textInverseColor: '#1a1a1a',

  // Toolbar
  barTextColor: '#b3b3b3',
  barSelectedColor: '#4d94ff',
  barBg: '#252525',

  // Form colors
  inputBg: '#2a2a2a',
  inputBorder: '#3a3a3a',
  inputTextColor: '#e5e5e5',
  inputBorderRadius: 4,
});

export default darkTheme;

