import type { Meta, StoryObj } from '@storybook/react';
import { Panes } from './Panes';
import { Pane } from './Pane';
import { Card } from '../../display/Card';
import { useState } from 'react';

const meta: Meta<typeof Panes> = {
  title: 'Layout/Panes',
  component: Panes,
  tags: ['autodocs'],
  argTypes: {
    gap: {
      control: { type: 'number', min: 0, max: 48 },
    },
    animationDuration: {
      control: { type: 'number', min: 0, max: 1000 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Panes>;

const PaneContent = ({
  title,
  variant = 'primary',
  children,
}: {
  title: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  children?: React.ReactNode;
}) => (
  <Card variant="filled" padding="md" style={{ height: '100%' }}>
    <h3 style={{ margin: 0, marginBottom: 8 }}>{title}</h3>
    {children || (
      <p style={{ margin: 0, flex: 1, color: 'var(--theme-text-secondary)' }}>
        Resize the container to see panes appear and disappear based on available width.
      </p>
    )}
  </Card>
);

/**
 * Basic three-pane layout. Resize the container to see panes hide/show.
 */
export const Default: Story = {
  render: (args) => (
    <div
      style={{
        height: 400,
        resize: 'horizontal',
        overflow: 'auto',
        border: '2px dashed var(--theme-border-primary)',
        padding: 16,
        minWidth: 200,
        maxWidth: '100%',
        width: 800,
      }}
    >
      <p style={{ margin: '0 0 16px', color: 'var(--theme-text-secondary)' }}>
        Drag the right edge to resize:
      </p>
      <div style={{ height: 300 }}>
        <Panes {...args}>
          <Pane minWidth={150}>
            <PaneContent title="Sidebar" />
          </Pane>
          <Pane minWidth={300} grow={2}>
            <PaneContent title="Main Content" />
          </Pane>
          <Pane minWidth={150}>
            <PaneContent title="Details" />
          </Pane>
        </Panes>
      </div>
    </div>
  ),
};

/**
 * Priority-based visibility. Higher index = higher priority (shown first when space is limited).
 * The "Details" pane (last child) has highest priority and will stay visible longest.
 */
export const PriorityBased: Story = {
  render: () => (
    <div
      style={{
        height: 400,
        resize: 'horizontal',
        overflow: 'auto',
        border: '2px dashed var(--theme-border-primary)',
        padding: 16,
        minWidth: 200,
        width: 900,
      }}
    >
      <p style={{ margin: '0 0 16px', color: 'var(--theme-text-secondary)' }}>
        Higher index = higher priority. Resize to see lower priority panes hide first.
      </p>
      <div style={{ height: 300 }}>
        <Panes gap={12}>
          <Pane minWidth={150}>
            <PaneContent title="Priority 0 (lowest)">
              <p style={{ margin: 0 }}>First to hide</p>
            </PaneContent>
          </Pane>
          <Pane minWidth={200}>
            <PaneContent title="Priority 1">
              <p style={{ margin: 0 }}>Second to hide</p>
            </PaneContent>
          </Pane>
          <Pane minWidth={200}>
            <PaneContent title="Priority 2">
              <p style={{ margin: 0 }}>Third to hide</p>
            </PaneContent>
          </Pane>
          <Pane minWidth={200}>
            <PaneContent title="Priority 3 (highest)">
              <p style={{ margin: 0 }}>Last to hide</p>
            </PaneContent>
          </Pane>
        </Panes>
      </div>
    </div>
  ),
};

/**
 * Custom priority values. Override the default index-based priority.
 */
export const CustomPriority: Story = {
  render: () => (
    <div
      style={{
        height: 400,
        resize: 'horizontal',
        overflow: 'auto',
        border: '2px dashed var(--theme-border-primary)',
        padding: 16,
        minWidth: 200,
        width: 800,
      }}
    >
      <p style={{ margin: '0 0 16px', color: 'var(--theme-text-secondary)' }}>
        Custom priorities: Main Content (10) stays longest, then Details (5), then Sidebar (1).
      </p>
      <div style={{ height: 300 }}>
        <Panes gap={16}>
          <Pane minWidth={150} priority={1}>
            <PaneContent title="Sidebar (priority 1)">
              <p style={{ margin: 0 }}>Will hide first</p>
            </PaneContent>
          </Pane>
          <Pane minWidth={300} priority={10} grow={2}>
            <PaneContent title="Main Content (priority 10)">
              <p style={{ margin: 0 }}>Will stay longest</p>
            </PaneContent>
          </Pane>
          <Pane minWidth={150} priority={5}>
            <PaneContent title="Details (priority 5)">
              <p style={{ margin: 0 }}>Second to hide</p>
            </PaneContent>
          </Pane>
        </Panes>
      </div>
    </div>
  ),
};

/**
 * With visibility change callbacks
 */
export const WithCallbacks: Story = {
  render: function Render() {
    const [visibleIds, setVisibleIds] = useState<string[]>([]);
    const [lastHidden, setLastHidden] = useState<string | null>(null);

    return (
      <div
        style={{
          height: 500,
          resize: 'horizontal',
          overflow: 'auto',
          border: '2px dashed var(--theme-border-primary)',
          padding: 16,
          minWidth: 200,
          width: 800,
        }}
      >
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            background: 'var(--theme-background-tertiary)',
            borderRadius: 4,
          }}
        >
          <p style={{ margin: '0 0 8px' }}>
            <strong>Visible panes:</strong> {visibleIds.join(', ') || 'none'}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Last hidden:</strong> {lastHidden || 'none'}
          </p>
        </div>
        <div style={{ height: 300 }}>
          <Panes
            gap={16}
            onVisiblePanesChange={(ids) => setVisibleIds(ids)}
            onPaneHidden={(id) => setLastHidden(id)}
          >
            <Pane minWidth={150} id="sidebar">
              <PaneContent title="Sidebar" />
            </Pane>
            <Pane minWidth={300} id="main" grow={2}>
              <PaneContent title="Main Content" />
            </Pane>
            <Pane minWidth={150} id="details">
              <PaneContent title="Details" />
            </Pane>
          </Panes>
        </div>
      </div>
    );
  },
};

/**
 * Different gap sizes
 */
export const GapVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {[0, 8, 16, 24, 32].map((gapSize) => (
        <div key={gapSize}>
          <p style={{ margin: '0 0 8px' }}>
            <strong>Gap: {gapSize}px</strong>
          </p>
          <div style={{ height: 100, width: 600 }}>
            <Panes gap={gapSize}>
              <Pane minWidth={100}>
                <Card variant="filled" padding="sm" style={{ height: '100%' }}>
                  Pane 1
                </Card>
              </Pane>
              <Pane minWidth={100}>
                <Card variant="filled" padding="sm" style={{ height: '100%' }}>
                  Pane 2
                </Card>
              </Pane>
              <Pane minWidth={100}>
                <Card variant="filled" padding="sm" style={{ height: '100%' }}>
                  Pane 3
                </Card>
              </Pane>
            </Panes>
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * Animation duration variants
 */
export const AnimationDurations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {[100, 250, 500, 1000].map((duration) => (
        <div key={duration}>
          <p style={{ margin: '0 0 8px' }}>
            <strong>Animation Duration: {duration}ms</strong>
          </p>
          <div
            style={{
              height: 100,
              resize: 'horizontal',
              overflow: 'auto',
              border: '1px dashed var(--theme-border-primary)',
              padding: 8,
              minWidth: 200,
              width: 500,
            }}
          >
            <Panes animationDuration={duration}>
              <Pane minWidth={100}>
                <Card variant="filled" padding="sm" style={{ height: '100%' }}>
                  Pane 1
                </Card>
              </Pane>
              <Pane minWidth={100}>
                <Card variant="filled" padding="sm" style={{ height: '100%' }}>
                  Pane 2
                </Card>
              </Pane>
              <Pane minWidth={100}>
                <Card variant="filled" padding="sm" style={{ height: '100%' }}>
                  Pane 3
                </Card>
              </Pane>
            </Panes>
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * Panes with different widths and grow factors
 */
export const FlexGrow: Story = {
  render: () => (
    <div style={{ height: 300, width: 800 }}>
      <Panes gap={16}>
        <Pane minWidth={100} maxWidth={200} grow={0}>
          <PaneContent title="Fixed Width">
            <p style={{ margin: 0, fontSize: 12 }}>grow: 0, max: 200px</p>
          </PaneContent>
        </Pane>
        <Pane minWidth={200} grow={1}>
          <PaneContent title="Normal Grow">
            <p style={{ margin: 0, fontSize: 12 }}>grow: 1</p>
          </PaneContent>
        </Pane>
        <Pane minWidth={200} grow={2}>
          <PaneContent title="Double Grow">
            <p style={{ margin: 0, fontSize: 12 }}>grow: 2</p>
          </PaneContent>
        </Pane>
      </Panes>
    </div>
  ),
};

/**
 * Many panes - stress test
 */
export const ManyPanes: Story = {
  render: () => {
    return (
      <div
        style={{
          height: 200,
          resize: 'horizontal',
          overflow: 'auto',
          border: '2px dashed var(--theme-border-primary)',
          padding: 16,
          minWidth: 200,
          width: '100%',
        }}
      >
        <Panes gap={8}>
          {Array.from({ length: 10 }, (_, i) => (
            <Pane key={i} minWidth={100}>
              <Card
                variant="filled"
                padding="sm"
                style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Pane {i + 1}
              </Card>
            </Pane>
          ))}
        </Panes>
      </div>
    );
  },
};

/**
 * Nested content with scrolling
 */
export const WithScrollingContent: Story = {
  render: () => (
    <div style={{ height: 400, width: 800 }}>
      <Panes gap={16}>
        <Pane minWidth={200}>
          <Card
            variant="outlined"
            padding="none"
            style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          >
            <div style={{ padding: 16, borderBottom: '1px solid var(--theme-border-primary)' }}>
              <h3 style={{ margin: 0 }}>Navigation</h3>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    padding: '8px 0',
                    borderBottom: '1px solid var(--theme-border-secondary)',
                  }}
                >
                  Nav Item {i + 1}
                </div>
              ))}
            </div>
          </Card>
        </Pane>
        <Pane minWidth={400} grow={2}>
          <Card
            variant="outlined"
            padding="none"
            style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          >
            <div style={{ padding: 16, borderBottom: '1px solid var(--theme-border-primary)' }}>
              <h3 style={{ margin: 0 }}>Main Content</h3>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
              <p>This pane contains scrollable content.</p>
              {Array.from({ length: 15 }, (_, i) => (
                <p key={i}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua.
                </p>
              ))}
            </div>
          </Card>
        </Pane>
      </Panes>
    </div>
  ),
};

