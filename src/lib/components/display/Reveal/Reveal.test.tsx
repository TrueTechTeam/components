import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { Reveal } from './Reveal';

// Mock IntersectionObserver
class MockIntersectionObserver {
  callback: IntersectionObserverCallback;
  options?: IntersectionObserverInit;

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.options = options;
  }

  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn(() => []);
}

let mockObserver: MockIntersectionObserver | null = null;

const triggerIntersection = (isIntersecting: boolean) => {
  if (mockObserver?.callback) {
    act(() => {
      const entries: IntersectionObserverEntry[] = [
        {
          isIntersecting,
          intersectionRatio: isIntersecting ? 1 : 0,
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          target: document.createElement('div'),
          time: Date.now(),
        },
      ];
      mockObserver!.callback(entries, mockObserver as unknown as IntersectionObserver);
    });
  }
};

describe('Reveal', () => {
  beforeEach(() => {
    mockObserver = null;
    global.IntersectionObserver = jest.fn((callback, options) => {
      mockObserver = new MockIntersectionObserver(callback, options);
      return mockObserver as unknown as IntersectionObserver;
    }) as unknown as typeof IntersectionObserver;

    global.requestAnimationFrame = jest.fn((cb) => {
      cb(0);
      return 0;
    });
    global.cancelAnimationFrame = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockObserver = null;
  });

  describe('rendering', () => {
    it('renders children', () => {
      render(<Reveal>Test Content</Reveal>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <Reveal className="custom-class" data-testid="reveal">
          Content
        </Reveal>
      );
      expect(screen.getByTestId('reveal')).toHaveClass('custom-class');
    });

    it('renders with animation attribute', () => {
      render(
        <Reveal animation="slideUp" data-testid="reveal">
          Content
        </Reveal>
      );
      expect(screen.getByTestId('reveal')).toHaveAttribute('data-animation', 'slideUp');
    });
  });

  describe('intersection behavior', () => {
    it('creates IntersectionObserver on mount', () => {
      render(<Reveal>Test</Reveal>);
      expect(global.IntersectionObserver).toHaveBeenCalled();
    });

    it('sets revealed state when intersecting', () => {
      render(<Reveal data-testid="reveal">Test</Reveal>);
      const element = screen.getByTestId('reveal');

      expect(element).not.toHaveAttribute('data-revealed');

      triggerIntersection(true);

      expect(element).toHaveAttribute('data-revealed', 'true');
    });

    it('calls onReveal callback when element intersects', () => {
      const onReveal = jest.fn();
      render(<Reveal onReveal={onReveal}>Test</Reveal>);

      triggerIntersection(true);

      expect(onReveal).toHaveBeenCalledTimes(1);
    });

    it('disconnects observer on unmount', () => {
      const { unmount } = render(<Reveal>Test</Reveal>);
      unmount();
      expect(mockObserver?.disconnect).toHaveBeenCalled();
    });
  });

  describe('triggerOnce', () => {
    it('disconnects observer after first trigger when triggerOnce is true', () => {
      render(<Reveal triggerOnce>Test</Reveal>);
      triggerIntersection(true);
      expect(mockObserver?.disconnect).toHaveBeenCalled();
    });

    it('does not disconnect observer when triggerOnce is false', () => {
      render(<Reveal triggerOnce={false}>Test</Reveal>);
      triggerIntersection(true);
      expect(mockObserver?.disconnect).not.toHaveBeenCalled();
    });
  });

  describe('initiallyVisible', () => {
    it('sets revealed state immediately when true', () => {
      render(
        <Reveal initiallyVisible data-testid="reveal">
          Test
        </Reveal>
      );
      expect(screen.getByTestId('reveal')).toHaveAttribute('data-revealed', 'true');
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Reveal ref={ref}>Test</Reveal>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('CSS variables', () => {
    it('sets duration CSS variable', () => {
      render(
        <Reveal duration={800} data-testid="reveal">
          Test
        </Reveal>
      );
      expect(screen.getByTestId('reveal')).toHaveStyle({ '--reveal-duration': '800ms' });
    });

    it('sets delay CSS variable', () => {
      render(
        <Reveal delay={200} data-testid="reveal">
          Test
        </Reveal>
      );
      expect(screen.getByTestId('reveal')).toHaveStyle({ '--reveal-delay': '200ms' });
    });
  });
});
