import React, { forwardRef, useRef, useCallback } from 'react';
import { Tooltip } from '../../overlays/Tooltip';
import type { PopoverPosition } from '../../../utils/positioning';
import type { BaseComponentProps } from '../../../types';
import styles from './OverflowText.module.scss';

/**
 * Props for the OverflowText component
 */
export interface OverflowTextProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Text content to display
   */
  children: string;

  /**
   * Maximum number of lines before truncation
   * @default 1
   */
  lines?: number;

  /**
   * Position of the tooltip
   * @default 'top'
   */
  tooltipPosition?: PopoverPosition;

  /**
   * Delay before showing tooltip (ms)
   * @default 200
   */
  tooltipDelay?: number;

  /**
   * Whether to disable the tooltip (always truncate, never show full text)
   * @default false
   */
  disableTooltip?: boolean;

  /**
   * Custom tooltip content (defaults to full text)
   */
  tooltipContent?: React.ReactNode;

  /**
   * Maximum width of the tooltip
   * @default 300
   */
  tooltipMaxWidth?: number;

  /**
   * HTML element to render
   * @default 'span'
   */
  as?: 'span' | 'p' | 'div';

  /**
   * Callback when text overflow state changes
   * @param isOverflowing - Whether text is currently overflowing
   */
  onOverflowChange?: (isOverflowing: boolean) => void;
}

/**
 * OverflowText - Text that truncates with ellipsis and shows full content in tooltip
 *
 * @example
 * Single line truncation:
 * ```tsx
 * <OverflowText>
 *   This is a very long text that will be truncated with ellipsis
 * </OverflowText>
 * ```
 *
 * @example
 * Multi-line truncation:
 * ```tsx
 * <OverflowText lines={2}>
 *   This is a very long text that spans multiple lines and will be
 *   truncated after the second line with an ellipsis.
 * </OverflowText>
 * ```
 *
 * @example
 * With custom tooltip position:
 * ```tsx
 * <OverflowText tooltipPosition="bottom" tooltipDelay={500}>
 *   Hover to see the full text in a tooltip at the bottom
 * </OverflowText>
 * ```
 */
export const OverflowText = forwardRef<HTMLElement, OverflowTextProps>(
  (
    {
      children,
      lines = 1,
      tooltipPosition = 'bottom',
      tooltipDelay = 200,
      disableTooltip = false,
      tooltipContent,
      tooltipMaxWidth = 300,
      as: Component = 'span',
      onOverflowChange,
      className,
      style,
      'data-testid': testId,
      'aria-label': ariaLabel,
      ...restProps
    },
    ref
  ) => {
    const textRef = useRef<HTMLElement>(null);

    // Merge refs
    const setRefs = useCallback(
      (node: HTMLElement | null) => {
        (textRef as React.MutableRefObject<HTMLElement | null>).current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    const componentClasses = [styles.overflowText, className].filter(Boolean).join(' ');

    const cssVariables = {
      '--overflow-text-lines': lines,
      '--overflow-text-tooltip-max-width': `${tooltipMaxWidth}px`,
      ...style,
    } as React.CSSProperties;

    const textElement = (
      <Component
        ref={setRefs}
        className={componentClasses}
        style={cssVariables}
        data-component="overflow-text"
        data-lines={lines}
        data-testid={testId}
        aria-label={ariaLabel || String(children)}
        title={disableTooltip ? String(children) : undefined}
        {...restProps}
      >
        {children}
      </Component>
    );

    // If tooltip disabled, just render the text
    if (disableTooltip) {
      return textElement;
    }

    // Wrap with Tooltip when overflowing
    return (
      <Tooltip
        content={
          <span className={styles.tooltipContent} style={{ maxWidth: tooltipMaxWidth }}>
            {tooltipContent ?? children}
          </span>
        }
        position={tooltipPosition}
        delayShow={tooltipDelay}
      >
        {textElement}
      </Tooltip>
    );
  }
);

OverflowText.displayName = 'OverflowText';

export default OverflowText;
