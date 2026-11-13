import styles from './AppLink.module.scss';

/**
 * `className` with the library link class added once. AppLink and every adapter Link apply it,
 * so a link is styled whichever renders it, without duplicating the class when AppLink renders
 * an adapter Link.
 */
export function linkClassName(className?: string): string {
  const classes = (className ?? '').split(/\s+/).filter(Boolean);
  return classes.includes(styles.link) ? classes.join(' ') : [styles.link, ...classes].join(' ');
}
