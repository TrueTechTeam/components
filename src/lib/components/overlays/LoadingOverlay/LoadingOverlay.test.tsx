import { render, screen, within } from '@testing-library/react';
import { LoadingOverlay } from './LoadingOverlay';
import React from 'react';

describe('LoadingOverlay', () => {
  it('renders container mode with children and overlay content when visible', () => {
    render(
      <LoadingOverlay visible message="Loading...">
        <div>Child content</div>
      </LoadingOverlay>
    );

    expect(screen.getByText('Child content')).toBeInTheDocument();

    const wrapper = screen.getByTestId('loading-overlay');
    expect(wrapper).toHaveAttribute('data-mode', 'container');
    expect(wrapper).toHaveAttribute('aria-busy', 'true');

    const backdrop = wrapper.querySelector('[data-visible]');
    expect(backdrop).toHaveAttribute('data-visible', 'true');
    // Narrow to the message DIV to avoid matching spinner aria-labels
    expect(
      within(backdrop as Element).getByText('Loading...', { selector: 'div' })
    ).toBeInTheDocument();
  });

  it('renders container mode overlay but not busy when visible is false', () => {
    render(
      <LoadingOverlay visible={false} message="Not loading">
        <span>Child</span>
      </LoadingOverlay>
    );

    const wrapper = screen.getByTestId('loading-overlay');
    expect(wrapper).toHaveAttribute('data-mode', 'container');
    // aria-busy should reflect the visible prop
    expect(wrapper).toHaveAttribute('aria-busy', 'false');

    const backdrop = wrapper.querySelector('[data-visible]');
    expect(backdrop).toHaveAttribute('data-visible', 'false');
    // Narrow to the message DIV to avoid matching spinner aria-labels
    expect(
      within(backdrop as Element).getByText('Not loading', { selector: 'div' })
    ).toBeInTheDocument();
  });

  it('renders fullscreen mode only when visible and applies style props and custom spinner', () => {
    render(
      <LoadingOverlay
        visible
        mode="fullscreen"
        message="Full"
        blur
        backdropOpacity={0.3}
        transitionDuration={300}
        zIndex={1000}
        borderRadius={8}
        customSpinner={<div data-testid="custom-spinner" />}
      />
    );

    const wrapper = screen.getByTestId('loading-overlay');
    expect(wrapper).toHaveAttribute('data-mode', 'fullscreen');

    const backdrop = wrapper.querySelector('[data-visible]');
    expect(backdrop).toHaveAttribute('data-visible', 'true');
    expect(backdrop).toHaveAttribute('data-blur');

    // CSS variables and inline styles
    expect((backdrop as HTMLElement).style.getPropertyValue('--backdrop-opacity')).toBe('0.3');
    expect((backdrop as HTMLElement).style.getPropertyValue('--transition-duration')).toBe('300ms');
    expect((backdrop as HTMLElement).style.zIndex).toBe('1000');
    expect((backdrop as HTMLElement).style.borderRadius).toBe('8px');

    expect(within(backdrop as Element).getByTestId('custom-spinner')).toBeInTheDocument();
  });

  it('does not render in fullscreen mode when not visible', () => {
    render(<LoadingOverlay mode="fullscreen" visible={false} />);
    expect(screen.queryByTestId('loading-overlay')).not.toBeInTheDocument();
  });

  it('supports custom data-testid and className', () => {
    render(<LoadingOverlay data-testid="my-overlay" className="custom-class" visible />);
    const el = screen.getByTestId('my-overlay');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('custom-class');
  });
});
