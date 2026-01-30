/**
 * Dialog component - Modal dialog for user interactions
 */

import React, { forwardRef, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { Portal } from '../Portal';
import { useEscapeKey, useFocusTrap } from '../../../hooks';
import { IconButton } from '../../buttons/IconButton';
import type { BaseComponentProps } from '../../../types';
import styles from './Dialog.module.scss';

/**
 * Dialog size options
 */
export type DialogSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Animation state for the dialog
 */
type AnimationState = 'entering' | 'entered' | 'exiting' | 'exited';

/**
 * Dialog props
 */
export interface DialogProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Whether the dialog is open (controlled)
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
   * Callback when dialog requests to close
   */
  onClose?: () => void;

  /**
   * Dialog title (rendered in header)
   */
  title?: ReactNode;

  /**
   * Dialog content (main body)
   */
  children?: ReactNode;

  /**
   * Actions/buttons to render in footer
   */
  actions?: ReactNode;

  /**
   * Dialog size preset
   * @default 'md'
   */
  size?: DialogSize;

  /**
   * Custom width (overrides size preset)
   */
  width?: string | number;

  /**
   * Maximum height (content scrolls if exceeded)
   */
  maxHeight?: string | number;

  /**
   * Close when clicking backdrop
   * @default true
   */
  closeOnBackdropClick?: boolean;

  /**
   * Close when pressing Escape key
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Whether to show close button in header
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * Whether to trap focus within dialog
   * @default true
   */
  trapFocus?: boolean;

  /**
   * Whether to block body scroll when open
   * @default true
   */
  blockScroll?: boolean;

  /**
   * Enable backdrop blur effect
   * @default false
   */
  blurBackdrop?: boolean;

  /**
   * Backdrop opacity (0-1)
   * @default 0.5
   */
  backdropOpacity?: number;

  /**
   * Custom z-index
   */
  zIndex?: number;

  /**
   * Animation duration in milliseconds
   * @default 200
   */
  animationDuration?: number;

  /**
   * Dialog role for accessibility
   * @default 'dialog'
   */
  role?: 'dialog' | 'alertdialog';

  /**
   * ARIA labelledby ID
   */
  'aria-labelledby'?: string;

  /**
   * ARIA describedby ID
   */
  'aria-describedby'?: string;

  /**
   * Whether dialog is modal (prevents interaction outside)
   * @default true
   */
  modal?: boolean;

  /**
   * Render function for custom header
   */
  renderHeader?: (props: { title?: ReactNode; onClose: () => void }) => ReactNode;

  /**
   * Render function for custom footer
   */
  renderFooter?: (props: { actions?: ReactNode; onClose: () => void }) => ReactNode;

  /**
   * Custom class for backdrop
   */
  backdropClassName?: string;

  /**
   * Custom class for content container
   */
  contentClassName?: string;

  /**
   * Callback after open animation completes
   */
  onOpenComplete?: () => void;

  /**
   * Callback after close animation completes
   */
  onCloseComplete?: () => void;
}

/**
 * Dialog header props (for compound component)
 */
export interface DialogHeaderProps extends BaseComponentProps {
  /**
   * Whether to show close button
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * Close button click handler
   */
  onClose?: () => void;
}

/**
 * Dialog body props (for compound component)
 */
export interface DialogBodyProps extends BaseComponentProps {
  /**
   * Enable scroll for content overflow
   * @default true
   */
  scrollable?: boolean;
}

/**
 * Dialog footer props (for compound component)
 */
export interface DialogFooterProps extends BaseComponentProps {
  /**
   * Alignment of actions
   * @default 'end'
   */
  align?: 'start' | 'center' | 'end' | 'space-between';
}

/**
 * Generate unique ID for accessibility
 */
let dialogIdCounter = 0;
const generateDialogId = () => `dialog-${++dialogIdCounter}`;

/**
 * Dialog Header compound component
 */
export const DialogHeader: React.FC<DialogHeaderProps> = ({
  children,
  showCloseButton = true,
  onClose,
  className,
  'data-testid': testId,
  style,
  ...restProps
}) => {
  const classes = [styles.dialogHeader, className].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      data-component="dialog-header"
      data-testid={testId || 'dialog-header'}
      style={style}
      {...restProps}
    >
      <div className={styles.dialogHeaderContent}>{children}</div>
      {showCloseButton && onClose && (
        <IconButton
          icon="close"
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label="Close dialog"
          data-testid="dialog-close-button"
        />
      )}
    </div>
  );
};

DialogHeader.displayName = 'DialogHeader';

/**
 * Dialog Body compound component
 */
export const DialogBody: React.FC<DialogBodyProps> = ({
  children,
  scrollable = true,
  className,
  'data-testid': testId,
  style,
  ...restProps
}) => {
  const classes = [styles.dialogBody, className].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      data-component="dialog-body"
      data-testid={testId || 'dialog-body'}
      data-scrollable={scrollable || undefined}
      style={style}
      {...restProps}
    >
      {children}
    </div>
  );
};

DialogBody.displayName = 'DialogBody';

/**
 * Dialog Footer compound component
 */
export const DialogFooter: React.FC<DialogFooterProps> = ({
  children,
  align = 'end',
  className,
  'data-testid': testId,
  style,
  ...restProps
}) => {
  const classes = [styles.dialogFooter, className].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      data-component="dialog-footer"
      data-testid={testId || 'dialog-footer'}
      data-align={align}
      style={style}
      {...restProps}
    >
      {children}
    </div>
  );
};

DialogFooter.displayName = 'DialogFooter';

/**
 * Dialog component
 * Modal dialog for user interactions with customizable content
 */
export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      isOpen: controlledIsOpen,
      defaultOpen = false,
      onOpenChange,
      onClose,
      title,
      children,
      actions,
      size = 'md',
      width,
      maxHeight,
      closeOnBackdropClick = true,
      closeOnEscape = true,
      showCloseButton = true,
      trapFocus = true,
      blockScroll = true,
      blurBackdrop = false,
      backdropOpacity = 0.5,
      zIndex,
      animationDuration = 200,
      role = 'dialog',
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,
      modal = true,
      renderHeader,
      renderFooter,
      backdropClassName,
      contentClassName,
      onOpenComplete,
      onCloseComplete,
      className,
      'data-testid': testId,
      style: customStyle,
      ...restProps
    },
    ref
  ) => {
    // Controlled/uncontrolled state management
    const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(defaultOpen);
    const isOpen = controlledIsOpen ?? uncontrolledIsOpen;

    // Animation state
    const [animationState, setAnimationState] = useState<AnimationState>('exited');

    // Refs
    const dialogRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    // Generate unique IDs for accessibility
    const [dialogId] = useState(generateDialogId);
    const titleId = ariaLabelledby || `${dialogId}-title`;
    const bodyId = ariaDescribedby || `${dialogId}-body`;

    // Merge refs
    const setRefs = useCallback(
      (element: HTMLDivElement | null) => {
        (dialogRef as React.MutableRefObject<HTMLDivElement | null>).current = element;
        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = element;
        }
      },
      [ref]
    );

    // Handle open state change
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

    // Handle close
    const handleClose = useCallback(() => {
      handleOpenChange(false);
    }, [handleOpenChange]);

    // Handle backdrop click
    const handleBackdropClick = useCallback(
      (event: React.MouseEvent) => {
        if (closeOnBackdropClick && event.target === event.currentTarget) {
          handleClose();
        }
      },
      [closeOnBackdropClick, handleClose]
    );

    // Focus trap
    useFocusTrap(dialogRef, animationState === 'entered' && trapFocus);

    // Escape key handling
    useEscapeKey(handleClose, isOpen && closeOnEscape);

    // Body scroll lock
    useEffect(() => {
      if (isOpen && blockScroll) {
        const originalOverflow = document.body.style.overflow;
        const originalPaddingRight = document.body.style.paddingRight;
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        document.body.style.overflow = 'hidden';
        if (scrollbarWidth > 0) {
          document.body.style.paddingRight = `${scrollbarWidth}px`;
        }

        return () => {
          document.body.style.overflow = originalOverflow;
          document.body.style.paddingRight = originalPaddingRight;
        };
      }
    }, [isOpen, blockScroll]);

    // Focus management - save and restore focus
    useEffect(() => {
      if (isOpen) {
        previousActiveElement.current = document.activeElement as HTMLElement;
      } else if (previousActiveElement.current) {
        previousActiveElement.current.focus();
        previousActiveElement.current = null;
      }
    }, [isOpen]);

    // Animation handling
    useEffect(() => {
      if (isOpen) {
        setAnimationState('entering');
        const timer = setTimeout(() => {
          setAnimationState('entered');
          onOpenComplete?.();
        }, animationDuration);
        return () => clearTimeout(timer);
      } else if (animationState !== 'exited') {
        setAnimationState('exiting');
        const timer = setTimeout(() => {
          setAnimationState('exited');
          onCloseComplete?.();
        }, animationDuration);
        return () => clearTimeout(timer);
      }
    }, [isOpen, animationDuration, onOpenComplete, onCloseComplete]);

    // Don't render if fully closed
    if (animationState === 'exited' && !isOpen) {
      return null;
    }

    // CSS Variables
    const cssVariables = {
      '--dialog-animation-duration': `${animationDuration}ms`,
      '--dialog-backdrop-opacity': backdropOpacity,
      ...(width && { '--dialog-width': typeof width === 'number' ? `${width}px` : width }),
      ...(maxHeight && {
        '--dialog-max-height': typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
      }),
      ...(zIndex && { '--dialog-z-index': zIndex }),
    } as React.CSSProperties;

    const backdropClasses = [styles.dialogBackdrop, backdropClassName].filter(Boolean).join(' ');
    const contentClasses = [styles.dialogContent, contentClassName, className]
      .filter(Boolean)
      .join(' ');

    // Render header
    const headerContent = renderHeader ? (
      renderHeader({ title, onClose: handleClose })
    ) : title ? (
      <DialogHeader showCloseButton={showCloseButton} onClose={handleClose}>
        <h2 id={titleId} className={styles.dialogTitle}>
          {title}
        </h2>
      </DialogHeader>
    ) : showCloseButton ? (
      <DialogHeader showCloseButton={showCloseButton} onClose={handleClose} />
    ) : null;

    // Render footer
    const footerContent = renderFooter ? (
      renderFooter({ actions, onClose: handleClose })
    ) : actions ? (
      <DialogFooter>{actions}</DialogFooter>
    ) : null;

    return (
      <Portal zIndex={zIndex}>
        <div
          className={backdropClasses}
          data-component="dialog-backdrop"
          data-state={animationState}
          data-blur={blurBackdrop || undefined}
          onClick={handleBackdropClick}
          style={cssVariables}
        >
          <div
            ref={setRefs}
            className={contentClasses}
            data-component="dialog"
            data-size={size}
            data-state={animationState}
            data-testid={testId || 'dialog'}
            role={role}
            aria-modal={modal}
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={children ? bodyId : undefined}
            style={customStyle}
            {...restProps}
          >
            {headerContent}
            {children && (
              <DialogBody>
                <div id={bodyId}>{children}</div>
              </DialogBody>
            )}
            {footerContent}
          </div>
        </div>
      </Portal>
    );
  }
);

Dialog.displayName = 'Dialog';

export default Dialog;
