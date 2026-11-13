import React, { useEffect, useState, type MouseEvent, type ReactNode } from 'react';
import {
  BottomNavigation,
  BottomNavigationItem,
} from '../../../lib/components/navigation/BottomNavigation';
import { SideNav, SideNavItem } from '../../../lib/components/navigation/SideNav';
import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
} from '../../../lib/components/navigation/Navbar';
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
  if (base === '') {
    return pathname === '/';
  }
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

/** Id of the deepest item that matches the path: the current page. Ancestors are only "active". */
function findCurrent(
  items: NavItem[],
  pathname: string
): { id: string; length: number } | undefined {
  let best: { id: string; length: number } | undefined;
  for (const item of items) {
    const found =
      (item.children && findCurrent(item.children, pathname)) ||
      (isActive(item, pathname) ? { id: item.id, length: item.href.length } : undefined);
    // The most specific (longest) match among siblings wins; the first wins a tie.
    if (found && (!best || found.length > best.length)) {
      best = found;
    }
  }
  return best;
}

function findCurrentId(items: NavItem[], pathname: string): string | undefined {
  return findCurrent(items, pathname)?.id;
}

function containsId(item: NavItem, id: string): boolean {
  return !!item.children?.some((c) => c.id === id || containsId(c, id));
}

interface NavTreeProps {
  items: NavItem[];
  pathname: string;
  currentId?: string;
  collapsed?: boolean;
  level?: number;
}

/** SideNav items for a nav tree; children are indented siblings, hidden in the icon rail. */
function NavTree({ items, pathname, currentId, collapsed = false, level = 0 }: NavTreeProps) {
  return (
    <>
      {items.map((item) => {
        const active = isActive(item, pathname);
        return (
          <React.Fragment key={item.id}>
            <SideNavItem
              value={item.id}
              label={item.label}
              href={item.href}
              icon={item.icon ?? initial(item.label)}
              badge={item.badge}
              level={level}
              className={active ? styles.active : undefined}
              data-active={active || undefined}
              // The current page is a hidden child: mark the visible parent in the icon rail.
              {...(collapsed && currentId && containsId(item, currentId)
                ? { 'aria-current': 'true' as const }
                : {})}
            />
            {!collapsed && item.children && item.children.length > 0 && (
              <NavTree
                items={item.children}
                pathname={pathname}
                currentId={currentId}
                level={level + 1}
              />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}

function BottomNav({ items, pathname }: { items: NavItem[]; pathname: string }) {
  const navigate = useAppNavigate();
  const shown = items.filter((i) => i.mobile !== false).slice(0, MAX_BOTTOM_ITEMS);
  // Only top-level items render, so a child route selects its top-level ancestor.
  const currentId = findCurrentId(shown, pathname);
  const activeId =
    shown.find((i) => i.id === currentId || (currentId && containsId(i, currentId)))?.id ?? '';

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
  const currentId = findCurrentId(items, pathname) ?? '';

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
        {/* Not NavbarActions: the Navbar hides those on compact screens, and these must stay reachable. */}
        <div className={styles.trailing}>
          {headerActions}
          {drawer && <NavbarToggle />}
        </div>
        {drawer && (
          <NavbarCollapse>
            <SideNav
              linkComponent={AppLink}
              selectedValue={currentId}
              aria-label={t('appShell.menu')}
              style={{ '--sidenav-width': '100%' } as React.CSSProperties}
            >
              <NavTree items={items} pathname={pathname} currentId={currentId} />
            </SideNav>
          </NavbarCollapse>
        )}
      </Navbar>
      <div className={styles.body}>
        {!compact && (
          <SideNav
            linkComponent={AppLink}
            selectedValue={currentId}
            collapsed={collapsed}
            expandedWidth={256}
            collapsedWidth={64}
            className={styles.sidebar}
            footer={
              <button
                type="button"
                className={styles.collapseToggle}
                onClick={() => setCollapsed(!collapsed)}
                aria-label={
                  collapsed ? t('collapsibleSidebar.expand') : t('collapsibleSidebar.collapse')
                }
                aria-expanded={!collapsed}
              >
                <span aria-hidden="true">{collapsed ? '›' : '‹'}</span>
              </button>
            }
          >
            <NavTree
              items={items}
              pathname={pathname}
              currentId={currentId}
              collapsed={collapsed}
            />
          </SideNav>
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
