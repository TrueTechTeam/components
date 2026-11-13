import { useEffect } from 'react';
import { useAppConfig } from '../AppProvider/hooks';

export interface PageMeta {
  title: string;
  description?: string;
}

/**
 * Sets `document.title` (through `AppProvider`'s `titleTemplate`) and the
 * `<meta name="description">` content while mounted, restoring the previous values on unmount.
 * Touches the document only in effects, so it is safe to server-render.
 */
export function usePageMeta({ title, description }: PageMeta): void {
  const { titleTemplate } = useAppConfig();

  useEffect(() => {
    const previous = document.title;
    document.title = titleTemplate(title);
    return () => {
      document.title = previous;
    };
  }, [title, titleTemplate]);

  useEffect(() => {
    if (description === undefined) {
      return undefined;
    }
    let meta = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
    const created = !meta;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    const previous = meta.getAttribute('content');
    meta.setAttribute('content', description);
    const element = meta;
    return () => {
      if (created) {
        element.remove();
      } else if (previous === null) {
        element.removeAttribute('content');
      } else {
        element.setAttribute('content', previous);
      }
    };
  }, [description]);
}
