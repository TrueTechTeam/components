import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import './ScssFunctions.stories.scss';

// ============================================================================
// ALPHA FUNCTION DEMO
// ============================================================================

function AlphaFunctionDemo() {
  const [alpha, setAlpha] = useState(0.5);

  const alphaExamples = [
    { alpha: 1, label: '100%' },
    { alpha: 0.75, label: '75%' },
    { alpha: 0.5, label: '50%' },
    { alpha: 0.25, label: '25%' },
    { alpha: 0.1, label: '10%' },
  ];

  return (
    <div className="scss-story">
      <div className="scss-story__header">
        <h2>alpha() Function</h2>
        <p>Applies transparency to CSS variable colors using color-mix().</p>
      </div>

      <div className="scss-story__section">
        <h3>Function Signature</h3>
        <pre className="scss-story__code">
          {`@function alpha($css-var, $alpha) {
  $percentage: $alpha * 100%;
  @return color-mix(in srgb, var(#{$css-var}) #{$percentage}, transparent);
}`}
        </pre>
      </div>

      <div className="scss-story__section">
        <h3>Usage</h3>
        <pre className="scss-story__code">
          {`@use '@ui-components/styles/mixins/functions' as *;

.overlay {
  background: alpha(--theme-primary, 0.5);
}

.backdrop {
  background: alpha(--theme-surface-primary, 0.8);
}`}
        </pre>
      </div>

      <div className="scss-story__section">
        <h3>Interactive Demo</h3>
        <div className="scss-story__demo-controls">
          <label>
            Alpha Value: {alpha}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={alpha}
              onChange={(e) => setAlpha(parseFloat(e.target.value))}
            />
          </label>
        </div>

        <div className="scss-story__alpha-demo">
          <div className="scss-story__alpha-preview">
            <div className="scss-story__alpha-background">
              <div
                className="scss-story__alpha-overlay"
                style={{
                  background: `color-mix(in srgb, var(--theme-primary) ${alpha * 100}%, transparent)`,
                }}
              />
            </div>
            <code>alpha(--theme-primary, {alpha})</code>
          </div>
        </div>
      </div>

      <div className="scss-story__section">
        <h3>Alpha Scale Examples</h3>
        <div className="scss-story__alpha-grid">
          {alphaExamples.map(({ alpha: a, label }) => (
            <div key={a} className="scss-story__alpha-item">
              <div
                className="scss-story__alpha-swatch"
                style={{
                  background: `color-mix(in srgb, var(--theme-primary) ${a * 100}%, transparent)`,
                }}
              />
              <span className="scss-story__alpha-label">{label}</span>
              <code>alpha(--theme-primary, {a})</code>
            </div>
          ))}
        </div>
      </div>

      <div className="scss-story__section">
        <h3>Use Cases</h3>
        <div className="scss-story__use-cases">
          <div className="scss-story__use-case">
            <h4>Overlays & Backdrops</h4>
            <div className="scss-story__use-case-demo scss-story__use-case-demo--overlay">
              <div className="scss-story__use-case-content">
                Modal backdrop with semi-transparent overlay
              </div>
            </div>
            <pre className="scss-story__code scss-story__code--small">
              {`.modal-backdrop {
  background: alpha(--color-black, 0.5);
}`}
            </pre>
          </div>

          <div className="scss-story__use-case">
            <h4>Hover States</h4>
            <button className="scss-story__hover-button">Hover me</button>
            <pre className="scss-story__code scss-story__code--small">
              {`.button:hover {
  background: alpha(--theme-primary, 0.1);
}`}
            </pre>
          </div>

          <div className="scss-story__use-case">
            <h4>Focus Rings</h4>
            <input type="text" className="scss-story__focus-input" placeholder="Focus me" />
            <pre className="scss-story__code scss-story__code--small">
              {`.input:focus {
  box-shadow: 0 0 0 3px alpha(--theme-primary, 0.25);
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SPACING FUNCTION DEMO
// ============================================================================

function SpacingFunctionDemo() {
  const [multiplier, setMultiplier] = useState(4);

  const spacingExamples = [
    { value: 1, result: '4px' },
    { value: 2, result: '8px' },
    { value: 3, result: '12px' },
    { value: 4, result: '16px' },
    { value: 6, result: '24px' },
    { value: 8, result: '32px' },
    { value: 12, result: '48px' },
  ];

  return (
    <div className="scss-story">
      <div className="scss-story__header">
        <h2>spacing() Function</h2>
        <p>Converts spacing units to pixel values based on a 4px grid.</p>
      </div>

      <div className="scss-story__section">
        <h3>Function Signature</h3>
        <pre className="scss-story__code">
          {`@function spacing($values...) {
  $result: ();
  @each $value in $values {
    @if $value == 0 {
      $result: list.append($result, 0);
    } @else {
      $result: list.append($result, #{$value * $spacing-unit});
    }
  }
  @return $result;
}

// Base unit: $spacing-unit: 4px`}
        </pre>
      </div>

      <div className="scss-story__section">
        <h3>Usage</h3>
        <pre className="scss-story__code">
          {`@use '@ui-components/styles/mixins/spacing' as *;

.card {
  padding: spacing(4);        // 16px
  margin: spacing(2 4);       // 8px 16px
  gap: spacing(2);            // 8px
}

.section {
  padding: spacing(6 8 6 8);  // 24px 32px 24px 32px
}`}
        </pre>
      </div>

      <div className="scss-story__section">
        <h3>Interactive Demo</h3>
        <div className="scss-story__demo-controls">
          <label>
            Multiplier: {multiplier} ({multiplier * 4}px)
            <input
              type="range"
              min="1"
              max="16"
              step="1"
              value={multiplier}
              onChange={(e) => setMultiplier(parseInt(e.target.value))}
            />
          </label>
        </div>

        <div className="scss-story__spacing-demo">
          <div className="scss-story__spacing-box" style={{ padding: `${multiplier * 4}px` }}>
            <div className="scss-story__spacing-content">
              Content with {multiplier * 4}px padding
            </div>
          </div>
          <code>padding: spacing({multiplier});</code>
        </div>
      </div>

      <div className="scss-story__section">
        <h3>Spacing Scale</h3>
        <div className="scss-story__spacing-scale">
          {spacingExamples.map(({ value, result }) => (
            <div key={value} className="scss-story__spacing-item">
              <div className="scss-story__spacing-visual">
                <div className="scss-story__spacing-bar" style={{ width: `${value * 4}px` }} />
              </div>
              <div className="scss-story__spacing-info">
                <code>spacing({value})</code>
                <span>{result}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="scss-story__section">
        <h3>Shorthand Examples</h3>
        <div className="scss-story__shorthand-examples">
          <div className="scss-story__shorthand-item">
            <code>spacing(4)</code>
            <span>16px (all sides)</span>
          </div>
          <div className="scss-story__shorthand-item">
            <code>spacing(2 4)</code>
            <span>8px 16px (vertical, horizontal)</span>
          </div>
          <div className="scss-story__shorthand-item">
            <code>spacing(2 4 6)</code>
            <span>8px 16px 24px (top, horizontal, bottom)</span>
          </div>
          <div className="scss-story__shorthand-item">
            <code>spacing(1 2 3 4)</code>
            <span>4px 8px 12px 16px (top, right, bottom, left)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SPACING MIXINS DEMO
// ============================================================================

function SpacingMixinsDemo() {
  return (
    <div className="scss-story">
      <div className="scss-story__header">
        <h2>Spacing Mixins</h2>
        <p>Convenient mixins for margin and padding based on the 4px grid.</p>
      </div>

      <div className="scss-story__section">
        <h3>Available Mixins</h3>
        <div className="scss-story__mixin-grid">
          <div className="scss-story__mixin-category">
            <h4>Margin</h4>
            <pre className="scss-story__code">
              {`@include m(4);   // margin: 16px
@include mt(2);  // margin-top: 8px
@include mr(2);  // margin-right: 8px
@include mb(2);  // margin-bottom: 8px
@include ml(2);  // margin-left: 8px
@include mx(4);  // margin-left/right: 16px
@include my(4);  // margin-top/bottom: 16px`}
            </pre>
          </div>

          <div className="scss-story__mixin-category">
            <h4>Padding</h4>
            <pre className="scss-story__code">
              {`@include p(4);   // padding: 16px
@include pt(2);  // padding-top: 8px
@include pr(2);  // padding-right: 8px
@include pb(2);  // padding-bottom: 8px
@include pl(2);  // padding-left: 8px
@include px(4);  // padding-left/right: 16px
@include py(4);  // padding-top/bottom: 16px`}
            </pre>
          </div>
        </div>
      </div>

      <div className="scss-story__section">
        <h3>Usage Example</h3>
        <pre className="scss-story__code">
          {`@use '@ui-components/styles/mixins/spacing' as *;

.card {
  @include p(4);     // padding: 16px
  @include mb(4);    // margin-bottom: 16px
}

.card-header {
  @include pb(2);    // padding-bottom: 8px
  @include mb(2);    // margin-bottom: 8px
}

.card-actions {
  @include mt(4);    // margin-top: 16px
  @include px(2);    // padding-left/right: 8px
}`}
        </pre>
      </div>
    </div>
  );
}

// ============================================================================
// FLEX MIXINS DEMO
// ============================================================================

function FlexMixinsDemo() {
  return (
    <div className="scss-story">
      <div className="scss-story__header">
        <h2>Flex Mixins</h2>
        <p>Common flexbox layout patterns as reusable mixins.</p>
      </div>

      <div className="scss-story__section">
        <h3>Available Mixins</h3>
        <pre className="scss-story__code">
          {`@use '@ui-components/styles/mixins/flex' as *;

// Full control
@include flex($direction, $justify, $align);

// Centered content
@include flex-center;

// Space between with centered alignment
@include flex-between;

// Space around with centered alignment
@include flex-around;

// Column layout
@include flex-column;

// Centered column layout
@include flex-column-center;

// Wrapping flex
@include flex-wrap;`}
        </pre>
      </div>

      <div className="scss-story__section">
        <h3>Visual Examples</h3>
        <div className="scss-story__flex-examples">
          <div className="scss-story__flex-example">
            <h4>flex-center</h4>
            <div className="scss-story__flex-demo scss-story__flex-demo--center">
              <div className="scss-story__flex-item">Centered</div>
            </div>
            <code>@include flex-center;</code>
          </div>

          <div className="scss-story__flex-example">
            <h4>flex-between</h4>
            <div className="scss-story__flex-demo scss-story__flex-demo--between">
              <div className="scss-story__flex-item">Left</div>
              <div className="scss-story__flex-item">Right</div>
            </div>
            <code>@include flex-between;</code>
          </div>

          <div className="scss-story__flex-example">
            <h4>flex-around</h4>
            <div className="scss-story__flex-demo scss-story__flex-demo--around">
              <div className="scss-story__flex-item">A</div>
              <div className="scss-story__flex-item">B</div>
              <div className="scss-story__flex-item">C</div>
            </div>
            <code>@include flex-around;</code>
          </div>

          <div className="scss-story__flex-example">
            <h4>flex-column-center</h4>
            <div className="scss-story__flex-demo scss-story__flex-demo--column-center">
              <div className="scss-story__flex-item">Top</div>
              <div className="scss-story__flex-item">Bottom</div>
            </div>
            <code>@include flex-column-center;</code>
          </div>

          <div className="scss-story__flex-example">
            <h4>flex-wrap</h4>
            <div className="scss-story__flex-demo scss-story__flex-demo--wrap">
              <div className="scss-story__flex-item">1</div>
              <div className="scss-story__flex-item">2</div>
              <div className="scss-story__flex-item">3</div>
              <div className="scss-story__flex-item">4</div>
              <div className="scss-story__flex-item">5</div>
            </div>
            <code>@include flex-wrap;</code>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT MIXINS DEMO
// ============================================================================

function ComponentMixinsDemo() {
  return (
    <div className="scss-story">
      <div className="scss-story__header">
        <h2>Component Mixins</h2>
        <p>Utility mixins for common component patterns.</p>
      </div>

      <div className="scss-story__section">
        <h3>button-reset</h3>
        <p>Removes all default button styles for custom buttons.</p>
        <pre className="scss-story__code">
          {`@include button-reset;

// Generates:
// background: none;
// border: none;
// padding: 0;
// margin: 0;
// font: inherit;
// color: inherit;
// cursor: pointer;
// outline: none;`}
        </pre>
      </div>

      <div className="scss-story__section">
        <h3>focus-ring</h3>
        <p>Adds accessible focus indicator.</p>
        <div className="scss-story__focus-demo">
          <button className="scss-story__focus-ring-button">Focus me (Tab)</button>
        </div>
        <pre className="scss-story__code">
          {`@include focus-ring($color: var(--theme-border-focus), $offset: 2px);

// Generates:
// outline: 2px solid $color;
// outline-offset: $offset;`}
        </pre>
      </div>

      <div className="scss-story__section">
        <h3>visually-hidden</h3>
        <p>Hides content visually but keeps it accessible to screen readers.</p>
        <pre className="scss-story__code">
          {`@include visually-hidden;

// Use for:
// - Skip links
// - Form labels that should be read but not seen
// - Additional context for screen readers`}
        </pre>
      </div>

      <div className="scss-story__section">
        <h3>truncate</h3>
        <p>Single-line text truncation with ellipsis.</p>
        <div className="scss-story__truncate-demo">
          <div className="scss-story__truncate-example">
            This is a very long text that will be truncated with an ellipsis when it overflows the
            container width
          </div>
        </div>
        <pre className="scss-story__code">
          {`@include truncate;

// Generates:
// overflow: hidden;
// text-overflow: ellipsis;
// white-space: nowrap;`}
        </pre>
      </div>

      <div className="scss-story__section">
        <h3>line-clamp</h3>
        <p>Multi-line text truncation.</p>
        <div className="scss-story__line-clamp-demo">
          <div className="scss-story__line-clamp-example">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </div>
        </div>
        <pre className="scss-story__code">
          {`@include line-clamp(3);

// Generates:
// display: -webkit-box;
// -webkit-line-clamp: 3;
// -webkit-box-orient: vertical;
// overflow: hidden;`}
        </pre>
      </div>

      <div className="scss-story__section">
        <h3>transition</h3>
        <p>Consistent transition helper.</p>
        <div className="scss-story__transition-demo">
          <button className="scss-story__transition-button">Hover for transition</button>
        </div>
        <pre className="scss-story__code">
          {`@include transition(background, color, transform);

// Generates:
// transition-property: background, color, transform;
// transition-duration: var(--transition-normal);
// transition-timing-function: ease-in-out;`}
        </pre>
      </div>
    </div>
  );
}

// ============================================================================
// META & EXPORTS
// ============================================================================

const meta: Meta = {
  title: 'Theme/SCSS Functions & Mixins',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# SCSS Functions & Mixins

This design system provides a collection of SCSS functions and mixins to help build consistent, maintainable styles.

## Functions

- **alpha()**: Apply transparency to CSS variable colors
- **spacing()**: Convert spacing units to pixel values based on 4px grid

## Mixins

### Spacing Mixins
- \`m()\`, \`mt()\`, \`mr()\`, \`mb()\`, \`ml()\`, \`mx()\`, \`my()\` - Margin utilities
- \`p()\`, \`pt()\`, \`pr()\`, \`pb()\`, \`pl()\`, \`px()\`, \`py()\` - Padding utilities

### Flex Mixins
- \`flex()\` - Full flexbox control
- \`flex-center\` - Centered content
- \`flex-between\` - Space between layout
- \`flex-column\` - Vertical layout

### Component Mixins
- \`button-reset\` - Remove default button styles
- \`focus-ring\` - Accessible focus indicator
- \`visually-hidden\` - Screen reader only content
- \`truncate\` - Single-line text truncation
- \`line-clamp\` - Multi-line text truncation
- \`transition\` - Consistent transitions

## Import

\`\`\`scss
@use '@ui-components/styles/mixins/functions' as *;
@use '@ui-components/styles/mixins/spacing' as *;
@use '@ui-components/styles/mixins/flex' as *;
@use '@ui-components/styles/mixins/component' as *;
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const AlphaFunction: Story = {
  name: 'alpha() Function',
  render: () => <AlphaFunctionDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Apply transparency to CSS variable colors using color-mix().',
      },
    },
  },
};

export const SpacingFunction: Story = {
  name: 'spacing() Function',
  render: () => <SpacingFunctionDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Convert spacing multipliers to pixel values based on a 4px grid.',
      },
    },
  },
};

export const SpacingMixins: Story = {
  name: 'Spacing Mixins',
  render: () => <SpacingMixinsDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Margin and padding mixins for consistent spacing.',
      },
    },
  },
};

export const FlexMixins: Story = {
  name: 'Flex Mixins',
  render: () => <FlexMixinsDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Common flexbox layout patterns as reusable mixins.',
      },
    },
  },
};

export const ComponentMixins: Story = {
  name: 'Component Mixins',
  render: () => <ComponentMixinsDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Utility mixins for common component patterns like button resets, focus rings, and text truncation.',
      },
    },
  },
};
