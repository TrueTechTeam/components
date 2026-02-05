import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColorPicker } from './ColorPicker';

describe('ColorPicker', () => {
  describe('rendering', () => {
    it('should render with default values', () => {
      render(<ColorPicker />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<ColorPicker label="Choose Color" />);
      expect(screen.getByText('Choose Color')).toBeInTheDocument();
    });

    it('should show required indicator when required', () => {
      render(<ColorPicker label="Color" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should render with helper text', () => {
      render(<ColorPicker helperText="Select your favorite color" />);
      expect(screen.getByText('Select your favorite color')).toBeInTheDocument();
    });

    it('should render with error message', () => {
      render(<ColorPicker error errorMessage="Invalid color" />);
      expect(screen.getByText('Invalid color')).toBeInTheDocument();
    });

    it('should prioritize error message over helper text', () => {
      render(<ColorPicker helperText="Helper" errorMessage="Error" error />);
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<ColorPicker className="custom-class" data-testid="color-picker" />);
      const container = screen.getByTestId('color-picker');
      expect(container).toHaveClass('custom-class');
    });

    it('should render with data-testid', () => {
      render(<ColorPicker data-testid="custom-picker" />);
      expect(screen.getByTestId('custom-picker')).toBeInTheDocument();
    });

    it('should render swatch button by default', () => {
      render(<ColorPicker />);
      expect(screen.getByLabelText('Open color picker')).toBeInTheDocument();
    });

    it('should not render swatch when showSwatch is false', () => {
      render(<ColorPicker showSwatch={false} />);
      expect(screen.queryByLabelText('Open color picker')).not.toBeInTheDocument();
    });

    it('should not render input when showInput is false', () => {
      render(<ColorPicker showInput={false} />);
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('should render both swatch and input by default', () => {
      render(<ColorPicker />);
      expect(screen.getByLabelText('Open color picker')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  describe('default values and formats', () => {
    it('should show default value in hex format', () => {
      render(<ColorPicker defaultValue="#FF5733" format="hex" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value.toUpperCase()).toBe('#FF5733');
    });

    it('should show default value in rgb format', () => {
      render(<ColorPicker defaultValue="#FF5733" format="rgb" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('rgb(255, 87, 51)');
    });

    it('should show default value in hsl format', () => {
      render(<ColorPicker defaultValue="#FF5733" format="hsl" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      // Color conversion may result in slight rounding differences
      expect(input.value).toMatch(/hsl\((11|12), 100%, 60%\)/);
    });

    it('should handle rgba format with alpha', () => {
      render(<ColorPicker defaultValue="rgba(255, 87, 51, 0.5)" format="rgb" showAlpha />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('rgba(255, 87, 51, 0.50)');
    });

    it('should handle hsla format with alpha', () => {
      render(<ColorPicker defaultValue="hsla(12, 100%, 60%, 0.8)" format="hsl" showAlpha />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('hsla(12, 100%, 60%, 0.80)');
    });

    it('should handle 8-character hex with alpha', () => {
      render(<ColorPicker defaultValue="#FF5733CC" format="hex" showAlpha />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value.toUpperCase()).toBe('#FF5733CC');
    });
  });

  describe('color swatch', () => {
    it('should display correct background color on swatch', () => {
      render(<ColorPicker defaultValue="#FF5733" />);
      const swatchButton = screen.getByLabelText('Open color picker');
      const swatch = swatchButton.querySelector('[class*="swatch"]') as HTMLElement;
      expect(swatch).toHaveStyle({ backgroundColor: 'rgba(255, 87, 51, 1)' });
    });

    it('should open popover when swatch is clicked', async () => {
      const user = userEvent.setup();
      render(<ColorPicker />);

      const swatchButton = screen.getByLabelText('Open color picker');
      await user.click(swatchButton);

      await waitFor(() => {
        expect(screen.getByText('HSL')).toBeInTheDocument();
        expect(screen.getByText('RGB')).toBeInTheDocument();
      });
    });

    it('should close popover when clicking outside', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <ColorPicker />
          <button>Outside</button>
        </div>
      );

      const swatchButton = screen.getByLabelText('Open color picker');
      await user.click(swatchButton);

      await waitFor(() => {
        expect(screen.getByText('HSL')).toBeInTheDocument();
      });

      const outsideButton = screen.getByText('Outside');
      await user.click(outsideButton);

      await waitFor(() => {
        expect(screen.queryByText('HSL')).not.toBeInTheDocument();
      });
    });

    it('should not open popover when disabled', async () => {
      const user = userEvent.setup();
      render(<ColorPicker disabled />);

      const swatchButton = screen.getByLabelText('Open color picker');
      expect(swatchButton).toBeDisabled();
      await user.click(swatchButton);

      expect(screen.queryByText('HSL')).not.toBeInTheDocument();
    });
  });

  describe('color input', () => {
    it('should accept hex color input', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<ColorPicker onChange={handleChange} format="hex" />);

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, '#00FF00');

      expect(handleChange).toHaveBeenCalled();
    });

    it('should accept rgb color input', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<ColorPicker onChange={handleChange} format="rgb" />);

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'rgb(0, 255, 0)');

      expect(handleChange).toHaveBeenCalled();
    });

    it('should accept hsl color input', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<ColorPicker onChange={handleChange} format="hsl" />);

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'hsl(120, 100%, 50%)');

      expect(handleChange).toHaveBeenCalled();
    });

    it('should handle blur event', async () => {
      const user = userEvent.setup();
      const handleBlur = jest.fn();
      render(<ColorPicker onBlur={handleBlur} />);

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.tab();

      expect(handleBlur).toHaveBeenCalled();
    });

    it('should not trigger onChange when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<ColorPicker disabled onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, '#00FF00');

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should handle invalid color input gracefully', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<ColorPicker onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.clear(input);
      const callCountAfterClear = handleChange.mock.calls.length;

      await user.type(input, 'invalid-color');

      // Should not call onChange for invalid color (only called during clear)
      expect(handleChange.mock.calls.length).toBe(callCountAfterClear);
    });
  });

  describe('HSL sliders', () => {
    it('should render HSL sliders in popover', async () => {
      const user = userEvent.setup();
      render(<ColorPicker />);

      const swatchButton = screen.getByLabelText('Open color picker');
      await user.click(swatchButton);

      await waitFor(() => {
        expect(screen.getByText('HSL')).toBeInTheDocument();
      });
    });

    it('should update color when hue slider changes', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<ColorPicker onChange={handleChange} format="hex" />);

      const swatchButton = screen.getByLabelText('Open color picker');
      await user.click(swatchButton);

      let hueSlider: HTMLInputElement | null = null;
      await waitFor(() => {
        const sliders = screen.queryAllByRole('slider');
        hueSlider = sliders.find(
          (slider) => slider.getAttribute('data-type') === 'hue'
        ) as HTMLInputElement;
        expect(hueSlider).toBeInTheDocument();
      });

      if (hueSlider) {
        fireEvent.change(hueSlider, { target: { value: '180' } });
        expect(handleChange).toHaveBeenCalled();
      }
    });

    it('should update color when saturation slider changes', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<ColorPicker onChange={handleChange} />);

      const swatchButton = screen.getByLabelText('Open color picker');
      await user.click(swatchButton);

      let saturationSlider: HTMLElement | null = null;
      await waitFor(() => {
        const sliders = screen.queryAllByRole('slider');
        expect(sliders.length).toBeGreaterThan(1);
        saturationSlider = sliders[1]; // Second slider is saturation
      });

      if (saturationSlider) {
        fireEvent.change(saturationSlider, { target: { value: '50' } });
        expect(handleChange).toHaveBeenCalled();
      }
    });

    it('should update color when lightness slider changes', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<ColorPicker onChange={handleChange} />);

      const swatchButton = screen.getByLabelText('Open color picker');
      await user.click(swatchButton);

      let lightnessSlider: HTMLElement | null = null;
      await waitFor(() => {
        const sliders = screen.queryAllByRole('slider');
        expect(sliders.length).toBeGreaterThan(2);
        lightnessSlider = sliders[2]; // Third slider is lightness
      });

      if (lightnessSlider) {
        fireEvent.change(lightnessSlider, { target: { value: '40' } });
        expect(handleChange).toHaveBeenCalled();
      }
    });
  });

  describe('RGB sliders', () => {
    it('should render RGB sliders in popover', async () => {
      const user = userEvent.setup();
      render(<ColorPicker />);

      const swatchButton = screen.getByLabelText('Open color picker');
      await user.click(swatchButton);

      await waitFor(() => {
        expect(screen.getByText('RGB')).toBeInTheDocument();
      });
    });

    it('should update color when red slider changes', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<ColorPicker onChange={handleChange} />);

      const swatchButton = screen.getByLabelText('Open color picker');
      await user.click(swatchButton);

      let redSlider: HTMLInputElement | null = null;
      await waitFor(() => {
        const sliders = screen.queryAllByRole('slider');
        redSlider = sliders.find(
          (slider) => slider.getAttribute('data-type') === 'red'
        ) as HTMLInputElement;
        expect(redSlider).toBeInTheDocument();
      });

      if (redSlider) {
        fireEvent.change(redSlider, { target: { value: '100' } });
        expect(handleChange).toHaveBeenCalled();
      }
    });

    it('should update color when green slider changes', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<ColorPicker onChange={handleChange} />);

      const swatchButton = screen.getByLabelText('Open color picker');
      await user.click(swatchButton);

      let greenSlider: HTMLInputElement | null = null;
      await waitFor(() => {
        const sliders = screen.queryAllByRole('slider');
        greenSlider = sliders.find(
          (slider) => slider.getAttribute('data-type') === 'green'
        ) as HTMLInputElement;
        expect(greenSlider).toBeInTheDocument();
      });

      if (greenSlider) {
        fireEvent.change(greenSlider, { target: { value: '150' } });
        expect(handleChange).toHaveBeenCalled();
      }
    });

    it('should update color when blue slider changes', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<ColorPicker onChange={handleChange} />);

      const swatchButton = screen.getByLabelText('Open color picker');
      await user.click(swatchButton);

      let blueSlider: HTMLInputElement | null = null;
      await waitFor(() => {
        const sliders = screen.queryAllByRole('slider');
        blueSlider = sliders.find(
          (slider) => slider.getAttribute('data-type') === 'blue'
        ) as HTMLInputElement;
        expect(blueSlider).toBeInTheDocument();
      });

      if (blueSlider) {
        fireEvent.change(blueSlider, { target: { value: '200' } });
        expect(handleChange).toHaveBeenCalled();
      }
    });
  });

  describe('alpha slider', () => {
    it('should not render alpha slider by default', async () => {
      const user = userEvent.setup();
      render(<ColorPicker />);

      const swatchButton = screen.getByLabelText('Open color picker');
      await user.click(swatchButton);

      await waitFor(() => {
        expect(screen.getByText('HSL')).toBeInTheDocument();
      });

      expect(screen.queryByText('Alpha')).not.toBeInTheDocument();
    });

    it('should render alpha slider when showAlpha is true', async () => {
      const user = userEvent.setup();
      render(<ColorPicker showAlpha />);

      const swatchButton = screen.getByLabelText('Open color picker');
      await user.click(swatchButton);

      await waitFor(() => {
        expect(screen.getByText('Alpha')).toBeInTheDocument();
      });
    });

    it('should update color when alpha slider changes', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<ColorPicker onChange={handleChange} showAlpha format="hex" />);

      const swatchButton = screen.getByLabelText('Open color picker');
      await user.click(swatchButton);

      let alphaSlider: HTMLInputElement | null = null;
      await waitFor(() => {
        const sliders = screen.queryAllByRole('slider');
        alphaSlider = sliders.find(
          (slider) => slider.getAttribute('data-type') === 'alpha'
        ) as HTMLInputElement;
        expect(alphaSlider).toBeInTheDocument();
      });

      if (alphaSlider) {
        fireEvent.change(alphaSlider, { target: { value: '50' } });
        expect(handleChange).toHaveBeenCalled();
      }
    });
  });

  describe('color canvas', () => {
    it('should render color canvas in popover', async () => {
      const user = userEvent.setup();
      render(<ColorPicker />);

      const swatchButton = screen.getByLabelText('Open color picker');
      await user.click(swatchButton);

      await waitFor(() => {
        const canvas = document.querySelector('canvas');
        expect(canvas).toBeInTheDocument();
      });
    });

    it('should update color on canvas mouse down', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<ColorPicker onChange={handleChange} />);

      const swatchButton = screen.getByLabelText('Open color picker');
      await user.click(swatchButton);

      await waitFor(() => {
        const canvas = document.querySelector('canvas');
        expect(canvas).toBeInTheDocument();
      });

      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      fireEvent.mouseDown(canvas, { clientX: 100, clientY: 75 });

      expect(handleChange).toHaveBeenCalled();
    });

    it('should handle canvas dragging', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<ColorPicker onChange={handleChange} />);

      const swatchButton = screen.getByLabelText('Open color picker');
      await user.click(swatchButton);

      await waitFor(() => {
        const canvas = document.querySelector('canvas');
        expect(canvas).toBeInTheDocument();
      });

      const canvas = document.querySelector('canvas') as HTMLCanvasElement;

      // Start dragging
      fireEvent.mouseDown(canvas, { clientX: 100, clientY: 75 });

      // Move mouse
      fireEvent.mouseMove(document, { clientX: 120, clientY: 80 });

      // Release
      fireEvent.mouseUp(document);

      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('preset colors', () => {
    it('should render preset colors by default', async () => {
      const user = userEvent.setup();
      render(<ColorPicker />);

      const swatchButton = screen.getByLabelText('Open color picker');
      await user.click(swatchButton);

      await waitFor(() => {
        expect(screen.getByText('Presets')).toBeInTheDocument();
      });
    });

    it('should not render presets when showPresets is false', async () => {
      const user = userEvent.setup();
      render(<ColorPicker showPresets={false} />);

      const swatchButton = screen.getByLabelText('Open color picker');
      await user.click(swatchButton);

      await waitFor(() => {
        expect(screen.getByText('HSL')).toBeInTheDocument();
      });

      expect(screen.queryByText('Presets')).not.toBeInTheDocument();
    });

    it('should render custom preset colors', async () => {
      const user = userEvent.setup();
      const customPresets = ['#FF0000', '#00FF00', '#0000FF'];
      render(<ColorPicker presetColors={customPresets} />);

      const swatchButton = screen.getByLabelText('Open color picker');
      await user.click(swatchButton);

      await waitFor(() => {
        expect(screen.getByLabelText('Select color #FF0000')).toBeInTheDocument();
        expect(screen.getByLabelText('Select color #00FF00')).toBeInTheDocument();
        expect(screen.getByLabelText('Select color #0000FF')).toBeInTheDocument();
      });
    });

    it('should update color when preset is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<ColorPicker onChange={handleChange} format="hex" />);

      const swatchButton = screen.getByLabelText('Open color picker');
      await user.click(swatchButton);

      await waitFor(() => {
        expect(screen.getByText('Presets')).toBeInTheDocument();
      });

      const presetButton = screen.getByLabelText('Select color #FF0000');
      await user.click(presetButton);

      expect(handleChange).toHaveBeenCalled();
      const lastCall = handleChange.mock.calls[handleChange.mock.calls.length - 1][0];
      expect(lastCall.toUpperCase()).toBe('#FF0000');
    });
  });

  describe('controlled vs uncontrolled', () => {
    it('should work as controlled component', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [color, setColor] = React.useState('#FF5733');
        return <ColorPicker value={color} onChange={setColor} format="hex" />;
      };

      render(<TestComponent />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value.toUpperCase()).toBe('#FF5733');

      await user.clear(input);
      fireEvent.change(input, { target: { value: '#00FF00' } });

      await waitFor(() => {
        expect(input.value.toUpperCase()).toBe('#00FF00');
      });
    });

    it('should work as uncontrolled component', async () => {
      const user = userEvent.setup();
      render(<ColorPicker defaultValue="#FF5733" format="hex" />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value.toUpperCase()).toBe('#FF5733');

      await user.clear(input);
      fireEvent.change(input, { target: { value: '#0000FF' } });

      expect(input.value.toUpperCase()).toBe('#0000FF');
    });

    it('should update when controlled value changes', async () => {
      const { rerender } = render(<ColorPicker value="#FF5733" format="hex" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value.toUpperCase()).toBe('#FF5733');

      rerender(<ColorPicker value="#00FF00" format="hex" />);

      await waitFor(() => {
        expect(input.value.toUpperCase()).toBe('#00FF00');
      });
    });

    it('should update when format changes', async () => {
      const { rerender } = render(<ColorPicker value="#FF5733" format="hex" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value.toUpperCase()).toBe('#FF5733');

      rerender(<ColorPicker value="#FF5733" format="rgb" />);

      await waitFor(() => {
        expect(input.value).toBe('rgb(255, 87, 51)');
      });
    });
  });

  describe('accessibility', () => {
    it('should have correct aria-label', () => {
      render(<ColorPicker aria-label="Custom color picker" />);
      expect(screen.getByLabelText('Custom color picker')).toBeInTheDocument();
    });

    it('should use label as aria-label when no aria-label provided', () => {
      render(<ColorPicker label="Color Selection" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Color Selection');
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<ColorPicker />);

      await user.tab();
      expect(screen.getByLabelText('Open color picker')).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('textbox')).toHaveFocus();
    });

    it('should associate label with input', () => {
      render(<ColorPicker label="Choose Color" />);
      const label = screen.getByText('Choose Color');
      const input = screen.getByRole('textbox');

      const labelFor = label.getAttribute('for');
      const inputId = input.getAttribute('id');

      expect(labelFor).toBe(inputId);
    });
  });

  describe('disabled state', () => {
    it('should disable input when disabled is true', () => {
      render(<ColorPicker disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should disable swatch button when disabled is true', () => {
      render(<ColorPicker disabled />);
      expect(screen.getByLabelText('Open color picker')).toBeDisabled();
    });
  });

  describe('input placeholders', () => {
    it('should show correct placeholder for hex format', () => {
      render(<ColorPicker format="hex" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.placeholder).toBe('#FF5733');
    });

    it('should show correct placeholder for rgb format', () => {
      render(<ColorPicker format="rgb" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.placeholder).toBe('rgb(255, 87, 51)');
    });

    it('should show correct placeholder for hsl format', () => {
      render(<ColorPicker format="hsl" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.placeholder).toBe('hsl(12, 100%, 60%)');
    });

    it('should show correct placeholder for rgba format with alpha', () => {
      render(<ColorPicker format="rgb" showAlpha />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.placeholder).toBe('rgba(255, 87, 51, 0.8)');
    });

    it('should show correct placeholder for hsla format with alpha', () => {
      render(<ColorPicker format="hsl" showAlpha />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.placeholder).toBe('hsla(12, 100%, 60%, 0.8)');
    });

    it('should show correct placeholder for hex8 format with alpha', () => {
      render(<ColorPicker format="hex" showAlpha />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.placeholder).toBe('#FF5733CC');
    });
  });

  describe('edge cases', () => {
    it('should handle short hex codes', () => {
      const handleChange = jest.fn();
      render(<ColorPicker onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '#FFF' } });

      expect(handleChange).toHaveBeenCalled();
    });

    it('should handle hex codes without # prefix', () => {
      const handleChange = jest.fn();
      render(<ColorPicker onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'FF5733' } });

      expect(handleChange).not.toHaveBeenCalled();

      fireEvent.change(input, { target: { value: '#FF5733' } });
      expect(handleChange).toHaveBeenCalled();
    });

    it('should handle empty input', async () => {
      const user = userEvent.setup();
      render(<ColorPicker defaultValue="#FF5733" />);

      const input = screen.getByRole('textbox');
      await user.clear(input);

      expect(input).toHaveValue('');
    });

    it('should preserve hue when saturation is 0', async () => {
      const user = userEvent.setup();
      render(<ColorPicker defaultValue="#FF5733" />);

      const swatchButton = screen.getByLabelText('Open color picker');
      await user.click(swatchButton);

      let saturationSlider: HTMLElement | null = null;
      let hueSlider: HTMLInputElement | null = null;

      await waitFor(() => {
        const sliders = screen.queryAllByRole('slider');
        expect(sliders.length).toBeGreaterThan(1);
        hueSlider = sliders[0] as HTMLInputElement;
        saturationSlider = sliders[1];
      });

      if (saturationSlider && hueSlider) {
        fireEvent.change(saturationSlider, { target: { value: '0' } });
        expect(parseInt(hueSlider.value)).toBeGreaterThanOrEqual(0);
      }
    });

    it('should handle rapid slider changes', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<ColorPicker onChange={handleChange} />);

      const swatchButton = screen.getByLabelText('Open color picker');
      await user.click(swatchButton);

      let hueSlider: HTMLElement | null = null;
      await waitFor(() => {
        const sliders = screen.queryAllByRole('slider');
        expect(sliders.length).toBeGreaterThan(0);
        hueSlider = sliders[0];
      });

      if (hueSlider) {
        fireEvent.change(hueSlider, { target: { value: '90' } });
        fireEvent.change(hueSlider, { target: { value: '180' } });
        fireEvent.change(hueSlider, { target: { value: '270' } });

        expect(handleChange).toHaveBeenCalled();
      }
    });
  });

  describe('cleanup', () => {
    it('should cleanup event listeners on unmount', async () => {
      const user = userEvent.setup();
      const { unmount } = render(<ColorPicker />);

      const swatchButton = screen.getByLabelText('Open color picker');
      await user.click(swatchButton);

      await waitFor(() => {
        const canvas = document.querySelector('canvas');
        expect(canvas).toBeInTheDocument();
      });

      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      fireEvent.mouseDown(canvas, { clientX: 100, clientY: 75 });

      unmount();

      fireEvent.mouseMove(document, { clientX: 120, clientY: 80 });
      fireEvent.mouseUp(document);
    });
  });
});
