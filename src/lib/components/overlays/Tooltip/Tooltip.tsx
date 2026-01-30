/**
 * Tooltip component - Hover-triggered overlay with optional arrow
 */

import { type ReactNode } from 'react';
import { Popover } from '../Popover';
import { useHover } from '../../../hooks';
import type { PopoverPosition } from '../../../utils';
import type { BaseComponentProps } from '../../../types';
import styles from './Tooltip.module.scss';

/**
 * Tooltip component props
 */
export interface TooltipProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Tooltip content (what to display in tooltip)
   */
  content: ReactNode;

  /**
   * Element to trigger tooltip
   */
  children: ReactNode;

  /**
   * Tooltip position
   * @default 'top'
   */
  position?: PopoverPosition;

  /**
   * Delay before showing tooltip (ms)
   * @default 200
   */
  delayShow?: number;

  /**
   * Delay before hiding tooltip (ms)
   * @default 0
   */
  delayHide?: number;

  /**
   * Disable tooltip
   * @default false
   */
  disabled?: boolean;

  /**
   * Show arrow pointing to trigger
   * @default true
   */
  showArrow?: boolean;

  /**
   * Gap between trigger and tooltip
   * @default 8
   */
  offset?: number;
}

/**
 * Check if device has coarse pointer (touch device)
 */
// const isTouchDevice = (): boolean => {
//   if (typeof window === 'undefined') {
//     return false;
//   }
//   return window.matchMedia('(pointer: coarse)').matches;
// };

/**
 * Get arrow position based on tooltip position
 */
const getArrowPosition = (position: PopoverPosition): string => {
  // Return the exact position to handle corners properly
  if (position === 'top') {
    return 'bottom';
  }
  if (position === 'top-left') {
    return 'bottom-left';
  }
  if (position === 'top-right') {
    return 'bottom-right';
  }
  if (position === 'bottom') {
    return 'top';
  }
  if (position === 'bottom-left') {
    return 'top-left';
  }
  if (position === 'bottom-right') {
    return 'top-right';
  }
  if (position === 'left') {
    return 'right';
  }
  if (position === 'right') {
    return 'left';
  }
  return 'top';
};

/**
 * Tooltip component
 * Displays helpful text on hover/focus
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'bottom',
  delayShow = 200,
  delayHide = 0,
  disabled = false,
  showArrow = true,
  offset = 8,
  className,
  'data-testid': testId,
  ...restProps
}) => {
  // Disable on touch devices
  // const isTouch = isTouchDevice();
  const effectivelyDisabled = disabled;

  const { isHovered, hoverProps } = useHover({
    delayEnter: delayShow,
    delayLeave: delayHide,
    disabled: effectivelyDisabled,
  });

  const tooltipClasses = [styles.tooltipContent, className].filter(Boolean).join(' ');

  return (
    <Popover
      trigger={({ ref }) => (
        <span
          ref={ref}
          className={styles.tooltipTrigger}
          {...hoverProps}
          data-testid={testId ? `${testId}-trigger` : undefined}
        >
          {children}
        </span>
      )}
      isOpen={isHovered}
      position={position}
      offset={offset}
      closeOnClickOutside={false}
      closeOnEscape={false}
      data-testid={testId || 'tooltip'}
      className={tooltipClasses}
      zIndex={1600} // Use tooltip z-index
      {...restProps}
    >
      <div className={styles.tooltipInner} data-component="tooltip">
        {content}
        {showArrow && (
          <div className={styles.tooltipArrow} data-position={getArrowPosition(position)} />
        )}
      </div>
    </Popover>
  );
};

Tooltip.displayName = 'Tooltip';
