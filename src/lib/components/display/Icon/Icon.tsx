import React from 'react';
import { iconRegistry, type IconName } from './icons';
import type { BaseComponentProps, ExtendedComponentSize } from '../../../types';
import styles from './Icon.module.scss';

/**
 * Maps ExtendedComponentSize to pixel values for icons
 */
export const ICON_SIZE_MAP: Record<ExtendedComponentSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

/**
 * Converts ExtendedComponentSize to pixel value
 */
export function getIconSize(size: ExtendedComponentSize | number | string): number | string {
  if (typeof size === 'string' && size in ICON_SIZE_MAP) {
    return ICON_SIZE_MAP[size as ExtendedComponentSize];
  }
  return size;
}

export interface IconProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Name of the icon from the icon registry
   */
  name: IconName;

  /**
   * Size of the icon
   * Can be:
   * - ExtendedComponentSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' (mapped to pixels)
   * - number: pixel value
   * - string: CSS size value
   * @default 'lg' (24px)
   */
  size?: ExtendedComponentSize | number | string;

  /**
   * Color of the icon (CSS color value or theme variable)
   * @default 'currentColor'
   */
  color?: string;

  /**
   * Accessible label for screen readers
   */
  'aria-label'?: string;

  /**
   * Title for the icon (shown on hover)
   */
  title?: string;
}

/**
 * Icon component for rendering SVG icons
 */
export function Icon({
  name,
  size = 'lg',
  color = 'currentColor',
  className,
  'aria-label': ariaLabel,
  'data-testid': testId,
  title,
  style,
}: IconProps) {
  const IconComponent = iconRegistry[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in registry`);
    return null;
  }

  // Use size mapping utility
  const resolvedSize = getIconSize(size);
  const sizeValue = typeof resolvedSize === 'number' ? `${resolvedSize}px` : resolvedSize;

  const iconStyle = {
    '--icon-size': sizeValue,
    '--icon-color': color,
    ...style,
  } as React.CSSProperties;

  // Icons are decorative unless given an accessible name: an unlabeled icon next to text would
  // otherwise be announced by its registry name ("chevron-down", "error").
  const accessibleName = ariaLabel || title;
  const a11yProps = accessibleName
    ? { role: 'img', 'aria-label': accessibleName }
    : { 'aria-hidden': true as const };

  return (
    <span
      className={`${styles.icon} ${className || ''}`}
      style={iconStyle}
      data-testid={testId || `icon-${name}`}
      title={title}
      {...a11yProps}
    >
      <IconComponent />
    </span>
  );
}

export default Icon;
