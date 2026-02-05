import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Rating } from './Rating';

describe('Rating', () => {
  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      render(<Rating />);
      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });

    it('should render correct number of stars', () => {
      render(<Rating max={5} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(5);
    });

    it('should render custom max number of stars', () => {
      render(<Rating max={10} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(10);
    });

    it('should render with label', () => {
      render(<Rating label="Rate this item" />);
      expect(screen.getByText('Rate this item')).toBeInTheDocument();
    });

    it('should render with helper text', () => {
      render(<Rating label="Rating" helperText="Please rate from 1 to 5" />);
      expect(screen.getByText('Please rate from 1 to 5')).toBeInTheDocument();
    });

    it('should render required indicator when required', () => {
      const { container } = render(<Rating label="Rating" required />);
      const requiredIndicator = container.querySelector('.required');
      expect(requiredIndicator).toBeInTheDocument();
      expect(requiredIndicator).toHaveTextContent('*');
    });

    it('should render with custom testId', () => {
      render(<Rating data-testid="custom-rating" />);
      expect(screen.getByTestId('custom-rating-container')).toBeInTheDocument();
    });
  });

  describe('Controlled Component', () => {
    it('should respect value prop', () => {
      render(<Rating value={3} onChange={() => {}} />);
      const buttons = screen.getAllByRole('button');

      // First 3 buttons should have data-filled attribute
      expect(buttons[0]).toHaveAttribute('data-filled');
      expect(buttons[1]).toHaveAttribute('data-filled');
      expect(buttons[2]).toHaveAttribute('data-filled');
      expect(buttons[3]).not.toHaveAttribute('data-filled');
      expect(buttons[4]).not.toHaveAttribute('data-filled');
    });

    it('should call onChange with correct value when clicked', () => {
      const handleChange = jest.fn();
      render(<Rating onChange={handleChange} />);
      const buttons = screen.getAllByRole('button');

      fireEvent.click(buttons[2]);
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(3);
    });

    it('should call onChange with value 1 when first star clicked', () => {
      const handleChange = jest.fn();
      render(<Rating onChange={handleChange} />);
      const buttons = screen.getAllByRole('button');

      fireEvent.click(buttons[0]);
      expect(handleChange).toHaveBeenCalledWith(1);
    });

    it('should call onChange with max value when last star clicked', () => {
      const handleChange = jest.fn();
      render(<Rating max={7} onChange={handleChange} />);
      const buttons = screen.getAllByRole('button');

      fireEvent.click(buttons[6]);
      expect(handleChange).toHaveBeenCalledWith(7);
    });

    it('should update controlled value when prop changes', () => {
      const { rerender } = render(<Rating value={2} onChange={() => {}} />);
      let buttons = screen.getAllByRole('button');

      expect(buttons[0]).toHaveAttribute('data-filled');
      expect(buttons[1]).toHaveAttribute('data-filled');
      expect(buttons[2]).not.toHaveAttribute('data-filled');

      rerender(<Rating value={4} onChange={() => {}} />);
      buttons = screen.getAllByRole('button');

      expect(buttons[0]).toHaveAttribute('data-filled');
      expect(buttons[1]).toHaveAttribute('data-filled');
      expect(buttons[2]).toHaveAttribute('data-filled');
      expect(buttons[3]).toHaveAttribute('data-filled');
      expect(buttons[4]).not.toHaveAttribute('data-filled');
    });
  });

  describe('Uncontrolled Component', () => {
    it('should use defaultValue', () => {
      render(<Rating defaultValue={3} />);
      const buttons = screen.getAllByRole('button');

      expect(buttons[0]).toHaveAttribute('data-filled');
      expect(buttons[1]).toHaveAttribute('data-filled');
      expect(buttons[2]).toHaveAttribute('data-filled');
      expect(buttons[3]).not.toHaveAttribute('data-filled');
    });

    it('should update internal state when uncontrolled and clicked', () => {
      render(<Rating defaultValue={1} />);
      const buttons = screen.getAllByRole('button');

      expect(buttons[0]).toHaveAttribute('data-filled');
      expect(buttons[1]).not.toHaveAttribute('data-filled');

      fireEvent.click(buttons[3]);

      expect(buttons[0]).toHaveAttribute('data-filled');
      expect(buttons[1]).toHaveAttribute('data-filled');
      expect(buttons[2]).toHaveAttribute('data-filled');
      expect(buttons[3]).toHaveAttribute('data-filled');
      expect(buttons[4]).not.toHaveAttribute('data-filled');
    });

    it('should start with zero rating when no defaultValue provided', () => {
      render(<Rating />);
      const buttons = screen.getAllByRole('button');

      buttons.forEach((button) => {
        expect(button).not.toHaveAttribute('data-filled');
      });
    });
  });

  describe('States', () => {
    it('should not change when readOnly', () => {
      const handleChange = jest.fn();
      render(<Rating readOnly onChange={handleChange} />);
      const buttons = screen.getAllByRole('button');

      fireEvent.click(buttons[0]);
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should not change when disabled', () => {
      const handleChange = jest.fn();
      render(<Rating disabled onChange={handleChange} />);
      const buttons = screen.getAllByRole('button');

      fireEvent.click(buttons[2]);
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should have disabled buttons when disabled', () => {
      render(<Rating disabled />);
      const buttons = screen.getAllByRole('button');

      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });

    it('should apply data-disabled attribute when disabled', () => {
      const { container } = render(<Rating disabled />);
      const rating = container.querySelector('[data-disabled]');
      expect(rating).toBeInTheDocument();
    });

    it('should apply data-readonly attribute when readOnly', () => {
      const { container } = render(<Rating readOnly />);
      const rating = container.querySelector('[data-readonly]');
      expect(rating).toBeInTheDocument();
    });

    it('should not have disabled buttons when readOnly', () => {
      render(<Rating readOnly />);
      const buttons = screen.getAllByRole('button');

      buttons.forEach((button) => {
        expect(button).not.toBeDisabled();
      });
    });
  });

  describe('Hover Interaction', () => {
    it('should show hover state when mouse enters a star', () => {
      render(<Rating defaultValue={1} />);
      const buttons = screen.getAllByRole('button');

      // Only first star should be filled initially
      expect(buttons[0]).toHaveAttribute('data-filled');
      expect(buttons[1]).not.toHaveAttribute('data-filled');
      expect(buttons[2]).not.toHaveAttribute('data-filled');

      // Hover over third star
      fireEvent.mouseEnter(buttons[2]);

      // First three stars should now be filled due to hover
      expect(buttons[0]).toHaveAttribute('data-filled');
      expect(buttons[1]).toHaveAttribute('data-filled');
      expect(buttons[2]).toHaveAttribute('data-filled');
      expect(buttons[3]).not.toHaveAttribute('data-filled');
    });

    it('should clear hover state when mouse leaves', () => {
      render(<Rating defaultValue={2} />);
      const buttons = screen.getAllByRole('button');

      // Hover over fourth star
      fireEvent.mouseEnter(buttons[3]);
      expect(buttons[3]).toHaveAttribute('data-filled');

      // Leave the star
      fireEvent.mouseLeave(buttons[3]);

      // Should return to default value of 2
      expect(buttons[0]).toHaveAttribute('data-filled');
      expect(buttons[1]).toHaveAttribute('data-filled');
      expect(buttons[2]).not.toHaveAttribute('data-filled');
      expect(buttons[3]).not.toHaveAttribute('data-filled');
    });

    it('should not show hover state when disabled', () => {
      render(<Rating disabled defaultValue={1} />);
      const buttons = screen.getAllByRole('button');

      // Hover over third star
      fireEvent.mouseEnter(buttons[2]);

      // Should still only show first star filled (no hover effect)
      expect(buttons[0]).toHaveAttribute('data-filled');
      expect(buttons[1]).not.toHaveAttribute('data-filled');
      expect(buttons[2]).not.toHaveAttribute('data-filled');
    });

    it('should not show hover state when readOnly', () => {
      render(<Rating readOnly defaultValue={1} />);
      const buttons = screen.getAllByRole('button');

      // Hover over third star
      fireEvent.mouseEnter(buttons[2]);

      // Should still only show first star filled (no hover effect)
      expect(buttons[0]).toHaveAttribute('data-filled');
      expect(buttons[1]).not.toHaveAttribute('data-filled');
      expect(buttons[2]).not.toHaveAttribute('data-filled');
    });
  });

  describe('Custom Icons', () => {
    it('should render custom icon characters', () => {
      render(<Rating icon="♥" emptyIcon="♡" defaultValue={2} />);
      const buttons = screen.getAllByRole('button');

      // First two should have filled heart, rest should have empty heart
      expect(buttons[0].textContent).toContain('♥');
      expect(buttons[1].textContent).toContain('♥');
      expect(buttons[2].textContent).toContain('♡');
      expect(buttons[3].textContent).toContain('♡');
      expect(buttons[4].textContent).toContain('♡');
    });

    it('should use default star icons when not specified', () => {
      render(<Rating defaultValue={1} />);
      const buttons = screen.getAllByRole('button');

      // Default filled icon is ★ and empty is ☆
      expect(buttons[0].textContent).toContain('★');
      expect(buttons[1].textContent).toContain('☆');
    });

    it('should render Icon component for multi-character icon names', () => {
      render(<Rating icon="star" emptyIcon="star-outline" />);
      // If icon name is multi-char, it should render Icon component
      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });
  });

  describe('Size', () => {
    it('should apply default size md', () => {
      const { container } = render(<Rating />);
      const rating = container.querySelector('[data-size="md"]');
      expect(rating).toBeInTheDocument();
    });

    it('should apply custom size', () => {
      const { container } = render(<Rating size="lg" />);
      const rating = container.querySelector('[data-size="lg"]');
      expect(rating).toBeInTheDocument();
    });

    it('should apply small size', () => {
      const { container } = render(<Rating size="sm" />);
      const rating = container.querySelector('[data-size="sm"]');
      expect(rating).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have role="radiogroup"', () => {
      render(<Rating />);
      const radiogroup = screen.getByRole('radiogroup');
      expect(radiogroup).toBeInTheDocument();
    });

    it('should have aria-label from label prop', () => {
      render(<Rating label="Product rating" />);
      const radiogroup = screen.getByRole('radiogroup');
      expect(radiogroup).toHaveAttribute('aria-label', 'Product rating');
    });

    it('should have proper aria-label for each star button', () => {
      render(<Rating max={5} />);
      const buttons = screen.getAllByRole('button');

      expect(buttons[0]).toHaveAttribute('aria-label', '1 stars');
      expect(buttons[1]).toHaveAttribute('aria-label', '2 stars');
      expect(buttons[2]).toHaveAttribute('aria-label', '3 stars');
      expect(buttons[3]).toHaveAttribute('aria-label', '4 stars');
      expect(buttons[4]).toHaveAttribute('aria-label', '5 stars');
    });

    it('should use singular "star" for max=1', () => {
      render(<Rating max={1} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', '1 star');
    });

    it('should use provided id', () => {
      render(<Rating id="custom-id" label="Rating" />);
      const radiogroup = screen.getByRole('radiogroup');
      expect(radiogroup).toHaveAttribute('id', 'custom-id');
    });

    it('should generate automatic id when not provided', () => {
      render(<Rating label="Rating" />);
      const radiogroup = screen.getByRole('radiogroup');
      expect(radiogroup).toHaveAttribute('id');
    });

    it('should link label to rating via id', () => {
      render(<Rating id="rating-1" label="Rating" />);
      const label = screen.getByText('Rating');
      expect(label).toHaveAttribute('for', 'rating-1');
    });
  });

  describe('Event Handlers', () => {
    it('should call onBlur when focus leaves the rating', () => {
      const handleBlur = jest.fn();
      render(<Rating onBlur={handleBlur} />);
      const radiogroup = screen.getByRole('radiogroup');

      fireEvent.blur(radiogroup);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('should pass event object to onBlur', () => {
      const handleBlur = jest.fn();
      render(<Rating onBlur={handleBlur} />);
      const radiogroup = screen.getByRole('radiogroup');

      fireEvent.blur(radiogroup);
      expect(handleBlur).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('Half-filled Stars (Precision)', () => {
    it('should show half-filled star when precision is 0.5 and value is x.5', () => {
      render(<Rating precision={0.5} value={2.5} onChange={() => {}} />);
      const buttons = screen.getAllByRole('button');

      // First two should be fully filled
      expect(buttons[0]).toHaveAttribute('data-filled');
      expect(buttons[1]).toHaveAttribute('data-filled');

      // Third should be half-filled
      expect(buttons[2]).toHaveAttribute('data-half');

      // Rest should be empty
      expect(buttons[3]).not.toHaveAttribute('data-filled');
      expect(buttons[3]).not.toHaveAttribute('data-half');
    });

    it('should not show half-filled when precision is 1 (default)', () => {
      render(<Rating value={2.5} onChange={() => {}} />);
      const buttons = screen.getAllByRole('button');

      // None should have data-half attribute when precision is 1
      buttons.forEach((button) => {
        expect(button).not.toHaveAttribute('data-half');
      });
    });

    it('should show half-filled for values between integers when precision < 1', () => {
      render(<Rating precision={0.1} value={3.7} onChange={() => {}} />);
      const buttons = screen.getAllByRole('button');

      // First three fully filled
      expect(buttons[0]).toHaveAttribute('data-filled');
      expect(buttons[1]).toHaveAttribute('data-filled');
      expect(buttons[2]).toHaveAttribute('data-filled');

      // Fourth is half-filled (value 3.7 is between 3 and 4)
      expect(buttons[3]).toHaveAttribute('data-half');
    });
  });

  describe('Custom ClassName', () => {
    it('should apply custom className to container', () => {
      const { container } = render(<Rating className="custom-rating" />);
      const ratingContainer = container.querySelector('.custom-rating');
      expect(ratingContainer).toBeInTheDocument();
    });
  });

  describe('Additional HTML Attributes', () => {
    it('should pass through additional props to rating div', () => {
      render(<Rating data-custom="test-value" />);
      const radiogroup = screen.getByRole('radiogroup');
      expect(radiogroup).toHaveAttribute('data-custom', 'test-value');
    });

    it('should have data-component attribute', () => {
      const { container } = render(<Rating />);
      const rating = container.querySelector('[data-component="rating"]');
      expect(rating).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to rating div', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Rating ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveAttribute('role', 'radiogroup');
    });
  });

  describe('Edge Cases', () => {
    it('should handle max=0', () => {
      render(<Rating max={0} />);
      const buttons = screen.queryAllByRole('button');
      expect(buttons).toHaveLength(0);
    });

    it('should handle value greater than max', () => {
      render(<Rating max={5} value={10} onChange={() => {}} />);
      const buttons = screen.getAllByRole('button');

      // All stars should be filled
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('data-filled');
      });
    });

    it('should handle negative value', () => {
      render(<Rating value={-1} onChange={() => {}} />);
      const buttons = screen.getAllByRole('button');

      // No stars should be filled for negative value
      buttons.forEach((button) => {
        expect(button).not.toHaveAttribute('data-filled');
      });
    });

    it('should handle value of 0', () => {
      render(<Rating value={0} onChange={() => {}} />);
      const buttons = screen.getAllByRole('button');

      // No stars should be filled
      buttons.forEach((button) => {
        expect(button).not.toHaveAttribute('data-filled');
      });
    });

    it('should handle clicking same value twice', () => {
      const handleChange = jest.fn();
      render(<Rating onChange={handleChange} />);
      const buttons = screen.getAllByRole('button');

      fireEvent.click(buttons[2]);
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(3);

      fireEvent.click(buttons[2]);
      expect(handleChange).toHaveBeenCalledTimes(2);
      expect(handleChange).toHaveBeenCalledWith(3);
    });
  });

  describe('Display Name', () => {
    it('should have displayName set', () => {
      expect(Rating.displayName).toBe('Rating');
    });
  });
});
