import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';
import { AccordionContainer } from './AccordionContainer';
import { Accordion } from './Accordion';
import { Button } from '../../buttons/Button';
import { Input } from '../../inputs/Input';
import { Checkbox } from '../../inputs/Checkbox';

const meta: Meta<typeof AccordionContainer> = {
  title: 'Display/AccordionContainer',
  component: AccordionContainer,
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'multiple'],
      description: 'Mode for accordion expansion',
    },
    showExpandAllControls: {
      control: 'boolean',
      description: 'Whether to show expand all / collapse all controls',
    },
    controlsPosition: {
      control: 'select',
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      description: 'Position of expand/collapse all controls',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant for all accordions',
    },
    gap: {
      control: { type: 'number', min: 0, max: 32, step: 4 },
      description: 'Gap between accordions in pixels',
    },
    bordered: {
      control: 'boolean',
      description: 'Whether accordions should be bordered',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether to disable all accordions',
    },
    expandedIds: { table: { disable: true } },
    defaultExpandedIds: { table: { disable: true } },
    onExpandedChange: { table: { disable: true } },
    expandAllLabel: { table: { disable: true } },
    collapseAllLabel: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
    'aria-label': { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof AccordionContainer>;

const SampleAccordions = () => (
  <>
    <Accordion id="section1" header="Section 1: Getting Started">
      <p style={{ margin: 0 }}>
        Welcome to the getting started guide. This section covers the basics of setting up your
        environment and understanding the fundamental concepts.
      </p>
    </Accordion>
    <Accordion id="section2" header="Section 2: Configuration">
      <p style={{ margin: 0 }}>
        Learn how to configure the application to suit your needs. We cover all the available
        options and best practices for optimal performance.
      </p>
    </Accordion>
    <Accordion id="section3" header="Section 3: Advanced Topics">
      <p style={{ margin: 0 }}>
        Dive deep into advanced topics including customization, integrations, and optimization
        techniques for power users.
      </p>
    </Accordion>
  </>
);

export const Default: Story = {
  render: () => (
    <AccordionContainer onExpandedChange={action('onExpandedChange')}>
      <SampleAccordions />
    </AccordionContainer>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const WithExpandAllControls: Story = {
  render: () => (
    <AccordionContainer showExpandAllControls onExpandedChange={action('onExpandedChange')}>
      <Accordion id="section1" header="Section 1: Getting Started">
        <p style={{ margin: 0 }}>
          Welcome to the getting started guide. This section covers the basics of setting up your
          environment and understanding the fundamental concepts.
        </p>
      </Accordion>
      <Accordion id="section2" header="Section 2: Configuration">
        <p style={{ margin: 0 }}>
          Learn how to configure the application to suit your needs. We cover all the available
          options and best practices for optimal performance.
        </p>
      </Accordion>
      <Accordion id="section3" header="Section 3: Advanced Topics">
        <p style={{ margin: 0 }}>
          Dive deep into advanced topics including customization, integrations, and optimization
          techniques for power users.
        </p>
      </Accordion>
    </AccordionContainer>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const SingleMode: Story = {
  render: () => (
    <AccordionContainer mode="single" onExpandedChange={action('onExpandedChange')}>
      <SampleAccordions />
    </AccordionContainer>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'In single mode, only one accordion can be open at a time. Opening a new accordion automatically closes the previously open one.',
      },
    },
  },
};

export const MultipleMode: Story = {
  render: () => (
    <AccordionContainer mode="multiple" onExpandedChange={action('onExpandedChange')}>
      <SampleAccordions />
    </AccordionContainer>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'In multiple mode (default), any number of accordions can be open simultaneously. Users can expand or collapse each accordion independently.',
      },
    },
  },
};

export const DefaultExpanded: Story = {
  render: () => (
    <AccordionContainer
      defaultExpandedIds={['section1', 'section3']}
      onExpandedChange={action('onExpandedChange')}
    >
      <SampleAccordions />
    </AccordionContainer>
  ),
  parameters: {
    controls: { disable: true },
  },
};

const ControlledComponent = () => {
  const [expandedIds, setExpandedIds] = useState<string[]>(['section1']);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button variant="outline" size="sm" onClick={() => setExpandedIds([])}>
          Close All
        </Button>
        <Button variant="outline" size="sm" onClick={() => setExpandedIds(['section1'])}>
          Open Section 1
        </Button>
        <Button variant="outline" size="sm" onClick={() => setExpandedIds(['section2'])}>
          Open Section 2
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpandedIds(['section1', 'section2', 'section3'])}
        >
          Open All
        </Button>
      </div>
      <p style={{ margin: 0 }}>Currently open: {expandedIds.join(', ') || 'none'}</p>
      <AccordionContainer expandedIds={expandedIds} onExpandedChange={setExpandedIds}>
        <SampleAccordions />
      </AccordionContainer>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledComponent />,
  parameters: {
    controls: { disable: true },
  },
};

export const ControlsPositions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '800px' }}>
      <div>
        <h4 style={{ margin: '0 0 8px 0' }}>Top Right (default)</h4>
        <AccordionContainer showExpandAllControls controlsPosition="top-right">
          <Accordion id="a1" header="Section 1">
            Content 1
          </Accordion>
          <Accordion id="a2" header="Section 2">
            Content 2
          </Accordion>
        </AccordionContainer>
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px 0' }}>Top Left</h4>
        <AccordionContainer showExpandAllControls controlsPosition="top-left">
          <Accordion id="b1" header="Section 1">
            Content 1
          </Accordion>
          <Accordion id="b2" header="Section 2">
            Content 2
          </Accordion>
        </AccordionContainer>
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px 0' }}>Bottom Right</h4>
        <AccordionContainer showExpandAllControls controlsPosition="bottom-right">
          <Accordion id="c1" header="Section 1">
            Content 1
          </Accordion>
          <Accordion id="c2" header="Section 2">
            Content 2
          </Accordion>
        </AccordionContainer>
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px 0' }}>Bottom Left</h4>
        <AccordionContainer showExpandAllControls controlsPosition="bottom-left">
          <Accordion id="d1" header="Section 1">
            Content 1
          </Accordion>
          <Accordion id="d2" header="Section 2">
            Content 2
          </Accordion>
        </AccordionContainer>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const CustomLabels: Story = {
  render: () => (
    <AccordionContainer
      showExpandAllControls
      expandAllLabel="Open All Sections"
      collapseAllLabel="Close All Sections"
    >
      <SampleAccordions />
    </AccordionContainer>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h4 style={{ margin: '0 0 8px 0' }}>Small</h4>
        <AccordionContainer size="sm">
          <Accordion id="sm1" header="Small Section 1">
            Small content
          </Accordion>
          <Accordion id="sm2" header="Small Section 2">
            Small content
          </Accordion>
        </AccordionContainer>
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px 0' }}>Medium (default)</h4>
        <AccordionContainer size="md">
          <Accordion id="md1" header="Medium Section 1">
            Medium content
          </Accordion>
          <Accordion id="md2" header="Medium Section 2">
            Medium content
          </Accordion>
        </AccordionContainer>
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px 0' }}>Large</h4>
        <AccordionContainer size="lg">
          <Accordion id="lg1" header="Large Section 1">
            Large content
          </Accordion>
          <Accordion id="lg2" header="Large Section 2">
            Large content
          </Accordion>
        </AccordionContainer>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const WithGap: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h4 style={{ margin: '0 0 8px 0' }}>No gap (default)</h4>
        <AccordionContainer gap={0}>
          <Accordion id="g0-1" header="Section 1">
            Content
          </Accordion>
          <Accordion id="g0-2" header="Section 2">
            Content
          </Accordion>
        </AccordionContainer>
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px 0' }}>8px gap</h4>
        <AccordionContainer gap={8}>
          <Accordion id="g8-1" header="Section 1">
            Content
          </Accordion>
          <Accordion id="g8-2" header="Section 2">
            Content
          </Accordion>
        </AccordionContainer>
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px 0' }}>16px gap</h4>
        <AccordionContainer gap={16}>
          <Accordion id="g16-1" header="Section 1">
            Content
          </Accordion>
          <Accordion id="g16-2" header="Section 2">
            Content
          </Accordion>
        </AccordionContainer>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Bordered: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h4 style={{ margin: '0 0 8px 0' }}>With borders (default)</h4>
        <AccordionContainer bordered gap={8}>
          <Accordion id="b1" header="Bordered Section 1">
            Content
          </Accordion>
          <Accordion id="b2" header="Bordered Section 2">
            Content
          </Accordion>
        </AccordionContainer>
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px 0' }}>Without borders</h4>
        <AccordionContainer bordered={false} gap={8}>
          <Accordion id="nb1" header="Borderless Section 1">
            Content
          </Accordion>
          <Accordion id="nb2" header="Borderless Section 2">
            Content
          </Accordion>
        </AccordionContainer>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const DisabledState: Story = {
  render: () => (
    <AccordionContainer disabled showExpandAllControls defaultExpandedIds={['d1']}>
      <Accordion id="d1" header="Disabled Section 1">
        This section is open but the container is disabled.
      </Accordion>
      <Accordion id="d2" header="Disabled Section 2">
        Content
      </Accordion>
    </AccordionContainer>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const FAQExample: Story = {
  render: () => (
    <AccordionContainer mode="single" gap={8}>
      <Accordion id="faq1" header="What is your return policy?">
        <p style={{ margin: 0 }}>
          We offer a 30-day money-back guarantee on all purchases. If you're not satisfied with your
          purchase, you can return it within 30 days for a full refund.
        </p>
      </Accordion>
      <Accordion id="faq2" header="How long does shipping take?">
        <p style={{ margin: 0 }}>
          Standard shipping typically takes 5-7 business days. Express shipping options are
          available for faster delivery, usually within 2-3 business days.
        </p>
      </Accordion>
      <Accordion id="faq3" header="Do you ship internationally?">
        <p style={{ margin: 0 }}>
          Yes, we ship to over 100 countries worldwide. International shipping times vary depending
          on the destination, typically ranging from 7-21 business days.
        </p>
      </Accordion>
      <Accordion id="faq4" header="How can I track my order?">
        <p style={{ margin: 0 }}>
          Once your order ships, you'll receive a confirmation email with a tracking number. You can
          use this number to track your package on our website or the carrier's site.
        </p>
      </Accordion>
    </AccordionContainer>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const SettingsExample: Story = {
  render: () => (
    <AccordionContainer showExpandAllControls gap={8}>
      <Accordion id="account" header="Account Settings" headerIcon="user">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Input label="Username" defaultValue="johndoe" style={{ width: '200px' }} />
          <Input
            label="Email"
            type="email"
            defaultValue="john@example.com"
            style={{ width: '200px' }}
          />
        </div>
      </Accordion>
      <Accordion id="notifications" header="Notification Preferences" headerIcon="bell">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Checkbox label="Email notifications" defaultChecked />
          <Checkbox label="SMS notifications" />
          <Checkbox label="Push notifications" defaultChecked />
        </div>
      </Accordion>
      <Accordion id="privacy" header="Privacy Settings" headerIcon="lock">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Checkbox label="Make profile public" defaultChecked />
          <Checkbox label="Allow search engines to index" />
        </div>
      </Accordion>
    </AccordionContainer>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Playground: Story = {
  args: {
    mode: 'multiple',
    showExpandAllControls: true,
    controlsPosition: 'top-right',
    size: 'md',
    gap: 8,
    bordered: true,
    disabled: false,
    children: <SampleAccordions />,
    onExpandedChange: action('onExpandedChange'),
  },
};
