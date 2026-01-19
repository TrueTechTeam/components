import type { Meta, StoryObj } from '@storybook/react';
import { Reveal } from './Reveal';
import { Card } from '../Card';
import { Button } from '../../buttons/Button';
import { Icon } from '../Icon';

const meta: Meta<typeof Reveal> = {
  title: 'Display/Reveal',
  component: Reveal,
  tags: ['autodocs'],
  argTypes: {
    animation: {
      control: 'select',
      options: [
        'fade',
        'slideUp',
        'slideDown',
        'slideLeft',
        'slideRight',
        'zoom',
        'zoomIn',
        'zoomOut',
      ],
      description: 'Animation type',
    },
    duration: {
      control: { type: 'range', min: 100, max: 2000, step: 100 },
      description: 'Animation duration in milliseconds',
    },
    delay: {
      control: { type: 'range', min: 0, max: 1000, step: 50 },
      description: 'Delay before animation starts',
    },
    threshold: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Visibility threshold for Intersection Observer',
    },
    triggerOnce: {
      control: 'boolean',
      description: 'Whether to animate only once',
    },
    distance: {
      control: 'text',
      description: 'Distance for slide animations',
    },
    cascade: {
      control: 'boolean',
      description: 'Whether to stagger children animations',
    },
    cascadeDelay: {
      control: { type: 'range', min: 50, max: 500, step: 25 },
      description: 'Delay between staggered children',
    },
    initiallyVisible: {
      control: 'boolean',
      description: 'Skip animation and show content immediately',
    },
    playOnMount: {
      control: 'boolean',
      description: 'Play animation immediately on mount without scroll',
    },
    onReveal: { table: { disable: true } },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
    style: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Reveal>;

// 1. Default (plays animation on mount for easy viewing in docs)
export const Default: Story = {
  args: {
    animation: 'fade',
    playOnMount: true,
    children: (
      <Card variant="filled" padding="lg">
        Fade In Content
      </Card>
    ),
  },
};

// 2. All Animations
export const AllAnimations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: 400 }}>
      {(['fade', 'slideUp', 'slideDown', 'slideLeft', 'slideRight', 'zoom'] as const).map(
        (animation, index) => (
          <div key={animation}>
            <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#666' }}>{animation}:</p>
            <Reveal animation={animation} playOnMount delay={index * 150} duration={800}>
              <Card variant="elevated" padding="md">
                {animation}
              </Card>
            </Reveal>
          </div>
        )
      )}
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'All available animation types.',
      },
    },
  },
};

// 3. Scroll Triggered (the main use case)
export const ScrollTriggered: Story = {
  render: () => (
    <div>
      <p style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
        Scroll down inside the container to see the animations trigger:
      </p>
      <div
        style={{
          height: '400px',
          overflow: 'auto',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '16px',
        }}
      >
        <div
          style={{
            height: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <p style={{ color: '#999' }}>Scroll down...</p>
        </div>

        <Reveal animation="slideUp" duration={600}>
          <Card variant="filled" padding="lg">
            <Icon name="zap" size="lg" /> First Card - Slide Up
          </Card>
        </Reveal>

        <div style={{ height: '200px' }} />

        <Reveal animation="slideLeft" duration={600}>
          <Card variant="elevated" padding="lg">
            <Icon name="star" size="lg" /> Second Card - Slide Left
          </Card>
        </Reveal>

        <div style={{ height: '200px' }} />

        <Reveal animation="zoom" duration={600}>
          <Card variant="outlined" padding="lg">
            <Icon name="heart" size="lg" /> Third Card - Zoom
          </Card>
        </Reveal>

        <div style={{ height: '200px' }} />

        <Reveal animation="fade" duration={800}>
          <Card variant="filled" padding="lg">
            <Icon name="check" size="lg" /> Fourth Card - Fade
          </Card>
        </Reveal>

        <div style={{ height: '100px' }} />
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Elements that animate when scrolled into view.',
      },
    },
  },
};

// 4. Cascade Animation
export const Cascade: Story = {
  render: () => (
    <div>
      <p style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
        Scroll down to see staggered animation:
      </p>
      <div
        style={{
          height: '400px',
          overflow: 'auto',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '16px',
        }}
      >
        <div
          style={{
            height: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <p style={{ color: '#999' }}>Scroll down...</p>
        </div>

        <Reveal animation="slideUp" cascade cascadeDelay={100} duration={500}>
          <Card variant="elevated" padding="md" style={{ marginBottom: '16px' }}>
            Item 1
          </Card>
          <Card variant="elevated" padding="md" style={{ marginBottom: '16px' }}>
            Item 2
          </Card>
          <Card variant="elevated" padding="md" style={{ marginBottom: '16px' }}>
            Item 3
          </Card>
          <Card variant="elevated" padding="md" style={{ marginBottom: '16px' }}>
            Item 4
          </Card>
          <Card variant="elevated" padding="md">
            Item 5
          </Card>
        </Reveal>

        <div style={{ height: '100px' }} />
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Staggered animation for multiple children.',
      },
    },
  },
};

// 5. Custom Distance
export const CustomDistance: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      <div style={{ width: 150 }}>
        <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#666' }}>10px:</p>
        <Reveal animation="slideUp" distance="10px" playOnMount duration={600}>
          <Card variant="outlined" padding="md">
            Small
          </Card>
        </Reveal>
      </div>
      <div style={{ width: 150 }}>
        <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#666' }}>20px (default):</p>
        <Reveal animation="slideUp" distance="20px" playOnMount delay={100} duration={600}>
          <Card variant="outlined" padding="md">
            Default
          </Card>
        </Reveal>
      </div>
      <div style={{ width: 150 }}>
        <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#666' }}>50px:</p>
        <Reveal animation="slideUp" distance="50px" playOnMount delay={200} duration={600}>
          <Card variant="outlined" padding="md">
            Large
          </Card>
        </Reveal>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Different slide distances.',
      },
    },
  },
};

// 6. Custom Duration
export const CustomDuration: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      <div style={{ width: 150 }}>
        <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#666' }}>200ms (fast):</p>
        <Reveal animation="fade" duration={200} playOnMount>
          <Card variant="elevated" padding="md">
            Fast
          </Card>
        </Reveal>
      </div>
      <div style={{ width: 150 }}>
        <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#666' }}>500ms (default):</p>
        <Reveal animation="fade" duration={500} playOnMount>
          <Card variant="elevated" padding="md">
            Default
          </Card>
        </Reveal>
      </div>
      <div style={{ width: 150 }}>
        <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#666' }}>1500ms (slow):</p>
        <Reveal animation="fade" duration={1500} playOnMount>
          <Card variant="elevated" padding="md">
            Slow
          </Card>
        </Reveal>
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
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      <div style={{ width: 150 }}>
        <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#666' }}>No delay:</p>
        <Reveal animation="slideUp" delay={0} playOnMount duration={500}>
          <Card variant="filled" padding="md">
            Instant
          </Card>
        </Reveal>
      </div>
      <div style={{ width: 150 }}>
        <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#666' }}>300ms delay:</p>
        <Reveal animation="slideUp" delay={300} playOnMount duration={500}>
          <Card variant="filled" padding="md">
            Delayed
          </Card>
        </Reveal>
      </div>
      <div style={{ width: 150 }}>
        <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#666' }}>600ms delay:</p>
        <Reveal animation="slideUp" delay={600} playOnMount duration={500}>
          <Card variant="filled" padding="md">
            More Delayed
          </Card>
        </Reveal>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Animations with different start delays.',
      },
    },
  },
};

// 8. Repeat Animation (triggerOnce: false)
export const RepeatAnimation: Story = {
  render: () => (
    <div>
      <p style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
        Scroll down and back up - animation repeats each time:
      </p>
      <div
        style={{
          height: '300px',
          overflow: 'auto',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '16px',
        }}
      >
        <div
          style={{
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <p style={{ color: '#999' }}>Scroll down...</p>
        </div>

        <Reveal animation="slideUp" triggerOnce={false} duration={500}>
          <Card variant="elevated" padding="lg">
            Repeating Animation
          </Card>
        </Reveal>

        <div style={{ height: '400px' }} />
        <p style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
          Scroll back up - animation repeats each time:
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Animation that repeats each time the element enters the viewport.',
      },
    },
  },
};

// 9. Landing Page Example
export const LandingPageExample: Story = {
  render: () => (
    <div>
      <p style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
        Scroll through this mini landing page:
      </p>
      <div
        style={{
          height: '500px',
          overflow: 'auto',
          border: '1px solid #ddd',
          borderRadius: '8px',
        }}
      >
        {/* Hero Section */}
        <div
          style={{
            padding: '48px 24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <Reveal animation="slideDown" duration={600} playOnMount>
            <h1 style={{ margin: '0 0 16px', fontSize: '32px' }}>Welcome to Our Product</h1>
          </Reveal>
          <Reveal animation="fade" duration={800} delay={300} playOnMount>
            <p style={{ margin: 0, opacity: 0.9 }}>The best solution for your needs</p>
          </Reveal>
        </div>

        {/* Features Section */}
        <div style={{ padding: '48px 24px' }}>
          <Reveal animation="slideUp" duration={500}>
            <h2 style={{ margin: '0 0 24px', textAlign: 'center' }}>Features</h2>
          </Reveal>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Reveal animation="slideUp" delay={100} duration={500}>
              <Card variant="outlined" padding="lg" style={{ width: 150, textAlign: 'center' }}>
                <Icon name="zap" size="lg" />
                <p style={{ marginTop: '8px', marginBottom: 0 }}>
                  <strong>Fast</strong>
                </p>
              </Card>
            </Reveal>
            <Reveal animation="slideUp" delay={200} duration={500}>
              <Card variant="outlined" padding="lg" style={{ width: 150, textAlign: 'center' }}>
                <Icon name="shield-check" size="lg" />
                <p style={{ marginTop: '8px', marginBottom: 0 }}>
                  <strong>Secure</strong>
                </p>
              </Card>
            </Reveal>
            <Reveal animation="slideUp" delay={300} duration={500}>
              <Card variant="outlined" padding="lg" style={{ width: 150, textAlign: 'center' }}>
                <Icon name="cpu" size="lg" />
                <p style={{ marginTop: '8px', marginBottom: 0 }}>
                  <strong>Smart</strong>
                </p>
              </Card>
            </Reveal>
          </div>
        </div>

        {/* Stats Section */}
        <div style={{ padding: '48px 24px', background: '#f9f9f9' }}>
          <Reveal animation="zoom" duration={600}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '48px',
                textAlign: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#667eea' }}>10K+</div>
                <div style={{ color: '#666' }}>Users</div>
              </div>
              <div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#667eea' }}>99%</div>
                <div style={{ color: '#666' }}>Uptime</div>
              </div>
              <div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#667eea' }}>24/7</div>
                <div style={{ color: '#666' }}>Support</div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* CTA Section */}
        <div style={{ padding: '48px 24px', textAlign: 'center' }}>
          <Reveal animation="slideUp" duration={600}>
            <h2 style={{ margin: '0 0 16px' }}>Ready to get started?</h2>
            <Button variant="primary" size="lg">
              Sign Up Now
            </Button>
          </Reveal>
        </div>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Example of reveal animations used in a landing page layout.',
      },
    },
  },
};

// 10. With Callback
export const WithCallback: Story = {
  render: () => (
    <div>
      <p style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
        Scroll down - check console for callback:
      </p>
      <div
        style={{
          height: '300px',
          overflow: 'auto',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '16px',
        }}
      >
        <div
          style={{
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <p style={{ color: '#999' }}>Scroll down...</p>
        </div>

        <Reveal
          animation="slideUp"
          onReveal={() => console.log('Element revealed!')}
          duration={500}
        >
          <Card variant="elevated" padding="lg">
            Check console when revealed
          </Card>
        </Reveal>

        <div style={{ height: '100px' }} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Callback fired when element is revealed.',
      },
    },
  },
};

// 11. Playground
export const Playground: Story = {
  args: {
    animation: 'slideUp',
    duration: 500,
    delay: 0,
    threshold: 0.1,
    triggerOnce: true,
    distance: '20px',
    cascade: false,
    cascadeDelay: 100,
    playOnMount: true,
    children: (
      <Card variant="elevated" padding="lg">
        Playground Content
      </Card>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all component props.',
      },
    },
  },
};
