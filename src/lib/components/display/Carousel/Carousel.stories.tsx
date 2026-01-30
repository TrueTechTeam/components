import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Carousel } from './Carousel';
import { Button } from '../../buttons/Button';

const meta: Meta<typeof Carousel> = {
  title: 'Display/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  argTypes: {
    autoPlay: {
      control: 'boolean',
      description: 'Whether to auto-play the carousel',
    },
    autoPlayInterval: {
      control: { type: 'range', min: 1000, max: 10000, step: 500 },
      description: 'Auto-play interval in milliseconds',
    },
    pauseOnHover: {
      control: 'boolean',
      description: 'Pause auto-play on hover',
    },
    showDots: {
      control: 'boolean',
      description: 'Show navigation dots',
    },
    showArrows: {
      control: 'boolean',
      description: 'Show navigation arrows',
    },
    infinite: {
      control: 'boolean',
      description: 'Loop infinitely',
    },
    slidesToShow: {
      control: { type: 'range', min: 1, max: 5, step: 1 },
      description: 'Number of slides to show at once',
    },
    slidesToScroll: {
      control: { type: 'range', min: 1, max: 3, step: 1 },
      description: 'Number of slides to scroll at once',
    },
    gap: {
      control: 'text',
      description: 'Gap between slides',
    },
    transitionDuration: {
      control: { type: 'range', min: 100, max: 1000, step: 50 },
      description: 'Transition duration in milliseconds',
    },
    arrowsOutside: {
      control: 'boolean',
      description: 'Place arrows outside the carousel',
    },
    dotsPosition: {
      control: 'select',
      options: ['bottom', 'top'],
      description: 'Position of navigation dots',
    },
    onChange: { table: { disable: true } },
    activeIndex: { table: { disable: true } },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
    style: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Carousel>;

const DemoSlide = ({
  children,
  color = '#667eea',
  height = 200,
}: {
  children: React.ReactNode;
  color?: string;
  height?: number;
}) => (
  <div
    style={{
      height,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '12px',
      background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
      color: 'white',
      fontSize: '24px',
      fontWeight: 'bold',
    }}
  >
    {children}
  </div>
);

// 1. Default
export const Default: Story = {
  args: {
    children: [
      <DemoSlide key={1} color="#667eea">
        Slide 1
      </DemoSlide>,
      <DemoSlide key={2} color="#764ba2">
        Slide 2
      </DemoSlide>,
      <DemoSlide key={3} color="#f093fb">
        Slide 3
      </DemoSlide>,
      <DemoSlide key={4} color="#11998e">
        Slide 4
      </DemoSlide>,
    ],
  },
};

// 2. Auto-Play
export const AutoPlay: Story = {
  args: {
    autoPlay: true,
    autoPlayInterval: 3000,
    children: [
      <DemoSlide key={1} color="#667eea">
        Slide 1
      </DemoSlide>,
      <DemoSlide key={2} color="#764ba2">
        Slide 2
      </DemoSlide>,
      <DemoSlide key={3} color="#f093fb">
        Slide 3
      </DemoSlide>,
      <DemoSlide key={4} color="#11998e">
        Slide 4
      </DemoSlide>,
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Auto-playing carousel (pauses on hover).',
      },
    },
  },
};

// 3. Multiple Slides
export const MultipleSlides: Story = {
  args: {
    slidesToShow: 3,
    gap: '16px',
    children: [
      <DemoSlide key={1} color="#667eea" height={150}>
        1
      </DemoSlide>,
      <DemoSlide key={2} color="#764ba2" height={150}>
        2
      </DemoSlide>,
      <DemoSlide key={3} color="#f093fb" height={150}>
        3
      </DemoSlide>,
      <DemoSlide key={4} color="#11998e" height={150}>
        4
      </DemoSlide>,
      <DemoSlide key={5} color="#f5576c" height={150}>
        5
      </DemoSlide>,
      <DemoSlide key={6} color="#4facfe" height={150}>
        6
      </DemoSlide>,
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Carousel showing multiple slides at once.',
      },
    },
  },
};

// 4. No Infinite Loop
export const NoInfinite: Story = {
  args: {
    infinite: false,
    children: [
      <DemoSlide key={1} color="#667eea">
        Slide 1
      </DemoSlide>,
      <DemoSlide key={2} color="#764ba2">
        Slide 2
      </DemoSlide>,
      <DemoSlide key={3} color="#f093fb">
        Slide 3
      </DemoSlide>,
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Carousel without infinite looping - arrows disable at ends.',
      },
    },
  },
};

// 5. Arrows Outside
export const ArrowsOutside: Story = {
  args: {
    arrowsOutside: true,
    children: [
      <DemoSlide key={1} color="#667eea">
        Slide 1
      </DemoSlide>,
      <DemoSlide key={2} color="#764ba2">
        Slide 2
      </DemoSlide>,
      <DemoSlide key={3} color="#f093fb">
        Slide 3
      </DemoSlide>,
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Navigation arrows positioned outside the carousel.',
      },
    },
  },
};

// 6. Dots on Top
export const DotsOnTop: Story = {
  args: {
    dotsPosition: 'top',
    children: [
      <DemoSlide key={1} color="#667eea">
        Slide 1
      </DemoSlide>,
      <DemoSlide key={2} color="#764ba2">
        Slide 2
      </DemoSlide>,
      <DemoSlide key={3} color="#f093fb">
        Slide 3
      </DemoSlide>,
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Navigation dots positioned above the carousel.',
      },
    },
  },
};

// 7. No Navigation
export const NoNavigation: Story = {
  args: {
    showDots: false,
    showArrows: false,
    autoPlay: true,
    autoPlayInterval: 2000,
    children: [
      <DemoSlide key={1} color="#667eea">
        Slide 1
      </DemoSlide>,
      <DemoSlide key={2} color="#764ba2">
        Slide 2
      </DemoSlide>,
      <DemoSlide key={3} color="#f093fb">
        Slide 3
      </DemoSlide>,
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Carousel without visible navigation controls.',
      },
    },
  },
};

// 8. Controlled
const ControlledCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Button variant="outline" size="sm" onClick={() => setActiveIndex(0)}>
          Go to 1
        </Button>
        <Button variant="outline" size="sm" onClick={() => setActiveIndex(1)}>
          Go to 2
        </Button>
        <Button variant="outline" size="sm" onClick={() => setActiveIndex(2)}>
          Go to 3
        </Button>
        <span style={{ marginLeft: '8px', color: '#666' }}>Current: {activeIndex + 1}</span>
      </div>
      <Carousel activeIndex={activeIndex} onChange={setActiveIndex} infinite={false}>
        <DemoSlide color="#667eea">Slide 1</DemoSlide>
        <DemoSlide color="#764ba2">Slide 2</DemoSlide>
        <DemoSlide color="#f093fb">Slide 3</DemoSlide>
      </Carousel>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledCarousel />,
  parameters: {
    docs: {
      description: {
        story: 'Controlled carousel with external state management.',
      },
    },
  },
};

// 10. Image Gallery
export const ImageGallery: Story = {
  render: () => (
    <Carousel style={{ maxWidth: 600 }}>
      <div
        style={{
          height: 300,
          backgroundImage:
            'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '12px',
        }}
      />
      <div
        style={{
          height: 300,
          backgroundImage:
            'url(https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '12px',
        }}
      />
      <div
        style={{
          height: 300,
          backgroundImage:
            'url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '12px',
        }}
      />
    </Carousel>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Image gallery carousel.',
      },
    },
  },
};

// 11. Product Cards
export const ProductCards: Story = {
  render: () => (
    <Carousel slidesToShow={3} gap="24px" style={{ maxWidth: 800 }}>
      {[
        { name: 'Laptop', price: '$999', emoji: '💻' },
        { name: 'Headphones', price: '$299', emoji: '🎧' },
        { name: 'Camera', price: '$599', emoji: '📷' },
        { name: 'Watch', price: '$399', emoji: '⌚' },
        { name: 'Phone', price: '$799', emoji: '📱' },
        { name: 'Tablet', price: '$499', emoji: '📱' },
      ].map((product, index) => (
        <div
          key={index}
          style={{
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid var(--theme-border-primary)',
            textAlign: 'center',
            background: 'var(--theme-surface-primary)',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>{product.emoji}</div>
          <h3 style={{ margin: '0 0 8px', color: 'var(--theme-text-primary)' }}>{product.name}</h3>
          <p style={{ margin: 0, color: 'var(--theme-primary)', fontWeight: 'bold' }}>
            {product.price}
          </p>
        </div>
      ))}
    </Carousel>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Product cards carousel showing multiple items.',
      },
    },
  },
};

// 12. Testimonials
export const Testimonials: Story = {
  render: () => (
    <Carousel autoPlay autoPlayInterval={5000} style={{ maxWidth: 600, margin: '0 auto' }}>
      {[
        {
          quote: 'This product changed my life! Absolutely amazing experience.',
          author: 'Jane Doe',
          role: 'CEO at TechCorp',
        },
        {
          quote: 'Best decision I ever made. The team is incredibly supportive.',
          author: 'John Smith',
          role: 'Designer at Creative Co',
        },
        {
          quote: 'I recommend this to everyone I know. Simply outstanding.',
          author: 'Sarah Johnson',
          role: 'Developer at StartupXYZ',
        },
      ].map((testimonial, index) => (
        <div
          key={index}
          style={{
            padding: '48px 32px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            color: 'white',
          }}
        >
          <p style={{ fontSize: '18px', fontStyle: 'italic', margin: '0 0 24px', lineHeight: 1.6 }}>
            "{testimonial.quote}"
          </p>
          <div>
            <strong>{testimonial.author}</strong>
            <p style={{ margin: '4px 0 0', opacity: 0.8, fontSize: '14px' }}>{testimonial.role}</p>
          </div>
        </div>
      ))}
    </Carousel>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Testimonials carousel with auto-play.',
      },
    },
  },
};

// 13. Custom Transition Duration
export const CustomTransition: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#666' }}>Fast (100ms):</p>
        <Carousel transitionDuration={100}>
          <DemoSlide color="#667eea" height={120}>
            Slide 1
          </DemoSlide>
          <DemoSlide color="#764ba2" height={120}>
            Slide 2
          </DemoSlide>
          <DemoSlide color="#f093fb" height={120}>
            Slide 3
          </DemoSlide>
        </Carousel>
      </div>
      <div>
        <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#666' }}>Normal (300ms):</p>
        <Carousel transitionDuration={300}>
          <DemoSlide color="#667eea" height={120}>
            Slide 1
          </DemoSlide>
          <DemoSlide color="#764ba2" height={120}>
            Slide 2
          </DemoSlide>
          <DemoSlide color="#f093fb" height={120}>
            Slide 3
          </DemoSlide>
        </Carousel>
      </div>
      <div>
        <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#666' }}>Slow (800ms):</p>
        <Carousel transitionDuration={800}>
          <DemoSlide color="#667eea" height={120}>
            Slide 1
          </DemoSlide>
          <DemoSlide color="#764ba2" height={120}>
            Slide 2
          </DemoSlide>
          <DemoSlide color="#f093fb" height={120}>
            Slide 3
          </DemoSlide>
        </Carousel>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Different transition durations.',
      },
    },
  },
};

// 14. Playground
export const Playground: Story = {
  args: {
    autoPlay: false,
    autoPlayInterval: 5000,
    pauseOnHover: true,
    showDots: true,
    showArrows: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    gap: '16px',
    transitionDuration: 300,
    arrowsOutside: false,
    dotsPosition: 'bottom',
    children: [
      <DemoSlide key={1} color="#667eea">
        Slide 1
      </DemoSlide>,
      <DemoSlide key={2} color="#764ba2">
        Slide 2
      </DemoSlide>,
      <DemoSlide key={3} color="#f093fb">
        Slide 3
      </DemoSlide>,
      <DemoSlide key={4} color="#11998e">
        Slide 4
      </DemoSlide>,
      <DemoSlide key={5} color="#f5576c">
        Slide 5
      </DemoSlide>,
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all component props.',
      },
    },
  },
};
