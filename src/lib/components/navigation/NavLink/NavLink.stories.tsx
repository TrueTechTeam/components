import type { Meta, StoryObj } from '@storybook/react';
import { NavLink } from './NavLink';

const meta: Meta<typeof NavLink> = {
  title: 'Navigation/NavLink',
  component: NavLink,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'underline', 'pill', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    iconPosition: {
      control: 'select',
      options: ['start', 'end'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof NavLink>;

export const Default: Story = {
  args: {
    href: '/home',
    children: 'Home',
  },
};

export const Active: Story = {
  args: {
    href: '/dashboard',
    children: 'Dashboard',
    active: true,
  },
};

export const WithIcon: Story = {
  args: {
    href: '/settings',
    children: 'Settings',
    icon: 'settings',
  },
};

export const IconEnd: Story = {
  args: {
    href: '/external',
    children: 'External Link',
    icon: 'external-link',
    iconPosition: 'end',
    target: '_blank',
  },
};

export const Disabled: Story = {
  args: {
    href: '/disabled',
    children: 'Disabled Link',
    disabled: true,
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <NavLink href="#" variant="default">
        Default
      </NavLink>
      <NavLink href="#" variant="default" active>
        Default Active
      </NavLink>
      <NavLink href="#" variant="underline">
        Underline
      </NavLink>
      <NavLink href="#" variant="underline" active>
        Underline Active
      </NavLink>
      <NavLink href="#" variant="pill">
        Pill
      </NavLink>
      <NavLink href="#" variant="pill" active>
        Pill Active
      </NavLink>
      <NavLink href="#" variant="ghost">
        Ghost
      </NavLink>
      <NavLink href="#" variant="ghost" active>
        Ghost Active
      </NavLink>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <NavLink href="#" size="sm" icon="Home">
        Small
      </NavLink>
      <NavLink href="#" size="md" icon="Home">
        Medium
      </NavLink>
      <NavLink href="#" size="lg" icon="Home">
        Large
      </NavLink>
    </div>
  ),
};

export const NavigationExample: Story = {
  render: () => (
    <nav style={{ display: 'flex', gap: '8px' }}>
      <NavLink href="#" icon="Home" active>
        Home
      </NavLink>
      <NavLink href="#" icon="Users">
        Users
      </NavLink>
      <NavLink href="#" icon="Settings">
        Settings
      </NavLink>
      <NavLink href="#" icon="HelpCircle">
        Help
      </NavLink>
    </nav>
  ),
};

export const PillNavigation: Story = {
  render: () => (
    <nav
      style={{
        display: 'flex',
        gap: '4px',
        padding: '4px',
        background: 'var(--theme-background-secondary)',
        borderRadius: '24px',
      }}
    >
      <NavLink href="#" variant="pill" active>
        Overview
      </NavLink>
      <NavLink href="#" variant="pill">
        Analytics
      </NavLink>
      <NavLink href="#" variant="pill">
        Reports
      </NavLink>
      <NavLink href="#" variant="pill">
        Settings
      </NavLink>
    </nav>
  ),
};

export const UnderlineNavigation: Story = {
  render: () => (
    <nav
      style={{
        display: 'flex',
        gap: '16px',
        borderBottom: '1px solid var(--theme-border-primary)',
      }}
    >
      <NavLink href="#" variant="underline" active>
        Overview
      </NavLink>
      <NavLink href="#" variant="underline">
        Activity
      </NavLink>
      <NavLink href="#" variant="underline">
        Settings
      </NavLink>
      <NavLink href="#" variant="underline">
        Billing
      </NavLink>
    </nav>
  ),
};
