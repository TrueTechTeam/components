import { useCallback, useEffect, useRef } from 'react';
import { useNavigationGuard } from '../../contexts/NavigationGuardContext';
import { useLabels } from '../../contexts/LabelsContext';

export interface UseUnsavedChangesOptions {
  /** Confirmation message (defaults to the `unsavedChanges.confirm` label) */
  message?: string;
  /** Turn the guard off without unmounting @default true */
  enabled?: boolean;
}

/**
 * Guard against losing unsaved changes: registers with the navigation guard registry (and the
 * enclosing Dialog, if any) and warns on page unload while `isDirty`.
 */
export function useUnsavedChanges(
  isDirty: boolean,
  opts: UseUnsavedChangesOptions = {}
): { confirmLeave(): boolean } {
  const { enabled = true } = opts;
  const t = useLabels();
  const message = opts.message ?? t('unsavedChanges.confirm');
  const registry = useNavigationGuard();
  const active = isDirty && enabled;

  const stateRef = useRef({ active, message });
  stateRef.current = { active, message };

  useEffect(
    () =>
      registry.register({
        isBlocking: () => stateRef.current.active,
        get message() {
          return stateRef.current.message;
        },
      }),
    [registry]
  );

  useEffect(() => {
    if (!active) {
      return;
    }
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [active]);

  const confirmLeave = useCallback(
    // eslint-disable-next-line no-alert
    () => (stateRef.current.active ? window.confirm(stateRef.current.message) : true),
    []
  );

  return { confirmLeave };
}
