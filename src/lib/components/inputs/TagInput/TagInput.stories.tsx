import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { TagInput } from './TagInput';
import IconButton from '../../buttons/IconButton';

const meta: Meta<typeof TagInput> = {
  title: 'Inputs/TagInput',
  component: TagInput,
  tags: ['autodocs'],
  argTypes: {
    // Simple controls
    label: {
      control: 'text',
      description: 'Input label text',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder for input field',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the input',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message (shows when error is true)',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    error: {
      control: 'boolean',
      description: 'Whether the input is in an error state',
    },
    maxTags: {
      control: 'number',
      description: 'Maximum number of tags allowed',
    },
    allowDuplicates: {
      control: 'boolean',
      description: 'Allow duplicate tags',
    },
    addOnBlur: {
      control: 'boolean',
      description: 'Add tag on blur',
    },
    showSuggestions: {
      control: 'boolean',
      description: 'Show autocomplete suggestions',
    },
    labelPlacement: {
      control: 'select',
      options: ['top', 'left'],
      description: 'Label placement',
    },
    clearOnBlur: {
      control: 'boolean',
      description: 'Whether to clear input on blur',
    },
    // Disable complex props
    validateTag: { table: { disable: true } },
    transformTag: { table: { disable: true } },
    renderTag: { table: { disable: true } },
    suggestions: { table: { disable: true } },
    delimiters: { table: { disable: true } },
    onChange: { table: { disable: true } },
    onBlur: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
    'aria-label': { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof TagInput>;

/**
 * Default tag input
 */
export const Default: Story = {
  args: {
    label: 'Tags',
    placeholder: 'Add a tag...',
    onChange: action('onChange'),
    onBlur: action('onBlur'),
  },
};

/**
 * Tag input with pre-filled default tags
 */
export const WithDefaultTags: Story = {
  render: () => (
    <TagInput
      label="Skills"
      placeholder="Add a skill..."
      defaultValue={['React', 'TypeScript', 'CSS']}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Tag input with a maximum number of allowed tags
 */
export const WithMaxTags: Story = {
  render: () => (
    <TagInput
      label="Categories (Max 5)"
      placeholder="Add a category..."
      maxTags={5}
      helperText="You can add up to 5 categories"
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Tag input with autocomplete suggestions
 */
export const WithSuggestions: Story = {
  render: () => (
    <TagInput
      label="Programming Languages"
      placeholder="Type to search..."
      suggestions={[
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
      ]}
      showSuggestions={true}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Tag input with validation and transformation functions
 */
export const WithValidation: Story = {
  render: () => (
    <TagInput
      label="Hashtags"
      placeholder="Add hashtag..."
      validateTag={(tag) => {
        if (!tag.startsWith('#')) {
          return false;
        }
        return true;
      }}
      transformTag={(tag) => {
        if (!tag.startsWith('#')) {
          return `#${tag}`;
        }
        return tag.toLowerCase();
      }}
      helperText="Tags will automatically be prefixed with # and lowercased"
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Tag input that prevents duplicate tags
 */
export const NoDuplicates: Story = {
  render: () => (
    <TagInput
      label="Unique Tags"
      placeholder="Add a tag..."
      allowDuplicates={false}
      defaultValue={['React', 'TypeScript']}
      helperText="Duplicate tags are not allowed"
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Tag input that allows duplicate tags
 */
export const AllowDuplicates: Story = {
  render: () => (
    <TagInput
      label="Tags (Duplicates Allowed)"
      placeholder="Add a tag..."
      allowDuplicates={true}
      helperText="You can add duplicate tags"
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Tag input that adds tag when input loses focus
 */
export const AddOnBlur: Story = {
  render: () => (
    <TagInput
      label="Tags"
      placeholder="Type and click away to add..."
      addOnBlur={true}
      helperText="Tags will be added when you click away"
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Tag input with custom delimiter keys
 */
export const CustomDelimiters: Story = {
  render: () => (
    <TagInput
      label="Email Addresses"
      placeholder="Add email (press Enter, Space, or comma)..."
      delimiters={['Enter', ',', ' ']}
      helperText="Press Enter, Space, or comma to add"
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Tag input in error state
 */
export const WithError: Story = {
  render: () => (
    <TagInput
      label="Tags"
      placeholder="Add a tag..."
      error={true}
      errorMessage="At least one tag is required"
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Required tag input field
 */
export const Required: Story = {
  render: () => (
    <TagInput
      label="Tags"
      placeholder="Add a tag..."
      required={true}
      helperText="This field is required"
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Disabled tag input with pre-filled tags
 */
export const Disabled: Story = {
  render: () => (
    <TagInput
      label="Tags"
      placeholder="Add a tag..."
      defaultValue={['React', 'TypeScript', 'CSS']}
      disabled={true}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Tag input with horizontal label placement
 */
export const HorizontalLabel: Story = {
  render: () => (
    <TagInput
      label="Tags"
      labelPlacement="left"
      defaultValue={['React', 'TypeScript']}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Tag input with custom render function for tags
 */
export const CustomRender: Story = {
  render: () => (
    <TagInput
      label="Custom Styled Tags"
      placeholder="Add a tag..."
      defaultValue={['Important', 'Urgent', 'Review']}
      renderTag={(tag: string, onRemove: () => void) => (
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
            style={
              {
                color: 'inherit',
                '--button-bg-hover': 'transparent',
                '--button-bg-active': 'transparent',
              } as React.CSSProperties
            }
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
      )}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Interactive playground for testing all tag input props
 */
export const Playground: Story = {
  args: {
    label: 'Tag Input',
    placeholder: 'Add a tag...',
    helperText: 'Press Enter or comma to add tags',
    allowDuplicates: false,
    showSuggestions: true,
    suggestions: ['React', 'Vue', 'Angular', 'Svelte', 'TypeScript'],
    onChange: action('onChange'),
    onBlur: action('onBlur'),
  },
};
