import { useMemo } from 'react';
import type { BreadcrumbItemConfig } from './Breadcrumbs';

export interface UseBreadcrumbsFromPathOptions {
  /**
   * Current path (e.g., from useLocation or window.location.pathname)
   */
  path: string;

  /**
   * Custom label mapping for path segments
   * @example { 'users': 'All Users', 'settings': 'Account Settings' }
   */
  labels?: Record<string, string>;

  /**
   * Base path to start from (segments before this are ignored)
   * @default '/'
   */
  basePath?: string;

  /**
   * Label for the home/root breadcrumb
   * @default 'Home'
   */
  homeLabel?: string;

  /**
   * Include home as the first breadcrumb
   * @default true
   */
  includeHome?: boolean;

  /**
   * Transform function for labels (applied after labels lookup)
   * @default Capitalizes first letter and replaces hyphens/underscores with spaces
   */
  labelTransform?: (segment: string) => string;

  /**
   * Segments to exclude from breadcrumbs (e.g., route groups like '(auth)')
   */
  excludeSegments?: string[];
}

/**
 * Default label transform: capitalize and replace hyphens/underscores
 */
const defaultLabelTransform = (segment: string): string => {
  return segment.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Hook to auto-generate breadcrumbs from a URL path
 *
 * @example
 * ```tsx
 * // Basic usage
 * const breadcrumbs = useBreadcrumbsFromPath({
 *   path: '/products/electronics/phones',
 * });
 * // Result: [
 * //   { label: 'Home', href: '/' },
 * //   { label: 'Products', href: '/products' },
 * //   { label: 'Electronics', href: '/products/electronics' },
 * //   { label: 'Phones', href: '/products/electronics/phones', current: true },
 * // ]
 *
 * // With custom labels
 * const breadcrumbs = useBreadcrumbsFromPath({
 *   path: '/users/123/settings',
 *   labels: {
 *     'users': 'All Users',
 *     'settings': 'Account Settings',
 *   },
 * });
 *
 * // With Next.js App Router (excluding route groups)
 * const breadcrumbs = useBreadcrumbsFromPath({
 *   path: '/(dashboard)/projects/123',
 *   excludeSegments: ['(dashboard)', '(auth)'],
 * });
 *
 * // Usage in component
 * <Breadcrumbs items={breadcrumbs} />
 * ```
 */
export function useBreadcrumbsFromPath(
  options: UseBreadcrumbsFromPathOptions
): BreadcrumbItemConfig[] {
  const {
    path,
    labels = {},
    basePath = '/',
    homeLabel = 'Home',
    includeHome = true,
    labelTransform = defaultLabelTransform,
    excludeSegments = [],
  } = options;

  return useMemo(() => {
    // Normalize path
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const normalizedBasePath = basePath.startsWith('/') ? basePath : `/${basePath}`;

    // Get path relative to base
    let relativePath = normalizedPath;
    if (normalizedBasePath !== '/' && normalizedPath.startsWith(normalizedBasePath)) {
      relativePath = normalizedPath.slice(normalizedBasePath.length) || '/';
    }

    // Split into segments and filter
    const segments = relativePath
      .split('/')
      .filter((segment) => segment && !excludeSegments.includes(segment));

    const breadcrumbs: BreadcrumbItemConfig[] = [];

    // Add home
    if (includeHome) {
      breadcrumbs.push({
        label: homeLabel,
        href: normalizedBasePath,
      });
    }

    // Build breadcrumbs from segments
    let currentPath = normalizedBasePath === '/' ? '' : normalizedBasePath;

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Look up custom label or transform the segment
      const label = labels[segment] ?? labelTransform(segment);

      breadcrumbs.push({
        label,
        href: currentPath,
        current: index === segments.length - 1,
      });
    });

    // Mark last item as current
    if (breadcrumbs.length > 0) {
      breadcrumbs[breadcrumbs.length - 1].current = true;
    }

    return breadcrumbs;
  }, [path, labels, basePath, homeLabel, includeHome, labelTransform, excludeSegments]);
}

export default useBreadcrumbsFromPath;
