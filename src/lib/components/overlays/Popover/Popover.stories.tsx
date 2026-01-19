import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Popover } from './Popover';
import { Button } from '../../buttons/Button';

const meta: Meta<typeof Popover> = {
  title: 'Overlays/Popover',
  component: Popover,
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
      description: 'Position of popover relative to trigger',
    },
    offset: {
      control: 'number',
      description: 'Gap between trigger and popover in pixels',
    },
    allowFlip: {
      control: 'boolean',
      description: 'Allow position to flip if would overflow viewport',
    },
    closeOnClickOutside: {
      control: 'boolean',
      description: 'Close popover when clicking outside',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Close popover when pressing Escape key',
    },
    onOpenChange: { table: { disable: true } },
    onClose: { table: { disable: true } },
    isOpen: { table: { disable: true } },
    trigger: { table: { disable: true } },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Popover is a base component for creating positioned overlays. It handles positioning, portal rendering, and interaction behaviors like click-outside and escape key.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

const PopoverContent = () => (
  <div style={{ padding: '16px', minWidth: '200px' }}>
    <h3 style={{ margin: '0 0 8px 0' }}>Popover Content</h3>
    <p style={{ margin: 0 }}>
      This is the content inside the popover. Click outside or press Escape to close.
    </p>
  </div>
);

const DefaultComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
      <Popover
        trigger={
          <Button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? 'Close' : 'Open'} Popover
          </Button>
        }
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <PopoverContent />
      </Popover>
    </div>
  );
};

export const Default: Story = {
  render: () => <DefaultComponent />,
};

const PositionsComponent = () => {
  const [openPosition, setOpenPosition] = useState<string | null>(null);

  const positions = [
    'top-left',
    'top',
    'top-right',
    'left',
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
          gridTemplateColumns: 'repeat(3, 100px)',
          gap: '8px',
        }}
      >
        {positions.map((position) => (
          <Popover
            key={position}
            trigger={
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setOpenPosition(openPosition === position ? null : position)
                }
              >
                {position}
              </Button>
            }
            isOpen={openPosition === position}
            onOpenChange={(open) => setOpenPosition(open ? position : null)}
            position={position}
          >
            <div style={{ padding: '12px', minWidth: '150px' }}>
              Position: {position}
            </div>
          </Popover>
        ))}
      </div>
    </div>
  );
};

export const Positions: Story = {
  render: () => <PositionsComponent />,
};

const WithOffsetComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
      <Popover
        trigger={
          <Button onClick={() => setIsOpen(!isOpen)}>
            Popover with 24px offset
          </Button>
        }
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        offset={24}
      >
        <PopoverContent />
      </Popover>
    </div>
  );
};

export const WithOffset: Story = {
  render: () => <WithOffsetComponent />,
};

const NoFlipComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ padding: '20px', display: 'flex', justifyContent: 'flex-start' }}>
      <Popover
        trigger={
          <Button onClick={() => setIsOpen(!isOpen)}>
            No flip (stays top even if overflow)
          </Button>
        }
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        position="top"
        allowFlip={false}
      >
        <PopoverContent />
      </Popover>
    </div>
  );
};

export const NoFlip: Story = {
  render: () => <NoFlipComponent />,
};

const CustomStylingComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
      <Popover
        trigger={<Button onClick={() => setIsOpen(!isOpen)}>Custom Styled</Button>}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        style={{
          '--popover-bg': 'var(--theme-primary)',
          '--popover-border': 'var(--theme-primary)',
        } as any}
      >
        <div style={{ padding: '16px', color: 'white' }}>
          Custom styled popover content
        </div>
      </Popover>
    </div>
  );
};

export const CustomStyling: Story = {
  render: () => <CustomStylingComponent />,
};

const NoCloseOnClickOutsideComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
      <Popover
        trigger={
          <Button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? 'Close' : 'Open'} (No click outside close)
          </Button>
        }
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        closeOnClickOutside={false}
      >
        <div style={{ padding: '16px' }}>
          <p>Click outside won't close this popover.</p>
          <p>Press Escape or click the button to close.</p>
        </div>
      </Popover>
    </div>
  );
};

export const NoCloseOnClickOutside: Story = {
  render: () => <NoCloseOnClickOutsideComponent />,
};

const RenderPropTriggerComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
      <Popover
        trigger={({ ref }) => (
          <Button
            ref={ref}
            variant="secondary"
            onClick={() => setIsOpen(!isOpen)}
          >
            Render Prop Trigger
          </Button>
        )}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <PopoverContent />
      </Popover>
    </div>
  );
};

export const RenderPropTrigger: Story = {
  render: () => <RenderPropTriggerComponent />,
};
