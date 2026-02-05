import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FlipCard } from './FlipCard';

describe('FlipCard', () => {
  describe('rendering', () => {
    it('renders front content', () => {
      render(<FlipCard front="Front Content" back="Back Content" />);
      expect(screen.getByText('Front Content')).toBeInTheDocument();
    });

    it('renders back content when flipped', () => {
      render(<FlipCard front="Front" back="Back Content" isFlipped />);
      expect(screen.getByText('Back Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <FlipCard front="Front" back="Back" className="custom-class" data-testid="flip-card" />
      );
      expect(screen.getByTestId('flip-card')).toHaveClass('custom-class');
    });

    it('renders complex content', () => {
      render(
        <FlipCard
          front={
            <div>
              <h1>Title</h1>
              <p>Description</p>
            </div>
          }
          back="Back"
        />
      );
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });
  });

  describe('controlled mode', () => {
    it('shows front when isFlipped is false', () => {
      render(<FlipCard front="Front" back="Back" isFlipped={false} />);
      expect(screen.getByText('Front')).toBeInTheDocument();
    });

    it('shows back when isFlipped is true', () => {
      render(<FlipCard front="Front" back="Back" isFlipped />);
      expect(screen.getByText('Back')).toBeInTheDocument();
    });

    it('calls onFlipChange when clicked in controlled mode', () => {
      const handleFlipChange = jest.fn();
      render(
        <FlipCard
          front="Front"
          back="Back"
          isFlipped={false}
          flipTrigger="click"
          onFlipChange={handleFlipChange}
        />
      );
      const element = screen
        .getByText('Front')
        .closest('[data-component="flip-card"]') as HTMLElement;
      fireEvent.click(element);
      expect(handleFlipChange).toHaveBeenCalledWith(true);
    });
  });

  describe('disabled state', () => {
    it('does not call onFlipChange when disabled', () => {
      const handleFlipChange = jest.fn();
      render(
        <FlipCard
          front="Front"
          back="Back"
          flipTrigger="click"
          disabled
          onFlipChange={handleFlipChange}
        />
      );
      const element = screen
        .getByText('Front')
        .closest('[data-component="flip-card"]') as HTMLElement;
      fireEvent.click(element);
      expect(handleFlipChange).not.toHaveBeenCalled();
    });

    it('does not flip on hover when disabled', () => {
      const handleFlipChange = jest.fn();
      render(
        <FlipCard
          front="Front"
          back="Back"
          flipTrigger="hover"
          disabled
          onFlipChange={handleFlipChange}
        />
      );
      const element = screen
        .getByText('Front')
        .closest('[data-component="flip-card"]') as HTMLElement;
      fireEvent.mouseEnter(element);
      expect(handleFlipChange).not.toHaveBeenCalled();
    });
  });

  describe('manual trigger', () => {
    it('does not flip on click when trigger is manual', () => {
      const handleFlipChange = jest.fn();
      render(
        <FlipCard front="Front" back="Back" flipTrigger="manual" onFlipChange={handleFlipChange} />
      );
      const element = screen
        .getByText('Front')
        .closest('[data-component="flip-card"]') as HTMLElement;
      fireEvent.click(element);
      expect(handleFlipChange).not.toHaveBeenCalled();
    });
  });

  describe('hover trigger', () => {
    it('calls onFlipChange on mouse enter', () => {
      const handleFlipChange = jest.fn();
      render(
        <FlipCard front="Front" back="Back" flipTrigger="hover" onFlipChange={handleFlipChange} />
      );
      const element = screen
        .getByText('Front')
        .closest('[data-component="flip-card"]') as HTMLElement;
      fireEvent.mouseEnter(element);
      expect(handleFlipChange).toHaveBeenCalledWith(true);
    });

    it('calls onFlipChange on mouse leave', () => {
      const handleFlipChange = jest.fn();
      render(
        <FlipCard
          front="Front"
          back="Back"
          flipTrigger="hover"
          isFlipped
          onFlipChange={handleFlipChange}
        />
      );
      const element = screen
        .getByText('Back')
        .closest('[data-component="flip-card"]') as HTMLElement;
      fireEvent.mouseLeave(element);
      expect(handleFlipChange).toHaveBeenCalledWith(false);
    });
  });

  describe('accessibility', () => {
    it('includes role and aria attributes', () => {
      render(<FlipCard front="Front" back="Back" flipTrigger="click" />);
      const element = screen
        .getByText('Front')
        .closest('[data-component="flip-card"]') as HTMLElement;
      expect(element).toHaveAttribute('role');
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<FlipCard ref={ref} front="Front" back="Back" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
