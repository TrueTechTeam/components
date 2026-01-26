import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumbs } from './Breadcrumbs';
import { BreadcrumbItem } from './BreadcrumbItem';
import { useBreadcrumbsFromPath } from './useBreadcrumbsFromPath';
import { Icon } from '../../display/Icon';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Electronics', href: '/products/electronics' },
      { label: 'Phones', current: true },
    ],
  },
};

export const WithCompoundAPI: Story = {
  render: () => (
    <Breadcrumbs>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/products">Products</BreadcrumbItem>
      <BreadcrumbItem href="/products/electronics">Electronics</BreadcrumbItem>
      <BreadcrumbItem current>Phones</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const WithHomeIcon: Story = {
  args: {
    showHomeIcon: true,
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Electronics', current: true },
    ],
  },
};

export const WithCustomSeparator: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Breadcrumbs
        separator={<Icon name="chevron-right" size={14} />}
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: 'Electronics', current: true },
        ]}
      />

      <Breadcrumbs
        separator=">"
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: 'Electronics', current: true },
        ]}
      />

      <Breadcrumbs
        separator="-"
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: 'Electronics', current: true },
        ]}
      />
    </div>
  ),
};

export const WithCollapse: Story = {
  args: {
    maxItems: 4,
    itemsBeforeCollapse: 1,
    itemsAfterCollapse: 2,
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Electronics', href: '/products/electronics' },
      { label: 'Phones', href: '/products/electronics/phones' },
      { label: 'Smartphones', href: '/products/electronics/phones/smartphones' },
      { label: 'Android', href: '/products/electronics/phones/smartphones/android' },
      { label: 'Samsung Galaxy S24', current: true },
    ],
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          Small
        </p>
        <Breadcrumbs
          size="sm"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            { label: 'Electronics', current: true },
          ]}
        />
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          Medium (default)
        </p>
        <Breadcrumbs
          size="md"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            { label: 'Electronics', current: true },
          ]}
        />
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          Large
        </p>
        <Breadcrumbs
          size="lg"
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            { label: 'Electronics', current: true },
          ]}
        />
      </div>
    </div>
  ),
};

export const WithIcons: Story = {
  args: {
    items: [
      { label: 'Home', href: '/', icon: 'home' },
      { label: 'Settings', href: '/settings', icon: 'settings' },
      { label: 'Profile', current: true, icon: 'user' },
    ],
  },
};

// Helper component to use the hook properly
const BreadcrumbsFromPath = ({ path }: { path: string }) => {
  const breadcrumbs = useBreadcrumbsFromPath({ path });
  return (
    <div>
      <p
        style={{
          marginBottom: '8px',
          fontSize: '12px',
          color: 'var(--theme-text-secondary)',
        }}
      >
        Path: {path}
      </p>
      <Breadcrumbs items={breadcrumbs} />
    </div>
  );
};

export const UseBreadcrumbsFromPathHook: Story = {
  render: function Render() {
    // Simulating different paths
    const paths = [
      '/products/electronics/phones',
      '/users/123/settings',
      '/dashboard/analytics/reports/monthly',
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {paths.map((path) => (
          <BreadcrumbsFromPath key={path} path={path} />
        ))}
      </div>
    );
  },
};

export const UseBreadcrumbsWithCustomLabels: Story = {
  render: function Render() {
    const breadcrumbs = useBreadcrumbsFromPath({
      path: '/users/123/account-settings',
      labels: {
        users: 'All Users',
        '123': 'John Doe',
        'account-settings': 'Account Settings',
      },
    });

    return (
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          With custom labels mapping
        </p>
        <Breadcrumbs items={breadcrumbs} />
      </div>
    );
  },
};

export const UseBreadcrumbsWithExcludedSegments: Story = {
  render: function Render() {
    const breadcrumbs = useBreadcrumbsFromPath({
      path: '/(dashboard)/projects/my-project/settings',
      excludeSegments: ['(dashboard)', '(auth)'],
    });

    return (
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          Next.js App Router path with excluded route groups
        </p>
        <Breadcrumbs items={breadcrumbs} />
      </div>
    );
  },
};
