/**
 * Hook for programmatic dialog management
 */

import { useCallback } from 'react';
import {
  useDialogContextStrict,
  type DialogContextValue,
} from '../../components/overlays/Dialog';
import type { DialogProps } from '../../components/overlays/Dialog';

/**
 * Hook options
 */
export interface UseDialogOptions {
  /**
   * Default props to apply to all dialogs
   */
  defaultProps?: Partial<DialogProps>;
}

/**
 * Hook return type
 */
export interface UseDialogReturn
  extends Pick<
    DialogContextValue,
    'closeDialog' | 'closeTopDialog' | 'closeAllDialogs' | 'isDialogOpen' | 'dialogCount'
  > {
  /**
   * Open a dialog with optional default props merged
   * @returns Promise that resolves when dialog closes
   */
  open: <T = void>(props: Omit<DialogProps, 'isOpen'>) => Promise<T>;

  /**
   * Update props of an open dialog
   */
  update: (id: string, props: Partial<DialogProps>) => void;
}

/**
 * Hook for programmatically creating and managing dialogs
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const dialog = useDialog();
 *
 *   const handleClick = async () => {
 *     const result = await dialog.open({
 *       title: 'Confirm Action',
 *       children: 'Are you sure you want to proceed?',
 *       actions: (
 *         <>
 *           <Button variant="ghost" onClick={() => dialog.closeTopDialog(false)}>
 *             Cancel
 *           </Button>
 *           <Button onClick={() => dialog.closeTopDialog(true)}>
 *             Confirm
 *           </Button>
 *         </>
 *       ),
 *     });
 *
 *     if (result) {
 *       // User confirmed
 *     }
 *   };
 *
 *   return <Button onClick={handleClick}>Open Dialog</Button>;
 * }
 * ```
 */
export function useDialog(options: UseDialogOptions = {}): UseDialogReturn {
  const context = useDialogContextStrict();
  const { defaultProps } = options;

  const open = useCallback(
    <T = void>(props: Omit<DialogProps, 'isOpen'>) => {
      return context.openDialog<T>({
        ...defaultProps,
        ...props,
      });
    },
    [context, defaultProps]
  );

  return {
    open,
    update: context.updateDialog,
    closeDialog: context.closeDialog,
    closeTopDialog: context.closeTopDialog,
    closeAllDialogs: context.closeAllDialogs,
    isDialogOpen: context.isDialogOpen,
    dialogCount: context.dialogCount,
  };
}
