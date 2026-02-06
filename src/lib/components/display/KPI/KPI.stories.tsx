import type { Meta, StoryObj } from '@storybook/react';
import { KPI } from './KPI';
import { Icon } from '../Icon/Icon';

const meta: Meta<typeof KPI> = {
  title: 'Display/KPI',
  component: KPI,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
KPI (Key Performance Indicator) component for displaying important metrics with context, change indicators, and optional trend data.

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
<td><code>--kpi-bg</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-background-primary)</code></a></td>
<td>Background color of the KPI card</td>
</tr>
<tr>
<td><code>--kpi-border</code></td>
<td>1px solid <a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-border-primary)</code></a></td>
<td>Border styling for the KPI card</td>
</tr>
<tr>
<td><code>--kpi-padding</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-lg)</code></a></td>
<td>Padding inside the KPI card</td>
</tr>
<tr>
<td><code>--kpi-border-radius</code></td>
<td><a href="?path=/story/theme-css-variables--borders"><code>var(--radius-lg)</code></a></td>
<td>Border radius for the KPI card</td>
</tr>
<tr>
<td><code>--kpi-gap</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-md)</code></a></td>
<td>Gap between sections in the KPI card</td>
</tr>
<tr>
<td><code>--kpi-shadow</code></td>
<td>0 1px 3px rgba(0, 0, 0, 0.1)</td>
<td>Box shadow for the KPI card</td>
</tr>
</tbody>
</table>
`,
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Title of the KPI',
    },
    value: {
      control: 'text',
      description: 'The main metric value',
    },
    subtitle: {
      control: 'text',
      description: 'Optional subtitle or category',
    },
    description: {
      control: 'text',
      description: 'Optional description text',
    },
    change: {
      control: 'text',
      description: 'Optional change indicator (e.g., "+12%", "-5%")',
    },
    changeType: {
      control: 'select',
      options: ['increase', 'decrease', 'neutral'],
      description: 'Direction of change',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'],
      description: 'Visual variant of the component',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the component',
    },
    icon: { table: { disable: true } },
    trend: { table: { disable: true } },
    footer: { table: { disable: true } },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof KPI>;

export const Default: Story = {
  args: {
    title: 'Total Revenue',
    value: '$54,239',
  },
};

export const WithChange: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
      }}
    >
      <KPI
        title="Total Revenue"
        value="$54,239"
        change="+18%"
        changeType="increase"
        variant="success"
        icon={<Icon name="dollar" size="xl" />}
      />
      <KPI
        title="Active Users"
        value="1,428"
        change="+12%"
        changeType="increase"
        variant="primary"
        icon={<Icon name="users" size="xl" />}
      />
      <KPI
        title="Churn Rate"
        value="2.4%"
        change="-0.5%"
        changeType="decrease"
        variant="danger"
        icon={<Icon name="trending-down" size="xl" />}
      />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const WithDescription: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
      }}
    >
      <KPI
        title="Conversion Rate"
        subtitle="E-commerce"
        value="3.24%"
        description="Percentage of visitors who made a purchase"
        variant="success"
      />
      <KPI
        title="Average Order Value"
        subtitle="Sales"
        value="$127.50"
        description="Average value per order this month"
        variant="primary"
      />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const WithFooter: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
      }}
    >
      <KPI
        title="Page Views"
        value="45,678"
        change="+8%"
        changeType="increase"
        footer="Last updated: 5 minutes ago"
      />
      <KPI
        title="Bounce Rate"
        value="42.3%"
        change="-2.1%"
        changeType="decrease"
        variant="warning"
        footer="Compared to last week"
      />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const Dashboard: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
      }}
    >
      <KPI
        title="Total Revenue"
        subtitle="Sales"
        value="$54,239"
        change="+18%"
        changeType="increase"
        description="Total revenue from all channels"
        variant="success"
        icon={<Icon name="dollar" size="xl" />}
        footer="Last 30 days"
      />
      <KPI
        title="New Customers"
        subtitle="Growth"
        value="1,428"
        change="+12%"
        changeType="increase"
        description="First-time customers this quarter"
        variant="primary"
        icon={<Icon name="users" size="xl" />}
        footer="This quarter"
      />
      <KPI
        title="Active Projects"
        subtitle="Operations"
        value="24"
        change="-3%"
        changeType="decrease"
        description="Currently active client projects"
        variant="info"
        icon={<Icon name="chart-bar" size="xl" />}
        footer="In progress"
      />
      <KPI
        title="Completion Rate"
        subtitle="Performance"
        value="94%"
        change="+2%"
        changeType="increase"
        description="Tasks completed on time"
        variant="success"
        icon={<Icon name="check" size="xl" />}
        footer="Last 7 days"
      />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <KPI title="Small KPI" value="123" size="sm" change="+5%" changeType="increase" />
      <KPI title="Medium KPI" value="456" size="md" change="+5%" changeType="increase" />
      <KPI title="Large KPI" value="789" size="lg" change="+5%" changeType="increase" />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const Playground: Story = {
  args: {
    title: 'Revenue',
    subtitle: 'Monthly',
    value: '$12,345',
    description: 'Total revenue this month',
    variant: 'primary',
    size: 'md',
    change: '+12%',
    changeType: 'increase',
    footer: 'Last 30 days',
  },
};
