import React, { forwardRef, useState, useEffect, useRef, useCallback } from 'react';
import styles from './CountUp.module.scss';
import type { BaseComponentProps, ComponentSize } from '../../../types/component.types';

/**
 * Easing functions for animation
 */
export type EasingFunction =
  | 'linear'
  | 'easeOut'
  | 'easeIn'
  | 'easeInOut'
  | 'easeOutCubic'
  | 'easeInCubic'
  | 'easeOutExpo';

/**
 * Props for the CountUp component
 */
export interface CountUpProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Target value to count to
   */
  value: number;

  /**
   * Starting value
   * @default 0
   */
  start?: number;

  /**
   * Animation duration in milliseconds
   * @default 2000
   */
  duration?: number;

  /**
   * Easing function for animation
   * @default 'easeOutCubic'
   */
  easing?: EasingFunction;

  /**
   * Prefix to display before the number
   */
  prefix?: string;

  /**
   * Suffix to display after the number
   */
  suffix?: string;

  /**
   * Number of decimal places
   * @default 0
   */
  decimals?: number;

  /**
   * Thousands separator
   * @default ','
   */
  separator?: string;

  /**
   * Decimal separator
   * @default '.'
   */
  decimalSeparator?: string;

  /**
   * Whether to start animation when element becomes visible
   * @default true
   */
  triggerOnVisible?: boolean;

  /**
   * Visibility threshold (0-1) for Intersection Observer
   * @default 0.1
   */
  visibilityThreshold?: number;

  /**
   * Callback when animation starts
   */
  onStart?: () => void;

  /**
   * Callback when animation ends
   */
  onEnd?: () => void;

  /**
   * Custom format function
   */
  formatFn?: (value: number) => string;

  /**
   * Size of the component
   * @default 'md'
   */
  size?: ComponentSize;

  /**
   * Whether to start animation immediately (if triggerOnVisible is false)
   * @default true
   */
  autoStart?: boolean;

  /**
   * Delay before starting animation (ms)
   * @default 0
   */
  delay?: number;
}

// Easing functions
const easingFunctions: Record<EasingFunction, (t: number) => number> = {
  linear: (t) => t,
  easeOut: (t) => 1 - Math.pow(1 - t, 2),
  easeIn: (t) => t * t,
  easeInOut: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
  easeInCubic: (t) => t * t * t,
  easeOutExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
};

/**
 * CountUp - Animated number counting component
 *
 * @example
 * ```tsx
 * <CountUp value={1000} />
 * ```
 *
 * @example
 * ```tsx
 * <CountUp
 *   value={1234.56}
 *   prefix="$"
 *   decimals={2}
 *   duration={3000}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <CountUp
 *   value={99}
 *   suffix="%"
 *   easing="easeOutExpo"
 * />
 * ```
 */
export const CountUp = forwardRef<HTMLSpanElement, CountUpProps>(
  (
    {
      value,
      start = 0,
      duration = 2000,
      easing = 'easeOutCubic',
      prefix = '',
      suffix = '',
      decimals = 0,
      separator = ',',
      decimalSeparator = '.',
      triggerOnVisible = true,
      visibilityThreshold = 0.1,
      onStart,
      onEnd,
      formatFn,
      size = 'md',
      autoStart = true,
      delay = 0,
      className,
      style,
      'data-testid': testId,
      'aria-label': ariaLabel,
      ...restProps
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = useState(start);
    const [isAnimating, setIsAnimating] = useState(false);
    const elementRef = useRef<HTMLSpanElement | null>(null);
    const animationRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const hasStartedRef = useRef(false);

    // Store current values in refs for animation callback
    const valuesRef = useRef({ duration, easing, start, value, onEnd, onStart, delay });
    useEffect(() => {
      valuesRef.current = { duration, easing, start, value, onEnd, onStart, delay };
    });

    // Format number with separators
    const formatNumber = useCallback(
      (num: number): string => {
        if (formatFn) {
          return formatFn(num);
        }

        const fixed = num.toFixed(decimals);
        const [intPart, decPart] = fixed.split('.');

        // Add thousands separator
        const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);

        return decPart ? `${formattedInt}${decimalSeparator}${decPart}` : formattedInt;
      },
      [decimals, separator, decimalSeparator, formatFn]
    );

    // Start animation
    const startAnimation = useCallback(() => {
      if (hasStartedRef.current) {
        return;
      }

      hasStartedRef.current = true;
      setIsAnimating(true);
      startTimeRef.current = null;

      const runAnimation = () => {
        const {
          duration: dur,
          easing: ease,
          start: startVal,
          value: endVal,
          onEnd: endCb,
        } = valuesRef.current;

        const animate = (timestamp: number) => {
          if (startTimeRef.current === null) {
            startTimeRef.current = timestamp;
          }

          const elapsed = timestamp - startTimeRef.current;
          const progress = Math.min(elapsed / dur, 1);

          const easingFn = easingFunctions[ease];
          const easedProgress = easingFn(progress);

          const currentValue = startVal + (endVal - startVal) * easedProgress;
          setDisplayValue(currentValue);

          if (progress < 1) {
            animationRef.current = requestAnimationFrame(animate);
          } else {
            setDisplayValue(endVal);
            setIsAnimating(false);
            endCb?.();
          }
        };

        animationRef.current = requestAnimationFrame(animate);
      };

      const { delay: delayMs, onStart: startCb } = valuesRef.current;
      if (delayMs > 0) {
        setTimeout(() => {
          startCb?.();
          runAnimation();
        }, delayMs);
      } else {
        startCb?.();
        runAnimation();
      }
    }, []);

    // Intersection Observer for visibility trigger
    useEffect(() => {
      if (!triggerOnVisible || hasStartedRef.current) {
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
              startAnimation();
              observer.disconnect();
            }
          });
        },
        { threshold: visibilityThreshold }
      );

      observer.observe(element);

      return () => {
        observer.disconnect();
      };
    }, [triggerOnVisible, visibilityThreshold, startAnimation]);

    // Auto start (when not using visibility trigger)
    useEffect(() => {
      if (!triggerOnVisible && autoStart && !hasStartedRef.current) {
        // Defer to avoid synchronous setState in effect
        const timeoutId = setTimeout(() => {
          startAnimation();
        }, 0);
        return () => clearTimeout(timeoutId);
      }
    }, [triggerOnVisible, autoStart, startAnimation]);

    // Cleanup animation frame on unmount
    useEffect(() => {
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, []);

    // Update when value changes (re-animate)
    const prevValueRef = useRef(value);
    useEffect(() => {
      if (prevValueRef.current !== value && hasStartedRef.current && !isAnimating) {
        // Reset and re-animate when value changes
        // Defer to avoid synchronous setState in effect
        hasStartedRef.current = false;
        const timeoutId = setTimeout(() => {
          setDisplayValue(start);
        }, 0);
        prevValueRef.current = value;
        return () => clearTimeout(timeoutId);
      }
      prevValueRef.current = value;
    }, [value, isAnimating, start]);

    const componentClasses = [styles.countUp, className].filter(Boolean).join(' ');

    // Combine refs
    const setRefs = useCallback(
      (node: HTMLSpanElement | null) => {
        elementRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    return (
      <span
        ref={setRefs}
        className={componentClasses}
        data-component="count-up"
        data-size={size}
        data-animating={isAnimating || undefined}
        data-testid={testId}
        aria-label={ariaLabel || `${prefix}${formatNumber(value)}${suffix}`}
        style={style}
        {...restProps}
      >
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        <span className={styles.value}>{formatNumber(displayValue)}</span>
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </span>
    );
  }
);

CountUp.displayName = 'CountUp';

export default CountUp;

