import React, { forwardRef } from 'react';
import type { CSSVariables } from '../../types';

export interface ComponentDecoratorProps {
  /**
   * Component name for data-component attribute
   */
  componentName: string;

  /**
   * CSS module classes for the root element
   */
  className?: string;

  /**
   * Test ID for testing
   */
  'data-testid'?: string;

  /**
   * Custom CSS variables for component customization
   */
  cssVariables?: CSSVariables;

  /**
   * Root element type
   */
  as?: keyof JSX.IntrinsicElements;

  /**
   * Children to render
   */
  children: React.ReactNode;

  /**
   * Additional props to spread on root element
   */
  [key: string]: unknown;
}

/**
 * Higher-order component that wraps components with standard props and styling
 *
 * @param Component - The component to wrap
 * @param componentName - Name of the component for data attributes
 * @param defaultClassName - Default CSS class to apply
 *
 * @example
 * ```tsx
 * import { withComponentDecorator } from '../../decorators';
 * import styles from './Button.module.scss';
 *
 * const ButtonBase = ({ children, variant }) => (
 *   <span className={styles[`button--${variant}`]}>{children}</span>
 * );
 *
 * export const Button = withComponentDecorator(
 *   ButtonBase,
 *   'button',
 *   styles.button
 * );
 * ```
 */
export function withComponentDecorator<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string,
  defaultClassName?: string
) {
  const DecoratedComponent = forwardRef<
    HTMLDivElement,
    P & Omit<ComponentDecoratorProps, 'componentName'>
  >((props, ref) => {
    const {
      className,
      cssVariables,
      as: Element = 'div',
      'data-testid': testId,
      children,
      ...restProps
    } = props;

    // Generate CSS variable styles
    const cssVarStyles = cssVariables
      ? Object.entries(cssVariables).reduce(
          (acc, [key, value]) => {
            const varName = `--${componentName}-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            acc[varName] = typeof value === 'number' ? `${value}px` : value;
            return acc;
          },
          {} as Record<string, string>
        )
      : undefined;

    // Combine classnames
    const combinedClassName = [defaultClassName, className].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        className={combinedClassName}
        style={cssVarStyles as React.CSSProperties}
        data-component={componentName}
        data-testid={testId || componentName}
        {...(restProps as Record<string, unknown>)}
      >
        <Component {...(restProps as P)}>{children}</Component>
      </div>
    );
  });

  DecoratedComponent.displayName = `WithComponentDecorator(${componentName})`;

  return DecoratedComponent;
}

export default withComponentDecorator;
