export { useTheme } from './useTheme';

export { usePortal } from './usePortal';
export type { UsePortalOptions } from './usePortal';

export { useClickOutside } from './useClickOutside';

export { useEscapeKey } from './useEscapeKey';

export { useFocusTrap } from './useFocusTrap';

export { usePopoverPosition } from './usePopoverPosition';
export type { UsePopoverPositionOptions, UsePopoverPositionReturn } from './usePopoverPosition';

export { useHover } from './useHover';
export type { UseHoverOptions, UseHoverReturn, HoverProps } from './useHover';

export { useDebounce } from './useDebounce';

// Notification hooks
export { useDialog } from './useDialog';
export type { UseDialogOptions, UseDialogReturn } from './useDialog';

export { useAlert } from './useAlert';
export type { UseAlertOptions, UseAlertReturn } from './useAlert';

export { useToast } from './useToast';
export type { UseToastOptions, UseToastReturn } from './useToast';

export { useAsyncToast } from './useAsyncToast';
export type { UseAsyncToastReturn, AsyncToastConfig } from './useAsyncToast';

export { useResizeObserver } from './useResizeObserver';
export type { UseResizeObserverOptions, UseResizeObserverReturn } from './useResizeObserver';

// URL State
export { useUrlState, urlStateSerializers } from './useUrlState';
export type { UseUrlStateOptions, UseUrlStateReturn, UrlStateSerializer } from './useUrlState';

// Intersection Observer
export { useIntersectionObserver } from './useIntersectionObserver';
export type {
  UseIntersectionObserverOptions,
  UseIntersectionObserverReturn,
} from './useIntersectionObserver';

// Local Storage
export { useLocalStorage } from './useLocalStorage';
export type {
  UseLocalStorageOptions,
  UseLocalStorageReturn,
  LocalStorageSerializer,
} from './useLocalStorage';

// Media Query
export { useMediaQuery } from './useMediaQuery';
export type { UseMediaQueryOptions, UseMediaQueryReturn } from './useMediaQuery';

// Previous Value
export { usePrevious } from './usePrevious';

// Clipboard
export { useClipboard } from './useClipboard';
export type { UseClipboardOptions, UseClipboardReturn } from './useClipboard';

// Timers
export { useTimeout } from './useTimeout';
export type { UseTimeoutOptions, UseTimeoutReturn } from './useTimeout';

export { useInterval } from './useInterval';
export type { UseIntervalOptions, UseIntervalReturn } from './useInterval';
