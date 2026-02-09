import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { useArgs } from 'storybook/preview-api';
import { useState } from 'react';
import { Collapse, type CollapseProps } from './Collapse';
import { Button } from '../../buttons/Button';
import { Icon } from '../Icon';
import { Slider } from '../../inputs/Slider';
import { Select } from '../../inputs/Select';

const meta: Meta<typeof Collapse> = {
  title: 'Display/Collapse',
  component: Collapse,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Collapse component for smooth expand/collapse animations.

The Collapse component provides smooth height animation when expanding or collapsing its children content. It supports customizable animation durations and easing functions, and can optionally unmount content when collapsed to save DOM resources.

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
<td><code>--collapse-duration</code></td>
<td><code>250ms</code></td>
<td>Duration of expand/collapse animation</td>
</tr>
<tr>
<td><code>--collapse-easing</code></td>
<td><code>ease-in-out</code></td>
<td>Easing function for animation</td>
</tr>
</tbody>
</table>
`,
      },
    },
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the content is expanded',
    },
    duration: {
      control: { type: 'number', min: 0, max: 1000, step: 50 },
      description: 'Animation duration in milliseconds',
    },
    easing: {
      control: 'select',
      options: ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'],
      description: 'Easing function for animation',
    },
    unmountOnCollapse: {
      control: 'boolean',
      description: 'Whether to unmount children when collapsed',
    },
    children: { table: { disable: true } },
    onExpandStart: { table: { disable: true } },
    onExpandEnd: { table: { disable: true } },
    onCollapseStart: { table: { disable: true } },
    onCollapseEnd: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
    'aria-label': { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Collapse>;

const SampleContent = () => (
  <div
    style={{
      padding: '16px',
      backgroundColor: 'var(--theme-surface-secondary, #f5f5f5)',
      borderRadius: '8px',
    }}
  >
    <p style={{ margin: '0 0 8px 0' }}>
      This is the collapsible content. It can contain any React nodes including text, images, forms,
      or other components.
    </p>
    <p style={{ margin: '0' }}>
      The Collapse component provides smooth height animation when expanding or collapsing.
    </p>
  </div>
);

const ControlledComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Button onClick={() => setIsOpen(!isOpen)} variant="primary">
        {isOpen ? 'Collapse' : 'Expand'}
      </Button>
      <Collapse isOpen={isOpen}>
        <SampleContent />
      </Collapse>
    </div>
  );
};

export const Default: Story = {
  render: () => <ControlledComponent />,
  parameters: {
    controls: { disable: true },
  },
};

export const InitiallyOpen: Story = {
  args: {
    isOpen: true,
    children: <SampleContent />,
    onExpandStart: action('onExpandStart'),
    onExpandEnd: action('onExpandEnd'),
    onCollapseStart: action('onCollapseStart'),
    onCollapseEnd: action('onCollapseEnd'),
  },
  render: function Render(args) {
    const [{ isOpen }, updateArgs] = useArgs<CollapseProps>();
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Button onClick={() => updateArgs({ isOpen: !isOpen })} variant="primary">
          {isOpen ? 'Collapse' : 'Expand'}
        </Button>
        <Collapse {...args} isOpen={isOpen} />
      </div>
    );
  },
};

export const InitiallyClosed: Story = {
  args: {
    isOpen: false,
    children: <SampleContent />,
    onExpandStart: action('onExpandStart'),
    onExpandEnd: action('onExpandEnd'),
    onCollapseStart: action('onCollapseStart'),
    onCollapseEnd: action('onCollapseEnd'),
  },
  render: function Render(args) {
    const [{ isOpen }, updateArgs] = useArgs<CollapseProps>();
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Button onClick={() => updateArgs({ isOpen: !isOpen })} variant="primary">
          {isOpen ? 'Collapse' : 'Expand'}
        </Button>
        <Collapse {...args} isOpen={isOpen} />
      </div>
    );
  },
};

const DurationComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [duration, setDuration] = useState(250);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Slider
        label="Duration"
        min={100}
        max={1000}
        step={50}
        value={duration}
        onChange={(value) => setDuration(value as number)}
        showValue
        valueLabelFormat={(val) => `${val}ms`}
      />
      <Button onClick={() => setIsOpen(!isOpen)} variant="primary">
        {isOpen ? 'Collapse' : 'Expand'}
      </Button>
      <Collapse isOpen={isOpen} duration={duration}>
        <SampleContent />
      </Collapse>
    </div>
  );
};

export const CustomDuration: Story = {
  render: () => <DurationComponent />,
  parameters: {
    controls: { disable: true },
  },
};

const EasingComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const easingOptions = [
    { value: 'linear', label: 'linear' },
    { value: 'ease', label: 'ease' },
    { value: 'ease-in', label: 'ease-in' },
    { value: 'ease-out', label: 'ease-out' },
    { value: 'ease-in-out', label: 'ease-in-out' },
  ];
  const [easing, setEasing] = useState('ease-in-out');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Select
        label="Easing"
        options={easingOptions}
        value={easing}
        onChange={(value) => setEasing(value)}
      />
      <Button onClick={() => setIsOpen(!isOpen)} variant="primary">
        {isOpen ? 'Collapse' : 'Expand'}
      </Button>
      <Collapse isOpen={isOpen} easing={easing} duration={500}>
        <SampleContent />
      </Collapse>
    </div>
  );
};

export const CustomEasing: Story = {
  render: () => <EasingComponent />,
  parameters: {
    controls: { disable: true },
  },
};

const CallbacksComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('Closed');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Button onClick={() => setIsOpen(!isOpen)} variant="primary">
          {isOpen ? 'Collapse' : 'Expand'}
        </Button>
        <span>
          Status: <strong>{status}</strong>
        </span>
      </div>
      <Collapse
        isOpen={isOpen}
        onExpandStart={() => {
          setStatus('Expanding...');
          action('onExpandStart')();
        }}
        onExpandEnd={() => {
          setStatus('Open');
          action('onExpandEnd')();
        }}
        onCollapseStart={() => {
          setStatus('Collapsing...');
          action('onCollapseStart')();
        }}
        onCollapseEnd={() => {
          setStatus('Closed');
          action('onCollapseEnd')();
        }}
      >
        <SampleContent />
      </Collapse>
    </div>
  );
};

export const WithCallbacks: Story = {
  render: () => <CallbacksComponent />,
  parameters: {
    controls: { disable: true },
  },
};

const UnmountComponent = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [mountCount, setMountCount] = useState(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Button onClick={() => setIsOpen(!isOpen)} variant="primary">
          {isOpen ? 'Collapse' : 'Expand'}
        </Button>
        <span>
          Content mount count: <strong>{mountCount}</strong>
        </span>
      </div>
      <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
        With <code>unmountOnCollapse</code>, the content is removed from the DOM when collapsed.
        Watch the mount count increase each time you expand.
      </p>
      <Collapse isOpen={isOpen} unmountOnCollapse onExpandStart={() => setMountCount((c) => c + 1)}>
        <SampleContent />
      </Collapse>
    </div>
  );
};

export const UnmountOnCollapse: Story = {
  render: () => <UnmountComponent />,
  parameters: {
    controls: { disable: true },
  },
};

const MultipleComponent = () => {
  const [openStates, setOpenStates] = useState([true, false, false]);

  const toggleSection = (index: number) => {
    const newStates = [...openStates];
    newStates[index] = !newStates[index];
    setOpenStates(newStates);
  };

  const sections = [
    { title: 'Section 1', content: 'Content for section 1. This section starts open.' },
    { title: 'Section 2', content: 'Content for section 2. Click the button to expand.' },
    {
      title: 'Section 3',
      content: 'Content for section 3. Multiple sections can be open at once.',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {sections.map((section, index) => (
        <div
          key={index}
          style={{
            border: '1px solid var(--theme-border-primary, #e0e0e0)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <Button
            onClick={() => toggleSection(index)}
            variant="ghost"
            fullWidth
            style={{
              justifyContent: 'space-between',
              borderRadius: 0,
            }}
          >
            {section.title}
            <Icon
              name="chevron-down"
              size="sm"
              style={{
                transform: openStates[index] ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 250ms ease-in-out',
              }}
            />
          </Button>
          <Collapse isOpen={openStates[index]}>
            <div style={{ padding: '0 16px 16px 16px' }}>
              <p style={{ margin: 0 }}>{section.content}</p>
            </div>
          </Collapse>
        </div>
      ))}
    </div>
  );
};

export const MultipleSections: Story = {
  render: () => <MultipleComponent />,
  parameters: {
    controls: { disable: true },
  },
};

const NestedComponent = () => {
  const [outerOpen, setOuterOpen] = useState(true);
  const [innerOpen, setInnerOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Button onClick={() => setOuterOpen(!outerOpen)} variant="primary">
        {outerOpen ? 'Collapse Outer' : 'Expand Outer'}
      </Button>
      <Collapse isOpen={outerOpen}>
        <div
          style={{
            padding: '16px',
            backgroundColor: 'var(--theme-surface-secondary, #f5f5f5)',
            borderRadius: '8px',
          }}
        >
          <p style={{ margin: '0 0 16px 0' }}>This is the outer collapsible content.</p>
          <Button onClick={() => setInnerOpen(!innerOpen)} variant="secondary" size="sm">
            {innerOpen ? 'Collapse Inner' : 'Expand Inner'}
          </Button>
          <Collapse isOpen={innerOpen}>
            <div
              style={{
                marginTop: '16px',
                padding: '16px',
                backgroundColor: 'var(--theme-surface-primary, #fff)',
                borderRadius: '8px',
                border: '1px solid var(--theme-border-primary, #e0e0e0)',
              }}
            >
              <p style={{ margin: 0 }}>This is the nested inner collapsible content.</p>
            </div>
          </Collapse>
        </div>
      </Collapse>
    </div>
  );
};

export const NestedCollapse: Story = {
  render: () => <NestedComponent />,
  parameters: {
    controls: { disable: true },
  },
};

export const Playground: Story = {
  args: {
    isOpen: true,
    duration: 250,
    easing: 'ease-in-out',
    unmountOnCollapse: false,
    children: <SampleContent />,
    onExpandStart: action('onExpandStart'),
    onExpandEnd: action('onExpandEnd'),
    onCollapseStart: action('onCollapseStart'),
    onCollapseEnd: action('onCollapseEnd'),
  },
  render: function Render(args) {
    const [{ isOpen }, updateArgs] = useArgs<CollapseProps>();
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Button onClick={() => updateArgs({ isOpen: !isOpen })} variant="primary">
          {isOpen ? 'Collapse' : 'Expand'}
        </Button>
        <Collapse {...args} isOpen={isOpen} />
      </div>
    );
  },
};
