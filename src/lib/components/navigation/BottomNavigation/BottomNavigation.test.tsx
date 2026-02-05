import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BottomNavigation, BottomNavigationItem } from './index';

describe('BottomNavigation', () => {
  it('renders items and handles selection (uncontrolled)', () => {
    const onChange = jest.fn();

    render(
      <BottomNavigation defaultValue="home" onChange={onChange}>
        <BottomNavigationItem value="home" label="Home" icon="home" />
        <BottomNavigationItem value="search" label="Search" icon="search" />
      </BottomNavigation>
    );

    // Home should be selected initially
    const home = screen.getByText('Home').closest('[data-component="bottom-navigation-item"]');
    expect(home).toHaveAttribute('data-selected', 'true');

    // Click search
    const search = screen.getByText('Search').closest('[data-component="bottom-navigation-item"]');
    fireEvent.click(search as Element);

    expect(onChange).toHaveBeenCalledWith('search');

    // After clicking, search should be selected
    expect(search).toHaveAttribute('data-selected', 'true');
  });

  it('renders anchor when href provided and not disabled', () => {
    render(
      <BottomNavigation>
        <BottomNavigationItem value="profile" label="Profile" icon="user" href="/profile" />
      </BottomNavigation>
    );

    const anchor = screen.getByText('Profile').closest('a');
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveAttribute('href', '/profile');
  });

  it('prevents action when disabled', () => {
    const onChange = jest.fn();
    const handleClick = jest.fn();

    render(
      <BottomNavigation onChange={onChange}>
        <BottomNavigationItem value="x" label="X" icon="user" onClick={handleClick} disabled />
      </BottomNavigation>
    );

    const btn = screen.getByText('X').closest('button');
    fireEvent.click(btn as Element);

    expect(onChange).not.toHaveBeenCalled();
    expect(handleClick).not.toHaveBeenCalled();
  });
});
