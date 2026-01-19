import React, { isValidElement, type ReactNode } from 'react';
import { Spinner } from '../Spinner';
import { Icon } from '../Icon';
import { Button } from '../../buttons/Button';
import type { IconName } from '../Icon/icons';
import type { ExtendedComponentSize } from '../../../types/component.types';
import type {
  PageMessageState,
  PageMessageStateConfig,
  LoadingStateConfig,
  PageMessageAction,
} from './types';
import type { PageMessagesGlobalActions } from '../../../contexts/PageMessagesContext';
import styles from './PageMessages.module.scss';

/**
 * Size mapping for icons based on component size
 */
const ICON_SIZE_MAP: Record<ExtendedComponentSize, number> = {
  xs: 32,
  sm: 48,
  md: 64,
  lg: 80,
  xl: 96,
};

/**
 * Size mapping for spinner based on component size
 */
const SPINNER_SIZE_MAP: Record<ExtendedComponentSize, ExtendedComponentSize> = {
  xs: 'sm',
  sm: 'md',
  md: 'lg',
  lg: 'xl',
  xl: 'xl',
};

export interface PageMessageContentProps {
  /** The active page message state */
  state: PageMessageState;
  /** Configuration for the state */
  config: PageMessageStateConfig | LoadingStateConfig;
  /** Size variant */
  size: ExtendedComponentSize;
  /** Error message (extracted from error prop) */
  errorMessage?: string;
  /** Global actions from context */
  actions: PageMessagesGlobalActions;
}

/**
 * Internal component that renders the page message content
 */
export function PageMessageContent({
  state,
  config,
  size,
  errorMessage,
  actions,
}: PageMessageContentProps) {
  // If custom render function is provided, use it
  if (config.render) {
    return <>{config.render()}</>;
  }

  const isLoading = state === 'loading';
  const loadingConfig = config as LoadingStateConfig;

  // Determine description - use error message if available for error state
  const description = state === 'error' && errorMessage ? errorMessage : config.description;

  // Render icon or spinner
  const renderVisual = () => {
    if (isLoading) {
      return (
        <Spinner
          size={SPINNER_SIZE_MAP[size]}
          {...loadingConfig.spinnerProps}
          data-testid="page-messages-spinner"
        />
      );
    }

    const icon = (config as PageMessageStateConfig).icon;
    if (!icon) {
      return null;
    }

    // Check if icon is a ReactNode or IconName
    if (isValidElement(icon) || typeof icon !== 'string') {
      return (
        <div
          className={styles.pageMessagesIcon}
          data-state={state}
          data-size={size}
        >
          {icon as ReactNode}
        </div>
      );
    }

    return (
      <Icon
        name={icon as IconName}
        size={ICON_SIZE_MAP[size]}
        className={styles.pageMessagesIcon}
        data-state={state}
        data-size={size}
        data-testid="page-messages-icon"
      />
    );
  };

  // Render action button
  const renderAction = (action: PageMessageAction, isPrimary: boolean) => {
    const iconElement =
      action.icon && typeof action.icon === 'string' ? (
        action.icon
      ) : isValidElement(action.icon) ? (
        action.icon
      ) : undefined;

    return (
      <Button
        key={action.label}
        variant={action.variant ?? (isPrimary ? 'primary' : 'outline')}
        onClick={action.onClick}
        loading={action.loading}
        startIcon={typeof iconElement === 'string' ? iconElement : undefined}
        data-testid={`page-messages-action-${isPrimary ? 'primary' : 'secondary'}`}
      >
        {action.label}
      </Button>
    );
  };

  // Get default actions based on state
  const getDefaultActions = (): PageMessageAction[] => {
    const defaultActions: PageMessageAction[] = [];

    switch (state) {
      case 'error':
      case 'timeout':
        if (actions.onRetry) {
          defaultActions.push({
            label: 'Try Again',
            onClick: actions.onRetry,
            variant: 'primary',
            icon: 'refresh',
          });
        }
        break;
      case 'unauthorized':
        if (actions.onLogin) {
          defaultActions.push({
            label: 'Log In',
            onClick: actions.onLogin,
            variant: 'primary',
            icon: 'lock',
          });
        }
        break;
      case 'forbidden':
        if (actions.onGoBack) {
          defaultActions.push({
            label: 'Go Back',
            onClick: actions.onGoBack,
            variant: 'primary',
            icon: 'arrow-left',
          });
        }
        break;
      case 'not-found':
        if (actions.onGoHome) {
          defaultActions.push({
            label: 'Go Home',
            onClick: actions.onGoHome,
            variant: 'primary',
            icon: 'home',
          });
        }
        break;
      case 'offline':
        if (actions.onRetry) {
          defaultActions.push({
            label: 'Retry',
            onClick: actions.onRetry,
            variant: 'primary',
            icon: 'refresh',
          });
        }
        break;
    }

    return defaultActions;
  };

  // Collect all actions
  const allActions: PageMessageAction[] = [];
  if (config.primaryAction) {
    allActions.push(config.primaryAction);
  }
  if (config.secondaryAction) {
    allActions.push(config.secondaryAction);
  }
  // Add default actions if no custom actions provided
  if (allActions.length === 0) {
    allActions.push(...getDefaultActions());
  }

  const showText = isLoading ? loadingConfig.showText !== false : true;

  return (
    <div className={styles.pageMessagesContent} data-testid="page-messages-content">
      {renderVisual()}

      {showText && config.title && (
        <h2
          className={styles.pageMessagesTitle}
          data-size={size}
          data-testid="page-messages-title"
        >
          {config.title}
        </h2>
      )}

      {showText && description && (
        <p
          className={styles.pageMessagesDescription}
          data-size={size}
          data-testid="page-messages-description"
        >
          {description}
        </p>
      )}

      {allActions.length > 0 && (
        <div className={styles.pageMessagesActions} data-testid="page-messages-actions">
          {allActions.map((action, index) => renderAction(action, index === 0))}
        </div>
      )}
    </div>
  );
}
