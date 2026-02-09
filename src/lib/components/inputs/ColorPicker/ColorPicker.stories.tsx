import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { ColorPicker } from './ColorPicker';

const meta: Meta<typeof ColorPicker> = {
  title: 'Inputs/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
ColorPicker component with interactive color selection via canvas, HSL/RGB sliders, and preset colors. Supports multiple output formats and alpha channel.

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
<td><code>--spacing-xs</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-xs)</code></a></td>
<td>Extra small spacing</td>
</tr>
<tr>
<td><code>--spacing-sm</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-sm)</code></a></td>
<td>Small spacing</td>
</tr>
<tr>
<td><code>--spacing-md</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-md)</code></a></td>
<td>Medium spacing</td>
</tr>
<tr>
<td><code>--font-size-base</code></td>
<td><a href="?path=/story/theme-css-variables--typography"><code>var(--font-size-base)</code></a></td>
<td>Base font size</td>
</tr>
<tr>
<td><code>--font-size-sm</code></td>
<td><a href="?path=/story/theme-css-variables--typography"><code>var(--font-size-sm)</code></a></td>
<td>Small font size</td>
</tr>
<tr>
<td><code>--theme-text-primary</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-primary)</code></a></td>
<td>Primary text color</td>
</tr>
<tr>
<td><code>--theme-text-secondary</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-secondary)</code></a></td>
<td>Secondary text color</td>
</tr>
<tr>
<td><code>--theme-surface-elevated</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-surface-elevated)</code></a></td>
<td>Elevated surface color</td>
</tr>
<tr>
<td><code>--theme-control-border</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-control-border)</code></a></td>
<td>Control border color</td>
</tr>
<tr>
<td><code>--theme-primary</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-primary)</code></a></td>
<td>Primary theme color</td>
</tr>
<tr>
<td><code>--theme-error</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-error)</code></a></td>
<td>Error color</td>
</tr>
<tr>
<td><code>--theme-neutral-300</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-neutral-300)</code></a></td>
<td>Neutral color 300</td>
</tr>
<tr>
<td><code>--theme-neutral-600</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-neutral-600)</code></a></td>
<td>Neutral color 600</td>
</tr>
<tr>
<td><code>--radius-sm</code></td>
<td><a href="?path=/story/theme-css-variables--borders"><code>var(--radius-sm)</code></a></td>
<td>Small border radius</td>
</tr>
<tr>
<td><code>--radius-md</code></td>
<td><a href="?path=/story/theme-css-variables--borders"><code>var(--radius-md)</code></a></td>
<td>Medium border radius</td>
</tr>
</tbody>
</table>
`,
      },
    },
  },
  argTypes: {
    // Simple controls
    label: {
      control: 'text',
      description: 'Input label text',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the input',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message (shows when error is true)',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    error: {
      control: 'boolean',
      description: 'Whether the input is in an error state',
    },
    format: {
      control: 'select',
      options: ['hex', 'rgb', 'hsl'],
      description: 'Color format for display and output',
    },
    showAlpha: {
      control: 'boolean',
      description: 'Show alpha channel slider',
    },
    showPresets: {
      control: 'boolean',
      description: 'Show preset color palette',
    },
    showInput: {
      control: 'boolean',
      description: 'Show color input field',
    },
    showSwatch: {
      control: 'boolean',
      description: 'Show color swatch preview',
    },
    // Disable complex props
    onChange: { table: { disable: true } },
    onBlur: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    presetColors: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
    'aria-label': { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

/**
 * Default color picker with basic configuration
 */
export const Default: Story = {
  args: {
    label: 'Choose Color',
    onChange: action('color-changed'),
    onBlur: action('blurred'),
  },
};

/**
 * Color picker with default color value
 */
export const WithDefaultColor: Story = {
  render: () => (
    <ColorPicker
      label="Brand Color"
      defaultValue="#3B82F6"
      onChange={action('color-changed')}
      onBlur={action('blurred')}
    />
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Color picker with hex format
 */
export const HexFormat: Story = {
  render: () => (
    <ColorPicker
      label="Color (Hex)"
      format="hex"
      defaultValue="#FF5733"
      onChange={action('color-changed')}
      onBlur={action('blurred')}
    />
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Color picker with RGB format
 */
export const RgbFormat: Story = {
  render: () => (
    <ColorPicker
      label="Color (RGB)"
      format="rgb"
      defaultValue="#FF5733"
      onChange={action('color-changed')}
      onBlur={action('blurred')}
    />
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Color picker with HSL format
 */
export const HslFormat: Story = {
  render: () => (
    <ColorPicker
      label="Color (HSL)"
      format="hsl"
      defaultValue="#FF5733"
      onChange={action('color-changed')}
      onBlur={action('blurred')}
    />
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Color picker with alpha channel support
 */
export const WithAlpha: Story = {
  render: () => (
    <ColorPicker
      label="Color with Alpha"
      showAlpha
      defaultValue="#FF5733"
      onChange={action('color-changed')}
      onBlur={action('blurred')}
    />
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Color picker without preset colors
 */
export const NoPresets: Story = {
  render: () => (
    <ColorPicker
      label="Color (No Presets)"
      showPresets={false}
      onChange={action('color-changed')}
      onBlur={action('blurred')}
    />
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Color picker with custom preset colors
 */
export const CustomPresets: Story = {
  render: () => (
    <ColorPicker
      label="Brand Colors"
      showPresets
      presetColors={[
        '#3B82F6', // Blue
        '#10B981', // Green
        '#F59E0B', // Yellow
        '#EF4444', // Red
        '#8B5CF6', // Purple
        '#EC4899', // Pink
        '#06B6D4', // Cyan
        '#F97316', // Orange
      ]}
      onChange={action('color-changed')}
      onBlur={action('blurred')}
    />
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Color picker without input field
 */
export const NoInput: Story = {
  render: () => (
    <ColorPicker
      label="Color Picker"
      showInput={false}
      onChange={action('color-changed')}
      onBlur={action('blurred')}
    />
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Color picker without swatch preview
 */
export const NoSwatch: Story = {
  render: () => (
    <ColorPicker
      label="Color Value"
      showSwatch={false}
      onChange={action('color-changed')}
      onBlur={action('blurred')}
    />
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Color picker with swatch only
 */
export const SwatchOnly: Story = {
  render: () => (
    <ColorPicker
      label="Pick Color"
      showInput={false}
      showSwatch
      onChange={action('color-changed')}
      onBlur={action('blurred')}
    />
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Color picker with helper text
 */
export const WithHelperText: Story = {
  render: () => (
    <ColorPicker
      label="Primary Color"
      helperText="Choose your brand primary color"
      defaultValue="#3B82F6"
      onChange={action('color-changed')}
      onBlur={action('blurred')}
    />
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Color picker with error state
 */
export const WithError: Story = {
  render: () => (
    <ColorPicker
      label="Color"
      error
      errorMessage="Invalid color value"
      onChange={action('color-changed')}
      onBlur={action('blurred')}
    />
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Required color picker
 */
export const Required: Story = {
  render: () => (
    <ColorPicker
      label="Brand Color"
      required
      helperText="This field is required"
      onChange={action('color-changed')}
      onBlur={action('blurred')}
    />
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Disabled color picker
 */
export const Disabled: Story = {
  render: () => (
    <ColorPicker
      label="Color"
      defaultValue="#3B82F6"
      disabled
      onChange={action('color-changed')}
      onBlur={action('blurred')}
    />
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Full-featured color picker with all options enabled
 */
export const FullFeatured: Story = {
  render: () => (
    <ColorPicker
      label="Advanced Color Picker"
      defaultValue="#8B5CF6"
      showAlpha
      showPresets
      showInput
      showSwatch
      helperText="Choose a color using the canvas, sliders, or presets"
      onChange={action('color-changed')}
      onBlur={action('blurred')}
    />
  ),
  parameters: { controls: { disable: true } },
};

/**
 * Interactive playground for testing all ColorPicker props
 */
export const Playground: Story = {
  args: {
    label: 'Color Picker',
    format: 'hex',
    showAlpha: false,
    showPresets: true,
    showInput: true,
    showSwatch: true,
    onChange: action('color-changed'),
    onBlur: action('blurred'),
  },
};
