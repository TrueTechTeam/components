import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RatingFilter } from './RatingFilter';
import type { FilterDefinition, RatingFilterConfig } from '../types';

// Import after mocking
import { useFilter } from '../hooks/useFilter';

// Mock the useFilter hook
jest.mock('../hooks/useFilter', () => ({
  useFilter: jest.fn(),
}));

// Mock the Rating component
jest.mock('../../inputs/Rating', () => ({
  Rating: jest.fn(({ value, onChange, max = 5, disabled, icon, emptyIcon, size, ...props }) => (
    <div data-testid="rating-component" data-size={size}>
      {[...Array(max)].map((_, i) => (
        <button
          key={i}
          type="button"
          data-testid={`star-${i + 1}`}
          onClick={() => !disabled && onChange?.(i + 1)}
          disabled={disabled}
          data-filled={value >= i + 1 || undefined}
        >
          {value >= i + 1 ? icon || '★' : emptyIcon || '☆'}
        </button>
      ))}
    </div>
  )),
}));

// Mock useFilter implementation
const mockUseFilter = useFilter as jest.MockedFunction<typeof useFilter>;

// Helper to create mock filter definition
const createMockFilter = (
  id: string,
  config?: RatingFilterConfig,
  overrides?: Partial<FilterDefinition>
): FilterDefinition => ({
  id,
  type: 'rating',
  label: 'Rating',
  helperText: undefined,
  ...overrides,
  config,
});

// Helper to setup useFilter mock
const setupUseFilterMock = (
  filter: FilterDefinition | null,
  value = 0,
  isEnabled = true,
  error: string | null = null
) => {
  mockUseFilter.mockReturnValue({
    filter: filter || undefined,
    value,
    valueMeta: value ? { value, displayValue: `${value} stars` } : undefined,
    isActive: value > 0,
    isVisible: true,
    isEnabled,
    isLoading: false,
    isTouched: false,
    error,
    options: { options: [], loading: false, error: null, hasMore: false, loadMore: jest.fn() },
    setValue: jest.fn(),
    clear: jest.fn(),
    touch: jest.fn(),
    validate: jest.fn(() => true),
  });
};

describe('RatingFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Suppress console.warn for expected warnings
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // 1. Rendering tests
  describe('rendering', () => {
    it('renders with default props', () => {
      const filter = createMockFilter('rating');
      setupUseFilterMock(filter);

      render(<RatingFilter filterId="rating" />);

      expect(screen.getByTestId('rating-component')).toBeInTheDocument();
      expect(screen.getByText('Rating')).toBeInTheDocument();
    });

    it('renders with all props', () => {
      const filter = createMockFilter('rating');
      setupUseFilterMock(filter, 3);

      render(
        <RatingFilter
          filterId="rating"
          label="Custom Rating"
          showLabel
          size="lg"
          ratingProps={{ 'data-custom': 'value' }}
          className="custom-class"
          data-testid="rating-filter"
        />
      );

      expect(screen.getByText('Custom Rating')).toBeInTheDocument();
      const wrapper = screen.getByTestId('rating-filter');
      expect(wrapper).toHaveClass('custom-class');
    });

    it('renders without label when showLabel is false', () => {
      const filter = createMockFilter('rating');
      setupUseFilterMock(filter);

      render(<RatingFilter filterId="rating" showLabel={false} />);

      expect(screen.queryByText('Rating')).not.toBeInTheDocument();
      expect(screen.getByTestId('rating-component')).toBeInTheDocument();
    });

    it('renders with custom size', () => {
      const filter = createMockFilter('rating');
      setupUseFilterMock(filter);

      render(<RatingFilter filterId="rating" size="sm" />);

      const ratingComponent = screen.getByTestId('rating-component');
      expect(ratingComponent).toHaveAttribute('data-size', 'sm');
    });

    it('renders with default md size', () => {
      const filter = createMockFilter('rating');
      setupUseFilterMock(filter);

      render(<RatingFilter filterId="rating" />);

      const ratingComponent = screen.getByTestId('rating-component');
      expect(ratingComponent).toHaveAttribute('data-size', 'md');
    });

    it('applies custom className', () => {
      const filter = createMockFilter('rating');
      setupUseFilterMock(filter);

      const { container } = render(<RatingFilter filterId="rating" className="custom-class" />);

      const wrapper = container.querySelector('.custom-class');
      expect(wrapper).toBeInTheDocument();
    });
  });

  // 2. Label tests
  describe('label', () => {
    it('uses filter definition label by default', () => {
      const filter = createMockFilter('rating', undefined, { label: 'Product Rating' });
      setupUseFilterMock(filter);

      render(<RatingFilter filterId="rating" />);

      expect(screen.getByText('Product Rating')).toBeInTheDocument();
    });

    it('uses override label when provided', () => {
      const filter = createMockFilter('rating', undefined, { label: 'Product Rating' });
      setupUseFilterMock(filter);

      render(<RatingFilter filterId="rating" label="Custom Label" />);

      expect(screen.getByText('Custom Label')).toBeInTheDocument();
      expect(screen.queryByText('Product Rating')).not.toBeInTheDocument();
    });

    it('shows label when showLabel is true', () => {
      const filter = createMockFilter('rating');
      setupUseFilterMock(filter);

      render(<RatingFilter filterId="rating" showLabel />);

      expect(screen.getByText('Rating')).toBeInTheDocument();
    });

    it('hides label when showLabel is false', () => {
      const filter = createMockFilter('rating');
      setupUseFilterMock(filter);

      render(<RatingFilter filterId="rating" showLabel={false} />);

      expect(screen.queryByText('Rating')).not.toBeInTheDocument();
    });
  });

  // 3. Rating configuration tests
  describe('rating configuration', () => {
    it('uses default max of 5 when not configured', () => {
      const filter = createMockFilter('rating');
      setupUseFilterMock(filter);

      render(<RatingFilter filterId="rating" />);

      const stars = screen.getAllByTestId(/star-/);
      expect(stars).toHaveLength(5);
    });

    it('uses config max value', () => {
      const filter = createMockFilter('rating', { max: 10 });
      setupUseFilterMock(filter);

      render(<RatingFilter filterId="rating" />);

      const stars = screen.getAllByTestId(/star-/);
      expect(stars).toHaveLength(10);
    });

    it('uses config icon', () => {
      const filter = createMockFilter('rating', { icon: '♥', emptyIcon: '♡' });
      setupUseFilterMock(filter, 2);

      render(<RatingFilter filterId="rating" />);

      const filledStar = screen.getByTestId('star-1');
      const emptyStar = screen.getByTestId('star-3');

      expect(filledStar).toHaveTextContent('♥');
      expect(emptyStar).toHaveTextContent('♡');
    });

    it('uses config emptyIcon', () => {
      const filter = createMockFilter('rating', { emptyIcon: '○' });
      setupUseFilterMock(filter, 1);

      render(<RatingFilter filterId="rating" />);

      const emptyStar = screen.getByTestId('star-2');
      expect(emptyStar).toHaveTextContent('○');
    });

    it('passes custom max from config to Rating component', () => {
      const filter = createMockFilter('rating', { max: 7 });
      setupUseFilterMock(filter);

      render(<RatingFilter filterId="rating" />);

      const stars = screen.getAllByTestId(/star-/);
      expect(stars).toHaveLength(7);
    });
  });

  // 4. Value and interaction tests
  describe('value and interaction', () => {
    it('displays current value', () => {
      const filter = createMockFilter('rating');
      setupUseFilterMock(filter, 3);

      render(<RatingFilter filterId="rating" />);

      const star1 = screen.getByTestId('star-1');
      const star3 = screen.getByTestId('star-3');
      const star4 = screen.getByTestId('star-4');

      expect(star1).toHaveAttribute('data-filled');
      expect(star3).toHaveAttribute('data-filled');
      expect(star4).not.toHaveAttribute('data-filled');
    });

    it('calls setValue when star is clicked', () => {
      const filter = createMockFilter('rating');
      const setValue = jest.fn();
      mockUseFilter.mockReturnValue({
        filter,
        value: 0,
        valueMeta: undefined,
        isActive: false,
        isVisible: true,
        isEnabled: true,
        isLoading: false,
        isTouched: false,
        error: null,
        options: { options: [], loading: false, error: null, hasMore: false, loadMore: jest.fn() },
        setValue,
        clear: jest.fn(),
        touch: jest.fn(),
        validate: jest.fn(() => true),
      });

      render(<RatingFilter filterId="rating" />);

      const star3 = screen.getByTestId('star-3');
      fireEvent.click(star3);

      expect(setValue).toHaveBeenCalledWith(3);
      expect(setValue).toHaveBeenCalledTimes(1);
    });

    it('displays zero value (empty rating)', () => {
      const filter = createMockFilter('rating');
      setupUseFilterMock(filter, 0);

      render(<RatingFilter filterId="rating" />);

      const stars = screen.getAllByTestId(/star-/);
      stars.forEach((star) => {
        expect(star).not.toHaveAttribute('data-filled');
      });
    });

    it('handles undefined value as zero', () => {
      const filter = createMockFilter('rating');
      mockUseFilter.mockReturnValue({
        filter,
        value: undefined,
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
      });

      render(<RatingFilter filterId="rating" />);

      const stars = screen.getAllByTestId(/star-/);
      stars.forEach((star) => {
        expect(star).not.toHaveAttribute('data-filled');
      });
    });
  });

  // 5. AllowClear functionality tests
  describe('allowClear functionality', () => {
    it('clears value when clicking same star with allowClear enabled', () => {
      const filter = createMockFilter('rating', { allowClear: true });
      const setValue = jest.fn();
      mockUseFilter.mockReturnValue({
        filter,
        value: 3,
        valueMeta: { value: 3, displayValue: '3 stars' },
        isActive: true,
        isVisible: true,
        isEnabled: true,
        isLoading: false,
        isTouched: false,
        error: null,
        options: { options: [], loading: false, error: null, hasMore: false, loadMore: jest.fn() },
        setValue,
        clear: jest.fn(),
        touch: jest.fn(),
        validate: jest.fn(() => true),
      });

      render(<RatingFilter filterId="rating" />);

      const star3 = screen.getByTestId('star-3');
      fireEvent.click(star3);

      expect(setValue).toHaveBeenCalledWith(0);
      expect(setValue).toHaveBeenCalledTimes(1);
    });

    it('sets new value when clicking different star with allowClear enabled', () => {
      const filter = createMockFilter('rating', { allowClear: true });
      const setValue = jest.fn();
      mockUseFilter.mockReturnValue({
        filter,
        value: 3,
        valueMeta: { value: 3, displayValue: '3 stars' },
        isActive: true,
        isVisible: true,
        isEnabled: true,
        isLoading: false,
        isTouched: false,
        error: null,
        options: { options: [], loading: false, error: null, hasMore: false, loadMore: jest.fn() },
        setValue,
        clear: jest.fn(),
        touch: jest.fn(),
        validate: jest.fn(() => true),
      });

      render(<RatingFilter filterId="rating" />);

      const star5 = screen.getByTestId('star-5');
      fireEvent.click(star5);

      expect(setValue).toHaveBeenCalledWith(5);
      expect(setValue).toHaveBeenCalledTimes(1);
    });

    it('does not clear value when clicking same star without allowClear', () => {
      const filter = createMockFilter('rating', { allowClear: false });
      const setValue = jest.fn();
      mockUseFilter.mockReturnValue({
        filter,
        value: 3,
        valueMeta: { value: 3, displayValue: '3 stars' },
        isActive: true,
        isVisible: true,
        isEnabled: true,
        isLoading: false,
        isTouched: false,
        error: null,
        options: { options: [], loading: false, error: null, hasMore: false, loadMore: jest.fn() },
        setValue,
        clear: jest.fn(),
        touch: jest.fn(),
        validate: jest.fn(() => true),
      });

      render(<RatingFilter filterId="rating" />);

      const star3 = screen.getByTestId('star-3');
      fireEvent.click(star3);

      expect(setValue).toHaveBeenCalledWith(3);
      expect(setValue).toHaveBeenCalledTimes(1);
    });

    it('does not clear when allowClear is undefined (default behavior)', () => {
      const filter = createMockFilter('rating');
      const setValue = jest.fn();
      mockUseFilter.mockReturnValue({
        filter,
        value: 2,
        valueMeta: { value: 2, displayValue: '2 stars' },
        isActive: true,
        isVisible: true,
        isEnabled: true,
        isLoading: false,
        isTouched: false,
        error: null,
        options: { options: [], loading: false, error: null, hasMore: false, loadMore: jest.fn() },
        setValue,
        clear: jest.fn(),
        touch: jest.fn(),
        validate: jest.fn(() => true),
      });

      render(<RatingFilter filterId="rating" />);

      const star2 = screen.getByTestId('star-2');
      fireEvent.click(star2);

      expect(setValue).toHaveBeenCalledWith(2);
    });
  });

  // 6. Disabled state tests
  describe('disabled state', () => {
    it('disables rating when isEnabled is false', () => {
      const filter = createMockFilter('rating');
      setupUseFilterMock(filter, 0, false);

      render(<RatingFilter filterId="rating" />);

      const stars = screen.getAllByTestId(/star-/);
      stars.forEach((star) => {
        expect(star).toBeDisabled();
      });
    });

    it('enables rating when isEnabled is true', () => {
      const filter = createMockFilter('rating');
      setupUseFilterMock(filter, 0, true);

      render(<RatingFilter filterId="rating" />);

      const stars = screen.getAllByTestId(/star-/);
      stars.forEach((star) => {
        expect(star).not.toBeDisabled();
      });
    });

    it('does not call setValue when disabled', () => {
      const filter = createMockFilter('rating');
      const setValue = jest.fn();
      mockUseFilter.mockReturnValue({
        filter,
        value: 0,
        valueMeta: undefined,
        isActive: false,
        isVisible: true,
        isEnabled: false,
        isLoading: false,
        isTouched: false,
        error: null,
        options: { options: [], loading: false, error: null, hasMore: false, loadMore: jest.fn() },
        setValue,
        clear: jest.fn(),
        touch: jest.fn(),
        validate: jest.fn(() => true),
      });

      render(<RatingFilter filterId="rating" />);

      const star3 = screen.getByTestId('star-3');
      fireEvent.click(star3);

      expect(setValue).not.toHaveBeenCalled();
    });
  });

  // 7. Helper text tests
  describe('helper text', () => {
    it('displays helper text from filter definition', () => {
      const filter = createMockFilter('rating', undefined, {
        helperText: 'Rate from 1 to 5 stars',
      });
      setupUseFilterMock(filter);

      render(<RatingFilter filterId="rating" />);

      expect(screen.getByText('Rate from 1 to 5 stars')).toBeInTheDocument();
    });

    it('does not display helper text when not provided', () => {
      const filter = createMockFilter('rating');
      setupUseFilterMock(filter);

      const { container } = render(<RatingFilter filterId="rating" />);

      const helperText = container.querySelector('.helperText');
      expect(helperText).not.toBeInTheDocument();
    });
  });

  // 8. Error message tests
  describe('error message', () => {
    it('displays error message when present', () => {
      const filter = createMockFilter('rating');
      setupUseFilterMock(filter, 0, true, 'Rating is required');

      render(<RatingFilter filterId="rating" />);

      expect(screen.getByText('Rating is required')).toBeInTheDocument();
    });

    it('does not display error message when not present', () => {
      const filter = createMockFilter('rating');
      setupUseFilterMock(filter, 3, true, null);

      const { container } = render(<RatingFilter filterId="rating" />);

      const errorMessage = container.querySelector('.errorMessage');
      expect(errorMessage).not.toBeInTheDocument();
    });

    it('displays both helper text and error message', () => {
      const filter = createMockFilter('rating', undefined, {
        helperText: 'Helper text',
      });
      setupUseFilterMock(filter, 0, true, 'Error message');

      render(<RatingFilter filterId="rating" />);

      expect(screen.getByText('Helper text')).toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });
  });

  // 9. Filter not found tests
  describe('filter not found', () => {
    it('returns null when filter is not found', () => {
      setupUseFilterMock(null);

      const { container } = render(<RatingFilter filterId="nonexistent" />);

      expect(container.firstChild).toBeNull();
    });

    it('logs warning when filter is not found', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      setupUseFilterMock(null);

      render(<RatingFilter filterId="missing" />);

      expect(warnSpy).toHaveBeenCalledWith('RatingFilter: Filter "missing" not found');
    });
  });

  // 10. RatingProps tests
  describe('ratingProps', () => {
    it('passes additional props to Rating component', () => {
      const filter = createMockFilter('rating');
      setupUseFilterMock(filter);

      render(<RatingFilter filterId="rating" ratingProps={{ 'data-custom': 'test-value' }} />);

      expect(screen.getByTestId('rating-component')).toBeInTheDocument();
    });

    it('spreads ratingProps to Rating component', () => {
      const filter = createMockFilter('rating');
      setupUseFilterMock(filter);

      render(
        <RatingFilter
          filterId="rating"
          ratingProps={{
            'aria-describedby': 'description',
            'data-track': 'rating',
          }}
        />
      );

      expect(screen.getByTestId('rating-component')).toBeInTheDocument();
    });
  });

  // 11. Ref forwarding tests
  describe('ref forwarding', () => {
    it('forwards ref to wrapper element', () => {
      const ref = React.createRef<HTMLDivElement>();
      const filter = createMockFilter('rating');
      setupUseFilterMock(filter);

      render(<RatingFilter ref={ref} filterId="rating" />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('handles callback ref', () => {
      const refCallback = jest.fn();
      const filter = createMockFilter('rating');
      setupUseFilterMock(filter);

      render(<RatingFilter ref={refCallback} filterId="rating" />);

      expect(refCallback).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });
  });

  // 12. Props spreading tests
  describe('props spreading', () => {
    it('accepts and applies data attributes', () => {
      const filter = createMockFilter('rating');
      setupUseFilterMock(filter);

      render(<RatingFilter filterId="rating" data-testid="rating-filter" data-custom="value" />);

      const element = screen.getByTestId('rating-filter');
      expect(element).toHaveAttribute('data-custom', 'value');
    });

    it('accepts style prop', () => {
      const filter = createMockFilter('rating');
      setupUseFilterMock(filter);

      render(
        <RatingFilter
          filterId="rating"
          style={{ backgroundColor: 'red' }}
          data-testid="rating-filter"
        />
      );

      const element = screen.getByTestId('rating-filter');
      expect(element).toHaveStyle({ backgroundColor: 'red' });
    });
  });

  // 13. Combined props tests
  describe('combined props', () => {
    it('renders with all props combined', () => {
      const filter = createMockFilter(
        'rating',
        { max: 7, allowClear: true, icon: '♥', emptyIcon: '♡' },
        { label: 'Product Rating', helperText: 'Please rate the product' }
      );
      setupUseFilterMock(filter, 4);

      render(
        <RatingFilter
          filterId="rating"
          label="Custom Label"
          showLabel
          size="lg"
          className="custom-rating"
          data-testid="rating-filter"
        />
      );

      expect(screen.getByText('Custom Label')).toBeInTheDocument();
      expect(screen.getByText('Please rate the product')).toBeInTheDocument();
      const wrapper = screen.getByTestId('rating-filter');
      expect(wrapper).toHaveClass('custom-rating');
      const ratingComponent = screen.getByTestId('rating-component');
      expect(ratingComponent).toHaveAttribute('data-size', 'lg');
    });

    it('handles all size variants', () => {
      const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

      sizes.forEach((size) => {
        const filter = createMockFilter('rating');
        setupUseFilterMock(filter);

        const { container } = render(<RatingFilter filterId="rating" size={size} />);

        const ratingComponent = screen.getByTestId('rating-component');
        expect(ratingComponent).toHaveAttribute('data-size', size);
        container.remove();
      });
    });
  });

  // 14. Edge cases
  describe('edge cases', () => {
    it('handles filter with empty label', () => {
      const filter = createMockFilter('rating', undefined, { label: '' });
      setupUseFilterMock(filter);

      render(<RatingFilter filterId="rating" />);

      expect(screen.getByTestId('rating-component')).toBeInTheDocument();
    });

    it('handles config with max of 0', () => {
      const filter = createMockFilter('rating', { max: 0 });
      setupUseFilterMock(filter);

      render(<RatingFilter filterId="rating" />);

      const stars = screen.queryAllByTestId(/star-/);
      expect(stars).toHaveLength(0);
    });

    it('handles config with max of 1', () => {
      const filter = createMockFilter('rating', { max: 1 });
      setupUseFilterMock(filter);

      render(<RatingFilter filterId="rating" />);

      const stars = screen.getAllByTestId(/star-/);
      expect(stars).toHaveLength(1);
    });

    it('handles label override with empty string', () => {
      const filter = createMockFilter('rating', undefined, { label: 'Original' });
      setupUseFilterMock(filter);

      render(<RatingFilter filterId="rating" label="" showLabel />);

      expect(screen.queryByText('Original')).not.toBeInTheDocument();
    });

    it('handles className undefined gracefully', () => {
      const filter = createMockFilter('rating');
      setupUseFilterMock(filter);

      const { container } = render(<RatingFilter filterId="rating" className={undefined} />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles undefined config gracefully', () => {
      const filter: FilterDefinition = {
        id: 'rating',
        type: 'rating',
        label: 'Rating',
        config: undefined,
      };
      setupUseFilterMock(filter);

      render(<RatingFilter filterId="rating" />);

      expect(screen.getByTestId('rating-component')).toBeInTheDocument();
    });
  });

  // 15. UseFilter hook integration tests
  describe('useFilter hook integration', () => {
    it('calls useFilter with correct filterId', () => {
      const filter = createMockFilter('rating');
      setupUseFilterMock(filter);

      render(<RatingFilter filterId="rating" />);

      expect(mockUseFilter).toHaveBeenCalledWith({ filterId: 'rating' });
    });

    it('calls useFilter with different filterId', () => {
      const filter = createMockFilter('product-rating');
      setupUseFilterMock(filter);

      render(<RatingFilter filterId="product-rating" />);

      expect(mockUseFilter).toHaveBeenCalledWith({ filterId: 'product-rating' });
    });
  });
});
