import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
  type MouseEvent,
  type KeyboardEvent,
} from 'react';
import styles from './FlipCard.module.scss';
import type { BaseComponentProps } from '../../../types/component.types';

/**
 * Direction of the flip animation
 */
export type FlipDirection = 'horizontal' | 'vertical';

/**
 * How the flip is triggered
 */
export type FlipTrigger = 'click' | 'hover' | 'manual';

/**
 * Props for the FlipCard component
 */
export interface FlipCardProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Content for the front face of the card
   */
  front: ReactNode;

  /**
   * Content for the back face of the card
   */
  back: ReactNode;

  /**
   * Whether the card is flipped (controlled mode)
   */
  isFlipped?: boolean;

  /**
   * Default flipped state (uncontrolled mode)
   * @default false
   */
  defaultFlipped?: boolean;

  /**
   * Callback when flip state changes
   */
  onFlipChange?: (isFlipped: boolean) => void;

  /**
   * How the flip is triggered
   * @default 'click'
   */
  flipTrigger?: FlipTrigger;

  /**
   * Direction of the flip animation
   * @default 'horizontal'
   */
  flipDirection?: FlipDirection;

  /**
   * Animation duration in milliseconds
   * @default 600
   */
  duration?: number;

  /**
   * CSS easing function
   * @default 'ease-in-out'
   */
  easing?: string;

  /**
   * Callback when flip animation starts
   */
  onFlipStart?: (toFlipped: boolean) => void;

  /**
   * Callback when flip animation ends
   */
  onFlipEnd?: (isFlipped: boolean) => void;

  /**
   * Whether the card is disabled (no flip interaction)
   * @default false
   */
  disabled?: boolean;

  /**
   * Fixed height for the card (required for 3D perspective)
   */
  height?: string | number;

  /**
   * Fixed width for the card
   */
  width?: string | number;

  /**
   * Perspective distance for 3D effect
   * @default 1000
   */
  perspective?: number;

  /**
   * ARIA label for the flip action (accessibility)
   * @default 'Flip card'
   */
  flipButtonAriaLabel?: string;
}

/**
 * FlipCard - An animated card component that flips to reveal back content
 *
 * @example
 * ```tsx
 * <FlipCard
 *   front={<div>Front content</div>}
 *   back={<div>Back content</div>}
 *   height={200}
 *   width={300}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Controlled mode
 * const [isFlipped, setIsFlipped] = useState(false);
 * <FlipCard
 *   front={<div>Front</div>}
 *   back={<div>Back</div>}
 *   isFlipped={isFlipped}
 *   onFlipChange={setIsFlipped}
 *   flipTrigger="manual"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Hover to flip
 * <FlipCard
 *   front={<div>Hover me</div>}
 *   back={<div>Back side</div>}
 *   flipTrigger="hover"
 * />
 * ```
 */
export const FlipCard = ({
  ref,
  front,
  back,
  isFlipped: controlledIsFlipped,
  defaultFlipped = false,
  onFlipChange,
  flipTrigger = 'click',
  flipDirection = 'horizontal',
  duration = 600,
  easing = 'ease-in-out',
  onFlipStart,
  onFlipEnd,
  disabled = false,
  height,
  width,
  perspective = 1000,
  flipButtonAriaLabel = 'Flip card',
  className,
  style,
  'data-testid': testId,
  'aria-label': ariaLabel,
  ...restProps
}: FlipCardProps & {
  ref?: React.Ref<HTMLDivElement>;
}) => {
  // Controlled vs uncontrolled state
  const isControlled = controlledIsFlipped !== undefined;
  const [uncontrolledIsFlipped, setUncontrolledIsFlipped] = useState(defaultFlipped);
  const isFlipped = isControlled ? controlledIsFlipped : uncontrolledIsFlipped;

  // Track animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  // Handle flip action
  const handleFlip = useCallback(() => {
    if (disabled || isAnimating) {
      return;
    }

    const newIsFlipped = !isFlipped;

    // Fire start callback
    onFlipStart?.(newIsFlipped);
    setIsAnimating(true);

    // Update state
    if (isControlled) {
      onFlipChange?.(newIsFlipped);
    } else {
      setUncontrolledIsFlipped(newIsFlipped);
      onFlipChange?.(newIsFlipped);
    }

    // Fire end callback after animation completes
    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
      onFlipEnd?.(newIsFlipped);
    }, duration);
  }, [
    disabled,
    isAnimating,
    isFlipped,
    isControlled,
    onFlipChange,
    onFlipStart,
    onFlipEnd,
    duration,
  ]);

  // Click handler
  const handleClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (flipTrigger === 'click') {
        handleFlip();
      }
    },
    [flipTrigger, handleFlip]
  );

  // Keyboard handler (accessibility)
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (flipTrigger === 'manual') {
        return;
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleFlip();
      }
    },
    [flipTrigger, handleFlip]
  );

  // Hover handlers
  const handleMouseEnter = useCallback(() => {
    if (flipTrigger === 'hover' && !isFlipped && !disabled) {
      handleFlip();
    }
  }, [flipTrigger, isFlipped, disabled, handleFlip]);

  const handleMouseLeave = useCallback(() => {
    if (flipTrigger === 'hover' && isFlipped && !disabled) {
      handleFlip();
    }
  }, [flipTrigger, isFlipped, disabled, handleFlip]);

  const componentClasses = [styles.flipCard, className].filter(Boolean).join(' ');

  const cssVariables = {
    '--flipcard-duration': `${duration}ms`,
    '--flipcard-easing': easing,
    '--flipcard-perspective': `${perspective}px`,
    '--flipcard-height': typeof height === 'number' ? `${height}px` : height,
    '--flipcard-width': typeof width === 'number' ? `${width}px` : width,
    ...style,
  } as React.CSSProperties;

  const isInteractive = flipTrigger !== 'manual';

  return (
    <div
      ref={ref}
      className={componentClasses}
      data-component="flip-card"
      data-flipped={isFlipped || undefined}
      data-flip-direction={flipDirection}
      data-animating={isAnimating || undefined}
      data-disabled={disabled || undefined}
      data-trigger={flipTrigger}
      onClick={handleClick}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive && !disabled ? 0 : undefined}
      aria-pressed={isInteractive ? isFlipped : undefined}
      aria-label={ariaLabel || flipButtonAriaLabel}
      aria-disabled={disabled || undefined}
      data-testid={testId}
      style={cssVariables}
      {...restProps}
    >
      <div className={styles.flipCardInner}>
        <div className={styles.flipCardFront} aria-hidden={isFlipped}>
          {front}
        </div>
        <div className={styles.flipCardBack} aria-hidden={!isFlipped}>
          {back}
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
