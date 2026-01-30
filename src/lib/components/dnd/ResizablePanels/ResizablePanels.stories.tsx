import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ResizablePanels } from './ResizablePanels';
import { ResizablePanel } from './ResizablePanel';
import { ResizeHandle } from './ResizeHandle';

const meta: Meta<typeof ResizablePanels> = {
  title: 'DnD/ResizablePanels',
  component: ResizablePanels,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', width: '100vw', padding: '16px', boxSizing: 'border-box' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Direction of panels',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ResizablePanels>;

const panelStyle: React.CSSProperties = {
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'var(--theme-surface-secondary)',
  fontSize: '14px',
  color: 'var(--theme-text-secondary)',
};

/**
 * Basic horizontal resizable panels
 */
export const Default: Story = {
  render: () => {
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          minHeight: 400,
          minWidth: 600,
          border: '1px solid var(--theme-border-primary)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <ResizablePanels direction="horizontal">
          <ResizablePanel minSize={20} defaultSize={25}>
            <div style={panelStyle}>
              <div style={{ textAlign: 'center' }}>
                <strong>Sidebar</strong>
                <p style={{ marginTop: '8px', fontSize: '12px' }}>Drag the handle to resize</p>
              </div>
            </div>
          </ResizablePanel>
          <ResizeHandle variant="line" />
          <ResizablePanel minSize={30}>
            <div style={panelStyle}>
              <div style={{ textAlign: 'center' }}>
                <strong>Main Content</strong>
                <p style={{ marginTop: '8px', fontSize: '12px' }}>
                  This panel fills remaining space
                </p>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanels>
      </div>
    );
  },
};

/**
 * Three-panel layout
 */
export const ThreePanels: Story = {
  render: () => {
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          minHeight: 400,
          minWidth: 600,
          border: '1px solid var(--theme-border-primary)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <ResizablePanels direction="horizontal">
          <ResizablePanel minSize={15} defaultSize={20}>
            <div style={{ ...panelStyle, backgroundColor: 'var(--theme-surface-primary)' }}>
              <strong>Navigation</strong>
            </div>
          </ResizablePanel>
          <ResizeHandle variant="dots" />
          <ResizablePanel minSize={30} defaultSize={55}>
            <div style={panelStyle}>
              <strong>Content</strong>
            </div>
          </ResizablePanel>
          <ResizeHandle variant="dots" />
          <ResizablePanel minSize={15} defaultSize={25}>
            <div style={{ ...panelStyle, backgroundColor: 'var(--theme-surface-primary)' }}>
              <strong>Details</strong>
            </div>
          </ResizablePanel>
        </ResizablePanels>
      </div>
    );
  },
};

/**
 * Vertical resizable panels
 */
export const Vertical: Story = {
  render: () => {
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          minHeight: 500,
          minWidth: 600,
          border: '1px solid var(--theme-border-primary)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <ResizablePanels direction="vertical">
          <ResizablePanel minSize={20} defaultSize={30}>
            <div style={panelStyle}>
              <strong>Header Area</strong>
            </div>
          </ResizablePanel>
          <ResizeHandle variant="line" />
          <ResizablePanel minSize={30} defaultSize={50}>
            <div style={panelStyle}>
              <strong>Main Content</strong>
            </div>
          </ResizablePanel>
          <ResizeHandle variant="line" />
          <ResizablePanel minSize={15} defaultSize={20}>
            <div style={panelStyle}>
              <strong>Footer/Console</strong>
            </div>
          </ResizablePanel>
        </ResizablePanels>
      </div>
    );
  },
};

/**
 * IDE-style layout with nested panels
 */
export const IDELayout: Story = {
  render: () => {
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          minHeight: 500,
          minWidth: 800,
          border: '1px solid var(--theme-border-primary)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <ResizablePanels direction="horizontal">
          <ResizablePanel minSize={15} defaultSize={20}>
            <div style={{ ...panelStyle, backgroundColor: '#1e1e1e', color: '#ccc' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', marginBottom: '8px' }}>📁</div>
                <strong>Explorer</strong>
              </div>
            </div>
          </ResizablePanel>
          <ResizeHandle variant="hidden" />
          <ResizablePanel minSize={40}>
            <ResizablePanels direction="vertical">
              <ResizablePanel minSize={30} defaultSize={70}>
                <div style={{ ...panelStyle, backgroundColor: '#1e1e1e', color: '#ccc' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', marginBottom: '8px' }}>📝</div>
                    <strong>Editor</strong>
                  </div>
                </div>
              </ResizablePanel>
              <ResizeHandle variant="line" />
              <ResizablePanel minSize={15} defaultSize={30}>
                <div style={{ ...panelStyle, backgroundColor: '#1e1e1e', color: '#ccc' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', marginBottom: '8px' }}>💻</div>
                    <strong>Terminal</strong>
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanels>
          </ResizablePanel>
        </ResizablePanels>
      </div>
    );
  },
};

function ControlledStory() {
  const [sizes, setSizes] = useState([30, 70]);

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        minHeight: 300,
        minWidth: 600,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ marginBottom: '16px', flexShrink: 0 }}>
        <strong>Panel Sizes:</strong> {sizes.map((s) => `${s.toFixed(1)}%`).join(' | ')}
      </div>
      <div
        style={{
          flex: 1,
          border: '1px solid var(--theme-border-primary)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <ResizablePanels direction="horizontal" sizes={sizes} onResize={setSizes}>
          <ResizablePanel minSize={20}>
            <div style={panelStyle}>
              <strong>Panel 1</strong>
            </div>
          </ResizablePanel>
          <ResizeHandle variant="dots" />
          <ResizablePanel minSize={20}>
            <div style={panelStyle}>
              <strong>Panel 2</strong>
            </div>
          </ResizablePanel>
        </ResizablePanels>
      </div>
    </div>
  );
}

/**
 * Controlled sizes with callback
 */
export const Controlled: Story = {
  render: () => <ControlledStory />,
};
