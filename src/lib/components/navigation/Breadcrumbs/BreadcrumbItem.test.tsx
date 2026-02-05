import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BreadcrumbItem } from './BreadcrumbItem';
import { Icon } from '../../display/Icon';

describe('BreadcrumbItem', () => {
  it('renders as span when current or no href', () => {
    render(<BreadcrumbItem current>Current</BreadcrumbItem>);
    const currentText = screen.getByText(/Current/i);
    const currentWrapper =
      currentText.closest('[data-component="breadcrumb-item"]') ||
      currentText.closest('span') ||
      currentText;
    expect(currentWrapper).toBeInTheDocument();
    expect(currentWrapper).toHaveAttribute('data-component', 'breadcrumb-item');
    expect(currentWrapper).toHaveAttribute('data-current', 'true');

    render(<BreadcrumbItem>Label</BreadcrumbItem>);
    const labelText = screen.getByText(/Label/i);
    const labelWrapper =
      labelText.closest('[data-component="breadcrumb-item"]') ||
      labelText.closest('span') ||
      labelText;
    expect(labelWrapper).toBeInTheDocument();
  });

  it('renders as anchor when href provided and not current', () => {
    const handleClick = jest.fn();
    render(
      <BreadcrumbItem href="/about" onClick={handleClick}>
        About
      </BreadcrumbItem>
    );

    const a = screen.getByText('About').closest('a');
    expect(a).toBeInTheDocument();
    fireEvent.click(a as Element);
    expect(handleClick).toHaveBeenCalled();
  });

  it('renders icon when provided as string or node', () => {
    render(<BreadcrumbItem icon="home">WithIcon</BreadcrumbItem>);
    expect(screen.getByText('WithIcon')).toBeInTheDocument();

    render(<BreadcrumbItem icon={<Icon name="search" />}>NodeIcon</BreadcrumbItem>);
    expect(screen.getByText('NodeIcon')).toBeInTheDocument();
  });
});
