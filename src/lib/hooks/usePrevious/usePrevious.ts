import { useRef } from 'react';

/**
 * Hook that returns the previous value of a state or prop
 *
 * @example
 * ```tsx
 * function Counter({ count }: { count: number }) {
 *   const prevCount = usePrevious(count);
 *
 *   return (
 *     <div>
 *       Current: {count}, Previous: {prevCount ?? 'N/A'}
 *       {prevCount !== undefined && count > prevCount && ' (increased)'}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * function UserProfile({ userId }: { userId: string }) {
 *   const prevUserId = usePrevious(userId);
 *
 *   useEffect(() => {
 *     if (prevUserId && prevUserId !== userId) {
 *       // User changed, reset form or fetch new data
 *       resetForm();
 *     }
 *   }, [userId, prevUserId]);
 *
 *   return <Profile userId={userId} />;
 * }
 * ```
 */
export function usePrevious<T>(value: T): T | undefined {
  const currentRef = useRef<T | undefined>(undefined);
  const previousRef = useRef<T | undefined>(undefined);

  if (currentRef.current !== value) {
    previousRef.current = currentRef.current;
    currentRef.current = value;
  }

  return previousRef.current;
}

export default usePrevious;
