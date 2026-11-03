import React, { useState, type ReactNode } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { AppProvider, type AppProviderProps } from '../AppProvider';

/** A QueryClient for stories: no retries, so failures show immediately. */
export function createStoryQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: 0 } } });
}

/**
 * `AppProvider` for stories. Storybook's `provider` global decorator already supplies
 * `GlobalProvider`, which must stay the outer provider.
 */
export function StoryApp({
  children,
  ...props
}: Omit<AppProviderProps, 'children'> & { children: ReactNode }) {
  const [client] = useState(createStoryQueryClient);
  return (
    <AppProvider queryClient={client} debug={false} {...props}>
      {children}
    </AppProvider>
  );
}

export const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export interface Order {
  id: number;
  customer: string;
  total: number;
  status: 'paid' | 'pending' | 'refunded';
}

export const ORDERS: Order[] = [
  { id: 1001, customer: 'Ada Lovelace', total: 129.5, status: 'paid' },
  { id: 1002, customer: 'Grace Hopper', total: 48, status: 'pending' },
  { id: 1003, customer: 'Alan Turing', total: 312.25, status: 'paid' },
  { id: 1004, customer: 'Katherine Johnson', total: 75, status: 'refunded' },
];

export const monoStyle = { fontFamily: 'var(--font-family-mono, monospace)' } as const;
