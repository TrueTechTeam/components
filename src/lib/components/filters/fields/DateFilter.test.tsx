import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DateFilter } from './DateFilter';
import { useFilter } from '../hooks/useFilter';
import type { FilterDefinition } from '../types';

jest.mock('../hooks/useFilter');
const mockUseFilter = useFilter as jest.MockedFunction<typeof useFilter>;

const createMockFilter = (
  overrides?: Partial<FilterDefinition>
): FilterDefinition<Date | null> => ({
  id: 'date',
  type: 'date',
  label: 'Date',
  placeholder: 'Select date',
  ...overrides,
});

const createMockUseFilterReturn = (overrides?: Partial<ReturnType<typeof useFilter>>) => ({
  filter: createMockFilter(),
  value: undefined as Date | null | undefined,
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

describe('DateFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('rendering', () => {
    it('renders with label', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn());
      render(<DateFilter filterId="date" />);
      expect(screen.getByText('Date')).toBeInTheDocument();
    });

    it('renders with custom label', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn());
      render(<DateFilter filterId="date" label="Custom Date" />);
      expect(screen.getByText('Custom Date')).toBeInTheDocument();
    });

    it('returns null when filter not found', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn({ filter: undefined as any }));
      const { container } = render(<DateFilter filterId="nonexistent" />);
      expect(container.firstChild).toBeNull();
    });

    it('applies custom className', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn());
      const { container } = render(<DateFilter filterId="date" className="custom-class" />);
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('disables input when filter is not enabled', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn({ isEnabled: false }));
      render(<DateFilter filterId="date" />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('enables input when filter is enabled', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn({ isEnabled: true }));
      render(<DateFilter filterId="date" />);
      expect(screen.getByRole('textbox')).not.toBeDisabled();
    });
  });

  describe('error state', () => {
    it('shows error message when filter has error', () => {
      mockUseFilter.mockReturnValue(createMockUseFilterReturn({ error: 'Invalid date' }));
      render(<DateFilter filterId="date" />);
      expect(screen.getByText('Invalid date')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('calls setValue when date changes', () => {
      const setValue = jest.fn();
      mockUseFilter.mockReturnValue(createMockUseFilterReturn({ setValue }));
      render(<DateFilter filterId="date" />);
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '2024-06-15' } });
      expect(setValue).toHaveBeenCalled();
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      mockUseFilter.mockReturnValue(createMockUseFilterReturn());
      render(<DateFilter ref={ref} filterId="date" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
