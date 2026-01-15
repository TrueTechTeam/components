import React, { forwardRef, useState } from 'react';
import styles from './Avatar.module.scss';
import type { BaseComponentProps, ExtendedComponentSize } from '../../../types/component.types';
import { StatusIndicator } from '../StatusIndicator/StatusIndicator';

/**
 * Props for the Avatar component
 */
export interface AvatarProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Image source URL
   */
  src?: string;

  /**
   * Alt text for the image
   */
  alt?: string;

  /**
   * Size of the avatar
   * @default 'md'
   */
  size?: ExtendedComponentSize;

  /**
   * Visual variant of the avatar
   * @default 'circular'
   */
  variant?: 'circular' | 'rounded' | 'square';

  /**
   * Fallback content when image fails to load
   * Can be an icon, text, or any ReactNode
   */
  fallback?: React.ReactNode;

  /**
   * Initials to display when no image is available
   * Takes precedence over fallback if provided
   */
  initials?: string;

  /**
   * Status indicator
   */
  status?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'processing';
}

/**
 * Avatar - User profile picture or placeholder with initials/fallback
 *
 * @example
 * ```tsx
 * <Avatar src="https://example.com/avatar.jpg" alt="John Doe" size="md" />
 * ```
 *
 * @example
 * ```tsx
 * <Avatar initials="JD" status="success" variant="circular" />
 * ```
 *
 * @example
 * ```tsx
 * <Avatar fallback={<Icon name="user" />} variant="rounded" size="lg" />
 * ```
 */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt = '',
      size = 'md',
      variant = 'circular',
      fallback,
      initials,
      status,
      className,
      ...restProps
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false);

    // Merge className with component styles
    const componentClasses = [styles.avatar, className].filter(Boolean).join(' ');

    // Determine what content to show
    const showImage = src && !imageError;
    const showInitials = !showImage && initials;
    const showFallback = !showImage && !initials && fallback;

    const handleImageError = () => {
      setImageError(true);
    };

    return (
      <div
        ref={ref}
        className={componentClasses}
        data-component="avatar"
        data-variant={variant}
        data-size={size}
        data-has-status={status ? true : undefined}
        {...restProps}
      >
        {showImage && (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <img src={src} alt={alt} className={styles.avatarImage} onError={handleImageError} />
        )}
        {showInitials && <span className={styles.avatarInitials}>{initials}</span>}
        {showFallback && <span className={styles.avatarFallback}>{fallback}</span>}
        {status && (
          <div className={styles.avatarStatus}>
            <StatusIndicator status={status} size={size} />
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

