/**
 * Accordion component - Expandable/collapsible content panel with header
 */

import { useState, useCallback, useId, type ReactNode, type KeyboardEvent } from 'react';
import type { BaseComponentProps, ComponentSize } from '../../../types';
import type { IconName } from '../../display/Icon/icons';
import { Icon } from '../../display/Icon';
import { Collapse } from '../Collapse';
import { useAccordionContext } from './AccordionContext';
import styles from './Accordion.module.scss';

/**
 * Position of the expand/collapse icon
 */
export type AccordionIconPosition = 'left' | 'right';

export interface AccordionProps extends BaseComponentProps {
  /**
   * Unique identifier for the accordion
   * Required when used within AccordionContainer
   */
  id?: string;

  /**
   * Header content (can be string or ReactNode)
   */
  header: ReactNode;

  /**
   * Accordion body content
   */
  children: ReactNode;

  /**
   * Whether the accordion is expanded (controlled)
   */
  isOpen?: boolean;

  /**
   * Default expanded state (uncontrolled)
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Callback when open state changes
   * @param isOpen - The new open state
   */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * Position of the expand/collapse icon
   * @default 'right'
   */
  iconPosition?: AccordionIconPosition;

  /**
   * Custom expand icon (icon name or ReactNode)
   * @default 'chevron-down'
   */
  expandIcon?: IconName | ReactNode;

  /**
   * Custom collapse icon (icon name or ReactNode)
   * If not provided, expandIcon will rotate 180deg
   */
  collapseIcon?: IconName | ReactNode;

  /**
   * Whether to disable the accordion
   * @default false
   */
  disabled?: boolean;

  /**
   * Accordion size variant
   * @default 'md'
   */
  size?: ComponentSize;

  /**
   * Whether to show border around the accordion
   * @default true
   */
  bordered?: boolean;

  /**
   * Animation duration in milliseconds
   * @default 250
   */
  animationDuration?: number;

  /**
   * Whether to unmount body content when collapsed
   * @default false
   */
  unmountOnCollapse?: boolean;

  /**
   * Additional header icon (shown before header text)
   */
  headerIcon?: IconName | ReactNode;

  /**
   * Callback when header is clicked
   */
  onHeaderClick?: () => void;
}

/**
 * Helper to render an icon (IconName or ReactNode)
 */
function renderIcon(icon: IconName | ReactNode | undefined, size: number): ReactNode {
  if (!icon) {
    return null;
  }
  if (typeof icon === 'string') {
    return <Icon name={icon as IconName} size={size} />;
  }
  return icon;
}

/**
 * Get icon size based on accordion size
 */
function getIconSize(size: ComponentSize): number {
  switch (size) {
    case 'sm':
      return 16;
    case 'lg':
      return 24;
    case 'md':
    default:
      return 20;
  }
}

/**
 * Accordion component
 * A collapsible panel with a clickable header and expandable body
 *
 * @example
 * ```tsx
 * // Standalone usage
 * <Accordion header="Section Title">
 *   <p>Section content here</p>
 * </Accordion>
 *
 * // With custom icon position
 * <Accordion header="Settings" iconPosition="left">
 *   <p>Settings content</p>
 * </Accordion>
 *
 * // Controlled
 * <Accordion
 *   header="Details"
 *   isOpen={isExpanded}
 *   onOpenChange={setIsExpanded}
 * >
 *   <p>Details content</p>
 * </Accordion>
 * ```
 */
export const Accordion = ({
  ref,
  id: providedId,
  header,
  children,
  isOpen: controlledIsOpen,
  defaultOpen = false,
  onOpenChange,
  iconPosition = 'right',
  expandIcon = 'chevron-down',
  collapseIcon,
  disabled = false,
  size = 'md',
  bordered = true,
  animationDuration = 250,
  unmountOnCollapse = false,
  headerIcon,
  onHeaderClick,
  className,
  style,
  'data-testid': testId,
  'aria-label': ariaLabel,
  ...restProps
}: AccordionProps & {
  ref?: React.Ref<HTMLDivElement>;
}) => {
  // Check for container context
  const containerContext = useAccordionContext();

  // Generate unique ID for accessibility
  const generatedId = useId();
  const accordionId = providedId || generatedId;
  const headerId = `accordion-header-${accordionId}`;
  const panelId = `accordion-panel-${accordionId}`;

  // Determine if accordion is controlled externally
  const isControlled = controlledIsOpen !== undefined;

  // Internal state for uncontrolled usage
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(defaultOpen);

  // Determine actual open state
  // Priority: container context > controlled prop > internal state
  const isOpen = containerContext
    ? containerContext.expandedIds.has(accordionId)
    : isControlled
      ? controlledIsOpen
      : uncontrolledIsOpen;

  // Determine if disabled (container can disable all)
  const isDisabled = disabled || containerContext?.disabled || false;

  // Use container size/bordered if not explicitly set and in container
  const effectiveSize = containerContext?.size ?? size;
  const effectiveBordered = containerContext?.bordered ?? bordered;

  // Handle toggle
  const handleToggle = useCallback(() => {
    if (isDisabled) {
      return;
    }

    if (containerContext) {
      // Let container handle state
      containerContext.toggleAccordion(accordionId);
    } else if (isControlled) {
      // Notify parent of change
      onOpenChange?.(!isOpen);
    } else {
      // Update internal state
      const newIsOpen = !isOpen;
      setUncontrolledIsOpen(newIsOpen);
      onOpenChange?.(newIsOpen);
    }

    onHeaderClick?.();
  }, [
    isDisabled,
    containerContext,
    accordionId,
    isControlled,
    isOpen,
    onOpenChange,
    onHeaderClick,
  ]);

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleToggle();
      }
    },
    [handleToggle]
  );

  // Determine which icon to show
  const iconSize = getIconSize(effectiveSize);
  const useRotation = !collapseIcon;
  const currentIcon = isOpen && collapseIcon ? collapseIcon : expandIcon;

  // Build class names
  const classes = [styles.accordion, className].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      className={classes}
      data-component="accordion"
      data-size={effectiveSize}
      data-bordered={effectiveBordered || undefined}
      data-disabled={isDisabled || undefined}
      data-open={isOpen || undefined}
      data-testid={testId}
      style={style}
      {...restProps}
    >
      {/* Header */}
      <button
        id={headerId}
        type="button"
        className={styles.accordionHeader}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-disabled={isDisabled || undefined}
        aria-label={ariaLabel}
        data-icon-position={iconPosition}
        data-disabled={isDisabled || undefined}
      >
        {/* Icon on left */}
        {iconPosition === 'left' && (
          <span
            className={styles.accordionIcon}
            data-open={useRotation && isOpen ? true : undefined}
          >
            {renderIcon(currentIcon, iconSize)}
          </span>
        )}

        {/* Header icon (optional) */}
        {headerIcon && (
          <span className={styles.accordionHeaderIcon}>{renderIcon(headerIcon, iconSize)}</span>
        )}

        {/* Header content */}
        <span className={styles.accordionHeaderContent}>{header}</span>

        {/* Icon on right */}
        {iconPosition === 'right' && (
          <span
            className={styles.accordionIcon}
            data-open={useRotation && isOpen ? true : undefined}
          >
            {renderIcon(currentIcon, iconSize)}
          </span>
        )}
      </button>

      {/* Body */}
      <Collapse isOpen={isOpen} duration={animationDuration} unmountOnCollapse={unmountOnCollapse}>
        <div id={panelId} role="region" aria-labelledby={headerId} className={styles.accordionBody}>
          <div className={styles.accordionBodyContent}>{children}</div>
        </div>
      </Collapse>
    </div>
  );
};

export default Accordion;
