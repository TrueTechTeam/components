import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import React, { useState } from 'react';
import { Tabs } from './Tabs';
import { TabList } from './TabList';
import { Tab } from './Tab';
import { TabPanel } from './TabPanel';

const meta: Meta<typeof Tabs> = {
  title: 'Display/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Tab navigation component that manages tab selection and provides context to TabList, Tab, and TabPanel children.

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
<td><code>--tabs-border-color</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-border-primary)</code></a></td>
<td>Color of tab borders</td>
</tr>
<tr>
<td><code>--tabs-indicator-color</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-primary)</code></a></td>
<td>Color of the active tab indicator</td>
</tr>
<tr>
<td><code>--tabs-bg</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-background-primary)</code></a></td>
<td>Background color of tabs</td>
</tr>
</tbody>
</table>
`,
      },
    },
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Currently selected tab (controlled)',
    },
    defaultValue: {
      control: 'text',
      description: 'Default selected tab (uncontrolled)',
    },
    variant: {
      control: 'select',
      options: ['line', 'enclosed', 'soft-rounded', 'solid-rounded'],
      description: 'Visual variant of the tabs',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the tabs',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the tab list',
    },
    fitted: {
      control: 'boolean',
      description: 'Whether tabs fill container width',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether all tabs are disabled',
    },
    lazyMount: {
      control: 'boolean',
      description: 'Whether panels are lazy loaded',
    },
    keepMounted: {
      control: 'boolean',
      description: 'Whether to keep inactive panels mounted',
    },
    onChange: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
    children: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

/**
 * Default tabs with line variant
 */
export const Default: Story = {
  render: (args) => (
    <Tabs {...args} defaultValue="tab1" onChange={action('onChange')}>
      <TabList>
        <Tab value="tab1">Overview</Tab>
        <Tab value="tab2">Features</Tab>
        <Tab value="tab3">Pricing</Tab>
      </TabList>
      <TabPanel value="tab1">
        <h3>Overview</h3>
        <p>Welcome to our product overview. Here you'll find all the essential information.</p>
      </TabPanel>
      <TabPanel value="tab2">
        <h3>Features</h3>
        <p>Discover our amazing features that make us stand out from the competition.</p>
      </TabPanel>
      <TabPanel value="tab3">
        <h3>Pricing</h3>
        <p>Choose the plan that works best for you and your team.</p>
      </TabPanel>
    </Tabs>
  ),
};

/**
 * All visual variants
 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          Line (default)
        </p>
        <Tabs defaultValue="tab1" variant="line">
          <TabList>
            <Tab value="tab1">Tab 1</Tab>
            <Tab value="tab2">Tab 2</Tab>
            <Tab value="tab3">Tab 3</Tab>
          </TabList>
          <TabPanel value="tab1">Content for Tab 1</TabPanel>
          <TabPanel value="tab2">Content for Tab 2</TabPanel>
          <TabPanel value="tab3">Content for Tab 3</TabPanel>
        </Tabs>
      </div>

      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          Enclosed
        </p>
        <Tabs defaultValue="tab1" variant="enclosed">
          <TabList>
            <Tab value="tab1">Tab 1</Tab>
            <Tab value="tab2">Tab 2</Tab>
            <Tab value="tab3">Tab 3</Tab>
          </TabList>
          <TabPanel value="tab1">Content for Tab 1</TabPanel>
          <TabPanel value="tab2">Content for Tab 2</TabPanel>
          <TabPanel value="tab3">Content for Tab 3</TabPanel>
        </Tabs>
      </div>

      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          Soft Rounded
        </p>
        <Tabs defaultValue="tab1" variant="soft-rounded">
          <TabList>
            <Tab value="tab1">Tab 1</Tab>
            <Tab value="tab2">Tab 2</Tab>
            <Tab value="tab3">Tab 3</Tab>
          </TabList>
          <TabPanel value="tab1">Content for Tab 1</TabPanel>
          <TabPanel value="tab2">Content for Tab 2</TabPanel>
          <TabPanel value="tab3">Content for Tab 3</TabPanel>
        </Tabs>
      </div>

      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          Solid Rounded
        </p>
        <Tabs defaultValue="tab1" variant="solid-rounded">
          <TabList>
            <Tab value="tab1">Tab 1</Tab>
            <Tab value="tab2">Tab 2</Tab>
            <Tab value="tab3">Tab 3</Tab>
          </TabList>
          <TabPanel value="tab1">Content for Tab 1</TabPanel>
          <TabPanel value="tab2">Content for Tab 2</TabPanel>
          <TabPanel value="tab3">Content for Tab 3</TabPanel>
        </Tabs>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * All size variants
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          Small
        </p>
        <Tabs defaultValue="tab1" size="sm">
          <TabList>
            <Tab value="tab1">Tab 1</Tab>
            <Tab value="tab2">Tab 2</Tab>
            <Tab value="tab3">Tab 3</Tab>
          </TabList>
          <TabPanel value="tab1">Small tabs content</TabPanel>
          <TabPanel value="tab2">Tab 2 content</TabPanel>
          <TabPanel value="tab3">Tab 3 content</TabPanel>
        </Tabs>
      </div>

      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          Medium
        </p>
        <Tabs defaultValue="tab1" size="md">
          <TabList>
            <Tab value="tab1">Tab 1</Tab>
            <Tab value="tab2">Tab 2</Tab>
            <Tab value="tab3">Tab 3</Tab>
          </TabList>
          <TabPanel value="tab1">Medium tabs content</TabPanel>
          <TabPanel value="tab2">Tab 2 content</TabPanel>
          <TabPanel value="tab3">Tab 3 content</TabPanel>
        </Tabs>
      </div>

      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          Large
        </p>
        <Tabs defaultValue="tab1" size="lg">
          <TabList>
            <Tab value="tab1">Tab 1</Tab>
            <Tab value="tab2">Tab 2</Tab>
            <Tab value="tab3">Tab 3</Tab>
          </TabList>
          <TabPanel value="tab1">Large tabs content</TabPanel>
          <TabPanel value="tab2">Tab 2 content</TabPanel>
          <TabPanel value="tab3">Tab 3 content</TabPanel>
        </Tabs>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Tabs with icons
 */
export const WithIcons: Story = {
  render: () => (
    <Tabs defaultValue="home">
      <TabList>
        <Tab value="home" icon="home">
          Home
        </Tab>
        <Tab value="profile" icon="user">
          Profile
        </Tab>
        <Tab value="settings" icon="settings">
          Settings
        </Tab>
        <Tab value="notifications" icon="bell">
          Notifications
        </Tab>
      </TabList>
      <TabPanel value="home">Home content</TabPanel>
      <TabPanel value="profile">Profile content</TabPanel>
      <TabPanel value="settings">Settings content</TabPanel>
      <TabPanel value="notifications">Notifications content</TabPanel>
    </Tabs>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Vertical orientation
 */
export const Vertical: Story = {
  render: () => (
    <div style={{ height: '300px' }}>
      <Tabs defaultValue="account" orientation="vertical">
        <TabList>
          <Tab value="account" icon="user">
            Account
          </Tab>
          <Tab value="security" icon="shield">
            Security
          </Tab>
          <Tab value="notifications" icon="bell">
            Notifications
          </Tab>
          <Tab value="billing" icon="credit-card">
            Billing
          </Tab>
        </TabList>
        <TabPanel value="account">
          <h3>Account Settings</h3>
          <p>Manage your account information and preferences.</p>
        </TabPanel>
        <TabPanel value="security">
          <h3>Security Settings</h3>
          <p>Update your password and security preferences.</p>
        </TabPanel>
        <TabPanel value="notifications">
          <h3>Notification Preferences</h3>
          <p>Configure how you receive notifications.</p>
        </TabPanel>
        <TabPanel value="billing">
          <h3>Billing Information</h3>
          <p>Manage your payment methods and billing history.</p>
        </TabPanel>
      </Tabs>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Fitted tabs (fill container)
 */
export const Fitted: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Tabs defaultValue="tab1" fitted>
        <TabList>
          <Tab value="tab1">First Tab</Tab>
          <Tab value="tab2">Second Tab</Tab>
          <Tab value="tab3">Third Tab</Tab>
        </TabList>
        <TabPanel value="tab1">First tab content</TabPanel>
        <TabPanel value="tab2">Second tab content</TabPanel>
        <TabPanel value="tab3">Third tab content</TabPanel>
      </Tabs>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Disabled tabs
 */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          All tabs disabled
        </p>
        <Tabs defaultValue="tab1" disabled>
          <TabList>
            <Tab value="tab1">Tab 1</Tab>
            <Tab value="tab2">Tab 2</Tab>
            <Tab value="tab3">Tab 3</Tab>
          </TabList>
          <TabPanel value="tab1">Content 1</TabPanel>
          <TabPanel value="tab2">Content 2</TabPanel>
          <TabPanel value="tab3">Content 3</TabPanel>
        </Tabs>
      </div>

      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          Individual tab disabled
        </p>
        <Tabs defaultValue="tab1">
          <TabList>
            <Tab value="tab1">Tab 1</Tab>
            <Tab value="tab2" disabled>
              Tab 2 (Disabled)
            </Tab>
            <Tab value="tab3">Tab 3</Tab>
          </TabList>
          <TabPanel value="tab1">Content 1</TabPanel>
          <TabPanel value="tab2">Content 2</TabPanel>
          <TabPanel value="tab3">Content 3</TabPanel>
        </Tabs>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Controlled component example
 */
const ControlledExample = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div>
      <Tabs value={activeTab} onChange={setActiveTab}>
        <TabList>
          <Tab value="overview">Overview</Tab>
          <Tab value="analytics">Analytics</Tab>
          <Tab value="reports">Reports</Tab>
        </TabList>
        <TabPanel value="overview">Overview panel content</TabPanel>
        <TabPanel value="analytics">Analytics panel content</TabPanel>
        <TabPanel value="reports">Reports panel content</TabPanel>
      </Tabs>
      <p style={{ marginTop: '16px', fontSize: '14px', color: 'var(--theme-text-secondary)' }}>
        Active tab: {activeTab}
      </p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Lazy mounting example
 */
const LazyMountExample = () => {
  const [renderCount, setRenderCount] = useState({ tab1: 0, tab2: 0, tab3: 0 });

  return (
    <div>
      <p style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--theme-text-secondary)' }}>
        With lazyMount, panels only render when selected. Check render counts:
      </p>
      <Tabs defaultValue="tab1" lazyMount>
        <TabList>
          <Tab value="tab1">Tab 1 (renders: {renderCount.tab1})</Tab>
          <Tab value="tab2">Tab 2 (renders: {renderCount.tab2})</Tab>
          <Tab value="tab3">Tab 3 (renders: {renderCount.tab3})</Tab>
        </TabList>
        <TabPanel value="tab1">
          <LazyContent
            onRender={() => setRenderCount((prev) => ({ ...prev, tab1: prev.tab1 + 1 }))}
          >
            Tab 1 Content
          </LazyContent>
        </TabPanel>
        <TabPanel value="tab2">
          <LazyContent
            onRender={() => setRenderCount((prev) => ({ ...prev, tab2: prev.tab2 + 1 }))}
          >
            Tab 2 Content
          </LazyContent>
        </TabPanel>
        <TabPanel value="tab3">
          <LazyContent
            onRender={() => setRenderCount((prev) => ({ ...prev, tab3: prev.tab3 + 1 }))}
          >
            Tab 3 Content
          </LazyContent>
        </TabPanel>
      </Tabs>
    </div>
  );
};

const LazyContent = ({
  children,
  onRender,
}: {
  children: React.ReactNode;
  onRender: () => void;
}) => {
  const hasRendered = React.useRef(false);

  React.useEffect(() => {
    if (!hasRendered.current) {
      hasRendered.current = true;
      onRender();
    }
  }, [onRender]);

  return <div>{children}</div>;
};

export const LazyMount: Story = {
  render: () => <LazyMountExample />,
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Dashboard example with real content
 */
export const DashboardExample: Story = {
  render: () => (
    <Tabs defaultValue="overview" variant="solid-rounded">
      <TabList>
        <Tab value="overview" icon="home">
          Overview
        </Tab>
        <Tab value="analytics" icon="chart-bar">
          Analytics
        </Tab>
        <Tab value="reports" icon="file-text">
          Reports
        </Tab>
        <Tab value="settings" icon="settings">
          Settings
        </Tab>
      </TabList>
      <TabPanel value="overview">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div
            style={{
              padding: '16px',
              background: 'var(--theme-background-secondary)',
              borderRadius: '8px',
            }}
          >
            <h4 style={{ margin: '0 0 8px 0' }}>Total Users</h4>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>12,345</p>
          </div>
          <div
            style={{
              padding: '16px',
              background: 'var(--theme-background-secondary)',
              borderRadius: '8px',
            }}
          >
            <h4 style={{ margin: '0 0 8px 0' }}>Revenue</h4>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>$45,678</p>
          </div>
          <div
            style={{
              padding: '16px',
              background: 'var(--theme-background-secondary)',
              borderRadius: '8px',
            }}
          >
            <h4 style={{ margin: '0 0 8px 0' }}>Growth</h4>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>+23%</p>
          </div>
        </div>
      </TabPanel>
      <TabPanel value="analytics">
        <p>Analytics charts and data visualization would go here.</p>
      </TabPanel>
      <TabPanel value="reports">
        <p>Generated reports and export options would go here.</p>
      </TabPanel>
      <TabPanel value="settings">
        <p>Dashboard configuration and preferences would go here.</p>
      </TabPanel>
    </Tabs>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Interactive playground
 */
export const Playground: Story = {
  render: (args) => (
    <Tabs {...args} onChange={action('onChange')}>
      <TabList>
        <Tab value="tab1" icon="home">
          Home
        </Tab>
        <Tab value="tab2" icon="user">
          Profile
        </Tab>
        <Tab value="tab3" icon="settings">
          Settings
        </Tab>
      </TabList>
      <TabPanel value="tab1">Home content goes here</TabPanel>
      <TabPanel value="tab2">Profile content goes here</TabPanel>
      <TabPanel value="tab3">Settings content goes here</TabPanel>
    </Tabs>
  ),
  args: {
    defaultValue: 'tab1',
    variant: 'line',
    size: 'md',
    orientation: 'horizontal',
    fitted: false,
    disabled: false,
    lazyMount: false,
    keepMounted: false,
  },
};
