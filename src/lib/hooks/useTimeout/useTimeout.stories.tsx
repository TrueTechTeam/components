import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { useTimeout } from './useTimeout';
import { Button } from '../../components/buttons/Button';
import { Card } from '../../components/display/Card';
import { Checkbox } from '../../components/inputs/Checkbox';

// Auto-hide notification
function NotificationDemo() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  const showNotification = (msg: string) => {
    setMessage(msg);
    setVisible(true);
  };

  useTimeout({
    callback: () => setVisible(false),
    delay: visible ? 3000 : null, // Only active when visible
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>Auto-Hide Notification (3s)</h4>

      <div style={{ display: 'flex', gap: '8px' }}>
        <Button
          onClick={() => showNotification('Success! Your action was completed.')}
          variant="success"
        >
          Show Success
        </Button>
        <Button
          onClick={() => showNotification('Warning! Please check your input.')}
          variant="warning"
        >
          Show Warning
        </Button>
        <Button onClick={() => showNotification('Error! Something went wrong.')} variant="danger">
          Show Error
        </Button>
      </div>

      <Card
        variant="filled"
        padding="md"
        style={{
          background: visible ? 'var(--theme-primary)' : 'var(--theme-background-primary)',
          color: visible ? 'var(--theme-text-on-primary)' : 'var(--theme-text-disabled)',
          transition: 'all 0.3s ease',
          minHeight: '52px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {visible ? message : 'No notification'}
      </Card>
    </div>
  );
}

// Idle detection with reset
function IdleDemo() {
  const [isIdle, setIsIdle] = useState(false);
  const [activity, setActivity] = useState<string[]>([]);

  const { reset } = useTimeout({
    callback: () => {
      setIsIdle(true);
      setActivity((prev) => [...prev, 'User went idle']);
    },
    delay: 5000, // 5 seconds
  });

  const handleActivity = (type: string) => {
    setIsIdle(false);
    setActivity((prev) => [...prev.slice(-4), type]);
    reset();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>Idle Detection (5s timeout)</h4>
      <p style={{ margin: 0, color: 'var(--theme-text-tertiary)' }}>
        Click a button or the timeout will trigger. The timer resets on activity.
      </p>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button onClick={() => handleActivity('Button clicked')} variant="primary">
          Click me
        </Button>
        <Button onClick={() => handleActivity('Another click')} variant="primary">
          Or me
        </Button>
        <Button onClick={() => handleActivity('Keep clicking!')} variant="primary">
          Keep active
        </Button>
      </div>

      <Card
        variant="filled"
        padding="lg"
        style={{
          background: isIdle ? 'var(--theme-error)' : 'var(--theme-success)',
          color: 'var(--theme-text-on-primary)',
          textAlign: 'center',
          transition: 'background 0.3s ease',
        }}
      >
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{isIdle ? 'Idle' : 'Active'}</div>
        <div style={{ fontSize: '14px', opacity: 0.8 }}>
          {isIdle ? 'Click a button to become active' : 'Timer will reset on activity'}
        </div>
      </Card>

      <Card variant="outlined" padding="sm">
        <div
          style={{
            fontSize: '12px',
            fontFamily: 'monospace',
            maxHeight: '100px',
            overflow: 'auto',
            color: 'var(--theme-text-secondary)',
          }}
        >
          {activity.length === 0 ? (
            <span style={{ color: 'var(--theme-text-disabled)' }}>Activity log...</span>
          ) : (
            activity.map((a, i) => <div key={`activity-${i}`}>{a}</div>)
          )}
        </div>
      </Card>
    </div>
  );
}

// Delayed action with controls
function DelayedActionDemo() {
  const [status, setStatus] = useState<'idle' | 'pending' | 'executed'>('idle');
  const [countdown, setCountdown] = useState(5);

  const { reset, clear } = useTimeout({
    callback: () => {
      setStatus('executed');
      setCountdown(5);
    },
    delay: status === 'pending' ? 5000 : null,
  });

  // Countdown timer (separate from main timeout)
  React.useEffect(() => {
    if (status !== 'pending') {
      return;
    }

    const interval = setInterval(() => {
      setCountdown((c) => Math.max(0, c - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  const start = () => {
    setStatus('pending');
    setCountdown(5);
    reset();
  };

  const cancel = () => {
    clear();
    setStatus('idle');
    setCountdown(5);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>
        Delayed Action with Controls
      </h4>

      <div
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background:
            status === 'idle'
              ? 'var(--theme-background-primary)'
              : status === 'pending'
                ? 'var(--theme-warning)'
                : 'var(--theme-success)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: status === 'idle' ? 'var(--theme-text-tertiary)' : 'var(--theme-text-on-primary)',
          transition: 'background 0.3s ease',
          border: status === 'idle' ? '2px solid var(--theme-border-primary)' : 'none',
        }}
      >
        {status === 'pending' ? (
          <>
            <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{countdown}</div>
            <div style={{ fontSize: '12px' }}>seconds</div>
          </>
        ) : status === 'executed' ? (
          <>
            <div style={{ fontSize: '24px' }}>✓</div>
            <div style={{ fontSize: '12px' }}>Done!</div>
          </>
        ) : (
          <div>Ready</div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        {status === 'idle' && (
          <Button onClick={start} variant="primary">
            Start (5s delay)
          </Button>
        )}
        {status === 'pending' && (
          <>
            <Button onClick={cancel} variant="secondary">
              Cancel
            </Button>
            <Button onClick={start} variant="ghost">
              Reset
            </Button>
          </>
        )}
        {status === 'executed' && (
          <Button onClick={() => setStatus('idle')} variant="primary">
            Reset Demo
          </Button>
        )}
      </div>
    </div>
  );
}

// Conditional timeout
function ConditionalDemo() {
  const [enabled, setEnabled] = useState(true);
  const [counter, setCounter] = useState(0);

  useTimeout({
    callback: () => setCounter((c) => c + 1),
    delay: enabled ? 2000 : null, // null disables
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>Conditional Timeout</h4>
      <p style={{ margin: 0, color: 'var(--theme-text-tertiary)' }}>
        Pass <code style={{ color: 'var(--theme-primary)' }}>null</code> as delay to disable the
        timeout.
      </p>

      <Checkbox
        checked={enabled}
        onChange={(checked) => setEnabled(checked)}
        label="Enable timeout (2s)"
      />

      <Card
        variant="filled"
        padding="lg"
        style={{
          background: enabled ? 'var(--theme-primary)' : 'var(--theme-background-primary)',
          color: enabled ? 'var(--theme-text-on-primary)' : 'var(--theme-text-tertiary)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '48px', fontWeight: 'bold' }}>{counter}</div>
        <div>{enabled ? 'Incrementing every 2s (one-shot)' : 'Paused'}</div>
      </Card>

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
        {`useTimeout({
  callback: () => setCounter(c => c + 1),
  delay: ${enabled ? '2000' : 'null'}, // ${enabled ? 'active' : 'disabled'}
});`}
      </pre>
    </div>
  );
}

const meta: Meta = {
  title: 'Hooks/useTimeout',
  component: NotificationDemo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
\`useTimeout\` provides a declarative way to use setTimeout with automatic cleanup.

## Features
- Automatic cleanup on unmount
- \`null\` delay to pause/disable
- Reset and clear controls
- Stable callback reference (no stale closures)

## Basic Usage

\`\`\`tsx
import { useTimeout } from '@true-tech-team/ui-components';

// Auto-hide after 3 seconds
useTimeout({
  callback: () => setVisible(false),
  delay: 3000,
});

// Conditional (null to disable)
useTimeout({
  callback: () => setIdle(true),
  delay: isActive ? 30000 : null,
});
\`\`\`

## With Controls

\`\`\`tsx
const { reset, clear } = useTimeout({
  callback: () => setIdle(true),
  delay: 30000,
});

// Reset timer on activity
window.addEventListener('mousemove', reset);

// Cancel the timeout
clear();
\`\`\`

## Options

| Option | Type | Description |
|--------|------|-------------|
| \`callback\` | \`() => void\` | Function to execute |
| \`delay\` | \`number \\| null\` | Delay in ms (null to disable) |

## Return Value

| Property | Type | Description |
|----------|------|-------------|
| \`reset\` | \`() => void\` | Restart the timeout |
| \`clear\` | \`() => void\` | Cancel the timeout |
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: 'Auto-Hide Notification',
  render: () => <NotificationDemo />,
};

export const IdleDetection: Story = {
  render: () => <IdleDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Reset the timeout on user activity to implement idle detection.',
      },
    },
  },
};

export const WithControls: Story = {
  render: () => <DelayedActionDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Use reset() and clear() to control the timeout.',
      },
    },
  },
};

export const ConditionalTimeout: Story = {
  render: () => <ConditionalDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Pass null as delay to disable the timeout.',
      },
    },
  },
};
