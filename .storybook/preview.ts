import type { Preview } from '@storybook/react';
import { useEffect } from 'react';
import { GlobalProvider } from '../src/lib/providers/GlobalProvider';
import '../src/lib/styles/index.scss';

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
      default: 'dark',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#222831' },
      ],
    },
    layout: 'centered',
  },
  decorators: [
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

