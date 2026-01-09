import { render, screen } from '@testing-library/react';
import { Slider } from './Slider';

describe('Slider', () => {
  it('should render', () => {
    render(<Slider aria-label="Test slider" />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<Slider label="Volume" />);
    expect(screen.getByText('Volume')).toBeInTheDocument();
  });

  it('should respect min and max', () => {
    render(<Slider min={0} max={100} defaultValue={50} />);
    const slider = screen.getByRole('slider') as HTMLInputElement;
    expect(slider.min).toBe('0');
    expect(slider.max).toBe('100');
    expect(slider.value).toBe('50');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Slider disabled />);
    expect(screen.getByRole('slider')).toBeDisabled();
  });
});
