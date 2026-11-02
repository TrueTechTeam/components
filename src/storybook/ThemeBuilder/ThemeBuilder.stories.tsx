import type { Meta, StoryObj } from '@storybook/react';
import { ThemeBuilder } from './ThemeBuilder';

const meta: Meta<typeof ThemeBuilder> = {
  title: 'Theme Builder',
  component: ThemeBuilder,
  tags: ['!autodocs'],
  parameters: {
    layout: 'fullscreen',
    // The builder themes its own preview; the toolbar theme decorators would only fight it.
    globalDecorators: 'provider',
  },
};
export default meta;

type Story = StoryObj<typeof ThemeBuilder>;

export const Default: Story = {
  render: () => <ThemeBuilder />,
};
