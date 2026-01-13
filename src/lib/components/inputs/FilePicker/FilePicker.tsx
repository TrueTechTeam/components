import React, { forwardRef, useState, useCallback, useRef, type DragEvent } from 'react';
import { IconButton } from '../../buttons/IconButton';
import styles from './FilePicker.module.scss';
import type {
  BaseComponentProps,
} from '../../../types/component.types';
import Button from '../../buttons/Button';

export interface FileError {
  file: File;
  error: 'size' | 'type' | 'count';
  message: string;
}

export interface FilePickerProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Accepted file types (e.g., "image/*", ".pdf", "image/png,image/jpeg")
   */
  accept?: string;

  /**
   * Allow multiple file selection
   */
  multiple?: boolean;

  /**
   * Maximum number of files (only applies when multiple is true)
   */
  maxFiles?: number;

  /**
   * Maximum file size in bytes
   */
  maxSize?: number;

  /**
   * Callback when files change
   */
  onChange?: (files: File[]) => void;

  /**
   * Callback when file validation error occurs
   */
  onError?: (errors: FileError[]) => void;

  /**
   * Callback when input loses focus
   */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /**
   * Input label text
   */
  label?: string;

  /**
   * Helper text displayed below the input
   */
  helperText?: string;

  /**
   * Error message (shows when error is true)
   */
  errorMessage?: string;

  /**
   * Whether the input is in an error state
   */
  error?: boolean;

  /**
   * Whether the field is required
   */
  required?: boolean;

  /**
   * Whether the input is disabled
   */
  disabled?: boolean;

  /**
   * Enable drag and drop
   */
  dragAndDrop?: boolean;

  /**
   * Show file preview for images
   */
  showPreview?: boolean;

  /**
   * Show list of selected files
   */
  showFileList?: boolean;

  /**
   * Custom button text
   */
  buttonText?: string;

  /**
   * Custom dropzone text
   */
  dropzoneText?: string;

  /**
   * Icon to display in button/dropzone
   */
  icon?: React.ReactNode;
}

/**
 * Format file size to human-readable string
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) {return '0 Bytes';}
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100  } ${  sizes[i]}`;
};

/**
 * Check if file is an image
 */
const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Create preview URL for file
 */
const createPreviewURL = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * FilePicker component with drag & drop and file preview
 *
 * @example
 * ```tsx
 * <FilePicker
 *   label="Upload Files"
 *   accept="image/*"
 *   multiple
 *   dragAndDrop
 *   showPreview
 *   onChange={(files) => console.log(files)}
 * />
 * ```
 */
export const FilePicker = forwardRef<HTMLInputElement, FilePickerProps>(
  (
    {
      accept,
      multiple = false,
      maxFiles,
      maxSize,
      onChange,
      onError,
      onBlur,
      label,
      helperText,
      errorMessage,
      error = false,
      required = false,
      disabled = false,
      dragAndDrop = true,
      showPreview = true,
      showFileList = true,
      buttonText = 'Choose Files',
      dropzoneText = 'or drag and drop files here',
      icon,
      className,
      'data-testid': dataTestId,
      'aria-label': ariaLabel,
      style,
      ...rest
    },
    ref
  ) => {
    // State
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [previewURLs, setPreviewURLs] = useState<Record<string, string>>({});
    const inputRef = useRef<HTMLInputElement>(null);

    // Validate files
    const validateFiles = useCallback(
      (files: File[]): { valid: File[]; errors: FileError[] } => {
        const valid: File[] = [];
        const errors: FileError[] = [];

        for (const file of files) {
          // Check file count
          if (maxFiles && valid.length + selectedFiles.length >= maxFiles) {
            errors.push({
              file,
              error: 'count',
              message: `Maximum ${maxFiles} file(s) allowed`,
            });
            continue;
          }

          // Check file size
          if (maxSize && file.size > maxSize) {
            errors.push({
              file,
              error: 'size',
              message: `File size exceeds ${formatFileSize(maxSize)}`,
            });
            continue;
          }

          // Check file type
          if (accept) {
            const acceptedTypes = accept.split(',').map((t) => t.trim());
            const isAccepted = acceptedTypes.some((type) => {
              if (type.startsWith('.')) {
                return file.name.toLowerCase().endsWith(type.toLowerCase());
              }
              if (type.endsWith('/*')) {
                const category = type.split('/')[0];
                return file.type.startsWith(`${category  }/`);
              }
              return file.type === type;
            });

            if (!isAccepted) {
              errors.push({
                file,
                error: 'type',
                message: `File type not accepted. Accepted types: ${accept}`,
              });
              continue;
            }
          }

          valid.push(file);
        }

        return { valid, errors };
      },
      [accept, maxFiles, maxSize, multiple, selectedFiles.length]
    );

    // Handle file selection
    const handleFiles = useCallback(
      (files: FileList | null) => {
        if (!files || files.length === 0) {return;}

        const fileArray = Array.from(files);
        const { valid, errors } = validateFiles(fileArray);

        // Create preview URLs for image files
        const newPreviewURLs: Record<string, string> = {};
        valid.forEach((file) => {
          if (showPreview && isImageFile(file)) {
            newPreviewURLs[file.name] = createPreviewURL(file);
          }
        });

        // Update state
        const newFiles = multiple ? [...selectedFiles, ...valid] : valid;
        setSelectedFiles(newFiles);
        setPreviewURLs((prev) => ({ ...prev, ...newPreviewURLs }));

        // Call callbacks
        onChange?.(newFiles);
        if (errors.length > 0) {
          onError?.(errors);
        }
      },
      [multiple, selectedFiles, showPreview, validateFiles, onChange, onError]
    );

    // Handle input change
    const handleInputChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(event.target.files);
      },
      [handleFiles]
    );

    // Handle drag events
    const handleDragEnter = useCallback(
      (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (!disabled && dragAndDrop) {
          setIsDragging(true);
        }
      },
      [disabled, dragAndDrop]
    );

    const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
    }, []);

    const handleDrop = useCallback(
      (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);

        if (!disabled && dragAndDrop) {
          handleFiles(event.dataTransfer.files);
        }
      },
      [disabled, dragAndDrop, handleFiles]
    );

    // Remove file
    const handleRemoveFile = useCallback(
      (index: number) => {
        const file = selectedFiles[index];

        // Revoke preview URL if exists
        if (previewURLs[file.name]) {
          URL.revokeObjectURL(previewURLs[file.name]);
        }

        // Update state
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        const newPreviewURLs = { ...previewURLs };
        delete newPreviewURLs[file.name];

        setSelectedFiles(newFiles);
        setPreviewURLs(newPreviewURLs);
        onChange?.(newFiles);
      },
      [selectedFiles, previewURLs, onChange]
    );

    // Trigger file input
    const triggerFileInput = useCallback(() => {
      if (!disabled) {
        inputRef.current?.click();
      }
    }, [disabled]);

    // Cleanup preview URLs on unmount
    React.useEffect(() => {
      return () => {
        Object.values(previewURLs).forEach((url) => {
          URL.revokeObjectURL(url);
        });
      };
    }, [previewURLs]);

    // Container classes
    const containerClasses = [styles.container, className].filter(Boolean).join(' ');

    // Display error message or helper text
    const displayHelperText = error && errorMessage ? errorMessage : helperText;

    return (
      <div className={containerClasses} style={style} data-testid={dataTestId}>
        {label && (
          <label className={styles.label} data-required={required || undefined}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}

        {/* Hidden file input */}
        <input
          {...rest}
          ref={(node) => {
            // Handle both internal and forwarded refs
            if (inputRef) {
              (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
            }
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
            }
          }}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          onBlur={onBlur}
          disabled={disabled}
          className={styles.hiddenInput}
          aria-label={ariaLabel || label || 'File picker'}
        />

        {/* Dropzone */}
        <div
          className={styles.dropzone}
          onClick={triggerFileInput}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-error={error || undefined}
          data-disabled={disabled || undefined}
          data-dragging={isDragging || undefined}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label="Upload files"
        >
          <div className={styles.dropzoneContent}>
            {icon && <div className={styles.icon}>{icon}</div>}
            <Button
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                triggerFileInput();
              }}
              disabled={disabled}
              startIcon="upload"
              type="button"
            >
              {buttonText}
            </Button>
            {dragAndDrop && <div className={styles.dropzoneText}>{dropzoneText}</div>}
          </div>
        </div>

        {/* File list */}
        {showFileList && selectedFiles.length > 0 && (
          <div className={styles.fileList}>
            {selectedFiles.map((file, index) => (
              <div key={`${file.name}-${index}`} className={styles.fileItem}>
                {showPreview && previewURLs[file.name] && (
                  <img src={previewURLs[file.name]} alt={file.name} className={styles.preview} />
                )}
                <div className={styles.fileInfo}>
                  <div className={styles.fileName}>{file.name}</div>
                  <div className={styles.fileSize}>{formatFileSize(file.size)}</div>
                </div>
                <IconButton
                  variant="ghost"
                  size="sm"
                  icon="close"
                  onClick={() => handleRemoveFile(index)}
                  disabled={disabled}
                  aria-label={`Remove ${file.name}`}
                  type="button"
                  className={styles.removeButton}
                />
              </div>
            ))}
          </div>
        )}

        {displayHelperText && (
          <div className={styles.helperText} data-error={error || undefined}>
            {displayHelperText}
          </div>
        )}
      </div>
    );
  }
);

FilePicker.displayName = 'FilePicker';

