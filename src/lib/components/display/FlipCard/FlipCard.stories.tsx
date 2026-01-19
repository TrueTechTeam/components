import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FlipCard } from './FlipCard';
import { Button } from '../../buttons/Button';

const meta: Meta<typeof FlipCard> = {
  title: 'Display/FlipCard',
  component: FlipCard,
  tags: ['autodocs'],
  argTypes: {
    flipTrigger: {
      control: 'select',
      options: ['click', 'hover', 'manual'],
      description: 'How the flip is triggered',
    },
    flipDirection: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Direction of the flip animation',
    },
    duration: {
      control: { type: 'range', min: 200, max: 1500, step: 100 },
      description: 'Animation duration in milliseconds',
    },
    perspective: {
      control: { type: 'range', min: 500, max: 2000, step: 100 },
      description: 'Perspective distance for 3D effect',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the card is disabled',
    },
    height: {
      control: 'text',
      description: 'Fixed height for the card',
    },
    width: {
      control: 'text',
      description: 'Fixed width for the card',
    },
    onFlipChange: { table: { disable: true } },
    onFlipStart: { table: { disable: true } },
    onFlipEnd: { table: { disable: true } },
    isFlipped: { table: { disable: true } },
    front: { table: { disable: true } },
    back: { table: { disable: true } },
    className: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
    style: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof FlipCard>;

const FrontContent = ({ title = 'Front Side', subtitle = 'Click to flip' }) => (
  <div
    style={{
      padding: 24,
      textAlign: 'center',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <h3 style={{ margin: '0 0 8px' }}>{title}</h3>
    <p style={{ margin: 0, color: '#666' }}>{subtitle}</p>
  </div>
);

const BackContent = ({ title = 'Back Side', subtitle = 'Click to flip back' }) => (
  <div
    style={{
      padding: 24,
      textAlign: 'center',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
    }}
  >
    <h3 style={{ margin: '0 0 8px' }}>{title}</h3>
    <p style={{ margin: 0, opacity: 0.9 }}>{subtitle}</p>
  </div>
);

// 1. Default story
export const Default: Story = {
  args: {
    front: <FrontContent />,
    back: <BackContent />,
    height: 200,
    width: 300,
  },
};

// 2. Hover Trigger
export const HoverTrigger: Story = {
  args: {
    front: <FrontContent title="Hover Me" subtitle="Hover to reveal" />,
    back: <BackContent title="Hidden Content" subtitle="Move mouse away to flip back" />,
    flipTrigger: 'hover',
    height: 200,
    width: 300,
  },
  parameters: {
    docs: {
      description: {
        story: 'Card that flips on mouse hover.',
      },
    },
  },
};

// 3. Vertical Flip
export const VerticalFlip: Story = {
  args: {
    front: <FrontContent title="Front" subtitle="Click for vertical flip" />,
    back: <BackContent title="Back" subtitle="Flips on X-axis" />,
    flipDirection: 'vertical',
    height: 200,
    width: 300,
  },
  parameters: {
    docs: {
      description: {
        story: 'Card that flips vertically (X-axis rotation).',
      },
    },
  },
};

// 4. Controlled Mode
const ControlledFlipCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <Button variant="outline" size="sm" onClick={() => setIsFlipped(!isFlipped)}>
        Toggle Flip (currently: {isFlipped ? 'flipped' : 'not flipped'})
      </Button>
      <FlipCard
        front={<FrontContent title="Controlled" subtitle="Use button above" />}
        back={<BackContent title="Controlled" subtitle="Use button above" />}
        isFlipped={isFlipped}
        onFlipChange={setIsFlipped}
        flipTrigger="manual"
        height={200}
        width={300}
      />
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledFlipCard />,
  parameters: {
    docs: {
      description: {
        story: 'Controlled mode with external state management.',
      },
    },
  },
};

// 5. With Callbacks
export const WithCallbacks: Story = {
  render: () => (
    <FlipCard
      front={<FrontContent title="Check Console" subtitle="Click to see callbacks" />}
      back={<BackContent title="Callbacks Fired" subtitle="Check your console" />}
      onFlipStart={(toFlipped) => console.log('Flip started, going to:', toFlipped)}
      onFlipEnd={(isFlipped) => console.log('Flip ended, now:', isFlipped)}
      height={200}
      width={300}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card with animation lifecycle callbacks (check console).',
      },
    },
  },
};

// 6. Custom Duration
export const CustomDuration: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      <div style={{ textAlign: 'center' }}>
        <FlipCard
          front={<FrontContent title="Fast" subtitle="200ms" />}
          back={<BackContent title="Fast" subtitle="200ms" />}
          duration={200}
          height={150}
          width={200}
        />
        <p style={{ marginTop: 8 }}>200ms</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <FlipCard
          front={<FrontContent title="Normal" subtitle="600ms" />}
          back={<BackContent title="Normal" subtitle="600ms" />}
          duration={600}
          height={150}
          width={200}
        />
        <p style={{ marginTop: 8 }}>600ms (default)</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <FlipCard
          front={<FrontContent title="Slow" subtitle="1200ms" />}
          back={<BackContent title="Slow" subtitle="1200ms" />}
          duration={1200}
          height={150}
          width={200}
        />
        <p style={{ marginTop: 8 }}>1200ms</p>
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

// 7. Disabled
export const Disabled: Story = {
  args: {
    front: <FrontContent title="Disabled" subtitle="Cannot flip" />,
    back: <BackContent />,
    disabled: true,
    height: 200,
    width: 300,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled card that cannot be flipped.',
      },
    },
  },
};

// 8. Product Card Example
export const ProductCard: Story = {
  render: () => (
    <FlipCard
      front={
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              height: 150,
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 48,
            }}
          >
            📱
          </div>
          <div style={{ padding: 16, flex: 1 }}>
            <h3 style={{ margin: '0 0 8px' }}>Premium Headphones</h3>
            <p style={{ margin: 0, color: '#666', fontSize: 14 }}>Click for details</p>
            <p style={{ margin: '8px 0 0', fontWeight: 'bold', color: '#2196f3' }}>$299.99</p>
          </div>
        </div>
      }
      back={
        <div style={{ padding: 20, height: '100%', boxSizing: 'border-box' }}>
          <h3 style={{ margin: '0 0 12px' }}>Product Details</h3>
          <ul style={{ margin: 0, padding: '0 0 0 20px', fontSize: 14, lineHeight: 1.8 }}>
            <li>Active Noise Cancellation</li>
            <li>40-hour battery life</li>
            <li>Bluetooth 5.0</li>
            <li>Premium leather cushions</li>
            <li>2-year warranty</li>
          </ul>
          <Button
            variant="primary"
            size="sm"
            style={{ marginTop: 16 }}
            onClick={(e) => {
              e.stopPropagation();
              alert('Added to cart!');
            }}
          >
            Add to Cart
          </Button>
        </div>
      }
      height={280}
      width={250}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Real-world example: product card with details on the back.',
      },
    },
  },
};

// 9. Profile Card Example
export const ProfileCard: Story = {
  render: () => (
    <FlipCard
      flipTrigger="hover"
      front={
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 32,
              fontWeight: 'bold',
              marginBottom: 16,
            }}
          >
            JD
          </div>
          <h3 style={{ margin: '0 0 4px' }}>Jane Doe</h3>
          <p style={{ margin: 0, color: '#666', fontSize: 14 }}>Product Designer</p>
        </div>
      }
      back={
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <p style={{ margin: '0 0 16px', textAlign: 'center', fontSize: 14 }}>
            5+ years creating beautiful user experiences for startups and enterprises.
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            <span style={{ cursor: 'pointer' }}>🐦</span>
            <span style={{ cursor: 'pointer' }}>💼</span>
            <span style={{ cursor: 'pointer' }}>📧</span>
          </div>
        </div>
      }
      height={250}
      width={220}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Profile card that reveals contact info on hover.',
      },
    },
  },
};

// 10. Custom Styling
export const CustomStyling: Story = {
  render: () => (
    <FlipCard
      front={
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
            color: 'white',
          }}
        >
          <h3>Custom Styled</h3>
        </div>
      }
      back={
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #5f27cd 0%, #341f97 100%)',
            color: 'white',
          }}
        >
          <h3>Colorful Back</h3>
        </div>
      }
      style={
        {
          '--flipcard-border-radius': '24px',
          '--flipcard-shadow': '0 10px 30px rgba(0,0,0,0.2)',
        } as React.CSSProperties
      }
      height={200}
      width={300}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Customized using CSS variables.',
      },
    },
  },
};

// 11. Playground
export const Playground: Story = {
  args: {
    front: <FrontContent />,
    back: <BackContent />,
    flipTrigger: 'click',
    flipDirection: 'horizontal',
    duration: 600,
    perspective: 1000,
    disabled: false,
    height: 200,
    width: 300,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all component props.',
      },
    },
  },
};
