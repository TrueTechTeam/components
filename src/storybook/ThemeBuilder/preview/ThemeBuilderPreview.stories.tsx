import type { Meta, StoryObj } from '@storybook/react';
import { PreviewApp } from './PreviewApp';

/**
 * Internal: rendered inside the Theme Builder's iframe (see PreviewFrame). Hidden from the
 * sidebar, docs and test runner.
 */
const meta: Meta<typeof PreviewApp> = {
  title: 'Theme Builder/Internal Preview',
  component: PreviewApp,
  tags: ['!dev', '!autodocs', '!test'],
  parameters: {
    layout: 'fullscreen',
    globalDecorators: 'none',
  },
};
export default meta;

type Story = StoryObj<typeof PreviewApp>;

export const Default: Story = {};
