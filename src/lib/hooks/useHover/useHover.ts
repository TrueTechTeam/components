/**
 * Hook for detecting hover state with configurable delays
 */

import { useState, useCallback, useRef } from 'react';

/**
 * Options for hover detection
 */
export interface UseHoverOptions {
  /**
   * Callback when hover starts
   */
  onHoverStart?: () => void;

  /**
   * Callback when hover ends
   */
  onHoverEnd?: () => void;

  /**
   * Delay before triggering hover start (ms)
   * @default 0
   */
  delayEnter?: number;

  /**
   * Delay before triggering hover end (ms)
   * @default 0
   */
  delayLeave?: number;

  /**
   * Disable hover detection
   * @default false
   */
  disabled?: boolean;
}

/**
 * Props to spread on the element
 */
export interface HoverProps {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
}

/**
 * Return value from useHover
 */
export interface UseHoverReturn {
  /**
   * Whether element is currently hovered
   */
  isHovered: boolean;

  /**
   * Props to spread on the element
   */
  hoverProps: HoverProps;
}

/**
 * Detect hover state with configurable delays
 * @param options - Hover configuration options
 * @returns Hover state and props
 */
export function useHover(options: UseHoverOptions = {}): UseHoverReturn {
  const { onHoverStart, onHoverEnd, delayEnter = 0, delayLeave = 0, disabled = false } = options;

  const [isHovered, setIsHovered] = useState(false);
  const enterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimeouts = useCallback(() => {
    if (enterTimeoutRef.current) {
      clearTimeout(enterTimeoutRef.current);
      enterTimeoutRef.current = null;
    }
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
  }, []);

  const handleEnter = useCallback(() => {
    if (disabled) {
      return;
    }

    clearTimeouts();

    if (delayEnter > 0) {
      enterTimeoutRef.current = setTimeout(() => {
        setIsHovered(true);
        onHoverStart?.();
      }, delayEnter);
    } else {
      setIsHovered(true);
      onHoverStart?.();
    }
  }, [disabled, delayEnter, onHoverStart, clearTimeouts]);

  const handleLeave = useCallback(() => {
    if (disabled) {
      return;
    }

    clearTimeouts();

    if (delayLeave > 0) {
      leaveTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
        onHoverEnd?.();
      }, delayLeave);
    } else {
      setIsHovered(false);
      onHoverEnd?.();
    }
  }, [disabled, delayLeave, onHoverEnd, clearTimeouts]);

  const hoverProps: HoverProps = {
    onMouseEnter: handleEnter,
    onMouseLeave: handleLeave,
    onFocus: handleEnter,
    onBlur: handleLeave,
  };

  return {
    isHovered,
    hoverProps,
  };
}

