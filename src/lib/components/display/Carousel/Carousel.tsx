import React, {
  forwardRef,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
  Children,
} from 'react';
import styles from './Carousel.module.scss';
import type { BaseComponentProps } from '../../../types/component.types';
import { Icon, type IconName } from '../Icon';
import { IconButton } from '../../buttons/IconButton';

/**
 * Props for the Carousel component
 */
export interface CarouselProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Slides to display
   */
  children: ReactNode;

  /**
   * Whether to auto-play the carousel
   * @default false
   */
  autoPlay?: boolean;

  /**
   * Auto-play interval in milliseconds
   * @default 5000
   */
  autoPlayInterval?: number;

  /**
   * Whether to pause auto-play on hover
   * @default true
   */
  pauseOnHover?: boolean;

  /**
   * Whether to show navigation dots
   * @default true
   */
  showDots?: boolean;

  /**
   * Whether to show navigation arrows
   * @default true
   */
  showArrows?: boolean;

  /**
   * Whether to loop infinitely
   * @default true
   */
  infinite?: boolean;

  /**
   * Number of slides to show at once
   * @default 1
   */
  slidesToShow?: number;

  /**
   * Number of slides to scroll at once
   * @default 1
   */
  slidesToScroll?: number;

  /**
   * Gap between slides
   * @default '16px'
   */
  gap?: string;

  /**
   * Transition duration in milliseconds
   * @default 300
   */
  transitionDuration?: number;

  /**
   * Active slide index (controlled mode)
   */
  activeIndex?: number;

  /**
   * Default active slide index (uncontrolled mode)
   * @default 0
   */
  defaultIndex?: number;

  /**
   * Callback when slide changes
   */
  onChange?: (index: number) => void;

  /**
   * Icon for previous arrow
   * @default 'chevron-left'
   */
  prevIcon?: ReactNode | IconName;

  /**
   * Icon for next arrow
   * @default 'chevron-right'
   */
  nextIcon?: ReactNode | IconName;

  /**
   * Whether arrows should be outside the carousel
   * @default false
   */
  arrowsOutside?: boolean;

  /**
   * Dot position
   * @default 'bottom'
   */
  dotsPosition?: 'bottom' | 'top';
}

/**
 * Carousel - A sliding carousel component for displaying multiple items
 *
 * @example
 * ```tsx
 * <Carousel>
 *   <div>Slide 1</div>
 *   <div>Slide 2</div>
 *   <div>Slide 3</div>
 * </Carousel>
 * ```
 *
 * @example
 * ```tsx
 * <Carousel autoPlay autoPlayInterval={3000} showDots>
 *   <img src="image1.jpg" alt="Slide 1" />
 *   <img src="image2.jpg" alt="Slide 2" />
 * </Carousel>
 * ```
 *
 * @example
 * ```tsx
 * // Multiple slides visible
 * <Carousel slidesToShow={3} gap="24px">
 *   {items.map(item => <Card key={item.id}>{item.content}</Card>)}
 * </Carousel>
 * ```
 */
export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      children,
      autoPlay = false,
      autoPlayInterval = 5000,
      pauseOnHover = true,
      showDots = true,
      showArrows = true,
      infinite = true,
      slidesToShow = 1,
      slidesToScroll = 1,
      gap = '16px',
      transitionDuration = 300,
      activeIndex: controlledIndex,
      defaultIndex = 0,
      onChange,
      prevIcon = 'chevron-left',
      nextIcon = 'chevron-right',
      arrowsOutside = false,
      dotsPosition = 'bottom',
      className,
      style,
      'data-testid': testId,
      'aria-label': ariaLabel,
      ...restProps
    },
    ref
  ) => {
    const slides = Children.toArray(children);
    const slideCount = slides.length;
    const maxIndex = Math.max(0, slideCount - slidesToShow);

    // Controlled vs uncontrolled state
    const isControlled = controlledIndex !== undefined;
    const [uncontrolledIndex, setUncontrolledIndex] = useState(defaultIndex);
    const currentIndex = isControlled ? controlledIndex : uncontrolledIndex;

    // Auto-play pause state
    const [isPaused, setIsPaused] = useState(false);
    const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Touch handling
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const minSwipeDistance = 50;

    // Navigate to specific slide
    const goToSlide = useCallback(
      (index: number) => {
        let newIndex = index;

        if (infinite) {
          if (newIndex < 0) {
            newIndex = maxIndex;
          } else if (newIndex > maxIndex) {
            newIndex = 0;
          }
        } else {
          newIndex = Math.max(0, Math.min(newIndex, maxIndex));
        }

        if (isControlled) {
          onChange?.(newIndex);
        } else {
          setUncontrolledIndex(newIndex);
          onChange?.(newIndex);
        }
      },
      [infinite, maxIndex, isControlled, onChange]
    );

    // Navigate to next slide
    const goToNext = useCallback(() => {
      goToSlide(currentIndex + slidesToScroll);
    }, [goToSlide, currentIndex, slidesToScroll]);

    // Navigate to previous slide
    const goToPrev = useCallback(() => {
      goToSlide(currentIndex - slidesToScroll);
    }, [goToSlide, currentIndex, slidesToScroll]);

    // Auto-play effect
    useEffect(() => {
      if (autoPlay && !isPaused && slideCount > slidesToShow) {
        autoPlayTimerRef.current = setInterval(() => {
          goToNext();
        }, autoPlayInterval);
      }

      return () => {
        if (autoPlayTimerRef.current) {
          clearInterval(autoPlayTimerRef.current);
        }
      };
    }, [autoPlay, autoPlayInterval, isPaused, goToNext, slideCount, slidesToShow]);

    // Pause on hover handlers
    const handleMouseEnter = useCallback(() => {
      if (pauseOnHover && autoPlay) {
        setIsPaused(true);
      }
    }, [pauseOnHover, autoPlay]);

    const handleMouseLeave = useCallback(() => {
      if (pauseOnHover && autoPlay) {
        setIsPaused(false);
      }
    }, [pauseOnHover, autoPlay]);

    // Touch handlers
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
      setTouchEnd(e.targetTouches[0].clientX);
    }, []);

    const handleTouchEnd = useCallback(() => {
      if (!touchStart || !touchEnd) {
        return;
      }

      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;

      if (isLeftSwipe) {
        goToNext();
      } else if (isRightSwipe) {
        goToPrev();
      }

      setTouchStart(null);
      setTouchEnd(null);
    }, [touchStart, touchEnd, goToNext, goToPrev]);

    // Keyboard navigation
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goToPrev();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          goToNext();
        }
      },
      [goToPrev, goToNext]
    );

    // Render icon
    const renderIcon = (icon: ReactNode | IconName) => {
      if (typeof icon === 'string') {
        return <Icon name={icon as IconName} />;
      }
      return icon;
    };

    // Calculate dots
    const dotCount = Math.ceil((slideCount - slidesToShow + 1) / slidesToScroll);
    const dots = Array.from({ length: Math.max(1, dotCount) }, (_, i) => i);

    const componentClasses = [styles.carousel, className].filter(Boolean).join(' ');

    const cssVariables = {
      '--carousel-transition-duration': `${transitionDuration}ms`,
      '--carousel-gap': gap,
      '--carousel-slides-to-show': slidesToShow,
      '--carousel-translate': `calc(-${currentIndex * (100 / slidesToShow)}% - ${currentIndex} * var(--carousel-gap) / ${slidesToShow})`,
      ...style,
    } as React.CSSProperties;

    const canGoPrev = infinite || currentIndex > 0;
    const canGoNext = infinite || currentIndex < maxIndex;

    const showOutsideArrows = showArrows && arrowsOutside && slideCount > slidesToShow;
    const showInnerArrows = showArrows && !arrowsOutside && slideCount > slidesToShow;

    return (
      <div
        ref={ref}
        className={componentClasses}
        data-component="carousel"
        data-arrows-outside={arrowsOutside || undefined}
        data-dots-position={dotsPosition}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel || 'Carousel'}
        data-testid={testId}
        style={cssVariables}
        {...restProps}
      >
        {/* Outside Previous Arrow */}
        {showOutsideArrows && (
          <IconButton
            icon={typeof prevIcon === 'string' ? (prevIcon as IconName) : 'chevron-left'}
            onClick={goToPrev}
            disabled={!canGoPrev}
            aria-label="Previous slide"
            variant="outline"
          />
        )}

        {/* Slides Container */}
        <div
          className={styles.viewport}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className={styles.track} aria-live="polite">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={styles.slide}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${index + 1} of ${slideCount}`}
                aria-hidden={index < currentIndex || index >= currentIndex + slidesToShow}
              >
                {slide}
              </div>
            ))}
          </div>

          {/* Inner Navigation Arrows */}
          {showInnerArrows && (
            <>
              <button
                className={`${styles.arrow} ${styles.arrowPrev}`}
                onClick={goToPrev}
                disabled={!canGoPrev}
                aria-label="Previous slide"
                type="button"
              >
                {renderIcon(prevIcon)}
              </button>
              <button
                className={`${styles.arrow} ${styles.arrowNext}`}
                onClick={goToNext}
                disabled={!canGoNext}
                aria-label="Next slide"
                type="button"
              >
                {renderIcon(nextIcon)}
              </button>
            </>
          )}
        </div>

        {/* Outside Next Arrow */}
        {showOutsideArrows && (
          <IconButton
            icon={typeof nextIcon === 'string' ? (nextIcon as IconName) : 'chevron-right'}
            onClick={goToNext}
            disabled={!canGoNext}
            aria-label="Next slide"
            variant="outline"
          />
        )}

        {/* Navigation Dots */}
        {showDots && slideCount > slidesToShow && (
          <div className={styles.dots} role="tablist" aria-label="Carousel navigation">
            {dots.map((dotIndex) => {
              const slideIndex = dotIndex * slidesToScroll;
              const isActive =
                currentIndex >= slideIndex && currentIndex < slideIndex + slidesToScroll;

              return (
                <button
                  key={dotIndex}
                  className={styles.dot}
                  onClick={() => goToSlide(slideIndex)}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to slide ${slideIndex + 1}`}
                  data-active={isActive || undefined}
                  type="button"
                />
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

Carousel.displayName = 'Carousel';

export default Carousel;

