import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumbs } from './Breadcrumbs';
import { BreadcrumbItem } from './BreadcrumbItem';
import { useBreadcrumbsFromPath } from './useBreadcrumbsFromPath';
import { Icon } from '../../display/Icon';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Breadcrumb navigation showing the current location within a hierarchy. Supports collapsing intermediate items and custom separators.

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
<td><code>--breadcrumbs-gap</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-sm)</code></a></td>
<td>Gap between breadcrumb items</td>
</tr>
<tr>
<td><code>--breadcrumbs-separator-gap</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-xs)</code></a></td>
<td>Gap around separators</td>
</tr>
<tr>
<td><code>--breadcrumbs-text-color</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-secondary)</code></a></td>
<td>Default text color</td>
</tr>
<tr>
<td><code>--breadcrumbs-link-color</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-primary)</code></a></td>
<td>Color of navigation links</td>
</tr>
<tr>
<td><code>--breadcrumbs-link-hover-color</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-primary)</code></a></td>
<td>Hover color for links</td>
</tr>
<tr>
<td><code>--breadcrumbs-current-color</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-primary)</code></a></td>
<td>Color of current/active breadcrumb</td>
</tr>
<tr>
<td><code>--breadcrumbs-separator-color</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-tertiary)</code></a></td>
<td>Color of separator elements</td>
</tr>
<tr>
<td><code>--breadcrumbs-font-size</code></td>
<td><a href="?path=/story/theme-css-variables--typography"><code>var(--font-size-sm)</code></a></td>
<td>Font size of breadcrumbs</td>
</tr>
</tbody>
</table>
`,
      },
    },
  },
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
