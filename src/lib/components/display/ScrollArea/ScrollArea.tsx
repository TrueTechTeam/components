import React, { forwardRef, useCallback, useRef, useState, useImperativeHandle } from 'react';
import type { BaseComponentProps } from '../../../types';
import styles from './ScrollArea.module.scss';


export interface ScrollAreaRef {
  /**
   * Scroll to specific position
   */
  scrollTo: (options: ScrollToOptions) => void;

  /**
   * Scroll to top
   */
  scrollToTop: (behavior?: ScrollBehavior) => void;

  /**
   * Scroll to bottom
   */
  scrollToBottom: (behavior?: ScrollBehavior) => void;

  /**
   * Scroll to left
   */
  scrollToLeft: (behavior?: ScrollBehavior) => void;

  /**
   * Scroll to right
   */
  scrollToRight: (behavior?: ScrollBehavior) => void;

  /**
   * Get current scroll position
   */
  getScrollPosition: () => { scrollTop: number; scrollLeft: number };

  /**
   * Get the viewport element
   */
  getElement: () => HTMLDivElement | null;
}

export interface ScrollAreaProps extends BaseComponentProps {
  /**
   * Scroll direction
   * @default 'vertical'
   */
  direction?: 'vertical' | 'horizontal' | 'both';

  /**
   * Maximum height (enables vertical scroll)
   */
  maxHeight?: string | number;

  /**
   * Maximum width (enables horizontal scroll)
   */
  maxWidth?: string | number;

  /**
   * Whether to show shadow indicators at scroll edges
   * @default false
   */
  showShadows?: boolean;

  /**
   * Callback when scroll position changes
   */
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;

  /**
   * Callback when scrolled to top
   */
  onScrollToTop?: () => void;

  /**
   * Callback when scrolled to bottom
   */
  onScrollToBottom?: () => void;

  /**
   * Callback when scrolled to left edge
   */
  onScrollToLeft?: () => void;

  /**
   * Callback when scrolled to right edge
   */
  onScrollToRight?: () => void;

  /**
   * Threshold in pixels for scroll end callbacks
   * @default 10
   */
  scrollEndThreshold?: number;

  /**
   * Content to render inside scrollable area
   */
  children: React.ReactNode;
}

/**
 * ScrollArea component - a custom scrollbar container
 *
 * Provides styled scrollbars with various visibility modes and
 * programmatic scroll control.
 *
 * @example
 * Basic vertical scroll:
 * ```tsx
 * <ScrollArea maxHeight={300}>
 *   <p>Long content here...</p>
 * </ScrollArea>
 * ```
 *
 * @example
 * With scroll callbacks:
 * ```tsx
 * <ScrollArea
 *   maxHeight={400}
 *   onScrollToBottom={() => loadMore()}
 *   showShadows
 * >
 *   {items.map(item => <Item key={item.id} {...item} />)}
 * </ScrollArea>
 * ```
 */
export const ScrollArea = forwardRef<ScrollAreaRef, ScrollAreaProps>(
  (
    {
      direction = 'vertical',
      maxHeight,
      maxWidth,
      showShadows = false,
      onScroll,
      onScrollToTop,
      onScrollToBottom,
      onScrollToLeft,
      onScrollToRight,
      scrollEndThreshold = 10,
      children,
      className,
      'data-testid': testId,
      style,
      ...restProps
    },
    ref
  ) => {
    const viewportRef = useRef<HTMLDivElement>(null);
    const [atTop, setAtTop] = useState(true);
    const [atBottom, setAtBottom] = useState(false);
    const [atLeft, setAtLeft] = useState(true);
    const [atRight, setAtRight] = useState(false);

    // Imperative handle for programmatic scrolling
    useImperativeHandle(ref, () => ({
      scrollTo: (options) => viewportRef.current?.scrollTo(options),
      scrollToTop: (behavior = 'smooth') =>
        viewportRef.current?.scrollTo({ top: 0, behavior }),
      scrollToBottom: (behavior = 'smooth') => {
        const el = viewportRef.current;
        if (el) el.scrollTo({ top: el.scrollHeight, behavior });
      },
      scrollToLeft: (behavior = 'smooth') =>
        viewportRef.current?.scrollTo({ left: 0, behavior }),
      scrollToRight: (behavior = 'smooth') => {
        const el = viewportRef.current;
        if (el) el.scrollTo({ left: el.scrollWidth, behavior });
      },
      getScrollPosition: () => ({
        scrollTop: viewportRef.current?.scrollTop ?? 0,
        scrollLeft: viewportRef.current?.scrollLeft ?? 0,
      }),
      getElement: () => viewportRef.current,
    }));

    const handleScroll = useCallback(
      (event: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } =
          event.currentTarget;

        // Check vertical scroll positions
        const newAtTop = scrollTop <= scrollEndThreshold;
        const newAtBottom = scrollTop + clientHeight >= scrollHeight - scrollEndThreshold;

        // Check horizontal scroll positions
        const newAtLeft = scrollLeft <= scrollEndThreshold;
        const newAtRight = scrollLeft + clientWidth >= scrollWidth - scrollEndThreshold;

        // Trigger callbacks on position changes
        if (newAtTop && !atTop) onScrollToTop?.();
        if (newAtBottom && !atBottom) onScrollToBottom?.();
        if (newAtLeft && !atLeft) onScrollToLeft?.();
        if (newAtRight && !atRight) onScrollToRight?.();

        setAtTop(newAtTop);
        setAtBottom(newAtBottom);
        setAtLeft(newAtLeft);
        setAtRight(newAtRight);

        onScroll?.(event);
      },
      [
        atTop,
        atBottom,
        atLeft,
        atRight,
        scrollEndThreshold,
        onScroll,
        onScrollToTop,
        onScrollToBottom,
        onScrollToLeft,
        onScrollToRight,
      ]
    );

    const containerClasses = [styles.scrollArea, className].filter(Boolean).join(' ');

    const containerStyle = {
      '--scroll-area-max-height':
        typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
      '--scroll-area-max-width': typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
      ...style,
    } as React.CSSProperties;

    return (
      <div
        className={containerClasses}
        data-direction={direction}
        data-shadow={showShadows || undefined}
        data-at-top={atTop || undefined}
        data-at-bottom={atBottom || undefined}
        data-at-left={atLeft || undefined}
        data-at-right={atRight || undefined}
        data-component="scroll-area"
        data-testid={testId || 'scroll-area'}
        style={containerStyle}
        {...restProps}
      >
        <div
          ref={viewportRef}
          className={styles.viewport}
          onScroll={handleScroll}
          tabIndex={0}
        >
          {children}
        </div>
      </div>
    );
  }
);

ScrollArea.displayName = 'ScrollArea';

export default ScrollArea;
