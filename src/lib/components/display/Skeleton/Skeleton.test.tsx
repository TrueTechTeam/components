import React from 'react';
import { render } from '@testing-library/react';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  describe('rendering', () => {
    it('renders with default props', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.querySelector('[data-component="skeleton"]');
      expect(skeleton).toBeInTheDocument();
    });

    it('renders with custom dimensions', () => {
      const { container } = render(<Skeleton width="200px" height="100px" />);
      const skeleton = container.querySelector('[data-component="skeleton"]') as HTMLElement;
      expect(skeleton).toHaveStyle({ width: '200px', height: '100px' });
    });

    it('renders multiple lines for text variant', () => {
      const { container } = render(<Skeleton variant="text" lines={3} />);
      const skeletons = container.querySelectorAll('[data-component="skeleton"]');
      expect(skeletons).toHaveLength(3);
    });
  });

  describe('variants', () => {
    it('renders text variant by default', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.querySelector('[data-component="skeleton"]');
      expect(skeleton).toHaveAttribute('data-variant', 'text');
    });

    it.each(['text', 'circular', 'rectangular', 'rounded'] as const)(
      'renders %s variant',
      (variant) => {
        const { container } = render(<Skeleton variant={variant} />);
        const skeleton = container.querySelector('[data-component="skeleton"]');
        expect(skeleton).toHaveAttribute('data-variant', variant);
      }
    );
  });

  describe('animation', () => {
    it('is animated by default', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.querySelector('[data-component="skeleton"]');
      expect(skeleton).toHaveAttribute('data-animated', 'true');
    });

    it('can disable animation', () => {
      const { container } = render(<Skeleton animated={false} />);
      const skeleton = container.querySelector('[data-component="skeleton"]');
      expect(skeleton).not.toHaveAttribute('data-animated');
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Skeleton ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
