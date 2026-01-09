import type { Meta, StoryObj } from '@storybook/react';
import { Portal } from './Portal';

const meta: Meta<typeof Portal> = {
  title: 'Overlays/Portal',
  component: Portal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Portal component renders children into a DOM node outside the parent component hierarchy. Useful for modals, tooltips, and other overlay components.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Portal>;

export const Default: Story = {
  args: {
    children: (
      <div
        style={{
          padding: '16px',
          background: 'var(--theme-surface-elevated)',
          border: '1px solid var(--theme-border-primary)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--theme-shadow-lg)',
        }}
      >
        This content is rendered in a portal
      </div>
    ),
  },
};

export const CustomContainer: Story = {
  args: {
    containerId: 'custom-portal-container',
    children: (
      <div
        style={{
          padding: '16px',
          background: 'var(--theme-primary)',
          color: 'var(--theme-text-on-primary)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        This is in a custom portal container
      </div>
    ),
  },
};

export const MultiplePortals: Story = {
  render: () => (
    <>
      <Portal>
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            padding: '12px',
            background: 'var(--theme-success)',
            color: 'white',
            borderRadius: 'var(--radius-md)',
          }}
        >
          Portal 1
        </div>
      </Portal>
      <Portal>
        <div
          style={{
            position: 'fixed',
            top: '60px',
            left: '20px',
            padding: '12px',
            background: 'var(--theme-info)',
            color: 'white',
            borderRadius: 'var(--radius-md)',
          }}
        >
          Portal 2
        </div>
      </Portal>
      <Portal>
        <div
          style={{
            position: 'fixed',
            top: '100px',
            left: '20px',
            padding: '12px',
            background: 'var(--theme-warning)',
            color: 'white',
            borderRadius: 'var(--radius-md)',
          }}
        >
          Portal 3
        </div>
      </Portal>
    </>
  ),
};
