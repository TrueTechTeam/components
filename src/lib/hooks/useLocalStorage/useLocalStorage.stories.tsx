import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Button } from '../../components/buttons/Button';
import { Input } from '../../components/inputs/Input';
import { Textarea } from '../../components/inputs/Textarea';
import { Checkbox } from '../../components/inputs/Checkbox';
import { Select } from '../../components/inputs/Select';
import { Card } from '../../components/display/Card';

// Basic string storage
function BasicDemo() {
  const [name, setName, clearName] = useLocalStorage('demo-name', '');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>String Value</h4>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name..."
      />
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Button onClick={clearName} variant="secondary" size="sm">
          Clear
        </Button>
        <span style={{ color: 'var(--theme-text-tertiary)' }}>
          Stored: <code style={{ color: 'var(--theme-primary)' }}>{name || '(empty)'}</code>
        </span>
      </div>
      <p style={{ color: 'var(--theme-text-tertiary)', fontSize: '12px', margin: 0 }}>
        Refresh the page - your name will persist!
      </p>
    </div>
  );
}

// Theme preference
function ThemeDemo() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('demo-theme', 'light');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>Theme Preference</h4>
      <Card
        variant="filled"
        padding="lg"
        style={{
          background:
            theme === 'dark' ? 'var(--theme-surface-primary)' : 'var(--theme-background-primary)',
          color: theme === 'dark' ? 'var(--theme-text-primary)' : 'var(--theme-text-primary)',
          transition: 'all 0.3s ease',
        }}
      >
        <p style={{ margin: '0 0 16px 0' }}>Current theme: {theme}</p>
        <Button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          variant={theme === 'dark' ? 'primary' : 'secondary'}
        >
          Toggle Theme
        </Button>
      </Card>
    </div>
  );
}

// Object storage
function ObjectDemo() {
  const [settings, setSettings, clearSettings] = useLocalStorage('demo-settings', {
    notifications: true,
    newsletter: false,
    language: 'en',
  });

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>Object Storage (Settings)</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Checkbox
          checked={settings.notifications}
          onChange={(checked) => setSettings((s) => ({ ...s, notifications: checked }))}
          label="Enable notifications"
        />
        <Checkbox
          checked={settings.newsletter}
          onChange={(checked) => setSettings((s) => ({ ...s, newsletter: checked }))}
          label="Subscribe to newsletter"
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--theme-text-secondary)' }}>Language:</span>
          <Select
            value={settings.language}
            onChange={(value) => setSettings((s) => ({ ...s, language: value as string }))}
            options={languageOptions}
            style={{ minWidth: '150px' }}
          />
        </div>
      </div>
      <Button
        onClick={clearSettings}
        variant="secondary"
        size="sm"
        style={{ width: 'fit-content' }}
      >
        Reset to Defaults
      </Button>
      <pre
        style={{
          padding: '12px',
          background: 'var(--theme-background-primary)',
          borderRadius: '4px',
          fontSize: '12px',
          overflow: 'auto',
          color: 'var(--theme-text-secondary)',
          border: '1px solid var(--theme-border-primary)',
        }}
      >
        {JSON.stringify(settings, null, 2)}
      </pre>
    </div>
  );
}

// Counter with functional updates
function CounterDemo() {
  const [count, setCount, resetCount] = useLocalStorage('demo-count', 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>
        Counter (Functional Updates)
      </h4>
      <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--theme-primary)' }}>
        {count}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button onClick={() => setCount((c) => c - 1)} variant="secondary">
          -1
        </Button>
        <Button onClick={() => setCount((c) => c + 1)} variant="primary">
          +1
        </Button>
        <Button onClick={() => setCount((c) => c + 10)} variant="primary">
          +10
        </Button>
        <Button onClick={resetCount} variant="ghost">
          Reset
        </Button>
      </div>
      <p style={{ color: 'var(--theme-text-tertiary)', fontSize: '12px', margin: 0 }}>
        Uses functional updates: setCount(c {'>'} c + 1)
      </p>
    </div>
  );
}

// Cross-tab sync demo
function CrossTabDemo() {
  const [message, setMessage] = useLocalStorage('demo-shared', 'Hello from this tab!');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>Cross-Tab Sync</h4>
      <p style={{ margin: 0, color: 'var(--theme-text-tertiary)' }}>
        Open this page in another tab and change the message - it will sync automatically!
      </p>
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        placeholder="Type a message..."
      />
      <Card
        variant="filled"
        padding="md"
        style={{
          background: 'var(--theme-primary)',
          color: 'var(--theme-text-on-primary)',
        }}
      >
        Synced message: {message}
      </Card>
    </div>
  );
}

const meta: Meta = {
  title: 'Hooks/useLocalStorage',
  component: BasicDemo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
\`useLocalStorage\` is a React hook that persists state to browser localStorage with automatic JSON serialization and cross-tab synchronization.

## Features
- Automatic JSON serialization/deserialization
- Cross-tab synchronization via storage events
- Custom serializer support
- SSR-safe (returns default value on server)
- Graceful error handling

## Basic Usage

\`\`\`tsx
import { useLocalStorage } from '@true-tech-team/ui-components';

// String
const [name, setName] = useLocalStorage('user-name', '');

// Object
const [settings, setSettings] = useLocalStorage('app-settings', {
  theme: 'light',
  notifications: true,
});

// With remove function
const [token, setToken, removeToken] = useLocalStorage('auth-token', null);
\`\`\`

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| \`serializer\` | \`{ serialize, deserialize }\` | JSON | Custom serializer |
| \`syncTabs\` | \`boolean\` | \`true\` | Sync across browser tabs |

## Return Value

Returns a tuple: \`[value, setValue, remove]\`

- \`value\`: Current stored value
- \`setValue\`: Setter (supports functional updates like useState)
- \`remove\`: Removes key from localStorage and resets to default
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: 'String Value',
  render: () => <BasicDemo />,
};

export const ThemePreference: Story = {
  render: () => <ThemeDemo />,
};

export const ObjectStorage: Story = {
  render: () => <ObjectDemo />,
};

export const FunctionalUpdates: Story = {
  render: () => <CounterDemo />,
};

export const CrossTabSync: Story = {
  render: () => <CrossTabDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Changes are automatically synced across browser tabs via the storage event.',
      },
    },
  },
};
