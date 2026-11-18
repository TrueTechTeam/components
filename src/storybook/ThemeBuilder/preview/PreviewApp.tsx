import React, { useEffect, useState } from 'react';
import { GlobalProvider } from '../../../lib/providers/GlobalProvider';
import { Alert } from '../../../lib/components/overlays/Alert';
import { Dialog } from '../../../lib/components/overlays/Dialog';
import { Button } from '../../../lib/components/buttons/Button';
import { KPI } from '../../../lib/components/display/KPI';
import { Table, type ColumnConfig } from '../../../lib/components/display/Table';
import { Tag } from '../../../lib/components/display/Tag';
import { Checkbox } from '../../../lib/components/inputs/Checkbox';
import { Input } from '../../../lib/components/inputs/Input';
import { Select } from '../../../lib/components/inputs/Select';
import { Toggle } from '../../../lib/components/inputs/Toggle';
import {
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarNav,
} from '../../../lib/components/navigation/Navbar';
import { NavLink } from '../../../lib/components/navigation/NavLink';
import type { ThemeConfig, ThemeMode } from '../../../lib/types/theme.types';
import { generateTheme } from '../generateTheme';
import { DEFAULT_INPUTS } from '../types';
import { MSG_CONFIG, MSG_READY, type PreviewMessage } from './messages';
import styles from './PreviewApp.module.scss';

interface Order extends Record<string, unknown> {
  id: string;
  customer: string;
  status: 'Paid' | 'Pending' | 'Failed';
}

const ORDERS: Order[] = [
  { id: 'A-1001', customer: 'Ada Lovelace', status: 'Paid' },
  { id: 'A-1002', customer: 'Alan Turing', status: 'Pending' },
  { id: 'A-1003', customer: 'Grace Hopper', status: 'Failed' },
];

const STATUS_VARIANT = { Paid: 'primary', Pending: 'secondary', Failed: 'tertiary' } as const;

const COLUMNS: Array<ColumnConfig<Order>> = [
  { key: 'id', header: 'Order' },
  { key: 'customer', header: 'Customer' },
  {
    key: 'status',
    header: 'Status',
    render: (value) => (
      <Tag variant={STATUS_VARIANT[value as Order['status']]}>{String(value)}</Tag>
    ),
  },
];

const PLAN_OPTIONS = [
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro' },
  { value: 'team', label: 'Team' },
];

/**
 * Themed mini app rendered inside the Theme Builder's preview iframe. Receives the in-progress
 * theme from its parent window via postMessage.
 */
export function PreviewApp() {
  const [state, setState] = useState<{ config: ThemeConfig; mode: ThemeMode }>(() => {
    const config = generateTheme(DEFAULT_INPUTS);
    return { config, mode: config.mode ?? DEFAULT_INPUTS.defaultMode };
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== window.parent || event.origin !== window.location.origin) {
        return;
      }
      const message = event.data as PreviewMessage | undefined;
      if (message?.type === MSG_CONFIG) {
        setState({ config: message.config, mode: message.mode });
      }
    };
    window.addEventListener('message', onMessage);
    // Harmless when opened standalone (parent === window): PreviewFrame is not listening.
    const ready: PreviewMessage = { type: MSG_READY };
    window.parent.postMessage(ready, window.location.origin);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <GlobalProvider themeConfig={{ ...state.config, mode: state.mode }}>
      <div className={styles.app}>
        <Navbar position="static">
          <NavbarBrand>Acme</NavbarBrand>
          <NavbarNav>
            <NavLink href="#overview" active>
              Overview
            </NavLink>
            <NavLink href="#orders">Orders</NavLink>
            <NavLink href="#settings">Settings</NavLink>
          </NavbarNav>
          <NavbarActions>
            <Button size="sm" variant="outline">
              Sign in
            </Button>
          </NavbarActions>
        </Navbar>

        <main className={styles.main}>
          <div className={styles.kpis}>
            <KPI title="Revenue" value="$48.2k" change="+12%" changeType="increase" />
            <KPI
              title="Orders"
              value={1284}
              change="+4%"
              changeType="increase"
              variant="secondary"
            />
            <KPI title="Refunds" value={23} change="-2%" changeType="decrease" variant="danger" />
          </div>

          <section className={styles.section}>
            <h2 className={styles.heading}>Buttons</h2>
            <div className={styles.buttons}>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Recent orders</h2>
            <Table<Order> data={ORDERS} columns={COLUMNS} rowKey="id" />
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading}>Account</h2>
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <Input label="Email" type="email" placeholder="you@example.com" />
              <Select label="Plan" options={PLAN_OPTIONS} defaultValue="pro" />
              <Checkbox label="Send me product updates" defaultChecked />
              <Toggle label="Enable notifications" defaultChecked />
            </form>
          </section>

          <div className={styles.buttons}>
            <Button variant="secondary" onClick={() => setAlertOpen(true)}>
              Show alert
            </Button>
            <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
          </div>
        </main>

        <Alert
          isOpen={alertOpen}
          onClose={() => setAlertOpen(false)}
          variant="info"
          title="Heads up"
          description="This is how an informational alert looks in your theme."
        />
        <Dialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title="Example dialog"
          actions={<Button onClick={() => setDialogOpen(false)}>Done</Button>}
        >
          Dialogs pick up your surface colors, radius and shadows.
        </Dialog>
      </div>
    </GlobalProvider>
  );
}
