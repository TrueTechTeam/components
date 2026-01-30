import type { Meta, StoryObj } from '@storybook/react';
import { useState, useEffect, type ReactNode } from 'react';
import { useUrlState, urlStateSerializers } from './useUrlState';
import { Button } from '../../components/buttons/Button';
import { Input } from '../../components/inputs/Input';
import { Select } from '../../components/inputs/Select';
import { Card } from '../../components/display/Card';
import { Pill } from '../../components/display/Pill';

/**
 * Story wrapper that displays the current URL in a card
 */
interface UrlStateStoryWrapperProps {
  children: ReactNode;
}

function UrlStateStoryWrapper({ children }: UrlStateStoryWrapperProps) {
  const [currentUrl, setCurrentUrl] = useState(
    typeof window !== 'undefined' ? window.location.href : ''
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window !== 'undefined') {
        setCurrentUrl(window.location.href);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Card
        variant="outlined"
        padding="md"
        style={{
          fontFamily: 'monospace',
          fontSize: '12px',
          wordBreak: 'break-all',
          background: 'var(--theme-surface-secondary)',
        }}
      >
        <strong style={{ color: 'var(--theme-text-primary)' }}>Current URL:</strong>
        <br />
        <span style={{ color: 'var(--theme-text-secondary)' }}>{currentUrl}</span>
      </Card>
      {children}
    </div>
  );
}

// Demo component for basic usage
function BasicDemo() {
  const [search, setSearch, clearSearch] = useUrlState('q', {
    defaultValue: '',
    debounce: 300,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>
        Search Parameter (debounced 300ms)
      </h4>
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Type to update URL..."
      />
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Button onClick={clearSearch} variant="secondary" size="sm">
          Clear
        </Button>
        <span style={{ color: 'var(--theme-text-tertiary)' }}>
          URL param: <code style={{ color: 'var(--theme-primary)' }}>q={search || '(empty)'}</code>
        </span>
      </div>
    </div>
  );
}

// Demo component for number pagination
function PaginationDemo() {
  const [page, setPage] = useUrlState('page', {
    defaultValue: 1,
    serializer: urlStateSerializers.number,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>Page Parameter (number)</h4>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          variant="secondary"
        >
          Previous
        </Button>
        <span style={{ fontWeight: 'bold', fontSize: '18px', color: 'var(--theme-primary)' }}>
          Page {page}
        </span>
        <Button onClick={() => setPage((p) => p + 1)} variant="primary">
          Next
        </Button>
      </div>
      <span style={{ color: 'var(--theme-text-tertiary)' }}>
        URL param: <code style={{ color: 'var(--theme-primary)' }}>page={page}</code>
      </span>
    </div>
  );
}

// Demo component for array tags
function TagsDemo() {
  const [tags, setTags] = useUrlState<string[]>('tags', {
    defaultValue: [],
    serializer: urlStateSerializers.array(),
  });

  const availableTags = ['react', 'typescript', 'hooks', 'storybook', 'ui'];

  const toggleTag = (tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>Tags Parameter (array)</h4>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {availableTags.map((tag) => (
          <Pill
            key={tag}
            onClick={() => toggleTag(tag)}
            variant={tags.includes(tag) ? 'filled' : 'subtle'}
            style={{ cursor: 'pointer' }}
          >
            {tag}
          </Pill>
        ))}
      </div>
      <span style={{ color: 'var(--theme-text-tertiary)' }}>
        URL param:{' '}
        <code style={{ color: 'var(--theme-primary)' }}>tags={tags.join(',') || '(empty)'}</code>
      </span>
    </div>
  );
}

// Demo for complex filters
function FiltersDemo() {
  const [filters, setFilters] = useUrlState<{ status: string; sortBy: string }>('filters', {
    defaultValue: { status: 'all', sortBy: 'date' },
    serializer: urlStateSerializers.json(),
  });

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ];

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'name', label: 'Name' },
    { value: 'priority', label: 'Priority' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h4 style={{ margin: 0, color: 'var(--theme-text-primary)' }}>Complex Filters (JSON)</h4>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--theme-text-secondary)' }}>Status:</span>
          <Select
            value={filters.status}
            onChange={(value) => setFilters((f) => ({ ...f, status: value as string }))}
            options={statusOptions}
            style={{ minWidth: '120px' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--theme-text-secondary)' }}>Sort By:</span>
          <Select
            value={filters.sortBy}
            onChange={(value) => setFilters((f) => ({ ...f, sortBy: value as string }))}
            options={sortOptions}
            style={{ minWidth: '120px' }}
          />
        </div>
      </div>
      <span style={{ color: 'var(--theme-text-tertiary)' }}>
        URL param:{' '}
        <code style={{ color: 'var(--theme-primary)' }}>filters={JSON.stringify(filters)}</code>
      </span>
    </div>
  );
}

// Combined demo showing all examples
function CombinedDemo() {
  return (
    <UrlStateStoryWrapper>
      <BasicDemo />
      <hr
        style={{
          border: 'none',
          borderTop: '1px solid var(--theme-border-primary)',
          margin: '8px 0',
        }}
      />
      <PaginationDemo />
      <hr
        style={{
          border: 'none',
          borderTop: '1px solid var(--theme-border-primary)',
          margin: '8px 0',
        }}
      />
      <TagsDemo />
      <hr
        style={{
          border: 'none',
          borderTop: '1px solid var(--theme-border-primary)',
          margin: '8px 0',
        }}
      />
      <FiltersDemo />
    </UrlStateStoryWrapper>
  );
}

const meta: Meta = {
  title: 'Hooks/useUrlState',
  component: CombinedDemo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
\`useUrlState\` synchronizes React state with URL search parameters, providing a typed \`useState\`-like API for managing URL query parameters.

## Features
- Built-in serializers for \`string\`, \`number\`, \`boolean\`, \`array\`, \`json\`
- Automatic type inference from default value
- Debounce support to avoid excessive URL updates
- History integration (push/replace)
- Popstate event handling for browser navigation

## Basic Usage

\`\`\`tsx
import { useUrlState, urlStateSerializers } from '@true-tech-team/ui-components';

// String parameter (auto-inferred)
const [search, setSearch] = useUrlState('q', { defaultValue: '' });

// Number parameter
const [page, setPage] = useUrlState('page', {
  defaultValue: 1,
  serializer: urlStateSerializers.number,
});

// Array parameter
const [tags, setTags] = useUrlState('tags', {
  defaultValue: [],
  serializer: urlStateSerializers.array(),
});

// JSON object
const [filters, setFilters] = useUrlState('filters', {
  defaultValue: { status: 'all' },
  serializer: urlStateSerializers.json(),
});
\`\`\`

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| \`defaultValue\` | \`T\` | required | Default value when param is not in URL |
| \`serializer\` | \`UrlStateSerializer<T>\` | auto-inferred | Custom serializer |
| \`replace\` | \`boolean\` | \`false\` | Use replaceState instead of pushState |
| \`debounce\` | \`number\` | \`0\` | Debounce URL updates (ms) |
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: 'All Examples',
  render: () => <CombinedDemo />,
};

export const StringParameter: Story = {
  render: () => (
    <UrlStateStoryWrapper>
      <BasicDemo />
    </UrlStateStoryWrapper>
  ),
};

export const NumberParameter: Story = {
  render: () => (
    <UrlStateStoryWrapper>
      <PaginationDemo />
    </UrlStateStoryWrapper>
  ),
};

export const ArrayParameter: Story = {
  render: () => (
    <UrlStateStoryWrapper>
      <TagsDemo />
    </UrlStateStoryWrapper>
  ),
};

export const JSONParameter: Story = {
  render: () => (
    <UrlStateStoryWrapper>
      <FiltersDemo />
    </UrlStateStoryWrapper>
  ),
};
