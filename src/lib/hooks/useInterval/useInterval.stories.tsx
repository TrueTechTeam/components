import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { useInterval } from './useInterval';
import { Button } from '../../components/buttons/Button';
import { Card } from '../../components/display/Card';
import { Checkbox } from '../../components/inputs/Checkbox';
import { ProgressBar } from '../../components/display/ProgressBar';

// Basic counter
function CounterDemo() {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useInterval({
    callback: () => setCount((c) => c + 1),
    delay: isRunning ? 1000 : null,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>Basic Counter (1s interval)</h4>

      <div
        style={{
          fontSize: '72px',
          fontWeight: 'bold',
          color: 'var(--theme-primary)',
          fontFamily: 'monospace',
        }}
      >
        {count}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <Button onClick={() => setIsRunning(!isRunning)} variant="primary">
          {isRunning ? 'Pause' : 'Resume'}
        </Button>
        <Button
          onClick={() => {
            setCount(0);
            setIsRunning(true);
          }}
          variant="secondary"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}

// Countdown timer
function CountdownDemo() {
  const [seconds, setSeconds] = useState(10);
  const [isRunning, setIsRunning] = useState(false);

  useInterval({
    callback: () => setSeconds((s) => s - 1),
    delay: isRunning && seconds > 0 ? 1000 : null,
  });

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>Countdown Timer</h4>

      <div
        style={{
          fontSize: '64px',
          fontWeight: 'bold',
          color:
            seconds === 0
              ? 'var(--theme-error)'
              : seconds <= 5
                ? 'var(--theme-warning)'
                : 'var(--theme-primary)',
          fontFamily: 'monospace',
          transition: 'color 0.3s ease',
        }}
      >
        {formatTime(seconds)}
      </div>

      {seconds === 0 && (
        <div style={{ color: 'var(--theme-error)', fontWeight: 'bold' }}>Time is up!</div>
      )}

      <div style={{ display: 'flex', gap: '8px' }}>
        <Button onClick={() => setIsRunning(!isRunning)} disabled={seconds === 0} variant="primary">
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button
          onClick={() => {
            setSeconds(10);
            setIsRunning(false);
          }}
          variant="secondary"
        >
          Reset
        </Button>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <Button onClick={() => setSeconds(30)} variant="ghost" size="sm">
          30s
        </Button>
        <Button onClick={() => setSeconds(60)} variant="ghost" size="sm">
          1m
        </Button>
        <Button onClick={() => setSeconds(300)} variant="ghost" size="sm">
          5m
        </Button>
      </div>
    </div>
  );
}

// Auto-refresh data
function AutoRefreshDemo() {
  const [data, setData] = useState<{ time: string; value: number } | null>(null);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [refreshCount, setRefreshCount] = useState(0);

  const fetchData = () => {
    // Simulate API call
    setData({
      time: new Date().toLocaleTimeString(),
      value: Math.floor(Math.random() * 1000),
    });
    setRefreshCount((c) => c + 1);
  };

  useInterval({
    callback: fetchData,
    delay: isAutoRefresh ? 3000 : null,
    immediate: true, // Fetch immediately on mount
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>Auto-Refresh Data (3s)</h4>

      <Card variant="filled" padding="lg">
        {data ? (
          <>
            <div style={{ fontSize: '14px', color: 'var(--theme-text-tertiary)' }}>
              Last updated: {data.time}
            </div>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--theme-primary)' }}>
              {data.value}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--theme-text-disabled)' }}>
              Refreshed {refreshCount} time(s)
            </div>
          </>
        ) : (
          <div style={{ color: 'var(--theme-text-disabled)' }}>Loading...</div>
        )}
      </Card>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Checkbox
          checked={isAutoRefresh}
          onChange={(checked) => setIsAutoRefresh(checked)}
          label="Auto-refresh"
        />
        <Button onClick={fetchData} variant="secondary" size="sm">
          Refresh Now
        </Button>
      </div>

      <pre
        style={{
          padding: '12px',
          background: 'var(--theme-surface-primary)',
          color: 'var(--theme-primary)',
          borderRadius: '4px',
          fontSize: '12px',
          border: '1px solid var(--theme-border-primary)',
        }}
      >
        {`useInterval({
  callback: fetchData,
  delay: ${isAutoRefresh ? '3000' : 'null'},
  immediate: true, // Fetch on mount
});`}
      </pre>
    </div>
  );
}

// Progress bar
function ProgressDemo() {
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const { reset, clear } = useInterval({
    callback: () => {
      setProgress((p) => {
        if (p >= 100) {
          clear();
          return 100;
        }
        return p + 2;
      });
    },
    delay: isRunning && progress < 100 ? 50 : null,
  });

  const startProgress = () => {
    setProgress(0);
    setIsRunning(true);
    reset();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>Progress Bar</h4>

      <ProgressBar
        value={progress}
        max={100}
        variant={progress === 100 ? 'success' : 'primary'}
        label={progress === 100 ? 'Complete' : `${progress}%`}
        size="lg"
      />

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <Button onClick={startProgress} disabled={isRunning && progress < 100} variant="primary">
          {progress === 100 ? 'Restart' : 'Start'}
        </Button>
        <Button
          onClick={() => {
            setIsRunning(!isRunning);
          }}
          disabled={progress === 100}
          variant="secondary"
        >
          {isRunning ? 'Pause' : 'Resume'}
        </Button>
        <Button
          onClick={() => {
            clear();
            setProgress(0);
            setIsRunning(false);
          }}
          variant="ghost"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}

// Clock
function ClockDemo() {
  const [time, setTime] = useState(new Date());

  useInterval({
    callback: () => setTime(new Date()),
    delay: 1000,
    immediate: true,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>Live Clock</h4>

      <Card variant="filled" padding="lg" style={{ background: 'var(--theme-surface-primary)' }}>
        <div
          style={{
            color: 'var(--theme-primary)',
            fontFamily: 'monospace',
            fontSize: '48px',
            fontWeight: 'bold',
            letterSpacing: '4px',
          }}
        >
          {time.toLocaleTimeString()}
        </div>
      </Card>

      <div style={{ color: 'var(--theme-text-tertiary)', fontSize: '14px' }}>
        {time.toLocaleDateString()}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Hooks/useInterval',
  component: CounterDemo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
\`useInterval\` is a React hook that provides a declarative way to use setInterval with automatic cleanup and pause/resume control.

## Features
- Automatic cleanup on unmount
- \`null\` delay to pause/disable
- \`immediate\` option to run on mount
- Reset and clear controls
- Stable callback reference (no stale closures)

## Basic Usage

\`\`\`tsx
import { useInterval } from '@true-tech-team/ui-components';

// Basic counter
useInterval({
  callback: () => setCount(c => c + 1),
  delay: 1000,
});

// Pausable (null to disable)
useInterval({
  callback: () => tick(),
  delay: isPaused ? null : 1000,
});

// Run immediately on mount
useInterval({
  callback: fetchData,
  delay: 30000,
  immediate: true,
});
\`\`\`

## With Controls

\`\`\`tsx
const { reset, clear } = useInterval({
  callback: () => setFrame(f => f + 1),
  delay: 16, // ~60fps
});

// Restart from beginning
reset();

// Stop the interval
clear();
\`\`\`

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| \`callback\` | \`() => void\` | required | Function to execute |
| \`delay\` | \`number \\| null\` | required | Interval in ms (null to disable) |
| \`immediate\` | \`boolean\` | \`false\` | Run callback on mount |

## Return Value

| Property | Type | Description |
|----------|------|-------------|
| \`reset\` | \`() => void\` | Restart the interval |
| \`clear\` | \`() => void\` | Stop the interval |
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

export const Countdown: Story = {
  render: () => <CountdownDemo />,
};

export const AutoRefresh: Story = {
  render: () => <AutoRefreshDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Using `immediate: true` to fetch data on mount and then refresh every 3 seconds.',
      },
    },
  },
};

export const ProgressBarStory: Story = {
  name: 'Progress Bar',
  render: () => <ProgressDemo />,
};

export const Clock: Story = {
  render: () => <ClockDemo />,
  parameters: {
    docs: {
      description: {
        story: 'A simple live clock using useInterval with immediate: true.',
      },
    },
  },
};
