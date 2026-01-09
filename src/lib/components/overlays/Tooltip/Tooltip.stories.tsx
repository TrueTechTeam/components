import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';
import { Button } from '../../buttons/Button';
import { Icon } from '../../display/Icon';

const meta: Meta<typeof Tooltip> = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: [
        'top',
        'top-left',
        'top-right',
        'bottom',
        'bottom-left',
        'bottom-right',
        'left',
        'right',
      ],
      description: 'Position of tooltip relative to trigger',
    },
    delayShow: {
      control: 'number',
      description: 'Delay before showing tooltip (ms)',
    },
    delayHide: {
      control: 'number',
      description: 'Delay before hiding tooltip (ms)',
    },
    showArrow: {
      control: 'boolean',
      description: 'Show arrow pointing to trigger',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable tooltip',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Tooltip displays helpful text when hovering or focusing an element. Automatically disabled on touch devices.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
      <Tooltip content="This is a helpful tooltip">
        <Button>Hover me</Button>
      </Tooltip>
    </div>
  ),
};

export const Positions: Story = {
  render: () => {
    const positions = [
      'top-left',
      'top',
      'top-right',
      'left',
      null,
      'right',
      'bottom-left',
      'bottom',
      'bottom-right',
    ] as const;

    return (
      <div style={{ padding: '200px', display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 120px)',
            gap: '12px',
          }}
        >
          {positions.map((position, idx) =>
            position ? (
              <Tooltip
                key={position}
                content={`Tooltip ${position}`}
                position={position}
              >
                <Button size="sm" variant="outline" fullWidth>
                  {position}
                </Button>
              </Tooltip>
            ) : (
              <div key={idx} />
            )
          )}
        </div>
      </div>
    );
  },
};

export const WithIcon: Story = {
  render: () => (
    <div style={{ padding: '100px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
      <Tooltip content="Information tooltip">
        <Icon name="info" size={24} />
      </Tooltip>

      <Tooltip content="Help tooltip">
        <Icon name="help" size={24} />
      </Tooltip>

      <Tooltip content="Warning tooltip">
        <Icon name="warning" size={24} />
      </Tooltip>
    </div>
  ),
};

export const LongContent: Story = {
  render: () => (
    <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
      <Tooltip content="This is a much longer tooltip that demonstrates how the tooltip component handles longer text content. It will wrap and respect the max-width constraint.">
        <Button>Hover for long tooltip</Button>
      </Tooltip>
    </div>
  ),
};

export const NoArrow: Story = {
  render: () => (
    <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
      <Tooltip content="Tooltip without arrow" showArrow={false}>
        <Button>No arrow</Button>
      </Tooltip>
    </div>
  ),
};

export const CustomDelay: Story = {
  render: () => (
    <div style={{ padding: '100px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
      <Tooltip content="Fast (no delay)" delayShow={0}>
        <Button>Instant</Button>
      </Tooltip>

      <Tooltip content="Default (200ms delay)" delayShow={200}>
        <Button>Default</Button>
      </Tooltip>

      <Tooltip content="Slow (500ms delay)" delayShow={500}>
        <Button>Slow</Button>
      </Tooltip>

      <Tooltip content="Sticky (500ms hide delay)" delayShow={0} delayHide={500}>
        <Button>Sticky</Button>
      </Tooltip>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
      <Tooltip content="You won't see this" disabled>
        <Button>Disabled tooltip</Button>
      </Tooltip>
    </div>
  ),
};

export const OnText: Story = {
  render: () => (
    <div style={{ padding: '100px', maxWidth: '600px', margin: '0 auto' }}>
      <p style={{ lineHeight: 1.8 }}>
        This is some text with{' '}
        <Tooltip content="This is a tooltip on inline text">
          <span style={{ borderBottom: '1px dashed var(--theme-text-secondary)', cursor: 'help' }}>
            helpful tooltips
          </span>
        </Tooltip>{' '}
        that provide additional{' '}
        <Tooltip content="More information here">
          <span style={{ borderBottom: '1px dashed var(--theme-text-secondary)', cursor: 'help' }}>
            context
          </span>
        </Tooltip>{' '}
        when you hover over certain words.
      </p>
    </div>
  ),
};

export const AllSides: Story = {
  render: () => (
    <div style={{ padding: '200px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Tooltip content="Left tooltip" position="left">
          <Button>Left</Button>
        </Tooltip>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Tooltip content="Top tooltip" position="top">
            <Button>Top</Button>
          </Tooltip>

          <Tooltip content="Bottom tooltip" position="bottom">
            <Button>Bottom</Button>
          </Tooltip>
        </div>

        <Tooltip content="Right tooltip" position="right">
          <Button>Right</Button>
        </Tooltip>
      </div>
    </div>
  ),
};

export const InteractiveContent: Story = {
  render: () => (
    <div style={{ padding: '100px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
      <Tooltip content={<strong>Bold tooltip</strong>}>
        <Button>Rich content</Button>
      </Tooltip>

      <Tooltip
        content={
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Title</div>
            <div style={{ fontSize: '0.875rem' }}>Description text</div>
          </div>
        }
      >
        <Button>Structured content</Button>
      </Tooltip>
    </div>
  ),
};
