import React, { useEffect, useState, type MouseEvent, type ReactNode } from 'react';
import {
  BottomNavigation,
  BottomNavigationItem,
} from '../../../lib/components/navigation/BottomNavigation';
import { CollapsibleSidebar } from '../../../lib/components/navigation/CollapsibleSidebar';
import {
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
} from '../../../lib/components/navigation/Navbar';
import { Tooltip } from '../../../lib/components/overlays/Tooltip';
import { useLabels } from '../../../lib/contexts/LabelsContext';
import { useBreakpoint } from '../../../lib/hooks/useBreakpoint';
import { useAuth } from '../../AppProvider/hooks';
import { usePreference } from '../../params/usePreference';
import { AppLink } from '../../router/AppLink';
import { isInAppLinkClick } from '../../router/linkClick';
import { useRouterAdapter } from '../../router/RouterContext';
import { useAppNavigate } from '../../router/useAppNavigate';
import styles from './AppShell.module.scss';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: ReactNode;
  badge?: ReactNode;
  children?: NavItem[];
  /** `'prefix'` by default for items with children, `'exact'` otherwise. */
  match?: 'exact' | 'prefix';
  /** Hidden (not disabled) when `useAuth().can(action, subject)` is false. */
  permission?: { action: string; subject?: string };
  /** `false` leaves the item out of the `'bottom'` mobile navigation. @default true */
  mobile?: boolean;
}

export interface AppShellProps {
  /** Logo or name shown in the Navbar. */
  brand: ReactNode;
  nav: NavItem[];
  /** Right side of the Navbar (search, user menu...). */
  headerActions?: ReactNode;
  /**
   * Navigation below the laptop breakpoint. `'drawer'` opens the nav from a Navbar toggle;
   * `'bottom'` shows a bottom bar with the items whose `mobile` is not `false` (at most 5).
   * @default 'drawer'
   */
  mobileNav?: 'bottom' | 'drawer';
  /** Page content (a Page). */
  children: ReactNode;
}

const MAIN_ID = 'main-content';
const MAX_BOTTOM_ITEMS = 5;
const LAPTOP_PX = 1024;

function isActive(item: NavItem, pathname: string): boolean {
  const mode = item.match ?? (item.children?.length ? 'prefix' : 'exact');
  if (mode === 'exact') {
    return pathname === item.href;
  }
  const base = item.href.replace(/\/+$/, '');
  return pathname === item.href || pathname === base || pathname.startsWith(`${base}/`);
}

/** Items the user may see, children filtered the same way. */
function useVisibleNav(items: NavItem[]): NavItem[] {
  const { can } = useAuth();
  const filter = (list: NavItem[]): NavItem[] =>
    list
      .filter((i) => !i.permission || can(i.permission.action, i.permission.subject))
      .map((i) => (i.children ? { ...i, children: filter(i.children) } : i));
  return filter(items);
}

function initial(label: string): ReactNode {
  return <span aria-hidden="true">{label.charAt(0).toUpperCase()}</span>;
}

interface NavListProps {
  items: NavItem[];
  pathname: string;
  collapsed?: boolean;
  level?: number;
}

function NavList({ items, pathname, collapsed = false, level = 0 }: NavListProps) {
  return (
    <ul className={styles.list} data-level={level}>
      {items.map((item) => {
        const active = isActive(item, pathname);
        const link = (
          <AppLink
            href={item.href}
            className={styles.link}
            aria-current={active ? 'page' : undefined}
            data-active={active || undefined}
            data-collapsed={collapsed || undefined}
            aria-label={collapsed ? item.label : undefined}
          >
            <span className={styles.icon}>{item.icon ?? initial(item.label)}</span>
            {!collapsed && <span className={styles.label}>{item.label}</span>}
            {!collapsed && item.badge != null && <span className={styles.badge}>{item.badge}</span>}
          </AppLink>
        );
        return (
          <li key={item.id} className={styles.item}>
            {collapsed ? (
              <Tooltip content={item.label} position="right">
                {link}
              </Tooltip>
            ) : (
              link
            )}
            {!collapsed && item.children && item.children.length > 0 && (
              <NavList items={item.children} pathname={pathname} level={level + 1} />
            )}
          </li>
        );
      })}
    </ul>
  );
}

function BottomNav({ items, pathname }: { items: NavItem[]; pathname: string }) {
  const navigate = useAppNavigate();
  const shown = items.filter((i) => i.mobile !== false).slice(0, MAX_BOTTOM_ITEMS);
  const activeId = shown.find((i) => isActive(i, pathname))?.id ?? '';

  const go = (item: NavItem) => (e: MouseEvent) => {
    if (isInAppLinkClick(e as MouseEvent<HTMLAnchorElement>, { href: item.href })) {
      e.preventDefault();
      navigate(item.href);
    }
  };

  return (
    <BottomNavigation value={activeId}>
      {shown.map((item) => (
        <BottomNavigationItem
          key={item.id}
          value={item.id}
          label={item.label}
          icon={item.icon ?? initial(item.label)}
          badge={item.badge}
          href={item.href}
          onClick={go(item)}
        />
      ))}
    </BottomNavigation>
  );
}

/**
 * The app frame: skip link, Navbar, a collapsible sidebar (laptop and up), the `main` landmark and
 * mobile navigation (a Navbar drawer or a bottom bar). The sidebar's collapsed state is remembered
 * in this browser. Nav links are guard-aware (`AppLink`); items the user may not see are hidden.
 */
export function AppShell({
  brand,
  nav,
  headerActions,
  mobileNav = 'drawer',
  children,
}: AppShellProps) {
  const t = useLabels();
  const { pathname } = useRouterAdapter();
  const { down } = useBreakpoint();
  const compact = down('laptop');
  const items = useVisibleNav(nav);
  const [collapsed, setCollapsed] = usePreference('sidebarCollapsed', false, { storage: 'local' });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const bottom = compact && mobileNav === 'bottom';
  const drawer = compact && mobileNav === 'drawer';

  // Close the drawer once a link has navigated.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const skip = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById(MAIN_ID)?.focus();
  };

  return (
    <div className={styles.shell}>
      <a href={`#${MAIN_ID}`} className={styles.skipLink} onClick={skip}>
        {t('appShell.skipToContent')}
      </a>
      <Navbar collapseBreakpoint={LAPTOP_PX} expanded={drawerOpen} onExpandedChange={setDrawerOpen}>
        <NavbarBrand>{brand}</NavbarBrand>
        {headerActions && <NavbarActions>{headerActions}</NavbarActions>}
        {drawer && <NavbarToggle />}
        {drawer && (
          <NavbarCollapse>
            <NavList items={items} pathname={pathname} />
          </NavbarCollapse>
        )}
      </Navbar>
      <div className={styles.body}>
        {!compact && (
          <CollapsibleSidebar
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            expandedWidth={256}
            collapsedWidth={64}
            className={styles.sidebar}
          >
            <NavList items={items} pathname={pathname} collapsed={collapsed} />
          </CollapsibleSidebar>
        )}
        <main
          id={MAIN_ID}
          tabIndex={-1}
          className={styles.main}
          data-bottom-nav={bottom || undefined}
        >
          {children}
        </main>
      </div>
      {bottom && <BottomNav items={items} pathname={pathname} />}
    </div>
  );
}
