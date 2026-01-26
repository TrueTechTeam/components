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
