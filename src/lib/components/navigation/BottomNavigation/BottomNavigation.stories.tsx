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
          badge={<Badge size="sm" variant="danger">3</Badge>}
        />
        <BottomNavigationItem
          value="messages"
          label="Messages"
          icon="MessageCircle"
          badge={<Badge size="sm" variant="primary">12</Badge>}
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
      <BottomNavigation {...args} value={selected} onChange={setSelected} showLabels={false} showSelectedLabel>
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
