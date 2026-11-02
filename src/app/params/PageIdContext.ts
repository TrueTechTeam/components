import { createContext } from 'react';

/** Id of the current page, provided by `Page`. Namespaces `usePreference` local storage keys. */
export const PageIdContext = createContext<string | null>(null);
PageIdContext.displayName = 'PageIdContext';
