import { render, screen, fireEvent } from '@testing-library/react';
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

// Mock File objects for testing
const createMockFile = (name: string, size: number, type: string): File => {
  const blob = new Blob(['a'.repeat(size)], { type });
  return new File([blob], name, { type });
};

describe('FilePicker', () => {
  it('should render', () => {
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

  it('should handle file selection', () => {
    const handleChange = jest.fn();
    render(<FilePicker onChange={handleChange} />);

    const file = createMockFile('test.txt', 1000, 'text/plain');
    const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

    // Mock FileList
    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    expect(handleChange).toHaveBeenCalledWith([file]);
  });

  it('should validate file size', () => {
    const handleChange = jest.fn();
    const handleError = jest.fn();
    const maxSize = 1000; // 1KB

    render(<FilePicker maxSize={maxSize} onChange={handleChange} onError={handleError} />);

    const file = createMockFile('large.txt', 2000, 'text/plain'); // 2KB
    const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    expect(handleChange).toHaveBeenCalledWith([]);
    expect(handleError).toHaveBeenCalled();
  });

  it('should validate file type', () => {
    const handleChange = jest.fn();
    const handleError = jest.fn();

    render(<FilePicker accept="image/*" onChange={handleChange} onError={handleError} />);

    const file = createMockFile('document.pdf', 1000, 'application/pdf');
    const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    expect(handleChange).toHaveBeenCalledWith([]);
    expect(handleError).toHaveBeenCalled();
  });

  it('should accept valid file types', () => {
    const handleChange = jest.fn();

    render(<FilePicker accept="image/*" onChange={handleChange} />);

    const file = createMockFile('image.png', 1000, 'image/png');
    const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    expect(handleChange).toHaveBeenCalledWith([file]);
  });

  it('should show selected files in file list', () => {
    render(<FilePicker showFileList />);

    const file = createMockFile('test.txt', 1000, 'text/plain');
    const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    expect(screen.getByText('test.txt')).toBeInTheDocument();
  });

  it('should remove file from list', () => {
    const handleChange = jest.fn();
    render(<FilePicker showFileList onChange={handleChange} />);

    const file = createMockFile('test.txt', 1000, 'text/plain');
    const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    const removeButton = screen.getByLabelText('Remove test.txt');
    fireEvent.click(removeButton);

    expect(handleChange).toHaveBeenLastCalledWith([]);
  });

  it('should handle drag and drop', () => {
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

  it('should show dragging state', () => {
    render(<FilePicker dragAndDrop />);

    const dropzone = screen.getByRole('button', { name: /upload files/i });

    fireEvent.dragEnter(dropzone);
    expect(dropzone).toHaveAttribute('data-dragging', 'true');

    fireEvent.dragLeave(dropzone);
    expect(dropzone).not.toHaveAttribute('data-dragging');
  });

  it('should show error state', () => {
    render(<FilePicker label="Upload Files" error errorMessage="Upload failed" />);

    expect(screen.getByText('Upload failed')).toBeInTheDocument();
  });

  it('should show required indicator', () => {
    render(<FilePicker label="Upload Files" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should be disabled', () => {
    render(<FilePicker disabled />);

    const input = screen.getByLabelText(/file picker/i);
    expect(input).toBeDisabled();
  });

  it('should allow multiple files when multiple is true', () => {
    const handleChange = jest.fn();
    render(<FilePicker multiple onChange={handleChange} />);

    const file1 = createMockFile('test1.txt', 1000, 'text/plain');
    const file2 = createMockFile('test2.txt', 1000, 'text/plain');
    const input = screen.getByLabelText(/file picker/i) as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file1, file2],
      writable: false,
    });

    fireEvent.change(input);

    expect(handleChange).toHaveBeenCalledWith([file1, file2]);
  });

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
      writable: false,
    });

    fireEvent.change(input);

    expect(handleChange).toHaveBeenCalledWith([file1, file2]);
    expect(handleError).toHaveBeenCalled();
  });
});
