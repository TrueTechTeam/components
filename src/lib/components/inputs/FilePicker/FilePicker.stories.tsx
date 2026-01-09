import type { Meta, StoryObj } from '@storybook/react';
import { FilePicker } from './FilePicker';

const meta: Meta<typeof FilePicker> = {
  title: 'Forms/FilePicker',
  component: FilePicker,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ minWidth: '500px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    onChange: { action: 'changed' },
    onError: { action: 'error' },
  },
};

export default meta;
type Story = StoryObj<typeof FilePicker>;

const UploadIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export const Default: Story = {
  args: {
    label: 'Upload Files',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Upload Files',
    icon: <UploadIcon />,
  },
};

export const ImageOnly: Story = {
  args: {
    label: 'Upload Images',
    accept: 'image/*',
    buttonText: 'Choose Images',
    helperText: 'Only image files are accepted',
  },
};

export const PDFOnly: Story = {
  args: {
    label: 'Upload PDF',
    accept: '.pdf',
    buttonText: 'Choose PDF',
    helperText: 'Only PDF files are accepted',
  },
};

export const MultipleFiles: Story = {
  args: {
    label: 'Upload Multiple Files',
    multiple: true,
    buttonText: 'Choose Multiple Files',
    helperText: 'You can select multiple files',
  },
};

export const WithMaxFiles: Story = {
  args: {
    label: 'Upload Files (Max 3)',
    multiple: true,
    maxFiles: 3,
    helperText: 'Maximum 3 files allowed',
  },
};

export const WithMaxSize: Story = {
  args: {
    label: 'Upload Files (Max 2MB each)',
    multiple: true,
    maxSize: 2 * 1024 * 1024, // 2MB
    helperText: 'Maximum file size: 2MB',
  },
};

export const NoDragAndDrop: Story = {
  args: {
    label: 'Upload Files',
    dragAndDrop: false,
  },
};

export const NoPreview: Story = {
  args: {
    label: 'Upload Images',
    accept: 'image/*',
    multiple: true,
    showPreview: false,
  },
};

export const NoFileList: Story = {
  args: {
    label: 'Upload Files',
    multiple: true,
    showFileList: false,
  },
};

export const CustomText: Story = {
  args: {
    label: 'Upload Documents',
    buttonText: 'Select Documents',
    dropzoneText: 'or drop documents here',
    helperText: 'Supported formats: PDF, DOC, DOCX',
    accept: '.pdf,.doc,.docx',
  },
};

export const WithError: Story = {
  args: {
    label: 'Upload Files',
    error: true,
    errorMessage: 'File upload failed. Please try again.',
  },
};

export const Required: Story = {
  args: {
    label: 'Upload Files',
    required: true,
    helperText: 'This field is required',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Upload Files',
    disabled: true,
  },
};

export const CompleteExample: Story = {
  args: {
    label: 'Upload Profile Picture',
    accept: 'image/png,image/jpeg,image/jpg',
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5MB
    dragAndDrop: true,
    showPreview: true,
    showFileList: true,
    buttonText: 'Choose Image',
    dropzoneText: 'or drag and drop your image here',
    helperText: 'PNG, JPG up to 5MB',
    icon: <UploadIcon />,
  },
};

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
  },
};
