import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { useClipboard } from './useClipboard';
import { Button } from '../../components/buttons/Button';
import { Input } from '../../components/inputs/Input';
import { Card } from '../../components/display/Card';
import { Badge } from '../../components/display/Badge';

// Basic copy button
function BasicDemo() {
  const { copy, copied } = useClipboard();
  const textToCopy = 'Hello, World! This text was copied to your clipboard.';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>Basic Copy Button</h4>

      <Card variant="outlined" padding="md">
        <code
          style={{
            fontFamily: 'monospace',
            fontSize: '14px',
            color: 'var(--theme-text-secondary)',
          }}
        >
          {textToCopy}
        </code>
      </Card>

      <Button
        onClick={() => copy(textToCopy)}
        variant={copied ? 'secondary' : 'primary'}
        style={{
          background: copied ? 'var(--theme-success)' : undefined,
          borderColor: copied ? 'var(--theme-success)' : undefined,
        }}
      >
        {copied ? '✓ Copied!' : 'Copy to Clipboard'}
      </Button>
    </div>
  );
}

// Copy with input
function InputDemo() {
  const [text, setText] = useState('');
  const { copy, copied } = useClipboard();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>Copy Custom Text</h4>

      <div style={{ display: 'flex', gap: '8px' }}>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to copy..."
          style={{ flex: 1 }}
        />
        <Button
          onClick={() => copy(text)}
          disabled={!text}
          variant={copied ? 'secondary' : 'primary'}
          style={{
            background: copied ? 'var(--theme-success)' : undefined,
            borderColor: copied ? 'var(--theme-success)' : undefined,
          }}
        >
          {copied ? '✓' : 'Copy'}
        </Button>
      </div>
    </div>
  );
}

// Copy code block
function CodeBlockDemo() {
  const { copy, copied } = useClipboard();

  const codeSnippet = `import { useClipboard } from '@true-tech-team/ui-components';

function CopyButton({ text }) {
  const { copy, copied } = useClipboard();

  return (
    <button onClick={() => copy(text)}>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>Copy Code Block</h4>

      <div style={{ position: 'relative' }}>
        <pre
          style={{
            padding: '16px',
            paddingRight: '60px',
            background: 'var(--theme-surface-primary)',
            color: 'var(--theme-text-primary)',
            borderRadius: '8px',
            fontSize: '13px',
            overflow: 'auto',
            margin: 0,
            border: '1px solid var(--theme-border-primary)',
          }}
        >
          {codeSnippet}
        </pre>

        <Button
          onClick={() => copy(codeSnippet)}
          size="sm"
          variant={copied ? 'secondary' : 'ghost'}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: copied ? 'var(--theme-success)' : 'var(--theme-interactive-hover)',
            color: 'var(--theme-text-primary)',
          }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </Button>
      </div>
    </div>
  );
}

// Multiple copy buttons
function MultipleDemo() {
  const items = [
    { label: 'Email', value: 'hello@example.com' },
    { label: 'Phone', value: '+1 (555) 123-4567' },
    { label: 'Address', value: '123 Main St, City, State 12345' },
    { label: 'Website', value: 'https://example.com' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '450px' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>Multiple Copy Buttons</h4>
      <p style={{ margin: 0, color: 'var(--theme-text-tertiary)' }}>
        Each item has its own copy state.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((item) => (
          <CopyItem key={item.label} label={item.label} value={item.value} />
        ))}
      </div>
    </div>
  );
}

function CopyItem({ label, value }: { label: string; value: string }) {
  const { copy, copied } = useClipboard({ successDuration: 1500 });

  return (
    <Card variant="filled" padding="md">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: '12px', color: 'var(--theme-text-tertiary)' }}>{label}</div>
          <div style={{ fontFamily: 'monospace', color: 'var(--theme-text-primary)' }}>{value}</div>
        </div>
        <Button
          onClick={() => copy(value)}
          size="sm"
          variant={copied ? 'secondary' : 'primary'}
          style={{
            background: copied ? 'var(--theme-success)' : undefined,
            borderColor: copied ? 'var(--theme-success)' : undefined,
            minWidth: '70px',
          }}
        >
          {copied ? '✓' : 'Copy'}
        </Button>
      </div>
    </Card>
  );
}

// With callbacks
function CallbackDemo() {
  const [logs, setLogs] = useState<string[]>([]);

  const { copy, copied, error } = useClipboard({
    successDuration: 3000,
    onSuccess: (text) => {
      setLogs((prev) => [...prev, `✓ Copied: "${text.slice(0, 30)}..."`]);
    },
    onError: (err) => {
      setLogs((prev) => [...prev, `✗ Error: ${err.message}`]);
    },
  });

  const testTexts = [
    'Short text',
    'A longer piece of text that demonstrates the callback',
    'Special chars: <script>alert("xss")</script>',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>With Callbacks</h4>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {testTexts.map((text, i) => (
          <Button key={i} onClick={() => copy(text)} variant="primary">
            Copy #{i + 1}
          </Button>
        ))}
        <Button onClick={() => setLogs([])} variant="secondary">
          Clear Logs
        </Button>
      </div>

      <Card variant="filled" padding="md" style={{ background: 'var(--theme-surface-primary)' }}>
        <div
          style={{
            minHeight: '100px',
            maxHeight: '200px',
            overflow: 'auto',
          }}
        >
          {logs.length === 0 ? (
            <div style={{ color: 'var(--theme-text-tertiary)' }}>Logs will appear here...</div>
          ) : (
            logs.map((log, i) => (
              <div
                key={i}
                style={{
                  color: log.startsWith('✓') ? 'var(--theme-success)' : 'var(--theme-error)',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  marginBottom: '4px',
                }}
              >
                {log}
              </div>
            ))
          )}
        </div>
      </Card>

      {copied && <Badge variant="success">Copied state will reset in 3 seconds...</Badge>}
      {error && <Badge variant="danger">Error: {error.message}</Badge>}
    </div>
  );
}

const meta: Meta = {
  title: 'Hooks/useClipboard',
  component: BasicDemo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
\`useClipboard\` copies text to the clipboard with success/error feedback.

## Features
- Modern Clipboard API with fallback for older browsers
- Auto-reset of copied state after configurable duration
- Success and error callbacks
- Error handling for permission issues

## Basic Usage

\`\`\`tsx
import { useClipboard } from '@true-tech-team/ui-components';

function CopyButton({ text }: { text: string }) {
  const { copy, copied } = useClipboard();

  return (
    <button onClick={() => copy(text)}>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
\`\`\`

## With Options

\`\`\`tsx
const { copy, copied, error } = useClipboard({
  successDuration: 3000, // Reset after 3 seconds
  onSuccess: (text) => toast.success('Copied!'),
  onError: (err) => toast.error(err.message),
});
\`\`\`

## Return Value

| Property | Type | Description |
|----------|------|-------------|
| \`copy\` | \`(text: string) => Promise<boolean>\` | Copy function |
| \`copied\` | \`boolean\` | Whether recently copied |
| \`error\` | \`Error \\| null\` | Error if copy failed |
| \`reset\` | \`() => void\` | Reset copied/error state |
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: 'Basic',
  render: () => <BasicDemo />,
};

export const CustomInput: Story = {
  render: () => <InputDemo />,
};

export const CodeBlock: Story = {
  render: () => <CodeBlockDemo />,
};

export const MultipleCopyButtons: Story = {
  render: () => <MultipleDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Each copy button maintains its own independent state.',
      },
    },
  },
};

export const WithCallbacks: Story = {
  render: () => <CallbackDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Using onSuccess and onError callbacks for logging or notifications.',
      },
    },
  },
};
