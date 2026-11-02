import type { Meta, StoryObj } from '@storybook/react';
import { GlobalProvider } from './GlobalProvider';
import { Button } from '../../components/buttons/Button';
import { Icon } from '../../components/display/Icon';
import { useTheme } from '../../hooks';
import type { ThemeConfig } from '../../types';

const meta: Meta<typeof GlobalProvider> = {
  title: 'Providers/GlobalProvider',
  component: GlobalProvider,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
GlobalProvider is a context provider that wraps your application with theme, alert, dialog, and toast functionality.

It initializes the design system CSS variables and sets up the theme context for all child components to use CSS custom properties for styling.
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GlobalProvider>;

/**
 * A full config as downloaded from the Theme Builder (Storybook > Theme Builder > Download
 * theme.json). Pasted inline so library stories do not depend on builder code.
 */
const generatedTheme: ThemeConfig = {
  mode: 'light',
  theme: {
    modes: {
      light: {
        colors: {
          primary: '#00777e',
          primaryHover: '#00646a',
          primaryActive: '#005257',
          primaryDisabled: '#acdfe3',
          secondary: '#64748b',
          secondaryHover: '#536379',
          secondaryActive: '#435268',
          secondaryDisabled: '#cad5e5',
          success: '#278733',
          warning: '#986600',
          error: '#b9463f',
          info: '#0079b3',
          backgroundPrimary: '#f4feff',
          backgroundSecondary: '#eef7f8',
          backgroundTertiary: '#e4edee',
          surfacePrimary: '#ffffff',
          surfaceSecondary: '#f1fbfb',
          surfaceElevated: '#ffffff',
          textPrimary: '#131a1a',
          textSecondary: '#4f5758',
          textTertiary: '#6b7374',
          textDisabled: '#98a0a1',
          textOnPrimary: '#ffffff',
          borderPrimary: '#d0dada',
          borderSecondary: '#dde7e7',
          borderFocus: '#00777e',
          interactiveHover: '#e4edee',
          interactiveFocus: '#ceeff2',
          interactiveActive: '#d7e0e1',
          interactiveDisabled: '#eef7f8',
          inputBg: '#ffffff',
          inputBgDisabled: '#e4edee',
          inputBorder: '#7a8283',
          inputBorderHover: '#5d6566',
          inputBorderFocus: '#00777e',
          inputText: '#131a1a',
          inputPlaceholder: '#6b7374',
          controlBg: '#ffffff',
          controlBgChecked: '#00777e',
          controlBorder: '#7a8283',
          controlBorderHover: '#5d6566',
          primary50: '#e5fafb',
          secondary50: '#f1f5fc',
          primary100: '#ceeff2',
          secondary100: '#e1e8f3',
          primary200: '#acdfe3',
          secondary200: '#cad5e5',
          primary300: '#7fc5cb',
          secondary300: '#abb9cd',
          primary400: '#51a8ae',
          secondary400: '#8a9ab1',
          primary500: '#268a91',
          secondary500: '#6b7c93',
          primary600: '#007178',
          secondary600: '#55647b',
          primary700: '#00585e',
          secondary700: '#414e61',
          primary800: '#004145',
          secondary800: '#2d3949',
          primary900: '#002a2d',
          secondary900: '#1b2532',
        },
      },
      dark: {
        colors: {
          primary: '#51a8ae',
          primaryHover: '#65bbc1',
          primaryActive: '#78ced4',
          primaryDisabled: '#004145',
          secondary: '#8a9ab1',
          secondaryHover: '#9cadc4',
          secondaryActive: '#afc0d8',
          secondaryDisabled: '#2d3949',
          success: '#61bd67',
          warning: '#da950b',
          error: '#f47c70',
          info: '#30aff8',
          backgroundPrimary: '#0c1313',
          backgroundSecondary: '#151c1d',
          backgroundTertiary: '#1f2626',
          surfacePrimary: '#131a1a',
          surfaceSecondary: '#1a2121',
          surfaceElevated: '#232a2b',
          textPrimary: '#ebf4f5',
          textSecondary: '#b7c0c0',
          textTertiary: '#98a0a1',
          textDisabled: '#5d6566',
          textOnPrimary: '#111111',
          borderPrimary: '#353c3d',
          borderSecondary: '#282f30',
          borderFocus: '#51a8ae',
          interactiveHover: '#1f2626',
          interactiveFocus: '#004145',
          interactiveActive: '#2d3435',
          interactiveDisabled: '#151c1d',
          inputBg: '#131a1a',
          inputBgDisabled: '#1f2626',
          inputBorder: '#6b7374',
          inputBorderHover: '#899192',
          inputBorderFocus: '#51a8ae',
          inputText: '#ebf4f5',
          inputPlaceholder: '#98a0a1',
          controlBg: '#131a1a',
          controlBgChecked: '#51a8ae',
          controlBorder: '#6b7374',
          controlBorderHover: '#899192',
          primary50: '#e5fafb',
          secondary50: '#f1f5fc',
          primary100: '#ceeff2',
          secondary100: '#e1e8f3',
          primary200: '#acdfe3',
          secondary200: '#cad5e5',
          primary300: '#7fc5cb',
          secondary300: '#abb9cd',
          primary400: '#51a8ae',
          secondary400: '#8a9ab1',
          primary500: '#268a91',
          secondary500: '#6b7c93',
          primary600: '#007178',
          secondary600: '#55647b',
          primary700: '#00585e',
          secondary700: '#414e61',
          primary800: '#004145',
          secondary800: '#2d3949',
          primary900: '#002a2d',
          secondary900: '#1b2532',
        },
      },
    },
    spacing: {
      unit: 4,
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      xxl: '48px',
    },
    typography: {
      fontFamily: {
        primary:
          "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        secondary:
          "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      },
      fontSize: {
        xs: '0.694rem',
        sm: '0.833rem',
        base: '1rem',
        lg: '1.2rem',
        xl: '1.44rem',
        '2xl': '1.728rem',
        '3xl': '2.074rem',
        '4xl': '2.488rem',
      },
    },
    borderRadius: {
      none: '0',
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(16 24 40 / 3.6%), 0 1px 3px 0 rgb(16 24 40 / 6%)',
      md: '0 2px 4px -2px rgb(16 24 40 / 3.6%), 0 4px 8px -2px rgb(16 24 40 / 6%)',
      lg: '0 4px 6px -2px rgb(16 24 40 / 3%), 0 12px 16px -4px rgb(16 24 40 / 6%)',
      xl: '0 8px 8px -4px rgb(16 24 40 / 2.4%), 0 20px 24px -4px rgb(16 24 40 / 7.2%)',
    },
  },
};

/**
 * Theme showcase with toggle
 */
function ThemeShowcase() {
  const { mode, toggleMode } = useTheme();

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Button onClick={toggleMode} startIcon={<Icon name="check" size={16} />}>
          Toggle Theme (Current: {mode})
        </Button>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '24px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        }}
      >
        <div className="bg-primary p-4 rounded-md">
          <h3 className="text-on-primary">Primary Background</h3>
          <p className="text-on-primary">Theme-aware content</p>
        </div>

        <div className="bg-secondary p-4 rounded-md">
          <h3>Buttons</h3>
          <div className="flex gap-2 mt-2">
            <Button variant="primary" size="sm">
              Primary
            </Button>
            <Button variant="outline" size="sm">
              Outline
            </Button>
          </div>
        </div>

        <div className="surface-primary p-4 rounded-md border border-primary">
          <h3>Icons</h3>
          <div className="flex gap-3 mt-2">
            <Icon name="check" size={24} color="var(--theme-success)" />
            <Icon name="info" size={24} color="var(--theme-info)" />
            <Icon name="warning" size={24} color="var(--theme-warning)" />
            <Icon name="error" size={24} color="var(--theme-error)" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Light theme (default)
 */
export const LightTheme: Story = {
  args: {
    themeConfig: { mode: 'light' },
    children: <ThemeShowcase />,
  },
};

/**
 * Dark theme
 */
export const DarkTheme: Story = {
  args: {
    themeConfig: { mode: 'dark' },
    children: <ThemeShowcase />,
  },
};

/**
 * Custom theme colors
 */
export const CustomTheme: Story = {
  args: {
    themeConfig: {
      mode: 'light',
      theme: {
        colors: {
          primary: '#ff6b6b',
          secondary: '#4ecdc4',
        },
      },
    },
    children: (
      <div style={{ padding: '24px' }}>
        <h2>Custom Theme Colors</h2>
        <div style={{ marginTop: '16px', display: 'flex', gap: '16px' }}>
          <Button variant="primary">Custom Primary</Button>
          <Button variant="secondary">Custom Secondary</Button>
        </div>
      </div>
    ),
  },
};

/**
 * Theme generated by the Theme Builder, passed straight to GlobalProvider
 */
export const FromThemeJson: Story = {
  name: 'From theme.json',
  args: {
    themeConfig: generatedTheme,
    children: <ThemeShowcase />,
  },
};
