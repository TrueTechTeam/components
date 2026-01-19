import React, {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useCallback,
  Children,
  isValidElement,
} from 'react';
import styles from './Reveal.module.scss';
import type { BaseComponentProps } from '../../../types/component.types';

/**
 * Animation types available for reveal
 */
export type RevealAnimation =
  | 'fade'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'zoom'
  | 'zoomIn'
  | 'zoomOut';

/**
 * Props for the Reveal component
 */
export interface RevealProps extends BaseComponentProps {
  /**
   * Animation type
   * @default 'fade'
   */
  animation?: RevealAnimation;

  /**
   * Animation duration in milliseconds
   * @default 500
   */
  duration?: number;

  /**
   * Delay before animation starts (ms)
   * @default 0
   */
  delay?: number;

  /**
   * CSS easing function
   * @default 'ease-out'
   */
  easing?: string;

  /**
   * Visibility threshold (0-1) for Intersection Observer
   * @default 0.1
   */
  threshold?: number;

  /**
   * Whether to animate only once
   * @default true
   */
  triggerOnce?: boolean;

  /**
   * Distance for slide animations
   * @default '20px'
   */
  distance?: string;

  /**
   * Whether to stagger children animations
   * @default false
   */
  cascade?: boolean;

  /**
   * Delay between staggered children (ms)
   * @default 100
   */
  cascadeDelay?: number;

  /**
   * Callback when element is revealed
   */
  onReveal?: () => void;

  /**
   * Whether the component is initially visible (skips animation)
   * @default false
   */
  initiallyVisible?: boolean;

  /**
   * Root margin for Intersection Observer
   * @default '0px'
   */
  rootMargin?: string;

  /**
   * Play animation immediately on mount without requiring scroll
   * Useful for hero sections or elements visible on initial page load
   * @default false
   */
  playOnMount?: boolean;
}

/**
 * Reveal - Intersection Observer-based reveal animation component
 *
 * @example
 * ```tsx
 * <Reveal animation="slideUp">
 *   <div>Content that animates in when scrolled into view</div>
 * </Reveal>
 * ```
 *
 * @example
 * ```tsx
 * <Reveal animation="fade" cascade cascadeDelay={100}>
 *   <div>First item</div>
 *   <div>Second item</div>
 *   <div>Third item</div>
 * </Reveal>
 * ```
 *
 * @example
 * ```tsx
 * <Reveal
 *   animation="zoom"
 *   duration={800}
 *   delay={200}
 *   onReveal={() => console.log('Revealed!')}
 * >
 *   <Card>Animated card</Card>
 * </Reveal>
 * ```
 */
export const Reveal = forwardRef<HTMLDivElement, RevealProps>(
  (
    {
      animation = 'fade',
      duration = 500,
      delay = 0,
      easing = 'ease-out',
      threshold = 0.1,
      triggerOnce = true,
      distance = '20px',
      cascade = false,
      cascadeDelay = 100,
      onReveal,
      initiallyVisible = false,
      rootMargin = '0px',
      playOnMount = false,
      children,
      className,
      style,
      'data-testid': testId,
      'aria-label': ariaLabel,
      ...restProps
    },
    ref
  ) => {
    const [isRevealed, setIsRevealed] = useState(initiallyVisible && !playOnMount);
    const elementRef = useRef<HTMLDivElement | null>(null);
    const hasTriggeredRef = useRef(initiallyVisible && !playOnMount);

    // Play animation on mount (for hero sections or elements visible without scroll)
    useEffect(() => {
      if (!playOnMount) {
        return;
      }

      // Small delay to ensure CSS transition happens (element needs to render in hidden state first)
      const timer = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsRevealed(true);
          hasTriggeredRef.current = true;
          onReveal?.();
        });
      });

      return () => cancelAnimationFrame(timer);
    }, [playOnMount, onReveal]);

    // Intersection Observer setup
    useEffect(() => {
      if (initiallyVisible || playOnMount) {
        return;
      }

      const element = elementRef.current;
      if (!element) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (!hasTriggeredRef.current || !triggerOnce) {
                hasTriggeredRef.current = true;
                setIsRevealed(true);
                onReveal?.();

                if (triggerOnce) {
                  observer.disconnect();
                }
              }
            } else if (!triggerOnce) {
              setIsRevealed(false);
            }
          });
        },
        {
          threshold,
          rootMargin,
        }
      );

      observer.observe(element);

      return () => {
        observer.disconnect();
      };
    }, [threshold, rootMargin, triggerOnce, onReveal, initiallyVisible, playOnMount]);

    // Combine refs
    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        elementRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    const componentClasses = [styles.reveal, className].filter(Boolean).join(' ');

    const cssVariables = {
      '--reveal-duration': `${duration}ms`,
      '--reveal-delay': `${delay}ms`,
      '--reveal-easing': easing,
      '--reveal-distance': distance,
      ...style,
    } as React.CSSProperties;

    // Handle cascade mode
    if (cascade && Children.count(children) > 1) {
      return (
        <div
          ref={setRefs}
          className={componentClasses}
          data-component="reveal"
          data-animation={animation}
          data-revealed={isRevealed || undefined}
          data-cascade="true"
          data-testid={testId}
          aria-label={ariaLabel}
          style={cssVariables}
          {...restProps}
        >
          {Children.map(children, (child, index) => {
            if (!isValidElement(child)) {
              return child;
            }

            const childDelay = delay + index * cascadeDelay;

            return (
              <div
                className={styles.cascadeItem}
                data-animation={animation}
                data-revealed={isRevealed || undefined}
                style={
                  {
                    '--reveal-delay': `${childDelay}ms`,
                  } as React.CSSProperties
                }
              >
                {child}
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div
        ref={setRefs}
        className={componentClasses}
        data-component="reveal"
        data-animation={animation}
        data-revealed={isRevealed || undefined}
        data-testid={testId}
        aria-label={ariaLabel}
        style={cssVariables}
        {...restProps}
      >
        {children}
      </div>
    );
  }
);

Reveal.displayName = 'Reveal';

export default Reveal;

