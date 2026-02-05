import React from 'react';
import { render } from '@testing-library/react';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  // 1. Rendering tests
  describe('rendering', () => {
    it('renders with default props', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.querySelector('[data-component="skeleton"]');
      expect(skeleton).toBeInTheDocument();
    });

    it('renders with all props', () => {
      const { container } = render(
        <Skeleton
          variant="rectangular"
          width="300px"
          height="150px"
          animated={false}
          className="custom-class"
          data-testid="test-skeleton"
        />
      );

      const skeleton = container.querySelector('[data-component="skeleton"]') as HTMLElement;
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('custom-class');
      expect(skeleton).toHaveAttribute('data-testid', 'test-skeleton');
    });

    it('renders with custom dimensions', () => {
      const { container } = render(<Skeleton width="200px" height="100px" />);
      const skeleton = container.querySelector('[data-component="skeleton"]') as HTMLElement;
      expect(skeleton).toHaveStyle({ width: '200px', height: '100px' });
    });

    it('renders with numeric dimensions', () => {
      const { container } = render(<Skeleton width={300} height={150} />);
      const skeleton = container.querySelector('[data-component="skeleton"]') as HTMLElement;
      expect(skeleton).toHaveStyle({ width: '300px', height: '150px' });
    });

    it('applies custom className', () => {
      const { container } = render(<Skeleton className="custom-skeleton" />);
      const skeleton = container.querySelector('[data-component="skeleton"]');
      expect(skeleton).toHaveClass('custom-skeleton');
    });

    it('applies custom style', () => {
      const { container } = render(
        <Skeleton style={{ backgroundColor: 'red', borderRadius: '10px' }} />
      );
      const skeleton = container.querySelector('[data-component="skeleton"]') as HTMLElement;
      expect(skeleton).toHaveStyle({ backgroundColor: 'red', borderRadius: '10px' });
    });

    it('renders multiple lines for text variant', () => {
      const { container } = render(<Skeleton variant="text" lines={3} />);
      const skeletons = container.querySelectorAll('[data-component="skeleton"]');
      expect(skeletons).toHaveLength(3);
    });

    it('renders skeleton group for multiple lines', () => {
      const { container } = render(<Skeleton variant="text" lines={3} />);
      const skeletonGroup = container.querySelector('[data-component="skeleton-group"]');
      expect(skeletonGroup).toBeInTheDocument();
    });

    it('renders last line at 80% width for multiple text lines', () => {
      const { container } = render(<Skeleton variant="text" lines={3} />);
      const skeletons = container.querySelectorAll('[data-component="skeleton"]');
      const lastSkeleton = skeletons[2] as HTMLElement;
      expect(lastSkeleton).toHaveStyle({ width: '80%' });
    });

    it('renders first and middle lines at 100% width for multiple text lines', () => {
      const { container } = render(<Skeleton variant="text" lines={3} />);
      const skeletons = container.querySelectorAll('[data-component="skeleton"]');
      const firstSkeleton = skeletons[0] as HTMLElement;
      const secondSkeleton = skeletons[1] as HTMLElement;
      expect(firstSkeleton).toHaveStyle({ width: '100%' });
      expect(secondSkeleton).toHaveStyle({ width: '100%' });
    });
  });

  // 2. Variant tests
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

    it('renders text variant with correct data attribute', () => {
      const { container } = render(<Skeleton variant="text" />);
      const skeleton = container.querySelector('[data-component="skeleton"]');
      expect(skeleton).toHaveAttribute('data-variant', 'text');
    });

    it('renders circular variant with correct data attribute', () => {
      const { container } = render(<Skeleton variant="circular" />);
      const skeleton = container.querySelector('[data-component="skeleton"]');
      expect(skeleton).toHaveAttribute('data-variant', 'circular');
    });

    it('renders rectangular variant with correct data attribute', () => {
      const { container } = render(<Skeleton variant="rectangular" />);
      const skeleton = container.querySelector('[data-component="skeleton"]');
      expect(skeleton).toHaveAttribute('data-variant', 'rectangular');
    });

    it('renders rounded variant with correct data attribute', () => {
      const { container } = render(<Skeleton variant="rounded" />);
      const skeleton = container.querySelector('[data-component="skeleton"]');
      expect(skeleton).toHaveAttribute('data-variant', 'rounded');
    });
  });

  // 3. Default height tests
  describe('default heights', () => {
    it('uses 1em height for text variant by default', () => {
      const { container } = render(<Skeleton variant="text" />);
      const skeleton = container.querySelector('[data-component="skeleton"]') as HTMLElement;
      expect(skeleton).toHaveStyle({ height: '1em' });
    });

    it('uses width as height for circular variant by default', () => {
      const { container } = render(<Skeleton variant="circular" width="50px" />);
      const skeleton = container.querySelector('[data-component="skeleton"]') as HTMLElement;
      expect(skeleton).toHaveStyle({ width: '50px', height: '50px' });
    });

    it('uses 200px height for rounded variant by default', () => {
      const { container } = render(<Skeleton variant="rounded" />);
      const skeleton = container.querySelector('[data-component="skeleton"]') as HTMLElement;
      expect(skeleton).toHaveStyle({ height: '200px' });
    });

    it('uses 100px height for rectangular variant by default', () => {
      const { container } = render(<Skeleton variant="rectangular" />);
      const skeleton = container.querySelector('[data-component="skeleton"]') as HTMLElement;
      expect(skeleton).toHaveStyle({ height: '100px' });
    });

    it('overrides default height when height prop is provided', () => {
      const { container } = render(<Skeleton variant="text" height="50px" />);
      const skeleton = container.querySelector('[data-component="skeleton"]') as HTMLElement;
      expect(skeleton).toHaveStyle({ height: '50px' });
    });
  });

  // 4. Width tests
  describe('width', () => {
    it('uses 100% width by default', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.querySelector('[data-component="skeleton"]') as HTMLElement;
      expect(skeleton).toHaveStyle({ width: '100%' });
    });

    it('applies custom width', () => {
      const { container } = render(<Skeleton width="250px" />);
      const skeleton = container.querySelector('[data-component="skeleton"]') as HTMLElement;
      expect(skeleton).toHaveStyle({ width: '250px' });
    });

    it('applies numeric width', () => {
      const { container } = render(<Skeleton width={400} />);
      const skeleton = container.querySelector('[data-component="skeleton"]') as HTMLElement;
      expect(skeleton).toHaveStyle({ width: '400px' });
    });
  });

  // 5. Animation tests
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

    it('explicitly enables animation when animated is true', () => {
      const { container } = render(<Skeleton animated />);
      const skeleton = container.querySelector('[data-component="skeleton"]');
      expect(skeleton).toHaveAttribute('data-animated', 'true');
    });

    it('applies animation to all lines in multi-line text', () => {
      const { container } = render(<Skeleton variant="text" lines={3} animated />);
      const skeletons = container.querySelectorAll('[data-component="skeleton"]');
      skeletons.forEach((skeleton) => {
        expect(skeleton).toHaveAttribute('data-animated', 'true');
      });
    });

    it('disables animation on all lines when animated is false', () => {
      const { container } = render(<Skeleton variant="text" lines={3} animated={false} />);
      const skeletons = container.querySelectorAll('[data-component="skeleton"]');
      skeletons.forEach((skeleton) => {
        expect(skeleton).not.toHaveAttribute('data-animated');
      });
    });
  });

  // 6. Lines tests
  describe('lines', () => {
    it('renders single line by default', () => {
      const { container } = render(<Skeleton variant="text" />);
      const skeletons = container.querySelectorAll('[data-component="skeleton"]');
      expect(skeletons).toHaveLength(1);
    });

    it('renders specified number of lines', () => {
      const { container } = render(<Skeleton variant="text" lines={5} />);
      const skeletons = container.querySelectorAll('[data-component="skeleton"]');
      expect(skeletons).toHaveLength(5);
    });

    it('renders single skeleton for non-text variant even with lines prop', () => {
      const { container } = render(<Skeleton variant="circular" lines={3} />);
      const skeletons = container.querySelectorAll('[data-component="skeleton"]');
      expect(skeletons).toHaveLength(1);
    });

    it('renders single skeleton for rectangular variant even with lines prop', () => {
      const { container } = render(<Skeleton variant="rectangular" lines={3} />);
      const skeletons = container.querySelectorAll('[data-component="skeleton"]');
      expect(skeletons).toHaveLength(1);
    });

    it('ignores lines prop when lines is 1', () => {
      const { container } = render(<Skeleton variant="text" lines={1} />);
      const skeletons = container.querySelectorAll('[data-component="skeleton"]');
      expect(skeletons).toHaveLength(1);
      const skeletonGroup = container.querySelector('[data-component="skeleton-group"]');
      expect(skeletonGroup).not.toBeInTheDocument();
    });

    it('renders skeleton group only when lines > 1', () => {
      const { container } = render(<Skeleton variant="text" lines={2} />);
      const skeletonGroup = container.querySelector('[data-component="skeleton-group"]');
      expect(skeletonGroup).toBeInTheDocument();
    });
  });

  // 7. Accessibility tests
  describe('accessibility', () => {
    it('includes data-component attribute', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.querySelector('[data-component="skeleton"]');
      expect(skeleton).toHaveAttribute('data-component', 'skeleton');
    });

    it('includes data-component attribute on skeleton group', () => {
      const { container } = render(<Skeleton variant="text" lines={3} />);
      const skeletonGroup = container.querySelector('[data-component="skeleton-group"]');
      expect(skeletonGroup).toHaveAttribute('data-component', 'skeleton-group');
    });

    it('accepts aria-label', () => {
      const { container } = render(<Skeleton aria-label="Loading content" />);
      const skeleton = container.querySelector('[data-component="skeleton"]');
      expect(skeleton).toHaveAttribute('aria-label', 'Loading content');
    });

    it('accepts aria-labelledby', () => {
      const { container } = render(<Skeleton aria-labelledby="loading-label" />);
      const skeleton = container.querySelector('[data-component="skeleton"]');
      expect(skeleton).toHaveAttribute('aria-labelledby', 'loading-label');
    });

    it('accepts role attribute', () => {
      const { container } = render(<Skeleton role="progressbar" />);
      const skeleton = container.querySelector('[data-component="skeleton"]');
      expect(skeleton).toHaveAttribute('role', 'progressbar');
    });
  });

  // 8. Ref forwarding
  describe('ref forwarding', () => {
    it('forwards ref to element for single skeleton', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Skeleton ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute('data-component', 'skeleton');
    });

    it('forwards ref to skeleton group for multiple lines', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Skeleton variant="text" lines={3} ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute('data-component', 'skeleton-group');
    });
  });

  // 9. Edge cases
  describe('edge cases', () => {
    it('handles zero lines by rendering single skeleton', () => {
      const { container } = render(<Skeleton variant="text" lines={0} />);
      const skeletons = container.querySelectorAll('[data-component="skeleton"]');
      // Array.from({ length: 0 }) creates empty array, so multiline rendering is skipped
      // Falls through to single skeleton render
      expect(skeletons).toHaveLength(1);
    });

    it('handles negative lines by rendering single skeleton', () => {
      const { container } = render(<Skeleton variant="text" lines={-1} />);
      const skeletons = container.querySelectorAll('[data-component="skeleton"]');
      // Array.from({ length: -1 }) creates empty array, so multiline rendering is skipped
      // Falls through to single skeleton render
      expect(skeletons).toHaveLength(1);
    });

    it('handles zero width', () => {
      const { container } = render(<Skeleton width={0} />);
      const skeleton = container.querySelector('[data-component="skeleton"]') as HTMLElement;
      expect(skeleton).toHaveStyle({ width: '0' });
    });

    it('handles zero height by using default height', () => {
      const { container } = render(<Skeleton height={0} />);
      const skeleton = container.querySelector('[data-component="skeleton"]') as HTMLElement;
      // When height is 0 (falsy), component uses default height logic which is '1em' for text variant
      expect(skeleton).toHaveStyle({ height: '1em' });
    });

    it('merges custom styles with component styles', () => {
      const { container } = render(
        <Skeleton width="200px" height="100px" style={{ margin: '10px', padding: '5px' }} />
      );
      const skeleton = container.querySelector('[data-component="skeleton"]') as HTMLElement;
      expect(skeleton).toHaveStyle({
        width: '200px',
        height: '100px',
        margin: '10px',
        padding: '5px',
      });
    });

    it('custom style overrides width and height props', () => {
      const { container } = render(
        <Skeleton width="200px" height="100px" style={{ width: '300px', height: '150px' }} />
      );
      const skeleton = container.querySelector('[data-component="skeleton"]') as HTMLElement;
      expect(skeleton).toHaveStyle({ width: '300px', height: '150px' });
    });
  });

  // 10. Component attributes
  describe('component attributes', () => {
    it('passes through data-testid', () => {
      const { container } = render(<Skeleton data-testid="my-skeleton" />);
      const skeleton = container.querySelector('[data-testid="my-skeleton"]');
      expect(skeleton).toBeInTheDocument();
    });

    it('passes through additional HTML attributes', () => {
      const { container } = render(<Skeleton id="skeleton-id" title="Loading" />);
      const skeleton = container.querySelector('[data-component="skeleton"]');
      expect(skeleton).toHaveAttribute('id', 'skeleton-id');
      expect(skeleton).toHaveAttribute('title', 'Loading');
    });

    it('passes through additional HTML attributes to skeleton group', () => {
      const { container } = render(
        <Skeleton variant="text" lines={3} id="skeleton-group-id" title="Loading lines" />
      );
      const skeletonGroup = container.querySelector('[data-component="skeleton-group"]');
      expect(skeletonGroup).toHaveAttribute('id', 'skeleton-group-id');
      expect(skeletonGroup).toHaveAttribute('title', 'Loading lines');
    });
  });

  // 11. DisplayName
  describe('displayName', () => {
    it('has correct displayName', () => {
      expect(Skeleton.displayName).toBe('Skeleton');
    });
  });
});
