import type { Meta, StoryObj } from '@storybook/react';
import { TagInput } from './TagInput';
import IconButton from '../../buttons/IconButton';

const meta: Meta<typeof TagInput> = {
  title: 'Forms/TagInput',
  component: TagInput,
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof TagInput>;

export const Default: Story = {
  args: {
    label: 'Tags',
    placeholder: 'Add a tag...',
  },
};

export const WithDefaultTags: Story = {
  args: {
    label: 'Skills',
    placeholder: 'Add a skill...',
    defaultValue: ['React', 'TypeScript', 'CSS'],
  },
};

export const WithMaxTags: Story = {
  args: {
    label: 'Categories (Max 5)',
    placeholder: 'Add a category...',
    maxTags: 5,
    helperText: 'You can add up to 5 categories',
  },
};

export const WithSuggestions: Story = {
  args: {
    label: 'Programming Languages',
    placeholder: 'Type to search...',
    suggestions: [
      'JavaScript',
      'TypeScript',
      'Python',
      'Java',
      'C++',
      'Ruby',
      'Go',
      'Rust',
      'PHP',
      'Swift',
    ],
    showSuggestions: true,
  },
};

export const WithValidation: Story = {
  args: {
    label: 'Hashtags',
    placeholder: 'Add hashtag...',
    validateTag: (tag) => {
      if (!tag.startsWith('#')) {
        return false;
      }
      return true;
    },
    transformTag: (tag) => {
      if (!tag.startsWith('#')) {
        return `#${tag}`;
      }
      return tag.toLowerCase();
    },
    helperText: 'Tags will automatically be prefixed with # and lowercased',
  },
};

export const NoDuplicates: Story = {
  args: {
    label: 'Unique Tags',
    placeholder: 'Add a tag...',
    allowDuplicates: false,
    defaultValue: ['React', 'TypeScript'],
    helperText: 'Duplicate tags are not allowed',
  },
};

export const AllowDuplicates: Story = {
  args: {
    label: 'Tags (Duplicates Allowed)',
    placeholder: 'Add a tag...',
    allowDuplicates: true,
    helperText: 'You can add duplicate tags',
  },
};

export const AddOnBlur: Story = {
  args: {
    label: 'Tags',
    placeholder: 'Type and click away to add...',
    addOnBlur: true,
    helperText: 'Tags will be added when you click away',
  },
};

export const CustomDelimiters: Story = {
  args: {
    label: 'Email Addresses',
    placeholder: 'Add email (press Enter, Space, or comma)...',
    delimiters: ['Enter', ',', ' '],
    helperText: 'Press Enter, Space, or comma to add',
  },
};

export const WithError: Story = {
  args: {
    label: 'Tags',
    placeholder: 'Add a tag...',
    error: true,
    errorMessage: 'At least one tag is required',
  },
};

export const Required: Story = {
  args: {
    label: 'Tags',
    placeholder: 'Add a tag...',
    required: true,
    helperText: 'This field is required',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Tags',
    placeholder: 'Add a tag...',
    defaultValue: ['React', 'TypeScript', 'CSS'],
    disabled: true,
  },
};

export const HorizontalLabel: Story = {
  args: {
    label: 'Tags',
    labelPlacement: 'left',
    defaultValue: ['React', 'TypeScript'],
  },
};

export const CustomRender: Story = {
  args: {
    label: 'Custom Styled Tags',
    placeholder: 'Add a tag...',
    defaultValue: ['Important', 'Urgent', 'Review'],
    renderTag: (tag: string, onRemove: () => void) => (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          background: tag === 'Important' ? '#fee2e2' : tag === 'Urgent' ? '#fef3c7' : '#dbeafe',
          color: tag === 'Important' ? '#991b1b' : tag === 'Urgent' ? '#92400e' : '#1e40af',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: 500,
        }}
      >
        <span>{tag}</span>
        <IconButton
          style={{
            color: 'inherit',
            '--button-bg-hover': 'transparent',
            '--button-bg-active': 'transparent',
          } as React.CSSProperties}
          variant="ghost"
          size="xs"
          icon="close"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Remove ${tag}`}
          type="button"
        />
      </div>
    ),
  },
};

export const Playground: Story = {
  args: {
    label: 'Tag Input',
    placeholder: 'Add a tag...',
    helperText: 'Press Enter or comma to add tags',
    allowDuplicates: false,
    showSuggestions: true,
    suggestions: ['React', 'Vue', 'Angular', 'Svelte', 'TypeScript'],
  },
};

