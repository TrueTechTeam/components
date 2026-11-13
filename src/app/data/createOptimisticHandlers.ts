import type { QueryClient, QueryKey } from '@tanstack/react-query';

/**
 * Spread into `useMutation` options: updates the cache immediately, restores the previous
 * value on error and refetches once the mutation settles.
 */
export function createOptimisticHandlers<TData, TVars>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  update: (old: TData | undefined, vars: TVars) => TData
) {
  return {
    async onMutate(vars: TVars): Promise<{ previous: TData | undefined }> {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<TData>(queryKey);
      queryClient.setQueryData<TData>(queryKey, update(previous, vars));
      return { previous };
    },
    onError(_err: unknown, _vars: TVars, ctx?: { previous: TData | undefined }): void {
      if (ctx) {
        queryClient.setQueryData<TData>(queryKey, ctx.previous);
      }
    },
    async onSettled(): Promise<void> {
      await queryClient.invalidateQueries({ queryKey });
    },
  };
}
