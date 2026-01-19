/**
 * Dialog context for programmatic dialog management
 */

import { createContext, useContext, type ReactNode } from 'react';
import type { DialogProps } from './Dialog';

/**
 * Dialog stack item representing an open dialog
 */
export interface DialogStackItem {
  /**
   * Unique dialog ID
   */
  id: string;

  /**
   * Dialog props (excluding isOpen which is managed by context)
   */
  props: Omit<DialogProps, 'isOpen'>;

  /**
   * Resolve function for promise-based dialog
   */
  resolve?: (value: unknown) => void;
}

/**
 * Dialog context value
 */
export interface DialogContextValue {
  /**
   * Currently open dialogs (stack for nested support)
   */
  dialogs: DialogStackItem[];

  /**
   * Open a new dialog
   * @returns Promise that resolves when dialog closes with the result value
   */
  openDialog: <T = void>(props: Omit<DialogProps, 'isOpen'>) => Promise<T>;

  /**
   * Close a specific dialog by ID
   * @param id - Dialog ID to close
   * @param result - Optional result value to resolve the promise
   */
  closeDialog: (id: string, result?: unknown) => void;

  /**
   * Close the topmost dialog
   * @param result - Optional result value to resolve the promise
   */
  closeTopDialog: (result?: unknown) => void;

  /**
   * Close all dialogs
   */
  closeAllDialogs: () => void;

  /**
   * Update props of an open dialog
   * @param id - Dialog ID to update
   * @param props - Partial props to merge
   */
  updateDialog: (id: string, props: Partial<DialogProps>) => void;

  /**
   * Check if a dialog is open
   * @param id - Dialog ID to check
   */
  isDialogOpen: (id: string) => boolean;

  /**
   * Get the count of open dialogs
   */
  dialogCount: number;
}

/**
 * Dialog context
 */
export const DialogContext = createContext<DialogContextValue | null>(null);

/**
 * Hook to access dialog context (returns null if not in provider)
 */
export function useDialogContext(): DialogContextValue | null {
  return useContext(DialogContext);
}

/**
 * Hook to access dialog context (throws if not in provider)
 * @throws Error if used outside of DialogProvider
 */
export function useDialogContextStrict(): DialogContextValue {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialogContextStrict must be used within a DialogProvider');
  }
  return context;
}
