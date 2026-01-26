import { render, screen, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import { ScrollArea, type ScrollAreaRef } from './ScrollArea';

describe('ScrollArea', () => {
  describe('rendering', () => {
    it('should render children', () => {
      render(
        <ScrollArea>
          <p>Test content</p>
        </ScrollArea>
      );
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should render with default data-testid', () => {
      render(<ScrollArea>Content</ScrollArea>);
      expect(screen.getByTestId('scroll-area')).toBeInTheDocument();
    });

    it('should render with custom data-testid', () => {
      render(<ScrollArea data-testid="custom-scroll">Content</ScrollArea>);
      expect(screen.getByTestId('custom-scroll')).toBeInTheDocument();
    });
  });

  describe('data attributes', () => {
    it('should set data-direction', () => {
      render(<ScrollArea direction="horizontal">Content</ScrollArea>);
      expect(screen.getByTestId('scroll-area')).toHaveAttribute('data-direction', 'horizontal');
    });

    it('should set data-visibility', () => {
      render(<ScrollArea scrollbarVisibility="hover">Content</ScrollArea>);
      expect(screen.getByTestId('scroll-area')).toHaveAttribute('data-visibility', 'hover');
    });

    it('should set data-size', () => {
      render(<ScrollArea scrollbarSize="lg">Content</ScrollArea>);
      expect(screen.getByTestId('scroll-area')).toHaveAttribute('data-size', 'lg');
    });

    it('should set data-thin when thin is true', () => {
      render(<ScrollArea thin>Content</ScrollArea>);
      expect(screen.getByTestId('scroll-area')).toHaveAttribute('data-thin', 'true');
    });

    it('should set data-shadow when showShadows is true', () => {
      render(<ScrollArea showShadows>Content</ScrollArea>);
      expect(screen.getByTestId('scroll-area')).toHaveAttribute('data-shadow', 'true');
    });

    it('should set data-at-top initially', () => {
      render(<ScrollArea>Content</ScrollArea>);
      expect(screen.getByTestId('scroll-area')).toHaveAttribute('data-at-top', 'true');
    });

    it('should set data-at-left initially', () => {
      render(<ScrollArea>Content</ScrollArea>);
      expect(screen.getByTestId('scroll-area')).toHaveAttribute('data-at-left', 'true');
    });
  });

  describe('styles', () => {
    it('should apply maxHeight as CSS variable', () => {
      render(<ScrollArea maxHeight={300}>Content</ScrollArea>);
      const scrollArea = screen.getByTestId('scroll-area');
      expect(scrollArea.style.getPropertyValue('--scroll-area-max-height')).toBe('300px');
    });

    it('should apply maxHeight string directly', () => {
      render(<ScrollArea maxHeight="50vh">Content</ScrollArea>);
      const scrollArea = screen.getByTestId('scroll-area');
      expect(scrollArea.style.getPropertyValue('--scroll-area-max-height')).toBe('50vh');
    });

    it('should apply maxWidth as CSS variable', () => {
      render(<ScrollArea maxWidth={500}>Content</ScrollArea>);
      const scrollArea = screen.getByTestId('scroll-area');
      expect(scrollArea.style.getPropertyValue('--scroll-area-max-width')).toBe('500px');
    });

    it('should apply custom className', () => {
      render(<ScrollArea className="custom-class">Content</ScrollArea>);
      expect(screen.getByTestId('scroll-area')).toHaveClass('custom-class');
    });

    it('should apply custom style', () => {
      render(<ScrollArea style={{ border: '1px solid red' }}>Content</ScrollArea>);
      expect(screen.getByTestId('scroll-area')).toHaveStyle({ border: '1px solid red' });
    });
  });

  describe('scroll callbacks', () => {
    it('should call onScroll when scrolling', () => {
      const handleScroll = jest.fn();
      render(
        <ScrollArea onScroll={handleScroll} maxHeight={100}>
          <div style={{ height: 500 }}>Tall content</div>
        </ScrollArea>
      );

      const viewport = screen.getByTestId('scroll-area').querySelector('[class*="viewport"]');
      fireEvent.scroll(viewport!);

      expect(handleScroll).toHaveBeenCalled();
    });
  });

  describe('imperative handle', () => {
    it('should expose scrollTo method', () => {
      const ref = createRef<ScrollAreaRef>();
      render(
        <ScrollArea ref={ref} maxHeight={100}>
          <div style={{ height: 500 }}>Tall content</div>
        </ScrollArea>
      );

      expect(ref.current?.scrollTo).toBeDefined();
      expect(typeof ref.current?.scrollTo).toBe('function');
    });

    it('should expose scrollToTop method', () => {
      const ref = createRef<ScrollAreaRef>();
      render(
        <ScrollArea ref={ref}>
          <div>Content</div>
        </ScrollArea>
      );

      expect(ref.current?.scrollToTop).toBeDefined();
      expect(typeof ref.current?.scrollToTop).toBe('function');
    });

    it('should expose scrollToBottom method', () => {
      const ref = createRef<ScrollAreaRef>();
      render(
        <ScrollArea ref={ref}>
          <div>Content</div>
        </ScrollArea>
      );

      expect(ref.current?.scrollToBottom).toBeDefined();
      expect(typeof ref.current?.scrollToBottom).toBe('function');
    });

    it('should expose getScrollPosition method', () => {
      const ref = createRef<ScrollAreaRef>();
      render(
        <ScrollArea ref={ref}>
          <div>Content</div>
        </ScrollArea>
      );

      const position = ref.current?.getScrollPosition();
      expect(position).toEqual({ scrollTop: 0, scrollLeft: 0 });
    });

    it('should expose getElement method', () => {
      const ref = createRef<ScrollAreaRef>();
      render(
        <ScrollArea ref={ref}>
          <div>Content</div>
        </ScrollArea>
      );

      const element = ref.current?.getElement();
      expect(element).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('directions', () => {
    it.each(['vertical', 'horizontal', 'both'] as const)(
      'should render with %s direction',
      (direction) => {
        render(<ScrollArea direction={direction}>Content</ScrollArea>);
        expect(screen.getByTestId('scroll-area')).toHaveAttribute('data-direction', direction);
      }
    );
  });

  describe('scrollbar sizes', () => {
    it.each(['sm', 'md', 'lg'] as const)('should render with %s scrollbar size', (size) => {
      render(<ScrollArea scrollbarSize={size}>Content</ScrollArea>);
      expect(screen.getByTestId('scroll-area')).toHaveAttribute('data-size', size);
    });
  });

  describe('visibility modes', () => {
    it.each(['auto', 'always', 'hover', 'scroll'] as const)(
      'should render with %s visibility',
      (visibility) => {
        render(<ScrollArea scrollbarVisibility={visibility}>Content</ScrollArea>);
        expect(screen.getByTestId('scroll-area')).toHaveAttribute('data-visibility', visibility);
      }
    );
  });

  describe('accessibility', () => {
    it('should have focusable viewport', () => {
      render(<ScrollArea>Content</ScrollArea>);
      const viewport = screen.getByTestId('scroll-area').querySelector('[class*="viewport"]');
      expect(viewport).toHaveAttribute('tabindex', '0');
    });
  });
});
