import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { useRef, useState } from 'react';
import { ScrollArea, type ScrollAreaRef } from './ScrollArea';
import { Button } from '../../buttons/Button';

const meta: Meta<typeof ScrollArea> = {
  title: 'Display/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['vertical', 'horizontal', 'both'],
      description: 'Scroll direction',
    },
    maxHeight: {
      control: 'text',
      description: 'Maximum height (enables vertical scroll)',
    },
    maxWidth: {
      control: 'text',
      description: 'Maximum width (enables horizontal scroll)',
    },
    showShadows: {
      control: 'boolean',
      description: 'Show shadow indicators at scroll edges',
    },
    scrollEndThreshold: {
      control: 'number',
      description: 'Threshold in pixels for scroll end callbacks',
    },
    // Disable complex props
    onScroll: { table: { disable: true } },
    onScrollToTop: { table: { disable: true } },
    onScrollToBottom: { table: { disable: true } },
    onScrollToLeft: { table: { disable: true } },
    onScrollToRight: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
    children: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

// Sample content generator
const generateParagraphs = (count: number) =>
  Array.from({ length: count }, (_, i) => (
    <p key={i} style={{ margin: '0 0 16px 0' }}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
      laboris.
    </p>
  ));

const generateItems = (count: number) =>
  Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--theme-border-primary)',
      }}
    >
      Item {i + 1}
    </div>
  ));

/**
 * Default vertical scroll area
 */
export const Default: Story = {
  render: (args) => (
    <ScrollArea {...args} maxHeight={300} onScroll={action('onScroll')}>
      {generateParagraphs(10)}
    </ScrollArea>
  ),
};

/**
 * Horizontal scroll area
 */
export const Horizontal: Story = {
  render: () => (
    <ScrollArea direction="horizontal" maxWidth={400}>
      <div style={{ display: 'flex', gap: '16px', padding: '16px', width: 'max-content' }}>
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            style={{
              minWidth: '150px',
              height: '100px',
              background: 'var(--theme-background-secondary)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Card {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Both directions scroll
 */
export const BothDirections: Story = {
  render: () => (
    <ScrollArea direction="both" maxHeight={300} maxWidth={400}>
      <div style={{ width: '800px', padding: '16px' }}>{generateParagraphs(15)}</div>
    </ScrollArea>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * With shadow indicators
 */
export const WithShadows: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px' }}>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          Vertical shadows
        </p>
        <ScrollArea maxHeight={200} showShadows style={{ width: '250px' }}>
          {generateItems(20)}
        </ScrollArea>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: 'var(--theme-text-secondary)' }}>
          Horizontal shadows
        </p>
        <ScrollArea direction="horizontal" maxWidth={300} showShadows>
          <div style={{ display: 'flex', gap: '16px', padding: '16px', width: 'max-content' }}>
            {Array.from({ length: 15 }, (_, i) => (
              <div
                key={i}
                style={{
                  minWidth: '100px',
                  height: '80px',
                  background: 'var(--theme-background-secondary)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Scroll callbacks
 */
export const ScrollCallbacks: Story = {
  render: () => (
    <div>
      <p style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--theme-text-secondary)' }}>
        Scroll to top/bottom to see callbacks triggered in the Actions panel
      </p>
      <ScrollArea
        maxHeight={200}
        style={{ width: '300px' }}
        onScroll={action('onScroll')}
        onScrollToTop={action('onScrollToTop')}
        onScrollToBottom={action('onScrollToBottom')}
      >
        {generateItems(30)}
      </ScrollArea>
    </div>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Programmatic scroll control
 */
const ProgrammaticExample = () => {
  const scrollRef = useRef<ScrollAreaRef>(null);

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <Button size="sm" onClick={() => scrollRef.current?.scrollToTop()}>
          Scroll to Top
        </Button>
        <Button size="sm" onClick={() => scrollRef.current?.scrollToBottom()}>
          Scroll to Bottom
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => scrollRef.current?.scrollTo({ top: 200, behavior: 'smooth' })}
        >
          Scroll to 200px
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            const pos = scrollRef.current?.getScrollPosition();
            alert(`Current position: ${pos?.scrollTop}px`);
          }}
        >
          Get Position
        </Button>
      </div>
      <ScrollArea ref={scrollRef} maxHeight={250} style={{ width: '400px' }}>
        {generateItems(50)}
      </ScrollArea>
    </div>
  );
};

export const ProgrammaticControl: Story = {
  render: () => <ProgrammaticExample />,
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Infinite scroll example
 */
const InfiniteScrollExample = () => {
  const [items, setItems] = useState(() => Array.from({ length: 20 }, (_, i) => i + 1));
  const [loading, setLoading] = useState(false);

  const loadMore = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setItems((prev) => [...prev, ...Array.from({ length: 10 }, (_, i) => prev.length + i + 1)]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div>
      <p style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--theme-text-secondary)' }}>
        Scroll to bottom to load more items
      </p>
      <ScrollArea maxHeight={300} style={{ width: '300px' }} onScrollToBottom={loadMore}>
        {items.map((item) => (
          <div
            key={item}
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--theme-border-primary)',
            }}
          >
            Item {item}
          </div>
        ))}
        {loading && (
          <div
            style={{ padding: '16px', textAlign: 'center', color: 'var(--theme-text-secondary)' }}
          >
            Loading...
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export const InfiniteScroll: Story = {
  render: () => <InfiniteScrollExample />,
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Chat messages example
 */
export const ChatExample: Story = {
  render: () => {
    const messages = [
      { id: 1, sender: 'user', text: 'Hello!' },
      { id: 2, sender: 'bot', text: 'Hi there! How can I help you today?' },
      { id: 3, sender: 'user', text: 'I have a question about the product.' },
      {
        id: 4,
        sender: 'bot',
        text: 'Sure, I would be happy to help! What would you like to know?',
      },
      { id: 5, sender: 'user', text: 'What are the key features?' },
      {
        id: 6,
        sender: 'bot',
        text: 'The key features include: real-time sync, collaborative editing, and advanced analytics.',
      },
      { id: 7, sender: 'user', text: 'That sounds great!' },
      { id: 8, sender: 'bot', text: 'Is there anything else you would like to know?' },
      { id: 9, sender: 'user', text: 'What about pricing?' },
      { id: 10, sender: 'bot', text: 'We offer flexible pricing plans starting from $9/month.' },
    ];

    return (
      <ScrollArea
        maxHeight={400}
        style={{
          width: '350px',
          border: '1px solid var(--theme-border-primary)',
          borderRadius: '8px',
        }}
        showShadows
      >
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                padding: '8px 12px',
                borderRadius: '12px',
                background:
                  msg.sender === 'user'
                    ? 'var(--theme-primary)'
                    : 'var(--theme-background-secondary)',
                color:
                  msg.sender === 'user'
                    ? 'var(--theme-text-on-primary)'
                    : 'var(--theme-text-primary)',
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  },
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Interactive playground
 */
export const Playground: Story = {
  render: (args) => (
    <ScrollArea {...args} onScroll={action('onScroll')}>
      {generateParagraphs(15)}
    </ScrollArea>
  ),
  args: {
    direction: 'vertical',
    maxHeight: '300px',
    showShadows: false,
    scrollEndThreshold: 10,
  },
};
