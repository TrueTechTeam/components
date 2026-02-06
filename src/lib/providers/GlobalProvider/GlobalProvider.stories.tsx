import type { Meta, StoryObj } from '@storybook/react';
import { GlobalProvider } from './GlobalProvider';
import { Button } from '../../components/buttons/Button';
import { Icon } from '../../components/display/Icon';
import { useTheme } from '../../hooks';

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
