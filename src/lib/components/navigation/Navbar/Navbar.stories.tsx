import type { Meta, StoryObj } from '@storybook/react';
import { Navbar } from './Navbar';
import { NavbarBrand } from './NavbarBrand';
import { NavbarNav } from './NavbarNav';
import { NavbarActions } from './NavbarActions';
import { NavbarToggle } from './NavbarToggle';
import { NavbarCollapse } from './NavbarCollapse';
import { NavLink } from '../NavLink';
import { Button } from '../../buttons/Button';

const meta: Meta<typeof Navbar> = {
  title: 'Navigation/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Flexible navigation bar with responsive mobile menu, support for blur effects, and multiple positioning options. Includes branded sections, navigation links, and action buttons.

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
<td><code>--navbar-height-sm</code></td>
<td>48px</td>
<td>Height for small size variant</td>
</tr>
<tr>
<td><code>--navbar-height-md</code></td>
<td>64px</td>
<td>Height for medium size variant</td>
</tr>
<tr>
<td><code>--navbar-height-lg</code></td>
<td>80px</td>
<td>Height for large size variant</td>
</tr>
<tr>
<td><code>--navbar-height</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--navbar-height-md)</code></a></td>
<td>Current navbar height</td>
</tr>
<tr>
<td><code>--navbar-bg</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-background-primary)</code></a></td>
<td>Background color</td>
</tr>
<tr>
<td><code>--navbar-border-color</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-border-primary)</code></a></td>
<td>Bottom border color</td>
</tr>
<tr>
<td><code>--navbar-text-color</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-primary)</code></a></td>
<td>Text color</td>
</tr>
<tr>
<td><code>--navbar-blur-bg</code></td>
<td>rgba(theme-surface-primary, 0.5)</td>
<td>Background for blur variant</td>
</tr>
<tr>
<td><code>--navbar-blur-amount</code></td>
<td>12px</td>
<td>Blur amount for blur variant</td>
</tr>
<tr>
<td><code>--navbar-transition-duration</code></td>
<td>250ms</td>
<td>Duration for state transitions</td>
</tr>
<tr>
<td><code>--navbar-z-index</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--z-sticky, 1100)</code></a></td>
<td>Z-index stacking context</td>
</tr>
<tr>
<td><code>--navbar-padding-x</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-lg)</code></a></td>
<td>Horizontal padding</td>
</tr>
<tr>
<td><code>--navbar-gap</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-lg)</code></a></td>
<td>Gap between navbar sections</td>
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
      options: ['solid', 'transparent', 'blur'],
    },
    position: {
      control: 'select',
      options: ['fixed', 'sticky', 'static'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    alignment: {
      control: 'select',
      options: ['left', 'center'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {
  render: (args) => (
    <Navbar {...args}>
      <NavbarBrand href="/">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
          <circle cx="16" cy="16" r="14" />
        </svg>
        <span>MyApp</span>
      </NavbarBrand>
      <NavbarNav>
        <NavLink href="#" active>
          Home
        </NavLink>
        <NavLink href="#">Features</NavLink>
        <NavLink href="#">Pricing</NavLink>
        <NavLink href="#">About</NavLink>
      </NavbarNav>
      <NavbarActions>
        <Button variant="ghost" size="sm">
          Sign In
        </Button>
        <Button variant="primary" size="sm">
          Get Started
        </Button>
      </NavbarActions>
    </Navbar>
  ),
};

export const WithMobileMenu: Story = {
  render: (args) => (
    <div style={{ minHeight: '200px', width: '100%' }}>
      <Navbar {...args}>
        <NavbarBrand href="/">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
            <circle cx="16" cy="16" r="14" />
          </svg>
          <span>MyApp</span>
        </NavbarBrand>
        <NavbarToggle />
        <NavbarCollapse>
          <NavbarNav>
            <NavLink href="#" active>
              Home
            </NavLink>
            <NavLink href="#">Features</NavLink>
            <NavLink href="#">Pricing</NavLink>
            <NavLink href="#">About</NavLink>
          </NavbarNav>
          <NavbarActions>
            <Button variant="ghost" size="sm" fullWidth>
              Sign In
            </Button>
            <Button variant="primary" size="sm" fullWidth>
              Get Started
            </Button>
          </NavbarActions>
        </NavbarCollapse>
        <NavbarNav>
          <NavLink href="#" active>
            Home
          </NavLink>
          <NavLink href="#">Features</NavLink>
          <NavLink href="#">Pricing</NavLink>
          <NavLink href="#">About</NavLink>
        </NavbarNav>
        <NavbarActions>
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button variant="primary" size="sm">
            Get Started
          </Button>
        </NavbarActions>
      </Navbar>
      <p style={{ padding: '20px', textAlign: 'center', color: 'var(--theme-text-secondary)' }}>
        Resize the window to see the mobile menu toggle
      </p>
    </div>
  ),
};

export const Transparent: Story = {
  render: (args) => (
    <div
      style={{
        background: 'linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-tertiary) 100%)',
        minHeight: '300px',
        width: 800,
        margin: '16px',
        borderRadius: '8px',
      }}
    >
      <Navbar {...args} variant="transparent">
        <NavbarBrand href="/">
          <span style={{ color: 'white' }}>MyApp</span>
        </NavbarBrand>
        <NavbarNav>
          <NavLink href="#" active style={{ color: 'white' }}>
            Home
          </NavLink>
          <NavLink href="#" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Features
          </NavLink>
          <NavLink href="#" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Pricing
          </NavLink>
        </NavbarNav>
        <NavbarActions>
          <Button variant="outline" size="sm" style={{ color: 'white', borderColor: 'white' }}>
            Sign In
          </Button>
        </NavbarActions>
      </Navbar>
    </div>
  ),
};

export const Blur: Story = {
  render: (args) => (
    <div style={{ position: 'relative', height: '400px', overflow: 'auto' }}>
      <Navbar {...args} variant="blur" position="sticky">
        <NavbarBrand href="/">MyApp</NavbarBrand>
        <NavbarNav>
          <NavLink href="#" active>
            Home
          </NavLink>
          <NavLink href="#">Features</NavLink>
          <NavLink href="#">Pricing</NavLink>
        </NavbarNav>
        <NavbarActions>
          <Button variant="primary" size="sm">
            Get Started
          </Button>
        </NavbarActions>
      </Navbar>
      <div style={{ padding: '20px' }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <p key={i} style={{ marginBottom: '16px' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
        ))}
      </div>
    </div>
  ),
};

export const Centered: Story = {
  render: (args) => (
    <Navbar {...args} alignment="center">
      <NavbarBrand href="/">MyApp</NavbarBrand>
      <NavbarNav>
        <NavLink href="#" active>
          Home
        </NavLink>
        <NavLink href="#">Features</NavLink>
        <NavLink href="#">Pricing</NavLink>
        <NavLink href="#">About</NavLink>
      </NavbarNav>
      <NavbarActions>
        <Button variant="primary" size="sm">
          Get Started
        </Button>
      </NavbarActions>
    </Navbar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <p style={{ padding: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          Small
        </p>
        <Navbar size="sm">
          <NavbarBrand href="/">MyApp</NavbarBrand>
          <NavbarNav>
            <NavLink href="#" size="sm">
              Home
            </NavLink>
            <NavLink href="#" size="sm">
              About
            </NavLink>
          </NavbarNav>
        </Navbar>
      </div>
      <div>
        <p style={{ padding: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          Medium (default)
        </p>
        <Navbar size="md">
          <NavbarBrand href="/">MyApp</NavbarBrand>
          <NavbarNav>
            <NavLink href="#">Home</NavLink>
            <NavLink href="#">About</NavLink>
          </NavbarNav>
        </Navbar>
      </div>
      <div>
        <p style={{ padding: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          Large
        </p>
        <Navbar size="lg">
          <NavbarBrand href="/">MyApp</NavbarBrand>
          <NavbarNav>
            <NavLink href="#" size="lg">
              Home
            </NavLink>
            <NavLink href="#" size="lg">
              About
            </NavLink>
          </NavbarNav>
        </Navbar>
      </div>
    </div>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <Navbar {...args}>
      <NavbarBrand href="/">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="var(--theme-primary)">
          <circle cx="16" cy="16" r="14" />
        </svg>
        <span>MyApp</span>
      </NavbarBrand>
      <NavbarNav>
        <NavLink href="#" icon="home" active>
          Home
        </NavLink>
        <NavLink href="#" icon="grid">
          Features
        </NavLink>
        <NavLink href="#" icon="credit-card">
          Pricing
        </NavLink>
        <NavLink href="#" icon="help">
          Help
        </NavLink>
      </NavbarNav>
      <NavbarActions>
        <Button variant="ghost" size="sm" startIcon="Bell">
          Notifications
        </Button>
        <Button variant="primary" size="sm">
          Get Started
        </Button>
      </NavbarActions>
    </Navbar>
  ),
};
