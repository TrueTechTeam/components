/**
 * AccordionContainer component - Manages multiple accordions with expand/collapse all
 */

import {
  useState,
  useCallback,
  useMemo,
  Children,
  isValidElement,
  cloneElement,
  type ReactNode,
  type ReactElement,
} from 'react';
import type { BaseComponentProps, ComponentSize } from '../../../types';
import { Button } from '../../buttons/Button';
import { AccordionContext, type AccordionMode, type AccordionContextValue } from './AccordionContext';
import type { AccordionProps } from './Accordion';
import styles from './AccordionContainer.module.scss';

/**
 * Position of the expand/collapse all controls
 */
export type AccordionControlsPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface AccordionContainerProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Accordion children
   */
  children: ReactNode;

  /**
   * Mode for accordion expansion
   * - 'single': Only one accordion can be open at a time
   * - 'multiple': Multiple accordions can be open simultaneously
   * @default 'multiple'
   */
  mode?: AccordionMode;

  /**
   * Array of expanded accordion IDs (controlled)
   */
  expandedIds?: string[];

  /**
   * Default expanded accordion IDs (uncontrolled)
   * @default []
   */
  defaultExpandedIds?: string[];

  /**
   * Callback when expanded IDs change
   * @param expandedIds - Array of currently expanded accordion IDs
   */
  onExpandedChange?: (expandedIds: string[]) => void;

  /**
   * Whether to show expand all / collapse all controls
   * @default false
   */
  showExpandAllControls?: boolean;

  /**
   * Label for "Expand All" button
   * @default 'Expand All'
   */
  expandAllLabel?: ReactNode;

  /**
   * Label for "Collapse All" button
   * @default 'Collapse All'
   */
  collapseAllLabel?: ReactNode;

  /**
   * Position of expand/collapse all controls
   * @default 'top-right'
   */
  controlsPosition?: AccordionControlsPosition;

  /**
   * Size variant for all accordions (can be overridden per accordion)
   * @default 'md'
   */
  size?: ComponentSize;

  /**
   * Gap between accordions in pixels
   * @default 8
   */
  gap?: number;

  /**
   * Whether accordions should be bordered
   * @default true
   */
  bordered?: boolean;

  /**
   * Whether to disable all accordions
   * @default false
   */
  disabled?: boolean;
}

/**
 * Extract accordion IDs from children
 */
function getAccordionIds(children: ReactNode): string[] {
  const ids: string[] = [];
  let index = 0;

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.props) {
      const accordionProps = child.props as AccordionProps;
      // Use provided id or generate one based on index
      ids.push(accordionProps.id || `accordion-${index}`);
      index++;
    }
  });

  return ids;
}

/**
 * AccordionContainer component
 * Manages multiple accordions with optional expand/collapse all functionality
 *
 * @example
 * ```tsx
 * // Basic usage
 * <AccordionContainer>
 *   <Accordion id="section1" header="Section 1">Content 1</Accordion>
 *   <Accordion id="section2" header="Section 2">Content 2</Accordion>
 * </AccordionContainer>
 *
 * // With expand/collapse all
 * <AccordionContainer showExpandAllControls>
 *   <Accordion id="section1" header="Section 1">Content 1</Accordion>
 *   <Accordion id="section2" header="Section 2">Content 2</Accordion>
 * </AccordionContainer>
 *
 * // Single mode (only one open at a time)
 * <AccordionContainer mode="single">
 *   <Accordion id="section1" header="Section 1">Content 1</Accordion>
 *   <Accordion id="section2" header="Section 2">Content 2</Accordion>
 * </AccordionContainer>
 * ```
 */
export const AccordionContainer: React.FC<AccordionContainerProps> = ({
  children,
  mode = 'multiple',
  expandedIds: controlledExpandedIds,
  defaultExpandedIds = [],
  onExpandedChange,
  showExpandAllControls = false,
  expandAllLabel = 'Expand All',
  collapseAllLabel = 'Collapse All',
  controlsPosition = 'top-right',
  size = 'md',
  gap = 8,
  bordered = true,
  disabled = false,
  className,
  style,
  'data-testid': testId,
  'aria-label': ariaLabel,
  ...restProps
}) => {
  // Internal state for uncontrolled usage
  const [uncontrolledExpandedIds, setUncontrolledExpandedIds] = useState<Set<string>>(
    new Set(defaultExpandedIds)
  );

  // Determine if controlled
  const isControlled = controlledExpandedIds !== undefined;

  // Get current expanded IDs
  const expandedIds = useMemo(
    () =>
      isControlled
        ? new Set(controlledExpandedIds)
        : uncontrolledExpandedIds,
    [isControlled, controlledExpandedIds, uncontrolledExpandedIds]
  );

  // Get all accordion IDs from children
  const allAccordionIds = useMemo(() => getAccordionIds(children), [children]);

  // Toggle an accordion
  const toggleAccordion = useCallback(
    (id: string) => {
      const newExpandedIds = new Set(expandedIds);

      if (newExpandedIds.has(id)) {
        newExpandedIds.delete(id);
      } else {
        if (mode === 'single') {
          // In single mode, close all others first
          newExpandedIds.clear();
        }
        newExpandedIds.add(id);
      }

      const newExpandedArray = Array.from(newExpandedIds);

      if (!isControlled) {
        setUncontrolledExpandedIds(newExpandedIds);
      }

      onExpandedChange?.(newExpandedArray);
    },
    [expandedIds, mode, isControlled, onExpandedChange]
  );

  // Expand all accordions
  const handleExpandAll = useCallback(() => {
    const newExpandedIds = new Set(allAccordionIds);
    const newExpandedArray = Array.from(newExpandedIds);

    if (!isControlled) {
      setUncontrolledExpandedIds(newExpandedIds);
    }

    onExpandedChange?.(newExpandedArray);
  }, [allAccordionIds, isControlled, onExpandedChange]);

  // Collapse all accordions
  const handleCollapseAll = useCallback(() => {
    const newExpandedIds = new Set<string>();
    const newExpandedArray: string[] = [];

    if (!isControlled) {
      setUncontrolledExpandedIds(newExpandedIds);
    }

    onExpandedChange?.(newExpandedArray);
  }, [isControlled, onExpandedChange]);

  // Create context value
  const contextValue: AccordionContextValue = useMemo(
    () => ({
      expandedIds,
      toggleAccordion,
      mode,
      disabled,
      size,
      bordered,
    }),
    [expandedIds, toggleAccordion, mode, disabled, size, bordered]
  );

  // Process children to add IDs if not provided
  const processedChildren = useMemo(() => {
    let index = 0;
    return Children.map(children, (child) => {
      if (isValidElement(child)) {
        const accordionProps = child.props as AccordionProps;
        const id = accordionProps.id || `accordion-${index}`;
        index++;
        return cloneElement(child as ReactElement<AccordionProps>, { id });
      }
      return child;
    });
  }, [children]);

  // Determine if all are expanded
  const allExpanded = allAccordionIds.length > 0 && allAccordionIds.every((id) => expandedIds.has(id));

  // Build class names
  const classes = [styles.accordionContainer, className].filter(Boolean).join(' ');

  // Build style with gap
  const containerStyle = {
    '--accordion-container-gap': `${gap}px`,
    ...style,
  } as React.CSSProperties;

  // Render controls
  const renderControls = () => {
    if (!showExpandAllControls || mode === 'single') {return null;}

    const label = allExpanded ? collapseAllLabel : expandAllLabel;
    const handler = allExpanded ? handleCollapseAll : handleExpandAll;

    return (
      <div
        className={styles.accordionContainerControls}
        data-position={controlsPosition}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={handler}
          disabled={disabled}
        >
          {label}
        </Button>
      </div>
    );
  };

  const isTopPosition = controlsPosition.startsWith('top');

  return (
    <AccordionContext.Provider value={contextValue}>
      <div
        className={classes}
        data-component="accordion-container"
        data-testid={testId}
        aria-label={ariaLabel}
        style={containerStyle}
        {...restProps}
      >
        {isTopPosition && renderControls()}
        <div className={styles.accordionContainerContent}>{processedChildren}</div>
        {!isTopPosition && renderControls()}
      </div>
    </AccordionContext.Provider>
  );
};

AccordionContainer.displayName = 'AccordionContainer';

export default AccordionContainer;
