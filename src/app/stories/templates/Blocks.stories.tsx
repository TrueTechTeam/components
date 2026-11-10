import React, { useRef, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import {
  ActivityTimeline,
  KeyFacts,
  MediaGallery,
  Notes,
  PropertyList,
  RelatedRecords,
  type ActivityItem,
  type FieldDef,
  type MediaItem,
  type NoteItem,
} from '../../index';
import { DemoPanel, Note, StoryFrame } from '../storyHelpers';
import {
  ISSUE_PRIORITY_TONES,
  PROJECTS,
  RELEASE,
  RELEASE_ACTIVITY,
  RELEASE_FILES,
  RELEASE_NOTES,
  RELEASE_STATUS_LABELS,
  RELEASE_STATUS_TONES,
  issuesFor,
  type Issue,
  type Release,
} from './fixtures';
import {
  FETCH_ARG_TYPES,
  FETCH_DEFAULTS,
  FOREVER,
  TemplateStory,
  respond,
  useFetchControl,
  type FetchArgs,
} from './templateKit';
import styles from './templates.module.scss';

const PROPERTIES: Array<FieldDef<Release>> = [
  {
    key: 'status',
    label: 'Status',
    kind: 'status',
    statusTones: RELEASE_STATUS_TONES,
    statusLabels: RELEASE_STATUS_LABELS,
  },
  { key: 'version', label: 'Version', kind: 'text' },
  { key: 'owner', label: 'Owner', kind: 'text', get: (r) => r.owner?.name },
  { key: 'owner', label: 'Owner email', kind: 'email', get: (r) => r.owner?.email },
  { key: 'releaseDate', label: 'Release date', kind: 'date' },
  { key: 'id', label: 'Release ID', kind: 'id' },
  { key: 'platforms', label: 'Platforms', kind: 'tags' },
  { key: 'changelogUrl', label: 'Changelog', kind: 'url' },
  { key: 'description', label: 'Description', kind: 'longText', span: 2 },
];

const FACTS: Array<FieldDef<Release>> = [
  { key: 'releaseDate', label: 'Release date', kind: 'date' },
  { key: 'rollout', label: 'Rollout', kind: 'percent' },
  { key: 'issuesClosed', label: 'Issues closed', kind: 'number' },
  { key: 'crashFreeRate', label: 'Crash-free sessions', kind: 'percent', fractionDigits: 2 },
  { key: 'buildSize', label: 'Build size', kind: 'fileSize', fractionDigits: 1 },
];

const ISSUE_COLUMNS: Array<FieldDef<Issue>> = [
  { key: 'id', label: 'Key', kind: 'text' },
  { key: 'title', label: 'Issue', kind: 'text' },
  { key: 'priority', label: 'Priority', kind: 'status', statusTones: ISSUE_PRIORITY_TONES },
  { key: 'updatedAt', label: 'Updated', kind: 'relative' },
];

/** A query driven by the story's fetch controls; `empty` returns `emptyValue`. */
function useDemoQuery<T>(
  name: string,
  args: FetchArgs,
  value: T,
  emptyValue: T
): UseQueryResult<T> {
  const control = useFetchControl(args);
  return useQuery({
    queryKey: ['blocks', name],
    queryFn: () => respond(control, () => (control.current.empty ? emptyValue : value)),
  });
}

function PropertyListDemo({ args }: { args: FetchArgs }) {
  // `empty` means an empty record: every field is "Not set".
  const query = useDemoQuery<Release>('properties', args, RELEASE, {} as Release);
  return (
    <PropertyList<Release> title="Release details" fields={PROPERTIES} query={query} columns={2} />
  );
}

function KeyFactsDemo({ args }: { args: FetchArgs }) {
  const query = useDemoQuery<Release | null>('facts', args, RELEASE, null);
  return (
    <KeyFacts<Release>
      fields={FACTS}
      query={query}
      empty={{ title: 'No facts yet', description: 'Facts appear once the release is scheduled.' }}
    />
  );
}

function ActivityDemo({ args }: { args: FetchArgs }) {
  const query = useDemoQuery<ActivityItem[]>('activity', args, RELEASE_ACTIVITY, []);
  return (
    <ActivityTimeline
      title="Activity"
      query={query}
      limit={4}
      empty={{
        title: 'No activity yet',
        description: 'Changes to this release will show up here.',
      }}
    />
  );
}

function NotesDemo({ args }: { args: FetchArgs }) {
  const store = useRef<NoteItem[]>(RELEASE_NOTES);
  const query = useDemoQuery<NoteItem[]>('notes', args, store.current, []);
  return (
    <Notes
      title="Notes"
      query={query}
      empty={{ title: 'No notes yet', description: 'Leave the first note for your team.' }}
      onAdd={async (body) => {
        await new Promise((r) => setTimeout(r, 500));
        store.current = [
          { id: `n${Date.now()}`, author: 'You', at: new Date().toISOString(), body },
          ...store.current,
        ];
        await query.refetch();
      }}
    />
  );
}

function MediaDemo({ args }: { args: FetchArgs }) {
  const query = useDemoQuery<MediaItem[]>('media', args, RELEASE_FILES, []);
  return (
    <MediaGallery
      title="Files"
      query={query}
      empty={{ title: 'No files', description: 'Attach screenshots, builds or documents.' }}
    />
  );
}

function RelatedDemo({ args }: { args: FetchArgs }) {
  const query = useDemoQuery<Issue[]>('related', args, issuesFor(PROJECTS[0]), []);
  return (
    <RelatedRecords<Issue>
      title="Issues in this release"
      query={query}
      columns={ISSUE_COLUMNS}
      total={31}
      viewAllHref="/issues?release=v3.4.0"
      empty={{ title: 'No issues', description: 'Nothing is linked to this release.' }}
    />
  );
}

function Frame({
  args,
  title,
  description,
  children,
}: {
  args: FetchArgs;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <TemplateStory key={JSON.stringify(args)} url="/releases/v3.4.0">
      <StoryFrame title={title} description={description}>
        <DemoPanel>{children}</DemoPanel>
      </StoryFrame>
    </TemplateStory>
  );
}

const meta: Meta<FetchArgs> = {
  title: 'App Builder/Templates/Blocks',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    globalDecorators: 'provider',
    docs: {
      description: {
        component:
          'Detail blocks for a details page, a detail panel or a dashboard widget. Each is a `Section` with its own loading, empty and error states, fed by `data`/`items`/`rows` or a `query`; values render with `FieldValue` from `FieldDef`s (`{ key, label, kind, get?, span?, ...FieldOptions }`). Use the delay, fail and empty controls on each story.',
      },
    },
  },
  argTypes: FETCH_ARG_TYPES,
  args: FETCH_DEFAULTS,
};
export default meta;

type Story = StoryObj<FetchArgs>;

/** Every block together, as on a release details page. */
export const AllBlocks: Story = {
  name: 'All blocks',
  render: (args) => (
    <TemplateStory key={JSON.stringify(args)} url="/releases/v3.4.0">
      <StoryFrame
        title="Detail blocks"
        description="The blocks a details page is made of, each loading, failing and emptying on its own."
      >
        <KeyFactsDemo args={args} />
        <div className={styles.stack}>
          <DemoPanel>
            <PropertyListDemo args={args} />
          </DemoPanel>
          <DemoPanel>
            <RelatedDemo args={args} />
          </DemoPanel>
          <DemoPanel>
            <ActivityDemo args={args} />
          </DemoPanel>
          <DemoPanel>
            <NotesDemo args={args} />
          </DemoPanel>
          <DemoPanel>
            <MediaDemo args={args} />
          </DemoPanel>
        </div>
      </StoryFrame>
    </TemplateStory>
  ),
};

/** Labels render at once; only the values skeletonize. */
export const AllBlocksLoading: Story = {
  ...AllBlocks,
  name: 'All blocks (loading)',
  args: { delay: FOREVER },
};

/** Each block shows its own empty state. */
export const AllBlocksEmpty: Story = {
  ...AllBlocks,
  name: 'All blocks (empty)',
  args: { empty: true, delay: 200 },
};

/** Each block shows its own error with Retry. */
export const AllBlocksError: Story = {
  ...AllBlocks,
  name: 'All blocks (error)',
  args: { fail: true, delay: 200 },
};

export const PropertyListBlock: Story = {
  name: 'PropertyList',
  render: (args) => (
    <Frame
      args={args}
      title="PropertyList"
      description="Label and value pairs of one record, in one or two columns. A field with span 2 takes a full row."
    >
      <PropertyListDemo args={args} />
    </Frame>
  ),
};

export const KeyFactsBlock: Story = {
  name: 'KeyFacts',
  render: (args) => (
    <Frame
      args={args}
      title="KeyFacts"
      description="A strip of three to six headline facts under a details page header."
    >
      <KeyFactsDemo args={args} />
    </Frame>
  ),
};

export const ActivityTimelineBlock: Story = {
  name: 'ActivityTimeline',
  render: (args) => (
    <Frame
      args={args}
      title="ActivityTimeline"
      description="Newest-first events with relative times; Show all reveals the rest and moves focus to the first new item."
    >
      <ActivityDemo args={args} />
    </Frame>
  ),
};

export const NotesBlock: Story = {
  name: 'Notes',
  render: (args) => (
    <Frame
      args={args}
      title="Notes"
      description="Comments with an add form; the result is announced inline."
    >
      <NotesDemo args={args} />
    </Frame>
  ),
};

export const MediaGalleryBlock: Story = {
  name: 'MediaGallery',
  render: (args) => (
    <Frame
      args={args}
      title="MediaGallery"
      description="Image thumbnails with file names and sizes. Every item needs alt text."
    >
      <MediaDemo args={args} />
    </Frame>
  ),
};

export const RelatedRecordsBlock: Story = {
  name: 'RelatedRecords',
  render: (args) => (
    <Frame
      args={args}
      title="RelatedRecords"
      description="Up to five child records in a compact table, with View all (N) when there are more."
    >
      <RelatedDemo args={args} />
      <Note>Shows the first five of 31 issues; View all links to the full list.</Note>
    </Frame>
  ),
};
