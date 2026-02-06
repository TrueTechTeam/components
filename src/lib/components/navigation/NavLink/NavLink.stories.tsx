import type { Meta, StoryObj } from '@storybook/react';
import { NavLink } from './NavLink';

const meta: Meta<typeof NavLink> = {
  title: 'Navigation/NavLink',
  component: NavLink,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Semantic navigation link component with multiple variants (default, underline, pill, ghost) and sizes. Supports icons and active/disabled states.

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
<td><code>--nav-link-color</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-secondary)</code></a></td>
<td>Text color for inactive link</td>
</tr>
<tr>
<td><code>--nav-link-color-hover</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-primary)</code></a></td>
<td>Text color on hover</td>
</tr>
<tr>
<td><code>--nav-link-color-active</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-primary)</code></a></td>
<td>Text color when active</td>
</tr>
<tr>
<td><code>--nav-link-bg</code></td>
<td>transparent</td>
<td>Background color for inactive link</td>
</tr>
<tr>
<td><code>--nav-link-bg-hover</code></td>
<td>transparent</td>
<td>Background color on hover</td>
</tr>
<tr>
<td><code>--nav-link-bg-active</code></td>
<td>transparent</td>
<td>Background color when active</td>
</tr>
<tr>
<td><code>--nav-link-font-size</code></td>
<td><a href="?path=/story/theme-css-variables--typography"><code>var(--font-size-base)</code></a></td>
<td>Font size</td>
</tr>
<tr>
<td><code>--nav-link-font-weight</code></td>
<td><a href="?path=/story/theme-css-variables--typography"><code>var(--font-weight-medium)</code></a></td>
<td>Font weight</td>
</tr>
<tr>
<td><code>--nav-link-padding-x</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-sm)</code></a></td>
<td>Horizontal padding</td>
</tr>
<tr>
<td><code>--nav-link-padding-y</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-xs)</code></a></td>
<td>Vertical padding</td>
</tr>
<tr>
<td><code>--nav-link-gap</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-xs)</code></a></td>
<td>Gap between icon and text</td>
</tr>
<tr>
<td><code>--nav-link-radius</code></td>
<td><a href="?path=/story/theme-css-variables--borders"><code>var(--radius-md)</code></a></td>
<td>Border radius</td>
</tr>
<tr>
<td><code>--nav-link-underline-height</code></td>
<td>2px</td>
<td>Height of underline in underline variant</td>
</tr>
<tr>
<td><code>--nav-link-transition</code></td>
<td><a href="?path=/story/theme-css-variables--transitions"><code>var(--transition-fast)</code></a></td>
<td>Transition duration and easing</td>
</tr>
</tbody>
</table>
`,
      },
    },
  },
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
