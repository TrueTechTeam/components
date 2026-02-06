import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Stepper } from './Stepper';
import { Step } from './Step';
import { Button } from '../../buttons/Button';

const meta: Meta<typeof Stepper> = {
  title: 'Navigation/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Step indicator component for multi-step processes. Supports horizontal and vertical orientations with multiple indicator variants (numbered, dot, icon). Shows completed, active, and error states.

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
<td><code>--stepper-indicator-size-sm</code></td>
<td>24px</td>
<td>Indicator size for small variant</td>
</tr>
<tr>
<td><code>--stepper-indicator-size-md</code></td>
<td>32px</td>
<td>Indicator size for medium variant</td>
</tr>
<tr>
<td><code>--stepper-indicator-size-lg</code></td>
<td>40px</td>
<td>Indicator size for large variant</td>
</tr>
<tr>
<td><code>--stepper-indicator-size</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--stepper-indicator-size-md)</code></a></td>
<td>Current indicator size</td>
</tr>
<tr>
<td><code>--stepper-indicator-bg</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-background-secondary)</code></a></td>
<td>Background color of inactive indicator</td>
</tr>
<tr>
<td><code>--stepper-indicator-active-bg</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-primary)</code></a></td>
<td>Background color of active indicator</td>
</tr>
<tr>
<td><code>--stepper-indicator-completed-bg</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-success)</code></a></td>
<td>Background color of completed indicator</td>
</tr>
<tr>
<td><code>--stepper-indicator-error-bg</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-error)</code></a></td>
<td>Background color of error indicator</td>
</tr>
<tr>
<td><code>--stepper-indicator-text</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-secondary)</code></a></td>
<td>Text color in inactive indicator</td>
</tr>
<tr>
<td><code>--stepper-indicator-active-text</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-on-primary)</code></a></td>
<td>Text color in active indicator</td>
</tr>
<tr>
<td><code>--stepper-connector-color</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-border-primary)</code></a></td>
<td>Color of connector lines</td>
</tr>
<tr>
<td><code>--stepper-connector-completed-color</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-success)</code></a></td>
<td>Color of completed connector</td>
</tr>
<tr>
<td><code>--stepper-connector-thickness</code></td>
<td>2px</td>
<td>Thickness of connector lines</td>
</tr>
<tr>
<td><code>--stepper-title-color</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-primary)</code></a></td>
<td>Color of step title</td>
</tr>
<tr>
<td><code>--stepper-description-color</code></td>
<td><a href="?path=/story/theme-css-variables--color-palette"><code>var(--theme-text-secondary)</code></a></td>
<td>Color of step description</td>
</tr>
<tr>
<td><code>--stepper-transition</code></td>
<td><a href="?path=/story/theme-css-variables--transitions"><code>var(--transition-normal)</code></a></td>
<td>Transition duration and easing</td>
</tr>
<tr>
<td><code>--stepper-gap</code></td>
<td><a href="?path=/story/theme-css-variables--spacing"><code>var(--spacing-md)</code></a></td>
<td>Gap between steps</td>
</tr>
<tr>
<td><code>--stepper-font-size</code></td>
<td><a href="?path=/story/theme-css-variables--typography"><code>var(--font-size-sm)</code></a></td>
<td>Font size of step labels</td>
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
    },
    variant: {
      control: 'select',
      options: ['numbered', 'dot', 'icon'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

export const Default: Story = {
  render: function Render(args) {
    const [currentStep, setCurrentStep] = useState(1);

    return (
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <Stepper {...args} currentStep={currentStep} onStepChange={setCurrentStep}>
          <Step title="Account" description="Create your account" />
          <Step title="Profile" description="Set up your profile" />
          <Step title="Review" description="Review and confirm" />
        </Stepper>

        <div style={{ marginTop: '32px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button
            variant="outline"
            onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          <Button
            onClick={() => setCurrentStep((p) => Math.min(2, p + 1))}
            disabled={currentStep === 2}
          >
            Next
          </Button>
        </div>
      </div>
    );
  },
};

export const ClickableSteps: Story = {
  render: function Render(args) {
    const [currentStep, setCurrentStep] = useState(2);

    return (
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <Stepper
          {...args}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          allowStepClick
          onlyPreviousClickable
        >
          <Step title="Account" description="Create your account" />
          <Step title="Profile" description="Set up your profile" />
          <Step title="Payment" description="Add payment method" />
          <Step title="Review" description="Review and confirm" />
        </Stepper>

        <p
          style={{
            marginTop: '16px',
            textAlign: 'center',
            fontSize: '12px',
            color: 'var(--theme-text-secondary)',
          }}
        >
          Click on previous steps to navigate back
        </p>
      </div>
    );
  },
};

export const Vertical: Story = {
  render: function Render(args) {
    const [currentStep, setCurrentStep] = useState(1);

    return (
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <Stepper {...args} currentStep={currentStep} orientation="vertical">
          <Step title="Account" description="Create your account">
            <div style={{ padding: '16px 0' }}>
              <p>Step 1 content goes here. Fill in your account details.</p>
            </div>
          </Step>
          <Step title="Profile" description="Set up your profile">
            <div style={{ padding: '16px 0' }}>
              <p>Step 2 content goes here. Add your profile information.</p>
            </div>
          </Step>
          <Step title="Review" description="Review and confirm">
            <div style={{ padding: '16px 0' }}>
              <p>Step 3 content goes here. Review your information.</p>
            </div>
          </Step>
        </Stepper>

        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
          <Button
            variant="outline"
            onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          <Button
            onClick={() => setCurrentStep((p) => Math.min(2, p + 1))}
            disabled={currentStep === 2}
          >
            Next
          </Button>
        </div>
      </div>
    );
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      <div>
        <p style={{ marginBottom: '16px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          Numbered (default)
        </p>
        <Stepper currentStep={1} variant="numbered">
          <Step title="Step 1" />
          <Step title="Step 2" />
          <Step title="Step 3" />
        </Stepper>
      </div>
      <div>
        <p style={{ marginBottom: '16px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          Dot
        </p>
        <Stepper currentStep={1} variant="dot">
          <Step title="Step 1" />
          <Step title="Step 2" />
          <Step title="Step 3" />
        </Stepper>
      </div>
      <div>
        <p style={{ marginBottom: '16px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          Icon
        </p>
        <Stepper currentStep={1} variant="icon">
          <Step title="Shipping" icon="key" />
          <Step title="Payment" icon="credit-card" />
          <Step title="Confirm" icon="check" />
        </Stepper>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      <div>
        <p style={{ marginBottom: '16px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          Small
        </p>
        <Stepper currentStep={1} size="sm">
          <Step title="Step 1" />
          <Step title="Step 2" />
          <Step title="Step 3" />
        </Stepper>
      </div>
      <div>
        <p style={{ marginBottom: '16px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          Medium (default)
        </p>
        <Stepper currentStep={1} size="md">
          <Step title="Step 1" />
          <Step title="Step 2" />
          <Step title="Step 3" />
        </Stepper>
      </div>
      <div>
        <p style={{ marginBottom: '16px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          Large
        </p>
        <Stepper currentStep={1} size="lg">
          <Step title="Step 1" />
          <Step title="Step 2" />
          <Step title="Step 3" />
        </Stepper>
      </div>
    </div>
  ),
};

export const WithOptionalStep: Story = {
  render: function Render(args) {
    const [currentStep, setCurrentStep] = useState(1);

    return (
      <div style={{ width: '100%', maxWidth: '700px' }}>
        <Stepper {...args} currentStep={currentStep}>
          <Step title="Account" description="Required" />
          <Step title="Profile" description="Required" />
          <Step title="Preferences" description="Optional" optional />
          <Step title="Confirm" description="Required" />
        </Stepper>

        <div style={{ marginTop: '32px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button
            variant="outline"
            onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          <Button
            onClick={() => setCurrentStep((p) => Math.min(3, p + 1))}
            disabled={currentStep === 3}
          >
            {currentStep === 2 ? 'Skip' : 'Next'}
          </Button>
        </div>
      </div>
    );
  },
};

export const WithError: Story = {
  render: function Render(args) {
    const [currentStep] = useState(1);

    return (
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <Stepper {...args} currentStep={currentStep}>
          <Step title="Account" description="Completed" />
          <Step
            title="Payment"
            description="Error in payment"
            error
            errorMessage="Please fix payment details"
          />
          <Step title="Confirm" description="Pending" />
        </Stepper>
      </div>
    );
  },
};

export const NonLinear: Story = {
  render: function Render(args) {
    const [currentStep, setCurrentStep] = useState(0);
    const [completed, setCompleted] = useState<number[]>([]);

    const handleComplete = () => {
      if (!completed.includes(currentStep)) {
        setCompleted([...completed, currentStep]);
      }
    };

    return (
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <Stepper
          {...args}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          completedSteps={completed}
          allowStepClick
          onlyPreviousClickable={false}
        >
          <Step title="Select campaign" />
          <Step title="Create ad group" />
          <Step title="Create ad" />
        </Stepper>

        <div style={{ marginTop: '32px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button variant="outline" onClick={handleComplete}>
            Mark Complete
          </Button>
          <Button onClick={() => setCurrentStep((p) => (p + 1) % 3)}>Next Step</Button>
        </div>

        <p
          style={{
            marginTop: '16px',
            textAlign: 'center',
            fontSize: '12px',
            color: 'var(--theme-text-secondary)',
          }}
        >
          Completed steps:{' '}
          {completed.length === 0 ? 'None' : completed.map((s) => s + 1).join(', ')}
        </p>
      </div>
    );
  },
};
