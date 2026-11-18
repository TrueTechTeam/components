import React from 'react';
import { render, screen } from '@testing-library/react';
import { ContrastReport } from './ContrastReport';

describe('ContrastReport', () => {
  it('truncates ratios to two decimals so a near-miss never reads as passing', () => {
    // 777777 on white is 4.478:1, which toFixed(1) would round up to "4.5".
    render(
      <ContrastReport
        colors={{ textSecondary: '#777777', backgroundPrimary: '#ffffff' }}
        mode="light"
        dispatch={jest.fn()}
      />
    );
    expect(
      screen.getByText('textSecondary on backgroundPrimary: 4.47:1 (needs 4.5:1)')
    ).toBeInTheDocument();
  });
});
