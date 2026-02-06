import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver';
import { Card } from '../../components/display/Card';
import { Skeleton } from '../../components/display/Skeleton';

// Basic visibility indicator
function BasicDemo() {
  const { ref, isIntersecting, entry } = useIntersectionObserver({
    threshold: 0.5,
  });

  return (
    <div
      style={{
        height: '800px',
        width: '400px',
        overflow: 'auto',
        border: '2px solid var(--theme-border-primary)',
        borderRadius: '8px',
      }}
    >
      <div
        style={{
          height: '800px',
          background:
            'linear-gradient(180deg, var(--theme-surface-primary) 0%, var(--theme-secondary-500) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--theme-text-primary)',
        }}
      >
        Scroll down
      </div>

      <Card
        ref={ref}
        variant="filled"
        padding="lg"
        style={{
          margin: '20px',
          background: isIntersecting ? 'var(--theme-primary)' : 'var(--theme-secondary-500)',
          color: 'var(--theme-text-on-primary)',
          transition: 'background 0.3s ease',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>
          {isIntersecting ? 'Visible!' : 'Not Visible'}
        </div>
        <div style={{ fontSize: '14px', opacity: 0.8 }}>
          Intersection ratio: {((entry?.intersectionRatio ?? 0) * 100).toFixed(0)}%
        </div>
      </Card>

      <div style={{ height: '250px', background: 'var(--theme-surface-primary)' }} />
    </div>
  );
}

// Lazy loading simulation
function LazyLoadDemo() {
  const images = [
    { id: 1, color: 'var(--theme-primary)' },
    { id: 2, color: 'var(--theme-warning)' },
    { id: 3, color: 'var(--theme-tertiary)' },
    { id: 4, color: 'var(--theme-success)' },
  ];

  return (
    <div
      style={{
        height: '400px',
        overflow: 'auto',
        border: '2px solid var(--theme-border-primary)',
        borderRadius: '8px',
      }}
    >
      <Card
        variant="outlined"
        padding="md"
        style={{
          margin: '0',
          borderRadius: '0',
          border: 'none',
          borderBottom: '1px solid var(--theme-border-primary)',
        }}
      >
        <p style={{ margin: 0, color: 'var(--theme-text-secondary)' }}>
          Scroll to lazy load the content below. Each card loads only when visible.
        </p>
      </Card>

      {images.map((img) => (
        <LazyCard key={img.id} color={img.color} id={img.id} />
      ))}

      <div style={{ height: '100px' }} />
    </div>
  );
}

function LazyCard({ color, id }: { color: string; id: number }) {
  const [loaded, setLoaded] = useState(false);
  const { ref, isIntersecting } = useIntersectionObserver({
    triggerOnce: true,
    rootMargin: '50px',
  });

  // Simulate loading delay
  React.useEffect(() => {
    if (isIntersecting && !loaded) {
      const timer = setTimeout(() => setLoaded(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isIntersecting, loaded]);

  return (
    <div
      ref={ref}
      style={{
        margin: '20px',
        height: '150px',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {!isIntersecting ? (
        <div
          style={{
            height: '100%',
            background: 'var(--theme-background-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--theme-text-disabled)',
            border: '1px solid var(--theme-border-primary)',
            borderRadius: '8px',
          }}
        >
          Not in viewport yet
        </div>
      ) : !loaded ? (
        <Skeleton height="100%" width="100%" />
      ) : (
        <div
          style={{
            height: '100%',
            background: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--theme-text-on-primary)',
            fontSize: '24px',
            fontWeight: 'bold',
          }}
        >
          Card {id} Loaded!
        </div>
      )}
    </div>
  );
}

// Threshold gradient demo
function ThresholdDemo() {
  const { ref, entry } = useIntersectionObserver({
    threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
  });

  const ratio = entry?.intersectionRatio ?? 0;

  return (
    <div
      style={{
        height: '800px',
        width: '600px',
        overflow: 'auto',
        border: '2px solid var(--theme-border-primary)',
        borderRadius: '8px',
      }}
    >
      <div style={{ height: '800px', background: 'var(--theme-surface-primary)' }} />

      <div
        ref={ref}
        style={{
          height: '200px',
          margin: '20px',
          borderRadius: '8px',
          background: `rgba(0, 173, 181, ${ratio})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.1s ease',
          border: '2px solid var(--theme-primary)',
        }}
      >
        <div
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: ratio > 0.5 ? 'var(--theme-text-on-primary)' : 'var(--theme-primary)',
          }}
        >
          {(ratio * 100).toFixed(0)}%
        </div>
        <div
          style={{ color: ratio > 0.5 ? 'rgba(255,255,255,0.8)' : 'var(--theme-text-tertiary)' }}
        >
          visible
        </div>
      </div>

      <div style={{ height: '800px', background: 'var(--theme-surface-primary)' }} />
    </div>
  );
}

// Scroll-triggered animation demo
function AnimationDemo() {
  return (
    <div
      style={{
        height: '800px',
        width: '600px',
        overflow: 'auto',
        border: '2px solid var(--theme-border-primary)',
        borderRadius: '8px',
      }}
    >
      <div
        style={{
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--theme-background-primary)',
          color: 'var(--theme-text-secondary)',
        }}
      >
        Scroll down to trigger animations
      </div>

      <AnimatedItem delay={0}>First Item</AnimatedItem>
      <AnimatedItem delay={100}>Second Item</AnimatedItem>
      <AnimatedItem delay={200}>Third Item</AnimatedItem>
      <AnimatedItem delay={300}>Fourth Item</AnimatedItem>
      <AnimatedItem delay={400}>Fifth Item</AnimatedItem>
      <AnimatedItem delay={500}>Sixth Item</AnimatedItem>
      <AnimatedItem delay={600}>Seventh Item</AnimatedItem>
      <AnimatedItem delay={700}>Eighth Item</AnimatedItem>
      <AnimatedItem delay={800}>Ninth Item</AnimatedItem>
      <AnimatedItem delay={900}>Tenth Item</AnimatedItem>
      <AnimatedItem delay={1000}>Eleventh Item</AnimatedItem>
      <AnimatedItem delay={1100}>Twelfth Item</AnimatedItem>
      <div style={{ height: '100px' }} />
    </div>
  );
}

function AnimatedItem({ children, delay }: { children: React.ReactNode; delay: number }) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <Card
      ref={ref}
      variant="filled"
      padding="lg"
      style={{
        margin: '20px',
        background: 'var(--theme-primary)',
        color: 'var(--theme-text-on-primary)',
        fontWeight: 'bold',
        transform: isIntersecting ? 'translateX(0)' : 'translateX(-50px)',
        opacity: isIntersecting ? 1 : 0,
        transition: `all 0.5s ease ${delay}ms`,
      }}
    >
      {children}
    </Card>
  );
}

const meta: Meta = {
  title: 'Hooks/useIntersectionObserver',
  component: BasicDemo,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
\`useIntersectionObserver\` is a React hook that provides an easy-to-use wrapper around the Intersection Observer API for detecting when elements enter or leave the viewport.

## Features
- Simple ref-based API
- \`triggerOnce\` option for lazy loading (disconnects after first intersection)
- Multiple threshold support for scroll-based animations
- Full IntersectionObserver options (root, rootMargin, threshold)
- SSR safe

## Basic Usage

\`\`\`tsx
import { useIntersectionObserver } from '@true-tech-team/ui-components';

function LazyImage({ src }: { src: string }) {
  const { ref, isIntersecting } = useIntersectionObserver({
    triggerOnce: true,
    rootMargin: '100px',
  });

  return (
    <div ref={ref}>
      {isIntersecting ? <img src={src} /> : <Skeleton />}
    </div>
  );
}
\`\`\`

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| \`root\` | \`Element \\| null\` | \`null\` | Viewport element |
| \`rootMargin\` | \`string\` | \`'0px'\` | Margin around root |
| \`threshold\` | \`number \\| number[]\` | \`0\` | Visibility threshold(s) |
| \`onChange\` | \`(entry) => void\` | - | Callback on change |
| \`triggerOnce\` | \`boolean\` | \`false\` | Disconnect after first trigger |
| \`disabled\` | \`boolean\` | \`false\` | Disable observation |

## Return Value

| Property | Type | Description |
|----------|------|-------------|
| \`ref\` | \`(node) => void\` | Ref callback to attach |
| \`isIntersecting\` | \`boolean\` | Whether element is visible |
| \`entry\` | \`IntersectionObserverEntry\` | Full entry object |
| \`element\` | \`Element \\| null\` | The observed element |
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: 'Basic Visibility',
  render: () => <BasicDemo />,
};

export const LazyLoading: Story = {
  render: () => <LazyLoadDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Using `triggerOnce: true` for lazy loading content. Each card loads only when it enters the viewport.',
      },
    },
  },
};

export const MultipleThresholds: Story = {
  render: () => <ThresholdDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Using multiple thresholds (0-100%) to create a progressive opacity effect based on visibility.',
      },
    },
  },
};

export const ScrollAnimations: Story = {
  render: () => <AnimationDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Combining `triggerOnce` with CSS transitions for scroll-triggered animations with staggered delays.',
      },
    },
  },
};
