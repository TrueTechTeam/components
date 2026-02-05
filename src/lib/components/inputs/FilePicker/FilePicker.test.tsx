import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { FilePicker } from './FilePicker';

// Mock URL.createObjectURL and revokeObjectURL for file preview tests
beforeAll(() => {
  Object.defineProperty(global.URL, 'createObjectURL', {
    writable: true,
    value: jest.fn(() => 'blob:mock-url'),
  });
  Object.defineProperty(global.URL, 'revokeObjectURL', {
    writable: true,
    value: jest.fn(),
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

// Mock File objects for testing
const createMockFile = (name: string, size: number, type: string): File => {
  // For large files, create a smaller blob but override the size property
  const content = size > 1000000 ? 'mock content' : 'a'.repeat(size);
  const blob = new Blob([content], { type });
  const file = new File([blob], name, { type });
  // Override the size property for large file tests
  Object.defineProperty(file, 'size', { value: size, configurable: true });
  return file;
};

describe('FilePicker', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      render(<FilePicker />);
      expect(screen.getByRole('button', { name: /upload files/i })).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<FilePicker label="Upload Files" />);
      expect(screen.getByText('Upload Files')).toBeInTheDocument();
    });

    it('should render custom button text', () => {
      render(<FilePicker buttonText="Select Files" />);
      expect(screen.getByText('Select Files')).toBeInTheDocument();
    });

    it('should render custom dropzone text', () => {
      render(<FilePicker dropzoneText="Drop files here" />);
      expect(screen.getByText('Drop files here')).toBeInTheDocument();
    });

    it('should render with required indicator', () => {
      render(<FilePicker label="Upload Files" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should render with helper text', () => {
      render(<FilePicker helperText="Upload your document" />);
      expect(screen.getByText('Upload your document')).toBeInTheDocument();
    });

    it('should render with data-testid', () => {
      render(<FilePicker data-testid="custom-file-picker" />);
      expect(screen.getByTestId('custom-file-picker')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = render(<FilePicker className="custom-class" />);
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('should render with custom style', () => {
      const { container } = render(<FilePicker style={{ backgroundColor: 'red' }} />);
      const element = container.querySelector('[style*="background-color"]');
      expect(element).toBeInTheDocument();
    });

    it('should render with custom icon', () => {
      render(<FilePicker icon={<span>📁</span>} />);
      expect(screen.getByText('📁')).toBeInTheDocument();
    });

    it('should not render dropzone text when dragAndDrop is false', () => {
      render(<FilePicker dragAndDrop={false} dropzoneText="Drop here" />);
      expect(screen.queryByText('Drop here')).not.toBeInTheDocument();
    });
  });

  describe('File Selection', () => {
    it('should handle single file selection', () => {
      const handleChange = jest.fn();
      render(<FilePicker onChange={handleChange} />);

      const file = createMockFile('test.txt', 1000, 'text/plain');
      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file],
        configurable: true,
      });

      fireEvent.change(input);

      expect(handleChange).toHaveBeenCalledWith([file]);
    });

    it('should handle multiple file selection when multiple is true', () => {
      const handleChange = jest.fn();
      render(<FilePicker multiple onChange={handleChange} />);

      const file1 = createMockFile('test1.txt', 1000, 'text/plain');
      const file2 = createMockFile('test2.txt', 1000, 'text/plain');
      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file1, file2],
        configurable: true,
      });

      fireEvent.change(input);

      expect(handleChange).toHaveBeenCalledWith([file1, file2]);
    });

    it('should replace files when multiple is false', () => {
      const handleChange = jest.fn();
      render(<FilePicker onChange={handleChange} />);

      const file1 = createMockFile('test1.txt', 1000, 'text/plain');
      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file1],
        configurable: true,
      });

      fireEvent.change(input);

      const file2 = createMockFile('test2.txt', 1000, 'text/plain');

      Object.defineProperty(input, 'files', {
        value: [file2],
        configurable: true,
      });

      fireEvent.change(input);

      expect(handleChange).toHaveBeenLastCalledWith([file2]);
    });

    it('should handle empty FileList', () => {
      const handleChange = jest.fn();
      render(<FilePicker onChange={handleChange} />);

      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [],
        configurable: true,
      });

      fireEvent.change(input);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should handle null FileList', () => {
      const handleChange = jest.fn();
      render(<FilePicker onChange={handleChange} />);

      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: null,
        configurable: true,
      });

      fireEvent.change(input);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should trigger file input on button click', () => {
      render(<FilePicker />);

      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;
      const clickSpy = jest.spyOn(input, 'click');

      const button = screen.getByText('Choose Files');
      fireEvent.click(button);

      expect(clickSpy).toHaveBeenCalled();
    });

    it('should trigger file input on dropzone click', () => {
      render(<FilePicker />);

      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;
      const clickSpy = jest.spyOn(input, 'click');

      const dropzone = screen.getByRole('button', { name: /upload files/i });
      fireEvent.click(dropzone);

      expect(clickSpy).toHaveBeenCalled();
    });
  });

  describe('File Validation', () => {
    describe('File Size Validation', () => {
      it('should reject files exceeding maxSize', () => {
        const handleChange = jest.fn();
        const handleError = jest.fn();
        const maxSize = 1000;

        render(<FilePicker maxSize={maxSize} onChange={handleChange} onError={handleError} />);

        const file = createMockFile('large.txt', 2000, 'text/plain');
        const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

        Object.defineProperty(input, 'files', {
          value: [file],
          configurable: true,
        });

        fireEvent.change(input);

        expect(handleChange).toHaveBeenCalledWith([]);
        expect(handleError).toHaveBeenCalledWith([
          expect.objectContaining({
            file,
            error: 'size',
            message: expect.stringContaining('File size exceeds'),
          }),
        ]);
      });

      it('should accept files within maxSize', () => {
        const handleChange = jest.fn();
        const maxSize = 2000;

        render(<FilePicker maxSize={maxSize} onChange={handleChange} />);

        const file = createMockFile('small.txt', 1000, 'text/plain');
        const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

        Object.defineProperty(input, 'files', {
          value: [file],
          configurable: true,
        });

        fireEvent.change(input);

        expect(handleChange).toHaveBeenCalledWith([file]);
      });
    });

    describe('File Type Validation', () => {
      it('should reject files with invalid type (wildcard)', () => {
        const handleChange = jest.fn();
        const handleError = jest.fn();

        render(<FilePicker accept="image/*" onChange={handleChange} onError={handleError} />);

        const file = createMockFile('document.pdf', 1000, 'application/pdf');
        const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

        Object.defineProperty(input, 'files', {
          value: [file],
          configurable: true,
        });

        fireEvent.change(input);

        expect(handleChange).toHaveBeenCalledWith([]);
        expect(handleError).toHaveBeenCalledWith([
          expect.objectContaining({
            file,
            error: 'type',
            message: expect.stringContaining('File type not accepted'),
          }),
        ]);
      });

      it('should accept files with valid type (wildcard)', () => {
        const handleChange = jest.fn();

        render(<FilePicker accept="image/*" onChange={handleChange} />);

        const file = createMockFile('image.png', 1000, 'image/png');
        const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

        Object.defineProperty(input, 'files', {
          value: [file],
          configurable: true,
        });

        fireEvent.change(input);

        expect(handleChange).toHaveBeenCalledWith([file]);
      });

      it('should accept files with valid type (specific MIME)', () => {
        const handleChange = jest.fn();

        render(<FilePicker accept="application/pdf" onChange={handleChange} />);

        const file = createMockFile('document.pdf', 1000, 'application/pdf');
        const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

        Object.defineProperty(input, 'files', {
          value: [file],
          configurable: true,
        });

        fireEvent.change(input);

        expect(handleChange).toHaveBeenCalledWith([file]);
      });

      it('should accept files with valid extension', () => {
        const handleChange = jest.fn();

        render(<FilePicker accept=".txt" onChange={handleChange} />);

        const file = createMockFile('document.txt', 1000, 'text/plain');
        const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

        Object.defineProperty(input, 'files', {
          value: [file],
          configurable: true,
        });

        fireEvent.change(input);

        expect(handleChange).toHaveBeenCalledWith([file]);
      });

      it('should reject files with invalid extension', () => {
        const handleChange = jest.fn();
        const handleError = jest.fn();

        render(<FilePicker accept=".pdf" onChange={handleChange} onError={handleError} />);

        const file = createMockFile('document.txt', 1000, 'text/plain');
        const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

        Object.defineProperty(input, 'files', {
          value: [file],
          configurable: true,
        });

        fireEvent.change(input);

        expect(handleChange).toHaveBeenCalledWith([]);
        expect(handleError).toHaveBeenCalled();
      });

      it('should handle multiple accept types', () => {
        const handleChange = jest.fn();

        render(<FilePicker accept="image/png,image/jpeg,.pdf" onChange={handleChange} />);

        const file1 = createMockFile('image.png', 1000, 'image/png');
        const file2 = createMockFile('photo.jpg', 1000, 'image/jpeg');
        const file3 = createMockFile('document.pdf', 1000, 'application/pdf');
        const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

        Object.defineProperty(input, 'files', {
          value: [file1],
          configurable: true,
        });
        fireEvent.change(input);
        expect(handleChange).toHaveBeenCalledWith([file1]);

        Object.defineProperty(input, 'files', {
          value: [file2],
          configurable: true,
        });
        fireEvent.change(input);

        Object.defineProperty(input, 'files', {
          value: [file3],
          configurable: true,
        });
        fireEvent.change(input);
      });

      it('should handle case-insensitive extension matching', () => {
        const handleChange = jest.fn();

        render(<FilePicker accept=".PDF" onChange={handleChange} />);

        const file = createMockFile('document.pdf', 1000, 'application/pdf');
        const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

        Object.defineProperty(input, 'files', {
          value: [file],
          configurable: true,
        });

        fireEvent.change(input);

        expect(handleChange).toHaveBeenCalledWith([file]);
      });
    });

    describe('File Count Validation', () => {
      it('should respect maxFiles limit', () => {
        const handleChange = jest.fn();
        const handleError = jest.fn();

        render(<FilePicker multiple maxFiles={2} onChange={handleChange} onError={handleError} />);

        const file1 = createMockFile('test1.txt', 1000, 'text/plain');
        const file2 = createMockFile('test2.txt', 1000, 'text/plain');
        const file3 = createMockFile('test3.txt', 1000, 'text/plain');
        const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

        Object.defineProperty(input, 'files', {
          value: [file1, file2, file3],
          configurable: true,
        });

        fireEvent.change(input);

        expect(handleChange).toHaveBeenCalledWith([file1, file2]);
        expect(handleError).toHaveBeenCalledWith([
          expect.objectContaining({
            file: file3,
            error: 'count',
            message: 'Maximum 2 file(s) allowed',
          }),
        ]);
      });

      it('should consider existing files when checking maxFiles', () => {
        const handleChange = jest.fn();
        const handleError = jest.fn();

        render(<FilePicker multiple maxFiles={2} onChange={handleChange} onError={handleError} />);

        const file1 = createMockFile('test1.txt', 1000, 'text/plain');
        const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

        Object.defineProperty(input, 'files', {
          value: [file1],
          configurable: true,
        });

        fireEvent.change(input);

        const file2 = createMockFile('test2.txt', 1000, 'text/plain');
        const file3 = createMockFile('test3.txt', 1000, 'text/plain');

        Object.defineProperty(input, 'files', {
          value: [file2, file3],
          configurable: true,
        });

        fireEvent.change(input);

        expect(handleError).toHaveBeenCalledWith([
          expect.objectContaining({
            error: 'count',
          }),
        ]);
      });
    });

    it('should handle multiple validation errors', () => {
      const handleChange = jest.fn();
      const handleError = jest.fn();

      render(
        <FilePicker
          multiple
          maxSize={1000}
          maxFiles={2}
          accept="image/*"
          onChange={handleChange}
          onError={handleError}
        />
      );

      const file1 = createMockFile('test1.txt', 2000, 'text/plain'); // Too large and wrong type
      const file2 = createMockFile('test2.pdf', 500, 'application/pdf'); // Wrong type
      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file1, file2],
        configurable: true,
      });

      fireEvent.change(input);

      expect(handleError).toHaveBeenCalledWith([
        expect.objectContaining({
          file: file1,
          error: 'size',
        }),
        expect.objectContaining({
          file: file2,
          error: 'type',
        }),
      ]);
    });
  });

  describe('File List Display', () => {
    it('should show selected files in file list when showFileList is true', () => {
      render(<FilePicker showFileList />);

      const file = createMockFile('test.txt', 1000, 'text/plain');
      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file],
        configurable: true,
      });

      fireEvent.change(input);

      expect(screen.getByText('test.txt')).toBeInTheDocument();
      expect(screen.getByText('1000 Bytes')).toBeInTheDocument();
    });

    it('should not show file list when showFileList is false', () => {
      render(<FilePicker showFileList={false} />);

      const file = createMockFile('test.txt', 1000, 'text/plain');
      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file],
        configurable: true,
      });

      fireEvent.change(input);

      expect(screen.queryByText('test.txt')).not.toBeInTheDocument();
    });

    it('should display file size in KB', () => {
      render(<FilePicker showFileList />);

      const file = createMockFile('test.txt', 2048, 'text/plain');
      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file],
        configurable: true,
      });

      fireEvent.change(input);

      expect(screen.getByText(/2 KB/)).toBeInTheDocument();
    });

    it('should display file size in MB', () => {
      render(<FilePicker showFileList />);

      const file = createMockFile('test.txt', 1048576, 'text/plain');
      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file],
        configurable: true,
      });

      fireEvent.change(input);

      expect(screen.getByText(/1 MB/)).toBeInTheDocument();
    });

    it('should display file size in GB', () => {
      render(<FilePicker showFileList />);

      const file = createMockFile('test.txt', 1073741824, 'text/plain');
      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file],
        configurable: true,
      });

      fireEvent.change(input);

      expect(screen.getByText(/1 GB/)).toBeInTheDocument();
    });

    it('should display 0 Bytes for empty file', () => {
      render(<FilePicker showFileList />);

      const file = createMockFile('test.txt', 0, 'text/plain');
      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file],
        configurable: true,
      });

      fireEvent.change(input);

      expect(screen.getByText('0 Bytes')).toBeInTheDocument();
    });

    it('should remove file from list when remove button is clicked', () => {
      const handleChange = jest.fn();
      render(<FilePicker showFileList onChange={handleChange} />);

      const file = createMockFile('test.txt', 1000, 'text/plain');
      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file],
        configurable: true,
      });

      fireEvent.change(input);

      const removeButton = screen.getByLabelText('Remove test.txt');
      fireEvent.click(removeButton);

      expect(handleChange).toHaveBeenLastCalledWith([]);
      expect(screen.queryByText('test.txt')).not.toBeInTheDocument();
    });

    it('should remove correct file when multiple files exist', () => {
      const handleChange = jest.fn();
      render(<FilePicker showFileList multiple onChange={handleChange} />);

      const file1 = createMockFile('test1.txt', 1000, 'text/plain');
      const file2 = createMockFile('test2.txt', 1000, 'text/plain');
      const file3 = createMockFile('test3.txt', 1000, 'text/plain');
      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file1, file2, file3],
        configurable: true,
      });

      fireEvent.change(input);

      const removeButton = screen.getByLabelText('Remove test2.txt');
      fireEvent.click(removeButton);

      expect(handleChange).toHaveBeenLastCalledWith([file1, file3]);
      expect(screen.queryByText('test2.txt')).not.toBeInTheDocument();
      expect(screen.getByText('test1.txt')).toBeInTheDocument();
      expect(screen.getByText('test3.txt')).toBeInTheDocument();
    });

    it('should revoke preview URL when removing file', () => {
      const revokeObjectURLSpy = jest.spyOn(URL, 'revokeObjectURL');
      render(<FilePicker showFileList showPreview />);

      const file = createMockFile('test.png', 1000, 'image/png');
      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file],
        configurable: true,
      });

      fireEvent.change(input);

      const removeButton = screen.getByLabelText('Remove test.png');
      fireEvent.click(removeButton);

      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
    });
  });

  describe('File Preview', () => {
    it('should create preview URL for image files when showPreview is true', () => {
      const createObjectURLSpy = jest.spyOn(URL, 'createObjectURL');
      render(<FilePicker showPreview showFileList />);

      const file = createMockFile('test.png', 1000, 'image/png');
      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file],
        configurable: true,
      });

      fireEvent.change(input);

      expect(createObjectURLSpy).toHaveBeenCalledWith(file);
      const img = screen.getByAltText('test.png') as HTMLImageElement;
      expect(img).toBeInTheDocument();
      expect(img.src).toContain('blob:mock-url');
    });

    it('should not create preview URL for non-image files', () => {
      const createObjectURLSpy = jest.spyOn(URL, 'createObjectURL');
      render(<FilePicker showPreview showFileList />);

      const file = createMockFile('test.txt', 1000, 'text/plain');
      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file],
        configurable: true,
      });

      fireEvent.change(input);

      expect(createObjectURLSpy).not.toHaveBeenCalled();
      expect(screen.queryByAltText('test.txt')).not.toBeInTheDocument();
    });

    it('should not create preview URL when showPreview is false', () => {
      const createObjectURLSpy = jest.spyOn(URL, 'createObjectURL');
      render(<FilePicker showPreview={false} showFileList />);

      const file = createMockFile('test.png', 1000, 'image/png');
      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file],
        configurable: true,
      });

      fireEvent.change(input);

      expect(createObjectURLSpy).not.toHaveBeenCalled();
      expect(screen.queryByAltText('test.png')).not.toBeInTheDocument();
    });

    it('should revoke preview URLs on unmount', () => {
      const revokeObjectURLSpy = jest.spyOn(URL, 'revokeObjectURL');
      const { unmount } = render(<FilePicker showPreview showFileList />);

      const file = createMockFile('test.png', 1000, 'image/png');
      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file],
        configurable: true,
      });

      fireEvent.change(input);

      unmount();

      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
    });
  });

  describe('Drag and Drop', () => {
    it('should handle file drop', () => {
      const handleChange = jest.fn();
      render(<FilePicker dragAndDrop onChange={handleChange} />);

      const dropzone = screen.getByRole('button', { name: /upload files/i });
      const file = createMockFile('test.txt', 1000, 'text/plain');

      const dataTransfer = {
        files: [file],
      };

      fireEvent.drop(dropzone, { dataTransfer });

      expect(handleChange).toHaveBeenCalledWith([file]);
    });

    it('should show dragging state on drag enter', () => {
      render(<FilePicker dragAndDrop />);

      const dropzone = screen.getByRole('button', { name: /upload files/i });

      fireEvent.dragEnter(dropzone);
      expect(dropzone).toHaveAttribute('data-dragging', 'true');
    });

    it('should clear dragging state on drag leave', () => {
      render(<FilePicker dragAndDrop />);

      const dropzone = screen.getByRole('button', { name: /upload files/i });

      fireEvent.dragEnter(dropzone);
      expect(dropzone).toHaveAttribute('data-dragging', 'true');

      fireEvent.dragLeave(dropzone);
      expect(dropzone).not.toHaveAttribute('data-dragging');
    });

    it('should clear dragging state on drop', () => {
      render(<FilePicker dragAndDrop />);

      const dropzone = screen.getByRole('button', { name: /upload files/i });
      const file = createMockFile('test.txt', 1000, 'text/plain');

      fireEvent.dragEnter(dropzone);
      expect(dropzone).toHaveAttribute('data-dragging', 'true');

      fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });
      expect(dropzone).not.toHaveAttribute('data-dragging');
    });

    it('should prevent default on drag over', () => {
      render(<FilePicker dragAndDrop />);

      const dropzone = screen.getByRole('button', { name: /upload files/i });
      const event = new Event('dragover', { bubbles: true, cancelable: true });
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

      fireEvent(dropzone, event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should not enable drag and drop when disabled', () => {
      const handleChange = jest.fn();
      render(<FilePicker dragAndDrop disabled onChange={handleChange} />);

      const dropzone = screen.getByRole('button', { name: /upload files/i });

      fireEvent.dragEnter(dropzone);
      expect(dropzone).not.toHaveAttribute('data-dragging');

      const file = createMockFile('test.txt', 1000, 'text/plain');
      fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should not enable drag and drop when dragAndDrop is false', () => {
      const handleChange = jest.fn();
      render(<FilePicker dragAndDrop={false} onChange={handleChange} />);

      const dropzone = screen.getByRole('button', { name: /upload files/i });

      fireEvent.dragEnter(dropzone);
      expect(dropzone).not.toHaveAttribute('data-dragging');
    });
  });

  describe('States', () => {
    it('should show error state', () => {
      const { container } = render(
        <FilePicker label="Upload Files" error errorMessage="Upload failed" />
      );

      expect(screen.getByText('Upload failed')).toBeInTheDocument();
      const dropzone = container.querySelector('[data-error="true"]');
      expect(dropzone).toBeInTheDocument();
    });

    it('should prioritize error message over helper text', () => {
      render(<FilePicker helperText="Helper text" error errorMessage="Error message" />);

      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });

    it('should show helper text when no error', () => {
      render(<FilePicker helperText="Helper text" />);

      expect(screen.getByText('Helper text')).toBeInTheDocument();
    });

    it('should be disabled', () => {
      const { container } = render(<FilePicker disabled />);

      const input = screen.getByLabelText(/file picker/i);
      expect(input).toBeDisabled();

      const dropzone = container.querySelector('[data-disabled="true"]');
      expect(dropzone).toBeInTheDocument();
    });

    it('should not trigger file input when disabled and clicked', () => {
      render(<FilePicker disabled />);

      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;
      const clickSpy = jest.spyOn(input, 'click');

      const dropzone = screen.getByRole('button', { name: /upload files/i });
      fireEvent.click(dropzone);

      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('should set tabIndex to -1 when disabled', () => {
      render(<FilePicker disabled />);

      const dropzone = screen.getByRole('button', { name: /upload files/i });
      expect(dropzone).toHaveAttribute('tabindex', '-1');
    });

    it('should set tabIndex to 0 when not disabled', () => {
      render(<FilePicker />);

      const dropzone = screen.getByRole('button', { name: /upload files/i });
      expect(dropzone).toHaveAttribute('tabindex', '0');
    });
  });

  describe('Callbacks', () => {
    it('should call onChange callback', () => {
      const handleChange = jest.fn();
      render(<FilePicker onChange={handleChange} />);

      const file = createMockFile('test.txt', 1000, 'text/plain');
      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file],
        configurable: true,
      });

      fireEvent.change(input);

      expect(handleChange).toHaveBeenCalledWith([file]);
    });

    it('should call onError callback on validation error', () => {
      const handleError = jest.fn();
      render(<FilePicker maxSize={500} onError={handleError} />);

      const file = createMockFile('test.txt', 1000, 'text/plain');
      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file],
        configurable: true,
      });

      fireEvent.change(input);

      expect(handleError).toHaveBeenCalledWith([
        expect.objectContaining({
          error: 'size',
        }),
      ]);
    });

    it('should call onBlur callback', () => {
      const handleBlur = jest.fn();
      render(<FilePicker onBlur={handleBlur} />);

      const input = screen.getByLabelText(/file picker/i);

      fireEvent.blur(input);

      expect(handleBlur).toHaveBeenCalled();
    });

    it('should not call onError when no errors', () => {
      const handleError = jest.fn();
      render(<FilePicker onError={handleError} />);

      const file = createMockFile('test.txt', 1000, 'text/plain');
      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file],
        configurable: true,
      });

      fireEvent.change(input);

      expect(handleError).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have correct aria-label on input', () => {
      render(<FilePicker label="Upload Files" />);

      const input = screen.getByLabelText('Upload Files');
      expect(input).toBeInTheDocument();
    });

    it('should use custom aria-label if provided', () => {
      render(<FilePicker aria-label="Custom Label" />);

      const input = screen.getByLabelText('Custom Label');
      expect(input).toBeInTheDocument();
    });

    it('should have default aria-label when no label provided', () => {
      render(<FilePicker />);

      const input = screen.getByLabelText('File picker');
      expect(input).toBeInTheDocument();
    });

    it('should have role="button" on dropzone', () => {
      render(<FilePicker />);

      const dropzone = screen.getByRole('button', { name: /upload files/i });
      expect(dropzone).toBeInTheDocument();
    });

    it('should have aria-label on remove buttons', () => {
      render(<FilePicker showFileList />);

      const file = createMockFile('test.txt', 1000, 'text/plain');
      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file],
        configurable: true,
      });

      fireEvent.change(input);

      const removeButton = screen.getByLabelText('Remove test.txt');
      expect(removeButton).toBeInTheDocument();
    });
  });

  describe('Refs', () => {
    it('should forward ref to input element', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<FilePicker ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.type).toBe('file');
    });

    it('should work with callback ref', () => {
      let inputElement: HTMLInputElement | null = null;
      const callbackRef = (el: HTMLInputElement | null) => {
        inputElement = el;
      };

      render(<FilePicker ref={callbackRef} />);

      expect(inputElement).toBeInstanceOf(HTMLInputElement);
      expect(inputElement?.type).toBe('file');
    });
  });

  describe('Input Attributes', () => {
    it('should pass accept attribute to input', () => {
      render(<FilePicker accept="image/*" />);

      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;
      expect(input).toHaveAttribute('accept', 'image/*');
    });

    it('should pass multiple attribute to input', () => {
      render(<FilePicker multiple />);

      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;
      expect(input).toHaveAttribute('multiple');
    });

    it('should not have multiple attribute when multiple is false', () => {
      render(<FilePicker multiple={false} />);

      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;
      expect(input).not.toHaveAttribute('multiple');
    });

    it('should pass disabled attribute to input', () => {
      render(<FilePicker disabled />);

      const input = screen.getByLabelText(/file picker/i);
      expect(input).toBeDisabled();
    });

    it('should have type="file"', () => {
      render(<FilePicker />);

      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;
      expect(input).toHaveAttribute('type', 'file');
    });
  });

  describe('Button Interaction', () => {
    it('should trigger file input when button is clicked', () => {
      render(<FilePicker />);

      const button = screen.getByText('Choose Files');
      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

      // Mock the click method on the input
      const clickSpy = jest.spyOn(input, 'click');

      fireEvent.click(button);

      // Verify that clicking the button triggers file selection
      expect(clickSpy).toHaveBeenCalled();

      clickSpy.mockRestore();
    });

    it('should not trigger file input when button is disabled', () => {
      render(<FilePicker disabled />);

      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;
      const clickSpy = jest.spyOn(input, 'click');

      const button = screen.getByText('Choose Files');
      // Button is disabled, so click should not work
      expect(button).toBeDisabled();

      expect(clickSpy).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle removing file that has no preview URL', () => {
      const handleChange = jest.fn();
      render(<FilePicker showFileList onChange={handleChange} />);

      const file = createMockFile('test.txt', 1000, 'text/plain');
      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file],
        configurable: true,
      });

      fireEvent.change(input);

      const removeButton = screen.getByLabelText('Remove test.txt');
      fireEvent.click(removeButton);

      expect(handleChange).toHaveBeenLastCalledWith([]);
    });

    it('should accumulate files when multiple is true', () => {
      const handleChange = jest.fn();
      render(<FilePicker multiple onChange={handleChange} />);

      const file1 = createMockFile('test1.txt', 1000, 'text/plain');
      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file1],
        configurable: true,
      });

      fireEvent.change(input);
      expect(handleChange).toHaveBeenCalledWith([file1]);

      const file2 = createMockFile('test2.txt', 1000, 'text/plain');

      Object.defineProperty(input, 'files', {
        value: [file2],
        configurable: true,
      });

      fireEvent.change(input);
      expect(handleChange).toHaveBeenLastCalledWith([file1, file2]);
    });

    it('should handle validation with valid and invalid files mixed', () => {
      const handleChange = jest.fn();
      const handleError = jest.fn();

      render(<FilePicker multiple maxSize={1500} onChange={handleChange} onError={handleError} />);

      const file1 = createMockFile('small.txt', 1000, 'text/plain');
      const file2 = createMockFile('large.txt', 2000, 'text/plain');
      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file1, file2],
        configurable: true,
      });

      fireEvent.change(input);

      expect(handleChange).toHaveBeenCalledWith([file1]);
      expect(handleError).toHaveBeenCalledWith([
        expect.objectContaining({
          file: file2,
          error: 'size',
        }),
      ]);
    });

    it('should generate unique keys for files with same name', () => {
      const { container } = render(<FilePicker multiple showFileList />);

      const file1 = createMockFile('test.txt', 1000, 'text/plain');
      const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file1],
        configurable: true,
      });

      fireEvent.change(input);

      const file2 = createMockFile('test.txt', 2000, 'text/plain');

      Object.defineProperty(input, 'files', {
        value: [file2],
        configurable: true,
      });

      fireEvent.change(input);

      const fileItems = container.querySelectorAll('[class*="fileItem"]');
      expect(fileItems.length).toBe(2);
    });
  });
});
