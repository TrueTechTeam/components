import type { Preview } from '@storybook/react';
import React, { useEffect } from 'react';
import { GlobalProvider } from '../src/lib/providers/GlobalProvider';
import { create } from '@storybook/theming';
import '../src/lib/styles/index.scss';

const docsTheme = create({
  base: 'dark',

  colorPrimary: '#00adb5',
  colorSecondary: '#eee',

  // Docs backgrounds
  appBg: '#222831',
  appContentBg: '#393e46',

  // Text
  textColor: '#eee',
  textInverseColor: '#1f2937',

  fontBase: '"Inter", sans-serif',
});

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      disable: true,
    },
    docs: {
      theme: docsTheme,
    },
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ minWidth: '400px' }}>
        <Story />
      </div>
    ),
    (Story, context) => {
      const theme = context.globals.theme || 'dark';

      // Apply theme to the iframe's document root
      useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
      }, [theme]);

      return GlobalProvider({
        children: Story(),
        themeConfig: { mode: theme },
      });
    },
  ],
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'dark',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
};

export default preview;

