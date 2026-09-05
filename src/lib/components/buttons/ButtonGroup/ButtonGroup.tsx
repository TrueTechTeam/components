import React from 'react';
import type { BaseComponentProps, ComponentVariant } from '../../../types';
import styles from './ButtonGroup.module.scss';

export interface ButtonGroupProps extends BaseComponentProps {
  /**
   * Orientation of the button group
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Whether buttons should take full width (distribute equally)
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Default variant applied to every button in the group, so they share the same
   * text/icon and background color. A button can override this by specifying its
   * own `variant` prop directly.
   * @default 'primary'
   */
  variant?: ComponentVariant;

  /**
   * Button-like children (e.g. Button, IconButton)
   */
  children: React.ReactNode;
}

/**
 * ButtonGroup component - visually groups buttons that each have their own action
 *
 * Unlike ButtonToggleGroup, there is no shared selection state: each child button
 * keeps its own onClick handler and is rendered as passed. Use this to group
 * related but distinct actions, such as a primary text button paired with an
 * icon button.
 *
 * Buttons share the group's `variant` (same text/icon and background color) by
 * default, and are separated by a divider colored to match that text color.
 * Pass `variant` directly on a child to opt it out and give it a different look.
 *
 * @example
 * ```tsx
 * <ButtonGroup>
 *   <Button onClick={handleSave}>Save</Button>
 *   <IconButton icon="chevron-down" aria-label="More options" onClick={handleMore} />
 * </ButtonGroup>
 * ```
 */
export const ButtonGroup = ({
  ref,
  orientation = 'horizontal',
  fullWidth = false,
  variant = 'primary',
  children,
  className,
  'data-testid': testId,
  'aria-label': ariaLabel,
  style,
  ...restProps
}: ButtonGroupProps & {
  ref?: React.Ref<HTMLDivElement>;
}) => {
  const groupClasses = [styles.buttonGroup, className].filter(Boolean).join(' ');

  // Apply the group variant to each button unless it specifies its own
  const items = React.Children.map(children, (child) => {
    if (!React.isValidElement<{ variant?: ComponentVariant }>(child)) {
      return child;
    }
    return React.cloneElement(child, {
      variant: child.props.variant ?? variant,
    });
  });

  return (
    <div
      ref={ref}
      role="group"
      className={groupClasses}
      data-orientation={orientation}
      data-full-width={fullWidth || undefined}
      data-component="button-group"
      data-testid={testId || 'button-group'}
      aria-label={ariaLabel}
      style={style}
      {...restProps}
    >
      {items}
    </div>
  );
};

export default ButtonGroup;
