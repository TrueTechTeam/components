import type { PageMessagesDefaults } from '../../../contexts/PageMessagesContext';

/**
 * Built-in default configurations for all page message states
 */
export const DEFAULT_CONFIGS: Required<PageMessagesDefaults> = {
  loading: {
    title: 'Loading...',
    showText: true,
    spinnerProps: {
      spinnerStyle: 'circular',
      variant: 'primary',
    },
  },
  error: {
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Please try again.',
    icon: 'error',
  },
  forbidden: {
    title: 'Access Denied',
    description: "You don't have permission to access this page.",
    icon: 'shield-off',
  },
  notFound: {
    title: 'Page Not Found',
    description: "The page you're looking for doesn't exist or has been moved.",
    icon: 'search',
  },
  unauthorized: {
    title: 'Authentication Required',
    description: 'Please log in to access this page.',
    icon: 'lock',
  },
  maintenance: {
    title: 'Under Maintenance',
    description: "We're performing scheduled maintenance. Please check back soon.",
    icon: 'settings',
  },
  offline: {
    title: "You're Offline",
    description: 'Please check your internet connection and try again.',
    icon: 'wifi-off',
  },
  timeout: {
    title: 'Request Timed Out',
    description: 'The server took too long to respond. Please try again.',
    icon: 'clock',
  },
  empty: {
    title: 'No Data',
    description: "There's nothing here yet.",
    icon: 'inbox',
  },
};
