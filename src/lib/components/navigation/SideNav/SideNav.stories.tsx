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
    docs: {
      description: {
        component: `
Vertical side navigation with collapsible groups, dividers, badges, and optional header/footer sections. Supports nested items and visual collapse animations.

## CSS Variables

<table>
<thead>
<tr>
<th>Variable</th>
<th>Default</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>--sidenav-width</code></td>
<td>240px</td>
<td>Current width of navigation</td>
</tr>
<tr>
<td><code>--sidenav-expanded-width</code></td>
<td>240px</td>
<td>Width when expanded</td>
</tr>
<tr>
<td><code>--sidenav-collapsed-width</code></td>
<td>64px</td>
<td>Width when collapsed</td>
</tr>
<tr>
<td><code>--sidenav-bg</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-background-secondary)</code></a></td>
<td>Background color</td>
</tr>
<tr>
<td><code>--sidenav-border-color</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-border-primary)</code></a></td>
<td>Border color</td>
</tr>
<tr>
<td><code>--sidenav-item-hover-bg</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-background-tertiary)</code></a></td>
<td>Item background on hover</td>
</tr>
<tr>
<td><code>--sidenav-item-active-bg</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-primary-100)</code></a></td>
<td>Item background when active</td>
</tr>
<tr>
<td><code>--sidenav-item-active-color</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-primary)</code></a></td>
<td>Item text color when active</td>
</tr>
<tr>
<td><code>--sidenav-text-color</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-primary)</code></a></td>
<td>Primary text color</td>
</tr>
<tr>
<td><code>--sidenav-text-secondary</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-secondary)</code></a></td>
<td>Secondary text color</td>
</tr>
<tr>
<td><code>--sidenav-transition-duration</code></td>
<td>250ms</td>
<td>Transition duration for state changes</td>
</tr>
<tr>
<td><code>--sidenav-transition-easing</code></td>
<td>ease-in-out</td>
<td>Easing for transitions</td>
</tr>
<tr>
<td><code>--sidenav-item-height</code></td>
<td>40px</td>
<td>Height of navigation items</td>
</tr>
<tr>
<td><code>--sidenav-item-padding-x</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-md)</code></a></td>
<td>Horizontal padding of items</td>
</tr>
<tr>
<td><code>--sidenav-item-padding-y</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-sm)</code></a></td>
<td>Vertical padding of items</td>
</tr>
<tr>
<td><code>--sidenav-item-radius</code></td>
<td><a href="?path=/story/theme-css-variables--borders"><code>var(--radius-md)</code></a></td>
<td>Border radius of items</td>
</tr>
<tr>
<td><code>--sidenav-item-gap</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-sm)</code></a></td>
<td>Gap between icon and label</td>
</tr>
<tr>
<td><code>--sidenav-nested-indent</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-lg)</code></a></td>
<td>Indentation for nested items</td>
</tr>
<tr>
<td><code>--sidenav-section-gap</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-md)</code></a></td>
<td>Gap between section dividers</td>
</tr>
</tbody>
</table>
`,
      },
    },
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
