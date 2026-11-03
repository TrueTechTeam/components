import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createOptimisticHandlers, Page, useMutationFeedback } from '../index';
import { Button } from '../../lib/components/buttons/Button';
import { StoryApp, wait } from './storyHelpers';

const KEY = ['story-todos'];
let serverTodos = ['Write docs', 'Review PR'];

function ToastDemo({ fail }: { fail: boolean }) {
  const save = useMutation({
    mutationFn: async (name: string) => {
      await wait(800);
      if (fail) {
        throw new Error('Server said no');
      }
      return name;
    },
  });
  const { mutate, isPending } = useMutationFeedback(save, {
    pending: 'Saving...',
    success: (name) => `Saved "${name}"`,
    error: 'Could not save. Try again.',
  });
  return (
    <Button loading={isPending} onClick={() => mutate('Quarterly report')}>
      Save with toast
    </Button>
  );
}

function InlineDemo({ fail }: { fail: boolean }) {
  const save = useMutation({
    mutationFn: async () => {
      await wait(800);
      if (fail) {
        throw new Error('Server said no');
      }
    },
  });
  const { mutate, isPending, feedback } = useMutationFeedback(save, {
    via: 'inline',
    success: 'Settings saved',
  });
  return (
    <div style={{ display: 'grid', gap: 'var(--spacing-sm)', justifyItems: 'start' }}>
      <Button variant="outline" loading={isPending} onClick={() => mutate()}>
        Save with inline message
      </Button>
      {feedback && (
        <div role={feedback.type === 'error' ? 'alert' : 'status'}>
          {feedback.type === 'error' ? 'Error: ' : 'Done: '}
          {feedback.message}
        </div>
      )}
    </div>
  );
}

function OptimisticDemo({ fail }: { fail: boolean }) {
  const queryClient = useQueryClient();
  const todos = useQuery({
    queryKey: KEY,
    queryFn: async () => {
      await wait(300);
      return [...serverTodos];
    },
  });
  const add = useMutation({
    mutationFn: async (title: string) => {
      await wait(1500);
      if (fail) {
        throw new Error('Server said no');
      }
      serverTodos = [...serverTodos, title];
    },
    ...createOptimisticHandlers<string[], string>(queryClient, KEY, (old, title) => [
      ...(old ?? []),
      title,
    ]),
  });
  const { mutate } = useMutationFeedback(add, { error: 'Could not add. The list was restored.' });
  const [count, setCount] = useState(1);
  return (
    <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
      <Button
        variant="secondary"
        onClick={() => {
          mutate(`New item ${count}`);
          setCount(count + 1);
        }}
      >
        Add item (optimistic)
      </Button>
      <ul style={{ margin: 0 }}>
        {todos.data?.map((t, i) => (
          <li key={`${t}-${i}`}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

function Demo({ fail }: { fail: boolean }) {
  return (
    <Page title="Mutations">
      <div style={{ padding: 'var(--spacing-lg)', display: 'grid', gap: 'var(--spacing-lg)' }}>
        <h1 style={{ margin: 0 }}>Mutations</h1>
        <ToastDemo fail={fail} />
        <InlineDemo fail={fail} />
        <OptimisticDemo fail={fail} />
      </div>
    </Page>
  );
}

const meta: Meta<{ fail: boolean }> = {
  title: 'App Builder/Foundation/Mutations',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    globalDecorators: 'provider',
    docs: {
      description: {
        component:
          '`useMutationFeedback(mutation, opts)` adds toast (default) or inline success and error messaging to a TanStack Query mutation. `createOptimisticHandlers(queryClient, key, update)` spreads into `useMutation` to update the cache immediately, roll back on error and refetch on settle. Toggle `fail` to see the error and rollback paths.',
      },
    },
  },
  argTypes: { fail: { control: 'boolean' } },
  args: { fail: false },
};
export default meta;

export const ToastInlineOptimistic: StoryObj<{ fail: boolean }> = {
  render: ({ fail }) => (
    <StoryApp key={String(fail)}>
      <Demo fail={fail} />
    </StoryApp>
  ),
};
