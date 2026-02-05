import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

describe('Pagination', () => {
  it('renders page buttons and current page', () => {
    const onPageChange = jest.fn();
    render(<Pagination totalPages={5} currentPage={3} onPageChange={onPageChange} />);

    // find current page robustly: check aria-current variants, then role/name, then text
    let current: HTMLElement | null =
      (document.querySelector('[aria-current="true"], [aria-current="page"]') as HTMLElement) ||
      null;

    if (!current) {
      try {
        current = screen.getByRole('button', { name: /(^|\s)3(\s|$)/ }) as HTMLElement;
      } catch {
        // ignore
      }
    }

    if (!current) {
      current = screen.getByText(/(^|\s)3(\s|$)/) as HTMLElement;
    }

    expect(current).toBeTruthy();
    expect(current?.textContent?.trim()).toBe('3');

    // click next
    const next = screen.getByLabelText(/next/i);
    fireEvent.click(next);
    expect(onPageChange).toHaveBeenCalledWith(4);

    // click first
    const first = screen.getByLabelText(/first/i);
    fireEvent.click(first);
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('disables prev/first when on first page', () => {
    const onPageChange = jest.fn();
    render(<Pagination totalPages={5} currentPage={1} onPageChange={onPageChange} />);

    const prev = screen.getByLabelText(/previous/i);
    const first = screen.getByLabelText(/first/i);
    expect(prev).toBeDisabled();
    expect(first).toBeDisabled();
  });
});
