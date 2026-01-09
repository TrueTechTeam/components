import { render, screen, fireEvent } from '@testing-library/react';
import { Rating } from './Rating';

describe('Rating', () => {
  it('should render', () => {
    render(<Rating />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('should render correct number of stars', () => {
    render(<Rating max={5} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(5);
  });

  it('should handle click', () => {
    const handleChange = jest.fn();
    render(<Rating onChange={handleChange} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[2]);
    expect(handleChange).toHaveBeenCalledWith(3);
  });

  it('should not change when readOnly', () => {
    const handleChange = jest.fn();
    render(<Rating readOnly onChange={handleChange} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(handleChange).not.toHaveBeenCalled();
  });
});
