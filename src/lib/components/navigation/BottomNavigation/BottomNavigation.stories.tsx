import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { BottomNavigation } from './BottomNavigation';
import { BottomNavigationItem } from './BottomNavigationItem';
import { Badge } from '../../display/Badge';

const meta: Meta<typeof BottomNavigation> = {
  title: 'Navigation/BottomNavigation',
  component: BottomNavigation,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Fixed navigation bar positioned at the bottom of the viewport. Ideal for mobile navigation with icons and optional labels. Respects safe areas on devices with notches.

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
<td><code>--bottom-nav-height</code></td>
<td>56px</td>
<td>Height of navigation bar (excluding safe area)</td>
</tr>
<tr>
<td><code>--bottom-nav-safe-area-bottom</code></td>
<td>env(safe-area-inset-bottom, 0px)</td>
<td>Safe area inset for notched devices</td>
</tr>
<tr>
<td><code>--bottom-nav-bg</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-background-primary)</code></a></td>
<td>Background color of navigation bar</td>
</tr>
<tr>
<td><code>--bottom-nav-border-color</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-border-primary)</code></a></td>
<td>Border color of top border</td>
</tr>
<tr>
<td><code>--bottom-nav-item-color</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-secondary)</code></a></td>
<td>Text color of inactive items</td>
</tr>
<tr>
<td><code>--bottom-nav-item-active-color</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-primary)</code></a></td>
<td>Text color of active items</td>
</tr>
<tr>
<td><code>--bottom-nav-transition</code></td>
<td>150ms ease-in-out</td>
<td>Transition duration and easing for state changes</td>
</tr>
<tr>
<td><code>--bottom-nav-z-index</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--z-fixed, 1200)</code></a></td>
<td>Z-index stacking context</td>
</tr>
</tbody>
</table>
`,
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ paddingBottom: '80px', minHeight: '300px' }}>
        <div style={{ padding: '20px' }}>
          <h3>Bottom Navigation Demo</h3>
          <p style={{ color: 'var(--theme-text-secondary)' }}>
            The navigation bar is fixed at the bottom of the viewport.
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BottomNavigation>;

export const Default: Story = {
  render: function Render(args) {
    const [selected, setSelected] = useState('home');

    return (
      <BottomNavigation {...args} value={selected} onChange={setSelected}>
        <BottomNavigationItem value="home" label="Home" icon="Home" />
        <BottomNavigationItem value="search" label="Search" icon="Search" />
        <BottomNavigationItem value="favorites" label="Favorites" icon="Heart" />
        <BottomNavigationItem value="profile" label="Profile" icon="User" />
      </BottomNavigation>
    );
  },
};

export const WithBadges: Story = {
  render: function Render(args) {
    const [selected, setSelected] = useState('home');

    return (
      <BottomNavigation {...args} value={selected} onChange={setSelected}>
        <BottomNavigationItem value="home" label="Home" icon="Home" />
        <BottomNavigationItem
          value="notifications"
          label="Notifications"
          icon="Bell"
          badge={
            <Badge size="sm" variant="danger">
              3
            </Badge>
          }
        />
        <BottomNavigationItem
          value="messages"
          label="Messages"
          icon="MessageCircle"
          badge={
            <Badge size="sm" variant="primary">
              12
            </Badge>
          }
        />
        <BottomNavigationItem value="profile" label="Profile" icon="User" />
      </BottomNavigation>
    );
  },
};

export const ShowSelectedLabelOnly: Story = {
  render: function Render(args) {
    const [selected, setSelected] = useState('home');

    return (
      <BottomNavigation
        {...args}
        value={selected}
        onChange={setSelected}
        showLabels={false}
        showSelectedLabel
      >
        <BottomNavigationItem value="home" label="Home" icon="Home" />
        <BottomNavigationItem value="search" label="Search" icon="Search" />
        <BottomNavigationItem value="favorites" label="Favorites" icon="Heart" />
        <BottomNavigationItem value="profile" label="Profile" icon="User" />
      </BottomNavigation>
    );
  },
};

export const IconsOnly: Story = {
  render: function Render(args) {
    const [selected, setSelected] = useState('home');

    return (
      <BottomNavigation {...args} value={selected} onChange={setSelected} showLabels={false}>
        <BottomNavigationItem value="home" label="Home" icon="Home" />
        <BottomNavigationItem value="search" label="Search" icon="Search" />
        <BottomNavigationItem value="add" label="Add" icon="PlusCircle" />
        <BottomNavigationItem value="favorites" label="Favorites" icon="Heart" />
        <BottomNavigationItem value="profile" label="Profile" icon="User" />
      </BottomNavigation>
    );
  },
};

export const ThreeItems: Story = {
  render: function Render(args) {
    const [selected, setSelected] = useState('home');

    return (
      <BottomNavigation {...args} value={selected} onChange={setSelected}>
        <BottomNavigationItem value="home" label="Home" icon="Home" />
        <BottomNavigationItem value="explore" label="Explore" icon="Compass" />
        <BottomNavigationItem value="profile" label="Profile" icon="User" />
      </BottomNavigation>
    );
  },
};

export const FiveItems: Story = {
  render: function Render(args) {
    const [selected, setSelected] = useState('home');

    return (
      <BottomNavigation {...args} value={selected} onChange={setSelected}>
        <BottomNavigationItem value="home" label="Home" icon="Home" />
        <BottomNavigationItem value="search" label="Search" icon="Search" />
        <BottomNavigationItem value="add" label="Create" icon="PlusSquare" />
        <BottomNavigationItem value="activity" label="Activity" icon="Heart" />
        <BottomNavigationItem value="profile" label="Profile" icon="User" />
      </BottomNavigation>
    );
  },
};

export const WithDisabledItem: Story = {
  render: function Render(args) {
    const [selected, setSelected] = useState('home');

    return (
      <BottomNavigation {...args} value={selected} onChange={setSelected}>
        <BottomNavigationItem value="home" label="Home" icon="Home" />
        <BottomNavigationItem value="search" label="Search" icon="Search" />
        <BottomNavigationItem value="premium" label="Premium" icon="Crown" disabled />
        <BottomNavigationItem value="profile" label="Profile" icon="User" />
      </BottomNavigation>
    );
  },
};

export const AsLinks: Story = {
  render: function Render(args) {
    const [selected, setSelected] = useState('home');

    return (
      <BottomNavigation {...args} value={selected} onChange={setSelected}>
        <BottomNavigationItem value="home" label="Home" icon="Home" href="#home" />
        <BottomNavigationItem value="search" label="Search" icon="Search" href="#search" />
        <BottomNavigationItem value="favorites" label="Favorites" icon="Heart" href="#favorites" />
        <BottomNavigationItem value="profile" label="Profile" icon="User" href="#profile" />
      </BottomNavigation>
    );
  },
};
