/**
 * Dialog provider for programmatic dialog management
 */

import React, { useState, useCallback, useMemo, type ReactNode } from 'react';
import { Dialog, type DialogProps } from './Dialog';
import { DialogContext, type DialogStackItem, type DialogContextValue } from './DialogContext';

/**
 * Generate unique dialog ID
 */
let dialogIdCounter = 0;
const generateDialogId = () => `dialog-${Date.now()}-${++dialogIdCounter}`;

/**
 * Dialog provider props
 */
export interface DialogProviderProps {
  /**
   * Children to render
   */
  children: ReactNode;

  /**
   * Default props to apply to all dialogs
   */
  defaultDialogProps?: Partial<DialogProps>;
}

/**
 * Dialog provider component
 * Manages a stack of dialogs for programmatic creation
 *
 * @example
 * ```tsx
 * <DialogProvider>
 *   <App />
 * </DialogProvider>
 * ```
 */
export function DialogProvider({ children, defaultDialogProps }: DialogProviderProps) {
  const [dialogs, setDialogs] = useState<DialogStackItem[]>([]);

  // Open a new dialog
  const openDialog = useCallback(
    <T = void,>(props: Omit<DialogProps, 'isOpen'>): Promise<T> => {
      return new Promise<T>((resolve) => {
        const id = generateDialogId();
        const dialogItem: DialogStackItem = {
          id,
          props: {
            ...defaultDialogProps,
            ...props,
          },
          resolve: resolve as (value: unknown) => void,
        };

        setDialogs((prev) => [...prev, dialogItem]);
      });
    },
    [defaultDialogProps]
  );

  // Close a specific dialog by ID
  const closeDialog = useCallback((id: string, result?: unknown) => {
    setDialogs((prev) => {
      const dialog = prev.find((d) => d.id === id);
      if (dialog?.resolve) {
        dialog.resolve(result);
      }
      return prev.filter((d) => d.id !== id);
    });
  }, []);

  // Close the topmost dialog
  const closeTopDialog = useCallback((result?: unknown) => {
    setDialogs((prev) => {
      if (prev.length === 0) {
        return prev;
      }
      const topDialog = prev[prev.length - 1];
      if (topDialog.resolve) {
        topDialog.resolve(result);
      }
      return prev.slice(0, -1);
    });
  }, []);

  // Close all dialogs
  const closeAllDialogs = useCallback(() => {
    setDialogs((prev) => {
      prev.forEach((dialog) => {
        if (dialog.resolve) {
          dialog.resolve(undefined);
        }
      });
      return [];
    });
  }, []);

  // Update props of an open dialog
  const updateDialog = useCallback((id: string, props: Partial<DialogProps>) => {
    setDialogs((prev) =>
      prev.map((dialog) =>
        dialog.id === id ? { ...dialog, props: { ...dialog.props, ...props } } : dialog
      )
    );
  }, []);

  // Check if a dialog is open
  const isDialogOpen = useCallback((id: string) => dialogs.some((d) => d.id === id), [dialogs]);

  // Memoize context value
  const contextValue = useMemo<DialogContextValue>(
    () => ({
      dialogs,
      openDialog,
      closeDialog,
      closeTopDialog,
      closeAllDialogs,
      updateDialog,
      isDialogOpen,
      dialogCount: dialogs.length,
    }),
    [dialogs, openDialog, closeDialog, closeTopDialog, closeAllDialogs, updateDialog, isDialogOpen]
  );

  // Handle dialog close
  const handleDialogClose = useCallback(
    (dialog: DialogStackItem) => {
      dialog.props.onClose?.();
      closeDialog(dialog.id);
    },
    [closeDialog]
  );

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
      {dialogs.map((dialog, index) => (
        <Dialog
          key={dialog.id}
          {...dialog.props}
          isOpen
          onClose={() => handleDialogClose(dialog)}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              handleDialogClose(dialog);
            }
            dialog.props.onOpenChange?.(isOpen);
          }}
          zIndex={dialog.props.zIndex ?? 1400 + index * 10}
        />
      ))}
    </DialogContext.Provider>
  );
}

DialogProvider.displayName = 'DialogProvider';
