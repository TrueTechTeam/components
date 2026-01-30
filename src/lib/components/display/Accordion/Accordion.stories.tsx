import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';
import { Accordion } from './Accordion';
import { Icon } from '../../display/Icon';
import { Button } from '../../buttons/Button';

const meta: Meta<typeof Accordion> = {
  title: 'Display/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    header: {
      control: 'text',
      description: 'Header content (can be string or ReactNode)',
    },
    iconPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Position of the expand/collapse icon',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Accordion size variant',
    },
    bordered: {
      control: 'boolean',
      description: 'Whether to show border around the accordion',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the accordion is disabled',
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Default expanded state (uncontrolled)',
    },
    animationDuration: {
      control: { type: 'number', min: 0, max: 1000, step: 50 },
      description: 'Animation duration in milliseconds',
    },
    unmountOnCollapse: {
      control: 'boolean',
      description: 'Whether to unmount body content when collapsed',
    },
    isOpen: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
    onHeaderClick: { table: { disable: true } },
    expandIcon: { table: { disable: true } },
    collapseIcon: { table: { disable: true } },
    headerIcon: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    id: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
    'aria-label': { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const SampleContent = () => (
  <div>
    <p style={{ margin: '0 0 12px 0' }}>
      This is the accordion content. It can contain any React nodes including text, images, forms,
      or other components.
    </p>
    <p style={{ margin: 0 }}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua.
    </p>
  </div>
);

export const Default: Story = {
  args: {
    header: 'Click to expand',
    children: <SampleContent />,
    onOpenChange: action('onOpenChange'),
  },
};

export const DefaultOpen: Story = {
  args: {
    header: 'This accordion starts open',
    defaultOpen: true,
    children: <SampleContent />,
  },
};

const ControlledComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)}>
          Toggle from outside: {isOpen ? 'Close' : 'Open'}
        </Button>
        <span>State: {isOpen ? 'Open' : 'Closed'}</span>
      </div>
      <Accordion header="Controlled Accordion" isOpen={isOpen} onOpenChange={setIsOpen}>
        <SampleContent />
      </Accordion>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledComponent />,
  parameters: {
    controls: { disable: true },
  },
};

export const IconPositions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Accordion header="Icon on right (default)" iconPosition="right">
        <SampleContent />
      </Accordion>
      <Accordion header="Icon on left" iconPosition="left">
        <SampleContent />
      </Accordion>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Accordion header="Small size" size="sm" defaultOpen>
        <p style={{ margin: 0 }}>Content for small accordion.</p>
      </Accordion>
      <Accordion header="Medium size (default)" size="md" defaultOpen>
        <p style={{ margin: 0 }}>Content for medium accordion.</p>
      </Accordion>
      <Accordion header="Large size" size="lg" defaultOpen>
        <p style={{ margin: 0 }}>Content for large accordion.</p>
      </Accordion>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Bordered: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Accordion header="With border (default)" bordered defaultOpen>
        <SampleContent />
      </Accordion>
      <Accordion header="Without border" bordered={false} defaultOpen>
        <SampleContent />
      </Accordion>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const DisabledState: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Accordion header="Disabled (closed)" disabled>
        <SampleContent />
      </Accordion>
      <Accordion header="Disabled (open)" disabled defaultOpen>
        <SampleContent />
      </Accordion>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const CustomIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Accordion header="Using plus/minus icons" expandIcon="plus" collapseIcon="minus">
        <SampleContent />
      </Accordion>
      <Accordion
        header="Using chevron-right (rotates)"
        expandIcon="chevron-right"
        iconPosition="left"
      >
        <SampleContent />
      </Accordion>
      <Accordion
        header="Custom ReactNode icon"
        expandIcon={<Icon name="plus" size="sm" />}
        collapseIcon={<Icon name="minus" size="sm" />}
      >
        <SampleContent />
      </Accordion>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const WithHeaderIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Accordion header="Settings" headerIcon="settings" defaultOpen>
        <p style={{ margin: 0 }}>Application settings content here.</p>
      </Accordion>
      <Accordion header="User Profile" headerIcon="user">
        <p style={{ margin: 0 }}>User profile information here.</p>
      </Accordion>
      <Accordion header="Notifications" headerIcon="bell">
        <p style={{ margin: 0 }}>Notification preferences here.</p>
      </Accordion>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const ReactNodeHeader: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Accordion
        header={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="info" size={20} />
            <span>
              <strong>Important Information</strong>
              <br />
              <span style={{ fontSize: '12px', color: '#666' }}>Click to learn more</span>
            </span>
          </div>
        }
      >
        <SampleContent />
      </Accordion>
      <Accordion
        header={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <span>Order #12345</span>
            <span
              style={{
                backgroundColor: '#e8f5e9',
                color: '#2e7d32',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            >
              Completed
            </span>
          </div>
        }
        iconPosition="left"
      >
        <p style={{ margin: 0 }}>Order details would go here.</p>
      </Accordion>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const CustomAnimation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Accordion header="Fast animation (100ms)" animationDuration={100}>
        <SampleContent />
      </Accordion>
      <Accordion header="Default animation (250ms)" animationDuration={250}>
        <SampleContent />
      </Accordion>
      <Accordion header="Slow animation (500ms)" animationDuration={500}>
        <SampleContent />
      </Accordion>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

const MultipleAccordionsComponent = () => {
  const items = [
    { id: '1', title: 'Section 1', content: 'Content for section 1' },
    { id: '2', title: 'Section 2', content: 'Content for section 2' },
    { id: '3', title: 'Section 3', content: 'Content for section 3' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {items.map((item) => (
        <Accordion key={item.id} header={item.title}>
          <p style={{ margin: 0 }}>{item.content}</p>
        </Accordion>
      ))}
    </div>
  );
};

export const MultipleAccordions: Story = {
  render: () => <MultipleAccordionsComponent />,
  parameters: {
    controls: { disable: true },
  },
};

const NestedAccordionsComponent = () => (
  <Accordion header="Parent Accordion" defaultOpen>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <p style={{ margin: '0 0 12px 0' }}>Parent content with nested accordions:</p>
      <Accordion header="Nested Accordion 1" size="sm">
        <p style={{ margin: 0 }}>Nested content 1</p>
      </Accordion>
      <Accordion header="Nested Accordion 2" size="sm">
        <p style={{ margin: 0 }}>Nested content 2</p>
      </Accordion>
    </div>
  </Accordion>
);

export const NestedAccordions: Story = {
  render: () => <NestedAccordionsComponent />,
  parameters: {
    controls: { disable: true },
  },
};

export const CustomStyling: Story = {
  render: () => (
    <Accordion
      header="Custom Styled Accordion"
      style={
        {
          '--accordion-border-color': '#6366f1',
          '--accordion-header-bg-hover': 'rgba(99, 102, 241, 0.1)',
          '--accordion-icon-color': '#6366f1',
        } as React.CSSProperties
      }
      defaultOpen
    >
      <p style={{ margin: 0 }}>This accordion uses CSS custom properties for custom styling.</p>
    </Accordion>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Playground: Story = {
  args: {
    header: 'Playground Accordion',
    children: <SampleContent />,
    iconPosition: 'right',
    size: 'md',
    bordered: true,
    disabled: false,
    defaultOpen: false,
    animationDuration: 250,
    unmountOnCollapse: false,
    onOpenChange: action('onOpenChange'),
    onHeaderClick: action('onHeaderClick'),
  },
};
