import { useCallback, useEffect, useRef, useState } from 'react';
import type { UseMutationResult } from '@tanstack/react-query';
import { useToast } from '../../lib/hooks/useToast';
import { useLabels } from '../../lib/contexts/LabelsContext';

export interface MutationFeedbackOptions<TData, TVars> {
  success?: string | ((data: TData, vars: TVars) => string);
  /** Defaults to the `mutation.error` label. */
  error?: string | ((err: unknown, vars: TVars) => string);
  /** @default 'toast' */
  via?: 'toast' | 'inline';
  /** Toast mode: shows a loading toast that is updated when the mutation settles. */
  pending?: string;
}

export interface MutationFeedback {
  type: 'success' | 'error';
  message: string;
}

const SETTLED_TOAST_MS = 5000;

/** Wraps a TanStack Query mutation with toast or inline success/error messaging. */
export function useMutationFeedback<TData, TErr, TVars>(
  mutation: UseMutationResult<TData, TErr, TVars>,
  opts: MutationFeedbackOptions<TData, TVars> = {}
) {
  const toast = useToast();
  const t = useLabels();
  const [feedback, setFeedback] = useState<MutationFeedback | null>(null);
  const latest = useRef({ opts, toast, t, mutateAsync: mutation.mutateAsync });
  latest.current = { opts, toast, t, mutateAsync: mutation.mutateAsync };

  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const mutateAsync = useCallback(async (vars: TVars): Promise<TData> => {
    const { opts: o, toast: tst, t: label, mutateAsync: run } = latest.current;
    const via = o.via ?? 'toast';
    const pendingId = via === 'toast' && o.pending ? tst.loading(o.pending) : undefined;
    if (via === 'inline') {
      setFeedback(null);
    }

    const show = (type: 'success' | 'error', message: string) => {
      if (via === 'inline') {
        if (mounted.current) {
          setFeedback({ type, message });
        }
      } else if (pendingId) {
        tst.update(pendingId, { message, variant: type, duration: SETTLED_TOAST_MS });
      } else if (type === 'success') {
        tst.success(message);
      } else {
        tst.error(message);
      }
    };

    try {
      const data = await run(vars);
      if (o.success !== undefined) {
        show('success', typeof o.success === 'function' ? o.success(data, vars) : o.success);
      } else if (pendingId) {
        tst.dismiss(pendingId);
      }
      return data;
    } catch (err) {
      const message =
        o.error === undefined
          ? label('mutation.error')
          : typeof o.error === 'function'
            ? o.error(err, vars)
            : o.error;
      show('error', message);
      throw err;
    }
  }, []);

  const mutate = useCallback(
    (vars: TVars) => {
      mutateAsync(vars).catch(() => {
        // Surfaced through feedback; the mutation result also exposes the error.
      });
    },
    [mutateAsync]
  );

  const clearFeedback = useCallback(() => setFeedback(null), []);

  return { mutate, mutateAsync, isPending: mutation.isPending, feedback, clearFeedback };
}
