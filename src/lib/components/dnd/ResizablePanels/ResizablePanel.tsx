/**
 * ResizablePanel component - Individual panel within ResizablePanels
 */

import React, { forwardRef, useEffect, useRef, useState } from 'react';
import type { BaseComponentProps } from '../../../types/component.types';
import { useResizablePanelsContext } from './ResizablePanelsContext';
import styles from './ResizablePanels.module.scss';

export interface ResizablePanelProps extends BaseComponentProps {
  /**
   * Unique panel ID
   */
  id?: string;

  /**
   * Minimum size as percentage
   * @default 10
   */
  minSize?: number;

  /**
   * Maximum size as percentage
   * @default 90
   */
  maxSize?: number;

  /**
   * Default size as percentage
   */
  defaultSize?: number;

  /**
   * Whether panel is collapsible
   * @default false
   */
  collapsible?: boolean;

  /**
   * Collapsed state (controlled)
   */
  collapsed?: boolean;

  /**
   * Callback when collapse state changes
   */
  onCollapse?: (collapsed: boolean) => void;
}

/**
 * ResizablePanel component for use within ResizablePanels
 *
 * @example
 * ```tsx
 * <ResizablePanels>
 *   <ResizablePanel minSize={20} defaultSize={30}>
 *     <Sidebar />
 *   </ResizablePanel>
 *   <ResizeHandle />
 *   <ResizablePanel>
 *     <MainContent />
 *   </ResizablePanel>
 * </ResizablePanels>
 * ```
 */
export const ResizablePanel = forwardRef<HTMLDivElement, ResizablePanelProps>(
  (
    {
      id,
      minSize = 10,
      maxSize = 90,
      defaultSize,
      collapsible = false,
      collapsed = false,
      onCollapse: _onCollapse,
      children,
      className,
      'data-testid': dataTestId,
      'aria-label': ariaLabel,
      style,
    },
    ref
  ) => {
    const context = useResizablePanelsContext();
    const [panelIndex, setPanelIndex] = useState<number>(-1);
    const registeredRef = useRef(false);

    // Register panel on mount (only once)
    useEffect(() => {
      if (!registeredRef.current) {
        const index = context.registerPanel({ minSize, maxSize, collapsible });
        setPanelIndex(index);
        registeredRef.current = true;
      }
    }, [context, minSize, maxSize, collapsible]);
    const size = context.sizes[panelIndex] ?? defaultSize ?? (100 / context.panelCount);

    const containerClasses = [styles.resizablePanel, className].filter(Boolean).join(' ');

    const panelStyle: React.CSSProperties = {
      ...style,
      flexBasis: collapsed ? '0%' : `${size}%`,
      flexGrow: 0,
      flexShrink: 0,
      minWidth: context.direction === 'horizontal' ? (collapsed ? 0 : `${minSize}%`) : undefined,
      maxWidth: context.direction === 'horizontal' ? `${maxSize}%` : undefined,
      minHeight: context.direction === 'vertical' ? (collapsed ? 0 : `${minSize}%`) : undefined,
      maxHeight: context.direction === 'vertical' ? `${maxSize}%` : undefined,
    };

    return (
      <div
        ref={ref}
        className={containerClasses}
        style={panelStyle}
        data-testid={dataTestId}
        data-panel-id={id}
        data-panel-index={panelIndex}
        data-collapsed={collapsed || undefined}
        aria-label={ariaLabel}
      >
        {!collapsed && children}
      </div>
    );
  }
);

ResizablePanel.displayName = 'ResizablePanel';

export default ResizablePanel;
