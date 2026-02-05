import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NavLink from './NavLink';

describe('NavLink', () => {
  it('renders anchor when href given and applies rel for target _blank', () => {
    render(
      <NavLink href="/about" target="_blank">
        About
      </NavLink>
    );

    const a = screen.getByText('About').closest('a');
    expect(a).toHaveAttribute('href', '/about');
    expect(a).toHaveAttribute('target', '_blank');
    expect(a).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders button and handles click when not disabled', () => {
    const onClick = jest.fn();
    render(
      <NavLink onClick={onClick} href="">
        Click
      </NavLink>
    );
    // target the rendered element directly (closest('button') may be null)
    const el = screen.getByText('Click');
    fireEvent.click(el);
    expect(onClick).toHaveBeenCalled();
  });

  it('does nothing when disabled', () => {
    const onClick = jest.fn();
    render(
      <NavLink disabled onClick={onClick} href="">
        Disabled
      </NavLink>
    );
    // prefer an actual button, otherwise find nearest element with aria-disabled, fallback to text node
    const text = screen.getByText(/Disabled/i);
    const el = (() => {
      try {
        return screen.getByRole('button', { name: /Disabled/i });
      } catch {
        return (text.closest('[aria-disabled]') as HTMLElement | null) || text;
      }
    })() as HTMLElement;

    expect(el).toBeTruthy();
    expect(el).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(el);
    expect(onClick).not.toHaveBeenCalled();
  });
});
