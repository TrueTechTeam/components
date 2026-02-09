/**
 * ResizablePanels component - Container for resizable split layout
 */

import React, { useState, useCallback, useMemo, useRef } from 'react';
import { ResizablePanelsContext, type ResizablePanelsContextValue } from './ResizablePanelsContext';
import type { BaseComponentProps } from '../../../types/component.types';
import styles from './ResizablePanels.module.scss';

export interface ResizablePanelsProps extends BaseComponentProps {
  /**
   * Direction of panels
   * @default 'horizontal'
   */
  direction?: 'horizontal' | 'vertical';

  /**
   * Callback when panel sizes change
   */
  onResize?: (sizes: number[]) => void;

  /**
   * Controlled panel sizes (percentages)
   */
  sizes?: number[];

  /**
   * Default panel sizes (percentages)
   */
  defaultSizes?: number[];
}

/**
 * ResizablePanels component for creating resizable split layouts
 *
 * @example
 * ```tsx
 * <ResizablePanels direction="horizontal" onResize={setSizes}>
 *   <ResizablePanel minSize={20} defaultSize={30}>
 *     <Sidebar />
 *   </ResizablePanel>
 *   <ResizeHandle />
 *   <ResizablePanel minSize={30}>
 *     <MainContent />
 *   </ResizablePanel>
 *   <ResizeHandle />
 *   <ResizablePanel minSize={20} collapsible>
 *     <DetailPanel />
 *   </ResizablePanel>
 * </ResizablePanels>
 * ```
 */
export const ResizablePanels: React.FC<ResizablePanelsProps> = ({
  direction = 'horizontal',
  onResize,
  sizes: controlledSizes,
  defaultSizes,
  children,
  className,
  'data-testid': dataTestId,
  'aria-label': ariaLabel,
  style,
}) => {
  // Count panels from children
  const panelCount = useMemo(() => {
    let count = 0;
    React.Children.forEach(children, (child) => {
      if (
        React.isValidElement(child) &&
        child.type &&
        (child.type as React.ComponentType).displayName === 'ResizablePanel'
      ) {
        count++;
      }
    });
    return count;
  }, [children]);

  // Initialize default sizes
  const initialSizes = useMemo(() => {
    if (defaultSizes && defaultSizes.length === panelCount) {
      return defaultSizes;
    }
    // Equal distribution
    return Array(panelCount).fill(100 / panelCount);
  }, [defaultSizes, panelCount]);

  const [internalSizes, setInternalSizes] = useState<number[]>(initialSizes);
  const [activeHandle, setActiveHandle] = useState(-1);
  const panelConfigsRef = useRef<Array<{ minSize: number; maxSize: number; collapsible: boolean }>>(
    []
  );
  const panelCountRef = useRef(0);

  const sizes = controlledSizes ?? internalSizes;

  // Set sizes
  const setSizes = useCallback(
    (newSizes: number[]) => {
      if (controlledSizes) {
        onResize?.(newSizes);
      } else {
        setInternalSizes(newSizes);
        onResize?.(newSizes);
      }
    },
    [controlledSizes, onResize]
  );

  // Start resize
  const startResize = useCallback((handleIndex: number) => {
    setActiveHandle(handleIndex);
  }, []);

  // Stop resize
  const stopResize = useCallback(() => {
    setActiveHandle(-1);
  }, []);

  // Register panel
  const registerPanel = useCallback(
    (config: { minSize: number; maxSize: number; collapsible: boolean }) => {
      const index = panelCountRef.current;
      panelConfigsRef.current[index] = config;
      panelCountRef.current++;
      return index;
    },
    []
  );

  // Get panel config
  const getPanelConfig = useCallback((index: number) => panelConfigsRef.current[index], []);

  // Reset panel counter on children change
  useMemo(() => {
    panelCountRef.current = 0;
    panelConfigsRef.current = [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelCount]);

  // Context value
  const contextValue: ResizablePanelsContextValue = useMemo(
    () => ({
      direction,
      sizes,
      setSizes,
      startResize,
      stopResize,
      activeHandle,
      registerPanel,
      getPanelConfig,
      panelCount,
    }),
    [
      direction,
      sizes,
      setSizes,
      startResize,
      stopResize,
      activeHandle,
      registerPanel,
      getPanelConfig,
      panelCount,
    ]
  );

  const containerClasses = [styles.resizablePanels, className].filter(Boolean).join(' ');

  return (
    <ResizablePanelsContext.Provider value={contextValue}>
      <div
        className={containerClasses}
        style={style}
        data-testid={dataTestId}
        data-direction={direction}
        data-resizing={activeHandle >= 0 || undefined}
        role="group"
        aria-label={ariaLabel || 'Resizable panels'}
      >
        {children}
      </div>
    </ResizablePanelsContext.Provider>
  );
};

export default ResizablePanels;
