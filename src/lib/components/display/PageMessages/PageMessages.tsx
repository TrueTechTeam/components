import React from 'react';
import { usePageMessagesConfig } from '../../../contexts/PageMessagesContext';
import { PageMessageContent } from './PageMessageContent';
import { DEFAULT_CONFIGS } from './defaultConfigs';
import {
  getActiveState,
  type PageMessagesProps,
  type PageMessageState,
  type PageMessageStateConfig,
  type LoadingStateConfig,
} from './types';
import styles from './PageMessages.module.scss';

/**
 * Deep merge two config objects, with source taking precedence
 */
function mergeConfig<T extends PageMessageStateConfig | LoadingStateConfig>(
  base: T,
  contextConfig?: Partial<T>,
  propConfig?: Partial<T>
): T {
  return {
    ...base,
    ...contextConfig,
    ...propConfig,
  };
}

/**
 * PageMessages - Handles page-level states like loading, error, forbidden, etc.
 *
 * States are displayed based on priority (loading > error > forbidden > etc.)
 * When no state is active, children are rendered directly without any wrapper.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <PageMessages loading={isLoading} error={error}>
 *   <MyContent />
 * </PageMessages>
 * ```
 *
 * @example
 * ```tsx
 * // With custom configuration
 * <PageMessages
 *   empty={items.length === 0}
 *   emptyConfig={{
 *     title: 'No items yet',
 *     description: 'Create your first item to get started',
 *     primaryAction: {
 *       label: 'Create Item',
 *       onClick: handleCreate,
 *     },
 *   }}
 * >
 *   <ItemList items={items} />
 * </PageMessages>
 * ```
 *
 * @example
 * ```tsx
 * // With custom renderer
 * <PageMessages
 *   error={error}
 *   errorConfig={{
 *     render: () => <CustomErrorPage error={error} />,
 *   }}
 * >
 *   <Dashboard />
 * </PageMessages>
 * ```
 */
export const PageMessages = ({
  ref,
  ...props
}: PageMessagesProps & {
  ref?: React.Ref<HTMLDivElement>;
}) => {
  const {
    children,
    loading,
    error,
    forbidden,
    notFound,
    unauthorized,
    maintenance,
    offline,
    timeout,
    empty,
    loadingConfig,
    errorConfig,
    forbiddenConfig,
    notFoundConfig,
    unauthorizedConfig,
    maintenanceConfig,
    offlineConfig,
    timeoutConfig,
    emptyConfig,
    size = 'md',
    fullScreen = false,
    centerVertically = true,
    minHeight,
    className,
    style,
    'data-testid': testId,
    'aria-label': ariaLabel,
    ...restProps
  } = props;

  // Get context configuration
  const contextConfig = usePageMessagesConfig(props);

  // Apply default props from context
  const resolvedSize = size ?? contextConfig.defaultProps?.size ?? 'md';
  const resolvedFullScreen = fullScreen ?? contextConfig.defaultProps?.fullScreen ?? false;
  const resolvedCenterVertically =
    centerVertically ?? contextConfig.defaultProps?.centerVertically ?? true;
  const resolvedMinHeight = minHeight ?? contextConfig.defaultProps?.minHeight;

  // Determine active state based on priority
  const activeState = getActiveState(props);

  // If no active state, render children directly (NO WRAPPER)
  if (!activeState) {
    // eslint-disable-next-line react/jsx-no-useless-fragment -- Fragment needed to return ReactNode children
    return <>{children}</>;
  }

  // Build the state config map with merged configurations
  const stateConfigMap: Record<PageMessageState, PageMessageStateConfig | LoadingStateConfig> = {
    loading: mergeConfig(DEFAULT_CONFIGS.loading, contextConfig.defaults.loading, loadingConfig),
    error: mergeConfig(DEFAULT_CONFIGS.error, contextConfig.defaults.error, errorConfig),
    forbidden: mergeConfig(
      DEFAULT_CONFIGS.forbidden,
      contextConfig.defaults.forbidden,
      forbiddenConfig
    ),
    'not-found': mergeConfig(
      DEFAULT_CONFIGS.notFound,
      contextConfig.defaults.notFound,
      notFoundConfig
    ),
    unauthorized: mergeConfig(
      DEFAULT_CONFIGS.unauthorized,
      contextConfig.defaults.unauthorized,
      unauthorizedConfig
    ),
    maintenance: mergeConfig(
      DEFAULT_CONFIGS.maintenance,
      contextConfig.defaults.maintenance,
      maintenanceConfig
    ),
    offline: mergeConfig(DEFAULT_CONFIGS.offline, contextConfig.defaults.offline, offlineConfig),
    timeout: mergeConfig(DEFAULT_CONFIGS.timeout, contextConfig.defaults.timeout, timeoutConfig),
    empty: mergeConfig(DEFAULT_CONFIGS.empty, contextConfig.defaults.empty, emptyConfig),
  };

  const activeConfig = stateConfigMap[activeState];

  // Handle error message extraction
  const errorMessage =
    typeof error === 'string' ? error : error instanceof Error ? error.message : undefined;

  const componentClasses = [styles.pageMessages, className].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      className={componentClasses}
      data-component="page-messages"
      data-state={activeState}
      data-size={resolvedSize}
      data-fullscreen={resolvedFullScreen || undefined}
      data-center={resolvedCenterVertically || undefined}
      data-testid={testId || 'page-messages'}
      role="status"
      aria-busy={activeState === 'loading'}
      aria-label={ariaLabel}
      style={{
        ...style,
        ...(resolvedMinHeight && !resolvedFullScreen
          ? {
              minHeight:
                typeof resolvedMinHeight === 'number'
                  ? `${resolvedMinHeight}px`
                  : resolvedMinHeight,
            }
          : {}),
      }}
      {...restProps}
    >
      <PageMessageContent
        state={activeState}
        config={activeConfig}
        size={resolvedSize}
        errorMessage={errorMessage}
        actions={contextConfig.actions}
      />
    </div>
  );
};

export default PageMessages;
