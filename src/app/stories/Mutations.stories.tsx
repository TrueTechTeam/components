import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createOptimisticHandlers, Loadable, Page, Section, useMutationFeedback } from '../index';
import { Button } from '../../lib/components/buttons/Button';
import { Badge } from '../../lib/components/display/Badge';
import { List } from '../../lib/components/display/List';
import { AdaptiveGrid } from '../../lib/components/layout/AdaptiveGrid';
import { ActionRow, Code, DemoPanel, Note, StoryApp, StoryFrame, wait } from './storyHelpers';

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
    <DemoPanel
      title="Toast"
      description="The default. A loading toast turns into success (5 s) or error (8 s)."
    >
      <ActionRow>
        <Button loading={isPending} onClick={() => mutate('Quarterly report')}>
          Save with toast
        </Button>
      </ActionRow>
    </DemoPanel>
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
    <DemoPanel
      title="Inline"
      description={
        <>
          <Code>via: &apos;inline&apos;</Code> returns the message to render next to the form.
        </>
      }
    >
      <ActionRow>
        <Button variant="outline" loading={isPending} onClick={() => mutate()}>
          Save with inline message
        </Button>
        {feedback && (
          <span role={feedback.type === 'error' ? 'alert' : 'status'}>
            <Badge variant={feedback.type === 'error' ? 'danger' : 'success'}>
              {feedback.message}
            </Badge>
          </span>
        )}
      </ActionRow>
    </DemoPanel>
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
  const items = (todos.data ?? []).map((title, i) => ({ id: `${title}-${i}`, title }));
  return (
    <DemoPanel
      title="Optimistic update"
      description="The item appears at once and is rolled back if the server fails."
    >
      <ActionRow>
        <Button
          variant="secondary"
          onClick={() => {
            mutate(`New item ${count}`);
            setCount(count + 1);
          }}
        >
          Add item
        </Button>
      </ActionRow>
      <Section queries={[todos]}>
        <Loadable shape="text" lines={2}>
          {() => <List data={items} primaryTextField="title" variant="bordered" size="sm" />}
        </Loadable>
      </Section>
    </DemoPanel>
  );
}

function Demo({ fail }: { fail: boolean }) {
  return (
    <Page title="Mutations">
      <StoryFrame
        title="Mutations"
        description="Success and error feedback for TanStack Query mutations, and optimistic cache updates."
      >
        <Note>
          Toggle the <Code>fail</Code> control to see the error toast, the inline error and the
          optimistic rollback.
        </Note>
        <AdaptiveGrid minItemWidth={300} gap={16} justifyItems="stretch" fillMode="auto-fit">
          <ToastDemo fail={fail} />
          <InlineDemo fail={fail} />
          <OptimisticDemo fail={fail} />
        </AdaptiveGrid>
      </StoryFrame>
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
          '`useMutationFeedback(mutation, opts)` adds toast (default) or inline success and error messaging to a TanStack Query mutation; settled toasts stay 5 s (success) or 8 s (error). `createOptimisticHandlers(queryClient, key, update)` spreads into `useMutation` to update the cache immediately, roll back on error and refetch on settle. Toggle `fail` to see the error and rollback paths.',
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
