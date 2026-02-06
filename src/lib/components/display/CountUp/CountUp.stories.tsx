import type { Meta, StoryObj } from '@storybook/react';
import { CountUp } from './CountUp';

const meta: Meta<typeof CountUp> = {
  title: 'Display/CountUp',
  component: CountUp,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
CountUp component for animated number counting.

The CountUp component displays animated number counting from a start value to a target value. It supports various easing functions, custom formatting, thousands separators, and can be triggered on element visibility using Intersection Observer.

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
<td><code>--countup-font-size</code></td>
<td><a href="?path=/story/theme-css-variables--typography"><code>var(--font-size-xl)</code></a></td>
<td>Font size of the count value</td>
</tr>
<tr>
<td><code>--countup-font-weight</code></td>
<td><code>600</code></td>
<td>Font weight of the count value</td>
</tr>
<tr>
<td><code>--countup-color</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-text-primary)</code></a></td>
<td>Color of the count value</td>
</tr>
<tr>
<td><code>--countup-prefix-color</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-text-secondary)</code></a></td>
<td>Color of the prefix text</td>
</tr>
<tr>
<td><code>--countup-suffix-color</code></td>
<td><a href="?path=/story/theme-css-variables--theme-tokens"><code>var(--theme-text-secondary)</code></a></td>
<td>Color of the suffix text</td>
</tr>
</tbody>
</table>
`,
      },
    },
  },
  argTypes: {
    value: {
      control: 'number',
      description: 'Target value to count to',
    },
    start: {
      control: 'number',
      description: 'Starting value',
    },
    duration: {
      control: { type: 'range', min: 500, max: 5000, step: 100 },
      description: 'Animation duration in milliseconds',
    },
    easing: {
      control: 'select',
      options: [
        'linear',
        'easeOut',
        'easeIn',
        'easeInOut',
        'easeOutCubic',
        'easeInCubic',
        'easeOutExpo',
      ],
      description: 'Easing function for animation',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the component',
    },
    decimals: {
      control: { type: 'range', min: 0, max: 4, step: 1 },
      description: 'Number of decimal places',
    },
    prefix: {
      control: 'text',
      description: 'Prefix to display before the number',
    },
    suffix: {
      control: 'text',
      description: 'Suffix to display after the number',
    },
    separator: {
      control: 'text',
      description: 'Thousands separator',
    },
    triggerOnVisible: {
      control: 'boolean',
      description: 'Start animation when element becomes visible',
    },
    delay: {
      control: { type: 'range', min: 0, max: 2000, step: 100 },
      description: 'Delay before starting animation',
    },
    onStart: { table: { disable: true } },
    onEnd: { table: { disable: true } },
    formatFn: { table: { disable: true } },
    autoStart: { table: { disable: true } },
    visibilityThreshold: { table: { disable: true } },
    decimalSeparator: { table: { disable: true } },
    className: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
    'aria-label': { table: { disable: true } },
    style: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof CountUp>;

// 1. Default story
export const Default: Story = {
  args: {
    value: 1000,
    triggerOnVisible: false,
  },
};

// 2. Currency
export const Currency: Story = {
  args: {
    value: 12345.67,
    prefix: '$',
    decimals: 2,
    triggerOnVisible: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Currency format with prefix and decimals.',
      },
    },
  },
};

// 3. Percentage
export const Percentage: Story = {
  args: {
    value: 87.5,
    suffix: '%',
    decimals: 1,
    triggerOnVisible: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Percentage format with suffix.',
      },
    },
  },
};

// 4. Different Easing Functions
export const EasingFunctions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {(['linear', 'easeOut', 'easeIn', 'easeInOut', 'easeOutCubic', 'easeOutExpo'] as const).map(
        (easing) => (
          <div key={easing} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ width: 120, fontSize: '14px' }}>{easing}:</span>
            <CountUp value={1000} easing={easing} duration={2000} triggerOnVisible={false} />
          </div>
        )
      )}
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Different easing functions for the animation.',
      },
    },
  },
};

// 5. Different Sizes
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'baseline' }}>
      <div style={{ textAlign: 'center' }}>
        <CountUp value={1234} size="sm" triggerOnVisible={false} />
        <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#666' }}>Small</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <CountUp value={1234} size="md" triggerOnVisible={false} />
        <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#666' }}>Medium</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <CountUp value={1234} size="lg" triggerOnVisible={false} />
        <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#666' }}>Large</p>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Different size options.',
      },
    },
  },
};

// 6. Custom Duration
export const CustomDuration: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '48px' }}>
      <div style={{ textAlign: 'center' }}>
        <CountUp value={1000} duration={500} triggerOnVisible={false} />
        <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#666' }}>500ms (fast)</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <CountUp value={1000} duration={2000} triggerOnVisible={false} />
        <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#666' }}>2000ms (default)</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <CountUp value={1000} duration={5000} triggerOnVisible={false} />
        <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#666' }}>5000ms (slow)</p>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Different animation durations.',
      },
    },
  },
};

// 7. With Delay
export const WithDelay: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '48px' }}>
      <div style={{ textAlign: 'center' }}>
        <CountUp value={100} delay={0} triggerOnVisible={false} />
        <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#666' }}>No delay</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <CountUp value={100} delay={500} triggerOnVisible={false} />
        <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#666' }}>500ms delay</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <CountUp value={100} delay={1000} triggerOnVisible={false} />
        <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#666' }}>1000ms delay</p>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Animation with different start delays.',
      },
    },
  },
};

// 8. KPI Dashboard Example
export const KPIDashboard: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div
        style={{
          padding: '24px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          minWidth: 150,
        }}
      >
        <p style={{ margin: '0 0 8px', fontSize: '14px', opacity: 0.9 }}>Revenue</p>
        <CountUp
          value={125430}
          prefix="$"
          size="lg"
          triggerOnVisible={false}
          style={
            {
              '--countup-color': 'white',
              '--countup-prefix-color': 'rgba(255,255,255,0.8)',
            } as React.CSSProperties
          }
        />
      </div>
      <div
        style={{
          padding: '24px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
          color: 'white',
          minWidth: 150,
        }}
      >
        <p style={{ margin: '0 0 8px', fontSize: '14px', opacity: 0.9 }}>Users</p>
        <CountUp
          value={8234}
          size="lg"
          triggerOnVisible={false}
          style={{ '--countup-color': 'white' } as React.CSSProperties}
        />
      </div>
      <div
        style={{
          padding: '24px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          minWidth: 150,
        }}
      >
        <p style={{ margin: '0 0 8px', fontSize: '14px', opacity: 0.9 }}>Conversion</p>
        <CountUp
          value={23.5}
          suffix="%"
          decimals={1}
          size="lg"
          triggerOnVisible={false}
          style={
            {
              '--countup-color': 'white',
              '--countup-suffix-color': 'rgba(255,255,255,0.8)',
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'KPI dashboard with animated numbers.',
      },
    },
  },
};

// 9. Large Numbers
export const LargeNumbers: Story = {
  args: {
    value: 1234567890,
    separator: ',',
    triggerOnVisible: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Large numbers with thousands separator.',
      },
    },
  },
};

// 10. Countdown (negative difference)
export const Countdown: Story = {
  args: {
    value: 0,
    start: 100,
    duration: 3000,
    triggerOnVisible: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Countdown from a higher number to lower.',
      },
    },
  },
};

// 11. Custom Format Function
export const CustomFormat: Story = {
  render: () => (
    <CountUp
      value={1500000}
      formatFn={(value) => {
        if (value >= 1000000) {
          return `${(value / 1000000).toFixed(1)}M`;
        }
        if (value >= 1000) {
          return `${(value / 1000).toFixed(1)}K`;
        }
        return value.toString();
      }}
      size="lg"
      triggerOnVisible={false}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Custom format function for compact numbers (1.5M).',
      },
    },
  },
};

// 12. With Callbacks
export const WithCallbacks: Story = {
  render: () => (
    <CountUp
      value={1000}
      onStart={() => console.log('Animation started')}
      onEnd={() => console.log('Animation ended')}
      triggerOnVisible={false}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Count up with animation callbacks (check console).',
      },
    },
  },
};

// 13. Trigger on Visible (scroll down to see)
export const TriggerOnVisible: Story = {
  render: () => (
    <div>
      <p style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
        Scroll down to see the animation trigger when the number becomes visible:
      </p>
      <div
        style={{ height: '300px', overflow: 'auto', border: '1px solid #ddd', borderRadius: '8px' }}
      >
        <div style={{ height: '400px', padding: '16px' }}>
          <p>Scroll down...</p>
        </div>
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <CountUp value={9999} prefix="$" size="lg" triggerOnVisible duration={2000} />
          <p style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
            Animation starts when visible
          </p>
        </div>
        <div style={{ height: '200px' }} />
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Animation triggers when element scrolls into view (using Intersection Observer).',
      },
    },
  },
};

// 14. Playground
export const Playground: Story = {
  args: {
    value: 1234,
    start: 0,
    duration: 2000,
    easing: 'easeOutCubic',
    prefix: '',
    suffix: '',
    decimals: 0,
    separator: ',',
    size: 'md',
    triggerOnVisible: false,
    delay: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all component props.',
      },
    },
  },
};
