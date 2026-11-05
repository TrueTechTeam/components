import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AppLink, Page } from '../index';
import { FormBuilder, type FormFieldConfig } from '../../lib/components/forms/FormBuilder';
import { Button } from '../../lib/components/buttons/Button';
import { useDialog } from '../../lib/hooks/useDialog';
import { ActionRow, DemoPanel, StoryApp, StoryFrame, wait } from './storyHelpers';

const fields: FormFieldConfig[] = [
  { name: 'title', type: 'input', label: 'Title' },
  { name: 'notes', type: 'textarea', label: 'Notes' },
];

const save = async () => {
  await wait(300);
};

const meta: Meta = {
  title: 'App Builder/Foundation/Unsaved changes',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    globalDecorators: 'provider',
    docs: {
      description: {
        component: `
\`<FormBuilder guardUnsaved />\` (or \`useUnsavedChanges(isDirty)\` for custom forms) registers a
navigation guard while the form is dirty. The guard covers \`AppLink\`, \`useAppNavigate\`,
closing a parent \`Dialog\` and browser unload. Submitting successfully clears it.

**Next.js limitation.** The Next.js App Router cannot block navigation, so the browser Back
button and the app's own \`router.push\` calls are **not** blocked there. Use \`AppLink\` and
\`useAppNavigate\` for in-app navigation, and \`beforeunload\` still protects tab close and reload.
React Router and the default History API router also block Back and Forward.

Provider order matters: \`GlobalProvider\` must wrap \`AppProvider\`.
`,
      },
    },
  },
};
export default meta;

type Story = StoryObj;

function EditPage() {
  return (
    <Page title="Edit article">
      <StoryFrame
        title="Edit article"
        width="form"
        description="Type in a field, then follow the link below: you are asked before leaving. The browser Back button is blocked too (not on Next.js)."
      >
        <DemoPanel>
          <FormBuilder fields={fields} guardUnsaved onSubmit={save} />
        </DemoPanel>
        <ActionRow>
          <AppLink href="?left=true">Leave this page (guarded link)</AppLink>
        </ActionRow>
      </StoryFrame>
    </Page>
  );
}

/** The guard asks for confirmation when you follow the link with unsaved edits. */
export const InAPage: Story = {
  render: () => (
    <StoryApp>
      <EditPage />
    </StoryApp>
  ),
};

function DialogForm() {
  return <FormBuilder fields={fields} guardUnsaved onSubmit={save} />;
}

function DialogDemo() {
  const dialog = useDialog();
  return (
    <Page title="Edit in dialog">
      <StoryFrame
        title="Edit in dialog"
        width="form"
        description="Edit a field, then press Escape or the close button: the dialog asks before discarding your changes."
      >
        <DemoPanel>
          <ActionRow>
            <Button
              onClick={() =>
                void dialog.open({ title: 'Edit article', size: 'md', children: <DialogForm /> })
              }
            >
              Open dialog
            </Button>
          </ActionRow>
        </DemoPanel>
      </StoryFrame>
    </Page>
  );
}

/** Closing a Dialog that holds a dirty guarded form asks first. */
export const InADialog: Story = {
  render: () => (
    <StoryApp>
      <DialogDemo />
    </StoryApp>
  ),
};
