import React, { useState, type ReactNode } from 'react';
import { Button } from '../../../lib/components/buttons/Button';
import { Badge } from '../../../lib/components/display/Badge';
import { Tab, TabList, Tabs } from '../../../lib/components/display/Tabs';
import { BreadcrumbItem, Breadcrumbs } from '../../../lib/components/navigation/Breadcrumbs';
import { Menu, MenuItem, MenuList } from '../../../lib/components/overlays/Menu';
import { useLabels } from '../../../lib/contexts/LabelsContext';
import { useBreakpoint } from '../../../lib/hooks/useBreakpoint';
import { useCan } from '../../AppProvider/hooks';
import { param } from '../../params/codecs';
import { usePageParams } from '../../params/usePageParams';
import { AppLink } from '../../router/AppLink';
import { useAppNavigate } from '../../router/useAppNavigate';
import type { StatusTone } from '../fields';
import styles from './PageHeader.module.scss';

export interface PageAction {
  id: string;
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  /** Hidden (not disabled) when `useCan(action, subject)` is false. */
  permission?: { action: string; subject?: string };
}

export interface Crumb {
  label: string;
  href?: string;
}

export interface PageHeaderTab {
  value: string;
  label: string;
  badge?: ReactNode;
}

export interface PageHeaderProps {
  /** A ReactNode so callers can pass `<Loadable shape="heading">`. */
  title: ReactNode;
  description?: ReactNode;
  status?: { label: string; tone: StatusTone };
  /** Rendered only with 3 or more levels; the last is the current page and not a link. */
  breadcrumbs?: Crumb[];
  /** At most one `primary`, rendered rightmost. */
  actions?: PageAction[];
  tabs?: PageHeaderTab[];
  /** URL search param holding the selected tab. @default 'tab' */
  tabParam?: string;
  onTabChange?: (value: string) => void;
  /** @default 1 */
  headingLevel?: 1 | 2;
}

/**
 * The selected tab, bound to the URL (`?tab=`). An absent or unknown value selects the first tab.
 * Returns `[value, setValue]`; `setValue` writes the URL param.
 */
export function usePageTab(
  tabs: PageHeaderTab[],
  tabParam = 'tab'
): [string, (value: string) => void] {
  const [params, setParams] = usePageParams({ [tabParam]: param.string('') });
  const raw = params[tabParam];
  const value = tabs.some((t) => t.value === raw) ? raw : (tabs[0]?.value ?? '');
  return [value, (next) => setParams({ [tabParam]: next })];
}

/** False when the action has a permission the user lacks. */
function useVisible(action: PageAction): boolean {
  // Hooks cannot be conditional, so an action without a permission checks a throwaway subject.
  const allowed = useCan(action.permission?.action ?? '', action.permission?.subject);
  return !action.permission || allowed;
}

function ActionButton({ action }: { action: PageAction }) {
  const visible = useVisible(action);
  if (!visible) {
    return null;
  }
  const variant =
    action.variant === 'primary' ? 'primary' : action.variant === 'danger' ? 'danger' : 'outline';
  if (action.href && !action.disabled) {
    return (
      <AppLink href={action.href} className={styles.linkAction} data-variant={variant}>
        {action.icon}
        {action.label}
      </AppLink>
    );
  }
  return (
    <Button variant={variant} disabled={action.disabled} onClick={action.onClick}>
      {action.icon}
      {action.label}
    </Button>
  );
}

function OverflowItem({ action, onDone }: { action: PageAction; onDone: () => void }) {
  const visible = useVisible(action);
  const navigate = useAppNavigate();
  if (!visible) {
    return null;
  }
  return (
    <MenuItem
      itemKey={action.id}
      disabled={action.disabled}
      startIcon={action.icon}
      onClick={() => {
        onDone();
        if (action.href) {
          navigate(action.href);
        } else {
          action.onClick?.();
        }
      }}
    >
      {action.label}
    </MenuItem>
  );
}

function OverflowMenu({ actions }: { actions: PageAction[] }) {
  const t = useLabels();
  const [open, setOpen] = useState(false);
  return (
    <Menu
      isOpen={open}
      onOpenChange={setOpen}
      trigger={
        <Button variant="outline" aria-haspopup="menu">
          {t('pageHeader.moreActions')}
        </Button>
      }
    >
      <MenuList>
        {actions.map((a) => (
          <OverflowItem key={a.id} action={a} onDone={() => setOpen(false)} />
        ))}
      </MenuList>
    </Menu>
  );
}

function Actions({ actions }: { actions: PageAction[] }) {
  const { down } = useBreakpoint();
  const primary = actions.find((a) => a.variant === 'primary');
  const others = actions.filter((a) => a !== primary);
  const compact = down('tablet');
  return (
    <div className={styles.actions}>
      {compact
        ? others.length > 0 && <OverflowMenu actions={others} />
        : others.map((a) => <ActionButton key={a.id} action={a} />)}
      {primary && <ActionButton action={primary} />}
    </div>
  );
}

function HeaderTabs({
  tabs,
  tabParam,
  onTabChange,
}: Required<Pick<PageHeaderProps, 'tabs'>> & Pick<PageHeaderProps, 'tabParam' | 'onTabChange'>) {
  const [value, setValue] = usePageTab(tabs, tabParam);
  return (
    <Tabs
      value={value}
      onChange={(next) => {
        setValue(next);
        onTabChange?.(next);
      }}
      className={styles.tabs}
    >
      <TabList>
        {tabs.map((tab) => (
          <Tab key={tab.value} value={tab.value}>
            {tab.label}
            {tab.badge != null && <span className={styles.tabBadge}>{tab.badge}</span>}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
}

/**
 * Page header: breadcrumbs (3+ levels), title with status, actions (non-primary ones collapse into
 * a "More actions" menu below the tablet breakpoint), description and URL-bound tabs.
 * Structure renders while data loads; pass `<Loadable shape="heading">` as the title.
 */
export function PageHeader({
  title,
  description,
  status,
  breadcrumbs,
  actions,
  tabs,
  tabParam,
  onTabChange,
  headingLevel = 1,
}: PageHeaderProps) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  return (
    <header className={styles.header} data-component="page-header">
      {breadcrumbs && breadcrumbs.length >= 3 && (
        <Breadcrumbs className={styles.breadcrumbs}>
          {breadcrumbs.map((crumb, i) =>
            i < breadcrumbs.length - 1 && crumb.href ? (
              <AppLink key={i} href={crumb.href}>
                {crumb.label}
              </AppLink>
            ) : (
              <BreadcrumbItem key={i} current={i === breadcrumbs.length - 1}>
                {crumb.label}
              </BreadcrumbItem>
            )
          )}
        </Breadcrumbs>
      )}
      <div className={styles.row}>
        <div className={styles.titleGroup}>
          <Heading className={styles.title}>{title}</Heading>
          {status && (
            <Badge variant={status.tone} size="sm">
              {status.label}
            </Badge>
          )}
        </div>
        {actions && actions.length > 0 && <Actions actions={actions} />}
      </div>
      {description && <p className={styles.description}>{description}</p>}
      {tabs && tabs.length > 0 && (
        <HeaderTabs tabs={tabs} tabParam={tabParam} onTabChange={onTabChange} />
      )}
    </header>
  );
}
