import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { FilePicker } from './FilePicker';

const UploadIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const meta: Meta<typeof FilePicker> = {
  title: 'Inputs/FilePicker',
  component: FilePicker,
  tags: ['autodocs'],
  argTypes: {
    // Simple controls
    label: {
      control: 'text',
      description: 'Input label text',
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
    accept: {
      control: 'text',
      description: 'Accepted file types (e.g., "image/*", ".pdf", "image/png,image/jpeg")',
    },
    multiple: {
      control: 'boolean',
      description: 'Allow multiple file selection',
    },
    maxFiles: {
      control: 'number',
      description: 'Maximum number of files (only applies when multiple is true)',
    },
    maxSize: {
      control: 'number',
      description: 'Maximum file size in bytes',
    },
    dragAndDrop: {
      control: 'boolean',
      description: 'Enable drag and drop',
    },
    showPreview: {
      control: 'boolean',
      description: 'Show file preview for images',
    },
    showFileList: {
      control: 'boolean',
      description: 'Show list of selected files',
    },
    buttonText: {
      control: 'text',
      description: 'Custom button text',
    },
    dropzoneText: {
      control: 'text',
      description: 'Custom dropzone text',
    },
    // Disable complex props
    onChange: { table: { disable: true } },
    onError: { table: { disable: true } },
    onBlur: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    icon: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
    'aria-label': { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof FilePicker>;

/**
 * Default file picker with basic configuration
 */
export const Default: Story = {
  args: {
    label: 'Upload Files',
    onChange: action('onChange'),
    onError: action('onError'),
    onBlur: action('onBlur'),
  },
};

/**
 * File picker with a custom icon
 */
export const WithIcon: Story = {
  render: () => (
    <FilePicker
      label="Upload Files"
      icon={<UploadIcon />}
      onChange={action('onChange')}
      onError={action('onError')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * File picker restricted to image files only
 */
export const ImageOnly: Story = {
  render: () => (
    <FilePicker
      label="Upload Images"
      accept="image/*"
      buttonText="Choose Images"
      helperText="Only image files are accepted"
      onChange={action('onChange')}
      onError={action('onError')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * File picker restricted to PDF files only
 */
export const PDFOnly: Story = {
  render: () => (
    <FilePicker
      label="Upload PDF"
      accept=".pdf"
      buttonText="Choose PDF"
      helperText="Only PDF files are accepted"
      onChange={action('onChange')}
      onError={action('onError')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * File picker with multiple file selection enabled
 */
export const MultipleFiles: Story = {
  render: () => (
    <FilePicker
      label="Upload Multiple Files"
      multiple
      buttonText="Choose Multiple Files"
      helperText="You can select multiple files"
      onChange={action('onChange')}
      onError={action('onError')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * File picker with maximum file count limit
 */
export const WithMaxFiles: Story = {
  render: () => (
    <FilePicker
      label="Upload Files (Max 3)"
      multiple
      maxFiles={3}
      helperText="Maximum 3 files allowed"
      onChange={action('onChange')}
      onError={action('onError')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * File picker with maximum file size limit
 */
export const WithMaxSize: Story = {
  render: () => (
    <FilePicker
      label="Upload Files (Max 2MB each)"
      multiple
      maxSize={2 * 1024 * 1024}
      helperText="Maximum file size: 2MB"
      onChange={action('onChange')}
      onError={action('onError')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * File picker without drag and drop functionality
 */
export const NoDragAndDrop: Story = {
  render: () => (
    <FilePicker
      label="Upload Files"
      dragAndDrop={false}
      onChange={action('onChange')}
      onError={action('onError')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * File picker without image preview
 */
export const NoPreview: Story = {
  render: () => (
    <FilePicker
      label="Upload Images"
      accept="image/*"
      multiple
      showPreview={false}
      onChange={action('onChange')}
      onError={action('onError')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * File picker without file list display
 */
export const NoFileList: Story = {
  render: () => (
    <FilePicker
      label="Upload Files"
      multiple
      showFileList={false}
      onChange={action('onChange')}
      onError={action('onError')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * File picker with custom button and dropzone text
 */
export const CustomText: Story = {
  render: () => (
    <FilePicker
      label="Upload Documents"
      buttonText="Select Documents"
      dropzoneText="or drop documents here"
      helperText="Supported formats: PDF, DOC, DOCX"
      accept=".pdf,.doc,.docx"
      onChange={action('onChange')}
      onError={action('onError')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * File picker in error state
 */
export const WithError: Story = {
  render: () => (
    <FilePicker
      label="Upload Files"
      error
      errorMessage="File upload failed. Please try again."
      onChange={action('onChange')}
      onError={action('onError')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Required file picker
 */
export const Required: Story = {
  render: () => (
    <FilePicker
      label="Upload Files"
      required
      helperText="This field is required"
      onChange={action('onChange')}
      onError={action('onError')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Disabled file picker
 */
export const Disabled: Story = {
  render: () => (
    <FilePicker
      label="Upload Files"
      disabled
      onChange={action('onChange')}
      onError={action('onError')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Complete example with all features enabled
 */
export const CompleteExample: Story = {
  render: () => (
    <FilePicker
      label="Upload Profile Picture"
      accept="image/png,image/jpeg,image/jpg"
      multiple={false}
      maxSize={5 * 1024 * 1024}
      dragAndDrop
      showPreview
      showFileList
      buttonText="Choose Image"
      dropzoneText="or drag and drop your image here"
      helperText="PNG, JPG up to 5MB"
      icon={<UploadIcon />}
      onChange={action('onChange')}
      onError={action('onError')}
    />
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * Playground for testing all props interactively
 */
export const Playground: Story = {
  args: {
    label: 'File Picker',
    multiple: true,
    dragAndDrop: true,
    showPreview: true,
    showFileList: true,
    buttonText: 'Choose Files',
    dropzoneText: 'or drag and drop files here',
    helperText: 'Upload your files',
    onChange: action('onChange'),
    onError: action('onError'),
    onBlur: action('onBlur'),
  },
};
