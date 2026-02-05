import React from 'react';
import { render, screen } from '@testing-library/react';
import { MenuGroup } from './MenuGroup';

describe('MenuGroup', () => {
  it('renders label and children', () => {
    render(
      <MenuGroup label="Group Label">
        <div>Child</div>
      </MenuGroup>
    );
    const el = screen.getByRole('group');
    expect(el).toHaveAttribute('aria-label', 'Group Label');
    expect(screen.getByText('Child')).toBeInTheDocument();
    expect(screen.getByText('Group Label')).toBeInTheDocument();
  });

  it('supports custom data-testid and className', () => {
    render(
      <MenuGroup data-testid="grp" className="my-class">
        <div>Child</div>
      </MenuGroup>
    );
    expect(screen.getByTestId('grp')).toHaveClass('my-class');
  });
});
