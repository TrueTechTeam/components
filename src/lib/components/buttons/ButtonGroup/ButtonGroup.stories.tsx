import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { ButtonGroup } from './ButtonGroup';
import { Button } from '../Button';
import { IconButton } from '../IconButton';

const meta: Meta<typeof ButtonGroup> = {
  title: 'Buttons/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
ButtonGroup component - visually groups buttons that each have their own independent action.

Unlike [ButtonToggleGroup](?path=/docs/buttons-buttontogglegroup--docs), there is no shared
selection state - each child keeps its own \`onClick\` handler and there is no concept of a
"selected" item. Use this to group related but distinct actions, such as a primary text button
paired with an icon button (e.g. "Send" + a dropdown chevron).

Every button in the group shares the same \`variant\` (so the same text/icon and background
color) by default. Give an individual child its own \`variant\` prop to opt it out and give it a
different look - the rest of the group is unaffected. Buttons are separated by a divider colored
to match each button's own text color.

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
      <td><code>--button-group-radius</code></td>
      <td><a href="?path=/story/theme-css-variables--borders"><code>var(--radius-md)</code></a></td>
      <td>Shared outer border radius</td>
    </tr>
    <tr>
      <td><code>--button-group-divider-color</code></td>
      <td><code>var(--button-color)</code></td>
      <td>Divider line color between adjacent buttons (defaults to each button's own text color)</td>
    </tr>
  </tbody>
</table>
        `,
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the button group layout',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether buttons should distribute equally across available width',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'success', 'warning', 'danger'],
      description: 'Default variant applied to every button, unless a button overrides its own',
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label for the button group',
    },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
    children: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

/**
 * Most common use case: a text button paired with an icon button for a distinct, related action.
 */
export const Default: Story = {
  args: {
    orientation: 'horizontal',
    fullWidth: false,
    variant: 'primary',
    'aria-label': 'Send options',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button onClick={action('send')}>Send</Button>
      <IconButton
        icon="chevron-down"
        aria-label="More send options"
        onClick={action('more-options')}
      />
    </ButtonGroup>
  ),
};

/**
 * Two text buttons that share the group's variant automatically
 */
export const TwoTextButtons: Story = {
  render: () => (
    <ButtonGroup variant="outline" aria-label="Document actions">
      <Button onClick={action('save-draft')}>Save draft</Button>
      <Button onClick={action('publish')}>Publish</Button>
    </ButtonGroup>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Both buttons pick up the group's outline variant automatically, without needing to repeat it on each one.",
      },
    },
  },
};

/**
 * A single button opts out of the shared variant
 */
export const VariantOverride: Story = {
  render: () => (
    <ButtonGroup variant="outline" aria-label="Document actions">
      <Button onClick={action('save-draft')}>Save draft</Button>
      <Button variant="danger" onClick={action('delete')}>
        Delete
      </Button>
    </ButtonGroup>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "The Delete button passes its own variant, opting out of the group's shared outline variant while staying visually grouped.",
      },
    },
  },
};

/**
 * Two icon buttons grouped together
 */
export const TwoIconButtons: Story = {
  render: () => (
    <ButtonGroup aria-label="Media controls">
      <IconButton icon="chevron-left" aria-label="Previous" onClick={action('previous')} />
      <IconButton icon="chevron-right" aria-label="Next" onClick={action('next')} />
    </ButtonGroup>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Icon-only buttons grouped together, each with a distinct action.',
      },
    },
  },
};

/**
 * Vertical orientation
 */
export const Vertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical" aria-label="Stacked actions">
      <Button onClick={action('approve')}>Approve</Button>
      <IconButton icon="close" aria-label="Reject" onClick={action('reject')} />
    </ButtonGroup>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Vertical orientation stacks the buttons instead of placing them side by side.',
      },
    },
  },
};

/**
 * Full width distribution
 */
export const FullWidth: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <ButtonGroup fullWidth aria-label="Full width actions">
        <Button onClick={action('save')}>Save</Button>
        <IconButton icon="chevron-down" aria-label="More options" onClick={action('more')} />
      </ButtonGroup>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Full width mode where buttons distribute equally to fill available space.',
      },
    },
  },
};

/**
 * Disabled state applied per-button, not to the group
 */
export const DisabledButton: Story = {
  render: () => (
    <ButtonGroup aria-label="Send options">
      <Button onClick={action('send')}>Send</Button>
      <IconButton icon="chevron-down" aria-label="More send options" disabled />
    </ButtonGroup>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'There is no group-level disabled prop - since each button is independent, disable individual buttons directly.',
      },
    },
  },
};
