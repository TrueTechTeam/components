import type { Meta, StoryObj } from '@storybook/react';
import { CollapsibleSidebar } from './CollapsibleSidebar';
import { useState } from 'react';

const meta: Meta<typeof CollapsibleSidebar> = {
  title: 'Layout/CollapsibleSidebar',
  component: CollapsibleSidebar,
  tags: ['autodocs'],
  argTypes: {
    expandedWidth: {
      control: { type: 'number', min: 100, max: 400 },
    },
    collapsedWidth: {
      control: { type: 'number', min: 40, max: 100 },
    },
    position: {
      control: 'select',
      options: ['left', 'right'],
    },
    animationDuration: {
      control: { type: 'number', min: 0, max: 1000 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CollapsibleSidebar>;

const NavItem = ({
  icon,
  children,
  collapsed,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  collapsed?: boolean;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 12px',
      borderRadius: 8,
      cursor: 'pointer',
      transition: 'background 0.15s',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    }}
    onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.05)')}
    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
  >
    <span style={{ flexShrink: 0, width: 20, textAlign: 'center' }}>{icon}</span>
    <span
      style={{
        opacity: collapsed ? 0 : 1,
        transition: 'opacity 0.15s',
      }}
    >
      {children}
    </span>
  </div>
);

const Logo = ({ collapsed }: { collapsed?: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <div
      style={{
        width: 32,
        height: 32,
        background: 'var(--theme-primary, #00adb5)',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--theme-text-on-primary, white)',
        fontWeight: 'bold',
        flexShrink: 0,
      }}
    >
      A
    </div>
    <span
      style={{
        fontWeight: 600,
        fontSize: 18,
        opacity: collapsed ? 0 : 1,
        transition: 'opacity 0.15s',
      }}
    >
      AppName
    </span>
  </div>
);

const UserProfile = ({ collapsed }: { collapsed?: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <div
      style={{
        width: 32,
        height: 32,
        background: 'var(--theme-primary-50, #e6f7f8)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      JD
    </div>
    <div
      style={{
        opacity: collapsed ? 0 : 1,
        transition: 'opacity 0.15s',
        overflow: 'hidden',
      }}
    >
      <div style={{ fontWeight: 500, fontSize: 14 }}>John Doe</div>
      <div style={{ fontSize: 12, color: 'var(--theme-text-secondary, #666)' }}>Admin</div>
    </div>
  </div>
);

/**
 * Default collapsible sidebar
 */
export const Default: Story = {
  render: function Render(args) {
    const [collapsed, setCollapsed] = useState(false);

    return (
      <div style={{ display: 'flex', height: 500 }}>
        <CollapsibleSidebar
          {...args}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          header={<Logo collapsed={collapsed} />}
          footer={<UserProfile collapsed={collapsed} />}
        >
          <NavItem icon="🏠" collapsed={collapsed}>
            Home
          </NavItem>
          <NavItem icon="📊" collapsed={collapsed}>
            Dashboard
          </NavItem>
          <NavItem icon="👥" collapsed={collapsed}>
            Users
          </NavItem>
          <NavItem icon="⚙️" collapsed={collapsed}>
            Settings
          </NavItem>
          <NavItem icon="📄" collapsed={collapsed}>
            Documents
          </NavItem>
        </CollapsibleSidebar>
        <div style={{ flex: 1, padding: 24, background: 'var(--theme-surface-secondary)' }}>
          <h2 style={{ margin: '0 0 16px' }}>Main Content</h2>
          <p>
            Click the toggle button on the sidebar edge to collapse/expand. The sidebar state is
            controlled by the parent component.
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Uncontrolled sidebar (manages its own state)
 */
export const Uncontrolled: Story = {
  render: function Render() {
    const [collapsed, setCollapsed] = useState(false);

    return (
      <div style={{ display: 'flex', height: 400 }}>
        <CollapsibleSidebar
          defaultCollapsed={false}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          header={<Logo collapsed={collapsed} />}
        >
          <NavItem icon="🏠" collapsed={collapsed}>
            Home
          </NavItem>
          <NavItem icon="📊" collapsed={collapsed}>
            Dashboard
          </NavItem>
          <NavItem icon="⚙️" collapsed={collapsed}>
            Settings
          </NavItem>
        </CollapsibleSidebar>
        <div style={{ flex: 1, padding: 24, background: 'var(--theme-surface-secondary)' }}>
          <p>Uncontrolled sidebar - click toggle to change state</p>
        </div>
      </div>
    );
  },
};

/**
 * Auto-collapse based on container width
 */
export const AutoCollapse: Story = {
  render: function Render() {
    const [collapsed, setCollapsed] = useState(false);

    return (
      <div
        style={{
          resize: 'horizontal',
          overflow: 'auto',
          border: '2px dashed var(--theme-border-primary, #ccc)',
          minWidth: 300,
          width: 800,
        }}
      >
        <div style={{ display: 'flex', height: 400 }}>
          <CollapsibleSidebar
            collapseBreakpoint={600}
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            header={<Logo collapsed={collapsed} />}
          >
            <NavItem icon="🏠" collapsed={collapsed}>
              Home
            </NavItem>
            <NavItem icon="📊" collapsed={collapsed}>
              Dashboard
            </NavItem>
            <NavItem icon="⚙️" collapsed={collapsed}>
              Settings
            </NavItem>
          </CollapsibleSidebar>
          <div style={{ flex: 1, padding: 24, background: 'var(--theme-surface-secondary)' }}>
            <p style={{ color: 'var(--theme-text-secondary, #666)' }}>
              Resize the container below 600px to auto-collapse the sidebar.
            </p>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Auto-hide on very small widths
 */
export const AutoHide: Story = {
  render: function Render() {
    const [collapsed, setCollapsed] = useState(false);

    return (
      <div
        style={{
          resize: 'horizontal',
          overflow: 'auto',
          border: '2px dashed var(--theme-border-primary, #ccc)',
          minWidth: 200,
          width: 800,
        }}
      >
        <div style={{ display: 'flex', height: 400 }}>
          <CollapsibleSidebar
            collapseBreakpoint={600}
            hideBreakpoint={400}
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            header={<Logo collapsed={collapsed} />}
          >
            <NavItem icon="🏠" collapsed={collapsed}>
              Home
            </NavItem>
            <NavItem icon="📊" collapsed={collapsed}>
              Dashboard
            </NavItem>
            <NavItem icon="⚙️" collapsed={collapsed}>
              Settings
            </NavItem>
          </CollapsibleSidebar>
          <div style={{ flex: 1, padding: 24, background: 'var(--theme-surface-secondary)' }}>
            <p style={{ color: 'var(--theme-text-secondary, #666)' }}>
              Resize the container:
              <br />
              - Below 600px: Sidebar collapses
              <br />- Below 400px: Sidebar hides completely
            </p>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Right-positioned sidebar
 */
export const RightPosition: Story = {
  render: function Render() {
    const [collapsed, setCollapsed] = useState(false);

    return (
      <div style={{ display: 'flex', height: 400 }}>
        <div style={{ flex: 1, padding: 24, background: 'var(--theme-surface-secondary)' }}>
          <h2 style={{ margin: '0 0 16px' }}>Main Content</h2>
          <p>The sidebar is on the right side.</p>
        </div>
        <CollapsibleSidebar
          position="right"
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          header={<Logo collapsed={collapsed} />}
        >
          <NavItem icon="📋" collapsed={collapsed}>
            Properties
          </NavItem>
          <NavItem icon="🎨" collapsed={collapsed}>
            Styles
          </NavItem>
          <NavItem icon="📐" collapsed={collapsed}>
            Layout
          </NavItem>
        </CollapsibleSidebar>
      </div>
    );
  },
};

/**
 * Custom widths
 */
export const CustomWidths: Story = {
  render: function Render() {
    const [collapsed, setCollapsed] = useState(false);

    return (
      <div style={{ display: 'flex', height: 400 }}>
        <CollapsibleSidebar
          expandedWidth={300}
          collapsedWidth={80}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          header={<Logo collapsed={collapsed} />}
        >
          <NavItem icon="🏠" collapsed={collapsed}>
            Home
          </NavItem>
          <NavItem icon="📊" collapsed={collapsed}>
            Dashboard
          </NavItem>
          <NavItem icon="⚙️" collapsed={collapsed}>
            Settings
          </NavItem>
        </CollapsibleSidebar>
        <div style={{ flex: 1, padding: 24, background: 'var(--theme-surface-secondary)' }}>
          <p>Expanded: 300px, Collapsed: 80px</p>
        </div>
      </div>
    );
  },
};

/**
 * With scrollable content
 */
export const ScrollableContent: Story = {
  render: function Render() {
    const [collapsed, setCollapsed] = useState(false);

    return (
      <div style={{ display: 'flex', height: 400 }}>
        <CollapsibleSidebar
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          header={<Logo collapsed={collapsed} />}
          footer={<UserProfile collapsed={collapsed} />}
        >
          {Array.from({ length: 20 }, (_, i) => (
            <NavItem key={i} icon={`${i + 1}`} collapsed={collapsed}>
              Navigation Item {i + 1}
            </NavItem>
          ))}
        </CollapsibleSidebar>
        <div style={{ flex: 1, padding: 24, background: 'var(--theme-surface-secondary)' }}>
          <p>The sidebar content scrolls independently.</p>
        </div>
      </div>
    );
  },
};

/**
 * With state change callbacks
 */
export const WithCallbacks: Story = {
  render: function Render() {
    const [collapsed, setCollapsed] = useState(false);
    const [log, setLog] = useState<string[]>([]);

    const addLog = (message: string) => {
      setLog((prev) => [...prev.slice(-4), message]);
    };

    return (
      <div
        style={{
          resize: 'horizontal',
          overflow: 'auto',
          border: '2px dashed var(--theme-border-primary)',
          minWidth: 300,
          width: 800,
        }}
      >
        <div style={{ display: 'flex', height: 400 }}>
          <CollapsibleSidebar
            collapsed={collapsed}
            onCollapsedChange={(c) => {
              setCollapsed(c);
              addLog(`Collapsed: ${c}`);
            }}
            onHiddenChange={(h) => addLog(`Hidden: ${h}`)}
            collapseBreakpoint={500}
            hideBreakpoint={350}
            header={<Logo collapsed={collapsed} />}
          >
            <NavItem icon="🏠" collapsed={collapsed}>
              Home
            </NavItem>
            <NavItem icon="⚙️" collapsed={collapsed}>
              Settings
            </NavItem>
          </CollapsibleSidebar>
          <div style={{ flex: 1, padding: 24, background: 'var(--theme-surface-secondary)' }}>
            <h3 style={{ margin: '0 0 16px' }}>Event Log</h3>
            <div
              style={{
                background: 'var(--theme-background-tertiary)',
                padding: 12,
                borderRadius: 4,
                fontFamily: 'monospace',
                fontSize: 12,
              }}
            >
              {log.length === 0 ? (
                <span style={{ color: 'var(--theme-text-tertiary)' }}>
                  No events yet. Resize or toggle sidebar.
                </span>
              ) : (
                log.map((entry, i) => <div key={i}>{entry}</div>)
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Different animation durations
 */
export const AnimationDurations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {[100, 250, 500].map((duration) => (
        <div key={duration}>
          <p style={{ margin: '0 0 8px' }}>
            <strong>Animation Duration: {duration}ms</strong>
          </p>
          <div
            style={{
              display: 'flex',
              height: 150,
              border: '1px solid var(--theme-border-primary, #ccc)',
            }}
          >
            <CollapsibleSidebar
              animationDuration={duration}
              expandedWidth={200}
              header={<div style={{ fontWeight: 500 }}>Sidebar</div>}
            >
              <NavItem icon="📋">Item 1</NavItem>
              <NavItem icon="📋">Item 2</NavItem>
            </CollapsibleSidebar>
            <div style={{ flex: 1, padding: 16, background: 'var(--theme-surface-secondary)' }}>
              Content area
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
};

