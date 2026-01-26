import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SideNav } from './SideNav';
import { SideNavItem } from './SideNavItem';
import { SideNavGroup } from './SideNavGroup';
import { SideNavDivider } from './SideNavDivider';
import { Badge } from '../../display/Badge';
import { Avatar } from '../../display/Avatar';
import { Button } from '../../buttons/Button';

const meta: Meta<typeof SideNav> = {
  title: 'Navigation/SideNav',
  component: SideNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['left', 'right'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', height: '500px', minWidth: 800 }}>
        <Story />
        <div style={{ flex: 1, padding: '20px', background: 'var(--theme-background-primary)' }}>
          <p>Main content area</p>
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SideNav>;

export const Default: Story = {
  render: (args) => (
    <SideNav {...args}>
      <SideNavItem value="home" icon="home" label="Home" />
      <SideNavItem value="dashboard" icon="grid" label="Dashboard" />
      <SideNavItem value="analytics" icon="BarChart2" label="Analytics" />
      <SideNavItem value="users" icon="Users" label="Users" />
      <SideNavDivider />
      <SideNavItem value="settings" icon="Settings" label="Settings" />
      <SideNavItem value="help" icon="HelpCircle" label="Help" />
    </SideNav>
  ),
};

export const WithSelection: Story = {
  render: function Render(args) {
    const [selected, setSelected] = useState('dashboard');

    return (
      <SideNav {...args} selectedValue={selected} onSelect={setSelected}>
        <SideNavItem value="home" icon="home" label="Home" />
        <SideNavItem value="dashboard" icon="grid" label="Dashboard" />
        <SideNavItem value="analytics" icon="BarChart2" label="Analytics" />
        <SideNavItem value="users" icon="Users" label="Users" />
        <SideNavDivider />
        <SideNavItem value="settings" icon="Settings" label="Settings" />
        <SideNavItem value="help" icon="HelpCircle" label="Help" />
      </SideNav>
    );
  },
};

export const WithGroups: Story = {
  render: function Render(args) {
    const [selected, setSelected] = useState('profile');

    return (
      <SideNav {...args} selectedValue={selected} onSelect={setSelected}>
        <SideNavItem value="home" icon="home" label="Home" />
        <SideNavItem value="dashboard" icon="grid" label="Dashboard" />

        <SideNavGroup groupId="analytics" label="Analytics" icon="chart-bar" defaultExpanded>
          <SideNavItem value="overview" label="Overview" />
          <SideNavItem value="reports" label="Reports" />
          <SideNavItem value="realtime" label="Real-time" />
        </SideNavGroup>

        <SideNavGroup groupId="settings" label="Settings" icon="settings">
          <SideNavItem value="profile" label="Profile" />
          <SideNavItem value="security" label="Security" />
          <SideNavItem value="notifications" label="Notifications" />
        </SideNavGroup>

        <SideNavDivider label="Support" />

        <SideNavItem value="help" icon="HelpCircle" label="Help Center" />
        <SideNavItem value="docs" icon="Book" label="Documentation" />
      </SideNav>
    );
  },
};

export const Collapsed: Story = {
  render: function Render(args) {
    const [collapsed, setCollapsed] = useState(true);
    const [selected, setSelected] = useState('dashboard');

    return (
      <div style={{ display: 'flex', height: '500px' }}>
        <SideNav
          {...args}
          collapsed={collapsed}
          selectedValue={selected}
          onSelect={setSelected}
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'var(--theme-primary)',
                }}
              />
              {!collapsed && <span style={{ fontWeight: 600 }}>MyApp</span>}
            </div>
          }
          footer={
            <Button
              variant="ghost"
              size="sm"
              startIcon={collapsed ? 'chevron-right' : 'chevron-left'}
              onClick={() => setCollapsed(!collapsed)}
              fullWidth={!collapsed}
            >
              {!collapsed && 'Collapse'}
            </Button>
          }
        >
          <SideNavItem value="home" icon="home" label="Home" />
          <SideNavItem value="dashboard" icon="grid" label="Dashboard" />
          <SideNavItem value="analytics" icon="chart-bar" label="Analytics" />
          <SideNavDivider />
          <SideNavItem value="settings" icon="settings" label="Settings" />
        </SideNav>
        <div style={{ flex: 1, padding: '20px', background: 'var(--theme-background-primary)' }}>
          <p>Selected: {selected}</p>
          <p>Click the collapse button in the sidebar footer</p>
        </div>
      </div>
    );
  },
};

export const WithBadges: Story = {
  render: function Render(args) {
    const [selected, setSelected] = useState('inbox');

    return (
      <SideNav {...args} selectedValue={selected} onSelect={setSelected}>
        <SideNavItem
          value="inbox"
          icon="inbox"
          label="Inbox"
          badge={<Badge variant="primary">12</Badge>}
        />
        <SideNavItem
          value="sent"
          icon="send"
          label="Sent"
          badge={<Badge variant="secondary">3</Badge>}
        />
        <SideNavItem value="drafts" icon="folder" label="Drafts" />
        <SideNavItem
          value="spam"
          icon="warning"
          label="Spam"
          badge={<Badge variant="danger">!</Badge>}
        />
        <SideNavDivider />
        <SideNavItem value="trash" icon="delete" label="Trash" />
      </SideNav>
    );
  },
};

export const WithHeaderAndFooter: Story = {
  render: function Render(args) {
    const [selected, setSelected] = useState('dashboard');

    return (
      <SideNav
        {...args}
        selectedValue={selected}
        onSelect={setSelected}
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--theme-primary), var(--theme-tertiary))',
              }}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>MyApp</div>
              <div style={{ fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
                Enterprise
              </div>
            </div>
          </div>
        }
        footer={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar initials="JD" size="sm" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 500 }}>John Doe</div>
              <div style={{ fontSize: '12px', color: 'var(--theme-text-secondary)' }}>Admin</div>
            </div>
          </div>
        }
      >
        <SideNavItem value="home" icon="home" label="Home" />
        <SideNavItem value="dashboard" icon="grid" label="Dashboard" />
        <SideNavItem value="projects" icon="folder" label="Projects" />
        <SideNavItem value="team" icon="users" label="Team" />
        <SideNavDivider />
        <SideNavItem value="settings" icon="settings" label="Settings" />
      </SideNav>
    );
  },
};

export const DisabledItems: Story = {
  render: (args) => (
    <SideNav {...args} defaultSelectedValue="home">
      <SideNavItem value="home" icon="home" label="Home" />
      <SideNavItem value="dashboard" icon="grid" label="Dashboard" />
      <SideNavItem value="premium" icon="star" label="Premium Features" disabled />
      <SideNavItem value="analytics" icon="chart-bar" label="Analytics" disabled />
      <SideNavDivider />
      <SideNavItem value="settings" icon="settings" label="Settings" />
    </SideNav>
  ),
};

export const RightPosition: Story = {
  decorators: [],
  render: function Render(args) {
    const [selected, setSelected] = useState('home');

    return (
      <div style={{ display: 'flex', height: '500px', minWidth: 800 }}>
        <div style={{ flex: 1, padding: '20px', background: 'var(--theme-background-primary)' }}>
          <p>Main content area</p>
        </div>
        <SideNav {...args} position="right" selectedValue={selected} onSelect={setSelected}>
          <SideNavItem value="home" icon="home" label="Home" />
          <SideNavItem value="dashboard" icon="grid" label="Dashboard" />
          <SideNavItem value="settings" icon="settings" label="Settings" />
        </SideNav>
      </div>
    );
  },
};
