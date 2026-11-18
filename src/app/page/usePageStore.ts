import { useContext, type Dispatch } from 'react';
import { PageStoreContext } from './PageContext';

/**
 * `[state, dispatch]` of the enclosing Page's `reducer`. Throws when used outside a Page or when
 * the Page has no `reducer` prop.
 */
export function usePageStore<S = unknown, A = unknown>(): [S, Dispatch<A>] {
  const store = useContext(PageStoreContext);
  if (store === undefined) {
    throw new Error('usePageStore must be used within a Page');
  }
  if (store === null) {
    throw new Error('usePageStore requires the Page to have a `reducer` prop');
  }
  return store as [S, Dispatch<A>];
}
