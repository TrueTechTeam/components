import type { Meta, StoryObj } from '@storybook/react';
import { ResponsiveStack } from './ResponsiveStack';
import { Button } from '../../buttons/Button';
import { Card } from '../../display/Card';
import { Badge } from '../../display/Badge';
import { Input } from '../../inputs/Input';
import { Avatar } from '../../display/Avatar';

const meta: Meta<typeof ResponsiveStack> = {
  title: 'Layout/ResponsiveStack',
  component: ResponsiveStack,
  tags: ['autodocs'],
  argTypes: {
    breakpoint: {
      control: { type: 'number', min: 100, max: 1200 },
    },
    direction: {
      control: 'select',
      options: ['row', 'row-reverse', 'column', 'column-reverse'],
    },
    collapseDirection: {
      control: 'select',
      options: ['row', 'row-reverse', 'column', 'column-reverse'],
    },
    gap: {
      control: { type: 'number', min: 0, max: 48 },
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'space-between', 'space-around', 'space-evenly'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ResponsiveStack>;

/**
 * Default responsive stack that switches from row to column at 600px
 */
export const Default: Story = {
  args: {
    breakpoint: 600,
    gap: 16,
  },
  render: (args) => (
    <div
      style={{
        resize: 'horizontal',
        overflow: 'auto',
        border: '2px dashed var(--theme-border-primary)',
        padding: 16,
        minWidth: 200,
        width: 700,
      }}
    >
      <p style={{ margin: '0 0 16px', color: 'var(--theme-text-secondary)' }}>
        Resize to see layout change at {args.breakpoint}px:
      </p>
      <ResponsiveStack {...args}>
        <Card variant="filled" padding="md">
          <div style={{ minWidth: 100 }}>Card 1</div>
        </Card>
        <Card variant="filled" padding="md">
          <div style={{ minWidth: 100 }}>Card 2</div>
        </Card>
        <Card variant="filled" padding="md">
          <div style={{ minWidth: 100 }}>Card 3</div>
        </Card>
      </ResponsiveStack>
    </div>
  ),
};

/**
 * Form layout that stacks on narrow screens using Input and Button components
 */
export const FormLayout: Story = {
  render: () => (
    <div
      style={{
        resize: 'horizontal',
        overflow: 'auto',
        border: '2px dashed var(--theme-border-primary)',
        padding: 16,
        minWidth: 200,
        width: 600,
      }}
    >
      <ResponsiveStack breakpoint={500} gap={16} align="end" collapseAlign="stretch">
        <div style={{ flex: 1, minWidth: 0 }}>
          <Input placeholder="Email address" type="email" />
        </div>
        <Button variant="primary">Subscribe</Button>
      </ResponsiveStack>
    </div>
  ),
};

/**
 * Navigation using Button components that collapses to vertical
 */
export const Navigation: Story = {
  render: () => (
    <div
      style={{
        resize: 'horizontal',
        overflow: 'auto',
        border: '2px dashed var(--theme-border-primary)',
        padding: 16,
        minWidth: 200,
        width: 600,
      }}
    >
      <ResponsiveStack
        breakpoint={400}
        justify="space-around"
        collapseJustify="start"
        gap={8}
        collapseGap={4}
      >
        {['Home', 'Products', 'About', 'Contact'].map((item) => (
          <Button key={item} variant="ghost" size="sm">
            {item}
          </Button>
        ))}
      </ResponsiveStack>
    </div>
  ),
};

/**
 * Card with header that adapts layout using Card and Button components
 */
export const CardHeader: Story = {
  render: () => (
    <div
      style={{
        resize: 'horizontal',
        overflow: 'auto',
        border: '2px dashed var(--theme-border-primary)',
        padding: 16,
        minWidth: 200,
        width: 500,
      }}
    >
      <Card variant="outlined" padding="none">
        <ResponsiveStack
          breakpoint={350}
          justify="space-between"
          collapseJustify="center"
          align="center"
          gap={16}
          style={{
            padding: 16,
            borderBottom: '1px solid var(--theme-border-secondary)',
            background: 'var(--theme-background-secondary)',
          }}
        >
          <h3 style={{ margin: 0 }}>User Profile</h3>
          <ResponsiveStack breakpoint={250} gap={8} justify="end" collapseJustify="center">
            <Button variant="primary" size="sm">
              Edit
            </Button>
            <Button variant="danger" size="sm">
              Delete
            </Button>
          </ResponsiveStack>
        </ResponsiveStack>
        <div style={{ padding: 16 }}>
          <p style={{ margin: 0 }}>Card content goes here...</p>
        </div>
      </Card>
    </div>
  ),
};

/**
 * Alignment options showing how items align vertically within the stack.
 * Each Card has different heights to demonstrate the alignment effect.
 */
export const AlignmentOptions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 600 }}>
      {(['start', 'center', 'end', 'stretch'] as const).map((alignValue) => (
        <div key={alignValue}>
          <p style={{ margin: '0 0 8px' }}>
            <strong>align: {alignValue}</strong>
          </p>
          <div
            style={{
              border: '1px dashed var(--theme-border-primary)',
              padding: 8,
              height: 140,
              background: 'var(--theme-background-secondary)',
            }}
          >
            <ResponsiveStack breakpoint={0} align={alignValue} gap={16} style={{ height: '100%' }}>
              <Card variant="filled" padding="sm">
                <div style={{ height: 30 }}>Short</div>
              </Card>
              <Card variant="filled" padding="sm">
                <div style={{ height: 60 }}>Medium height</div>
              </Card>
              <Card variant="filled" padding="sm">
                <div style={{ height: 100 }}>Tall content here</div>
              </Card>
            </ResponsiveStack>
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * Justification options showing how items are distributed horizontally.
 * Fixed-width items demonstrate the spacing between them.
 */
export const JustificationOptions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 700 }}>
      {(['start', 'center', 'end', 'space-between', 'space-around', 'space-evenly'] as const).map(
        (justifyValue) => (
          <div key={justifyValue}>
            <p style={{ margin: '0 0 8px' }}>
              <strong>justify: {justifyValue}</strong>
            </p>
            <div
              style={{
                border: '1px dashed var(--theme-border-primary)',
                padding: 8,
                background: 'var(--theme-background-secondary)',
              }}
            >
              <ResponsiveStack breakpoint={0} justify={justifyValue} gap={16}>
                <Badge variant="info">Badge A</Badge>
                <Badge variant="success">Badge B</Badge>
                <Badge variant="warning">Badge C</Badge>
              </ResponsiveStack>
            </div>
          </div>
        )
      )}
    </div>
  ),
};

/**
 * With layout change callback
 */
export const WithCallback: Story = {
  render: () => (
    <div
      style={{
        resize: 'horizontal',
        overflow: 'auto',
        border: '2px dashed var(--theme-border-primary)',
        padding: 16,
        minWidth: 200,
        width: 600,
      }}
    >
      <p style={{ margin: '0 0 16px', color: 'var(--theme-text-secondary)' }}>
        Check console for layout change events:
      </p>
      <ResponsiveStack
        breakpoint={400}
        gap={16}
        onLayoutChange={(isCollapsed, direction) =>
          console.log('Layout changed:', { isCollapsed, direction })
        }
      >
        <Card variant="filled" padding="md">
          Item 1
        </Card>
        <Card variant="filled" padding="md">
          Item 2
        </Card>
        <Card variant="filled" padding="md">
          Item 3
        </Card>
      </ResponsiveStack>
    </div>
  ),
};

/**
 * Reverse directions
 */
export const ReverseDirections: Story = {
  render: () => (
    <div
      style={{
        resize: 'horizontal',
        overflow: 'auto',
        border: '2px dashed var(--theme-border-primary)',
        padding: 16,
        minWidth: 200,
        width: 500,
      }}
    >
      <p style={{ margin: '0 0 16px', color: 'var(--theme-text-secondary)' }}>
        row-reverse above 400px, column-reverse below:
      </p>
      <ResponsiveStack
        breakpoint={400}
        direction="row-reverse"
        collapseDirection="column-reverse"
        gap={16}
      >
        <Card variant="filled" padding="md">
          First (1)
        </Card>
        <Card variant="filled" padding="md">
          Second (2)
        </Card>
        <Card variant="filled" padding="md">
          Third (3)
        </Card>
      </ResponsiveStack>
    </div>
  ),
};

/**
 * Wrapping items using Badge components
 */
export const Wrapping: Story = {
  render: () => (
    <div
      style={{
        resize: 'horizontal',
        overflow: 'auto',
        border: '2px dashed var(--theme-border-primary)',
        padding: 16,
        minWidth: 200,
        width: 500,
      }}
    >
      <ResponsiveStack breakpoint={300} wrap gap={8}>
        {Array.from({ length: 8 }, (_, i) => (
          <Badge key={i} variant={i % 2 === 0 ? 'info' : 'success'}>
            Tag {i + 1}
          </Badge>
        ))}
      </ResponsiveStack>
    </div>
  ),
};

/**
 * User profile header example using Avatar, Card, and Button
 */
export const UserProfile: Story = {
  render: () => (
    <div
      style={{
        resize: 'horizontal',
        overflow: 'auto',
        border: '2px dashed var(--theme-border-primary)',
        padding: 16,
        minWidth: 200,
        width: 500,
      }}
    >
      <Card variant="outlined" padding="md">
        <ResponsiveStack breakpoint={350} gap={16} align="center" collapseAlign="center">
          <Avatar initials="JD" size="lg" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{ margin: '0 0 4px' }}>John Doe</h4>
            <p style={{ margin: 0, color: 'var(--theme-text-secondary)', fontSize: 14 }}>
              Software Engineer
            </p>
          </div>
          <Button variant="outline" size="sm">
            View Profile
          </Button>
        </ResponsiveStack>
      </Card>
    </div>
  ),
};

