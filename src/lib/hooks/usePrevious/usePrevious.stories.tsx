import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { usePrevious } from './usePrevious';
import { Button } from '../../components/buttons/Button';
import { Input } from '../../components/inputs/Input';
import { Card } from '../../components/display/Card';
import { Badge } from '../../components/display/Badge';

// Counter with previous value
function CounterDemo() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  const diff = prevCount !== undefined ? count - prevCount : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>Counter with Previous Value</h4>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: 'var(--theme-text-tertiary)' }}>Previous</div>
          <div
            style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--theme-text-disabled)' }}
          >
            {prevCount ?? '-'}
          </div>
        </div>

        <div style={{ fontSize: '24px', color: 'var(--theme-text-tertiary)' }}>→</div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: 'var(--theme-text-tertiary)' }}>Current</div>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--theme-primary)' }}>
            {count}
          </div>
        </div>

        {diff !== 0 && (
          <Badge variant={diff > 0 ? 'success' : 'danger'} size="lg">
            {diff > 0 ? '+' : ''}
            {diff}
          </Badge>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <Button onClick={() => setCount((c) => c - 5)} variant="secondary">
          -5
        </Button>
        <Button onClick={() => setCount((c) => c - 1)} variant="secondary">
          -1
        </Button>
        <Button onClick={() => setCount((c) => c + 1)} variant="primary">
          +1
        </Button>
        <Button onClick={() => setCount((c) => c + 5)} variant="primary">
          +5
        </Button>
        <Button onClick={() => setCount(Math.floor(Math.random() * 100))} variant="ghost">
          Random
        </Button>
      </div>
    </div>
  );
}

// Text change tracker
function TextChangeDemo() {
  const [text, setText] = useState('Hello');
  const prevText = usePrevious(text);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>Text Change Tracker</h4>

      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something..."
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
        }}
      >
        <Card variant="outlined" padding="md">
          <div
            style={{ fontSize: '12px', color: 'var(--theme-text-tertiary)', marginBottom: '8px' }}
          >
            Previous:
          </div>
          <div
            style={{
              fontFamily: 'monospace',
              wordBreak: 'break-all',
              color: 'var(--theme-text-secondary)',
            }}
          >
            &quot;{prevText ?? '(none)'}&quot;
          </div>
        </Card>

        <Card variant="filled" padding="md" style={{ background: 'var(--theme-primary)' }}>
          <div
            style={{
              fontSize: '12px',
              color: 'var(--theme-text-on-primary)',
              opacity: 0.8,
              marginBottom: '8px',
            }}
          >
            Current:
          </div>
          <div
            style={{
              fontFamily: 'monospace',
              wordBreak: 'break-all',
              color: 'var(--theme-text-on-primary)',
            }}
          >
            &quot;{text}&quot;
          </div>
        </Card>
      </div>

      {prevText !== undefined && prevText !== text && (
        <div style={{ color: 'var(--theme-text-tertiary)', fontSize: '12px' }}>
          Changed from {prevText.length} to {text.length} characters
        </div>
      )}
    </div>
  );
}

// User ID change detection
function UserChangeDemo() {
  const [userId, setUserId] = useState('user-1');
  const prevUserId = usePrevious(userId);
  const [loadCount, setLoadCount] = useState(0);

  // Simulate data refetch when user changes
  React.useEffect(() => {
    if (prevUserId !== undefined && prevUserId !== userId) {
      setLoadCount((c) => c + 1);
    }
  }, [userId, prevUserId]);

  const users = ['user-1', 'user-2', 'user-3', 'user-4'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>Detecting User Change</h4>
      <p style={{ margin: 0, color: 'var(--theme-text-tertiary)' }}>
        Data is &quot;refetched&quot; when the user ID changes (detected via usePrevious).
      </p>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {users.map((id) => (
          <Button
            key={id}
            onClick={() => setUserId(id)}
            variant={userId === id ? 'primary' : 'secondary'}
          >
            {id}
          </Button>
        ))}
      </div>

      <Card variant="outlined" padding="md">
        <div style={{ color: 'var(--theme-text-secondary)' }}>
          Current: <strong style={{ color: 'var(--theme-text-primary)' }}>{userId}</strong>
        </div>
        <div style={{ color: 'var(--theme-text-secondary)' }}>
          Previous:{' '}
          <strong style={{ color: 'var(--theme-text-primary)' }}>{prevUserId ?? '(none)'}</strong>
        </div>
        <div style={{ marginTop: '8px', color: 'var(--theme-primary)' }}>
          Data refetched {loadCount} time(s)
        </div>
      </Card>

      <pre
        style={{
          padding: '12px',
          background: 'var(--theme-surface-primary)',
          color: 'var(--theme-primary)',
          borderRadius: '4px',
          fontSize: '12px',
          overflow: 'auto',
          border: '1px solid var(--theme-border-primary)',
        }}
      >
        {`useEffect(() => {
  if (prevUserId && prevUserId !== userId) {
    // User changed - refetch data
    fetchUserData(userId);
  }
}, [userId, prevUserId]);`}
      </pre>
    </div>
  );
}

// Animation direction
function AnimationDemo() {
  const [step, setStep] = useState(0);
  const prevStep = usePrevious(step);

  const direction = prevStep !== undefined ? (step > prevStep ? 'forward' : 'backward') : 'none';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>Animation Direction</h4>
      <p style={{ margin: 0, color: 'var(--theme-text-tertiary)' }}>
        Determine animation direction based on previous vs current value.
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {[0, 1, 2, 3, 4].map((s) => (
          <div
            key={s}
            onClick={() => setStep(s)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background:
                step === s
                  ? 'var(--theme-primary)'
                  : step > s
                    ? 'var(--theme-primary-200)'
                    : 'var(--theme-background-primary)',
              border:
                step === s
                  ? 'none'
                  : `2px solid ${step > s ? 'var(--theme-primary-200)' : 'var(--theme-border-primary)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: step === s ? 'var(--theme-text-on-primary)' : 'var(--theme-text-tertiary)',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {s + 1}
          </div>
        ))}
      </div>

      <Card
        variant="filled"
        padding="md"
        style={{
          background:
            direction === 'forward'
              ? 'var(--theme-success)'
              : direction === 'backward'
                ? 'var(--theme-warning)'
                : 'var(--theme-background-primary)',
          color:
            direction !== 'none' ? 'var(--theme-text-on-primary)' : 'var(--theme-text-tertiary)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s ease',
        }}
      >
        {direction === 'forward' && '→'}
        {direction === 'backward' && '←'}
        Direction: {direction}
      </Card>
    </div>
  );
}

const meta: Meta = {
  title: 'Hooks/usePrevious',
  component: CounterDemo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
\`usePrevious\` is a React hook that tracks the previous value of a state or prop across renders, useful for comparing values, detecting changes, and determining the direction of change.

## Basic Usage

\`\`\`tsx
import { usePrevious } from '@true-tech-team/ui-components';

function Counter({ count }: { count: number }) {
  const prevCount = usePrevious(count);

  return (
    <div>
      Current: {count}, Previous: {prevCount ?? 'N/A'}
      {prevCount !== undefined && count > prevCount && ' (increased)'}
    </div>
  );
}
\`\`\`

## Common Use Cases

### Detecting Changes
\`\`\`tsx
const prevUserId = usePrevious(userId);

useEffect(() => {
  if (prevUserId && prevUserId !== userId) {
    // User changed - reset state or refetch data
    resetForm();
  }
}, [userId, prevUserId]);
\`\`\`

### Animation Direction
\`\`\`tsx
const prevStep = usePrevious(step);
const direction = step > prevStep ? 'forward' : 'backward';
\`\`\`

## Notes
- Returns \`undefined\` on the first render
- The ref is updated after render (in useEffect), so the previous value is always one render behind
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: 'Counter',
  render: () => <CounterDemo />,
};

export const TextTracking: Story = {
  render: () => <TextChangeDemo />,
};

export const ChangeDetection: Story = {
  render: () => <UserChangeDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Use usePrevious to detect when a prop/state changes and trigger side effects.',
      },
    },
  },
};

export const AnimationDirection: Story = {
  render: () => <AnimationDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Determine animation direction by comparing current value to previous value.',
      },
    },
  },
};
