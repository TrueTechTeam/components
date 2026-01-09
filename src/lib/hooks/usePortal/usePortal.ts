/**
 * Hook for creating and managing portal containers
 */

import { useEffect, useState } from 'react';

/**
 * Options for portal configuration
 */
export interface UsePortalOptions {
  /**
   * ID of the portal container element
   * @default 'portal-root'
   */
  containerId?: string;

  /**
   * Z-index for the portal container
   */
  zIndex?: number;
}

/**
 * Get or create portal container element
 */
function getOrCreatePortalContainer(containerId: string): HTMLElement {
  if (typeof document === 'undefined') {
    throw new Error('Portal can only be used in browser environment');
  }

  // Check if portal container already exists
  let portalContainer = document.getElementById(containerId);

  // Create container if it doesn't exist
  if (!portalContainer) {
    portalContainer = document.createElement('div');
    portalContainer.id = containerId;
    portalContainer.style.position = 'relative';
    document.body.appendChild(portalContainer);
  }

  return portalContainer;
}

/**
 * Create or get a portal container element
 * @param options - Portal configuration options
 * @returns Portal container element
 */
export function usePortal(options: UsePortalOptions = {}): HTMLElement {
  const { containerId = 'portal-root', zIndex } = options;

  const [portalElement] = useState(() => getOrCreatePortalContainer(containerId));

  // Effect to handle zIndex updates
  useEffect(() => {
    // Get the element directly from the DOM to avoid mutating state
    const element = document.getElementById(containerId);
    if (zIndex !== undefined && element) {
      element.style.zIndex = zIndex.toString();
    }

    // Cleanup: Portal container persists and is reused by other instances
    return () => {
      // Note: We don't remove the portal container on unmount because
      // multiple components may be using it. The container will persist
      // and be reused by other portal instances.
    };
  }, [containerId, zIndex]);

  return portalElement;
}
