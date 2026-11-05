import React, { useCallback, useContext, useId, type ErrorInfo } from 'react';
import { PageMessages } from '../../lib/components/display/PageMessages';
import { useLogger } from '../AppProvider/hooks';
import { ErrorBoundary } from './ErrorBoundary';
import { PageContext } from './PageContext';
import { PageState, useRegisterQueries, type StateProps } from './PageState';
import styles from './Page.module.scss';

export interface SectionProps extends StateProps {
  /** Heading text; when given, the section is labelled by it. */
  title?: string;
  /** DOM id of the `<section>` and its key in the page query registry. @default a generated id */
  id?: string;
  /** Level of the title heading. @default 2 */
  headingLevel?: 2 | 3 | 4;
}

/**
 * A region of a Page with its own loading/error/empty/forbidden/refreshing states and error
 * boundary, so one failing Section never takes down its siblings. Registers its `queries` with
 * the enclosing Page (debug panel).
 */
export function Section({
  title,
  id,
  headingLevel = 2,
  queries,
  isEmpty,
  skeleton,
  empty,
  permission,
  showErrorDetails,
  children,
}: SectionProps) {
  const generatedId = useId();
  const sectionId = id ?? generatedId;
  const headingId = `${sectionId}-title`;
  const page = useContext(PageContext);
  const logger = useLogger(`section:${id ?? title ?? sectionId}`);
  useRegisterQueries(page?.registerQueries, sectionId, queries);

  const onError = useCallback(
    (error: Error, info: ErrorInfo) => {
      logger.error('Section render error', error, info.componentStack);
    },
    [logger]
  );

  const Heading = `h${headingLevel}` as const;
  // State messages nest under the section title (GEN-3).
  const messageLevel = title ? (Math.min(headingLevel + 1, 6) as 3 | 4 | 5) : headingLevel;
  return (
    <section id={id} className={styles.section} aria-labelledby={title ? headingId : undefined}>
      {title && (
        <Heading id={headingId} className={styles.sectionTitle}>
          {title}
        </Heading>
      )}
      <ErrorBoundary
        onError={onError}
        // Generic text only (R9): the raw error goes to logger.error, never to the screen.
        fallback={(_error, reset) => (
          <PageMessages error onRetry={reset} size="sm" headingLevel={messageLevel} />
        )}
      >
        <PageState
          queries={queries}
          isEmpty={isEmpty}
          skeleton={skeleton}
          empty={empty}
          permission={permission}
          showErrorDetails={showErrorDetails}
          size="sm"
          headingLevel={messageLevel}
          ownsLoading={queries !== undefined && queries.length > 0}
        >
          {children}
        </PageState>
      </ErrorBoundary>
    </section>
  );
}
