import { render, screen, fireEvent } from '@testing-library/react';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('should render', () => {
    render(<Textarea aria-label="Test" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<Textarea label="Description" />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('should handle controlled value', () => {
    const { rerender } = render(<Textarea value="Initial" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('Initial');

    rerender(<Textarea value="Updated" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('Updated');
  });

  it('should call onChange when text changes', () => {
    const handleChange = jest.fn();
    render(<Textarea onChange={handleChange} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New text' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('should show character counter when enabled', () => {
    render(<Textarea showCounter maxLength={100} defaultValue="Test" />);
    expect(screen.getByText('4 / 100')).toBeInTheDocument();
  });

  it('should respect maxLength', () => {
    render(<Textarea maxLength={10} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('maxLength', '10');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Textarea disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
