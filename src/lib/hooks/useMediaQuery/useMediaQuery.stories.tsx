import type { Meta, StoryObj } from '@storybook/react';
import { useMediaQuery } from './useMediaQuery';
import { Card } from '../../components/display/Card';

// Responsive breakpoints demo
function BreakpointsDemo() {
  const { matches: isMobile } = useMediaQuery('(max-width: 767px)');
  const { matches: isTablet } = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const { matches: isDesktop } = useMediaQuery('(min-width: 1024px)');

  const currentDevice = isMobile
    ? 'Mobile'
    : isTablet
      ? 'Tablet'
      : isDesktop
        ? 'Desktop'
        : 'Unknown';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '450px' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>Responsive Breakpoints</h4>

      <Card
        variant="filled"
        padding="lg"
        style={{
          background: 'var(--theme-primary)',
          color: 'var(--theme-text-on-primary)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '14px', opacity: 0.8 }}>Current device:</div>
        <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{currentDevice}</div>
      </Card>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <BreakpointIndicator label="Mobile" query="max-width: 767px" matches={isMobile} />
        <BreakpointIndicator label="Tablet" query="768px - 1023px" matches={isTablet} />
        <BreakpointIndicator label="Desktop" query="min-width: 1024px" matches={isDesktop} />
      </div>

      <p style={{ color: 'var(--theme-text-tertiary)', fontSize: '12px', margin: 0 }}>
        Resize your browser window to see the changes.
      </p>
    </div>
  );
}

function BreakpointIndicator({
  label,
  query,
  matches,
}: {
  label: string;
  query: string;
  matches: boolean;
}) {
  return (
    <Card
      variant={matches ? 'filled' : 'outlined'}
      padding="sm"
      style={{
        background: matches ? 'var(--theme-primary)' : undefined,
        color: matches ? 'var(--theme-text-on-primary)' : 'var(--theme-text-tertiary)',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontWeight: matches ? 'bold' : 'normal' }}>{label}</span>
        <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>{query}</span>
      </div>
    </Card>
  );
}

// User preferences demo
function PreferencesDemo() {
  const { matches: prefersDark } = useMediaQuery('(prefers-color-scheme: dark)');
  const { matches: prefersLight } = useMediaQuery('(prefers-color-scheme: light)');
  const { matches: prefersReducedMotion } = useMediaQuery('(prefers-reduced-motion: reduce)');
  const { matches: prefersHighContrast } = useMediaQuery('(prefers-contrast: more)');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>User Preferences</h4>
      <p style={{ color: 'var(--theme-text-tertiary)', margin: 0 }}>
        These values are based on your system/browser settings.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        <PreferenceCard
          label="Color Scheme"
          value={prefersDark ? 'Dark' : prefersLight ? 'Light' : 'Not set'}
          icon={prefersDark ? '🌙' : '☀️'}
          active={prefersDark || prefersLight}
        />
        <PreferenceCard
          label="Reduced Motion"
          value={prefersReducedMotion ? 'Enabled' : 'Disabled'}
          icon={prefersReducedMotion ? '🐢' : '🐇'}
          active={prefersReducedMotion}
        />
        <PreferenceCard
          label="High Contrast"
          value={prefersHighContrast ? 'Enabled' : 'Disabled'}
          icon={prefersHighContrast ? '◐' : '○'}
          active={prefersHighContrast}
        />
      </div>
    </div>
  );
}

function PreferenceCard({
  label,
  value,
  icon,
  active,
}: {
  label: string;
  value: string;
  icon: string;
  active: boolean;
}) {
  return (
    <Card
      variant="filled"
      padding="md"
      style={{
        background: active ? 'var(--theme-primary)' : 'var(--theme-background-primary)',
        color: active ? 'var(--theme-text-on-primary)' : 'var(--theme-text-primary)',
        textAlign: 'center',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontSize: '14px', opacity: 0.8 }}>{label}</div>
      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{value}</div>
    </Card>
  );
}

// Orientation demo
function OrientationDemo() {
  const { matches: isPortrait } = useMediaQuery('(orientation: portrait)');
  const { matches: isLandscape } = useMediaQuery('(orientation: landscape)');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>Screen Orientation</h4>

      <div
        style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '120px',
            borderRadius: '8px',
            border: `3px solid ${isPortrait ? 'var(--theme-primary)' : 'var(--theme-border-primary)'}`,
            background: isPortrait ? 'var(--theme-primary-100)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
        >
          <span
            style={{ color: isPortrait ? 'var(--theme-primary)' : 'var(--theme-text-disabled)' }}
          >
            Portrait
          </span>
        </div>

        <div
          style={{
            width: '120px',
            height: '80px',
            borderRadius: '8px',
            border: `3px solid ${isLandscape ? 'var(--theme-primary)' : 'var(--theme-border-primary)'}`,
            background: isLandscape ? 'var(--theme-primary-100)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
        >
          <span
            style={{ color: isLandscape ? 'var(--theme-primary)' : 'var(--theme-text-disabled)' }}
          >
            Landscape
          </span>
        </div>
      </div>

      <p
        style={{
          color: 'var(--theme-text-tertiary)',
          fontSize: '12px',
          margin: 0,
          textAlign: 'center',
        }}
      >
        Current: {isPortrait ? 'Portrait' : 'Landscape'}
      </p>
    </div>
  );
}

// Responsive component demo
function ResponsiveComponentDemo() {
  const { matches: isMobile } = useMediaQuery('(max-width: 600px)');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>Responsive Component</h4>
      <p style={{ color: 'var(--theme-text-tertiary)', margin: 0 }}>
        The layout changes based on screen width (resize to see).
      </p>

      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '16px',
          transition: 'all 0.3s ease',
        }}
      >
        <Card
          variant="filled"
          padding="lg"
          style={{
            flex: 1,
            background: 'var(--theme-primary)',
            color: 'var(--theme-text-on-primary)',
            textAlign: 'center',
          }}
        >
          Main Content
        </Card>
        <Card
          variant="filled"
          padding="lg"
          style={{
            width: isMobile ? '100%' : '200px',
            background: 'var(--theme-secondary-500)',
            color: 'var(--theme-text-primary)',
            textAlign: 'center',
            transition: 'width 0.3s ease',
          }}
        >
          Sidebar
        </Card>
      </div>

      <pre
        style={{
          padding: '12px',
          background: 'var(--theme-background-primary)',
          borderRadius: '4px',
          fontSize: '12px',
          color: 'var(--theme-text-secondary)',
          border: '1px solid var(--theme-border-primary)',
        }}
      >
        {`const { matches: isMobile } = useMediaQuery('(max-width: 600px)');
// Layout: ${isMobile ? 'column (stacked)' : 'row (side-by-side)'}`}
      </pre>
    </div>
  );
}

const meta: Meta = {
  title: 'Hooks/useMediaQuery',
  component: BreakpointsDemo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
\`useMediaQuery\` reacts to CSS media query changes, enabling responsive behavior in JavaScript.

## Features
- Supports all CSS media queries
- SSR-safe with configurable default value
- Change callback support
- Automatic cleanup

## Basic Usage

\`\`\`tsx
import { useMediaQuery } from '@true-tech-team/ui-components';

// Responsive breakpoints
const { matches: isMobile } = useMediaQuery('(max-width: 768px)');
const { matches: isDesktop } = useMediaQuery('(min-width: 1024px)');

// User preferences
const { matches: prefersDark } = useMediaQuery('(prefers-color-scheme: dark)');
const { matches: prefersReducedMotion } = useMediaQuery('(prefers-reduced-motion: reduce)');

// With callback
const { matches } = useMediaQuery('(max-width: 768px)', {
  onChange: (isMobile) => console.log('Mobile:', isMobile),
});
\`\`\`

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| \`defaultValue\` | \`boolean\` | \`false\` | Default for SSR |
| \`onChange\` | \`(matches) => void\` | - | Callback on change |

## Common Media Queries

| Query | Description |
|-------|-------------|
| \`(max-width: 768px)\` | Mobile devices |
| \`(min-width: 1024px)\` | Desktop devices |
| \`(prefers-color-scheme: dark)\` | Dark mode preference |
| \`(prefers-reduced-motion: reduce)\` | Reduced motion preference |
| \`(orientation: portrait)\` | Portrait orientation |
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: 'Breakpoints',
  render: () => <BreakpointsDemo />,
};

export const UserPreferences: Story = {
  render: () => <PreferencesDemo />,
};

export const Orientation: Story = {
  render: () => <OrientationDemo />,
};

export const ResponsiveLayout: Story = {
  render: () => <ResponsiveComponentDemo />,
};
