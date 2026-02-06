import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { OverflowText } from './OverflowText';

const meta: Meta<typeof OverflowText> = {
  title: 'Display/OverflowText',
  component: OverflowText,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Text component that truncates with ellipsis when it overflows, showing the full content in a tooltip on hover. Supports multi-line truncation and customizable tooltip behavior.

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
<td><code>--overflow-text-lines</code></td>
<td>1</td>
<td>Number of lines before truncation</td>
</tr>
<tr>
<td><code>--overflow-text-tooltip-max-width</code></td>
<td>300px</td>
<td>Maximum width of the tooltip content</td>
</tr>
</tbody>
</table>
`,
      },
    },
  },
  args: {
    onOverflowChange: fn(),
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Text content to display',
    },
    lines: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Maximum number of lines before truncation',
    },
    tooltipPosition: {
      control: 'select',
      options: [
        'top',
        'bottom',
        'left',
        'right',
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
      ],
      description: 'Position of the tooltip',
    },
    tooltipDelay: {
      control: { type: 'number', min: 0, max: 1000, step: 100 },
      description: 'Delay before showing tooltip (ms)',
    },
    tooltipMaxWidth: {
      control: { type: 'number', min: 100, max: 500, step: 50 },
      description: 'Maximum width of the tooltip',
    },
    disableTooltip: {
      control: 'boolean',
      description: 'Disable tooltip and use native title attribute',
    },
    as: {
      control: 'select',
      options: ['span', 'p', 'div'],
      description: 'HTML element to render',
    },
    tooltipContent: { table: { disable: true } },
    onOverflowChange: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
    'aria-label': { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof OverflowText>;

const longText =
  'This is a very long text that demonstrates the overflow behavior of the OverflowText component. When the text exceeds the available space, it will be truncated with an ellipsis, and hovering over it will show the full text in a tooltip.';

const multiLineText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';

/**
 * Default single-line truncation with tooltip
 */
export const Default: Story = {
  args: {
    children: longText,
  },
  render: (args) => (
    <div style={{ width: 300 }}>
      <OverflowText {...args} />
    </div>
  ),
};

/**
 * Short text that doesn't overflow - no tooltip shown
 */
export const NoOverflow: Story = {
  args: {
    children: 'Short text',
  },
  render: (args) => (
    <div style={{ width: 300 }}>
      <OverflowText {...args} />
    </div>
  ),
};

/**
 * Multi-line truncation with configurable line count
 */
export const MultiLine: Story = {
  args: {
    children: multiLineText,
    lines: 2,
  },
  render: (args) => (
    <div style={{ width: 300 }}>
      <OverflowText {...args} />
    </div>
  ),
};

/**
 * Different line counts
 */
export const LineVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 300 }}>
      <div>
        <strong>1 line (default):</strong>
        <OverflowText lines={1}>{multiLineText}</OverflowText>
      </div>
      <div>
        <strong>2 lines:</strong>
        <OverflowText lines={2}>{multiLineText}</OverflowText>
      </div>
      <div>
        <strong>3 lines:</strong>
        <OverflowText lines={3}>{multiLineText}</OverflowText>
      </div>
      <div>
        <strong>4 lines:</strong>
        <OverflowText lines={4}>{multiLineText}</OverflowText>
      </div>
    </div>
  ),
};

/**
 * Tooltip position variants
 */
export const TooltipPositions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48, padding: 100 }}>
      <div style={{ width: 200 }}>
        <strong>Top (default):</strong>
        <OverflowText tooltipPosition="top">{longText}</OverflowText>
      </div>
      <div style={{ width: 200 }}>
        <strong>Bottom:</strong>
        <OverflowText tooltipPosition="bottom">{longText}</OverflowText>
      </div>
      <div style={{ width: 200 }}>
        <strong>Left:</strong>
        <OverflowText tooltipPosition="left">{longText}</OverflowText>
      </div>
      <div style={{ width: 200 }}>
        <strong>Right:</strong>
        <OverflowText tooltipPosition="right">{longText}</OverflowText>
      </div>
    </div>
  ),
};

/**
 * Different tooltip delays
 */
export const TooltipDelays: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 200 }}>
      <div>
        <strong>Instant (0ms):</strong>
        <OverflowText tooltipDelay={0}>{longText}</OverflowText>
      </div>
      <div>
        <strong>Default (200ms):</strong>
        <OverflowText tooltipDelay={200}>{longText}</OverflowText>
      </div>
      <div>
        <strong>Slow (500ms):</strong>
        <OverflowText tooltipDelay={500}>{longText}</OverflowText>
      </div>
    </div>
  ),
};

/**
 * Disabled tooltip - uses native title attribute
 */
export const DisabledTooltip: Story = {
  args: {
    children: longText,
    disableTooltip: true,
  },
  render: (args) => (
    <div style={{ width: 200 }}>
      <p style={{ marginBottom: 8 }}>Uses native title attribute instead of custom tooltip:</p>
      <OverflowText {...args} />
    </div>
  ),
};

/**
 * Custom tooltip content
 */
export const CustomTooltipContent: Story = {
  args: {
    children: 'user@example.com',
    tooltipContent: (
      <div>
        <strong>Email:</strong> user@example.com
        <br />
        <em>Click to copy</em>
      </div>
    ),
  },
  render: (args) => (
    <div style={{ width: 100 }}>
      <OverflowText {...args} />
    </div>
  ),
};

/**
 * Different element types
 */
export const ElementTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 200 }}>
      <div>
        <strong>Span (default):</strong>
        <OverflowText as="span">{longText}</OverflowText>
      </div>
      <div>
        <strong>Paragraph:</strong>
        <OverflowText as="p">{longText}</OverflowText>
      </div>
      <div>
        <strong>Div:</strong>
        <OverflowText as="div">{longText}</OverflowText>
      </div>
    </div>
  ),
};

/**
 * Responsive width - resize the container to see truncation
 */
export const ResponsiveWidth: Story = {
  args: {
    children: longText,
  },
  render: (args) => (
    <div
      style={{
        resize: 'horizontal',
        overflow: 'auto',
        border: '1px dashed var(--theme-border-primary)',
        padding: 16,
        minWidth: 100,
        maxWidth: 600,
        width: 300,
      }}
    >
      <p style={{ marginBottom: 8, color: 'var(--theme-text-secondary)' }}>
        Resize this container:
      </p>
      <OverflowText {...args} />
    </div>
  ),
};

/**
 * In a table cell
 */
export const InTableCell: Story = {
  render: () => (
    <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th
            style={{
              width: 80,
              textAlign: 'left',
              padding: 8,
              borderBottom: '1px solid var(--theme-border-primary)',
            }}
          >
            ID
          </th>
          <th
            style={{
              width: 150,
              textAlign: 'left',
              padding: 8,
              borderBottom: '1px solid var(--theme-border-primary)',
            }}
          >
            Name
          </th>
          <th
            style={{
              textAlign: 'left',
              padding: 8,
              borderBottom: '1px solid var(--theme-border-primary)',
            }}
          >
            Description
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ padding: 8 }}>1</td>
          <td style={{ padding: 8 }}>
            <OverflowText>John Doe with a very long name</OverflowText>
          </td>
          <td style={{ padding: 8 }}>
            <OverflowText lines={2}>{multiLineText}</OverflowText>
          </td>
        </tr>
        <tr>
          <td style={{ padding: 8 }}>2</td>
          <td style={{ padding: 8 }}>
            <OverflowText>Jane</OverflowText>
          </td>
          <td style={{ padding: 8 }}>
            <OverflowText>Short description</OverflowText>
          </td>
        </tr>
      </tbody>
    </table>
  ),
};

/**
 * With overflow change callback
 */
export const WithCallback: Story = {
  args: {
    children: longText,
  },
  render: (args) => (
    <div
      style={{
        resize: 'horizontal',
        overflow: 'auto',
        border: '1px dashed var(--theme-border-primary)',
        padding: 16,
        minWidth: 100,
        width: 300,
      }}
    >
      <p style={{ marginBottom: 8, color: 'var(--theme-text-secondary)' }}>
        Check actions panel for overflow state changes:
      </p>
      <OverflowText {...args} />
    </div>
  ),
};
