import type { Meta, StoryObj } from '@storybook/react';
import { CircularProgress } from './CircularProgress';

const meta: Meta<typeof CircularProgress> = {
  title: 'Display/CircularProgress',
  component: CircularProgress,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
CircularProgress component for displaying circular progress indicators.

The CircularProgress component displays a circular progress bar indicating task completion or loading progress. It supports multiple visual variants, configurable sizes, and optional value/label display in the center.

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
<td><code>--circle-size</code></td>
<td><code>96px</code></td>
<td>Overall size of the circular progress indicator</td>
</tr>
<tr>
<td><code>--circle-track-color</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-neutral-200)</code></a></td>
<td>Color of the background circle track</td>
</tr>
<tr>
<td><code>--circle-fill-color</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-primary-500)</code></a></td>
<td>Color of the progress fill circle</td>
</tr>
<tr>
<td><code>--circle-transition</code></td>
<td><code>stroke-dashoffset 0.3s ease</code></td>
<td>Transition effect for progress animation</td>
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
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'],
      description: 'Visual variant of the component',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the component',
    },
    value: {
      control: { type: 'range', min: 0, max: 100 },
      description: 'Current progress value (0-100)',
    },
    max: {
      control: { type: 'number', min: 1 },
      description: 'Maximum value',
    },
    showValue: {
      control: 'boolean',
      description: 'Whether to show the value label in the center',
    },
    label: {
      control: 'text',
      description: 'Custom label to display in the center',
    },
    strokeWidth: {
      control: { type: 'range', min: 1, max: 10 },
      description: 'Stroke width of the circle',
    },
    formatValue: { table: { disable: true } },
    className: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
    style: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof CircularProgress>;

export const Default: Story = {
  args: {
    value: 50,
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      <CircularProgress variant="primary" value={75} showValue label="Primary" />
      <CircularProgress variant="secondary" value={60} showValue label="Secondary" />
      <CircularProgress variant="success" value={100} showValue label="Success" />
      <CircularProgress variant="warning" value={45} showValue label="Warning" />
      <CircularProgress variant="danger" value={25} showValue label="Danger" />
      <CircularProgress variant="info" value={80} showValue label="Info" />
      <CircularProgress variant="neutral" value={50} showValue label="Neutral" />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <CircularProgress size="sm" value={75} showValue label="Small" />
      <CircularProgress size="md" value={75} showValue label="Medium" />
      <CircularProgress size="lg" value={75} showValue label="Large" />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const WithLabels: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      <CircularProgress value={75} label="Loading" />
      <CircularProgress variant="success" value={100} label="Done" />
      <CircularProgress variant="warning" value={45} label="Wait" />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const Playground: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    value: 50,
    showValue: true,
  },
};
