import type { PageMessagesDefaults } from '../../../contexts/PageMessagesContext';

/**
 * Built-in default configurations for all page message states (text resolved through labels)
 */
export const getDefaultConfigs = (t: (key: string) => string): Required<PageMessagesDefaults> => ({
  loading: {
    title: t('pageMessages.loading.title'),
    showText: true,
    spinnerProps: {
      spinnerStyle: 'circular',
      variant: 'primary',
    },
  },
  error: {
    title: t('pageMessages.error.title'),
    description: t('pageMessages.error.description'),
    icon: 'error',
  },
  forbidden: {
    title: t('pageMessages.forbidden.title'),
    description: t('pageMessages.forbidden.description'),
    icon: 'shield-off',
  },
  notFound: {
    title: t('pageMessages.notFound.title'),
    description: t('pageMessages.notFound.description'),
    icon: 'search',
  },
  unauthorized: {
    title: t('pageMessages.unauthorized.title'),
    description: t('pageMessages.unauthorized.description'),
    icon: 'lock',
  },
  maintenance: {
    title: t('pageMessages.maintenance.title'),
    description: t('pageMessages.maintenance.description'),
    icon: 'settings',
  },
  offline: {
    title: t('pageMessages.offline.title'),
    description: t('pageMessages.offline.description'),
    icon: 'wifi-off',
  },
  timeout: {
    title: t('pageMessages.timeout.title'),
    description: t('pageMessages.timeout.description'),
    icon: 'clock',
  },
  empty: {
    title: t('pageMessages.empty.title'),
    description: t('pageMessages.empty.description'),
    icon: 'inbox',
  },
});
