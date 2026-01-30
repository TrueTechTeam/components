/**
 * Portal component for rendering content outside the DOM hierarchy
 */

import { type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { usePortal } from '../../../hooks';

/**
 * Portal component props
 */
export interface PortalProps {
  /**
   * Content to render in portal
   */
  children: ReactNode;

  /**
   * ID of the portal container
   * @default 'portal-root'
   */
  containerId?: string;

  /**
   * Z-index for portal container
   */
  zIndex?: number;
}

/**
 * Portal component
 * Renders children into a portal container outside the DOM hierarchy
 */
export const Portal: React.FC<PortalProps> = ({ children, containerId, zIndex }) => {
  const portalContainer = usePortal({ containerId, zIndex });

  return createPortal(children, portalContainer);
};

Portal.displayName = 'Portal';
