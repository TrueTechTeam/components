import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ColorPicker } from './ColorPicker';

describe('ColorPicker', () => {
  it('should render', () => {
    render(<ColorPicker />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<ColorPicker label="Choose Color" />);
    expect(screen.getByText('Choose Color')).toBeInTheDocument();
  });

  it('should show default color in swatch', () => {
    render(<ColorPicker defaultValue="#FF5733" showSwatch />);
    const swatch = screen.getByLabelText('Open color picker').querySelector('div');
    expect(swatch).toHaveStyle({ backgroundColor: '#ff5733' });
  });

  it('should show default color in input', () => {
    render(<ColorPicker defaultValue="#FF5733" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    // ColorPicker normalizes hex to lowercase
    expect(input.value).toBe('#ff5733');
  });

  it('should handle hex input change', () => {
    const handleChange = jest.fn();
    render(<ColorPicker onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '#3B82F6' } });

    expect(handleChange).toHaveBeenCalledWith('#3b82f6');
  });

  it('should validate hex input', () => {
    const handleChange = jest.fn();
    render(<ColorPicker onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'invalid' } });

    // Should not call onChange for invalid hex
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('should open picker on swatch click', () => {
    render(<ColorPicker showSwatch />);

    const swatchButton = screen.getByLabelText('Open color picker');
    fireEvent.click(swatchButton);

    // Picker panel should be visible (check for HSL label which is in the picker)
    expect(screen.getByText('HSL')).toBeInTheDocument();
  });

  it('should show HSL sliders', () => {
    render(<ColorPicker showSwatch />);

    const swatchButton = screen.getByLabelText('Open color picker');
    fireEvent.click(swatchButton);

    expect(screen.getByText('HSL')).toBeInTheDocument();
  });

  it('should show RGB sliders', () => {
    render(<ColorPicker showSwatch />);

    const swatchButton = screen.getByLabelText('Open color picker');
    fireEvent.click(swatchButton);

    expect(screen.getByText('RGB')).toBeInTheDocument();
  });

  it('should show preset colors', () => {
    render(<ColorPicker showSwatch showPresets />);

    const swatchButton = screen.getByLabelText('Open color picker');
    fireEvent.click(swatchButton);

    expect(screen.getByText('Presets')).toBeInTheDocument();
  });

  it('should handle preset color click', () => {
    const handleChange = jest.fn();
    render(
      <ColorPicker showSwatch showPresets presetColors={['#FF0000']} onChange={handleChange} />
    );

    const swatchButton = screen.getByLabelText('Open color picker');
    fireEvent.click(swatchButton);

    const presetButton = screen.getByLabelText('Select color #FF0000');
    fireEvent.click(presetButton);

    expect(handleChange).toHaveBeenCalledWith('#ff0000');
  });

  it('should hide presets when showPresets is false', () => {
    render(<ColorPicker showSwatch showPresets={false} />);

    const swatchButton = screen.getByLabelText('Open color picker');
    fireEvent.click(swatchButton);

    expect(screen.queryByText('Presets')).not.toBeInTheDocument();
  });

  it('should hide input when showInput is false', () => {
    render(<ColorPicker showInput={false} />);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('should hide swatch when showSwatch is false', () => {
    render(<ColorPicker showSwatch={false} />);
    expect(screen.queryByLabelText('Open color picker')).not.toBeInTheDocument();
  });

  it('should show error state', () => {
    render(<ColorPicker label="Color" error errorMessage="Invalid color" />);

    expect(screen.getByText('Invalid color')).toBeInTheDocument();
  });

  it('should show required indicator', () => {
    render(<ColorPicker label="Color" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should be disabled', () => {
    render(<ColorPicker disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('should work in controlled mode', async () => {
    const { rerender } = render(<ColorPicker value="#FF5733" />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    // ColorPicker normalizes hex to lowercase
    expect(input.value).toBe('#ff5733');

    rerender(<ColorPicker value="#3B82F6" />);
    // ColorPicker uses setTimeout to update input value in controlled mode
    await waitFor(() => {
      expect(input.value).toBe('#3b82f6');
    });
  });

  it('should handle short hex codes', () => {
    const handleChange = jest.fn();
    render(<ColorPicker onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '#FFF' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('should handle hex codes without # (does not auto-prefix)', () => {
    const handleChange = jest.fn();
    render(<ColorPicker onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    // Without #, the color is not recognized, so onChange is not called
    fireEvent.change(input, { target: { value: 'FF5733' } });
    expect(handleChange).not.toHaveBeenCalled();

    // With #, the color is recognized and onChange is called
    fireEvent.change(input, { target: { value: '#FF5733' } });
    expect(handleChange).toHaveBeenCalledWith('#ff5733');
  });
});
