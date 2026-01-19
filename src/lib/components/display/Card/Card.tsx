import React, { forwardRef, type ReactNode, type MouseEvent, type KeyboardEvent } from 'react';
import styles from './Card.module.scss';
import type { BaseComponentProps, ComponentSize } from '../../../types/component.types';

/**
 * Card visual variants
 */
export type CardVariant = 'outlined' | 'elevated' | 'filled';

/**
 * Card padding options
 */
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

/**
 * Props for the Card component
 */
export interface CardProps extends BaseComponentProps {
  /**
   * Visual variant of the card
   * @default 'outlined'
   */
  variant?: CardVariant;

  /**
   * Size of the card (affects border-radius)
   * @default 'md'
   */
  size?: ComponentSize;

  /**
   * Padding inside the card
   * @default 'md'
   */
  padding?: CardPadding;

  /**
   * Whether the card is interactive (clickable)
   * @default false
   */
  interactive?: boolean;

  /**
   * Whether the card is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Click handler (when interactive)
   */
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;

  /**
   * Optional header content
   */
  header?: ReactNode;

  /**
   * Optional footer content
   */
  footer?: ReactNode;

  /**
   * Whether the header has a bottom divider
   * @default true (when header is provided)
   */
  headerDivider?: boolean;

  /**
   * Whether the footer has a top divider
   * @default true (when footer is provided)
   */
  footerDivider?: boolean;

  /**
   * Whether to show hover effect (auto-enabled when interactive)
   * @default false
   */
  hoverable?: boolean;

  /**
   * Whether the card takes full width
   * @default false
   */
  fullWidth?: boolean;
}

/**
 * Card - A flexible container component for grouping related content
 *
 * @example
 * ```tsx
 * <Card variant="outlined" padding="md">
 *   Card content goes here
 * </Card>
 * ```
 *
 * @example
 * ```tsx
 * <Card
 *   header={<h3>Card Title</h3>}
 *   footer={<Button>Action</Button>}
 * >
 *   Main content
 * </Card>
 * ```
 *
 * @example
 * ```tsx
 * <Card interactive onClick={() => console.log('clicked')}>
 *   Clickable card
 * </Card>
 * ```
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'outlined',
      size = 'md',
      padding = 'md',
      interactive = false,
      disabled = false,
      onClick,
      header,
      footer,
      headerDivider = true,
      footerDivider = true,
      hoverable = false,
      fullWidth = false,
      className,
      children,
      style,
      'data-testid': testId,
      'aria-label': ariaLabel,
      ...restProps
    },
    ref
  ) => {
    const isHoverable = hoverable || interactive;
    const componentClasses = [styles.card, className].filter(Boolean).join(' ');

    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
      if (disabled || !interactive) {return;}
      onClick?.(event);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (disabled || !interactive) {return;}
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick?.(event as unknown as MouseEvent<HTMLDivElement>);
      }
    };

    return (
      <div
        ref={ref}
        className={componentClasses}
        data-component="card"
        data-variant={variant}
        data-size={size}
        data-padding={padding}
        data-interactive={interactive || undefined}
        data-disabled={disabled || undefined}
        data-hoverable={isHoverable || undefined}
        data-full-width={fullWidth || undefined}
        onClick={handleClick}
        onKeyDown={interactive ? handleKeyDown : undefined}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive && !disabled ? 0 : undefined}
        aria-disabled={interactive && disabled ? true : undefined}
        aria-label={ariaLabel}
        data-testid={testId}
        style={style}
        {...restProps}
      >
        {header && (
          <div className={styles.cardHeader} data-divider={headerDivider || undefined}>
            {header}
          </div>
        )}
        <div className={styles.cardBody}>{children}</div>
        {footer && (
          <div className={styles.cardFooter} data-divider={footerDivider || undefined}>
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
