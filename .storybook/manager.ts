import { addons } from 'storybook/manager-api';
import { lightTheme, darkTheme } from './theme';

// Detect user's preferred color scheme
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Set initial theme
addons.setConfig({
  theme: prefersDark ? darkTheme : lightTheme,
  sidebar: {
    showRoots: true,
    collapsedRoots: ['other'],
  },
});

// Listen to the Storybook channel for theme changes
const channel = addons.getChannel();

channel.on('GLOBALS_UPDATED', ({ globals }) => {
  if (globals?.theme) {
    const newTheme = globals.theme === 'dark' ? darkTheme : lightTheme;
    addons.setConfig({
      theme: newTheme,
    });
  }
});

// Also listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  // Only apply system theme if no manual theme is selected
  const channel = addons.getChannel();
  channel.emit('UPDATE_GLOBALS', {
    globals: {
      theme: e.matches ? 'dark' : 'light',
    },
  });
});
