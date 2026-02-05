import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CheckboxFilter } from './CheckboxFilter';
import { useFilter } from '../hooks/useFilter';
import type { FilterDefinition } from '../types';

// Mock the useFilter hook
jest.mock('../hooks/useFilter');

const mockUseFilter = useFilter as jest.MockedFunction<typeof useFilter>;

// Helper to create mock filter definition
const createMockFilter = (overrides?: Partial<FilterDefinition>): FilterDefinition => ({
  id: 'active',
  type: 'checkbox',
  label: 'Active',
  helperText: 'Filter by active status',
  ...overrides,
});

// Helper to create mock useFilter return value
const createMockUseFilterReturn = (overrides?: Partial<ReturnType<typeof useFilter>>) => ({
  filter: createMockFilter(),
  value: false,
  valueMeta: undefined,
  isActive: false,
  isVisible: true,
  isEnabled: true,
  isLoading: false,
  isTouched: false,
  error: null,
  options: { options: [], loading: false, error: null, hasMore: false, loadMore: jest.fn() },
  setValue: jest.fn(),
  clear: jest.fn(),
  touch: jest.fn(),
  validate: jest.fn(() => true),
  ...overrides,
});

describe('CheckboxFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('rendering', () => {
    it('renders with default props', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn());

      render(<CheckboxFilter filterId="active" />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('renders with all props', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn());

      render(
        <CheckboxFilter
          filterId="active"
          label="Custom Active"
          size="lg"
          className="custom-class"
          data-testid="test-filter"
          checkboxProps={{ 'data-custom': 'value' }}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(screen.getByText('Custom Active')).toBeInTheDocument();
    });

    it('renders wrapper div with className', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn());

      const { container } = render(<CheckboxFilter filterId="active" className="custom-class" />);

      const wrapper = container.querySelector('.custom-class');
      expect(wrapper).toBeInTheDocument();
    });

    it('renders checkbox with medium size by default', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn());

      const { container } = render(<CheckboxFilter filterId="active" />);

      const checkbox = container.querySelector('[data-size="md"]');
      expect(checkbox).toBeInTheDocument();
    });

    it('renders checkbox with custom size', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn());

      const { container } = render(<CheckboxFilter filterId="active" size="sm" />);

      const checkbox = container.querySelector('[data-size="sm"]');
      expect(checkbox).toBeInTheDocument();
    });

    it('renders checkbox with large size', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn());

      const { container } = render(<CheckboxFilter filterId="active" size="lg" />);

      const checkbox = container.querySelector('[data-size="lg"]');
      expect(checkbox).toBeInTheDocument();
    });
  });

  describe('filter not found', () => {
    it('returns null when filter is not found', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn({ filter: undefined }));

      const { container } = render(<CheckboxFilter filterId="missing" />);

      expect(container.firstChild).toBeNull();
    });

    it('logs warning when filter is not found', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      mockUseFilter.mockReturnValue(createMockUseFilterReturn({ filter: undefined }));

      render(<CheckboxFilter filterId="missing" />);

      expect(warnSpy).toHaveBeenCalledWith('CheckboxFilter: Filter "missing" not found');
    });

    it('does not render checkbox when filter not found', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn({ filter: undefined }));

      render(<CheckboxFilter filterId="missing" />);

      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });
  });

  describe('label', () => {
    it('uses filter definition label by default', () => {
      mockUseFilter.mockReturnValue(
        createMockUseFilterReturn({
          filter: createMockFilter({ label: 'Status Label' }),
        })
      );

      render(<CheckboxFilter filterId="active" />);

      expect(screen.getByText('Status Label')).toBeInTheDocument();
    });

    it('uses override label when provided', () => {
      mockUseFilter.mockReturnValue(
        createMockUseFilterReturn({
          filter: createMockFilter({ label: 'Original Label' }),
        })
      );

      render(<CheckboxFilter filterId="active" label="Custom Label" />);

      expect(screen.getByText('Custom Label')).toBeInTheDocument();
      expect(screen.queryByText('Original Label')).not.toBeInTheDocument();
    });

    it('handles empty string label override', () => {
      mockUseFilter.mockReturnValue(
        createMockUseFilterReturn({
          filter: createMockFilter({ label: 'Original Label' }),
        })
      );

      render(<CheckboxFilter filterId="active" label="" />);

      expect(screen.queryByText('Original Label')).not.toBeInTheDocument();
    });

    it('passes label to Checkbox component', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn());

      render(<CheckboxFilter filterId="active" label="My Label" />);

      expect(screen.getByText('My Label')).toBeInTheDocument();
    });
  });

  describe('helperText', () => {
    it('renders helper text from filter definition', () => {
      mockUseFilter.mockReturnValue(
        createMockUseFilterReturn({
          filter: createMockFilter({ helperText: 'This is helper text' }),
        })
      );

      render(<CheckboxFilter filterId="active" />);

      expect(screen.getByText('This is helper text')).toBeInTheDocument();
    });

    it('does not render helper text when not provided', () => {
      mockUseFilter.mockReturnValue(
        createMockUseFilterReturn({
          filter: createMockFilter({ helperText: undefined }),
        })
      );

      render(<CheckboxFilter filterId="active" />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });
  });

  describe('checked state', () => {
    it('renders unchecked when value is false', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn({ value: false }));

      render(<CheckboxFilter filterId="active" />);

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(false);
    });

    it('renders checked when value is true', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn({ value: true }));

      render(<CheckboxFilter filterId="active" />);

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    });

    it('renders unchecked when value is undefined', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn({ value: undefined }));

      render(<CheckboxFilter filterId="active" />);

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(false);
    });

    it('renders unchecked when value is null', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn({ value: null as any }));

      render(<CheckboxFilter filterId="active" />);

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(false);
    });
  });

  describe('onChange', () => {
    it('calls setValue when checkbox is clicked', () => {
      const setValue = jest.fn();
      mockUseFilter.mockReturnValue(createMockUseFilterReturn({ value: false, setValue }));

      render(<CheckboxFilter filterId="active" />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(setValue).toHaveBeenCalledTimes(1);
      expect(setValue).toHaveBeenCalledWith(true);
    });

    it('calls setValue with false when unchecking', () => {
      const setValue = jest.fn();
      mockUseFilter.mockReturnValue(createMockUseFilterReturn({ value: true, setValue }));

      render(<CheckboxFilter filterId="active" />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(setValue).toHaveBeenCalledWith(false);
    });

    it('calls setValue multiple times correctly', () => {
      const setValue = jest.fn();
      mockUseFilter.mockReturnValue(createMockUseFilterReturn({ value: false, setValue }));

      render(<CheckboxFilter filterId="active" />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      fireEvent.click(checkbox);
      fireEvent.click(checkbox);

      expect(setValue).toHaveBeenCalledTimes(3);
    });
  });

  describe('disabled state', () => {
    it('is not disabled when filter is enabled', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn({ isEnabled: true }));

      render(<CheckboxFilter filterId="active" />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeDisabled();
    });

    it('is disabled when filter is not enabled', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn({ isEnabled: false }));

      render(<CheckboxFilter filterId="active" />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
    });

    it('does not call setValue when disabled', () => {
      const setValue = jest.fn();
      mockUseFilter.mockReturnValue(createMockUseFilterReturn({ isEnabled: false, setValue }));

      render(<CheckboxFilter filterId="active" />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(setValue).not.toHaveBeenCalled();
    });
  });

  describe('error state', () => {
    it('has no error when error is null', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn({ error: null }));

      const { container } = render(<CheckboxFilter filterId="active" />);

      const checkbox = container.querySelector('[data-error="true"]');
      expect(checkbox).not.toBeInTheDocument();
    });

    it('has error when error is set', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn({ error: 'Error message' }));

      const { container } = render(<CheckboxFilter filterId="active" />);

      const checkbox = container.querySelector('[data-error="true"]');
      expect(checkbox).toBeInTheDocument();
    });

    it('displays error message', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn({ error: 'This field is required' }));

      render(<CheckboxFilter filterId="active" />);

      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('displays error message instead of helper text', () => {
      mockUseFilter.mockReturnValue(
        createMockUseFilterReturn({
          filter: createMockFilter({ helperText: 'Helper text' }),
          error: 'Error message',
        })
      );

      render(<CheckboxFilter filterId="active" />);

      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });

    it('converts error to boolean for error prop', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn({ error: 'Some error' }));

      const { container } = render(<CheckboxFilter filterId="active" />);

      const checkbox = container.querySelector('[data-error="true"]');
      expect(checkbox).toBeInTheDocument();
    });

    it('handles empty string error', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn({ error: '' }));

      const { container } = render(<CheckboxFilter filterId="active" />);

      const checkbox = container.querySelector('[data-error="true"]');
      expect(checkbox).not.toBeInTheDocument();
    });
  });

  describe('checkboxProps', () => {
    it('passes additional props to Checkbox component', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn());

      render(
        <CheckboxFilter
          filterId="active"
          checkboxProps={{
            'data-custom': 'custom-value',
            'aria-describedby': 'description',
          }}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('data-custom', 'custom-value');
      expect(checkbox).toHaveAttribute('aria-describedby', 'description');
    });

    it('merges checkboxProps with default props', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn({ value: true }));

      render(
        <CheckboxFilter filterId="active" checkboxProps={{ 'data-testid': 'custom-checkbox' }} />
      );

      const checkbox = screen.getByTestId('custom-checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toBeChecked();
    });

    it('handles empty checkboxProps', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn());

      render(<CheckboxFilter filterId="active" checkboxProps={{}} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('handles undefined checkboxProps', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn());

      render(<CheckboxFilter filterId="active" checkboxProps={undefined} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to wrapper element', () => {
      const ref = React.createRef<HTMLDivElement>();
      mockUseFilter.mockReturnValue(createMockUseFilterReturn());

      render(<CheckboxFilter ref={ref} filterId="active" />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards ref with className', () => {
      const ref = React.createRef<HTMLDivElement>();
      mockUseFilter.mockReturnValue(createMockUseFilterReturn());

      render(<CheckboxFilter ref={ref} filterId="active" className="test-class" />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveClass('test-class');
    });

    it('handles callback ref', () => {
      const refCallback = jest.fn();
      mockUseFilter.mockReturnValue(createMockUseFilterReturn());

      render(<CheckboxFilter ref={refCallback} filterId="active" />);

      expect(refCallback).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });
  });

  describe('custom styling', () => {
    it('accepts custom className', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn());

      const { container } = render(<CheckboxFilter filterId="active" className="custom-filter" />);

      const wrapper = container.querySelector('.custom-filter');
      expect(wrapper).toBeInTheDocument();
    });

    it('accepts custom style prop', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn());

      const { container } = render(
        <CheckboxFilter filterId="active" style={{ backgroundColor: 'red' }} />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveStyle({ backgroundColor: 'red' });
    });

    it('accepts id attribute', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn());

      const { container } = render(<CheckboxFilter filterId="active" id="custom-id" />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveAttribute('id', 'custom-id');
    });

    it('accepts data attributes', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn());

      render(<CheckboxFilter filterId="active" data-testid="test-filter" data-custom="value" />);

      const wrapper = screen.getByTestId('test-filter');
      expect(wrapper).toHaveAttribute('data-custom', 'value');
    });
  });

  describe('useFilter hook integration', () => {
    it('calls useFilter with correct filterId', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn());

      render(<CheckboxFilter filterId="active" />);

      expect(mockUseFilter).toHaveBeenCalledWith({ filterId: 'active' });
    });

    it('calls useFilter with different filterId', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn());

      render(<CheckboxFilter filterId="enabled" />);

      expect(mockUseFilter).toHaveBeenCalledWith({ filterId: 'enabled' });
    });

    it('uses filter value from hook', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn({ value: true }));

      render(<CheckboxFilter filterId="active" />);

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    });

    it('uses isEnabled from hook', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn({ isEnabled: false }));

      render(<CheckboxFilter filterId="active" />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
    });

    it('uses error from hook', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn({ error: 'Validation error' }));

      render(<CheckboxFilter filterId="active" />);

      expect(screen.getByText('Validation error')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles filter with empty label', () => {
      mockUseFilter.mockReturnValue(
        createMockUseFilterReturn({
          filter: createMockFilter({ label: '' }),
        })
      );

      render(<CheckboxFilter filterId="active" />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('handles special characters in filterId', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn());

      render(<CheckboxFilter filterId="filter-with-dashes_and_underscores" />);

      expect(mockUseFilter).toHaveBeenCalledWith({
        filterId: 'filter-with-dashes_and_underscores',
      });
    });

    it('handles empty string filterId', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn({ filter: undefined }));

      render(<CheckboxFilter filterId="" />);

      expect(mockUseFilter).toHaveBeenCalledWith({ filterId: '' });
    });

    it('handles rapid state changes', () => {
      const setValue = jest.fn();
      mockUseFilter.mockReturnValue(createMockUseFilterReturn({ value: false, setValue }));

      render(<CheckboxFilter filterId="active" />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      fireEvent.click(checkbox);
      fireEvent.click(checkbox);

      expect(setValue).toHaveBeenCalledTimes(3);
    });

    it('handles undefined className gracefully', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn());

      const { container } = render(<CheckboxFilter filterId="active" className={undefined} />);

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('combined props', () => {
    it('renders with all props together', () => {
      const setValue = jest.fn();
      mockUseFilter.mockReturnValue(
        createMockUseFilterReturn({
          filter: createMockFilter({ label: 'Active Filter', helperText: 'Filter helper' }),
          value: true,
          isEnabled: true,
          error: null,
          setValue,
        })
      );

      render(
        <CheckboxFilter
          filterId="active"
          label="Custom Label"
          size="lg"
          className="custom-class"
          checkboxProps={{ 'data-custom': 'value' }}
        />
      );

      expect(screen.getByText('Custom Label')).toBeInTheDocument();
      expect(screen.getByText('Filter helper')).toBeInTheDocument();
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
      expect(checkbox).toHaveAttribute('data-custom', 'value');
    });

    it('renders with error state and disabled together', () => {
      mockUseFilter.mockReturnValue(
        createMockUseFilterReturn({
          isEnabled: false,
          error: 'Error message',
        })
      );

      render(<CheckboxFilter filterId="active" />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('renders with custom label and error message', () => {
      mockUseFilter.mockReturnValue(
        createMockUseFilterReturn({
          filter: createMockFilter({ label: 'Original' }),
          error: 'Error text',
        })
      );

      render(<CheckboxFilter filterId="active" label="Override Label" />);

      expect(screen.getByText('Override Label')).toBeInTheDocument();
      expect(screen.getByText('Error text')).toBeInTheDocument();
      expect(screen.queryByText('Original')).not.toBeInTheDocument();
    });
  });

  describe('display name', () => {
    it('has correct display name', () => {
      expect(CheckboxFilter.displayName).toBe('CheckboxFilter');
    });
  });
});
