/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Preview } from '@storybook/react';
import React, { useEffect } from 'react';
import { DocsContainer } from '@storybook/blocks';
import { GlobalProvider } from '../src/lib/providers/GlobalProvider';
import { create } from '@storybook/theming';
import '../src/lib/styles/index.scss';

// Docs themes for light/dark modes
export const lightDocsTheme = create({
  base: 'light',

  colorPrimary: '#00adb5',
  colorSecondary: '#64748b',

  // Backgrounds
  appBg: '#f3f4f6',
  appContentBg: '#ffffff',
  appBorderColor: '#e5e7eb',
  appBorderRadius: 8,

  // Text
  textColor: '#1f2937',
  textInverseColor: '#eee',

  // Typography
  fontBase: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontCode: '"Courier New", monospace',

  // Inputs
  inputBg: '#ffffff',
  inputBorder: '#d1d5db',
  inputTextColor: '#1f2937',
  inputBorderRadius: 8,

  // Buttons
  buttonBg: '#f3f4f6',
  buttonBorder: '#d1d5db',

  // Booleans
  booleanBg: '#ffffff',
  booleanSelectedBg: '#00adb5',
});

export const darkDocsTheme = create({
  base: 'dark',

  colorPrimary: '#00adb5',
  colorSecondary: '#eee',

  // Backgrounds
  appBg: '#222831',
  appContentBg: '#393e46',
  appBorderColor: '#31363f',
  appBorderRadius: 8,

  // Text
  textColor: '#eee',
  textInverseColor: '#1f2937',

  // Typography
  fontBase: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontCode: '"Courier New", monospace',

  // Inputs
  inputBg: '#2a2e35',
  inputBorder: '#4a5058',
  inputTextColor: '#eee',
  inputBorderRadius: 8,

  // Buttons
  buttonBg: '#2a2e35',
  buttonBorder: '#4a5058',

  // Booleans
  booleanBg: '#2a2e35',
  booleanSelectedBg: '#00adb5',
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
      container: (props: React.ComponentProps<typeof DocsContainer>) => {
        const theme =
          ((props.context as any).store?.userGlobals?.globals?.theme as string) || 'dark';
        return (
          <DocsContainer {...props} theme={theme === 'light' ? lightDocsTheme : darkDocsTheme} />
        );
      },
    },
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '400px',
        }}
      >
        <Story />
      </div>
    ),
    (Story, context) => {
      const theme = context.globals.theme || 'dark';

      // Apply theme to the iframe's document root and sync with parent for docs pages
      useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);

        // Also try to update parent document for docs pages
        try {
          if (window.parent && window.parent.document) {
            window.parent.document.documentElement.setAttribute('data-theme', theme);
          }
        } catch {
          // Cross-origin restrictions may prevent this
        }
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
