import { render, screen, fireEvent } from '@testing-library/react';
import { TagInput } from './TagInput';

describe('TagInput', () => {
  it('should render', () => {
    render(<TagInput />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<TagInput label="Tags" />);
    expect(screen.getByText('Tags')).toBeInTheDocument();
  });

  it('should render default tags', () => {
    render(<TagInput defaultValue={['React', 'TypeScript']} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('should add tag on Enter key', () => {
    const handleChange = jest.fn();
    render(<TagInput onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'React' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(handleChange).toHaveBeenCalledWith(['React']);
  });

  it('should add tag on comma', () => {
    const handleChange = jest.fn();
    render(<TagInput onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'React' } });
    fireEvent.keyDown(input, { key: ',' });

    expect(handleChange).toHaveBeenCalledWith(['React']);
  });

  it('should remove tag on backspace when input is empty', () => {
    const handleChange = jest.fn();
    render(<TagInput defaultValue={['React', 'TypeScript']} onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Backspace' });

    expect(handleChange).toHaveBeenCalledWith(['React']);
  });

  it('should remove tag on remove button click', () => {
    const handleChange = jest.fn();
    render(<TagInput defaultValue={['React', 'TypeScript']} onChange={handleChange} />);

    const removeButtons = screen.getAllByLabelText(/Remove/);
    fireEvent.click(removeButtons[0]);

    expect(handleChange).toHaveBeenCalledWith(['TypeScript']);
  });

  it('should not add duplicate tags when allowDuplicates is false', () => {
    const handleChange = jest.fn();
    render(
      <TagInput
        defaultValue={['React']}
        allowDuplicates={false}
        onChange={handleChange}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'React' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('should allow duplicate tags when allowDuplicates is true', () => {
    const handleChange = jest.fn();
    render(
      <TagInput
        defaultValue={['React']}
        allowDuplicates
        onChange={handleChange}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'React' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(handleChange).toHaveBeenCalledWith(['React', 'React']);
  });

  it('should respect maxTags limit', () => {
    const handleChange = jest.fn();
    render(
      <TagInput
        defaultValue={['Tag1', 'Tag2']}
        maxTags={2}
        onChange={handleChange}
      />
    );

    const input = screen.queryByRole('textbox');
    expect(input).not.toBeInTheDocument(); // Input should be hidden when max is reached
  });

  it('should transform tags', () => {
    const handleChange = jest.fn();
    render(
      <TagInput
        transformTag={(tag) => tag.toLowerCase()}
        onChange={handleChange}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'REACT' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(handleChange).toHaveBeenCalledWith(['react']);
  });

  it('should validate tags', () => {
    const handleChange = jest.fn();
    render(
      <TagInput
        validateTag={(tag) => tag.startsWith('#')}
        onChange={handleChange}
      />
    );

    const input = screen.getByRole('textbox');

    // Invalid tag (doesn't start with #)
    fireEvent.change(input, { target: { value: 'react' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleChange).not.toHaveBeenCalled();

    // Valid tag
    fireEvent.change(input, { target: { value: '#react' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleChange).toHaveBeenCalledWith(['#react']);
  });

  it('should show suggestions', () => {
    render(
      <TagInput
        suggestions={['React', 'Vue', 'Angular']}
        showSuggestions
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Re' } });

    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('should filter suggestions based on input', () => {
    render(
      <TagInput
        suggestions={['React', 'Vue', 'Angular']}
        showSuggestions
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Vu' } });

    expect(screen.getByText('Vue')).toBeInTheDocument();
    expect(screen.queryByText('React')).not.toBeInTheDocument();
  });

  it('should add tag on suggestion click', () => {
    const handleChange = jest.fn();
    render(
      <TagInput
        suggestions={['React', 'Vue']}
        showSuggestions
        onChange={handleChange}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Re' } });

    const suggestion = screen.getByText('React');
    fireEvent.click(suggestion);

    expect(handleChange).toHaveBeenCalledWith(['React']);
  });

  it('should show error state', () => {
    render(
      <TagInput
        label="Tags"
        error
        errorMessage="At least one tag is required"
      />
    );

    expect(screen.getByText('At least one tag is required')).toBeInTheDocument();
  });

  it('should show required indicator', () => {
    render(<TagInput label="Tags" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should be disabled', () => {
    render(<TagInput disabled defaultValue={['React']} />);

    const input = screen.queryByRole('textbox');
    if (input) {
      expect(input).toBeDisabled();
    }

    const removeButtons = screen.getAllByLabelText(/Remove/);
    removeButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('should work in controlled mode', () => {
    const { rerender } = render(<TagInput value={['React']} />);
    expect(screen.getByText('React')).toBeInTheDocument();

    rerender(<TagInput value={['React', 'TypeScript']} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('should use custom renderTag', () => {
    render(
      <TagInput
        defaultValue={['Custom']}
        renderTag={(tag, onRemove) => (
          <div data-testid="custom-tag">
            {tag}
            <button onClick={onRemove}>X</button>
          </div>
        )}
      />
    );

    expect(screen.getByTestId('custom-tag')).toBeInTheDocument();
  });
});
