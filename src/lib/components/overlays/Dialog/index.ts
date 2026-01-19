/**
 * Dialog component exports
 */

export {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from './Dialog';

export type {
  DialogProps,
  DialogSize,
  DialogHeaderProps,
  DialogBodyProps,
  DialogFooterProps,
} from './Dialog';

export { DialogProvider } from './DialogProvider';
export type { DialogProviderProps } from './DialogProvider';

export {
  DialogContext,
  useDialogContext,
  useDialogContextStrict,
} from './DialogContext';

export type {
  DialogContextValue,
  DialogStackItem,
} from './DialogContext';
