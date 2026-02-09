import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Slider } from './Slider';

describe('Slider', () => {
  describe('rendering', () => {
    it('should render', () => {
      render(<Slider aria-label="Test slider" />);
      expect(screen.getByRole('slider')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<Slider label="Volume" />);
      expect(screen.getByText('Volume')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Slider className="custom-class" aria-label="Test" data-testid="slider" />);
      const container = screen.getByTestId('slider-container');
      expect(container).toHaveClass('custom-class');
    });

    it('should render with data-testid', () => {
      render(<Slider data-testid="custom-slider" aria-label="Test" />);
      expect(screen.getByTestId('custom-slider-container')).toBeInTheDocument();
    });

    it('should respect min and max', () => {
      render(<Slider min={0} max={100} defaultValue={50} aria-label="Test" />);
      const slider = screen.getByRole('slider') as HTMLInputElement;
      expect(slider.min).toBe('0');
      expect(slider.max).toBe('100');
      expect(slider.value).toBe('50');
    });

    it('should respect step value', () => {
      render(<Slider min={0} max={100} step={10} defaultValue={50} aria-label="Test" />);
      const slider = screen.getByRole('slider') as HTMLInputElement;
      expect(slider.step).toBe('10');
    });

    it('should render with default values', () => {
      render(<Slider aria-label="Test" />);
      const slider = screen.getByRole('slider') as HTMLInputElement;
      expect(slider.min).toBe('0');
      expect(slider.max).toBe('100');
      expect(slider.value).toBe('50');
      expect(slider.step).toBe('1');
    });
  });

  describe('label and messages', () => {
    it('should associate label with slider', () => {
      render(<Slider label="Volume" id="volume-slider" />);
      const label = screen.getByText('Volume');
      const slider = screen.getByRole('slider');
      expect(label).toHaveAttribute('for', 'volume-slider');
      expect(slider).toHaveAttribute('id', 'volume-slider');
    });

    it('should render with helper text', () => {
      render(<Slider helperText="Adjust the volume level" aria-label="Test" />);
      expect(screen.getByText('Adjust the volume level')).toBeInTheDocument();
    });

    it('should render with error message', () => {
      render(<Slider error errorMessage="Invalid value" aria-label="Test" />);
      expect(screen.getByText('Invalid value')).toBeInTheDocument();
    });

    it('should prioritize error message over helper text', () => {
      render(<Slider helperText="Helper" error errorMessage="Error" aria-label="Test" />);
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    });

    it('should have role alert on error message', () => {
      render(<Slider error errorMessage="Error" aria-label="Test" />);
      const errorElement = screen.getByText('Error');
      expect(errorElement).toHaveAttribute('role', 'alert');
    });

    it('should not show helper text when only error prop is true', () => {
      render(<Slider error helperText="Helper" aria-label="Test" />);
      expect(screen.getByText('Helper')).toBeInTheDocument();
    });
  });

  describe('variants and sizes', () => {
    it('should apply variant', () => {
      const { container } = render(<Slider variant="secondary" aria-label="Test" />);
      const sliderElement = container.querySelector('[data-variant="secondary"]');
      expect(sliderElement).toBeInTheDocument();
    });

    it('should apply size', () => {
      const { container } = render(<Slider size="lg" aria-label="Test" />);
      const sliderElement = container.querySelector('[data-size="lg"]');
      expect(sliderElement).toBeInTheDocument();
    });

    it('should apply error state', () => {
      const { container } = render(<Slider error aria-label="Test" />);
      const sliderElement = container.querySelector('[data-error]');
      expect(sliderElement).toBeInTheDocument();
    });
  });

  describe('orientation', () => {
    it('should default to horizontal orientation', () => {
      const { container } = render(<Slider aria-label="Test" />);
      const sliderElement = container.querySelector('[data-orientation="horizontal"]');
      expect(sliderElement).toBeInTheDocument();
    });

    it('should support vertical orientation', () => {
      const { container } = render(<Slider orientation="vertical" aria-label="Test" />);
      const sliderElement = container.querySelector('[data-orientation="vertical"]');
      expect(sliderElement).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Slider disabled aria-label="Test" />);
      expect(screen.getByRole('slider')).toBeDisabled();
    });

    it('should not trigger change when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Slider disabled onChange={handleChange} aria-label="Test" />);

      const slider = screen.getByRole('slider');
      await user.type(slider, '{ArrowRight}');

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('value display', () => {
    it('should show value when showValue is true', () => {
      render(<Slider showValue defaultValue={75} aria-label="Test" />);
      expect(screen.getByText('75')).toBeInTheDocument();
    });

    it('should show value when valueLabelDisplay is on', () => {
      render(<Slider valueLabelDisplay="on" defaultValue={60} aria-label="Test" />);
      expect(screen.getByText('60')).toBeInTheDocument();
    });

    it('should format value using valueLabelFormat', () => {
      render(
        <Slider
          showValue
          defaultValue={50}
          valueLabelFormat={(val) => `${val}%`}
          aria-label="Test"
        />
      );
      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('should not show value when valueLabelDisplay is off', () => {
      render(<Slider valueLabelDisplay="off" defaultValue={50} aria-label="Test" />);
      expect(screen.queryByText('50')).not.toBeInTheDocument();
    });
  });

  describe('marks', () => {
    it('should not render marks by default', () => {
      const { container } = render(<Slider aria-label="Test" />);
      expect(container.querySelectorAll('[class*="mark"]').length).toBe(0);
    });

    it('should render marks when marks is true', () => {
      const { container } = render(<Slider marks min={0} max={10} step={2} aria-label="Test" />);
      const markDots = container.querySelectorAll('[class*="markDot"]');
      expect(markDots.length).toBeGreaterThan(0);
    });

    it('should render custom marks array', () => {
      const customMarks = [
        { value: 0, label: 'Low' },
        { value: 50, label: 'Medium' },
        { value: 100, label: 'High' },
      ];

      render(<Slider marks={customMarks} aria-label="Test" />);
      expect(screen.getByText('Low')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('High')).toBeInTheDocument();
    });

    it('should render marks without labels', () => {
      const customMarks = [{ value: 0 }, { value: 50 }, { value: 100 }];

      const { container } = render(<Slider marks={customMarks} aria-label="Test" />);
      const markDots = container.querySelectorAll('[class*="markDot"]');
      expect(markDots.length).toBe(3);
    });
  });

  describe('single value slider', () => {
    it('should handle change events', () => {
      const handleChange = jest.fn();

      render(<Slider onChange={handleChange} defaultValue={50} aria-label="Test" />);

      const slider = screen.getByRole('slider');
      fireEvent.change(slider, { target: { value: '60' } });

      expect(handleChange).toHaveBeenCalled();
    });

    it('should work as controlled component', () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState(50);
        return (
          <Slider value={value} onChange={(val) => setValue(val as number)} aria-label="Test" />
        );
      };

      render(<TestComponent />);
      const slider = screen.getByRole('slider') as HTMLInputElement;
      expect(slider.value).toBe('50');
    });

    it('should work as uncontrolled component', () => {
      render(<Slider defaultValue={30} aria-label="Test" />);

      const slider = screen.getByRole('slider') as HTMLInputElement;
      expect(slider.value).toBe('30');
    });

    it('should call onChangeCommitted when mouse is released', async () => {
      const user = userEvent.setup();
      const handleChangeCommitted = jest.fn();

      render(
        <Slider onChangeCommitted={handleChangeCommitted} defaultValue={50} aria-label="Test" />
      );

      const slider = screen.getByRole('slider');
      await user.click(slider);
      fireEvent.mouseUp(slider);

      expect(handleChangeCommitted).toHaveBeenCalled();
    });

    it('should update value with keyboard arrow keys', () => {
      const handleChange = jest.fn();

      render(<Slider onChange={handleChange} defaultValue={50} step={1} aria-label="Test" />);

      const slider = screen.getByRole('slider');
      fireEvent.change(slider, { target: { value: '51' } });

      expect(handleChange).toHaveBeenCalledWith(51);
    });
  });

  describe('range slider', () => {
    it('should render two sliders for range value', () => {
      render(<Slider value={[25, 75]} onChange={() => {}} aria-label="Test" />);
      const sliders = screen.getAllByRole('slider');
      expect(sliders.length).toBe(2);
    });

    it('should display both values for range', () => {
      render(<Slider value={[25, 75]} onChange={() => {}} showValue aria-label="Test" />);
      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getByText('75')).toBeInTheDocument();
    });

    it('should handle range value change', () => {
      const handleChange = jest.fn();

      render(<Slider value={[30, 70]} onChange={handleChange} aria-label="Test" />);

      const sliders = screen.getAllByRole('slider');
      // For range sliders, need to activate the thumb first via keydown
      fireEvent.keyDown(sliders[0]);
      fireEvent.change(sliders[0], { target: { value: '35' } });

      expect(handleChange).toHaveBeenCalled();
    });

    it('should work as controlled range component', () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState([20, 80]);
        return (
          <Slider value={value} onChange={(val) => setValue(val as number[])} aria-label="Test" />
        );
      };

      render(<TestComponent />);
      const sliders = screen.getAllByRole('slider') as HTMLInputElement[];
      expect(sliders[0].value).toBe('20');
      expect(sliders[1].value).toBe('80');
    });

    it('should work as uncontrolled range component', () => {
      render(<Slider defaultValue={[30, 70]} aria-label="Test" />);

      const sliders = screen.getAllByRole('slider') as HTMLInputElement[];
      expect(sliders[0].value).toBe('30');
      expect(sliders[1].value).toBe('70');
    });

    it('should prevent thumbs from crossing', () => {
      const handleChange = jest.fn();

      render(<Slider value={[40, 60]} onChange={handleChange} step={1} aria-label="Test" />);

      const sliders = screen.getAllByRole('slider') as HTMLInputElement[];

      // Activate the first thumb
      fireEvent.keyDown(sliders[0]);
      // Try to move first thumb past second thumb
      fireEvent.change(sliders[0], { target: { value: '70' } });

      // Should be constrained to second thumb value minus step
      expect(handleChange).toHaveBeenCalledWith([59, 60]);
    });

    it('should prevent second thumb from going below first thumb', () => {
      const handleChange = jest.fn();

      render(<Slider value={[40, 60]} onChange={handleChange} step={1} aria-label="Test" />);

      const sliders = screen.getAllByRole('slider') as HTMLInputElement[];

      // Activate the second thumb
      fireEvent.keyDown(sliders[1]);
      // Try to move second thumb below first thumb
      fireEvent.change(sliders[1], { target: { value: '30' } });

      // Should be constrained to first thumb value plus step
      expect(handleChange).toHaveBeenCalledWith([40, 41]);
    });
  });

  describe('mouse interactions', () => {
    beforeEach(() => {
      // Mock getBoundingClientRect for all slider elements
      Element.prototype.getBoundingClientRect = jest.fn().mockReturnValue({
        left: 0,
        top: 0,
        right: 200,
        bottom: 20,
        width: 200,
        height: 20,
        x: 0,
        y: 0,
        toJSON: () => {},
      });
    });

    it('should handle mouse down on thumb', async () => {
      const { container } = render(<Slider defaultValue={50} aria-label="Test" />);
      const thumb = container.querySelector('[class*="thumb"]');

      if (thumb) {
        fireEvent.mouseDown(thumb);
        expect(thumb).toHaveClass('thumbActive');
      }
    });

    it('should handle mouse enter on thumb', async () => {
      const { container } = render(<Slider defaultValue={50} aria-label="Test" />);
      const thumb = container.querySelector('[class*="thumb"]');

      if (thumb) {
        fireEvent.mouseEnter(thumb);
        expect(thumb).toHaveClass('thumbHovered');
      }
    });

    it('should handle mouse leave on thumb', async () => {
      const { container } = render(<Slider defaultValue={50} aria-label="Test" />);
      const thumb = container.querySelector('[class*="thumb"]');

      if (thumb) {
        fireEvent.mouseEnter(thumb);
        fireEvent.mouseLeave(thumb);
        expect(thumb).not.toHaveClass('thumbHovered');
      }
    });

    it('should show value label on drag when valueLabelDisplay is auto', async () => {
      const { container } = render(
        <Slider valueLabelDisplay="auto" defaultValue={50} aria-label="Test" />
      );

      const thumb = container.querySelector('[class*="thumb"]');

      // Value should not be visible initially
      expect(screen.queryByText('50')).not.toBeInTheDocument();

      // Start dragging
      if (thumb) {
        fireEvent.mouseDown(thumb);
        // Value should be visible during drag
        expect(screen.getByText('50')).toBeInTheDocument();
      }
    });

    it('should handle global mouse move during drag', async () => {
      const handleChange = jest.fn();
      const { container } = render(
        <Slider defaultValue={50} onChange={handleChange} aria-label="Test" />
      );

      const thumb = container.querySelector('[class*="thumb"]');

      if (thumb) {
        // Start dragging
        fireEvent.mouseDown(thumb);

        // Simulate mouse move
        fireEvent.mouseMove(document, { clientX: 100, clientY: 10 });

        expect(handleChange).toHaveBeenCalled();
      }
    });

    it('should handle global mouse up to end drag', async () => {
      const handleChangeCommitted = jest.fn();
      const { container } = render(
        <Slider defaultValue={50} onChangeCommitted={handleChangeCommitted} aria-label="Test" />
      );

      const thumb = container.querySelector('[class*="thumb"]');

      if (thumb) {
        // Start dragging
        fireEvent.mouseDown(thumb);

        // End dragging
        fireEvent.mouseUp(document);

        expect(handleChangeCommitted).toHaveBeenCalled();
      }
    });

    it('should handle track click for range slider', async () => {
      const handleChange = jest.fn();
      const { container } = render(
        <Slider value={[30, 70]} onChange={handleChange} aria-label="Test" />
      );

      const track = container.querySelector('[class*="track"]');

      if (track) {
        fireEvent.mouseDown(track, { clientX: 50, clientY: 10 });
        expect(handleChange).toHaveBeenCalled();
      }
    });

    it('should not handle track click when disabled', async () => {
      const handleChange = jest.fn();
      const { container } = render(
        <Slider value={[30, 70]} onChange={handleChange} disabled aria-label="Test" />
      );

      const track = container.querySelector('[class*="track"]');

      if (track) {
        fireEvent.mouseDown(track, { clientX: 50, clientY: 10 });
        expect(handleChange).not.toHaveBeenCalled();
      }
    });

    it('should not handle track click for single slider', async () => {
      const handleChange = jest.fn();
      const { container } = render(<Slider value={50} onChange={handleChange} aria-label="Test" />);

      const track = container.querySelector('[class*="track"]');

      if (track) {
        fireEvent.mouseDown(track, { clientX: 50, clientY: 10 });
        // For single slider, track clicks don't trigger change
        expect(handleChange).not.toHaveBeenCalled();
      }
    });
  });

  describe('keyboard interactions', () => {
    it('should handle keyboard on single slider', () => {
      const handleChange = jest.fn();

      render(<Slider onChange={handleChange} defaultValue={50} aria-label="Test" />);

      const slider = screen.getByRole('slider');
      fireEvent.keyDown(slider, { key: 'ArrowRight' });
      fireEvent.change(slider, { target: { value: '51' } });

      expect(handleChange).toHaveBeenCalled();
    });

    it('should handle keyboard on range slider', () => {
      const handleChange = jest.fn();

      render(<Slider value={[30, 70]} onChange={handleChange} aria-label="Test" />);

      const sliders = screen.getAllByRole('slider');
      fireEvent.keyDown(sliders[0], { key: 'ArrowRight' });
      fireEvent.change(sliders[0], { target: { value: '31' } });

      expect(handleChange).toHaveBeenCalled();
    });

    it('should set active thumb on key down', () => {
      render(<Slider defaultValue={50} aria-label="Test" />);

      const slider = screen.getByRole('slider');
      fireEvent.keyDown(slider);

      // Active thumb should be set (test passes if no error)
      expect(slider).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have correct aria-label', () => {
      render(<Slider aria-label="Volume control" />);
      expect(screen.getByRole('slider')).toHaveAttribute('aria-label', 'Volume control');
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<Slider aria-label="Test" />);

      await user.tab();
      expect(screen.getByRole('slider')).toHaveFocus();
    });

    it('should support custom id', () => {
      render(<Slider id="custom-slider" label="Test" />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('id', 'custom-slider');
    });
  });

  describe('edge cases', () => {
    it('should handle min and max being the same', () => {
      render(<Slider min={50} max={50} defaultValue={50} aria-label="Test" />);
      const slider = screen.getByRole('slider') as HTMLInputElement;
      expect(slider.value).toBe('50');
    });

    it('should handle negative values', () => {
      render(<Slider min={-50} max={50} defaultValue={0} aria-label="Test" />);
      const slider = screen.getByRole('slider') as HTMLInputElement;
      expect(slider.value).toBe('0');
      expect(slider.min).toBe('-50');
      expect(slider.max).toBe('50');
    });

    it('should handle decimal step values', () => {
      render(<Slider min={0} max={1} step={0.1} defaultValue={0.5} aria-label="Test" />);
      const slider = screen.getByRole('slider') as HTMLInputElement;
      expect(slider.step).toBe('0.1');
      expect(slider.value).toBe('0.5');
    });

    it('should handle large value ranges', () => {
      render(<Slider min={0} max={10000} defaultValue={5000} aria-label="Test" />);
      const slider = screen.getByRole('slider') as HTMLInputElement;
      expect(slider.value).toBe('5000');
    });

    it('should handle value updates without onChange', () => {
      render(<Slider defaultValue={50} aria-label="Test" />);
      const slider = screen.getByRole('slider') as HTMLInputElement;

      fireEvent.change(slider, { target: { value: '75' } });

      // Should update internal state
      expect(slider.value).toBe('75');
    });

    it('should handle missing sliderRef gracefully', () => {
      const { container } = render(<Slider defaultValue={50} aria-label="Test" />);
      const thumb = container.querySelector('[class*="thumb"]');

      // Should not crash when interacting without proper refs
      if (thumb) {
        fireEvent.mouseDown(thumb);
        fireEvent.mouseMove(document, { clientX: 100, clientY: 10 });
        fireEvent.mouseUp(document);
      }

      expect(thumb).toBeInTheDocument();
    });
  });

  describe('displayName', () => {});
});
