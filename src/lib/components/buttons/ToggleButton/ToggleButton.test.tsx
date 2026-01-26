import { render, screen, fireEvent } from '@testing-library/react';
import { ToggleButton } from './ToggleButton';

describe('ToggleButton', () => {
  describe('rendering', () => {
    it('should render with aria-label', () => {
      render(<ToggleButton aria-label="Like" />);
      expect(screen.getByRole('button', { name: 'Like' })).toBeInTheDocument();
    });

    it('should render with default inactive state', () => {
      render(<ToggleButton aria-label="Like" />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('should render with defaultActive state', () => {
      render(<ToggleButton aria-label="Like" defaultActive />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('controlled mode', () => {
    it('should use active prop when provided', () => {
      render(<ToggleButton aria-label="Like" active />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('should reflect active prop changes', () => {
      const { rerender } = render(<ToggleButton aria-label="Like" active={false} />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');

      rerender(<ToggleButton aria-label="Like" active />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('uncontrolled mode', () => {
    it('should toggle state on click', () => {
      render(<ToggleButton aria-label="Like" />);
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('aria-pressed', 'false');
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-pressed', 'true');
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('interactions', () => {
    it('should call onChange with new state on click', () => {
      const handleChange = jest.fn();
      render(<ToggleButton aria-label="Like" onChange={handleChange} />);

      fireEvent.click(screen.getByRole('button'));
      expect(handleChange).toHaveBeenCalledWith(true, expect.any(Object));

      fireEvent.click(screen.getByRole('button'));
      expect(handleChange).toHaveBeenCalledWith(false, expect.any(Object));
    });

    it('should not toggle when disabled', () => {
      const handleChange = jest.fn();
      render(<ToggleButton aria-label="Like" disabled onChange={handleChange} />);

      fireEvent.click(screen.getByRole('button'));
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('sizes', () => {
    it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)('should render %s size', (size) => {
      render(<ToggleButton aria-label="Like" size={size} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-size', size);
    });
  });

  describe('data attributes', () => {
    it('should set data-active when active', () => {
      render(<ToggleButton aria-label="Like" defaultActive />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-active', 'true');
    });

    it('should not set data-active when inactive', () => {
      render(<ToggleButton aria-label="Like" />);
      const button = screen.getByRole('button');
      expect(button).not.toHaveAttribute('data-active');
    });

    it('should set data-animated when animated', () => {
      render(<ToggleButton aria-label="Like" animated />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-animated', 'true');
    });

    it('should set data-component', () => {
      render(<ToggleButton aria-label="Like" />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-component', 'toggle-button');
    });
  });

  describe('accessibility', () => {
    it('should have aria-pressed attribute', () => {
      render(<ToggleButton aria-label="Like" />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed');
    });

    it('should have proper button type', () => {
      render(<ToggleButton aria-label="Like" />);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('should support custom button type', () => {
      render(<ToggleButton aria-label="Like" type="submit" />);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('should be disabled when disabled prop is true', () => {
      render(<ToggleButton aria-label="Like" disabled />);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('custom props', () => {
    it('should apply custom className', () => {
      render(<ToggleButton aria-label="Like" className="custom-class" />);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('should apply custom data-testid', () => {
      render(<ToggleButton aria-label="Like" data-testid="custom-testid" />);
      expect(screen.getByTestId('custom-testid')).toBeInTheDocument();
    });

    it('should use default data-testid when not provided', () => {
      render(<ToggleButton aria-label="Like" />);
      expect(screen.getByTestId('toggle-button')).toBeInTheDocument();
    });
  });
});
