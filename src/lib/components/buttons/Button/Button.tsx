import React, { useRef, useState, useEffect } from 'react';
import type { ExtendedComponentSize, ComponentVariant, BaseComponentProps } from '../../../types';
import { Icon } from '../../display/Icon';
import type { IconName } from '../../display/Icon/icons';
import { Spinner } from '../../display/Spinner';
import styles from './Button.module.scss';

// Helper to render icon from IconName or ReactNode
const renderIcon = (
  icon: React.ReactNode | IconName | undefined,
  size: ExtendedComponentSize = 'md'
): React.ReactNode => {
  if (!icon) {
    return null;
  }
  if (typeof icon === 'string') {
    return <Icon name={icon as IconName} size={size} />;
  }
  return icon;
};

export interface ButtonProps extends BaseComponentProps {
  /**
   * Button variant
   * @default 'primary'
   */
  variant?: ComponentVariant;

  /**
   * Button size
   * @default 'md'
   */
  size?: ExtendedComponentSize;

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Button type attribute
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * Click handler
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Whether the button should take full width
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Icon to display before the text
   * Can be an icon name or a React component
   */
  startIcon?: React.ReactNode | IconName;

  /**
   * Icon to display after the text
   * Can be an icon name or a React component
   */
  endIcon?: React.ReactNode | IconName;

  /**
   * Whether the button is in loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Text to display while loading (replaces children)
   */
  loadingText?: string;

  /**
   * Position of the loading spinner
   * @default 'start'
   */
  loadingPosition?: 'start' | 'end' | 'center';
}

/**
 * Button component with multiple variants and sizes
 */
// Map button size to spinner size
const getSpinnerSize = (buttonSize: ExtendedComponentSize): ExtendedComponentSize => {
  switch (buttonSize) {
    case 'xs':
      return 'xs';
    case 'sm':
      return 'xs';
    case 'md':
      return 'sm';
    case 'lg':
      return 'sm';
    case 'xl':
      return 'md';
    default:
      return 'sm';
  }
};

export const Button = ({
  ref,
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  onClick,
  fullWidth = false,
  startIcon,
  endIcon,
  loading = false,
  loadingText,
  loadingPosition = 'start',
  className,
  'data-testid': testId,
  'aria-label': ariaLabel,
  style,
  ...restProps
}: ButtonProps & {
  ref?: React.Ref<HTMLButtonElement>;
}) => {
  const internalRef = useRef<HTMLButtonElement>(null);
  const [minWidth, setMinWidth] = useState<number | undefined>();

  // Capture button width before loading starts to prevent layout shift
  useEffect(() => {
    const buttonEl = internalRef.current;
    if (buttonEl && !loading) {
      setMinWidth(buttonEl.offsetWidth);
    }
  }, [loading, children]);

  // Merge refs
  const setRefs = (element: HTMLButtonElement | null) => {
    (internalRef as React.MutableRefObject<HTMLButtonElement | null>).current = element;
    if (typeof ref === 'function') {
      ref(element);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLButtonElement | null>).current = element;
    }
  };

  const buttonClasses = [styles.button, className].filter(Boolean).join(' ');
  const isDisabled = disabled || loading;

  const spinner = (
    <Spinner size={getSpinnerSize(size)} variant="currentColor" spinnerStyle="circular" srText="" />
  );

  const renderContent = () => {
    if (loading) {
      const text = loadingText !== undefined ? loadingText : children;

      if (loadingPosition === 'center') {
        return spinner;
      }

      return (
        <>
          {loadingPosition === 'start' && spinner}
          {text}
          {loadingPosition === 'end' && spinner}
        </>
      );
    }

    return (
      <>
        {startIcon && renderIcon(startIcon, size)}
        {children}
        {endIcon && renderIcon(endIcon, size)}
      </>
    );
  };

  return (
    <button
      ref={setRefs}
      type={type}
      className={buttonClasses}
      data-variant={variant}
      data-size={size}
      data-full-width={fullWidth || undefined}
      data-loading={loading || undefined}
      disabled={isDisabled}
      onClick={onClick}
      data-component="button"
      data-testid={testId || 'button'}
      aria-label={ariaLabel}
      aria-busy={loading}
      style={{
        ...style,
        ...(minWidth && loading ? { minWidth: `${minWidth}px` } : {}),
      }}
      {...restProps}
    >
      {renderContent()}
    </button>
  );
};

export default Button;
