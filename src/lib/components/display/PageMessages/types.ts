import type { ReactNode } from 'react';
import type { BaseComponentProps, ExtendedComponentSize } from '../../../types/component.types';
import type { IconName } from '../Icon/icons';
import type { SpinnerProps } from '../Spinner';
import type { ButtonProps } from '../../buttons/Button';

/**
 * Available page message state types
 */
export type PageMessageState =
  | 'loading'
  | 'error'
  | 'forbidden'
  | 'not-found'
  | 'empty'
  | 'maintenance'
  | 'offline'
  | 'unauthorized'
  | 'timeout';

/**
 * Action button configuration for page messages
 */
export interface PageMessageAction {
  /** Button label */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Button variant */
  variant?: ButtonProps['variant'];
  /** Loading state for the button */
  loading?: boolean;
  /** Icon to display */
  icon?: IconName | ReactNode;
}

/**
 * Configuration for a single page message state
 */
export interface PageMessageStateConfig {
  /** Title text displayed prominently */
  title?: string;
  /** Description or subtitle text */
  description?: string;
  /** Icon name from registry or custom ReactNode */
  icon?: IconName | ReactNode;
  /** Primary action button */
  primaryAction?: PageMessageAction;
  /** Secondary action button */
  secondaryAction?: PageMessageAction;
  /** Custom render function for complete control */
  render?: () => ReactNode;
}

/**
 * Props for loading state specifically
 */
export interface LoadingStateConfig extends Omit<PageMessageStateConfig, 'icon'> {
  /** Spinner props passthrough */
  spinnerProps?: Partial<SpinnerProps>;
  /** Whether to show text alongside spinner */
  showText?: boolean;
}

/**
 * Props for the PageMessages component
 */
export interface PageMessagesProps extends BaseComponentProps {
  /**
   * Whether the page is in loading state
   * Priority: 1 (highest)
   */
  loading?: boolean;

  /**
   * Whether the page has an error
   * Priority: 2
   */
  error?: boolean | Error | string;

  /**
   * Whether access is forbidden (403)
   * Priority: 3
   */
  forbidden?: boolean;

  /**
   * Whether the resource is not found (404)
   * Priority: 4
   */
  notFound?: boolean;

  /**
   * Whether the user is unauthorized (401)
   * Priority: 5
   */
  unauthorized?: boolean;

  /**
   * Whether the page is in maintenance mode
   * Priority: 6
   */
  maintenance?: boolean;

  /**
   * Whether the user is offline
   * Priority: 7
   */
  offline?: boolean;

  /**
   * Whether there was a timeout
   * Priority: 8
   */
  timeout?: boolean;

  /**
   * Whether the data is empty
   * Priority: 9 (lowest)
   */
  empty?: boolean;

  /**
   * Custom loading state configuration
   */
  loadingConfig?: LoadingStateConfig;

  /**
   * Custom error state configuration
   */
  errorConfig?: PageMessageStateConfig;

  /**
   * Custom forbidden state configuration
   */
  forbiddenConfig?: PageMessageStateConfig;

  /**
   * Custom not-found state configuration
   */
  notFoundConfig?: PageMessageStateConfig;

  /**
   * Custom unauthorized state configuration
   */
  unauthorizedConfig?: PageMessageStateConfig;

  /**
   * Custom maintenance state configuration
   */
  maintenanceConfig?: PageMessageStateConfig;

  /**
   * Custom offline state configuration
   */
  offlineConfig?: PageMessageStateConfig;

  /**
   * Custom timeout state configuration
   */
  timeoutConfig?: PageMessageStateConfig;

  /**
   * Custom empty state configuration
   */
  emptyConfig?: PageMessageStateConfig;

  /**
   * Size variant affecting icon and text sizes
   * @default 'md'
   */
  size?: ExtendedComponentSize;

  /**
   * Callback when retry action is triggered (for error/timeout states)
   */
  onRetry?: () => void;

  /**
   * Callback when go back action is triggered
   */
  onGoBack?: () => void;

  /**
   * Callback when go home action is triggered
   */
  onGoHome?: () => void;

  /**
   * Callback when login action is triggered (for unauthorized/forbidden)
   */
  onLogin?: () => void;

  /**
   * Whether to use fullscreen mode
   * @default false
   */
  fullScreen?: boolean;

  /**
   * Whether to center the message vertically
   * @default true
   */
  centerVertically?: boolean;

  /**
   * Minimum height when not fullscreen
   */
  minHeight?: string | number;
}

/**
 * Determines which state to display based on priority
 */
export function getActiveState(props: PageMessagesProps): PageMessageState | null {
  if (props.loading) {
    return 'loading';
  }
  if (props.error) {
    return 'error';
  }
  if (props.forbidden) {
    return 'forbidden';
  }
  if (props.notFound) {
    return 'not-found';
  }
  if (props.unauthorized) {
    return 'unauthorized';
  }
  if (props.maintenance) {
    return 'maintenance';
  }
  if (props.offline) {
    return 'offline';
  }
  if (props.timeout) {
    return 'timeout';
  }
  if (props.empty) {
    return 'empty';
  }
  return null;
}
