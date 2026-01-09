import { render, screen, fireEvent } from '@testing-library/react';
import { NumberInput } from './NumberInput';

describe('NumberInput', () => {
  it('should render', () => {
    render(<NumberInput />);
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('should increment value', () => {
    const handleChange = jest.fn();
    render(<NumberInput defaultValue={0} onChange={handleChange} />);
    const incrementButton = screen.getByLabelText('Increase value');
    fireEvent.click(incrementButton);
    expect(handleChange).toHaveBeenCalledWith(1);
  });

  it('should decrement value', () => {
    const handleChange = jest.fn();
    render(<NumberInput defaultValue={5} onChange={handleChange} />);
    const decrementButton = screen.getByLabelText('Decrease value');
    fireEvent.click(decrementButton);
    expect(handleChange).toHaveBeenCalledWith(4);
  });
});
