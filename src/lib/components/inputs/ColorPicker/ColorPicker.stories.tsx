import type { Meta, StoryObj } from '@storybook/react';
import { ColorPicker } from './ColorPicker';

const meta: Meta<typeof ColorPicker> = {
  title: 'Forms/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const Default: Story = {
  args: {
    label: 'Choose Color',
  },
};

export const WithDefaultColor: Story = {
  args: {
    label: 'Brand Color',
    defaultValue: '#3B82F6',
  },
};

export const HexFormat: Story = {
  args: {
    label: 'Color (Hex)',
    format: 'hex',
    defaultValue: '#FF5733',
  },
};

export const RgbFormat: Story = {
  args: {
    label: 'Color (RGB)',
    format: 'rgb',
    defaultValue: '#FF5733',
  },
};

export const HslFormat: Story = {
  args: {
    label: 'Color (HSL)',
    format: 'hsl',
    defaultValue: '#FF5733',
  },
};

export const WithAlpha: Story = {
  args: {
    label: 'Color with Alpha',
    showAlpha: true,
    defaultValue: '#FF5733',
  },
};

export const NoPresets: Story = {
  args: {
    label: 'Color (No Presets)',
    showPresets: false,
  },
};

export const CustomPresets: Story = {
  args: {
    label: 'Brand Colors',
    showPresets: true,
    presetColors: [
      '#3B82F6', // Blue
      '#10B981', // Green
      '#F59E0B', // Yellow
      '#EF4444', // Red
      '#8B5CF6', // Purple
      '#EC4899', // Pink
      '#06B6D4', // Cyan
      '#F97316', // Orange
    ],
  },
};

export const NoInput: Story = {
  args: {
    label: 'Color Picker',
    showInput: false,
  },
};

export const NoSwatch: Story = {
  args: {
    label: 'Color Value',
    showSwatch: false,
  },
};

export const SwatchOnly: Story = {
  args: {
    label: 'Pick Color',
    showInput: false,
    showSwatch: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Primary Color',
    helperText: 'Choose your brand primary color',
    defaultValue: '#3B82F6',
  },
};

export const WithError: Story = {
  args: {
    label: 'Color',
    error: true,
    errorMessage: 'Invalid color value',
  },
};

export const Required: Story = {
  args: {
    label: 'Brand Color',
    required: true,
    helperText: 'This field is required',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Color',
    defaultValue: '#3B82F6',
    disabled: true,
  },
};

export const FullFeatured: Story = {
  args: {
    label: 'Advanced Color Picker',
    defaultValue: '#8B5CF6',
    showAlpha: true,
    showPresets: true,
    showInput: true,
    showSwatch: true,
    helperText: 'Choose a color using the canvas, sliders, or presets',
  },
};

export const Playground: Story = {
  args: {
    label: 'Color Picker',
    format: 'hex',
    showAlpha: false,
    showPresets: true,
    showInput: true,
    showSwatch: true,
  },
};
