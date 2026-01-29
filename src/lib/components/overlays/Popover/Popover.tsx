/**
 * Popover component - Base overlay component with positioning
 */

import {
  useState,
  useCallback,
  useMemo,
  cloneElement,
  isValidElement,
  type ReactNode,
  type ReactElement,
  type RefObject,
} from 'react';
import { Portal } from '../Portal';
import { useClickOutside, useEscapeKey, usePopoverPosition } from '../../../hooks';
import type { PopoverPosition, PopoverWidth } from '../../../utils';
import type { BaseComponentProps } from '../../../types';
import styles from './Popover.module.scss';

/**
 * Popover component props
 */
export interface PopoverProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Whether the popover is open (controlled)
   */
  isOpen?: boolean;

  /**
   * Default open state (uncontrolled)
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Callback when open state changes
   */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * Popover position relative to trigger
   * @default 'bottom'
   */
  position?: PopoverPosition;

  /**
   * Gap between trigger and popover in pixels
   * @default 8
   */
  offset?: number;

  /**
   * Allow position to flip if would overflow viewport
   * @default true
   */
  allowFlip?: boolean;

  /**
   * Close on click outside
   * @default true
   */
  closeOnClickOutside?: boolean;

  /**
   * Close on Escape key
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Trigger element (render prop or ReactNode)
   */
  trigger: ReactNode | ((props: { ref: RefObject<HTMLElement> }) => ReactNode);

  /**
   * Popover content
   */
  children: ReactNode;

  /**
   * Z-index for popover
   */
  zIndex?: number;

  /**
   * Width configuration for popover
   * @default 'auto'
   */
  width?: PopoverWidth;

  /**
   * Callback when popover is closed
   */
  onClose?: () => void;
}

/**
 * Popover component
 * Base component for creating positioned overlays
 */
export const Popover: React.FC<PopoverProps> = ({
  isOpen: controlledIsOpen,
  defaultOpen = false,
  onOpenChange,
  position = 'bottom-left',
  offset = 8,
  allowFlip = true,
  closeOnClickOutside = true,
  closeOnEscape = true,
  trigger,
  children,
  zIndex,
  width = 'auto',
  onClose,
  className,
  'data-testid': testId,
  style: customStyle,
  ...restProps
}) => {
  // Controlled/uncontrolled state management
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(defaultOpen);
  const isOpen = controlledIsOpen ?? uncontrolledIsOpen;

  const handleOpenChange = useCallback(
    (newIsOpen: boolean) => {
      if (controlledIsOpen === undefined) {
        setUncontrolledIsOpen(newIsOpen);
      }
      onOpenChange?.(newIsOpen);
      if (!newIsOpen) {
        onClose?.();
      }
    },
    [controlledIsOpen, onOpenChange, onClose]
  );

  const handleClose = useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  // Position calculation
  const {
    popoverRef,
    triggerRef,
    style: positionStyle,
    actualPosition,
  } = usePopoverPosition({
    isOpen,
    width,
    position,
    offset,
    allowFlip,
  });

  // Click outside detection - exclude trigger element
  useClickOutside(popoverRef, handleClose, isOpen && closeOnClickOutside, [triggerRef]);

  // Escape key handling
  useEscapeKey(handleClose, isOpen && closeOnEscape);

  // Handle trigger click to toggle popover
  const handleTriggerClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      handleOpenChange(!isOpen);
    },
    [handleOpenChange, isOpen]
  );

  // Render trigger with ref and click handler - wrapped in useMemo to avoid unnecessary re-renders
  // triggerRef is not included in deps because the ref object itself never changes
  const triggerElement = useMemo(
    () =>
      typeof trigger === 'function' ? (
        trigger({ ref: triggerRef })
      ) : isValidElement(trigger) ? (
        cloneElement(
          trigger as ReactElement,
          {
            ref: triggerRef,
            onClick: (event: React.MouseEvent) => {
              // Call original onClick if it exists
              const originalOnClick = (trigger as ReactElement).props?.onClick;
              originalOnClick?.(event);
              handleTriggerClick(event);
            },
          } as any
        )
      ) : (
        <span ref={triggerRef as any} onClick={handleTriggerClick}>{trigger}</span>
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [trigger, handleTriggerClick]
  );

  // Combine styles
  const combinedStyle = {
    ...positionStyle,
    ...(zIndex !== undefined && { zIndex }),
    ...customStyle,
  };

  const classes = [styles.popoverContent, className].filter(Boolean).join(' ');

  return (
    <>
      {triggerElement}
      {isOpen && (
        <Portal>
          <div
            ref={popoverRef}
            className={classes}
            data-component="popover"
            data-position={actualPosition}
            data-state="open"
            data-testid={testId || 'popover'}
            style={combinedStyle}
            {...restProps}
          >
            {children}
          </div>
        </Portal>
      )}
    </>
  );
};

Popover.displayName = 'Popover';

